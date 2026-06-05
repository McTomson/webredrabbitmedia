import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { requireAdminToken } from '@/lib/api-security';
import { buildMediaStartedEmail, type MediaStarted } from '@/lib/reviewEmail';
import { signToken } from '@/lib/approvalToken';
import { SITE_URL } from '@/lib/config';

export const runtime = 'nodejs';

// Admin-protected: sends Mail 2 of the 3-mail flow (text approved -> media starting).
// Carries a signed media-trigger link so Thomas can kick off / confirm the podcast+video
// step from his phone. Body: { slug }. Title is read from the mdx.
export async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdminToken(req);
    if (denied) return denied;

    let body: { slug?: string };
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

    const secret = process.env.APPROVAL_SECRET;
    if (!secret) return NextResponse.json({ error: 'APPROVAL_SECRET missing' }, { status: 500 });
    const triggerUrl = `${SITE_URL}/api/media-trigger?token=${signToken(slug, 'media', secret)}`;

    const data: MediaStarted = { slug, title: m.data.title, triggerUrl };

    const to = process.env.SMTP_TO || process.env.REVIEW_TO;
    if (!to) return NextResponse.json({ error: 'SMTP_TO missing' }, { status: 500 });

    const smtpUser = process.env.SMTP_USER;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    });

    const { subject, html, text } = buildMediaStartedEmail(data);
    try {
        await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, html, text });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `send failed: ${msg}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, slug, to });
}
