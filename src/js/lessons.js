// src/lessons.js

import TheVeryBasics from '../lessons-data/cash/The-very-basics/TheVeryBasics.js'
import HandRankings from '../lessons-data/cash/The-very-basics/hand-rankings.js'
import PositionsAndBlinds from '../lessons-data/cash/The-very-basics/positions-and-blinds.js'
import PlayerTypes from '../lessons-data/cash/player-types.js'
import Strategy from '../lessons-data/cash/strategy.js'
import PreflopStrategy from '../lessons-data/cash/preflop-strategy.js'

// Group lessons into logical stages
const lessons = {
  cash: [
    {
      id: "foundations",
      title: "Stage 1: Foundations",
      lessons: [
        {
          ...TheVeryBasics,
          order: 1  // Basic introduction to Texas Hold'em
        },
        {
          ...HandRankings,
          order: 2  // Hand Rankings & Terminology
        },
        {
          ...PositionsAndBlinds,
          order: 3  // Positions, Blinds, and Dealer Button
        }
      ]
    },
    {
      id: "intermediate",
      title: "Stage 2: Intermediate Concepts",
      lessons: [
        {
          ...PlayerTypes,
          order: 1  // Player Archetypes: The Grid (interactive)
        },
        {
          ...Strategy,
          order: 2  // General Strategy Concepts
        }
      ]
    },
    {
      id: "advanced",
      title: "Stage 3: Advanced Tactics",
      lessons: [
        {
          ...PreflopStrategy,
          order: 1  // Preflop Strategy
        }
        // Future addition: Postflop and Adaptive Strategy
      ]
    }
  ],
  tournament: []
}

// MARK LESSON COMPLETED
function markLessonCompleted(id) {
  const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]')
  if (!completed.includes(id)) {
    completed.push(id)
    localStorage.setItem('completedLessons', JSON.stringify(completed))
  }
}

// UPDATE COMPLETION BUBBLES
function updateCompletionBubbles() {
  const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]')
  document.querySelectorAll('.lesson-link').forEach(link => {
    const id = link.dataset.id
    const bubble = link.querySelector('.completion-bubble')
    if (completed.includes(id)) {
      bubble.classList.remove('bg-gray-500')
      bubble.classList.add('bg-green-400')
    } else {
      bubble.classList.add('bg-gray-500')
      bubble.classList.remove('bg-green-400')
    }
  })
}

// POPULATE SIDEBAR: Iterate over stages and sort lessons within each stage by order.
function populateSidebar(type = 'cash') {
  const sidebar = document.getElementById('lesson-sidebar')
  sidebar.innerHTML = ''

  const stageSet = lessons[type] || []

  stageSet.forEach(stage => {
    const wrapper = document.createElement('div')
    wrapper.className = 'mb-4'

    const toggle = document.createElement('button')
    toggle.className = "w-full flex items-center justify-between text-left font-semibold bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
    toggle.setAttribute('onclick', `toggleCategory("${stage.id}")`)
    toggle.innerHTML = `
      <span>${stage.title}</span>
      <span class="carrot transition-transform transform" id="carrot-${stage.id}">▶</span>
    `
    wrapper.appendChild(toggle)

    const container = document.createElement('div')
    container.id = `category-${stage.id}`
    container.className = "ml-4 mt-2 space-y-2 transition-all overflow-hidden max-h-0"

    // Sort the lessons in this stage by order
    const sortedLessons = stage.lessons.sort((a, b) => a.order - b.order)
    sortedLessons.forEach(lesson => {
      const btn = document.createElement('button')
      btn.className = "lesson-link flex items-center justify-between w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
      btn.dataset.id = lesson.id
      btn.innerHTML = `
        <span>${lesson.title}</span>
        <span class="completion-bubble w-3 h-3 rounded-full bg-gray-500"></span>
      `
      container.appendChild(btn)
    })

    wrapper.appendChild(container)
    sidebar.appendChild(wrapper)
  })
}

// HANDLE COLLAPSIBLE CATEGORY TOGGLE (for stages)
window.toggleCategory = function (categoryId) {
  const section = document.getElementById(`category-${categoryId}`)
  const carrot = document.getElementById(`carrot-${categoryId}`)
  if (!section || !carrot) return

  const isCollapsed = section.style.maxHeight === '' || section.style.maxHeight === '0px'

  if (isCollapsed) {
    section.style.maxHeight = section.scrollHeight + 'px'
    carrot.textContent = '▼'
  } else {
    section.style.maxHeight = '0px'
    carrot.textContent = '▶'
  }
}

// SETUP LESSON CLICK EVENTS
function setupLessonClicks(type = 'cash') {
  document.querySelectorAll('.lesson-link').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.dataset.id

      // Iterate over stages and then lessons to find the matching lesson by id
      let lesson = null
      for (const stage of lessons[type]) {
        const found = stage.lessons.find(l => l.id === id)
        if (found) {
          lesson = found
          break
        }
      }

      if (!lesson) return

      // If the lesson type is 'learn', redirect accordingly (if applicable)
      if (lesson.type === 'learn') {
        window.location.href = `/learn.html?lesson=${lesson.path}`
        return
      }

      // Display the static lesson content in the main area
      const titleEl = document.getElementById('lesson-title')
      const contentEl = document.getElementById('lesson-content')
      titleEl.textContent = lesson.title
      contentEl.innerHTML = `
        <div>${lesson.content}</div>
        <button class="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" id="complete-btn">
          ✅ Mark Lesson Complete
        </button>
      `
      updateCompletionBubbles()

      document.getElementById('complete-btn').addEventListener('click', () => {
        markLessonCompleted(id)
        updateCompletionBubbles()
        alert('Lesson marked as complete!')
      })
    })
  })
}

// TOGGLE BUTTON EVENTS FOR SIDEBAR COLLAPSIBLE
const toggleCash = document.getElementById('toggle-cash')
const toggleTourney = document.getElementById('toggle-tourney')

function activateToggle(type) {
  populateSidebar(type)
  updateCompletionBubbles()
  setupLessonClicks(type)
}

if (toggleCash && toggleTourney) {
  toggleCash.addEventListener('click', () => activateToggle('cash'))
  toggleTourney.addEventListener('click', () => activateToggle('tournament'))
}

// INITIAL LOAD: Populate the sidebar and set a default lesson content area.
populateSidebar('cash')
updateCompletionBubbles()
setupLessonClicks('cash')

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lesson-title').textContent = "Select a Lesson"
  document.getElementById('lesson-content').innerHTML = `<p class="text-gray-400">Use the sidebar to choose a lesson and start learning.</p>`
})
