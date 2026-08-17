import type { RecommendationEntryInput } from "@/types/recommendation";
import { formatWeightChange } from "@/utils/weight/calculations";

export const MAX_RECOMMENDATION_ENTRIES = 14;

export function selectRecentEntries(
  entries: RecommendationEntryInput[],
): RecommendationEntryInput[] {
  return [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_RECOMMENDATION_ENTRIES);
}

export function formatEntriesForPrompt(
  entries: RecommendationEntryInput[],
): string {
  const recent = selectRecentEntries(entries);
  if (recent.length === 0) return "";

  return recent
    .map((entry) => {
      const note = entry.note.trim() || "sin motivo";
      return `${entry.date} | ${entry.weight.toFixed(1)} kg | cambio ${formatWeightChange(entry.change)} | motivo: ${note}`;
    })
    .join("\n");
}

export function buildRecommendationPrompt(
  entries: RecommendationEntryInput[],
): string {
  const history = formatEntriesForPrompt(entries);

  return `Estos son mis últimos registros de peso (fecha, peso, cambio vs el registro anterior y el motivo que anoté):

${history}

Dame recomendaciones prácticas para esta semana: alimentación más sana y cuidados cotidianos, usando los motivos (comidas afuera, entrenamiento, fin de semana, etc.) cuando existan.

Respondé SOLO un JSON con esta forma:
{"recommendations":["tip 1","tip 2","tip 3","tip 4"]}

Reglas:
- Entre 3 y 5 recomendaciones.
- Español rioplatense, tono cercano, frases cortas.
- No diagnostiques ni hables como médico.
- No inventes datos que no estén en los registros.`;
}

export function parseRecommendationsJson(raw: string): string[] {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const parsed: unknown = JSON.parse(trimmed);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("recommendations" in parsed)
  ) {
    throw new Error("La respuesta de la IA no tiene recomendaciones");
  }

  const recommendations = (parsed as { recommendations: unknown }).recommendations;
  if (!Array.isArray(recommendations)) {
    throw new Error("La respuesta de la IA no tiene recomendaciones");
  }

  const tips = recommendations
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (tips.length === 0) {
    throw new Error("La IA no devolvió recomendaciones útiles");
  }

  return tips.slice(0, 5);
}
