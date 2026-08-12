import { describe, it, expect } from "vitest";
import {
  getWeekStart,
  getWeekEnd,
  getWeekKey,
  sortEntriesByDateAsc,
  sortEntriesByDateDesc,
  parseDateInputValue,
  toDateInputValue,
} from "@/utils/date/weight-week";
import type { WeightEntry } from "@/types/weight";

describe("getWeekStart", () => {
  it("returns Monday for a mid-week date", () => {
    const thu = new Date(2026, 7, 13); // Thu Aug 13 2026
    const start = getWeekStart(thu);
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(10);
  });

  it("returns previous Monday for a Sunday", () => {
    const sun = new Date(2026, 7, 16); // Sun Aug 16 2026
    const start = getWeekStart(sun);
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(10);
  });
});

describe("getWeekEnd", () => {
  it("returns Sunday of the same week", () => {
    const thu = new Date(2026, 7, 13);
    const end = getWeekEnd(thu);
    expect(end.getDay()).toBe(0);
    expect(end.getDate()).toBe(16);
  });
});

describe("getWeekKey", () => {
  it("uses Monday date as key", () => {
    const key = getWeekKey(new Date(2026, 7, 13));
    expect(key).toBe("2026-08-10");
  });
});

describe("sortEntriesByDateAsc", () => {
  it("sorts oldest first", () => {
    const entries: WeightEntry[] = [
      { id: "2", weight: 84, date: new Date(2026, 7, 12), createdAt: new Date() },
      { id: "1", weight: 85, date: new Date(2026, 7, 10), createdAt: new Date() },
    ];
    const sorted = sortEntriesByDateAsc(entries);
    expect(sorted[0].id).toBe("1");
    expect(sorted[1].id).toBe("2");
  });
});

describe("sortEntriesByDateDesc", () => {
  it("sorts newest first", () => {
    const entries: WeightEntry[] = [
      { id: "1", weight: 85, date: new Date(2026, 7, 10), createdAt: new Date() },
      { id: "2", weight: 84, date: new Date(2026, 7, 12), createdAt: new Date() },
    ];
    const sorted = sortEntriesByDateDesc(entries);
    expect(sorted[0].id).toBe("2");
  });
});

describe("parseDateInputValue", () => {
  it("parses valid date string", () => {
    const date = parseDateInputValue("2026-08-12");
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2026);
    expect(date!.getMonth()).toBe(7);
    expect(date!.getDate()).toBe(12);
  });

  it("returns null for invalid date", () => {
    expect(parseDateInputValue("2026-13-40")).toBeNull();
    expect(parseDateInputValue("invalid")).toBeNull();
  });
});

describe("toDateInputValue", () => {
  it("formats date for input", () => {
    expect(toDateInputValue(new Date(2026, 7, 12))).toBe("2026-08-12");
  });
});
