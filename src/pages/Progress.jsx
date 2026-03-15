import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

const ALL_BADGES = [
  { id: 'alphabet-0', emoji: '🔤', label: 'Vowel Explorer',     desc: 'Completed Vowels lesson'      },
  { id: 'alphabet-1', emoji: '📝', label: 'Consonant Hero',     desc: 'Completed Consonants lesson'  },
  { id: 'alphabet-2', emoji: '🔠', label: 'Matra Master',       desc: 'Completed Matras lesson'      },
  { id: 'vocab-animals', emoji: '🐾', label: 'Animal Whisperer', desc: 'Completed Animals theme'     },
  { id: 'vocab-food',    emoji: '🍎', label: 'Foodie',           desc: 'Completed Food theme'        },
  { id: 'vocab-colors',  emoji: '🎨', label: 'Color Artist',     desc: 'Completed Colors theme'      },
  { id: 'vocab-family',  emoji: '👨‍👩‍👧', label: 'Family Bond',   desc: 'Completed Family theme'     },
  { id: 'vocab-body',    emoji: '🫀', label: 'Body Smart',       desc: 'Completed Body theme'        },
  { id: 'story-1',      emoji: '🌿', label: 'Garden Reader',    desc: 'Completed Ram & Garden story' },
  { id: 'story-2',      emoji: '🐱', label: 'Cat Lover',        desc: 'Completed Lovely Cat story'  },
  { id: 'story-3',      emoji: '⭐', label: 'Star Gazer',       desc: 'Completed Stars story'       },
  { id: 'rhyme-1',      emoji: '🐟', label: 'Fish Poet',        desc: 'Completed Fish Rhyme'        },
  { id: 'rhyme-2',      emoji: '😴', label: 'Lullaby Singer',   desc: 'Completed Sleep Rhyme'       },
  { id: 'rhyme-3',      emoji: '🌙', label: 'Moon Chaser',      desc: 'Completed Chanda Mama rhyme' },
]

const LEVEL_THRESHOLDS = [
  { min: 0,   label: '🌱 Seedling',   color: '#4CAF50' },
  { min: 20,  label: '🌿 Sprout',     color: '#8BC34A' },
  { min: 50,  label: '⭐ Star',       color: '#FFD93D' },
  { min: 100, label: '🚀 Explorer',   color: '#2196F3' },
  { min: 150, label: '🏆 Champion',   color: '#9C27B0' },
  { min: 200, label: '🦚 Hindi Guru', color: '#FF6B6B' },
]

function getLevel(stars) {
  return [...LEVEL_THRESHOLDS].reverse().find(t => stars >= t.min) || LEVEL_THRESHOLDS[0]
}

function getNextLevel(stars) {
  return LEVEL_THRESHOLDS.find(t => t.min > stars)
}

export default function Progress() {
  const { stars, streak, completed, badges, resetAll } = useApp()
  const level     = getLevel(stars)
  const nextLevel = getNextLevel(stars)
  const progress  = nextLevel
    ? Math.round(((stars - getLevel(stars).min) / (nextLevel.min - getLevel(stars).min)) * 100)
    : 100

  const handleReset = () => {
    if (window.confirm('Reset all your progress? This cannot be undone.')) resetAll()
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">🏆 My Progress</h1>
        <p className="page-sub">See how far you&apos;ve come!</p>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card" style={{ '--sc': '#FFD93D' }}>
          <div className="stat-big">{stars}</div>
          <div className="stat-label">⭐ Stars</div>
        </div>
        <div className="stat-card" style={{ '--sc': '#FF6B6B' }}>
          <div className="stat-big">{streak}</div>
          <div className="stat-label">🔥 Day Streak</div>
        </div>
        <div className="stat-card" style={{ '--sc': '#4ECDC4' }}>
          <div className="stat-big">{completed.length}</div>
          <div className="stat-label">✅ Lessons Done</div>
        </div>
        <div className="stat-card" style={{ '--sc': '#C9B1FF' }}>
          <div className="stat-big">{badges.length}</div>
          <div className="stat-label">🎖️ Badges</div>
        </div>
      </div>

      {/* Level card */}
      <div className="level-card">
        <div className="level-top">
          <span className="level-label" style={{ color: level.color }}>{level.label}</span>
          {nextLevel && <span className="level-next">Next: {nextLevel.label} at {nextLevel.min} ⭐</span>}
        </div>
        <div className="level-bar-bg">
          <div className="level-bar-fill" style={{ width: progress + '%', background: level.color }} />
        </div>
        <p className="level-hint">
          {nextLevel
            ? `${nextLevel.min - stars} more stars to reach ${nextLevel.label}!`
            : '🎉 You have reached the highest level!'}
        </p>
      </div>

      {/* Badges */}
      <h2 className="section-title">🎖️ Badges</h2>
      <div className="badges-grid">
        {ALL_BADGES.map(b => {
          const earned = completed.includes(b.id)
          return (
            <div key={b.id} className={'badge-card' + (earned ? ' earned' : ' locked')}>
              <span className="badge-emoji">{earned ? b.emoji : '🔒'}</span>
              <span className="badge-label">{b.label}</span>
              <span className="badge-desc">{b.desc}</span>
            </div>
          )
        })}
      </div>

      {/* Completed list */}
      <h2 className="section-title">✅ Completed Lessons</h2>
      {completed.length === 0
        ? <p className="empty-msg">No lessons completed yet. Start learning! 🚀</p>
        : (
          <ul className="completed-list">
            {completed.map(id => (
              <li key={id} className="completed-item">✅ {id.replace('-', ' › ')}</li>
            ))}
          </ul>
        )
      }

      {/* Reset */}
      <div className="danger-zone">
        <button className="btn btn-danger" onClick={handleReset}>🗑️ Reset All Progress</button>
      </div>
    </Layout>
  )
}
