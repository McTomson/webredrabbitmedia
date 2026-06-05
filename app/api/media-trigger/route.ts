import { verifyToken } from '@/lib/approvalToken';
import { SITE_URL } from '@/lib/config';

export const runtime = 'nodejs';

// Mail-2 endpoint of the 3-mail flow. A signed media-token (from the "Podcast und Video
// jetzt erzeugen" button) lands here. Vercel cannot drive the Mac's browser, so the only
// channel to the local media session is the git repo: this records a media request as a
// marker file (content-engine/.media-requests/<slug>.json) via the GitHub Contents API.
// The local media run (Claude session / scheduled task) picks the marker up, produces the
// podcast + video, posts everything, then clears the marker and sends Mail 3.
// Phone-friendly: it is just a link tap.

function page(title: string, body: string, ok = true): Response {
    const color = ok ? '#1a7f37' : '#b42318';
    const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f7f8;margin:0;padding:40px 20px;color:#1a1a1a}
.card{max-width:520px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;box-shadow:0 2px 14px rgba(0,0,0,.07)}
h1{font-size:20px;margin:0 0 12px;color:${color}}p{line-height:1.55;margin:8px 0}a{color:#E2231A}</style></head>
<body><div class="card"><h1>${title}</h1>${body}</div></body></html>`;
    return new Response(html, { status: ok ? 200 : 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

interface GhFile {
    content: string;
    sha: string;
}

async function ghGet(repo: string, path: string, token: string): Promise<GhFile | null> {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=main`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'redrabbit-media-trigger' },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
    const j = await res.json();
    return { content: Buffer.from(j.content, 'base64').toString('utf8'), sha: j.sha };
}

async function ghPut(repo: string, path: string, token: string, content: string, sha: string | undefined, message: string): Promise<void> {
    const payload: Record<string, unknown> = { message, content: Buffer.from(content, 'utf8').toString('base64'), branch: 'main' };
    if (sha) payload.sha = sha;
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'redrabbit-media-trigger' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`GitHub PUT ${res.status}: ${await res.text()}`);
}

export async function GET(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || '';
    const secret = process.env.APPROVAL_SECRET;
    if (!secret) return page('Konfigurationsfehler', '<p>APPROVAL_SECRET fehlt am Server.</p>', false);

    const v = verifyToken(token, secret);
    if (!v.valid || v.action !== 'media') {
        return page('Link ungueltig', `<p>${v.expired ? 'Dieser Link ist abgelaufen.' : 'Dieser Link ist ungueltig.'}</p>`, false);
    }

    const slug = v.slug!;
    const article = `${SITE_URL}/tipps/${slug}`;
    const repo = process.env.GITHUB_REPO || 'McTomson/webredrabbitmedia';
    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) return page('Konfigurationsfehler', '<p>GITHUB_TOKEN fehlt am Server.</p>', false);

    const markerPath = `content-engine/.media-requests/${slug}.json`;
    const marker = JSON.stringify({ slug, requestedAt: new Date().toISOString(), status: 'requested' }, null, 2) + '\n';

    try {
        const existing = await ghGet(repo, markerPath, ghToken);
        await ghPut(repo, markerPath, ghToken, marker, existing?.sha, `chore(media): request media for ${slug}`);
        return page(
            'Medien angestossen',
            `<p>Alles klar. Podcast und Video fuer <strong>${slug}</strong> sind in der Warteschlange und werden erzeugt und hochgeladen.</p><p>Sie bekommen die letzte Mail mit allen Links, sobald alles online ist. Mehr ist nicht zu tun.</p><p><a href="${article}">Artikel ansehen</a></p>`,
        );
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return page('Fehler', `<p>${msg}</p>`, false);
    }
}
