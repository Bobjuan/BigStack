import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold mb-4 text-white">
      Essential Mindset & Bankroll Prerequisites
    </h4>

    <p className="text-white">
      Success in poker requires more than just technical skills. The right mindset and proper bankroll management are fundamental prerequisites that will determine your long-term success in the game.
    </p>

    <h5 className="text-xl font-bold mb-3 mt-3 text-white">
      The Winner's Mindset
    </h5>
    
    <p className="text-white font-semibold mb-2">
      Focus on Learning:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Prioritize improvement over immediate profits</li>
      <li className="text-white">Study and analyze your play regularly</li>
      <li className="text-white">Stay updated with evolving strategies</li>
      <li className="text-white">Learn from both wins and losses</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Long-Term Perspective:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Understand that poker is a long-term game</li>
      <li className="text-white">Accept that losing days are normal</li>
      <li className="text-white">Focus on making correct decisions</li>
      <li className="text-white">Don't let short-term results affect your play</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Emotional Control:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Play your best game regardless of results</li>
      <li className="text-white">Avoid tilting after bad beats</li>
      <li className="text-white">Know when to quit a session</li>
      <li className="text-white">Maintain professional attitude at all times</li>
    </ul>

    <h5 className="text-xl font-bold mb-3 mt-3 text-white">
      Bankroll Prerequisites
    </h5>
    
    <p className="text-white font-semibold mb-2">
      Starting Capital:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Have sufficient buy-ins for your chosen stake</li>
      <li className="text-white">Keep poker funds separate from life expenses</li>
      <li className="text-white">Only play with money you can afford to lose</li>
      <li className="text-white">Consider costs beyond buy-ins (travel, rake, etc.)</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Risk Management:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Follow strict bankroll management rules</li>
      <li className="text-white">Never risk more than prescribed limits</li>
      <li className="text-white">Have a plan for moving up/down in stakes</li>
      <li className="text-white">Track all sessions and expenses</li>
    </ul>

    <h5 className="text-xl font-bold mb-3 mt-3 text-white">
      Study Habits
    </h5>
    
    <p className="text-white font-semibold mb-2">
      Regular Review:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Analyze your play after each session</li>
      <li className="text-white">Keep detailed notes on tough spots</li>
      <li className="text-white">Review hands with stronger players</li>
      <li className="text-white">Study consistently, not just after losses</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Strategic Development:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Build a solid fundamental strategy</li>
      <li className="text-white">Regularly update your knowledge</li>
      <li className="text-white">Study opponents' tendencies</li>
      <li className="text-white">Work on your weakest areas first</li>
    </ul>

    <h5 className="text-xl font-bold mb-3 mt-3 text-white">
      Game Selection
    </h5>
    
    <p className="text-white font-semibold mb-2">
      Table Selection:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Choose games where you have an edge</li>
      <li className="text-white">Avoid games above your bankroll</li>
      <li className="text-white">Look for profitable table dynamics</li>
      <li className="text-white">Be willing to change tables when needed</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Stake Selection:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Play at stakes you're properly rolled for</li>
      <li className="text-white">Move up only when ready both mentally and financially</li>
      <li className="text-white">Be willing to move down when necessary</li>
      <li className="text-white">Don't let ego influence stake selection</li>
    </ul>

    <h5 className="text-xl font-bold mb-3 mt-3 text-white">
      Professional Approach
    </h5>
    
    <p className="text-white font-semibold mb-2">
      Record Keeping:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Track all sessions and results</li>
      <li className="text-white">Monitor win rates at different stakes</li>
      <li className="text-white">Keep notes on regular opponents</li>
      <li className="text-white">Analyze trends in your play</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Life Balance:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Maintain healthy lifestyle habits</li>
      <li className="text-white">Manage time effectively</li>
      <li className="text-white">Keep poker separate from personal life</li>
      <li className="text-white">Have interests outside of poker</li>
    </ul>

    <p className="text-white font-semibold mb-2">
      Continuous Improvement:
    </p>
    <ul className="list-disc pl-8">
      <li className="text-white">Stay humble and eager to learn</li>
      <li className="text-white">Network with other players</li>
      <li className="text-white">Adapt to changing game conditions</li>
      <li className="text-white">Regularly assess and adjust your game</li>
    </ul>
  </div>
);

export default function EssentialMindset() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 