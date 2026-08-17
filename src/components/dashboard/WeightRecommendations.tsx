"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useDailyRecommendation } from "@/hooks/useDailyRecommendation";
import type { WeightEntryWithChange } from "@/types/weight";

type WeightRecommendationsProps = {
  entries: WeightEntryWithChange[];
};

export function WeightRecommendations({ entries }: WeightRecommendationsProps) {
  const {
    recommendation,
    loading,
    generating,
    alreadyUsedToday,
    error,
    requestRecommendation,
  } = useDailyRecommendation();

  const tips = recommendation?.recommendations ?? [];

  return (
    <section aria-label="Recomendaciones">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Recomendaciones
      </h2>
      <Card>
        <p className="mb-4 text-sm text-muted">
          Gemini arma tips según tu peso y los motivos que anotás. Podés pedir
          una recomendación por día. No es consejo médico.
        </p>

        {loading && (
          <p className="mb-4 text-sm text-muted">
            Consultando la recomendación de hoy…
          </p>
        )}

        {!loading && !alreadyUsedToday && (
          <Button
            type="button"
            loading={generating}
            loadingLabel="Pensando…"
            onClick={() => {
              void requestRecommendation(entries);
            }}
            className="w-full sm:w-auto"
          >
            Pedir recomendaciones
          </Button>
        )}

        {!loading && alreadyUsedToday && (
          <Alert variant="info">
            Ya pediste la recomendación de hoy. Mañana podés pedir otra.
          </Alert>
        )}

        {error && (
          <div className="mt-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {tips.length > 0 && (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-foreground">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
