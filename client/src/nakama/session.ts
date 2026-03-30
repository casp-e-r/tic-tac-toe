import { Session } from "@heroiclabs/nakama-js";
import { nakamaClient } from "./client";

const BROWSER_ID_KEY = "nakama_browser_id";
const SESSION_KEY    = "nakama_session";

interface SavedSession {
  token: string;
  refresh_token: string;
}

/** Retrieves or generates a unique browser ID for device authentication */
export function getBrowserId(): string {
  let id = localStorage.getItem(BROWSER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(BROWSER_ID_KEY, id);
  }
  return id;
}

/** Persists the session tokens to local storage */
export function saveSession(session: Session): void {
  const data: SavedSession = {
    token: session.token,
    refresh_token: session.refresh_token,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Attempts to restore an existing session, refresh it if expired, 
 * or create a new device-based session if all else fails.
 */
export async function resolveSession(): Promise<Session> {
  const saved = localStorage.getItem(SESSION_KEY);

  if (saved) {
    try {
      const { token, refresh_token }: SavedSession = JSON.parse(saved);
      let session = Session.restore(token, refresh_token);

      // nakama timestamps are in seconds -  Date.now() is milliseconds.
      const currentTimeInSecs = Math.floor(Date.now() / 1000);

      if (!session.isexpired(currentTimeInSecs)) {
        return session;
      }

      // if expired, refresh
      try {
        session = await nakamaClient.sessionRefresh(session);
        saveSession(session);
        return session;
      } catch (error) {
        console.error("Could not refresh session:", error);
        clearSession();
      }
    } catch (error) {
      console.error("Error parsing saved session:", error);
      clearSession();
    }
  }

  //Fallback - authenticate via device ID - new session
  const session = await nakamaClient.authenticateDevice(getBrowserId(), true);
  saveSession(session);
  return session;
}