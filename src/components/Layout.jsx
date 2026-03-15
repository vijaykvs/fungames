import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Layout({ children }) {
  const { stars, streak, ageGroup } = useApp()
  const ageLabel = { A: '3–5 yrs', B: '6–8 yrs', C: '9–11 yrs' }[ageGroup] || ''

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand-link">
          <div className="brand">🦚 Hindi Duniya</div>
          <div className="subtitle">Learn Hindi • Play • Grow</div>
        </NavLink>
        <nav className="nav">
          <NavLink to="/alphabet"  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🔤 Alphabet</NavLink>
          <NavLink to="/vocabulary" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>📚 Words</NavLink>
          <NavLink to="/games"     className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🎮 Games</NavLink>
          <NavLink to="/stories"   className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>📖 Stories</NavLink>
          <NavLink to="/progress"  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🏆 Progress</NavLink>
          <NavLink to="/parents"   className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>👪 Parents</NavLink>
        </nav>
        <div className="topbar-stats">
          <span className="stat-badge stars">⭐ {stars}</span>
          <span className="stat-badge streak">🔥 {streak}</span>
          {ageLabel && <span className="stat-badge age">{ageLabel}</span>}
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">Made with ❤️ for Hindi learners everywhere</footer>
    </div>
  )
}
