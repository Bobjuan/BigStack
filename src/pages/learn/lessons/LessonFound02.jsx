import React from 'react';

const LessonFound02 = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Self-Assessment: Your Current Cash Game Understanding</h2>
      <p className="mb-4">Quickly test your knowledge of small stakes no-limit hold'em cash games and identify which concepts you need to work on most. Retake after the course to ensure mastery!</p>
      <ul className="list-disc ml-6 mb-4">
        <li>10 questions covering:</li>
        <ul className="list-disc ml-10">
          <li>Opponent categorization</li>
          <li>Preflop strategy (raise sizing, responding to raises/limpers)</li>
          <li>Postflop play (value betting, bluffing, pot control)</li>
          <li>Bankroll management</li>
          <li>Mindset</li>
        </ul>
        <li>Immediate feedback and short analysis after each question</li>
        <li>If you miss a question, you'll be directed to the relevant lesson</li>
      </ul>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 text-black">
        <span className="font-bold">Tip:</span> Take the quiz before starting, and again after each module. Keep going until you get a perfect score!
      </div>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Interactive Quiz</h2>
      <div className="bg-gray-100 border-l-4 border-blue-400 p-4 text-black">
        {/* TODO: Replace this with the actual interactive quiz component */}
        <div className="text-gray-700">[Quiz Placeholder: The 10-question interactive quiz will appear here.]</div>
      </div>
    </section>
  </div>
);

export default LessonFound02; 