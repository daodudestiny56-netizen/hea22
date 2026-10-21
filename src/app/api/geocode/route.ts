import { NextResponse, type NextRequest } from "next/server";
import { userAgent } from "@/lib/geo/user-agent";

export interface GeocodeResult {
  label: string;
  lat: number;
  lon: number;
}

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2 || q.length > 200) {
    return NextResponse.json({ error: "Enter a town, area or address." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({ q, format: "jsonv2", limit: "5", countrycodes: "ng" }).toString();

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent, "Accept-Language": "en" },
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);

    const places: NominatimPlace[] = await res.json();
    const results: GeocodeResult[] = places.map((p) => ({
      label: p.display_name,
      lat: Number(p.lat),
      lon: Number(p.lon),
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Location search is unavailable right now. Please try again." }, { status: 502 });
  }
}
