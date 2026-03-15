import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Celebration      from './components/Celebration'
import Home             from './pages/Home'
import Alphabet         from './pages/Alphabet'
import Vocabulary       from './pages/Vocabulary'
import Games            from './pages/Games'
import Stories          from './pages/Stories'
import Progress         from './pages/Progress'
import ParentDashboard  from './pages/ParentDashboard'
import './App.css'

function CelebrationLayer() {
  const { celebration, dismissCelebration } = useApp()
  if (!celebration) return null
  return (
    <Celebration
      message={celebration.message}
      subMessage={celebration.subMessage}
      onDone={dismissCelebration}
    />
  )
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/alphabet"  element={<Alphabet />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/games"     element={<Games />} />
          <Route path="/stories"   element={<Stories />} />
          <Route path="/progress"  element={<Progress />} />
          <Route path="/parents"   element={<ParentDashboard />} />
          <Route path="*"          element={<Home />} />
        </Routes>
        <CelebrationLayer />
      </HashRouter>
    </AppProvider>
  )
}

export default App

