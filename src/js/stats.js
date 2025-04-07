// Basic Stat Initialization (to be replaced with Supabase later)
const DEFAULT_ELO = 1000
const DEFAULT_POINTS = 0

function getLocal(key, fallback) {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallback
}

function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function updateStats() {
  // Fetch or fallback
  const elo = getLocal('eloRating', DEFAULT_ELO)
  const points = getLocal('totalPoints', DEFAULT_POINTS)
  const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]')

  // Inject into DOM
  document.getElementById('elo-score').textContent = Math.round(elo)
  document.getElementById('points-earned').textContent = points >= 0 ? `+${points}` : `${points}`
  document.getElementById('points-earned').classList.add(points >= 0 ? 'text-yellow-300' : 'text-red-400')
  document.getElementById('lessons-completed').textContent = completedLessons.length
}

// Call on load
updateStats()

// Example helper if you want to update these stats later from quizzes, etc:
export function addPoints(amount) {
  const current = getLocal('totalPoints', DEFAULT_POINTS)
  setLocal('totalPoints', current + amount)
}

export function setElo(newRating) {
  setLocal('eloRating', newRating)
} 

export function getElo() {
  return getLocal('eloRating', DEFAULT_ELO)
}

export function getTotalPoints() {
  return getLocal('totalPoints', DEFAULT_POINTS)
} 

export function getCompletedLessonCount() {
  return (JSON.parse(localStorage.getItem('completedLessons') || '[]')).length
} 