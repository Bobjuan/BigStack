import React from 'react';

const calculateStat = (actions, opportunities) => {
    if (!opportunities || opportunities === 0) {
        return '–'; // Return a dash if no opportunities
    }
    return `${Math.round((actions / opportunities) * 100)}%`;
};

const PlayerHUD = ({ stats, isVisible, onClose }) => {
    if (!isVisible) {
        return null;
    }

    const vpip = stats ? calculateStat(stats.vpip_actions, stats.vpip_opportunities) : 'N/A';
    const pfr = stats ? calculateStat(stats.pfr_actions, stats.pfr_opportunities) : 'N/A';

    return (
        <div 
            className="absolute z-50 bg-gray-900 bg-opacity-95 border border-yellow-400 rounded-lg p-3 text-white shadow-lg text-sm"
            style={{
                bottom: '105%', // Position it right above the player info box
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px', // Fixed width for consistency
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the HUD from closing it
        >
            <button onClick={onClose} className="absolute top-0 right-0 text-gray-400 hover:text-white pr-1 pt-0.5">&times;</button>
            <div className="grid grid-cols-2 gap-x-2 text-center">
                <div className="font-bold text-yellow-500">VPIP</div>
                <div className="font-semibold">{vpip}</div>
                
                <div className="font-bold text-yellow-500">PFR</div>
                <div className="font-semibold">{pfr}</div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
                Hands: {stats?.hands_played || 0}
            </div>
        </div>
    );
};

export default PlayerHUD; 