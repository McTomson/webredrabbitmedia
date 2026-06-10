import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOverview } from '@/lib/dashboard/overview';

// Local-only internal dashboard (Phase 1, overview tier — no external creds).
// Run via `npm run dev` and open http://localhost:9000/dashboard.
// noindex + force-dynamic so it never gets indexed and always reads the current local state.
export const metadata: Metadata = {
    title: 'Content-Engine Dashboard',
    robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

function Kpi({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <div className="mt-1 text-sm font-medium text-gray-700">{label}</div>
            {sub && <div className="mt-0.5 text-xs text-gray-400">{sub}</div>}
        </div>
    );
}

export default async function DashboardPage() {
    // Internal, local-only tool. On production (Vercel) it is hidden unless DASHBOARD_ENABLED is set,
    // so it never gets exposed publicly (it will later carry GSC/GA4 data). Locally (dev) it always shows.
    if (process.env.NODE_ENV === 'production' && !process.env.DASHBOARD_ENABLED) {
        notFound();
    }
    const d = await getOverview();
    const sc = d.statusCounts;
    const published = (sc.published || 0) + (sc.covered || 0);

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Content-Engine Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Lokale Übersicht (Überblick-Tab). GSC- und Traffic-Tabs folgen, sobald das Google-Cloud-Service-Konto steht.
                </p>
            </header>

            {/* KPIs */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Kpi label="Themen gesamt" value={d.queueTotal} sub="queue.yaml" />
                <Kpi label="Live-Artikel" value={d.liveArticles} sub="content/blog (published)" />
                <Kpi label="In Review" value={sc.review || 0} sub="warten auf Freigabe" />
                <Kpi label="Offen (todo)" value={sc.todo || 0} sub={`${published} erledigt/covered`} />
            </section>

            {/* Last run health */}
            <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${d.lastDailyRun?.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <h2 className="font-bold text-gray-900">Letzter Tageslauf</h2>
                        <span className="text-xs text-gray-400">{d.lastDailyRun?.file || 'kein Log (nur lokal)'}</span>
                    </div>
                    <pre className="max-h-44 overflow-auto rounded bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">{d.lastDailyRun?.tail || 'Kein lokales Tageslauf-Log gefunden.'}</pre>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <h2 className="font-bold text-gray-900">Medien-Warteschlange</h2>
                        <span className="text-xs text-gray-400">{d.pendingMedia.length} offen</span>
                    </div>
                    {d.pendingMedia.length === 0 ? (
                        <p className="text-sm text-gray-500">Keine offenen Medien-Anfragen.</p>
                    ) : (
                        <ul className="space-y-2 text-sm">
                            {d.pendingMedia.map((m) => (
                                <li key={m.slug} className="flex items-center justify-between gap-2">
                                    <a href={`/tipps/${m.slug}`} target="_blank" rel="noreferrer" className="truncate text-gray-700 hover:text-red-600">{m.slug}</a>
                                    <span className="flex-shrink-0 text-xs">
                                        <span className={m.hasPodcast ? 'text-green-600' : 'text-gray-300'}>Podcast</span>
                                        {' · '}
                                        <span className={m.hasVideo ? 'text-green-600' : 'text-gray-300'}>Video</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* Per-cluster breakdown */}
            <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-bold text-gray-900">Cluster-Fortschritt (Pilot zuerst, dann Breite)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                <th className="py-2 pr-4">Cluster</th>
                                <th className="py-2 pr-4">Themen</th>
                                <th className="py-2 pr-4">Live-Artikel</th>
                                <th className="py-2 pr-4">Review</th>
                                <th className="py-2 pr-4">Offen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.perCluster.map((c) => (
                                <tr key={c.cluster} className="border-b border-gray-100">
                                    <td className="py-2 pr-4 font-medium text-gray-900">{c.cluster}. {c.name}</td>
                                    <td className="py-2 pr-4 text-gray-600">{c.total}</td>
                                    <td className="py-2 pr-4 text-gray-600">{c.liveArticles}</td>
                                    <td className="py-2 pr-4 text-gray-600">{c.review}</td>
                                    <td className="py-2 pr-4 text-gray-600">{c.todo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
