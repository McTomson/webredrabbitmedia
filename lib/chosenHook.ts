import matter from 'gray-matter';

// Helpers for the "approve-with-hook" flow (Thomas 22.06): a click on hook button N in the
// review email both publishes the article AND pins that hook. /api/approve writes the chosen
// hook text into the article frontmatter as `chosenHook`, and the night image step
// (build-image-plan.ts) renders exactly that hook onto the hero.
//
// Kept as pure string functions (no GitHub/IO) so they are unit-testable.

// Resolve a 1-based hook index against the article's hookCandidates. Returns the hook text,
// or null if the index is out of range / there are no candidates.
export function pickHook(content: string, hookIndex1Based: number): string | null {
    if (!Number.isInteger(hookIndex1Based) || hookIndex1Based < 1) return null;
    let candidates: unknown;
    try {
        candidates = (matter(content).data as { hookCandidates?: unknown }).hookCandidates;
    } catch {
        return null;
    }
    if (!Array.isArray(candidates)) return null;
    const hook = candidates[hookIndex1Based - 1];
    return typeof hook === 'string' && hook.trim() ? hook.trim() : null;
}

// Inject (or replace) a `chosenHook:` line in the YAML frontmatter, preserving the rest of the
// file verbatim (the approve route avoids reserialising the whole document). The value is written
// as a JSON-style double-quoted scalar, which YAML parses correctly (handles quotes/colons inside).
export function setChosenHook(content: string, hookText: string): string {
    const line = `chosenHook: ${JSON.stringify(hookText)}`;
    if (/^chosenHook:.*$/m.test(content)) {
        return content.replace(/^chosenHook:.*$/m, line);
    }
    // Insert right after the status line (which exists in every article frontmatter).
    if (/^status:\s*["']?\w+["']?\s*$/m.test(content)) {
        return content.replace(/^(status:\s*["']?\w+["']?\s*)$/m, `$1\n${line}`);
    }
    return content; // no status line found (unexpected) -> leave unchanged, fail-safe
}
