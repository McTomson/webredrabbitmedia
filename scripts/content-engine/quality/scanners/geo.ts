import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import type { ArticleGeo, GeoIssue } from '../types';

// GEO/AEO scanner via foglift-scan (declared devDependency). The basic single scan needs no API key
// (free); it sends the public article URL to foglift.io and returns SEO/GEO/AEO/perf/security/a11y
// sub-scores plus actionable top issues. Opt-in (--geo) — external network call; degrades gracefully.

// Prefer the locally installed binary (declared dep, reviewable); fall back to PATH.
function fogliftBin(): string {
    const local = path.join(process.cwd(), 'node_modules/.bin/foglift');
    return fs.existsSync(local) ? local : 'foglift';
}

interface FogliftParsed {
    overall: number | null;
    geo: number | null;
    subScores: Record<string, number> | null;
    issues: GeoIssue[];
}

// Parse foglift's JSON. Known shape: { scores: { overall, seo, geo, aeo, ... }, topIssues: [...] }.
// Defensive about missing fields. Pure — unit-tested.
export function parseFoglift(raw: string): FogliftParsed | null {
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return null;
    }
    if (!data || typeof data !== 'object') return null;
    const obj = data as Record<string, unknown>;
    const scores = obj.scores && typeof obj.scores === 'object' ? (obj.scores as Record<string, unknown>) : null;

    let subScores: Record<string, number> | null = null;
    let overall: number | null = null;
    let geo: number | null = null;
    if (scores) {
        subScores = {};
        for (const [k, v] of Object.entries(scores)) {
            if (typeof v === 'number' && v >= 0 && v <= 100) subScores[k] = Math.round(v);
        }
        overall = typeof subScores.overall === 'number' ? subScores.overall : null;
        geo = typeof subScores.geo === 'number' ? subScores.geo : null;
    }
    // Fallback: a bare numeric score field somewhere.
    if (overall === null && typeof obj.score === 'number') overall = Math.round(obj.score as number);

    const issues: GeoIssue[] = [];
    if (Array.isArray(obj.topIssues)) {
        for (const it of obj.topIssues as unknown[]) {
            const i = it as { category?: unknown; title?: unknown; severity?: unknown };
            issues.push({
                category: String(i.category ?? '—'),
                title: String(i.title ?? '—'),
                severity: String(i.severity ?? 'info'),
            });
        }
    }
    if (overall === null && geo === null && !subScores && issues.length === 0) return null;
    return { overall, geo, subScores, issues };
}

export function scanGeo(url: string): ArticleGeo {
    const empty = { score: null, geoScore: null, subScores: null, issues: [] as GeoIssue[] };
    const res = spawnSync(fogliftBin(), ['scan', url, '--json'], {
        encoding: 'utf8',
        timeout: 90_000,
        maxBuffer: 8 * 1024 * 1024,
    });
    if (res.error || res.status === null) {
        return { status: 'unavailable', note: 'foglift nicht installiert (npm i -D foglift-scan)', ...empty };
    }
    const out = (res.stdout || '').trim();
    if (!out) {
        return { status: 'unavailable', note: 'foglift lieferte keinen Output (Rate-Limit?)', ...empty };
    }
    const parsed = parseFoglift(out);
    if (parsed === null) {
        return { status: 'error', note: 'foglift-JSON nicht lesbar', ...empty };
    }
    return {
        status: 'ok',
        score: parsed.overall,
        geoScore: parsed.geo,
        subScores: parsed.subScores,
        issues: parsed.issues,
    };
}
