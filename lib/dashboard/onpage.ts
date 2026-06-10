import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Deterministic on-page audit (Phase 2 "Verbesserungen"). Checks every published article
// against the checkable rules in content-engine/knowledge/playbook.md §2/§3. Pure local read,
// no external creds. This is the actionable, always-available half of the improvement loop;
// the data-verified half (do these levers move OUR GSC numbers?) comes once traffic grows.

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content/blog');

export interface AuditIssue {
    key: string;
    label: string;
}

export interface ArticleAudit {
    slug: string;
    title: string;
    cluster: number;
    score: number; // 0-100, share of passed checks
    issues: AuditIssue[];
}

export interface OnPageData {
    articles: ArticleAudit[];
    issueFrequency: Array<{ key: string; label: string; count: number }>;
    avgScore: number;
    year: number;
}

// Only the frontmatter fields the audit reads. gray-matter returns an index type; we narrow it.
interface Frontmatter {
    slug?: string;
    title?: string;
    cluster?: number;
    featuredSnippet?: string;
    customFAQs?: unknown[];
    sources?: unknown[];
    keyTakeaways?: unknown[];
}

// Each check: returns an issue when the article FAILS it. Order = display order.
const CHECKS: Array<{ key: string; label: string; fails: (fm: Frontmatter, body: string, year: number) => boolean }> = [
    { key: 'answer_block', label: 'Antwort-Block fehlt oder zu kurz (40-60 Wörter)', fails: (fm) => {
        const s = (fm.featuredSnippet || '').toString().trim();
        const words = s ? s.split(/\s+/).length : 0;
        return words < 35;
    } },
    { key: 'faq', label: 'FAQ-Block fehlt (4-5 Fragen für AI Overviews)', fails: (fm) => {
        return !Array.isArray(fm.customFAQs) || fm.customFAQs.length < 4;
    } },
    { key: 'year_in_title', label: 'Aktuelles Jahr nicht im Titel (Frische-Signal)', fails: (fm, _b, year) => {
        return !new RegExp(`\\b${year}\\b`).test((fm.title || '').toString());
    } },
    { key: 'internal_links', label: 'Weniger als 2 interne Links (Cluster-Verlinkung)', fails: (_fm, body) => {
        const links = [...body.matchAll(/\]\((\/[^)]+)\)/g)].map((m) => m[1]).filter((h) => !h.startsWith('/images'));
        return new Set(links).size < 2;
    } },
    { key: 'sources', label: 'Keine Quellen hinterlegt (E-E-A-T)', fails: (fm) => {
        return !Array.isArray(fm.sources) || fm.sources.length < 1;
    } },
    { key: 'key_takeaways', label: 'Key-Takeaways-Block fehlt', fails: (fm) => {
        return !Array.isArray(fm.keyTakeaways) || fm.keyTakeaways.length < 3;
    } },
];

export function getOnPageAudit(): OnPageData {
    const year = new Date().getFullYear();
    if (!fs.existsSync(BLOG_DIR)) return { articles: [], issueFrequency: [], avgScore: 0, year };

    const articles: ArticleAudit[] = [];
    const freq: Record<string, { label: string; count: number }> = {};

    for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const parsed = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
        const fm = parsed.data as Frontmatter;
        const body = parsed.content;
        const slug = (fm.slug || file.replace('.mdx', '')).toString();
        const issues: AuditIssue[] = [];
        for (const c of CHECKS) {
            if (c.fails(fm, body, year)) {
                issues.push({ key: c.key, label: c.label });
                freq[c.key] = { label: c.label, count: (freq[c.key]?.count || 0) + 1 };
            }
        }
        articles.push({
            slug,
            title: (fm.title || slug).toString(),
            cluster: Number(fm.cluster) || 0,
            score: Math.round(((CHECKS.length - issues.length) / CHECKS.length) * 100),
            issues,
        });
    }

    articles.sort((a, b) => a.score - b.score); // worst first = highest leverage
    const issueFrequency = Object.entries(freq)
        .map(([key, v]) => ({ key, label: v.label, count: v.count }))
        .sort((a, b) => b.count - a.count);
    const avgScore = articles.length ? Math.round(articles.reduce((s, a) => s + a.score, 0) / articles.length) : 0;

    return { articles, issueFrequency, avgScore, year };
}
