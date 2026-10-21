import type { LatLon } from "./distance";

export type FacilityType = "hospital" | "clinic" | "doctors";

export interface Facility extends LatLon {
  id: string;
  name: string | null;
  type: FacilityType;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  hasEmergency: boolean;
}

export const facilityLabels: Record<FacilityType, string> = {
  hospital: "Hospital",
  clinic: "Clinic",
  doctors: "Doctor's office",
};

export function buildOverpassQuery({ lat, lon }: LatLon, radiusMeters: number): string {
  const around = `(around:${radiusMeters},${lat},${lon})`;
  // Exact tag matches are cheaper for the server than a regex filter
  const filters = [
    "amenity=hospital",
    "amenity=clinic",
    "amenity=doctors",
    "healthcare=hospital",
    "healthcare=clinic",
    "healthcare=doctor",
    "healthcare=centre",
  ];
  return `[out:json][timeout:25];
(
${filters.map((f) => `  nwr[${f}]${around};`).join("\n")}
);
out center tags 150;`;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function facilityType(tags: Record<string, string>): FacilityType {
  if (tags.amenity === "hospital" || tags.healthcare === "hospital") return "hospital";
  if (tags.amenity === "doctors" || tags.healthcare === "doctor") return "doctors";
  return "clinic";
}

function address(tags: Record<string, string>): string | null {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const parts = [street, tags["addr:suburb"], tags["addr:city"]].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : tags["addr:full"] ?? null;
}

export function parseOverpass(json: { elements?: OverpassElement[] }): Facility[] {
  const seen = new Set<string>();
  const facilities: Facility[] = [];

  for (const el of json.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    const id = `${el.type}/${el.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const tags = el.tags ?? {};
    facilities.push({
      id,
      lat,
      lon,
      name: tags.name ?? tags["name:en"] ?? null,
      type: facilityType(tags),
      address: address(tags),
      phone: tags.phone ?? tags["contact:phone"] ?? null,
      openingHours: tags.opening_hours ?? null,
      hasEmergency: tags.emergency === "yes",
    });
  }

  return facilities;
}
