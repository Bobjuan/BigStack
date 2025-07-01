import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold text-white">
      Hand Reading
    </h4>

    <p className="text-white">
      Hand reading is a crucial skill in poker that allows you to make better decisions by narrowing down your opponent's possible holdings. This skill combines understanding of ranges, player tendencies, and betting patterns.
    </p>

    <h5 className="text-xl font-bold text-white mt-6">
      Preflop Range Construction
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Opening Ranges:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Consider position and stack depth</li>
      <li className="text-white">Account for player tendencies</li>
      <li className="text-white">Adjust for table dynamics</li>
      <li className="text-white">Factor in ante presence</li>
      <li className="text-white">Note previous action patterns</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Defending Ranges:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Position relative to opener</li>
      <li className="text-white">Stack-to-pot ratio considerations</li>
      <li className="text-white">Player type adjustments</li>
      <li className="text-white">Historical dynamics</li>
      <li className="text-white">Tournament vs cash game context</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Flop Analysis
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Range vs Range:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Board texture interaction</li>
      <li className="text-white">Range advantage assessment</li>
      <li className="text-white">Nut advantage consideration</li>
      <li className="text-white">Removal effects</li>
      <li className="text-white">Equity distribution</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Betting Patterns:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Sizing tells</li>
      <li className="text-white">Timing tells</li>
      <li className="text-white">Frequency analysis</li>
      <li className="text-white">Historical tendencies</li>
      <li className="text-white">Situational context</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Turn Considerations
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Range Narrowing:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Previous street actions</li>
      <li className="text-white">Board texture changes</li>
      <li className="text-white">Pot size implications</li>
      <li className="text-white">Stack depth impact</li>
      <li className="text-white">Player tendencies</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Action Analysis:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Double barrel frequency</li>
      <li className="text-white">Check-raise patterns</li>
      <li className="text-white">Delayed aggression</li>
      <li className="text-white">Pot control decisions</li>
      <li className="text-white">Bluff catching spots</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      River Decision Making
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Value Betting:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Range advantage assessment</li>
      <li className="text-white">Sizing optimization</li>
      <li className="text-white">Calling range construction</li>
      <li className="text-white">Blocker effects</li>
      <li className="text-white">Exploitative adjustments</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Bluff Catching:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Betting pattern analysis</li>
      <li className="text-white">Range construction review</li>
      <li className="text-white">Blocker consideration</li>
      <li className="text-white">Sizing interpretation</li>
      <li className="text-white">Player tendency assessment</li>
    </ul>
  </div>
);

export default function HandReading() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 