import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Turn Probes & Overbets: Advanced Postflop Tools</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Turn probes are bets made after the preflop raiser checks back the flop. Use them to attack capped ranges, especially in position.</li>
        <li>Good probe spots: When the turn is a scare card for your opponent (e.g., completes a straight or flush), or when you have a range/nut advantage.</li>
        <li>Sizing: Use smaller bets (33-50%) when attacking wide, weak ranges. Use larger bets (75%+) when polarized or when you have nut advantage.</li>
        <li>Overbets (bets &gt; pot size) are powerful on the turn/river when you can credibly represent the nuts and your opponent is capped.</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Practical Example</h2>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-black">
        <span className="font-bold">Example:</span> You check-call flop with a draw, turn completes your draw, opponent checks—overbet to maximize value and pressure their bluff-catchers. If you have the nut advantage, you can force folds from two pair or sets.
      </div>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Key Concepts</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Don’t overuse overbets—balance with value and bluffs. Overbet most when you block the nuts or have the nuts yourself.</li>
        <li>Use turn probes to attack weakness, and overbets to apply maximum pressure when you have a range/nut advantage.</li>
        <li>On the river, overbet when your opponent is capped and you can credibly represent the nuts.</li>
        <li>Be aware of board texture and opponent tendencies—don’t overbet into calling stations.</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Turn probes and overbets are advanced tools for extracting value and applying pressure.</li>
        <li>Balance your range and use these tools selectively for maximum profit.</li>
      </ul>
    </section>
  </div>
);

export default function Post5TurnRiverProbing() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 