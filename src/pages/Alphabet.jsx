import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

/* ── Full Devanagari data ─────────────────────────────────── */
const VOWELS = [
  { letter: 'अ', roman: 'a',  word: 'अनार',  meaning: 'Pomegranate', emoji: '🍎' },
  { letter: 'आ', roman: 'aa', word: 'आम',    meaning: 'Mango',       emoji: '🥭' },
  { letter: 'इ', roman: 'i',  word: 'इमली',  meaning: 'Tamarind',    emoji: '🍂' },
  { letter: 'ई', roman: 'ee', word: 'ईख',    meaning: 'Sugarcane',   emoji: '🎋' },
  { letter: 'उ', roman: 'u',  word: 'उल्लू', meaning: 'Owl',         emoji: '🦉' },
  { letter: 'ऊ', roman: 'oo', word: 'ऊँट',   meaning: 'Camel',       emoji: '🐪' },
  { letter: 'ए', roman: 'e',  word: 'एड़ी',   meaning: 'Heel',        emoji: '👣' },
  { letter: 'ऐ', roman: 'ai', word: 'ऐनक',   meaning: 'Glasses',     emoji: '👓' },
  { letter: 'ओ', roman: 'o',  word: 'ओस',    meaning: 'Dew',         emoji: '💧' },
  { letter: 'औ', roman: 'au', word: 'औजार',  meaning: 'Tool',        emoji: '🔧' },
  { letter: 'अं', roman: 'an', word: 'अंगूर', meaning: 'Grapes',     emoji: '🍇' },
  { letter: 'अः', roman: 'ah', word: 'अः',    meaning: 'Visarga',     emoji: '✨' },
  { letter: 'ऋ', roman: 'ri', word: 'ऋषि',   meaning: 'Sage',        emoji: '🧘' },
]

const CONSONANTS = [
  { letter: 'क', roman: 'ka',  word: 'कमल',  meaning: 'Lotus',      emoji: '🌸' },
  { letter: 'ख', roman: 'kha', word: 'खरगोश',meaning: 'Rabbit',     emoji: '🐰' },
  { letter: 'ग', roman: 'ga',  word: 'गाय',  meaning: 'Cow',        emoji: '🐄' },
  { letter: 'घ', roman: 'gha', word: 'घर',   meaning: 'House',      emoji: '🏠' },
  { letter: 'ङ', roman: 'nga', word: 'ङ',    meaning: 'Nga sound',   emoji: '🔔' },
  { letter: 'च', roman: 'cha', word: 'चाँद',  meaning: 'Moon',       emoji: '🌙' },
  { letter: 'छ', roman: 'chha',word: 'छाता',  meaning: 'Umbrella',   emoji: '☂️' },
  { letter: 'ज', roman: 'ja',  word: 'जहाज', meaning: 'Ship',       emoji: '🚢' },
  { letter: 'झ', roman: 'jha', word: 'झंडा', meaning: 'Flag',       emoji: '🚩' },
  { letter: 'ञ', roman: 'nya', word: 'ञ',    meaning: 'Nya sound',   emoji: '🎵' },
  { letter: 'ट', roman: 'ta',  word: 'टमाटर',meaning: 'Tomato',     emoji: '🍅' },
  { letter: 'ठ', roman: 'tha', word: 'ठंड',  meaning: 'Cold',       emoji: '❄️' },
  { letter: 'ड', roman: 'da',  word: 'डमरू', meaning: 'Drum',       emoji: '🥁' },
  { letter: 'ढ', roman: 'dha', word: 'ढोल',  meaning: 'Dhol drum',  emoji: '🪘' },
  { letter: 'ण', roman: 'na',  word: 'णकार', meaning: 'Na sound',   emoji: '🎼' },
  { letter: 'त', roman: 'ta',  word: 'तरबूज',meaning: 'Watermelon', emoji: '🍉' },
  { letter: 'थ', roman: 'tha', word: 'थाली', meaning: 'Plate',      emoji: '🍽️' },
  { letter: 'द', roman: 'da',  word: 'दरवाज़ा',meaning: 'Door',    emoji: '🚪' },
  { letter: 'ध', roman: 'dha', word: 'धनुष', meaning: 'Bow',        emoji: '🏹' },
  { letter: 'न', roman: 'na',  word: 'नाव',  meaning: 'Boat',       emoji: '⛵' },
  { letter: 'प', roman: 'pa',  word: 'पतंग', meaning: 'Kite',       emoji: '🪁' },
  { letter: 'फ', roman: 'pha', word: 'फूल',  meaning: 'Flower',     emoji: '🌸' },
  { letter: 'ब', roman: 'ba',  word: 'बकरी', meaning: 'Goat',       emoji: '🐐' },
  { letter: 'भ', roman: 'bha', word: 'भालू', meaning: 'Bear',       emoji: '🐻' },
  { letter: 'म', roman: 'ma',  word: 'मछली', meaning: 'Fish',       emoji: '🐟' },
  { letter: 'य', roman: 'ya',  word: 'यात्रा',meaning: 'Journey',   emoji: '✈️' },
  { letter: 'र', roman: 'ra',  word: 'रेलगाड़ी',meaning: 'Train',  emoji: '🚂' },
  { letter: 'ल', roman: 'la',  word: 'लड्डू', meaning: 'Laddoo',   emoji: '🍬' },
  { letter: 'व', roman: 'va',  word: 'वर्षा', meaning: 'Rain',       emoji: '🌧️' },
  { letter: 'श', roman: 'sha', word: 'शेर',  meaning: 'Lion',       emoji: '🦁' },
  { letter: 'ष', roman: 'sha', word: 'षट्कोण',meaning: 'Hexagon',  emoji: '⬡'  },
  { letter: 'स', roman: 'sa',  word: 'सेब',  meaning: 'Apple',      emoji: '🍎' },
  { letter: 'ह', roman: 'ha',  word: 'हाथी', meaning: 'Elephant',   emoji: '🐘' },
  { letter: 'क्ष', roman: 'ksha',word: 'क्षमा',meaning: 'Forgiveness',emoji: '🙏'},
  { letter: 'त्र', roman: 'tra', word: 'त्रिकोण',meaning: 'Triangle', emoji: '🔺'},
  { letter: 'ज्ञ', roman: 'gya', word: 'ज्ञान', meaning: 'Knowledge',emoji: '📚'},
]

const MATRAS = [
  { matra: 'ा', roman: 'aa', example: 'का → kaa', base: 'क' },
  { matra: 'ि', roman: 'i',  example: 'कि → ki',   base: 'क' },
  { matra: 'ी', roman: 'ee', example: 'की → kee',  base: 'क' },
  { matra: 'ु', roman: 'u',  example: 'कु → ku',   base: 'क' },
  { matra: 'ू', roman: 'oo', example: 'कू → koo',  base: 'क' },
  { matra: 'े', roman: 'e',  example: 'के → ke',   base: 'क' },
  { matra: 'ै', roman: 'ai', example: 'कै → kai',  base: 'क' },
  { matra: 'ो', roman: 'o',  example: 'को → ko',   base: 'क' },
  { matra: 'ौ', roman: 'au', example: 'कौ → kau',  base: 'क' },
  { matra: 'ं', roman: 'n',  example: 'कं → kan',  base: 'क' },
]

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function LetterCard({ item, type }) {
  const [flipped, setFlipped] = useState(false)

  const handleClick = () => {
    setFlipped(f => !f)
    speak(type === 'matra' ? item.example : `${item.letter}… ${item.word}`)
  }

  if (type === 'matra') {
    return (
      <button className="letter-card matra-card" onClick={handleClick}>
        <div className="lc-letter">{item.base}<span className="matra-hl">{item.matra}</span></div>
        <div className="lc-roman">{item.roman}</div>
        <div className="lc-example">{item.example}</div>
        <div className="lc-tap">👆 tap to hear</div>
      </button>
    )
  }

  return (
    <button className={`letter-card ${flipped ? 'flipped' : ''}`} onClick={handleClick}>
      {!flipped ? (
        <>
          <div className="lc-letter">{item.letter}</div>
          <div className="lc-roman">{item.roman}</div>
          <div className="lc-tap">👆 tap to hear</div>
        </>
      ) : (
        <>
          <div className="lc-emoji">{item.emoji}</div>
          <div className="lc-word">{item.word}</div>
          <div className="lc-meaning">{item.meaning}</div>
        </>
      )}
    </button>
  )
}

const TABS = ['Vowels (स्वर)', 'Consonants (व्यंजन)', 'Matras (मात्राएँ)']

export default function Alphabet() {
  const [tab, setTab] = useState(0)
  const { addStars, markComplete, earnBadge, showCelebration, completed } = useApp()
  const isDone = completed.includes('alphabet-' + tab)
  const tabNames = ['Vowels', 'Consonants', 'Matras']

  const handleComplete = () => {
    if (!isDone) {
      addStars(5)
      markComplete('alphabet-' + tab)
      earnBadge('alphabet-' + tab)
      showCelebration(`🔤 ${tabNames[tab]} Complete!`, '+5 ⭐ earned — well done!')
    }
  }

  const items = tab === 0 ? VOWELS : tab === 1 ? CONSONANTS : MATRAS

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">🔤 Alphabet Fun</h1>
        <p className="page-sub">Tap any card to hear it spoken in Hindi!</p>
      </div>

      <div className="tab-bar">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={'tab-btn' + (tab === i ? ' active' : '')}
            onClick={() => setTab(i)}
          >{t}</button>
        ))}
      </div>

      <div className="letters-grid">
        {items.map((item, i) => (
          <LetterCard key={i} item={item} type={tab === 2 ? 'matra' : 'letter'} />
        ))}
      </div>

      <div className="lesson-actions">
        <button
          className={'btn btn-green' + (isDone ? ' done' : '')}
          onClick={handleComplete}
        >
          {isDone ? '✅ Completed! +5 ⭐ earned' : '✅ Mark Section Complete (+5 ⭐)'}
        </button>
      </div>
    </Layout>
  )
}
