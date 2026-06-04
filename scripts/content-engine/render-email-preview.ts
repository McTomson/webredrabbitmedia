import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { buildReviewEmail, type ReviewArticle } from '../../lib/reviewEmail';

// Render the daily review email to a standalone HTML file for visual inspection (no send).
// Uses a dummy secret so the approve/reject links are intentionally non-functional in the preview.
// Usage: tsx scripts/content-engine/render-email-preview.ts <slug> <outPath>
const slug = process.argv[2] || 'website-wartungsvertrag-sinnvoll';
const out = process.argv[3] || path.join('scripts/content-engine/.work', `${slug}-email-preview.html`);

const m = matter(fs.readFileSync(path.join('content/blog', `${slug}.mdx`), 'utf8'));
const article: ReviewArticle = {
    slug,
    title: String(m.data.title),
    author: String(m.data.author || 'Thomas Uhlir MBA'),
    excerpt: String(m.data.excerpt || m.data.featuredSnippet || ''),
    wordCount: m.content.split(/\s+/).filter(Boolean).length,
    sources: (m.data.sources || []) as Array<{ name: string; url: string }>,
    flags: [],
    risk: 'low',
};
const { subject, html } = buildReviewEmail(article, 'DUMMY_PREVIEW_SECRET');
fs.writeFileSync(out, html);
console.log('SUBJECT:', subject);
console.log('OUT:', out);
