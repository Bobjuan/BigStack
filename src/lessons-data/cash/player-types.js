// src/lessons-data/cash/player-types.js

export default {
    id: "player-types",
    title: "Player Types",
    lessons: [
      {
        id: "player-types-grid",
        title: "Player Archetypes: The Grid",
        content: `
          <p>Understanding player types is crucial for adapting your strategy. This 2x2 grid maps players based on their aggression and tightness:</p>
          <div class="grid grid-cols-2 gap-4 mt-8">
            <div class="flex flex-col items-center">
              <span class="text-xl font-bold">Tight</span>
              <div class="w-24 h-24 flex items-center justify-center bg-gray-600 rounded-md border border-gray-300">
                <div class="w-8 h-8 bg-red-500 rounded-full hover:cursor-pointer" title="Tight Player (Nit): Tight, conservative play. Play hands with high value."></div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xl font-bold">Loose</span>
              <div class="w-24 h-24 flex items-center justify-center bg-gray-600 rounded-md border border-gray-300">
                <div class="w-8 h-8 bg-red-500 rounded-full hover:cursor-pointer" title="Loose Player (LAG): Plays more hands, aggressive, can bluff frequently."></div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xl font-bold">Aggressive</span>
              <div class="w-24 h-24 flex items-center justify-center bg-gray-600 rounded-md border border-gray-300">
                <div class="w-8 h-8 bg-red-500 rounded-full hover:cursor-pointer" title="Aggressive Player (LAG): Increases betting frequency, puts pressure on others."></div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-xl font-bold">Passive</span>
              <div class="w-24 h-24 flex items-center justify-center bg-gray-600 rounded-md border border-gray-300">
                <div class="w-8 h-8 bg-red-500 rounded-full hover:cursor-pointer" title="Passive Player (Calling Station): Calls often, weak hands."></div>
              </div>
            </div>
          </div>
          <p class="mt-4">Hover on dots to see player types. Adjust your strategy accordingly!</p>
        `
      }
    ]
  }
  