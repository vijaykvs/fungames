/**
 * Voices are loaded asynchronously by the browser.
 * Cache them after the first successful load so every subsequent
 * call to speak() has a voice list ready immediately.
 */
let _cachedVoices = []

function ensureVoices() {
  if (_cachedVoices.length) return Promise.resolve(_cachedVoices)
  return new Promise(resolve => {
    const immediate = window.speechSynthesis.getVoices()
    if (immediate.length) {
      _cachedVoices = immediate
      resolve(_cachedVoices)
    } else {
      window.speechSynthesis.addEventListener(
        'voiceschanged',
        () => {
          _cachedVoices = window.speechSynthesis.getVoices()
          resolve(_cachedVoices)
        },
        { once: true }
      )
    }
  })
}

function normalizeLang(lang) {
  return String(lang || '')
    .trim()
    .replace(/_/g, '-')
    .toLowerCase()
}

function hasDevanagari(text) {
  return /[\u0900-\u097F]/.test(String(text || ''))
}

function preferredLangsFor(text, lang) {
  const normalized = normalizeLang(lang)

  // If the content looks Hindi (Devanagari), avoid picking an English voice.
  if (hasDevanagari(text) || normalized.startsWith('hi')) {
    return [lang, 'hi-IN', 'hi']
  }

  // For English content, prefer Indian English.
  if (normalized.startsWith('en')) {
    return [lang, 'en-IN', 'en']
  }

  // Generic fallback order.
  return [lang, 'hi-IN', 'hi', 'en-IN', 'en']
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function speakUtterance(utter) {
  return new Promise(resolve => {
    const done = () => resolve()
    utter.onend = done
    utter.onerror = done
    window.speechSynthesis.speak(utter)
  })
}

/**
 * Picks the most "Indian" and child-friendly voice available.
 *
 * Browsers vary widely in what voices they expose. This function:
 * - prefers exact locale matches (hi-IN, then en-IN)
 * - falls back to same language family (hi-*, then en-*)
 * - gives a small boost to voices that look Indian/Hindi in the name
 */
function pickVoice(voices, preferredLangs) {
  const langs = Array.isArray(preferredLangs) ? preferredLangs : [preferredLangs]
  if (!voices?.length) return undefined

  const scored = voices
    .map(voice => {
      const voiceLang = normalizeLang(voice.lang)
      const voiceName = String(voice.name || '')

      let score = 0
      langs.forEach((lang, idx) => {
        const target = normalizeLang(lang)
        const root = target.split('-')[0]
        const base = 100 - idx * 10

        if (voiceLang === target) score = Math.max(score, base)
        else if (root && voiceLang.startsWith(root)) score = Math.max(score, base - 35)
      })

      if (/hindi|\u0939\u093F\u0902\u0926\u0940|\u0939\u093F\u0928\u094D\u0926\u0940|india|bharat/i.test(voiceName)) score += 15
      if (/google/i.test(voiceName)) score += 10
      if (/female|woman|heera|lekha|neerja|kavya|kalpana/i.test(voiceName)) score += 5

      return { voice, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score > 0 ? scored[0].voice : undefined
}

/**
 * Apply an "innocent small kid" prosody to a SpeechSynthesisUtterance.
 * (Pitch/rate are approximate — actual sound depends on the installed voice.)
 */
function applyProsody(utter) {
  utter.rate   = 0.88
  utter.pitch  = 1.22
  utter.volume = 1.0
}

/**
 * Speaks Hindi text in a soothing, innocent kid's voice.
 * Waits for voices to load before speaking so the browser
 * can match the hi-IN language instead of falling silent.
 */
export async function speak(text, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  // Chromium (Chrome/Edge) can sound glitchy if we cancel + speak immediately.
  await delay(30)

  const voices = await ensureVoices()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  applyProsody(utter)

  const preferredVoice = pickVoice(voices, preferredLangsFor(text, lang))
  if (preferredVoice) {
    utter.voice = preferredVoice
  }

  await speakUtterance(utter)
}

/**
 * Speaks multiple lines sequentially with a gap between each.
 */
export async function speakAll(lines, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  await delay(30)

  const voices = await ensureVoices()
  const firstLine = Array.isArray(lines) ? lines[0] : ''
  const preferredVoice = pickVoice(voices, preferredLangsFor(firstLine, lang))

  for (const line of lines) {
    const u = new SpeechSynthesisUtterance(line)
    u.lang = lang
    applyProsody(u)
    if (preferredVoice) u.voice = preferredVoice
    await speakUtterance(u)
    await delay(220)
  }
}
