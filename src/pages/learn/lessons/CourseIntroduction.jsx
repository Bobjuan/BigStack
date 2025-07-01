import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold text-white">
      Course Introduction & Your Poker Development
    </h4>

    <h5 className="text-xl font-bold text-white mt-3">
      Setting Up for Success
    </h5>
    <p className="text-white">
      Poker is a simple game to learn but a difficult game to master. Success in poker requires more than just understanding the rules - it demands a comprehensive approach to the game that includes both strategic knowledge and proper preparation.
    </p>

    <h5 className="text-xl font-bold text-white mt-3">
      Core Principles
    </h5>
    
    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Key Concepts:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">Master the basic concepts before moving on to advanced strategies. A solid foundation in fundamentals is crucial for long-term success</li>
      <li className="text-white">To succeed long-term, focus on learning rather than money. If you want to make money, you must continuously improve as other players will evolve</li>
      <li className="text-white">Setting yourself up for success before sitting at the table is just as important as playing a sound strategy</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-3">
      Key Areas of Focus
    </h5>
    
    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Strategic Development:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">Understanding position and ranges</li>
      <li className="text-white">Mastering preflop and postflop play</li>
      <li className="text-white">Developing hand reading skills</li>
      <li className="text-white">Learning bet sizing and board texture analysis</li>
    </ul>

    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Mental Game:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">Managing variance and emotions</li>
      <li className="text-white">Maintaining focus during sessions</li>
      <li className="text-white">Understanding that losing days are normal</li>
      <li className="text-white">Building resilience against downswings</li>
    </ul>

    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Game Selection:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">Choosing profitable games</li>
      <li className="text-white">Understanding table dynamics</li>
      <li className="text-white">Recognizing player types</li>
      <li className="text-white">Adapting to different stake levels</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-3">
      Course Structure
    </h5>
    
    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Learning Approach:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">The course is structured to build your skills progressively, starting with fundamentals and moving to more advanced concepts</li>
      <li className="text-white">Each lesson includes practical examples and scenarios to help you apply the concepts in real game situations</li>
      <li className="text-white">From basic hand selection to advanced multi-street planning, the course covers all aspects needed to become a winning player</li>
    </ul>

    <h5 className="text-xl font-bold text-white mt-3">
      Keys to Success
    </h5>
    
    <h6 className="text-base font-bold text-white mt-2 mb-1">
      Essential Habits:
    </h6>
    <ul className="list-disc pl-4">
      <li className="text-white">Success requires diligent study and practice. Take time to review concepts and analyze your play regularly</li>
      <li className="text-white">Follow strict bankroll management guidelines to protect yourself from variance and enable long-term success</li>
      <li className="text-white">Regularly evaluate your game, identify leaks, and make adjustments based on your findings</li>
    </ul>
  </div>
);

export default function CourseIntroduction() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 