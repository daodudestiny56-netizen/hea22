export const site = {
  name: "CarePoint",
  tagline: "Symptom checker and clinic locator",
  description:
    "Answer a few questions about how you feel, get a rule-based suggestion on how soon to seek care, and find clinics and hospitals near you.",
  emergencyNumber: "112",
  country: "Nigeria",
  // Abuja, used when the user has not shared a location yet
  defaultCenter: { lat: 9.0765, lon: 7.3986 },
} as const;
