import { useContext } from "react";
import { NakamaContext } from "./NakamaContext";

export function useNakama() {
  const ctx = useContext(NakamaContext);
  if (!ctx) throw new Error("useNakama must be used inside <NakamaProvider>");
  return ctx;
}