import { Check, Cross } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const does = [
  "Checks for warning signs that need emergency care before anything else",
  "Explains the reason behind every suggestion",
  "Uses your location only in your browser, and only when you allow it",
  "Shows public map data from OpenStreetMap for nearby facilities",
];

const doesNot = [
  "Diagnose a condition or recommend specific medicines",
  "Replace a doctor, nurse, pharmacist or community health worker",
  "Save, share or sell anything you enter",
  "Guarantee that a listed facility is open or offers a given service",
];

export function ResponsibleUse() {
  return (
    <section id="responsible-use" className="scroll-mt-20 bg-[linear-gradient(180deg,#efebe4_0%,#f7f5f1_100%)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Responsible use</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A guide to the next step, not a diagnosis.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-line bg-paper p-7 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgb(29_28_26/0.25)] sm:p-9">
            <h3 className="text-sm font-semibold text-ink">What it does</h3>
            <ul className="mt-5 space-y-4">
              {does.map((item) => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <Check className="mt-1 shrink-0 text-selfcare" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-2xl border border-line bg-paper/60 p-7 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgb(29_28_26/0.25)] sm:p-9">
            <h3 className="text-sm font-semibold text-ink">What it does not do</h3>
            <ul className="mt-5 space-y-4">
              {doesNot.map((item) => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <Cross className="mt-1 shrink-0 text-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
