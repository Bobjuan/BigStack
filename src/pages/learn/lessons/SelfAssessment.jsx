import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold mb-4 text-white">
      Self-Assessment: Your Current Cash Game Understanding
    </h4>

    <p className="text-white">
      Before diving deeper into advanced concepts, it's crucial to honestly assess your current skill level and identify areas for improvement. This self-assessment will help guide your poker development journey.
    </p>

    <h5 className="text-xl font-bold mt-6 mb-3 text-white">
      Preflop Play Assessment
    </h5>
    
    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Starting Hand Selection:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you have clear reasons for playing/folding hands?</li>
      <li className="text-white">Are your ranges position-dependent?</li>
      <li className="text-white">Do you adjust based on table dynamics?</li>
      <li className="text-white">Can you articulate why certain hands play better in different positions?</li>
    </ul>

    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      3-Betting Strategy:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you have a balanced 3-betting range?</li>
      <li className="text-white">Are you 3-betting for value and as bluffs?</li>
      <li className="text-white">Do you adjust your 3-betting range by position?</li>
      <li className="text-white">Can you explain your 3-betting strategy against different player types?</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3 text-white">
      Postflop Skills
    </h5>
    
    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Board Texture Reading:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Can you quickly identify wet vs dry boards?</li>
      <li className="text-white">Do you understand how board texture affects ranges?</li>
      <li className="text-white">Are you adjusting your strategy based on board texture?</li>
      <li className="text-white">Do you consider turn and river cards that could change board texture?</li>
    </ul>

    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Bet Sizing:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you use different bet sizes for different purposes?</li>
      <li className="text-white">Can you explain why you choose specific bet sizes?</li>
      <li className="text-white">Do you adjust sizing based on stack-to-pot ratio?</li>
      <li className="text-white">Are you considering opponent tendencies in your sizing?</li>
    </ul>

    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Hand Reading:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Can you put opponents on logical hand ranges?</li>
      <li className="text-white">Do you narrow ranges as hands progress?</li>
      <li className="text-white">Are you considering blockers in your analysis?</li>
      <li className="text-white">Do you track betting patterns to inform future decisions?</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3 text-white">
      Game Selection and Table Dynamics
    </h5>
    
    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Table Selection:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you actively look for profitable games?</li>
      <li className="text-white">Can you identify player types quickly?</li>
      <li className="text-white">Are you aware of your win rate at different stakes?</li>
      <li className="text-white">Do you maintain records of your sessions?</li>
    </ul>

    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Position Awareness:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you understand positional advantages?</li>
      <li className="text-white">Are you more aggressive in position?</li>
      <li className="text-white">Do you adjust your ranges based on position?</li>
      <li className="text-white">Can you exploit positional advantages postflop?</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3 text-white">
      Mental Game and Bankroll
    </h5>
    
    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Emotional Control:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Can you play your A-game while losing?</li>
      <li className="text-white">Do you avoid tilting after bad beats?</li>
      <li className="text-white">Are you able to quit when not playing your best?</li>
      <li className="text-white">Do you maintain focus throughout sessions?</li>
    </ul>

    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Bankroll Management:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Do you follow strict bankroll guidelines?</li>
      <li className="text-white">Are you playing within your means?</li>
      <li className="text-white">Do you track your results accurately?</li>
      <li className="text-white">Can you handle downswings professionally?</li>
    </ul>

    <h5 className="text-xl font-bold mt-6 mb-3 text-white">
      Action Items
    </h5>
    
    <h6 className="text-base font-medium mt-2 mb-1 text-white">
      Key Steps:
    </h6>
    <ul className="list-disc pl-8">
      <li className="text-white">Start keeping detailed records of your play, including specific hands that gave you trouble and situations where you were unsure of the correct play</li>
      <li className="text-white">Based on your self-assessment, create a focused study plan that addresses your weakest areas first</li>
      <li className="text-white">Schedule regular review sessions to track your progress and adjust your study plan as needed</li>
    </ul>
  </div>
);

export default function SelfAssessment() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 