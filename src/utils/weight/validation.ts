import type { WeightFormData, WeightFormErrors } from "@/types/weight";
import { parseDateInputValue } from "@/utils/date/weight-week";

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 300;

export function validateWeight(weight: string): string | undefined {
  const trimmed = weight.trim();
  if (!trimmed) {
    return "El peso es obligatorio";
  }

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    return "El peso debe ser un número";
  }
  if (parsed <= 0) {
    return "El peso debe ser mayor que 0";
  }
  if (parsed < MIN_WEIGHT || parsed > MAX_WEIGHT) {
    return `El peso debe estar entre ${MIN_WEIGHT} y ${MAX_WEIGHT} kg`;
  }

  return undefined;
}

export function validateWeightForm(data: WeightFormData): WeightFormErrors {
  const errors: WeightFormErrors = {};
  const weightError = validateWeight(data.weight);
  if (weightError) {
    errors.weight = weightError;
  }

  if (!data.date) {
    errors.date = "La fecha es obligatoria";
  } else if (!parseDateInputValue(data.date)) {
    errors.date = "La fecha no es válida";
  }

  return errors;
}

export function parseWeightValue(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

export const WEIGHT_MIN = MIN_WEIGHT;
export const WEIGHT_MAX = MAX_WEIGHT;
