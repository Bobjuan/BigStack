import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Target Audience & Course Goals</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Beat small stakes cash games</li>
        <li>Progress to middle stakes as quickly as possible</li>
        <li>Realize the dream of making significant money from poker</li>
      </ul>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-black">
        <span className="font-bold">Note:</span> This course is <span className="font-bold">not</span> for total beginners. It's for players with some poker experience who want to move up and win.
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-2">The Core Philosophy – How You Win in Small Stakes</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><span className="font-bold">Profit comes from exploiting opponents' mistakes.</span></li>
        <li>Small stakes games are very profitable because the average player is weak.</li>
        <li>Unlike high-stakes (where GTO is key), here you should play an <span className="italic">exploitable strategy</span> to take advantage of frequent blunders.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-2">Unlearning Bad Habits & Adopting Effective Strategies</h2>
      <p className="mb-2">To improve, you may need to forget some old advice:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Many books say "play tight, only put money in with the best hand." This is not enough to win big in small stakes.</li>
        <li>To get good at poker, you must:
          <ul className="list-decimal ml-6 mt-2">
            <li>Play a technically sound strategy</li>
            <li>Be able to 'get out of line' to exploit mistakes</li>
            <li>Think outside the box</li>
          </ul>
        </li>
      </ul>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-black">
        <span className="font-bold">Example:</span> Adaptive Strategy with A-J<br/>
        Suppose someone raises from middle position and you have A-J on the button:
        <ul className="list-disc ml-6 mt-2">
          <li><span className="font-semibold">Against overly tight players:</span> Fold (they only raise with hands that dominate you)</li>
          <li><span className="font-semibold">Against reasonably active players:</span> Call is probably best</li>
          <li><span className="font-semibold">Against wild players:</span> Reraise for value</li>
        </ul>
        <div className="mt-2 text-sm text-gray-700">
          Simple preflop charts ("always reraise with A-J") lead to trouble. Success requires adjusting your strategy based on your opponents' tendencies.
        </div>
      </div>
    </section>
  </div>
);

export default function LessonFound01() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 