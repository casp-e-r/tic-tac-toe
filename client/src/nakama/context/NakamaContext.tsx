import { createContext, ReactNode, useEffect, useState, useMemo } from "react";
import { Session, Client } from "@heroiclabs/nakama-js";
import { nakamaClient, socket } from "../client";
import { resolveSession } from "../session";

export type NakamaStatus = "loading" | "ready" | "error";

interface NakamaContextValue {
  client: Client;
  session: Session | null;
  status: NakamaStatus;
  logout: () => void;
}

export const NakamaContext = createContext<NakamaContextValue | null>(null);

export function NakamaProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<NakamaStatus>("loading");
  const [socketReady, setSocketReady] = useState(false);


  const init = async () => {
    try {
      const s = await resolveSession();
      setSession(s);

      await socket.connect(s, true); // ← Module level socket
      setSocketReady(true);
      setStatus("ready");
    } catch (err) {
      console.error("Nakama init failed:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    init();
    return () =>  socket.disconnect(true);
  }, []);

  const value = useMemo(() => ({
    client:nakamaClient,
    session,
    socketReady,
    status,
    logout: () => {
      // clearSession();
      // setSession(null);
      // init(); 
    },
  }), [session, status]);

  return (
    <NakamaContext.Provider value={value}>
      {children}
    </NakamaContext.Provider>
  );
}