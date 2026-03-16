import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speak'

/* ── Verbs ────────────────────────────────────────────────── */
const VERBS = [
  { hindi: 'खाना',      roman: 'khaana',     english: 'To Eat',        emoji: '🍽️' },
  { hindi: 'पीना',      roman: 'peena',      english: 'To Drink',      emoji: '💧' },
  { hindi: 'जाना',      roman: 'jaana',      english: 'To Go',         emoji: '🚶' },
  { hindi: 'आना',       roman: 'aana',       english: 'To Come',       emoji: '👋' },
  { hindi: 'सोना',      roman: 'sona',       english: 'To Sleep',      emoji: '😴' },
  { hindi: 'खेलना',     roman: 'khelna',     english: 'To Play',       emoji: '🎮' },
  { hindi: 'पढ़ना',     roman: 'padhna',     english: 'To Study',      emoji: '📖' },
  { hindi: 'लिखना',     roman: 'likhna',     english: 'To Write',      emoji: '✍️' },
  { hindi: 'बोलना',     roman: 'bolna',      english: 'To Speak',      emoji: '🗣️' },
  { hindi: 'देखना',     roman: 'dekhna',     english: 'To See',        emoji: '👀' },
  { hindi: 'दौड़ना',    roman: 'daudhna',    english: 'To Run',        emoji: '🏃' },
  { hindi: 'कूदना',     roman: 'koodna',     english: 'To Jump',       emoji: '🤸' },
  { hindi: 'बैठना',     roman: 'baithna',    english: 'To Sit',        emoji: '🪑' },
  { hindi: 'खड़ा होना', roman: 'khada hona', english: 'To Stand',      emoji: '🧍' },
  { hindi: 'चलना',      roman: 'chalna',     english: 'To Walk',       emoji: '🚶' },
  { hindi: 'हँसना',     roman: 'hansna',     english: 'To Laugh',      emoji: '😄' },
  { hindi: 'रोना',      roman: 'rona',       english: 'To Cry',        emoji: '😢' },
  { hindi: 'गाना',      roman: 'gaana',      english: 'To Sing',       emoji: '🎵' },
  { hindi: 'नाचना',     roman: 'naachna',    english: 'To Dance',      emoji: '💃' },
  { hindi: 'पकाना',     roman: 'pakaana',    english: 'To Cook',       emoji: '🍳' },
  { hindi: 'धोना',      roman: 'dhona',      english: 'To Wash',       emoji: '🧼' },
  { hindi: 'पहनना',     roman: 'pahanna',    english: 'To Wear',       emoji: '👕' },
  { hindi: 'खरीदना',    roman: 'kharidna',   english: 'To Buy',        emoji: '🛒' },
  { hindi: 'देना',      roman: 'dena',       english: 'To Give',       emoji: '🤝' },
  { hindi: 'लेना',      roman: 'lena',       english: 'To Take',       emoji: '🤲' },
  { hindi: 'खोलना',     roman: 'kholna',     english: 'To Open',       emoji: '🔓' },
  { hindi: 'बंद करना',  roman: 'band karna', english: 'To Close',      emoji: '🔒' },
  { hindi: 'उठाना',     roman: 'uthaana',    english: 'To Lift',       emoji: '🏋️' },
  { hindi: 'सुनना',     roman: 'sunna',      english: 'To Listen',     emoji: '👂' },
  { hindi: 'सोचना',     roman: 'sochna',     english: 'To Think',      emoji: '🤔' },
  { hindi: 'समझना',     roman: 'samajhna',   english: 'To Understand', emoji: '💡' },
  { hindi: 'जानना',     roman: 'jaanna',     english: 'To Know',       emoji: '🧠' },
  { hindi: 'मदद करना',  roman: 'madad karna',english: 'To Help',       emoji: '🤝' },
  { hindi: 'मिलना',     roman: 'milna',      english: 'To Meet',       emoji: '🤗' },
  { hindi: 'पूछना',     roman: 'poochhna',   english: 'To Ask',        emoji: '❓' },
  { hindi: 'बताना',     roman: 'bataana',    english: 'To Tell',       emoji: '💬' },
  { hindi: 'छूना',      roman: 'chhoona',    english: 'To Touch',      emoji: '🫵' },
  { hindi: 'खींचना',    roman: 'kheenchna',  english: 'To Pull',       emoji: '⬅️' },
  { hindi: 'धकेलना',    roman: 'dhakhelna',  english: 'To Push',       emoji: '➡️' },
  { hindi: 'उड़ना',     roman: 'udna',       english: 'To Fly',        emoji: '✈️' },
]

/* ── Adjectives ───────────────────────────────────────────── */
const ADJECTIVES = [
  { hindi: 'बड़ा',        roman: 'bada',       english: 'Big / Large',      emoji: '🔵' },
  { hindi: 'छोटा',       roman: 'chhota',     english: 'Small / Little',   emoji: '🔹' },
  { hindi: 'अच्छा',      roman: 'achha',      english: 'Good',             emoji: '👍' },
  { hindi: 'बुरा',       roman: 'bura',       english: 'Bad',              emoji: '👎' },
  { hindi: 'गर्म',       roman: 'garm',       english: 'Hot / Warm',       emoji: '🔥' },
  { hindi: 'ठंडा',       roman: 'thanda',     english: 'Cold',             emoji: '❄️' },
  { hindi: 'नया',        roman: 'naya',       english: 'New',              emoji: '✨' },
  { hindi: 'पुराना',     roman: 'puraana',    english: 'Old',              emoji: '🕰️' },
  { hindi: 'सुंदर',      roman: 'sundar',     english: 'Beautiful',        emoji: '😍' },
  { hindi: 'लंबा',       roman: 'lamba',      english: 'Tall / Long',      emoji: '📏' },
  { hindi: 'मोटा',       roman: 'mota',       english: 'Fat / Thick',      emoji: '🔴' },
  { hindi: 'पतला',       roman: 'patla',      english: 'Thin / Slim',      emoji: '📉' },
  { hindi: 'भारी',       roman: 'bhaari',     english: 'Heavy',            emoji: '⚖️' },
  { hindi: 'हल्का',      roman: 'halka',      english: 'Light (weight)',   emoji: '🪶' },
  { hindi: 'मीठा',       roman: 'meetha',     english: 'Sweet',            emoji: '🍬' },
  { hindi: 'खट्टा',      roman: 'khatta',     english: 'Sour',             emoji: '🍋' },
  { hindi: 'कड़वा',      roman: 'kadwa',      english: 'Bitter',           emoji: '😣' },
  { hindi: 'नमकीन',      roman: 'namkeen',    english: 'Salty',            emoji: '🧂' },
  { hindi: 'मसालेदार',   roman: 'masaledaar', english: 'Spicy',            emoji: '🌶️' },
  { hindi: 'सख्त',       roman: 'sakht',      english: 'Hard / Strict',    emoji: '💪' },
  { hindi: 'नरम',        roman: 'naram',      english: 'Soft',             emoji: '🧸' },
  { hindi: 'साफ़',        roman: 'saaf',       english: 'Clean',            emoji: '✨' },
  { hindi: 'गंदा',       roman: 'ganda',      english: 'Dirty',            emoji: '🤢' },
  { hindi: 'तेज़',        roman: 'tez',        english: 'Fast / Sharp',     emoji: '⚡' },
  { hindi: 'धीमा',       roman: 'dheema',     english: 'Slow',             emoji: '🐢' },
  { hindi: 'खुश',        roman: 'khush',      english: 'Happy',            emoji: '😊' },
  { hindi: 'दुखी',       roman: 'dukhi',      english: 'Sad',              emoji: '😢' },
  { hindi: 'थका',        roman: 'thaka',      english: 'Tired',            emoji: '😴' },
  { hindi: 'ताज़ा',       roman: 'taaza',      english: 'Fresh',            emoji: '🌿' },
  { hindi: 'पक्का',      roman: 'pakka',      english: 'Ripe / Sure',      emoji: '✅' },
  { hindi: 'कच्चा',      roman: 'kachha',     english: 'Raw / Unripe',     emoji: '🥦' },
  { hindi: 'अमीर',       roman: 'ameer',      english: 'Rich / Wealthy',   emoji: '💰' },
  { hindi: 'गरीब',       roman: 'gareeb',     english: 'Poor',             emoji: '🪙' },
  { hindi: 'चालाक',      roman: 'chalaak',    english: 'Clever / Smart',   emoji: '🧠' },
  { hindi: 'बहादुर',     roman: 'bahadur',    english: 'Brave',            emoji: '🦁' },
  { hindi: 'प्यारा',     roman: 'pyaara',     english: 'Cute / Lovely',    emoji: '🥰' },
  { hindi: 'मज़ेदार',    roman: 'mazedaar',   english: 'Fun / Interesting', emoji: '🎉' },
  { hindi: 'ऊँचा',       roman: 'ooncha',     english: 'High / Tall',      emoji: '🏔️' },
  { hindi: 'नीचा',       roman: 'neecha',     english: 'Low / Short',      emoji: '📉' },
  { hindi: 'गहरा',       roman: 'gahra',      english: 'Deep / Dark',      emoji: '🌊' },
]

/* ── Pronouns ─────────────────────────────────────────────── */
const PRONOUNS = [
  { hindi: 'मैं',       roman: 'main',      english: 'I',                      emoji: '🙋' },
  { hindi: 'तुम',       roman: 'tum',       english: 'You (informal)',          emoji: '👉' },
  { hindi: 'आप',        roman: 'aap',       english: 'You (respectful)',        emoji: '🙏' },
  { hindi: 'वह',        roman: 'vah',       english: 'He / She / It',          emoji: '🧑' },
  { hindi: 'हम',        roman: 'hum',       english: 'We',                     emoji: '👥' },
  { hindi: 'वे',        roman: 've',        english: 'They',                   emoji: '👥' },
  { hindi: 'यह',        roman: 'yeh',       english: 'This / He / She (near)', emoji: '👈' },
  { hindi: 'ये',        roman: 'ye',        english: 'These / They',           emoji: '👈' },
  { hindi: 'वो',        roman: 'vo',        english: 'That one / He / She',    emoji: '👉' },
  { hindi: 'मुझे',      roman: 'mujhe',     english: 'To me / Me (object)',    emoji: '🙋' },
  { hindi: 'तुम्हें',   roman: 'tumhein',   english: 'To you',                 emoji: '👉' },
  { hindi: 'उसे',       roman: 'use',       english: 'To him / To her',        emoji: '🧑' },
  { hindi: 'हमें',      roman: 'hamein',    english: 'To us',                  emoji: '👥' },
  { hindi: 'उन्हें',    roman: 'unhein',    english: 'To them',                emoji: '👥' },
  { hindi: 'मेरा',      roman: 'mera',      english: 'My / Mine (masc.)',      emoji: '🏷️' },
  { hindi: 'मेरी',      roman: 'meri',      english: 'My / Mine (fem.)',       emoji: '🏷️' },
  { hindi: 'तुम्हारा',  roman: 'tumhaara',  english: 'Your / Yours',           emoji: '🏷️' },
  { hindi: 'आपका',      roman: 'aapka',     english: 'Your (formal)',          emoji: '🏷️' },
  { hindi: 'उसका',      roman: 'uska',      english: 'His / Her / Its',        emoji: '🏷️' },
  { hindi: 'हमारा',     roman: 'hamaara',   english: 'Our / Ours',             emoji: '🏷️' },
  { hindi: 'उनका',      roman: 'unka',      english: 'Their / Theirs',         emoji: '🏷️' },
  { hindi: 'खुद',       roman: 'khud',      english: 'Self / Own',             emoji: '🪞' },
  { hindi: 'कोई',       roman: 'koi',       english: 'Someone / Anyone',       emoji: '🤷' },
  { hindi: 'सब',        roman: 'sab',       english: 'Everyone / All',         emoji: '👨‍👩‍👧‍👦' },
  { hindi: 'कुछ',       roman: 'kuch',      english: 'Something / Some',       emoji: '🔹' },
  { hindi: 'कोई नहीं',  roman: 'koi nahin', english: 'Nobody / No one',        emoji: '🚫' },
  { hindi: 'कुछ नहीं',  roman: 'kuch nahin',english: 'Nothing',                emoji: '🚫' },
  { hindi: 'इसका',      roman: 'iska',      english: 'Of this / Its',          emoji: '📌' },
  { hindi: 'अपना',      roman: 'apna',      english: "One's own",              emoji: '🪞' },
  { hindi: 'दूसरा',     roman: 'doosra',    english: 'Other / Another',        emoji: '2️⃣' },
]

/* ── "To Be" (होना) forms ──────────────────────────────── */
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

/* ── Conjunctions ─────────────────────────────────────────── */
const CONJUNCTIONS = [
  { hindi: 'और',      roman: 'aur',       english: 'And',                     emoji: '➕' },
  { hindi: 'लेकिन',   roman: 'lekin',     english: 'But',                     emoji: '⚡' },
  { hindi: 'या',      roman: 'ya',        english: 'Or',                      emoji: '🔄' },
  { hindi: 'क्योंकि', roman: 'kyoonki',   english: 'Because',                 emoji: '❓' },
  { hindi: 'इसलिए',   roman: 'isliye',    english: 'Therefore / So',          emoji: '➡️' },
  { hindi: 'अगर',     roman: 'agar',      english: 'If',                      emoji: '🤔' },
  { hindi: 'तो',      roman: 'to',        english: 'Then',                    emoji: '⏩' },
  { hindi: 'जब',      roman: 'jab',       english: 'When (then)',             emoji: '🕐' },
  { hindi: 'जब तक',   roman: 'jab tak',   english: 'Until / As long as',      emoji: '⏳' },
  { hindi: 'जैसे',    roman: 'jaise',     english: 'Like / As / Just as',     emoji: '🔁' },
  { hindi: 'फिर भी',  roman: 'phir bhi',  english: 'Even then / Still',       emoji: '💪' },
  { hindi: 'ताकि',    roman: 'taaki',     english: 'So that',                 emoji: '🎯' },
  { hindi: 'बल्कि',   roman: 'balki',     english: 'Rather / But rather',     emoji: '🔃' },
  { hindi: 'चाहे',    roman: 'chaahe',    english: 'Whether / No matter',     emoji: '🌀' },
  { hindi: 'भले ही',  roman: 'bhale hi',  english: 'Even if / Although',      emoji: '🤷' },
  { hindi: 'तथा',     roman: 'tatha',     english: 'And / Also (formal)',     emoji: '➕' },
  { hindi: 'साथ ही',  roman: 'saath hi',  english: 'Along with / Also',       emoji: '🤝' },
  { hindi: 'वरना',    roman: 'varna',     english: 'Otherwise',               emoji: '⚠️' },
  { hindi: 'नहीं तो', roman: 'nahin to',  english: 'Or else',                 emoji: '❗' },
  { hindi: 'न…न',     roman: 'na...na',   english: 'Neither...nor',           emoji: '🚫' },
  { hindi: 'दोनों',   roman: 'dono',      english: 'Both',                    emoji: '👥' },
  { hindi: 'हालाँकि', roman: 'haalaanki', english: 'Although / However',      emoji: '🔍' },
  { hindi: 'मानो',    roman: 'maano',     english: 'As if / Suppose',         emoji: '💭' },
  { hindi: 'चूँकि',   roman: 'choonki',   english: 'Since / As (causal)',     emoji: '↩️' },
  { hindi: 'परंतु',   roman: 'parantu',   english: 'But / However (formal)',  emoji: '✋' },
  { hindi: 'किंतु',   roman: 'kintu',     english: 'But (literary)',          emoji: '📜' },
  { hindi: 'अथवा',    roman: 'athva',     english: 'Or (formal)',             emoji: '📝' },
  { hindi: 'जो',      roman: 'jo',        english: 'Who / Which (relative)',  emoji: '🔗' },
  { hindi: 'जहाँ',    roman: 'jahaan',    english: 'Where (relative)',        emoji: '📍' },
  { hindi: 'जितना',   roman: 'jitna',     english: 'As much as',              emoji: '⚖️' },
]

/* ── Adverbs ──────────────────────────────────────────────── */
const ADVERBS = [
  { hindi: 'यहाँ',       roman: 'yahaan',     english: 'Here',                emoji: '📍' },
  { hindi: 'वहाँ',       roman: 'vahaan',     english: 'There',               emoji: '👉' },
  { hindi: 'कहाँ',       roman: 'kahaan',     english: 'Where',               emoji: '🗺️' },
  { hindi: 'अब',         roman: 'ab',         english: 'Now',                 emoji: '⏰' },
  { hindi: 'तब',         roman: 'tab',        english: 'Then',                emoji: '⏳' },
  { hindi: 'कभी',        roman: 'kabhi',      english: 'Sometimes / Ever',    emoji: '🔄' },
  { hindi: 'हमेशा',      roman: 'hamesha',    english: 'Always',              emoji: '♾️' },
  { hindi: 'कभी नहीं',   roman: 'kabhi nahin',english: 'Never',               emoji: '🚫' },
  { hindi: 'जल्दी',      roman: 'jaldi',      english: 'Quickly / Early',     emoji: '⚡' },
  { hindi: 'धीरे',       roman: 'dheere',     english: 'Slowly',              emoji: '🐢' },
  { hindi: 'बहुत',       roman: 'bahut',      english: 'Very / A lot',        emoji: '💯' },
  { hindi: 'थोड़ा',      roman: 'thoda',      english: 'A little / Somewhat', emoji: '🔹' },
  { hindi: 'बिल्कुल',    roman: 'bilkul',     english: 'Absolutely / Exactly',emoji: '✅' },
  { hindi: 'शायद',       roman: 'shaayad',    english: 'Maybe / Perhaps',     emoji: '🤔' },
  { hindi: 'ज़रूर',       roman: 'zaroor',     english: 'Certainly / Sure',    emoji: '💪' },
  { hindi: 'सिर्फ',      roman: 'sirf',       english: 'Only / Just',         emoji: '☝️' },
  { hindi: 'भी',         roman: 'bhi',        english: 'Also / Too / Even',   emoji: '➕' },
  { hindi: 'नहीं',       roman: 'nahin',      english: 'No / Not',            emoji: '❌' },
  { hindi: 'हाँ',        roman: 'haan',       english: 'Yes',                 emoji: '✅' },
  { hindi: 'साथ',        roman: 'saath',      english: 'Together / With',     emoji: '🤝' },
  { hindi: 'अलग',        roman: 'alag',       english: 'Separately',          emoji: '↔️' },
  { hindi: 'पहले',       roman: 'pahle',      english: 'Earlier / First',     emoji: '⏪' },
  { hindi: 'बाद में',    roman: 'baad mein',  english: 'Later / After',       emoji: '⏩' },
  { hindi: 'आज',         roman: 'aaj',        english: 'Today',               emoji: '☀️' },
  { hindi: 'कल',         roman: 'kal',        english: 'Yesterday / Tomorrow',emoji: '📆' },
  { hindi: 'रोज़',        roman: 'roz',        english: 'Daily / Every day',   emoji: '📅' },
  { hindi: 'अभी',        roman: 'abhi',       english: 'Right now',           emoji: '⚡' },
  { hindi: 'जल्द ही',    roman: 'jald hi',    english: 'Soon',                emoji: '🔜' },
  { hindi: 'ऊपर',        roman: 'oopar',      english: 'Above / Up',          emoji: '⬆️' },
  { hindi: 'नीचे',       roman: 'neeche',     english: 'Below / Down',        emoji: '⬇️' },
]

/* ── Prepositions ─────────────────────────────────────────── */
const PREPOSITIONS = [
  { hindi: 'में',        roman: 'mein',       english: 'In / Inside',         emoji: '📦' },
  { hindi: 'पर',         roman: 'par',        english: 'On / At / Upon',      emoji: '🔝' },
  { hindi: 'से',         roman: 'se',         english: 'From / By / With',    emoji: '↩️' },
  { hindi: 'को',         roman: 'ko',         english: 'To / For',            emoji: '🎯' },
  { hindi: 'के',         roman: 'ke',         english: 'Of (connector)',      emoji: '🔗' },
  { hindi: 'के लिए',    roman: 'ke liye',    english: 'For / For the sake of',emoji: '🎁' },
  { hindi: 'के साथ',    roman: 'ke saath',   english: 'With / Along with',   emoji: '🤝' },
  { hindi: 'के बिना',   roman: 'ke bina',    english: 'Without',             emoji: '🚫' },
  { hindi: 'के पास',    roman: 'ke paas',    english: 'Near / With (having)',emoji: '📍' },
  { hindi: 'के ऊपर',    roman: 'ke oopar',   english: 'Above / Over',        emoji: '⬆️' },
  { hindi: 'के नीचे',   roman: 'ke neeche',  english: 'Below / Under',       emoji: '⬇️' },
  { hindi: 'के अंदर',   roman: 'ke andar',   english: 'Inside',              emoji: '📦' },
  { hindi: 'के बाहर',   roman: 'ke baahar',  english: 'Outside',             emoji: '🚪' },
  { hindi: 'के आगे',    roman: 'ke aage',    english: 'In front of / Ahead', emoji: '⬆️' },
  { hindi: 'के पीछे',   roman: 'ke peeche',  english: 'Behind / After',      emoji: '⬇️' },
  { hindi: 'के बाई ओर', roman: 'ke baai or', english: 'To the left of',      emoji: '⬅️' },
  { hindi: 'के दाई ओर', roman: 'ke daai or', english: 'To the right of',     emoji: '➡️' },
  { hindi: 'के बीच',    roman: 'ke beech',   english: 'Between / Among',     emoji: '↔️' },
  { hindi: 'के पहले',   roman: 'ke pahle',   english: 'Before',              emoji: '⏪' },
  { hindi: 'के बाद',    roman: 'ke baad',    english: 'After',               emoji: '⏩' },
  { hindi: 'के दौरान',  roman: 'ke dauran',  english: 'During',              emoji: '⏱️' },
  { hindi: 'के खिलाफ',  roman: 'ke khilaaf', english: 'Against',             emoji: '⚔️' },
  { hindi: 'के बारे में',roman: 'ke baare mein',english: 'About / Regarding', emoji: '💬' },
  { hindi: 'के अनुसार', roman: 'ke anusaar', english: 'According to',        emoji: '📋' },
  { hindi: 'तक',         roman: 'tak',        english: 'Until / Till / Up to',emoji: '🛤️' },
  { hindi: 'पर से',      roman: 'par se',     english: 'From on top of',      emoji: '⬇️' },
  { hindi: 'की तरफ',    roman: 'ki taraf',   english: 'Towards',             emoji: '➡️' },
  { hindi: 'की जगह',    roman: 'ki jagah',   english: 'Instead of',          emoji: '🔀' },
  { hindi: 'की तरह',    roman: 'ki tarah',   english: 'Like / Similar to',   emoji: '🔁' },
  { hindi: 'के साथ साथ',roman: 'ke saath saath',english: 'Along with / Simultaneously',emoji: '🤝' },
]

/* ── Tabs config ──────────────────────────────────────────── */
const SECTIONS = [
  { id: 'verbs',          label: '🏃 Verbs',          items: VERBS,          color: '#FF85A1' },
  { id: 'adjectives',     label: '✨ Adjectives',      items: ADJECTIVES,     color: '#FF5722' },
  { id: 'adverbs',        label: '💨 Adverbs',         items: ADVERBS,        color: '#FF9800' },
  { id: 'pronouns',       label: '👤 Pronouns',        items: PRONOUNS,       color: '#9C27B0' },
  { id: 'hona',           label: '✅ Hoon / Ho / Hai / Hain', items: HONA,     color: '#6C63FF' },
  { id: 'gender',         label: '👦👧 Masculine & Feminine',  items: GENDER,  color: '#FF85A1' },
  { id: 'number',         label: '1️⃣👥 Singular & Plural',     items: NUMBER,  color: '#2196F3' },
  { id: 'tenses',         label: '⏳ Tenses',                  items: TENSES,  color: '#FF9800' },
  { id: 'prepositions',   label: '📌 Prepositions',    items: PREPOSITIONS,   color: '#2196F3' },
  { id: 'question-words', label: '❓ Question Words',  items: QUESTION_WORDS, color: '#E91E8C' },
  { id: 'conjunctions',   label: '🔗 Conjunctions',    items: CONJUNCTIONS,   color: '#00BCD4' },
]

/* ── Card component ───────────────────────────────────────── */
function WordCard({ item, color }) {
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

export default function PartsOfSpeech() {
  const { addStars, markComplete, earnBadge, showCelebration, completed } = useApp()
  const [sectionIdx, setSectionIdx] = useState(0)
  const section = SECTIONS[sectionIdx]
  const isDone = completed.includes('pos-' + section.id)

  const subtitle = section.id === 'hona'
    ? 'Learn when to use हूँ / हो / है / हैं — the Hindi “to be” (होना) helpers.'
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
      markComplete('pos-' + section.id)
      earnBadge('pos-' + section.id)
      showCelebration(`${section.label} Complete!`, '+5 ⭐ earned!')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">📖 Parts of Speech</h1>
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
        {section.items.map((item, i) => (
          <WordCard key={i} item={item} color={section.color} />
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
