import { describe, it, expect } from 'vitest';
import {
    reviewLink,
    computeSchedule,
    outreachStatus,
    initialRequest,
    followUp,
    replyDraft,
    ANTI_GATING_LINE,
    REQUEST_DELAY_DAYS,
    FOLLOWUP_DELAY_DAYS,
} from './reviewOutreach';
import type { ReviewItem } from './types';

describe('reviewLink', () => {
    it('builds the public write-review deep link', () => {
        expect(reviewLink('ChIJabc123')).toBe('https://search.google.com/local/writereview?placeid=ChIJabc123');
    });
    it('fail-closed without a place id', () => {
        expect(reviewLink(undefined)).toBeNull();
        expect(reviewLink('')).toBeNull();
    });
});

describe('computeSchedule', () => {
    it('sets request at T+2 and follow-up at T+12 from completion', () => {
        const s = computeSchedule('2026-08-01');
        expect(s.requestDue).toBe('2026-08-03');
        expect(s.followUpDue).toBe('2026-08-13');
        expect(FOLLOWUP_DELAY_DAYS - REQUEST_DELAY_DAYS).toBe(10);
    });
});

describe('outreachStatus', () => {
    const s = computeSchedule('2026-08-01'); // request 08-03, followup 08-13
    const st = (o: Partial<{ requestSent: boolean; followUpSent: boolean; reviewReceived: boolean }>, now: string) =>
        outreachStatus(s, { requestSent: false, followUpSent: false, reviewReceived: false, ...o }, new Date(now));

    it('waits before the request is due', () => {
        expect(st({}, '2026-08-02T00:00:00Z')).toBe('wait');
    });
    it('flags request_due on/after T+2', () => {
        expect(st({}, '2026-08-03T09:00:00Z')).toBe('request_due');
    });
    it('awaits after request sent, before follow-up due', () => {
        expect(st({ requestSent: true }, '2026-08-05T00:00:00Z')).toBe('awaiting');
    });
    it('flags followup_due on/after T+12 when no review yet', () => {
        expect(st({ requestSent: true }, '2026-08-13T09:00:00Z')).toBe('followup_due');
    });
    it('is done once a review is received, regardless of timing', () => {
        expect(st({ requestSent: true, followUpSent: true, reviewReceived: true }, '2026-08-20T00:00:00Z')).toBe('done');
    });
});

const ctx = { customerName: 'Frau Berger', projectName: 'Website-Relaunch', link: 'https://search.google.com/local/writereview?placeid=X' };

describe('templates — compliance', () => {
    it('initial request contains the link and open (non-dictating) questions', () => {
        const m = initialRequest(ctx);
        expect(m.body).toContain(ctx.link);
        expect(m.body).toContain('ganz frei beantworten');
        expect(m.body).not.toMatch(/5 Sterne|fünf Sterne/i); // never solicit a specific rating
    });
    it('follow-up carries the mandatory anti-gating line verbatim', () => {
        expect(followUp(ctx).body).toContain(ANTI_GATING_LINE);
    });
    it('reply draft adapts tone to a critical review and stays non-defensive', () => {
        const crit: ReviewItem = { id: '1', rating: 2, createdAt: '2026-08-01', author: 'Max Muster' };
        const d = replyDraft(crit);
        expect(d.body).toContain('Hallo Max,');
        expect(d.body).toContain('ernst');
    });
    it('reply draft thanks on a positive review', () => {
        const pos: ReviewItem = { id: '2', rating: 5, createdAt: '2026-08-01', author: 'Anna' };
        expect(replyDraft(pos).body).toContain('Dank'); // "vielen Dank"
    });
});
