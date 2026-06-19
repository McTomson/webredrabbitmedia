import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// ──────────────────────────────────────────────────────────────────────────
// extract-body: turn a published article MDX into clean plain text for use as a
// NotebookLM VIDEO source.
//
// WHY this exists (the hard-won lesson, 2026-06-19): NotebookLM video generation
// FAILS when the source is a crawled URL but SUCCEEDS when the source is the full
// article text pasted in (`source add --type text`). Audio tolerates a URL source,
// video does not. So the headless video flow must feed clean full text — that text
// is what this module produces. See content-engine/knowledge/media-notes.md.
//
// The text must read like an article (so NotebookLM writes a faithful script):
// frontmatter, imports, the <SimpleAudioPlayer/> + <VideoEmbed/> embeds, and
// markdown image lines are all noise and are removed; links collapse to their
// label; headings/emphasis markers are stripped but their text is kept. The title
// and excerpt are prepended for context.
// ──────────────────────────────────────────────────────────────────────────

export function stripMdxToText(raw: string): string {
    const { content, data } = matter(raw);
    let body = content;

    // HTML comments
    body = body.replace(/<!--[\s\S]*?-->/g, '');
    // Fenced code blocks ```...``` -> drop entirely (code reads as gibberish in a video script).
    // The closing fence must start a line; the lazy match is bounded by it (no catastrophic backtracking).
    body = body.replace(/^```[\s\S]*?^```[^\n]*$/gm, '');
    // Self-closing JSX components (SimpleAudioPlayer, VideoEmbed, any <Tag .../>),
    // including the rare multi-line form.
    body = body.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '');
    // Paired JSX components <Tag ...> ... </Tag> (defensive; current embeds are self-closing).
    body = body.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, '');
    // import / export lines (MDX module scope)
    body = body.replace(/^\s*(import|export)\s.+$/gm, '');
    // Markdown images ![alt](url) -> drop entirely (alt text is decorative here)
    body = body.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    // Markdown links [label](url) -> label
    body = body.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    // Heading markers, blockquotes, list bullets: keep the text, drop the marker
    body = body.replace(/^\s{0,3}#{1,6}\s+/gm, '');
    body = body.replace(/^\s{0,3}>\s?/gm, '');
    body = body.replace(/^\s{0,3}[-*+]\s+/gm, '');
    body = body.replace(/^\s{0,3}\d+\.\s+/gm, '');
    // Emphasis / inline code markers (keep the inner text)
    body = body.replace(/\*\*([^*]+)\*\*/g, '$1');
    body = body.replace(/\*([^*]+)\*/g, '$1');
    body = body.replace(/`([^`]+)`/g, '$1');
    // Horizontal rules
    body = body.replace(/^\s*([-*_])\1{2,}\s*$/gm, '');
    // Collapse 3+ blank lines to a single blank line; trim trailing whitespace per line
    body = body
        .split('\n')
        .map((l) => l.replace(/\s+$/, ''))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    const title = (data.title || '').toString().trim();
    const excerpt = (data.excerpt || data.featuredSnippet || '').toString().trim();
    const header = [title, excerpt].filter(Boolean).join('\n\n');
    return header ? `${header}\n\n${body}\n` : `${body}\n`;
}

export function extractArticleText(slug: string, blogDir = path.join(process.cwd(), 'content/blog')): string {
    const file = path.join(blogDir, `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Artikel nicht gefunden: ${file}`);
    return stripMdxToText(fs.readFileSync(file, 'utf8'));
}

// CLI: `tsx extract-body.ts <slug>` prints the clean text to stdout (the video
// script captures it into a temp file and passes it as the --type text source).
if (process.argv[1] && process.argv[1].endsWith('extract-body.ts')) {
    const slug = process.argv[2];
    if (!slug) {
        process.stderr.write('Usage: tsx extract-body.ts <slug>\n');
        process.exit(1);
    }
    try {
        process.stdout.write(extractArticleText(slug));
    } catch (e: any) {
        process.stderr.write(`FEHLER: ${e.message}\n`);
        process.exit(1);
    }
}
