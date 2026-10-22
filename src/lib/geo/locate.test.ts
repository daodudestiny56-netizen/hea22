import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatAccuracy, locatePrecisely } from "./locate";

type Reading = { lat: number; lon: number; accuracy: number };

/** Fake geolocation that emits the given readings one second apart */
function stubGeolocation(readings: Reading[], error?: { code: number }) {
  const clearWatch = vi.fn();
  vi.stubGlobal("navigator", {
    geolocation: {
      watchPosition: (success: PositionCallback, failure: PositionErrorCallback) => {
        if (error) setTimeout(() => failure(error as GeolocationPositionError), 0);
        readings.forEach((r, i) =>
          setTimeout(
            () => success({ coords: { latitude: r.lat, longitude: r.lon, accuracy: r.accuracy } } as GeolocationPosition),
            (i + 1) * 1000,
          ),
        );
        return 1;
      },
      clearWatch,
    },
  });
  return clearWatch;
}

const lagosByIp = { lat: 6.45, lon: 3.39, accuracy: 25000 };
const osogboWifi = { lat: 7.77, lon: 4.56, accuracy: 300 };
const osogboGps = { lat: 7.7712, lon: 4.5624, accuracy: 20 };

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("locatePrecisely", () => {
  it("ignores a coarse first reading and resolves once accuracy is good enough", async () => {
    const clearWatch = stubGeolocation([lagosByIp, osogboWifi, osogboGps]);
    const progress: number[] = [];
    const result = locatePrecisely({ onProgress: (f) => progress.push(f.accuracy) });

    await vi.advanceTimersByTimeAsync(3000);
    await expect(result).resolves.toEqual(osogboGps);
    expect(progress).toEqual([25000, 300, 20]);
    expect(clearWatch).toHaveBeenCalled();
  });

  it("resolves with the best reading when the wait runs out", async () => {
    stubGeolocation([lagosByIp, osogboWifi]);
    const result = locatePrecisely({ maxWaitMs: 5000 });

    await vi.advanceTimersByTimeAsync(5000);
    await expect(result).resolves.toEqual(osogboWifi);
  });

  it("rejects when permission is denied before any reading", async () => {
    stubGeolocation([], { code: 1 });
    const result = locatePrecisely();
    const assertion = expect(result).rejects.toMatchObject({ code: 1 });

    await vi.advanceTimersByTimeAsync(10);
    await assertion;
  });
});

describe("formatAccuracy", () => {
  it("formats metres and kilometres", () => {
    expect(formatAccuracy(42.4)).toBe("42 m");
    expect(formatAccuracy(2500)).toBe("2.5 km");
    expect(formatAccuracy(25000)).toBe("25 km");
  });
});
