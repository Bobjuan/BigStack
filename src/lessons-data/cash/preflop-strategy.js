// src/lessons-data/cash/preflop-strategy.js

export default {
    id: "preflop-strategy",
    title: "Preflop Strategy",
    lessons: [
      {
        id: "starting-hands",
        title: "Starting Hand Selection",
        content: `
          <p>Choosing the right starting hands is key to long-term success. Not all hands are created equal.</p>
          <ul class="list-disc ml-6 mt-4">
            <li>Premium Hands: AA, KK, QQ, AK — almost always raise.</li>
            <li>Playable Hands: AQ, AJ, KQ, TT-88 — good from later positions or versus weak players.</li>
            <li>Speculative Hands: suited connectors, small pairs — playable in multiway pots with deep stacks.</li>
            <li>Trash Hands: 72o, J4o — fold them unless you're trolling.</li>
          </ul>
          <p class="mt-4">Tighter ranges in early position, looser ranges in late position is a great beginner framework.</p>
        `
      },
      {
        id: "open-raise-sizing",
        title: "Open Raise Sizing",
        content: `
          <p>Your open raise size affects the size of the pot and the decisions opponents make.</p>
          <ul class="list-disc ml-6 mt-4">
            <li>Cash Games: Standard is 2.5x to 3x the big blind.</li>
            <li>Tournaments: Start with 2.5x early, reduce to 2x as blinds go up.</li>
            <li>Deep Stacks: Larger opens can apply more pressure.</li>
          </ul>
          <p class="mt-4">Smaller opens save chips, larger opens isolate. Adjust sizing to your goals and table dynamics.</p>
        `
      },
      {
        id: "preflop-position-adjustments",
        title: "Adjusting by Position",
        content: `
          <p>Position should always influence which hands you play preflop:</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Early Position (EP):</strong> Play only your strongest hands.</li>
            <li><strong>Middle Position (MP):</strong> Add a few more playable hands like suited connectors.</li>
            <li><strong>Late Position (LP):</strong> Steal more often with a wider range — you have position advantage.</li>
            <li><strong>Blinds:</strong> Defend selectively. You're out of position postflop — tighten up or mix in 3-bets.</li>
          </ul>
          <p class="mt-4">Being last to act lets you realize your equity more often. Open wider and defend more aggressively from the Button.</p>
        `
      },
      {
        id: "stack-depth-adjustments",
        title: "Adjusting to Stack Depth",
        content: `
          <p>Stack size should always influence your preflop decisions. Deep stacks allow speculative play, while short stacks require tighter ranges and sharper aggression.</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Deep (100bb+):</strong> Suited connectors, small pairs gain value — implied odds matter.</li>
            <li><strong>Mid (40–80bb):</strong> More linear ranges. Broadways > speculative hands.</li>
            <li><strong>Short (20–40bb):</strong> Push-fold math becomes key. 3-bets shrink — jam ranges expand.</li>
            <li><strong>Very Short (&lt;20bb):</strong> Prioritize fold equity. Open-jam or fold.</li>
          </ul>
          <p class="mt-4">Knowing your stack and the effective stack at the table is vital to good preflop decisions.</p>
        `
      },
      {
        id: "exploitative-preflop-adjustments",
        title: "Exploitative Preflop Adjustments",
        content: `
          <p>GTO is great, but real money is made through exploits. Recognize player leaks and punish them preflop:</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>vs Tight Players:</strong> Open wider and steal relentlessly.</li>
            <li><strong>vs Calling Stations:</strong> Cut down on bluffs and value bet wider.</li>
            <li><strong>vs Maniacs:</strong> Trap with premiums, slow down with marginal hands.</li>
            <li><strong>vs Passive Players:</strong> Use smaller raises to deny odds while risking less.</li>
          </ul>
          <p class="mt-4">Exploit poker is opponent-specific. Pay attention and deviate when the data supports it.</p>
        `
      },
      {
        id: "blind-defense-strategy",
        title: "Defending the Blinds",
        content: `
          <p>You're out of position from the blinds — but that doesn't mean you should fold everything. Balance is key.</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Big Blind:</strong> Defend wide vs small opens. You already have 1BB in — realize equity with decent hands.</li>
            <li><strong>Small Blind:</strong> Defend tighter due to worst position postflop. Use 3-bets to compensate.</li>
            <li><strong>Facing 3x or 4x Opens:</strong> Tighten up considerably — pot odds shrink, fold more often.</li>
          </ul>
          <p class="mt-4">When in doubt, fold the trash, call with the middling stuff, raise your strong hands — and always know who you're defending against.</p>
        `
      },
      {
        id: "isolation-raises",
        title: "Isolation Raises",
        content: `
          <p>Isolating limpers is a profitable preflop tactic. It denies them equity and puts you in control heads-up.</p>
          <ul class="list-disc ml-6 mt-4">
            <li>Raise 4x + 1BB per limper from position.</li>
            <li>Target weak limpers with playable hands — suited broadways, big aces, small pairs.</li>
            <li>Be cautious if there are many limpers and short stacks left to act.</li>
          </ul>
          <p class="mt-4">Think of isolation raises as small, surgical strikes. Pick your spots, and punish passivity.</p>
        `
      },
      {
        id: "cold-calling-preflop",
        title: "Cold Calling Preflop",
        content: `
          <p>Cold calling (just calling a raise preflop) is rarely optimal in today's aggressive meta — unless conditions are right:</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Multiway Potential:</strong> Good for suited connectors and small pairs.</li>
            <li><strong>Trappy Spots:</strong> Cold call AA/KK to induce squeezes from behind.</li>
            <li><strong>Passive Tables:</strong> If no one is squeezing, cold calling becomes safer.</li>
          </ul>
          <p class="mt-4">Over-calling is a leak. You’re capping your range and giving initiative to someone else. Use it carefully.</p>
        `
      },
      {
        id: "preflop-range-construction",
        title: "Constructing Your Preflop Ranges",
        content: `
          <p>Building strong preflop ranges for each position helps you play faster and better under pressure.</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Use Range Charts:</strong> Start with standard open ranges by position. Stick to them until you're confident deviating.</li>
            <li><strong>Balanced Ranges:</strong> Include bluffs, suited aces, and some connectors in raising ranges — not just premiums.</li>
            <li><strong>Know Your Combos:</strong> A♠K♠ is not the same as A♦K♣. Blocker effects matter in GTO ranges.</li>
          </ul>
          <p class="mt-4">Use tools like Equilab or GTO Wizard to study your ranges — then burn them into your muscle memory.</p>
        `
      },
      {
        id: "preflop-icm-considerations",
        title: "ICM Considerations Preflop (Tournaments)",
        content: `
          <p>In tournaments, chip EV isn't everything — survival matters. ICM (Independent Chip Model) makes preflop spots more complex.</p>
          <ul class="list-disc ml-6 mt-4">
            <li><strong>Near the Money:</strong> Tighten up significantly — calling wide can cost a huge equity drop.</li>
            <li><strong>Bubble Play:</strong> Put pressure on medium stacks who want to survive — attack, don’t coast.</li>
            <li><strong>Final Table:</strong> Use ICM calculators to study jam/fold charts. Many standard calls become folds.</li>
          </ul>
          <p class="mt-4">ICM is the art of survival pressure — your job is to apply it, not fall victim to it.</p>
        `
      }
      

    ]
  }
  