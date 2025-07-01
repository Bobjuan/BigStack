import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Essential Mindset & Bankroll Prerequisites</h2>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Bankroll Requirements for Small Stakes Success</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Maintain a bankroll of at least <span className="font-bold">2,500 big blinds</span></li>
        <li>For $1/$2 games (big blind = $2): <span className="font-bold">$5,000</span> is ideal</li>
        <li>$3,000 (1,500BB) is possible, but 2,500BB is safer</li>
        <li>Learning to play well lets you move up to middle stakes (where the real money is)</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">The Critical Role of Mindset</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Poker can be infuriating; a poor attitude leads to misery and failure</li>
        <li>Mindset is so important, we'll cover it in detail later—but you need to understand its importance from the start</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">The Source of Profit</h3>
      <ul className="list-disc ml-6 mb-4">
        <li><span className="font-bold">Most money is made by exploiting opponents' mistakes</span></li>
        <li>Great plays matter, but exploiting errors is where most profit comes from</li>
      </ul>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-black">
        <span className="font-bold">Quote:</span> "If you ever hear someone say 'I would win if my opponents would stop making bad plays,' they are clearly unaware of this most basic concept."
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-black">
        Instead of being frustrated by bad plays, learn to recognize and exploit them. That's the path to consistent profits!
      </div>
    </section>
  </div>
);

export default function LessonFound03() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 