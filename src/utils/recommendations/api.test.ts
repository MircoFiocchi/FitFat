import { describe, it, expect } from "vitest";
import { parseRecommendationEntries } from "@/app/api/recommendations/parse-request";
import {
  parseApiError,
  parseRecommendationsPayload,
} from "@/utils/recommendations/api";

describe("parseRecommendationEntries", () => {
  it("returns entries from a valid body", () => {
    const entries = parseRecommendationEntries({
      entries: [
        { date: "2026-08-12", weight: 84.5, note: "entrené", change: -0.3 },
      ],
    });
    expect(entries).toHaveLength(1);
    expect(entries?.[0].weight).toBe(84.5);
  });

  it("returns null for an empty payload", () => {
    expect(parseRecommendationEntries({ entries: [] })).toBeNull();
    expect(parseRecommendationEntries({})).toBeNull();
  });
});

describe("parseRecommendationsPayload", () => {
  it("extracts string tips", () => {
    expect(
      parseRecommendationsPayload({ recommendations: ["Tomá agua", ""] }),
    ).toEqual(["Tomá agua"]);
  });
});

describe("parseApiError", () => {
  it("reads error message from json", () => {
    expect(parseApiError({ error: "falló" }, "fallback")).toBe("falló");
  });
});
