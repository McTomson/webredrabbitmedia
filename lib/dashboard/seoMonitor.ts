import fs from 'fs';
import path from 'path';

// Read-only data layer for the SEO-Monitor tab. Reads the single source of truth
// (content-engine/seo-monitor/tasks.json) that the weekly Monday monitor writes.
// Missing/invalid file degrades gracefully to a null payload (page shows an EmptyState).

const ROOT = process.cwd();
const FILE = path.join(ROOT, 'content-engine/seo-monitor/tasks.json');

export type SeoTaskStatus = 'open' | 'done' | 'watch' | 'new';
export type SeoTaskPriority = 'high' | 'medium' | 'low';

export interface SeoTask {
    id: string;
    title: string;
    area: string;
    priority: SeoTaskPriority;
    status: SeoTaskStatus;
    detail: string;
    evidence?: string;
}

export interface SeoMetrics {
    rangeLabel: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: number;
    indexed: number;
    notIndexed: number;
    pagespeedHome: number | null;
    baseline3MonthNote?: string;
}

export interface SeoMonitorData {
    updatedAt: string;
    week: string;
    source?: string;
    metrics: SeoMetrics | null;
    tasks: SeoTask[];
    counts: { open: number; watch: number; done: number; high: number };
}

const PRIORITY_RANK: Record<SeoTaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_RANK: Record<SeoTaskStatus, number> = { new: 0, open: 1, watch: 2, done: 3 };

export function getSeoMonitor(): SeoMonitorData | null {
    let raw: { updatedAt?: string; week?: string; source?: string; metrics?: SeoMetrics; tasks?: SeoTask[] };
    try {
        raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
        return null;
    }

    const tasks = Array.isArray(raw.tasks) ? raw.tasks : [];
    // Sort: done last, then by priority, so the actionable items sit on top.
    const sorted = [...tasks].sort(
        (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    );

    const counts = {
        open: tasks.filter((t) => t.status === 'open' || t.status === 'new').length,
        watch: tasks.filter((t) => t.status === 'watch').length,
        done: tasks.filter((t) => t.status === 'done').length,
        high: tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length,
    };

    return {
        updatedAt: raw.updatedAt || '—',
        week: raw.week || '—',
        source: raw.source,
        metrics: raw.metrics ?? null,
        tasks: sorted,
        counts,
    };
}
