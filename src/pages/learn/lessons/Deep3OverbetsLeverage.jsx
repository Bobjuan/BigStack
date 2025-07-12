import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Deep Stack Play: Overbets & Leverage</h2>
      <p className="mb-4">Deep stacks allow for creative use of overbets and leverage. Understanding when and how to use large bet sizes can put maximum pressure on opponents and extract value with strong hands.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Overbet the pot on favorable boards where you have a range or nut advantage.</li>
        <li>Use leverage to force opponents into tough decisions for large portions of their stack.</li>
        <li>Bluff with hands that block your opponent’s calling range and unblock their folding range.</li>
        <li>Don’t overuse overbets—balance them with value and bluffs.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Overbetting Concepts</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Overbets are most effective when you can credibly represent the nuts and your opponent is capped.</li>
        <li>Use overbets on turns and rivers to polarize your range—betting big with your strongest hands and best bluffs.</li>
        <li>Leverage is highest when you threaten your opponent’s tournament life or deep stack—use this to your advantage.</li>
        <li>Study solver outputs to learn which hands make the best overbet bluffs (blockers, removal, etc.).</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: Turn Overbet</h3>
      <p>On a board like K♠ 8♠ 2♦ 5♣, if you have the nut advantage, you can overbet the turn to put maximum pressure on capped ranges. Use blockers and removal effects to pick your best bluffing candidates.</p>
      <p>Suppose you hold A♠ Q♠ and the board is K♠ 8♠ 2♦ 5♣. You can overbet the turn, representing the nuts or a strong draw, and force folds from hands that can’t continue for a big bet.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Deep Stack Overbet Mistakes</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Overbetting too often without a credible story—opponents will catch on and call you down.</li>
        <li>Failing to balance value and bluffs—overbets should be polarized.</li>
        <li>Not adjusting to opponent tendencies—some players will never fold to overbets, others will overfold.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Overbets are a powerful tool, but require discipline and balance.</li>
        <li>Leverage is highest when you can threaten your opponent’s tournament life or deep stack.</li>
        <li>Study solver outputs and hand histories to learn when overbets are most effective.</li>
        <li>Always have a plan for the hand—don’t overbet without a reason.</li>
      </ul>
    </section>
  </div>
);

export default function Deep3OverbetsLeverage() {
  return (
    <IndLessLayout lessonId="deep-3">
      <LessonContent />
    </IndLessLayout>
  );
} 