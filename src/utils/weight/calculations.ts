import type {
  WeightEntry,
  WeightEntryWithChange,
  WeightSummary,
  WeeklyWeightSummary,
} from "@/types/weight";
import {
  getWeekKey,
  getWeekStart,
  formatWeekLabel,
  sortEntriesByDateAsc,
  sortEntriesByDateDesc,
} from "@/utils/date/weight-week";

export function calculateChange(
  current: number,
  previous: number,
): number {
  return current - previous;
}

export function formatWeightChange(change: number | null): string {
  if (change === null) return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)} kg`;
}

export function addChangesToEntries(
  entries: WeightEntry[],
): WeightEntryWithChange[] {
  const sorted = sortEntriesByDateDesc(entries);
  return sorted.map((entry, index) => {
    const olderEntry = sorted[index + 1];
    const change =
      olderEntry !== undefined
        ? calculateChange(entry.weight, olderEntry.weight)
        : null;
    return { ...entry, change };
  });
}

export function calculateSummary(entries: WeightEntry[]): WeightSummary {
  if (entries.length === 0) {
    return {
      currentWeight: null,
      initialWeight: null,
      totalChange: null,
      weeklyAverageChange: null,
    };
  }

  const sorted = sortEntriesByDateAsc(entries);
  const initialWeight = sorted[0].weight;
  const currentWeight = sorted[sorted.length - 1].weight;
  const totalChange = calculateChange(currentWeight, initialWeight);

  const firstDate = sorted[0].date;
  const lastDate = sorted[sorted.length - 1].date;
  const daysDiff =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
  const weeks = Math.max(daysDiff / 7, 1);
  const weeklyAverageChange = totalChange / weeks;

  return {
    currentWeight,
    initialWeight,
    totalChange,
    weeklyAverageChange,
  };
}

export function groupEntriesByWeek(
  entries: WeightEntry[],
): WeeklyWeightSummary[] {
  if (entries.length === 0) return [];

  const sorted = sortEntriesByDateAsc(entries);
  const weekMap = new Map<string, WeightEntry[]>();

  for (const entry of sorted) {
    const key = getWeekKey(entry.date);
    const existing = weekMap.get(key) ?? [];
    existing.push(entry);
    weekMap.set(key, existing);
  }

  const weekKeys = [...weekMap.keys()].sort();
  return weekKeys.map((key, index) => {
    const weekEntries = weekMap.get(key)!;
    const weekStart = getWeekStart(weekEntries[0].date);
    const startWeight = weekEntries[0].weight;
    const endWeight = weekEntries[weekEntries.length - 1].weight;
    return {
      weekLabel: formatWeekLabel(weekStart, index + 1),
      weekStart,
      weekEnd: weekEntries[weekEntries.length - 1].date,
      startWeight,
      endWeight,
      change: calculateChange(endWeight, startWeight),
    };
  });
}
