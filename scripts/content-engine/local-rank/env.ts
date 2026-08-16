import fs from 'node:fs';
import path from 'node:path';

// Self-contained .env.local loader so the local-rank CLIs work outside Next.js.
// Does not override variables already present in the environment.
export function loadDotEnvLocal(): void {
    const file = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const key = m[1];
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        if (process.env[key] === undefined) process.env[key] = val;
    }
}
