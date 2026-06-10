import fs from 'node:fs';
import path from 'node:path';
import { CE } from './roles';

// Fail-safe kill-switch: a single JSON flag the daily engine checks BEFORE producing.
// Written by scripts/content-engine/dashboard/check_indexation.ts when the indexation
// rate falls below the threshold. The dashboard reads the same file to show an alarm.
// To clear manually: `rm content-engine/.kill-switch.json` (or set active:false).

export const KILL_SWITCH_FILE = path.join(CE, '.kill-switch.json');

export interface KillSwitchState {
    active: boolean;
    reason?: string;
    rate?: number;
    indexed?: number;
    total?: number;
    since?: string; // ISO timestamp when it was last (de)activated
}

export function readKillSwitch(): KillSwitchState {
    try {
        return JSON.parse(fs.readFileSync(KILL_SWITCH_FILE, 'utf8')) as KillSwitchState;
    } catch {
        return { active: false };
    }
}

export function isKillSwitchActive(): boolean {
    return readKillSwitch().active === true;
}

export function writeKillSwitch(state: KillSwitchState): void {
    fs.writeFileSync(KILL_SWITCH_FILE, JSON.stringify(state, null, 2));
}
