const lessons = {
    'rules': {
      title: "What is Texas Hold'em?",
      content: `
        <p>Texas Hold'em is the most popular form of poker played today. Each player is dealt two private cards (&ldquo;hole cards&rdquo;) and must make the best five-card hand using a combination of their hole cards and five community cards.</p>
        <ul class="list-disc ml-6">
          <li>Each hand has four betting rounds: Preflop, Flop, Turn, and River.</li>
          <li>The best five-card poker hand wins the pot.</li>
        </ul>
      `
    },
    'hand-rankings': {
      title: "Hand Rankings",
      content: `
        <p>From highest to lowest, the standard poker hand rankings are:</p>
        <ol class="list-decimal ml-6">
          <li>Royal Flush</li>
          <li>Straight Flush</li>
          <li>Four of a Kind</li>
          <li>Full House</li>
          <li>Flush</li>
          <li>Straight</li>
          <li>Three of a Kind</li>
          <li>Two Pair</li>
          <li>One Pair</li>
          <li>High Card</li>
        </ol>
      `
    },
    'positions': {
      title: "Position Terminology",
      content: `
        <p>Position refers to where you sit at the table relative to the dealer. It's one of the most important concepts in poker strategy.</p>
        <ul class="list-disc ml-6">
          <li><strong>Early Position (EP)</strong> – first to act postflop (worst position)</li>
          <li><strong>Middle Position (MP)</strong> – average information</li>
          <li><strong>Late Position (LP)</strong> – last to act (best position)</li>
          <li><strong>Button</strong> – the dealer, considered the best position</li>
        </ul>
      `
    },
    'blinds-and-dealer': {
      title: "Blinds and Dealer Button",
      content: `
        <p>In Texas Hold'em, the action begins with the blinds — two forced bets that drive the action.</p>
        <ul class="list-disc ml-6">
          <li><strong>Small Blind (SB):</strong> Player to the immediate left of the dealer button posts this.</li>
          <li><strong>Big Blind (BB):</strong> Player two seats left of the dealer posts a larger forced bet.</li>
          <li><strong>Dealer Button:</strong> Rotates clockwise each hand and determines the order of action.</li>
        </ul>
      `
    }
  }
  
  function markLessonCompleted(id) {
    const completed = JSON.parse(localStorage.getItem('completedLessons') || '[]')
    if (!completed.includes(id)) {
      completed.push(id)
      localStorage.setItem('completedLessons', JSON.stringify(completed))
    }
  }
  
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
  
  // Generate Sidebar
  function populateSidebar() {
    const sidebar = document.getElementById('lesson-sidebar')
    const section = document.createElement('div')
  
    const header = document.createElement('h3')
    header.className = "text-sm text-gray-400 uppercase font-semibold mb-2"
    header.textContent = "The Very Basics"
    section.appendChild(header)
  
    const list = document.createElement('ul')
    list.className = "space-y-2"
  
    Object.entries(lessons).forEach(([id, lesson], index) => {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.dataset.id = id
      btn.className = "lesson-link flex items-center justify-between w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
      btn.innerHTML = `
        <span>${index + 1}. ${lesson.title}</span>
        <span class="completion-bubble w-3 h-3 rounded-full bg-gray-500"></span>
      `
      li.appendChild(btn)
      list.appendChild(li)
    })
  
    section.appendChild(list)
    sidebar.appendChild(section)
  }
  
  // Display Selected Lesson
  function setupLessonClicks() {
    const titleEl = document.getElementById('lesson-title')
    const contentEl = document.getElementById('lesson-content')
  
    document.querySelectorAll('.lesson-link').forEach(link => {
      link.addEventListener('click', () => {
        const id = link.dataset.id
        const lesson = lessons[id]
  
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
  
  populateSidebar()
  setupLessonClicks()
  updateCompletionBubbles()
  