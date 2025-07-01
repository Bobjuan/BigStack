import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold text-white">
      Multi-Street Planning
    </h4>

    <p className="text-white">
      Multi-street planning is essential for maximizing value and minimizing losses in poker. It involves thinking ahead about future streets and how different board runouts will affect your strategy.
    </p>

    <h5 className="text-xl font-bold text-white mt-6">
      Preflop Considerations
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Hand Selection:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Consider post-flop playability</li>
      <li className="text-white">Account for position</li>
      <li className="text-white">Think about stack depths</li>
      <li className="text-white">Factor in opponent types</li>
      <li className="text-white">Plan for common scenarios</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Stack Size Impact:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Deep stack implications</li>
      <li className="text-white">Short stack adjustments</li>
      <li className="text-white">SPR considerations</li>
      <li className="text-white">Commitment thresholds</li>
      <li className="text-white">Implied odds impact</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Flop Strategy
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Betting Decisions:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Consider turn cards</li>
      <li className="text-white">Plan for draws</li>
      <li className="text-white">Think about pot size</li>
      <li className="text-white">Account for ranges</li>
      <li className="text-white">Factor in position</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Board Texture Analysis:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Evaluate draw potential</li>
      <li className="text-white">Consider range advantage</li>
      <li className="text-white">Think about equity distribution</li>
      <li className="text-white">Plan for scary cards</li>
      <li className="text-white">Account for stack depths</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Turn Strategy
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Barrel Decisions:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Consider previous action</li>
      <li className="text-white">Evaluate board changes</li>
      <li className="text-white">Think about river cards</li>
      <li className="text-white">Plan sizing strategy</li>
      <li className="text-white">Account for fold equity</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Draw Completion:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Adjust to completed draws</li>
      <li className="text-white">Consider new draws</li>
      <li className="text-white">Think about pot odds</li>
      <li className="text-white">Plan river strategy</li>
      <li className="text-white">Factor in implied odds</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      River Strategy
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Value Betting:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Consider previous streets</li>
      <li className="text-white">Evaluate opponent's range</li>
      <li className="text-white">Think about sizing</li>
      <li className="text-white">Plan for responses</li>
      <li className="text-white">Account for history</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-2 mb-1">
      Bluffing Decisions:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Review hand history</li>
      <li className="text-white">Consider story credibility</li>
      <li className="text-white">Think about blockers</li>
      <li className="text-white">Evaluate fold equity</li>
      <li className="text-white">Plan sizing carefully</li>
    </ul>
  </div>
);

export default function MultiStreetPlanning() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 