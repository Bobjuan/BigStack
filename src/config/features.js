/**
 * Feature flags configuration for gradual rollout of backend poker games
 * 
 * This system allows controlled migration from client-side to server-side
 * poker logic with the ability to rollback if issues arise.
 */

class Features {
  static STORAGE_KEYS = {
    USE_BACKEND_FOR_BOTS: 'useBackendForBots',
    BACKEND_ROLLOUT_OVERRIDE: 'backendRolloutOverride',
    DEBUG_MODE: 'pokerAdapterDebug'
  };

  /**
   * Check if backend should be used for bot games
   * @param {string} userId - User ID for rollout determination
   * @returns {boolean}
   */
  static shouldUseBackendForBots(userId) {
    // Check for manual override first
    const override = localStorage.getItem(this.STORAGE_KEYS.USE_BACKEND_FOR_BOTS);
    if (override !== null) {
      return override === 'true';
    }

    // Check for admin rollout override
    const rolloutOverride = localStorage.getItem(this.STORAGE_KEYS.BACKEND_ROLLOUT_OVERRIDE);
    if (rolloutOverride !== null) {
      const percentage = parseInt(rolloutOverride, 10);
      if (!isNaN(percentage)) {
        return this.isUserInRollout(userId, percentage);
      }
    }

    // Default rollout percentage (start conservative)
    const DEFAULT_ROLLOUT_PERCENTAGE = 0; // Start at 0%, increase gradually
    return this.isUserInRollout(userId, DEFAULT_ROLLOUT_PERCENTAGE);
  }

  /**
   * Determine if user is in rollout percentage
   * @param {string} userId - User ID
   * @param {number} percentage - Rollout percentage (0-100)
   * @returns {boolean}
   */
  static isUserInRollout(userId, percentage) {
    if (!userId) return false;
    if (percentage <= 0) return false;
    if (percentage >= 100) return true;

    // Create a stable hash from user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to 0-99 range
    const userHash = Math.abs(hash) % 100;
    return userHash < percentage;
  }

  /**
   * Enable backend for current user (for testing)
   */
  static enableBackendForCurrentUser() {
    localStorage.setItem(this.STORAGE_KEYS.USE_BACKEND_FOR_BOTS, 'true');
    console.log('[Features] Backend enabled for bot games');
  }

  /**
   * Disable backend for current user
   */
  static disableBackendForCurrentUser() {
    localStorage.setItem(this.STORAGE_KEYS.USE_BACKEND_FOR_BOTS, 'false');
    console.log('[Features] Backend disabled for bot games');
  }

  /**
   * Clear user override (revert to rollout logic)
   */
  static clearUserOverride() {
    localStorage.removeItem(this.STORAGE_KEYS.USE_BACKEND_FOR_BOTS);
    console.log('[Features] User override cleared');
  }

  /**
   * Set rollout percentage (admin function)
   * @param {number} percentage - Rollout percentage (0-100)
   */
  static setRolloutPercentage(percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Rollout percentage must be between 0 and 100');
    }
    localStorage.setItem(this.STORAGE_KEYS.BACKEND_ROLLOUT_OVERRIDE, percentage.toString());
    console.log(`[Features] Rollout percentage set to ${percentage}%`);
  }

  /**
   * Get current feature status for debugging
   * @param {string} userId - User ID
   * @returns {Object} Current feature configuration
   */
  static getFeatureStatus(userId) {
    const override = localStorage.getItem(this.STORAGE_KEYS.USE_BACKEND_FOR_BOTS);
    const rolloutOverride = localStorage.getItem(this.STORAGE_KEYS.BACKEND_ROLLOUT_OVERRIDE);
    const debugMode = localStorage.getItem(this.STORAGE_KEYS.DEBUG_MODE) === 'true';
    
    return {
      userId,
      userOverride: override,
      rolloutPercentage: rolloutOverride || '0',
      shouldUseBackend: this.shouldUseBackendForBots(userId),
      debugMode,
      userHash: userId ? Math.abs(this.getUserHash(userId)) % 100 : null
    };
  }

  /**
   * Get user hash for debugging
   * @private
   */
  static getUserHash(userId) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Enable debug mode for adapter
   */
  static enableDebugMode() {
    localStorage.setItem(this.STORAGE_KEYS.DEBUG_MODE, 'true');
    console.log('[Features] Debug mode enabled');
  }

  /**
   * Disable debug mode
   */
  static disableDebugMode() {
    localStorage.setItem(this.STORAGE_KEYS.DEBUG_MODE, 'false');
    console.log('[Features] Debug mode disabled');
  }
}

// Rollout plan configuration
export const ROLLOUT_PLAN = {
  phases: [
    { week: 1, percentage: 0, description: 'Internal testing only' },
    { week: 2, percentage: 10, description: 'Alpha users' },
    { week: 3, percentage: 25, description: 'Early adopters' },
    { week: 4, percentage: 50, description: 'Half of users' },
    { week: 5, percentage: 75, description: 'Majority rollout' },
    { week: 6, percentage: 100, description: 'Full rollout' }
  ],
  
  getCurrentPhase() {
    const startDate = new Date('2024-02-01'); // Adjust based on actual start
    const now = new Date();
    const weeksPassed = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
    
    const phase = this.phases.find(p => p.week > weeksPassed) || this.phases[this.phases.length - 1];
    return phase;
  }
};

// Export for use in components
export default Features;

// Expose to window for debugging/admin control
if (typeof window !== 'undefined') {
  window.BigStackFeatures = Features;
  window.BigStackRolloutPlan = ROLLOUT_PLAN;
}