import { useNakama } from "../nakama";

interface AuthState {
  userId: string | null;
  username?: string;
  isLoading: boolean;
  isReady: boolean;
  isError: boolean;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { session, status, logout } = useNakama();

  return {
    userId: session?.user_id ?? null,
    username: session?.username,
    isLoading: status === "loading",
    isReady: status === "ready",
    isError: status === "error",
    logout,
  };
}