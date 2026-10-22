"use client";

import { useEffect, useState } from "react";
import { levelColor } from "@/components/checker/level-scale";
import { evaluate, levelOrder } from "@/lib/triage/engine";
import { levelInfo } from "@/lib/triage/levels";
import type { TriageInput } from "@/lib/triage/types";

/** Real inputs run through the real rule engine, so the preview never drifts from the app */
const scenarios: { summary: string; input: TriageInput }[] = [
  {
    summary: "Fever, chills, 2 days",
    input: { symptoms: ["fever", "chills"], ageGroup: "adult", durationDays: 1, severity: "moderate" },
  },
  {
    summary: "Sore throat, runny nose",
    input: { symptoms: ["sore_throat", "runny_nose"], ageGroup: "adult", durationDays: 1, severity: "mild" },
  },
  {
    summary: "Cough for 3 weeks",
    input: { symptoms: ["cough"], ageGroup: "adult", durationDays: 14, severity: "mild" },
  },
  {
    summary: "Chest pain, short of breath",
    input: { symptoms: ["chest_pain", "shortness_of_breath"], ageGroup: "older", durationDays: 0, severity: "severe" },
  },
];

const examples = scenarios.map((s) => {
  const result = evaluate(s.input);
  return { summary: s.summary, level: result.level, reason: result.reasons[0]?.reason ?? levelInfo[result.level].action };
});

/** Least to most severe, left to right */
const scale = [...levelOrder].reverse();

const sampleClinics = [
  { name: "General Hospital", type: "Hospital", distance: "1.2 km" },
  { name: "Primary Health Centre", type: "Clinic", distance: "1.9 km" },
  { name: "Family Medical Clinic", type: "Clinic", distance: "2.4 km" },
];

const INTERVAL_MS = 4500;

export function ExampleResult() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % examples.length), INTERVAL_MS);
    return () => clearTimeout(id);
  }, [index, paused]);

  const example = examples[index];
  const color = levelColor[example.level];
  const position = scale.indexOf(example.level);

  return (
    <figure
      className="relative rounded-2xl border border-line bg-paper p-6 shadow-[0_1px_0_rgb(29_28_26/0.04),0_30px_60px_-30px_rgb(29_28_26/0.28)] sm:p-8"
      aria-label="Example results from the symptom checker"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <figcaption className="flex items-center justify-between gap-4 text-xs text-muted">
        <span className="font-semibold uppercase tracking-[0.14em]">Example result</span>
        <span key={example.summary} className="animate-fade truncate">
          {example.summary}
        </span>
      </figcaption>

      <div className="mt-6" aria-hidden="true">
        <div className="relative grid grid-cols-4 gap-1.5">
          {scale.map((l) => (
            <span key={l} className="h-1.5 rounded-full bg-sand" />
          ))}
          <span
            className={`absolute inset-y-0 left-0 w-[calc((100%-1.125rem)/4)] rounded-full transition-[transform,background-color] duration-700 ease-[var(--ease-in-out-quart)] ${color.bar}`}
            style={{ transform: `translateX(calc(${position} * (100% + 0.375rem)))` }}
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5 text-[11px] text-muted">
          {scale.map((l) => (
            <span
              key={l}
              className={`transition-colors duration-500 ${l === example.level ? `font-semibold ${levelColor[l].text}` : ""}`}
            >
              {levelInfo[l].label}
            </span>
          ))}
        </div>
      </div>

      <div key={index} className="min-h-[7.5rem] sm:min-h-[6.5rem]">
        <p className="mt-7 animate-rise font-display text-2xl font-semibold leading-snug tracking-tight text-ink">
          {levelInfo[example.level].headline}
        </p>
        <p className="mt-2 animate-rise text-sm leading-relaxed text-ink-2 [animation-delay:80ms]">{example.reason}</p>
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Nearby</p>
        <ul className="mt-3 divide-y divide-line">
          {sampleClinics.map((c, i) => {
            const dimmed = example.level === "emergency" && c.type !== "Hospital";
            return (
              <li
                key={c.name}
                className={`flex items-center justify-between py-2.5 text-sm transition-opacity duration-500 ${dimmed ? "opacity-35" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span>
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="ml-2 text-muted">{c.type}</span>
                </span>
                <span className="tabular-nums text-muted">{c.distance}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5 flex gap-1.5" role="tablist" aria-label="Choose an example">
        {examples.map((e, i) => (
          <button
            key={e.summary}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={e.summary}
            onClick={() => setIndex(i)}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-sand"
          >
            {i === index && (
              <span
                key={`${index}-${paused}`}
                className={`absolute inset-0 origin-left rounded-full bg-ink/40 ${paused ? "" : "animate-[grow-x_4.5s_linear_both]"}`}
                style={{ animationDuration: `${INTERVAL_MS}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </figure>
  );
}
