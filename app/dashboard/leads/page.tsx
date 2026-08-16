import { listLeads, leadsConfigured, type Lead } from '@/lib/leads/store';
import { Kpi, StateNotice, SectionCard } from '../ui';
import { LeadsTable } from './LeadsTable';

// Leads tab. Read-only list (server) + inline status/delete (client -> write API).
// Every lead that comes through /api/contact (contact form, lead popup, chatbot CTA)
// is captured here in addition to the e-mail. Password-gated + noindex like the rest.
export const dynamic = 'force-dynamic';

function startOfWeek(now: number): number {
    const d = new Date(now);
    const day = (d.getDay() + 6) % 7; // Mon=0
    d.setHours(0, 0, 0, 0);
    return d.getTime() - day * 86_400_000;
}

export default async function LeadsPage() {
    if (!leadsConfigured()) {
        return (
            <div className="space-y-6">
                <Header />
                <StateNotice
                    kind="unconfigured"
                    message="Supabase noch nicht verbunden. In Vercel SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY setzen (Chatbot-Projekt) und die leads-Tabelle anlegen (docs/handoffs/LEADS_SETUP.md), dann erscheinen hier die Anfragen."
                />
            </div>
        );
    }

    let leads: Lead[] = [];
    let error: string | null = null;
    try {
        leads = await listLeads();
    } catch {
        error = 'Leads konnten nicht geladen werden (Supabase-Verbindung prüfen).';
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Header />
                <StateNotice kind="error" message={error} />
            </div>
        );
    }

    const now = Date.now();
    const wk = startOfWeek(now);
    const thisWeek = leads.filter((l) => Date.parse(l.created_at) >= wk).length;
    const neu = leads.filter((l) => l.status === 'neu').length;

    return (
        <div className="space-y-6">
            <Header />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Kpi label="Leads gesamt" value={leads.length} />
                <Kpi label="Neu" value={neu} accent={neu > 0} />
                <Kpi label="Diese Woche" value={thisWeek} />
            </div>
            <SectionCard title="Anfragen" hint="Neueste zuerst. Status per Klick ändern; die E-Mail bekommst du zusätzlich.">
                {leads.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">Noch keine Anfragen erfasst.</p>
                ) : (
                    <LeadsTable leads={leads} />
                )}
            </SectionCard>
        </div>
    );
}

function Header() {
    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-900">Leads</h1>
            <p className="mt-1 text-sm text-slate-500">
                Jede Anfrage (Formular, Popup, Chatbot) an einem Ort — mit Status, damit keine im Postfach untergeht.
            </p>
        </div>
    );
}
