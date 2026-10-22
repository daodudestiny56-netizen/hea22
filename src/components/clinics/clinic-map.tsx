"use client";

import "leaflet/dist/leaflet.css";
import {
  divIcon,
  type CircleMarker as LeafletCircleMarker,
  type Map as LeafletMap,
  type Marker as LeafletMarker,
} from "leaflet";
import { useEffect, useRef } from "react";
import {
  AttributionControl,
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
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

const originIcon = divIcon({
  className: "",
  html: '<span style="display:block;width:18px;height:18px;border-radius:50%;background:#2563a8;border:3px solid #f7f5f1;box-shadow:0 1px 4px rgb(29 28 26 / 0.4)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

function PickHandler({ onPick }: { onPick: (point: LatLon) => void }) {
  useMapEvents({ click: (e) => onPick({ lat: e.latlng.lat, lon: e.latlng.lng }) });
  return null;
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
  picking,
  onMoveOrigin,
}: {
  center: LatLon;
  origin: (LatLon & { accuracy: number | null }) | null;
  radius: number;
  facilities: FacilityWithDistance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When true, clicking the map sets the search location */
  picking: boolean;
  onMoveOrigin: (point: LatLon) => void;
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
      className={`h-full w-full ${picking ? "cursor-crosshair [&_.leaflet-interactive]:cursor-crosshair" : ""}`}
    >
      <AttributionControl prefix='<a href="https://leafletjs.com">Leaflet</a>' />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ViewController center={center} radius={radius} hasOrigin={origin !== null} />

      {picking && <PickHandler onPick={onMoveOrigin} />}

      {origin && (
        <>
          <Circle
            center={[origin.lat, origin.lon]}
            radius={radius}
            interactive={false}
            pathOptions={{ color: "#2f4943", weight: 1, dashArray: "4 6", fillColor: "#2f4943", fillOpacity: 0.04 }}
          />
          {origin.accuracy !== null && origin.accuracy > 30 && (
            <Circle
              center={[origin.lat, origin.lon]}
              radius={origin.accuracy}
              interactive={false}
              pathOptions={{ stroke: false, fillColor: "#2563a8", fillOpacity: 0.12 }}
            />
          )}
          <Marker
            position={[origin.lat, origin.lon]}
            icon={originIcon}
            draggable
            zIndexOffset={1000}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = (e.target as LeafletMarker).getLatLng();
                onMoveOrigin({ lat, lon: lng });
              },
            }}
          >
            <Popup>You are here. Drag this pin if it is in the wrong place.</Popup>
          </Marker>
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
