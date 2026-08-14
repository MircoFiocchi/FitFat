import { useCallback, useEffect, useState } from "react";
import {
  getWeightEntries,
  createWeightEntry,
  updateWeightEntry,
  deleteWeightEntry,
} from "@/services/firebase/weight.service";
import type { WeightEntry } from "@/types/weight";

type UseWeightEntriesState = {
  entries: WeightEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (weight: number, date: Date, note: string) => Promise<void>;
  updateEntry: (
    id: string,
    weight: number,
    date: Date,
    note: string,
  ) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useWeightEntries(): UseWeightEntriesState {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          const message =
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los registros";
          setError(message);
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
  }, []);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeightEntries();
      setEntries(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los registros";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(
    async (weight: number, date: Date, note: string) => {
      setError(null);
      try {
        const newEntry = await createWeightEntry(weight, date, note);
        setEntries((prev) =>
          [...prev, newEntry].sort(
            (a, b) => b.date.getTime() - a.date.getTime(),
          ),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo guardar el registro";
        setError(message);
        throw err;
      }
    },
    [],
  );

  const updateEntry = useCallback(
    async (id: string, weight: number, date: Date, note: string) => {
      setError(null);
      try {
        await updateWeightEntry(id, weight, date, note);
        setEntries((prev) =>
          prev
            .map((entry) =>
              entry.id === id ? { ...entry, weight, date, note } : entry,
            )
            .sort((a, b) => b.date.getTime() - a.date.getTime()),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo actualizar el registro";
        setError(message);
        throw err;
      }
    },
    [],
  );

  const removeEntry = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteWeightEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo eliminar el registro";
      setError(message);
      throw err;
    }
  }, []);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    removeEntry,
    refresh: loadEntries,
  };
}
