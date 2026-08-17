"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toDateInputValue } from "@/utils/date/weight-week";
import { useDailyRecommendation } from "@/hooks/useDailyRecommendation";
import { getDailyRecommendation } from "@/services/firebase/recommendation.service";
import type { WeightEntryWithChange } from "@/types/weight";

type WeightRecommendationsProps = {
  entries: WeightEntryWithChange[];
};

export function WeightRecommendations({ entries }: WeightRecommendationsProps) {
  const {
    recommendation,
    loading: loadingToday,
    alreadyUsedToday,
    error: loadError,
    saveToday,
  } = useDailyRecommendation();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tips = recommendation?.recommendations ?? [];

  const handleGenerate = async () => {
    if (alreadyUsedToday) return;

    setGenerating(true);
    setError(null);

    try {
      const todayKey = toDateInputValue(new Date());
      const existing = await getDailyRecommendation(todayKey);
      if (existing) {
        await saveToday(existing.recommendations);
        return;
      }

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: entries.map((entry) => ({
            date: toDateInputValue(entry.date),
            weight: entry.weight,
            note: entry.note,
            change: entry.change,
          })),
        }),
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "No se pudieron generar las recomendaciones";
        throw new Error(message);
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("recommendations" in data) ||
        !Array.isArray(data.recommendations)
      ) {
        throw new Error("Respuesta inválida del servidor");
      }

      const nextTips = data.recommendations.filter(
        (item): item is string => typeof item === "string",
      );
      await saveToday(nextTips);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron generar las recomendaciones",
      );
    } finally {
      setGenerating(false);
    }
  };

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

        {loadingToday && (
          <p className="mb-4 text-sm text-muted">
            Consultando la recomendación de hoy…
          </p>
        )}

        {!loadingToday && !alreadyUsedToday && (
          <Button
            type="button"
            loading={generating}
            loadingLabel="Pensando…"
            onClick={handleGenerate}
            className="w-full sm:w-auto"
          >
            Pedir recomendaciones
          </Button>
        )}

        {!loadingToday && alreadyUsedToday && (
          <Alert variant="info">
            Ya pediste la recomendación de hoy. Mañana podés pedir otra.
          </Alert>
        )}

        {(error || loadError) && (
          <div className="mt-4">
            <Alert variant="error">{error ?? loadError}</Alert>
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
