import React, { useState, useCallback, useEffect } from 'react';
import { Hand } from 'pokersolver';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import PlayerInfo from './PlayerInfo';
import PotDisplay from './PotDisplay';
import ActionButtons from './ActionButtons';
import tableBg from '/src/assets/table.png'; // Import the table background
import dealerChip from '/src/assets/dealer.png'; // Import dealer chip asset

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
    while (players[nextIndex].isFolded || (players[nextIndex].isAllIn && players[nextIndex].currentBet === 0)) {
        nextIndex = (nextIndex + 1) % players.length;
        loopGuard++;
        if (loopGuard > players.length * 2) return -1;
    }
    return nextIndex;
};

const findFirstActivePlayerIndex = (startIndex, players) => {
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

const POSITIONS_9MAX = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const POSITIONS_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
const POSITIONS_HEADSUP = ['BTN/SB', 'BB'];

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

function PokerGame() {
    const [numPlayers, setNumPlayers] = useState(initialGameState.numPlayers);
    const [gameState, setGameState] = useState(() => {
        let state = JSON.parse(JSON.stringify(initialGameState));
        state.numPlayers = numPlayers;
        return startNewHand(state);
    });
    const [isTestMode, setIsTestMode] = useState(false);
    const [showAllCards, setShowAllCards] = useState(false);

    function startNewHand(currentState) {
        if (currentState.players.length !== currentState.numPlayers) {
            currentState.players = [];
            for(let i = 1; i <= currentState.numPlayers; i++) {
                currentState.players.push(initializePlayer(`player${i}`, `Player ${i}`, 1000)); 
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
                 return awardPot(state);
             } else {
                 if (state.pot > 0) {
                    state = awardPot(state);
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

    // ----- Action Handlers -----
    const handleAction = useCallback((actionFn) => {
        setGameState(prevState => {
            if (prevState.currentBettingRound === GamePhase.HAND_OVER) return prevState;
            
            let stateAfterAction = actionFn(JSON.parse(JSON.stringify(prevState)));

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
    }, []);

    const handleCheck = useCallback(() => {
        handleAction(prevState => {
            const playerIndex = prevState.currentPlayerIndex;
            const player = prevState.players[playerIndex];

            if (player.currentBet < prevState.currentHighestBet) {
                return { ...prevState, message: "Cannot check, must call, raise, or fold." };
            }
            
            const newState = JSON.parse(JSON.stringify(prevState));
            newState.players[playerIndex].hasActedThisRound = true;
            newState.players[playerIndex].isTurn = false;
            return newState;
        });
    }, [handleAction]);

    const handleCall = useCallback(() => {
        handleAction(prevState => {
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
        });
    }, [handleAction]);

    const handleBet = useCallback((amount) => {
        handleAction(prevState => {
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
            
            let closingIdx = (playerIndex - 1 + newState.players.length) % newState.players.length;
            let guard = 0;
            while(newState.players[closingIdx].isFolded || newState.players[closingIdx].isAllIn) {
                closingIdx = (closingIdx - 1 + newState.players.length) % newState.players.length;
                guard++;
                if (guard > newState.players.length * 2) break;
            }
            newState.actionClosingPlayerIndex = closingIdx;

            return newState;
        });
    }, [handleAction]);

    const handleFold = useCallback(() => {
        handleAction(prevState => {
            const playerIndex = prevState.currentPlayerIndex;
            const player = prevState.players[playerIndex];

            const newState = JSON.parse(JSON.stringify(prevState));
            newState.players[playerIndex].isFolded = true;
            newState.players[playerIndex].hasActedThisRound = true;
            newState.players[playerIndex].isTurn = false;
            return newState;
        });
    }, [handleAction]);

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

    // --- Player Positioning Logic ---
    const getPlayerPosition = (index, totalPlayers) => {
        const angle = (index / totalPlayers) * 2 * Math.PI;
        const tableWidth = 1200;
        const tableHeight = 675;
        const horizontalRadius = tableWidth * 0.46;
        const verticalRadius = tableHeight * 0.38;
        const infoWidth = 140;
        const infoHeight = 60;
        const cardWidth = 100;
        const cardHeight = 72;
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;
        let baseX = centerX + horizontalRadius * Math.cos(angle - Math.PI / 2);
        let baseY = centerY + verticalRadius * Math.sin(angle - Math.PI / 2);

        // --- Calculate Info Box Position --- 
        let infoX = baseX - infoWidth / 2;
        let infoY = baseY - infoHeight / 2;
        const infoLeftPercent = (infoX / tableWidth) * 100;
        const infoTopPercent = (infoY / tableHeight) * 100;
        const infoStyle = {
            position: 'absolute',
            left: `${infoLeftPercent}%`,
            top: `${infoTopPercent}%`,
            width: `${infoWidth}px`,
            zIndex: 10,
        };

        // --- Calculate Card Hand Position --- 
        let cardX = baseX - cardWidth / 2;
        let cardY = infoY - cardHeight * 0.8;
        const cardLeftPercent = (cardX / tableWidth) * 100;
        const cardTopPercent = (cardY / tableHeight) * 100;
        const cardStyle = {
            position: 'absolute',
            left: `${cardLeftPercent}%`,
            top: `${cardTopPercent}%`,
            width: `${cardWidth}px`,
            zIndex: 5,
        };
        
        // --- Calculate Bet Amount Position ---
        // Position it closer to the table center than the player info
        const betPositionFactor = 0.75; // How far from center (0=center, 1=player base)
        let betX = centerX + betPositionFactor * (baseX - centerX);
        let betY = centerY + betPositionFactor * (baseY - centerY);

        // --- Overlap Check for Bottom Players ---
        const cardBottomY = cardY + cardHeight;
        const playerAngle = (index / totalPlayers) * 2 * Math.PI; // Calculate player's angle
        const bottomAngle = Math.PI;
        const angleTolerance = 0.2; // Radians (approx 11 degrees tolerance)

        // Apply adjustment only if player is near the bottom AND bet overlaps cards
        if (Math.abs(playerAngle - bottomAngle) < angleTolerance && betY < cardBottomY) {
             betY = cardBottomY + -100; // Position bet 5px below cards
        }
        // --- End Overlap Check ---

        const betLeftPercent = (betX / tableWidth) * 100;
        const betTopPercent = (betY / tableHeight) * 100;
         const betStyle = {
            position: 'absolute',
            left: `${betLeftPercent}%`,
            top: `${betTopPercent}%`,
            transform: 'translateX(-50%) translateY(-50%)', // Center the element precisely
            zIndex: 15, // Above info box, below potential overlays
        };

        return { infoStyle, cardStyle, betStyle };
    };
    // --- End Player Positioning ---

    const currentPlayer = gameState.currentPlayerIndex >= 0 ? gameState.players[gameState.currentPlayerIndex] : null;
    
    const canCheck = currentPlayer?.currentBet === gameState.currentHighestBet;
    const callAmount = gameState.currentHighestBet - (currentPlayer?.currentBet || 0);
    const canCall = callAmount > 0 && (currentPlayer?.stack || 0) > 0 && !currentPlayer?.isAllIn;
    const minNewTotalBet = gameState.currentHighestBet + gameState.minRaiseAmount;
    const minChipsToAdd = Math.max(1, minNewTotalBet - (currentPlayer?.currentBet || 0));
    const maxChipsToAdd = currentPlayer?.stack || 0;
    const canBet = (currentPlayer?.stack || 0) > 0 && !currentPlayer?.isAllIn;

    const minNewTotalBetRender = gameState.currentHighestBet + gameState.minRaiseAmount;
    const minChipsToAddRender = Math.max(1, minNewTotalBetRender - (currentPlayer?.currentBet || 0));
    const maxChipsToAddRender = currentPlayer?.stack || 0;
    const canBetRender = (currentPlayer?.stack || 0) > 0 && !currentPlayer?.isAllIn;

    const getPlayerId = (index) => `player${index + 1}`;

    return (
        <div
            className="poker-table relative bg-gray-900 w-full h-full" // Full-screen table
            style={{
                backgroundImage: `url(${tableBg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            {/* Game Info - Top Left */}
            <div className="absolute top-4 left-4 z-20 text-left max-w-xs">
                 <h2 className="text-sm font-bold text-gray-200">{`Round: ${gameState.currentBettingRound}`}</h2>
                 <p className="text-xs text-yellow-300 h-auto">{gameState.message || ' '}</p>
            </div>

            {/* Test Mode / Player Count Controls - Top Right */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-1">
                 {/* Test Mode Buttons */}
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
                    <span className="text-xs text-gray-400 mr-1">Players:</span>
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
            </div>

            {/* Central Area for Community Cards & Pot */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <CommunityCards cards={gameState.communityCards} />
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
                    const { infoStyle, cardStyle, betStyle } = getPlayerPosition(index, gameState.players.length);

                    // Determine combined classes for styling the info box
                    const infoClasses = [
                        'player-info-container relative p-1 border rounded',
                        'transition-all duration-300',
                        player.isTurn ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' : 'border-gray-700 bg-gray-900 bg-opacity-80',
                        // Removed folded/allin style here, apply overlay instead
                    ].filter(Boolean).join(' ');

                    return (
                        <React.Fragment key={player.id}>
                            {/* Player Hand (Cards) - Positioned Separately */}
                            <div style={cardStyle} className={`${player.isFolded ? 'opacity-30 grayscale' : ''}`}>
                                <PlayerHand 
                                    cards={player.cards} 
                                    showAll={player.id === 'player1' || (isTestMode && showAllCards)} 
                                />
                            </div>

                            {/* Player Info Box - Positioned Separately */}
                            <div style={infoStyle} className={infoClasses}>
                                {/* Status Overlay (Folded / All-In) - Inside info container */}
                                {(player.isFolded || player.isAllIn) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 rounded">
                                        <span className={`font-bold text-lg ${player.isAllIn ? 'text-red-500' : 'text-gray-400'}`}>
                                            {player.isAllIn ? 'ALL-IN' : 'FOLDED'}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Dealer Chip - Position relative to info container */}
                                {player.isDealer && (
                                    <img
                                        src={dealerChip}
                                        alt="Dealer Button"
                                        className="absolute -top-3 -right-3 w-6 h-6 z-30" // Adjusted size/pos
                                    />
                                )}
                                
                                {/* Actual Player Info Component */}
                                <PlayerInfo
                                    name={player.name}
                                    stack={player.stack}
                                    currentBet={player.currentBet}
                                    isTurn={player.isTurn} // Pass turn status for potential internal styling 
                                    // Removed dealer/sb/bb props as they are handled by chip/overlays
                                />
                            </div>
                            
                            {/* Player Bet Amount - Positioned Separately */}
                            {player.currentBet > 0 && !player.isFolded && (
                                <div style={betStyle} className="player-bet-amount">
                                    <span className="bg-gray-700 text-yellow-300 text-xs font-bold rounded-full px-2 py-0.5 shadow-md border border-yellow-600">
                                        {player.currentBet}
                                    </span>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Action Buttons Container - Bottom Right */}
             <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end">
                 {currentPlayer && (isTestMode || currentPlayer.id === 'player1') && gameState.currentBettingRound !== GamePhase.HAND_OVER && (
                     <ActionButtons
                        onCheck={handleCheck} 
                        onCall={handleCall} 
                        onBet={handleBet} 
                        onFold={handleFold} 
                        canCheck={canCheck}
                        canCall={canCall}
                        callAmount={callAmount}
                        canBet={canBetRender}
                        minBetAmount={minChipsToAddRender} 
                        maxBetAmount={maxChipsToAddRender} 
                        potSize={gameState.pot}
                     />
                 )}

                 {/* Waiting Message - Below Buttons in Bottom Right */}
                 {currentPlayer && currentPlayer.id !== 'player1' && !isTestMode && gameState.currentBettingRound !== GamePhase.HAND_OVER && (
                     <p className="text-right text-gray-400 text-xs mt-1">Waiting for {currentPlayer.name}'s action...</p>
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

        </div>
    );
}

export default PokerGame;
