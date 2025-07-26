import React, { useState, useEffect, useRef } from 'react';
import PlayerHand from './PlayerHand';
import CommunityCards from './CommunityCards';
import PlayerInfo from './PlayerInfo';
import PotDisplay from './PotDisplay';
import PlayerTimer from './PlayerTimer';
import PlayerHUD from './PlayerHUD';
import dealerChip from '/src/assets/dealer.png'; // Assuming path is correct

// These might come from a shared constants file later
const SUITS = ['h', 'd', 'c', 's'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

// Constants for positioning - can be adjusted
const POSITIONS_9MAX = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
const POSITIONS_6MAX = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
const POSITIONS_HEADSUP = ['BTN/SB', 'BB'];

// Player Component to reduce repetition
const PlayerDisplay = ({ player, positionStyles, showPlayerCards, isTurn, cardWidth, displayPosition, turnStartTime, timeBank, onHudToggle, isHudVisible, stats }) => {
    const { infoStyle, cardStyle, betStyle } = positionStyles;
    
    const infoClasses = [
        'player-info-container relative p-1 border rounded transition-all duration-300 cursor-pointer',
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
            <div style={infoStyle} className={infoClasses} onClick={onHudToggle}>
                <PlayerHUD 
                    stats={stats}
                    isVisible={isHudVisible}
                    onClose={onHudToggle}
                />
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
                    name={player.name}
                    email={player.email}
                    isTurn={isTurn}
                />

                <PlayerTimer 
                    turnStartTime={isTurn ? turnStartTime : null}
                    timeBank={timeBank}
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

function OnlinePokerTableDisplay({ gameState, currentSocketId, GamePhase, onTakeSeat, playerStats }) {
    const tableRef = useRef(null);
    const [tableDimensions, setTableDimensions] = useState({ width: 0, height: 0 });
    const [visibleHudPlayerId, setVisibleHudPlayerId] = useState(null);

    const handleHudToggle = (playerId) => {
        setVisibleHudPlayerId(prevId => (prevId === playerId ? null : playerId));
    };

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
        // Early exit if table has not been sized yet
        if (currentTableWidth === 0 || currentTableHeight === 0) {
            const defaultStyle = { position: 'absolute', opacity: 0 };
            return { infoStyle: defaultStyle, cardStyle: defaultStyle, betStyle: defaultStyle, sitButtonStyle: defaultStyle, cardWidth: 0 };
        }

        /* ---------------------------------------------------------
           Seat rotation so hero is always bottom-centre
        --------------------------------------------------------- */
        // In the new positioning math (copied from PokerGame) index 0 is the TOP seat and
        // index totalSeats/2 (rounded) is the BOTTOM seat.  We want the current user's seat
        // to end up at the bottom, so we rotate by (bottomSlot ‑ heroSeat).
        const bottomVisualSlot = Math.floor(totalSeats / 2); // e.g. 1 for HU, 3 for 6-max, 4 for 9-max
        const rotation = currentUserSeatIndex !== -1 ? (bottomVisualSlot - currentUserSeatIndex) : 0;
        const visualIndex = (seatIndex + rotation + totalSeats) % totalSeats;

        /* ---------------------------------------------------------
           Positioning math (ported from PokerGame.getPlayerPosition)
        --------------------------------------------------------- */
        const tableWidth = currentTableWidth;
        const tableHeight = currentTableHeight;

        // Radii: pull side seats in a little on 9-max
        const horizontalRadius = totalSeats === 9 ? tableWidth * 0.40 : tableWidth * 0.46;
        const verticalRadius = tableHeight * 0.38;

        // Responsive card sizing – slightly larger than before
        const cardWidth = Math.min(tableWidth * 0.10, 180);
        const cardHeight = cardWidth * 0.72;
        const infoWidth = cardWidth * 1.4;
        const infoHeight = cardHeight * 0.8;

        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;

        // Angle 0 == TOP, clockwise positive
        const angle = (visualIndex / totalSeats) * 2 * Math.PI;

        let baseX = centerX + horizontalRadius * Math.cos(angle - Math.PI / 2);
        let baseY = centerY + verticalRadius * Math.sin(angle - Math.PI / 2);

        // Push everything slightly down so the top player isn't clipped (use smaller offset than before)
        baseY += tableHeight * 0.03;

        /* --------------- Info box ---------------- */
        const infoX = baseX - infoWidth / 2;
        const infoY = baseY - infoHeight / 2 + infoHeight * 0.30; // keep nameplate lower
        const infoStyle = {
            position: 'absolute',
            left: `${infoX}px`,
            top: `${infoY}px`,
            width: `${infoWidth}px`,
            zIndex: 15,
        };

        /* --------------- Sit button (same footprint as info box) --------------- */
        const sitButtonStyle = {
            position: 'absolute',
            left: `${infoX}px`,
            top: `${infoY}px`,
            width: `${infoWidth}px`,
            height: `${infoHeight}px`,
            zIndex: 15,
        };

        /* --------------- Card hand ---------------- */
        const cardX = baseX - cardWidth / 2;
        const cardY = infoY - cardHeight * 1.08;
        const cardStyle = {
            position: 'absolute',
            left: `${cardX}px`,
            top: `${cardY}px`,
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            zIndex: 10,
        };

        /* --------------- Bet amount ---------------- */
        const betPositionFactor = 0.8;
        let betX = centerX + betPositionFactor * (baseX - centerX);
        let betY = centerY + betPositionFactor * (baseY - centerY);

        // Prevent bet chip overlap for the bottom player
        const cardBottomY = cardY + cardHeight;
        const playerAngle = angle; // reuse
        const bottomAngle = Math.PI;
        const angleTolerance = 0.9;
        if (Math.abs(playerAngle - bottomAngle) < angleTolerance && betY < cardBottomY) {
            betY = cardBottomY +  -100; // move chip below cards
        }

        const betStyle = {
            position: 'absolute',
            left: `${betX}px`,
            top: `${betY}px`,
            transform: 'translateX(-50%) translateY(-50%)',
            zIndex: 15,
        };

        // Dynamic fine-tuning offsets similar to PokerGame
        const offsetEm = 1.8;
        if (angle > Math.PI * 1.75 || angle < Math.PI * 0.25) {
            betStyle.top = `calc(${betStyle.top} + ${offsetEm}em)`; // top players – push chip downwards
        } else if (angle > Math.PI * 0.75 && angle < Math.PI * 1.25) {
            betStyle.top = `calc(${betStyle.top} - ${offsetEm}em)`; // bottom players – raise chip
        } else if (angle >= Math.PI * 0.25 && angle <= Math.PI * 0.75) {
            betStyle.left = `calc(${betStyle.left} - ${offsetEm}em)`; // right side – push left
        } else if (angle >= Math.PI * 1.25 && angle <= Math.PI * 1.75) {
            betStyle.left = `calc(${betStyle.left} + ${offsetEm}em)`; // left side – push right
        }

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

    const consistentCardWidth = Math.min(tableDimensions.width * 0.07, 126);
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
                <CommunityCards 
                    cards={gameState.communityCards || []} 
                    cardWidth={consistentCardWidth * 0.8}
                    ritFirstRun={gameState.ritFirstRun}
                    ritSecondRun={gameState.ritSecondRun}
                />
                <PotDisplay 
                    amount={gameState.pot || 0} 
                    totalAmount={gameState.totalPot || gameState.pot || 0}
                    label="Pot"
                    pots={gameState.pots || []}
                />
                
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
                {gameState.seats.map((seat, index) => {
                    const positionStyles = getSeatPosition(index, gameState.seats.length, tableDimensions.width, tableDimensions.height, currentUserSeatIndex);

                    if (seat.isEmpty) {
                        // Only show sit button if the game is waiting for players or the hand is over
                        const canTakeSeat = gameState.currentBettingRound === GamePhase.WAITING || gameState.currentBettingRound === GamePhase.HAND_OVER;
                        return isCurrentUserSpectator && canTakeSeat && (
                            <SitButton
                                key={index}
                                seatIndex={index}
                                positionStyle={positionStyles.sitButtonStyle}
                                onTakeSeat={onTakeSeat}
                            />
                        );
                    }

                    const player = seat.player;
                    const isCurrentUser = player.id === currentSocketId;
                    let showPlayerCards = isCurrentUser;
                    if (!isCurrentUser && (gameState.currentBettingRound === GamePhase.SHOWDOWN || gameState.currentBettingRound === GamePhase.HAND_OVER)) {
                        const winnerInfo = gameState.winners?.find(w => w.id === player.id);
                        const canReveal = winnerInfo && winnerInfo.handDescription !== 'Opponents folded' && winnerInfo.handDescription !== 'Only remaining player';
                        if ((gameState.showdownPlayers?.includes(player.id) || canReveal) && !player.isFolded) {
                            showPlayerCards = true;
                        }
                    }
                    
                    const isTurn = gameState.currentPlayerIndex === seatedPlayers.findIndex(p => p.id === player.id);
                    const displayPosition = getPlayerDisplayPosition(player);
                    const isHudVisible = visibleHudPlayerId === player.userId;
                    const stats = playerStats ? playerStats[player.userId] : null;

                    return (
                        <PlayerDisplay
                            key={player.id}
                            player={player}
                            positionStyles={positionStyles}
                            showPlayerCards={showPlayerCards}
                            isTurn={isTurn}
                            cardWidth={positionStyles.cardWidth}
                            displayPosition={displayPosition}
                            turnStartTime={gameState.turnStartTime}
                            timeBank={gameState.timeBank}
                            onHudToggle={() => handleHudToggle(player.userId)}
                            isHudVisible={isHudVisible}
                            stats={stats}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default OnlinePokerTableDisplay; 