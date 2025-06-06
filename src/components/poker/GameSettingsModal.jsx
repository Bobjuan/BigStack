import React, { useState, useEffect } from 'react';

const GameSettingsModal = ({ gameSettings, onClose, isHost, onSave }) => {
  const [settings, setSettings] = useState(gameSettings);

  useEffect(() => {
    setSettings(gameSettings);
  }, [gameSettings]);


  if (!settings) return null;

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const settingDisplayMap = {
    autoRebuy: 'Auto Rebuy',
    allowStraddle: 'Allow Straddle',
    allowRunItTwice: 'Run It Twice',
    allowInsurance: 'Insurance',
    allowChat: 'Chat',
    allowEmotes: 'Emotes',
    allowTimeBank: 'Time Bank',
    allowShowOne: 'Show One Card',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative border border-gray-600 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-white">Game Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
           {/* Non-editable settings */}
           <div className="flex justify-between">
                <span>Game Type:</span>
                <span className="font-semibold text-white capitalize">{settings.gameType}</span>
            </div>
            <div className="flex justify-between">
                <span>Starting Stack:</span>
                <span className="font-semibold text-white">{settings.startingStack}</span>
            </div>
            <div className="flex justify-between">
                <span>Blinds:</span>
                <span className="font-semibold text-white">{settings.blinds?.small} / {settings.blinds?.big}</span>
            </div>
            <div className="flex justify-between">
                <span>Max Players:</span>
                <span className="font-semibold text-white">{settings.maxPlayers}</span>
            </div>

          <div className="pt-4 mt-4 border-t border-gray-700">
             <h4 className="text-lg font-semibold text-white mb-3">Advanced Options</h4>
             <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(settingDisplayMap).map(([key, displayName]) => (
                    <div key={key} className="flex justify-between items-center">
                        <label htmlFor={key} className="cursor-pointer">{displayName}:</label>
                        {isHost ? (
                           <input 
                              type="checkbox" 
                              id={key}
                              checked={settings[key]} 
                              onChange={(e) => handleSettingChange(key, e.target.checked)} 
                              className="form-checkbox h-5 w-5 text-indigo-500 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500 cursor-pointer"
                           />
                        ) : (
                           <span className={`font-bold ${settings[key] ? 'text-green-400' : 'text-red-400'}`}>
                               {settings[key] ? 'On' : 'Off'}
                           </span>
                        )}
                    </div>
                ))}
             </div>
          </div>
          
           <div className="pt-4 mt-4 border-t border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-3">Timer</h4>
                <div className="flex justify-between items-center">
                    <label htmlFor="timeBank" className="cursor-pointer">Action Time (seconds):</label>
                     {isHost ? (
                        <input 
                            type="number"
                            id="timeBank"
                            value={settings.timeBank}
                            onChange={(e) => handleSettingChange('timeBank', parseInt(e.target.value, 10))}
                            className="w-24 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="10"
                            max="180"
                        />
                     ) : (
                        <span className="font-semibold text-white">{settings.timeBank}s</span>
                     )}
                </div>
           </div>

           {isHost && (
                <div className="flex justify-end pt-6">
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                    >
                        Save & Close
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default GameSettingsModal; 