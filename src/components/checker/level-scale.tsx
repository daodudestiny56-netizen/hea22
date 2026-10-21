import { levelOrder } from "@/lib/triage/engine";
import { levelInfo } from "@/lib/triage/levels";
import type { TriageLevel } from "@/lib/triage/types";

export const levelColor: Record<TriageLevel, { bar: string; text: string; soft: string; border: string }> = {
  emergency: { bar: "bg-emergency", text: "text-emergency", soft: "bg-emergency-soft", border: "border-emergency/25" },
  urgent: { bar: "bg-urgent", text: "text-urgent", soft: "bg-urgent-soft", border: "border-urgent/25" },
  soon: { bar: "bg-soon", text: "text-soon", soft: "bg-soon-soft", border: "border-soon/25" },
  "self-care": { bar: "bg-selfcare", text: "text-selfcare", soft: "bg-selfcare-soft", border: "border-selfcare/25" },
};

/** Least to most severe, left to right */
const scale = [...levelOrder].reverse();

export function LevelScale({ level }: { level: TriageLevel }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {scale.map((l) => (
          <span key={l} className={`h-1.5 rounded-full ${l === level ? levelColor[l].bar : "bg-sand"}`} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5 text-[11px] text-muted sm:text-xs">
        {scale.map((l) => (
          <span key={l} className={l === level ? `font-semibold ${levelColor[l].text}` : ""}>
            {levelInfo[l].label}
          </span>
        ))}
      </div>
    </div>
  );
}
