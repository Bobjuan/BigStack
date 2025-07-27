# BigStack Poker Backend Migration Guide

This guide explains how to migrate bot, local, and practice games from client-side poker logic to the new backend-powered system.

## Overview

The migration introduces a **PokerGameAdapter** that provides a unified interface for both local and backend poker games. This enables:

- **Seamless transition**: Users don't notice the switch
- **Gradual rollout**: Feature flags control backend adoption
- **Zero downtime**: Automatic fallback to local mode if backend fails
- **Identical behavior**: Same game logic, just server-side

## Architecture

```
Before:
PokerGame.jsx → Client Logic → Direct State Updates

After:
PokerGame.jsx → PokerGameAdapter → [Local Logic | Backend API] → State Updates
```

## Migration Steps

### 1. Feature Flag Configuration

The system uses `Features.shouldUseBackendForBots(userId)` to determine backend usage:

```javascript
// Enable for testing
BigStackFeatures.enableBackendForCurrentUser();

// Set rollout percentage (admin)
BigStackFeatures.setRolloutPercentage(25); // 25% of users

// Clear override
BigStackFeatures.clearUserOverride();
```

### 2. Component Migration

#### Before (Bot9MaxPage.jsx):
```javascript
import PokerGame from '../../components/poker/PokerGame';

const Bot9MaxPage = () => {
  return (
    <PokerGame 
      initialNumPlayers={9}
      showPlayerCountControls={false}
      vsBot={true}
      botPlayerIndex={0}
    />
  );
};
```

#### After:
```javascript
import { usePokerGameAdapter } from '../../hooks/usePokerGameAdapter';

const Bot9MaxPage = () => {
  const {
    gameState,
    isInitialized,
    error,
    handleFold,
    handleCheck,
    handleCall,
    handleBet,
    startNewHand
  } = usePokerGameAdapter({
    initialNumPlayers: 9,
    vsBot: true,
    gameSettings: {
      blinds: { small: 5, big: 10 },
      botDifficulty: 'medium'
    }
  });

  // Render using gameState and action handlers
  return <YourGameComponent />;
};
```

### 3. Game Type Migration Matrix

| Game Type | Current File | Migration Strategy | Priority |
|-----------|--------------|-------------------|----------|
| Bot 9-Max | `Bot9MaxPage.jsx` | Use adapter hook | High |
| Bot 6-Max | `Bot6MaxPage.jsx` | Use adapter hook | High |
| Bot Heads-Up | `BotHeadsUpPage.jsx` | Use adapter hook | High |
| Local Cash | `CashGamePage.jsx` | Use adapter hook | Medium |
| Local Heads-Up | `HeadsUpPage.jsx` | Use adapter hook | Medium |
| Practice | `PracticeScenarioPage.jsx` | Custom adapter config | Medium |
| Deep Stack | `DeepStackPage.jsx` | Use adapter hook | Low |

### 4. Data Contract Mapping

#### Game State Transformation

| Client Property | Backend Property | Transformation |
|----------------|------------------|----------------|
| `players` | `seats` (filtered) | Extract non-empty seats |
| `communityCards` | `communityCards` | Direct mapping |
| `pot` | `pot` | Direct mapping |
| `currentPlayerIndex` | `currentPlayerIndex` | Seat → player array index |
| `isTurn` | Calculated | From `currentPlayerIndex` |

#### Action Interface

```javascript
// Both modes support same interface
adapter.performAction('fold');
adapter.performAction('call');
adapter.performAction('bet', { amount: 100 });
adapter.performAction('raise', { amount: 200 });
```

### 5. Testing Strategy

#### A. Local Testing
```javascript
// Force local mode
localStorage.setItem('useBackendForBots', 'false');

// Test existing functionality
// Verify bot behavior unchanged
// Check stats tracking
```

#### B. Backend Testing
```javascript
// Force backend mode
localStorage.setItem('useBackendForBots', 'true');

// Test server connection
// Verify bot actions work
// Check fallback behavior
```

#### C. Integration Testing
```javascript
// Test mode switching
// Verify data consistency
// Check error handling
```

### 6. Rollout Plan

#### Phase 1: Internal Testing (Week 1)
- Rollout: 0% (manual override only)
- Team testing with both modes
- Fix critical bugs

#### Phase 2: Alpha Release (Week 2)
- Rollout: 10% of users
- Monitor error rates < 1%
- Check performance impact < 100ms

#### Phase 3: Beta Release (Week 3)
- Rollout: 25% of users
- Verify stats accuracy
- Monitor user feedback

#### Phase 4: Gradual Expansion (Week 4-5)
- Rollout: 50% → 75%
- Performance optimization
- Bug fixes

#### Phase 5: Full Release (Week 6)
- Rollout: 100%
- Remove local fallback (optional)
- Success metrics validation

### 7. Monitoring & Rollback

#### Success Metrics
- Zero data loss
- Error rate < 1%
- Performance impact < 100ms
- User complaints < 5% increase

#### Rollback Triggers
- Error rate > 2%
- Performance degradation > 200ms
- Critical bugs affecting gameplay
- User experience issues

#### Rollback Process
```javascript
// Emergency rollback
BigStackFeatures.setRolloutPercentage(0);

// Gradual rollback
BigStackFeatures.setRolloutPercentage(25); // from 50%
```

### 8. File Structure

```
src/
├── services/
│   ├── PokerGameAdapter.js      # Main adapter class
│   └── pokerBot.js              # Existing bot logic (kept for local mode)
├── hooks/
│   └── usePokerGameAdapter.js   # React integration hook
├── config/
│   └── features.js              # Feature flag system
├── components/poker/
│   ├── PokerGame.jsx           # Original component (kept for non-bot games)
│   └── PokerGameAdapterExample.jsx # Migration example
└── pages/game/
    ├── Bot9MaxPage.jsx         # Original (to be updated)
    └── Bot9MaxPageAdapter.jsx  # New version (example)

server/
├── bots/
│   └── BotManager.js           # Server-side bot management
├── server.js                   # Updated with bot support
└── newGameEngine.js            # Existing engine (no changes needed)
```

### 9. Common Issues & Solutions

#### Issue: Backend Connection Fails
**Solution**: Adapter automatically falls back to local mode
```javascript
adapter.switchToLocalMode('Connection lost');
```

#### Issue: Bot Actions Too Slow
**Solution**: Adjust think time in bot config
```javascript
botConfig: {
  thinkTime: { min: 200, max: 1000 } // Faster for testing
}
```

#### Issue: State Synchronization Problems
**Solution**: Version tracking prevents stale updates
```javascript
this.stateVersion++;
if (newVersion <= this.stateVersion) return; // Ignore old updates
```

#### Issue: Feature Flag Not Working
**Solution**: Check localStorage and user ID hashing
```javascript
console.log(Features.getFeatureStatus(userId));
```

### 10. Performance Considerations

#### Network Latency
- WebSocket connection adds ~50ms per action
- Optimistic updates provide immediate UI feedback
- Batched state updates reduce message frequency

#### Memory Usage
- Adapter maintains both local and server state
- Bot timers are properly cleaned up
- Event listeners are unsubscribed on unmount

#### CPU Impact
- Server-side bot logic reduces client CPU usage
- State transformations add minimal overhead
- Background reconnection uses exponential backoff

### 11. Security Benefits

#### Client-Side Risks (Before)
- Players can inspect/modify game state
- RNG manipulation possible
- Bot logic can be reverse-engineered
- Stats can be spoofed

#### Server-Side Protection (After)
- Game state invisible to clients
- Server-controlled RNG
- Bot logic protected
- Validated stats tracking

### 12. Development Commands

```bash
# Enable debug logging
localStorage.setItem('pokerAdapterDebug', 'true');

# Test backend connection
BigStackFeatures.enableBackendForCurrentUser();

# Monitor WebSocket traffic
// Chrome DevTools → Network → WS

# Check feature status
console.log(BigStackFeatures.getFeatureStatus(user.id));
```

### 13. Deployment Checklist

- [ ] Backend server supports bot games
- [ ] BotManager integrated into server.js
- [ ] Feature flags configured
- [ ] Monitoring dashboard ready
- [ ] Rollback plan tested
- [ ] Documentation updated
- [ ] Team trained on new system

### 14. Future Enhancements

After successful migration:

- **Tournament Support**: Multi-table tournaments
- **Advanced Bots**: GTO-based AI opponents  
- **Real-time Analytics**: Live game statistics
- **Anti-cheat Systems**: Behavior detection
- **Mobile Optimization**: Native app integration

## Questions & Support

For migration questions:
1. Check this guide first
2. Test in development environment
3. Use feature flags for gradual testing
4. Monitor error logs and performance
5. Contact team lead for rollback decisions

The migration preserves all existing functionality while adding the benefits of server-side game management. Users experience identical gameplay with improved security and consistency.