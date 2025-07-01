import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold">Board Texture Analysis</h1>

    <p>Understanding board texture is crucial for developing a winning poker strategy. Different board textures favor different ranges and require specific strategic adjustments in terms of bet sizing and frequency.</p>

    <h2 className="text-2xl font-bold mt-8">High Card Boards</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Ace-High Boards:</h3>
    <ul className="list-disc pl-8">
      <li>Less need for protection</li>
      <li>Check more frequently</li>
      <li>Favor smaller bet sizes on dry boards</li>
      <li>Larger sizes on draw-heavy boards</li>
      <li>Consider range advantage</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">King/Queen-High Boards:</h3>
    <ul className="list-disc pl-8">
      <li>More protection needed than ace-high</li>
      <li>Higher betting frequency</li>
      <li>Consider opponent's range composition</li>
      <li>Adjust for position and ranges</li>
      <li>Balance value and bluffs</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Connected Boards</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Low Connected:</h3>
    <ul className="list-disc pl-8">
      <li>Higher checking frequency</li>
      <li>More straight possibilities</li>
      <li>Consider equity distribution</li>
      <li>Important for range construction</li>
      <li>Careful with continuation betting</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">High Connected:</h3>
    <ul className="list-disc pl-8">
      <li>More polarized betting ranges</li>
      <li>Consider straight draws</li>
      <li>Important for range advantage</li>
      <li>Adjust sizing based on wetness</li>
      <li>Balance protection and value</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Monotone Boards</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Strategic Considerations:</h3>
    <ul className="list-disc pl-8">
      <li>Higher checking frequency overall</li>
      <li>Smaller bet sizes preferred</li>
      <li>Consider range composition</li>
      <li>Important for nut advantage</li>
      <li>Careful with bluff selection</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Position Impact:</h3>
    <ul className="list-disc pl-8">
      <li>More important on monotone boards</li>
      <li>Affects continuation betting</li>
      <li>Influences bluffing frequency</li>
      <li>Consider range advantages</li>
      <li>Adjust based on stack depths</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Turn Card Analysis</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Overcard Turns:</h3>
    <ul className="list-disc pl-8">
      <li>Consider previous street action</li>
      <li>Adjust sizing appropriately</li>
      <li>Think about range advantages</li>
      <li>Important for protection</li>
      <li>Balance value and bluffs</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Board Pairing Turns:</h3>
    <ul className="list-disc pl-8">
      <li>Often warrants larger sizing</li>
      <li>Consider range shifts</li>
      <li>Important for value betting</li>
      <li>Affects bluffing frequency</li>
      <li>Think about opponent's range</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Betting Strategy Adjustments</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Sizing Principles:</h3>
    <ul className="list-disc pl-8">
      <li>Smaller sizes on dry boards</li>
      <li>Larger sizes on wet boards</li>
      <li>Consider stack-to-pot ratio</li>
      <li>Adjust for board texture</li>
      <li>Think about opponent tendencies</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Frequency Adjustments:</h3>
    <ul className="list-disc pl-8">
      <li>Higher frequency on favorable boards</li>
      <li>Lower frequency on dangerous boards</li>
      <li>Consider position and ranges</li>
      <li>Adjust for opponent types</li>
      <li>Balance range construction</li>
    </ul>
  </div>
);

export default function BoardTextureAnalysis() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 