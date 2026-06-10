import { getAnalyticsData } from '@/lib/dashboard/google';
import { int, pct, duration } from '@/lib/dashboard/format';
import { Kpi, SectionCard, StateNotice, EmptyState, Th, Td, RangeSwitch, parseRange } from '../ui';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
    const sp = await searchParams;
    const days = parseRange(sp.days);
    const res = await getAnalyticsData(days);

    if (res.state !== 'ok') {
        return (
            <div className="space-y-4">
                <RangeSwitch basePath="/dashboard/analytics" active={days} />
                <StateNotice kind={res.state} message={res.message} />
            </div>
        );
    }

    const d = res.data;
    const maxChannel = Math.max(1, ...d.channels.map((c) => c.sessions));

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">GA4-Property {d.propertyId} · letzte {days} Tage</p>
                <RangeSwitch basePath="/dashboard/analytics" active={days} />
            </div>

            <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Kpi label="Anfragen" value={int(d.leads)} sub="generate_lead" accent />
                <Kpi label="Aktive Nutzer" value={int(d.totals.activeUsers)} />
                <Kpi label="Sitzungen" value={int(d.totals.sessions)} />
                <Kpi label="Seitenaufrufe" value={int(d.totals.pageViews)} />
                <Kpi label="Engagement" value={pct(d.totals.engagementRate)} sub="Engagement-Rate" />
                <Kpi label="Ø Sitzung" value={duration(d.totals.avgSessionSec)} sub="Dauer" />
            </section>

            <SectionCard title="Anfragen pro Seite" hint="generate_lead je Seite">
                {d.leadsByPage.length === 0 ? (
                    <EmptyState message="Noch keine Anfragen im Zeitraum. Sobald ein Kontaktformular abgeschickt wird, erscheinen die Anfragen hier — je Artikel." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.06]">
                                    <Th>Seite</Th>
                                    <Th numeric>Anfragen</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.leadsByPage.map((r) => {
                                    const safeHref = r.path.startsWith('/') ? r.path : undefined;
                                    return (
                                        <tr key={r.path} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                            <Td strong>
                                                {safeHref ? (
                                                    <a href={safeHref} target="_blank" rel="noreferrer" className="hover:text-red-600">{r.path}</a>
                                                ) : (
                                                    r.path
                                                )}
                                            </Td>
                                            <Td numeric>{int(r.count)}</Td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SectionCard title="Top-Seiten" hint="nach Aufrufen">
                    {d.topPages.length === 0 ? (
                        <EmptyState message="Noch keine Seiten-Daten im Zeitraum." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06]">
                                        <Th>Pfad</Th>
                                        <Th numeric>Aufrufe</Th>
                                        <Th numeric>Nutzer</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {d.topPages.map((r) => {
                                        // GA4 pagePath should be a site-relative path; only link when it is one.
                                        const safeHref = r.path.startsWith('/') ? r.path : undefined;
                                        return (
                                        <tr key={r.path} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                            <Td strong>
                                                {safeHref ? (
                                                    <a href={safeHref} target="_blank" rel="noreferrer" className="hover:text-red-600">{r.path}</a>
                                                ) : (
                                                    r.path
                                                )}
                                            </Td>
                                            <Td numeric>{int(r.views)}</Td>
                                            <Td numeric>{int(r.users)}</Td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Kanäle / Quellen" hint="nach Sitzungen">
                    {d.channels.length === 0 ? (
                        <EmptyState message="Noch keine Quellen-Daten im Zeitraum." />
                    ) : (
                        <ul className="space-y-3">
                            {d.channels.map((c) => (
                                <li key={c.key}>
                                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                                        <span className="font-medium text-slate-800">{c.key}</span>
                                        <span className="tabular-nums text-slate-500">{int(c.sessions)} Sitzungen · {int(c.users)} Nutzer</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.round((c.sessions / maxChannel) * 100)}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
