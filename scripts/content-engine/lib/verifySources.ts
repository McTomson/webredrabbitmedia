// Source-URL verifier. Enforces the no-hallucination rule (Guardrail 4): every cited
// source must point at a server that actually exists. Dead/unreachable URLs are dropped.

export interface Source {
    name: string;
    url: string;
}

// 404/410 = dead, 0 = unreachable/DNS-fail -> the URL is not trustworthy, drop it.
// 401/403/405/429/503 = the server exists but blocks scrapers -> real, keep it.
export function classifyStatus(code: number): 'ok' | 'drop' {
    if (code === 0 || code === 404 || code === 410) return 'drop';
    return 'ok';
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

async function probe(url: string, timeoutMs = 25000): Promise<number> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        // GET (some servers reject HEAD); follow redirects; browser UA to dodge naive blocks.
        const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA } });
        return res.status;
    } catch {
        return 0;
    } finally {
        clearTimeout(t);
    }
}

export interface VerifyResult {
    kept: Source[];
    dropped: Array<Source & { code: number }>;
}

export async function verifySources(sources: Source[]): Promise<VerifyResult> {
    const kept: Source[] = [];
    const dropped: Array<Source & { code: number }> = [];
    for (const s of sources) {
        let code = 0;
        try {
            code = new URL(s.url) ? await probe(s.url) : 0;
        } catch {
            code = 0;
        }
        if (classifyStatus(code) === 'ok') kept.push(s);
        else dropped.push({ ...s, code });
    }
    return { kept, dropped };
}
