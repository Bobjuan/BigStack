import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Spotting Tilt in Others</h2>
      <p className="mb-4">Being able to recognize when your opponents are on tilt can give you a significant edge. Tilted players make more mistakes, play too loose or aggressive, and are easier to exploit.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Look for signs: rapid betting, talking to themselves, complaining, or playing every hand.</li>
        <li>Adjust your strategy: value bet thinner, avoid bluffing, and let them make mistakes.</li>
        <li>Don’t antagonize—let them tilt themselves, and stay focused on your own game.</li>
        <li>Be aware: even strong players can tilt after a big loss or bad beat.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Tilt Detection</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Watch for changes in betting patterns—sudden aggression or passivity can signal tilt.</li>
        <li>Listen for verbal cues: sighs, muttering, or blaming luck are classic tilt tells.</li>
        <li>Track hands: if a player loses a big pot and immediately starts playing more hands, they may be tilting.</li>
        <li>Use observation breaks: when not in a hand, focus on reading the table and noting emotional shifts.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Practical Advice: Exploiting Tilt</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Value bet thinner against tilted players—they call with worse hands.</li>
        <li>Avoid fancy bluffs—tilted players are more likely to call you down light.</li>
        <li>Stay patient—let them make mistakes and don’t force the action.</li>
        <li>Keep your own emotions in check—don’t get drawn into their chaos.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: Exploiting a Tilted Opponent</h3>
      <p>A player loses a big pot and immediately starts raising every hand. Tighten up, value bet more, and avoid fancy bluffs—let them pay you off.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Spotting tilt in others is a skill—practice observation at the table.</li>
        <li>Stay disciplined and don’t get drawn into their emotional play.</li>
        <li>Capitalize on their mistakes, but don’t become the next victim of tilt yourself.</li>
        <li>Emotional control is a weapon—use it to your advantage.</li>
      </ul>
    </section>
  </div>
);

export default function Mental2SpottingTilt() {
  return (
    <IndLessLayout lessonId="mental-2">
      <LessonContent />
    </IndLessLayout>
  );
} 