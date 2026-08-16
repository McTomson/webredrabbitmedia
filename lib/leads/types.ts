// Client-safe lead types + constants (no server-only, no env, no fetch).
// The server-only fetch layer lives in ./store and imports from here.

export const LEAD_STATUSES = ['neu', 'kontaktiert', 'gewonnen', 'verloren'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ['formular', 'popup', 'chatbot'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface Lead {
    id: string;
    created_at: string;
    name: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    service: string | null;
    message: string | null;
    source: string;
    status: string;
    note: string | null;
}

export interface NewLead {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
    source?: string;
}

export function normalizeStatus(v: unknown): LeadStatus | null {
    return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v) ? (v as LeadStatus) : null;
}

export function normalizeSource(v: unknown): LeadSource {
    return typeof v === 'string' && (LEAD_SOURCES as readonly string[]).includes(v) ? (v as LeadSource) : 'formular';
}
