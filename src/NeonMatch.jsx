import { useEffect, useRef, useState, useCallback } from 'react'

const EMOJI_POOL = [
  '🔥','⚡','💎','🌊','🌙','☀️','🎯','🚀',
  '👾','🎮','🧩','🌀','💀','🔮','🎲','🦋',
  '🌈','🍄','🤖','💥','🧬','🌸','🦄','🎸',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

const DIFFICULTIES = [
  { label: '4×4', cols: 4, pairs: 8 },
  { label: '4×5', cols: 5, pairs: 10 },
  { label: '6×6', cols: 6, pairs: 18 },
]

function buildDeck(pairs) {
  const emojis = shuffle([...EMOJI_POOL]).slice(0, pairs)
  return shuffle([...emojis, ...emojis]).map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false, shake: false,
  }))
}

export default function NeonMatch() {
  const [diffIdx, setDiffIdx] = useState(0)
  const { cols, pairs } = DIFFICULTIES[diffIdx]

  const [deck, setDeck] = useState(() => buildDeck(DIFFICULTIES[0].pairs))
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [victory, setVictory] = useState(false)

  const flippedIds = useRef([])
  const canFlip = useRef(true)
  const timerRef = useRef(null)

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current)
    setRunning(false)
  }, [])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    setSeconds(0)
    setRunning(true)
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
  }, [])

  const initGame = useCallback((pairsCount) => {
    stopTimer()
    setDeck(buildDeck(pairsCount))
    setMoves(0)
    setMatched(0)
    setSeconds(0)
    setVictory(false)
    flippedIds.current = []
    canFlip.current = true
  }, [stopTimer])

  // reinit when difficulty changes
  useEffect(() => { initGame(DIFFICULTIES[diffIdx].pairs) }, [diffIdx, initGame])

  useEffect(() => () => clearInterval(timerRef.current), [])

  function onCardClick(id) {
    if (!canFlip.current) return
    const card = deck.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (flippedIds.current.length >= 2) return

    if (!running && !victory) startTimer()

    const newDeck = deck.map(c => c.id === id ? { ...c, flipped: true } : c)
    setDeck(newDeck)
    flippedIds.current = [...flippedIds.current, id]

    if (flippedIds.current.length === 2) {
      canFlip.current = false
      setMoves(m => m + 1)
      const [aId, bId] = flippedIds.current
      const a = newDeck.find(c => c.id === aId)
      const b = newDeck.find(c => c.id === bId)

      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.id === aId || c.id === bId ? { ...c, matched: true } : c
          ))
          setMatched(m => {
            const next = m + 1
            if (next === pairs) { stopTimer(); setVictory(true) }
            return next
          })
          flippedIds.current = []
          canFlip.current = true
        }, 300)
      } else {
        setTimeout(() => {
          setDeck(d => d.map(c =>
            c.id === aId || c.id === bId ? { ...c, shake: true } : c
          ))
          setTimeout(() => {
            setDeck(d => d.map(c =>
              c.id === aId || c.id === bId
                ? { ...c, flipped: false, shake: false } : c
            ))
            flippedIds.current = []
            canFlip.current = true
          }, 420)
        }, 600)
      }
    }
  }

  const score = Math.max(0, pairs * 100 - Math.floor(seconds / 5) * 5 - Math.max(0, moves - pairs) * 10)
  const maxScore = pairs * 100
  const pct = score / maxScore
  const rating = pct >= 0.85 ? '⚡⚡⚡ LEGENDARY' : pct >= 0.65 ? '🔥🔥 HOT STREAK' : pct >= 0.4 ? '✨ NICE RUN' : '💡 KEEP TRAINING'

  const gridStyle = { gridTemplateColumns: `repeat(${cols}, 1fr)` }

  return (
    <div style={styles.page}>
      <div style={styles.scanlines} />
      <div style={styles.gridBg} />
      <div style={styles.horizon} />

      <div style={styles.wrapper}>
        <header style={{ textAlign: 'center' }}>
          <div style={styles.logo}>NEON MATCH</div>
          <div style={styles.subtitle}>Flip · Match · Conquer</div>
        </header>

        <div style={styles.statsBar}>
          <StatBox label="Time" value={formatTime(seconds)} color="cyan" />
          <StatBox label="Moves" value={moves} color="mag" />
          <StatBox label="Pairs" value={`${matched} / ${pairs}`} color="grn" />
        </div>

        <div style={styles.diffRow}>
          <span style={styles.diffLabel}>Grid:</span>
          {DIFFICULTIES.map((d, i) => (
            <button key={d.label}
              style={{ ...styles.diffBtn, ...(i === diffIdx ? styles.diffActive : {}) }}
              onClick={() => setDiffIdx(i)}
            >{d.label}</button>
          ))}
        </div>

        <div style={{ ...styles.board, ...gridStyle }}>
          {deck.map(card => (
            <div key={card.id} style={styles.cardOuter} onClick={() => onCardClick(card.id)}>
              <div style={{
                ...styles.cardInner,
                transform: (card.flipped || card.matched) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                animation: card.shake ? 'shake 0.4s ease' : 'none',
              }}>
                <div style={styles.cardBack}>
                  <span style={styles.qMark}>?</span>
                </div>
                <div style={{
                  ...styles.cardFront,
                  boxShadow: card.matched ? '0 0 14px rgba(0,255,136,0.5)' : 'none',
                  borderColor: card.matched ? '#00ff88' : '#203080',
                }}>
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.controls}>
          <button style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={() => initGame(pairs)}>New Game</button>
        </div>
      </div>

      {victory && (
        <div style={styles.victoryOverlay}>
          <div style={styles.victoryTitle}>YOU WIN!</div>
          <div style={styles.victorySub}>Memory Grid Cleared</div>
          <div style={styles.victoryRating}>{rating}</div>
          <div style={styles.victoryStats}>
            <VsStat label="Time" value={formatTime(seconds)} />
            <VsStat label="Moves" value={moves} />
            <VsStat label="Score" value={score} />
          </div>
          <button style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={() => initGame(pairs)}>Play Again</button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes shake {
          0%,100% { transform: rotateY(180deg) translateX(0); }
          25%      { transform: rotateY(180deg) translateX(-5px); }
          75%      { transform: rotateY(180deg) translateX(5px); }
        }
        @keyframes victoryPop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

function StatBox({ label, value, color }) {
  const colors = { cyan: '#00f5ff', mag: '#ff00c8', grn: '#00ff88' }
  const c = colors[color]
  return (
    <div style={{ ...styles.statBox, borderTop: `2px solid ${c}` }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: c, textShadow: `0 0 8px ${c}` }}>{value}</div>
    </div>
  )
}

function VsStat({ label, value }) {
  return (
    <div style={styles.vsStat}>
      <span style={styles.vsLbl}>{label}</span>
      <span style={styles.vsVal}>{value}</span>
    </div>
  )
}

const styles = {
  page: {
    background: '#05060f',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    fontFamily: "'Share Tech Mono', monospace",
    color: '#fff',
    overflowX: 'hidden',
  },
  scanlines: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100,
    background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)',
  },
  gridBg: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.04) 1px,transparent 1px)',
    backgroundSize: '40px 40px',
  },
  horizon: {
    position: 'fixed', bottom: 0, left: 0, right: 0, height: 220,
    background: 'radial-gradient(ellipse 80% 100% at 50% 120%,rgba(255,0,200,0.18) 0%,transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  wrapper: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: 740,
    padding: '24px 16px 40px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 20,
  },
  logo: {
    fontFamily: "'Orbitron',sans-serif", fontWeight: 900,
    fontSize: 'clamp(2rem,8vw,3.4rem)', letterSpacing: '0.12em',
    background: 'linear-gradient(90deg,#00f5ff,#ff00c8)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.5))',
  },
  subtitle: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 },
  statsBar: { display: 'flex', gap: 12, width: '100%', justifyContent: 'center', flexWrap: 'wrap' },
  statBox: { background: '#0a0d1f', border: '1px solid #1a2460', borderRadius: 6, padding: '8px 20px', textAlign: 'center', minWidth: 110 },
  statLabel: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.25em', textTransform: 'uppercase' },
  statValue: { fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', fontWeight: 700, marginTop: 2 },
  diffRow: { display: 'flex', gap: 8, alignItems: 'center' },
  diffLabel: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' },
  diffBtn: { background: 'transparent', border: '1px solid #1a2460', color: 'rgba(255,255,255,0.4)', fontFamily: "'Share Tech Mono',monospace", fontSize: '0.7rem', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', textTransform: 'uppercase' },
  diffActive: { borderColor: '#00f5ff', color: '#00f5ff', background: 'rgba(0,245,255,0.08)', boxShadow: '0 0 8px rgba(0,245,255,0.3)' },
  board: { display: 'grid', gap: 10, width: '100%' },
  cardOuter: { aspectRatio: '1', perspective: 600, cursor: 'pointer' },
  cardInner: { width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)', borderRadius: 10 },
  cardBack: { position: 'absolute', inset: 0, borderRadius: 10, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1230', border: '1px solid #1a2460' },
  qMark: { fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.2rem,4vw,1.8rem)', fontWeight: 900, color: 'rgba(0,245,255,0.25)' },
  cardFront: { position: 'absolute', inset: 0, borderRadius: 10, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.6rem,5vw,2.4rem)', background: '#0c1535', border: '1px solid #203080', transform: 'rotateY(180deg)', transition: 'border-color 0.3s, box-shadow 0.3s' },
  controls: { display: 'flex', gap: 12 },
  btn: { fontFamily: "'Orbitron',sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 24px', borderRadius: 6, border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  btnPrimary: { background: 'linear-gradient(135deg,#00f5ff,#0088ff)', color: '#000', boxShadow: '0 0 20px rgba(0,245,255,0.35)' },
  victoryOverlay: { position: 'fixed', inset: 0, background: 'rgba(5,6,15,0.92)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 20 },
  victoryTitle: { fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(2.5rem,10vw,5rem)', fontWeight: 900, background: 'linear-gradient(90deg,#ffe600,#ff00c8,#00f5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'victoryPop 0.6s cubic-bezier(0.17,0.67,0.3,1.3) both' },
  victorySub: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' },
  victoryRating: { fontSize: 'clamp(1.5rem,5vw,2rem)', margin: '4px 0', animation: 'float 2s ease-in-out infinite' },
  victoryStats: { display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', margin: '8px 0' },
  vsStat: { background: '#0a0d1f', border: '1px solid #1a2460', padding: '10px 22px', borderRadius: 6, fontFamily: "'Orbitron',sans-serif", display: 'flex', flexDirection: 'column' },
  vsLbl: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', marginBottom: 4, textTransform: 'uppercase' },
  vsVal: { fontSize: '1.3rem', fontWeight: 700, color: '#ffe600', textShadow: '0 0 10px rgba(255,230,0,0.5)' },
}
