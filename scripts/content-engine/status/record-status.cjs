#!/usr/bin/env node
// Best-effort writer for content-engine/status/engine-status.json.
// Called at the end of the daily run (run-daily.sh) and the media tail (run-media.ts).
// NEVER throws and always exits 0 — a status-write failure must not break production.
// The dashboard Blog tab reads this file (lib/dashboard/engineStatus.ts).
//
// Usage:
//   node record-status.cjs daily --ok 1 --slug <slug> --title "<title>"
//   node record-status.cjs media --ok 1 --slug <slug> --produced podcast,video,substack
//   node record-status.cjs daily --ok 0 --error "pipeline failed"

'use strict';
const fs = require('node:fs');
const path = require('node:path');

function arg(flag) {
    const i = process.argv.indexOf(flag);
    return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}

try {
    const kind = process.argv[2];
    if (kind !== 'daily' && kind !== 'media') {
        // unknown kind — no-op, don't fail the caller
        process.exit(0);
    }

    const ROOT = process.cwd();
    const dir = path.join(ROOT, 'content-engine/status');
    const file = path.join(dir, 'engine-status.json');

    let current = {};
    try {
        current = JSON.parse(fs.readFileSync(file, 'utf8')) || {};
    } catch {
        current = {};
    }

    const entry = { at: new Date().toISOString(), ok: arg('--ok') !== '0' };
    const slug = arg('--slug');
    const title = arg('--title');
    const produced = arg('--produced');
    const error = arg('--error');
    if (slug) entry.slug = slug;
    if (title) entry.title = title;
    if (produced) entry.produced = produced.split(',').map((s) => s.trim()).filter(Boolean);
    if (error) entry.error = error;

    current[kind] = entry;

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n');
} catch {
    // swallow — best effort only
}
process.exit(0);
