import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_ENV_KEYS = ['ADMIN_API_TOKEN', 'INDEXING_API_TOKEN'];
const SITE_HOST = 'web.redrabbit.media';
const ALLOWED_AUDIO_HOSTS = new Set([
    'api.substack.com',
    'web.redrabbit.media',
    'redrabbit.media',
]);

export function requireAdminToken(request: NextRequest): NextResponse | null {
    const configuredToken = ADMIN_TOKEN_ENV_KEYS
        .map((key) => process.env[key])
        .find((value): value is string => Boolean(value));

    if (!configuredToken) {
        return NextResponse.json(
            { error: 'Admin API token is not configured' },
            { status: 503 }
        );
    }

    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : null;
    const apiKey = request.headers.get('x-api-key');

    if (bearerToken !== configuredToken && apiKey !== configuredToken) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    return null;
}

export function isWebRedRabbitUrl(value: unknown): value is string {
    if (typeof value !== 'string') {
        return false;
    }

    try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:' && parsed.hostname === SITE_HOST;
    } catch {
        return false;
    }
}

export function parseAllowedAudioUrl(value: string | null): URL | null {
    if (!value) {
        return null;
    }

    try {
        const parsed = new URL(value);
        if (parsed.protocol !== 'https:') {
            return null;
        }
        if (!ALLOWED_AUDIO_HOSTS.has(parsed.hostname)) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}
