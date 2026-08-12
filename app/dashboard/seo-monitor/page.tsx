import { getSeoMonitor, type SeoTaskStatus, type SeoTaskPriority } from '@/lib/dashboard/seoMonitor';
import { int } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, Card } from '../ui';
import { CheckCircle2, Circle, Eye } from 'lucide-react';

// SEO-Monitor tab. Read-only surface over content-engine/seo-monitor/tasks.json, which the
// weekly Monday monitor writes (metrics snapshot + technical-SEO todo list: 404s, indexing,
// canonicals, rankings). Separate from the content-engine "Verbesserungen" on-page audit.
export const dynamic = 'force-dynamic';

const STATUS_CHIP: Record<SeoTaskStatus, { text: string; cls: string; Icon: typeof Circle }> = {
    open: { text: 'offen', cls: 'bg-red-50 text-red-600', Icon: Circle },
    new: { text: 'neu', cls: 'bg-blue-50 text-blue-600', Icon: Circle },
    watch: { text: 'beobachten', cls: 'bg-amber-50 text-amber-600', Icon: Eye },
    done: { text: 'erledigt', cls: 'bg-green-50 text-green-600', Icon: CheckCircle2 },
};

const PRIORITY_CHIP: Record<SeoTaskPriority, { text: string; cls: string }> = {
    high: { text: 'hoch', cls: 'bg-red-50 text-red-600' },
    medium: { text: 'mittel', cls: 'bg-amber-50 text-amber-600' },
    low: { text: 'niedrig', cls: 'bg-black/[0.05] text-slate-500' },
};

export default function SeoMonitorPage() {
    const d = getSeoMonitor();

    if (!d) {
        return (
            <div className="space-y-8">
                <SectionCard title="SEO-Monitor">
                    <EmptyState message="Noch keine Monitor-Daten. Der wöchentliche SEO-Monitor (Montag) legt content-engine/seo-monitor/tasks.json an." />
                </SectionCard>
            </div>
        );
    }

    const m = d.metrics;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                    Technischer SEO-Monitor: Kennzahlen aus der Search Console plus die konkrete To-do-Liste
                    (404s, Indexierung, Canonicals, Rankings). Wird jeden Montag automatisch aktualisiert —
                    erledigte Punkte werden abgehakt, neue ergänzt.
                </p>
                <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    Stand {d.updatedAt} · {d.week}
                </span>
            </div>

            {/* KPI snapshot */}
            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Klicks" value={m ? int(m.clicks) : '—'} sub={m?.rangeLabel} />
                <Kpi label="Impressionen" value={m ? int(m.impressions) : '—'} sub={m ? `CTR ${m.ctr}` : undefined} />
                <Kpi label="Ø Position" value={m ? m.position.toLocaleString('de-DE') : '—'} sub="niedriger = besser" accent={!!m && m.position > 20} />
                <Kpi label="Indexiert / nicht" value={m ? `${m.indexed} / ${m.notIndexed}` : '—'} sub={m && m.pagespeedHome == null ? 'PageSpeed n/v' : m?.pagespeedHome ? `PageSpeed ${m.pagespeedHome}` : undefined} />
            </section>

            {m?.baseline3MonthNote && (
                <Card className="p-4">
                    <p className="text-[12px] leading-relaxed text-slate-500">{m.baseline3MonthNote}</p>
                </Card>
            )}

            {/* Task counts */}
            <section className="grid grid-cols-3 gap-4">
                <Kpi label="Offen" value={int(d.counts.open)} sub={`davon ${d.counts.high} hoch`} accent={d.counts.high > 0} />
                <Kpi label="Beobachten" value={int(d.counts.watch)} />
                <Kpi label="Erledigt" value={int(d.counts.done)} />
            </section>

            <SectionCard title="To-do-Liste" hint="größter Hebel zuerst">
                {d.tasks.length === 0 ? (
                    <EmptyState message="Keine offenen Punkte. Alles abgearbeitet." />
                ) : (
                    <ul className="space-y-3">
                        {d.tasks.map((t) => {
                            const st = STATUS_CHIP[t.status];
                            const pr = PRIORITY_CHIP[t.priority];
                            const Icon = st.Icon;
                            const done = t.status === 'done';
                            return (
                                <li key={t.id} className="rounded-xl border border-black/[0.06] p-4">
                                    <div className="flex items-start gap-3">
                                        <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${st.cls}`}>
                                            <Icon className="h-[15px] w-[15px]" strokeWidth={2.25} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[14px] font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</span>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${pr.cls}`}>Priorität {pr.text}</span>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${st.cls}`}>{st.text}</span>
                                                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-500">{t.area}</span>
                                            </div>
                                            <p className={`mt-1.5 text-[13px] leading-relaxed ${done ? 'text-slate-400' : 'text-slate-600'}`}>{t.detail}</p>
                                            {t.evidence && <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">Beleg: {t.evidence}</p>}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </SectionCard>

            {d.source && <p className="px-1 text-[11px] text-slate-400">Quelle: {d.source}</p>}
        </div>
    );
}
