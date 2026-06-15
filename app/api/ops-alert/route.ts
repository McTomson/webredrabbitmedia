import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { requireAdminToken } from '@/lib/api-security';

export const runtime = 'nodejs';

// Admin-protected ops notification. Sends a plain status/alert mail to SMTP_TO via Vercel's SMTP
// (the local daily script holds no mail credentials, so it must go through the deployed route).
// Body: { subject, message, kind? }. Used by run-daily.sh so the user ALWAYS gets a daily signal —
// either the review mail (article generated) or this status mail (pipeline halted / run failed).
// Deliberately tiny and slug-free, so it can report failures that the review route (which needs a
// real article) cannot.

const MAX = 4000; // clamp body so a runaway log can't become a giant mail

export async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = requireAdminToken(req);
    if (denied) return denied;

    let body: { subject?: string; message?: string; kind?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'invalid json' }, { status: 400 });
    }

    const kind = (body.kind || 'info').slice(0, 24);
    const rawSubject = (body.subject || '').trim() || 'Content-Engine Status';
    const subject = `[Red Rabbit Ops] ${rawSubject}`.slice(0, 160);
    const message = (body.message || '').slice(0, MAX) || '(keine Details)';

    const to = process.env.SMTP_TO || process.env.REVIEW_TO;
    if (!to) return NextResponse.json({ error: 'SMTP_TO missing' }, { status: 500 });

    const smtpUser = process.env.SMTP_USER;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    });

    const stamp = new Date().toISOString();
    const text = `${message}\n\n— Red Rabbit Content-Engine (${kind}) · ${stamp}`;
    const html = `<p style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(message)}</p>`
        + `<hr><p style="color:#888;font-size:12px">Red Rabbit Content-Engine · ${kind} · ${stamp}</p>`;

    try {
        await transporter.sendMail({ from: process.env.SMTP_FROM || smtpUser, to, subject, html, text });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `send failed: ${msg}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, to, kind });
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
