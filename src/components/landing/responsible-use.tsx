import { Check, Cross } from "@/components/icons";

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
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Responsible use</p>
        <h2 className="mt-4 max-w-2xl font-display font-semibold text-4xl leading-tight tracking-tight sm:text-5xl">
          A guide to the next step, not a diagnosis.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
          <div className="bg-paper p-7 sm:p-9">
            <h3 className="text-sm font-semibold text-ink">What it does</h3>
            <ul className="mt-5 space-y-4">
              {does.map((item) => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <Check className="mt-1 shrink-0 text-selfcare" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-paper p-7 sm:p-9">
            <h3 className="text-sm font-semibold text-ink">What it does not do</h3>
            <ul className="mt-5 space-y-4">
              {doesNot.map((item) => (
                <li key={item} className="flex gap-3 text-ink-2">
                  <Cross className="mt-1 shrink-0 text-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
