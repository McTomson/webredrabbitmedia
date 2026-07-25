import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 0. noindex fuer die Test-Subdomain v2.redrabbit.media (und jeden v2.*-Host).
    //    Denylist statt Allowlist: so kann die Live-Domain web.redrabbit.media
    //    niemals versehentlich deindexiert werden. Die Subdomain spiegelt den
    //    relaunch-Branch nur zum Testen/Teilen — darf nie in den Google-Index.
    const host = request.headers.get('host') || '';
    const isTestHost = host.startsWith('v2.');
    if (isTestHost) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    // 1. Canonical URL Enforcement - Remove trailing slashes
    const url = request.nextUrl;
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
        const redirect = NextResponse.redirect(new URL(url.pathname.slice(0, -1) + url.search, url));
        if (isTestHost) redirect.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return redirect;
    }

    // 1b. v2-Test-Host: den Relaunch (/relaunch-preview) als WURZEL ausliefern, damit
    //     v2.redrabbit.media/ = Relaunch-Startseite und v2.redrabbit.media/leistungen/talos
    //     = Talos-Seite, ohne /relaunch-preview in der sichtbaren URL. Interner Rewrite
    //     (kein Redirect) — nur auf v2.*, die Live-Domain web.redrabbit.media ist unberuehrt.
    //     Bereits /relaunch-preview-Pfade werden NICHT doppelt praefixiert.
    if (isTestHost && !url.pathname.startsWith('/relaunch-preview')) {
        const target = url.clone();
        target.pathname = '/relaunch-preview' + (url.pathname === '/' ? '' : url.pathname);
        const rewritten = NextResponse.rewrite(target);
        rewritten.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return rewritten;
    }

    // 2. Mobile-First Indexing Hint für Googlebot
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.toLowerCase().includes('googlebot')) {
        response.headers.set('Vary', 'User-Agent');
    }

    // 3. Cache-Control für statische Assets
    if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/images')) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
