import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    try {
        // Fetch the audio file from the external source
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RedRabbitMedia/1.0)',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch audio' },
                { status: response.status }
            );
        }

        // Get the audio data
        const audioBuffer = await response.arrayBuffer();

        // Return the audio with proper headers
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
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
