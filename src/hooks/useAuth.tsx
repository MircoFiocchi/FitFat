"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  signInWithGoogle,
  signOut as signOutFromFirebase,
  subscribeToAuth,
} from "@/services/firebase/auth.service";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser((current) => nextUser ?? current);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      const nextUser = await signInWithGoogle();
      setUser(nextUser);
      setLoading(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo iniciar sesión";
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    await signOutFromFirebase();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, signIn, signOut }),
    [user, loading, error, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
