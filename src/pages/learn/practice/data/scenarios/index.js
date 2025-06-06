import { beginnerPreflopScenarios } from './preflop/beginner';
import { intermediatePreflopScenarios } from './preflop/intermediate';
import { advancedPreflopScenarios } from './preflop/advanced';

// Combine all scenarios and assign sequential IDs
const allScenarios = [
    ...beginnerPreflopScenarios,
    ...intermediatePreflopScenarios,
    ...advancedPreflopScenarios
].reduce((acc, scenario, index) => {
    acc[index + 1] = {
        ...scenario,
        numericId: index + 1
    };
    return acc;
}, {});

// Organize scenarios by category and difficulty
export const categories = [
    {
        id: 'preflop',
        title: 'Preflop Decisions',
        description: 'Master preflop play with scenarios ranging from basic to advanced concepts.',
        scenarios: [
            {
                difficulty: 'Beginner',
                title: 'Basic Preflop Concepts',
                description: 'Learn fundamental preflop decisions with premium hands and basic positions.',
                scenarios: beginnerPreflopScenarios.map(s => ({ ...s, numericId: Object.values(allScenarios).find(as => as.id === s.id).numericId }))
            },
            {
                difficulty: 'Intermediate',
                title: 'Intermediate Preflop Play',
                description: '3-betting, defending, and positional awareness in common spots.',
                scenarios: intermediatePreflopScenarios.map(s => ({ ...s, numericId: Object.values(allScenarios).find(as => as.id === s.id).numericId }))
            },
            {
                difficulty: 'Advanced',
                title: 'Advanced Preflop Strategy',
                description: 'Complex ICM spots, mixed strategies, and exploitative adjustments.',
                scenarios: advancedPreflopScenarios.map(s => ({ ...s, numericId: Object.values(allScenarios).find(as => as.id === s.id).numericId }))
            }
        ]
    }
    // Add more categories here (postflop, etc.) as they are created
];

export { allScenarios }; 