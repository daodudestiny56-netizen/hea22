"use client";

import "leaflet/dist/leaflet.css";
import type { CircleMarker as LeafletCircleMarker, Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";
import { AttributionControl, Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { directionsUrl, formatDistance, type LatLon } from "@/lib/geo/distance";
import { facilityLabels, type Facility, type FacilityType } from "@/lib/geo/facilities";

export type FacilityWithDistance = Facility & { distance: number };

const markerColor: Record<FacilityType, string> = {
  hospital: "#1d1c1a",
  clinic: "#2f4943",
  doctors: "#8a7653",
};

function zoomForRadius(radius: number) {
  if (radius <= 2000) return 14;
  if (radius <= 5000) return 13;
  if (radius <= 10000) return 12;
  return 11;
}

function ViewController({ center, radius, hasOrigin }: { center: LatLon; radius: number; hasOrigin: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lon], hasOrigin ? zoomForRadius(radius) : 6);
  }, [map, center.lat, center.lon, radius, hasOrigin]);
  return null;
}

export default function ClinicMap({
  center,
  origin,
  radius,
  facilities,
  selectedId,
  onSelect,
}: {
  center: LatLon;
  origin: LatLon | null;
  radius: number;
  facilities: FacilityWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, LeafletCircleMarker>>({});

  useEffect(() => {
    const facility = facilities.find((f) => f.id === selectedId);
    if (!facility || !mapRef.current) return;
    mapRef.current.panTo([facility.lat, facility.lon]);
    markers.current[facility.id]?.openPopup();
  }, [selectedId, facilities]);

  return (
    <MapContainer
      ref={mapRef}
      center={[center.lat, center.lon]}
      zoom={6}
      scrollWheelZoom
      attributionControl={false}
      className="h-full w-full"
    >
      <AttributionControl prefix='<a href="https://leafletjs.com">Leaflet</a>' />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ViewController center={center} radius={radius} hasOrigin={origin !== null} />

      {origin && (
        <>
          <Circle
            center={[origin.lat, origin.lon]}
            radius={radius}
            pathOptions={{ color: "#2f4943", weight: 1, dashArray: "4 6", fillColor: "#2f4943", fillOpacity: 0.04 }}
          />
          <CircleMarker
            center={[origin.lat, origin.lon]}
            radius={7}
            pathOptions={{ color: "#f7f5f1", weight: 3, fillColor: "#2563a8", fillOpacity: 1 }}
          >
            <Popup>Your search location</Popup>
          </CircleMarker>
        </>
      )}

      {facilities.map((f) => {
        const selected = f.id === selectedId;
        return (
          <CircleMarker
            key={f.id}
            ref={(m) => {
              if (m) markers.current[f.id] = m;
            }}
            center={[f.lat, f.lon]}
            radius={selected ? 10 : 6.5}
            pathOptions={{
              color: "#f7f5f1",
              weight: 2,
              fillColor: markerColor[f.type],
              fillOpacity: selected ? 1 : 0.85,
            }}
            eventHandlers={{ click: () => onSelect(f.id) }}
          >
            <Popup>
              <strong>{f.name ?? `Unnamed ${facilityLabels[f.type].toLowerCase()}`}</strong>
              <br />
              {facilityLabels[f.type]}, {formatDistance(f.distance)} away
              {origin && (
                <>
                  <br />
                  <a href={directionsUrl(origin, f)} target="_blank" rel="noreferrer">
                    Get directions
                  </a>
                </>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
