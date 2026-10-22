import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ExampleResult } from "./example-result";

const facts = [
  { label: "Cost", value: "Free" },
  { label: "Account", value: "Not needed" },
  { label: "Your data", value: "Not stored" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(55%_60%_at_85%_15%,#e1e8e3_0%,transparent_70%),radial-gradient(40%_50%_at_0%_100%,#e9e1d4_0%,transparent_70%),linear-gradient(180deg,#f7f5f1_0%,#ece7de_100%)]">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
        <div>
          <p className="flex animate-rise items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            <span className="h-px w-8 bg-muted/50" aria-hidden="true" />
            Symptom checker and clinic locator
          </p>
          <h1 className="mt-5 animate-rise text-balance font-display text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-ink [animation-delay:80ms] sm:text-[4.1rem]">
            Know how soon to seek care, <span className="text-accent">and where to go.</span>
          </h1>
          <p className="mt-6 max-w-lg animate-rise text-lg leading-relaxed text-ink-2 [animation-delay:160ms]">
            Answer a few questions about how you feel. We suggest whether to call 112, see a doctor today or rest at
            home, then show clinics and hospitals near you.
          </p>

          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center">
            <Link href="/dashboard/check" className="btn btn-primary px-6 py-3.5 text-sm">
              Check your symptoms
              <ArrowRight className="nudge" />
            </Link>
            <Link href="/dashboard/clinics" className="btn btn-secondary px-6 py-3.5 text-sm">
              Find a clinic near you
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md animate-rise grid-cols-3 divide-x divide-line border-y border-line text-sm [animation-delay:320ms]">
            {facts.map((f, i) => (
              <div key={f.label} className={`py-4 ${i === 0 ? "pr-4" : i === facts.length - 1 ? "pl-4" : "px-4"}`}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="mt-1 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-rise [animation-delay:300ms] [animation-duration:1s]">
          <ExampleResult />
        </div>
      </div>
    </section>
  );
}
