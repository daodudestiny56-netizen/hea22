"use client";

import { ageGroups, durations, severities } from "@/lib/triage/symptoms";
import type { AgeGroup, Severity } from "@/lib/triage/types";

export interface Details {
  ageGroup: AgeGroup | null;
  durationDays: number | null;
  severity: Severity | null;
}

const option =
  "flex cursor-pointer rounded-md border border-line bg-paper px-3.5 py-3 text-sm transition-colors hover:border-ink/30 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-accent";

export function DetailsStep({ details, onChange }: { details: Details; onChange: (d: Details) => void }) {
  return (
    <div className="space-y-9">
      <fieldset>
        <legend className="font-semibold">Who is this for?</legend>
        <p className="mt-1 text-sm text-muted">Choose the age group of the person who is unwell.</p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {ageGroups.map((a) => (
            <label key={a.value} className={`${option} justify-center text-center`}>
              <input
                type="radio"
                name="age"
                className="sr-only"
                checked={details.ageGroup === a.value}
                onChange={() => onChange({ ...details, ageGroup: a.value })}
              />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold">How long has it been going on?</legend>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
          {durations.map((d) => (
            <label key={d.value} className={`${option} justify-center text-center`}>
              <input
                type="radio"
                name="duration"
                className="sr-only"
                checked={details.durationDays === d.value}
                onChange={() => onChange({ ...details, durationDays: d.value })}
              />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold">How bad is it?</legend>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {severities.map((s) => (
            <label key={s.value} className={`${option} group flex-col gap-1`}>
              <input
                type="radio"
                name="severity"
                className="sr-only"
                checked={details.severity === s.value}
                onChange={() => onChange({ ...details, severity: s.value })}
              />
              <span className="font-medium">{s.label}</span>
              <span className="text-xs text-muted group-has-checked:text-paper/70">{s.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
