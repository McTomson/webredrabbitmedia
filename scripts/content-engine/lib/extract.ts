// Deterministic parsers for LLM role output. Roles are instructed to emit a fenced
// ```json or ```mdx block; these helpers extract and (for json) parse it robustly.

function lastFenced(text: string, lang: string): string | null {
    const re = new RegExp('```' + lang + '\\s*\\n([\\s\\S]*?)```', 'g');
    let m: RegExpExecArray | null;
    let last: string | null = null;
    while ((m = re.exec(text)) !== null) last = m[1];
    return last !== null ? last.trim() : null;
}

export function extractJsonBlock(text: string): unknown {
    const fenced = lastFenced(text, 'json');
    if (fenced) return JSON.parse(fenced);

    // Fallback: first balanced {...} object in the text.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
        return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error('extractJsonBlock: no JSON found in role output');
}

export function extractMdxBlock(text: string): string {
    const fenced = lastFenced(text, 'mdx');
    if (fenced) return fenced;

    const trimmed = text.trim();
    if (trimmed.startsWith('---')) return trimmed; // looks like raw frontmatter+body
    throw new Error('extractMdxBlock: no MDX/frontmatter found in role output');
}
