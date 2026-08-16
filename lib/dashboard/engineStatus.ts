import fs from 'node:fs';
import path from 'node:path';

// Read-only view of the content-engine's own run status. The engine writes
// content-engine/status/engine-status.json at the end of each run (daily article +
// media tail) and pushes it, so this file rides along into the Vercel bundle.
// Everything here is pure so the timestamps freeze at deploy but the "wie lange her"
// is computed at request time — that is what makes the alive/stale flag update live
// even between deploys (staleness is exactly what we measure).

export interface RunEntry {
    /** ISO timestamp of when the run finished. */
    at: string;
    ok: boolean;
    slug?: string;
    title?: string;
    /** media only: which assets were produced, e.g. ['podcast','video','substack']. */
    produced?: string[];
    error?: string | null;
    /** true = derived seed, not a real recorded run (replaced by the next real run). */
    seed?: boolean;
}

export interface EngineStatus {
    daily?: RunEntry;
    media?: RunEntry;
}

// Daily job runs ~every 24h. Past this age with no daily run, something is wrong
// (the engine has a history of silent stalls — mail-hang, ENOEXEC, media-lock).
export const ENGINE_STALE_HOURS = 26;

const FILE = path.join(process.cwd(), 'content-engine/status/engine-status.json');

export function getEngineStatus(): EngineStatus | null {
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8')) as EngineStatus;
    } catch {
        return null;
    }
}

/** Hours since `at` (ISO), or null if `at` is missing/unparseable. */
export function hoursSince(at: string | undefined | null, nowMs: number): number | null {
    if (!at) return null;
    const t = Date.parse(at);
    if (Number.isNaN(t)) return null;
    return (nowMs - t) / 3_600_000;
}

/** Engine is "alive" when the daily job ran within ENGINE_STALE_HOURS. */
export function isEngineAlive(status: EngineStatus | null, nowMs: number): boolean {
    const h = hoursSince(status?.daily?.at, nowMs);
    return h != null && h < ENGINE_STALE_HOURS && status?.daily?.ok !== false;
}

/** Compact "vor 4 Min / vor 3 Std / vor 2 Tagen" for the UI. */
export function agoLabel(at: string | undefined | null, nowMs: number): string {
    const h = hoursSince(at, nowMs);
    if (h == null) return '—';
    const min = h * 60;
    if (min < 1) return 'gerade eben';
    if (min < 60) return `vor ${Math.round(min)} Min`;
    if (h < 48) return `vor ${Math.round(h)} Std`;
    return `vor ${Math.round(h / 24)} Tagen`;
}
