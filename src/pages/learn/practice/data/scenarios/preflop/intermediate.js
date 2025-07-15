// Assumed stack sizes: 100BB unless otherwise noted
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
                { position: 'UTG', type: 'FOLD'},
                { position: 'HJ', type: 'FOLD'},
                { position: 'CO', type: 'RAISE', amount: 2.5 }
            ],
            pot: 3.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8,   // About 3x the original raise
            max: 11   // About 4x the original raise
        },
        explanation: "3-betting A5s as a semi-bluff is optimal because:\n" +
            "1. We have blockers to strong Ax hands.\n" +
            "2. Our hand has good playability when called.\n" +
            "3. We can realize our equity well in position.\n" +
            "4. The hand is too weak to just call but has good removal effects."
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
                { position: 'UTG', type: 'FOLD'},
                { position: 'BTN', type: 'FOLD'},
                { position: 'SB', type: 'FOLD'},
                { position: 'BB', type: 'FOLD'},
                { position: 'HJ', type: 'RAISE', amount: 2.5 },
                { position: 'CO', type: 'RAISE', amount: 8 },
  


            ],
            pot: 11.5
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Calling with KQs against a 3-bet is correct because:\n" +
            "1. We have good equity against CO's 3-betting range.\n" +
            "2. Our hand plays well post-flop with its high card strength.\n" +
            "3. Being suited gives us additional playability.\n" +
            "4. 4-betting would be too aggressive and folding too tight.\n" +
            "(Assume 100BB effective stacks.)"
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
                { position: 'UTG', type: 'FOLD'},
                { position: 'HJ', type: 'FOLD'},
                { position: 'CO', type: 'FOLD'},
                { position: 'BTN', type: 'RAISE', amount: 2.5 },
                { position: 'SB', type: 'CALL', amount: 2.5 }
            ],
            pot: 7
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 12,  // About 4.5x the original raise
            max: 15   // About 6x the original raise
        },
        explanation: "Squeezing with AJs is optimal because:\n" +
            "1. We can get folds from both players' weak ranges.\n" +
            "2. SB's call indicates weakness.\n" +
            "3. Our hand has good equity when called.\n" +
            "4. The larger sizing puts pressure on both opponents."
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
        preFolded: [],
        correctActions: ['FOLD'],
        explanation: "Folding JJ is correct in this spot because:\n" +
            "1. We're facing two strong ranges from early position.\n" +
            "2. JJ is vulnerable against the likely continuing ranges.\n" +
            "3. We have reverse implied odds against better pairs.\n" +
            "4. Better spots will come along to play JJ aggressively.\n" +
            "(Calling is sometimes reasonable depending on table dynamics and player tendencies.)"
    },
    {
        id: 'preflop_intermediate_5',
        title: "Light 4-Bet Bluffing",
        description: "You open ATo from CO, BTN 3-bets to 8BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['Ac', 'Th'],
            action: [
                { position: 'UTG', type: 'FOLD'},
                { position: 'SB', type: 'FOLD'},
                { position: 'BB', type: 'FOLD'},
                { position: 'HJ', type: 'FOLD'},
                { position: 'CO', type: 'RAISE', amount: 2.5 },
                { position: 'BTN', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 18,  // About 2.2x the 3-bet size
            max: 22   // About 2.75x the 3-bet size
        },
        explanation: "4-bet bluffing with ATo is a good play because:\n" +
            "1. We block strong Ax hands in BTN's range.\n" +
            "2. BTN's 3-bet range is wide and can fold better hands.\n" +
            "3. We have decent equity when called.\n" +
            "4. The hand is too weak to call but has good removal effects.\n" +
            "(Standard 4-bet sizing is 18-22BB over an 8BB 3-bet.)"
    },
    {
        id: 'preflop_intermediate_6',
        title: "Flatting Suited Broadway in Position",
        description: "You're on the BTN with QJs. HJ opens to 2.5BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BTN',
            heroHand: ['Qs', 'Js'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'RAISE', amount: 2.5 },
                { position: 'CO', type: 'FOLD' }
            ],
            pot: 4
        }),
        preFolded: [],
        correctActions: ['CALL'],
        explanation: "Flatting QJs on the BTN is optimal because:\n" +
            "1. QJs plays well in position with good post-flop equity.\n" +
            "2. 3-betting is too loose and folding is too tight.\n" +
            "3. You keep dominated hands in villain's range.\n" +
            "4. You have position for the rest of the hand."
    },
    {
        id: 'preflop_intermediate_7',
        title: "3-Betting Light from the Small Blind with Suited Connectors",
        description: "You're in the SB with 65s. CO opens to 2.5BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'SB',
            heroHand: ['6h', '5h'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'RAISE', amount: 2.5 }
            ],
            pot: 3.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 8, // About 3x the open
            max: 10
        },
        explanation: "3-betting 65s from the SB is a good light bluff because:\n" +
            "1. Suited connectors have good equity when called.\n" +
            "2. You can fold out better hands and balance your range.\n" +
            "3. Flatting is weak and can be squeezed by the BB.\n" +
            "4. 3-betting light from the SB is standard in modern play."
    },
    {
        id: 'preflop_intermediate_8',
        title: "Folding Marginal Ace to a 3-Bet",
        description: "You're in the CO with AJo. You open to 2.5BB, BTN 3-bets to 8BB. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'CO',
            heroHand: ['As', 'Jd'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'FOLD' },
                { position: 'CO', type: 'RAISE', amount: 2.5 },
                { position: 'BTN', type: 'RAISE', amount: 8 }
            ],
            pot: 11.5
        }),
        preFolded: [],
        correctActions: ['FOLD'],
        explanation: "Folding AJo to a BTN 3-bet is correct because:\n" +
            "1. AJo is dominated by BTN's 3-betting range.\n" +
            "2. Calling out of position is difficult and unprofitable.\n" +
            "3. 4-betting is too loose and likely to get called by better hands.\n" +
            "4. Better spots will come along to play AJo."
    },
    {
        id: 'preflop_intermediate_9',
        title: "Squeezing with a Pocket Pair",
        description: "MP opens to 2.5BB, BTN calls. You're in the BB with 99. Action is on you.",
        difficulty: 'Intermediate',
        category: 'preflop',
        setup: createScenarioState({
            heroPosition: 'BB',
            heroHand: ['9c', '9d'],
            action: [
                { position: 'UTG', type: 'FOLD' },
                { position: 'HJ', type: 'RAISE', amount: 2.5 },
                { position: 'CO', type: 'FOLD' },
                { position: 'BTN', type: 'CALL', amount: 2.5 },
                { position: 'SB', type: 'FOLD' }
            ],
            pot: 7.5
        }),
        preFolded: [],
        correctActions: ['RAISE'],
        correctSizing: {
            min: 12, // About 4.5x the open
            max: 15
        },
        explanation: "Squeezing 99 from the BB is optimal because:\n" +
            "1. 99 is strong enough to play for stacks against two wide ranges.\n" +
            "2. Squeezing can fold out overcards and isolate the opener.\n" +
            "3. Flatting is vulnerable to multiway pots.\n" +
            "4. You build the pot with a hand that plays well post-flop."
    }
]; 