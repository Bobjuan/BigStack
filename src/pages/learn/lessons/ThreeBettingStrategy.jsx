import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-3xl font-bold mb-2">3-Betting Strategy</h2>
      <p className="mb-4">3-betting is one of the most powerful weapons in poker. A well-constructed 3-betting strategy allows you to build bigger pots with your strong hands and put pressure on your opponents with well-chosen bluffs.</p>
    </section>
    <section>
      <h3 className="text-2xl font-semibold mb-2 mt-4">Position-Based 3-Betting</h3>
      <h4 className="text-xl font-semibold mt-2 mb-1">In Position 3-Betting:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>More aggressive frequencies</li>
        <li>Wider value range</li>
        <li>More bluffing opportunities</li>
        <li>Can include more speculative hands</li>
        <li>Better post-flop playability</li>
      </ul>
      <h4 className="text-xl font-semibold mt-2 mb-1">Out of Position 3-Betting:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Tighter value range</li>
        <li>More polarized strategy</li>
        <li>Premium hands and strong bluffs</li>
        <li>Less speculative hands</li>
        <li>Focus on strong playability</li>
      </ul>
    </section>
    <section>
      <h3 className="text-2xl font-semibold mb-2 mt-4">Hand Selection</h3>
      <h4 className="text-xl font-semibold mt-2 mb-1">Value 3-Bets:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Premium pairs (QQ+)</li>
        <li>Strong broadway hands (AK, AQs)</li>
        <li>Position-dependent strength</li>
        <li>Hands that play well multiway</li>
        <li>Good post-flop playability</li>
      </ul>
      <h4 className="text-xl font-semibold mt-2 mb-1">Bluff 3-Bets:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Suited connectors in position</li>
        <li>Blocker effects (AXs, KXs)</li>
        <li>Good removal properties</li>
        <li>Playable post-flop</li>
        <li>Balance with value range</li>
      </ul>
    </section>
    <section>
      <h3 className="text-2xl font-semibold mb-2 mt-4">Sizing Considerations</h3>
      <h4 className="text-xl font-semibold mt-2 mb-1">Standard Sizing:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Usually 3x the original raise</li>
        <li>Adjust based on position</li>
        <li>Consider stack depths</li>
        <li>Account for antes if present</li>
        <li>Larger vs limpers</li>
      </ul>
      <h4 className="text-xl font-semibold mt-2 mb-1">Situational Adjustments:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Larger sizes out of position</li>
        <li>Smaller sizes in position</li>
        <li>Adjust for opponent tendencies</li>
        <li>Consider table dynamics</li>
        <li>Account for stack-to-pot ratio</li>
      </ul>
    </section>
    <section>
      <h3 className="text-2xl font-semibold mb-2 mt-4">Post-Flop Strategy</h3>
      <h4 className="text-xl font-semibold mt-2 mb-1">C-Betting Strategy:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Higher frequency on favorable boards</li>
        <li>Smaller sizes on dry boards</li>
        <li>Larger sizes on wet boards</li>
        <li>Consider range advantage</li>
        <li>Adjust based on opponent's calling range</li>
      </ul>
      <h4 className="text-xl font-semibold mt-2 mb-1">When Called:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>Continue with strong value hands</li>
        <li>Have clear bluffing strategy</li>
        <li>Consider board texture</li>
        <li>Plan for multiple streets</li>
        <li>Maintain balanced ranges</li>
      </ul>
    </section>
    <section>
      <h3 className="text-2xl font-semibold mb-2 mt-4">Common Mistakes</h3>
      <h4 className="text-xl font-semibold mt-2 mb-1">Strategic Errors:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>3-betting too wide out of position</li>
        <li>Not having enough bluffs</li>
        <li>Poor hand selection for bluffs</li>
        <li>Incorrect sizing adjustments</li>
        <li>Not considering stack depths</li>
      </ul>
      <h4 className="text-xl font-semibold mt-2 mb-1">Post-Flop Mistakes:</h4>
      <ul className="list-disc ml-6 mb-4">
        <li>C-betting too frequently</li>
        <li>Wrong sizing choices</li>
        <li>Not planning for turns</li>
        <li>Poor bluff selection</li>
        <li>Giving up too easily</li>
      </ul>
    </section>
  </div>
);

export default function ThreeBettingStrategy() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 