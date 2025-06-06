import { createScenarioState } from '../utils';

export const beginnerPreflopScenarios = [
    {
        id: 'preflop_beginner_1',
        title: "Premium Hands from Late Position",
        description: "You're in the cutoff with AKs. UTG raises 3BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['As', 'Ks'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 3 },
                { position: 'MP', type: 'FOLD' }
            ],
            pot: 4.5
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 9,  // 3x the original raise
            max: 12  // 4x the original raise
        },
        explanation: "With AKs in position against a UTG raise, a 3-bet is optimal because:\n" +
            "1. AKs has strong equity against UTG's raising range\n" +
            "2. Being in position gives us additional playability\n" +
            "3. We can build a bigger pot with our premium hand\n" +
            "4. If called, we have good post-flop playability"
    },
    {
        id: 'preflop_beginner_2',
        title: "Playing Pocket Pairs from Early Position",
        description: "You're UTG with pocket Queens (QQ). Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'UTG',
            heroHand: ['Qh', 'Qd'],
            action: []
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 2.5,  // Standard open size
            max: 3.5   // Slightly larger open
        },
        explanation: "Opening QQ from UTG is standard because:\n" +
            "1. QQ is a premium pocket pair\n" +
            "2. We want to build the pot with our strong hand\n" +
            "3. A standard raise size allows us to play post-flop well\n" +
            "4. Early position requires stronger hands to open"
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
                { position: 'BTN', type: 'RAISE', amount: 2.5 },
                { position: 'SB', type: 'FOLD' }
            ],
            pot: 4
        }),
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8,   // About 3x the original raise
            max: 11   // About 4x the original raise
        },
        explanation: "3-betting AQo from the BB vs BTN is optimal because:\n" +
            "1. AQo is strong enough to 3-bet for value against BTN's wide range\n" +
            "2. We deny BTN's equity realization with their wide range\n" +
            "3. We can play well post-flop in position against their continuing range\n" +
            "4. The alternative (calling) leaves us with a harder post-flop game"
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
                { position: 'UTG', type: 'RAISE', amount: 3 },
                { position: 'HJ', type: 'FOLD' }
            ],
            pot: 4.5
        }),
        correctActions: ['FOLD'],
        explanation: "Folding 55 to a UTG raise is correct because:\n" +
            "1. Small pairs have poor playability against UTG's strong range\n" +
            "2. We're out of position for the rest of the hand\n" +
            "3. Set mining becomes less profitable against tight ranges\n" +
            "4. Better spots will come along to play small pairs"
    },
    {
        id: 'preflop_beginner_5',
        title: "Playing Strong Suited Connectors",
        description: "You're on the BTN with 98s. UTG opens to 2.5BB, 2 folds. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['9h', '8h'],
            action: [
                { position: 'UTG', type: 'RAISE', amount: 2.5 },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'FOLD' }
            ],
            pot: 4
        }),
        correctActions: ['CALL'],
        explanation: "Calling with 98s on the BTN is optimal because:\n" +
            "1. We have position for the rest of the hand\n" +
            "2. Suited connectors play well post-flop\n" +
            "3. We can realize our equity well in position\n" +
            "4. Our hand has good implied odds when we hit strong draws or pairs"
    }
]; 