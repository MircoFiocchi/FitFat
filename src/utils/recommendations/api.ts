export function parseRecommendationsPayload(data: unknown): string[] {
  if (
    typeof data !== "object" ||
    data === null ||
    !("recommendations" in data) ||
    !Array.isArray(data.recommendations)
  ) {
    throw new Error("Respuesta inválida del servidor");
  }

  return data.recommendations.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

export function parseApiError(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }
  return fallback;
}
