import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import { speak } from '../utils/speak'

const WORDS_OF_DAY = [
  { hindi: 'पानी',   roman: 'paani',   meaning: 'Water',   emoji: '💧' },
  { hindi: 'सूरज',   roman: 'suraj',   meaning: 'Sun',     emoji: '☀️' },
  { hindi: 'चाँद',   roman: 'chaand',  meaning: 'Moon',    emoji: '🌙' },
  { hindi: 'फूल',    roman: 'phool',   meaning: 'Flower',  emoji: '🌸' },
  { hindi: 'आम',    roman: 'aam',     meaning: 'Mango',   emoji: '🥭' },
  { hindi: 'हाथी',   roman: 'haathi',  meaning: 'Elephant',emoji: '🐘' },
  { hindi: 'किताब',  roman: 'kitaab',  meaning: 'Book',    emoji: '📚' },
]



const todayWord = WORDS_OF_DAY[new Date().getDay() % WORDS_OF_DAY.length]

const LEVELS = [
  { id: '1', label: 'Level 1', name: 'Starter',  emoji: '🌱', desc: 'Vowels · Basic Colors & Animals',    color: '#4CAF50' },
  { id: '2', label: 'Level 2', name: 'Explorer', emoji: '🌿', desc: 'All Vowels · Animals & Food',        color: '#8BC34A' },
  { id: '3', label: 'Level 3', name: 'Learner',  emoji: '⭐', desc: 'Consonants · Body Parts & Family',  color: '#2196F3' },
  { id: '4', label: 'Level 4', name: 'Builder',  emoji: '🚀', desc: 'Matras · Verbs, Numbers & More',    color: '#9C27B0' },
  { id: '5', label: 'Level 5', name: 'Master',   emoji: '💎', desc: 'All Letters · Full Vocabulary',     color: '#FF6B6B' },
]

const MODULES = [
  { path: '/alphabet',   emoji: '🔤', title: 'Alphabet Fun',    desc: 'Learn all Hindi letters with sounds',  color: '#FF6B6B', award: 5  },
  { path: '/vocabulary', emoji: '📚', title: 'Word World',      desc: 'Animals, food, colors & family',       color: '#4ECDC4', award: 5  },
  { path: '/phrases',         emoji: '💬', title: 'Phrases & Talk',    desc: 'Everyday phrases & conversations',      color: '#4D96FF', award: 5  },
  { path: '/parts-of-speech', emoji: '📖', title: 'Parts of Speech',  desc: 'Verbs, adjectives, pronouns & more',    color: '#9C27B0', award: 5  },
  { path: '/games',      emoji: '🎮', title: 'Mini Games',      desc: 'Match, quiz & spell challenges',       color: '#FFD93D', award: 10 },
  { path: '/stories',    emoji: '📖', title: 'Stories & Rhymes',desc: 'Listen, read & speak along',           color: '#A8E6CF', award: 8  },
  { path: '/progress',   emoji: '🏆', title: 'My Progress',     desc: 'Stars, badges & achievements',         color: '#C9B1FF', award: 0  },
]

export default function Home() {
  const { level, setLevel, stars, streak, completed } = useApp()
  const navigate = useNavigate()

  if (!level) {
    return (
      <Layout>
        <div className="age-picker-screen">
          <div className="mascot-area">
            <div className="mascot">🦚</div>
            <h1 className="welcome-title">नमस्ते! Hello!</h1>
            <p className="welcome-sub">
              I&apos;m <strong>Moru</strong>, your Hindi learning friend!<br />
              Pick your starting level to begin 👇
            </p>
          </div>
          <div className="age-grid">
            {LEVELS.map(lv => (
              <button
                key={lv.id}
                className="age-card"
                style={{ '--card-color': lv.color }}
                onClick={() => setLevel(lv.id)}
              >
                <span className="age-emoji">{lv.emoji}</span>
                <span className="age-label">{lv.label} — {lv.name}</span>
                <span className="age-desc">{lv.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const currentLevel = LEVELS.find(lv => lv.id === level) || LEVELS[0]

  return (
    <Layout>
      <div className="home-screen">
        {/* Hero banner */}
        <div className="home-hero">
          <span className="hero-mascot">🦚</span>
          <div className="hero-text">
            <h1 className="hero-title">नमस्ते! Let&apos;s Learn Hindi!</h1>
            <p className="hero-sub">
              Welcome back, <strong>{currentLevel.emoji} {currentLevel.label} — {currentLevel.name}</strong> explorer!&nbsp;
              You have <strong>{stars} ⭐</strong> and a <strong>{streak}‑day 🔥 streak!</strong>
            </p>
          </div>
          <button className="change-age-btn" onClick={() => setLevel('')}>
            Change Level
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
