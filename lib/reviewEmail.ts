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

export interface MediaStarted {
    slug: string;
    title: string;
    // signed link that kicks off (or confirms) the media step from the phone
    triggerUrl: string;
}

// Mail 2 of the 3-mail flow. Sent right after the text is approved. Tells Thomas the
// media step (NotebookLM podcast + video) is starting and gives him one tap to confirm
// from the phone. No second text review, the text is already approved.
export function buildMediaStartedEmail(m: MediaStarted): { subject: string; html: string; text: string } {
    const article = `${SITE_URL}/tipps/${m.slug}`;
    const subject = `Text freigegeben, Medien starten: ${m.title}`;
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f8;margin:0;padding:24px;color:#1a1a1a">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 2px 14px rgba(0,0,0,.06)">
<p style="margin:0 0 4px;font-size:13px;color:#666">Red Rabbit Content-Engine, Schritt 2 von 3</p>
<h1 style="font-size:21px;margin:0 0 8px">${m.title}</h1>
<p style="margin:0 0 18px;color:#444;line-height:1.5">Danke, der Text ist freigegeben und online. Jetzt erzeuge ich den Podcast und das Video (NotebookLM), bette den Podcast auf der Website ein und lade das Video auf YouTube. Tippen Sie hier, um den Medien-Schritt anzustossen oder zu bestaetigen.</p>
<div style="margin:0 0 22px">
<a href="${m.triggerUrl}" style="display:block;text-align:center;background:#1a7f37;color:#fff;text-decoration:none;padding:13px;border-radius:9px;margin-bottom:10px;font-weight:600">Podcast und Video jetzt erzeugen</a>
<a href="${article}" style="display:block;text-align:center;background:#111;color:#fff;text-decoration:none;padding:13px;border-radius:9px;font-weight:600">Artikel ansehen</a>
</div>
<p style="font-size:12px;color:#999;margin:0">Sobald alles hochgeladen und gepusht ist, bekommen Sie eine letzte Mail mit allen Links. Mehr ist nicht zu tun.</p>
</div></body></html>`;
    const text = `${m.title}\n\nText freigegeben und online. Medien-Schritt (Podcast + Video) startet.\n\nAnstossen/bestaetigen: ${m.triggerUrl}\nArtikel: ${article}\n\nDie letzte Mail kommt, sobald alles hochgeladen und gepusht ist.\n`;
    return { subject, html, text };
}

export interface PublishedLinks {
    slug: string;
    title: string;
    youtubeUrl?: string;
    substackUrl?: string;
    // privacy hint shown to the user, e.g. YouTube still unlisted awaiting their OK
    youtubePrivacy?: 'unlisted' | 'public';
}

// Sent AFTER the article is pushed and the media is uploaded. Gives Thomas one mail with
// every link so he can watch the podcast and video and confirm before anything goes public.
export function buildPublishedEmail(p: PublishedLinks): { subject: string; html: string; text: string } {
    const article = `${SITE_URL}/tipps/${p.slug}`;
    const btn = (href: string, label: string, bg: string, fg = '#fff', border = bg) =>
        `<a href="${href}" style="display:block;text-align:center;background:${bg};color:${fg};border:1px solid ${border};text-decoration:none;padding:13px;border-radius:9px;margin-bottom:10px;font-weight:600">${label}</a>`;

    const ytLabel = p.youtubePrivacy === 'public' ? 'Video auf YouTube ansehen' : 'Video auf YouTube ansehen (noch ungelistet)';
    const buttons = [
        btn(article, 'Artikel + Podcast ansehen', '#111'),
        p.youtubeUrl ? btn(p.youtubeUrl, ytLabel, '#c4302b') : '',
        p.substackUrl ? btn(p.substackUrl, 'Substack-Beitrag ansehen', '#ff6719') : '',
    ].filter(Boolean).join('');

    const privacyNote = p.youtubeUrl && p.youtubePrivacy !== 'public'
        ? '<p style="font-size:13px;color:#666;margin:0 0 6px">Das YouTube-Video ist noch ungelistet. Schauen Sie es an, und antworten Sie mit "Video oeffentlich", dann schalte ich es oeffentlich und bette es in den Artikel ein.</p>'
        : '';

    const subject = `Hochgeladen und verlinkt: ${p.title}`;
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f8;margin:0;padding:24px;color:#1a1a1a">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;box-shadow:0 2px 14px rgba(0,0,0,.06)">
<p style="margin:0 0 4px;font-size:13px;color:#666">Red Rabbit Content-Engine, veroeffentlicht und hochgeladen</p>
<h1 style="font-size:21px;margin:0 0 8px">${p.title}</h1>
<p style="margin:0 0 18px;color:#444;line-height:1.5">Alles ist online: Artikel gepusht, Podcast eingebettet${p.substackUrl ? ', Substack-Beitrag erstellt' : ''}${p.youtubeUrl ? ', Video auf YouTube' : ''}. Hier sind die Links zum Ansehen und Pruefen.</p>
<div style="margin:0 0 22px">${buttons}</div>
${privacyNote}
<p style="font-size:12px;color:#999;margin:0">Antworten Sie auf diese Mail mit Aenderungswuenschen, ich arbeite sie ein.</p>
</div></body></html>`;
    const text = `${p.title}\n\nAlles online.\n\nArtikel + Podcast: ${article}\n${p.youtubeUrl ? `YouTube (${p.youtubePrivacy || 'unlisted'}): ${p.youtubeUrl}\n` : ''}${p.substackUrl ? `Substack: ${p.substackUrl}\n` : ''}`;
    return { subject, html, text };
}
