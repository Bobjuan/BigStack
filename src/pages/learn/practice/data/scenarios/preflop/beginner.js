// Assumed stack sizes: 100BB unless otherwise noted
import { createScenarioState } from '../utils';

export const beginnerPreflopScenarios = [
    {
        id: 'preflop_beginner_1',
        title: "Premium Hands from Late Position",
        description: "You're in the cutoff (CO) with AKs. UTG raises to 3BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['As', 'Ks'],
            action: [
                { position: 'HJ', type: 'FOLD'},

                { position: 'UTG', type: 'RAISE', amount: 3 }
            ],
            pot: 4.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 9,  // 3x the original raise
            max: 12  // 4x the original raise
        },
        explanation: "With AKs in the cutoff facing a UTG raise, a 3-bet is optimal because:\n" +
            "1. AKs has strong equity against UTG's range.\n" +
            "2. Being in position gives us more options post-flop.\n" +
            "3. We want to build a bigger pot with a premium hand.\n" +
            "4. If called, we have good playability post-flop."
    },
    {
        id: 'preflop_beginner_2',
        title: "Playing Pocket Pairs from Early Position",
        description: "You're LJ with pocket Queens (QQ). UTG Raised, action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'HJ',
            heroHand: ['Qh', 'Qd'],
            action: [{ position: 'UTG', type: 'RAISE', amount: 2.5 }]
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 6.5,  // Standard open size
            max: 10.5   // Slightly larger open
        },
        explanation: "3 betting QQ after an UTG open is standard because:\n" +
            "1. QQ is a premium pocket pair.\n" +
            "2. We want to build the pot with our strong hand.\n" +
            "3. A standard 3 bet size allows us to play post-flop well.\n" +
            "4. Early position requires stronger hands to open, and therefore stronger hands like QQ to re-raise."
    },
    {
        id: 'preflop_beginner_3',
        title: "Defending Big Blind with Strong Hands",
        description: "You're in the BB with AQo. Button raises to 2.5BB. SB folds. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['Ah', 'Qd'],
            action: [
                { position: 'UTG', type: 'FOLD'},
                { position: 'HJ', type: 'FOLD'},
                { position: 'CO', type: 'FOLD'},
                { position: 'BTN', type: 'RAISE', amount: 2.5 },
                { position: 'SB', type: 'FOLD' }
            ],
            pot: 4
        }),
        preFolded: ['SB'],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8,   // About 3x the original raise
            max: 11   // About 4x the original raise
        },
        explanation: "3-betting AQo from the BB vs BTN is optimal because:\n" +
            "1. AQo is strong enough to 3-bet for value against BTN's wide range.\n" +
            "2. We deny BTN's equity realization.\n" +
            "3. 3-betting gives us initiative, even though we're out of position.\n" +
            "4. Calling leaves us with a harder post-flop game."
    },
    {
        id: 'preflop_beginner_4',
        title: "Playing Small Pocket Pairs",
        description: "You're in HJ with pocket fives (55). UTG raises to 3BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'HJ',
            heroHand: ['5h', '5c'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 3 }
            ],
            pot: 4.5
        }),
        preFolded: [],
        correctActions: ['FOLD'],
        explanation: "Folding 55 to a UTG raise is correct because:\n" +
            "1. Small pairs have poor playability against UTG's strong range.\n" +
            "2. We're out of position for the rest of the hand.\n" +
            "3. Set mining is less profitable against tight ranges.\n" +
            "4. Better spots will come along to play small pairs."
    },
    {
        id: 'preflop_beginner_5',
        title: "Playing Strong Suited Connectors",
        description: "You're on the BTN with 98s. UTG opens to 2.5BB, folds to you. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['9h', '8h'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 2.5 },
                { position: 'HJ', type: 'FOLD', amount: 2.5 },
                { position: 'CO', type: 'FOLD'}

            ],
            pot: 4
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Calling with 98s on the BTN is optimal because:\n" +
            "1. We have position for the rest of the hand.\n" +
            "2. Suited connectors play well post-flop.\n" +
            "3. We can realize our equity well in position.\n" +
            "4. Our hand has good implied odds when we hit strong draws or pairs."
    }
]; 