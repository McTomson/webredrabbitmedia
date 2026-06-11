import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import matter from 'gray-matter';
import type { ArticleLinks, BrokenLink } from '../types';

// Link scanner. Two independent checks:
//  1. internal /tipps/{slug} links resolve to a real article (pure, offline, always runs) —
//     directly de-risks the deterministic cluster auto-linker (Pre-Mortem: broken auto-links).
//  2. external http(s) link liveness via the `lychee` binary (graceful degrade if absent/offline).

// All markdown links in a body, excluding image embeds (/images/...). Mirrors the onpage.ts intent
// but captures both internal (/...) and external (http...) targets.
export function extractLinks(body: string): { internal: string[]; external: string[] } {
    const internal: string[] = [];
    const external: string[] = [];
    for (const m of body.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const href = m[1];
        if (href.startsWith('/images')) continue;
        if (href.startsWith('http://') || href.startsWith('https://')) external.push(href);
        else if (href.startsWith('/')) internal.push(href);
    }
    return { internal, external };
}

// Internal /tipps/{slug} links whose slug is not a known article. Other internal paths
// (e.g. /kontakt) are left to the live lychee pass and not flagged here (no false positives).
export function checkInternalTipps(internal: string[], validSlugs: Set<string>): BrokenLink[] {
    const broken: BrokenLink[] = [];
    for (const href of internal) {
        const m = href.match(/^\/tipps\/([a-z0-9-]+)\/?$/);
        if (!m) continue; // not a /tipps/{slug} link — skip (could be a valid static route)
        if (!validSlugs.has(m[1])) broken.push({ url: href, status: 'unknown slug' });
    }
    return broken;
}

// Valid /tipps slugs = every MDX article (drafts included — they will publish) + every hardcoded
// app/tipps/{slug}/page.tsx route. A cluster link to any of these resolves once live.
export function loadValidSlugs(blogDir: string, tippsDir: string): Set<string> {
    const out = new Set<string>();
    if (fs.existsSync(blogDir)) {
        for (const f of fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'))) {
            const fm = matter(fs.readFileSync(path.join(blogDir, f), 'utf8')).data as { slug?: string };
            out.add((fm.slug || f.replace('.mdx', '')).toString());
        }
    }
    if (fs.existsSync(tippsDir)) {
        for (const e of fs.readdirSync(tippsDir, { withFileTypes: true })) {
            if (e.isDirectory() && e.name !== '[slug]' && fs.existsSync(path.join(tippsDir, e.name, 'page.tsx'))) {
                out.add(e.name);
            }
        }
    }
    return out;
}

// Parse `lychee --format json` output into broken links. Defensive across lychee versions:
// failures live under `fail_map` (and older `error_map`), keyed by input source → array of entries.
export function parseLycheeJson(raw: string): BrokenLink[] {
    const broken: BrokenLink[] = [];
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return broken;
    }
    const obj = data as Record<string, unknown>;
    for (const mapKey of ['fail_map', 'error_map']) {
        const map = obj[mapKey] as Record<string, unknown> | undefined;
        if (!map || typeof map !== 'object') continue;
        for (const entries of Object.values(map)) {
            if (!Array.isArray(entries)) continue;
            for (const e of entries) {
                const entry = e as { url?: string; status?: unknown };
                const url = typeof entry.url === 'string' ? entry.url : 'unknown';
                let status = 'failed';
                const st = entry.status as { code?: number; text?: string } | string | undefined;
                if (typeof st === 'string') status = st;
                else if (st && typeof st === 'object') status = st.text || (st.code ? String(st.code) : 'failed');
                broken.push({ url, status });
            }
        }
    }
    return broken;
}

// Run lychee over a set of external URLs. Returns null if the binary is unavailable (degrade).
export function runLychee(urls: string[]): BrokenLink[] | null {
    if (urls.length === 0) return [];
    // Accept 403/429 as "exists": these are almost always bot-blocking (the link works for a real
    // reader), not a dead page. Reporting them as broken would be a false signal. Truly dead links
    // return 404/410/5xx and are still flagged.
    const res = spawnSync(
        'lychee',
        ['--format', 'json', '--no-progress', '--max-concurrency', '4', '--timeout', '20', '--accept', '200..=299,403,429', ...urls],
        { encoding: 'utf8', timeout: 120_000, maxBuffer: 8 * 1024 * 1024 },
    );
    if (res.error || res.status === null) return null; // not installed / killed
    // lychee exits non-zero when links fail; the JSON is still on stdout.
    const out = res.stdout || '';
    if (!out.trim()) return null;
    return parseLycheeJson(out);
}

// Scan one article's links. `body` is the MDX content; `validSlugs` the known-slug set;
// `live` toggles the external lychee pass.
export function scanLinks(body: string, validSlugs: Set<string>, live: boolean): ArticleLinks {
    const { internal, external } = extractLinks(body);
    const internalBroken = checkInternalTipps(internal, validSlugs);
    if (!live) {
        return {
            status: 'ok',
            note: 'externe Links nicht geprüft (offline-Modus)',
            internalBroken,
            externalBroken: [],
            totalInternal: internal.length,
            totalExternal: external.length,
        };
    }
    const externalBroken = runLychee(external);
    if (externalBroken === null) {
        return {
            status: 'unavailable',
            note: 'lychee nicht verfügbar oder kein Output',
            internalBroken,
            externalBroken: [],
            totalInternal: internal.length,
            totalExternal: external.length,
        };
    }
    return {
        status: 'ok',
        internalBroken,
        externalBroken,
        totalInternal: internal.length,
        totalExternal: external.length,
    };
}
