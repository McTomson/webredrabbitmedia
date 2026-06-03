import { describe, it, expect } from 'vitest';
import { classifyStatus } from './verifySources';

describe('classifyStatus', () => {
    it('keeps 2xx/3xx as real', () => {
        expect(classifyStatus(200)).toBe('ok');
        expect(classifyStatus(301)).toBe('ok');
    });

    it('keeps bot-blocked codes (server exists, refuses scraper)', () => {
        for (const c of [401, 403, 405, 429, 503]) expect(classifyStatus(c)).toBe('ok');
    });

    it('drops dead/unreachable (404, 410, 0)', () => {
        expect(classifyStatus(404)).toBe('drop');
        expect(classifyStatus(410)).toBe('drop');
        expect(classifyStatus(0)).toBe('drop');
    });
});
