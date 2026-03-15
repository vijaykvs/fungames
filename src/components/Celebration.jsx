import { useEffect, useState } from 'react'

const CONFETTI_COLORS = ['#FF6B6B', '#FFD93D', '#6C63FF', '#4ECDC4', '#FF85A1', '#4D96FF', '#A8E6CF']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function generatePieces(count = 60) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(5, 95),
    delay: randomBetween(0, 0.7),
    dur: randomBetween(1.2, 2.2),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: randomBetween(8, 16),
    rotate: randomBetween(0, 360),
  }))
}

export default function Celebration({ message, subMessage, onDone }) {
  const [pieces] = useState(() => generatePieces(60))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 400)
    }, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="celebration-overlay">
      {/* Confetti pieces */}
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      {/* Central message */}
      <div className="celebration-card">
        <div className="celebration-emoji">🎉</div>
        <h2 className="celebration-title">{message}</h2>
        {subMessage && <p className="celebration-sub">{subMessage}</p>}
        <button className="btn btn-primary" onClick={() => { setVisible(false); onDone() }}>
          Keep Going! 🚀
        </button>
      </div>
    </div>
  )
}
