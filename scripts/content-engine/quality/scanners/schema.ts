import type { ArticleSchema } from '../types';

// JSON-LD schema scanner. The structured data is generated at render time (app/tipps/[slug]/page.tsx),
// so it can only be validated against the rendered HTML — we fetch the live page. schema-dts guards
// the SHAPE at compile time; this scanner guards that the deployed page actually emits valid blocks.

interface JsonLdBlock {
    raw: unknown;
    type: string;
}

// Extract every <script type="application/ld+json"> payload from page HTML. Pure — unit-tested.
export function extractJsonLd(html: string): JsonLdBlock[] {
    const blocks: JsonLdBlock[] = [];
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    for (const m of html.matchAll(re)) {
        const text = m[1].trim();
        if (!text) continue;
        try {
            const parsed = JSON.parse(text);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            for (const item of items) {
                const t = (item && typeof item === 'object' && (item as Record<string, unknown>)['@type']) || 'Unknown';
                blocks.push({ raw: item, type: String(t) });
            }
        } catch {
            blocks.push({ raw: null, type: 'ParseError' });
        }
    }
    return blocks;
}

// Required fields per known @type. Missing required field = schema error. Pure — unit-tested.
const REQUIRED: Record<string, string[]> = {
    BlogPosting: ['@context', 'headline', 'author', 'datePublished'],
    FAQPage: ['@context', 'mainEntity'],
    Organization: ['@context', 'name'],
};

export function validateBlocks(blocks: JsonLdBlock[]): { types: string[]; errors: string[]; valid: boolean } {
    const types: string[] = [];
    const errors: string[] = [];
    if (blocks.length === 0) errors.push('kein JSON-LD auf der Seite gefunden');
    for (const b of blocks) {
        if (b.type === 'ParseError') {
            errors.push('JSON-LD-Block nicht parsebar');
            continue;
        }
        types.push(b.type);
        const obj = b.raw as Record<string, unknown>;
        const required = REQUIRED[b.type];
        if (!required) continue; // unknown type — not graded, just listed
        for (const field of required) {
            const v = obj?.[field];
            const empty = v === undefined || v === null || (Array.isArray(v) && v.length === 0) || v === '';
            if (empty) errors.push(`${b.type}: Pflichtfeld "${field}" fehlt`);
        }
    }
    return { types: [...new Set(types)], errors, valid: errors.length === 0 };
}

export async function scanSchema(url: string): Promise<ArticleSchema> {
    let html: string;
    try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 20_000);
        const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'redrabbit-quality-scan' } });
        clearTimeout(t);
        if (!res.ok) {
            return { status: 'unavailable', note: `HTTP ${res.status} beim Laden`, types: [], errors: [], valid: false };
        }
        html = await res.text();
    } catch (e) {
        return { status: 'unavailable', note: `Seite nicht erreichbar: ${(e as Error).message}`, types: [], errors: [], valid: false };
    }
    const { types, errors, valid } = validateBlocks(extractJsonLd(html));
    return { status: 'ok', types, errors, valid };
}
