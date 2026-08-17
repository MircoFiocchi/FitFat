"use client";

import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { Alert } from "@/components/ui/Alert";

function AuthGateContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-16">
        <Alert variant="info">Cargando sesión…</Alert>
      </div>
    );
  }

  if (!user) {
    return <SignInScreen />;
  }

  return children;
}

export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGateContent>{children}</AuthGateContent>
    </AuthProvider>
  );
}
