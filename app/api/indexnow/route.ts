import { NextRequest, NextResponse } from 'next/server';
import { submitUrlToIndexNow, submitBatchToIndexNow } from '@/lib/indexnow';

/**
 * IndexNow API Route
 * 
 * POST /api/indexnow
 * 
 * Body:
 * - url: string (single URL to submit)
 * - urls: string[] (multiple URLs to submit)
 * 
 * Example:
 * curl -X POST http://localhost:3000/api/indexnow \
 *   -H "Content-Type: application/json" \
 *   -d '{"url": "https://web.redrabbit.media/branchen/aerzte"}'
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, urls } = body;

        // Validate input
        if (!url && !urls) {
            return NextResponse.json(
                { error: 'Either "url" or "urls" must be provided' },
                { status: 400 }
            );
        }

        if (url && urls) {
            return NextResponse.json(
                { error: 'Provide either "url" or "urls", not both' },
                { status: 400 }
            );
        }

        // Submit single URL
        if (url) {
            if (typeof url !== 'string' || !url.startsWith('https://')) {
                return NextResponse.json(
                    { error: 'Invalid URL format. Must be a valid HTTPS URL' },
                    { status: 400 }
                );
            }

            const results = await submitUrlToIndexNow(url);

            return NextResponse.json({
                success: true,
                url,
                results
            });
        }

        // Submit batch
        if (urls) {
            if (!Array.isArray(urls) || urls.length === 0) {
                return NextResponse.json(
                    { error: 'URLs must be a non-empty array' },
                    { status: 400 }
                );
            }

            if (urls.length > 10000) {
                return NextResponse.json(
                    { error: 'Maximum 10,000 URLs per request' },
                    { status: 400 }
                );
            }

            // Validate all URLs
            for (const u of urls) {
                if (typeof u !== 'string' || !u.startsWith('https://')) {
                    return NextResponse.json(
                        { error: `Invalid URL in batch: ${u}` },
                        { status: 400 }
                    );
                }
            }

            const results = await submitBatchToIndexNow(urls);

            return NextResponse.json({
                success: true,
                count: urls.length,
                results
            });
        }

    } catch (error) {
        console.error('IndexNow API error:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// GET endpoint to check if IndexNow is configured
export async function GET() {
    const apiKey = process.env.INDEXNOW_API_KEY;

    return NextResponse.json({
        configured: !!apiKey,
        message: apiKey
            ? 'IndexNow is configured and ready to use'
            : 'IndexNow API key not configured. Set INDEXNOW_API_KEY in .env.local'
    });
}
