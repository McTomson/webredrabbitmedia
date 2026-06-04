import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { buildReviewEmail, type ReviewArticle } from '../../../lib/reviewEmail';

// Sends the daily review email (CLI / local path). Template is shared with the deployed
// /api/review-notify route via lib/reviewEmail.
export { buildReviewEmail, type ReviewArticle };

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
