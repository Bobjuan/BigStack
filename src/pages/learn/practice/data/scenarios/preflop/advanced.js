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
    }
]; 