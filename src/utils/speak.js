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

/**
 * Voice selection priority (most natural → least):
 *  1. Google Hindi female  (sounds clear and soothing on Chrome/Android)
 *  2. Any Google Hindi     (still better than system voices)
 *  3. Any hi-IN female     (system female voice for the exact locale)
 *  4. Any hi-IN voice      (fallback to any Hindi voice)
 *  5. Any voice starting   (e.g. hi-IN vs hi vs hi_IN variants)
 *     with 'hi'
 */
function pickVoice(voices, lang) {
  return (
    voices.find(v => v.lang === lang   && /google/i.test(v.name) && /female|woman|heera/i.test(v.name)) ||
    voices.find(v => v.lang === lang   && /google/i.test(v.name)) ||
    voices.find(v => v.lang === lang   && /female|woman|heera|lekha/i.test(v.name)) ||
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith('hi'))
  )
}

/**
 * Apply soothing, gentle prosody to a SpeechSynthesisUtterance.
 * - rate 0.78  → relaxed, child-friendly pace
 * - pitch 1.1  → slightly warm/bright without sounding shrill
 * - volume 1.0 → clear and audible
 */
function applyProsody(utter) {
  utter.rate   = 0.78
  utter.pitch  = 1.1
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

  const voices = await ensureVoices()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  applyProsody(utter)

  const preferredVoice = pickVoice(voices, lang)
  if (preferredVoice) utter.voice = preferredVoice

  window.speechSynthesis.speak(utter)
}

/**
 * Speaks multiple lines sequentially with a gap between each.
 */
export async function speakAll(lines, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const voices = await ensureVoices()
  const preferredVoice = pickVoice(voices, lang)

  lines.forEach((line, i) => {
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(line)
      u.lang = lang
      applyProsody(u)
      if (preferredVoice) u.voice = preferredVoice
      window.speechSynthesis.speak(u)
    }, i * 2500)
  })
}
