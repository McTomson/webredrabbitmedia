import type { VisibilityTrend } from './google';

// Pure, testable health/alarm logic for the dashboard overview.
// Dead-man: pipeline stalled (no new article) or last daily run failed.
// Penalty: sharp week-over-week impression drop (earliest deindexing/penalty signal).
// Indexation: live articles but zero impressions.
// All thresholds are conservative so a low-traffic young site does not cry wolf.

export type HealthLevel = 'ok' | 'info' | 'warn' | 'alert';

export interface HealthSignal {
    id: string;
    level: HealthLevel;
    title: string;
    detail: string;
}

export interface HealthInput {
    trend: VisibilityTrend | null; // null when GSC is unconfigured/errored
    newestArticleAgeDays: number | null; // days since the most recent published article
    lastDailyRunOk: boolean | null; // null = no local log available (unknown)
    liveArticles: number;
}

// Below this many previous-period impressions the trend is statistical noise — don't alarm.
const MIN_IMPRESSIONS_FOR_TREND = 50;

const LEVEL_RANK: Record<HealthLevel, number> = { ok: 0, info: 1, warn: 2, alert: 3 };

export function worstLevel(signals: HealthSignal[]): HealthLevel {
    return signals.reduce<HealthLevel>((worst, s) => (LEVEL_RANK[s.level] > LEVEL_RANK[worst] ? s.level : worst), 'ok');
}

export function buildHealthSignals(input: HealthInput): HealthSignal[] {
    const signals: HealthSignal[] = [];

    // 1. Pipeline dead-man (engine should publish ~1 article/day).
    if (input.newestArticleAgeDays != null) {
        const d = input.newestArticleAgeDays;
        if (d > 7) {
            signals.push({ id: 'pipeline', level: 'alert', title: 'Pipeline steht', detail: `Seit ${d} Tagen kein neuer Artikel.` });
        } else if (d > 3) {
            signals.push({ id: 'pipeline', level: 'warn', title: 'Pipeline träge', detail: `Letzter Artikel vor ${d} Tagen.` });
        } else {
            signals.push({ id: 'pipeline', level: 'ok', title: 'Pipeline aktiv', detail: d <= 0 ? 'Heute ein neuer Artikel.' : `Letzter Artikel vor ${d} Tag(en).` });
        }
    }

    // 2. Last daily run health (local log only).
    if (input.lastDailyRunOk === false) {
        signals.push({ id: 'dailyrun', level: 'alert', title: 'Tageslauf fehlgeschlagen', detail: 'Der letzte Tageslauf endete nicht sauber — Log prüfen.' });
    } else if (input.lastDailyRunOk === true) {
        signals.push({ id: 'dailyrun', level: 'ok', title: 'Tageslauf ok', detail: 'Letzter Tageslauf sauber beendet.' });
    }

    // 3. Visibility / penalty (week-over-week impressions).
    if (input.trend) {
        const impr = input.trend.impressions;
        const n = input.trend.rangeDays;
        if (impr.previous < MIN_IMPRESSIONS_FOR_TREND) {
            signals.push({ id: 'visibility', level: 'info', title: 'Sichtbarkeit: zu wenig Daten', detail: `Noch zu wenig Impressionen für einen ${n}-Tage-Trend.` });
        } else if (impr.deltaPct <= -40) {
            signals.push({ id: 'visibility', level: 'alert', title: 'Sichtbarkeit eingebrochen', detail: `Impressionen ${impr.deltaPct}% ggü. den ${n} Tagen davor — mögliche Abstrafung/Deindexierung. Prüfen.` });
        } else if (impr.deltaPct <= -20) {
            signals.push({ id: 'visibility', level: 'warn', title: 'Sichtbarkeit rückläufig', detail: `Impressionen ${impr.deltaPct}% ggü. Vorperiode.` });
        } else {
            const sign = impr.deltaPct >= 0 ? '+' : '';
            signals.push({ id: 'visibility', level: 'ok', title: 'Sichtbarkeit stabil', detail: `Impressionen ${sign}${impr.deltaPct}% ggü. den ${n} Tagen davor.` });
        }

        // 4. Indexation: live articles but no impressions at all in the current period.
        if (input.liveArticles > 0 && impr.current === 0) {
            signals.push({ id: 'indexation', level: 'warn', title: 'Keine Impressionen', detail: 'Live-Artikel vorhanden, aber 0 Impressionen — Indexierung in der Search Console prüfen.' });
        }
    }

    return signals;
}
