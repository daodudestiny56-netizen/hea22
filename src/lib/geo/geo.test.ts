import { describe, expect, it } from "vitest";
import { directionsUrl, distanceKm, formatDistance } from "./distance";
import { buildOverpassQuery, parseOverpass } from "./facilities";

describe("distanceKm", () => {
  it("is zero for the same point", () => {
    expect(distanceKm({ lat: 6.5, lon: 3.4 }, { lat: 6.5, lon: 3.4 })).toBe(0);
  });

  it("matches the known Lagos to Abuja distance", () => {
    const km = distanceKm({ lat: 6.5244, lon: 3.3792 }, { lat: 9.0765, lon: 7.3986 });
    expect(km).toBeGreaterThan(520);
    expect(km).toBeLessThan(540);
  });
});

describe("formatDistance", () => {
  it("uses metres under 1 km and kilometres above", () => {
    expect(formatDistance(0.45)).toBe("450 m");
    expect(formatDistance(2.345)).toBe("2.3 km");
  });
});

describe("directionsUrl", () => {
  it("builds an OpenStreetMap directions link", () => {
    expect(directionsUrl({ lat: 1, lon: 2 }, { lat: 3, lon: 4 })).toContain("route=1,2;3,4");
  });
});

describe("buildOverpassQuery", () => {
  it("includes the radius and coordinates", () => {
    expect(buildOverpassQuery({ lat: 9, lon: 7 }, 5000)).toContain("(around:5000,9,7)");
  });
});

describe("parseOverpass", () => {
  it("normalises nodes and ways and skips elements without coordinates", () => {
    const result = parseOverpass({
      elements: [
        { type: "node", id: 1, lat: 9, lon: 7, tags: { amenity: "clinic", name: "Health Centre", phone: "0800" } },
        {
          type: "way",
          id: 2,
          center: { lat: 9.1, lon: 7.1 },
          tags: { amenity: "hospital", emergency: "yes", "addr:street": "Main Road", "addr:city": "Abuja" },
        },
        { type: "relation", id: 3, tags: { amenity: "doctors" } },
        { type: "node", id: 1, lat: 9, lon: 7, tags: { amenity: "clinic" } },
      ],
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: "node/1", name: "Health Centre", type: "clinic", phone: "0800" });
    expect(result[1]).toMatchObject({ type: "hospital", hasEmergency: true, address: "Main Road, Abuja", name: null });
  });

  it("maps healthcare=doctor to doctors", () => {
    const [f] = parseOverpass({ elements: [{ type: "node", id: 9, lat: 0, lon: 0, tags: { healthcare: "doctor" } }] });
    expect(f.type).toBe("doctors");
  });
});
