import { NextResponse } from "next/server";
import type { RecommendationEntryInput } from "@/types/recommendation";

export function isRecommendationEntry(
  value: unknown,
): value is RecommendationEntryInput {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as RecommendationEntryInput;
  return (
    typeof entry.date === "string" &&
    typeof entry.weight === "number" &&
    Number.isFinite(entry.weight) &&
    typeof entry.note === "string" &&
    (entry.change === null || typeof entry.change === "number")
  );
}

export function parseRecommendationEntries(
  body: unknown,
): RecommendationEntryInput[] | null {
  if (typeof body !== "object" || body === null || !("entries" in body)) {
    return null;
  }

  const { entries } = body as { entries: unknown };
  if (!Array.isArray(entries) || entries.length === 0) {
    return null;
  }
  if (!entries.every(isRecommendationEntry)) {
    return null;
  }

  return entries;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
