import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../../lib/approvalToken';

const SECRET = 'test-secret-123';

describe('approval token', () => {
    it('round-trips a valid token', () => {
        const t = signToken('my-slug', 'approve', SECRET, 3600, 1000);
        const r = verifyToken(t, SECRET, 1500);
        expect(r).toMatchObject({ valid: true, slug: 'my-slug', action: 'approve' });
    });

    it('rejects a tampered token', () => {
        const t = signToken('my-slug', 'approve', SECRET, 3600, 1000);
        const tampered = t.slice(0, -2) + (t.slice(-2) === 'aa' ? 'bb' : 'aa');
        expect(verifyToken(tampered, SECRET, 1500).valid).toBe(false);
    });

    it('rejects a token signed with a different secret', () => {
        const t = signToken('my-slug', 'approve', SECRET, 3600, 1000);
        expect(verifyToken(t, 'other-secret', 1500).valid).toBe(false);
    });

    it('reports expiry', () => {
        const t = signToken('my-slug', 'approve', SECRET, 3600, 1000);
        const r = verifyToken(t, SECRET, 1000 + 3601);
        expect(r.valid).toBe(false);
        expect(r.expired).toBe(true);
    });

    it('encodes the action (reject)', () => {
        const t = signToken('s', 'reject', SECRET, 3600, 1000);
        expect(verifyToken(t, SECRET, 1100).action).toBe('reject');
    });

    it('rejects malformed input', () => {
        expect(verifyToken('garbage', SECRET).valid).toBe(false);
    });
});
