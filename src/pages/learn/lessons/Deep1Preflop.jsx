import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Deep Stack Play: Preflop Adjustments</h2>
      <p className="mb-4">Playing deep stacked (150bb+) changes preflop strategy. The value of hands that can make the nuts increases, while high card hands and offsuit broadways decrease in value. Adjust your ranges and aggression accordingly.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Play more suited connectors and one-gappers; they have high implied odds.</li>
        <li>Be more selective with offsuit broadways and weak aces.</li>
        <li>4-bet a little tighter, and use suited aces as your bluffs.</li>
        <li>Defend a bit wider versus opens and 3/4-bets, especially in position.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Preflop Concepts</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Deep stacks increase the value of speculative hands—hands like 54s, 76s, and small pairs can win huge pots.</li>
        <li>Be cautious with dominated hands (e.g., KJo, QTo) as they can cost you big pots when deep.</li>
        <li>Consider 3-betting more often in position with suited connectors and suited aces to build pots with hands that play well postflop.</li>
        <li>Be aware of stack sizes behind you—avoid bloating the pot out of position with marginal hands.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: 200bb Deep</h3>
      <p>At 200bb, hands like 65s, 87s, and suited aces go up in value. You can call or 3-bet these hands more often, especially in position, because of their potential to win big pots.</p>
      <p>Suppose you are in the cutoff with 200bb and face a raise from the hijack. Calling with 76s is profitable because you can win a big pot if you hit a disguised straight or flush.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Deep Stack Preflop Mistakes</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Overvaluing top pair hands—reverse implied odds are real and can cost you big pots.</li>
        <li>Calling too wide out of position—deep stacks magnify positional disadvantage.</li>
        <li>Failing to adjust to aggressive opponents—tighten up your calling range if opponents are 3-betting a lot.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Deep stacks reward hands that can make straights and flushes.</li>
        <li>Be cautious with top pair hands—reverse implied odds are real.</li>
        <li>Position is even more important when deep stacked.</li>
        <li>Speculative hands go up in value, but only if you play them well postflop.</li>
      </ul>
    </section>
  </div>
);

export default function Deep1Preflop() {
  return (
    <IndLessLayout lessonId="deep-1">
      <LessonContent />
    </IndLessLayout>
  );
} 