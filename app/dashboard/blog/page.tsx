import { getBlogBoard } from '@/lib/dashboard/blog';
import { getSearchConsoleData } from '@/lib/dashboard/google';
import { int } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, StateNotice, Th, Td } from '../ui';
import { FileClock, Clapperboard, FileText, ExternalLink } from 'lucide-react';

// Blog tab. A lean, read-only status board over the content-engine's own files:
// what waits for Thomas' Freigabe (drafts), what still needs media (leftover markers),
// and which live articles actually earn GSC clicks. No CMS, no editing, no new infra.
export const dynamic = 'force-dynamic';

const SITE = 'https://web.redrabbit.media';

function dateOnly(s: string): string {
    return s ? s.slice(0, 10) : '—';
}

// Media marker status → plain-German label of what is still missing.
function mediaLabel(status: string): string {
    switch (status) {
        case 'requested':
            return 'Podcast + Video offen';
        case 'needs-images':
            return 'Bilder fehlen (Codex leer)';
        case 'needs-video':
            return 'Video fehlt';
        default:
            return status;
    }
}

export default async function BlogPage() {
    const [board, gsc] = await Promise.all([getBlogBoard(), getSearchConsoleData(28)]);

    // Join published articles with GSC per-page clicks where available (top pages only).
    const clicksByPath = new Map<string, { clicks: number; impressions: number }>();
    if (gsc.state === 'ok') {
        for (const row of gsc.data.topPages) {
            try {
                const p = new URL(row.key).pathname.replace(/\/$/, '');
                clicksByPath.set(p, { clicks: row.clicks, impressions: row.impressions });
            } catch {
                // non-URL key, ignore
            }
        }
    }
    const gscForSlug = (slug: string) => clicksByPath.get(`/tipps/${slug}`) ?? null;

    const latest = board.published[0]?.publishedAt;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">Blog</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Was auf deine Freigabe wartet, wo noch Medien fehlen, und ob die Live-Artikel Klicks bringen.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Kpi label="Live-Artikel" value={board.published.length} sub={latest ? `zuletzt ${dateOnly(latest)}` : undefined} />
                <Kpi label="Freigabe offen" value={board.drafts.length} accent={board.drafts.length > 0} />
                <Kpi label="Medien offen" value={board.openMedia.length} accent={board.openMedia.length > 0} />
            </div>

            {/* ── Freigabe offen ─────────────────────────────────────────── */}
            <SectionCard
                title="Freigabe offen"
                hint="Entwürfe, die auf dein OK warten. Vorschau öffnet den Artikel (noch nicht öffentlich)."
            >
                {board.drafts.length === 0 ? (
                    <EmptyState message="Kein Entwurf wartet — alles freigegeben." />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {board.drafts.map((p) => (
                            <li key={p.slug} className="flex items-center justify-between gap-4 py-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                                        <FileClock className="h-4 w-4 shrink-0 text-amber-500" />
                                        <span className="truncate">{p.title}</span>
                                    </div>
                                    <div className="mt-0.5 text-xs text-slate-400">{dateOnly(p.publishedAt)}</div>
                                </div>
                                <a
                                    href={`${SITE}/tipps/${p.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Vorschau <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionCard>

            {/* ── Medien offen ───────────────────────────────────────────── */}
            <SectionCard
                title="Medien offen"
                hint="Artikel, für die Podcast/Video/Substack noch nicht erzeugt sind (offener Marker-Backlog)."
            >
                {board.openMedia.length === 0 ? (
                    <EmptyState message="Keine offenen Medien — alle Marker abgearbeitet." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <Th>Artikel</Th>
                                    <Th>Was fehlt</Th>
                                    <Th>Angefragt</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {board.openMedia.map((m) => (
                                    <tr key={m.slug} className="border-b border-slate-50">
                                        <Td>
                                            <div className="flex items-center gap-2">
                                                <Clapperboard className="h-4 w-4 shrink-0 text-slate-400" />
                                                <a
                                                    href={`${SITE}/tipps/${m.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate hover:text-slate-900 hover:underline"
                                                >
                                                    {m.chosenHook || m.slug}
                                                </a>
                                            </div>
                                        </Td>
                                        <Td>{mediaLabel(m.status)}</Td>
                                        <Td numeric>{dateOnly(m.requestedAt)}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            {/* ── Live-Artikel ───────────────────────────────────────────── */}
            <SectionCard
                title="Live-Artikel"
                hint="Veröffentlichte Beiträge. Klicks/Impr. aus den GSC-Top-Seiten (28 Tage); leer = außerhalb der Top-Seiten."
            >
                {gsc.state !== 'ok' && (
                    <div className="mb-3">
                        <StateNotice kind={gsc.state} message={gsc.message} />
                    </div>
                )}
                {board.published.length === 0 ? (
                    <EmptyState message="Noch keine veröffentlichten Artikel." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-left">
                                    <Th>Titel</Th>
                                    <Th>Datum</Th>
                                    <Th numeric>Klicks</Th>
                                    <Th numeric>Impr.</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {board.published.map((p) => {
                                    const g = gscForSlug(p.slug);
                                    return (
                                        <tr key={p.slug} className="border-b border-slate-50">
                                            <Td>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 shrink-0 text-slate-300" />
                                                    <a
                                                        href={`${SITE}/tipps/${p.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate hover:text-slate-900 hover:underline"
                                                    >
                                                        {p.title}
                                                    </a>
                                                </div>
                                            </Td>
                                            <Td numeric>{dateOnly(p.publishedAt)}</Td>
                                            <Td numeric strong={!!g && g.clicks > 0}>{g ? int(g.clicks) : '—'}</Td>
                                            <Td numeric>{g ? int(g.impressions) : '—'}</Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>
        </div>
    );
}
