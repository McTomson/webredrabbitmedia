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

// Pin the claude binary. run-daily.sh sets CLAUDE_BIN to the guard-verified, working binary
// (the brew-managed native install is "autoUpdatesProtectedForNative" and survived the 17.06
// breakage). Falls back to PATH resolution ('claude') for interactive/dev runs. This keeps the
// daily pipeline on a known-good binary instead of whatever a silent auto-update left on PATH.
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';

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
            const out = execFileSync(CLAUDE_BIN, args, {
                encoding: 'utf8',
                timeout: (opts.timeoutSec ?? 300) * 1000,
                // ENFORCE the timeout hard. Default killSignal is SIGTERM, which the headless
                // `claude` CLI ignores / handles too slowly (observed: a call ran ~7140s despite a
                // 600s timeout, blowing a daily run to ~2h and pushing the review mail to evening).
                // SIGKILL cannot be trapped, so a hung call dies at timeoutSec and the retry/backoff
                // below takes over, instead of the whole run stalling for hours.
                killSignal: 'SIGKILL',
                maxBuffer: 32 * 1024 * 1024,
            });
            if (opts.label) process.stderr.write(`  [role] ${opts.label} fertig (${Math.round((Date.now() - started) / 1000)}s)\n`);
            return out;
        } catch (e) {
            lastErr = e;
            const isLast = attempt === MAX_ATTEMPTS;
            // Surface WHY claude failed. execFileSync swallows the real cause in error.message
            // ("Command failed: claude -p <entire huge prompt>") while the actual reason sits in
            // error.stderr / .status / .signal. Without this, a failed generation only ever logged
            // the generic "Pipeline hat gehalten" + ops-mail with no actionable cause (blindspot
            // 16.06). SIGKILL signal => our hard timeout fired (hang); a non-zero status + stderr
            // => rate limit / overload / auth; E2BIG => prompt too large for argv.
            const err = e as { status?: number; signal?: string; stderr?: Buffer | string; code?: string };
            const stderrStr = (err.stderr ? err.stderr.toString() : '').trim();
            const reason = [
                err.code ? `code=${err.code}` : '',
                err.signal ? `signal=${err.signal}` : '',
                err.status != null ? `status=${err.status}` : '',
                stderrStr ? `stderr=${stderrStr.slice(-500)}` : '',
            ].filter(Boolean).join(' ') || 'kein Detail (stderr leer)';
            if (opts.label) process.stderr.write(`  [role] ${opts.label} Versuch ${attempt} fehlgeschlagen (${reason}), ${isLast ? 'aufgeben' : 'neuer Versuch'}\n`);
            if (!isLast) {
                // Exponential backoff: 15s, 30s, 60s. Gives an overloaded service room to recover.
                const backoffSec = 15 * 2 ** (attempt - 1);
                if (opts.label) process.stderr.write(`  [role] ${opts.label} warte ${backoffSec}s vor naechstem Versuch ...\n`);
                sleepSync(backoffSec * 1000);
            } else {
                // Re-throw with the real cause baked into the message so the orchestrator's
                // catch (which logs only error.message) records something diagnosable.
                throw new Error(`claude (${opts.label ?? 'role'}) failed nach ${MAX_ATTEMPTS} Versuchen: ${reason}`);
            }
        }
    }
    throw lastErr;
}
