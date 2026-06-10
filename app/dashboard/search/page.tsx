import { TrendingUp } from 'lucide-react';
import { getSearchConsoleData } from '@/lib/dashboard/google';
import { int, pct, pos } from '@/lib/dashboard/format';
import { Kpi, SectionCard, StateNotice, EmptyState, Th, Td, RangeSwitch, parseRange } from '../ui';

export const dynamic = 'force-dynamic';

function PositionBadge({ position }: { position: number }) {
    // Page 1 (≤10) green, page-1-edge/page-2 (11–20) amber. Icon + text, not color alone.
    const onPage1 = position <= 10;
    return (
        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ${onPage1 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            Pos {pos(position)}
        </span>
    );
}

export default async function SearchConsolePage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
    const sp = await searchParams;
    const days = parseRange(sp.days);
    const res = await getSearchConsoleData(days);

    if (res.state !== 'ok') {
        return (
            <div className="space-y-4">
                <RangeSwitch basePath="/dashboard/search" active={days} />
                <StateNotice kind={res.state} message={res.message} />
            </div>
        );
    }

    const d = res.data;
    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                    {d.site} · {d.startDate} bis {d.endDate}
                </p>
                <RangeSwitch basePath="/dashboard/search" active={days} />
            </div>

            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Kpi label="Klicks" value={int(d.totals.clicks)} sub={`letzte ${days} Tage`} accent />
                <Kpi label="Impressionen" value={int(d.totals.impressions)} sub={`letzte ${days} Tage`} />
                <Kpi label="Ø CTR" value={pct(d.totals.ctr)} sub="Klicks / Impressionen" />
                <Kpi label="Ø Position" value={pos(d.totals.position)} sub="impr.-gew. (Top 250)" />
            </section>

            {/* Striking distance — the #1 daily lever */}
            <SectionCard title="Striking Distance (Position 8–20)" hint="kleiner Schub = echter Traffic">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    Suchbegriffe knapp vor oder auf Seite 1 — die besten Ziele für den nächsten Artikel oder eine Überarbeitung.
                </div>
                {d.strikingDistance.length === 0 ? (
                    <EmptyState message="Noch keine Suchbegriffe im Bereich Position 8–20. Kommt mit mehr Impressionen." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.06]">
                                    <Th>Suchbegriff</Th>
                                    <Th numeric>Position</Th>
                                    <Th numeric>Impressionen</Th>
                                    <Th numeric>Klicks</Th>
                                    <Th numeric>CTR</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.strikingDistance.map((r) => (
                                    <tr key={r.key} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                        <Td strong>{r.key}</Td>
                                        <td className="py-2 pr-4 text-right"><PositionBadge position={r.position} /></td>
                                        <Td numeric>{int(r.impressions)}</Td>
                                        <Td numeric>{int(r.clicks)}</Td>
                                        <Td numeric>{pct(r.ctr)}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SectionCard title="Top-Suchbegriffe" hint="nach Klicks">
                    {d.topQueries.length === 0 ? (
                        <EmptyState message="Noch keine Suchbegriff-Daten." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06]">
                                        <Th>Suchbegriff</Th>
                                        <Th numeric>Klicks</Th>
                                        <Th numeric>Impr.</Th>
                                        <Th numeric>Pos</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {d.topQueries.map((r) => (
                                        <tr key={r.key} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                            <Td strong>{r.key}</Td>
                                            <Td numeric>{int(r.clicks)}</Td>
                                            <Td numeric>{int(r.impressions)}</Td>
                                            <Td numeric>{pos(r.position)}</Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Top-Seiten" hint="nach Klicks">
                    {d.topPages.length === 0 ? (
                        <EmptyState message="Noch keine Seiten-Daten." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06]">
                                        <Th>Seite</Th>
                                        <Th numeric>Klicks</Th>
                                        <Th numeric>Impr.</Th>
                                        <Th numeric>Pos</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {d.topPages.map((r) => {
                                        const pathOnly = r.key.replace(/^https?:\/\/[^/]+/, '') || '/';
                                        const safeHref = /^https?:\/\//i.test(r.key) ? r.key : undefined;
                                        return (
                                            <tr key={r.key} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                                <Td strong>
                                                    {safeHref ? (
                                                        <a href={safeHref} target="_blank" rel="noreferrer" className="hover:text-red-600">{pathOnly}</a>
                                                    ) : (
                                                        pathOnly
                                                    )}
                                                </Td>
                                                <Td numeric>{int(r.clicks)}</Td>
                                                <Td numeric>{int(r.impressions)}</Td>
                                                <Td numeric>{pos(r.position)}</Td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
