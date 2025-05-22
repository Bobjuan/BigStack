import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What should you do with pocket Aces in early position?",
      options: [
        "Limp to trap opponents",
        "Raise to 3x the big blind",
        "Raise to 4x the big blind",
        "Fold to avoid trouble"
      ],
      correct: 2
    },
    {
      question: "What is a 3-bet?",
      options: [
        "Betting three times the big blind",
        "The third bet in any betting round",
        "A re-raise over an initial raise",
        "Betting on three streets"
      ],
      correct: 2
    },
    // Add more questions as needed
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <PageLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-6">
            You scored {score} out of {questions.length}
          </p>
          <Button variant="primary" onClick={resetQuiz}>
            Try Again
          </Button>
        </div>
      </PageLayout>
    );
  }

  const question = questions[currentQuestion];

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Poker Quiz</h2>
            <p className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <div className="h-2 bg-[#2f3542] rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#2f3542] rounded-lg p-6 mb-6">
          <p className="text-xl mb-6">{question.question}</p>
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={index === question.correct ? "primary" : "secondary"}
                className="w-full text-left py-3 px-4"
                onClick={() => handleAnswer(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuizPage; 