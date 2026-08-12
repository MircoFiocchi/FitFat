"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { sortEntriesByDateAsc } from "@/utils/date/weight-week";
import type { WeightEntry } from "@/types/weight";

type WeightChartProps = {
  entries: WeightEntry[];
};

type ChartPoint = {
  dateLabel: string;
  weight: number;
  fullDate: string;
};

export function WeightChart({ entries }: WeightChartProps) {
  const sorted = sortEntriesByDateAsc(entries);
  const data: ChartPoint[] = sorted.map((entry) => ({
    dateLabel: formatDate(entry.date),
    weight: entry.weight,
    fullDate: formatDate(entry.date),
  }));

  if (data.length === 0) return null;

  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const padding = Math.max((maxWeight - minWeight) * 0.2, 1);

  return (
    <section aria-label="Gráfico de evolución de peso">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Evolución</h2>
      <Card className="p-2 sm:p-4">
        <div className="h-56 w-full sm:h-72" role="img" aria-label="Gráfico de línea con la evolución del peso">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: "#8b9aab" }}
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minWeight - padding, maxWeight + padding]}
                tick={{ fontSize: 11, fill: "#8b9aab" }}
                tickFormatter={(v) => `${v}`}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #2a3441",
                  backgroundColor: "#151b24",
                  color: "#e8edf2",
                  fontSize: "14px",
                }}
                formatter={(value) => [`${Number(value).toFixed(1)} kg`, "Peso"]}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#52b788"
                strokeWidth={2}
                dot={{ r: 4, fill: "#52b788", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#40916c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted sm:hidden">
          También puedes consultar tus registros en el listado debajo.
        </p>
      </Card>
    </section>
  );
}
