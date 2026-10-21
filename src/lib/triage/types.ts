export type TriageLevel = "emergency" | "urgent" | "soon" | "self-care";

export type AgeGroup = "infant" | "child" | "adult" | "older";

export type Severity = "mild" | "moderate" | "severe";

export interface Symptom {
  id: string;
  label: string;
  hint?: string;
  category: string;
}

export interface TriageInput {
  symptoms: string[];
  ageGroup: AgeGroup;
  durationDays: number;
  severity: Severity;
}

export interface RuleCondition {
  /** Every listed symptom must be present */
  all?: string[];
  /** At least one listed symptom must be present */
  any?: string[];
  ageGroups?: AgeGroup[];
  minDurationDays?: number;
  severities?: Severity[];
}

export interface Rule {
  id: string;
  level: TriageLevel;
  when: RuleCondition;
  reason: string;
}

export interface TriageResult {
  level: TriageLevel;
  /** Rules that produced the final level, most relevant first */
  reasons: Rule[];
  /** Lower-level rules that also matched, shown as context */
  otherFindings: Rule[];
}
