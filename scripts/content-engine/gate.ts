// Quality + Risk gate. Single source of truth for "is this article good enough" and
// "does a human need to approve it". Deterministic, TDD-tested.

export interface GateInput {
    frontmatter: {
        title?: string;
        category?: string;
        sources?: Array<{ name: string; url: string }>;
        keyTakeaways?: string[];
        [k: string]: unknown;
    };
    body: string;
    flags: string[];
    hasOpinion: boolean;
}

export interface GateResult {
    pass: boolean; // false = hard fail, do not publish at all
    risk: 'low' | 'high'; // high = route to human review email; low = auto-publish
    reasons: string[]; // why it failed / why it is high risk
}

const MIN_WORDS = 500;
const HIGH_RISK_FLAGS = ['price_claim', 'legal_claim', 'low_confidence', 'opinion_invented', 'opinion_missing'];
const HIGH_RISK_CATEGORIES = ['Recht', 'Steuer', 'Sicherheit', 'Compliance'];

function wordCount(s: string): number {
    return s.split(/\s+/).filter(Boolean).length;
}

export function runGate(input: GateInput): GateResult {
    const reasons: string[] = [];
    const fm = input.frontmatter;
    const sources = fm.sources || [];

    // ── Hard quality gates (pass=false) ──
    const wc = wordCount(input.body);
    if (wc < MIN_WORDS) reasons.push(`Zu kurz: ${wc} Woerter (< ${MIN_WORDS}).`);
    if (sources.length < 1) reasons.push('Keine Quelle (Guardrail 5: mind. 1 echte Quelle).');
    const hasRealElement = sources.length >= 1 || input.hasOpinion;
    if (!hasRealElement) reasons.push('Kein echtes Element (weder Quelle noch echte Meinung).');

    const hardFail = reasons.length > 0;

    // ── Risk routing (only meaningful if not hard-failed) ──
    let risk: 'low' | 'high' = 'low';
    const riskReasons: string[] = [];
    const flagHit = input.flags.filter((f) => HIGH_RISK_FLAGS.includes(f));
    if (flagHit.length) riskReasons.push(`Flags: ${flagHit.join(', ')}`);
    if (HIGH_RISK_CATEGORIES.some((c) => (fm.category || '').includes(c))) riskReasons.push(`Sensible Kategorie: ${fm.category}`);
    if (riskReasons.length) risk = 'high';

    return {
        pass: !hardFail,
        risk,
        reasons: hardFail ? reasons : riskReasons,
    };
}
