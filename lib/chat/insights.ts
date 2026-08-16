// Read-only chat insights over the chatbot's Supabase (same project as web_leads).
// Reads the tables the chat backend already writes: sessions, messages_compact
// (rolle 'user'|'bot', text, ts), and the chat-side leads table. Purpose: learn what
// visitors actually ask so we can improve the product + the site. No LLM, no clustering
// — recent questions + a plain word-frequency signal. Everything degrades to "not
// configured" without the Supabase env (same vars the Leads tab uses).

const URL_ENV = process.env.SUPABASE_URL;
const KEY_ENV = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

export function chatInsightsConfigured(): boolean {
    return Boolean(URL_ENV && KEY_ENV);
}

export interface ChatInsights {
    sessions: number;
    sessionsThisWeek: number;
    userMessages: number;
    leadsFromChat: number;
    recentQuestions: { text: string; ts: string }[];
    topTerms: { term: string; count: number }[];
}

function cfg(): { url: string; key: string } {
    if (!URL_ENV || !KEY_ENV) throw new Error('chat-insights not configured');
    return { url: URL_ENV.replace(/\/$/, ''), key: KEY_ENV };
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const { key } = cfg();
    return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

/** Exact row count via PostgREST Content-Range header (no rows transferred). */
async function count(pathAndQuery: string): Promise<number> {
    const { url } = cfg();
    const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
        method: 'HEAD',
        headers: authHeaders({ Prefer: 'count=exact', Range: '0-0' }),
        cache: 'no-store',
    });
    const cr = res.headers.get('content-range') || '';
    const total = cr.split('/')[1];
    const n = Number(total);
    return Number.isFinite(n) ? n : 0;
}

async function rows<T>(pathAndQuery: string): Promise<T[]> {
    const { url } = cfg();
    const res = await fetch(`${url}/rest/v1/${pathAndQuery}`, { headers: authHeaders(), cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as T[];
}

// Small German stopword set so the term frequency surfaces topics, not filler.
const STOP = new Set([
    'und', 'oder', 'aber', 'der', 'die', 'das', 'ein', 'eine', 'einen', 'einem', 'einer', 'ich', 'wir', 'ihr',
    'sie', 'mit', 'für', 'von', 'auf', 'ist', 'sind', 'war', 'wie', 'was', 'wer', 'wo', 'warum', 'kann', 'könnt',
    'könnte', 'habe', 'haben', 'hat', 'auch', 'nicht', 'noch', 'schon', 'bitte', 'danke', 'hallo', 'dem', 'den',
    'des', 'zum', 'zur', 'über', 'unter', 'dass', 'weil', 'wenn', 'dann', 'man', 'muss', 'soll', 'will', 'würde',
    'mein', 'meine', 'euer', 'eure', 'ihre', 'sein', 'seine', 'nur', 'aus', 'bei', 'nach', 'vor', 'als', 'also',
    'sehr', 'mehr', 'ganz', 'schon', 'gibt', 'wird', 'werden', 'wurde', 'hier', 'diese', 'dieser', 'dieses',
    'wieviel', 'viele', 'einfach', 'gerne', 'mal', 'etwas', 'welche', 'welcher', 'braucht', 'brauche',
]);

export function computeTopTerms(questions: string[], top = 12): { term: string; count: number }[] {
    const freq = new Map<string, number>();
    for (const q of questions) {
        const words = q.toLowerCase().match(/[a-zäöüß]{4,}/g) || [];
        for (const w of words) {
            if (STOP.has(w)) continue;
            freq.set(w, (freq.get(w) || 0) + 1);
        }
    }
    return Array.from(freq.entries())
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, top);
}

export async function getChatInsights(nowMs: number, weekStartMs: number): Promise<ChatInsights> {
    const weekIso = new Date(weekStartMs).toISOString();
    const [sessions, sessionsThisWeek, userMessages, leadsFromChat, recent] = await Promise.all([
        count('sessions?select=session_id'),
        count(`sessions?select=session_id&created_at=gte.${weekIso}`),
        count('messages_compact?select=id&rolle=eq.user'),
        count('leads?select=id'),
        rows<{ text: string; ts: string }>('messages_compact?select=text,ts&rolle=eq.user&order=ts.desc&limit=200'),
    ]);
    void nowMs;
    return {
        sessions,
        sessionsThisWeek,
        userMessages,
        leadsFromChat,
        recentQuestions: recent.slice(0, 40),
        topTerms: computeTopTerms(recent.map((r) => r.text)),
    };
}
