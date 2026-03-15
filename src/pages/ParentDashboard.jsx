import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../context/AppContext'

/* ── time tracking ─────────────────────────────────────────── */
function useTimeTracking() {
  useEffect(() => {
    const key = 'timeLog'
    const today = new Date().toDateString()
    const start = Date.now()
    return () => {
      const raw = localStorage.getItem(key)
      const log = raw ? JSON.parse(raw) : {}
      log[today] = (log[today] || 0) + Math.round((Date.now() - start) / 1000)
      localStorage.setItem(key, JSON.stringify(log))
    }
  }, [])
}

function getTimeLog() {
  try { return JSON.parse(localStorage.getItem('timeLog') || '{}') } catch { return {} }
}

function fmtSecs(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  const r = s % 60
  return r ? `${m}m ${r}s` : `${m}m`
}

/* ── module completion map ─────────────────────────────────── */
const MODULES = [
  { id: 'alphabet', label: '🔤 Alphabet', sections: ['alphabet-0', 'alphabet-1', 'alphabet-2'], total: 3 },
  { id: 'vocab',    label: '📚 Vocabulary', sections: ['vocab-animals','vocab-food','vocab-colors','vocab-family','vocab-body'], total: 5 },
  { id: 'games',    label: '🎮 Games',    sections: [],                                           total: 3 },
  { id: 'stories',  label: '📖 Stories',  sections: ['story-1','story-2','story-3'],               total: 3 },
  { id: 'rhymes',   label: '🎵 Rhymes',   sections: ['rhyme-1','rhyme-2','rhyme-3'],               total: 3 },
]

const PIN = '1234'   // simple parent-lock PIN

export default function ParentDashboard() {
  useTimeTracking()
  const { stars, streak, completed, badges, resetAll } = useApp()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('parentUnlocked') === '1')
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState(false)
  const [limitMins, setLimitMins] = useState(() => parseInt(localStorage.getItem('timeLimit') || '0'))
  const [limitInput, setLimitInput] = useState(String(limitMins || ''))

  const timeLog = getTimeLog()
  const today = new Date().toDateString()
  const todaySeconds = timeLog[today] || 0

  /* last 7 days usage */
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000)
    const k = d.toDateString()
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), secs: timeLog[k] || 0 }
  }).reverse()

  const maxSecs = Math.max(...last7.map(d => d.secs), 1)

  const handleUnlock = () => {
    if (pin === PIN) {
      sessionStorage.setItem('parentUnlocked', '1')
      setUnlocked(true)
      setPinErr(false)
    } else {
      setPinErr(true)
      setPin('')
    }
  }

  const saveLimit = () => {
    const v = parseInt(limitInput) || 0
    setLimitMins(v)
    localStorage.setItem('timeLimit', String(v))
  }

  const handleReset = () => {
    if (window.confirm('Reset all child progress? This cannot be undone.')) {
      resetAll()
    }
  }

  /* ── PIN gate ─────────────────────────────────────────────── */
  if (!unlocked) {
    return (
      <Layout>
        <div className="parent-gate">
          <div className="gate-card">
            <div className="gate-emoji">👪</div>
            <h2 className="gate-title">Parent Dashboard</h2>
            <p className="gate-sub">Enter the parent PIN to continue.</p>
            <p className="gate-hint">(Default PIN: <strong>1234</strong>)</p>
            <input
              type="password"
              className={'gate-input' + (pinErr ? ' error' : '')}
              placeholder="Enter PIN"
              value={pin}
              maxLength={6}
              onChange={e => { setPin(e.target.value); setPinErr(false) }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            />
            {pinErr && <p className="gate-error">❌ Incorrect PIN</p>}
            <button className="btn btn-primary" onClick={handleUnlock}>Unlock</button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">👪 Parent Dashboard</h1>
        <p className="page-sub">Track your child&apos;s learning progress and usage</p>
      </div>

      {/* ── Summary strip ──────────────────────────────────── */}
      <div className="pd-stats-row">
        <div className="pd-stat" style={{ '--pdc': '#FFD93D' }}>
          <div className="pd-stat-big">{stars}</div>
          <div className="pd-stat-label">⭐ Stars Earned</div>
        </div>
        <div className="pd-stat" style={{ '--pdc': '#FF6B6B' }}>
          <div className="pd-stat-big">{streak}</div>
          <div className="pd-stat-label">🔥 Day Streak</div>
        </div>
        <div className="pd-stat" style={{ '--pdc': '#4ECDC4' }}>
          <div className="pd-stat-big">{completed.length}</div>
          <div className="pd-stat-label">✅ Lessons Done</div>
        </div>
        <div className="pd-stat" style={{ '--pdc': '#C9B1FF' }}>
          <div className="pd-stat-big">{badges.length}</div>
          <div className="pd-stat-label">🎖️ Badges</div>
        </div>
        <div className="pd-stat" style={{ '--pdc': '#4D96FF' }}>
          <div className="pd-stat-big">{fmtSecs(todaySeconds)}</div>
          <div className="pd-stat-label">⏱️ Today&apos;s Time</div>
        </div>
      </div>

      {/* ── Module progress ────────────────────────────────── */}
      <h2 className="pd-section-title">📊 Module Progress</h2>
      <div className="pd-modules">
        {MODULES.map(m => {
          const done = m.sections.filter(s => completed.includes(s)).length
          const pct  = m.total > 0 ? Math.round((done / m.total) * 100) : 0
          return (
            <div key={m.id} className="pd-module-row">
              <span className="pd-mod-label">{m.label}</span>
              <div className="pd-bar-bg">
                <div className="pd-bar-fill" style={{ width: pct + '%' }} />
              </div>
              <span className="pd-mod-pct">{done}/{m.total}</span>
            </div>
          )
        })}
      </div>

      {/* ── 7-day usage chart ──────────────────────────────── */}
      <h2 className="pd-section-title">📅 Last 7 Days Usage</h2>
      <div className="pd-chart">
        {last7.map((d, i) => (
          <div key={i} className="pd-bar-col">
            <div className="pd-bar-wrap">
              <div
                className="pd-usage-bar"
                style={{ height: Math.round((d.secs / maxSecs) * 100) + '%' }}
                title={fmtSecs(d.secs)}
              />
            </div>
            <span className="pd-day-label">{d.label}</span>
            <span className="pd-day-time">{fmtSecs(d.secs)}</span>
          </div>
        ))}
      </div>

      {/* ── Time limit ─────────────────────────────────────── */}
      <h2 className="pd-section-title">⏰ Daily Time Limit</h2>
      <div className="pd-limit-card">
        <p className="pd-limit-desc">
          Set a soft daily limit. When reached, a gentle reminder is shown to the child.
          {limitMins > 0 && <strong> Current limit: {limitMins} minutes.</strong>}
        </p>
        <div className="pd-limit-row">
          <input
            type="number"
            className="pd-limit-input"
            min="0"
            max="120"
            placeholder="Minutes (0 = no limit)"
            value={limitInput}
            onChange={e => setLimitInput(e.target.value)}
          />
          <button className="btn btn-primary" onClick={saveLimit}>Save</button>
        </div>
        {limitMins > 0 && todaySeconds >= limitMins * 60 && (
          <p className="pd-limit-warn">⚠️ Daily limit reached today ({fmtSecs(todaySeconds)} used).</p>
        )}
      </div>

      {/* ── Completed lessons list ─────────────────────────── */}
      <h2 className="pd-section-title">✅ Completed Lessons</h2>
      {completed.length === 0
        ? <p className="pd-empty">No lessons completed yet.</p>
        : (
          <ul className="pd-completed-list">
            {completed.map(id => (
              <li key={id} className="pd-completed-item">✅ {id.replace(/-/g, ' › ')}</li>
            ))}
          </ul>
        )
      }

      {/* ── Danger zone ────────────────────────────────────── */}
      <div className="pd-danger">
        <h2 className="pd-section-title" style={{ color: '#C62828' }}>⚠️ Danger Zone</h2>
        <p className="pd-limit-desc">Permanently resets all stars, badges, and progress.</p>
        <button className="btn btn-danger" onClick={handleReset}>🗑️ Reset Child Progress</button>
      </div>
    </Layout>
  )
}
