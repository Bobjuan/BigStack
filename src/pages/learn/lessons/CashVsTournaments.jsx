import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold text-white">
      Understanding Cash Games vs Tournaments
    </h4>

    <p className="text-white">
      Cash games and tournaments are two fundamentally different formats of poker, each requiring distinct strategies and approaches. Understanding these differences is crucial for success in either format.
    </p>

    <h5 className="text-xl font-bold text-white mt-6">
      Structural Differences
    </h5>
    
    <p className="text-white mt-2 mb-1">
      Cash Games:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Fixed blind levels</li>
      <li className="text-white">Can buy in for any amount within table limits</li>
      <li className="text-white">Can reload or leave at any time</li>
      <li className="text-white">Consistent stack-to-blind ratios</li>
      <li className="text-white">More emphasis on deep stack play</li>
    </ul>

    <p className="text-white mt-2 mb-1">
      Tournaments:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Increasing blind levels</li>
      <li className="text-white">Fixed buy-in amount</li>
      <li className="text-white">Must play until elimination</li>
      <li className="text-white">Changing stack-to-blind ratios</li>
      <li className="text-white">More emphasis on short stack play</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Strategic Differences
    </h5>
    
    <p className="text-white mt-2 mb-1">
      Cash Game Strategy:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Value betting is more important</li>
      <li className="text-white">Can play more straightforward</li>
      <li className="text-white">Position is extremely valuable</li>
      <li className="text-white">Can wait for premium hands</li>
      <li className="text-white">More focus on maximizing each hand</li>
    </ul>

    <p className="text-white mt-2 mb-1">
      Tournament Strategy:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Survival and chip accumulation balance</li>
      <li className="text-white">ICM considerations affect decisions</li>
      <li className="text-white">Must adapt to changing stack depths</li>
      <li className="text-white">Can't wait for only premium hands</li>
      <li className="text-white">More emphasis on stealing blinds/antes</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Bankroll Requirements
    </h5>
    
    <p className="text-white mt-2 mb-1">
      Cash Games:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Minimum 25 buy-ins recommended</li>
      <li className="text-white">Optimal: 40+ buy-ins</li>
      <li className="text-white">Can move up/down stakes freely</li>
      <li className="text-white">Lower variance than tournaments</li>
      <li className="text-white">Easier to maintain steady bankroll</li>
    </ul>

    <p className="text-white mt-2 mb-1">
      Tournaments:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Minimum 50 buy-ins recommended</li>
      <li className="text-white">Optimal: 100+ buy-ins</li>
      <li className="text-white">Higher variance than cash games</li>
      <li className="text-white">Longer time to realize true win rate</li>
      <li className="text-white">Need larger bankroll relative to buy-in</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Skill Set Requirements
    </h5>
    
    <p className="text-white mt-2 mb-1">
      Cash Game Skills:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Deep stack post-flop play</li>
      <li className="text-white">Hand reading in deep stacks</li>
      <li className="text-white">Value betting thin</li>
      <li className="text-white">Table selection crucial</li>
      <li className="text-white">Emotional control for long sessions</li>
    </ul>

    <p className="text-white mt-2 mb-1">
      Tournament Skills:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">Short stack play</li>
      <li className="text-white">Push/fold strategy</li>
      <li className="text-white">ICM understanding</li>
      <li className="text-white">Adapting to changing dynamics</li>
      <li className="text-white">Endurance for long events</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Choosing Your Format
    </h5>
    
    <p className="text-white mt-2 mb-1">
      Consider Cash Games If:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">You prefer consistent action</li>
      <li className="text-white">Want flexible playing schedules</li>
      <li className="text-white">Like deep stack poker</li>
      <li className="text-white">Prefer steady, predictable results</li>
      <li className="text-white">Want to minimize variance</li>
    </ul>

    <p className="text-white mt-2 mb-1">
      Consider Tournaments If:
    </p>
    <ul className="list-disc pl-4">
      <li className="text-white">You enjoy competition format</li>
      <li className="text-white">Don't mind irregular schedules</li>
      <li className="text-white">Like the possibility of big payouts</li>
      <li className="text-white">Enjoy adapting to changing dynamics</li>
      <li className="text-white">Can handle higher variance</li>
    </ul>
  </div>
);

export default function CashVsTournaments() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 