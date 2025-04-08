// src/lessons-data/cash/the-very-basics.js

export default {
    id: "the-very-basics",
    title: "The Very Basics",
    lessons: [
      {
        id: "rules",
        title: "What is Texas Hold'em?",
        content: `
          <p>Texas Hold'em is the most popular form of poker played today. Each player is dealt two private cards (&ldquo;hole cards&rdquo;) and must make the best five-card hand using a combination of their hole cards and five community cards.</p>
          <ul class="list-disc ml-6">
            <li>Each hand has four betting rounds: Preflop, Flop, Turn, and River.</li>
            <li>The best five-card poker hand wins the pot.</li>
          </ul>
        `
      },
      {
        id: "hand-rankings",
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
      {
        id: "positions",
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
      {
        id: "blinds-and-dealer",
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
    ]
  }
  