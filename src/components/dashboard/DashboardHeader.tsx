"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function DashboardHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            FitFat
          </h1>
          <p className="mt-1 text-base text-muted">Seguimiento de peso</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {user?.email && (
            <p className="max-w-40 truncate text-xs text-muted sm:max-w-none">
              {user.email}
            </p>
          )}
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-2 text-xs"
            onClick={() => {
              void signOut();
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
