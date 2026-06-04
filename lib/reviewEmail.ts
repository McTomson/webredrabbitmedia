import { signToken } from './approvalToken';
import { SITE_URL } from './config';

// Shared review-email template. Used by the deployed /api/review-notify route (sends via
// Vercel SMTP) and by the engine CLI. One-tap approve/reject links carry signed tokens.

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
