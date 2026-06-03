import { describe, it, expect } from 'vitest';

// Smoke test: proves the Vitest + tsx engine toolchain runs (Plan Task 0.5).
describe('engine toolchain', () => {
    it('runs vitest against the engine tree', () => {
        expect(1 + 1).toBe(2);
    });
});
