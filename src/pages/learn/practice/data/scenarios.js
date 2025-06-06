import { beginnerPreflopScenarios } from './scenarios/preflop/beginner';
import { intermediatePreflopScenarios } from './scenarios/preflop/intermediate';
import { advancedPreflopScenarios } from './scenarios/preflop/advanced';

const createPlayer = ({
    id,
    name,
    position,
    stack = 100,
    cards = [],
    currentBet = 0,
    isFolded = false,
    isDealer = false,
    isSB = false,
    isBB = false
}) => ({
    id,
    name: name || `${position}`,
    position,
    stack,
    cards,
    currentBet,
    totalBetInHand: currentBet,
    isFolded,
    isAllIn: false,
    hasActedThisRound: false,
    isDealer,
    isSB,
    isBB
});

export const scenarios = {
    
    // Add more scenarios here as needed
};

export const categories = [
    {
        id: 'preflop',
        title: 'Preflop Decisions',
        description: 'Practice your preflop decision making in various positions',
        scenarios: [
            {
                id: '1',
                title: 'Premium Hands from Late Position',
                difficulty: 'Beginner',
                description: 'Learn to play premium hands from late position'
            }
            // Add more scenario metadata here
        ]
    }
    // Add more categories as needed
]; 