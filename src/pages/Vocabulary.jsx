import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

const THEMES = {
  animals: {
    label: '🐾 Animals',
    color: '#FF6B6B',
    words: [
      { hindi: 'कुत्ता',  roman: 'kutta',   english: 'Dog',      emoji: '🐕' },
      { hindi: 'बिल्ली',  roman: 'billi',   english: 'Cat',      emoji: '🐱' },
      { hindi: 'हाथी',   roman: 'haathi',  english: 'Elephant', emoji: '🐘' },
      { hindi: 'शेर',    roman: 'sher',    english: 'Lion',     emoji: '🦁' },
      { hindi: 'बंदर',   roman: 'bandar',  english: 'Monkey',   emoji: '🐵' },
      { hindi: 'गाय',    roman: 'gaay',    english: 'Cow',      emoji: '🐄' },
      { hindi: 'मछली',   roman: 'machhli', english: 'Fish',     emoji: '🐟' },
      { hindi: 'तोता',   roman: 'tota',    english: 'Parrot',   emoji: '🦜' },
      { hindi: 'खरगोश',  roman: 'khargosh',english: 'Rabbit',   emoji: '🐰' },
      { hindi: 'मोर',    roman: 'mor',     english: 'Peacock',  emoji: '🦚' },
    ],
  },
  food: {
    label: '🍎 Food',
    color: '#4ECDC4',
    words: [
      { hindi: 'चावल',   roman: 'chaawal',  english: 'Rice',       emoji: '🍚' },
      { hindi: 'रोटी',   roman: 'roti',     english: 'Roti',       emoji: '🫓' },
      { hindi: 'दाल',    roman: 'daal',     english: 'Lentils',    emoji: '🥣' },
      { hindi: 'सब्जी',  roman: 'sabzi',    english: 'Vegetables', emoji: '🥦' },
      { hindi: 'दूध',    roman: 'doodh',    english: 'Milk',       emoji: '🥛' },
      { hindi: 'पानी',   roman: 'paani',    english: 'Water',      emoji: '💧' },
      { hindi: 'फल',    roman: 'phal',     english: 'Fruit',      emoji: '🍊' },
      { hindi: 'आम',    roman: 'aam',      english: 'Mango',      emoji: '🥭' },
      { hindi: 'केला',   roman: 'kela',     english: 'Banana',     emoji: '🍌' },
      { hindi: 'लड्डू',  roman: 'laddoo',   english: 'Laddoo',     emoji: '🍬' },
    ],
  },
  colors: {
    label: '🎨 Colors',
    color: '#FFD93D',
    words: [
      { hindi: 'लाल',    roman: 'laal',    english: 'Red',    emoji: '🔴' },
      { hindi: 'नीला',   roman: 'neela',   english: 'Blue',   emoji: '🔵' },
      { hindi: 'हरा',    roman: 'hara',    english: 'Green',  emoji: '🟢' },
      { hindi: 'पीला',   roman: 'peela',   english: 'Yellow', emoji: '🟡' },
      { hindi: 'सफ़ेद',  roman: 'safed',   english: 'White',  emoji: '⚪' },
      { hindi: 'काला',   roman: 'kaala',   english: 'Black',  emoji: '⚫' },
      { hindi: 'नारंगी', roman: 'narangi', english: 'Orange', emoji: '🟠' },
      { hindi: 'गुलाबी', roman: 'gulaabi', english: 'Pink',   emoji: '🩷' },
      { hindi: 'बैंगनी', roman: 'baingani',english: 'Purple', emoji: '🟣' },
      { hindi: 'भूरा',   roman: 'bhoora',  english: 'Brown',  emoji: '🟤' },
    ],
  },
  family: {
    label: '👨‍👩‍👧 Family',
    color: '#A8E6CF',
    words: [
      { hindi: 'माँ',    roman: 'maa',     english: 'Mother',      emoji: '👩' },
      { hindi: 'पापा',   roman: 'papa',    english: 'Father',      emoji: '👨' },
      { hindi: 'दादी',   roman: 'daadi',   english: 'Grandmother', emoji: '👵' },
      { hindi: 'दादा',   roman: 'daada',   english: 'Grandfather', emoji: '👴' },
      { hindi: 'भाई',    roman: 'bhai',    english: 'Brother',     emoji: '👦' },
      { hindi: 'बहन',    roman: 'behen',   english: 'Sister',      emoji: '👧' },
      { hindi: 'चाचा',   roman: 'chacha',  english: 'Uncle',       emoji: '🧔' },
      { hindi: 'चाची',   roman: 'chachi',  english: 'Aunt',        emoji: '👩' },
      { hindi: 'बच्चा',  roman: 'bachcha', english: 'Child',       emoji: '👶' },
      { hindi: 'परिवार', roman: 'parivar', english: 'Family',      emoji: '👨‍👩‍👧‍👦' },
    ],
  },
  body: {
    label: '🫀 Body',
    color: '#C9B1FF',
    words: [
      { hindi: 'आँख',   roman: 'aankh',  english: 'Eye',    emoji: '👁️' },
      { hindi: 'कान',   roman: 'kaan',   english: 'Ear',    emoji: '👂' },
      { hindi: 'नाक',   roman: 'naak',   english: 'Nose',   emoji: '👃' },
      { hindi: 'मुँह',  roman: 'munh',   english: 'Mouth',  emoji: '👄' },
      { hindi: 'हाथ',   roman: 'haath',  english: 'Hand',   emoji: '✋' },
      { hindi: 'पैर',   roman: 'pair',   english: 'Foot',   emoji: '🦶' },
      { hindi: 'सिर',   roman: 'sir',    english: 'Head',   emoji: '🗣️' },
      { hindi: 'बाल',   roman: 'baal',   english: 'Hair',   emoji: '💇' },
      { hindi: 'दाँत',  roman: 'daant',  english: 'Teeth',  emoji: '🦷' },
      { hindi: 'पेट',   roman: 'pet',    english: 'Stomach',emoji: '🫃' },
    ],
  },
}

function WordCard({ word, color }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <button
      className="word-card"
      style={{ '--wc-color': color }}
      onClick={() => { setRevealed(r => !r); speak(word.hindi) }}
    >
      <span className="wc-emoji">{word.emoji}</span>
      <span className="wc-hindi">{word.hindi}</span>
      {revealed && (
        <>
          <span className="wc-roman">{word.roman}</span>
          <span className="wc-english">{word.english}</span>
        </>
      )}
      {!revealed && <span className="wc-hint">👆 tap to reveal</span>}
    </button>
  )
}

export default function Vocabulary() {
  const [theme, setTheme] = useState('animals')
  const { addStars, markComplete, earnBadge, showCelebration, completed } = useApp()
  const current = THEMES[theme]
  const isDone = completed.includes('vocab-' + theme)

  const handleComplete = () => {
    if (!isDone) {
      addStars(5)
      markComplete('vocab-' + theme)
      earnBadge('vocab-' + theme)
      showCelebration(`${current.label} Complete!`, '+5 ⭐ earned!')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">📚 Word World</h1>
        <p className="page-sub">Tap a card to hear the Hindi word!</p>
      </div>

      <div className="theme-bar">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            className={'theme-btn' + (theme === key ? ' active' : '')}
            style={{ '--theme-color': t.color }}
            onClick={() => setTheme(key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="words-grid">
        {current.words.map((w, i) => (
          <WordCard key={i} word={w} color={current.color} />
        ))}
      </div>

      <div className="lesson-actions">
        <button
          className={'btn btn-green' + (isDone ? ' done' : '')}
          onClick={handleComplete}
        >
          {isDone ? '✅ Done! +5 ⭐ earned' : '✅ Mark Theme Complete (+5 ⭐)'}
        </button>
      </div>
    </Layout>
  )
}
