import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [ageGroup, setAgeGroupState] = useState(() => localStorage.getItem('ageGroup') || '')
  const [stars, setStars] = useState(() => parseInt(localStorage.getItem('stars') || '0'))
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('streak') || '0'))
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('completed') || '[]') } catch { return [] }
  })
  const [badges, setBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('badges') || '[]') } catch { return [] }
  })
  const [quizStats, setQuizStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quizStats') || '{"correct":0,"wrong":0}') } catch { return { correct: 0, wrong: 0 } }
  })

  // celebration queue: array of { message, subMessage }
  const [celebration, setCelebration] = useState(null)

  const showCelebration = useCallback((message, subMessage = '') => {
    setCelebration({ message, subMessage })
  }, [])

  const dismissCelebration = useCallback(() => setCelebration(null), [])

  // Streak tracking on mount
  useEffect(() => {
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('lastVisit') || ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (lastVisit !== today) {
      const newStreak = lastVisit === yesterday ? streak + 1 : 1
      setStreak(newStreak)
      localStorage.setItem('streak', String(newStreak))
      localStorage.setItem('lastVisit', today)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setAgeGroup = (g) => {
    setAgeGroupState(g)
    localStorage.setItem('ageGroup', g)
  }

  const addStars = (n) => {
    setStars(s => {
      const next = s + n
      localStorage.setItem('stars', String(next))
      return next
    })
  }

  const markComplete = (id) => {
    setCompleted(c => {
      if (c.includes(id)) return c
      const next = [...c, id]
      localStorage.setItem('completed', JSON.stringify(next))
      return next
    })
  }

  const earnBadge = (id) => {
    setBadges(b => {
      if (b.includes(id)) return b
      const next = [...b, id]
      localStorage.setItem('badges', JSON.stringify(next))
      return next
    })
  }

  const recordQuizAnswer = (correct) => {
    setQuizStats(s => {
      const next = { ...s, correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }
      localStorage.setItem('quizStats', JSON.stringify(next))
      return next
    })
  }

  // adaptive difficulty: 0=easy 1=medium 2=hard based on last ratio
  const quizDifficulty = (() => {
    const total = quizStats.correct + quizStats.wrong
    if (total < 5) return 0
    const ratio = quizStats.correct / total
    if (ratio >= 0.75) return 2
    if (ratio >= 0.5)  return 1
    return 0
  })()

  const resetAll = () => {
    localStorage.clear()
    setAgeGroupState('')
    setStars(0)
    setStreak(0)
    setCompleted([])
    setBadges([])
  }

  return (
    <AppContext.Provider value={{
      ageGroup, setAgeGroup,
      stars, addStars,
      streak,
      completed, markComplete,
      badges, earnBadge,
      quizStats, recordQuizAnswer, quizDifficulty,
      celebration, showCelebration, dismissCelebration,
      resetAll,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
