import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import { speak, speakAll } from '../utils/speak'

/* ── Content ──────────────────────────────────────────────── */
const STORIES = [
  {
    id: 'story-1',
    title: 'राम और बगीचा',
    subtitle: 'Ram and the Garden',
    emoji: '🌿',
    sentences: [
      { hindi: 'राम एक छोटा बच्चा है।',          english: 'Ram is a small child.' },
      { hindi: 'वह रोज़ बगीचे में जाता है।',        english: 'He goes to the garden every day.' },
      { hindi: 'बगीचे में बहुत सारे फूल हैं।',     english: 'There are many flowers in the garden.' },
      { hindi: 'राम फूलों को पानी देता है।',       english: 'Ram waters the flowers.' },
      { hindi: 'फूल खुश होते हैं।',               english: 'The flowers are happy.' },
    ],
  },
  {
    id: 'story-2',
    title: 'प्यारी बिल्ली',
    subtitle: 'The Lovely Cat',
    emoji: '🐱',
    sentences: [
      { hindi: 'मेरे घर में एक बिल्ली है।',       english: 'There is a cat in my house.' },
      { hindi: 'उसका नाम मिट्ठू है।',              english: 'Her name is Mitthu.' },
      { hindi: 'मिट्ठू दूध पीती है।',               english: 'Mitthu drinks milk.' },
      { hindi: 'वह खेलना बहुत पसंद करती है।',      english: 'She loves to play.' },
      { hindi: 'मैं उससे बहुत प्यार करता हूँ।',    english: 'I love her very much.' },
    ],
  },
  {
    id: 'story-3',
    title: 'आसमान में तारे',
    subtitle: 'Stars in the Sky',
    emoji: '⭐',
    sentences: [
      { hindi: 'रात को आसमान बहुत सुंदर होता है।', english: 'The sky is very beautiful at night.' },
      { hindi: 'आसमान में बहुत सारे तारे होते हैं।',english: 'There are many stars in the sky.' },
      { hindi: 'चाँद भी चमकता है।',               english: 'The moon also shines.' },
      { hindi: 'मैं तारे गिनता हूँ।',              english: 'I count the stars.' },
      { hindi: 'एक, दो, तीन... बहुत सारे!',       english: 'One, two, three... so many!' },
    ],
  },
]

const RHYMES = [
  {
    id: 'rhyme-1',
    title: 'मछली जल की रानी है',
    subtitle: 'Fish is the Queen of Water',
    emoji: '🐟',
    lines: [
      'मछली जल की रानी है',
      'जीवन उसका पानी है',
      'हाथ लगाओ डर जाएगी',
      'बाहर निकालो मर जाएगी',
    ],
  },
  {
    id: 'rhyme-2',
    title: 'आ री आ निंदिया',
    subtitle: 'Come, O Sleep',
    emoji: '😴',
    lines: [
      'आ री आ निंदिया आ',
      'नन्हे बच्चे को सुला',
      'थक गया है खेल–खेलकर',
      'अब उसको तू सुला जा',
    ],
  },
  {
    id: 'rhyme-3',
    title: 'चंदा मामा',
    subtitle: 'Uncle Moon',
    emoji: '🌙',
    lines: [
      'चंदा मामा दूर के',
      'पुए पकाए बूर के',
      'आप खाएं थाली में',
      'मुन्ने को दें प्याली में',
    ],
  },
]



function StoryCard({ story, onComplete, done }) {
  const [active, setActive] = useState(null)
  const [echoMode, setEchoMode] = useState(false)
  const [echoIdx, setEchoIdx] = useState(0)
  const [echoState, setEchoState] = useState('idle') // idle | speaking | listening | result
  const [echoResult, setEchoResult] = useState(null)

  const startEcho = (i) => {
    setEchoIdx(i)
    setEchoState('speaking')
    setEchoResult(null)
    speak(story.sentences[i].hindi)
    setTimeout(() => setEchoState('listening'), 2200)
  }

  const listenEcho = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setEchoResult({ ok: true, msg: '🎤 Mic not supported – great try anyway!' })
      setEchoState('result')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'hi-IN'
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript.trim()
      const target = story.sentences[echoIdx].hindi
      const ok = said === target || e.results[0][0].confidence > 0.55
      setEchoResult({ ok, msg: ok ? `🎉 Great! You said: "${said}"` : `💬 You said: "${said}" — try again!` })
      setEchoState('result')
    }
    rec.onerror = () => {
      setEchoResult({ ok: true, msg: '🎤 Could not hear clearly – keep practising!' })
      setEchoState('result')
    }
    rec.start()
  }

  return (
    <div className="story-card">
      <div className="story-header">
        <span className="story-emoji">{story.emoji}</span>
        <div>
          <h2 className="story-title">{story.title}</h2>
          <p className="story-subtitle">{story.subtitle}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-primary play-all-btn" onClick={() => speakAll(story.sentences.map(s => s.hindi))}>
            ▶ Play All
          </button>
          <button className={'btn ' + (echoMode ? 'btn-secondary' : 'btn-sm')} onClick={() => setEchoMode(m => !m)}>
            {echoMode ? '✕ Exit Echo' : '🎤 Echo Mode'}
          </button>
        </div>
      </div>

      {echoMode && (
        <div className="echo-panel">
          <p className="echo-info">Echo Mode: tap a sentence number, listen, then repeat it! 🎤</p>
          {echoState === 'speaking'  && <p className="echo-status speaking">🔊 Listen carefully…</p>}
          {echoState === 'listening' && (
            <div style={{ textAlign: 'center' }}>
              <p className="echo-status listening">🎤 Now say it! Tap the mic 👇</p>
              <button className="btn btn-primary" onClick={listenEcho}>🎙️ Speak Now</button>
            </div>
          )}
          {echoState === 'result' && echoResult && (
            <div style={{ textAlign: 'center' }}>
              <p className={'echo-status ' + (echoResult.ok ? 'correct' : 'wrong')}>{echoResult.msg}</p>
              {echoIdx + 1 < story.sentences.length
                ? <button className="btn btn-primary" onClick={() => startEcho(echoIdx + 1)}>Next sentence →</button>
                : <button className="btn btn-green" onClick={() => setEchoState('idle')}>✅ Done!</button>
              }
            </div>
          )}
          {echoState === 'idle' && <p className="echo-idle">👆 Tap a sentence number below to begin</p>}
        </div>
      )}

      <div className="story-sentences">
        {story.sentences.map((s, i) => (
          <div
            key={i}
            className={'story-sentence' + (active === i ? ' active' : '')}
            onClick={() => {
              setActive(i)
              if (echoMode) { startEcho(i) } else { speak(s.hindi) }
            }}
          >
            <span className="sentence-num">{i + 1}</span>
            <div className="sentence-text">
              <p className="sentence-hindi">{s.hindi}</p>
              <p className="sentence-english">{s.english}</p>
            </div>
            <button className="speak-btn" onClick={e => { e.stopPropagation(); speak(s.hindi) }}>🔊</button>
          </div>
        ))}
      </div>
      <button className={'btn btn-green' + (done ? ' done' : '')} onClick={onComplete}>
        {done ? '✅ Completed +8 ⭐' : '✅ Mark Complete (+8 ⭐)'}
      </button>
    </div>
  )
}

function RhymeCard({ rhyme, onComplete, done }) {
  return (
    <div className="story-card">
      <div className="story-header">
        <span className="story-emoji">{rhyme.emoji}</span>
        <div>
          <h2 className="story-title">{rhyme.title}</h2>
          <p className="story-subtitle">{rhyme.subtitle}</p>
        </div>
        <button className="btn btn-primary play-all-btn" onClick={() => speakAll(rhyme.lines)}>
          ▶ Recite
        </button>
      </div>
      <div className="rhyme-lines">
        {rhyme.lines.map((line, i) => (
          <div key={i} className="rhyme-line" onClick={() => speak(line)}>
            <span className="rhyme-text">{line}</span>
            <button className="speak-btn">🔊</button>
          </div>
        ))}
      </div>
      <button className={'btn btn-green' + (done ? ' done' : '')} onClick={onComplete}>
        {done ? '✅ Completed +8 ⭐' : '✅ Mark Complete (+8 ⭐)'}
      </button>
    </div>
  )
}

const ALL_TABS = ['📖 Stories', '🎵 Rhymes']

export default function Stories() {
  const { addStars, markComplete, earnBadge, showCelebration, completed, ageGroup } = useApp()
  // Group A (3–5): rhymes only; B and C: both tabs
  const visibleTabs = ageGroup === 'A' ? ['🎵 Rhymes'] : ALL_TABS
  const [tab, setTab] = useState(0)

  const handleComplete = (id) => {
    if (!completed.includes(id)) {
      addStars(8)
      markComplete(id)
      earnBadge(id)
      showCelebration('Great reading! 📖', '+8 ⭐ earned!')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">📖 Stories & Rhymes</h1>
        <p className="page-sub">
          {ageGroup === 'A' ? '🌱 Listen and sing along — tap any line to hear it!'
            : ageGroup === 'C' ? '🚀 Read, listen & use Echo Mode to practise speaking!'
            : 'Listen, read along, and speak out loud! 🔊'}
        </p>
      </div>

      <div className="tab-bar">
        {visibleTabs.map((t, i) => (
          <button key={t} className={'tab-btn' + (tab === i ? ' active' : '')} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      <div className="stories-list">
        {/* Group A only sees rhymes (tab 0 = rhymes); B and C: tab 0 = stories, tab 1 = rhymes */}
        {(ageGroup === 'A' || tab === 1)
          ? RHYMES.map(r => (
              <RhymeCard
                key={r.id}
                rhyme={r}
                done={completed.includes(r.id)}
                onComplete={() => handleComplete(r.id)}
              />
            ))
          : STORIES.map(s => (
              <StoryCard
                key={s.id}
                story={s}
                done={completed.includes(s.id)}
                onComplete={() => handleComplete(s.id)}
              />
            ))
        }
      </div>
    </Layout>
  )
}
