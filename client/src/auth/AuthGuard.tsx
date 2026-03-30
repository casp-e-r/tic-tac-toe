import { ReactNode } from "react";
import { useAuth } from "./useAuth";


interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isLoading, isError } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Could not reach game server.</div>;

  return <>{children}</>;
}