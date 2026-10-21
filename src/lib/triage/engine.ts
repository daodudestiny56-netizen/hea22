import { rules as defaultRules } from "./rules";
import type { Rule, RuleCondition, TriageInput, TriageLevel, TriageResult } from "./types";

/** Most severe first */
export const levelOrder: TriageLevel[] = ["emergency", "urgent", "soon", "self-care"];

export function matches(condition: RuleCondition, input: TriageInput): boolean {
  const present = new Set(input.symptoms);

  if (condition.all && !condition.all.every((id) => present.has(id))) return false;
  if (condition.any && !condition.any.some((id) => present.has(id))) return false;
  if (condition.ageGroups && !condition.ageGroups.includes(input.ageGroup)) return false;
  if (condition.minDurationDays !== undefined && input.durationDays < condition.minDurationDays) return false;
  if (condition.severities && !condition.severities.includes(input.severity)) return false;

  return true;
}

export function evaluate(input: TriageInput, rules: Rule[] = defaultRules): TriageResult {
  const matched = rules.filter((rule) => matches(rule.when, input));

  if (matched.length === 0) {
    return { level: "self-care", reasons: [], otherFindings: [] };
  }

  const rank = (level: TriageLevel) => levelOrder.indexOf(level);
  const level = matched.reduce<TriageLevel>(
    (best, rule) => (rank(rule.level) < rank(best) ? rule.level : best),
    "self-care",
  );

  return {
    level,
    reasons: matched.filter((rule) => rule.level === level),
    otherFindings: matched.filter((rule) => rule.level !== level),
  };
}
