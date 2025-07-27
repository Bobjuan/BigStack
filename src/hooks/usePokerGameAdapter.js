import { useState, useEffect, useCallback, useRef } from 'react';
import PokerGameAdapter from '../services/PokerGameAdapter';
import Features from '../config/features';
import { useAuth } from '../context/AuthContext';

/**
 * React hook for integrating PokerGameAdapter with PokerGame component
 * Provides a unified interface that matches existing PokerGame.jsx expectations
 */
export function usePokerGameAdapter({ 
  initialNumPlayers = 9, 
  vsBot = false,
  gameSettings = {},
  onStateUpdate,
  onMessage,
  onError
}) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Refs for cleanup
  const adapterRef = useRef(null);
  const cleanupFunctionsRef = useRef([]);

  // Determine if we should use backend based on feature flags
  const shouldUseBackend = Features.shouldUseBackendForBots(user?.id);
  const mode = vsBot && shouldUseBackend ? 'backend' : 'local';

  /**
   * Initialize the adapter
   */
  const initializeAdapter = useCallback(async () => {
    if (isInitialized || isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Create adapter instance
      const adapter = new PokerGameAdapter(mode);
      adapterRef.current = adapter;

      // Register callbacks
      const unsubscribeState = adapter.onStateUpdate((newState, actionLog) => {
        // Transform backend state to client format if needed
        const clientState = mode === 'backend' 
          ? adapter.transformBackendToClient(newState)
          : newState;
        
        setGameState(clientState);
        
        if (onStateUpdate) {
          onStateUpdate(clientState, actionLog);
        }
      });

      const unsubscribeMessage = adapter.onMessage((message) => {
        if (onMessage) {
          onMessage(message);
        }
      });

      const unsubscribeError = adapter.onError((error) => {
        setError(error);
        if (onError) {
          onError(error);
        }
      });

      // Store cleanup functions
      cleanupFunctionsRef.current = [
        unsubscribeState,
        unsubscribeMessage,
        unsubscribeError
      ];

      // Prepare game settings
      const fullGameSettings = {
        maxPlayers: initialNumPlayers,
        blinds: {
          small: gameSettings.smallBlind || 5,
          big: gameSettings.bigBlind || 10
        },
        timeBank: gameSettings.timeBank || 60,
        allowTimeBank: gameSettings.allowTimeBank !== false,
        ...gameSettings
      };

      // Initialize the game
      const gameId = await adapter.initialize(
        fullGameSettings,
        {
          userId: user?.id || `guest_${Date.now()}`,
          name: user?.username || 'Guest',
          avatar: user?.avatar
        },
        vsBot
      );

      console.log(`[usePokerGameAdapter] Initialized in ${mode} mode, gameId: ${gameId}`);
      
      setIsInitialized(true);
      setConnectionStatus(mode === 'backend' ? 'connected' : 'local');
      
      // For local mode, we need to manually trigger initial state
      if (mode === 'local') {
        const initialState = adapter.getState();
        if (initialState) {
          const clientState = adapter.transformBackendToClient(initialState);
          setGameState(clientState);
        }
      }
    } catch (err) {
      console.error('[usePokerGameAdapter] Initialization failed:', err);
      setError(err);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode, isInitialized, isLoading, initialNumPlayers, gameSettings, vsBot, user, onStateUpdate, onMessage, onError]);

  /**
   * Perform a game action
   */
  const performAction = useCallback(async (action, details = {}) => {
    if (!adapterRef.current || !isInitialized) {
      console.error('[usePokerGameAdapter] Cannot perform action - not initialized');
      return;
    }

    try {
      await adapterRef.current.performAction(action, details);
    } catch (err) {
      console.error('[usePokerGameAdapter] Action failed:', err);
      setError(err);
      if (onError) {
        onError(err);
      }
    }
  }, [isInitialized, onError]);

  /**
   * Start a new hand (for local mode)
   */
  const startNewHand = useCallback(async () => {
    if (!adapterRef.current || !isInitialized) {
      console.error('[usePokerGameAdapter] Cannot start hand - not initialized');
      return;
    }

    if (mode === 'backend') {
      // Backend handles this automatically
      return;
    }

    try {
      await adapterRef.current.startNewHand();
    } catch (err) {
      console.error('[usePokerGameAdapter] Start hand failed:', err);
      setError(err);
    }
  }, [mode, isInitialized]);

  /**
   * Update game settings
   */
  const updateSettings = useCallback(async (newSettings) => {
    if (!adapterRef.current || !isInitialized) {
      console.error('[usePokerGameAdapter] Cannot update settings - not initialized');
      return;
    }

    try {
      await adapterRef.current.updateSettings(newSettings);
    } catch (err) {
      console.error('[usePokerGameAdapter] Update settings failed:', err);
      setError(err);
    }
  }, [isInitialized]);

  /**
   * Get current adapter mode
   */
  const getMode = useCallback(() => {
    return mode;
  }, [mode]);

  /**
   * Get connection status
   */
  const getConnectionStatus = useCallback(() => {
    return connectionStatus;
  }, [connectionStatus]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeAdapter();
  }, []); // Only run once on mount

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Run all cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      
      // Destroy adapter
      if (adapterRef.current) {
        adapterRef.current.destroy();
        adapterRef.current = null;
      }
      
      setIsInitialized(false);
    };
  }, []);

  /**
   * Action handlers matching PokerGame.jsx interface
   */
  const handleFold = useCallback(() => performAction('fold'), [performAction]);
  const handleCheck = useCallback(() => performAction('check'), [performAction]);
  const handleCall = useCallback(() => performAction('call'), [performAction]);
  const handleBet = useCallback((amount) => performAction('bet', { amount }), [performAction]);
  const handleRaise = useCallback((amount) => performAction('raise', { amount }), [performAction]);

  return {
    // State
    gameState,
    isInitialized,
    isLoading,
    error,
    connectionStatus,
    mode,
    
    // Actions
    handleFold,
    handleCheck,
    handleCall,
    handleBet,
    handleRaise,
    performAction,
    
    // Utilities
    startNewHand,
    updateSettings,
    getMode,
    getConnectionStatus,
    
    // Direct adapter access (for advanced usage)
    adapter: adapterRef.current
  };
}

export default usePokerGameAdapter;