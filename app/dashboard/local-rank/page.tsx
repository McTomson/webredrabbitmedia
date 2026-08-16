import { getLocalRank } from '@/lib/dashboard/localRank';
import { heatLevel } from '@/lib/localrank/kpi';
import { initialRequest, followUp, replyDraft, reviewLink } from '@/lib/localrank/reviewOutreach';
import { BUSINESS } from '@/lib/localrank/config';
import { int, pct, pos } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, Card, HealthCard } from '../ui';
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

export default function LocalRankPage() {
    const view = getLocalRank();
    const { grid, reviews, signals, configured } = view;

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
                            <strong>Demo-Daten.</strong> Es liegen noch keine echten Messungen vor. Die Zahlen sind synthetisch
                            (nahe Standort = besser) und zeigen nur, wie die Auswertung aussieht. Für echte Messungen einen
                            DataForSEO-Zugang hinterlegen (siehe „Live schalten“ unten) und den Puller wöchentlich laufen lassen.
                        </p>
                    </div>
                </Card>
            )}

            {signals.length > 0 && <HealthCard signals={signals} />}

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
                    <EmptyState message="Noch keine Messung. npx tsx scripts/content-engine/local-rank/pull.ts --demo erzeugt eine Demo-Auswertung; mit DataForSEO-Zugang schreibt der Puller echte Daten." />
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
                <ul className="space-y-2 text-[13px] leading-relaxed text-slate-600">
                    <li className="flex items-center gap-2">
                        <StatusDot on={configured.dataForSeo} />
                        <span><strong>DataForSEO-Zugang</strong> (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD) — schaltet echte Grid-Messungen frei (~$0,39 pro Woche). {configured.dataForSeo ? 'Hinterlegt.' : 'Noch nicht hinterlegt.'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <StatusDot on={configured.placeId} />
                        <span><strong>RR_GBP_PLACE_ID</strong> — für exakte Zuordnung im Local Finder und den Bewertungs-Direktlink. {configured.placeId ? 'Hinterlegt.' : 'Noch nicht hinterlegt.'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <StatusDot on={false} />
                        <span><strong>Business-Profile-API</strong> (Reviews lesen/antworten) — Google-Cloud-Projekt + „Basic API Access“, braucht Thomas-Login. Danach echte Velocity/Antwortrate + Draft-Assist.</span>
                    </li>
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                    Details, Kosten und Ablauf: content-engine/local-rank/README.md. Der Puller läuft read-only und wird
                    (später) wöchentlich zu unregelmäßiger Uhrzeit eingeplant — wie die Blog-Engine, nichts postet ohne Freigabe.
                </p>
            </SectionCard>
        </div>
    );
}

function StatusDot({ on }: { on: boolean }) {
    return <span className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${on ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden="true" />;
}
