"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/icons";
import { evaluate } from "@/lib/triage/engine";
import type { TriageInput, TriageResult as Result } from "@/lib/triage/types";
import { DetailsStep, type Details } from "./details-step";
import { SymptomStep } from "./symptom-step";
import { TriageResult } from "./triage-result";

type Step = "symptoms" | "details" | "result";

const steps: { id: Step; label: string }[] = [
  { id: "symptoms", label: "Symptoms" },
  { id: "details", label: "Details" },
  { id: "result", label: "Result" },
];

const emptyDetails: Details = { ageGroup: null, durationDays: null, severity: null };

export function SymptomChecker() {
  const [step, setStep] = useState<Step>("symptoms");
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [outcome, setOutcome] = useState<{ input: TriageInput; result: Result } | null>(null);

  const detailsComplete = details.ageGroup !== null && details.durationDays !== null && details.severity !== null;

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function go(next: Step) {
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  function submit() {
    if (!detailsComplete) return;
    const input: TriageInput = {
      symptoms: selected,
      ageGroup: details.ageGroup!,
      durationDays: details.durationDays!,
      severity: details.severity!,
    };
    setOutcome({ input, result: evaluate(input) });
    go("result");
  }

  function restart() {
    setSelected([]);
    setDetails(emptyDetails);
    setOutcome(null);
    go("symptoms");
  }

  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div>
      <ol className="mb-6 flex items-center gap-3 text-sm" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3">
            <span
              aria-current={i === currentIndex ? "step" : undefined}
              className={`flex items-center gap-2 ${i <= currentIndex ? "text-ink" : "text-muted"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs tabular-nums ${
                  i < currentIndex
                    ? "bg-accent text-paper"
                    : i === currentIndex
                      ? "bg-ink text-paper"
                      : "border border-line bg-paper"
                }`}
              >
                {i + 1}
              </span>
              <span className={i === currentIndex ? "font-medium" : ""}>{s.label}</span>
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-line sm:w-10" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      {step === "symptoms" && (
        <Panel
          title="What are you feeling?"
          description="Select everything that applies. If you are not sure, choose the closest match."
          footer={
            <>
              <span className="text-sm text-muted">
                {selected.length === 0 ? "Nothing selected yet" : `${selected.length} selected`}
              </span>
              <PrimaryButton disabled={selected.length === 0} onClick={() => go("details")}>
                Continue
              </PrimaryButton>
            </>
          }
        >
          <SymptomStep selected={selected} onToggle={toggle} />
        </Panel>
      )}

      {step === "details" && (
        <Panel
          title="A few details"
          description="These help us judge how quickly you should be seen."
          footer={
            <>
              <button type="button" onClick={() => go("symptoms")} className="text-sm font-medium text-ink-2 hover:text-ink">
                Back
              </button>
              <PrimaryButton disabled={!detailsComplete} onClick={submit}>
                See my result
              </PrimaryButton>
            </>
          }
        >
          <DetailsStep details={details} onChange={setDetails} />
        </Panel>
      )}

      {step === "result" && outcome && <TriageResult {...outcome} onRestart={restart} />}
    </div>
  );
}

function Panel({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-paper">
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-ink-2">{description}</p>
      </div>
      <div className="px-6 py-6 sm:px-8">{children}</div>
      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-b-xl border-t border-line bg-paper/95 px-6 py-4 backdrop-blur sm:px-8">
        {footer}
      </div>
    </section>
  );
}

function PrimaryButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-2 disabled:cursor-not-allowed disabled:bg-ink/25"
    >
      {children}
      <ArrowRight />
    </button>
  );
}
