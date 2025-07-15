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
    },
    {
        id: 'preflop_beginner_6',
        title: "Isolating a Limper with AQo on the Button",
        description: "MP limps, folds to you on the BTN with AQo. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['Ad', 'Qh'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'CALL', amount: 1.0 },
                { position: 'CO', type: 'FOLD' }
            ],
            pot: 2.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 4.5, // 3.5x the limp
            max: 6.5
        },
        explanation: "Isolating a limper with AQo is optimal because:\n" +
            "1. AQo is far ahead of a typical limping range.\n" +
            "2. Raising gives you initiative and isolates the weaker player.\n" +
            "3. You have position for the rest of the hand.\n" +
            "4. Limping behind misses value and allows more players in."
    },
    {
        id: 'preflop_beginner_7',
        title: "Folding Dominated Offsuit Broadway",
        description: "You're in the CO with KJo. UTG opens to 2.5BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['Ks', 'Jd'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 2.5 },
                { position: 'HJ', type: 'FOLD' }
            ],
            pot: 4
        }),
        preFolded: [],
        correctActions: ['FOLD'],
        explanation: "Folding KJo to an early position open is correct because:\n" +
            "1. KJo is dominated by UTG's strong opening range.\n" +
            "2. Calling risks being outkicked and out of position post-flop.\n" +
            "3. 3-betting is too loose and likely to get called by better hands.\n" +
            "4. Better spots will come along to play KJo."
    },
    {
        id: 'preflop_beginner_8',
        title: "Defending Big Blind with Suited Connectors",
        description: "You're in the BB with 76s. CO opens to 2.5BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['7h', '6h'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'RAISE', amount: 2.5 },
                { position: 'BTN', type: 'FOLD' },
                { position: 'SB', type: 'FOLD' }
            ],
            pot: 4
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Defending the BB with suited connectors is good because:\n" +
            "1. 76s has good playability and equity realization in the BB.\n" +
            "2. You are closing the action and getting a good price.\n" +
            "3. Suited connectors can make strong hands post-flop.\n" +
            "4. 3-betting is too loose and folding is too tight."
    },
    {
        id: 'preflop_beginner_9',
        title: "Value 3-Betting TT from the Small Blind",
        description: "You're in the SB with TT. BTN opens to 2.5BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'SB',
            heroHand: ['Td', 'Tc'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'FOLD' },
                { position: 'BTN', type: 'RAISE', amount: 2.5 }
            ],
            pot: 3.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 9, // 3.5x the open
            max: 11
        },
        explanation: "3-betting TT from the SB vs BTN is optimal because:\n" +
            "1. TT is ahead of BTN's wide opening range.\n" +
            "2. 3-betting for value builds the pot and denies equity.\n" +
            "3. Flatting is vulnerable to squeezes from the BB.\n" +
            "4. You want to play a strong hand aggressively out of position."
    }
]; 