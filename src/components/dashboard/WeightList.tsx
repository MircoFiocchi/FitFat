import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { formatWeight } from "@/lib/format";
import { formatWeightChange } from "@/utils/weight/calculations";
import type { WeightEntryWithChange } from "@/types/weight";

type WeightListProps = {
  entries: WeightEntryWithChange[];
};

export function WeightList({ entries }: WeightListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-3 md:hidden">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {formatDate(entry.date)}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formatWeight(entry.weight)}
              </p>
            </div>
            <p className="text-sm text-muted">
              {formatWeightChange(entry.change)}
            </p>
          </div>
          {entry.note && (
            <p className="mt-2 text-sm text-muted">{entry.note}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
