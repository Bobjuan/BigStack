import React from 'react';
import PokerGameAdapterExample from '../../components/poker/PokerGameAdapterExample';

/**
 * Updated Bot9MaxPage using the new PokerGameAdapter
 * 
 * This demonstrates the migration path from the old PokerGame.jsx
 * to the new adapter-based system that supports both local and backend modes.
 * 
 * Migration steps:
 * 1. Replace PokerGame import with PokerGameAdapterExample (or create custom component)
 * 2. Remove botPlayerIndex prop (adapter handles bot management)
 * 3. Add any specific 9-max game settings
 * 4. Test both local and backend modes
 * 5. When confident, rename this file to Bot9MaxPage.jsx
 */
const Bot9MaxPageAdapter = () => {
  return (
    <PokerGameAdapterExample 
      initialNumPlayers={9}
      vsBot={true}
      gameSettings={{
        // 9-max specific settings
        blinds: { small: 5, big: 10 },
        timeBank: 60,
        allowTimeBank: true,
        
        // Bot configuration for backend mode
        botDifficulty: 'medium',
        botPersonalities: [
          'tight-passive',
          'loose-aggressive', 
          'tight-aggressive',
          'loose-passive',
          'balanced',
          'maniac',
          'nit',
          'calling-station'
        ]
      }}
    />
  );
};

export default Bot9MaxPageAdapter;

/**
 * Migration Notes:
 * 
 * 1. Feature Flag Control:
 *    - The adapter automatically determines local vs backend mode
 *    - Uses Features.shouldUseBackendForBots(userId) for rollout
 *    - Can be overridden with localStorage flags for testing
 * 
 * 2. Backward Compatibility:
 *    - Same game logic in local mode as original PokerGame.jsx  
 *    - Enhanced features when backend is available
 *    - Automatic fallback if backend connection fails
 * 
 * 3. Testing:
 *    - Enable backend: BigStackFeatures.enableBackendForCurrentUser()
 *    - Disable backend: BigStackFeatures.disableBackendForCurrentUser()
 *    - Clear override: BigStackFeatures.clearUserOverride()
 * 
 * 4. Rollout Strategy:
 *    - Start with 0% backend rollout
 *    - Gradually increase: 10% → 25% → 50% → 75% → 100%
 *    - Monitor for issues and rollback if needed
 * 
 * 5. Benefits:
 *    - Consistent game logic between online and bot games
 *    - Server-side bot management and anti-cheat
 *    - Unified stats tracking
 *    - Better performance and reliability
 */