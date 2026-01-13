import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Canonical URL Enforcement - Remove trailing slashes
    const url = request.nextUrl;
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
        return NextResponse.redirect(new URL(url.pathname.slice(0, -1) + url.search, url));
    }

    // 2. Mobile-First Indexing Hint für Googlebot
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.toLowerCase().includes('googlebot')) {
        response.headers.set('Vary', 'User-Agent');
    }

    // 3. Security Headers (SEO-relevant) handled in next.config.ts


    // 4. Cache-Control für statische Assets
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
