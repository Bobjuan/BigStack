import { createScenarioState } from '../utils';

export const intermediatePreflopScenarios = [
    {
        id: 'preflop_intermediate_1',
        title: "3-Bet Bluffing from Position",
        description: "You're on the BTN with A5s. CO opens to 2.5BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['Ah', '5h'],
            action: [
                { position: 'CO', type: 'RAISE', amount: 2.5 }
            ],
            pot: 3.5
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8,   // About 3x the original raise
            max: 11   // About 4x the original raise
        },
        explanation: "3-betting A5s as a semi-bluff is optimal because:\n" +
            "1. We have blockers to strong Ax hands\n" +
            "2. Our hand has good playability when called\n" +
            "3. We can realize our equity well in position\n" +
            "4. The hand is too weak to just call but has good removal"
    },
    {
        id: 'preflop_intermediate_2',
        title: "Defending Against 3-Bets",
        description: "You open KQs from HJ to 2.5BB. CO 3-bets to 8BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'HJ',
            heroHand: ['Ks', 'Qs'],
            action: [
                { position: 'HJ', type: 'RAISE', amount: 2.5 },
                { position: 'CO', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        correctActions: ['CALL'],
        explanation: "Calling with KQs against a 3-bet is correct because:\n" +
            "1. We have good equity against CO's 3-betting range\n" +
            "2. Our hand plays well post-flop with its high card strength\n" +
            "3. Being suited gives us additional playability\n" +
            "4. 4-betting would be too aggressive and folding too tight"
    },
    {
        id: 'preflop_intermediate_3',
        title: "Squeeze Play Opportunity",
        description: "BTN opens 2.5BB, SB calls. You're in BB with AJs. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['Ah', 'Jh'],
            action: [
                { position: 'BTN', type: 'RAISE', amount: 2.5 },
                { position: 'SB', type: 'CALL', amount: 2.5 }
            ],
            pot: 7
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 12,  // About 4.5x the original raise
            max: 15   // About 6x the original raise
        },
        explanation: "Squeezing with AJs is optimal because:\n" +
            "1. We can get folds from both players' weak ranges\n" +
            "2. SB's call indicates weakness\n" +
            "3. Our hand has good equity when called\n" +
            "4. The larger sizing puts pressure on both opponents"
    },
    {
        id: 'preflop_intermediate_4',
        title: "Playing Against Multiple Opens",
        description: "UTG opens 2.5BB, HJ 3-bets to 8BB. You're in the CO with JJ. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['Jc', 'Jd'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 2.5 },
                { position: 'HJ', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        correctActions: ['FOLD'],
        explanation: "Folding JJ is correct in this spot because:\n" +
            "1. We're facing two strong ranges from early position\n" +
            "2. JJ is vulnerable against the likely continuing ranges\n" +
            "3. We have reverse implied odds against better pairs\n" +
            "4. Better spots will come along to play JJ aggressively"
    },
    {
        id: 'preflop_intermediate_5',
        title: "Light 4-Bet Bluffing",
        description: "You open ATo from CO, BTN 3-bets to 8BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['At', 'Th'],
            action: [
                { position: 'CO', type: 'RAISE', amount: 2.5 },
                { position: 'BTN', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 22,  // About 2.75x the 3-bet size
            max: 26   // About 3.25x the 3-bet size
        },
        explanation: "4-bet bluffing with ATo is a good play because:\n" +
            "1. We block strong Ax hands in BTN's range\n" +
            "2. BTN's 3-bet range is wide and can fold better hands\n" +
            "3. We have decent equity when called\n" +
            "4. The hand is too weak to call but has good removal effects"
    }
]; 