import { getLocalRank } from '@/lib/dashboard/localRank';
import { heatLevel } from '@/lib/localrank/kpi';
import { initialRequest, followUp, replyDraft, reviewLink } from '@/lib/localrank/reviewOutreach';
import { BUSINESS } from '@/lib/localrank/config';
import { totalImpressions, metricTotal, type MetricSeries } from '@/lib/localrank/performance';
import { int, pct, pos } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, Card, HealthCard, Sparkline, Th, Td } from '../ui';
import type { KeywordGrid, RankCell } from '@/lib/localrank/types';
import { Star, MessageSquare, AlertTriangle } from 'lucide-react';

// Local (Google Business Profile) tab. Read-only surface over the weekly grid-rank
// + review snapshots (content-engine/local-rank/*). Shows where we rank in the Vienna
// Local Pack, how healthy our reviews are, and previews the compliant outreach engine.
export const dynamic = 'force-dynamic';

// ── Heatmap cell colour (green ≤3, yellow 4–10, red 11+, muted grey = unranked) ──
function cellStyle(rank: number | null): string {
    if (rank == null) return 'bg-slate-100 text-slate-300';
    const lvl = heatLevel(rank);
    if (lvl === 'green') return 'bg-emerald-500 text-white';
    if (lvl === 'yellow') return 'bg-amber-400 text-amber-950';
    return 'bg-rose-400 text-white';
}

function Heatmap({ grid, size }: { grid: KeywordGrid; size: number }) {
    const half = (size - 1) / 2;
    const byPos = new Map<string, RankCell>();
    for (const c of grid.cells) byPos.set(`${c.row},${c.col}`, c);
    // Rows north→south (high row first), cols west→east (low col first).
    const rows = Array.from({ length: size }, (_, i) => half - i);
    const cols = Array.from({ length: size }, (_, i) => i - half);
    return (
        <div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                {rows.map((r) =>
                    cols.map((c) => {
                        const cell = byPos.get(`${r},${c}`);
                        const rank = cell?.rank ?? null;
                        return (
                            <div
                                key={`${r},${c}`}
                                className={`flex aspect-square items-center justify-center rounded-md text-[11px] font-semibold tabular-nums ${cellStyle(rank)}`}
                                title={`Punkt r${r} c${c}: ${rank == null ? 'nicht in Top 20' : `Platz ${rank}`}`}
                            >
                                {rank == null ? '·' : rank}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-slate-800">{grid.keyword}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                    SoLV {pct(grid.kpis.solv, 0)} · ATRP {pos(grid.kpis.atrp)}
                </span>
            </div>
        </div>
    );
}

const SAMPLE = { customerName: 'Frau Berger', projectName: 'Website-Relaunch', link: reviewLink(BUSINESS.placeId) || 'https://search.google.com/local/writereview?placeid=<PLACE_ID>' };

function TemplatePreview({ title, subject, body }: { title: string; subject: string; body: string }) {
    return (
        <div className="rounded-xl border border-black/[0.06] p-4">
            <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-slate-500">{title}</span>
                <span className="text-[12px] font-semibold text-slate-800">{subject}</span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-slate-600">{body}</pre>
        </div>
    );
}

// Sum all impression metrics per date into one "gesehen" series for the sparkline.
function mergedImpressions(metrics: MetricSeries[]): number[] {
    const byDate = new Map<string, number>();
    for (const m of metrics) {
        if (!m.metric.startsWith('BUSINESS_IMPRESSIONS')) continue;
        for (const p of m.points) byDate.set(p.date, (byDate.get(p.date) ?? 0) + p.value);
    }
    return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
}

function PerformanceSection({ perf }: { perf: NonNullable<ReturnType<typeof getLocalRank>['performance']> }) {
    const impr = totalImpressions(perf.metrics);
    const spark = mergedImpressions(perf.metrics);
    return (
        <SectionCard title="Sichtbarkeit (Google-Performance)" hint={`letzte ${perf.rangeDays} Tage · gratis, offiziell`}>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Impressionen" value={int(impr)} sub="Maps + Suche" />
                <Kpi label="Website-Klicks" value={int(metricTotal(perf.metrics, 'WEBSITE_CLICKS'))} />
                <Kpi label="Anrufe" value={int(metricTotal(perf.metrics, 'CALL_CLICKS'))} />
                <Kpi label="Routen-Anfragen" value={int(metricTotal(perf.metrics, 'BUSINESS_DIRECTION_REQUESTS'))} />
            </div>
            {spark.length >= 2 && (
                <div className="mt-5">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">Impressionen-Verlauf</div>
                    <Sparkline data={spark} />
                </div>
            )}
            {perf.keywords.length > 0 && (
                <div className="mt-6">
                    <div className="mb-2 text-[13px] font-semibold text-slate-800">Womit Leute uns finden</div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/[0.06]">
                                <Th>Suchbegriff</Th>
                                <Th numeric>Impressionen</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {perf.keywords.slice(0, 12).map((k) => (
                                <tr key={k.keyword} className="border-b border-black/[0.04]">
                                    <Td strong>{k.keyword}</Td>
                                    <Td numeric>{k.isThreshold ? `≥ ${int(k.value)}` : int(k.value)}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-[11px] text-slate-400">Das sind die tatsächlichen Suchbegriffe aus der Google-Performance — die beste Vorlage für Profil-Texte und Posts.</p>
                </div>
            )}
        </SectionCard>
    );
}

export default function LocalRankPage() {
    const view = getLocalRank();
    const { grid, reviews, performance, signals, configured } = view;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                    Lokale Sichtbarkeit im Google Local Pack rund um den Standort Wien: ein 7×7-Raster misst wöchentlich,
                    auf welchem Platz „Red Rabbit“ bei den wichtigsten Such-Begriffen erscheint. Dazu die Gesundheit der
                    Google-Bewertungen und die (freigabepflichtige) Bewertungs-Ansprache.
                </p>
                {grid && (
                    <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        Stand {new Date(grid.snapshot.takenAt).toLocaleDateString('de-AT')}
                    </span>
                )}
            </div>

            {grid?.isDemo && (
                <Card className="border-amber-200/70 bg-amber-50/60 p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" strokeWidth={2} />
                        <p className="text-[13px] leading-relaxed text-amber-800">
                            <strong>Demo-Daten.</strong> Es liegen noch keine echten Grid-Messungen vor. Die Zahlen sind synthetisch
                            (nahe Standort = besser) und zeigen nur, wie die Auswertung aussieht. Echte Grid-Position kommt kostenlos
                            über den Browser-Check auf Abruf (siehe „Live schalten“ unten); die automatische Sichtbarkeit liefert die
                            Google-Performance-API.
                        </p>
                    </div>
                </Card>
            )}

            {signals.length > 0 && <HealthCard signals={signals} />}

            {/* Performance — the free, official visibility backbone */}
            {performance ? (
                <PerformanceSection perf={performance} />
            ) : (
                <SectionCard title="Sichtbarkeit (Google-Performance)" hint="gratis, offiziell — kein Grid-Ersatz nötig">
                    <EmptyState message="Noch keine Performance-Daten. Nach GBP-API-Freigabe: npx tsx scripts/content-engine/local-rank/performance-pull.ts — zeigt Impressionen, Klicks, Anrufe und die echten Suchbegriffe." />
                </SectionCard>
            )}

            {/* Overall KPIs */}
            {grid ? (
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Kpi label="SoLV (Top 3)" value={pct(grid.snapshot.overall.solv, 0)} sub="Anteil Messpunkte in den Top 3" accent={grid.snapshot.overall.solv < 0.2} />
                    <Kpi label="ATRP" value={pos(grid.snapshot.overall.atrp)} sub="Ø Platz über alle Punkte" />
                    <Kpi label="ARP" value={grid.snapshot.overall.arp != null ? pos(grid.snapshot.overall.arp) : '—'} sub="Ø Platz, wo gefunden" />
                    <Kpi label="Punkte Top 10 / gesamt" value={`${grid.snapshot.overall.top10} / ${grid.snapshot.overall.points}`} sub={`${grid.snapshot.overall.unranked} nicht in Top 20`} />
                </section>
            ) : (
                <SectionCard title="Grid-Rang">
                    <EmptyState message="Noch keine Grid-Messung. npx tsx scripts/content-engine/local-rank/pull.ts --demo erzeugt eine Demo-Auswertung; echte Positionen kommen über den kostenlosen Browser-Check auf Abruf." />
                </SectionCard>
            )}

            {/* Heatmaps per keyword */}
            {grid && (
                <SectionCard title="Heatmap je Suchbegriff" hint="grün ≤3 · gelb 4–10 · rot 11+ · grau nicht in Top 20">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {grid.snapshot.keywords.map((k) => (
                            <Heatmap key={k.keyword} grid={k} size={grid.snapshot.gridSize} />
                        ))}
                    </div>
                    <p className="mt-5 text-[11px] leading-relaxed text-slate-400">
                        Raster {grid.snapshot.gridSize}×{grid.snapshot.gridSize}, {grid.snapshot.spacingKm} km Abstand, Zentrum {grid.snapshot.center.label}.
                        Zahl = organischer Platz im Local Finder an diesem Punkt.
                    </p>
                </SectionCard>
            )}

            {/* Review health */}
            <SectionCard title="Bewertungs-Gesundheit" hint={reviews?.source === 'manual' ? 'manuell gepflegt' : reviews?.source === 'demo' ? 'Demo' : 'Business-Profile-API'}>
                {!reviews ? (
                    <EmptyState message="Noch keine Bewertungsdaten." />
                ) : (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <Kpi label="Bewertungen" value={int(reviews.health.total)} sub={reviews.health.avgRating != null ? `Ø ${reviews.health.avgRating.toString().replace('.', ',')} ★` : undefined} />
                            <Kpi label="Neu (30 T)" value={reviews.source === 'manual' ? '—' : int(reviews.health.last30)} sub="Velocity" accent={reviews.source !== 'manual' && reviews.health.last30 === 0} />
                            <Kpi label="Letzte vor" value={reviews.health.daysSinceLast != null ? `${reviews.health.daysSinceLast} T` : '—'} sub="Aktualität" />
                            <Kpi label="Antwortrate" value={reviews.source === 'manual' ? '—' : pct(reviews.health.responseRate, 0)} sub={reviews.health.avgResponseDays != null ? `Ø ${reviews.health.avgResponseDays} T` : 'auf alle antworten'} />
                        </div>
                        {reviews.source === 'manual' && (
                            <p className="text-[12px] leading-relaxed text-slate-500">
                                Aktuell nur die Gesamtzahlen aus der manuell gepflegten Quelle (echte Google-Sterne, Ehrlichkeits-Regel).
                                Velocity, Antwortrate und die Liste unbeantworteter Bewertungen liefert erst die Business-Profile-API.
                            </p>
                        )}
                        {reviews.source !== 'manual' && reviews.health.unanswered.length > 0 && (
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-800">
                                    <MessageSquare className="h-4 w-4 text-rose-500" strokeWidth={2} /> Unbeantwortet ({reviews.health.unanswered.length})
                                </div>
                                <ul className="space-y-2">
                                    {reviews.health.unanswered.slice(0, 5).map((r) => (
                                        <li key={r.id} className="flex items-start gap-3 rounded-lg border border-black/[0.06] p-3">
                                            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-amber-500">
                                                {r.rating}<Star className="h-3 w-3 fill-current" />
                                            </span>
                                            <span className="min-w-0 flex-1 text-[12px] leading-relaxed text-slate-600">
                                                {r.comment ? r.comment.slice(0, 160) : <span className="italic text-slate-400">(kein Text)</span>}
                                                {r.author && <span className="text-slate-400"> — {r.author}</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </SectionCard>

            {/* Outreach engine preview */}
            <SectionCard title="Bewertungs-Ansprache (Entwurf → Freigabe)" hint="Compliance: keine Steuerung, kein Anreiz">
                <p className="mb-4 max-w-3xl text-[13px] leading-relaxed text-slate-500">
                    Nach Projektabschluss geht an <em>jeden</em> Kunden dieselbe Anfrage (T+2), einmal Erinnerung (T+12) — mit
                    offenen Fragen, ohne Wortlaut vorzugeben, ohne Vorfilter und ohne Anreiz. Jede Mail und jede Antwort wird
                    vor dem Versand freigegeben. Vorschau der Bausteine:
                </p>
                <div className="space-y-3">
                    <TemplatePreview title="Anfrage · T+2" {...initialRequest(SAMPLE)} />
                    <TemplatePreview title="Erinnerung · T+12" {...followUp(SAMPLE)} />
                    <TemplatePreview title="Antwort-Entwurf (kritisch)" {...replyDraft({ id: 'x', rating: 2, createdAt: '2026-08-01', author: 'Max Muster' })} />
                </div>
            </SectionCard>

            {/* Go-live status */}
            <SectionCard title="Live schalten">
                <p className="mb-4 max-w-3xl text-[13px] leading-relaxed text-slate-500">
                    Alles kostenlos — kein bezahlter Dienst, keine Kreditkarte. Die Google-Business-Profile-APIs sind gratis
                    (nur ein kostenloser Freigabe-Antrag), Texte macht das Claude-Abo, Versand die bestehende Mail-Route.
                </p>
                <ul className="space-y-2 text-[13px] leading-relaxed text-slate-600">
                    <li className="flex items-center gap-2">
                        <StatusDot on={configured.gbpToken} />
                        <span><strong>Google-Login (OAuth, Scope business.manage)</strong> — ein Login deckt Performance + Reviews ab. {configured.gbpToken ? 'Token vorhanden.' : 'Noch nicht eingeloggt: npx tsx scripts/content-engine/dashboard/google_auth.ts'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <StatusDot on={false} />
                        <span><strong>„Basic API Access“ (gratis, ~3–10 Werktage)</strong> — Cloud-Projekt + 4 APIs aktivieren + Antrag. Schritt-für-Schritt in GBP-API-SETUP.md. Danach: Performance + Reviews laufen automatisch.</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <StatusDot on={configured.placeId} />
                        <span><strong>Grid-Rang (optional)</strong> — kostenlos per eigenem Browser auf Abruf (kein bezahlter Dienst); Position rund um den Standort. Nicht nötig für „besser gefunden werden“ — das misst die Performance oben.</span>
                    </li>
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                    Details, Ablauf, Compliance: content-engine/local-rank/README.md + GBP-API-SETUP.md. Alles read-only bzw.
                    freigabepflichtig; nichts postet oder antwortet ohne Thomas-Freigabe.
                </p>
            </SectionCard>
        </div>
    );
}

function StatusDot({ on }: { on: boolean }) {
    return <span className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${on ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true" />;
}
