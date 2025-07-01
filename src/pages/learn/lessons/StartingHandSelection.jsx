import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold">Starting Hand Selection</h1>

    <p>Starting hand selection is one of the most fundamental aspects of poker strategy. Your preflop decisions set the foundation for the rest of the hand and greatly impact your overall profitability.</p>

    <h2 className="text-2xl font-bold mt-8">Position-Based Selection</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Early Position:</h3>
    <ul className="list-disc pl-8">
      <li>Play tighter ranges</li>
      <li>Focus on strong hands that play well postflop</li>
      <li>Premium pairs (TT+) and strong broadways</li>
      <li>Suited connectors need to be more selective</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Late Position:</h3>
    <ul className="list-disc pl-8">
      <li>Can play wider ranges</li>
      <li>More suited connectors and one-gappers</li>
      <li>More offsuit broadways</li>
      <li>Can play more speculative hands</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Stack Depth Considerations</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Deep Stack Play (100BB+):</h3>
    <ul className="list-disc pl-8">
      <li>Increase value of suited connectors</li>
      <li>Play more hands that can make the nuts</li>
      <li>Reduce frequency of offsuit broadways</li>
      <li>Consider implied odds more heavily</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Short Stack Play:</h3>
    <ul className="list-disc pl-8">
      <li>Focus on high card strength</li>
      <li>Reduce suited connector frequency</li>
      <li>Increase broadway hands</li>
      <li>Value immediate equity more</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Hand Categories</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Premium Pairs:</h3>
    <ul className="list-disc pl-8">
      <li>TT+ are always playable</li>
      <li>Consider 3-betting for value</li>
      <li>Strong enough to play from any position</li>
      <li>Can play aggressively postflop</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Medium Pairs:</h3>
    <ul className="list-disc pl-8">
      <li>77-99 are position dependent</li>
      <li>Better as calls than 3-bets</li>
      <li>Need careful postflop play</li>
      <li>Value decreases multiway</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Suited Connectors:</h3>
    <ul className="list-disc pl-8">
      <li>Great in position</li>
      <li>Strong implied odds</li>
      <li>Good for board coverage</li>
      <li>Excellent in deep stack play</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Game Type Adjustments</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Cash Games:</h3>
    <ul className="list-disc pl-8">
      <li>Can play more speculative hands</li>
      <li>Focus on implied odds</li>
      <li>Position is extremely important</li>
      <li>Can adjust based on table dynamics</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Tournaments:</h3>
    <ul className="list-disc pl-8">
      <li>Tighter early game selection</li>
      <li>Stack size heavily impacts selection</li>
      <li>Need to consider ICM implications</li>
      <li>More emphasis on playability</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Common Mistakes</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Position Mistakes:</h3>
    <ul className="list-disc pl-8">
      <li>Playing too loose from early position</li>
      <li>Not widening range enough in late position</li>
      <li>Overvaluing suited hands from early position</li>
      <li>Not considering table dynamics</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Hand Selection Errors:</h3>
    <ul className="list-disc pl-8">
      <li>Playing too many weak suited hands</li>
      <li>Overvaluing small pairs</li>
      <li>Not adjusting to table conditions</li>
      <li>Ignoring stack depth considerations</li>
    </ul>
  </div>
);

export default function StartingHandSelection() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 