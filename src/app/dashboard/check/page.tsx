import type { Metadata } from "next";
import { SymptomChecker } from "@/components/checker/symptom-checker";
import { PageHeader } from "@/components/dashboard/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Symptom check" };

export default function CheckPage() {
  return (
    <>
      <PageHeader
        eyebrow="Symptom check"
        title="How are you feeling?"
        description={`If someone is unconscious, struggling to breathe or bleeding heavily, stop here and call ${site.emergencyNumber}.`}
      />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <SymptomChecker />
      </div>
    </>
  );
}
