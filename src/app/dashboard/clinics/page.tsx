import type { Metadata } from "next";
import { ClinicFinder } from "@/components/clinics/clinic-finder";
import { levelColor } from "@/components/checker/level-scale";
import { PageHeader } from "@/components/dashboard/page-header";
import { site } from "@/lib/site";
import { levelInfo } from "@/lib/triage/levels";
import type { TriageLevel } from "@/lib/triage/types";

export const metadata: Metadata = { title: "Clinic finder" };

function isLevel(value: unknown): value is TriageLevel {
  return typeof value === "string" && value in levelInfo;
}

export default async function ClinicsPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const triage = isLevel(level) ? level : null;

  return (
    <>
      <PageHeader
        eyebrow="Clinic finder"
        title="Find care near you"
        description="Hospitals, clinics and doctors' offices from OpenStreetMap, sorted by distance."
      />
      <div className="mx-auto max-w-6xl space-y-4 px-5 py-8 sm:px-8">
        {triage && (
          <div
            className={`rounded-xl border px-5 py-4 text-sm ${levelColor[triage].border} ${levelColor[triage].soft}`}
          >
            <p className={`font-semibold ${levelColor[triage].text}`}>Your result: {levelInfo[triage].label}</p>
            <p className="mt-1 text-ink-2">
              {triage === "emergency"
                ? `Showing hospitals only. If you cannot get to one quickly, call ${site.emergencyNumber} now.`
                : levelInfo[triage].headline + "."}
            </p>
          </div>
        )}
        <ClinicFinder initialFilter={triage === "emergency" ? "hospital" : "all"} />
      </div>
    </>
  );
}
