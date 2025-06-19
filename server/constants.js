const GamePhase = {
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
  HAND_OVER: 'HAND_OVER',
  WAITING: 'WAITING'
};

const PlayerAction = {
  FOLD: 'fold',
  CHECK: 'check',
  CALL: 'call',
  BET: 'bet',
};

const SocketEvents = {
  // Client to Server
  CREATE_GAME: 'createGame',
  JOIN_GAME: 'joinGame',
  TAKE_SEAT: 'takeSeat',
  START_GAME: 'startGame',
  PLAYER_ACTION: 'playerAction',
  CHAT_MESSAGE: 'chatMessage',
  UPDATE_GAME_SETTINGS: 'updateGameSettings',
  RIT_VOTE: 'ritVote',

  // Server to Client
  GAME_STATE_UPDATE: 'gameStateUpdate',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  MESSAGE: 'message',
  CHAT_MESSAGE: 'chatMessage', // Can be both ways
  RIT_PROMPT: 'ritPrompt',
  GAME_NOT_FOUND: 'gameNotFound',
  GAME_ERROR: 'gameError', // For standardized errors
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
};

module.exports = {
  GamePhase,
  PlayerAction,
  SocketEvents,
}; 