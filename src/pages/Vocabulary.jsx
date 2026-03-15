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
  verbs: {
    label: '🏃 Verbs',
    color: '#FF85A1',
    words: [
      { hindi: 'खाना',  roman: 'khaana', english: 'To Eat',     emoji: '🍽️' },
      { hindi: 'पीना',  roman: 'peena',  english: 'To Drink',   emoji: '💧' },
      { hindi: 'जाना',  roman: 'jaana',  english: 'To Go',      emoji: '🚶' },
      { hindi: 'आना',   roman: 'aana',   english: 'To Come',    emoji: '👋' },
      { hindi: 'सोना',  roman: 'sona',   english: 'To Sleep',   emoji: '😴' },
      { hindi: 'खेलना', roman: 'khelna', english: 'To Play',    emoji: '🎮' },
      { hindi: 'पढ़ना',  roman: 'padhna', english: 'To Study',   emoji: '📖' },
      { hindi: 'लिखना', roman: 'likhna', english: 'To Write',   emoji: '✍️' },
      { hindi: 'बोलना', roman: 'bolna',  english: 'To Speak',   emoji: '🗣️' },
      { hindi: 'देखना', roman: 'dekhna', english: 'To See',     emoji: '👀' },
    ],
  },
  phrases: {
    label: '💬 Phrases',
    color: '#4D96FF',
    words: [
      { hindi: 'नमस्ते',        roman: 'Namaste',          english: 'Hello / Greetings', emoji: '🙏' },
      { hindi: 'धन्यवाद',      roman: 'Dhanyavaad',       english: 'Thank you',         emoji: '😊' },
      { hindi: 'कृपया',         roman: 'Kripaya',          english: 'Please',            emoji: '🤲' },
      { hindi: 'माफ करना',     roman: 'Maaf karna',       english: 'Sorry / Excuse me', emoji: '😔' },
      { hindi: 'हाँ',           roman: 'Haan',             english: 'Yes',               emoji: '✅' },
      { hindi: 'नहीं',          roman: 'Nahin',            english: 'No',                emoji: '❌' },
      { hindi: 'अच्छा',         roman: 'Achha',            english: 'Good / Okay',       emoji: '👍' },
      { hindi: 'क्या हाल है?',  roman: 'Kya haal hai?',   english: 'How are you?',      emoji: '😃' },
      { hindi: 'मैं ठीक हूँ',   roman: 'Main theek hoon', english: 'I am fine',         emoji: '😌' },
      { hindi: 'फिर मिलेंगे',   roman: 'Phir milenge',    english: 'See you again',     emoji: '👋' },
    ],
  },
  sentences: {
    label: '📝 Sentences',
    color: '#FF9800',
    words: [
      { hindi: 'मैं खाना खाता हूँ।',     roman: 'Main khaana khaataa hoon.',     english: 'I eat food.',                     emoji: '🍽️', tip: 'मैं (I) + खाना (food) + खाता हूँ (eat)' },
      { hindi: 'वह पानी पीती है।',        roman: 'Vah paanee peetee hai.',        english: 'She drinks water.',               emoji: '💧', tip: 'वह (she) + पानी (water) + पीती है (drinks)' },
      { hindi: 'हम स्कूल जाते हैं।',     roman: 'Hum school jaate hain.',        english: 'We go to school.',                emoji: '🏫', tip: 'हम (we) + स्कूल (school) + जाते हैं (go)' },
      { hindi: 'मेरा नाम ___ है।',        roman: 'Mera naam ___ hai.',            english: 'My name is ___.',                 emoji: '👤', tip: 'मेरा (my) + नाम (name) + है (is)' },
      { hindi: 'यह किताब है।',            roman: 'Yah kitaab hai.',               english: 'This is a book.',                 emoji: '📚', tip: 'यह (this) + किताब (book) + है (is)' },
      { hindi: 'मुझे भूख लगी है।',        roman: 'Mujhe bhookh lagee hai.',       english: 'I am hungry.',                    emoji: '🍴', tip: 'मुझे (to me) + भूख (hunger) + लगी है (felt)' },
      { hindi: 'कल मैं बाज़ार गया।',      roman: 'Kal main baazaar gayaa.',       english: 'Yesterday I went to the market.', emoji: '🛒', tip: 'कल (yesterday) — past tense verb: गया' },
      { hindi: 'आज मौसम अच्छा है।',      roman: 'Aaj mausam achha hai.',         english: 'Today the weather is nice.',      emoji: '☀️', tip: 'आज (today) + मौसम (weather) + अच्छा (good)' },
      { hindi: 'मैं हिंदी सीख रहा हूँ।', roman: 'Main Hindee seekh raha hoon.',  english: 'I am learning Hindi.',            emoji: '🌟', tip: 'Present continuous: verb + रहा हूँ' },
      { hindi: 'क्या तुम खेलोगे?',       roman: 'Kya tum kheloge?',             english: 'Will you play?',                  emoji: '🎮', tip: 'क्या starts a question; future: खेलोगे' },
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
          {word.tip && <span className="wc-tip">💡 {word.tip}</span>}
        </>
      )}
      {!revealed && <span className="wc-hint">👆 tap to reveal</span>}
    </button>
  )
}

const THEMES_BY_AGE = {
  A: ['animals', 'food', 'colors', 'body'],
  B: ['animals', 'food', 'colors', 'body', 'family', 'verbs', 'phrases'],
  C: ['animals', 'food', 'colors', 'body', 'family', 'verbs', 'phrases', 'sentences'],
}
const AGE_SUBTITLE = {
  A: '🌱 Tap any card to hear it in Hindi!',
  B: '⭐ Explore nouns, verbs & everyday phrases!',
  C: '🚀 Nouns, verbs, phrases & full sentence patterns!',
}

export default function Vocabulary() {
  const { addStars, markComplete, earnBadge, showCelebration, completed, ageGroup } = useApp()
  const visibleKeys = THEMES_BY_AGE[ageGroup] || Object.keys(THEMES)
  const [theme, setTheme] = useState(visibleKeys[0])
  const current = THEMES[theme] || THEMES[visibleKeys[0]]
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
        <p className="page-sub">{AGE_SUBTITLE[ageGroup] || 'Tap a card to hear the Hindi word!'}</p>
      </div>

      <div className="theme-bar">
        {Object.entries(THEMES).filter(([key]) => visibleKeys.includes(key)).map(([key, t]) => (
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
