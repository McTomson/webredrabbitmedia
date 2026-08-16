/*
 * Reviews puller — reads Google reviews via the (free) Business Profile v4 API and
 * writes content-engine/local-rank/reviews.json, which the dashboard Local (GBP) tab
 * already consumes (velocity, response rate, unanswered list). READ-ONLY.
 *
 *   npx tsx scripts/content-engine/local-rank/reviews-pull.ts
 *
 * Fail-closed: without an OAuth token (google_auth.ts) or before "Basic API Access" is
 * granted, it prints a hint and exits 0 — it never writes fake data.
 *
 * Reviews live only on the legacy v4 endpoint, which the googleapis Node client does not
 * expose — so we mint a token and call REST directly (see gbpClient.ts).
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadDotEnvLocal } from './env';
import { getAccessToken, resolveTarget, gbpGet, safeGbpError, GBP_HOSTS } from '../../../lib/localrank/gbpClient';
import { mapReviews, type V4Review } from '../../../lib/localrank/reviewsParse';

const OUT = path.join(process.cwd(), 'content-engine/local-rank/reviews.json');

async function main() {
    loadDotEnvLocal();
    const token = await getAccessToken();
    if (!token) {
        console.log('[reviews] Kein Google-Token. Einrichtung: npx tsx scripts/content-engine/dashboard/google_auth.ts (Scope business.manage). Siehe GBP-API-SETUP.md.');
        return;
    }
    try {
        const { accountId, locationId } = await resolveTarget(token);
        const base = `${GBP_HOSTS.reviews}/accounts/${accountId}/locations/${locationId}/reviews`;

        const all: V4Review[] = [];
        let pageToken: string | undefined;
        let pages = 0;
        do {
            const url = `${base}?pageSize=50${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
            const page = await gbpGet<{ reviews?: V4Review[]; nextPageToken?: string }>(token, url);
            all.push(...(page.reviews ?? []));
            pageToken = page.nextPageToken;
            pages++;
        } while (pageToken && pages < 20); // safety cap

        const reviews = mapReviews(all);
        fs.mkdirSync(path.dirname(OUT), { recursive: true });
        fs.writeFileSync(OUT, JSON.stringify({ source: 'gbp', takenAt: new Date().toISOString(), account: accountId, location: locationId, reviews }, null, 2));
        console.log(`[reviews] ${reviews.length} Bewertungen geschrieben → ${path.relative(process.cwd(), OUT)}`);
    } catch (e) {
        console.error('[reviews] Fehler:', safeGbpError(e));
        process.exit(1);
    }
}

main();
