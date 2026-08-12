"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatDate } from "@/lib/format";
import { parseDateInputValue, toDateInputValue } from "@/utils/date/weight-week";
import { validateWeight, parseWeightValue } from "@/utils/weight/validation";

type WeightFormProps = {
  onSubmit: (weight: number, date: Date) => Promise<void>;
};

function getTodayDate(): Date {
  const today = parseDateInputValue(toDateInputValue(new Date()));
  return today ?? new Date();
}

export function WeightForm({ onSubmit }: WeightFormProps) {
  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const todayLabel = formatDate(getTodayDate());

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccess(false);
    setSubmitError(null);

    const error = validateWeight(weight);
    setWeightError(error);
    if (error) return;

    const parsedWeight = parseWeightValue(weight);
    if (parsedWeight === null) return;

    setLoading(true);
    try {
      await onSubmit(parsedWeight, getTodayDate());
      setWeight("");
      setWeightError(undefined);
      setSuccess(true);
    } catch {
      setSubmitError("No se pudo guardar el peso. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-label="Registrar peso">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Nuevo registro
      </h2>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Peso"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="20"
            max="300"
            placeholder="84.5"
            suffix="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            error={weightError}
          />
          <p className="text-sm text-muted">
            Fecha: <span className="text-foreground">{todayLabel}</span>
          </p>

          {submitError && <Alert variant="error">{submitError}</Alert>}
          {success && (
            <Alert variant="success">Peso guardado correctamente.</Alert>
          )}

          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            Guardar peso
          </Button>
        </form>
      </Card>
    </section>
  );
}
