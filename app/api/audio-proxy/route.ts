import { NextRequest, NextResponse } from 'next/server';
import { parseAllowedAudioUrl } from '@/lib/api-security';

const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10000;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const allowedUrl = parseAllowedAudioUrl(url);

    if (!allowedUrl) {
        return NextResponse.json({ error: 'Audio URL is not allowed' }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        // Fetch the audio file from the external source
        const response = await fetch(allowedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RedRabbitMedia/1.0)',
            },
            signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch audio' },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('Content-Type') || 'audio/mpeg';
        if (!contentType.toLowerCase().startsWith('audio/')) {
            return NextResponse.json({ error: 'URL does not point to audio content' }, { status: 400 });
        }

        const contentLength = Number(response.headers.get('Content-Length'));
        if (Number.isFinite(contentLength) && contentLength > MAX_AUDIO_BYTES) {
            return NextResponse.json({ error: 'Audio file is too large' }, { status: 413 });
        }

        // Get the audio data
        const audioBuffer = await response.arrayBuffer();
        if (audioBuffer.byteLength > MAX_AUDIO_BYTES) {
            return NextResponse.json({ error: 'Audio file is too large' }, { status: 413 });
        }

        // Return the audio with proper headers
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': response.headers.get('Content-Length') || String(audioBuffer.byteLength),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Accept-Ranges': 'bytes',
            },
        });
    } catch (error) {
        console.error('Audio proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy audio' },
            { status: 500 }
        );
    }
}
