import { Card } from "@/components/ui/Card";
import { formatWeight } from "@/lib/format";
import { formatWeightChange } from "@/utils/weight/calculations";
import type { WeeklyWeightSummary } from "@/types/weight";

type WeeklySummaryTableProps = {
  weeks: WeeklyWeightSummary[];
};

export function WeeklySummaryTable({ weeks }: WeeklySummaryTableProps) {
  if (weeks.length === 0) return null;

  return (
    <section aria-label="Resumen semanal">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Evolución semanal
      </h2>

      {/* Desktop table */}
      <Card className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-3 pr-4 font-medium">Semana</th>
              <th className="pb-3 pr-4 font-medium">Peso inicial</th>
              <th className="pb-3 pr-4 font-medium">Peso final</th>
              <th className="pb-3 font-medium">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.weekStart.toISOString()} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 text-foreground">{week.weekLabel}</td>
                <td className="py-3 pr-4">{formatWeight(week.startWeight)}</td>
                <td className="py-3 pr-4">{formatWeight(week.endWeight)}</td>
                <td className="py-3">{formatWeightChange(week.change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {weeks.map((week) => (
          <Card key={week.weekStart.toISOString()}>
            <p className="mb-2 text-sm font-medium text-foreground">
              {week.weekLabel}
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-xs text-muted">Inicial</span>
                <p className="font-medium">{formatWeight(week.startWeight)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Final</span>
                <p className="font-medium">{formatWeight(week.endWeight)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Cambio</span>
                <p className="font-medium">{formatWeightChange(week.change)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
