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
    /** Heuristik: Fragen, bei denen die Bot-Antwort ein "hab ich nicht"-Signal trug. */
    gaps: { text: string; ts: string }[];
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

// Heuristik: der Bot hat keine feste "kann nicht antworten"-Phrase (er formuliert es
// jedes Mal neu, laut System-Prompt: "sagst du das offen ... rätst nicht herum").
// Diese Signale treffen das Eingestaendnis "steht nicht im Kontext" — bewusst
// konservativ, damit Lead-Uebergaben ("das Team meldet sich") NICHT mitzaehlen.
const GAP_CUES =
    /(kann ich dir (das |dazu )?(leider )?nicht sagen|wei(ß|ss) ich (leider )?nicht|hab(e)? ich (dazu )?(leider )?(keine|nichts)|keine (genaue(n)? )?(info(rmation)?|angabe|antwort)(en)? (dazu|darüber|hierzu)|dazu (kann|habe) ich (nichts|keine)|steht (leider )?nicht (in|im)|da bin ich überfragt|das (kann|weiß) ich (dir )?nicht|nicht sicher, ob)/i;

export function isGap(botText: string): boolean {
    return GAP_CUES.test(botText || '');
}

interface Msg {
    session_id: string;
    rolle: string;
    text: string;
    ts: string;
}

/** Pair each user question with the bot reply that follows it in the same session; a
 *  reply carrying a gap-cue flags that question as a possible knowledge gap. */
export function findGaps(messages: Msg[]): { text: string; ts: string }[] {
    const bySession = new Map<string, Msg[]>();
    for (const m of messages) {
        const arr = bySession.get(m.session_id) || [];
        arr.push(m);
        bySession.set(m.session_id, arr);
    }
    const out: { text: string; ts: string }[] = [];
    for (const arr of bySession.values()) {
        arr.sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].rolle === 'user' && arr[i + 1].rolle === 'bot' && isGap(arr[i + 1].text)) {
                out.push({ text: arr[i].text, ts: arr[i].ts });
            }
        }
    }
    return out.sort((a, b) => (a.ts < b.ts ? 1 : -1));
}

export async function getChatInsights(nowMs: number, weekStartMs: number): Promise<ChatInsights> {
    const weekIso = new Date(weekStartMs).toISOString();
    const [sessions, sessionsThisWeek, userMessages, leadsFromChat, recentMsgs] = await Promise.all([
        count('sessions?select=session_id'),
        count(`sessions?select=session_id&created_at=gte.${weekIso}`),
        count('messages_compact?select=id&rolle=eq.user'),
        count('leads?select=id'),
        rows<Msg>('messages_compact?select=session_id,rolle,text,ts&order=ts.desc&limit=600'),
    ]);
    void nowMs;
    const userMsgs = recentMsgs.filter((m) => m.rolle === 'user');
    return {
        sessions,
        sessionsThisWeek,
        userMessages,
        leadsFromChat,
        recentQuestions: userMsgs.slice(0, 40).map((m) => ({ text: m.text, ts: m.ts })),
        topTerms: computeTopTerms(userMsgs.map((m) => m.text)),
        gaps: findGaps(recentMsgs).slice(0, 30),
    };
}
