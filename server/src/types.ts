export interface Player {
    userId: string;
    sessionId: string;
    username: string;
    symbol: "X" | "O";
}

export type Cell   = "X" | "O" | "";
export type Board  = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];


export interface MatchState {
  players:      Record<string,Player>; 
  board:        Board;
  currentTurn:  string;   
  winner:       string;  
  gameOver:     boolean;
  turnCount:    number; 
}

//---- client -> server message ----
export interface MovePayload {
  position: number;
}

export interface OpponentLeftPayload {
  message: string;
}

//---- server -> client message ----
export interface StateUpdatePayload {
  board:       Board;
  currentTurn: string;   
  players:     { [userId: string]: { symbol: string; username: string } };
}

export interface GameOverPayload {
  winner:   string | "draw";  
  board:    Board;
}

export interface StartPayload {
  yourSymbol:  "X" | "O";
  yourTurn:    boolean;
  opponent:    { userId: string; symbol: "X" | "O" };
}


