import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Hand } from 'pokersolver';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import PlayerInfo from './PlayerInfo';
import PlayerHUD from './PlayerHUD';
import PotDisplay from './PotDisplay';
import ActionButtons from './ActionButtons';
import tableBg from '/src/assets/blacktable.png'; // Re-add this import
import dealerChip from '/src/assets/dealer.png'; // Import dealer chip asset
import SlumbotAPI from '../../services/slumbotAPI';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

// Assuming these SVG files exist in /src/assets/
// import feltDark from '/src/assets/felt_dark.svg'; // Remove this
// import feltGreen from '/src/assets/felt_green.svg'; // Remove this
// import feltPurple from '/src/assets/felt_purple.svg'; // If a purple theme is added

const SUITS = ['h', 'd', 'c', 's'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const BIG_BLIND_AMOUNT = 10;
const SMALL_BLIND_AMOUNT = 5;

const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
};

const POSITIONS_9MAX = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const POSITIONS_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
const POSITIONS_HEADSUP = ['BTN/SB', 'BB'];

// Client-side stats tracking for bot games (similar to server-side statsTracker)
const createBotGameHandStats = (userId) => {
  return {
    playerId: userId,
    increments: {
      hands_played: 1,
      hands_won: 0,
      total_bb_won: 0,
      total_pot_size_won: 0,
      vpip_opportunities: 1,
      vpip_actions: 0,
      pfr_opportunities: 1,
      pfr_actions: 0,
      btn_rfi_opportunities: 0,
      btn_rfi_actions: 0,
      "3bet_opportunities": 0,
      "3bet_actions": 0,
      fold_vs_3bet_opportunities: 0,
      fold_vs_3bet_actions: 0,
      "4bet_opportunities": 0,
      "4bet_actions": 0,
      fold_vs_4bet_opportunities: 0,
      fold_vs_4bet_actions: 0,
      agg_bets: 0,
      agg_raises: 0,
      agg_calls: 0,
      cbet_flop_opportunities: 0,
      cbet_flop_actions: 0,
      fold_vs_cbet_flop_opportunities: 0,
      fold_vs_cbet_flop_actions: 0,
      raise_vs_cbet_flop_opportunities: 0,
      raise_vs_cbet_flop_actions: 0,
      ch_raise_flop_opportunities: 0,
      ch_raise_flop_actions: 0,
      donk_flop_opportunities: 0,
      donk_flop_actions: 0,
      wtsd_opportunities: 0,
      wtsd_actions: 0,
      wsd_opportunities: 0,
      wsd_actions: 0,
      wwsf_opportunities: 0,
      wwsf_actions: 0,
    },
    positionIncrements: {
      'BTN': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'SB': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'BB': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'BTN/SB': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'UTG': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'UTG+1': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'MP': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'LJ': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'HJ': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
      'CO': { vpip_opportunities: 0, vpip_actions: 0, pfr_opportunities: 0, pfr_actions: 0 },
    },
    handState: {
      saw_flop: false,
      is_preflop_aggressor: false,
      hasActedPreflop: false,
      hasRaisedPreflop: false,
    }
  };
};

const trackBotGameAction = (handStats, gameState, player, action) => {
  if (!handStats || !handStats[player.id]) return;
  
  const stats = handStats[player.id];
  
  // Only track pre-flop stats for VPIP and PFR
  if (gameState.currentBettingRound !== GamePhase.PREFLOP) {
    return;
  }
  
  // Check if BB had a free option
  const isBBOption = player.isBB && gameState.currentHighestBet === BIG_BLIND_AMOUNT && action === 'check';
  if (isBBOption) {
    stats.increments.vpip_opportunities = 0;
    if (stats.positionIncrements[player.positionName]) {
      stats.positionIncrements[player.positionName].vpip_opportunities = 0;
    }
  }
  
  // Track VPIP actions
  if (action === 'call' || action === 'bet' || action === 'raise') {
    stats.increments.vpip_actions = 1;
    const posStats = stats.positionIncrements[player.positionName];
    if (posStats && posStats.vpip_actions === 0) {
      posStats.vpip_actions = 1;
    }
  }
  
  // Track PFR actions
  const isPreflopRaise = (action === 'bet' || action === 'raise');
  if (isPreflopRaise && !stats.handState.hasRaisedPreflop) {
    stats.increments.pfr_actions = 1;
    const posStats = stats.positionIncrements[player.positionName];
    if (posStats) {
      posStats.pfr_actions = 1;
    }
    stats.handState.hasRaisedPreflop = true;
  }
};

const commitBotGameStats = async (handStats) => {
  if (!handStats) return;
  
  const playersToUpdate = Object.values(handStats).filter(statObj => statObj && statObj.playerId);
  if (playersToUpdate.length === 0) return;
  
  try {
    const updatesPayload = playersToUpdate.map(playerStat => ({
      p_player_id: playerStat.playerId,
      p_increments: playerStat.increments,
      p_position_increments: playerStat.positionIncrements,
    }));
    
    const { error } = await supabase.rpc('batch_update_player_stats', {
      updates: updatesPayload,
    });
    
    if (error) {
      console.error('Error updating bot game stats:', error);
    } else {
      console.log(`Successfully committed bot game stats for ${playersToUpdate.length} players.`);
    }
  } catch (error) {
    console.error('Exception while committing bot game stats:', error);
  }
};

const initializePlayer = (id, name, stack) => ({
    id,
    name,
    cards: [],
    stack,
    currentBet: 0,
    totalBetInHand: 0,
    isTurn: false,
    isFolded: false,
    isAllIn: false,
    isDealer: false,
    isSB: false,
    isBB: false,
    hasActedThisRound: false,
    positionName: '',
});

const assignPositions = (players, dealerIndex) => {
    const numPlayers = players.length;
    let positions = [];
    if (numPlayers === 2) {
        positions = POSITIONS_HEADSUP;
    } else if (numPlayers <= 6) {
        positions = POSITIONS_6MAX;
    } else {
        positions = POSITIONS_9MAX;
    }

    const relevantPositions = positions.slice(0, numPlayers);

    players.forEach((player, index) => {
        const positionIndex = (index - dealerIndex + numPlayers) % numPlayers;
        player.positionName = relevantPositions[positionIndex];
        player.name = `${player.positionName} (P${player.id.slice(-1)})`;
        player.isDealer = player.positionName === 'BTN' || player.positionName === 'BTN/SB';
        player.isSB = player.positionName === 'SB' || player.positionName === 'BTN/SB';
        player.isBB = player.positionName === 'BB';
    });
    return players;
};

const initialGameState = {
    players: [],
    deck: [],
    communityCards: [],
    pot: 0,
    calculatedPots: [],
    currentBettingRound: GamePhase.PREFLOP,
    currentPlayerIndex: -1,
    dealerIndex: -1,
    currentHighestBet: 0,
    minRaiseAmount: BIG_BLIND_AMOUNT,
    lastAggressorIndex: -1,
    actionClosingPlayerIndex: -1,
    handHistory: [],
    message: "Initializing...",
    numPlayers: 6,
};

const createDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(rank + suit);
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  let shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

// TODO: Refactor to handle edge cases better
const getNextPlayerIndex = (currentIndex, players) => {
    let nextIndex = (currentIndex + 1) % players.length;
    let loopGuard = 0;
    // Ensure players exists and players[nextIndex] is valid before accessing its properties
    while (players && players[nextIndex] && (players[nextIndex].isFolded || (players[nextIndex].isAllIn && players[nextIndex].currentBet === 0))) {
        nextIndex = (nextIndex + 1) % players.length;
        loopGuard++;
        if (loopGuard > players.length * 2) return -1;
    }
    if (!players || !players[nextIndex]) return -1; // Check if player still valid after loop
    return nextIndex;
};

const findFirstActivePlayerIndex = (startIndex, players) => {
    if (!players || players.length === 0) return -1;
    let currentIndex = startIndex % players.length;
    let loopGuard = 0;
    while(players[currentIndex].isFolded || players[currentIndex].isAllIn) {
        currentIndex = (currentIndex + 1) % players.length;
        loopGuard++;
        if (loopGuard > players.length * 2) return -1;
    }
    return currentIndex;
};

const evaluateHand = (holeCards, communityCards) => {
    const sevenCards = [...holeCards, ...communityCards];
    if (sevenCards.length < 5) {
        return { rank: -1, name: 'Invalid', descr: 'Not enough cards', cards: [] };
    }
    try {
        return Hand.solve(sevenCards);
    } catch (error) {
        console.error("Error evaluating hand:", sevenCards, error);
        return { rank: -1, name: 'Error', descr: 'Evaluation Error', cards: [] };
    }
};

// Helper to get indices of community cards used in the winning hand
function getWinningCommunityCardIndices(winningHandCards, communityCards) {
  // Return indices in communityCards that are present in winningHandCards
  return communityCards.map((card, idx) => winningHandCards.includes(card) ? idx : -1).filter(idx => idx !== -1);
}

// --- Helper Functions ---

// Player Positioning Logic
function getPlayerPosition(index, totalPlayers, currentTableWidth, currentTableHeight) {
    if (currentTableWidth === 0 || currentTableHeight === 0) {
        const defaultStyle = { position: 'absolute', left: '0%', top: '0%', width: '0px', height: '0px', opacity: 0, zIndex: 0 };
        return { infoStyle: defaultStyle, cardStyle: defaultStyle, betStyle: defaultStyle, cardWidth: 0, playerAngle: 0 };
    }

    // Calculate the polar angle for this player's seat (0 at top, clockwise)
    const angle = (index / totalPlayers) * 2 * Math.PI;

    const tableWidth = currentTableWidth;
    const tableHeight = currentTableHeight;
    // Reduce horizontal radius for 9-max to bring side players in
    const horizontalRadius = totalPlayers === 9 ? tableWidth * 0.40 : tableWidth * 0.46;
    const verticalRadius = tableHeight * 0.38;
    
    // Make card dimensions relative to table size
    const cardWidth = Math.min(tableWidth * 0.10, 180); // Increased from 0.08, 90px for ~2x size
    const cardHeight = cardWidth * 0.72; // Maintain card aspect ratio
    const infoWidth = cardWidth * 1.4; // Info box slightly wider than cards
    const infoHeight = cardHeight * 0.8; // Info box height relative to card height
    
    const centerX = tableWidth / 2;
    const centerY = tableHeight / 2;
    let baseX = centerX + horizontalRadius * Math.cos(angle - Math.PI / 2);
    let baseY = centerY + verticalRadius * Math.sin(angle - Math.PI / 2);

    // Shift everything slightly downward to prevent top clipping
    baseY += tableHeight * 0.05;

    // Calculate Info Box Position 
    let infoX = baseX - infoWidth / 2;
    let infoY = baseY - infoHeight / 2 + infoHeight * 0.30; // Keep nameplate slightly lower
    const infoLeftPercent = (infoX / tableWidth) * 100;
    const infoTopPercent = (infoY / tableHeight) * 100;
    const infoStyle = {
        position: 'absolute',
        left: `${infoLeftPercent}%`,
        top: `${infoTopPercent}%`,
        width: `${infoWidth}px`,
        zIndex: 10, // Nameplate above cards
    };

    // Calculate Card Hand Position 
    let cardX = baseX - cardWidth / 2;
    let cardY = infoY - cardHeight * 1.08; // Restore original logic
    const cardLeftPercent = (cardX / tableWidth) * 100;
    const cardTopPercent = (cardY / tableHeight) * 100;
    const cardStyle = {
        position: 'absolute',
        left: `${cardLeftPercent}%`,
        top: `${cardTopPercent}%`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        zIndex: 5, // Cards below nameplate
    };
    
    // Calculate Bet Amount Position
    const betPositionFactor = 0.8;
    let betX = centerX + betPositionFactor * (baseX - centerX);
    let betY = centerY + betPositionFactor * (baseY - centerY);

    // Overlap Check for Bottom Players
    const cardBottomY = cardY + cardHeight;
    const playerAngle = angle; // Reuse computed angle
    const bottomAngle = Math.PI;
    const angleTolerance = 0.9;

    if (Math.abs(playerAngle - bottomAngle) < angleTolerance && betY < cardBottomY) {
         betY = cardBottomY + -100;
    }

    const betLeftPercent = (betX / tableWidth) * 100;
    const betTopPercent = (betY / tableHeight) * 100;
    let betStyle = {
        position: 'absolute',
        left: `${betLeftPercent}%`,
        top: `${betTopPercent}%`,
        transform: 'translateX(-50%) translateY(-50%)',
        zIndex: 15,
    };

    // Dynamic offset for bet chip based on angle (top, bottom, sides)
    // 0 = top, PI = bottom, PI/2 = right, 3PI/2 = left
    const offset = 1.8; // em units, slightly closer
    if (angle > Math.PI * 1.75 || angle < Math.PI * 0.25) {
        // Top (angle near 0)
        betStyle.top = `calc(${betStyle.top} + ${offset}em)`;
    } else if (angle > Math.PI * 0.75 && angle < Math.PI * 1.25) {
        // Bottom (angle near PI)
        betStyle.top = `calc(${betStyle.top} - ${offset}em)`;
    } else if (angle >= Math.PI * 0.25 && angle <= Math.PI * 0.75) {
        // Right side
        betStyle.left = `calc(${betStyle.left} - ${offset}em)`;
    } else if (angle >= Math.PI * 1.25 && angle <= Math.PI * 1.75) {
        // Left side
        betStyle.left = `calc(${betStyle.left} + ${offset}em)`;
    }

    return { infoStyle, cardStyle, betStyle, cardWidth, playerAngle: angle };
}

// Table Style Logic
function getTableStyle(tableTheme) {
    const style = {
        width: '180vmin',
        aspectRatio: '16/9',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'visible',
        backgroundImage: `url(${tableBg})`,
    };
    switch (tableTheme) {
        case 'light':
            style.backgroundColor = '#f0f0f0';
            style.filter = 'brightness(1.2) contrast(0.9)';
            break;
        case 'classic':
            style.backgroundColor = 'transparent';
            style.filter = 'hue-rotate(100deg) saturate(1.3)';
            break;
        case 'dark':
        default:
            style.backgroundColor = 'transparent';
            break;
    }
    return style;
}

// Winner Highlight Logic
function getWinnerHighlight(gameState) {
    let highlightedCommunityIndices = [];
    let winnerPlayerIds = [];
    let winnerHandCards = [];
    const isShowdownOrHandOver =
        (gameState.currentBettingRound === 'SHOWDOWN' || gameState.currentBettingRound === 'HAND_OVER')
        && gameState.calculatedPots.length > 0;
    if (isShowdownOrHandOver) {
        const mainPot = gameState.calculatedPots[0];
        if (mainPot && mainPot.winnerIds && mainPot.winnerIds.length > 0) {
            winnerPlayerIds = mainPot.winnerIds;
            const winner = gameState.players.find(p => winnerPlayerIds.includes(p.id));
            // Only try to solve if there are at least 5 cards (2 hole + 3 community)
            if (winner && winner.cards && (winner.cards.length + gameState.communityCards.length) >= 5) {
                try {
                    const Hand = require('pokersolver').Hand;
                    const solved = Hand.solve([...winner.cards, ...gameState.communityCards]);
                    winnerHandCards = solved.cards;
                    highlightedCommunityIndices = getWinningCommunityCardIndices(winnerHandCards, gameState.communityCards);
                } catch (e) {
                    // Defensive: do nothing, just don't highlight
                }
            }
        }
    }
    return { highlightedCommunityIndices, winnerPlayerIds, winnerHandCards, isShowdownOrHandOver };
}

// Action Button State Helper
function getActionButtonState(gameState) {
    const currentPlayer = gameState.currentPlayerIndex >= 0 ? gameState.players[gameState.currentPlayerIndex] : null;
    const canCheck = currentPlayer?.currentBet === gameState.currentHighestBet;
    const callAmount = gameState.currentHighestBet - (currentPlayer?.currentBet || 0);
    const canCall = callAmount > 0 && (currentPlayer?.stack || 0) > 0 && !currentPlayer?.isAllIn;
    const minNewTotalBet = gameState.currentHighestBet + gameState.minRaiseAmount;
    const minChipsToAdd = Math.max(1, minNewTotalBet - (currentPlayer?.currentBet || 0));
    const maxChipsToAdd = currentPlayer?.stack || 0;
    const canBet = (currentPlayer?.stack || 0) > 0 && !currentPlayer?.isAllIn;
    return {
        currentPlayer,
        canCheck,
        canCall,
        callAmount,
        canBet,
        minBetAmount: minChipsToAdd,
        maxBetAmount: maxChipsToAdd,
    };
}

// Player Info Class Helper
function getPlayerInfoClasses(player, tableTheme, isShowdownOrHandOver, winnerPlayerIds) {
    return [
        'player-info-container relative p-1 border rounded',
        'transition-all duration-300',
        player.isTurn ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' : 'border-gray-700 bg-gray-900 bg-opacity-80',
        tableTheme === 'light' ? 'text-black bg-white bg-opacity-90' : 'text-white',
        (isShowdownOrHandOver && winnerPlayerIds.includes(player.id)) ? 'winner-glow-bounce' : ''
    ].filter(Boolean).join(' ');
}
// --- End Helper Functions ---

function PokerGame({ isPracticeMode = false, scenarioSetup = null, onAction = null, vsBot = false, botPlayerIndex = 1 }) {
    const { user } = useAuth(); // Get authenticated user for stats tracking
    const [numPlayers, setNumPlayers] = useState(vsBot ? 2 : initialGameState.numPlayers);
    const [gameState, setGameState] = useState(() => {
        let state = JSON.parse(JSON.stringify(initialGameState));
        state.numPlayers = vsBot ? 2 : numPlayers;
        return state; // Don't call startNewHand here - it will be called in useEffect
    });
    const [isTestMode, setIsTestMode] = useState(isPracticeMode);
    const [showAllCards, setShowAllCards] = useState(isPracticeMode);
    const [showSettings, setShowSettings] = useState(false);
    const [tableTheme, setTableTheme] = useState('dark');
    const tableRef = useRef(null);
    const [tableDimensions, setTableDimensions] = useState({ width: 0, height: 0 });
    const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
    
    // Bot-related state
    const [botProcessing, setBotProcessing] = useState(false);
    const [slumbotSessionActive, setSlumbotSessionActive] = useState(false);
    
    // Bot game stats tracking
    const [botGameHandStats, setBotGameHandStats] = useState(null);
    
    // HUD stats tracking
    const [visibleHudPlayerId, setVisibleHudPlayerId] = useState(null);
    const [currentPlayerStats, setCurrentPlayerStats] = useState(null);
    
    // Helper function to get human player ID in bot mode
    const getHumanPlayerId = () => {
        if (!vsBot) return 'player1'; // Default human player in regular mode
        // In bot mode, human is the player that's NOT the bot
        const humanPlayerIndex = botPlayerIndex === 0 ? 1 : 0;
        return `player${humanPlayerIndex + 1}`;
    };

    // Function to fetch current player stats for HUD display
    const fetchCurrentPlayerStats = async () => {
        if (!user?.id) return null;
        
        try {
            const { data, error } = await supabase
                .from('player_stats')
                .select('*')
                .eq('player_id', user.id)
                .single();
                
            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching player stats:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Exception fetching player stats:', error);
            return null;
        }
    };

    // Function to handle HUD toggle
    const handleHudToggle = (playerId) => {
        setVisibleHudPlayerId(prevId => (prevId === playerId ? null : playerId));
    };

    function startNewHand(currentState) {
        if (currentState.players.length !== currentState.numPlayers) {
            currentState.players = [];
            for(let i = 1; i <= currentState.numPlayers; i++) {
                const playerName = vsBot && (i - 1) === botPlayerIndex ? 'Slumbot' : `Player ${i}`;
                currentState.players.push(initializePlayer(`player${i}`, playerName, 1000)); 
            }
        } else {
             currentState.players.forEach(p => {
                 p.stack = p.stack > 0 ? p.stack : 1000;
             });
        }

        currentState.deck = shuffleDeck(createDeck());
        currentState.communityCards = [];
        currentState.pot = 0;
        currentState.calculatedPots = [];
        currentState.currentBettingRound = GamePhase.PREFLOP;
        currentState.currentHighestBet = 0;
        currentState.minRaiseAmount = BIG_BLIND_AMOUNT;
        currentState.handHistory = [];
        currentState.message = "";
        currentState.lastAggressorIndex = -1;
        currentState.actionClosingPlayerIndex = -1;

        currentState.dealerIndex = (currentState.dealerIndex + 1) % currentState.numPlayers;
        let guard = 0;
        while(currentState.players[currentState.dealerIndex].stack <= 0 && guard < currentState.numPlayers * 2) {
             currentState.dealerIndex = (currentState.dealerIndex + 1) % currentState.numPlayers;
             guard++;
        }
        
        currentState.players.forEach((player, index) => {
            player.cards = [];
            player.currentBet = 0;
            player.totalBetInHand = 0;
            player.isTurn = false;
            player.isFolded = player.stack === 0;
            player.isAllIn = false;
            player.isDealer = false;
            player.isSB = false;
            player.isBB = false;
            player.hasActedThisRound = false;
        });
        
        currentState.players = assignPositions(currentState.players, currentState.dealerIndex);

        // Initialize bot game stats tracking if in bot mode and user is authenticated
        if (vsBot && user?.id) {
            // Calculate human player ID inline (bot is at botPlayerIndex, human is the other)
            const humanPlayerIndex = botPlayerIndex === 0 ? 1 : 0;
            const humanPlayerId = `player${humanPlayerIndex + 1}`;
            const humanPlayer = currentState.players.find(p => p.id === humanPlayerId);
            
            if (humanPlayer) {
                const handStats = {};
                handStats[humanPlayer.id] = createBotGameHandStats(user.id);
                
                // Set position-specific opportunities
                const posStats = handStats[humanPlayer.id].positionIncrements[humanPlayer.positionName];
                if (posStats) {
                    posStats.vpip_opportunities = 1;
                    posStats.pfr_opportunities = 1;
                }
                
                setBotGameHandStats(handStats);
                console.log(`[BotStats] Initialized hand stats for ${humanPlayer.name} (${humanPlayer.positionName})`);
            }
        }

        const activePlayersCount = currentState.players.filter(p => !p.isFolded).length;
        if (activePlayersCount < 2) {
            currentState.message = "Not enough players to continue.";
            currentState.currentBettingRound = GamePhase.HAND_OVER;
            return currentState;
        }

        for (let i = 0; i < 2; i++) {
            let playerIndex = currentState.dealerIndex;
            for (let j = 0; j < currentState.numPlayers; j++) {
                playerIndex = (playerIndex + 1) % currentState.numPlayers;
                if (!currentState.players[playerIndex].isFolded) {
                    currentState.players[playerIndex].cards.push(currentState.deck.pop());
                }
            }
        }

        let sbIndex, bbIndex;
        if (currentState.numPlayers === 2) {
            sbIndex = currentState.dealerIndex;
            bbIndex = findFirstActivePlayerIndex(sbIndex + 1, currentState.players);
        } else {
            sbIndex = findFirstActivePlayerIndex(currentState.dealerIndex + 1, currentState.players);
            bbIndex = findFirstActivePlayerIndex(sbIndex + 1, currentState.players);
        }
        
        if (sbIndex === -1 || bbIndex === -1) {
             currentState.message = "Error determining blinds.";
             currentState.currentBettingRound = GamePhase.HAND_OVER;
             return currentState;
        }
        
        currentState.players[sbIndex].isSB = true;
        currentState.players[bbIndex].isBB = true;

        const postBlind = (playerIndex, blindAmount) => {
            const player = currentState.players[playerIndex];
            const amountToPost = Math.min(player.stack, blindAmount);
            player.stack -= amountToPost;
            player.currentBet = amountToPost;
            player.totalBetInHand += amountToPost;
            currentState.pot += amountToPost;
            player.hasActedThisRound = false;
            if (player.stack === 0) player.isAllIn = true;
        };

        postBlind(sbIndex, SMALL_BLIND_AMOUNT);
        postBlind(bbIndex, BIG_BLIND_AMOUNT);

        currentState.currentHighestBet = BIG_BLIND_AMOUNT;
        currentState.minRaiseAmount = BIG_BLIND_AMOUNT;
        currentState.lastAggressorIndex = bbIndex;

        let firstToActIndex;
        if (currentState.numPlayers === 2) {
             firstToActIndex = currentState.dealerIndex;
             currentState.actionClosingPlayerIndex = bbIndex;
        } else {
             firstToActIndex = findFirstActivePlayerIndex(bbIndex + 1, currentState.players);
             currentState.actionClosingPlayerIndex = bbIndex;
        }
        currentState.currentPlayerIndex = firstToActIndex;
        currentState.players[currentState.currentPlayerIndex].isTurn = true;

        currentState.message = `Hand started. Blinds posted. ${currentState.players[currentState.currentPlayerIndex].name}'s turn.`;
        return currentState;
    }

    useEffect(() => {
        const tableElement = tableRef.current;
        if (!tableElement) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setTableDimensions({ width, height });
            }
        });

        observer.observe(tableElement);
        // Set initial dimensions correctly after mount
        const rect = tableElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) { // Ensure valid initial dimensions
             setTableDimensions({ width: rect.width, height: rect.height });
        }


        return () => {
            observer.unobserve(tableElement);
        };
    }, []);

    // Initialize game state after all state has been set up
    useEffect(() => {
        setGameState(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState));
            return startNewHand(newState);
        });
    }, []); // Run once on mount

    // Initialize game state with scenario setup if in practice mode
    useEffect(() => {
        if (isPracticeMode && scenarioSetup) {
            setGameState(prevState => {
                const newState = JSON.parse(JSON.stringify(prevState));
                // Apply all scenario setup properties
                Object.keys(scenarioSetup).forEach(key => {
                    newState[key] = scenarioSetup[key];
                });
                return newState;
            });
            // Ensure test mode is enabled in practice mode
            setIsTestMode(true);
            setShowAllCards(true);
        }
    }, [isPracticeMode, scenarioSetup]);

    function checkRoundCompletion(state) {
        const nonFoldedPlayers = state.players.filter(p => !p.isFolded);
        if (nonFoldedPlayers.length <= 1) {
            return true; // Hand is over or only one player left
        }

        const activePlayers = state.players.filter(p => !p.isFolded && !p.isAllIn);
        if (activePlayers.length <= 1 && state.currentBettingRound !== GamePhase.PREFLOP) {
             // If only one player can bet post-flop, no more betting can occur this round
             // (Unless it's preflop where blinds might force action)
             // Check if everyone else has matched or is all-in
             let allOthersMatchedOrAllIn = true;
             for (const player of state.players) {
                 if (!player.isFolded && !player.isAllIn && player.id !== activePlayers[0]?.id) {
                      if (player.currentBet < state.currentHighestBet) {
                         allOthersMatchedOrAllIn = false;
                         break;
                      }
                 }
             }
             if(allOthersMatchedOrAllIn) return true;
        }

        let roundOver = true;
        for (const player of state.players) {
            if (!player.isFolded && !player.isAllIn) { // Only check players who can still act
                // Condition 1: Has everyone acted?
                if (!player.hasActedThisRound) {
                    roundOver = false;
                    break;
                }
                // Condition 2: Has everyone matched the highest bet?
                if (player.currentBet < state.currentHighestBet) {
                    roundOver = false;
                    break;
                }
            }
        }
        
        if (!roundOver) {
            return false; // If basic conditions aren't met, round isn't over
        }

        // Special Case: Pre-flop Big Blind Option
        // If the round seems over, but it's pre-flop and the action is on the BB who hasn't raised,
        // they still have the option to raise.
        const bbIndex = state.players.findIndex(p => p.isBB);
        if (state.currentBettingRound === GamePhase.PREFLOP && 
            state.currentPlayerIndex === bbIndex && 
            state.players[bbIndex].currentBet === BIG_BLIND_AMOUNT && // BB just called the initial blind
            state.currentHighestBet === BIG_BLIND_AMOUNT && // No raise occurred
            !state.players[bbIndex].isAllIn) // BB is not all-in
             {
                 // Check if the BB has acted *beyond* posting the blind
                 // We assume posting blind doesn't set hasActedThisRound initially
                 if (!state.players[bbIndex].hasActedThisRound) {
                    return false; // BB still needs to exercise their option
                 }
        }

        // If we passed all checks, the round is complete.
        return true;
    }

    // ----- Pot Awarding Logic (with Side Pots) -----
    function awardPot(state) {
        const nonFoldedPlayers = state.players.filter(p => !p.isFolded);
        let newState = JSON.parse(JSON.stringify(state));

        if (nonFoldedPlayers.length === 1) {
            const winner = nonFoldedPlayers[0];
            const winnerIndex = newState.players.findIndex(p => p.id === winner.id);
            newState.players[winnerIndex].stack += newState.pot;
            newState.message = `${winner.name} wins $${newState.pot} by default.`;
            newState.calculatedPots = [{ amount: newState.pot, eligiblePlayerIds: [winner.id], winnerIds: [winner.id] }];
            newState.pot = 0;
        } else {
            let contenders = nonFoldedPlayers.map(player => ({
                ...player,
                originalIndex: state.players.findIndex(p => p.id === player.id),
                evaluatedHand: evaluateHand(player.cards, state.communityCards)
            }));
            
            const pots = [];
            let playersForPotCalc = JSON.parse(JSON.stringify(state.players)).map(p => ({ id: p.id, totalBetInHand: p.totalBetInHand, isFolded: p.isFolded }));
            let playersInPotCalc = playersForPotCalc.filter(p => !p.isFolded); 

            let potCalcLoopGuard = 0;
            while (playersInPotCalc.length > 0 && potCalcLoopGuard < state.players.length + 5) {
                potCalcLoopGuard++;
                
                const minBetInCycle = Math.min(...playersInPotCalc.map(p => p.totalBetInHand));
                if (minBetInCycle < 0) {
                     break;
                }
                
                let potAmountThisCycle = 0;
                let playersEligibleForThisPot = playersInPotCalc.map(p => p.id);
                
                playersForPotCalc.forEach(calcPlayer => {
                    const contribution = Math.min(minBetInCycle, calcPlayer.totalBetInHand);
                    if (contribution > 0) {
                        potAmountThisCycle += contribution;
                        calcPlayer.totalBetInHand -= contribution;
                    }
                });

                if (potAmountThisCycle > 0) {
                     pots.push({ 
                         amount: potAmountThisCycle, 
                         eligiblePlayerIds: playersEligibleForThisPot 
                     });
                }
                
                playersInPotCalc = playersInPotCalc.filter(p => p.totalBetInHand > 0);
            }
             if(potCalcLoopGuard >= state.players.length + 5) {
                 state.message = "Error calculating pots.";
                  return {
                    ...state, 
                    currentBettingRound: GamePhase.HAND_OVER,
                    currentPlayerIndex: -1,
                  }; 
             }

            newState.calculatedPots = pots.map(p => ({...p, winnerIds: [], winnerHandDescr: '' }));
            newState.pot = 0;

            let finalMessages = [];
            pots.forEach((pot, potIndex) => {
                if (pot.amount <= 0) return;

                const eligibleContenders = contenders.filter(c => pot.eligiblePlayerIds.includes(c.id));
                
                if (eligibleContenders.length === 0) {
                     console.warn(`Pot ${potIndex+1} has no eligible contenders! Amount: ${pot.amount}`);
                     return;
                }
                
                if (eligibleContenders.length === 1) {
                    const winner = eligibleContenders[0];
                    newState.players[winner.originalIndex].stack += pot.amount;
                    const potLabel = newState.calculatedPots.length > 1 ? `Side Pot ${potIndex + 1}` : 'Main Pot';
                    finalMessages.push(`${winner.name} wins ${potLabel} ($${pot.amount})`);
                    pot.winnerIds = [winner.id];
                    pot.winnerHandDescr = `(${winner.evaluatedHand.descr || winner.evaluatedHand.name})`;
                } else {
                    const solvedHandsForPot = eligibleContenders.map(c => c.evaluatedHand);
                    const winningHands = Hand.winners(solvedHandsForPot);
                    
                    const winnersForPot = eligibleContenders.filter(c => 
                        winningHands.some(wh => wh === c.evaluatedHand)
                    );
                    
                    pot.winnerIds = winnersForPot.map(w => w.id);
                    const winnerHandDescr = winnersForPot[0].evaluatedHand.descr || winnersForPot[0].evaluatedHand.name;
                    pot.winnerHandDescr = `(${winnerHandDescr})`;

                    const potSplit = Math.floor(pot.amount / winnersForPot.length);
                    const oddChip = pot.amount % winnersForPot.length;
                    
                    let potMessageNames = [];
                    winnersForPot.forEach((winner, i) => {
                        const awardAmount = potSplit + (i === 0 ? oddChip : 0); 
                        newState.players[winner.originalIndex].stack += awardAmount;
                        potMessageNames.push(winner.name);
                    });

                    const potLabel = newState.calculatedPots.length > 1 ? `Side Pot ${potIndex + 1}` : 'Main Pot';
                    finalMessages.push(`${potMessageNames.join(' & ')} split ${potLabel} ($${pot.amount}) with ${winnerHandDescr}`);
                }
            });
            
            newState.message = finalMessages.join('. ');
        }
        
        newState.currentBettingRound = GamePhase.HAND_OVER;
        newState.currentPlayerIndex = -1;
        newState.players.forEach(p => { p.isTurn = false; p.currentBet = 0; p.totalBetInHand = 0; });
        
        // Commit bot game stats when hand is over
        if (vsBot && user?.id && botGameHandStats) {
            commitBotGameStats(botGameHandStats);
            setBotGameHandStats(null); // Clear stats for next hand
            console.log('[BotStats] Committed hand stats to database');
        }
        
        return newState;
    }

    function advanceToNextRound(state) {
        state.players.forEach(player => {
            player.currentBet = 0;
            player.hasActedThisRound = false;
        });

        const nonFolded = state.players.filter(p => !p.isFolded);
        if (nonFolded.length <= 1) {
            return awardPot(state);
        }
        
        const activePlayersAbleToBet = nonFolded.filter(p => !p.isAllIn);
        let skipBetting = activePlayersAbleToBet.length <= 1;

        let nextPhase = state.currentBettingRound;
        let cardsToDeal = 0;
        let dealCommunity = true;

        while (dealCommunity) {
            switch (nextPhase) {
                case GamePhase.PREFLOP:
                    nextPhase = GamePhase.FLOP;
                    cardsToDeal = 3;
                    break;
                case GamePhase.FLOP:
                    nextPhase = GamePhase.TURN;
                    cardsToDeal = 1;
                    break;
                case GamePhase.TURN:
                    nextPhase = GamePhase.RIVER;
                    cardsToDeal = 1;
                    break;
                case GamePhase.RIVER:
                    nextPhase = GamePhase.SHOWDOWN;
                    cardsToDeal = 0;
                    dealCommunity = false;
                    break;
                default:
                    nextPhase = GamePhase.HAND_OVER;
                    dealCommunity = false;
                    cardsToDeal = 0;
            }

            if (cardsToDeal > 0) {
                if (state.deck.length < cardsToDeal + 1) {
                     nextPhase = GamePhase.HAND_OVER;
                     dealCommunity = false;
                     break;
                }
                state.deck.shift();
                for (let i = 0; i < cardsToDeal; i++) {
                    state.communityCards.push(state.deck.shift());
                }
            }

            if (skipBetting && nextPhase !== GamePhase.SHOWDOWN && nextPhase !== GamePhase.HAND_OVER) {
                cardsToDeal = 0;
            } else {
                dealCommunity = false;
            }
        }

        state.currentBettingRound = nextPhase;

        if (nextPhase !== GamePhase.SHOWDOWN && nextPhase !== GamePhase.HAND_OVER) {
            state.currentHighestBet = 0;
            state.minRaiseAmount = BIG_BLIND_AMOUNT;
            state.lastAggressorIndex = -1;
            state.players.forEach(p => p.hasActedThisRound = false);
            
            state.currentPlayerIndex = findFirstActivePlayerIndex(state.dealerIndex + 1, state.players);
            state.actionClosingPlayerIndex = findFirstActivePlayerIndex(state.dealerIndex, state.players);
            if (state.currentPlayerIndex !== -1) {
                state.players[state.currentPlayerIndex].isTurn = true;
                state.message = `Dealing ${nextPhase}. ${state.players[state.currentPlayerIndex].name}'s turn.`;
            } else {
                 state.message = `Dealing ${nextPhase}. Error: No active player found?`;
                 state.currentBettingRound = GamePhase.HAND_OVER;
            }
        } else {
            state.currentPlayerIndex = -1; 
            state.players.forEach(p => p.isTurn = false);
             if (nextPhase === GamePhase.SHOWDOWN) {
                 // Set flags to trigger animation and pending pot award
                 state.justAwardedPot = true;
                 state.pendingPotAward = true;
                 return state; // Do NOT call awardPot yet
             } else {
                 if (state.pot > 0) {
                    state.justAwardedPot = true;
                    state.pendingPotAward = true;
                    return state; // Do NOT call awardPot yet
                 }
             }
        }
        
        return state;
    }
    
    function progressTurn(state) {
        const nextPlayerIdx = getNextPlayerIndex(state.currentPlayerIndex, state.players);
        state.players.forEach((p, index) => {
            p.isTurn = (index === nextPlayerIdx);
        });
        state.currentPlayerIndex = nextPlayerIdx;
        if (nextPlayerIdx !== -1) {
             state.message = `${state.players[nextPlayerIdx].name}'s turn.`;
        }
        return state;
    }

    // Modify action handlers to support practice mode
    const handleAction = useCallback((actionFn) => {
        // Get the action name and amount before executing
        const actionName = actionFn.name.replace('handle', '').toUpperCase();
        const amount = actionFn.amount;

        // Execute the action to get the new state
        const newState = actionFn.execute(JSON.parse(JSON.stringify(gameState)));

        if (isPracticeMode && onAction) {
            // In practice mode, notify parent component of action
            onAction(actionName, amount);
            // Also update the game state to show the action
            setGameState(newState);
        } else {
            // Normal game mode logic
        setGameState(prevState => {
            if (prevState.currentBettingRound === GamePhase.HAND_OVER) return prevState;
            
                let stateAfterAction = actionFn.execute(JSON.parse(JSON.stringify(prevState)));

            // Track stats for bot games if in bot mode and user is authenticated
            if (vsBot && user?.id && botGameHandStats) {
                const currentPlayer = prevState.players[prevState.currentPlayerIndex];
                if (currentPlayer && currentPlayer.id === getHumanPlayerId()) {
                    const actionType = actionFn.name.toLowerCase();
                    trackBotGameAction(botGameHandStats, prevState, currentPlayer, actionType);
                    console.log(`[BotStats] Tracked ${actionType} action for ${currentPlayer.name}`);
                }
            }

            const nonFolded = stateAfterAction.players.filter(p => !p.isFolded);
            if (nonFolded.length === 1) {
                return awardPot(stateAfterAction);
            }

            if (checkRoundCompletion(stateAfterAction)) {
                return advanceToNextRound(stateAfterAction);
            } else {
                return progressTurn(stateAfterAction);
            }
        });
        }
    }, [isPracticeMode, onAction, gameState, vsBot, user?.id, botGameHandStats, getHumanPlayerId]);

    const handleCheck = useCallback(() => {
        handleAction({
            name: 'Check',
            amount: 0,
            execute: (prevState) => {
            const playerIndex = prevState.currentPlayerIndex;
            const player = prevState.players[playerIndex];

            if (player.currentBet < prevState.currentHighestBet) {
                return { ...prevState, message: "Cannot check, must call, raise, or fold." };
            }
            
            const newState = JSON.parse(JSON.stringify(prevState));
            newState.players[playerIndex].hasActedThisRound = true;
            newState.players[playerIndex].isTurn = false;
            return newState;
            }
        });
    }, [handleAction]);

    const handleCall = useCallback(() => {
        handleAction({
            name: 'Call',
            execute: (prevState) => {
            const playerIndex = prevState.currentPlayerIndex;
            const player = prevState.players[playerIndex];
            const callAmount = prevState.currentHighestBet - player.currentBet;

            if (callAmount <= 0) {
                return { ...prevState, message: "Cannot call, action is to check." };
            }

            const newState = JSON.parse(JSON.stringify(prevState));
            const actualCallAmount = Math.min(callAmount, player.stack);
            const isAllIn = actualCallAmount === player.stack;
            
            newState.players[playerIndex].stack -= actualCallAmount;
            newState.players[playerIndex].currentBet += actualCallAmount;
            newState.players[playerIndex].totalBetInHand += actualCallAmount;
            newState.players[playerIndex].isAllIn = isAllIn;
            newState.players[playerIndex].hasActedThisRound = true;
            newState.players[playerIndex].isTurn = false;
            newState.pot += actualCallAmount;
            
            return newState;
            },
            amount: gameState.currentHighestBet - (gameState.players[gameState.currentPlayerIndex]?.currentBet || 0)
        });
    }, [handleAction, gameState]);

    const handleBet = useCallback((amount) => {
        handleAction({
            name: 'Raise',
            amount,
            execute: (prevState) => {
            const playerIndex = prevState.currentPlayerIndex;
            const player = prevState.players[playerIndex];
            const currentBet = player.currentBet || 0;
            const totalBetAmount = currentBet + amount;
            const raiseAmount = totalBetAmount - prevState.currentHighestBet;

            if (amount <= 0) return { ...prevState, message: "Bet amount must be positive." };
            if (amount > player.stack) return { ...prevState, message: "Not enough chips." };
            
            const minNewTotalBet = prevState.currentHighestBet + prevState.minRaiseAmount;
            const minChipsToAdd = Math.max(1, minNewTotalBet - currentBet);
            const maxChipsToAdd = player.stack;

            if (amount < minChipsToAdd && amount < maxChipsToAdd) {
                return { ...prevState, message: `Min bet/raise: add ${minChipsToAdd} chips.` };
            }
            
            const newState = JSON.parse(JSON.stringify(prevState));
            newState.players[playerIndex].stack -= amount;
            newState.players[playerIndex].currentBet += amount;
            newState.players[playerIndex].totalBetInHand += amount;
            newState.players[playerIndex].isAllIn = amount === player.stack;
            newState.players[playerIndex].hasActedThisRound = true;
            newState.players[playerIndex].isTurn = false;
            newState.pot += amount;

            newState.currentHighestBet = totalBetAmount;
            newState.lastAggressorIndex = playerIndex;
            if (!newState.players[playerIndex].isAllIn || raiseAmount >= prevState.minRaiseAmount) { 
                newState.minRaiseAmount = raiseAmount > 0 ? raiseAmount : prevState.minRaiseAmount;
            }

            return newState;
            }
        });
    }, [handleAction]);

    const handleFold = useCallback(() => {
        handleAction({
            name: 'Fold',
            amount: 0,
            execute: (prevState) => {
                const playerIndex = prevState.currentPlayerIndex;
                const newState = JSON.parse(JSON.stringify(prevState));
                newState.players[playerIndex].isFolded = true;
                newState.players[playerIndex].hasActedThisRound = true;
                newState.players[playerIndex].isTurn = false;
                // Immediately award pot if only one player remains
                const nonFolded = newState.players.filter(p => !p.isFolded);
                if (nonFolded.length === 1) {
                    return awardPot(newState);
                }
                return newState;
            }
        });
    }, [handleAction]);

    // Bot action handling
    const processBotAction = useCallback(async () => {
        if (!vsBot || botProcessing || gameState.currentBettingRound === GamePhase.HAND_OVER) {
            return;
        }

        const currentPlayerIndex = gameState.currentPlayerIndex;
        if (currentPlayerIndex !== botPlayerIndex) {
            return; // Not bot's turn
        }

        setBotProcessing(true);

        try {
            // Start new Slumbot session if needed
            if (!slumbotSessionActive) {
                const response = await SlumbotAPI.newHand();
                if (response.success) {
                    setSlumbotSessionActive(true);
                    // Process initial bot action if provided
                    if (response.data.action) {
                        const botAction = SlumbotAPI.parseSlumbotAction(response.data.action);
                        if (botAction) {
                            await executeBotAction(botAction);
                        }
                    }
                } else {
                    console.error('Failed to start Slumbot session:', response.error);
                    // Fallback to random action
                    await executeRandomBotAction();
                }
            } else {
                // Send current action to Slumbot
                const lastAction = getLastHumanAction();
                if (lastAction) {
                    const slumbotActionString = SlumbotAPI.convertActionToSlumbot(lastAction.type, lastAction.amount);
                    const response = await SlumbotAPI.sendAction(slumbotActionString);
                    
                    if (response.success && response.data.action) {
                        const botAction = SlumbotAPI.parseSlumbotAction(response.data.action);
                        if (botAction) {
                            await executeBotAction(botAction);
                        } else {
                            await executeRandomBotAction();
                        }
                    } else {
                        console.error('Failed to get bot action:', response.error);
                        await executeRandomBotAction();
                    }
                } else {
                    await executeRandomBotAction();
                }
            }
        } catch (error) {
            console.error('Error processing bot action:', error);
            await executeRandomBotAction();
        } finally {
            setBotProcessing(false);
        }
    }, [vsBot, botProcessing, gameState, botPlayerIndex, slumbotSessionActive]);

    const executeBotAction = useCallback(async (botAction) => {
        // Add a small delay to make bot actions feel more natural
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        switch (botAction.type) {
            case 'fold':
                handleFold();
                break;
            case 'check':
                handleCheck();
                break;
            case 'call':
                handleCall();
                break;
            case 'bet':
                handleBet(botAction.amount);
                break;
            default:
                console.warn('Unknown bot action:', botAction);
                await executeRandomBotAction();
        }
    }, [handleFold, handleCheck, handleCall, handleBet]);

    const executeRandomBotAction = useCallback(async () => {
        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const { canCheck, canCall, canBet } = getActionButtonState(gameState);
        
        // Simple random strategy
        const actions = [];
        if (canCheck) actions.push('check');
        if (canCall) actions.push('call');
        if (canBet) actions.push('bet');
        
        if (actions.length === 0) {
            handleFold();
            return;
        }

        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        switch (randomAction) {
            case 'check':
                handleCheck();
                break;
            case 'call':
                handleCall();
                break;
            case 'bet':
                const minBet = getActionButtonState(gameState).minBetAmount || 10;
                const maxBet = getActionButtonState(gameState).maxBetAmount || 100;
                const betAmount = Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet;
                handleBet(betAmount);
                break;
            default:
                handleFold();
        }
    }, [gameState, handleFold, handleCheck, handleCall, handleBet]);

    const getLastHumanAction = useCallback(() => {
        // This would need to track the last human action
        // For now, return null to trigger random bot behavior
        return null;
    }, []);

    // Effect to detect when it's bot's turn
    useEffect(() => {
        if (vsBot && gameState.currentPlayerIndex === botPlayerIndex && !botProcessing) {
            const timer = setTimeout(() => {
                processBotAction();
            }, 500); // Small delay before bot acts
            
            return () => clearTimeout(timer);
        }
    }, [vsBot, gameState.currentPlayerIndex, botPlayerIndex, botProcessing, processBotAction]);

    // Reset Slumbot session when starting new hand
    useEffect(() => {
        if (vsBot && gameState.currentBettingRound === GamePhase.PREFLOP && gameState.handHistory.length === 0) {
            SlumbotAPI.resetSession();
            setSlumbotSessionActive(false);
        }
    }, [vsBot, gameState.currentBettingRound, gameState.handHistory.length]);

    // Reset Slumbot session when starting new hand
    useEffect(() => {
        if (vsBot && gameState.currentBettingRound === GamePhase.PREFLOP && gameState.handHistory.length === 0) {
            setSlumbotSessionActive(false);
        }
    }, [vsBot, gameState.currentBettingRound, gameState.handHistory.length]);

    // Fetch player stats when HUD is opened
    useEffect(() => {
        if (visibleHudPlayerId && user?.id) {
            fetchCurrentPlayerStats().then(stats => {
                setCurrentPlayerStats(stats);
            });
        }
    }, [visibleHudPlayerId, user?.id]);

    const handleSetNumPlayers = (newCount) => {
        setNumPlayers(newCount);
        setGameState(prevState => {
            let baseState = JSON.parse(JSON.stringify(initialGameState)); 
            baseState.numPlayers = newCount;
            baseState.players = [];
            baseState.dealerIndex = prevState.dealerIndex;
            
            return startNewHand(baseState); 
        });
    };

    // Remove duplicate action button state logic
    const {
        currentPlayer,
        canCheck,
        canCall,
        callAmount,
        canBet,
        minBetAmount,
        maxBetAmount
    } = getActionButtonState(gameState);

    // Winner highlight logic
    const { highlightedCommunityIndices, winnerPlayerIds, isShowdownOrHandOver } = getWinnerHighlight(gameState);

    const getPlayerId = (index) => `player${index + 1}`;

    // Add useEffect to handle delayed pot award
    useEffect(() => {
        if (gameState.pendingPotAward) {
            const timer = setTimeout(() => {
                setGameState(prev => {
                    // Actually award the pot now and clear flags, but set pendingHandOver for next delay
                    const awarded = awardPot({ ...prev, justAwardedPot: false, pendingPotAward: false });
                    // Only set pendingHandOver if we just finished SHOWDOWN
                    if (awarded.currentBettingRound === 'HAND_OVER') {
                        return { ...awarded, pendingHandOver: true };
                    }
                    return awarded;
                });
            }, 1200); // 1.2 seconds for the animation
            return () => clearTimeout(timer);
        }
    }, [gameState.pendingPotAward]);

    // Add useEffect to handle delayed transition to HAND_OVER after pot award
    useEffect(() => {
        if (gameState.pendingHandOver) {
            const timer = setTimeout(() => {
                setGameState(prev => {
                    // Only transition if still pendingHandOver and not already HAND_OVER
                    if (prev.pendingHandOver && prev.currentBettingRound === 'HAND_OVER') {
                        return { ...prev, pendingHandOver: false };
                    }
                    return prev;
                });
            }, 1200); // 1.2 seconds for post-showdown animation
            return () => clearTimeout(timer);
        }
    }, [gameState.pendingHandOver]);

    // Add useEffect to handle winner animation after pot is awarded
    useEffect(() => {
        let timer;
        if (gameState.currentBettingRound === 'HAND_OVER' && gameState.calculatedPots.length > 0) {
            setShowWinnerAnimation(false); // Force toggle off first
            timer = setTimeout(() => {
                setShowWinnerAnimation(true);
                const innerTimer = setTimeout(() => setShowWinnerAnimation(false), 1200);
                return () => clearTimeout(innerTimer);
            }, 10); // Short delay to ensure React re-applies the class
        } else {
            setShowWinnerAnimation(false);
        }
        return () => clearTimeout(timer);
    }, [gameState.currentBettingRound, gameState.calculatedPots.length]);

    return (
        <div className="poker-wrapper w-full h-full" style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            {/* Add practice mode UI elements if needed */}
            {isPracticeMode && (
                <div className="absolute top-0 left-0 z-50 bg-blue-500 text-white px-4 py-2">
                    Practice Mode
                </div>
            )}
             <div
                ref={tableRef}
                className="poker-table relative overflow-hidden"
                style={getTableStyle(tableTheme)}
            >
                {/* Game Info - Top Left */}
                <div className="absolute top-4 left-4 z-20 text-left max-w-xs">
                    <h2 className={`text-sm font-bold ${tableTheme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{`Round: ${gameState.currentBettingRound}`}</h2>
                    <p className={`text-xs ${tableTheme === 'light' ? 'text-gray-800' : 'text-yellow-300'} h-auto`}>{gameState.message || ' '}</p>
                </div>

                {/* Test Mode / Player Count Controls - Top Right */}
                <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-1">
                    {/* Test Mode Buttons - Only show if not in practice mode and not in bot mode */}
                    {!isPracticeMode && !vsBot && (
                        <>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsTestMode(prev => !prev)}
                                    className={`px-3 py-1 text-xs rounded ${isTestMode ? 'bg-red-600' : 'bg-gray-600'} hover:bg-gray-500 text-white`}
                                >
                                    Test Mode: {isTestMode ? 'ON' : 'OFF'}
                                </button>
                                {isTestMode && (
                                    <button
                                        onClick={() => setShowAllCards(prev => !prev)}
                                        className={`px-3 py-1 text-xs rounded ${showAllCards ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-gray-500 text-white`}
                                    >
                                        Show Cards: {showAllCards ? 'ON' : 'OFF'}
                                    </button>
                                )}
                            </div>
                            {/* Player Count Selection */}
                            <div className="flex space-x-1 items-center">
                                <span className={`text-xs ${tableTheme === 'light' ? 'text-gray-800' : 'text-gray-400'} mr-1`}>Players:</span>
                                {[2, 6, 9].map(count => (
                                    <button
                                        key={count}
                                        onClick={() => handleSetNumPlayers(count)}
                                        className={`px-2 py-0.5 text-xs rounded ${numPlayers === count ? 'bg-green-700' : 'bg-gray-600'} hover:bg-gray-500 text-white`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Central Area for Community Cards & Pot */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    {/* Use the same cardWidth as PlayerHand for community cards */}
                    <CommunityCards 
                      cards={gameState.communityCards} 
                      cardWidth={tableDimensions.width ? Math.min(tableDimensions.width * 0.07, 126) : 63}
                      highlightedIndices={highlightedCommunityIndices}
                    />
                    {/* Display Main Pot OR Calculated Pots at Showdown/End */}
                    {gameState.calculatedPots.length === 0 ? (
                        <PotDisplay amount={gameState.pot} label="Pot" />
                    ) : (
                        <div className="flex flex-col items-center space-y-1">
                            {gameState.calculatedPots.map((pot, index) => (
                                <PotDisplay
                                    key={index}
                                    amount={pot.amount}
                                    label={gameState.calculatedPots.length > 1 && index > 0 ? `Side Pot ${index}` : 'Main Pot'}
                                    subtext={pot.winnerHandDescr}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Players Area - Render Player Info and Hand separately */}
                <div className="players-area absolute inset-0 w-full h-full z-0">
                    {gameState.players.map((player, index) => {
                        const { infoStyle, cardStyle, betStyle, cardWidth: currentPlayerCardWidth } = getPlayerPosition(index, gameState.players.length, tableDimensions.width, tableDimensions.height);
                        const infoClasses = getPlayerInfoClasses(player, tableTheme, isShowdownOrHandOver && showWinnerAnimation, winnerPlayerIds);
                        return (
                            <React.Fragment key={player.id}>
                                {/* Player Hand (Cards) - Positioned Separately */}
                                <div style={cardStyle} className={`${player.isFolded && gameState.currentBettingRound !== GamePhase.HAND_OVER ? 'opacity-30 grayscale' : ''}`}>
                                    <PlayerHand 
                                        cards={player.cards} 
                                        showAll={
                                            player.id === getHumanPlayerId() || 
                                            (isTestMode && showAllCards) ||
                                            (isShowdownOrHandOver && !player.isFolded && gameState.players.filter(p => !p.isFolded).length > 1)
                                        }
                                        isWinner={winnerPlayerIds.includes(player.id) && showWinnerAnimation}
                                    />
                                </div>
                                {/* Player Info Box - Positioned Separately */}
                                <div style={infoStyle} className={`${infoClasses} cursor-pointer`} onClick={() => handleHudToggle(player.id)}>
                                    {/* PlayerHUD Component */}
                                    <PlayerHUD 
                                        stats={visibleHudPlayerId === player.id ? currentPlayerStats : null}
                                        isVisible={visibleHudPlayerId === player.id}
                                        onClose={() => handleHudToggle(player.id)}
                                    />
                                    {/* Status Overlay (Folded / All-In) - Inside info container */}
                                    {(player.isFolded && gameState.currentBettingRound !== GamePhase.HAND_OVER || player.isAllIn) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 rounded">
                                            <span className={`font-bold text-lg ${player.isAllIn ? 'text-red-500' : 'text-gray-400'}`}>
                                                {player.isAllIn ? 'ALL-IN' : 'FOLDED'}
                                            </span>
                                        </div>
                                    )}
                                    {/* Dealer Chip - Position relative to info container */}
                                    {player.isDealer && (() => {
                                        const dealerChipSize = currentPlayerCardWidth * 0.4;
                                        const dealerChipOffset = dealerChipSize * 0.4;
                                        return (
                                            <img
                                                src={dealerChip}
                                                alt="Dealer Button"
                                                style={{
                                                    position: 'absolute',
                                                    width: `${dealerChipSize}px`,
                                                    height: `${dealerChipSize}px`,
                                                    top: `-${dealerChipOffset}px`,
                                                    right: `-${dealerChipOffset}px`,
                                                    zIndex: 30,
                                                }}
                                            />
                                        );
                                    })()}
                                    <PlayerInfo
                                        position={player.positionName}
                                        stack={player.stack}
                                        isTurn={player.isTurn}
                                        handDescription={
                                            (player.id === getHumanPlayerId() || isTestMode || isPracticeMode || (isShowdownOrHandOver && !player.isFolded && gameState.players.filter(p => !p.isFolded).length > 1))
                                                ? (() => {
                                                    if (gameState.currentBettingRound === GamePhase.PREFLOP) return null;
                                                    if (player.cards.length < 2) return 'No Hand Yet';
                                                    const hand = evaluateHand(player.cards, gameState.communityCards);
                                                    if (!hand || hand.rank === -1 || gameState.communityCards.length < 3) {
                                                        return 'No Hand Yet';
                                                    }
                                                    if (hand && hand.name && hand.descr) {
                                                        return `${hand.name.toUpperCase()}${hand.descr ? ' (' + hand.descr + ')' : ''}`;
                                                    }
                                                    return null;
                                                })()
                                                : null
                                        }
                                    />
                                </div>
                                {/* Player Bet Amount - Positioned Separately */}
                                {player.currentBet > 0 && !player.isFolded && (
                                    <div style={betStyle} className="player-bet-amount">
                                        <span className="bg-gray-800 text-yellow-300 text-base font-bold rounded-full px-3 py-1.5 shadow-md border border-yellow-400">
                                            {player.currentBet}
                                        </span>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Action Buttons Container - Bottom Right */}
                <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end space-y-2">
                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="bg-[#2f3542] text-white p-2 rounded-lg hover:bg-[#3a4052] transition-colors duration-200 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        <span>Settings</span>
                    </button>

                    {currentPlayer && (isTestMode || currentPlayer.id === getHumanPlayerId()) && gameState.currentBettingRound !== GamePhase.HAND_OVER && (
                        <ActionButtons
                            onCheck={handleCheck} 
                            onCall={handleCall} 
                            onBet={handleBet} 
                            onFold={handleFold} 
                            canCheck={canCheck}
                            canCall={canCall}
                            callAmount={callAmount}
                            canBet={canBet}
                            minBetAmount={minBetAmount} 
                            maxBetAmount={maxBetAmount} 
                            potSize={gameState.pot}
                            isPreflop={gameState.currentBettingRound === 'PREFLOP'}
                            currentHighestBet={gameState.currentHighestBet}
                            preflopOptions={
                                gameState.currentBettingRound === 'PREFLOP' ? [
                                    { label: '2x', amount: gameState.currentHighestBet * 2 },
                                    { label: '2.5x', amount: Math.round(gameState.currentHighestBet * 2.5) },
                                    { label: '3x', amount: gameState.currentHighestBet * 3 },
                                    { label: 'Pot', amount: gameState.pot + gameState.currentHighestBet * 3 },
                                    { label: 'All In', amount: maxBetAmount },
                                ] : undefined
                            }
                        />
                    )}

                    {/* Waiting Message - Below Buttons in Bottom Right */}
                    {currentPlayer && currentPlayer.id !== getHumanPlayerId() && !isTestMode && gameState.currentBettingRound !== GamePhase.HAND_OVER && (
                        <p className={`text-right text-xs mt-1 ${tableTheme === 'light' ? 'text-gray-800' : 'text-gray-400'}`}>
                            Waiting for {currentPlayer.name}'s action...
                        </p>
                    )}

                    {/* Start Next Hand Button - Below Buttons in Bottom Right */}
                    {gameState.currentBettingRound === GamePhase.HAND_OVER && (
                        <div>
                            <button
                                onClick={() => setGameState(prevState => startNewHand(JSON.parse(JSON.stringify(prevState))))}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2"
                            >
                                Start Next Hand
                            </button>
                        </div>
                    )}
                </div>

                {/* Settings Modal */}
                {showSettings && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"> {/* Added p-4 for some spacing on small screens */}
                        <div className="bg-[#2f3542] rounded-lg p-6 w-[90vw] max-w-sm"> {/* Responsive width */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Table Settings</h2>
                                <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Theme Options */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-300 mb-3">Table Theme</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setTableTheme('dark')}
                                        className={`w-full p-3 rounded-lg bg-[#1b1f2b] hover:bg-[#2a2f3d] transition-colors flex items-center justify-between ${
                                            tableTheme === 'dark' ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                    >
                                        <span className="text-white">Dark Mode</span>
                                        <div className={`w-6 h-6 rounded-full border-2 ${tableTheme === 'dark' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}></div>
                                    </button>
                                    <button
                                        onClick={() => setTableTheme('light')}
                                        className={`w-full p-3 rounded-lg bg-white text-black hover:bg-gray-100 transition-colors flex items-center justify-between ${
                                            tableTheme === 'light' ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                    >
                                        <span>Light Mode</span>
                                        <div className={`w-6 h-6 rounded-full border-2 ${tableTheme === 'light' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}></div>
                                    </button>
                                    <button
                                        onClick={() => setTableTheme('classic')}
                                        className={`w-full p-3 rounded-lg bg-gradient-to-br from-green-700 to-green-900 hover:from-green-600 hover:to-green-800 transition-colors flex items-center justify-between ${
                                            tableTheme === 'classic' ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                    >
                                        <span className="text-white">Classic (Green Felt)</span>
                                        <div className={`w-6 h-6 rounded-full border-2 ${tableTheme === 'classic' ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PokerGame;
