import type { ReviewItem } from './types';

// Compliant review-outreach engine (pure). Turns a finished project into a
// two-touch, human-approved review ask, plus a draft reply for an incoming review.
//
// COMPLIANCE (Google review policy Apr-2026 + AT-UWG Anh. Z 23b/c, EU-RL 2019/2161):
//   - Ask EVERY customer, never pre-filter by expected sentiment (no gating).
//   - No incentives, no asking for staff names, no dictating wording.
//   - Open questions only, so the customer writes in their own words.
//   - The follow-up must carry the anti-gating line ("egal ob positiv oder kritisch").
// Nothing here sends mail — it renders drafts that a human approves before send.

/** Days after project completion for the first ask and the single follow-up. */
export const REQUEST_DELAY_DAYS = 2;
export const FOLLOWUP_DELAY_DAYS = 12; // within the researched T+10–14 window

/** Mandatory anti-gating sentence — every follow-up must contain it verbatim. */
export const ANTI_GATING_LINE = 'Egal ob positiv oder kritisch: Ihre ehrliche Rückmeldung hilft uns am meisten.';

const DAY_MS = 86_400_000;

/** Build the public Google "write a review" deep link, or null without a place id. */
export function reviewLink(placeId: string | undefined | null): string | null {
    if (!placeId) return null;
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export type OutreachStatus = 'wait' | 'request_due' | 'awaiting' | 'followup_due' | 'done';

export interface OutreachSchedule {
    completedAt: string;
    requestDue: string; // ISO date the first ask should go out
    followUpDue: string; // ISO date the single follow-up may go out
}

export function computeSchedule(completedAt: string, addDays = addDaysIso): OutreachSchedule {
    return {
        completedAt,
        requestDue: addDays(completedAt, REQUEST_DELAY_DAYS),
        followUpDue: addDays(completedAt, FOLLOWUP_DELAY_DAYS),
    };
}

/**
 * Where this outreach stands right now. `requestSent` / `followUpSent` / `reviewReceived`
 * are facts the caller tracks; `now` drives the due transitions.
 */
export function outreachStatus(
    schedule: OutreachSchedule,
    state: { requestSent: boolean; followUpSent: boolean; reviewReceived: boolean },
    now: Date,
): OutreachStatus {
    if (state.reviewReceived) return 'done';
    const nowMs = now.getTime();
    if (!state.requestSent) {
        return nowMs >= Date.parse(schedule.requestDue) ? 'request_due' : 'wait';
    }
    // request already sent, no review yet
    if (!state.followUpSent) {
        return nowMs >= Date.parse(schedule.followUpDue) ? 'followup_due' : 'awaiting';
    }
    return 'awaiting';
}

export interface MailDraft {
    subject: string;
    body: string;
}

export interface OutreachContext {
    customerName: string; // e.g. "Frau Berger" or a company name
    projectName: string; // what we built, in plain words
    link: string; // reviewLink(placeId) — caller guarantees non-null before rendering
}

/** First ask (T+2). Warm, short, two genuinely open questions, direct link. */
export function initialRequest(ctx: OutreachContext): MailDraft {
    return {
        subject: `Kurze Rückmeldung zu ${ctx.projectName}?`,
        body: [
            `Hallo ${ctx.customerName},`,
            ``,
            `Ihr Projekt "${ctx.projectName}" ist abgeschlossen — danke für die Zusammenarbeit.`,
            ``,
            `Wenn Sie zwei Minuten haben, würde uns Ihre Erfahrung sehr helfen. Zwei Fragen, die Sie ganz frei beantworten können:`,
            `- Wie war der Ablauf für Sie, von der ersten Anfrage bis zum fertigen Ergebnis?`,
            `- Was hat Sie überzeugt — oder was hätten Sie sich anders gewünscht?`,
            ``,
            `Direkt zur Google-Bewertung: ${ctx.link}`,
            ``,
            `Vielen Dank und beste Grüße`,
            `Red Rabbit`,
        ].join('\n'),
    };
}

/** Single follow-up (T+12). Carries the anti-gating line verbatim. */
export function followUp(ctx: OutreachContext): MailDraft {
    return {
        subject: `Noch offen: Ihre Rückmeldung zu ${ctx.projectName}`,
        body: [
            `Hallo ${ctx.customerName},`,
            ``,
            `kurze Erinnerung — falls es im Alltag untergegangen ist.`,
            ``,
            ANTI_GATING_LINE,
            ``,
            `Zur Google-Bewertung: ${ctx.link}`,
            ``,
            `Danke und beste Grüße`,
            `Red Rabbit`,
        ].join('\n'),
    };
}

/**
 * Draft an owner reply to an incoming review. Personal, no keyword stuffing, no
 * canned phrasing — a starting point a human edits and approves. Tone adapts to
 * rating (critical reviews get an ownership-and-fix tone, never defensive).
 */
export function replyDraft(review: ReviewItem): MailDraft {
    const critical = review.rating <= 3;
    const first = review.author ? `Hallo ${firstNameOf(review.author)},` : 'Hallo,';
    const body = critical
        ? [
              first,
              ``,
              `danke, dass Sie sich die Zeit für dieses ehrliche Feedback genommen haben — das nehmen wir ernst.`,
              `[Konkret auf den genannten Punkt eingehen: was ist passiert, was ändern wir.]`,
              `Wenn Sie mögen, klären wir das gern direkt: office@redrabbit.media.`,
              ``,
              `Beste Grüße`,
              `Red Rabbit`,
          ]
        : [
              first,
              ``,
              `vielen Dank für die Bewertung und die Zeit, die Sie sich genommen haben.`,
              `[Auf ein konkretes Detail aus dem Text eingehen — persönlich, nicht generisch.]`,
              `Es hat uns gefreut, mit Ihnen zu arbeiten.`,
              ``,
              `Beste Grüße`,
              `Red Rabbit`,
          ];
    return { subject: `Antwort auf Ihre Bewertung`, body: body.join('\n') };
}

function firstNameOf(author: string): string {
    return author.trim().split(/\s+/)[0] || author;
}

function addDaysIso(iso: string, days: number): string {
    const ms = Date.parse(iso);
    const d = new Date((Number.isNaN(ms) ? Date.now() : ms) + days * DAY_MS);
    return d.toISOString().slice(0, 10);
}
