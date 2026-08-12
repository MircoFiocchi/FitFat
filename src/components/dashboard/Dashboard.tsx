"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WeightSummaryCards } from "@/components/dashboard/WeightSummary";
import { WeightChart } from "@/components/dashboard/WeightChart";
import { WeeklySummaryTable } from "@/components/dashboard/WeeklySummaryTable";
import { WeightForm } from "@/components/dashboard/WeightForm";
import { WeightTable } from "@/components/dashboard/WeightTable";
import { WeightList } from "@/components/dashboard/WeightList";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { useWeightEntries } from "@/hooks/useWeightEntries";
import {
  addChangesToEntries,
  calculateSummary,
  groupEntriesByWeek,
} from "@/utils/weight/calculations";

export function Dashboard() {
  const { entries, loading, error, addEntry } = useWeightEntries();

  const entriesWithChange = addChangesToEntries(entries);
  const summary = calculateSummary(entries);
  const weeklySummaries = groupEntriesByWeek(entries);
  const hasEntries = entries.length > 0;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <DashboardHeader />

      {loading && (
        <Alert variant="info">Cargando registros…</Alert>
      )}

      {error && !loading && (
        <Alert variant="error">
          No se pudieron cargar los registros. {error}
        </Alert>
      )}

      <WeightForm onSubmit={addEntry} />

      {!loading && !hasEntries && <EmptyState />}

      {hasEntries && (
        <>
          <WeightSummaryCards summary={summary} />
          <WeightChart entries={entries} />
          <WeeklySummaryTable weeks={weeklySummaries} />
          <section aria-label="Registros de peso">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Registros
            </h2>
            <WeightTable entries={entriesWithChange} />
            <WeightList entries={entriesWithChange} />
          </section>
        </>
      )}
    </div>
  );
}
