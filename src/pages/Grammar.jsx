import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import PartsOfSpeechSection from '../components/PartsOfSpeechSection'
import { speak } from '../utils/speak'

/* ── "To Be" (होना) forms ───────────────────────────────── */
const HONA = [
  {
    hindi: 'हूँ',
    roman: 'hoon',
    english: 'am (used with मैं)',
    emoji: '🙋',
    tip: 'Rule: मैं + हूँ. Example: मैं ठीक हूँ। / मैं घर पर हूँ।',
  },
  {
    hindi: 'हो',
    roman: 'ho',
    english: 'are (used with तुम)',
    emoji: '👉',
    tip: 'Rule: तुम + हो. Example: तुम कहाँ हो? / तुम अच्छे हो।',
  },
  {
    hindi: 'है',
    roman: 'hai',
    english: 'is (used with यह/वह/वो)',
    emoji: '📌',
    tip: 'Rule: यह/वह/वो + है. Example: यह किताब है। / वह मेरा दोस्त है।',
  },
  {
    hindi: 'हैं',
    roman: 'hain',
    english: 'are (used with आप/हम/वे/ये)',
    emoji: '👥',
    tip: 'Rule: आप (respect) + हैं, हम + हैं, वे/ये + हैं. Example: आप कैसे हैं? / हम ठीक हैं।',
  },
]

/* ── Masculine / Feminine (Gender) ───────────────────────── */
const GENDER = [
  {
    hindi: 'पुल्लिंग',
    roman: 'pulling',
    english: 'Masculine gender',
    emoji: '👦',
    tip: 'Many masculine nouns end in -ा (not always). Examples: लड़का, बेटा, कमरा।',
  },
  {
    hindi: 'स्त्रीलिंग',
    roman: 'streeling',
    english: 'Feminine gender',
    emoji: '👧',
    tip: 'Many feminine nouns end in -ी / -या (not always). Examples: लड़की, कुर्सी, चिड़िया।',
  },
  {
    hindi: 'लड़का',
    roman: 'ladka',
    english: 'Boy (masc.)',
    emoji: '👦',
    tip: 'Feminine pair: लड़की. Example: वह लड़का है।',
  },
  {
    hindi: 'लड़की',
    roman: 'ladki',
    english: 'Girl (fem.)',
    emoji: '👧',
    tip: 'Masculine pair: लड़का. Example: वह लड़की है।',
  },
  {
    hindi: 'अच्छा / अच्छी',
    roman: 'achha / achhi',
    english: 'Good (masc./fem.)',
    emoji: '👍',
    tip: 'Adjectives can change: अच्छा लड़का / अच्छी लड़की।',
  },
  {
    hindi: 'मेरा / मेरी',
    roman: 'mera / meri',
    english: 'My (masc./fem.)',
    emoji: '🏷️',
    tip: 'Gender follows the noun: मेरा घर / मेरी किताब।',
  },
  {
    hindi: 'गया / गई',
    roman: 'gaya / gayi',
    english: 'Went (masc./fem.)',
    emoji: '🚌',
    tip: 'Past verb agrees: मैं गया (male) / मैं गई (female)।',
  },
  {
    hindi: 'थका / थकी',
    roman: 'thaka / thaki',
    english: 'Tired (masc./fem.)',
    emoji: '😴',
    tip: 'Example: मैं थका हूँ (male) / मैं थकी हूँ (female)।',
  },
]

/* ── Singular / Plural (Number) ─────────────────────────── */
const NUMBER = [
  {
    hindi: 'एकवचन',
    roman: 'ekvachan',
    english: 'Singular (one)',
    emoji: '1️⃣',
    tip: 'Used for one. Example: यह किताब है।',
  },
  {
    hindi: 'बहुवचन',
    roman: 'bahuvachan',
    english: 'Plural (many)',
    emoji: '👥',
    tip: 'Used for more than one. Example: ये किताबें हैं।',
  },
  {
    hindi: 'लड़का → लड़के',
    roman: 'ladka → ladke',
    english: 'Boy → Boys',
    emoji: '👦',
    tip: 'Common pattern: -ा becomes -े in plural. (लड़का/लड़के)',
  },
  {
    hindi: 'लड़की → लड़कियाँ',
    roman: 'ladki → ladkiyaan',
    english: 'Girl → Girls',
    emoji: '👧',
    tip: 'Common pattern: add -याँ in plural. (लड़की/लड़कियाँ)',
  },
  {
    hindi: 'किताब → किताबें',
    roman: 'kitaab → kitaaben',
    english: 'Book → Books',
    emoji: '📚',
    tip: 'Many nouns add -ें/-याँ. Example sentence: ये किताबें हैं।',
  },
  {
    hindi: 'यह → ये',
    roman: 'yah → ye',
    english: 'This → These',
    emoji: '👈',
    tip: 'यह (singular) / ये (plural).',
  },
  {
    hindi: 'है → हैं',
    roman: 'hai → hain',
    english: 'is → are',
    emoji: '✅',
    tip: 'यह किताब है। / ये किताबें हैं।',
  },
  {
    hindi: 'मेरा → मेरे',
    roman: 'mera → mere',
    english: 'my (sing.) → my (plural masc.)',
    emoji: '🏷️',
    tip: 'Plural agreement: मेरा दोस्त / मेरे दोस्त।',
  },
]

/* ── Tenses (Present / Past / Future) ───────────────────── */
const TENSES = [
  {
    hindi: 'वर्तमान काल',
    roman: 'vartamaan kaal',
    english: 'Present tense',
    emoji: '⏰',
    tip: 'Talk about now / habits. Often: verb + ता/ती/ते + हूँ/हो/है/हैं.',
  },
  {
    hindi: 'भूत काल',
    roman: 'bhoot kaal',
    english: 'Past tense',
    emoji: '⏪',
    tip: 'Talk about before. Often: गया/गई/गए, था/थी/थे.',
  },
  {
    hindi: 'भविष्य काल',
    roman: 'bhavishya kaal',
    english: 'Future tense',
    emoji: '🔜',
    tip: 'Talk about later. Often: गा/गी/गे. Example: मैं जाऊँगा/जाऊँगी।',
  },
  {
    hindi: 'मैं जाता हूँ।',
    roman: 'Main jaata hoon.',
    english: 'I go (habit / generally).',
    emoji: '🚶',
    tip: 'Present habitual: जाता/जाती/जाते + हूँ/हो/है/हैं.',
  },
  {
    hindi: 'मैं जा रहा हूँ।',
    roman: 'Main ja raha hoon.',
    english: 'I am going (right now).',
    emoji: '🏃',
    tip: 'Present continuous: रहा/रही/रहे + हूँ/हो/है/हैं.',
  },
  {
    hindi: 'मैं गया/गई।',
    roman: 'Main gaya/gayi.',
    english: 'I went.',
    emoji: '🚌',
    tip: 'Past: गया (male) / गई (female).',
  },
  {
    hindi: 'मैं जाऊँगा/जाऊँगी।',
    roman: 'Main jaaunga/jaaungi.',
    english: 'I will go.',
    emoji: '🛫',
    tip: 'Future: जाऊँगा (male) / जाऊँगी (female).',
  },
  {
    hindi: 'मैं जा रहा था/थी।',
    roman: 'Main ja raha tha/thi.',
    english: 'I was going.',
    emoji: '🕰️',
    tip: 'Past continuous: रहा + था/थी. (male: था, female: थी)',
  },
]

/* ── Question Words ───────────────────────────────────────── */
const QUESTION_WORDS = [
  { hindi: 'क्या',        roman: 'kya',         english: 'What / Is it?',          emoji: '❓' },
  { hindi: 'कौन',         roman: 'kaun',        english: 'Who',                    emoji: '🧑' },
  { hindi: 'कहाँ',        roman: 'kahaan',      english: 'Where',                  emoji: '📍' },
  { hindi: 'कब',          roman: 'kab',         english: 'When',                   emoji: '🕐' },
  { hindi: 'क्यों',       roman: 'kyoon',       english: 'Why',                    emoji: '💬' },
  { hindi: 'कैसे',        roman: 'kaise',       english: 'How',                    emoji: '🔄' },
  { hindi: 'कितना',       roman: 'kitna',       english: 'How much / many',        emoji: '🔢' },
  { hindi: 'कौन सा',      roman: 'kaun sa',     english: 'Which',                  emoji: '🔀' },
  { hindi: 'किसका',       roman: 'kiska',       english: 'Whose',                  emoji: '🏷️' },
  { hindi: 'किससे',       roman: 'kisse',       english: 'From whom',              emoji: '💁' },
  { hindi: 'कहाँ से',     roman: 'kahaan se',   english: 'From where',             emoji: '🗺️' },
  { hindi: 'कहाँ तक',     roman: 'kahaan tak',  english: 'Until where',            emoji: '🛤️' },
  { hindi: 'कब से',       roman: 'kab se',      english: 'Since when',             emoji: '⏳' },
  { hindi: 'कब तक',       roman: 'kab tak',     english: 'Until when',             emoji: '⏰' },
  { hindi: 'कितने बजे',   roman: 'kitne baje',  english: 'At what time',           emoji: '🕑' },
  { hindi: 'क्यों नहीं',  roman: 'kyoon nahin', english: 'Why not',                emoji: '🤷' },
  { hindi: 'कैसा',        roman: 'kaisa',       english: 'How is / What like',     emoji: '🤔' },
  { hindi: 'किसलिए',      roman: 'kislie',      english: 'For what purpose',       emoji: '🎯' },
  { hindi: 'किस तरफ',     roman: 'kis taraf',   english: 'Which direction',        emoji: '↗️' },
  { hindi: 'किधर',        roman: 'kidhar',      english: 'Which way / Where',      emoji: '🧭' },
  { hindi: 'कितनी बार',   roman: 'kitni baar',  english: 'How many times',         emoji: '🔁' },
  { hindi: 'कितनी दूर',   roman: 'kitni door',  english: 'How far',                emoji: '📏' },
  { hindi: 'कौन कौन',     roman: 'kaun kaun',   english: 'Who all / Which ones',   emoji: '👥' },
  { hindi: 'किस चीज़ से',  roman: 'kis cheez se',english: 'With what / Using what', emoji: '🔧' },
  { hindi: 'किसके लिए',   roman: 'kiske liye',  english: 'For whom',               emoji: '🎁' },
]

/* ── Tabs config ──────────────────────────────────────────── */
const SECTIONS = [
  { id: 'parts',          label: '📖 Parts of Speech',          kind: 'parts' },
  { id: 'hona',           label: '✅ Hoon / Ho / Hai / Hain', items: HONA,          color: '#6C63FF' },
  { id: 'gender',         label: '👦👧 Masculine & Feminine',  items: GENDER,        color: '#FF85A1' },
  { id: 'number',         label: '1️⃣👥 Singular & Plural',     items: NUMBER,        color: '#2196F3' },
  { id: 'tenses',         label: '⏳ Tenses',                  items: TENSES,        color: '#FF9800' },
  { id: 'question-words', label: '❓ Question Words',          items: QUESTION_WORDS, color: '#E91E8C' },
]

function GrammarCard({ item, color }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <button
      className="word-card"
      style={{ '--wc-color': color }}
      onClick={() => { setRevealed(r => !r); speak(item.hindi) }}
    >
      <span className="wc-emoji">{item.emoji}</span>
      <span className="wc-hindi">{item.hindi}</span>
      {revealed ? (
        <>
          <span className="wc-roman">{item.roman}</span>
          <span className="wc-english">{item.english}</span>
          {item.tip && <span className="wc-tip">💡 {item.tip}</span>}
        </>
      ) : (
        <span className="wc-hint">👆 tap to reveal</span>
      )}
    </button>
  )
}

export default function Grammar() {
  const { addStars, markComplete, earnBadge, showCelebration, completed } = useApp()
  const [sectionIdx, setSectionIdx] = useState(0)
  const section = SECTIONS[sectionIdx]

  const legacyDone = completed.includes('pos-' + section.id)
  const isDone = completed.includes('grammar-' + section.id) || legacyDone

  const subtitle = section.id === 'hona'
    ? 'Learn when to use हूँ / हो / है / हैं — the Hindi “to be” (होना) helpers.'
    : section.id === 'parts'
      ? 'Verbs, adjectives, pronouns, prepositions and more — all in one place.'
    : section.id === 'gender'
      ? 'Learn how Hindi changes words for masculine vs feminine.'
      : section.id === 'number'
        ? 'Learn singular vs plural — and how words change.'
        : section.id === 'tenses'
          ? 'Learn present, past, and future tense patterns.'
          : 'Tap any card to hear it spoken — learn grammar in Hindi!'

  const handleComplete = () => {
    if (!isDone) {
      addStars(5)
      markComplete('grammar-' + section.id)
      earnBadge('grammar-' + section.id)
      showCelebration(`${section.label} Complete!`, '+5 ⭐ earned!')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">🧩 Grammar</h1>
        <p className="page-sub">{subtitle}</p>
      </div>

      <div className="tab-bar">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={'tab-btn' + (sectionIdx === i ? ' active' : '')}
            onClick={() => setSectionIdx(i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="words-grid">
        {section.kind === 'parts'
          ? <PartsOfSpeechSection />
          : section.items.map((item, i) => (
            <GrammarCard key={i} item={item} color={section.color} />
          ))
        }
      </div>

      {section.kind !== 'parts' && (
        <div className="lesson-actions">
          <button
            className={'btn btn-green' + (isDone ? ' done' : '')}
            onClick={handleComplete}
          >
            {isDone ? '✅ Done! +5 ⭐ earned' : '✅ Mark Section Complete (+5 ⭐)'}
          </button>
        </div>
      )}
    </Layout>
  )
}
