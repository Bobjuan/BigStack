import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokerGame from '../../../components/poker/PokerGame';
import { allScenarios } from './data/scenarios/index';

const PracticeScenarioPage = () => {
    const { scenarioId } = useParams();
    const navigate = useNavigate();
    const [scenario, setScenario] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        const numericId = parseInt(scenarioId);
        if (scenarioId && allScenarios[numericId]) {
            setScenario(allScenarios[numericId]);
            setFeedback(null);
            setIsComplete(false);
        } else {
            console.log('Scenario not found:', { scenarioId, allScenarios });
            navigate('/learn/practice');
        }
    }, [scenarioId, navigate]);

    const resetGame = useCallback(() => {
        setResetKey(prev => prev + 1);
        setFeedback(null);
        setIsComplete(false);
    }, []);

    // Only check the user's first action, then freeze
    const handleAction = (action, amount) => {
        if (isComplete) return false;
        if (!scenario.correctActions.includes(action)) {
            setFeedback({
                type: 'error',
                message: `That's not the optimal play. ${scenario.explanation}`
            });
            setIsComplete(true);
            return false;
        }
        if ((action === 'RAISE' || action === 'BET') && scenario.correctSizing) {
            if (amount < scenario.correctSizing.min || amount > scenario.correctSizing.max) {
                setFeedback({
                    type: 'error',
                    message: `Incorrect sizing. The optimal sizing is between ${scenario.correctSizing.min} and ${scenario.correctSizing.max} BB.`
                });
                setIsComplete(true);
                return false;
            }
        }
        setFeedback({
            type: 'success',
            message: `Correct! ${scenario.explanation}`
        });
        setIsComplete(true);
        return true;
    };

    if (!scenario) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-xl">Loading scenario...</div>
            </div>
        );
    }

    // Set default scenario description if not provided
    const defaultDescription = "You're in the cutoff (CO) with AKs. UTG raises to 3BB. Action is on you.";

    return (
        <div className="practice-scenario w-full h-full bg-gray-900" style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
            {feedback && (
                <div className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto p-6 rounded-lg shadow-lg ${
                    feedback.type === 'success' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                }`}>
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {feedback.type === 'success' ? (
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-lg font-medium">
                                {feedback.type === 'success' ? 'Well done!' : 'Try again'}
                            </p>
                            <p className="mt-1 text-base">
                                {feedback.message}
                            </p>
                            {feedback.type === 'error' ? (
                                <button
                                    onClick={resetGame}
                                    className="mt-3 bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    Try Again
                                </button>
                            ) : (
                                <div className="mt-4 flex space-x-3">
                                    <button
                                        onClick={resetGame}
                                        className="bg-white text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-50 transition-colors"
                                    >
                                        Practice Again
                                    </button>
                                    <button
                                        onClick={() => navigate('/learn/practice')}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
                                    >
                                        Back to Practice Menu
                                    </button>
                                    <button
                                        onClick={() => navigate(`/learn/practice/${parseInt(scenarioId) + 1}`)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition-colors"
                                    >
                                        Next Scenario
                                    </button>
                                </div>
                            )}
                        </div>
                        {feedback.type === 'error' && (
                            <button 
                                onClick={() => {
                                    setFeedback(null);
                                    resetGame();
                                }}
                                className="ml-auto flex-shrink-0 text-white hover:text-gray-200"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="game-container flex-1">
                <PokerGame 
                    key={resetKey}
                    isPracticeMode={true}
                    scenarioSetup={scenario.setup}
                    actionSequence={scenario.actionSequence}
                    onAction={handleAction}
                    scenarioTitle={scenario.title}
                    scenarioDescription={scenario.description || defaultDescription}
                />
            </div>

            {isComplete && (
                <div className="absolute bottom-4 right-4 z-50">
                    <button 
                        onClick={() => navigate(`/learn/practice/${parseInt(scenarioId) + 1}`)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-lg"
                    >
                        Next Scenario
                    </button>
                </div>
            )}
        </div>
    );
};

export default PracticeScenarioPage; 