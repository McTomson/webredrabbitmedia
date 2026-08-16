import { getChatInsights, chatInsightsConfigured } from '@/lib/chat/insights';
import { Kpi, SectionCard, StateNotice, EmptyState } from '../ui';

// Chat-Insights tab. Read-only view over the chatbot's own conversations (Supabase):
// how many chats, what visitors actually ask, and which topics recur — so we can
// improve the product + the site. Same Supabase env as the Leads tab.
export const dynamic = 'force-dynamic';

function startOfWeek(now: number): number {
    const d = new Date(now);
    const day = (d.getDay() + 6) % 7; // Mon=0
    d.setHours(0, 0, 0, 0);
    return d.getTime() - day * 86_400_000;
}

function fmt(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' });
}

export default async function ChatPage() {
    if (!chatInsightsConfigured()) {
        return (
            <div className="space-y-6">
                <Header />
                <StateNotice
                    kind="unconfigured"
                    message="Supabase noch nicht verbunden. Sobald SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel gesetzt sind (gleich wie beim Leads-Tab), erscheinen hier die Chat-Auswertungen."
                />
            </div>
        );
    }

    const now = Date.now();
    let data;
    try {
        data = await getChatInsights(now, startOfWeek(now));
    } catch {
        return (
            <div className="space-y-6">
                <Header />
                <StateNotice kind="error" message="Chat-Daten konnten nicht geladen werden (Supabase-Verbindung prüfen)." />
            </div>
        );
    }

    const maxTerm = data.topTerms[0]?.count || 1;

    return (
        <div className="space-y-6">
            <Header />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Kpi label="Chats gesamt" value={data.sessions} />
                <Kpi label="Diese Woche" value={data.sessionsThisWeek} accent={data.sessionsThisWeek > 0} />
                <Kpi label="Fragen gestellt" value={data.userMessages} />
                <Kpi label="Leads aus Chat" value={data.leadsFromChat} />
            </div>

            <SectionCard
                title="Mögliche Wissenslücken"
                hint="Heuristik: Fragen, bei denen die Bot-Antwort offen 'keine Info dazu' signalisierte — Kandidaten für neuen Seiten-/FAQ-Inhalt. Bitte prüfen, nicht jede ist eine echte Lücke."
            >
                {data.gaps.length === 0 ? (
                    <EmptyState message="Keine Lücken erkannt (oder noch zu wenige Chats)." />
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {data.gaps.map((g, i) => (
                            <li key={i} className="flex items-start gap-3 py-2 text-sm">
                                <span className="mt-0.5 w-10 shrink-0 text-xs tabular-nums text-slate-400">{fmt(g.ts)}</span>
                                <span className="text-slate-800">{g.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionCard>

            <SectionCard title="Häufige Themen" hint="Wörter, die in den Fragen am öftesten vorkommen — grobe Themen-Signale, keine KI-Deutung.">
                {data.topTerms.length === 0 ? (
                    <EmptyState message="Noch keine Fragen erfasst." />
                ) : (
                    <div className="space-y-1.5">
                        {data.topTerms.map((t) => (
                            <div key={t.term} className="flex items-center gap-3">
                                <span className="w-32 shrink-0 truncate text-sm text-slate-700">{t.term}</span>
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-slate-800"
                                        style={{ width: `${Math.max(4, (t.count / maxTerm) * 100)}%` }}
                                    />
                                </div>
                                <span className="w-8 shrink-0 text-right text-xs tabular-nums text-slate-400">{t.count}</span>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>

            <SectionCard title="Letzte Fragen" hint="Was Besucher zuletzt gefragt haben — lies mit, wo die Seite Antworten liefern sollte.">
                {data.recentQuestions.length === 0 ? (
                    <EmptyState message="Noch keine Fragen erfasst." />
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {data.recentQuestions.map((q, i) => (
                            <li key={i} className="flex items-start gap-3 py-2 text-sm">
                                <span className="mt-0.5 w-10 shrink-0 text-xs tabular-nums text-slate-400">{fmt(q.ts)}</span>
                                <span className="text-slate-700">{q.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </SectionCard>
        </div>
    );
}

function Header() {
    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-900">Chat-Insights</h1>
            <p className="mt-1 text-sm text-slate-500">
                Was Besucher den Chatbot fragen — um Produkt und Website gezielt zu verbessern.
            </p>
        </div>
    );
}
