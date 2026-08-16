import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { google } from 'googleapis';

// One-time OAuth login for the dashboard: read-only Search Console + GA4, PLUS the
// Google Business Profile APIs (Performance + Reviews) via the business.manage scope.
// One login covers all three. Mirrors the proven YouTube auth pattern (OAuth loopback
// + persistent refresh token). Personal Gmail accounts cannot add service accounts as
// GSC users, so we use the OWNER account (thomas.uhlir) via OAuth instead.
//
// Prerequisite (in Google Cloud Console, project claude-email-manager-484501):
//   - OAuth 2.0 Client ID of type "Desktop app", client_secret JSON downloaded to:
//       ~/.config/redrabbit-dashboard/oauth_client.json
//   - APIs enabled: "Google Search Console API" + "Google Analytics Data API" +
//     the Business Profile family (mybusinessaccountmanagement, mybusinessbusinessinformation,
//     businessprofileperformance, and the legacy "Google My Business API" for reviews).
//     The Business Profile APIs are FREE (no billing/card) — see content-engine/local-rank/GBP-API-SETUP.md.
//   - OAuth consent screen exists; thomas.uhlir@gmail.com is a test user (Testing mode is fine).
//   - business.manage is a sensitive scope but stays unverified for an internal single-owner tool.
//
// Run once (re-run to add the new GBP scope):
//   npx tsx scripts/content-engine/dashboard/google_auth.ts
// Saves the refresh token to ~/.config/redrabbit-dashboard/token.json (never commit).
// NOTE: GBP calls only start working once Google approves "Basic API Access" for the project.

const CFG_DIR = path.join(os.homedir(), '.config/redrabbit-dashboard');
const CLIENT_FILE = path.join(CFG_DIR, 'oauth_client.json');
const TOKEN_FILE = path.join(CFG_DIR, 'token.json');
const PORT = Number(process.env.RR_OAUTH_PORT || 8766);
const SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/business.manage',
];

function loadClient(): { client_id: string; client_secret: string } {
    if (!fs.existsSync(CLIENT_FILE)) {
        throw new Error(`OAuth-Client fehlt: ${CLIENT_FILE}\nLade in der Cloud Console einen "Desktop app" OAuth-Client herunter und speichere ihn dort.`);
    }
    const j = JSON.parse(fs.readFileSync(CLIENT_FILE, 'utf8'));
    const c = j.installed || j.web || j;
    if (!c.client_id || !c.client_secret) throw new Error('oauth_client.json enthaelt keine client_id/client_secret.');
    return { client_id: c.client_id, client_secret: c.client_secret };
}

async function main() {
    fs.mkdirSync(CFG_DIR, { recursive: true });
    const { client_id, client_secret } = loadClient();
    const redirectUri = `http://localhost:${PORT}`;
    const oauth2 = new google.auth.OAuth2(client_id, client_secret, redirectUri);

    const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES });

    const code: string = await new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url || '', redirectUri);
            const c = url.searchParams.get('code');
            const err = url.searchParams.get('error');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<p>Fertig. Du kannst dieses Fenster schliessen und zum Terminal zurueck.</p>');
            server.close();
            if (err) return reject(new Error(`OAuth-Fehler: ${err}`));
            if (c) return resolve(c);
            reject(new Error('Kein Code erhalten.'));
        });
        server.listen(PORT, () => {
            process.stdout.write(`\nAUTHURL: ${authUrl}\n`);
            if (!process.env.RR_NO_OPEN) {
                try { execFileSync('open', [authUrl]); } catch { /* user opens manually */ }
            }
        });
    });

    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
        throw new Error('Kein refresh_token erhalten. In der Cloud Console den Zugriff der App entfernen und erneut ausfuehren (prompt=consent).');
    }
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    process.stdout.write(`\nOK. Refresh-Token gespeichert: ${TOKEN_FILE}\nGSC + GA4 Lesezugriff steht.\n`);
}

main().catch((e) => {
    process.stderr.write(`\nAUTH-FEHLER: ${e.message}\n`);
    process.exit(1);
});
