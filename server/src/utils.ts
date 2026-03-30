import { EMPTY } from "./constants";
import { Board } from "./types";

export function emptyBoard(): Board {
  return [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY] as Board;
}