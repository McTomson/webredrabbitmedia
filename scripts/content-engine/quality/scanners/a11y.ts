import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import type { ArticleA11y } from '../types';

// Accessibility scanner via pa11y (HTML_CodeSniffer/axe over headless Chromium). Opt-in (--a11y).
// pa11y pulls puppeteer/Chromium (~170 MB), so it is deliberately NOT a declared dependency
// (Plan §15: no Ballast). The scanner uses a locally installed pa11y if present and otherwise
// degrades to "unavailable" — enable it with `npm i -D pa11y` when accessibility scanning is wanted.

function pa11yBin(): string {
    const local = path.join(process.cwd(), 'node_modules/.bin/pa11y');
    return fs.existsSync(local) ? local : 'pa11y';
}

interface Pa11yIssue {
    type?: string; // 'error' | 'warning' | 'notice'
    code?: string;
    message?: string;
}

// pa11y --reporter json prints a JSON array of issues. Count only hard errors as violations;
// keep a small sample of messages for context. Pure — unit-tested.
export function parsePa11yJson(raw: string): { violations: number; sample: string[] } | null {
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return null;
    }
    if (!Array.isArray(data)) return null;
    const issues = data as Pa11yIssue[];
    const errors = issues.filter((i) => i.type === 'error');
    const sample = errors.slice(0, 5).map((i) => (i.message || i.code || 'WCAG-Verstoß').toString().slice(0, 120));
    return { violations: errors.length, sample };
}

export function scanA11y(url: string): ArticleA11y {
    const res = spawnSync(pa11yBin(), ['--reporter', 'json', '--timeout', '30000', url], {
        encoding: 'utf8',
        timeout: 120_000,
        maxBuffer: 16 * 1024 * 1024,
    });
    if (res.error || res.status === null) {
        return { status: 'unavailable', note: 'pa11y nicht installiert (npm i -D pa11y)', violations: null, sample: [] };
    }
    const out = (res.stdout || '').trim();
    if (!out) {
        return { status: 'unavailable', note: 'pa11y lieferte keinen Output', violations: null, sample: [] };
    }
    const parsed = parsePa11yJson(out);
    if (parsed === null) {
        return { status: 'error', note: 'pa11y-JSON nicht lesbar', violations: null, sample: [] };
    }
    return { status: 'ok', violations: parsed.violations, sample: parsed.sample };
}
