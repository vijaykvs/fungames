import { useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speak'

const THEMES = {
  animals: {
    label: '🐾 Animals',
    color: '#FF6B6B',
    words: [
      { hindi: 'कुत्ता',       roman: 'kutta',        english: 'Dog',         emoji: '🐕' },
      { hindi: 'बिल्ली',       roman: 'billi',        english: 'Cat',         emoji: '🐱' },
      { hindi: 'हाथी',         roman: 'haathi',       english: 'Elephant',    emoji: '🐘' },
      { hindi: 'शेर',          roman: 'sher',         english: 'Lion',        emoji: '🦁' },
      { hindi: 'बंदर',         roman: 'bandar',       english: 'Monkey',      emoji: '🐵' },
      { hindi: 'गाय',          roman: 'gaay',         english: 'Cow',         emoji: '🐄' },
      { hindi: 'मछली',         roman: 'machhli',      english: 'Fish',        emoji: '🐟' },
      { hindi: 'तोता',         roman: 'tota',         english: 'Parrot',      emoji: '🦜' },
      { hindi: 'खरगोश',        roman: 'khargosh',     english: 'Rabbit',      emoji: '🐰' },
      { hindi: 'मोर',          roman: 'mor',          english: 'Peacock',     emoji: '🦚' },
      { hindi: 'बाघ',          roman: 'baagh',        english: 'Tiger',       emoji: '🐯' },
      { hindi: 'भालू',         roman: 'bhaalu',       english: 'Bear',        emoji: '🐻' },
      { hindi: 'घोड़ा',        roman: 'ghoda',        english: 'Horse',       emoji: '🐴' },
      { hindi: 'बकरी',         roman: 'bakri',        english: 'Goat',        emoji: '🐐' },
      { hindi: 'भेड़',          roman: 'bhed',         english: 'Sheep',       emoji: '🐑' },
      { hindi: 'बतख',          roman: 'batakh',       english: 'Duck',        emoji: '🦆' },
      { hindi: 'मुर्गी',        roman: 'murgi',        english: 'Hen',         emoji: '🐔' },
      { hindi: 'साँप',         roman: 'saanp',        english: 'Snake',       emoji: '🐍' },
      { hindi: 'हिरण',         roman: 'hiran',        english: 'Deer',        emoji: '🦌' },
      { hindi: 'ऊँट',          roman: 'oont',         english: 'Camel',       emoji: '🐪' },
      { hindi: 'भैंस',         roman: 'bhains',       english: 'Buffalo',     emoji: '🐃' },
      { hindi: 'गधा',          roman: 'gadha',        english: 'Donkey',      emoji: '🫏' },
      { hindi: 'कौआ',          roman: 'kaua',         english: 'Crow',        emoji: '🐦‍⬛' },
      { hindi: 'उल्लू',        roman: 'ullu',         english: 'Owl',         emoji: '🦉' },
      { hindi: 'मेंढक',        roman: 'mendhak',      english: 'Frog',        emoji: '🐸' },
      { hindi: 'तितली',        roman: 'titli',        english: 'Butterfly',   emoji: '🦋' },
      { hindi: 'मधुमक्खी',     roman: 'madhumakhi',   english: 'Bee',         emoji: '🐝' },
      { hindi: 'मकड़ी',        roman: 'makdi',        english: 'Spider',      emoji: '🕷️' },
      { hindi: 'चींटी',        roman: 'cheenti',      english: 'Ant',         emoji: '🐜' },
      { hindi: 'कबूतर',        roman: 'kabutar',      english: 'Pigeon',      emoji: '🕊️' },
      { hindi: 'लोमड़ी',       roman: 'lomdi',        english: 'Fox',         emoji: '🦊' },
      { hindi: 'बाज़',         roman: 'baaz',         english: 'Eagle',       emoji: '🦅' },
      { hindi: 'जिराफ़',       roman: 'jiraaf',       english: 'Giraffe',     emoji: '🦒' },
      { hindi: 'ज़ेब्रा',       roman: 'zebra',        english: 'Zebra',       emoji: '🦓' },
      { hindi: 'गैंडा',        roman: 'gainda',       english: 'Rhino',       emoji: '🦏' },
      { hindi: 'दरियाई घोड़ा', roman: 'dariyaai ghoda', english: 'Hippo',    emoji: '🦛' },
      { hindi: 'पेंगुइन',      roman: 'penguin',      english: 'Penguin',     emoji: '🐧' },
      { hindi: 'गिलहरी',       roman: 'gilhari',      english: 'Squirrel',    emoji: '🐿️' },
      { hindi: 'सूअर',         roman: 'suar',         english: 'Pig',         emoji: '🐷' },
      { hindi: 'भेड़िया',       roman: 'bhediya',      english: 'Wolf',        emoji: '🐺' },
    ],
  },
  food: {
    label: '🍎 Food',
    color: '#4ECDC4',
    words: [
      { hindi: 'चावल',   roman: 'chaawal',   english: 'Rice',        emoji: '🍚' },
      { hindi: 'रोटी',   roman: 'roti',      english: 'Roti',        emoji: '🫓' },
      { hindi: 'दाल',    roman: 'daal',      english: 'Lentils',     emoji: '🥣' },
      { hindi: 'सब्जी',  roman: 'sabzi',     english: 'Vegetables',  emoji: '🥦' },
      { hindi: 'दूध',    roman: 'doodh',     english: 'Milk',        emoji: '🥛' },
      { hindi: 'पानी',   roman: 'paani',     english: 'Water',       emoji: '💧' },
      { hindi: 'फल',    roman: 'phal',      english: 'Fruit',       emoji: '🍊' },
      { hindi: 'आम',    roman: 'aam',       english: 'Mango',       emoji: '🥭' },
      { hindi: 'केला',   roman: 'kela',      english: 'Banana',      emoji: '🍌' },
      { hindi: 'लड्डू',  roman: 'laddoo',    english: 'Laddoo',      emoji: '🍬' },
      { hindi: 'सेब',    roman: 'seb',       english: 'Apple',       emoji: '🍎' },
      { hindi: 'संतरा',  roman: 'santara',   english: 'Orange',      emoji: '🍊' },
      { hindi: 'अंगूर',  roman: 'angoor',    english: 'Grapes',      emoji: '🍇' },
      { hindi: 'अमरूद',  roman: 'amrood',    english: 'Guava',       emoji: '🍏' },
      { hindi: 'तरबूज़',  roman: 'tarbooz',   english: 'Watermelon',  emoji: '🍉' },
      { hindi: 'नारियल', roman: 'naariyal',  english: 'Coconut',     emoji: '🥥' },
      { hindi: 'अनार',   roman: 'anaar',     english: 'Pomegranate', emoji: '🍎' },
      { hindi: 'नींबू',  roman: 'neemboo',   english: 'Lemon',       emoji: '🍋' },
      { hindi: 'पपीता',  roman: 'papita',    english: 'Papaya',      emoji: '🍈' },
      { hindi: 'आलू',    roman: 'aalu',      english: 'Potato',      emoji: '🥔' },
      { hindi: 'टमाटर',  roman: 'tamatar',   english: 'Tomato',      emoji: '🍅' },
      { hindi: 'प्याज़',  roman: 'pyaaz',     english: 'Onion',       emoji: '🧅' },
      { hindi: 'गाजर',   roman: 'gaajar',    english: 'Carrot',      emoji: '🥕' },
      { hindi: 'पालक',   roman: 'paalak',    english: 'Spinach',     emoji: '🥬' },
      { hindi: 'चाय',    roman: 'chaay',     english: 'Tea',         emoji: '🍵' },
      { hindi: 'रस',     roman: 'ras',       english: 'Juice',       emoji: '🥤' },
      { hindi: 'चीनी',   roman: 'cheeni',    english: 'Sugar',       emoji: '🍬' },
      { hindi: 'नमक',    roman: 'namak',     english: 'Salt',        emoji: '🧂' },
      { hindi: 'घी',     roman: 'ghee',      english: 'Ghee',        emoji: '🫙' },
      { hindi: 'मक्खन',  roman: 'makkhan',   english: 'Butter',      emoji: '🧈' },
      { hindi: 'अंडा',   roman: 'anda',      english: 'Egg',         emoji: '🥚' },
      { hindi: 'दही',    roman: 'dahi',      english: 'Curd/Yogurt', emoji: '🥛' },
      { hindi: 'पनीर',   roman: 'paneer',    english: 'Paneer',      emoji: '🧀' },
      { hindi: 'समोसा',  roman: 'samosa',    english: 'Samosa',      emoji: '🥟' },
      { hindi: 'मिठाई',  roman: 'mithai',    english: 'Sweets',      emoji: '🍮' },
      { hindi: 'खीर',    roman: 'kheer',     english: 'Kheer',       emoji: '🍚' },
      { hindi: 'बिरयानी', roman: 'biryani',  english: 'Biryani',     emoji: '🍛' },
      { hindi: 'इडली',   roman: 'idli',      english: 'Idli',        emoji: '🍘' },
      { hindi: 'ब्रेड',  roman: 'bread',     english: 'Bread',       emoji: '🍞' },
      { hindi: 'चॉकलेट', roman: 'chocolate', english: 'Chocolate',   emoji: '🍫' },
    ],
  },
  kitchen: {
    label: '🍳 Kitchen',
    color: '#4ECDC4',
    words: [
      { hindi: 'रसोई',           roman: 'rasoi',           english: 'Kitchen',          emoji: '🏠' },
      { hindi: 'चूल्हा',          roman: 'chulha',          english: 'Stove',            emoji: '🔥' },
      { hindi: 'प्रेशर कुकर',    roman: 'pressure cooker', english: 'Pressure cooker',  emoji: '🫕' },
      { hindi: 'फ्रिज',          roman: 'frij',            english: 'Fridge',           emoji: '🧊' },
      { hindi: 'सिंक',           roman: 'sink',            english: 'Sink',             emoji: '🚰' },
      { hindi: 'नल',            roman: 'nal',             english: 'Tap / Faucet',      emoji: '🚰' },
      { hindi: 'बर्तन',          roman: 'bartan',          english: 'Utensils',          emoji: '🍽️' },
      { hindi: 'तवा',            roman: 'tawa',            english: 'Tawa / Griddle',    emoji: '🥘' },
      { hindi: 'कड़ाही',          roman: 'kadhai',          english: 'Kadhai / Wok',      emoji: '🍲' },
      { hindi: 'पतीला',          roman: 'patila',          english: 'Pot',              emoji: '🍯' },
      { hindi: 'चम्मच',          roman: 'chammach',        english: 'Spoon',            emoji: '🥄' },
      { hindi: 'कांटा',          roman: 'kaanta',          english: 'Fork',             emoji: '🍴' },
      { hindi: 'चाकू',           roman: 'chaaku',          english: 'Knife',            emoji: '🔪' },
      { hindi: 'कड़छी',          roman: 'karchhi',         english: 'Ladle',            emoji: '🥣' },
      { hindi: 'प्लेट',          roman: 'plate',           english: 'Plate',            emoji: '🍽️' },
      { hindi: 'कटोरा',          roman: 'katora',          english: 'Bowl',             emoji: '🥣' },
      { hindi: 'गिलास',          roman: 'gilaas',          english: 'Glass',            emoji: '🥛' },
      { hindi: 'कप',            roman: 'cup',             english: 'Cup',              emoji: '☕' },
      { hindi: 'बोतल',           roman: 'botal',           english: 'Bottle',           emoji: '🍼' },
      { hindi: 'डिब्बा',          roman: 'dibba',           english: 'Box / Container',  emoji: '📦' },
      { hindi: 'ढक्कन',          roman: 'dhakkan',         english: 'Lid',              emoji: '🧢' },
      { hindi: 'मसाले',          roman: 'masaale',         english: 'Spices',           emoji: '🫚' },
      { hindi: 'तेल',            roman: 'tel',             english: 'Oil',              emoji: '🫙' },
      { hindi: 'किचन तौलिया',     roman: 'kitchen tauliya', english: 'Kitchen towel',   emoji: '🧻' },
    ],
  },
  colors: {
    label: '🎨 Colors',
    color: '#FFD93D',
    words: [
      { hindi: 'लाल',        roman: 'laal',          english: 'Red',          emoji: '🔴' },
      { hindi: 'नीला',       roman: 'neela',         english: 'Blue',         emoji: '🔵' },
      { hindi: 'हरा',        roman: 'hara',          english: 'Green',        emoji: '🟢' },
      { hindi: 'पीला',       roman: 'peela',         english: 'Yellow',       emoji: '🟡' },
      { hindi: 'सफ़ेद',      roman: 'safed',         english: 'White',        emoji: '⚪' },
      { hindi: 'काला',       roman: 'kaala',         english: 'Black',        emoji: '⚫' },
      { hindi: 'नारंगी',     roman: 'narangi',       english: 'Orange',       emoji: '🟠' },
      { hindi: 'गुलाबी',     roman: 'gulaabi',       english: 'Pink',         emoji: '🩷' },
      { hindi: 'बैंगनी',     roman: 'baingani',      english: 'Purple',       emoji: '🟣' },
      { hindi: 'भूरा',       roman: 'bhoora',        english: 'Brown',        emoji: '🟤' },
      { hindi: 'स्लेटी',     roman: 'sleti',         english: 'Grey',         emoji: '🩶' },
      { hindi: 'सुनहरा',     roman: 'sunahara',      english: 'Golden',       emoji: '🌟' },
      { hindi: 'चाँदी',      roman: 'chaandi',       english: 'Silver',       emoji: '⚪' },
      { hindi: 'आसमानी',     roman: 'aasmani',       english: 'Sky Blue',     emoji: '🩵' },
      { hindi: 'मरून',       roman: 'maroon',        english: 'Maroon',       emoji: '🔴' },
      { hindi: 'फिरोज़ी',    roman: 'firozi',        english: 'Turquoise',    emoji: '🩵' },
      { hindi: 'जैतूनी',     roman: 'jaitooni',      english: 'Olive Green',  emoji: '🫒' },
      { hindi: 'मैजेंटा',    roman: 'magenta',       english: 'Magenta',      emoji: '💜' },
      { hindi: 'गहरा नीला',  roman: 'gahra neela',   english: 'Navy Blue',    emoji: '🔵' },
      { hindi: 'हल्का नीला', roman: 'halka neela',   english: 'Light Blue',   emoji: '🩵' },
      { hindi: 'गहरा हरा',   roman: 'gahra hara',    english: 'Dark Green',   emoji: '🟢' },
      { hindi: 'हल्का हरा',  roman: 'halka hara',    english: 'Light Green',  emoji: '💚' },
      { hindi: 'गहरा लाल',   roman: 'gahra laal',    english: 'Dark Red',     emoji: '❤️' },
      { hindi: 'इंडिगो',     roman: 'indigo',        english: 'Indigo',       emoji: '💙' },
      { hindi: 'मूँगा',      roman: 'moonga',        english: 'Coral',        emoji: '🪸' },
      { hindi: 'बेज',        roman: 'beige',         english: 'Beige',        emoji: '🤎' },
      { hindi: 'क्रीमी',     roman: 'creamy',        english: 'Cream',        emoji: '🤍' },
      { hindi: 'नींबू रंग',  roman: 'neemboo rang',  english: 'Lime Green',   emoji: '💚' },
      { hindi: 'तांबई',      roman: 'taambe',        english: 'Copper',       emoji: '🟤' },
      { hindi: 'गुलाबी लाल', roman: 'gulaabi laal',  english: 'Rose Red',     emoji: '🌹' },
    ],
  },
  family: {
    label: '👨‍👩‍👧 Family',
    color: '#A8E6CF',
    words: [
      { hindi: 'माँ',         roman: 'maa',         english: 'Mother',              emoji: '👩' },
      { hindi: 'पापा',        roman: 'papa',        english: 'Father',              emoji: '👨' },
      { hindi: 'दादी',        roman: 'daadi',       english: 'Paternal Grandmother',emoji: '👵' },
      { hindi: 'दादा',        roman: 'daada',       english: 'Paternal Grandfather',emoji: '👴' },
      { hindi: 'भाई',         roman: 'bhai',        english: 'Brother',             emoji: '👦' },
      { hindi: 'बहन',         roman: 'behen',       english: 'Sister',              emoji: '👧' },
      { hindi: 'चाचा',        roman: 'chacha',      english: 'Uncle (Dad\'s bro.)', emoji: '🧔' },
      { hindi: 'चाची',        roman: 'chachi',      english: 'Aunt (Dad\'s bro.)',  emoji: '👩' },
      { hindi: 'बच्चा',       roman: 'bachcha',     english: 'Child',               emoji: '👶' },
      { hindi: 'परिवार',      roman: 'parivar',     english: 'Family',              emoji: '👨‍👩‍👧‍👦' },
      { hindi: 'बेटा',        roman: 'beta',        english: 'Son',                 emoji: '👦' },
      { hindi: 'बेटी',        roman: 'beti',        english: 'Daughter',            emoji: '👧' },
      { hindi: 'पति',         roman: 'pati',        english: 'Husband',             emoji: '🤵' },
      { hindi: 'पत्नी',       roman: 'patni',       english: 'Wife',                emoji: '👰' },
      { hindi: 'नानी',        roman: 'naani',       english: 'Maternal Grandmother',emoji: '👵' },
      { hindi: 'नाना',        roman: 'naana',       english: 'Maternal Grandfather',emoji: '👴' },
      { hindi: 'मामा',        roman: 'maama',       english: 'Uncle (Mom\'s bro.)', emoji: '🧔' },
      { hindi: 'मामी',        roman: 'maami',       english: 'Aunt (Mom\'s bro.)',  emoji: '👩' },
      { hindi: 'बुआ',         roman: 'bua',         english: 'Aunt (Dad\'s sis.)',  emoji: '👩' },
      { hindi: 'फूफा',        roman: 'phupha',      english: 'Uncle (Dad\'s sis.)', emoji: '🧔' },
      { hindi: 'भतीजा',       roman: 'bhateeja',    english: 'Nephew',              emoji: '👦' },
      { hindi: 'भतीजी',       roman: 'bhateejee',   english: 'Niece',               emoji: '👧' },
      { hindi: 'पोता',        roman: 'pota',        english: 'Grandson',            emoji: '👦' },
      { hindi: 'पोती',        roman: 'potee',       english: 'Granddaughter',       emoji: '👧' },
      { hindi: 'भाभी',        roman: 'bhabhi',      english: 'Sister-in-law',       emoji: '👩' },
      { hindi: 'देवर',        roman: 'devar',       english: 'Brother-in-law',      emoji: '👨' },
      { hindi: 'ससुर',        roman: 'sasur',       english: 'Father-in-law',       emoji: '👴' },
      { hindi: 'सास',         roman: 'saas',        english: 'Mother-in-law',       emoji: '👵' },
      { hindi: 'रिश्तेदार',   roman: 'rishtedaar',  english: 'Relative',            emoji: '👥' },
      { hindi: 'परदादा',      roman: 'pardada',     english: 'Great-grandfather',   emoji: '👴' },
    ],
  },
  body: {
    label: '🫀 Body',
    color: '#C9B1FF',
    words: [
      { hindi: 'आँख',    roman: 'aankh',    english: 'Eye',         emoji: '👁️' },
      { hindi: 'कान',    roman: 'kaan',     english: 'Ear',         emoji: '👂' },
      { hindi: 'नाक',    roman: 'naak',     english: 'Nose',        emoji: '👃' },
      { hindi: 'मुँह',   roman: 'munh',     english: 'Mouth',       emoji: '👄' },
      { hindi: 'हाथ',    roman: 'haath',    english: 'Hand',        emoji: '✋' },
      { hindi: 'पैर',    roman: 'pair',     english: 'Foot / Leg',  emoji: '🦶' },
      { hindi: 'सिर',    roman: 'sir',      english: 'Head',        emoji: '🗣️' },
      { hindi: 'बाल',    roman: 'baal',     english: 'Hair',        emoji: '💇' },
      { hindi: 'दाँत',   roman: 'daant',    english: 'Teeth',       emoji: '🦷' },
      { hindi: 'पेट',    roman: 'pet',      english: 'Stomach',     emoji: '🫃' },
      { hindi: 'गर्दन',  roman: 'gardan',   english: 'Neck',        emoji: '🦢' },
      { hindi: 'पीठ',    roman: 'peeth',    english: 'Back',        emoji: '🔙' },
      { hindi: 'कंधा',   roman: 'kandha',   english: 'Shoulder',    emoji: '💪' },
      { hindi: 'कोहनी',  roman: 'kohni',    english: 'Elbow',       emoji: '🦾' },
      { hindi: 'घुटना',  roman: 'ghutna',   english: 'Knee',        emoji: '🦵' },
      { hindi: 'अँगूठा', roman: 'angootha', english: 'Thumb',       emoji: '👍' },
      { hindi: 'उँगली',  roman: 'ungali',   english: 'Finger',      emoji: '👆' },
      { hindi: 'जीभ',    roman: 'jeebh',    english: 'Tongue',      emoji: '👅' },
      { hindi: 'माथा',   roman: 'maatha',   english: 'Forehead',    emoji: '🤔' },
      { hindi: 'गाल',    roman: 'gaal',     english: 'Cheek',       emoji: '😊' },
      { hindi: 'ठोड़ी',  roman: 'thodi',    english: 'Chin',        emoji: '😬' },
      { hindi: 'होंठ',   roman: 'honth',    english: 'Lips',        emoji: '💋' },
      { hindi: 'भौंह',   roman: 'bhaunha',  english: 'Eyebrow',     emoji: '🤨' },
      { hindi: 'बाँह',   roman: 'baanh',    english: 'Arm',         emoji: '💪' },
      { hindi: 'कलाई',   roman: 'kalaaee',  english: 'Wrist',       emoji: '⌚' },
      { hindi: 'टखना',   roman: 'takhna',   english: 'Ankle',       emoji: '🦶' },
      { hindi: 'नाखून',  roman: 'nakhoon',  english: 'Nail',        emoji: '💅' },
      { hindi: 'हथेली',  roman: 'hatheli',  english: 'Palm',        emoji: '🤲' },
      { hindi: 'कमर',    roman: 'kamar',    english: 'Waist',       emoji: '🏋️' },
      { hindi: 'छाती',   roman: 'chhaati',  english: 'Chest',       emoji: '🫀' },
      { hindi: 'दिल',    roman: 'dil',      english: 'Heart',       emoji: '❤️' },
      { hindi: 'दिमाग',  roman: 'dimaag',   english: 'Brain / Mind',emoji: '🧠' },
      { hindi: 'हड्डी',  roman: 'haddi',    english: 'Bone',        emoji: '🦴' },
      { hindi: 'खून',    roman: 'khoon',    english: 'Blood',       emoji: '🩸' },
      { hindi: 'त्वचा',  roman: 'tvacha',   english: 'Skin',        emoji: '🫵' },
    ],
  },
  numbers: {
    label: '🔢 Numbers',
    color: '#4CAF50',
    words: [
      { hindi: 'शून्य',    roman: 'shoonya',   english: 'Zero (0)',          emoji: '0️⃣' },
      { hindi: 'एक',      roman: 'ek',         english: 'One (1)',           emoji: '1️⃣' },
      { hindi: 'दो',      roman: 'do',         english: 'Two (2)',           emoji: '2️⃣' },
      { hindi: 'तीन',     roman: 'teen',       english: 'Three (3)',         emoji: '3️⃣' },
      { hindi: 'चार',     roman: 'chaar',      english: 'Four (4)',          emoji: '4️⃣' },
      { hindi: 'पाँच',    roman: 'paanch',     english: 'Five (5)',          emoji: '5️⃣' },
      { hindi: 'छह',      roman: 'chhah',      english: 'Six (6)',           emoji: '6️⃣' },
      { hindi: 'सात',     roman: 'saat',       english: 'Seven (7)',         emoji: '7️⃣' },
      { hindi: 'आठ',      roman: 'aath',       english: 'Eight (8)',         emoji: '8️⃣' },
      { hindi: 'नौ',      roman: 'nau',        english: 'Nine (9)',          emoji: '9️⃣' },
      { hindi: 'दस',      roman: 'das',        english: 'Ten (10)',          emoji: '🔟' },
      { hindi: 'ग्यारह',  roman: 'gyaarah',    english: 'Eleven (11)',       emoji: '1️⃣1️⃣' },
      { hindi: 'बारह',    roman: 'baarah',     english: 'Twelve (12)',       emoji: '1️⃣2️⃣' },
      { hindi: 'तेरह',    roman: 'terah',      english: 'Thirteen (13)',     emoji: '1️⃣3️⃣' },
      { hindi: 'चौदह',    roman: 'chaudah',    english: 'Fourteen (14)',     emoji: '1️⃣4️⃣' },
      { hindi: 'पंद्रह',  roman: 'pandrah',    english: 'Fifteen (15)',      emoji: '1️⃣5️⃣' },
      { hindi: 'सोलह',    roman: 'solah',      english: 'Sixteen (16)',      emoji: '1️⃣6️⃣' },
      { hindi: 'सत्रह',   roman: 'satrah',     english: 'Seventeen (17)',    emoji: '1️⃣7️⃣' },
      { hindi: 'अठारह',   roman: 'athaarah',   english: 'Eighteen (18)',     emoji: '1️⃣8️⃣' },
      { hindi: 'उन्नीस',  roman: 'unnis',      english: 'Nineteen (19)',     emoji: '1️⃣9️⃣' },
      { hindi: 'बीस',     roman: 'bees',       english: 'Twenty (20)',       emoji: '2️⃣0️⃣' },
      { hindi: 'पच्चीस',  roman: 'pachchis',   english: 'Twenty-five (25)',  emoji: '2️⃣5️⃣' },
      { hindi: 'तीस',     roman: 'tees',       english: 'Thirty (30)',       emoji: '3️⃣0️⃣' },
      { hindi: 'चालीस',   roman: 'chaalis',    english: 'Forty (40)',        emoji: '4️⃣0️⃣' },
      { hindi: 'पचास',    roman: 'pachaas',    english: 'Fifty (50)',        emoji: '5️⃣0️⃣' },
      { hindi: 'साठ',     roman: 'saath',      english: 'Sixty (60)',        emoji: '6️⃣0️⃣' },
      { hindi: 'सत्तर',   roman: 'sattar',     english: 'Seventy (70)',      emoji: '7️⃣0️⃣' },
      { hindi: 'अस्सी',   roman: 'assi',       english: 'Eighty (80)',       emoji: '8️⃣0️⃣' },
      { hindi: 'नब्बे',   roman: 'nabbe',      english: 'Ninety (90)',       emoji: '9️⃣0️⃣' },
      { hindi: 'सौ',      roman: 'sau',        english: 'Hundred (100)',     emoji: '💯' },
      { hindi: 'हज़ार',    roman: 'hazaar',     english: 'Thousand (1000)',   emoji: '🔢' },
      { hindi: 'लाख',     roman: 'laakh',      english: 'Lakh (100,000)',    emoji: '💰' },
      { hindi: 'पहला',    roman: 'pahla',      english: '1st / First',       emoji: '🥇' },
      { hindi: 'दूसरा',   roman: 'doosra',     english: '2nd / Second',      emoji: '🥈' },
      { hindi: 'तीसरा',   roman: 'teesra',     english: '3rd / Third',       emoji: '🥉' },
    ],
  },
  days: {
    label: '📅 Days & Time',
    color: '#607D8B',
    words: [
      { hindi: 'सोमवार',    roman: 'somvaar',    english: 'Monday',               emoji: '📅' },
      { hindi: 'मंगलवार',   roman: 'mangalvaar', english: 'Tuesday',              emoji: '📅' },
      { hindi: 'बुधवार',    roman: 'budhvaar',   english: 'Wednesday',            emoji: '📅' },
      { hindi: 'गुरुवार',   roman: 'guruvaar',   english: 'Thursday',             emoji: '📅' },
      { hindi: 'शुक्रवार',  roman: 'shukravaar', english: 'Friday',               emoji: '📅' },
      { hindi: 'शनिवार',    roman: 'shanivaar',  english: 'Saturday',             emoji: '📅' },
      { hindi: 'रविवार',    roman: 'ravivaar',   english: 'Sunday',               emoji: '📅' },
      { hindi: 'आज',        roman: 'aaj',        english: 'Today',                emoji: '☀️' },
      { hindi: 'कल',        roman: 'kal',        english: 'Yesterday / Tomorrow', emoji: '📆' },
      { hindi: 'परसों',     roman: 'parson',     english: 'Day after/before tomorrow', emoji: '📆' },
      { hindi: 'सुबह',      roman: 'subah',      english: 'Morning',              emoji: '🌄' },
      { hindi: 'दोपहर',     roman: 'dopahar',    english: 'Afternoon / Noon',     emoji: '🌞' },
      { hindi: 'शाम',       roman: 'shaam',      english: 'Evening',              emoji: '🌇' },
      { hindi: 'रात',       roman: 'raat',       english: 'Night',                emoji: '🌙' },
      { hindi: 'सप्ताह',    roman: 'saptaah',    english: 'Week',                 emoji: '🗓️' },
      { hindi: 'महीना',     roman: 'maheena',    english: 'Month',                emoji: '📅' },
      { hindi: 'साल',       roman: 'saal',       english: 'Year',                 emoji: '📅' },
      { hindi: 'घड़ी',      roman: 'ghadi',      english: 'Clock / Hour',         emoji: '🕐' },
      { hindi: 'मिनट',      roman: 'minat',      english: 'Minute',               emoji: '⏱️' },
      { hindi: 'अभी',       roman: 'abhi',       english: 'Now / Right now',      emoji: '⏰' },
      { hindi: 'जल्दी',     roman: 'jaldi',      english: 'Early / Quickly',      emoji: '⚡' },
      { hindi: 'देर',       roman: 'der',        english: 'Late / Delay',         emoji: '🐢' },
      { hindi: 'हमेशा',     roman: 'hamesha',    english: 'Always',               emoji: '♾️' },
      { hindi: 'कभी',       roman: 'kabhi',      english: 'Ever / Sometimes',     emoji: '🔄' },
      { hindi: 'कभी नहीं',  roman: 'kabhi nahin',english: 'Never',               emoji: '🚫' },
      { hindi: 'पहले',      roman: 'pahle',      english: 'Before / Earlier',     emoji: '⏪' },
      { hindi: 'बाद में',   roman: 'baad mein',  english: 'Later / After',        emoji: '⏩' },
      { hindi: 'जल्द ही',   roman: 'jald hi',    english: 'Soon',                 emoji: '🔜' },
      { hindi: 'रोज़',       roman: 'roz',        english: 'Daily / Every day',    emoji: '📆' },
      { hindi: 'कभी कभी',   roman: 'kabhi kabhi',english: 'Sometimes',           emoji: '🔀' },
    ],
  },
  clothes: {
    label: '👕 Clothes',
    color: '#E91E63',
    words: [
      { hindi: 'कुर्ता',    roman: 'kurta',     english: 'Kurta (long shirt)', emoji: '👘' },
      { hindi: 'साड़ी',     roman: 'saari',     english: 'Sari',               emoji: '🥻' },
      { hindi: 'पैंट',      roman: 'pant',      english: 'Pants / Trousers',   emoji: '👖' },
      { hindi: 'शर्ट',      roman: 'shirt',     english: 'Shirt',              emoji: '👔' },
      { hindi: 'टोपी',      roman: 'topi',      english: 'Cap / Hat',          emoji: '🧢' },
      { hindi: 'जूता',      roman: 'joota',     english: 'Shoe',               emoji: '👟' },
      { hindi: 'मोज़ा',     roman: 'moza',      english: 'Sock',               emoji: '🧦' },
      { hindi: 'दुपट्टा',   roman: 'dupatta',   english: 'Scarf / Stole',      emoji: '🧣' },
      { hindi: 'जैकेट',     roman: 'jacket',    english: 'Jacket',             emoji: '🧥' },
      { hindi: 'पजामा',     roman: 'pajama',    english: 'Pajama',             emoji: '🩲' },
      { hindi: 'कमीज़',     roman: 'kameez',    english: 'Shirt / Blouse',     emoji: '👗' },
      { hindi: 'सलवार',     roman: 'salwar',    english: 'Salwar (trousers)',  emoji: '🩱' },
      { hindi: 'चप्पल',     roman: 'chappal',   english: 'Sandal / Slipper',  emoji: '🩴' },
      { hindi: 'बेल्ट',     roman: 'belt',      english: 'Belt',               emoji: '🩲' },
      { hindi: 'रूमाल',     roman: 'roomaal',   english: 'Handkerchief',       emoji: '🧻' },
      { hindi: 'दस्ताने',   roman: 'dastaane',  english: 'Gloves',             emoji: '🧤' },
      { hindi: 'स्वेटर',    roman: 'sweater',   english: 'Sweater',            emoji: '🧶' },
      { hindi: 'कोट',       roman: 'coat',      english: 'Coat',               emoji: '🥼' },
      { hindi: 'लहंगा',     roman: 'lehanga',   english: 'Lehenga',            emoji: '💃' },
      { hindi: 'धोती',      roman: 'dhoti',     english: 'Dhoti',              emoji: '🩱' },
      { hindi: 'पगड़ी',     roman: 'pagadi',    english: 'Turban',             emoji: '🪬' },
      { hindi: 'तौलिया',    roman: 'tauliya',   english: 'Towel',              emoji: '🛁' },
      { hindi: 'कपड़े',     roman: 'kapde',     english: 'Clothes',            emoji: '👕' },
      { hindi: 'पोशाक',     roman: 'poshaak',   english: 'Dress / Outfit',     emoji: '👗' },
      { hindi: 'वर्दी',     roman: 'vardi',     english: 'Uniform',            emoji: '🎽' },
      { hindi: 'स्कर्ट',    roman: 'skirt',     english: 'Skirt',              emoji: '🩱' },
      { hindi: 'ब्लाउज़',   roman: 'blouse',    english: 'Blouse',             emoji: '👚' },
      { hindi: 'छाता',      roman: 'chhata',    english: 'Umbrella',           emoji: '☂️' },
      { hindi: 'घड़ी',      roman: 'ghadi',     english: 'Wristwatch',         emoji: '⌚' },
      { hindi: 'चश्मा',     roman: 'chashma',   english: 'Spectacles',         emoji: '👓' },
    ],
  },
  transport: {
    label: '🚗 Transport',
    color: '#3F51B5',
    words: [
      { hindi: 'कार',              roman: 'car',          english: 'Car',           emoji: '🚗' },
      { hindi: 'बस',               roman: 'bus',          english: 'Bus',           emoji: '🚌' },
      { hindi: 'ट्रेन',            roman: 'train',        english: 'Train',         emoji: '🚆' },
      { hindi: 'साइकिल',           roman: 'cycle',        english: 'Bicycle',       emoji: '🚲' },
      { hindi: 'मोटरसाइकिल',       roman: 'motorcycle',   english: 'Motorcycle',    emoji: '🏍️' },
      { hindi: 'रिक्शा',           roman: 'riksha',       english: 'Rickshaw',      emoji: '🛺' },
      { hindi: 'हवाई जहाज़',        roman: 'hawai jahaz',  english: 'Aeroplane',     emoji: '✈️' },
      { hindi: 'नाव',              roman: 'naav',         english: 'Boat',          emoji: '⛵' },
      { hindi: 'जहाज़',            roman: 'jahaz',        english: 'Ship',          emoji: '🚢' },
      { hindi: 'ट्रक',             roman: 'truck',        english: 'Truck',         emoji: '🚚' },
      { hindi: 'ऑटो',              roman: 'auto',         english: 'Auto-rickshaw', emoji: '🛺' },
      { hindi: 'टैक्सी',           roman: 'taxi',         english: 'Taxi',          emoji: '🚕' },
      { hindi: 'स्कूटर',           roman: 'scooter',      english: 'Scooter',       emoji: '🛵' },
      { hindi: 'मेट्रो',           roman: 'metro',        english: 'Metro',         emoji: '🚇' },
      { hindi: 'हेलीकॉप्टर',        roman: 'helicopter',   english: 'Helicopter',    emoji: '🚁' },
      { hindi: 'एंबुलेंस',         roman: 'ambulance',    english: 'Ambulance',     emoji: '🚑' },
      { hindi: 'दमकल',             roman: 'damkal',       english: 'Fire engine',   emoji: '🚒' },
      { hindi: 'पुलिस गाड़ी',       roman: 'police gaadi', english: 'Police car',    emoji: '🚓' },
      { hindi: 'बैलगाड़ी',          roman: 'bailgaadi',    english: 'Bullock cart',  emoji: '🐂' },
      { hindi: 'सड़क',              roman: 'sadak',        english: 'Road',          emoji: '🛣️' },
      { hindi: 'स्टेशन',           roman: 'station',      english: 'Station',       emoji: '🏭' },
      { hindi: 'हवाई अड्डा',        roman: 'hawai adda',   english: 'Airport',       emoji: '🏢' },
      { hindi: 'बंदरगाह',          roman: 'bandargah',    english: 'Port / Harbor', emoji: '⚓' },
      { hindi: 'पुल',              roman: 'pul',          english: 'Bridge',        emoji: '🌉' },
      { hindi: 'सुरंग',            roman: 'surang',       english: 'Tunnel',        emoji: '🚇' },
      { hindi: 'चौराहा',           roman: 'chauraha',     english: 'Crossroads',    emoji: '🔀' },
      { hindi: 'पार्किंग',         roman: 'parking',      english: 'Parking',       emoji: '🅿️' },
      { hindi: 'ट्राम',            roman: 'tram',         english: 'Tram',          emoji: '🚋' },
      { hindi: 'केबल कार',          roman: 'cable car',    english: 'Cable car',     emoji: '🚡' },
      { hindi: 'रॉकेट',            roman: 'rocket',       english: 'Rocket',        emoji: '🚀' },
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

const THEMES_BY_LEVEL = {
  '1': ['colors', 'animals'],
  '2': ['animals', 'food', 'colors'],
  '3': ['animals', 'food', 'colors', 'body', 'family'],
  '4': ['animals', 'food', 'kitchen', 'colors', 'body', 'family', 'numbers', 'days', 'clothes', 'transport'],
  '5': ['animals', 'food', 'kitchen', 'colors', 'body', 'family', 'numbers', 'days', 'clothes', 'transport'],
}
const LEVEL_SUBTITLE = {
  '1': '🌱 Tap any card to hear it in Hindi!',
  '2': '🌿 Animals, food and colors — tap to explore!',
  '3': '⭐ Body parts and family unlocked!',
  '4': '🚀 Kitchen, numbers, days, clothes & transport added!',
  '5': '💎 All vocabulary themes unlocked!',
}

export default function Vocabulary() {
  const { addStars, markComplete, earnBadge, showCelebration, completed, level } = useApp()
  const visibleKeys = THEMES_BY_LEVEL[level] || Object.keys(THEMES)
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
        <p className="page-sub">{LEVEL_SUBTITLE[level] || 'Tap a card to hear the Hindi word!'}</p>
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
