import Link from "next/link";
import { ArrowRight } from "@/components/icons";

const scale = [
  { label: "Self-care", className: "bg-selfcare" },
  { label: "Soon", className: "bg-soon" },
  { label: "Urgent", className: "bg-urgent" },
  { label: "Emergency", className: "bg-emergency" },
];

const sampleClinics = [
  { name: "General Hospital", type: "Hospital", distance: "1.2 km" },
  { name: "Primary Health Centre", type: "Clinic", distance: "1.9 km" },
  { name: "Family Medical Clinic", type: "Clinic", distance: "2.4 km" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f5f1_0%,#ece7de_100%)]">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Symptom checker and clinic locator
          </p>
          <h1 className="mt-5 text-balance font-serif text-[2.6rem] leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Know how soon to seek care, <em className="text-accent">and where to go.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
            Answer a few questions about how you feel. We suggest whether to call 112, see a doctor today or rest at
            home, then show clinics and hospitals near you.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/check"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink-2"
            >
              Check your symptoms
              <ArrowRight />
            </Link>
            <Link
              href="/dashboard/clinics"
              className="inline-flex items-center justify-center rounded-md border border-ink/15 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-paper"
            >
              Find a clinic near you
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line text-sm">
            <div className="py-4 pr-4">
              <dt className="text-muted">Cost</dt>
              <dd className="mt-1 font-medium">Free</dd>
            </div>
            <div className="px-4 py-4">
              <dt className="text-muted">Account</dt>
              <dd className="mt-1 font-medium">Not needed</dd>
            </div>
            <div className="py-4 pl-4">
              <dt className="text-muted">Your data</dt>
              <dd className="mt-1 font-medium">Not stored</dd>
            </div>
          </dl>
        </div>

        <figure
          className="relative rounded-xl border border-line bg-paper p-6 shadow-[0_1px_0_rgb(29_28_26/0.04),0_24px_48px_-24px_rgb(29_28_26/0.18)] sm:p-8"
          aria-label="Example of an assessment result"
        >
          <figcaption className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-[0.14em]">Example result</span>
            <span>Fever, chills, 2 days</span>
          </figcaption>

          <div className="mt-6">
            <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
              {scale.map((s) => (
                <span key={s.label} className={`h-1.5 rounded-full ${s.label === "Urgent" ? s.className : "bg-sand"}`} />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5 text-[11px] text-muted">
              {scale.map((s) => (
                <span key={s.label} className={s.label === "Urgent" ? "font-semibold text-urgent" : ""}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-7 font-serif text-2xl leading-snug text-ink">See a doctor today</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Fever with chills can be malaria. Get a malaria test within 24 hours.
          </p>

          <div className="mt-7 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Nearby</p>
            <ul className="mt-3 divide-y divide-line">
              {sampleClinics.map((c) => (
                <li key={c.name} className="flex items-center justify-between py-2.5 text-sm">
                  <span>
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="ml-2 text-muted">{c.type}</span>
                  </span>
                  <span className="tabular-nums text-muted">{c.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </figure>
      </div>
    </section>
  );
}
