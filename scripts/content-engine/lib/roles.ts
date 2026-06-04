import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Repo root. The engine is launched from the repo root (npm run engine / run-daily.sh cd's there).
export const ROOT = process.cwd();
export const CE = path.join(ROOT, 'content-engine');

export function readMemory(rel: string): string {
    return fs.readFileSync(path.join(CE, rel), 'utf8');
}

export interface RunOpts {
    web?: boolean;
    timeoutSec?: number;
    label?: string;
}

// Calls Claude Code headless (-p), exactly like launchd will. Pure text in, text out.
// Roles never touch the filesystem; the orchestrator does all I/O (no permission prompts).
export function runClaude(prompt: string, opts: RunOpts = {}): string {
    const args = ['-p', prompt];
    if (opts.web) args.push('--allowedTools', 'WebSearch', 'WebFetch');
    const started = Date.now();
    if (opts.label) process.stderr.write(`  [role] ${opts.label} laeuft ...\n`);
    // One retry: headless claude can transiently fail under parallel load / rate limits.
    let lastErr: unknown;
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const out = execFileSync('claude', args, {
                encoding: 'utf8',
                timeout: (opts.timeoutSec ?? 300) * 1000,
                maxBuffer: 32 * 1024 * 1024,
            });
            if (opts.label) process.stderr.write(`  [role] ${opts.label} fertig (${Math.round((Date.now() - started) / 1000)}s)\n`);
            return out;
        } catch (e) {
            lastErr = e;
            if (opts.label) process.stderr.write(`  [role] ${opts.label} Versuch ${attempt} fehlgeschlagen, ${attempt < 2 ? 'neuer Versuch' : 'aufgeben'}\n`);
        }
    }
    throw lastErr;
}
