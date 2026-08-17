import { Card } from "@/components/ui/Card";
import { formatDate, formatWeight } from "@/lib/format";
import { formatWeightChange } from "@/utils/weight/calculations";
import type { WeightEntryWithChange } from "@/types/weight";

type WeightTableProps = {
  entries: WeightEntryWithChange[];
};

export function WeightTable({ entries }: WeightTableProps) {
  if (entries.length === 0) return null;

  return (
    <Card className="hidden md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="pb-3 pr-4 font-medium">Fecha</th>
            <th className="pb-3 pr-4 font-medium">Peso</th>
            <th className="pb-3 pr-4 font-medium">Cambio</th>
            <th className="pb-3 font-medium">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-border last:border-0"
            >
              <td className="py-3 pr-4 text-foreground">
                {formatDate(entry.date)}
              </td>
              <td className="py-3 pr-4 font-medium">
                {formatWeight(entry.weight)}
              </td>
              <td className="py-3 pr-4 text-muted">
                {formatWeightChange(entry.change)}
              </td>
              <td className="py-3 text-muted">
                {entry.note || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
