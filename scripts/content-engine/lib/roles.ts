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
//
// Resilience: headless claude transiently fails under parallel load, rate limits, or service
// overload (ETIMEDOUT). We retry up to MAX_ATTEMPTS with exponential backoff so a busy service
// gets time to recover instead of being hammered immediately. A blocking sleep is fine here:
// the pipeline is single-threaded and a stuck article should pause, not crash the whole run.
const MAX_ATTEMPTS = 4;

function sleepSync(ms: number): void {
    // Blocking sleep without extra deps: spin a synchronous wait via Atomics on a tiny buffer.
    const shared = new Int32Array(new SharedArrayBuffer(4));
    Atomics.wait(shared, 0, 0, ms);
}

export function runClaude(prompt: string, opts: RunOpts = {}): string {
    const args = ['-p', prompt];
    if (opts.web) args.push('--allowedTools', 'WebSearch', 'WebFetch');
    const started = Date.now();
    if (opts.label) process.stderr.write(`  [role] ${opts.label} laeuft ...\n`);
    let lastErr: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
            const isLast = attempt === MAX_ATTEMPTS;
            if (opts.label) process.stderr.write(`  [role] ${opts.label} Versuch ${attempt} fehlgeschlagen, ${isLast ? 'aufgeben' : 'neuer Versuch'}\n`);
            if (!isLast) {
                // Exponential backoff: 15s, 30s, 60s. Gives an overloaded service room to recover.
                const backoffSec = 15 * 2 ** (attempt - 1);
                if (opts.label) process.stderr.write(`  [role] ${opts.label} warte ${backoffSec}s vor naechstem Versuch ...\n`);
                sleepSync(backoffSec * 1000);
            }
        }
    }
    throw lastErr;
}
