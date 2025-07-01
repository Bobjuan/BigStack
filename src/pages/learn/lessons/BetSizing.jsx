import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold mb-4">
      Bet Sizing
    </h4>

    <p className="text-white">
      Proper bet sizing is crucial for maximizing value and minimizing losses. Your bet sizes should be based on board texture, stack depths, opponent tendencies, and your overall strategy.
    </p>

    <h5 className="text-xl font-bold mt-6 mb-3">
      Preflop Sizing
    </h5>
    
    <h6 className="text-base font-semibold mt-2 mb-1">
      Opening Raises:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">2.5-3x in late position</li>
      <li className="text-white">3-4x in middle position</li>
      <li className="text-white">4-5x in early position</li>
      <li className="text-white">Larger with antes</li>
      <li className="text-white">Adjust for table dynamics</li>
    </ul>

    <h6 className="text-base font-semibold mt-2 mb-1">
      3-Betting:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">3x the open in position</li>
      <li className="text-white">3.5-4x out of position</li>
      <li className="text-white">Larger vs loose players</li>
      <li className="text-white">Consider stack depths</li>
      <li className="text-white">Account for player tendencies</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3">
      Flop Betting
    </h5>
    
    <h6 className="text-base font-semibold mt-2 mb-1">
      C-Bet Sizing:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">33% on dry boards</li>
      <li className="text-white">50-66% on wet boards</li>
      <li className="text-white">75%+ on polarized ranges</li>
      <li className="text-white">Consider stack-to-pot ratio</li>
      <li className="text-white">Adjust for opponent types</li>
    </ul>

    <h6 className="text-base font-semibold mt-2 mb-1">
      Check-Raise Sizing:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">2.5-3x on dry boards</li>
      <li className="text-white">3-4x on wet boards</li>
      <li className="text-white">Consider pot geometry</li>
      <li className="text-white">Factor in stack depths</li>
      <li className="text-white">Adjust for opponent tendencies</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3">
      Turn Play
    </h5>
    
    <h6 className="text-base font-semibold mt-2 mb-1">
      Double Barreling:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">66-75% on favorable cards</li>
      <li className="text-white">50% for pot control</li>
      <li className="text-white">Consider previous action</li>
      <li className="text-white">Account for board texture</li>
      <li className="text-white">Think about opponent range</li>
    </ul>

    <h6 className="text-base font-semibold mt-2 mb-1">
      Delayed Aggression:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Size based on flop action</li>
      <li className="text-white">Consider pot size</li>
      <li className="text-white">Factor in stack depths</li>
      <li className="text-white">Think about opponent range</li>
      <li className="text-white">Adjust for player type</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3">
      River Strategy
    </h5>
    
    <h6 className="text-base font-semibold mt-2 mb-1">
      Value Betting:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">75-100% pot for strong hands</li>
      <li className="text-white">50-66% for thin value</li>
      <li className="text-white">Consider opponent's range</li>
      <li className="text-white">Think about calling frequency</li>
      <li className="text-white">Account for player type</li>
    </ul>

    <h6 className="text-base font-semibold mt-2 mb-1">
      Bluffing:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Match value bet sizing</li>
      <li className="text-white">Consider fold equity</li>
      <li className="text-white">Think about blockers</li>
      <li className="text-white">Account for player tendencies</li>
      <li className="text-white">Factor in previous action</li>
    </ul>
  </div>
);

export default function BetSizing() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 