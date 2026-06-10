import { getKnowledge } from '@/lib/dashboard/knowledge';
import { int } from '@/lib/dashboard/format';
import { Kpi, SectionCard, EmptyState, Th, Td, Card } from '../ui';
import { MessageSquareQuote, RefreshCw, CheckCircle2, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Only ever hand http(s) URLs to an href. Vault sources ultimately originate from web
// research (LLM-chosen), so guard the render path too even though appendFacts already
// rejects non-http(s) at write-time. Returns undefined → render plain text instead.
function safeHref(u?: string): string | undefined {
    return u && /^https?:\/\//i.test(u) ? u : undefined;
}

// The Moat tab: how much own knowledge the engine has captured, and — most important for the
// user — what it still needs FROM him (interview gaps, facts due for re-check). Reads the vault,
// the opinion pool and the NotebookLM manifest. No external creds; pure local SoT.
export default async function WissenPage() {
    const k = await getKnowledge();
    const clustersWithOpinion = k.coverage.filter((c) => c.opinions > 0).length;
    const hasTasks = k.tasks.interviewClusters.length > 0 || k.tasks.staleCount > 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                    Der Moat: eigenes, web-verifiziertes Wissen und deine echten Meinungen. Der Researcher zieht den Vault
                    zuerst, der Writer schöpft aus dem Meinungs-Pool. Je voller, desto persönlicher und policy-sicherer die Artikel.
                </p>
            </div>

            <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Kpi label="Vault-Fakten" value={int(k.vault.total)} sub="verifizierte eigene Fakten" />
                <Kpi label="Recheck fällig" value={int(k.vault.stale)} sub="veraltet, neu prüfen" accent={k.vault.stale > 0} />
                <Kpi label="Meinungen im Pool" value={int(k.opinions.total)} sub="erst-hand von Thomas" />
                <Kpi label="Cluster mit Meinung" value={`${clustersWithOpinion}/7`} sub="Abdeckung" accent={clustersWithOpinion < 7} />
            </section>

            {/* The actionable heart of this tab: what the system needs from the user (Pre-Mortem #5). */}
            <SectionCard title="Was das System von dir braucht" hint="kleine Inputs, große Wirkung">
                {!hasTasks ? (
                    <div className="flex items-center gap-3 py-2 text-sm text-slate-600">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={2.25} />
                        </span>
                        Nichts offen. Jeder Cluster mit Inhalt hat mindestens eine Meinung, und kein Fakt ist fällig.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {k.tasks.interviewClusters.map((c) => (
                            <li key={`iv-${c.cluster}`} className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <MessageSquareQuote className="h-[17px] w-[17px]" strokeWidth={2.25} />
                                </span>
                                <div className="min-w-0 text-sm">
                                    <div className="font-semibold text-slate-900">Meinung fehlt: {c.name}</div>
                                    <div className="text-[13px] leading-relaxed text-slate-500">
                                        Dieser Cluster hat Inhalt, aber noch keine erst-hand Meinung. Starte ein kurzes Interview:
                                        <code className="ml-1 rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] text-slate-700">/interview-me {c.cluster}</code>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {k.tasks.staleCount > 0 && (
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <RefreshCw className="h-[17px] w-[17px]" strokeWidth={2.25} />
                                </span>
                                <div className="min-w-0 text-sm">
                                    <div className="font-semibold text-slate-900">{k.tasks.staleCount} Fakt(en) zur Auffrischung fällig</div>
                                    <div className="text-[13px] leading-relaxed text-slate-500">
                                        Veraltete Fakten werden erst wieder zitiert, wenn sie neu bestätigt sind (siehe Liste unten).
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                )}
            </SectionCard>

            <SectionCard title="Cluster-Abdeckung" hint="Wissen je Themen-Cluster">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-black/[0.06]">
                                <Th>Cluster</Th>
                                <Th numeric>Meinungen</Th>
                                <Th numeric>Vault-Fakten</Th>
                                <Th numeric>Live-Artikel</Th>
                                <Th numeric>offen</Th>
                                <Th>Status</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {k.coverage.map((c) => (
                                <tr key={c.cluster} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                    <Td strong>{c.cluster} · {c.name}</Td>
                                    <Td numeric>{int(c.opinions)}</Td>
                                    <Td numeric>{int(c.vaultFacts)}</Td>
                                    <Td numeric>{int(c.liveArticles)}</Td>
                                    <Td numeric>{int(c.todoTopics)}</Td>
                                    <Td>
                                        {c.needsInterview ? (
                                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">Meinung fehlt</span>
                                        ) : c.opinions > 0 ? (
                                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">gedeckt</span>
                                        ) : (
                                            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-400">kein Inhalt</span>
                                        )}
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SectionCard title="NotebookLM pro Cluster" hint="wächst mit jedem Artikel">
                    {!k.notebooklm ? (
                        <div className="flex items-start gap-3 py-1 text-sm">
                            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-slate-500">
                                <BookOpen className="h-[17px] w-[17px]" strokeWidth={2.25} />
                            </span>
                            <p className="leading-relaxed text-slate-500">
                                Noch nicht eingerichtet. Pro Cluster ein NotebookLM-Notebook, das bei jeder Veröffentlichung um den
                                Artikel und seine Quellen wächst. Dann fußen Podcast, Video und Q&amp;A auf einer wachsenden eigenen Basis.
                                Anlegen über das Plan-Skript <code className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] text-slate-700">notebooklm:plan</code>.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-black/[0.06]">
                                        <Th>Cluster</Th>
                                        <Th numeric>Quellen</Th>
                                        <Th>Stand</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {k.notebooklm.rows.map((r) => (
                                        <tr key={r.cluster} className="border-b border-black/[0.04] hover:bg-black/[0.02]">
                                            <Td strong>
                                                {safeHref(r.notebookUrl) ? (
                                                    <a href={safeHref(r.notebookUrl)} target="_blank" rel="noreferrer" className="hover:text-red-600">{r.cluster} · {r.name}</a>
                                                ) : (
                                                    <span>{r.cluster} · {r.name}</span>
                                                )}
                                            </Td>
                                            <Td numeric>{int(r.sources)}</Td>
                                            <Td>{r.updatedAt || (r.notebookUrl ? '—' : 'kein Notebook')}</Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionCard>

                <SectionCard title="Recheck fällig" hint="veraltete Fakten">
                    {k.vault.staleFacts.length === 0 ? (
                        <EmptyState message="Kein Fakt ist zur Auffrischung fällig. Der Vault ist aktuell." />
                    ) : (
                        <ul className="space-y-3">
                            {k.vault.staleFacts.map((f, i) => (
                                <li key={i} className="text-sm">
                                    <div className="leading-relaxed text-slate-700">{f.aussage.slice(0, 140)}{f.aussage.length > 140 ? '…' : ''}</div>
                                    <div className="mt-0.5 text-[12px] text-slate-400">
                                        Cluster {f.cluster} · fällig seit {f.recheckNach}
                                        {safeHref(f.quelle) && (
                                            <> · <a href={safeHref(f.quelle)} target="_blank" rel="noreferrer" className="hover:text-red-600">Quelle</a></>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </SectionCard>
            </div>

            <Card className="p-5 text-[13px] leading-relaxed text-slate-500">
                <strong className="font-semibold text-slate-700">So wächst das Wissen:</strong> Veröffentlichter Artikel → verifizierte
                Fakten fließen in den Vault (Rückfluss) und in das Cluster-NotebookLM → deine Meinung kommt per <code className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[12px] text-slate-700">/interview-me</code> dazu →
                der nächste Artikel im selben Cluster wird fundierter. Striking-Distance im Search-Tab zeigt, wo sich Vertiefung lohnt.
            </Card>
        </div>
    );
}
