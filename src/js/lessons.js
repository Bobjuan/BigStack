// src/lessons.js

import TheVeryBasics from '../lessons-data/cash/the-very-basics.js'
import PlayerTypes from '../lessons-data/cash/player-types.js'
import Strategy from '../lessons-data/cash/strategy.js'
import PreflopStrategy from '../lessons-data/cash/preflop-strategy.js'


const lessons = {
    cash: [
      TheVeryBasics,
      PlayerTypes,
      Strategy,
      PreflopStrategy
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

// POPULATE SIDEBAR
function populateSidebar(type = 'cash') {
  const sidebar = document.getElementById('lesson-sidebar')
  sidebar.innerHTML = ''

  const lessonSet = lessons[type] || []

  lessonSet.forEach(category => {
    const wrapper = document.createElement('div')
    wrapper.className = 'mb-4'

    const toggle = document.createElement('button')
    toggle.className = "w-full flex items-center justify-between text-left font-semibold bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
    toggle.setAttribute('onclick', `toggleCategory("${category.id}")`)
    toggle.innerHTML = `
      <span>${category.title}</span>
      <span class="carrot transition-transform transform" id="carrot-${category.id}">▶</span>
    `
    wrapper.appendChild(toggle)

    const container = document.createElement('div')
    container.id = `category-${category.id}`
    container.className = "ml-4 mt-2 space-y-2 transition-all overflow-hidden max-h-0"

    category.lessons.forEach(lesson => {
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

// HANDLE COLLAPSIBLE CATEGORY TOGGLE
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
  const titleEl = document.getElementById('lesson-title')
  const contentEl = document.getElementById('lesson-content')

  document.querySelectorAll('.lesson-link').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.dataset.id
      const lesson = lessons[type]
        .flatMap(category => category.lessons)
        .find(lesson => lesson.id === id)

      if (lesson) {
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
      }
    })
  })
}

// TOGGLE BUTTON EVENTS
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

// INITIAL LOAD
populateSidebar('cash')
updateCompletionBubbles()
setupLessonClicks('cash')
