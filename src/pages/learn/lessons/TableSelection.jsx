import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold">Table Selection</h1>

    <p className="text-base">
      "If you can't spot the sucker in your first half hour at the table, then you ARE the sucker." This famous quote from Rounders perfectly encapsulates the importance of table selection in poker. Your ability to choose the right game can be just as important as your technical poker skills.
    </p>

    <h2 className="text-2xl font-bold mt-8">Identifying Profitable Games</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Evaluating Player Types:</h3>
    <ul className="list-disc pl-8">
      <li>Look for players making clear strategic mistakes</li>
      <li>Observe showdown hands carefully</li>
      <li>Track betting patterns and tendencies</li>
      <li>Identify overly loose or passive players</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Game Quality Assessment:</h3>
    <ul className="list-disc pl-8">
      <li>Better to play lower stakes with weak players</li>
      <li>Avoid tough games even if properly bankrolled</li>
      <li>Look for recreational players having fun</li>
      <li>Consider table dynamics and atmosphere</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Seat Selection</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Position Principles:</h3>
    <ul className="list-disc pl-8">
      <li>Sit to the left of loose/weak players</li>
      <li>Sit to the right of tight/strong players</li>
      <li>Maximize hands played in position vs weak players</li>
      <li>Minimize hands played out of position vs strong players</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Strategic Considerations:</h3>
    <ul className="list-disc pl-8">
      <li>Position affects your ability to steal blinds</li>
      <li>Consider how players react to aggression</li>
      <li>Evaluate post-flop playing styles</li>
      <li>Look for exploitable tendencies</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Recognizing Weak Players</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Common Mistakes to Look For:</h3>
    <ul className="list-disc pl-8">
      <li>Frequent limping</li>
      <li>Playing too many hands</li>
      <li>Calling too often with draws</li>
      <li>Inconsistent bet sizing</li>
      <li>Poor position awareness</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Player Type Analysis:</h3>
    <ul className="list-disc pl-8">
      <li>Too loose players lose at high rates</li>
      <li>Too tight players lose at small rates</li>
      <li>Look for emotional decision making</li>
      <li>Identify players on tilt</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Game Selection Strategy</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Table Dynamics:</h3>
    <ul className="list-disc pl-8">
      <li>One loose-weak player better than multiple tight players</li>
      <li>Consider overall table atmosphere</li>
      <li>Watch for changing dynamics as players come and go</li>
      <li>Be willing to change tables when conditions deteriorate</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Stake Level Considerations:</h3>
    <ul className="list-disc pl-8">
      <li>Lower stakes often more profitable than higher</li>
      <li>Consider skill level difference between stakes</li>
      <li>Don't let ego drive stake selection</li>
      <li>Balance challenge with profitability</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Maintaining Your Edge</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Continuous Assessment:</h3>
    <ul className="list-disc pl-8">
      <li>Regularly evaluate game quality</li>
      <li>Track your results in different games</li>
      <li>Be willing to quit unfavorable games</li>
      <li>Keep detailed notes on regular players</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Adaptability:</h3>
    <ul className="list-disc pl-8">
      <li>Be ready to change tables when needed</li>
      <li>Adjust your strategy to table dynamics</li>
      <li>Don't get stuck in bad games</li>
      <li>Stay focused on profitability over ego</li>
    </ul>
  </div>
);

export default function TableSelection() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 