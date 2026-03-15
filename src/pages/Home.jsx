import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'

const WORDS_OF_DAY = [
  { hindi: 'पानी',   roman: 'paani',   meaning: 'Water',   emoji: '💧' },
  { hindi: 'सूरज',   roman: 'suraj',   meaning: 'Sun',     emoji: '☀️' },
  { hindi: 'चाँद',   roman: 'chaand',  meaning: 'Moon',    emoji: '🌙' },
  { hindi: 'फूल',    roman: 'phool',   meaning: 'Flower',  emoji: '🌸' },
  { hindi: 'आम',    roman: 'aam',     meaning: 'Mango',   emoji: '🥭' },
  { hindi: 'हाथी',   roman: 'haathi',  meaning: 'Elephant',emoji: '🐘' },
  { hindi: 'किताब',  roman: 'kitaab',  meaning: 'Book',    emoji: '📚' },
]

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'; u.rate = 0.85
  window.speechSynthesis.speak(u)
}

const todayWord = WORDS_OF_DAY[new Date().getDay() % WORDS_OF_DAY.length]

const AGE_GROUPS = [
  { id: 'A', label: '3–5 Years', emoji: '🌱', desc: 'Pre-readers • Letters & Sounds', color: '#4CAF50' },
  { id: 'B', label: '6–8 Years', emoji: '⭐', desc: 'Early readers • Words & Stories', color: '#2196F3' },
  { id: 'C', label: '9–11 Years', emoji: '🚀', desc: 'Building fluency • Sentences', color: '#9C27B0' },
]

const MODULES = [
  { path: '/alphabet',   emoji: '🔤', title: 'Alphabet Fun',    desc: 'Learn all Hindi letters with sounds',  color: '#FF6B6B', award: 5  },
  { path: '/vocabulary', emoji: '📚', title: 'Word World',      desc: 'Animals, food, colors & family',       color: '#4ECDC4', award: 5  },
  { path: '/games',      emoji: '🎮', title: 'Mini Games',      desc: 'Match, quiz & spell challenges',       color: '#FFD93D', award: 10 },
  { path: '/stories',    emoji: '📖', title: 'Stories & Rhymes',desc: 'Listen, read & speak along',           color: '#A8E6CF', award: 8  },
  { path: '/progress',   emoji: '🏆', title: 'My Progress',     desc: 'Stars, badges & achievements',         color: '#C9B1FF', award: 0  },
]

export default function Home() {
  const { ageGroup, setAgeGroup, stars, streak, completed } = useApp()
  const navigate = useNavigate()

  if (!ageGroup) {
    return (
      <Layout>
        <div className="age-picker-screen">
          <div className="mascot-area">
            <div className="mascot">🦚</div>
            <h1 className="welcome-title">नमस्ते! Hello!</h1>
            <p className="welcome-sub">
              I&apos;m <strong>Moru</strong>, your Hindi learning friend!<br />
              Pick your age group to begin 👇
            </p>
          </div>
          <div className="age-grid">
            {AGE_GROUPS.map(g => (
              <button
                key={g.id}
                className="age-card"
                style={{ '--card-color': g.color }}
                onClick={() => setAgeGroup(g.id)}
              >
                <span className="age-emoji">{g.emoji}</span>
                <span className="age-label">{g.label}</span>
                <span className="age-desc">{g.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const currentGroup = AGE_GROUPS.find(g => g.id === ageGroup)

  return (
    <Layout>
      <div className="home-screen">
        {/* Hero banner */}
        <div className="home-hero">
          <span className="hero-mascot">🦚</span>
          <div className="hero-text">
            <h1 className="hero-title">नमस्ते! Let&apos;s Learn Hindi!</h1>
            <p className="hero-sub">
              Welcome back, <strong>{currentGroup?.emoji} {currentGroup?.label}</strong> explorer!&nbsp;
              You have <strong>{stars} ⭐</strong> and a <strong>{streak}‑day 🔥 streak!</strong>
            </p>
          </div>
          <button className="change-age-btn" onClick={() => setAgeGroup('')}>
            Change Age
          </button>
        </div>

        {/* Daily tip */}
        <div className="daily-tip">
          💡 <strong>Word of the day:</strong>&nbsp;
          <span className="hindi-word">{todayWord.hindi}</span>&nbsp;
          <span className="tip-meaning">= {todayWord.meaning} {todayWord.emoji}</span>
          <button
            className="btn btn-sm"
            style={{ marginLeft: 12 }}
            onClick={() => speak(todayWord.hindi)}
          >🔊 Hear it</button>
        </div>

        {/* Module cards */}
        <div className="modules-grid">
          {MODULES.map(m => {
            const doneCount = completed.filter(c => c.startsWith(m.path.slice(1))).length
            return (
              <button
                key={m.path}
                className="module-card"
                style={{ '--mod-color': m.color }}
                onClick={() => navigate(m.path)}
              >
                <span className="module-emoji">{m.emoji}</span>
                <span className="module-title">{m.title}</span>
                <span className="module-desc">{m.desc}</span>
                {m.award > 0 && <span className="module-stars">+{m.award} ⭐ per lesson</span>}
                {doneCount > 0 && <span className="module-done">✅ {doneCount} done</span>}
              </button>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
