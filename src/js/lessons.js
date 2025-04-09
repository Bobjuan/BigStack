// src/lessons.js

// Import modules for non-beginner lessons
import TheVeryBasics from '../lessons-data/cash/The-very-basics/TheVeryBasics.js'
import HandRankingsModule from '../lessons-data/cash/The-very-basics/hand-rankings.js'
import PositionsAndBlindsModule from '../lessons-data/cash/The-very-basics/positions-and-blinds.js'
import PlayerTypes from '../lessons-data/cash/player-types.js'
import Strategy from '../lessons-data/cash/strategy.js'
import PreflopStrategy from '../lessons-data/cash/preflop-strategy.js'

// Group lessons into logical stages.
// Stage 1: Foundations will load pivot navigation from a JSON file.
// Stages 2 and 3 are module-based lessons.
const lessons = {
  cash: [
    {
      id: "foundations",
      title: "Stage 1: Foundations",
      pivot: true,         // Indicates this stage loads lessons from a JSON file
      lessons: []          // Not used since we load the JSON dynamically
    },
    {
      id: "intermediate",
      title: "Stage 2: Intermediate Concepts",
      lessons: [
        {
          ...PlayerTypes,
          order: 1
        },
        {
          ...Strategy,
          order: 2
        }
      ]
    },
    {
      id: "advanced",
      title: "Stage 3: Advanced Tactics",
      lessons: [
        {
          ...PreflopStrategy,
          order: 1
        }
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

// POPULATE SIDEBAR: Create a button for each stage.
function populateSidebar(type = 'cash') {
  const sidebar = document.getElementById('lesson-sidebar')
  sidebar.innerHTML = ''

  const stageSet = lessons[type] || []

  stageSet.forEach(stage => {
    const wrapper = document.createElement('div')
    wrapper.className = 'mb-4'

    const toggle = document.createElement('button')
    toggle.className = "w-full flex items-center justify-between text-left font-semibold bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
    
    if (stage.pivot) {
      // For pivot stages (like Foundations), clicking the button loads dynamic JSON content.
      toggle.addEventListener('click', () => {
        loadAndDisplayPivotLesson(stage.id)
      })
      toggle.innerHTML = `<span>${stage.title}</span>`
    } else {
      toggle.setAttribute('onclick', `toggleCategory("${stage.id}")`)
      toggle.innerHTML = `
        <span>${stage.title}</span>
        <span class="carrot transition-transform transform" id="carrot-${stage.id}">▶</span>
      `
    }
    wrapper.appendChild(toggle)

    if (!stage.pivot) {
      const container = document.createElement('div')
      container.id = `category-${stage.id}`
      container.className = "ml-4 mt-2 space-y-2 transition-all overflow-hidden max-h-0"

      // Sort lessons by order within the stage.
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
    }
    sidebar.appendChild(wrapper)
  })
}

// HANDLE COLLAPSIBLE CATEGORY TOGGLE for non-pivot stages.
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

// SETUP LESSON CLICK EVENTS for non-pivot lessons.
function setupLessonClicks(type = 'cash') {
  document.querySelectorAll('.lesson-link').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.dataset.id

      // Search for the matching lesson in the stages.
      let lesson = null
      for (const stage of lessons[type]) {
        if (stage.pivot) continue // Skip pivot stages
        const found = stage.lessons.find(l => l.id === id)
        if (found) {
          lesson = found
          break
        }
      }
      if (!lesson) return

      if (lesson.type === 'learn') {
        window.location.href = `/learn.html?lesson=${lesson.path}`
        return
      }

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

// FUNCTIONS FOR PIVOT LESSONS (Foundations Stage)
// Loads dynamic lessons (for example, hand rankings) from a JSON file.
async function loadAndDisplayPivotLesson(stageId) {
  if (stageId === "foundations") {
    try {
      // Updated fetch URL: ensure the JSON file is placed in the public folder.
      const res = await fetch('/lessons-data/learn/hand-rankings.json')
      const data = await res.json()
      // Use the "steps" array from the JSON file (change this if your JSON structure changes)
      const lessonsArray = data.steps 
      displayPivotLesson(lessonsArray, 0)
    } catch (error) {
      console.error("Error loading pivot lessons JSON:", error)
    }
  }
}

// Displays a pivot lesson and sets up navigation between steps.
function displayPivotLesson(lessonsArray, currentIndex) {
  const lesson = lessonsArray[currentIndex]
  const titleEl = document.getElementById('lesson-title')
  const contentEl = document.getElementById('lesson-content')
  titleEl.textContent = lesson.title
  // Display the lesson message (from the JSON "message" property)
  contentEl.innerHTML = `
    <div>${lesson.message}</div>
    <div class="pivot-nav mt-4">
      <button id="prev-lesson" ${currentIndex === 0 ? 'disabled' : ''} class="mr-2 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">Previous</button>
      <button id="next-lesson" ${currentIndex === lessonsArray.length - 1 ? 'disabled' : ''} class="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded">Next</button>
    </div>
  `
  const prevBtn = document.getElementById('prev-lesson')
  const nextBtn = document.getElementById('next-lesson')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) displayPivotLesson(lessonsArray, currentIndex - 1)
    })
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < lessonsArray.length - 1) displayPivotLesson(lessonsArray, currentIndex + 1)
    })
  }
}

// TOGGLE BUTTONS FOR SIDEBAR (Cash/Tournament)
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

// INITIAL LOAD: Populate the sidebar and set the default content.
populateSidebar('cash')
updateCompletionBubbles()
setupLessonClicks('cash')

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lesson-title').textContent = "Select a Lesson"
  document.getElementById('lesson-content').innerHTML = `<p class="text-gray-400">Use the sidebar to choose a lesson and start learning.</p>`
})
