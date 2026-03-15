/**
 * Speaks Hindi text in a high-pitched, cute kid-girl voice.
 * Tries to pick a female hi-IN voice; falls back to pitch/rate tuning.
 */
export function speak(text, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang  = lang
  utter.rate  = 0.82   // slightly slower — sounds younger
  utter.pitch = 1.6    // high pitch — kid-like

  // Try to pick a female/child voice for the language
  const voices = window.speechSynthesis.getVoices()
  const preferredVoice =
    voices.find(v => v.lang === lang && /female|girl|woman|zira|heera/i.test(v.name)) ||
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith('hi'))

  if (preferredVoice) utter.voice = preferredVoice

  window.speechSynthesis.speak(utter)
}

/**
 * Speaks multiple lines sequentially with a gap between each.
 */
export function speakAll(lines, lang = 'hi-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const voices = window.speechSynthesis.getVoices()
  const preferredVoice =
    voices.find(v => v.lang === lang && /female|girl|woman|zira|heera/i.test(v.name)) ||
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith('hi'))

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
