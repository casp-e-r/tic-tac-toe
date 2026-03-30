import { BOARD_SIZE, EMPTY } from "./constants";
import { MatchState, MovePayload,  } from "./types";


export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates a move before it's processed by the match loop.
 *
 * @param state - current MatchState
 * @param userId - The user attempting the move
 * @param payload - The move payload containing the target position
 * @returns ValidationResult with validity flag and optional reason for rejection
 */
export function validateMove(
  state: MatchState,
  userId: string,
  payload: MovePayload
): ValidationResult {
  
  if (state.gameOver) {
    return {
      valid: false,
      reason: "Game is already over",
    };
  }

  // Check if player exists in match
  const player = state.players[userId];
  if (!player) {
    return {
      valid: false,
      reason: "Player not found in match",
    };
  }

  // Check if it's the correct player's turn
  if (state.currentTurn !== player.symbol) {
    return {
      valid: false,
      reason: `It is not your turn. Current turn: ${state.currentTurn}`,
    };
  }

  if (payload.position < 0 || payload.position >= BOARD_SIZE) {
    return {
      valid: false,
      reason: `Invalid Position`,
    };
  }

  // Check if cell is already taken
  if (state.board[payload.position] !== EMPTY) {
    return {
      valid: false,
      reason: `Cell at position ${payload.position} is already occupied`,
    };
  }

  return { valid: true };
}
