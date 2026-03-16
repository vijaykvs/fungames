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

function pickVoice(voices, lang) {
  return (
    voices.find(v => v.lang === lang && /female|girl|woman|zira|heera/i.test(v.name)) ||
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith('hi'))
  )
}

/**
 * Speaks Hindi text in a high-pitched, cute kid-girl voice.
 * Waits for voices to load before speaking so the browser
 * can match the hi-IN language instead of falling silent.
 */
export async function speak(text, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const voices = await ensureVoices()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang  = lang
  utter.rate  = 0.82   // slightly slower — sounds younger
  utter.pitch = 1.6    // high pitch — kid-like

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
      u.lang  = lang
      u.rate  = 0.8
      u.pitch = 1.6
      if (preferredVoice) u.voice = preferredVoice
      window.speechSynthesis.speak(u)
    }, i * 2300)
  })
}
