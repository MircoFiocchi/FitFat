import { NextResponse } from "next/server";
import { generateRecommendations } from "@/services/gemini/recommendations";
import type { RecommendationEntryInput } from "@/types/recommendation";

function isValidEntry(value: unknown): value is RecommendationEntryInput {
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

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const entries =
      typeof body === "object" &&
      body !== null &&
      "entries" in body &&
      Array.isArray((body as { entries: unknown }).entries)
        ? (body as { entries: unknown[] }).entries
        : null;

    if (!entries || entries.length === 0 || !entries.every(isValidEntry)) {
      return NextResponse.json(
        { error: "Enviá al menos un registro válido" },
        { status: 400 },
      );
    }

    const recommendations = await generateRecommendations(entries);
    return NextResponse.json({ recommendations });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudieron generar las recomendaciones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
