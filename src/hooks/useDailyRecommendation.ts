import { useCallback, useEffect, useState } from "react";
import {
  getDailyRecommendation,
  saveDailyRecommendation,
} from "@/services/firebase/recommendation.service";
import { toDateInputValue } from "@/utils/date/weight-week";
import type { DailyRecommendation } from "@/types/recommendation";

type UseDailyRecommendationState = {
  recommendation: DailyRecommendation | null;
  loading: boolean;
  alreadyUsedToday: boolean;
  error: string | null;
  saveToday: (recommendations: string[]) => Promise<void>;
};

export function useDailyRecommendation(): UseDailyRecommendationState {
  const [recommendation, setRecommendation] =
    useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dateKey = toDateInputValue(new Date());

  useEffect(() => {
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
          const message =
            err instanceof Error
              ? err.message
              : "No se pudo consultar la recomendación del día";
          setError(message);
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
  }, [dateKey]);

  const saveToday = useCallback(
    async (recommendations: string[]) => {
      const saved = await saveDailyRecommendation(dateKey, recommendations);
      setRecommendation(saved);
    },
    [dateKey],
  );

  return {
    recommendation,
    loading,
    alreadyUsedToday: recommendation !== null,
    error,
    saveToday,
  };
}
