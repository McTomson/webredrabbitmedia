import { describe, it, expect } from 'vitest';
import { buildGrid } from './geo';

describe('buildGrid', () => {
    it('produces size*size points', () => {
        expect(buildGrid(48.2, 16.37, 7, 0.6)).toHaveLength(49);
        expect(buildGrid(48.2, 16.37, 5, 1)).toHaveLength(25);
    });

    it('places a point exactly on the centre for odd sizes', () => {
        const pts = buildGrid(48.2083, 16.3687, 7, 0.6);
        const centre = pts.find((p) => p.row === 0 && p.col === 0)!;
        expect(centre.lat).toBeCloseTo(48.2083, 4);
        expect(centre.lng).toBeCloseTo(16.3687, 4);
        expect(centre.id).toBe('r0_c0');
    });

    it('spaces adjacent rows by ~spacingKm in latitude', () => {
        const pts = buildGrid(48.2, 16.37, 3, 1); // 1 km spacing
        const c = pts.find((p) => p.row === 0 && p.col === 0)!;
        const north = pts.find((p) => p.row === 1 && p.col === 0)!;
        // 1 km ≈ 1/110.574 degrees latitude
        expect(north.lat - c.lat).toBeCloseTo(1 / 110.574, 5);
    });

    it('positive row is further north (higher latitude)', () => {
        const pts = buildGrid(48.2, 16.37, 3, 0.5);
        const south = pts.find((p) => p.row === -1 && p.col === 0)!;
        const north = pts.find((p) => p.row === 1 && p.col === 0)!;
        expect(north.lat).toBeGreaterThan(south.lat);
    });

    it('rejects invalid input', () => {
        expect(() => buildGrid(48, 16, 0, 1)).toThrow();
        expect(() => buildGrid(48, 16, 7, 0)).toThrow();
        expect(() => buildGrid(48, 16, 2.5, 1)).toThrow();
    });
});
