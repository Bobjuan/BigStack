class SlumbotAPI {
  constructor() {
    // Use proxy in development, direct API in production
    this.baseURL = process.env.NODE_ENV === 'development' ? '/api/slumbot' : 'https://slumbot.com';
    this.token = null;
  }

  async newHand() {
    try {
      const response = await fetch(`${this.baseURL}/api/new_hand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update token from response
      if (data.token) {
        this.token = data.token;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error in newHand:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendAction(action) {
    try {
      if (!this.token) {
        throw new Error('No active session token');
      }

      const response = await fetch(`${this.baseURL}/api/act`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          incr: action
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update token from response
      if (data.token) {
        this.token = data.token;
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error in sendAction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert our game action to Slumbot format
  convertActionToSlumbot(actionType, amount = 0) {
    switch (actionType.toLowerCase()) {
      case 'fold':
        return 'f';
      case 'check':
        return 'k';
      case 'call':
        return 'c';
      case 'bet':
      case 'raise':
        return `b${amount}`;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }

  // Parse Slumbot action string to our format
  parseSlumbotAction(actionString) {
    if (!actionString) return null;

    // Get the last action from the action string
    const actions = actionString.split('/');
    const lastStreet = actions[actions.length - 1];
    
    if (!lastStreet) return null;

    // Parse the last action on the current street
    const lastAction = lastStreet.slice(-1);
    const betMatch = lastStreet.match(/b(\d+)$/);
    
    if (lastAction === 'f') {
      return { type: 'fold', amount: 0 };
    } else if (lastAction === 'k') {
      return { type: 'check', amount: 0 };
    } else if (lastAction === 'c') {
      return { type: 'call', amount: 0 };
    } else if (betMatch) {
      const amount = parseInt(betMatch[1]);
      return { type: 'bet', amount: amount };
    }

    return null;
  }

  // Parse hole cards from Slumbot format
  parseHoleCards(holeCards) {
    if (!holeCards || holeCards.length !== 2) return [];
    
    return holeCards.map(card => {
      // Convert from Slumbot format (e.g., 'Ac', '9d') to our format
      const rank = card[0];
      const suit = card[1];
      
      // Map suit letters to our format
      const suitMap = {
        'c': 'c',
        'd': 'd', 
        'h': 'h',
        's': 's'
      };
      
      return rank + suitMap[suit];
    });
  }

  // Parse board cards from Slumbot format
  parseBoardCards(board) {
    if (!board) return [];
    
    return board.map(card => {
      const rank = card[0];
      const suit = card[1];
      
      const suitMap = {
        'c': 'c',
        'd': 'd',
        'h': 'h', 
        's': 's'
      };
      
      return rank + suitMap[suit];
    });
  }

  resetSession() {
    this.token = null;
  }
}

export default new SlumbotAPI(); 