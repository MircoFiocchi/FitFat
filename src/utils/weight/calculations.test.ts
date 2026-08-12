import { describe, it, expect } from "vitest";
import {
  calculateChange,
  formatWeightChange,
  addChangesToEntries,
  calculateSummary,
  groupEntriesByWeek,
} from "@/utils/weight/calculations";
import type { WeightEntry } from "@/types/weight";

function makeEntry(
  id: string,
  weight: number,
  date: Date,
): WeightEntry {
  return { id, weight, date, createdAt: date };
}

describe("calculateChange", () => {
  it("calculates positive change", () => {
    expect(calculateChange(85, 84)).toBe(1);
  });

  it("calculates negative change", () => {
    expect(calculateChange(83, 84)).toBe(-1);
  });
});

describe("formatWeightChange", () => {
  it("formats null as em dash", () => {
    expect(formatWeightChange(null)).toBe("—");
  });

  it("formats positive with plus sign", () => {
    expect(formatWeightChange(0.5)).toBe("+0.5 kg");
  });

  it("formats negative", () => {
    expect(formatWeightChange(-0.3)).toBe("-0.3 kg");
  });
});

describe("addChangesToEntries", () => {
  it("adds change relative to older entry", () => {
    const entries = [
      makeEntry("1", 85, new Date(2026, 7, 10)),
      makeEntry("2", 84.5, new Date(2026, 7, 11)),
      makeEntry("3", 84, new Date(2026, 7, 12)),
    ];
    const result = addChangesToEntries(entries);
    expect(result[0].change).toBe(-0.5);
    expect(result[1].change).toBe(-0.5);
    expect(result[2].change).toBeNull();
  });
});

describe("calculateSummary", () => {
  it("returns nulls for empty entries", () => {
    const summary = calculateSummary([]);
    expect(summary.currentWeight).toBeNull();
    expect(summary.initialWeight).toBeNull();
  });

  it("calculates summary for entries", () => {
    const entries = [
      makeEntry("1", 85, new Date(2026, 7, 1)),
      makeEntry("2", 84, new Date(2026, 7, 15)),
    ];
    const summary = calculateSummary(entries);
    expect(summary.initialWeight).toBe(85);
    expect(summary.currentWeight).toBe(84);
    expect(summary.totalChange).toBe(-1);
  });
});

describe("groupEntriesByWeek", () => {
  it("groups entries by week starting Monday", () => {
    const entries = [
      makeEntry("1", 85, new Date(2026, 7, 10)), // Mon Aug 10
      makeEntry("2", 84.5, new Date(2026, 7, 12)), // Wed Aug 12
      makeEntry("3", 84, new Date(2026, 7, 17)), // Mon Aug 17 (next week)
    ];
    const weeks = groupEntriesByWeek(entries);
    expect(weeks.length).toBe(2);
    expect(weeks[0].startWeight).toBe(85);
    expect(weeks[0].endWeight).toBe(84.5);
    expect(weeks[1].startWeight).toBe(84);
  });
});
