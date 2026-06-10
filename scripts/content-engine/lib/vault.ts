import fs from 'fs';
import path from 'path';

// Knowledge Vault (Phase 2, §3 of the v2 plan): additive, web-verified own knowledge.
// Each fact carries its source URL and a freshness TTL. The researcher queries the vault
// FIRST (keyword match is enough at this scale) and only fills gaps from the web. Facts
// past their `recheck_nach` date are stale and must be re-verified before they are citable.
//
// Single source of truth: one markdown file, human-readable + machine-parseable. No DB,
// no vector store (not needed at this corpus size). Both the pipeline and the dashboard
// import from here so there is exactly one parser.

export interface VaultFact {
    id: string;
    cluster: number;
    keywords: string[];
    aussage: string; // single logical line, the verified statement
    quelle: string; // source URL
    quelleName: string;
    geprueftAm: string; // YYYY-MM-DD, when last verified
    recheckNach: string; // YYYY-MM-DD, re-verify after this date (TTL)
}

const ROOT = process.cwd();
export const VAULT_FILE = path.join(ROOT, 'content-engine/knowledge/vault.md');

// German stopwords + filler that carry no retrieval signal.
const STOP = new Set([
    'und', 'oder', 'der', 'die', 'das', 'ein', 'eine', 'einer', 'einen', 'dem', 'den', 'des',
    'fuer', 'für', 'von', 'mit', 'auf', 'aus', 'ist', 'sind', 'wie', 'was', 'wann', 'wer', 'wo',
    'man', 'sich', 'im', 'in', 'am', 'an', 'zu', 'zum', 'zur', 'bei', 'als', 'auch', 'nicht',
    'sie', 'ihr', 'ihre', 'wird', 'werden', 'kann', 'koennen', 'können', 'soll', 'sollte',
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] || c))
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 3 && !STOP.has(w));
}

export function parseVault(md: string): VaultFact[] {
    const blocks = md.split(/\n##\s+/).slice(1); // drop the file header before the first "## "
    const facts: VaultFact[] = [];
    for (const raw of blocks) {
        const lines = raw.split('\n');
        const id = lines[0].trim();
        if (!id) continue;
        const get = (key: string): string => {
            const line = lines.find((l) => l.trim().toLowerCase().startsWith(key + ':'));
            return line ? line.slice(line.indexOf(':') + 1).trim() : '';
        };
        const aussage = get('aussage');
        const quelle = get('quelle');
        if (!aussage || !quelle) continue; // a fact without a statement or source is not citable
        const clusterRaw = get('cluster');
        const keywordsRaw = get('keywords');
        facts.push({
            id,
            cluster: Number(clusterRaw) || 0,
            keywords: keywordsRaw ? keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean) : [],
            aussage,
            quelle,
            quelleName: get('quelle_name') || quelle,
            geprueftAm: get('geprueft_am'),
            recheckNach: get('recheck_nach'),
        });
    }
    return facts;
}

export function loadVault(file: string = VAULT_FILE): VaultFact[] {
    try {
        return parseVault(fs.readFileSync(file, 'utf8'));
    } catch {
        return []; // no vault yet → researcher just uses the web as before (additive, never blocks)
    }
}

// ISO date strings compare lexicographically, so a plain string compare is correct here.
export function isStale(fact: VaultFact, today: string): boolean {
    return !fact.recheckNach || fact.recheckNach < today;
}

export interface VaultSearchResult {
    fresh: VaultFact[];
    stale: VaultFact[];
}

// Keyword/term overlap scoring. Same-cluster facts get a bonus but other clusters are not
// excluded (a cost fact can matter for a maintenance article). Deterministic, no LLM.
export function searchVault(facts: VaultFact[], query: string, cluster: number, today: string, limit = 6): VaultSearchResult {
    const qTokens = new Set(tokenize(query));
    const scored = facts
        .map((f) => {
            const kwTokens = new Set(f.keywords.flatMap((k) => tokenize(k)));
            const bodyTokens = new Set(tokenize(f.aussage));
            let score = 0;
            for (const t of qTokens) {
                if (kwTokens.has(t)) score += 3;
                else if (bodyTokens.has(t)) score += 1;
            }
            if (score > 0 && f.cluster === cluster) score += 2;
            return { f, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.f);

    return {
        fresh: scored.filter((f) => !isStale(f, today)),
        stale: scored.filter((f) => isStale(f, today)),
    };
}

// The text block injected into the researcher prompt. Empty string when no hits, so the
// caller can append unconditionally without polluting the prompt.
export function formatVaultContext(res: VaultSearchResult): string {
    if (!res.fresh.length && !res.stale.length) return '';
    const parts: string[] = [];
    if (res.fresh.length) {
        parts.push('=== WISSENS-VAULT (eigene, bereits verifizierte Fakten — BEVORZUGT als Beleg nutzen statt neu zu suchen) ===');
        for (const f of res.fresh) {
            parts.push(`- ${f.aussage} [Quelle: ${f.quelleName}, ${f.quelle}, geprueft ${f.geprueftAm}]`);
        }
    }
    if (res.stale.length) {
        parts.push('\n=== VAULT: VERALTET (Recheck faellig — NUR verwenden, wenn du es jetzt im Web neu bestaetigst) ===');
        for (const f of res.stale) {
            parts.push(`- ${f.aussage} [${f.quelle}, recheck war faellig ${f.recheckNach}]`);
        }
    }
    return parts.join('\n');
}

// ── Backflow (write side) ─────────────────────────────────────────────────────

export function addDays(isoDate: string, days: number): string {
    const d = new Date(isoDate + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

export function serializeFact(f: VaultFact): string {
    return [
        `## ${f.id}`,
        `cluster: ${f.cluster}`,
        `keywords: ${f.keywords.join(', ')}`,
        `aussage: ${f.aussage}`,
        `quelle: ${f.quelle}`,
        `quelle_name: ${f.quelleName}`,
        `geprueft_am: ${f.geprueftAm}`,
        `recheck_nach: ${f.recheckNach}`,
    ].join('\n');
}

export interface NewFactInput {
    cluster: number;
    keywords: string[];
    aussage: string;
    quelle: string;
    quelleName: string;
}

// Append newly verified facts to the vault, deduping by source URL + normalized statement.
// Returns counts so the caller can log the backflow. TTL defaults to 180 days.
export function appendFacts(
    newFacts: NewFactInput[],
    today: string,
    opts: { file?: string; ttlDays?: number; idPrefix?: string } = {}
): { added: number; skipped: number } {
    const file = opts.file ?? VAULT_FILE;
    const ttlDays = opts.ttlDays ?? 180;
    const existing = loadVault(file);
    const seen = new Set(existing.map((f) => dedupKey(f.quelle, f.aussage)));

    const toAdd: VaultFact[] = [];
    let skipped = 0;
    let seq = existing.length;
    for (const nf of newFacts) {
        if (!nf.aussage || !nf.quelle) {
            skipped++;
            continue;
        }
        const key = dedupKey(nf.quelle, nf.aussage);
        if (seen.has(key)) {
            skipped++;
            continue;
        }
        seen.add(key);
        seq++;
        toAdd.push({
            id: `${opts.idPrefix ?? 'fact'}-${today}-${String(seq).padStart(3, '0')}`,
            cluster: nf.cluster,
            keywords: nf.keywords,
            aussage: nf.aussage,
            quelle: nf.quelle,
            quelleName: nf.quelleName,
            geprueftAm: today,
            recheckNach: addDays(today, ttlDays),
        });
    }
    if (!toAdd.length) return { added: 0, skipped };

    fs.mkdirSync(path.dirname(file), { recursive: true });
    const header = fs.existsSync(file) ? '' : VAULT_HEADER + '\n\n';
    const body = toAdd.map(serializeFact).join('\n\n');
    fs.appendFileSync(file, (header || (fs.readFileSync(file, 'utf8').endsWith('\n') ? '\n' : '\n\n')) + body + '\n');
    return { added: toAdd.length, skipped };
}

function dedupKey(url: string, aussage: string): string {
    return url.trim().toLowerCase() + '::' + aussage.trim().toLowerCase().slice(0, 80);
}

export const VAULT_HEADER = `# Wissens-Vault (web-verifizierte eigene Fakten)

> Additive Wissensschicht (Plan v2, §3). Jeder Fakt: aussage, quelle (URL), geprueft_am, recheck_nach (TTL).
> Der Researcher fragt den Vault ZUERST und holt nur Luecken aus dem Web. Veraltete Fakten
> (recheck_nach in der Vergangenheit) sind nicht zitierbar, bis sie neu bestaetigt sind.
> Rueckfluss: jeder publizierte Artikel speist seine verifizierten Fakten hier ein.
> Format pro Fakt: "## <id>" + cluster, keywords, aussage, quelle, quelle_name, geprueft_am, recheck_nach.`;
