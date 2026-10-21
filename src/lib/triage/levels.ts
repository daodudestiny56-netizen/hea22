import type { TriageLevel } from "./types";

export interface LevelInfo {
  label: string;
  headline: string;
  action: string;
  advice: string[];
  /** Facility types to suggest in the clinic finder */
  facilities: ("hospital" | "clinic" | "doctors")[];
}

export const levelInfo: Record<TriageLevel, LevelInfo> = {
  emergency: {
    label: "Emergency",
    headline: "Call 112 or go to the nearest emergency department now",
    action: "Do not wait or drive yourself if you feel faint. Ask someone to take you or call 112.",
    advice: [
      "Stay with someone until help arrives.",
      "Do not eat or drink unless a health worker tells you to.",
      "Bring any medicines you take, or a list of them.",
    ],
    facilities: ["hospital"],
  },
  urgent: {
    label: "Urgent",
    headline: "See a doctor today",
    action: "Visit a clinic or hospital today. If things get worse before then, call 112.",
    advice: [
      "Go today rather than waiting for a booked appointment.",
      "Keep drinking small amounts of water often.",
      "Note when your symptoms started and anything that makes them better or worse.",
    ],
    facilities: ["hospital", "clinic"],
  },
  soon: {
    label: "Soon",
    headline: "Book a clinic visit in the next few days",
    action: "Your symptoms are worth checking, but they do not appear to need same-day care.",
    advice: [
      "Rest and drink plenty of fluids.",
      "Avoid starting antibiotics or antimalarials without a test.",
      "Seek care sooner if new symptoms appear or you feel worse.",
    ],
    facilities: ["clinic", "doctors", "hospital"],
  },
  "self-care": {
    label: "Self-care",
    headline: "You can likely manage this at home",
    action: "Nothing you selected points to a need for medical care right now.",
    advice: [
      "Rest, drink fluids and eat light meals.",
      "A pharmacist can advise on over-the-counter relief.",
      "See a clinic if symptoms last more than a week or get worse.",
    ],
    facilities: ["clinic", "doctors", "hospital"],
  },
};
