import { NextResponse, type NextRequest } from "next/server";
import { buildOverpassQuery, parseOverpass } from "@/lib/geo/facilities";
import { userAgent } from "@/lib/geo/user-agent";

// Tried one at a time to avoid adding load to busy public servers. Queue
// times on these instances can reach 30 seconds or more at peak hours.
const ENDPOINTS = [
  { url: "https://z.overpass-api.de/api/interpreter", timeoutMs: 50000 },
  { url: "https://overpass-api.de/api/interpreter", timeoutMs: 40000 },
];

const MAX_RADIUS = 20000;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  const radius = Math.min(Number(params.get("radius") ?? 5000), MAX_RADIUS);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }
  if (!Number.isFinite(radius) || radius <= 0) {
    return NextResponse.json({ error: "Invalid radius." }, { status: 400 });
  }

  // Round so nearby requests share a cache entry (about 100 m precision)
  const query = buildOverpassQuery({ lat: Number(lat.toFixed(3)), lon: Number(lon.toFixed(3)) }, radius);

  for (const { url, timeoutMs } of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": userAgent },
        body: new URLSearchParams({ data: query }),
        next: { revalidate: 60 * 60 },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) continue;
      const facilities = parseOverpass(await res.json());
      return NextResponse.json({ facilities });
    } catch {
      // Try the next mirror
    }
  }

  return NextResponse.json(
    { error: "The map data service is busy right now. Please try again in a moment." },
    { status: 502 },
  );
}
