import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { google } from 'googleapis';

// Verifies the dashboard's GSC + GA4 access end-to-end using the stored refresh token.
// Prints counts only (no secrets). Run: npx tsx scripts/content-engine/dashboard/verify_google.ts

const CFG = path.join(os.homedir(), '.config/redrabbit-dashboard');
const SITE = process.env.GSC_SITE_URL || 'https://web.redrabbit.media';
const GA4 = process.env.GA4_PROPERTY_ID || '519842891';

function authClient() {
    const c = JSON.parse(fs.readFileSync(path.join(CFG, 'oauth_client.json'), 'utf8'));
    const cc = c.installed || c.web || c;
    const tok = JSON.parse(fs.readFileSync(path.join(CFG, 'token.json'), 'utf8'));
    const o = new google.auth.OAuth2(cc.client_id, cc.client_secret);
    o.setCredentials(tok);
    return o;
}

function daysAgo(n: number, base: number): string {
    const d = new Date(base - n * 86400000);
    return d.toISOString().slice(0, 10);
}

async function main() {
    const auth = authClient();
    const now = Date.parse('2026-06-10T12:00:00Z'); // fixed base (no Date.now in scripts elsewhere; here CLI ok)

    // --- GSC: top queries last 28 days ---
    const sc = google.webmasters({ version: 'v3', auth });
    const gsc = await sc.searchanalytics.query({
        siteUrl: SITE,
        requestBody: { startDate: daysAgo(28, now), endDate: daysAgo(1, now), dimensions: ['query'], rowLimit: 5 },
    });
    const rows = gsc.data.rows || [];
    const clicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
    console.log(`GSC OK: ${rows.length} Top-Queries, Summe Klicks(28T, Top5): ${clicks}`);
    rows.slice(0, 3).forEach((r) => console.log(`  - "${r.keys?.[0]}" Klicks ${r.clicks} Impr ${r.impressions} Pos ${Math.round((r.position || 0) * 10) / 10}`));

    // --- GA4: active users last 7 days ---
    const ga = google.analyticsdata({ version: 'v1beta', auth });
    const rep = await ga.properties.runReport({
        property: `properties/${GA4}`,
        requestBody: { dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }] },
    });
    const m = rep.data.rows?.[0]?.metricValues || [];
    console.log(`GA4 OK: aktive Nutzer(7T): ${m[0]?.value ?? '0'}, Sitzungen: ${m[1]?.value ?? '0'}`);
}

main().catch((e) => {
    console.error('VERIFY-FEHLER:', e.message || e);
    process.exit(1);
});
