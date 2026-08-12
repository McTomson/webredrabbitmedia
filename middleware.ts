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
        // Test-Subdomain nie cachen -> Reviewer sieht immer die frische Fassung
        // (Edge-HIT hatte alte HTML ausgeliefert, Tomson 25.07.). Assets (_next/static)
        // sind vom Matcher ausgeschlossen und bleiben content-hash-gecacht.
        response.headers.set('Cache-Control', 'no-store, must-revalidate');
    }

    // 1. Canonical URL Enforcement - Remove trailing slashes
    const url = request.nextUrl;
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
        const redirect = NextResponse.redirect(new URL(url.pathname.slice(0, -1) + url.search, url));
        if (isTestHost) {
            redirect.headers.set('X-Robots-Tag', 'noindex, nofollow');
            redirect.headers.set('Cache-Control', 'no-store, must-revalidate');
        }
        return redirect;
    }

    // (Der fruehere v2-Host-Rewrite auf /relaunch-preview ist mit dem Go-Live
    //  entfallen: die Relaunch-Seiten liegen jetzt auf den Root-Pfaden. Ein Rewrite
    //  wuerde alles kaputt machen. v2.* bleibt Testdomain und behaelt nur die
    //  noindex/no-store-Header oben.)

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
