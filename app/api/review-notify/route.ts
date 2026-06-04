import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { requireAdminToken } from '@/lib/api-security';
import { buildReviewEmail, type ReviewArticle } from '@/lib/reviewEmail';

export const runtime = 'nodejs';

// Admin-protected: sends the daily review email for a draft article using Vercel's SMTP
// (so the local pipeline needs no mail credentials). Body: { slug, flags?, risk? }.
// The article content is read from the deployed repo (content/blog/<slug>.mdx).

const HIGH_RISK_CATEGORIES = ['Recht', 'Steuer', 'Sicherheit', 'Compliance'];

export async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdminToken(req);
    if (denied) return denied;

    const secret = process.env.APPROVAL_SECRET;
    if (!secret) return NextResponse.json({ error: 'APPROVAL_SECRET missing' }, { status: 500 });

    let body: { slug?: string; flags?: string[]; risk?: 'low' | 'high' };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'invalid json' }, { status: 400 });
    }
    const slug = (body.slug || '').replace(/[^a-z0-9-]/g, '');
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const mdxPath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(mdxPath)) return NextResponse.json({ error: 'article not found' }, { status: 404 });

    const m = matter(fs.readFileSync(mdxPath, 'utf8'));
    const category = String(m.data.category || '');
    const risk: 'low' | 'high' = body.risk || (HIGH_RISK_CATEGORIES.some((c) => category.includes(c)) ? 'high' : 'low');

    const article: ReviewArticle = {
        slug,
        title: m.data.title,
        author: m.data.author,
        excerpt: m.data.excerpt,
        wordCount: m.content.split(/\s+/).filter(Boolean).length,
        sources: m.data.sources || [],
        flags: body.flags || [],
        risk,
    };

    const to = process.env.SMTP_TO || process.env.REVIEW_TO;
    if (!to) return NextResponse.json({ error: 'SMTP_TO missing' }, { status: 500 });

    const smtpUser = process.env.SMTP_USER;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    });

    const { subject, html, text } = buildReviewEmail(article, secret);
    try {
        await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, html, text });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `send failed: ${msg}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, slug, to, risk });
}
