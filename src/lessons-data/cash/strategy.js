// src/lessons-data/cash/strategy.js

export default {
    id: "strategy",
    title: "Strategy",
    lessons: [
      {
        id: "beginner-strategy",
        title: "Beginner Strategy Overview",
        content: `
          <p>At its core, poker is a game of information, probabilities, and pressure. Your goal is to make better decisions than your opponents over time. These beginner tips will set you on the right path:</p>
          <ul class="list-disc ml-6 mt-4">
            <li>Play fewer hands, but play them aggressively.</li>
            <li>Fold more often than you think — weak hands lose money.</li>
            <li>Pay attention to position — the later you act, the more information you have.</li>
            <li>Don't chase draws without the right odds — that’s how beginners lose stacks.</li>
            <li>Focus on learning, not winning every hand. Think long term.</li>
          </ul>
          <p class="mt-4">Poker is not about who wins the most hands, it's about who makes the fewest mistakes and exploits others' errors over time.</p>
        `
      },
      {
        id: "what-is-gto",
        title: "What is GTO?",
        content: `
          <p>Game Theory Optimal (GTO) is a balanced poker strategy that cannot be exploited by an opponent, no matter how skilled they are. It doesn’t rely on tricks or reads — just math, logic, and balance.</p>
          <ul class="list-disc ml-6 mt-4">
            <li>Always includes a mix of value bets and bluffs</li>
            <li>Assumes opponents are playing perfectly — which protects you from being exploited</li>
            <li>Focuses on ratios (e.g., how often you bluff vs. value bet)</li>
          </ul>
          <p class="mt-4">GTO isn’t about winning every hand — it’s about becoming unexploitable over time. Pros use solvers to study GTO-based decisions to guide their play.</p>
        `
      },
      {
        id: "when-to-deviate",
        title: "When to Deviate from GTO",
        content: `
          <p>GTO is a strong foundation, but it’s not always the best strategy. In lower-stakes games, most opponents aren’t playing GTO themselves — they make big mistakes, and you can exploit those mistakes.</p>
          <h3 class="text-lg font-bold mt-4">Reasons to Deviate:</h3>
          <ul class="list-disc ml-6">
            <li>You know your opponent folds too much — so you bluff more often</li>
            <li>Your opponent never folds — so you rarely bluff and value bet thin</li>
            <li>You’re playing a tournament and want to preserve chips (ICM considerations)</li>
          </ul>
          <p class="mt-4">Deviating from GTO to exploit bad play is often called “exploitative” poker — and it’s how most pros make serious money.</p>
        `
      },
      {
        id: "balancing-your-range",
        title: "Balancing Your Range",
        content: `
          <p>To avoid becoming predictable, strong players "balance their range" — meaning they play a mix of strong and weak hands in similar ways.</p>
          <p class="mt-4">If you always bet with strong hands and check with weak ones, you’re easy to read. Instead, mix in hands that don't fit the pattern:</p>
          <ul class="list-disc ml-6">
            <li>Bluff on the flop with missed hands</li>
            <li>Check-raise strong hands sometimes instead of betting right away</li>
            <li>Call in spots where you could raise, and raise in spots you usually call</li>
          </ul>
          <p class="mt-4">Balanced ranges make you tougher to play against — your opponents never know where they stand.</p>
        `
      }
    ]
  }
  