import {
  OP_CODE_MOVE,
  OP_CODE_STATE_UPDATE,
  OP_CODE_GAME_OVER,
  OP_CODE_START,
  OP_CODE_OPPONENT_LEFT,
  MAX_PLAYERS,
  SYMBOL_X,
  SYMBOL_O,
  EMPTY,
  BOARD_SIZE,
  WIN_PATTERNS,
  TICK_RATE,
} from "./constants";
import {
  MatchState as GameMatchState,
  Player,
  MovePayload,
  StateUpdatePayload,
  GameOverPayload,
  StartPayload,
  Board,
} from "./types";
import { validateMove } from "./validation";


  export function matchInit(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    params: {[key: string]: string}
  ): { state: GameMatchState; tickRate: number; label: string } {
    logger.info("Match initialized");

    const state: GameMatchState = {
      players: {},
      board: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY] as Board,
      currentTurn: SYMBOL_X,
      winner: "",
      gameOver: false,
      turnCount: 0,
    };

    return { state, tickRate: TICK_RATE, label: "Tic-Tac-Toe" };
  }

  export function matchJoinAttempt(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    presence: nkruntime.Presence,
    metadata: {[key: string]: string}
  ): { state: GameMatchState, accept: boolean, rejectMessage?: string } | null {
    logger.info(`Player ${presence.userId} attempting to join`);

    if (Object.keys(state.players).length >= MAX_PLAYERS) 
      return { state, accept: false, rejectMessage: "Match is full" };
    
    return { state, accept: true };
  }

  /**
   * calls when a player successfully joins the match.
   * adds player to the game, assigns X or O symbol, and broadcasts START when both players joined.
   */
  export function matchJoin(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    presences: nkruntime.Presence[]
  ): { state: GameMatchState } | null {
    presences.forEach((presence) => {
      // Check if player already exists
      if (state.players.hasOwnProperty(presence.userId)) {
        logger.info(`Player ${presence.userId} already in match`);
        return;
      }
      
      const playerCount = Object.keys(state.players).length;
      if (playerCount >= MAX_PLAYERS) {
        return;
      }

      // Assign symbol based on current player count
      const symbol = playerCount === 0 ? SYMBOL_X : SYMBOL_O;

      const newPlayer: Player = {
        userId: presence.userId,
        sessionId: presence.sessionId,
        username: presence.username,
        symbol,
      };

      state.players[presence.userId] = newPlayer;
      logger.info(
        `Player ${presence.username} (${presence.userId}) joined as ${symbol}`
      );

      // If both players have joined, broadcast START to both
      if (Object.keys(state.players).length === MAX_PLAYERS) {
        const playersArray = Object.values(state.players);
        const playerX = playersArray.find((p) => p.symbol === SYMBOL_X)!;
        const playerO = playersArray.find((p) => p.symbol === SYMBOL_O)!;

        // Notify player X
        const startPayloadX: StartPayload = {
          yourSymbol: SYMBOL_X,
          yourTurn: true,
          opponent: {
            userId: playerO.userId,
            symbol: SYMBOL_O,
          },
        };
        dispatcher.broadcastMessage(
          OP_CODE_START,
          JSON.stringify(startPayloadX),
          [{ userId: playerX.userId, sessionId: playerX.sessionId, username: playerX.username, node: "" }]
        );

        // Notify player O
        const startPayloadO: StartPayload = {
          yourSymbol: SYMBOL_O,
          yourTurn: false,
          opponent: {
            userId: playerX.userId,
            symbol: SYMBOL_X,
          },
        };
        dispatcher.broadcastMessage(
          OP_CODE_START,
          JSON.stringify(startPayloadO),
          [{ userId: playerO.userId, sessionId: playerO.sessionId, username: playerO.username, node: "" }]
        );

        logger.info("Game started");
      }
    });

    return { state };
  }

  /** when a player leaves the match */
  export function matchLeave(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    presences: nkruntime.Presence[]
  ): { state: GameMatchState } | null {
    presences.forEach((presence) => {
      const player = state.players[presence.userId]

      if (player) {
        logger.info(`Player ${player.username} left the match`);

        delete state.players[presence.userId];
        state.gameOver = true;

        // Broadcast OPPONENT_LEFT to remaining players
        const payload = {
          message: `${player.username} left the game`,
        };
        dispatcher.broadcastMessage(
          OP_CODE_OPPONENT_LEFT,
          JSON.stringify(payload)
        );
      }
    });

    return { state };
  }

  export function matchLoop(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    messages: nkruntime.MatchMessage[]
  ): { state: GameMatchState } | null {
    messages.forEach((message) => {
      // Only process MOVE opcodes in the loop
      if (message.opCode !== OP_CODE_MOVE) {
        return;
      }

      const userId = message.sender?.userId;
      if (!userId) {
        logger.error("Move received without userId");
        return;
      }

      let payload: MovePayload;
      try {
        const messageString = new TextDecoder().decode(message.data);
        payload = JSON.parse(messageString);
      } catch (err) {
        logger.error(`Failed to parse move payload: ${err}`);
        return;
      }

      // Validate the move
      const validation = validateMove(state, userId, payload);
      if (!validation.valid) {
        logger.warn(
          `Invalid move from ${userId}: ${validation.reason}`
        );
        return;
      }

      // Find the playr
      const player = state.players[userId];
      if (!player) {
        logger.error(`Player ${userId} not found in match`);
        return;
      }

      // Apply the move to the board
      state.board[payload.position] = player.symbol;
      state.turnCount++;
      logger.info(
        `Player ${player.username} placed ${player.symbol} at position ${payload.position}`
      );

      // Check for winner
      const winner = checkWinner(state.board);
      if (winner) {
        state.winner = winner;
        state.gameOver = true;

        const gameOverPayload: GameOverPayload = {
          winner,
          board: state.board,
        };
        dispatcher.broadcastMessage(
          OP_CODE_GAME_OVER,
          JSON.stringify(gameOverPayload)
        );
        logger.info(`Game over. Winner: ${winner}`);
        return;
      }

      // Check for draw (all 9 cells filled, no winner)
      if (state.turnCount === BOARD_SIZE) {
        state.gameOver = true;

        const gameOverPayload: GameOverPayload = {
          winner: "",
          board: state.board,
        };
        dispatcher.broadcastMessage(
          OP_CODE_GAME_OVER,
          JSON.stringify(gameOverPayload)
        );
        logger.info("Game over. Draw.");
        return;
      }

      // Switch turn to the other player
      state.currentTurn =
        state.currentTurn === SYMBOL_X ? SYMBOL_O : SYMBOL_X;

      // Broadcast updated state to both players
      const stateUpdatePayload: StateUpdatePayload = {
        board: state.board,
        currentTurn: state.currentTurn,
        players: Object.values(state.players).reduce((acc, p) => {
          acc[p.userId] = {
            username: p.username,
            symbol: p.symbol,
          };
          return acc;
        }, {} as Record<string, { username: string; symbol: string }>),
      };
      dispatcher.broadcastMessage(
        OP_CODE_STATE_UPDATE,
        JSON.stringify(stateUpdatePayload)
      );
    });

    return { state };
  }

  /** when match terminates */
  export function matchTerminate(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    graceSeconds: number
  ): { state: GameMatchState } | null {
    logger.info("Match terminated");
    return { state };
  }

  /** when match receives a signal */
  export function matchSignal(
    ctx: nkruntime.Context,
    logger: nkruntime.Logger,
    nk: nkruntime.Nakama,
    dispatcher: nkruntime.MatchDispatcher,
    tick: number,
    state: GameMatchState,
    data: string
  ): { state: GameMatchState, data: string } | null {
    return { state, data: "" };
  }

/**
 * Checks if the current board state has a winner.
 */
function checkWinner(board: (string)[]): string | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (
      board[a] !== EMPTY &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}