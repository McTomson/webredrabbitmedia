import type { GridPoint } from './types';

// Pure grid geometry. Builds an n x n grid of measurement points centred on the
// business, spaced `spacingKm` apart, using an equirectangular approximation
// (fine for a few km inside one city). No IO, fully testable.

const KM_PER_DEG_LAT = 110.574; // mean km per degree latitude

/**
 * Build an `size` x `size` grid of points centred on (centerLat, centerLng).
 * `size` should be odd so a point sits exactly on the centre (7 → offsets -3..+3).
 * `spacingKm` is the distance between adjacent points.
 */
export function buildGrid(centerLat: number, centerLng: number, size: number, spacingKm: number): GridPoint[] {
    if (size < 1 || !Number.isInteger(size)) throw new Error(`grid size must be a positive integer, got ${size}`);
    if (spacingKm <= 0) throw new Error(`spacingKm must be > 0, got ${spacingKm}`);

    const half = (size - 1) / 2; // e.g. 3 for size 7
    // Longitude degrees shrink with latitude; guard the poles (cos → 0).
    const kmPerDegLng = KM_PER_DEG_LAT * Math.cos((centerLat * Math.PI) / 180) || KM_PER_DEG_LAT;

    const points: GridPoint[] = [];
    for (let r = -half; r <= half; r++) {
        for (let c = -half; c <= half; c++) {
            // row increases northward → positive row = higher latitude.
            const lat = centerLat + (r * spacingKm) / KM_PER_DEG_LAT;
            const lng = centerLng + (c * spacingKm) / kmPerDegLng;
            points.push({
                id: `r${r}_c${c}`,
                row: r,
                col: c,
                lat: round6(lat),
                lng: round6(lng),
            });
        }
    }
    return points;
}

function round6(n: number): number {
    return Math.round(n * 1e6) / 1e6;
}
