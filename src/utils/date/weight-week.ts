import type { WeightEntry } from "@/types/weight";

/** Returns Monday 00:00:00 of the week containing the given date (local timezone). */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Returns Sunday 23:59:59.999 of the week containing the given date (local timezone). */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getWeekKey(date: Date): string {
  const start = getWeekStart(date);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWeekLabel(weekStart: Date, weekIndex: number): string {
  const formatter = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  });
  const startStr = formatter.format(weekStart);
  const end = getWeekEnd(weekStart);
  const endStr = formatter.format(end);
  return `Semana ${weekIndex} (${startStr} – ${endStr})`;
}

export function sortEntriesByDateAsc(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
}

export function sortEntriesByDateDesc(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}
