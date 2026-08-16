import { describe, it, expect } from 'vitest';
import {
    hoursSince,
    isEngineAlive,
    agoLabel,
    ENGINE_STALE_HOURS,
    type EngineStatus,
} from './engineStatus';

const NOW = Date.parse('2026-08-16T12:00:00Z');

describe('hoursSince', () => {
    it('returns null for missing/invalid', () => {
        expect(hoursSince(undefined, NOW)).toBeNull();
        expect(hoursSince(null, NOW)).toBeNull();
        expect(hoursSince('not-a-date', NOW)).toBeNull();
    });
    it('computes elapsed hours', () => {
        expect(hoursSince('2026-08-16T09:00:00Z', NOW)).toBeCloseTo(3, 5);
        expect(hoursSince('2026-08-15T12:00:00Z', NOW)).toBeCloseTo(24, 5);
    });
});

describe('isEngineAlive', () => {
    it('alive when daily ran within the stale window', () => {
        const s: EngineStatus = { daily: { at: '2026-08-16T06:00:00Z', ok: true } };
        expect(isEngineAlive(s, NOW)).toBe(true);
    });
    it('dead when daily is older than the stale window', () => {
        const old = new Date(NOW - (ENGINE_STALE_HOURS + 1) * 3_600_000).toISOString();
        const s: EngineStatus = { daily: { at: old, ok: true } };
        expect(isEngineAlive(s, NOW)).toBe(false);
    });
    it('dead when the last daily run failed', () => {
        const s: EngineStatus = { daily: { at: '2026-08-16T06:00:00Z', ok: false } };
        expect(isEngineAlive(s, NOW)).toBe(false);
    });
    it('dead when no status / no daily', () => {
        expect(isEngineAlive(null, NOW)).toBe(false);
        expect(isEngineAlive({}, NOW)).toBe(false);
    });
    it('media recency does not count toward alive', () => {
        const s: EngineStatus = { media: { at: '2026-08-16T11:59:00Z', ok: true } };
        expect(isEngineAlive(s, NOW)).toBe(false);
    });
});

describe('agoLabel', () => {
    it('minutes / hours / days', () => {
        expect(agoLabel('2026-08-16T11:30:00Z', NOW)).toBe('vor 30 Min');
        expect(agoLabel('2026-08-16T09:00:00Z', NOW)).toBe('vor 3 Std');
        expect(agoLabel('2026-08-14T12:00:00Z', NOW)).toBe('vor 2 Tagen');
    });
    it('sub-minute is "gerade eben"; missing is dash', () => {
        expect(agoLabel('2026-08-16T11:59:40Z', NOW)).toBe('gerade eben');
        expect(agoLabel(undefined, NOW)).toBe('—');
    });
});
