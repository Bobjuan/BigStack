// Helper function to create a player object
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
    isBB = false,
    isTurn = false
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
    isBB,
    isTurn
});

// Function to create the initial game state for a scenario
export const createScenarioState = ({
    heroPosition,
    heroHand,
    action = [],
    pot = 0,
    stackSizes = {}
}) => {
    // Define positions based on 6-max game
    const positions = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
    
    // Validate hero position
    if (!positions.includes(heroPosition)) {
        throw new Error(`Invalid hero position: ${heroPosition}. Must be one of: ${positions.join(', ')}`);
    }

    const players = [];
    let currentPot = 0;

    // Create players and process actions
    positions.forEach((pos, index) => {
        const isHero = pos === heroPosition;
        const isSB = pos === 'SB';
        const isBB = pos === 'BB';
        
        // Calculate initial stack and bet based on position
        let initialBet = 0;
        let initialStack = stackSizes[pos] || 100;
        
        // Post blinds automatically
        if (isSB) {
            initialBet = 0.5;
            initialStack -= 0.5;
            currentPot += 0.5;
        } else if (isBB) {
            initialBet = 1;
            initialStack -= 1;
            currentPot += 1;
        }

        const player = createPlayer({
            id: `player${index + 1}`,
            position: pos,
            stack: initialStack,
            cards: isHero ? heroHand : ['???', '???'],
            currentBet: initialBet,
            isDealer: pos === 'BTN',
            isSB,
            isBB,
            isTurn: isHero
        });
        players.push(player);
    });

    // Process each action after blinds are posted
    action.forEach(act => {
        const player = players.find(p => p.position === act.position);
        if (player) {
            if (act.type === 'FOLD') {
                player.isFolded = true;
            } else {
                const betAmount = act.amount;
                player.stack -= betAmount;
                player.currentBet = betAmount;
                player.totalBetInHand = betAmount;
                currentPot += betAmount;
            }
        }
    });

    // Find hero's index
    const heroIndex = players.findIndex(p => p.position === heroPosition);

    // Calculate current highest bet
    const currentHighestBet = Math.max(...players.map(p => p.currentBet));

    // Calculate previous highest bet (before the last action)
    // We'll scan the players' currentBet values, sort, and pick the second highest (or BB if only one raise)
    const sortedBets = players.map(p => p.currentBet).sort((a, b) => b - a);
    const previousHighestBet = sortedBets.length > 1 ? sortedBets[1] : 1; // fallback to BB if only one bet
    let minRaiseAmount;
    if (currentHighestBet > 1) {
        // There has been a raise
        minRaiseAmount = currentHighestBet - previousHighestBet;
        // If for some reason this is 0 (e.g. all folded to BB), fallback to 1
        if (minRaiseAmount <= 0) minRaiseAmount = 1;
    } else {
        // No raise yet, min raise is BB
        minRaiseAmount = 1;
    }

    return {
        players,
        communityCards: [],
        pot: pot || currentPot,
        currentBettingRound: 'PREFLOP',
        currentPlayerIndex: heroIndex,
        dealerIndex: positions.indexOf('BTN'),
        currentHighestBet,
        minRaiseAmount,
        lastAggressorIndex: -1,
        actionClosingPlayerIndex: -1
    };
}; 