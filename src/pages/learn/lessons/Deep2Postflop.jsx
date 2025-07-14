import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Deep Stack Play: Postflop Concepts</h2>
      <p className="mb-4">Postflop play changes dramatically when deep stacked. Pot control, hand selection, and aggression must all be adjusted to avoid costly mistakes and maximize value.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Be cautious with one-pair hands—big pots are often won with two pair or better.</li>
        <li>Use larger bet sizes on the flop and turn to build pots with strong draws and value hands.</li>
        <li>Be aware of stack-to-pot ratio (SPR) and how it affects your commitment to the pot.</li>
        <li>Bluff less frequently, but use more semi-bluffs with equity (draws, blockers).</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Deep Stack Postflop Play</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Plan your hand for multiple streets—think ahead about turn and river cards that help or hurt you.</li>
        <li>Leverage position: in deep pots, acting last is a huge advantage for controlling pot size and extracting value.</li>
        <li>Be aware of reverse implied odds—hands like top pair/weak kicker can cost you a stack if you’re not careful.</li>
        <li>Use blockers and removal effects when choosing your bluffing hands, especially on the river.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: Deep Stack Trap</h3>
      <p>With 200bb, slowplaying a set or nut flush draw can be disastrous if the board runs out poorly. Don’t be afraid to play big pots with the nuts, but avoid bloating the pot with marginal hands.</p>
      <p>Suppose you flop a set of 7s on a wet board (7♠ 8♠ 9♦). Fast play your hand—there are too many bad turn and river cards that can kill your action or put you behind.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Deep Stack Postflop Mistakes</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Calling down with one pair in a big pot—deep stacks mean opponents can apply more pressure with bluffs and value hands.</li>
        <li>Failing to adjust bet sizing—use larger bets to deny equity and build pots with strong hands.</li>
        <li>Not considering opponent tendencies—some players will overbluff deep, others will only bet big with the nuts.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Deep stack pots are more likely to see big bluffs and hero calls—be prepared.</li>
        <li>Adjust your aggression and hand selection based on position and opponent tendencies.</li>
        <li>Think ahead: plan your hand for multiple streets, not just the flop.</li>
        <li>Pot control is crucial—don’t bloat the pot with marginal hands.</li>
      </ul>
    </section>
  </div>
);

export default function Deep2Postflop() {
  return (
    <IndLessLayout lessonId="deep-2">
      <LessonContent />
    </IndLessLayout>
  );
} 