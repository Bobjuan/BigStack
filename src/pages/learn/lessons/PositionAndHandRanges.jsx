import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold text-white">
      Position and Hand Ranges
    </h4>

    <p className="text-white">
      Understanding position and hand ranges is crucial for success in poker. Position is one of your biggest advantages, and properly constructing ranges based on position will significantly improve your win rate.
    </p>

    <h5 className="text-xl font-bold text-white mt-6">
      Position Fundamentals
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      In Position (IP) Advantages:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Act last on all postflop streets</li>
      <li className="text-white">More control over pot size</li>
      <li className="text-white">Better bluffing opportunities</li>
      <li className="text-white">More information for decisions</li>
      <li className="text-white">Can pot control with marginal hands</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Out of Position (OOP) Adjustments:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Need stronger hands to play</li>
      <li className="text-white">More emphasis on strong made hands</li>
      <li className="text-white">Less bluffing frequency</li>
      <li className="text-white">More check-raising to gain initiative</li>
      <li className="text-white">Must play more defensively</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Range Construction
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Early Position Ranges:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Tighter opening ranges</li>
      <li className="text-white">Premium hands and strong broadways</li>
      <li className="text-white">Less suited connectors</li>
      <li className="text-white">Focus on hands that play well multiway</li>
      <li className="text-white">Emphasis on high card strength</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Late Position Ranges:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Wider opening ranges</li>
      <li className="text-white">More speculative hands</li>
      <li className="text-white">More suited connectors and gappers</li>
      <li className="text-white">Can play more marginal hands</li>
      <li className="text-white">More bluffing opportunities</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Range Advantages
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Understanding Range Advantage:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Which range has greater equity</li>
      <li className="text-white">How equity shifts throughout hand</li>
      <li className="text-white">Impact of board texture</li>
      <li className="text-white">Effect of position on range advantage</li>
      <li className="text-white">Importance of nut advantage</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Nut Advantage:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Having more nutted combinations</li>
      <li className="text-white">Affects betting and leading strategies</li>
      <li className="text-white">Important for multiway pots</li>
      <li className="text-white">Influences check-raising frequency</li>
      <li className="text-white">Key for aggressive play</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Board Texture Considerations
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      High Card Boards:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Ace-high boards favor preflop raiser</li>
      <li className="text-white">King-high boards need more protection</li>
      <li className="text-white">Queen/Jack-high boards more balanced</li>
      <li className="text-white">Consider range vs range equity</li>
      <li className="text-white">Adjust continuation betting accordingly</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Connected Boards:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">More favorable for defending ranges</li>
      <li className="text-white">Requires careful range construction</li>
      <li className="text-white">More check-raising opportunities</li>
      <li className="text-white">Important for straight possibilities</li>
      <li className="text-white">Consider backdoor possibilities</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-6">
      Multiway Considerations
    </h5>
    
    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Adjusting Ranges:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Play tighter in multiway pots</li>
      <li className="text-white">Value strong hands more</li>
      <li className="text-white">Reduce bluffing frequency</li>
      <li className="text-white">Need stronger hands to continue</li>
      <li className="text-white">More emphasis on nutted hands</li>
    </ul>

    <h6 className="text-base font-semibold text-white mt-4 mb-2">
      Position Impact:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Position even more crucial multiway</li>
      <li className="text-white">Last to act has significant advantage</li>
      <li className="text-white">Need stronger continuing ranges</li>
      <li className="text-white">More careful with marginal hands</li>
      <li className="text-white">Consider all players' ranges</li>
    </ul>
  </div>
);

export default function PositionAndHandRanges() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 