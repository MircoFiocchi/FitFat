"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { Alert } from "@/components/ui/Alert";
import { migrateLegacyDataIfNeeded } from "@/services/firebase/migration.service";

function AuthGateContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [migratedUserId, setMigratedUserId] = useState<string | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    migrateLegacyDataIfNeeded(user.uid)
      .then(() => {
        if (!cancelled) {
          setMigratedUserId(user.uid);
          setMigrationError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "No se pudieron migrar los registros anteriores";
          setMigrationError(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

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

  if (migratedUserId !== user.uid && !migrationError) {
    return (
      <div className="py-16">
        <Alert variant="info">Migrando tus registros a esta cuenta…</Alert>
      </div>
    );
  }

  return (
    <>
      {migrationError && (
        <div className="mb-6">
          <Alert variant="error">
            No se pudieron migrar los registros anteriores. {migrationError}{" "}
            Publicá las reglas nuevas de Firestore y recargá la página.
          </Alert>
        </div>
      )}
      {children}
    </>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGateContent>{children}</AuthGateContent>
    </AuthProvider>
  );
}
