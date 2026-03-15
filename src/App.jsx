import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import './App.css'

const Layout = ({ children }) => (
  <div className="app-shell">
    <header className="topbar">
      <div>
        <div className="brand">FunGames Hindi</div>
        <div className="subtitle">Learn Hindi the fun way!</div>
      </div>
      <nav className="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/hindi">Hindi Hub</NavLink>
      </nav>
    </header>
    <main className="main-content">{children}</main>
    <footer className="footer">Made for kids: easy, colorful, playable.</footer>
  </div>
)

const Home = () => (
  <Layout>
    <section className="hero-card">
      <h1>🎮 Fun Games - Neon Edition</h1>
      <p>Play and learn in one place.</p>
    </section>
    <div className="grid">
      <div className="card">
        <h2>Neon Game</h2>
        <p>Try a bright neon challenge inside the React app.</p>
        <NavLink className="link-btn" to="/neon-match">
          Play Neon
        </NavLink>
      </div>
      <div className="card">
        <h2>Hindi Learning</h2>
        <p>Beginner to medium Hindi lessons for kids.</p>
        <NavLink className="link-btn" to="/hindi">
          Go to Hindi Hub
        </NavLink>
      </div>
    </div>
  </Layout>
)

const lessons = [
  { path: '/hindi/alphabet', title: 'Alphabet Fun', content: 'Learn vowels and simple letters with fun cards.' },
  { path: '/hindi/verbs', title: 'Common Verbs', content: 'Action words with mini challenges.' },
  { path: '/hindi/sentences', title: 'Simple Sentences', content: 'Build easy Hindi sentences.' },
  { path: '/hindi/stories', title: 'Story Match', content: 'Read a tiny story and match words.' },
]

const HindiHub = () => {
  const save = () => localStorage.setItem('hindi-visited', '1')
  save()
  return (
    <Layout>
      <section className="hero-card">
        <h1>🌟 Hindi Fun Learning Hub</h1>
        <p>Beginner-to-medium learning for kids with games.</p>
      </section>
      <div className="progress-card">
        <h3>🎯 Progress Tracker</h3>
        <div className="progress-grid">
          <label><input type="checkbox" checked={!!localStorage.getItem('level-alphabet')} readOnly /> Alphabet</label>
          <label><input type="checkbox" checked={!!localStorage.getItem('level-verbs')} readOnly /> Verbs</label>
          <label><input type="checkbox" checked={!!localStorage.getItem('level-sentences')} readOnly /> Sentences</label>
          <label><input type="checkbox" checked={!!localStorage.getItem('level-stories')} readOnly /> Stories</label>
        </div>
        <p className="hint">Tip: Complete each page and refresh to keep track.</p>
      </div>
      <div className="grid">
        {lessons.map((lesson) => (
          <div key={lesson.path} className="card">
            <h3>{lesson.title}</h3>
            <p>{lesson.content}</p>
            <NavLink className="link-btn" to={lesson.path}>
              Open
            </NavLink>
          </div>
        ))}
      </div>
    </Layout>
  )
}

const NeonPage = () => (
  <Layout>
    <section className="hero-card">
      <h1>✨ Neon Match</h1>
      <p>A bright play zone for quick reactions and color fun.</p>
    </section>
    <div className="content-card">
      <p>Neon Match is being rebuilt in React so it matches the rest of the site.</p>
      <p>For now, this page keeps the game area connected to the new theme instead of sending users to a missing file.</p>
    </div>
    <div className="actions">
      <NavLink className="link-btn" to="/">
        Back Home
      </NavLink>
      <NavLink className="link-btn" to="/hindi">
        Explore Hindi
      </NavLink>
    </div>
  </Layout>
)

const LessonPage = ({ title, children, levelKey }) => {
  const done = () => {
    localStorage.setItem(levelKey, 'true')
    window.location.reload()
  }
  return (
    <Layout>
      <section className="hero-card">
        <h1>{title}</h1>
      </section>
      <div className="content-card">{children}</div>
      <div className="actions">
        <button className="link-btn" onClick={done}>
          Mark Complete
        </button>
        <NavLink className="link-btn" to="/hindi">
          Back to Hub
        </NavLink>
      </div>
    </Layout>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neon-match" element={<NeonPage />} />
        <Route path="/hindi" element={<HindiHub />} />
        <Route
          path="/hindi/alphabet"
          element={
            <LessonPage title="Hindi Alphabet" levelKey="level-alphabet">
              <ul className="list">
                <li>अ (a)</li>
                <li>आ (aa)</li>
                <li>इ (i)</li>
                <li>क (ka)</li>
              </ul>
              <p>Say each letter aloud with a clap.</p>
            </LessonPage>
          }
        />
        <Route
          path="/hindi/verbs"
          element={
            <LessonPage title="Common Verbs" levelKey="level-verbs">
              <ul className="list">
                <li>खाना (to eat)</li>
                <li>पीना (to drink)</li>
                <li>चलना (to walk)</li>
                <li>देखना (to see)</li>
              </ul>
              <p>Use in short sentences: मैं खाना खाता हूँ.</p>
            </LessonPage>
          }
        />
        <Route
          path="/hindi/sentences"
          element={
            <LessonPage title="Simple Sentences" levelKey="level-sentences">
              <ul className="list">
                <li>मैं खेलता हूँ। (I play.)</li>
                <li>वह पानी पीती है। (She drinks water.)</li>
              </ul>
              <p>Change one word and speak it out loud.</p>
            </LessonPage>
          }
        />
        <Route
          path="/hindi/stories"
          element={
            <LessonPage title="Story Match" levelKey="level-stories">
              <p>
                राम बगीचे में गया और फूल देखा। 
              </p>
              <p>Match words with pictures in your mind.</p>
            </LessonPage>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

export default App

