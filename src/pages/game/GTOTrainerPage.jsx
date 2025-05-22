import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';

const GTOTrainerPage = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      title: 'UTG vs 3-Bet',
      description: 'You open UTG with AKo and face a 3-bet from the Button. What do you do?',
      options: ['Fold', '4-Bet', 'Call'],
      correct: 1,
      explanation: 'AKo is strong enough to 4-bet for value against a Button 3-bet range.'
    },
    {
      title: 'BB Defense',
      description: 'You are in the BB with 76s facing a 2.5x open from the CO. What do you do?',
      options: ['Fold', 'Call', '3-Bet'],
      correct: 1,
      explanation: '76s has good playability and gets the right price to call vs a CO open.'
    }
  ];

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === scenarios[currentScenario].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowFeedback(false);
    } else {
      // Training complete
      setCurrentScenario(0);
      setShowFeedback(false);
      setScore(0);
    }
  };

  const scenario = scenarios[currentScenario];

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">GTO Trainer</h2>
          <p className="text-gray-400">
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
          <div className="h-2 bg-[#2f3542] rounded-full mt-4">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#2f3542] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
          <p className="text-gray-300 mb-6">{scenario.description}</p>

          {!showFeedback ? (
            <div className="space-y-4">
              {scenario.options.map((option, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="w-full text-left py-3 px-4"
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[#1b1f2b] rounded-lg">
                <h4 className="font-bold mb-2">Explanation</h4>
                <p className="text-gray-300">{scenario.explanation}</p>
              </div>
              <Button
                variant="primary"
                className="w-full"
                onClick={nextScenario}
              >
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Start Over'}
              </Button>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-400">
            Current Score: {score} / {scenarios.length}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default GTOTrainerPage; 