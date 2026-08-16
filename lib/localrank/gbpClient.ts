import { google } from 'googleapis';
import { loadGoogleCreds } from '@/lib/dashboard/googleCreds';

// Thin, fail-closed client for the (free, no-billing) Google Business Profile APIs.
// Reuses the SAME OAuth token as the GSC/GA4 dashboard (~/.config/redrabbit-dashboard),
// which — once re-consented with the business.manage scope and once Google approves
// "Basic API Access" — also authorises the Business Profile APIs.
//
// The Reviews API only exists on the legacy v4 endpoint, which the googleapis Node
// package does NOT expose as a typed client — so we mint an access token here and call
// the REST endpoints directly with fetch. Everything degrades to null/typed-error when
// the token is missing, so nothing ever throws a 500 into the dashboard.

export const GBP_HOSTS = {
    account: 'https://mybusinessaccountmanagement.googleapis.com/v1',
    info: 'https://mybusinessbusinessinformation.googleapis.com/v1',
    performance: 'https://businessprofileperformance.googleapis.com/v1',
    reviews: 'https://mybusiness.googleapis.com/v4', // legacy v4 — reviews live here only
} as const;

export type GbpResult<T> =
    | { state: 'ok'; data: T }
    | { state: 'unconfigured'; message: string }
    | { state: 'error'; message: string };

function oauthClient() {
    // Creds from local files OR base64 env vars (Vercel) — see lib/dashboard/googleCreds.ts.
    const creds = loadGoogleCreds();
    if (!creds) return null;
    const o = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
    o.setCredentials(creds.token);
    return o;
}

/** Mint a fresh access token from the stored refresh token. null → not configured. */
export async function getAccessToken(): Promise<string | null> {
    const o = oauthClient();
    if (!o) return null;
    const r = await o.getAccessToken();
    return r.token ?? null;
}

/** Redact token-like material from error text before it can reach a UI/log. */
export function safeGbpError(e: unknown): string {
    const raw = e instanceof Error ? e.message : String(e);
    if (/PERMISSION_DENIED|\b403\b|has not been used|quota/i.test(raw)) {
        return 'GBP-API noch nicht freigeschaltet (Basic API Access ausstehend) oder Scope fehlt. Siehe content-engine/local-rank/GBP-API-SETUP.md.';
    }
    if (/invalid_grant|unauthorized|\b401\b/i.test(raw)) {
        return 'OAuth-Token abgelaufen/widerrufen — npx tsx scripts/content-engine/dashboard/google_auth.ts erneut ausführen.';
    }
    return raw.replace(/(access_token|refresh_token|Bearer)\s*[:=]?\s*[A-Za-z0-9._-]+/gi, '$1 ***');
}

/** GET a GBP REST endpoint with a bearer token. Throws on non-2xx (caller maps to typed error). */
export async function gbpGet<T>(token: string, url: string): Promise<T> {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`GBP ${res.status} ${url.replace(/https?:\/\/[^/]+/, '')}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as T;
}

/** PUT (used for review replies). Throws on non-2xx. */
export async function gbpPut<T>(token: string, url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GBP PUT ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as T;
}

export interface GbpTarget {
    /** Numeric account id (for the v4 reviews path accounts/{id}/locations/{id}). */
    accountId: string;
    /** Numeric location id (bare, for performance "locations/{id}"). */
    locationId: string;
}

/**
 * Resolve which account + location to operate on. Env override wins (paste the ids once,
 * no discovery call needed); otherwise discover the first account + location via the API.
 */
export async function resolveTarget(token: string): Promise<GbpTarget> {
    const envAcc = process.env.RR_GBP_ACCOUNT_ID;
    const envLoc = process.env.RR_GBP_LOCATION_ID;
    if (envAcc && envLoc) return { accountId: envAcc, locationId: envLoc };

    const accs = await gbpGet<{ accounts?: Array<{ name?: string }> }>(token, `${GBP_HOSTS.account}/accounts`);
    const accName = accs.accounts?.[0]?.name; // "accounts/123"
    const accountId = envAcc || accName?.split('/')[1] || '';
    if (!accountId) throw new Error('Kein GBP-Account gefunden (accounts.list leer).');

    const locs = await gbpGet<{ locations?: Array<{ name?: string }> }>(
        token,
        `${GBP_HOSTS.info}/accounts/${accountId}/locations?readMask=name,title&pageSize=100`
    );
    const locName = locs.locations?.[0]?.name; // "locations/456"
    const locationId = envLoc || locName?.split('/').pop() || '';
    if (!locationId) throw new Error('Keine GBP-Location gefunden (locations.list leer).');
    return { accountId, locationId };
}
