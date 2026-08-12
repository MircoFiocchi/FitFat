import { describe, it, expect } from "vitest";
import { validateWeightForm, validateWeight, parseWeightValue } from "@/utils/weight/validation";

describe("validateWeight", () => {
  it("requires weight", () => {
    expect(validateWeight("")).toBe("El peso es obligatorio");
  });

  it("rejects non-numeric weight", () => {
    expect(validateWeight("abc")).toBe("El peso debe ser un número");
  });

  it("rejects zero or negative weight", () => {
    expect(validateWeight("0")).toBe("El peso debe ser mayor que 0");
    expect(validateWeight("-5")).toBe("El peso debe ser mayor que 0");
  });

  it("rejects out of range weight", () => {
    expect(validateWeight("500")).toContain("entre");
  });

  it("passes valid weight", () => {
    expect(validateWeight("84.5")).toBeUndefined();
  });
});

describe("validateWeightForm", () => {
  it("requires weight", () => {
    const errors = validateWeightForm({ weight: "", date: "2026-08-12" });
    expect(errors.weight).toBeDefined();
  });

  it("rejects non-numeric weight", () => {
    const errors = validateWeightForm({ weight: "abc", date: "2026-08-12" });
    expect(errors.weight).toBe("El peso debe ser un número");
  });

  it("rejects zero or negative weight", () => {
    expect(validateWeightForm({ weight: "0", date: "2026-08-12" }).weight).toBe(
      "El peso debe ser mayor que 0",
    );
    expect(validateWeightForm({ weight: "-5", date: "2026-08-12" }).weight).toBe(
      "El peso debe ser mayor que 0",
    );
  });

  it("rejects out of range weight", () => {
    const errors = validateWeightForm({ weight: "500", date: "2026-08-12" });
    expect(errors.weight).toContain("entre");
  });

  it("requires valid date", () => {
    const errors = validateWeightForm({ weight: "84.5", date: "" });
    expect(errors.date).toBe("La fecha es obligatoria");
  });

  it("passes valid form", () => {
    const errors = validateWeightForm({ weight: "84.5", date: "2026-08-12" });
    expect(Object.keys(errors).length).toBe(0);
  });
});

describe("parseWeightValue", () => {
  it("parses valid number", () => {
    expect(parseWeightValue("84.5")).toBe(84.5);
  });

  it("returns null for invalid", () => {
    expect(parseWeightValue("")).toBeNull();
    expect(parseWeightValue("abc")).toBeNull();
  });
});
