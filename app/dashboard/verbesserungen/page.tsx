import { getOnPageAudit } from '@/lib/dashboard/onpage';
import { CLUSTER_NAMES } from '@/lib/dashboard/overview';
import { int } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, Th, Td, Card } from '../ui';
import { TrendingUp, CheckCircle2, FlaskConical } from 'lucide-react';

export const dynamic = 'force-dynamic';

// "Verbesserungen": the actionable improvement surface. Two halves:
//  (1) deterministic on-page audit — what every published article is missing vs the playbook.
//  (2) the methodik levers + their verification status (general vs verified against OUR data).
// The data-verified half stays honest: with little traffic we cannot yet confirm levers on
// our own numbers, so they are marked "allgemein verifiziert" until we have the data.

// Methodik levers (content-engine/knowledge/playbook.md). status: 'general' = web-verified
// best practice; 'ours' = confirmed on our own GSC/GA4 data (none yet — needs traffic).
const LEVERS: Array<{ title: string; status: 'general' | 'ours'; note: string }> = [
    { title: 'Cluster-interne Verlinkung (Tiefe vor Breite)', status: 'general', note: '#1 Ranking-Hebel laut Research; an unseren Daten noch offen.' },
    { title: 'Antwort-Block + FAQ (AI Overviews)', status: 'general', note: 'FAQ ~3,2x häufiger in AI Overviews.' },
    { title: 'Aktuelles Jahr im Titel (Frische)', status: 'general', note: '~30% mehr LLM-Citations laut Research.' },
    { title: 'Primärquellen mit Zahl zitieren', status: 'general', note: 'Laut Princeton-Paper wirksamste GEO-Einzeltaktik.' },
    { title: 'Aktualisieren statt nur neu (Pos 8-20)', status: 'general', note: 'Frische-Loop; messbar sobald Striking-Distance-Seiten Traffic ziehen.' },
];

export default function VerbesserungenPage() {
    const a = getOnPageAudit();
    const top = a.articles.slice(0, 12);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                    Was wir konkret verbessern können. Der On-Page-Audit prüft jeden Artikel gegen das Methodik-Playbook
                    (SEO/GEO). Die Hebel selbst gelten als allgemein verifiziert, bis wir sie an unseren eigenen Zahlen
                    bestätigen können (dafür braucht es mehr Traffic).
                </p>
            </div>

            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Ø On-Page-Score" value={`${a.avgScore}`} sub="über alle Artikel" accent={a.avgScore < 80} />
                <Kpi label="Artikel geprüft" value={int(a.articles.length)} sub="content/blog" />
                <Kpi label="Häufigste Lücke" value={a.issueFrequency[0] ? int(a.issueFrequency[0].count) : 0} sub={a.issueFrequency[0]?.key === 'internal_links' ? 'interne Links' : a.issueFrequency[0]?.key || '—'} accent={!!a.issueFrequency[0]} />
                <Kpi label="Methodik-Hebel" value={`0/${LEVERS.length}`} sub="an unseren Daten bestätigt" />
            </section>

            <SectionCard title="Häufigste Lücken" hint="größter Hebel zuerst">
                {a.issueFrequency.length === 0 ? (
                    <EmptyState message="Keine Lücken gefunden. Alle Artikel erfüllen die geprüften On-Page-Regeln." />
                ) : (
                    <ul className="space-y-3">
                        {a.issueFrequency.map((f) => (
                            <li key={f.key}>
                                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                                    <span className="font-medium text-slate-800">{f.label}</span>
                                    <span className="tabular-nums text-slate-500">{int(f.count)} Artikel</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.round((f.count / Math.max(1, a.articles.length)) * 100)}%` }} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionCard>

            <SectionCard title="Schwächste Artikel zuerst" hint="hier lohnt sich die Überarbeitung am meisten">
                {top.length === 0 ? (
                    <EmptyState message="Noch keine Artikel veröffentlicht." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-black/[0.06]">
                                    <Th>Artikel</Th>
                                    <Th>Cluster</Th>
                                    <Th numeric>Score</Th>
                                    <Th>Fehlt</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {top.map((art) => (
                                    <tr key={art.slug} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                        <Td strong>
                                            <a href={`/tipps/${art.slug}`} target="_blank" rel="noreferrer" className="hover:text-red-600">{art.title.length > 54 ? art.title.slice(0, 54) + '…' : art.title}</a>
                                        </Td>
                                        <Td>{CLUSTER_NAMES[art.cluster] || '—'}</Td>
                                        <Td numeric strong>{art.score}</Td>
                                        <Td>
                                            {art.issues.length === 0 ? (
                                                <span className="text-green-600">vollständig</span>
                                            ) : (
                                                <span className="text-slate-500">{art.issues.map((i) => i.label.split(' ')[0]).join(', ')}</span>
                                            )}
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </SectionCard>

            <SectionCard title="Methodik-Hebel & Verifizierungs-Status" hint="erst Hypothese, dann an unseren Daten geprüft">
                <ul className="space-y-3">
                    {LEVERS.map((l) => (
                        <li key={l.title} className="flex items-start gap-3">
                            <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${l.status === 'ours' ? 'bg-green-50 text-green-600' : 'bg-black/[0.04] text-slate-500'}`}>
                                {l.status === 'ours' ? <CheckCircle2 className="h-[15px] w-[15px]" strokeWidth={2.25} /> : <FlaskConical className="h-[15px] w-[15px]" strokeWidth={2.25} />}
                            </span>
                            <div className="min-w-0 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">{l.title}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${l.status === 'ours' ? 'bg-green-50 text-green-600' : 'bg-black/[0.04] text-slate-400'}`}>
                                        {l.status === 'ours' ? 'an unseren Daten bestätigt' : 'allgemein verifiziert'}
                                    </span>
                                </div>
                                <div className="text-[13px] leading-relaxed text-slate-500">{l.note}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            <Card className="p-5 text-[13px] leading-relaxed text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700"><TrendingUp className="h-4 w-4" strokeWidth={2.25} /> So wird daraus ein Loop:</span>{' '}
                Du sammelst SEO-/Schreibstil-Quellen im NotebookLM-Methodik-Notebook → ich destilliere neue Hebel ins
                Playbook → der On-Page-Audit prüft jeden Artikel dagegen → sobald Traffic da ist, verifizieren wir jeden
                Hebel an unseren eigenen GSC-Zahlen und markieren ihn als bestätigt oder verwerfen ihn. So übernehmen wir
                nur, was für uns wirklich wirkt.
            </Card>
        </div>
    );
}
