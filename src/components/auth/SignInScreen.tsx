"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";

export function SignInScreen() {
  const { signIn, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
    } catch {
      // El error ya se muestra desde useAuth
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          FitFat
        </h1>
        <p className="mt-1 text-base text-muted">Seguimiento de peso</p>
        <p className="mt-4 text-sm text-muted">
          Iniciá sesión con Gmail para guardar tu peso y tus recomendaciones.
        </p>

        {error && (
          <div className="mt-4 text-left">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <Button
          type="button"
          className="mt-6 w-full"
          loading={loading}
          loadingLabel="Abriendo Google…"
          onClick={handleSignIn}
        >
          Continuar con Google
        </Button>
      </Card>
    </div>
  );
}
