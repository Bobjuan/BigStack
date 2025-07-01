import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold">Bankroll Management</h1>

    <p>
      Bankroll management is the poker equivalent of risk management. Without proper bankroll management, you are absolutely certain to lose all your money, no matter how well you play. Understanding variance and following strict guidelines is essential for long-term success.
    </p>

    <h2 className="text-2xl font-bold mt-8">Core Rules for Bankroll Management</h2>
    <ul className="list-disc pl-8">
      <li>
        <strong>Rule #1 – Have a Dedicated Poker Bankroll</strong>
        <p>• Keep poker funds separate from life expenses
• Only play with money you can afford to lose
• Your bankroll should be a comfortable fraction of your net worth
• Never play with money needed for living expenses</p>
      </li>
      <li>
        <strong>Rule #2 – Maintain Proper Buy-in Requirements</strong>
        <p>• Minimum 25 buy-ins for cash games
• Minimum 50 buy-ins for tournaments
• Optimal: 40 buy-ins for cash games, 100 for tournaments
• Never exceed these limits even when running well</p>
      </li>
      <li>
        <strong>Rule #3 – Network and Build Relationships</strong>
        <p>• Make connections with other players
• They can become potential investors
• Helpful for moving up in stakes
• Can share action to reduce variance</p>
      </li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Understanding Variance</h2>
    <ul className="list-disc pl-8">
      <li>
        <strong>Short-term Results vs Long-term Expectation</strong>
        <p>Even with a positive win rate of 5BB/100 hands, there's still a 30% chance of losing money over a 10,000-hand sample. This demonstrates why proper bankroll management is crucial.</p>
      </li>
      <li>
        <strong>Dealing with Downswings</strong>
        <p>• Accept that losing days are normal
• Understand that profit is long-term
• Losing your entire session is bound to happen
• Focus on making correct decisions rather than results</p>
      </li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Moving Up in Stakes</h2>
    <ul className="list-disc pl-8">
      <li>
        <strong>When to Move Up</strong>
        <p>• Have the required number of buy-ins for the next level
• Consistently winning at current stake
• Comfortable with the skill level increase
• Prepared for increased variance</p>
      </li>
      <li>
        <strong>Moving Up Strategies</strong>
        <p>• Consider selling action to reduce risk
• Take shots at higher stakes with a portion of bankroll
• Be prepared to move back down if needed
• Don't let ego prevent moving down in stakes</p>
      </li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Common Bankroll Management Mistakes</h2>
    <ul className="list-disc pl-8">
      <li>
        <strong>Playing Too High</strong>
        <p>• Playing stakes beyond your bankroll
• Chasing losses at higher stakes
• Not moving down when necessary
• Letting ego influence decisions</p>
      </li>
      <li>
        <strong>Poor Money Management</strong>
        <p>• Mixing poker funds with life expenses
• Taking money out of bankroll while building it
• Not keeping accurate records
• Playing when emotionally compromised</p>
      </li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Additional Considerations</h2>
    <ul className="list-disc pl-8">
      <li>
        <strong>Game Selection Impact</strong>
        <p>Better game selection allows for slightly lower bankroll requirements as your edge is higher.</p>
      </li>
      <li>
        <strong>Win Rate Consideration</strong>
        <p>Higher win rates can justify slightly lower bankroll requirements, but err on the side of caution.</p>
      </li>
      <li>
        <strong>Life Factors</strong>
        <p>Consider your personal financial situation, responsibilities, and risk tolerance when setting bankroll requirements.</p>
      </li>
    </ul>
  </div>
);

export default function BankrollManagement() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 