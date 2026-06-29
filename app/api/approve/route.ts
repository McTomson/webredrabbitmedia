import { verifyToken } from '@/lib/approvalToken';
import { submitUrlToIndexNow } from '@/lib/indexnow';
import { SITE_URL } from '@/lib/config';
import { pickHook, setChosenHook } from '@/lib/chosenHook';

export const runtime = 'nodejs';

// One-tap approval endpoint for the daily review email. A signed token carries the slug
// and action. Approve flips the article's frontmatter status draft -> published via the
// GitHub Contents API (a commit), which triggers a Vercel redeploy, then pings IndexNow.
// Works from a phone, no local machine needed. Single-use: an already-published article
// ignores a second approve.

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
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'redrabbit-approve' },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
    const j = await res.json();
    return { content: Buffer.from(j.content, 'base64').toString('utf8'), sha: j.sha };
}

async function ghPut(repo: string, path: string, token: string, content: string, sha: string | undefined, message: string): Promise<void> {
    const payload: Record<string, unknown> = { message, content: Buffer.from(content, 'utf8').toString('base64'), branch: 'main' };
    if (sha) payload.sha = sha; // omit for new files (e.g. first media marker); required for updates
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'redrabbit-approve' },
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
    if (!v.valid) {
        return page('Link ungueltig', `<p>${v.expired ? 'Dieser Freigabe-Link ist abgelaufen.' : 'Dieser Link ist ungueltig.'} Bitte den Artikel neu anstossen.</p>`, false);
    }

    const slug = v.slug!;
    const previewUrl = `${SITE_URL}/tipps/${slug}`;

    if (v.action === 'reject') {
        return page('Notiz: nicht freigegeben', `<p>Alles klar, der Artikel <strong>${slug}</strong> bleibt Entwurf und geht NICHT online.</p><p>Antworten Sie einfach auf die Review-Mail mit Ihren Aenderungswuenschen, ich arbeite sie ein.</p><p><a href="${previewUrl}">Entwurf ansehen</a></p>`);
    }

    // approve
    const repo = process.env.GITHUB_REPO || 'McTomson/webredrabbitmedia';
    const ghToken = process.env.GITHUB_TOKEN;
    if (!ghToken) return page('Konfigurationsfehler', '<p>GITHUB_TOKEN fehlt am Server, Freigabe kann nicht committen.</p>', false);

    const path = `content/blog/${slug}.mdx`;
    try {
        const file = await ghGet(repo, path, ghToken);
        if (!file) return page('Nicht gefunden', `<p>Artikel <strong>${slug}</strong> existiert nicht (mehr).</p>`, false);

        if (!/^status:\s*["']?draft["']?\s*$/m.test(file.content)) {
            return page('Bereits freigegeben', `<p>Dieser Artikel ist schon veroeffentlicht. Kein zweites Mal noetig.</p><p><a href="${previewUrl}">Artikel ansehen</a></p>`);
        }

        // Austrian local date (NOT UTC). This route runs on Vercel (UTC); the media-checker on the
        // Mac compares requestedAt against `date +%F` (Europe/Vienna). Using toISOString() here gave
        // the UTC date, so any approval between 00:00-02:00 CEST stamped the PREVIOUS day -> the
        // checker never matched it -> the article silently got no media (bug 2026-06-29). en-CA
        // formats as YYYY-MM-DD.
        const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date());
        let updated = file.content
            .replace(/^status:\s*["']?draft["']?\s*$/m, 'status: "published"')
            .replace(/^updatedAt:\s*["']?[\d-]+["']?\s*$/m, `updatedAt: "${today}"`);

        // approve-with-hook: pin the chosen hook into the frontmatter so the night image step
        // renders exactly this hook onto the hero (one click = Freigabe + Hook-Wahl). Out-of-range
        // index -> no chosenHook written (image step falls back to candidate 1).
        let chosenHook: string | null = null;
        if (typeof v.hook === 'number') {
            chosenHook = pickHook(file.content, v.hook);
            if (chosenHook) updated = setChosenHook(updated, chosenHook);
        }

        const commitMsg = chosenHook
            ? `feat(blog): publish ${slug} + hook (approved via review email)`
            : `feat(blog): publish ${slug} (approved via review email)`;
        await ghPut(repo, path, ghToken, updated, file.sha, commitMsg);

        // Best-effort search-engine ping (non-blocking failure).
        let indexNote = '';
        try {
            await submitUrlToIndexNow(previewUrl);
            indexNote = '<p>Suchmaschinen wurden via IndexNow benachrichtigt.</p>';
        } catch {
            indexNote = '<p>Hinweis: IndexNow-Ping nicht moeglich (Artikel ist trotzdem freigegeben).</p>';
        }

        // Silently enqueue the media step (podcast + video + posting). No second email:
        // the approval itself is the trigger. Vercel cannot drive the Mac's browser, so the
        // only channel to the local media session is the repo: drop a request marker that the
        // media run (Claude session / scheduled task) picks up, then it sends the final mail.
        try {
            const markerPath = `content-engine/.media-requests/${slug}.json`;
            const markerData: Record<string, unknown> = { slug, requestedAt: today, status: 'requested' };
            if (chosenHook) { markerData.chosenHook = chosenHook; markerData.hookIndex = v.hook; }
            const marker = JSON.stringify(markerData, null, 2) + '\n';
            const existing = await ghGet(repo, markerPath, ghToken);
            await ghPut(repo, markerPath, ghToken, marker, existing?.sha, `chore(media): enqueue media for ${slug}`);
        } catch {
            /* best-effort; media can also be enqueued manually via /api/media-trigger */
        }

        const hookNote = chosenHook
            ? `<p>Hook fuers Titelbild gesetzt: &bdquo;${chosenHook.replace(/</g, '&lt;')}&ldquo;. Er kommt beim Bild-Schritt aufs Hero.</p>`
            : '';
        return page('Freigegeben und veroeffentlicht', `<p>Der Artikel <strong>${slug}</strong> ist jetzt online. Vercel deployt die Aenderung in ein, zwei Minuten.</p>${hookNote}${indexNote}<p><a href="${previewUrl}">Artikel ansehen</a></p>`);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return page('Fehler bei der Freigabe', `<p>${msg}</p><p>Bitte spaeter erneut versuchen oder lokal freigeben.</p>`, false);
    }
}
