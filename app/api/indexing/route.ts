// Google Indexing API Integration
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';
import { isWebRedRabbitUrl, requireAdminToken } from '@/lib/api-security';

// Rate Limiter: 10 requests per minute per IP (higher limit for indexing if multiple URLs updated)
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
    try {
        const authError = requireAdminToken(request);
        if (authError) {
            return authError;
        }

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
        if (!isWebRedRabbitUrl(url)) {
            return NextResponse.json(
                { error: 'Invalid URL' },
                { status: 400 }
            );
        }

        if (type !== 'URL_UPDATED' && type !== 'URL_DELETED') {
            return NextResponse.json(
                { error: 'Invalid notification type' },
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
            message: `Successfully notified Google about ${url} `
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Indexing API Error:', error);

        // Fallback: Try Search Console API
        try {
            return await fallbackToSearchConsole();
        } catch {
            return NextResponse.json(
                {
                    error: 'Failed to index URL',
                    details: errorMessage
                },
                { status: 500 }
            );
        }
    }
}

// Fallback to Search Console API
async function fallbackToSearchConsole() {
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
