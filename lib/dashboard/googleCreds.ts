import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Loads the dashboard OAuth client + refresh token from EITHER the local config
// files (~/.config/redrabbit-dashboard, on the owner's Mac) OR base64-encoded env
// vars (DASHBOARD_OAUTH_CLIENT / DASHBOARD_TOKEN, used on hosts without the files
// such as Vercel). File wins; env is the fallback. Returns null when neither is set,
// so every caller degrades to a friendly "not configured" state instead of crashing.

export const CFG_DIR = path.join(os.homedir(), '.config/redrabbit-dashboard');

export interface GoogleCreds {
    clientId: string;
    clientSecret: string;
    token: Record<string, unknown>;
}

function parseClient(raw: string): { clientId?: string; clientSecret?: string } {
    const c = JSON.parse(raw);
    const cc = c.installed || c.web || c;
    return { clientId: cc.client_id, clientSecret: cc.client_secret };
}

export function loadGoogleCreds(): GoogleCreds | null {
    // 1) Local files (owner's machine).
    try {
        const clientPath = path.join(CFG_DIR, 'oauth_client.json');
        const tokenPath = path.join(CFG_DIR, 'token.json');
        if (fs.existsSync(clientPath) && fs.existsSync(tokenPath)) {
            const { clientId, clientSecret } = parseClient(fs.readFileSync(clientPath, 'utf8'));
            const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
            if (clientId && clientSecret) return { clientId, clientSecret, token };
        }
    } catch {
        /* fall through to env */
    }
    // 2) Base64 env vars (Vercel / any host without the files).
    const cEnv = process.env.DASHBOARD_OAUTH_CLIENT;
    const tEnv = process.env.DASHBOARD_TOKEN;
    if (cEnv && tEnv) {
        try {
            const { clientId, clientSecret } = parseClient(Buffer.from(cEnv, 'base64').toString('utf8'));
            const token = JSON.parse(Buffer.from(tEnv, 'base64').toString('utf8'));
            if (clientId && clientSecret) return { clientId, clientSecret, token };
        } catch {
            /* ignore malformed env */
        }
    }
    return null;
}
