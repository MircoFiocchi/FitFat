import { describe, it, expect } from "vitest";
import {
  buildRecommendationPrompt,
  parseRecommendationsJson,
  selectRecentEntries,
} from "@/utils/recommendations/prompt";
import type { RecommendationEntryInput } from "@/types/recommendation";

const sample: RecommendationEntryInput = {
  date: "2026-08-12",
  weight: 84.5,
  note: "comí afuera",
  change: 0.4,
};

describe("selectRecentEntries", () => {
  it("keeps the 14 most recent entries", () => {
    const entries = Array.from({ length: 20 }, (_, index) => ({
      ...sample,
      date: `2026-08-${String(index + 1).padStart(2, "0")}`,
    }));
    expect(selectRecentEntries(entries)).toHaveLength(14);
  });
});

describe("buildRecommendationPrompt", () => {
  it("includes weight notes in the prompt", () => {
    const prompt = buildRecommendationPrompt([sample]);
    expect(prompt).toContain("84.5 kg");
    expect(prompt).toContain("comí afuera");
  });
});

describe("parseRecommendationsJson", () => {
  it("parses a JSON object with tips", () => {
    const tips = parseRecommendationsJson(
      '{"recommendations":["Tomá más agua","Priorizá verdura"]}',
    );
    expect(tips).toEqual(["Tomá más agua", "Priorizá verdura"]);
  });

  it("throws when recommendations are missing", () => {
    expect(() => parseRecommendationsJson("{}")).toThrow();
  });
});
