// Server-only lead store over Supabase PostgREST (no SDK dependency — plain fetch).
// Used by /api/contact (capture, fail-safe) and the dashboard Leads tab (read + status).
// Access is service-role only; the `leads` table has RLS enabled with NO policies, so
// the anon key can never read customer PII even if it leaked.
// Server-only by construction: only imported by route handlers / server components, and
// the service key comes from a non-NEXT_PUBLIC env var (Next never ships it to the client).
// Client code imports plain types/constants from ./types instead.
import { normalizeSource, type Lead, type LeadStatus, type NewLead } from './types';

export type { Lead, LeadStatus, NewLead } from './types';

const URL_ENV = process.env.SUPABASE_URL;
const KEY_ENV = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

export function leadsConfigured(): boolean {
    return Boolean(URL_ENV && KEY_ENV);
}

function base(): { url: string; key: string } {
    if (!URL_ENV || !KEY_ENV) throw new Error('leads-store not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen)');
    return { url: URL_ENV.replace(/\/$/, ''), key: KEY_ENV };
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
    const { key } = base();
    return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}

/** Insert a captured lead. Throws on failure — callers in the request path MUST wrap in try/catch. */
export async function insertLead(lead: NewLead): Promise<void> {
    const { url } = base();
    const row = {
        name: lead.name ?? null,
        company: lead.company ?? null,
        email: lead.email ?? null,
        phone: lead.phone ?? null,
        service: lead.service ?? null,
        message: lead.message ?? null,
        source: normalizeSource(lead.source),
        status: 'neu' as LeadStatus,
    };
    const res = await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify(row),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`insertLead ${res.status}: ${await res.text().catch(() => '')}`);
}

export async function listLeads(limit = 200): Promise<Lead[]> {
    const { url } = base();
    const res = await fetch(`${url}/rest/v1/leads?select=*&order=created_at.desc&limit=${limit}`, {
        headers: headers(),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`listLeads ${res.status}`);
    return (await res.json()) as Lead[];
}

export async function updateLead(id: string, patch: { status?: LeadStatus; note?: string }): Promise<void> {
    const { url } = base();
    const res = await fetch(`${url}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify(patch),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`updateLead ${res.status}`);
}

export async function deleteLead(id: string): Promise<void> {
    const { url } = base();
    const res = await fetch(`${url}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: headers({ Prefer: 'return=minimal' }),
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`deleteLead ${res.status}`);
}
