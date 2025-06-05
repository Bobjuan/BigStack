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

// Player Component to reduce repetition
const PlayerDisplay = ({ player, positionStyles, showPlayerCards, isTurn, cardWidth, displayPosition }) => {
    const { infoStyle, cardStyle, betStyle } = positionStyles;
    
    const infoClasses = [
        'player-info-container relative p-1 border rounded transition-all duration-300',
        isTurn ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' : 'border-gray-700 bg-gray-900 bg-opacity-80',
        'text-white' // Assuming dark theme for now
    ].filter(Boolean).join(' ');

    return (
        <React.Fragment>
            {/* Player Hand (Cards) */}
            <div style={cardStyle} className={`${player.isFolded ? 'opacity-30 grayscale' : ''}`}>
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
                    const dealerChipSize = cardWidth * 0.4;
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
                    position={displayPosition}
                    stack={player.stack}
                    isTurn={isTurn}
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
};

const SitButton = ({ positionStyle, onTakeSeat, seatIndex }) => (
    <div style={positionStyle}>
        <button
            onClick={() => onTakeSeat(seatIndex)}
            className="w-full h-full bg-black bg-opacity-50 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-green-800 hover:text-white hover:border-green-500 transition-all duration-200"
        >
            SIT HERE
        </button>
    </div>
);

function OnlinePokerTableDisplay({ gameState, currentSocketId, GamePhase, onTakeSeat }) {
    const tableRef = useRef(null);
    const [tableDimensions, setTableDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // We get the parent of the poker-table-display, which is now the flex-centered container
        const tableElement = tableRef.current?.parentElement; 
        if (!tableElement) return;
        
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                // We care about the vmin-based table dimensions, not the container
                // Let's get the computed style of the direct child (the table itself)
                const tableDiv = tableRef.current;
                if(tableDiv){
                    const rect = tableDiv.getBoundingClientRect();
                    if(rect.width > 0 && rect.height > 0) {
                         setTableDimensions({ width: rect.width, height: rect.height });
                    }
                }
            }
        });

        observer.observe(tableElement);
        // Set initial dimensions correctly after mount
        const tableDiv = tableRef.current;
        if(tableDiv){
            const rect = tableDiv.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                setTableDimensions({ width: rect.width, height: rect.height });
            }
        }

        return () => {
            if (tableElement) {
                observer.unobserve(tableElement);
            }
        };
    }, []);

    const getSeatPosition = (seatIndex, totalSeats, currentTableWidth, currentTableHeight, currentUserSeatIndex) => {
        if (currentTableWidth === 0 || currentTableHeight === 0) {
            const defaultStyle = { position: 'absolute', opacity: 0 };
            return { infoStyle: defaultStyle, cardStyle: defaultStyle, betStyle: defaultStyle, sitButtonStyle: defaultStyle, cardWidth: 0 };
        }

        // Determine the rotation of the entire table.
        // We want the current user's seat to be at the bottom-middle of the screen.
        // First, we rotate the entire layout by 180 degrees (PI radians) to make the single seat appear at the bottom.
        // Then, we calculate the rotation needed to move the current user into that bottom-center slot (visual index 0).
        const bottomVisualSlot = 0; // The bottom-center seat is now the 0th visual index.
        
        const rotation = (currentUserSeatIndex !== -1)
            ? (bottomVisualSlot - currentUserSeatIndex)
            : 0;
            
        const visualIndex = (seatIndex + rotation + totalSeats) % totalSeats;
        
        // Calculate the angle for the seat based on its final visual position.
        // We add Math.PI / 2 (90 degrees) to start the layout from the bottom-center.
        const angle = (visualIndex / totalSeats) * 2 * Math.PI + (Math.PI / 2);

        const tableWidth = currentTableWidth;
        const tableHeight = currentTableHeight;
        const horizontalRadius = tableWidth * 0.45;
        const verticalRadius = tableHeight * 0.38;
        
        const cardWidth = Math.min(tableWidth * 0.09, 140); 
        const cardHeight = cardWidth * 0.72; 
        const infoWidth = cardWidth * 1.3; 
        const infoHeight = cardHeight * 0.8; 
        
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;
        // Use cosine for X and sine for Y to map circular coordinates.
        // Negative sine is used because Y is inverted in screen coordinates (0 is top).
        let baseX = centerX + horizontalRadius * Math.cos(angle);
        let baseY = centerY + verticalRadius * Math.sin(angle);

        let infoX = baseX - infoWidth / 2;
        let infoY = baseY - infoHeight / 2;
        const infoStyle = {
            position: 'absolute',
            left: `${infoX}px`,
            top: `${infoY}px`,
            width: `${infoWidth}px`,
            zIndex: 10,
        };

        const sitButtonStyle = {
            position: 'absolute',
            left: `${infoX}px`,
            top: `${infoY}px`,
            width: `${infoWidth}px`,
            height: `${infoHeight}px`,
            zIndex: 10,
        };

        let cardX = baseX - cardWidth / 2;
        let cardY = infoY - cardHeight * 0.8;
        const cardStyle = {
            position: 'absolute',
            left: `${cardX}px`,
            top: `${cardY}px`,
            width: `${cardWidth}px`,
            zIndex: 5,
        };
        
        const betPositionFactor = 0.75;
        let betX = centerX + (horizontalRadius * betPositionFactor) * Math.cos(angle);
        let betY = centerY + (verticalRadius * betPositionFactor) * Math.sin(angle);

        const betStyle = {
            position: 'absolute',
            left: `${betX}px`,
            top: `${betY}px`,
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 15,
        };
        return { infoStyle, cardStyle, betStyle, cardWidth, sitButtonStyle };
    };
    
    if (!gameState || !gameState.seats) {
        return <div className="text-center text-gray-400">Waiting for game state...</div>;
    }
    
    const getSeatedPlayers = (game) => game.seats.filter(s => s && !s.isEmpty).map(s => s.player);
    const seatedPlayers = getSeatedPlayers(gameState);
    
    const currentUserSeat = gameState.seats.find(s => !s.isEmpty && s.player.id === currentSocketId);
    const currentUserSeatIndex = currentUserSeat ? currentUserSeat.seatIndex : -1;
    
    const isCurrentUserSpectator = gameState.spectators.some(p => p.id === currentSocketId);

    const getPlayerDisplayPosition = (player) => {
        if (player.positionName) return player.positionName;
        
        let positionsArray = POSITIONS_9MAX;
        if (seatedPlayers.length <= 2) positionsArray = POSITIONS_HEADSUP;
        else if (seatedPlayers.length <= 6) positionsArray = POSITIONS_6MAX;
        
        const dealerIndex = gameState.dealerIndex !== -1 ? gameState.dealerIndex : 0;
        const originalIndex = seatedPlayers.findIndex(p => p.id === player.id);
        const positionIndex = (originalIndex - dealerIndex + seatedPlayers.length) % seatedPlayers.length;
        
        return positionsArray[positionIndex] || `P${originalIndex + 1}`;
    };

    const consistentCardWidth = Math.min(tableDimensions.width * 0.09, 140);
    const currentPlayerTurnId = gameState.currentPlayerIndex !== -1 && seatedPlayers[gameState.currentPlayerIndex] 
                                  ? seatedPlayers[gameState.currentPlayerIndex].id 
                                  : null;

    return (
        <div
            ref={tableRef}
            className="poker-table-display w-full h-full relative" // Use this for styling the table visual
        >
            {/* Community Cards & Pot Area - Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <CommunityCards cards={gameState.communityCards || []} cardWidth={consistentCardWidth * 0.8} />
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
                {gameState.seats.map((seat) => {
                    const positionStyles = getSeatPosition(
                        seat.seatIndex,
                        gameState.seats.length,
                        tableDimensions.width,
                        tableDimensions.height,
                        currentUserSeatIndex
                    );

                    if (seat.isEmpty) {
                        return isCurrentUserSpectator && (
                            <SitButton
                                key={`sit-btn-${seat.seatIndex}`}
                                positionStyle={positionStyles.sitButtonStyle}
                                onTakeSeat={onTakeSeat}
                                seatIndex={seat.seatIndex}
                            />
                        );
                    }

                    const player = seat.player;
                    const isCurrentUser = player.id === currentSocketId;
                    let showPlayerCards = isCurrentUser;
                    if (!isCurrentUser && (gameState.currentBettingRound === GamePhase.SHOWDOWN || gameState.currentBettingRound === GamePhase.HAND_OVER)) {
                        if ((gameState.showdownPlayers?.includes(player.id) || gameState.winners?.some(w => w.id === player.id)) && !player.isFolded) {
                            showPlayerCards = true;
                        }
                    }
                    
                    return (
                       <PlayerDisplay 
                           key={player.id}
                           player={player}
                           positionStyles={positionStyles}
                           showPlayerCards={showPlayerCards}
                           isTurn={player.id === currentPlayerTurnId}
                           cardWidth={positionStyles.cardWidth}
                           displayPosition={getPlayerDisplayPosition(player)}
                       />
                    );
                })}
            </div>
        </div>
    );
}

export default OnlinePokerTableDisplay; 