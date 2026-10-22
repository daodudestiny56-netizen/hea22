import type { LatLon } from "./distance";

export interface Fix extends LatLon {
  /** Radius of uncertainty in metres, as reported by the device */
  accuracy: number;
}

/** Above this, the reading probably came from the network rather than GPS or Wi-Fi */
export const POOR_ACCURACY_METERS = 1500;

/**
 * Watches the device position for a short while and resolves with the most
 * accurate reading. The first reading is often a coarse, cached network
 * estimate (for example the ISP's gateway city), and later readings refine it.
 */
export function locatePrecisely({
  targetAccuracy = 50,
  maxWaitMs = 12000,
  onProgress,
}: {
  targetAccuracy?: number;
  maxWaitMs?: number;
  onProgress?: (fix: Fix) => void;
} = {}): Promise<Fix> {
  return new Promise((resolve, reject) => {
    let best: Fix | null = null;

    const finish = () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy };
        if (!best || fix.accuracy < best.accuracy) {
          best = fix;
          onProgress?.(fix);
        }
        if (fix.accuracy <= targetAccuracy) {
          finish();
          resolve(fix);
        }
      },
      (err) => {
        // Keep a usable reading if we already have one
        if (best) return;
        finish();
        reject(err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: maxWaitMs },
    );

    const timer = setTimeout(() => {
      finish();
      if (best) resolve(best);
      else reject(new Error("timeout"));
    }, maxWaitMs);
  });
}

export function formatAccuracy(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}
