import crypto from 'crypto';

// Signed single-use-ish approval tokens for the review email. Stateless: the token
// carries slug + action + expiry, signed with APPROVAL_SECRET (HMAC-SHA256). Single-use
// is enforced downstream (an already-published article ignores a second approve).
// Used by both the engine email sender and app/api/approve/route.ts (same secret).

export type ApprovalAction = 'approve' | 'reject';

interface Payload {
    slug: string;
    action: ApprovalAction;
    exp: number; // unix seconds
}

function b64url(buf: Buffer | string): string {
    return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Buffer {
    return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function sign(data: string, secret: string): string {
    return b64url(crypto.createHmac('sha256', secret).update(data).digest());
}

export function signToken(slug: string, action: ApprovalAction, secret: string, ttlSeconds = 7 * 24 * 3600, nowSec?: number): string {
    const now = nowSec ?? Math.floor(Date.now() / 1000);
    const payload: Payload = { slug, action, exp: now + ttlSeconds };
    const body = b64url(JSON.stringify(payload));
    return `${body}.${sign(body, secret)}`;
}

export interface VerifyResult {
    valid: boolean;
    expired?: boolean;
    slug?: string;
    action?: ApprovalAction;
    reason?: string;
}

export function verifyToken(token: string, secret: string, nowSec?: number): VerifyResult {
    const now = nowSec ?? Math.floor(Date.now() / 1000);
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false, reason: 'malformed' };
    const [body, sig] = parts;
    const expected = sign(body, secret);
    // constant-time compare
    if (sig.length !== expected.length || !crypto.timingSafeEqual(fromB64url(sig), fromB64url(expected))) {
        return { valid: false, reason: 'bad signature' };
    }
    let payload: Payload;
    try {
        payload = JSON.parse(fromB64url(body).toString('utf8'));
    } catch {
        return { valid: false, reason: 'bad payload' };
    }
    if (typeof payload.exp !== 'number' || payload.exp < now) {
        return { valid: false, expired: true, slug: payload.slug, action: payload.action, reason: 'expired' };
    }
    return { valid: true, slug: payload.slug, action: payload.action };
}
