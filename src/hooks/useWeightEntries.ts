"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getWeightEntries,
  createWeightEntry,
} from "@/services/firebase/weight.service";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { sortEntriesByDateDesc } from "@/utils/date/weight-week";
import type { WeightEntry } from "@/types/weight";

type UseWeightEntriesState = {
  entries: WeightEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (weight: number, date: Date, note: string) => Promise<void>;
};

export function useWeightEntries(): UseWeightEntriesState {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchEntries() {
      try {
        const data = await getWeightEntries();
        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "No se pudieron cargar los registros"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchEntries();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addEntry = useCallback(
    async (weight: number, date: Date, note: string) => {
      setError(null);
      try {
        const newEntry = await createWeightEntry(weight, date, note);
        setEntries((prev) => sortEntriesByDateDesc([...prev, newEntry]));
      } catch (err) {
        const message = getErrorMessage(err, "No se pudo guardar el registro");
        setError(message);
        throw err;
      }
    },
    [],
  );

  return {
    entries,
    loading,
    error,
    addEntry,
  };
}
