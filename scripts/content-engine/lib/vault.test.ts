import { describe, it, expect } from 'vitest';
import {
    parseVault,
    searchVault,
    isStale,
    formatVaultContext,
    serializeFact,
    addDays,
    appendFacts,
    type VaultFact,
} from './vault';
import fs from 'fs';
import os from 'os';
import path from 'path';

const SAMPLE = `# Wissens-Vault

> header line ignored

## fact-1
cluster: 1
keywords: website kosten, preis, agentur
aussage: Eine Unternehmenswebsite kostet typischerweise mehrere tausend Euro.
quelle: https://example.at/kosten
quelle_name: Beispielquelle
geprueft_am: 2026-06-01
recheck_nach: 2026-12-01

## fact-2
cluster: 6
keywords: dsgvo, datenschutz
aussage: Die DSGVO gilt unmittelbar in Oesterreich.
quelle: https://eur-lex.europa.eu/x
quelle_name: EUR-Lex
geprueft_am: 2025-01-01
recheck_nach: 2025-06-01
`;

describe('parseVault', () => {
    it('parses fact blocks and drops the header', () => {
        const facts = parseVault(SAMPLE);
        expect(facts).toHaveLength(2);
        expect(facts[0].id).toBe('fact-1');
        expect(facts[0].cluster).toBe(1);
        expect(facts[0].keywords).toEqual(['website kosten', 'preis', 'agentur']);
        expect(facts[0].quelleName).toBe('Beispielquelle');
    });

    it('skips facts without statement or source', () => {
        const broken = '## bad\ncluster: 1\nkeywords: x\n';
        expect(parseVault(broken)).toHaveLength(0);
    });
});

describe('isStale', () => {
    const fact: VaultFact = parseVault(SAMPLE)[1]; // recheck_nach 2025-06-01
    it('is stale when recheck date passed', () => {
        expect(isStale(fact, '2026-06-10')).toBe(true);
    });
    it('is fresh before recheck date', () => {
        expect(isStale(fact, '2025-01-15')).toBe(false);
    });
    it('treats missing recheck date as stale', () => {
        expect(isStale({ ...fact, recheckNach: '' }, '2026-06-10')).toBe(true);
    });
});

describe('searchVault', () => {
    const facts = parseVault(SAMPLE);
    it('finds by keyword and splits fresh vs stale', () => {
        const res = searchVault(facts, 'Was kostet eine Website?', 1, '2026-06-10');
        expect(res.fresh.map((f) => f.id)).toContain('fact-1');
        // fact-2 (dsgvo) should not match a cost query
        expect(res.fresh.map((f) => f.id)).not.toContain('fact-2');
    });

    it('puts a matched-but-expired fact into stale', () => {
        const res = searchVault(facts, 'DSGVO Datenschutz Pflicht', 6, '2026-06-10');
        expect(res.stale.map((f) => f.id)).toContain('fact-2');
        expect(res.fresh.map((f) => f.id)).not.toContain('fact-2');
    });

    it('returns nothing for an unrelated query', () => {
        const res = searchVault(facts, 'Fussball Bundesliga Tabelle', 3, '2026-06-10');
        expect(res.fresh).toHaveLength(0);
        expect(res.stale).toHaveLength(0);
    });

    it('gives same-cluster facts a ranking bonus', () => {
        const res = searchVault(facts, 'website', 1, '2026-06-10', 10);
        expect(res.fresh[0]?.cluster).toBe(1);
    });
});

describe('formatVaultContext', () => {
    it('is empty when there are no hits', () => {
        expect(formatVaultContext({ fresh: [], stale: [] })).toBe('');
    });
    it('labels fresh and stale sections distinctly', () => {
        const facts = parseVault(SAMPLE);
        const ctx = formatVaultContext({ fresh: [facts[0]], stale: [facts[1]] });
        expect(ctx).toContain('BEVORZUGT');
        expect(ctx).toContain('VERALTET');
        expect(ctx).toContain(facts[0].quelle);
    });
});

describe('addDays', () => {
    it('adds days across month boundary', () => {
        expect(addDays('2026-06-10', 180)).toBe('2026-12-07');
    });
});

describe('serialize roundtrip', () => {
    it('serializeFact output re-parses identically', () => {
        const fact = parseVault(SAMPLE)[0];
        const reparsed = parseVault('# h\n\n' + serializeFact(fact))[0];
        expect(reparsed).toEqual(fact);
    });
});

describe('appendFacts', () => {
    it('writes new facts and dedupes by url+statement', () => {
        const tmp = path.join(os.tmpdir(), `vault-test-${process.pid}.md`);
        try {
            fs.rmSync(tmp, { force: true });
            const a = appendFacts(
                [{ cluster: 1, keywords: ['x'], aussage: 'Fakt A.', quelle: 'https://a.at', quelleName: 'A' }],
                '2026-06-10',
                { file: tmp }
            );
            expect(a.added).toBe(1);
            // same fact again → skipped
            const b = appendFacts(
                [
                    { cluster: 1, keywords: ['x'], aussage: 'Fakt A.', quelle: 'https://a.at', quelleName: 'A' },
                    { cluster: 2, keywords: ['y'], aussage: 'Fakt B.', quelle: 'https://b.at', quelleName: 'B' },
                ],
                '2026-06-10',
                { file: tmp }
            );
            expect(b.added).toBe(1);
            expect(b.skipped).toBe(1);
            const all = parseVault(fs.readFileSync(tmp, 'utf8'));
            expect(all).toHaveLength(2);
            expect(all[0].recheckNach).toBe('2026-12-07');
        } finally {
            fs.rmSync(tmp, { force: true });
        }
    });
});
