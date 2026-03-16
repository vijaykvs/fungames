import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speak'

/* ── Everyday Phrases ─────────────────────────────────────── */
const PHRASES = [
  { hindi: 'नमस्ते',              roman: 'Namaste',                english: 'Hello / Greetings',       emoji: '🙏' },
  { hindi: 'धन्यवाद',            roman: 'Dhanyavaad',             english: 'Thank you',               emoji: '😊' },
  { hindi: 'कृपया',               roman: 'Kripaya',                english: 'Please',                  emoji: '🤲' },
  { hindi: 'माफ करना',           roman: 'Maaf karna',             english: 'Sorry / Excuse me',       emoji: '😔' },
  { hindi: 'हाँ',                 roman: 'Haan',                   english: 'Yes',                     emoji: '✅' },
  { hindi: 'नहीं',                roman: 'Nahin',                  english: 'No',                      emoji: '❌' },
  { hindi: 'अच्छा',               roman: 'Achha',                  english: 'Good / Okay',             emoji: '👍' },
  { hindi: 'क्या हाल है?',        roman: 'Kya haal hai?',          english: 'How are you?',            emoji: '😃' },
  { hindi: 'मैं ठीक हूँ',         roman: 'Main theek hoon',        english: 'I am fine',               emoji: '😌' },
  { hindi: 'फिर मिलेंगे',         roman: 'Phir milenge',           english: 'See you again',           emoji: '👋' },
  { hindi: 'शुभ प्रभात',          roman: 'Shubh prabhat',          english: 'Good morning',            emoji: '🌅' },
  { hindi: 'शुभ रात्रि',          roman: 'Shubh raatri',           english: 'Good night',              emoji: '🌙' },
  { hindi: 'स्वागत है',           roman: 'Swaagat hai',            english: 'Welcome',                 emoji: '🎉' },
  { hindi: 'जन्मदिन मुबारक',      roman: 'Janamdin mubaarak',      english: 'Happy birthday',          emoji: '🎂' },
  { hindi: 'अंदर आइए',            roman: 'Andar aaiye',            english: 'Please come in',          emoji: '🚪' },
  { hindi: 'बैठ जाइए',            roman: 'Baith jaaiye',           english: 'Please sit down',         emoji: '🪑' },
  { hindi: 'यह क्या है?',         roman: 'Yah kya hai?',           english: 'What is this?',           emoji: '❓' },
  { hindi: 'कितना है?',           roman: 'Kitna hai?',             english: 'How much is it?',         emoji: '💰' },
  { hindi: 'यह कहाँ है?',         roman: 'Yah kahaan hai?',        english: 'Where is it?',            emoji: '🗺️' },
  { hindi: 'मुझे भूख लगी है',     roman: 'Mujhe bhookh lagi hai',  english: 'I am hungry',             emoji: '🍴' },
  { hindi: 'मुझे प्यास लगी है',   roman: 'Mujhe pyaas lagi hai',   english: 'I am thirsty',            emoji: '💧' },
  { hindi: 'मैं थका हूँ',         roman: 'Main thaka hoon',        english: 'I am tired',              emoji: '😴' },
  { hindi: 'धीरे बोलिए',          roman: 'Dheere boliye',          english: 'Please speak slowly',     emoji: '🔇' },
  { hindi: 'दोबारा बोलिए',        roman: 'Dobaara boliye',         english: 'Please say again',        emoji: '🔁' },
  { hindi: 'मुझे समझ नहीं आया',   roman: 'Mujhe samajh nahi aaya', english: 'I don\'t understand',    emoji: '🤷' },
  { hindi: 'ठीक है',              roman: 'Theek hai',              english: 'Alright / It\'s okay',   emoji: '👌' },
  { hindi: 'ज़रूर',                roman: 'Zaroor',                 english: 'Of course / Sure',        emoji: '💯' },
  { hindi: 'शायद',                roman: 'Shaayad',                english: 'Maybe / Perhaps',         emoji: '🤔' },
  { hindi: 'चलो',                 roman: 'Chalo',                  english: 'Let\'s go / Come on',    emoji: '🚀' },
  { hindi: 'बहुत अच्छे',          roman: 'Bahut achhe',            english: 'Very good / Well done',  emoji: '🌟' },
]

/* ── Sentence Patterns ────────────────────────────────────── */
const SENTENCES = [
  { hindi: 'मैं खाना खाता हूँ।',      roman: 'Main khaana khaataa hoon.',    english: 'I eat food.',                     emoji: '🍽️', tip: 'मैं (I) + खाना (food) + खाता हूँ (eat)' },
  { hindi: 'वह पानी पीती है।',         roman: 'Vah paanee peetee hai.',       english: 'She drinks water.',               emoji: '💧', tip: 'वह (she) + पानी (water) + पीती है (drinks)' },
  { hindi: 'हम स्कूल जाते हैं।',      roman: 'Hum school jaate hain.',       english: 'We go to school.',                emoji: '🏫', tip: 'हम (we) + स्कूल (school) + जाते हैं (go)' },
  { hindi: 'मेरा नाम ___ है।',         roman: 'Mera naam ___ hai.',           english: 'My name is ___.',                 emoji: '👤', tip: 'मेरा (my) + नाम (name) + है (is)' },
  { hindi: 'यह किताब है।',             roman: 'Yah kitaab hai.',              english: 'This is a book.',                 emoji: '📚', tip: 'यह (this) + किताब (book) + है (is)' },
  { hindi: 'मुझे भूख लगी है।',         roman: 'Mujhe bhookh lagee hai.',      english: 'I am hungry.',                    emoji: '🍴', tip: 'मुझे (to me) + भूख (hunger) + लगी है (felt)' },
  { hindi: 'कल मैं बाज़ार गया।',       roman: 'Kal main baazaar gayaa.',      english: 'Yesterday I went to the market.', emoji: '🛒', tip: 'कल (yesterday) — past tense verb: गया' },
  { hindi: 'आज मौसम अच्छा है।',       roman: 'Aaj mausam achha hai.',        english: 'Today the weather is nice.',      emoji: '☀️', tip: 'आज (today) + मौसम (weather) + अच्छा (good)' },
  { hindi: 'मैं हिंदी सीख रहा हूँ।',  roman: 'Main Hindee seekh raha hoon.', english: 'I am learning Hindi.',            emoji: '🌟', tip: 'Present continuous: verb + रहा हूँ' },
  { hindi: 'क्या तुम खेलोगे?',        roman: 'Kya tum kheloge?',            english: 'Will you play?',                  emoji: '🎮', tip: 'क्या starts a question; future: खेलोगे' },
  { hindi: 'मेरा घर बड़ा है।',         roman: 'Mera ghar bada hai.',         english: 'My house is big.',                emoji: '🏠', tip: 'मेरा (my) + घर (house) + बड़ा (big) + है (is)' },
  { hindi: 'आसमान नीला है।',           roman: 'Aasmaan neela hai.',          english: 'The sky is blue.',                emoji: '🌤️', tip: 'आसमान (sky) + नीला (blue) + है (is)' },
  { hindi: 'वह मेरा दोस्त है।',        roman: 'Vah mera dost hai.',          english: 'He is my friend.',                emoji: '👫', tip: 'वह (he/she) + मेरा (my) + दोस्त (friend)' },
  { hindi: 'मुझे हिंदी पसंद है।',      roman: 'Mujhe Hindi pasand hai.',     english: 'I like Hindi.',                   emoji: '❤️', tip: 'मुझे (to me) + पसंद है (is liked) = I like' },
  { hindi: 'तुम कहाँ जा रहे हो?',     roman: 'Tum kahaan ja rahe ho?',      english: 'Where are you going?',            emoji: '🗺️', tip: 'कहाँ (where) + जा रहे हो (going) = continuous' },
  { hindi: 'मैं घर पर हूँ।',           roman: 'Main ghar par hoon.',         english: 'I am at home.',                   emoji: '🏠', tip: 'मैं (I) + घर पर (at home) + हूँ (am)' },
  { hindi: 'बच्चे खेल रहे हैं।',       roman: 'Bachche khel rahe hain.',     english: 'The children are playing.',       emoji: '🎡', tip: 'Present continuous: खेल + रहे हैं' },
  { hindi: 'मुझे नींद आ रही है।',      roman: 'Mujhe neend aa rahi hai.',    english: 'I am feeling sleepy.',            emoji: '😴', tip: 'आ रही है shows something happening to you' },
  { hindi: 'यह बहुत सुंदर है।',        roman: 'Yah bahut sundar hai.',       english: 'This is very beautiful.',         emoji: '✨', tip: 'बहुत (very) + adjective + है' },
  { hindi: 'कल रविवार है।',            roman: 'Kal ravivar hai.',            english: 'Tomorrow is Sunday.',             emoji: '📅', tip: 'कल (tomorrow) + day name + है (is)' },
]

/* ── Travel Talk (Common Q&A) ───────────────────────────── */
const TRAVEL_TALK = [
  { hindi: 'मुझे स्टेशन जाना है।',              roman: 'Mujhe station jaana hai.',               english: 'I want to go to the station.',                emoji: '🚉', tip: 'Useful when telling your destination.' },
  { hindi: 'स्टेशन कहाँ है?',                   roman: 'Station kahaan hai?',                    english: 'Where is the station?',                       emoji: '🗺️', tip: 'Answer: यहाँ से सीधा जाइए। / दाईं तरफ मुड़िए।' },
  { hindi: 'बस स्टॉप कहाँ है?',                roman: 'Bus stop kahaan hai?',                   english: 'Where is the bus stop?',                      emoji: '🚌', tip: 'Answer: सामने बस स्टॉप है।' },
  { hindi: 'टिकट कहाँ मिलेगा?',                 roman: 'Ticket kahaan milega?',                  english: 'Where will I get a ticket?',                  emoji: '🎟️', tip: 'Answer: टिकट काउंटर वहाँ है।' },
  { hindi: 'एक टिकट दे दीजिए।',                roman: 'Ek ticket de dijiye.',                   english: 'One ticket, please.',                         emoji: '🎫', tip: 'Polite request: दीजिए = please give.' },
  { hindi: 'यह टिकट कितने का है?',              roman: 'Yah ticket kitne ka hai?',              english: 'How much is this ticket?',                    emoji: '💰', tip: 'Answer: ___ रुपये।' },
  { hindi: 'प्लेटफ़ॉर्म नंबर क्या है?',         roman: 'Platform number kya hai?',              english: 'What is the platform number?',                emoji: '📍', tip: 'Answer: प्लेटफ़ॉर्म नंबर ___।' },
  { hindi: 'ट्रेन कितने बजे है?',               roman: 'Train kitne baje hai?',                 english: 'What time is the train?',                     emoji: '🕐', tip: 'Answer: ___ बजे।' },
  { hindi: 'यह ट्रेन ___ जाएगी?',               roman: 'Yah train ___ jaayegi?',                 english: 'Will this train go to ___?',                  emoji: '🚆', tip: 'Answer: हाँ जाएगी। / नहीं जाएगी।' },
  { hindi: 'किराया कितना होगा?',                roman: 'Kiraaya kitna hoga?',                    english: 'How much will the fare be?',                  emoji: '🧾', tip: 'Auto/taxi/bus fare. Answer: ___ रुपये।' },
  { hindi: 'मीटर से चलिए।',                     roman: 'Meter se chaliye.',                      english: 'Please go by the meter.',                     emoji: '🚕', tip: 'Common with taxis/autos in cities.' },
  { hindi: 'मुझे एक ऑटो चाहिए।',                roman: 'Mujhe ek auto chahiye.',                 english: 'I need an auto-rickshaw.',                    emoji: '🛺', tip: 'You can also say: टैक्सी चाहिए।' },
  { hindi: 'मेरा सामान खो गया है।',             roman: 'Mera saamaan kho gaya hai.',            english: 'My luggage is lost.',                         emoji: '🧳', tip: 'At the station/airport/help desk.' },
  { hindi: 'मुझे होटल चाहिए।',                  roman: 'Mujhe hotel chahiye.',                   english: 'I need a hotel.',                             emoji: '🏨', tip: 'Answer: यह होटल पास में है।' },
  { hindi: 'चेक-इन कब है?',                     roman: 'Check-in kab hai?',                      english: 'When is check-in?',                            emoji: '🛎️', tip: 'Answer: ___ बजे।' },
  { hindi: 'बाथरूम कहाँ है?',                   roman: 'Bathroom kahaan hai?',                   english: 'Where is the bathroom?',                      emoji: '🚻', tip: 'Also heard: टॉयलेट कहाँ है?' },
  { hindi: 'मदद कीजिए, मैं रास्ता भूल गया/गई।',  roman: 'Madad kijiye, main raasta bhool gaya/gayi.', english: 'Help, I got lost.',                        emoji: '🆘', tip: 'गया (male) / गई (female) — choose your form.' },
  { hindi: 'क्या आप अंग्रेज़ी बोलते हैं?',      roman: 'Kya aap angrezi bolte hain?',            english: 'Do you speak English?',                       emoji: '🗣️', tip: 'Helps when you need support.' },
]

/* ── Talking to Strangers ─────────────────────────────────── */
const STRANGERS = [
  { hindi: 'आपका नाम क्या है?',          roman: 'Aapka naam kya hai?',             english: 'What is your name?',                        emoji: '👤', tip: 'आपका (your) + नाम (name) + क्या है (what is)' },
  { hindi: 'मेरा नाम ___ है।',            roman: 'Mera naam ___ hai.',              english: 'My name is ___.',                           emoji: '🙋', tip: 'मेरा (my) + नाम (name) + है (is)' },
  { hindi: 'आप कहाँ से हैं?',             roman: 'Aap kahaan se hain?',             english: 'Where are you from?',                       emoji: '🌍', tip: 'कहाँ से (from where) + हैं (are)' },
  { hindi: 'मैं ___ से हूँ।',             roman: 'Main ___ se hoon.',               english: 'I am from ___.',                            emoji: '🏙️', tip: 'Fill the blank with your city or country' },
  { hindi: 'आप कहाँ रहते हैं?',           roman: 'Aap kahaan rahte hain?',          english: 'Where do you live?',                        emoji: '🏠', tip: 'कहाँ (where) + रहते हैं (do you live)' },
  { hindi: 'क्या मैं आपका नाम जान सकता हूँ?', roman: 'Kya main aapka naam jaan sakta hoon?', english: 'May I know your name?',            emoji: '🙏', tip: 'Polite way to ask someone\'s name' },
  { hindi: 'आपसे मिलकर खुशी हुई।',        roman: 'Aapse milkar khushi hui.',        english: 'Nice to meet you.',                         emoji: '🤝', tip: 'आपसे (with you) + मिलकर (meeting) + खुशी हुई (felt happy)' },
  { hindi: 'आप क्या काम करते हैं?',        roman: 'Aap kya kaam karte hain?',        english: 'What do you do (for work)?',                emoji: '💼', tip: 'काम (work) + करते हैं (do)' },
  { hindi: 'क्या आप हिंदी बोलते हैं?',    roman: 'Kya aap Hindi bolte hain?',      english: 'Do you speak Hindi?',                       emoji: '🗣️', tip: 'क्या starts a yes/no question' },
  { hindi: 'मैं थोड़ी हिंदी बोलता हूँ।',  roman: 'Main thodi Hindi bolta hoon.',   english: 'I speak a little Hindi.',                   emoji: '😊', tip: 'थोड़ी = a little' },
  { hindi: 'क्या आप मुझे रास्ता बता सकते हैं?', roman: 'Kya aap mujhe raasta bata sakte hain?', english: 'Can you show me the way?',        emoji: '🗺️', tip: 'Useful when lost in a new place' },
  { hindi: 'यहाँ नज़दीक में क्या है?',      roman: 'Yahaan nazdeek mein kya hai?',    english: 'What is nearby here?',                      emoji: '📍', tip: 'नज़दीक = nearby' },
  { hindi: 'मुझे मदद चाहिए।',             roman: 'Mujhe madad chahiye.',            english: 'I need help.',                              emoji: '🆘', tip: 'मदद (help) + चाहिए (need)' },
  { hindi: 'आपका बहुत-बहुत धन्यवाद।',     roman: 'Aapka bahut-bahut dhanyavaad.',   english: 'Thank you very much.',                      emoji: '🙏', tip: 'बहुत-बहुत = very very (emphatic)' },
  { hindi: 'क्षमा कीजिए, मैं समझा नहीं।', roman: 'Kshama kijiye, main samjha nahin.', english: 'Excuse me, I didn\'t understand.',        emoji: '😅', tip: 'Polite way to say you missed something' },
  { hindi: 'कृपया धीरे बोलिए।',           roman: 'Kripaya dheere boliye.',          english: 'Please speak slowly.',                      emoji: '🐢', tip: 'कृपया (please) + धीरे (slowly)' },
  { hindi: 'यह कहाँ है?',                 roman: 'Yah kahaan hai?',                 english: 'Where is this?',                            emoji: '❓', tip: 'Short and useful for asking any location' },
  { hindi: 'कितनी दूर है?',               roman: 'Kitni door hai?',                 english: 'How far is it?',                            emoji: '📏', tip: 'दूर = far' },
  { hindi: 'सीधे जाइए।',                  roman: 'Seedhe jaaiye.',                  english: 'Go straight.',                              emoji: '⬆️', tip: 'सीधे = straight' },
  { hindi: 'बाईं तरफ मुड़िए।',            roman: 'Baayin taraf modiye.',            english: 'Turn left.',                                emoji: '⬅️', tip: 'बाईं (left) + तरफ (direction)' },
  { hindi: 'दाईं तरफ मुड़िए।',            roman: 'Daayin taraf modiye.',            english: 'Turn right.',                               emoji: '➡️', tip: 'दाईं (right) + तरफ (direction)' },
  { hindi: 'आप बहुत दयालु हैं।',           roman: 'Aap bahut dayalu hain.',          english: 'You are very kind.',                        emoji: '💛', tip: 'दयालु = kind / generous' },
  { hindi: 'अलविदा!',                     roman: 'Alvida!',                         english: 'Goodbye!',                                  emoji: '👋', tip: 'A warm farewell to someone you\'ve just met' },
]

/* ── Tabs config ──────────────────────────────────────────── */
const SECTIONS = [
  { id: 'phrases',   label: '💬 Everyday Phrases', items: PHRASES,   color: '#4D96FF' },
  { id: 'sentences', label: '📝 Sentence Patterns', items: SENTENCES, color: '#FF9800', hasTip: true },
  { id: 'travel',    label: '✈️ Travel Talk',       items: TRAVEL_TALK, color: '#4D96FF', hasTip: true },
  { id: 'strangers', label: '🤝 Meeting People',    items: STRANGERS, color: '#4CAF50', hasTip: true },
]

/* ── Card components ──────────────────────────────────────── */
function PhraseCard({ item, color }) {
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

export default function Phrases() {
  const { addStars, markComplete, earnBadge, showCelebration, completed } = useApp()
  const [sectionIdx, setSectionIdx] = useState(0)
  const section = SECTIONS[sectionIdx]
  const isDone = completed.includes('phrases-' + section.id)

  const handleComplete = () => {
    if (!isDone) {
      addStars(5)
      markComplete('phrases-' + section.id)
      earnBadge('phrases-' + section.id)
      showCelebration(`${section.label} Complete!`, '+5 ⭐ earned!')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">💬 Phrases & Conversations</h1>
        <p className="page-sub">Tap any card to hear it spoken — learn to talk in Hindi!</p>
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
        {section.items.map((item, i) => (
          <PhraseCard key={i} item={item} color={section.color} />
        ))}
      </div>

      <div className="lesson-actions">
        <button
          className={'btn btn-green' + (isDone ? ' done' : '')}
          onClick={handleComplete}
        >
          {isDone ? '✅ Done! +5 ⭐ earned' : '✅ Mark Section Complete (+5 ⭐)'}
        </button>
      </div>
    </Layout>
  )
}
