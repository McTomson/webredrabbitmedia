import fs from 'fs';
import path from 'path';
import { getAllPosts } from '@/lib/blog/posts';

// Local-only dashboard data layer (Phase 1, no external creds needed).
// Reads the SINGLE SOURCE OF TRUTH directly (queue.yaml + status.json + content/blog + .work logs)
// instead of keeping a second status store. Dependency-free YAML block parsing (no js-yaml).

const ROOT = process.cwd();
const CE = path.join(ROOT, 'content-engine');

export const CLUSTER_NAMES: Record<number, string> = {
    1: 'Strategie & Kosten',
    2: 'Technik & Performance',
    3: 'KI & Automatisierung',
    4: 'SEO & GEO',
    5: 'Design & UX',
    6: 'Recht & Sicherheit',
    7: 'Wartung & Analyse',
};

export interface QueueTopic {
    id: number;
    cluster: number;
    status: string; // effective status (after status.json override)
}

export interface OverviewData {
    queueTotal: number;
    statusCounts: Record<string, number>;
    perCluster: Array<{ cluster: number; name: string; total: number; published: number; review: number; todo: number; liveArticles: number }>;
    liveArticles: number;
    pendingMedia: Array<{ slug: string; requestedAt: string; hasPodcast: boolean; hasVideo: boolean }>;
    lastDailyRun: { file: string; ok: boolean; tail: string } | null;
    lastMediaCheck: { file: string; tail: string } | null;
}

function readQueueTopics(): QueueTopic[] {
    const file = path.join(CE, 'topics/queue.yaml');
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    const topicsPart = raw.split(/\ntopics:\s*\n/)[1] ?? '';
    // Split into per-topic blocks at lines beginning "  - id:".
    const blocks = topicsPart.split(/\n(?=\s*-\s*id:)/);
    const overrides = readStatusOverrides();
    const topics: QueueTopic[] = [];
    for (const b of blocks) {
        const id = Number(b.match(/\bid:\s*(\d+)/)?.[1]);
        if (!id) continue;
        const cluster = Number(b.match(/\bcluster:\s*(\d+)/)?.[1]) || 0;
        const rawStatus = b.match(/\bstatus:\s*([a-z]+)/)?.[1] || 'todo';
        topics.push({ id, cluster, status: overrides[id] ?? rawStatus });
    }
    return topics;
}

function readStatusOverrides(): Record<number, string> {
    const file = path.join(CE, 'topics/status.json');
    if (!fs.existsSync(file)) return {};
    try {
        const obj = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, string>;
        const out: Record<number, string> = {};
        for (const [k, v] of Object.entries(obj)) out[Number(k)] = v;
        return out;
    } catch {
        return {};
    }
}

function newestLog(prefix: string): string | null {
    const dir = path.join(ROOT, 'scripts/content-engine/.work');
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir).filter((f) => f.startsWith(prefix)).sort();
    return files.length ? path.join(dir, files[files.length - 1]) : null;
}

function tailFile(file: string, lines = 12): string {
    try {
        return fs.readFileSync(file, 'utf8').trimEnd().split('\n').slice(-lines).join('\n');
    } catch {
        return '';
    }
}

export async function getOverview(): Promise<OverviewData> {
    const topics = readQueueTopics();
    const statusCounts: Record<string, number> = {};
    for (const t of topics) statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;

    const posts = await getAllPosts();
    const liveByCluster: Record<number, number> = {};
    for (const p of posts) if (p.cluster) liveByCluster[p.cluster] = (liveByCluster[p.cluster] || 0) + 1;

    const perCluster = Object.keys(CLUSTER_NAMES).map(Number).map((cluster) => {
        const ct = topics.filter((t) => t.cluster === cluster);
        return {
            cluster,
            name: CLUSTER_NAMES[cluster],
            total: ct.length,
            published: ct.filter((t) => t.status === 'published' || t.status === 'covered').length,
            review: ct.filter((t) => t.status === 'review').length,
            todo: ct.filter((t) => t.status === 'todo').length,
            liveArticles: liveByCluster[cluster] || 0,
        };
    });

    // Pending media markers.
    const mediaDir = path.join(CE, '.media-requests');
    const pendingMedia: OverviewData['pendingMedia'] = [];
    if (fs.existsSync(mediaDir)) {
        for (const f of fs.readdirSync(mediaDir).filter((f) => f.endsWith('.json'))) {
            try {
                const m = JSON.parse(fs.readFileSync(path.join(mediaDir, f), 'utf8')) as { slug?: string; requestedAt?: string };
                const slug = m.slug || f.replace('.json', '');
                const mdxPath = path.join(ROOT, 'content/blog', `${slug}.mdx`);
                const mdx = fs.existsSync(mdxPath) ? fs.readFileSync(mdxPath, 'utf8') : '';
                pendingMedia.push({
                    slug,
                    requestedAt: m.requestedAt || '?',
                    hasPodcast: /SimpleAudioPlayer/.test(mdx),
                    hasVideo: /VideoEmbed/.test(mdx),
                });
            } catch { /* skip malformed marker */ }
        }
    }

    const dailyLog = newestLog('daily-');
    const mediaLog = newestLog('media-check-');
    const dailyTail = dailyLog ? tailFile(dailyLog) : '';

    return {
        queueTotal: topics.length,
        statusCounts,
        perCluster,
        liveArticles: posts.length,
        pendingMedia,
        lastDailyRun: dailyLog ? { file: path.basename(dailyLog), ok: /fertig/.test(dailyTail) || /Heute schon gelaufen/.test(dailyTail), tail: dailyTail } : null,
        lastMediaCheck: mediaLog ? { file: path.basename(mediaLog), tail: tailFile(mediaLog) } : null,
    };
}
