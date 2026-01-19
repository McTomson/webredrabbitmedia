// Google Indexing API Integration
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';

// Rate Limiter: 10 requests per minute per IP (higher limit for indexing if multiple URLs updated)
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
    try {
        // Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'Anonymous';
        try {
            await limiter.check(10, ip);
        } catch {
            return NextResponse.json(
                { error: 'Zu viele Anfragen. Bitte warten.' },
                { status: 429 }
            );
        }

        const { url, type = 'URL_UPDATED' } = await request.json();

        // Validate URL
        if (!url || !url.startsWith('https://web.redrabbit.media')) {
            return NextResponse.json(
                { error: 'Invalid URL' },
                { status: 400 }
            );
        }

        // Google Service Account Auth
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const indexing = google.indexing({ version: 'v3', auth });

        // Request indexing
        const response = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: type, // 'URL_UPDATED' or 'URL_DELETED'
            },
        });

        return NextResponse.json({
            success: true,
            data: response.data,
            message: `Successfully notified Google about ${url}`
        });

    } catch (error: unknown) {
        console.error('Indexing API Error:', error);

        // Fallback: Try Search Console API
        try {
            const body = await request.clone().json();
            return await fallbackToSearchConsole(body.url);
        } catch (fallbackError) {
            return NextResponse.json(
                {
                    error: 'Failed to index URL',
                    details: (error as Error).message
                },
                { status: 500 }
            );
        }
    }
}

// Fallback to Search Console API
async function fallbackToSearchConsole(url: string) {

    // Ping sitemap instead
    const sitemapUrl = 'https://web.redrabbit.media/sitemap.xml';

    await Promise.all([
        // Google
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
        // Bing
        fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
    ]);

    return NextResponse.json({
        success: true,
        fallback: true,
        message: 'Pinged sitemap to search engines',
    });
}
