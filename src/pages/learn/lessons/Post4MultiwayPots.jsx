import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Multiway Pots: Key Adjustments</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Play much tighter for value—someone almost always has a piece.</li>
        <li>Value bet with stronger hands only. Top pair/top kicker is often not enough for three streets.</li>
        <li>Bluff less often; avoid big bluffs unless you have strong blockers and a great read.</li>
        <li>Check more marginal hands, especially out of position. Let others make mistakes.</li>
        <li>Position is even more important: act last, control pot size, and realize equity.</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Practical Example</h2>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-black">
        <span className="font-bold">Example:</span> In a 3-way pot, you have KQ on Q♠ 7♥ 2♦ rainbow. Bet for value, but slow down if you face resistance from both opponents. If you get raised and called, your hand is often not good enough to continue.
      </div>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Key Concepts</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>When facing aggression, fold more often—don’t pay off with marginal hands.</li>
        <li>Draws go down in value unless they are to the nuts. Avoid chasing weak draws.</li>
        <li>Bluff-catching is less profitable; players call more often in multiway pots.</li>
        <li>Don’t try to push multiple opponents off hands unless you have a strong read.</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Tighten up your value range.</li>
        <li>Value bet strong, avoid fancy plays, and respect aggression.</li>
        <li>Multiway pots reward patience and discipline.</li>
      </ul>
    </section>
  </div>
);

export default function Post4MultiwayPots() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 