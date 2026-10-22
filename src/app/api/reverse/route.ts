import { NextResponse, type NextRequest } from "next/server";
import { userAgent } from "@/lib/geo/user-agent";

interface NominatimReverse {
  display_name?: string;
  address?: Record<string, string>;
}

/** Short, human label such as "Oke-Fia, Osogbo, Osun State" */
function placeLabel(place: NominatimReverse): string | null {
  const a = place.address ?? {};
  const local = a.suburb ?? a.neighbourhood ?? a.quarter ?? a.road;
  const town = a.city ?? a.town ?? a.village ?? a.county;
  const parts = [local, town, a.state].filter((p, i, all): p is string => Boolean(p) && all.indexOf(p) === i);
  return parts.length > 0 ? parts.join(", ") : place.display_name ?? null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.search = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    format: "jsonv2",
    zoom: "16",
  }).toString();

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent, "Accept-Language": "en" },
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    return NextResponse.json({ label: placeLabel(await res.json()) });
  } catch {
    return NextResponse.json({ label: null }, { status: 502 });
  }
}
