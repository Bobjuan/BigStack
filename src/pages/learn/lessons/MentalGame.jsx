import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold">Mental Game</h1>

    <p className="text-base">
        The mental game is a crucial aspect of poker success. Understanding and managing psychological factors can significantly impact your decision-making and long-term results.
    </p>

    <h2 className="text-2xl font-bold mt-8">The Three Negative States</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Tilt:</h3>
    <ul className="list-disc pl-8">
      <li>Loss of rational thinking</li>
      <li>Emotional decision making</li>
      <li>Inability to process information</li>
      <li>Triggered by bad beats</li>
      <li>Affected by variance</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Pseudo Tilt:</h3>
    <ul className="list-disc pl-8">
      <li>Prioritizing wrong goals</li>
      <li>Getting even mentality</li>
      <li>Revenge-seeking behavior</li>
      <li>Locking up wins</li>
      <li>Rational but incorrect decisions</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Cognitive Biases</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Common Biases:</h3>
    <ul className="list-disc pl-8">
      <li>Confirmation bias</li>
      <li>Outcome bias</li>
      <li>Gambler's fallacy</li>
      <li>Dunning-Kruger effect</li>
      <li>Results-oriented thinking</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Managing Biases:</h3>
    <ul className="list-disc pl-8">
      <li>Focus on process</li>
      <li>Analyze decisions objectively</li>
      <li>Understand variance</li>
      <li>Accept uncertainty</li>
      <li>Learn from mistakes</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Confidence Management</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Over-Confidence:</h3>
    <ul className="list-disc pl-8">
      <li>Unnecessary risk-taking</li>
      <li>Playing above skill level</li>
      <li>Ignoring learning opportunities</li>
      <li>Overestimating abilities</li>
      <li>Poor game selection</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Under-Confidence:</h3>
    <ul className="list-disc pl-8">
      <li>Risk aversion</li>
      <li>Missing value bets</li>
      <li>Avoiding tough spots</li>
      <li>Self-doubt impact</li>
      <li>Missed opportunities</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Physical and Mental Fatigue</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Physical Tiredness:</h3>
    <ul className="list-disc pl-8">
      <li>Can still think clearly</li>
      <li>Decision quality maintained</li>
      <li>Consider good opportunities</li>
      <li>Take appropriate breaks</li>
      <li>Manage session length</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Mental Fatigue:</h3>
    <ul className="list-disc pl-8">
      <li>Decision quality drops</li>
      <li>Take necessary breaks</li>
      <li>Avoid extended sessions</li>
      <li>Recognize warning signs</li>
      <li>Maintain work-life balance</li>
    </ul>

    <h2 className="text-2xl font-bold mt-8">Long-Term Success</h2>
    
    <h3 className="text-xl font-bold mt-4 mb-2">Study Habits:</h3>
    <ul className="list-disc pl-8">
      <li>Regular review sessions</li>
      <li>Focus on improvement</li>
      <li>Learn from mistakes</li>
      <li>Stay updated with theory</li>
      <li>Maintain discipline</li>
    </ul>

    <h3 className="text-xl font-bold mt-4 mb-2">Lifestyle Balance:</h3>
    <ul className="list-disc pl-8">
      <li>Proper rest and recovery</li>
      <li>Healthy routines</li>
      <li>Stress management</li>
      <li>Bankroll discipline</li>
      <li>Life-poker balance</li>
    </ul>
  </div>
);

export default function MentalGame() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 