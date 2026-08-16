import type { HealthSignal } from '@/lib/dashboard/health';
import type { LocalRankSnapshot, ReviewHealth } from './types';

// Pure health/alarm logic for the Local (GBP) tab. Reuses the dashboard's
// HealthSignal shape so it renders in the same HealthCard. Thresholds are
// conservative — a young local profile should not cry wolf. No IO.

// SoLV (share of points in the local top 3) below this is weak local visibility.
const SOLV_WARN = 0.3;
const SOLV_ALERT = 0.1;
// Review velocity: no new review in this many days is a stalling signal.
const REVIEW_STALE_DAYS = 45;

export function buildLocalSignals(snapshot: LocalRankSnapshot | null, reviews: ReviewHealth | null): HealthSignal[] {
    const signals: HealthSignal[] = [];

    // ── Grid visibility ──────────────────────────────────────────────────────
    if (snapshot) {
        const solv = snapshot.overall.solv;
        const pct = Math.round(solv * 100);
        if (solv <= SOLV_ALERT) {
            signals.push({ id: 'solv', level: 'alert', title: 'Lokale Sichtbarkeit sehr niedrig', detail: `Nur ${pct}% der Messpunkte in den lokalen Top 3. Kategorie, Profil-Vollständigkeit und Reviews sind die Hebel.` });
        } else if (solv <= SOLV_WARN) {
            signals.push({ id: 'solv', level: 'warn', title: 'Lokale Sichtbarkeit ausbaufähig', detail: `${pct}% der Messpunkte in den Top 3 (SoLV). Ziel: mehr grüne Punkte rund um den Standort.` });
        } else {
            signals.push({ id: 'solv', level: 'ok', title: 'Lokale Sichtbarkeit solide', detail: `${pct}% der Messpunkte in den lokalen Top 3 (SoLV).` });
        }
    }

    // ── Review health ────────────────────────────────────────────────────────
    if (reviews) {
        // Velocity: a steady stream matters more than a one-time burst.
        if (reviews.total > 0 && reviews.last30 === 0) {
            const staleDetail = reviews.daysSinceLast != null ? `Letzte Bewertung vor ${reviews.daysSinceLast} Tagen.` : 'Keine neue Bewertung im letzten Monat.';
            const level = reviews.daysSinceLast != null && reviews.daysSinceLast > REVIEW_STALE_DAYS ? 'warn' : 'info';
            signals.push({ id: 'review-velocity', level, title: 'Keine neuen Bewertungen', detail: `${staleDetail} Regelmäßige, echte Bewertungen sind ein belegter Local-Hebel — Outreach nach Projektabschluss anstoßen.` });
        } else if (reviews.last30 > 0) {
            signals.push({ id: 'review-velocity', level: 'ok', title: 'Bewertungen kommen rein', detail: `${reviews.last30} neue Bewertung(en) in 30 Tagen.` });
        }

        // Responses: replying to every review is a direct, controllable signal.
        if (reviews.unanswered.length > 0) {
            signals.push({ id: 'review-responses', level: 'warn', title: 'Unbeantwortete Bewertungen', detail: `${reviews.unanswered.length} Bewertung(en) ohne Antwort. Auf alle antworten (1–2 Tage) — Entwurf im Bereich unten.` });
        } else if (reviews.total > 0) {
            signals.push({ id: 'review-responses', level: 'ok', title: 'Alle Bewertungen beantwortet', detail: `Antwortrate 100%.` });
        }
    }

    return signals;
}
