import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

/* ── Difficulty word pools ────────────────────────────────── */
// easy = common 3-5 letter words, medium = all, hard = longer/similar words
const EASY_POOL = [
  { hindi: 'कुत्ता', english: 'Dog',    emoji: '🐕' },
  { hindi: 'बिल्ली', english: 'Cat',    emoji: '🐱' },
  { hindi: 'आम',    english: 'Mango',  emoji: '🥭' },
  { hindi: 'पानी',  english: 'Water',  emoji: '💧' },
  { hindi: 'लाल',   english: 'Red',    emoji: '🔴' },
  { hindi: 'माँ',   english: 'Mother', emoji: '👩' },
  { hindi: 'घर',   english: 'House',  emoji: '🏠' },
  { hindi: 'फूल',   english: 'Flower', emoji: '🌸' },
]
const HARD_POOL = [
  { hindi: 'हाथी',  english: 'Elephant', emoji: '🐘' },
  { hindi: 'चाँद',  english: 'Moon',     emoji: '🌙' },
  { hindi: 'सूरज',  english: 'Sun',      emoji: '☀️' },
  { hindi: 'बंदर',  english: 'Monkey',   emoji: '🐵' },
  { hindi: 'तितली', english: 'Butterfly',emoji: '🦋' },
  { hindi: 'आकाश',  english: 'Sky',      emoji: '🌤️' },
  { hindi: 'किताब', english: 'Book',     emoji: '📚' },
  { hindi: 'पहाड़',  english: 'Mountain', emoji: '⛰️' },
]

const VERB_POOL = [
  { hindi: 'खाना',   english: 'To Eat',   emoji: '🍽️' },
  { hindi: 'पीना',   english: 'To Drink', emoji: '💧' },
  { hindi: 'जाना',   english: 'To Go',    emoji: '🚶' },
  { hindi: 'आना',    english: 'To Come',  emoji: '👋' },
  { hindi: 'सोना',   english: 'To Sleep', emoji: '😴' },
  { hindi: 'खेलना',  english: 'To Play',  emoji: '🎮' },
  { hindi: 'पढ़ना',  english: 'To Study', emoji: '📖' },
  { hindi: 'लिखना',  english: 'To Write', emoji: '✍️' },
]

/* ── Shared word pool ─────────────────────────────────────── */
const WORD_POOL = [
  { hindi: 'कुत्ता', english: 'Dog',      emoji: '🐕' },
  { hindi: 'बिल्ली', english: 'Cat',      emoji: '🐱' },
  { hindi: 'हाथी',   english: 'Elephant', emoji: '🐘' },
  { hindi: 'आम',    english: 'Mango',    emoji: '🥭' },
  { hindi: 'पानी',   english: 'Water',    emoji: '💧' },
  { hindi: 'लाल',    english: 'Red',      emoji: '🔴' },
  { hindi: 'नीला',   english: 'Blue',     emoji: '🔵' },
  { hindi: 'माँ',    english: 'Mother',   emoji: '👩' },
  { hindi: 'घर',    english: 'House',    emoji: '🏠' },
  { hindi: 'फूल',    english: 'Flower',   emoji: '🌸' },
  { hindi: 'चाँद',   english: 'Moon',     emoji: '🌙' },
  { hindi: 'सूरज',   english: 'Sun',      emoji: '☀️' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function speak(text, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

/* ── Game 1: Word Quiz (adaptive difficulty) ─────────────── */
const DIFF_LABELS  = ['🌱 Easy', '⭐ Medium', '🚀 Hard']
const DIFF_COLORS  = ['#4CAF50',  '#2196F3',   '#9C27B0']

function WordQuiz({ onScore }) {
  const { quizDifficulty, recordQuizAnswer, showCelebration, ageGroup } = useApp()

  // build pool based on age group (with adaptive difficulty inside Group B)
  const pool = useState(() => {
    if (ageGroup === 'A') return shuffle(EASY_POOL)
    if (ageGroup === 'C') return shuffle([...HARD_POOL, ...VERB_POOL])
    if (quizDifficulty === 0) return shuffle(EASY_POOL)
    if (quizDifficulty === 2) return shuffle([...WORD_POOL, ...HARD_POOL])
    return shuffle(WORD_POOL)
  })[0]

  const [idx, setIdx]           = useState(0)
  const [choices, setChoices]   = useState([])
  const [selected, setSelected] = useState(null)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)

  const buildChoices = useCallback((i, p) => {
    const correct = p[i]
    const distractors = shuffle(p.filter((_, j) => j !== i)).slice(0, 3)
    return shuffle([correct, ...distractors])
  }, [])

  useEffect(() => {
    setChoices(buildChoices(idx, pool))
    setSelected(null)
  }, [idx, pool, buildChoices])

  if (done) {
    return (
      <div className="game-result">
        <div className="result-emoji">🎉</div>
        <h2>Quiz Complete!</h2>
        <p>You scored <strong>{score} / {pool.length}</strong> ⭐</p>
        <p className="quiz-diff-badge" style={{ color: DIFF_COLORS[quizDifficulty] }}>
          {DIFF_LABELS[quizDifficulty]} mode
        </p>
        <button className="btn btn-primary" onClick={() => { setIdx(0); setScore(0); setDone(false); onScore(score) }}>
          Play Again
        </button>
      </div>
    )
  }

  const current = pool[idx]
  const handleChoice = (word) => {
    if (selected) return
    setSelected(word.hindi)
    const correct = word.hindi === current.hindi
    recordQuizAnswer(correct)
    if (correct) { setScore(s => s + 1); speak(current.hindi) }
    setTimeout(() => {
      if (idx + 1 >= pool.length) {
        setDone(true)
        if (score + (correct ? 1 : 0) === pool.length) showCelebration('Perfect Score! 🏆', 'You got every answer right!')
      } else setIdx(i => i + 1)
    }, 1200)
  }

  return (
    <div className="quiz-game">
      <div className="quiz-progress">
        Question {idx + 1} / {pool.length} &nbsp;⭐ {score}
        &nbsp;&nbsp;
        <span className="quiz-diff-badge" style={{ color: DIFF_COLORS[quizDifficulty] }}>
          {DIFF_LABELS[quizDifficulty]}
        </span>
      </div>
      <div className="quiz-prompt">
        <span className="quiz-emoji">{current.emoji}</span>
        <p className="quiz-question">What is this in Hindi?</p>
        <p className="quiz-english">{current.english}</p>
      </div>
      <div className="quiz-choices">
        {choices.map(w => {
          let cls = 'quiz-btn'
          if (selected) {
            if (w.hindi === current.hindi) cls += ' correct'
            else if (w.hindi === selected) cls += ' wrong'
          }
          return (
            <button key={w.hindi} className={cls} onClick={() => handleChoice(w)}>
              {w.hindi}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Game 2: Match Pairs ──────────────────────────────────── */
function MatchPairs({ onScore }) {
  const { ageGroup } = useApp()
  const agePool = ageGroup === 'A' ? EASY_POOL : ageGroup === 'C' ? [...HARD_POOL, ...VERB_POOL] : WORD_POOL
  const pairs = shuffle(agePool).slice(0, 6)
  const [cards] = useState(() => {
    const left  = pairs.map(p => ({ id: p.hindi + '-h', value: p.hindi, type: 'hindi', pair: p.hindi }))
    const right = pairs.map(p => ({ id: p.hindi + '-e', value: p.english, type: 'english', pair: p.hindi, emoji: p.emoji }))
    return shuffle([...left, ...right])
  })
  const [selected, setSelected] = useState([])
  const [matched, setMatched]   = useState([])
  const [tries, setTries]       = useState(0)

  const done = matched.length === pairs.length

  const handlePick = (card) => {
    if (matched.includes(card.pair)) return
    if (selected.find(c => c.id === card.id)) return
    if (selected.length === 1 && selected[0].type === card.type) return

    const next = [...selected, card]
    if (next.length < 2) { setSelected(next); return }

    setTries(t => t + 1)
    if (next[0].pair === next[1].pair) {
      speak(next[0].pair)
      setMatched(m => [...m, card.pair])
      setSelected([])
    } else {
      setTimeout(() => setSelected([]), 900)
    }
    setSelected(next)
  }

  if (done) {
    return (
      <div className="game-result">
        <div className="result-emoji">🥳</div>
        <h2>All Matched!</h2>
        <p>You did it in <strong>{tries}</strong> tries!</p>
        <button className="btn btn-primary" onClick={() => { onScore(Math.max(0, 12 - tries)); window.location.reload() }}>
          Play Again
        </button>
      </div>
    )
  }

  return (
    <div className="match-game">
      <div className="quiz-progress">Matched: {matched.length} / {pairs.length} &nbsp; Tries: {tries}</div>
      <div className="match-grid">
        {cards.map(card => {
          const isSelected = selected.find(c => c.id === card.id)
          const isMatched  = matched.includes(card.pair)
          return (
            <button
              key={card.id}
              className={'match-card' + (isSelected ? ' selected' : '') + (isMatched ? ' matched' : '')}
              onClick={() => handlePick(card)}
            >
              {card.type === 'english' ? `${card.emoji} ${card.value}` : card.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Game 3: Spell It ─────────────────────────────────────── */
function SpellIt({ onScore }) {
  const { ageGroup } = useApp()
  const agePool = ageGroup === 'A' ? EASY_POOL : ageGroup === 'C' ? [...HARD_POOL, ...VERB_POOL] : WORD_POOL
  const words = shuffle(agePool).slice(0, 5)
  const [idx, setIdx]       = useState(0)
  const [typed, setTyped]   = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore]   = useState(0)
  const [done, setDone]     = useState(false)

  const current = words[idx]

  const check = () => {
    const correct = typed.trim() === current.hindi
    setResult(correct ? 'correct' : 'wrong')
    if (correct) { setScore(s => s + 1); speak(current.hindi) }
    setTimeout(() => {
      if (idx + 1 >= words.length) setDone(true)
      else { setIdx(i => i + 1); setTyped(''); setResult(null) }
    }, 1400)
  }

  if (done) {
    return (
      <div className="game-result">
        <div className="result-emoji">✍️</div>
        <h2>Spelling Done!</h2>
        <p>Score: <strong>{score} / {words.length}</strong></p>
        <button className="btn btn-primary" onClick={() => { setIdx(0); setScore(0); setDone(false); setTyped(''); setResult(null); onScore(score) }}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="spell-game">
      <div className="quiz-progress">Word {idx + 1} / {words.length} &nbsp;⭐ {score}</div>
      <div className="spell-prompt">
        <span className="quiz-emoji">{current.emoji}</span>
        <p className="quiz-english">{current.english}</p>
        <p className="spell-hint">Type the Hindi word below:</p>
      </div>
      <div className="spell-input-row">
        <input
          className={'spell-input' + (result === 'correct' ? ' correct' : result === 'wrong' ? ' wrong' : '')}
          value={typed}
          onChange={e => setTyped(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !result && check()}
          placeholder="Type Hindi here…"
          lang="hi"
          dir="ltr"
        />
        <button className="btn btn-primary" onClick={check} disabled={!!result || !typed}>
          Check ✔
        </button>
      </div>
      {result && (
        <p className={`spell-result ${result}`}>
          {result === 'correct' ? '🎉 Correct!' : `❌ Answer: ${current.hindi}`}
        </p>
      )}
      <button className="btn btn-sm" onClick={() => speak(current.hindi)}>🔊 Hear word</button>
    </div>
  )
}

/* ── Main Games page ──────────────────────────────────────── */
const GAMES = [
  { id: 'quiz',  label: '❓ Word Quiz',   desc: 'See English, pick correct Hindi' },
  { id: 'match', label: '🃏 Match Pairs', desc: 'Match Hindi words to English' },
  { id: 'spell', label: '✍️ Spell It',   desc: 'Type the Hindi word from English' },
]
const GAMES_FOR_AGE = { A: ['quiz', 'match'], B: ['quiz', 'match', 'spell'], C: ['quiz', 'match', 'spell'] }
const GAMES_SUBTITLE = {
  A: '🌱 Match & quiz games — spelling unlocks at age 6+.',
  B: '⭐ Pick a game and earn stars!',
  C: '🚀 Games include verbs & advanced vocabulary!',
}

export default function Games() {
  const [activeGame, setActiveGame] = useState(null)
  const { addStars, showCelebration, ageGroup } = useApp()
  const visibleGames = GAMES.filter(g => (GAMES_FOR_AGE[ageGroup] || GAMES.map(g => g.id)).includes(g.id))

  const handleScore = (n) => { if (n > 0) { addStars(n); showCelebration(`+${n} Stars Earned! ⭐`, 'Keep playing to earn more!') } }

  if (activeGame) {
    return (
      <Layout>
        <div className="page-header">
          <button className="btn btn-sm back-btn" onClick={() => setActiveGame(null)}>← Back to Games</button>
          <h1 className="page-title">{GAMES.find(g => g.id === activeGame)?.label}</h1>
        </div>
        <div className="game-container">
          {activeGame === 'quiz'  && <WordQuiz   onScore={handleScore} />}
          {activeGame === 'match' && <MatchPairs onScore={handleScore} />}
          {activeGame === 'spell' && <SpellIt    onScore={handleScore} />}
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">🎮 Mini Games</h1>
        <p className="page-sub">{GAMES_SUBTITLE[ageGroup] || 'Pick a game and earn stars! ⭐'}</p>
      </div>
      <div className="games-menu">
        {visibleGames.map(g => (
          <button
            key={g.id}
            className="game-menu-card"
            onClick={() => setActiveGame(g.id)}
          >
            <span className="game-menu-emoji">{g.label.split(' ')[0]}</span>
            <span className="game-menu-title">{g.label.slice(2)}</span>
            <span className="game-menu-desc">{g.desc}</span>
          </button>
        ))}
      </div>
    </Layout>
  )
}
