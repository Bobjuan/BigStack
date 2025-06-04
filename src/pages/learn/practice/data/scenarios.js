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

export const scenarios = {
    '1': {
        id: '1',
        title: "Premium Hands from Late Position",
        description: "You're in the cutoff with AKs. UTG raises to 3BB. Action is on you.",
        difficulty: 'Beginner',
        category: 'preflop',
        setup: {
            players: [
                createPlayer({
                    id: 'player1',
                    position: 'UTG',
                    stack: 97,
                    currentBet: 3,
                    cards: ['???', '???']
                }),
                createPlayer({
                    id: 'player2',
                    position: 'MP',
                    stack: 100,
                    isFolded: true
                }),
                createPlayer({
                    id: 'player3',
                    position: 'CO',
                    stack: 100,
                    cards: ['As', 'Ks']
                }),
                createPlayer({
                    id: 'player4',
                    position: 'BTN',
                    stack: 100,
                    isDealer: true
                }),
                createPlayer({
                    id: 'player5',
                    position: 'SB',
                    stack: 99.5,
                    currentBet: 0.5,
                    isSB: true
                }),
                createPlayer({
                    id: 'player6',
                    position: 'BB',
                    stack: 99,
                    currentBet: 1,
                    isBB: true
                })
            ],
            communityCards: [],
            pot: 4.5,
            currentBettingRound: 'PREFLOP',
            currentPlayerIndex: 2, // CO position
            dealerIndex: 3, // BTN position
            currentHighestBet: 3,
            minRaiseAmount: 3,
            heroPosition: 'CO',
            heroHand: ['As', 'Ks']
        },
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
    }
    // Add more scenarios here as needed
};

export const categories = [
    {
        id: 'preflop',
        title: 'Preflop Decisions',
        description: 'Practice your preflop decision making in various positions',
        scenarios: [
            {
                id: '1',
                title: 'Premium Hands from Late Position',
                difficulty: 'Beginner',
                description: 'Learn to play premium hands from late position'
            }
            // Add more scenario metadata here
        ]
    }
    // Add more categories as needed
]; 