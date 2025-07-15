// Assumed stack sizes: 100BB unless otherwise noted
import { createScenarioState } from '../utils';

export const advancedPreflopScenarios = [
    {
        id: 'preflop_advanced_1',
        title: "ICM Pressure Spots",
        description: "Final table, you're BB with AJs. UTG (25BB) min-raises, BTN (15BB) calls. You have 20BB. Action on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['Ah', 'Jh'],
            action: [
                { position: 'HJ', type: 'FOLD'},
                { position: 'CO', type: 'FOLD'},
                { position: 'SB', type: 'FOLD'},
                { position: 'UTG', type: 'RAISE', amount: 2 },
                { position: 'BTN', type: 'CALL', amount: 2 }
            ],
            pot: 5,
            stackSizes: {
                'UTG': 25,
                'BTN': 15,
                'BB': 20
            }
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8,   // 4x the original raise
            max: 10   // 5x the original raise
        },
        explanation: "Squeezing here is optimal because:\n" +
            "1. We can apply ICM pressure to BTN's calling range.\n" +
            "2. Our hand has good equity against both ranges.\n" +
            "3. BTN is in a tough spot with their shorter stack.\n" +
            "4. We block some of UTG's continuing hands.\n" +
            "5. Stack sizes make this a high-leverage spot."
    },
    {
        id: 'preflop_advanced_2',
        title: "Mixed Strategy Spots",
        description: "CO opens 2.5BB, you're in BB with KQo. Both players 100BB deep. Action on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['Kh', 'Qd'],
            action: [
                { position: 'BTN', type: 'FOLD'},
                { position: 'SB', type: 'FOLD'},
                { position: 'HJ', type: 'FOLD'},             
                { position: 'UTG', type: 'FOLD'},
                { position: 'CO', type: 'RAISE', amount: 2.5 }
            ],
            pot: 4
        }),
        preFolded: [],
        correctActions: ['CALL', 'RAISE'],
        correctSizing: {
            min: 8,   // When raising, size up to put pressure
            max: 11
        },
        explanation: "This is a mixed strategy spot where both calling and 3-betting are viable:\n" +
            "1. Calling lets us realize equity with a strong but non-premium hand, even though we're out of position.\n" +
            "2. 3-betting can generate folds from CO's wide range.\n" +
            "3. Our hand has good equity when called.\n" +
            "4. Mixed strategies make us harder to play against.\n" +
            "5. Out of position, we must balance our range."
    },
    {
        id: 'preflop_advanced_3',
        title: "Stack Size Exploitation",
        description: "HJ (35BB) opens 2.2BB, you have 88 on BTN with 15BB. Action on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['8c', '8d'],
            action: [
                { position: 'CO', type: 'FOLD'},
                { position: 'SB', type: 'FOLD'},
                { position: 'BB', type: 'FOLD'},
                { position: 'UTG', type: 'FOLD'},
                { position: 'HJ', type: 'RAISE', amount: 2.2 }
            ],
            pot: 3.2,
            stackSizes: {
                'HJ': 35,
                'BTN': 15
            }
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 15,  // Jam all-in
            max: 15   // Jam all-in
        },
        explanation: "Shoving 15BB with 88 is optimal because:\n" +
            "1. We have good equity when called.\n" +
            "2. Our stack size gives us fold equity.\n" +
            "3. Opponent must call tighter due to ICM implications.\n" +
            "4. Calling leaves us with awkward SPR post-flop.\n" +
            "5. Flatting is not profitable with this stack size."
    },
    {
        id: 'preflop_advanced_4',
        title: "Multi-way 3-Bet Pots",
        description: "UTG opens 3BB, HJ calls, CO calls. You're in SB with AKo. Action on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'SB',
            heroHand: ['Ac', 'Kd'],
            action: [
                { position: 'BTN', type: 'FOLD'},
                { position: 'BTN', type: 'FOLD'},
                { position: 'UTG', type: 'RAISE', amount: 3 },
                { position: 'HJ', type: 'CALL', amount: 3 },
                { position: 'CO', type: 'CALL', amount: 3 }
            ],
            pot: 10.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 15,  // About 5x the original raise
            max: 18   // About 6x the original raise
        },
        explanation: "Making a large 3-bet is optimal because:\n" +
            "1. We need to charge draws and weaker hands.\n" +
            "2. Multiple opponents require larger sizing.\n" +
            "3. We want to isolate against the original raiser.\n" +
            "4. Our hand performs better heads-up than multi-way.\n" +
            "5. Out of position, we must size up to maximize fold equity."
    },
    {
        id: 'preflop_advanced_5',
        title: "Exploitative 4-Bet Sizing",
        description: "HJ opens 2.5BB, CO 3-bets to 8BB, you have QQ on BTN. HJ known to be tight. Action on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['Qh', 'Qc'],
            action: [
                { position: 'UTG', type: 'FOLD'},
                { position: 'HJ', type: 'RAISE', amount: 2.5 },
                { position: 'CO', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 20,  // Smaller 4-bet exploiting tight player
            max: 24   // Still enough to get folds
        },
        explanation: "Using a smaller 4-bet sizing is exploitative because:\n" +
            "1. HJ's tight range means they fold to any 4-bet.\n" +
            "2. CO's 3-bet into HJ suggests strength.\n" +
            "3. Smaller sizing risks less when CO continues.\n" +
            "4. QQ benefits from fold equity against stronger hands.\n" +
            "5. Adjusting sizing based on player tendencies increases EV."
    },
    {
        id: 'preflop_advanced_6',
        title: "4-Bet Bluffing with Suited Wheel Ace",
        description: "Hero opens to 2.5BB in CO with A5s, BTN 3-bets to 8BB. Action is on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['As', '5s'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'SB', type: 'FOLD' },
                { position: 'BB', type: 'FOLD' },

                { position: 'CO', type: 'RAISE', amount: 2.5 },
                { position: 'BTN', type: 'RAISE', amount: 8 }
            ],
            pot: 13
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 20, // About 2.5x the 3-bet size
            max: 24
        },
        explanation: "4-bet bluffing with A5s is optimal because:\n" +
            "1. A5s blocks strong Ax and 5-bet shoves.\n" +
            "2. Suited wheel aces are standard 4-bet bluffs.\n" +
            "3. You can fold out better hands and balance your value range.\n" +
            "4. If called, you have playability and equity."
    },
    {
        id: 'preflop_advanced_7',
        title: "Flatting a 3-Bet in Position with a Suited Connector",
        description: "BTN opens to 2.5BB, SB 3-bets to 9BB, you have 87s on BTN. Action is on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['8h', '7h'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'FOLD' },
                { position: 'BB', type: 'FOLD' },
                { position: 'BTN', type: 'RAISE', amount: 2.5 },
                { position: 'SB', type: 'RAISE', amount: 9 }
            ],
            pot: 13.5
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Flatting 87s in position vs a 3-bet is optimal because:\n" +
            "1. Suited connectors play well in position with deep stacks.\n" +
            "2. 4-betting is too loose and folding is too tight.\n" +
            "3. You keep dominated hands in villain's range.\n" +
            "4. You have position for the rest of the hand."
    },
    {
        id: 'preflop_advanced_8',
        title: "Folding a Strong but Dominated Hand in ICM Spot",
        description: "Final table, you are SB with AJs, CO (short stack) shoves all-in for 10BB, you cover, pay jumps are huge. Action is on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'SB',
            heroHand: ['As', 'Js'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'BTN', type: 'FOLD' },
                { position: 'CO', type: 'RAISE', amount: 10 }
            ],
            pot: 12.5,
            stackSizes: {
                'CO': 10,
                'SB': 40,
                'BB': 30
            }
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Calling with AJs in this ICM spot is correct because:\n" +
            "1. AJs is well ahead of a typical short stack shoving range.\n" +
            "2. You cover the short stack and can eliminate them, increasing your pay jump potential.\n" +
            "3. The risk/reward is favorable given your stack and the pot odds.\n" +
            "4. Folding would be too tight with a hand this strong in the small blind."
    },
    {
        id: 'preflop_advanced_9',
        title: "Squeezing All-In with Suited Broadway as a Short Stack",
        description: "You have 15BB in the BB. MP opens to 2.2BB, CO calls. You have KQs. Action is on you.",
        difficulty: 'Advanced',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['Ks', 'Qs'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'RAISE', amount: 2.2 },
                { position: 'CO', type: 'CALL', amount: 2.2 },
                { position: 'BTN', type: 'FOLD' },
                { position: 'SB', type: 'FOLD' }
            ],
            pot: 7.4,
            stackSizes: {
                'BB': 15
            }
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 15, // Jam all-in
            max: 15
        },
        explanation: "Jamming KQs as a short stack is optimal because:\n" +
            "1. KQs has strong equity and fold equity against two wide ranges.\n" +
            "2. Squeezing all-in maximizes fold equity and isolates the opener.\n" +
            "3. Flatting is weak and exposes you to multiway pots.\n" +
            "4. You build the pot with a hand that plays well when called."
    }
]; 