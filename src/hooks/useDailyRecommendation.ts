"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDailyRecommendation,
  saveDailyRecommendation,
} from "@/services/firebase/recommendation.service";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { toDateInputValue } from "@/utils/date/weight-week";
import {
  parseApiError,
  parseRecommendationsPayload,
} from "@/utils/recommendations/api";
import type { DailyRecommendation } from "@/types/recommendation";
import type { WeightEntryWithChange } from "@/types/weight";

type UseDailyRecommendationState = {
  recommendation: DailyRecommendation | null;
  loading: boolean;
  generating: boolean;
  alreadyUsedToday: boolean;
  error: string | null;
  requestRecommendation: (entries: WeightEntryWithChange[]) => Promise<void>;
};

export function useDailyRecommendation(): UseDailyRecommendationState {
  const { user } = useAuth();
  const [recommendation, setRecommendation] =
    useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateKey = toDateInputValue(new Date());

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadToday() {
      try {
        const today = await getDailyRecommendation(dateKey);
        if (!cancelled) {
          setRecommendation(today);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            getErrorMessage(err, "No se pudo consultar la recomendación del día"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadToday();

    return () => {
      cancelled = true;
    };
  }, [user, dateKey]);

  const requestRecommendation = useCallback(
    async (entries: WeightEntryWithChange[]) => {
      if (recommendation) return;

      setGenerating(true);
      setError(null);

      try {
        const existing = await getDailyRecommendation(dateKey);
        if (existing) {
          setRecommendation(existing);
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
          throw new Error(
            parseApiError(data, "No se pudieron generar las recomendaciones"),
          );
        }

        const tips = parseRecommendationsPayload(data);
        const saved = await saveDailyRecommendation(dateKey, tips);
        setRecommendation(saved);
      } catch (err) {
        setError(
          getErrorMessage(err, "No se pudieron generar las recomendaciones"),
        );
      } finally {
        setGenerating(false);
      }
    },
    [dateKey, recommendation],
  );

  return {
    recommendation,
    loading,
    generating,
    alreadyUsedToday: recommendation !== null,
    error,
    requestRecommendation,
  };
}
