import { Card } from "@/components/ui/Card";
import { formatWeight } from "@/lib/format";
import { formatWeightChange } from "@/utils/weight/calculations";
import type { WeightSummary } from "@/types/weight";

type WeightSummaryProps = {
  summary: WeightSummary;
};

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-lg font-semibold text-foreground sm:text-xl">
        {value}
      </span>
    </div>
  );
}

export function WeightSummaryCards({ summary }: WeightSummaryProps) {
  const hasData = summary.currentWeight !== null;

  return (
    <section aria-label="Resumen de peso">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Resumen</h2>
      <Card>
        {hasData ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            <SummaryItem
              label="Peso actual"
              value={formatWeight(summary.currentWeight!)}
            />
            <SummaryItem
              label="Peso inicial"
              value={formatWeight(summary.initialWeight!)}
            />
            <SummaryItem
              label="Cambio total"
              value={formatWeightChange(summary.totalChange)}
            />
            <SummaryItem
              label="Promedio semanal"
              value={formatWeightChange(summary.weeklyAverageChange)}
            />
          </div>
        ) : (
          <p className="text-sm text-muted">Sin datos para mostrar resumen.</p>
        )}
      </Card>
    </section>
  );
}
