import type { AgeGroup, Severity, Symptom } from "./types";

export const symptoms: Symptom[] = [
  // General
  { id: "fever", label: "Fever or feeling hot", category: "General" },
  { id: "chills", label: "Chills or shivering", category: "General" },
  { id: "fatigue", label: "Unusual tiredness", category: "General" },
  { id: "body_aches", label: "Body or joint aches", category: "General" },
  { id: "weight_loss", label: "Weight loss without trying", category: "General" },
  { id: "heavy_bleeding", label: "Bleeding that will not stop", category: "General" },

  // Head and nervous system
  { id: "headache", label: "Headache", category: "Head and nervous system" },
  {
    id: "sudden_severe_headache",
    label: "Sudden, very severe headache",
    hint: "The worst headache of your life, reaching full strength within minutes",
    category: "Head and nervous system",
  },
  { id: "dizziness", label: "Dizziness or light-headedness", category: "Head and nervous system" },
  { id: "stiff_neck", label: "Stiff neck", category: "Head and nervous system" },
  { id: "confusion", label: "Confusion or unusual drowsiness", category: "Head and nervous system" },
  { id: "seizure", label: "Seizure or fit", category: "Head and nervous system" },
  {
    id: "stroke_signs",
    label: "Face drooping, arm weakness or slurred speech",
    hint: "Especially if it is on one side of the body",
    category: "Head and nervous system",
  },

  // Chest and breathing
  { id: "cough", label: "Cough", category: "Chest and breathing" },
  { id: "shortness_of_breath", label: "Shortness of breath", category: "Chest and breathing" },
  { id: "chest_pain", label: "Chest pain or pressure", category: "Chest and breathing" },
  { id: "coughing_blood", label: "Coughing up blood", category: "Chest and breathing" },
  { id: "sore_throat", label: "Sore throat", category: "Chest and breathing" },
  { id: "runny_nose", label: "Runny or blocked nose", category: "Chest and breathing" },

  // Stomach and digestion
  { id: "abdominal_pain", label: "Stomach or abdominal pain", category: "Stomach and digestion" },
  { id: "nausea_vomiting", label: "Nausea or vomiting", category: "Stomach and digestion" },
  { id: "diarrhoea", label: "Diarrhoea", category: "Stomach and digestion" },
  { id: "cannot_keep_fluids", label: "Cannot keep fluids down", category: "Stomach and digestion" },
  { id: "vomiting_blood", label: "Vomiting blood", category: "Stomach and digestion" },
  { id: "blood_in_stool", label: "Blood in stool or black stool", category: "Stomach and digestion" },

  // Skin, eyes and urine
  { id: "rash", label: "Skin rash", category: "Skin, eyes and urine" },
  {
    id: "non_blanching_rash",
    label: "Rash that does not fade when pressed",
    hint: "Press a clear glass against it. If the spots stay visible, select this.",
    category: "Skin, eyes and urine",
  },
  { id: "yellow_eyes", label: "Yellow eyes or skin", category: "Skin, eyes and urine" },
  { id: "painful_urination", label: "Pain or burning when passing urine", category: "Skin, eyes and urine" },
  { id: "little_urine", label: "Passing little or no urine", category: "Skin, eyes and urine" },
];

export const symptomById = new Map(symptoms.map((s) => [s.id, s]));

export const symptomCategories = Array.from(new Set(symptoms.map((s) => s.category)));

export const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: "infant", label: "Under 1 year" },
  { value: "child", label: "1 to 12 years" },
  { value: "adult", label: "13 to 64 years" },
  { value: "older", label: "65 years or older" },
];

export const severities: { value: Severity; label: string; description: string }[] = [
  { value: "mild", label: "Mild", description: "Noticeable, but I can carry on as normal" },
  { value: "moderate", label: "Moderate", description: "It is affecting my daily activities" },
  { value: "severe", label: "Severe", description: "I can hardly function or it is getting worse fast" },
];

export const durations: { value: number; label: string }[] = [
  { value: 0, label: "Less than a day" },
  { value: 1, label: "1 to 2 days" },
  { value: 3, label: "3 to 6 days" },
  { value: 7, label: "1 to 2 weeks" },
  { value: 14, label: "More than 2 weeks" },
];
