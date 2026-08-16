import { describe, it, expect } from 'vitest';
import { normalizeStatus, normalizeSource, LEAD_STATUSES, LEAD_SOURCES } from './types';

describe('normalizeStatus', () => {
    it('accepts known statuses', () => {
        for (const s of LEAD_STATUSES) expect(normalizeStatus(s)).toBe(s);
    });
    it('rejects unknown / non-string', () => {
        expect(normalizeStatus('gelöscht')).toBeNull();
        expect(normalizeStatus('')).toBeNull();
        expect(normalizeStatus(undefined)).toBeNull();
        expect(normalizeStatus(5)).toBeNull();
    });
});

describe('normalizeSource', () => {
    it('accepts known sources', () => {
        for (const s of LEAD_SOURCES) expect(normalizeSource(s)).toBe(s);
    });
    it('falls back to formular for unknown/missing', () => {
        expect(normalizeSource('email')).toBe('formular');
        expect(normalizeSource(undefined)).toBe('formular');
        expect(normalizeSource(123)).toBe('formular');
    });
});
