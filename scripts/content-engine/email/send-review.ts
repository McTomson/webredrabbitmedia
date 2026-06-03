import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { signToken } from '../../../lib/approvalToken';

// Builds and sends the daily review email: live preview link + one-tap approve/reject
// links (signed tokens hitting /api/approve). Usable from a phone, no computer needed.

const SITE_URL = process.env.SITE_URL || 'https://web.redrabbit.media';

export interface ReviewArticle {
    slug: string;
    title: string;
    author: string;
    excerpt: string;
    wordCount: number;
    sources: Array<{ name: string; url: string }>;
    flags: string[];
    risk: 'low' | 'high';
}

export function buildReviewEmail(a: ReviewArticle, secret: string): { subject: string; html: string; text: string } {
    const preview = `${SITE_URL}/tipps/${a.slug}`;
    const approve = `${SITE_URL}/api/approve?token=${signToken(a.slug, 'approve', secret)}`;
    const reject = `${SITE_URL}/api/approve?token=${signToken(a.slug, 'reject', secret)}`;
    const flagsLine = a.flags.length ? a.flags.join(', ') : 'keine';
    const sourcesList = a.sources.map((s) => `<li><a href="${s.url}">${s.name}</a></li>`).join('');

    const subject = `Neuer Tipps-Artikel zur Freigabe: ${a.title}`;
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f8;margin:0;padding:24px;color:#1a1a1a">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 2px 14px rgba(0,0,0,.06)">
<p style="margin:0 0 4px;font-size:13px;color:#666">Red Rabbit Content-Engine, Entwurf zur Freigabe</p>
<h1 style="font-size:21px;margin:0 0 8px">${a.title}</h1>
<p style="margin:0 0 16px;color:#444;line-height:1.5">${a.excerpt}</p>
<table style="font-size:14px;color:#444;margin:0 0 18px"><tr><td style="padding:2px 12px 2px 0">Autor</td><td>${a.author}</td></tr>
<tr><td style="padding:2px 12px 2px 0">Laenge</td><td>${a.wordCount} Woerter</td></tr>
<tr><td style="padding:2px 12px 2px 0">Quellen</td><td>${a.sources.length} (verifiziert)</td></tr>
<tr><td style="padding:2px 12px 2px 0">Risiko</td><td>${a.risk === 'high' ? 'hoch, bitte Zahlen/Rechtliches gegenlesen' : 'niedrig'}</td></tr>
<tr><td style="padding:2px 12px 2px 0">Flags</td><td>${flagsLine}</td></tr></table>
<div style="margin:0 0 22px">
<a href="${preview}" style="display:block;text-align:center;background:#111;color:#fff;text-decoration:none;padding:13px;border-radius:9px;margin-bottom:10px;font-weight:600">Artikel live ansehen</a>
<a href="${approve}" style="display:block;text-align:center;background:#1a7f37;color:#fff;text-decoration:none;padding:13px;border-radius:9px;margin-bottom:10px;font-weight:600">Freigeben und veroeffentlichen</a>
<a href="${reject}" style="display:block;text-align:center;background:#fff;color:#b42318;border:1px solid #b42318;text-decoration:none;padding:12px;border-radius:9px;font-weight:600">Ablehnen / Aenderungen</a>
</div>
<p style="font-size:13px;color:#666;margin:0 0 6px">Quellen im Artikel:</p>
<ul style="font-size:13px;color:#555;line-height:1.5;margin:0 0 16px;padding-left:18px">${sourcesList}</ul>
<p style="font-size:12px;color:#999;margin:0">Antworten Sie auf diese Mail mit Aenderungswuenschen, ich arbeite sie ein. Der Artikel ist bis zur Freigabe nicht bei Google sichtbar.</p>
</div></body></html>`;
    const text = `${a.title}\n\n${a.excerpt}\n\nAutor: ${a.author} | ${a.wordCount} Woerter | ${a.sources.length} Quellen | Risiko: ${a.risk}\nFlags: ${flagsLine}\n\nAnsehen: ${preview}\nFreigeben: ${approve}\nAblehnen: ${reject}\n`;
    return { subject, html, text };
}

export async function sendReviewEmail(a: ReviewArticle): Promise<void> {
    const secret = process.env.APPROVAL_SECRET;
    if (!secret) throw new Error('APPROVAL_SECRET fehlt');
    const to = process.env.SMTP_TO || process.env.REVIEW_TO;
    if (!to) throw new Error('SMTP_TO (Empfaenger) fehlt');

    const smtpUser = process.env.SMTP_USER;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    });
    const { subject, html, text } = buildReviewEmail(a, secret);
    await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, html, text });
    process.stderr.write(`  [email] Review-Mail an ${to} gesendet: ${a.slug}\n`);
}

// CLI: tsx scripts/content-engine/email/send-review.ts <slug> [risk]
async function cli() {
    const slug = process.argv[2];
    if (!slug) throw new Error('Slug angeben');
    const mdxPath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);
    const m = matter(fs.readFileSync(mdxPath, 'utf8'));
    const wordCount = m.content.split(/\s+/).filter(Boolean).length;
    await sendReviewEmail({
        slug,
        title: m.data.title,
        author: m.data.author,
        excerpt: m.data.excerpt,
        wordCount,
        sources: m.data.sources || [],
        flags: (process.argv[4] ? process.argv[4].split(',') : []),
        risk: (process.argv[3] as 'low' | 'high') || 'high',
    });
}

if (process.argv[1] && process.argv[1].endsWith('send-review.ts')) {
    cli().catch((e) => {
        console.error('EMAIL-FEHLER:', e.message);
        process.exit(1);
    });
}
