import { describe, expect, it } from "vitest";
import { evaluate, matches } from "./engine";
import { rules } from "./rules";
import { symptomById } from "./symptoms";
import type { TriageInput } from "./types";

const base: TriageInput = { symptoms: [], ageGroup: "adult", durationDays: 0, severity: "mild" };
const check = (overrides: Partial<TriageInput>) => evaluate({ ...base, ...overrides });

describe("matches", () => {
  it("requires every symptom in `all`", () => {
    expect(matches({ all: ["fever", "chills"] }, { ...base, symptoms: ["fever"] })).toBe(false);
    expect(matches({ all: ["fever", "chills"] }, { ...base, symptoms: ["fever", "chills"] })).toBe(true);
  });

  it("requires at least one symptom in `any`", () => {
    expect(matches({ any: ["rash", "cough"] }, { ...base, symptoms: ["cough"] })).toBe(true);
    expect(matches({ any: ["rash", "cough"] }, { ...base, symptoms: ["fever"] })).toBe(false);
  });

  it("checks age, duration and severity", () => {
    expect(matches({ ageGroups: ["infant"] }, base)).toBe(false);
    expect(matches({ minDurationDays: 7 }, { ...base, durationDays: 7 })).toBe(true);
    expect(matches({ minDurationDays: 7 }, { ...base, durationDays: 3 })).toBe(false);
    expect(matches({ severities: ["severe"] }, { ...base, severity: "moderate" })).toBe(false);
  });
});

describe("evaluate", () => {
  it("falls back to self-care when nothing matches", () => {
    const result = check({ symptoms: ["runny_nose", "sore_throat"] });
    expect(result.level).toBe("self-care");
    expect(result.reasons).toHaveLength(0);
  });

  it("treats stroke signs as an emergency", () => {
    expect(check({ symptoms: ["stroke_signs"] }).level).toBe("emergency");
  });

  it("treats chest pain with breathlessness as an emergency", () => {
    expect(check({ symptoms: ["chest_pain", "shortness_of_breath"] }).level).toBe("emergency");
  });

  it("treats mild chest pain alone as urgent", () => {
    expect(check({ symptoms: ["chest_pain"] }).level).toBe("urgent");
  });

  it("flags the malaria pattern as urgent", () => {
    const result = check({ symptoms: ["fever", "chills"] });
    expect(result.level).toBe("urgent");
    expect(result.reasons.map((r) => r.id)).toContain("malaria-pattern");
  });

  it("escalates fever in infants", () => {
    expect(check({ symptoms: ["fever"] }).level).toBe("soon");
    expect(check({ symptoms: ["fever"], ageGroup: "infant" }).level).toBe("urgent");
  });

  it("flags a cough lasting over two weeks", () => {
    expect(check({ symptoms: ["cough"], durationDays: 1 }).level).toBe("self-care");
    expect(check({ symptoms: ["cough"], durationDays: 14 }).level).toBe("soon");
  });

  it("returns the most severe level and keeps lower findings as context", () => {
    const result = check({ symptoms: ["seizure", "rash"] });
    expect(result.level).toBe("emergency");
    expect(result.otherFindings.map((r) => r.id)).toContain("rash");
  });
});

describe("rules", () => {
  it("only reference symptoms that exist", () => {
    for (const rule of rules) {
      for (const id of [...(rule.when.all ?? []), ...(rule.when.any ?? [])]) {
        expect(symptomById.has(id), `${rule.id} references unknown symptom ${id}`).toBe(true);
      }
    }
  });

  it("have unique ids", () => {
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
