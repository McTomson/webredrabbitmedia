import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { requireAdminToken } from '@/lib/api-security';
import { buildPublishedEmail, type PublishedLinks } from '@/lib/reviewEmail';
import { buildDistributionKit, renderKitText } from '@/scripts/content-engine/media/distribution';

export const runtime = 'nodejs';

// Admin-protected: sends the final "published + uploaded" email with every link
// (article/podcast, YouTube, Substack) so Thomas can review the media in one place.
// Body: { slug, youtube?, substack?, youtubePrivacy? }. Title is read from the mdx.
export async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdminToken(req);
    if (denied) return denied;

    let body: { slug?: string; youtube?: string; substack?: string; youtubePrivacy?: 'unlisted' | 'public' };
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

    // Canonical-safe syndication kit (paste-ready). Never let a kit error block the mail.
    let distributionKit: string | undefined;
    try {
        distributionKit = renderKitText(buildDistributionKit(slug));
    } catch {
        distributionKit = undefined;
    }

    const links: PublishedLinks = {
        slug,
        title: m.data.title,
        youtubeUrl: body.youtube,
        substackUrl: body.substack,
        youtubePrivacy: body.youtubePrivacy || 'unlisted',
        distributionKit,
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

    const { subject, html, text } = buildPublishedEmail(links);
    try {
        await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, html, text });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `send failed: ${msg}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, slug, to });
}
