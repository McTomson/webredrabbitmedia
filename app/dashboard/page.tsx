import { getOverview } from '@/lib/dashboard/overview';
import { getVisibilityTrend } from '@/lib/dashboard/google';
import { buildHealthSignals } from '@/lib/dashboard/health';
import { Card, Kpi, SectionCard, Th, Td, HealthCard } from './ui';

// Überblick-Tab. Reads the local single source of truth (queue.yaml + status.json +
// content/blog + .work logs) plus a GSC week-over-week trend for the alarm card.
export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
    const d = await getOverview();
    const sc = d.statusCounts;
    const published = (sc.published || 0) + (sc.covered || 0);

    // Health/alarm: combine local pipeline state with the GSC visibility trend.
    const trendRes = await getVisibilityTrend(7);
    const newestArticleAgeDays = d.newestPublishedAt
        ? Math.max(0, Math.floor((Date.now() - Date.parse(d.newestPublishedAt)) / 86400000))
        : null;
    const healthSignals = buildHealthSignals({
        trend: trendRes.state === 'ok' ? trendRes.data : null,
        newestArticleAgeDays,
        lastDailyRunOk: d.lastDailyRun ? d.lastDailyRun.ok : null,
        liveArticles: d.liveArticles,
        killSwitch: d.killSwitch,
        indexation: d.indexation,
    });

    return (
        <div className="space-y-8">
            {/* Health / alarm (dead-man + penalty) */}
            <HealthCard signals={healthSignals} />

            {/* KPIs */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Kpi label="Themen gesamt" value={d.queueTotal} sub="queue.yaml" />
                <Kpi label="Live-Artikel" value={d.liveArticles} sub="content/blog" accent />
                <Kpi label="In Review" value={sc.review || 0} sub="warten auf Freigabe" />
                <Kpi label="Offen (todo)" value={sc.todo || 0} sub={`${published} erledigt/covered`} />
            </section>

            {/* Last run health + media queue */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${d.lastDailyRun?.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <h2 className="font-bold text-slate-900">Letzter Tageslauf</h2>
                        <span className="text-xs text-slate-400">{d.lastDailyRun?.file || 'kein Log (nur lokal)'}</span>
                    </div>
                    <pre className="max-h-44 overflow-auto rounded bg-black/[0.03] p-3 text-xs leading-relaxed text-slate-600">{d.lastDailyRun?.tail || 'Kein lokales Tageslauf-Log gefunden.'}</pre>
                </Card>
                <Card className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <h2 className="font-bold text-slate-900">Medien-Warteschlange</h2>
                        <span className="text-xs text-slate-400">{d.pendingMedia.length} offen</span>
                    </div>
                    {d.pendingMedia.length === 0 ? (
                        <p className="text-sm text-slate-500">Keine offenen Medien-Anfragen.</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {d.pendingMedia.map((m) => (
                                <li key={m.slug} className="flex items-center justify-between gap-2">
                                    <a href={`/tipps/${m.slug}`} target="_blank" rel="noreferrer" className="truncate text-slate-700 hover:text-red-600">{m.slug}</a>
                                    <span className="flex-shrink-0 text-xs">
                                        <span className={m.hasPodcast ? 'text-green-600' : 'text-slate-300'}>Podcast</span>
                                        {' · '}
                                        <span className={m.hasVideo ? 'text-green-600' : 'text-slate-300'}>Video</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </section>

            {/* Per-cluster breakdown */}
            <SectionCard title="Cluster-Fortschritt (Pilot zuerst, dann Breite)">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-black/[0.06]">
                                <Th>Cluster</Th>
                                <Th numeric>Themen</Th>
                                <Th numeric>Live-Artikel</Th>
                                <Th numeric>Review</Th>
                                <Th numeric>Offen</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.perCluster.map((c) => (
                                <tr key={c.cluster} className="border-b border-black/[0.04]">
                                    <Td strong>{c.cluster}. {c.name}</Td>
                                    <Td numeric>{c.total}</Td>
                                    <Td numeric>{c.liveArticles}</Td>
                                    <Td numeric>{c.review}</Td>
                                    <Td numeric>{c.todo}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>
    );
}
