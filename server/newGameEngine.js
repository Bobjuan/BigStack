// newGameEngine.js
// Transitional engine that wraps the "poker-ts" library while preserving the
// public API (function names and data shapes) expected by server.js and the
// current React front-end.  The goal is *drop-in* compatibility so we can
// switch via the USE_POKER_TS env flag with zero UI changes.

/*
Design notes
------------
Legacy engine exports a set of standalone functions.  We keep those signatures
so that `const gameEngine = require('./newGameEngine')` works without any
changes in server.js.

Internally we maintain a per-table `GameWrapper` class.  Each instance owns a
`Poker.Table` from the 3rd-party library and all meta-data not handled by
that library (spectators, timers, handStats, etc.).

This first commit only scaffolds the structure + the functions that server.js
calls *before* a hand actually starts:  initGameState, getSeatedPlayers,
sitDown, standUp.  Action processing and showdown wiring will be added next
in small, reviewable patches.
*/

const Poker = require('poker-ts');
const { randomUUID } = require('crypto');
const { GamePhase, PlayerAction } = require('./constants');

// ---------------------------------------------------------------------------
// Helper – translate Poker.ts enum strings to our GAME_PHASE constants
// ---------------------------------------------------------------------------
function translateRoundOfBetting(round) {
  switch (round) {
    case 'preflop': return GamePhase.PREFLOP;
    case 'flop':    return GamePhase.FLOP;
    case 'turn':    return GamePhase.TURN;
    case 'river':   return GamePhase.RIVER;
    default:        return GamePhase.WAITING;
  }
}

const toStr = (c)=> c.rank + c.suit[0];

// -------------------- POSITION ASSIGNMENT (copied from legacy) -------------
function assignPositions(players, dealerIndex) {
  const POS_9 = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'LJ', 'HJ', 'CO'];
  const POS_6 = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
  const POS_2 = ['BTN/SB', 'BB'];
  const num = players.length;
  let arr = POS_9;
  if (num <= 2) arr = POS_2; else if (num <= 6) arr = POS_6;
  const rel = arr.slice(0, num);
  players.forEach((p, idx) => {
    const posIdx = (idx - dealerIndex + num) % num;
    p.positionName = rel[posIdx];
    p.isDealer = p.positionName === 'BTN' || p.positionName === 'BTN/SB';
    p.isSB = p.positionName === 'SB' || p.positionName === 'BTN/SB';
    p.isBB = p.positionName === 'BB';
  });
}

// ---------------------------------------------------------------------------
// GameWrapper –  one instance per table (what legacy engine called `game`)
// ---------------------------------------------------------------------------
class GameWrapper {
  constructor(gameSettings) {
    this.id = `game_${randomUUID()}`; // will be overwritten by server.js later

    // Copy selected settings so they remain readable elsewhere
    this.gameSettings = gameSettings;
    this.bigBlind  = gameSettings?.blinds?.big   || 10;
    this.smallBlind = gameSettings?.blinds?.small || 5;
    this.maxPlayers = gameSettings?.maxPlayers || 9;
    this.timeBank = gameSettings?.timeBank || 60;

    // --- spectators & seat map --------------------------------------------
    this.spectators = [];
    this.seats = Array(this.maxPlayers).fill(null).map((_, i) => ({
      seatIndex: i,
      isEmpty: true,
    }));
    // Map socket.id -> seatIndex for quick lookup
    this.socketSeat = new Map();

    // --- poker-ts ----------------------------------------------------------
    this.table = new Poker.Table({
      bigBlind:  this.bigBlind,
      smallBlind:this.smallBlind,
      ante:      0,
    }, this.maxPlayers);

    // OTHER meta fields to keep compatibility
    this.pot = 0;
    this.pots = [];
    this.communityCards = [];
    this.currentBettingRound = GamePhase.WAITING;
    this.currentPlayerIndex = -1;
    this.dealerIndex = -1;
    this.currentHighestBet = 0;
    this.minRaiseAmount = this.bigBlind;
    this.lastDealerSeat = -1;

    // --- stats tracking / hand history ----------------------------------
    this.handStats = null;   // filled each hand
  }

  // ---------------- seating ----------------------------------------------
  sitDown(socketId, playerInfo, buyIn) {
    // Find first empty seat.  In legacy flow the client specifies seatIndex; we
    // will keep that API but also allow auto-seat.
    let seatIndex = playerInfo?.requestedSeat;
    if (typeof seatIndex !== 'number' || seatIndex < 0 || seatIndex >= this.maxPlayers || !this.seats[seatIndex].isEmpty) {
      seatIndex = this.seats.findIndex(s => s.isEmpty);
      if (seatIndex === -1) return { error: 'Table full' };
    }

    const seatObj = this.seats[seatIndex];
    seatObj.isEmpty = false;
    const player = {
      id: socketId,
      userId: playerInfo.userId,
      name: playerInfo.name,
      stack: buyIn,
      currentBet: 0,
      totalBetInHand: 0,
      isFolded: false,
      isAllIn: false,
      isDealer: false,
      isSB: false,
      isBB: false,
      hasActedThisRound: false,
      positionName: '',
      cards: [],
    };
    seatObj.player = player;

    this.socketSeat.set(socketId, seatIndex);
    this.table.sitDown(seatIndex, buyIn);
    return { seatIndex };
  }

  standUp(socketId) {
    const seatIndex = this.socketSeat.get(socketId);
    if (seatIndex === undefined) return { error: 'Not seated' };
    const seatObj = this.seats[seatIndex];
    if (seatObj && !seatObj.isEmpty) {
      seatObj.isEmpty = true;
      delete seatObj.player;
      this.socketSeat.delete(socketId);
      try {
        this.table.standUp(seatIndex);
      } catch (_) {/* poker-ts throws if hand in progress – ignore for now */}
    }
    return { ok: true };
  }

  // -----------------------------------------------------------------------
  getPublicState() {
    // Derived seats array clone with up-to-date stack / bet sizes from poker-ts
    const seatsForClient = this.seats.map((seat,i)=>{
      if (seat.isEmpty) return { seatIndex:i, isEmpty:true };
      const seatData = this.table.seats()[i];
      const playerStack = seatData ? seatData.stack : seat.player.stack;
      const playerBet   = seatData ? seatData.betSize : 0;
      return {
        seatIndex: i,
        isEmpty: false,
        player: {
          ...seat.player,
          stack:  playerStack,
          currentBet: playerBet,
        }
      };
    });

    const state = {
      id: this.id,
      seats: seatsForClient,
      spectators: this.spectators,
      hostId: this.hostId,
      pot: this.table.isHandInProgress() ? this.table.pots().reduce((s,p)=>s+p.size,0) : 0,
      totalPot: (()=>{
        if (!this.table.isHandInProgress()) return 0;
        const outstanding = this.table.seats().reduce((sum,s)=>sum+(s?.betSize||0),0);
        return this.table.pots().reduce((s,p)=>s+p.size,0) + outstanding;
      })(),
      pots: this.table.isHandInProgress() ? this.table.pots().map(p=>({ amount:p.size, eligiblePlayerIds:p.eligiblePlayers })) : [],
      communityCards: this.table.isHandInProgress() ? this.table.communityCards().map(c=>c.rank + c.suit[0]) : [],
      currentBettingRound: this.table.isHandInProgress()? translateRoundOfBetting(this.table.roundOfBetting()) : this.currentBettingRound,
      currentPlayerIndex: (()=>{
        if (!(this.table.isHandInProgress() && this.table.isBettingRoundInProgress())) return -1;
        const seatIdx = this.table.playerToAct();
        const seated = this.seats.filter(s=>!s.isEmpty);
        return seated.findIndex(s=>s.seatIndex === seatIdx);
      })(),
      dealerIndex: this.table.isHandInProgress()? this.table.button() : -1,
      currentHighestBet: this._getCurrentHighestBet(),
      minRaiseAmount: this._getMinRaiseAmount(),
      bigBlind: this.bigBlind,
      smallBlind: this.smallBlind,
      gameSettings: this.gameSettings,
      turnStartTime: this.turnStartTime,
      timeBank: this.timeBank,
      winners: this.winners,
      handOverMessage: this.handOverMessage,
    };
    this._debugSeatReport('publicState');
    return state;
  }

  _getCurrentHighestBet(){
    if (!this.table.isHandInProgress()) return 0;
    try {
      const bets = this.table.seats().map(s=>s?.betSize||0);
      return Math.max(...bets);
    } catch(_) { return 0; }
  }
  _getMinRaiseAmount(){
    if (!this.table.isHandInProgress()) return this.bigBlind;
    try {
      const legal = this.table.legalActions();
      return legal?.chipRange?.min || this.bigBlind;
    } catch(_) { return this.bigBlind; }
  }
}

GameWrapper.prototype._mirrorSeatData = function(debug=false){
  const tableSeats = this.table.seats();
  tableSeats.forEach((seatData,i)=>{
     if (seatData===null) return;
     const seatObj = this.seats[i];
     if (seatObj && !seatObj.isEmpty){
      const behind = seatData.stack - seatData.betSize;
      seatObj.player.stack = behind;
      seatObj.player.currentBet = seatData.betSize;
      if (seatObj.player.cards.length === 0){
        seatObj.player.cards = (this.table.holeCards()[i] || []).map(toStr);
      }
      if (debug){
        console.log('[DEBUG] seat',i,'totalChips',seatData.totalChips,'stack',seatData.stack,'bet',seatData.betSize,'behind',behind);
      }
    }
  });
};

GameWrapper.prototype._advanceRoundsIfNeeded = function(){
  if (!this.table.isHandInProgress()) return; // already over

  while(this.table.isHandInProgress() && !this.table.isBettingRoundInProgress()){
    try {
      this.table.endBettingRound();
    } catch(e){
      console.error('[advanceRound]',e.message); break;
    }
    if (this.table.areBettingRoundsCompleted()){
      // Capture pots before showdown so assertions do not trigger afterwards
      let potsSnapshot = [];
      try {
        potsSnapshot = this.table.pots();
      } catch(_) { /* ignore if not available */ }

      try { this.table.showdown(); }
      catch(e){ console.error('[showdown]',e.message); }
      // After showdown set winners and message using the captured snapshot
      this._setWinnersFromTable(potsSnapshot);
      break;
    }
  }

  // Update turnStartTime for the current player if a new betting round began
  if (this.table.isHandInProgress() && this.table.isBettingRoundInProgress()){
     this.turnStartTime = Date.now();
  }
};

GameWrapper.prototype._setWinnersFromTable = function(potsSnapshot){
  const rawWinners = this.table.winners();
  this.winners = [];

  // Determine which pots array to use while avoiding assertions
  let allPots = [];
  if (Array.isArray(potsSnapshot) && potsSnapshot.length){
     allPots = potsSnapshot;
  } else {
     try {
       allPots = this.table.isHandInProgress() ? this.table.pots() : (this.pots || []);
     } catch(_) {
       allPots = this.pots || [];
     }
  }

  if (rawWinners && rawWinners.length>0){
    rawWinners.forEach((potWinners,potIdx)=>{
      const potSize = allPots[potIdx]?.size || 0;
      const share  = Math.floor(potSize / potWinners.length);
      const remainder = potSize % potWinners.length;
      potWinners.forEach((w,i)=>{
        const seatIdx = w[0];
        const player = this.seats[seatIdx]?.player;
        if (!player) return;
        const amountWon = share + (i===0?remainder:0);
        const existing = this.winners.find(x=>x.id===player.id);
        const descr = w[1]?.ranking;
        if (existing){
          existing.amountWon += amountWon;
        }else{
          this.winners.push({ id:player.id, name:player.name, amountWon, handDescription:descr, cards:player.cards });
        }
      });
    });
    // Build handOverMessage simple version
    const msgParts = this.winners.map(w=>`${w.name} wins ${w.amountWon}`);
    this.handOverMessage = msgParts.join(', ');
  }
};

GameWrapper.prototype._debugSeatReport = function(stage){
  const tableSeats = this.table.seats();
  console.log(`[SEATS][${stage}]`);
  tableSeats.forEach((sd,i)=>{
    if (sd===null) return;
    const player = this.seats[i].player;
    console.log(` seat${i} ${player?.name||'empty'} total:${sd.totalChips} stack:${sd.stack} bet:${sd.betSize} behind:${player?.stack}`);
  });
};

// ---------------------- ACTION PROCESSING ----------------------------------
const ACTION_MAP = {
  'fold':'fold',
  'check':'check',
  'call':'call',
  'bet':'bet',
  'raise':'raise' // ui may send 'bet' only – we'll treat same.
};

GameWrapper.prototype.startHand = function() {
  // Fail fast if less than 2 seated players
  const seated = this.seats.filter(s=>!s.isEmpty);
  if (seated.length < 2) return { error: 'Need at least 2 players' };

  // Determine next dealer seat (absolute seat index)
  const activeSeatIndices = this.seats.filter(s=>!s.isEmpty).map(s=>s.seatIndex).sort((a,b)=>a-b);
  let nextDealerSeat;
  if (this.lastDealerSeat === -1) {
     nextDealerSeat = activeSeatIndices[0];
  } else {
     const pos = activeSeatIndices.indexOf(this.lastDealerSeat);
     nextDealerSeat = activeSeatIndices[(pos+1) % activeSeatIndices.length];
  }
  this.lastDealerSeat = nextDealerSeat;

  try {
    this.table.startHand(nextDealerSeat);
  } catch(e){
    return { error: e.message };
  }

  // Map poker-ts seats back to player objects (cards & stack already set)
  const tableSeats = this.table.seats();
  tableSeats.forEach((seatData,i)=>{
    if (seatData===null) return; // empty seat
    const seatObj = this.seats[i];
    if (!seatObj.isEmpty){
      seatObj.player.stack = seatData.stack;
      seatObj.player.cards = (this.table.holeCards()[i] || []).map(toStr);
      seatObj.player.currentBet = seatData.betSize;
      seatObj.player.totalBetInHand = seatData.betSize;
      seatObj.player.isFolded = false;
      seatObj.player.isAllIn = false;
    }
  });

  // Update dealer/SB/BB flags
  this.dealerIndex = this.table.button();
  const seatedPlayers = this.seats.filter(s=>!s.isEmpty).map(s=>s.player);
  assignPositions(seatedPlayers, this.dealerIndex);

  // Reset per-hand meta
  this.communityCards = [];
  this.pots = [];
  this.handActions = [];
  this.currentBettingRound = GamePhase.PREFLOP;
  this.turnStartTime = Date.now();
  this.currentPlayerIndex = this.table.playerToAct();

  // Hand counters (for history)
  this.handCounter = (this.handCounter || 0) + 1;
  this.handStartTime = Date.now();

  // ---------------- stats tracking init ----------------
  this.handStats = {};
  const statsPlayers = this.seats.filter(s=>!s.isEmpty).map(s=>s.player);
  statsPlayers.forEach(p=>{
    if (p.userId){
      this.handStats[p.userId] = require('./game/statsTracker').createHandStatsObject(p.userId);
    }
  });
  // Shared state for tracker logic
  this.handStats.sharedState = {
    preflopRaiseMade: false,
    raiseCount: 0,
    preflopAggressorId: null,
    isHeadsUp: seatedPlayers.length === 2,
    firstPreflopActorLogged: false,
    streets: {
      FLOP: { actors: [], firstAggressorId: null, hasAggression: false },
      TURN: { actors: [], firstAggressorId: null, hasAggression: false },
      RIVER: { actors: [], firstAggressorId: null, hasAggression: false }
    }
  };

  this._mirrorSeatData();
  this._debugSeatReport('startHand');

  return { ok:true };
};

GameWrapper.prototype.processAction = function(socketId, action, details={}){
  const seatIndex = this.socketSeat.get(socketId);
  if (seatIndex===undefined) return { error:'Not seated' };
  const legal = this.table.legalActions();
  const translated = ACTION_MAP[action];
  if (!translated) return { error:'Unknown action' };

  let betSize;
  if (translated==='bet' || translated==='raise'){
    betSize = Number(details.amount||0);
    if (isNaN(betSize) || betSize<=0) return { error:'Invalid bet amount' };
  }
  try {
    this.table.actionTaken(translated, betSize);
  } catch(err){
    return { error: err.message };
  }

  // Update fold status immediately for animations
  const actingSeatObj = this.seats[seatIndex];
  if (actingSeatObj && !actingSeatObj.isEmpty){
     if (translated==='fold') actingSeatObj.player.isFolded = true;
  }

  // Log hand action for history (minimal for now)
  try{
    const player = this.seats[seatIndex].player;
    this.handActions.push({
      street: translateRoundOfBetting(this.table.roundOfBetting()),
      actorId: player.userId,
      actorName: player.name,
      position: player.positionName,
      action: translated,
      amount: betSize||null,
      potAfter: this.table.pots().reduce((s,p)=>s+p.size,0)
    });
  }catch(_){/* ignore */}

  // After action update meta
  this._advanceRoundsIfNeeded();
  this._syncAfterAction();
  this._debugSeatReport('processAction');

  // ---- stats tracking ----
  const statsTracker = require('./game/statsTracker');
  const playerObj = this.seats[seatIndex].player;
  if (playerObj && playerObj.userId && this.handStats){
    statsTracker.trackAction(this.handStats, this, playerObj, translated);
  }
  return { ok:true };
};

GameWrapper.prototype._syncAfterAction = function(){
  const prevPlayerIndex = this.currentPlayerIndex;
  // Sync each player's behind-stack
  const tableSeats = this.table.seats();
  tableSeats.forEach((seatData,i)=>{
    if (seatData===null) return;
    const seatObj = this.seats[i];
    if (!seatObj.isEmpty){
      seatObj.player.stack = seatData.stack;
      seatObj.player.currentBet = seatData.betSize;
      // Determine all-in status
      seatObj.player.isAllIn = seatObj.player.stack === 0 && !seatObj.player.isFolded;
    }
  });
  if (this.table.isHandInProgress()) {
    this.communityCards = this.table.communityCards().map(toStr);
    this.pot = this.table.pots().reduce((s,p)=>s+p.size,0);
    this.pots = this.table.pots().map(p=>({ amount:p.size, eligiblePlayerIds:p.eligiblePlayers }));
    this.currentBettingRound = translateRoundOfBetting(this.table.roundOfBetting());
    if (this.table.isBettingRoundInProgress()) {
      const seatIdx = this.table.playerToAct();
      const seated = this.seats.filter(s=>!s.isEmpty);
      this.currentPlayerIndex = seated.findIndex(s=>s.seatIndex === seatIdx);
    } else {
      this.currentPlayerIndex = -1;
    }
  } else {
    // Hand already over – keep stored board/pot, mark phases
    this.currentBettingRound = GamePhase.HAND_OVER;
    this.currentPlayerIndex = -1;
  }
  // If the active player changed, reset turnStartTime
  if (this.table.isHandInProgress() && this.table.isBettingRoundInProgress() && this.currentPlayerIndex !== prevPlayerIndex){
    this.turnStartTime = Date.now();
  }

  this.currentHighestBet = this._getCurrentHighestBet();

  if (!this.table.isHandInProgress()){
    this.currentBettingRound = GamePhase.HAND_OVER;

    if (!this.winners || this.winners.length===0){
      // Try regular winners first (may be empty if no showdown)
      this._setWinnersFromTable();
      // Fallback – if still empty, determine sole surviving player(s)
      if (!this.winners || this.winners.length === 0){
        this._determineWinnersNoShowdown();
      }
    }

    // ---- finalize per-hand stats ----
    if (this.handStats){
      // Determine players who reached showdown (i.e., did not fold)
      const reachedShowdown = this.seats
        .filter(s=>!s.isEmpty && !s.player.isFolded)
        .map(s=>s.player.userId);

      // Update winner-related stats
      if (this.winners && this.winners.length){
        this.winners.forEach(w=>{
          const statObj = this.handStats[w.id];
          if (statObj && statObj.increments){
            statObj.increments.hands_won = 1;
            statObj.increments.total_pot_size_won += w.amountWon || 0;
            statObj.increments.total_bb_won += (w.amountWon || 0) / this.bigBlind;
            // Won at showdown (WS%) if they reached showdown
            if (reachedShowdown.includes(w.id)) {
              statObj.increments.wsd_actions = 1;
            }
            // Won when saw flop
            if (statObj.handState && statObj.handState.saw_flop){
              statObj.increments.wwsf_actions = 1;
            }
          }
        });
      }

      // WTSD actions for everyone who saw showdown
      reachedShowdown.forEach(pid=>{
        const statObj = this.handStats[pid];
        if (statObj && statObj.increments){
          statObj.increments.wtsd_actions = 1;
        }
      });
    }

    // Commit stats to DB
    const statsTracker = require('./game/statsTracker');
    if (this.handStats){
      statsTracker.commitHandStats(this.handStats);
      this.handStats=null;
    }

    // Save hand history
    try {
      require('./game/handHistory').saveHandHistory(this);
    } catch(e){
      console.error('[newGameEngine] handHistory save error',e);
    }

    // Auto-stand-up busted players (stack==0)
    this._handleBustedPlayers();

    this._debugSeatReport('handOver');
  }
};

// If winners list still empty (folded pre-showdown) pick remaining non-folded players as winners
GameWrapper.prototype._determineWinnersNoShowdown = function(){
  const remaining = this.seats.filter(s=>!s.isEmpty && !s.player.isFolded);
  if (remaining.length === 0) return;

  // The library may report 0-chip pots for blind folds (due to fractional blind sizes).
  // Fallback: use sum of configured blinds if the computed pot is 0.
  let potAmount = this.pot || 0;
  if (potAmount === 0){
      const outstanding = this.table.seats().reduce((sum,s)=>sum+(s?.betSize||0),0);
      potAmount += outstanding;
  }
  const share = Math.floor(potAmount / remaining.length);
  const remainder = potAmount % remaining.length;
  this.winners = remaining.map((seatObj,idx)=>({
     id: seatObj.player.id,
     name: seatObj.player.name,
     amountWon: share + (idx===0?remainder:0),
     handDescription: 'Opponents folded',
     cards: [], // Do NOT reveal hole cards when opponents fold
  }));
  const parts = this.winners.map(w=>`${w.name} wins ${w.amountWon}`);
  this.handOverMessage = parts.join(', ');
};

// Remove players whose stack is zero and move them to spectators
GameWrapper.prototype._handleBustedPlayers = function(){
  this.seats.forEach((seatObj, idx)=>{
    if (seatObj.isEmpty) return;
    const player = seatObj.player;
    if (player.stack <= 0){
       // Stand up in poker-ts table
       try { this.table.standUp(idx); } catch(_) {/* ignore */}
       // Move to spectators list
       this.spectators.push(player);
       // Clear seat
       seatObj.isEmpty = true;
       seatObj.player = null;
       // Update maps
       this.socketSeat.delete(player.id);
    }
  });
};

// ---------------------------------------------------------------------------------
// Legacy-API entry points expected by server.js
// ---------------------------------------------------------------------------------

function initGameState(gameSettings){
  return new GameWrapper(gameSettings);
}

function getSeatedPlayers(game){
  return game.seats.filter(s=>!s.isEmpty).map(s=>s.player);
}

function isHandInProgress(game){
  return game.table.isHandInProgress();
}
function playerToAct(game){
  return game.table.playerToAct();
}
function legalActions(game){
  return game.table.legalActions();
}

function startHandWrapper(game){
  return game.startHand();
}
function processActionWrapper(game,socketId,action,details){
  return game.processAction(socketId,action,details);
}

function sitDownWrapper(game, socketId, playerInfo, seatIndex, buyIn){
  const info = { ...playerInfo, requestedSeat: seatIndex };
  return game.sitDown(socketId, info, buyIn);
}

function checkGameAndProceedWrapper(game){
  if (!game || typeof game._advanceRoundsIfNeeded !== 'function') return;
  game._advanceRoundsIfNeeded();
  game._syncAfterAction();
}

module.exports = {
  initGameState,
  getSeatedPlayers,
  startHand: startHandWrapper,
  processAction: processActionWrapper,
  sitDown: sitDownWrapper,
  isHandInProgress,
  playerToAct,
  legalActions,
  GamePhase,
  checkGameAndProceed: checkGameAndProceedWrapper,
}; 