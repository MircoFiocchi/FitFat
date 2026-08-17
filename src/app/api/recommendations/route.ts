import { generateRecommendations } from "@/services/gemini/recommendations";
import {
  jsonError,
  parseRecommendationEntries,
} from "@/app/api/recommendations/parse-request";
import { getErrorMessage } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const entries = parseRecommendationEntries(await request.json());
    if (!entries) {
      return jsonError("Enviá al menos un registro válido", 400);
    }

    const recommendations = await generateRecommendations(entries);
    return NextResponse.json({ recommendations });
  } catch (error) {
    return jsonError(
      getErrorMessage(error, "No se pudieron generar las recomendaciones"),
      500,
    );
  }
}
