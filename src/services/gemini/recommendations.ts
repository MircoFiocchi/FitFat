import type { RecommendationEntryInput } from "@/types/recommendation";
import {
  buildRecommendationPrompt,
  parseRecommendationsJson,
} from "@/utils/recommendations/prompt";

const MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiResponse = {
  error?: { message?: string };
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function generateRecommendations(
  entries: RecommendationEntryInput[],
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Falta GEMINI_API_KEY en el servidor");
  }

  const prompt = buildRecommendationPrompt(entries);
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: "Sos un coach de hábitos alimentarios y bienestar cotidiano. No sos médico. Respondé siempre JSON válido.",
          },
        ],
      },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = (await response.json()) as GeminiResponse;
  if (!response.ok) {
    throw new Error(
      data.error?.message ?? "No se pudieron generar las recomendaciones",
    );
  }

  const content = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("La IA no devolvió contenido");
  }

  return parseRecommendationsJson(content);
}
