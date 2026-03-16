import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Layout({ children }) {
  const { stars, streak, level } = useApp()
  const levelLabel = level ? `Lv ${level}` : ''

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
          <NavLink to="/phrases"    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>💬 Phrases</NavLink>
          <NavLink to="/games"     className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🎮 Games</NavLink>
          <NavLink to="/stories"   className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>📖 Stories</NavLink>
          <NavLink to="/progress"  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🏆 Progress</NavLink>
          <NavLink to="/parents"   className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>👪 Parents</NavLink>
        </nav>
        <div className="topbar-stats">
          <span className="stat-badge stars">⭐ {stars}</span>
          <span className="stat-badge streak">🔥 {streak}</span>
          {levelLabel && <span className="stat-badge age">{levelLabel}</span>}
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">Made with ❤️ for Hindi learners everywhere</footer>
    </div>
  )
}
