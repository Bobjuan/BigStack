import { beginnerPreflopScenarios } from './scenarios/preflop/beginner.js';
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

// Combine all scenarios and assign sequential IDs
const allScenarios = [
    beginnerPreflopScenarios,
    intermediatePreflopScenarios,
    advancedPreflopScenarios
];

export const scenarios = allScenarios;

// Organize scenarios by category and difficulty
export const categories = [
    {
        id: 'preflop',
        title: 'Preflop Decisions',
        description: 'Practice your preflop decision making in various positions',
        scenarios: [
            {
                difficulty: 'Beginner',
                title: 'Basic Preflop Concepts',
                description: 'Learn fundamental preflop decisions with premium hands and basic positions.',
                scenarios: beginnerPreflopScenarios
            },
            {
                difficulty: 'Intermediate',
                title: 'Intermediate Preflop Play',
                description: '3-betting, defending, and positional awareness in common spots.',
                scenarios: intermediatePreflopScenarios
            },
            {
                difficulty: 'Advanced',
                title: 'Advanced Preflop Strategy',
                description: 'Complex ICM spots, mixed strategies, and exploitative adjustments.',
                scenarios: advancedPreflopScenarios
            }
        ].filter(level => level.scenarios && level.scenarios.length > 0)
    }
]; 