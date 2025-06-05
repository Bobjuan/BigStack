import React, { useState, useEffect, useRef } from 'react';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import PlayerInfo from './PlayerInfo';
import PotDisplay from './PotDisplay';
import dealerChip from '/src/assets/dealer.png'; // Assuming path is correct

// These might come from a shared constants file later
const SUITS = ['h', 'd', 'c', 's'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

// Constants for positioning - can be adjusted
const POSITIONS_9MAX = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const POSITIONS_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
const POSITIONS_HEADSUP = ['BTN/SB', 'BB'];


function OnlinePokerTableDisplay({ gameState, currentSocketId, tableTheme = 'dark', GamePhase }) {
    const tableRef = useRef(null);
    const [tableDimensions, setTableDimensions] = useState({ width: 0, height: 0 });

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
        if (rect.width > 0 && rect.height > 0) {
             setTableDimensions({ width: rect.width, height: rect.height });
        }

        return () => {
            if (tableElement) {
                observer.unobserve(tableElement);
            }
        };
    }, []);

    // Adapted getPlayerPosition from PokerGame.jsx
    const getPlayerPosition = (index, totalPlayers, currentTableWidth, currentTableHeight) => {
        if (currentTableWidth === 0 || currentTableHeight === 0) {
            const defaultStyle = { position: 'absolute', left: '0%', top: '0%', width: '0px', height: '0px', opacity: 0, zIndex: 0 };
            return { infoStyle: defaultStyle, cardStyle: defaultStyle, betStyle: defaultStyle, cardWidth: 0 };
        }

        const angle = (index / totalPlayers) * 2 * Math.PI;
        const tableWidth = currentTableWidth;
        const tableHeight = currentTableHeight;
        const horizontalRadius = tableWidth * 0.46;
        const verticalRadius = tableHeight * 0.38;
        
        const cardWidth = Math.min(tableWidth * 0.10, 180); 
        const cardHeight = cardWidth * 0.72; 
        const infoWidth = cardWidth * 1.4; 
        const infoHeight = cardHeight * 0.8; 
        
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;
        let baseX = centerX + horizontalRadius * Math.cos(angle - Math.PI / 2);
        let baseY = centerY + verticalRadius * Math.sin(angle - Math.PI / 2);
        baseY += tableHeight * 0.05; // Shift slightly downward

        let infoX = baseX - infoWidth / 2;
        let infoY = baseY - infoHeight / 2;
        const infoStyle = {
            position: 'absolute',
            left: `${(infoX / tableWidth) * 100}%`,
            top: `${(infoY / tableHeight) * 100}%`,
            width: `${infoWidth}px`,
            zIndex: 10,
        };

        let cardX = baseX - cardWidth / 2;
        let cardY = infoY - cardHeight * 0.8;
        const cardStyle = {
            position: 'absolute',
            left: `${(cardX / tableWidth) * 100}%`,
            top: `${(cardY / tableHeight) * 100}%`,
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            zIndex: 5,
        };
        
        const betPositionFactor = 0.8;
        let betX = centerX + betPositionFactor * (baseX - centerX);
        let betY = centerY + betPositionFactor * (baseY - centerY);

        const cardBottomY = cardY + cardHeight;
        if (Math.abs(angle - Math.PI) < 0.2 && betY < cardBottomY) { // Simplified overlap check
             betY = cardBottomY -100; // Adjusted from PokerGame
        }

        const betStyle = {
            position: 'absolute',
            left: `${(betX / tableWidth) * 100}%`,
            top: `${(betY / tableHeight) * 100}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 15,
        };
        return { infoStyle, cardStyle, betStyle, cardWidth };
    };

    // --- End Player Positioning ---

    if (!gameState || !gameState.players) {
        return <div className="text-center text-gray-400">Waiting for game state...</div>;
    }

    // Determine table background image (can be passed or defaulted)
    // For now, simplified, assuming you might manage theme background outside or pass it.
    // const tableBg = '/src/assets/blacktable.png'; // Direct path for now
    // We'll rely on the parent for the wrapper's background style for now.

    const tableStyle = {
        width: '100%', // Fit container
        aspectRatio: '16/9',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'visible', // Important for elements positioned outside bounds
        // backgroundImage: `url(${tableBg})`, // This will be handled by parent for now
    };
    
    // Logic to get assigned player positions if available from server, or calculate fallback
    // For now, server only assigns D, SB, BB. We might need full position names.
    // This is a placeholder - proper position assignment will come from server or more robust client logic.
    const getPlayerDisplayPosition = (player, index, totalPlayers) => {
        if (player.positionName) return player.positionName;
        
        // Fallback if server doesn't send full position names yet
        let positionsArray = POSITIONS_9MAX;
        if (totalPlayers <= 2) positionsArray = POSITIONS_HEADSUP;
        else if (totalPlayers <= 6) positionsArray = POSITIONS_6MAX;
        
        // This simple fallback assumes players array is ordered by seat, 
        // and dealerIndex from gameState is reliable for offsetting.
        // A more robust solution would fully replicate server's assignPositions if needed.
        const dealerIndex = gameState.dealerIndex !== -1 ? gameState.dealerIndex : 0;
        const positionIndex = (index - dealerIndex + totalPlayers) % totalPlayers;
        return positionsArray[positionIndex] || `P${index + 1}`;
    };


    return (
        <div
            ref={tableRef}
            className="poker-table-display relative" // Use this for styling the table visual
            style={tableStyle}
        >
            {/* Community Cards & Pot Area - Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <CommunityCards cards={gameState.communityCards || []} />
                <PotDisplay amount={gameState.pot || 0} label="Pot" />
                
                {/* Display Hand Outcome / Winner Info */}
                {gameState.currentBettingRound === GamePhase.HAND_OVER && (
                    <div className="mt-2 p-2 bg-black bg-opacity-75 rounded shadow-lg max-w-md text-center">
                        {gameState.handOverMessage ? (
                            <p className="text-yellow-300 font-bold">
                                {gameState.handOverMessage}
                            </p>
                        ) : (
                            gameState.winners && gameState.winners.length > 0 && (
                                <p className="text-yellow-300 font-bold">
                                    Winner(s): {gameState.winners.map(w => 
                                        `${w.name}${w.handDescription !== 'Opponents folded' && w.handDescription !== 'Only remaining player' ? ` with ${w.handDescription}` : ''}`
                                    ).join(', ')}
                                </p>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Players Area */}
            <div className="players-area absolute inset-0 w-full h-full z-0">
                {gameState.players.map((player, index) => {
                    const { infoStyle, cardStyle, betStyle, cardWidth: currentPlayerCardWidth } = getPlayerPosition(
                        index, 
                        gameState.players.length, 
                        tableDimensions.width, 
                        tableDimensions.height
                    );

                    const isCurrentUser = player.id === currentSocketId;
                    
                    let showPlayerCards = isCurrentUser; // Default: show current user's cards

                    if (gameState.currentBettingRound === GamePhase.HAND_OVER) {
                        // At hand over, show cards for winners or any player who was part of showdown
                        const wasInShowdown = gameState.showdownPlayers && gameState.showdownPlayers.includes(player.id);
                        const isWinner = gameState.winners && gameState.winners.some(w => w.id === player.id);
                        if ((isWinner || wasInShowdown) && player.cards && player.cards.length > 0 && !player.isFolded) {
                            showPlayerCards = true;
                        }
                    } else if (gameState.currentBettingRound === GamePhase.SHOWDOWN) {
                        // At showdown, show cards for all non-folded players who were involved
                        const wasInShowdown = gameState.showdownPlayers && gameState.showdownPlayers.includes(player.id);
                        if (wasInShowdown && !player.isFolded && player.cards && player.cards.length > 0) {
                            showPlayerCards = true;
                        }
                    }
                    // If not current user, and not showdown/handover revealing stage, cards are hidden (showPlayerCards remains false or its default)
                    // Exception: if somehow a player is marked as a winner (e.g. last one not folded) and we want to show their cards before official HAND_OVER state.
                    // The current logic should be okay as server sends cards in `gameState.winners`.

                    const infoClasses = [
                        'player-info-container relative p-1 border rounded transition-all duration-300',
                        player.id === gameState.players[gameState.currentPlayerIndex]?.id ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' : 'border-gray-700 bg-gray-900 bg-opacity-80',
                        tableTheme === 'light' ? 'text-black bg-white bg-opacity-90' : 'text-white' // Example theme handling
                    ].filter(Boolean).join(' ');

                    return (
                        <React.Fragment key={player.id}>
                            {/* Player Hand (Cards) */}
                            <div style={cardStyle} className={`${player.isFolded && gameState.currentBettingRound !== GamePhase.HAND_OVER ? 'opacity-30 grayscale' : ''}`}>
                                <PlayerHand 
                                    cards={player.cards || []} 
                                    showAll={showPlayerCards}
                                />
                            </div>

                            {/* Player Info Box */}
                            <div style={infoStyle} className={infoClasses}>
                                {(player.isFolded || player.isAllIn) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 rounded">
                                        <span className={`font-bold text-lg ${player.isAllIn ? 'text-red-500' : 'text-gray-400'}`}>
                                            {player.isAllIn ? 'ALL-IN' : (player.isFolded ? 'FOLDED' : '')}
                                        </span>
                                    </div>
                                )}
                                
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
                                    // Use server assigned positionName if available, otherwise fallback or simple name
                                    position={player.positionName || getPlayerDisplayPosition(player, index, gameState.players.length)}
                                    stack={player.stack}
                                    // isTurn is determined by comparing player.id with gameState.players[gameState.currentPlayerIndex]?.id
                                    isTurn={player.id === gameState.players[gameState.currentPlayerIndex]?.id}
                                />
                            </div>
                            
                            {/* Player Bet Amount */}
                            {(player.currentBet || 0) > 0 && !player.isFolded && (
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
        </div>
    );
}

export default OnlinePokerTableDisplay; 