// Client -> server
export const OP_CODE_MOVE         = 1; // player sends a move

// Server -> client
export const OP_CODE_STATE_UPDATE = 2; // full board state broadcast
export const OP_CODE_GAME_OVER    = 3; // winner/draw broadcast
export const OP_CODE_START        = 4; // both players joined, game begins
export const OP_CODE_OPPONENT_LEFT= 5; // opponent disconnected mid-game

// ── Match settings 
export const TICK_RATE        = 5;   // matchLoop runs 5x per second
export const MAX_PLAYERS      = 2;
export const MODULE_NAME      = "tic_tac_toe";

export const BOARD_SIZE       = 9;   
export const EMPTY            = "";
export const SYMBOL_X         = "X";
export const SYMBOL_O         = "O";

// Win patterns — indices of the 3x3 board
export const WIN_PATTERNS: number[][] = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8], 
  [0, 3, 6], 
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];