import fs from 'fs';
import path from 'path';
import type { QualityReport } from '@/scripts/content-engine/quality/types';

// Read-only reader for the quality-scan SoT artifact (content-engine/.quality-report.json,
// gitignored, written by `npm run quality:scan`). Mirrors the .indexation.json reader pattern:
// the dashboard never runs the scan, it only surfaces the last result. Missing file = not yet run.

const FILE = path.join(process.cwd(), 'content-engine/.quality-report.json');

export interface QualityView {
    report: QualityReport | null;
    ageHours: number | null; // hours since last scan, null if never run
    stale: boolean; // older than 7 days
}

export function getQualityReport(): QualityView {
    let report: QualityReport | null = null;
    try {
        report = JSON.parse(fs.readFileSync(FILE, 'utf8')) as QualityReport;
    } catch {
        return { report: null, ageHours: null, stale: false };
    }
    let ageHours: number | null = null;
    const t = Date.parse(report.scannedAt);
    if (!Number.isNaN(t)) ageHours = Math.round((Date.now() - t) / 3_600_000);
    return { report, ageHours, stale: ageHours !== null && ageHours > 24 * 7 };
}
