import type { Rule } from "./types";

/**
 * Triage rules. Order within a level matters only for display: the first
 * matching rule of the winning level is shown as the main reason.
 *
 * These rules are for an educational project. They are informed by common
 * public red-flag guidance but have not been clinically validated.
 */
export const rules: Rule[] = [
  // Emergency: call 112 or go to the nearest emergency department
  {
    id: "stroke-signs",
    level: "emergency",
    when: { any: ["stroke_signs"] },
    reason: "Face drooping, arm weakness or slurred speech can be signs of a stroke, where every minute counts.",
  },
  {
    id: "chest-pain-breathless",
    level: "emergency",
    when: { all: ["chest_pain", "shortness_of_breath"] },
    reason: "Chest pain together with difficulty breathing can point to a heart or lung emergency.",
  },
  {
    id: "chest-pain-severe",
    level: "emergency",
    when: { all: ["chest_pain"], severities: ["severe"] },
    reason: "Severe chest pain or pressure needs to be assessed straight away.",
  },
  {
    id: "breathless-severe",
    level: "emergency",
    when: { all: ["shortness_of_breath"], severities: ["severe"] },
    reason: "Severe shortness of breath can become dangerous quickly.",
  },
  {
    id: "seizure",
    level: "emergency",
    when: { any: ["seizure"] },
    reason: "A seizure needs urgent medical assessment, especially if it is the first one.",
  },
  {
    id: "confusion",
    level: "emergency",
    when: { any: ["confusion"] },
    reason: "New confusion or unusual drowsiness can signal a serious problem affecting the brain.",
  },
  {
    id: "sudden-headache",
    level: "emergency",
    when: { any: ["sudden_severe_headache"] },
    reason: "A sudden, very severe headache can be a sign of bleeding in or around the brain.",
  },
  {
    id: "fever-stiff-neck",
    level: "emergency",
    when: { all: ["fever", "stiff_neck"] },
    reason: "Fever with a stiff neck can be a sign of meningitis.",
  },
  {
    id: "non-blanching-rash",
    level: "emergency",
    when: { all: ["non_blanching_rash"] },
    reason: "A rash that does not fade under pressure can be a sign of meningitis or a blood infection.",
  },
  {
    id: "blood-loss",
    level: "emergency",
    when: { any: ["heavy_bleeding", "vomiting_blood", "coughing_blood"] },
    reason: "Uncontrolled bleeding, or vomiting or coughing up blood, needs emergency care.",
  },

  // Urgent: be seen by a doctor today
  {
    id: "infant-fever",
    level: "urgent",
    when: { all: ["fever"], ageGroups: ["infant"] },
    reason: "Fever in a baby under one year old should be checked by a doctor the same day.",
  },
  {
    id: "dehydration",
    level: "urgent",
    when: { any: ["cannot_keep_fluids", "little_urine"] },
    reason: "Not keeping fluids down or passing little urine are signs of dehydration.",
  },
  {
    id: "infant-diarrhoea",
    level: "urgent",
    when: { any: ["diarrhoea", "nausea_vomiting"], ageGroups: ["infant"] },
    reason: "Babies can become dehydrated quickly from vomiting or diarrhoea.",
  },
  {
    id: "malaria-pattern",
    level: "urgent",
    when: { all: ["fever"], any: ["chills", "headache", "body_aches"] },
    reason: "Fever with chills, headache or body aches can be malaria. Get a malaria test within 24 hours.",
  },
  {
    id: "older-fever",
    level: "urgent",
    when: { all: ["fever"], ageGroups: ["older"] },
    reason: "Infections can progress faster in adults over 65, so fever should be checked today.",
  },
  {
    id: "fever-persistent",
    level: "urgent",
    when: { all: ["fever"], minDurationDays: 3 },
    reason: "A fever lasting three days or more should be assessed by a doctor.",
  },
  {
    id: "breathless",
    level: "urgent",
    when: { any: ["shortness_of_breath"] },
    reason: "Shortness of breath should be assessed by a doctor today.",
  },
  {
    id: "chest-pain",
    level: "urgent",
    when: { any: ["chest_pain"] },
    reason: "Any chest pain should be checked the same day to rule out heart problems.",
  },
  {
    id: "jaundice",
    level: "urgent",
    when: { any: ["yellow_eyes"] },
    reason: "Yellow eyes or skin can be a sign of a liver problem or hepatitis.",
  },
  {
    id: "blood-in-stool",
    level: "urgent",
    when: { any: ["blood_in_stool"] },
    reason: "Blood in the stool, or black stool, needs a medical assessment.",
  },
  {
    id: "abdominal-severe",
    level: "urgent",
    when: { all: ["abdominal_pain"], severities: ["severe"] },
    reason: "Severe abdominal pain can have causes that need prompt treatment.",
  },
  {
    id: "any-severe",
    level: "urgent",
    when: { severities: ["severe"] },
    reason: "You described your symptoms as severe, so it is safest to be seen today.",
  },

  // Soon: book a clinic visit within the next few days
  {
    id: "persistent-cough",
    level: "soon",
    when: { all: ["cough"], minDurationDays: 14 },
    reason: "A cough lasting more than two weeks should be checked, including for tuberculosis.",
  },
  {
    id: "weight-loss",
    level: "soon",
    when: { any: ["weight_loss"] },
    reason: "Unintended weight loss should be looked into by a doctor.",
  },
  {
    id: "urinary",
    level: "soon",
    when: { any: ["painful_urination"] },
    reason: "Pain when passing urine is often a urinary infection that may need treatment.",
  },
  {
    id: "rash",
    level: "soon",
    when: { any: ["rash"] },
    reason: "A new rash is worth having looked at, especially if it spreads or itches badly.",
  },
  {
    id: "dizziness",
    level: "soon",
    when: { any: ["dizziness"] },
    reason: "Repeated dizziness can have several causes that a clinic can check.",
  },
  {
    id: "fever-any",
    level: "soon",
    when: { any: ["fever"] },
    reason: "Fever is common, but in a malaria area it is worth getting tested.",
  },
  {
    id: "long-running",
    level: "soon",
    when: { minDurationDays: 7 },
    reason: "Symptoms that have lasted a week or more should be reviewed by a clinician.",
  },
  {
    id: "moderate",
    level: "soon",
    when: { severities: ["moderate"] },
    reason: "Your symptoms are affecting daily life, so a clinic visit can help.",
  },
];
