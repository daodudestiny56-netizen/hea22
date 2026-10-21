import Link from "next/link";
import { ArrowRight, Phone } from "@/components/icons";
import { site } from "@/lib/site";
import { levelInfo } from "@/lib/triage/levels";
import { symptomById } from "@/lib/triage/symptoms";
import type { TriageInput, TriageResult as Result } from "@/lib/triage/types";
import { LevelScale, levelColor } from "./level-scale";

export function TriageResult({ input, result, onRestart }: { input: TriageInput; result: Result; onRestart: () => void }) {
  const info = levelInfo[result.level];
  const color = levelColor[result.level];
  const isEmergency = result.level === "emergency";

  return (
    <div className="space-y-5" aria-live="polite">
      <section className={`rounded-xl border ${color.border} bg-paper`}>
        <div className={`rounded-t-xl px-6 py-6 sm:px-8 ${color.soft}`}>
          <LevelScale level={result.level} />
          <p className={`mt-6 text-xs font-semibold uppercase tracking-[0.16em] ${color.text}`}>{info.label}</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{info.headline}</h2>
          <p className="mt-3 max-w-2xl text-ink-2">{info.action}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isEmergency && (
              <a
                href={`tel:${site.emergencyNumber}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emergency px-5 py-3 text-sm font-semibold text-paper hover:bg-emergency/90"
              >
                <Phone />
                Call {site.emergencyNumber} now
              </a>
            )}
            <Link
              href={`/dashboard/clinics?level=${result.level}`}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium ${
                isEmergency ? "border border-ink/20 text-ink hover:bg-paper" : "bg-ink text-paper hover:bg-ink-2"
              }`}
            >
              {isEmergency ? "Find the nearest hospital" : "Find care nearby"}
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-6 sm:px-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Why we suggest this</h3>
            {result.reasons.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {result.reasons.map((r) => (
                  <li key={r.id} className={`border-l-2 pl-3 text-sm leading-relaxed text-ink-2 ${color.border}`}>
                    {r.reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                None of the warning signs or patterns in our rules matched what you selected.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold">What you can do now</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-2 marker:text-muted">
              {info.advice.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.otherFindings.length > 0 && (
          <div className="border-t border-line px-6 py-5 sm:px-8">
            <h3 className="text-sm font-semibold">Also worth mentioning to a health worker</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-2">
              {result.otherFindings.map((r) => (
                <li key={r.id}>{r.reason}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-line bg-paper px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="text-sm">
          <p className="font-semibold">You told us</p>
          <p className="mt-1 text-ink-2">{input.symptoms.map((id) => symptomById.get(id)?.label).join(", ")}</p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="shrink-0 rounded-md border border-line px-4 py-2.5 text-sm font-medium hover:border-ink/30"
        >
          Start a new check
        </button>
      </section>

      <p className="text-xs leading-relaxed text-muted">
        This suggestion comes from a fixed set of rules, not a medical professional. If you feel worse, or something
        does not seem right, seek care anyway. Trust your instincts.
      </p>
    </div>
  );
}
