import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Private dashboard access control ────────────────────────────────────────
// The dashboard is served ONLY on the dashboard.* subdomain, behind HTTP Basic
// Auth, and is never indexed. The password lives in an env var (DASHBOARD_PASSWORD),
// never in code/git. Auth is only enforced when that var is set, so local dev
// (localhost, no password) keeps working exactly as before.

const DASHBOARD_REALM = 'Red Rabbit Dashboard';

function isDashboardHost(host: string): boolean {
    return host === 'dashboard.redrabbit.media' || host.startsWith('dashboard.');
}

function wantsDashboard(host: string, pathname: string): boolean {
    return isDashboardHost(host) || pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

function unauthorized(): NextResponse {
    return new NextResponse('Zugriff nur mit Passwort.', {
        status: 401,
        headers: {
            'WWW-Authenticate': `Basic realm="${DASHBOARD_REALM}", charset="UTF-8"`,
            'X-Robots-Tag': 'noindex, nofollow',
            'Cache-Control': 'no-store',
        },
    });
}

// Constant-time-ish string compare (avoids trivial timing oracle on the password).
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function checkBasicAuth(request: NextRequest): boolean {
    const password = process.env.DASHBOARD_PASSWORD;
    if (!password) return true; // no password configured (local dev) → allow
    const header = request.headers.get('authorization') || '';
    if (!header.startsWith('Basic ')) return false;
    let decoded = '';
    try {
        decoded = atob(header.slice(6));
    } catch {
        return false;
    }
    const idx = decoded.indexOf(':');
    if (idx < 0) return false;
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    const expectedUser = process.env.DASHBOARD_USER || 'redrabbit';
    return safeEqual(user, expectedUser) && safeEqual(pass, password);
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const reqHost = request.headers.get('host') || '';
    const path = request.nextUrl.pathname;

    // ── Dashboard: password gate + subdomain isolation + noindex ──────────────
    if (wantsDashboard(reqHost, path)) {
        // Keep the dashboard OFF the public production hosts (env vars are project-wide,
        // so DASHBOARD_ENABLED alone would expose /dashboard on web.redrabbit.media too).
        if (!isDashboardHost(reqHost) && process.env.NODE_ENV === 'production') {
            return new NextResponse('Not found', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
        }
        // Password.
        if (!checkBasicAuth(request)) return unauthorized();
        // On the dashboard subdomain the root shows the dashboard directly.
        if (isDashboardHost(reqHost) && path === '/') {
            const rw = NextResponse.rewrite(new URL('/dashboard', request.nextUrl));
            rw.headers.set('X-Robots-Tag', 'noindex, nofollow');
            return rw;
        }
        // Authenticated dashboard request → never index it.
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Cache-Control', 'no-store');
    }

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
