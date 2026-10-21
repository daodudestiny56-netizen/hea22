"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeocodeResult } from "@/app/api/geocode/route";
import { Crosshair, Phone } from "@/components/icons";
import { directionsUrl, distanceKm, formatDistance, type LatLon } from "@/lib/geo/distance";
import { facilityLabels, type Facility, type FacilityType } from "@/lib/geo/facilities";
import { site } from "@/lib/site";
import type { FacilityWithDistance } from "./clinic-map";

const ClinicMap = dynamic(() => import("./clinic-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-sand/50" />,
});

type Filter = "all" | FacilityType;
type Status = "idle" | "locating" | "loading" | "ready" | "error";
type Origin = LatLon & { label: string };

const radii = [2000, 5000, 10000, 20000];

export function ClinicFinder({ initialFilter = "all" }: { initialFilter?: Filter }) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [radius, setRadius] = useState(5000);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeocodeResult[] | null>(null);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!origin) return;
    const controller = new AbortController();
    setStatus("loading");
    setError(null);
    setSelectedId(null);

    fetch(`/api/clinics?lat=${origin.lat}&lon=${origin.lon}&radius=${radius}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
        setFacilities(body.facilities);
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [origin, radius]);

  const withDistance: FacilityWithDistance[] = useMemo(() => {
    if (!origin) return [];
    return facilities
      .map((f) => ({ ...f, distance: distanceKm(origin, f) }))
      .filter((f) => f.distance * 1000 <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [facilities, origin, radius]);

  const visible = filter === "all" ? withDistance : withDistance.filter((f) => f.type === filter);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: withDistance.length, hospital: 0, clinic: 0, doctors: 0 };
    for (const f of withDistance) c[f.type]++;
    return c;
  }, [withDistance]);

  function locate() {
    if (!("geolocation" in navigator)) {
      setError("Your browser cannot share its location. Search for your town instead.");
      setStatus("error");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setResults(null);
        setOrigin({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Your current location" });
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location access was blocked. You can search for your town or area instead."
            : "We could not get your location. Please search for your town or area instead.",
        );
        setStatus("error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Search failed.");
      setResults(body.results);
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    } finally {
      setSearching(false);
    }
  }

  function choose(place: GeocodeResult) {
    setOrigin({ lat: place.lat, lon: place.lon, label: place.label });
    setResults(null);
    setQuery(place.label.split(",")[0]);
  }

  function select(id: string) {
    setSelectedId(id);
    listRef.current?.querySelector(`[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-line bg-paper p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
          <button
            type="button"
            onClick={locate}
            disabled={status === "locating"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper hover:bg-ink-2 disabled:opacity-60"
          >
            <Crosshair />
            {status === "locating" ? "Finding you..." : "Use my location"}
          </button>

          <div className="relative">
            <form onSubmit={search} className="flex gap-2" role="search">
              <label htmlFor="place" className="sr-only">
                Town, area or address
              </label>
              <input
                id="place"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Or search a town or area, for example Wuse, Abuja"
                className="min-w-0 flex-1 rounded-md border border-line bg-paper px-4 py-3 text-sm placeholder:text-muted/80 focus:border-ink/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="rounded-md border border-line px-4 py-3 text-sm font-medium hover:border-ink/30 disabled:opacity-60"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            {results && (
              <ul className="absolute inset-x-0 top-full z-[1000] mt-1 overflow-hidden rounded-md border border-line bg-paper shadow-lg">
                {results.length === 0 && <li className="px-4 py-3 text-sm text-muted">No places found in {site.country}.</li>}
                {results.map((r) => (
                  <li key={`${r.lat},${r.lon}`}>
                    <button
                      type="button"
                      onClick={() => choose(r)}
                      className="block w-full px-4 py-2.5 text-left text-sm hover:bg-paper-2"
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Facility type">
            {(["all", "hospital", "clinic", "doctors"] as Filter[]).map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : facilityLabels[f] + (f === "doctors" ? "" : "s")}
                {origin && status === "ready" && <span className="ml-1.5 tabular-nums opacity-60">{counts[f]}</span>}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Within</span>
            <div className="flex gap-1.5" role="group" aria-label="Search radius">
              {radii.map((r) => (
                <Chip key={r} active={radius === r} onClick={() => setRadius(r)}>
                  {r / 1000} km
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">
          Your location is only used to search the map. It is never saved.
        </p>
      </section>

      {error && (
        <p role="alert" className="rounded-md border border-urgent/25 bg-urgent-soft px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="relative isolate h-[22rem] overflow-hidden rounded-xl border border-line lg:sticky lg:top-6 lg:h-[36rem]">
          <ClinicMap
            center={origin ?? site.defaultCenter}
            origin={origin}
            radius={radius}
            facilities={visible}
            selectedId={selectedId}
            onSelect={select}
          />
          {status === "loading" && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center bg-paper/50">
              <span className="rounded-md bg-paper px-4 py-2.5 text-center text-sm shadow">
                Loading nearby facilities...
                <span className="mt-0.5 block text-xs text-muted">The public map service can take up to a minute.</span>
              </span>
            </div>
          )}
        </div>

        <section className="flex flex-col rounded-xl border border-line bg-paper lg:h-[36rem]" aria-label="Results">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-semibold">{origin ? "Nearest first" : "No location yet"}</h2>
            <p className="mt-0.5 truncate text-sm text-muted">
              {origin ? origin.label : "Use your location or search for a place to begin."}
            </p>
          </div>

          {origin && status === "ready" && visible.length === 0 && (
            <div className="px-5 py-8 text-sm text-ink-2">
              <p>No facilities of this type were found within {radius / 1000} km.</p>
              <p className="mt-2 text-muted">
                Try a larger radius or a different type. Community map data may be incomplete in some areas.
              </p>
            </div>
          )}

          {!origin && (
            <div className="px-5 py-8 text-sm leading-relaxed text-ink-2">
              Facility data comes from OpenStreetMap, which is mapped by volunteers. Coverage is strongest in cities.
              Always call ahead to confirm a facility is open.
            </div>
          )}

          <ul ref={listRef} className="flex-1 divide-y divide-line overflow-y-auto">
            {visible.map((f) => (
              <li key={f.id} data-id={f.id}>
                <div
                  className={`px-5 py-4 transition-colors ${f.id === selectedId ? "bg-paper-2" : ""}`}
                >
                  <button type="button" onClick={() => setSelectedId(f.id)} className="block w-full text-left">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-medium text-ink">
                        {f.name ?? <span className="text-muted">Unnamed {facilityLabels[f.type].toLowerCase()}</span>}
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-muted">{formatDistance(f.distance)}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                      <span>{facilityLabels[f.type]}</span>
                      {f.hasEmergency && (
                        <span className="rounded-sm bg-emergency-soft px-1.5 py-0.5 font-medium text-emergency">
                          Emergency department
                        </span>
                      )}
                    </span>
                    {f.address && <span className="mt-1.5 block text-sm text-ink-2">{f.address}</span>}
                    {f.openingHours && <span className="mt-1 block text-xs text-muted">Hours: {f.openingHours}</span>}
                  </button>
                  <div className="mt-3 flex gap-4 text-sm">
                    <a
                      href={directionsUrl(origin!, f)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Directions
                    </a>
                    {f.phone && (
                      <a href={`tel:${f.phone.split(";")[0].replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-accent underline-offset-4 hover:underline">
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink-2 hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}
