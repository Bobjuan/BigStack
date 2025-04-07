const lessons = [
    { id: 1, title: "What Is Texas Hold’em?" },
 { id: 2, title: "Poker Hand Rankings" },
    { id: 3, title: "Position & Ranges" },
    { id: 4, title: "Pot Odds & Equity" },
  ];
  
  const lessonList = document.getElementById("lesson-list");
  
  lessons.forEach((lesson) => {
    const isCompleted = localStorage.getItem(`lesson-${lesson.id}`) === "complete";
  
    const card = document.createElement("a");
    card.href = `lessons/lesson-${lesson.id}.html`;
    card.className = `p-6 rounded-xl shadow-lg border hover:border-green-500 transition duration-200 bg-gray-800 flex justify-between items-center ${
      isCompleted ? "opacity-70" : ""
    }`;
  
    card.innerHTML = `
      <div>
        <h2 class="text-xl font-bold">${lesson.title}</h2>
        <p class="text-sm text-gray-400">Lesson ${lesson.id}</p>
      </div>
      <div class="text-2xl">
        ${isCompleted ? "✅" : "➡️"}
      </div>
    `;
  
    lessonList.appendChild(card);
  });
  