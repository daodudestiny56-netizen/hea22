import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { ArrowRight } from "@/components/icons";
import { levelOrder } from "@/lib/triage/engine";
import { levelInfo } from "@/lib/triage/levels";
import { rules } from "@/lib/triage/rules";
import { symptoms } from "@/lib/triage/symptoms";

export const metadata: Metadata = { title: "Dashboard" };

const levelStyles = {
  emergency: "bg-emergency",
  urgent: "bg-urgent",
  soon: "bg-soon",
  "self-care": "bg-selfcare",
} as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="What would you like to do?"
        description="Start with a symptom check if you are unsure how serious things are, or go straight to the map if you already know you need a clinic."
      />

      <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            href="/dashboard/check"
            title="Check your symptoms"
            body="Pick what you are feeling, add a few details and get a suggested next step with the reasons behind it."
            meta={`${symptoms.length} symptoms, about 2 minutes`}
          />
          <ActionCard
            href="/dashboard/clinics"
            title="Find a clinic or hospital"
            body="Use your location or search for a town to see facilities nearby on an OpenStreetMap map."
            meta="Hospitals, clinics and doctors"
          />
        </div>

        <section className="rounded-xl border border-line bg-paper">
          <div className="flex flex-col gap-1 border-b border-line px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-semibold">The four levels of advice</h2>
            <p className="text-sm text-muted">Based on {rules.length} transparent rules</p>
          </div>
          <ul className="divide-y divide-line">
            {levelOrder.map((level) => (
              <li key={level} className="grid gap-2 px-6 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <span className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className={`h-2.5 w-2.5 rounded-full ${levelStyles[level]}`} aria-hidden="true" />
                  {levelInfo[level].label}
                </span>
                <span className="text-sm text-ink-2">{levelInfo[level].headline}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Note title="Warning signs first">
            Emergency rules are checked before anything else, so a serious sign is never hidden by milder ones.
          </Note>
          <Note title="Nothing is stored">
            Your answers stay in this browser tab. Close or refresh it and they are gone.
          </Note>
          <Note title="Map data is community-made">
            Facility listings come from OpenStreetMap. Call ahead to confirm opening hours and services.
          </Note>
        </section>
      </div>
    </>
  );
}

function ActionCard({ href, title, body, meta }: { href: string; title: string; body: string; meta: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-line bg-paper p-6 transition-colors hover:border-ink/25"
    >
      <span className="text-xs text-muted">{meta}</span>
      <span className="mt-3 font-display font-semibold text-2xl tracking-tight">{title}</span>
      <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{body}</span>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
        Start
        <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-paper/60 p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}
