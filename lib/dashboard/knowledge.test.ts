import { describe, it, expect } from 'vitest';
import { parseOpinionClusters } from './knowledge';

const POOL = `# Meinungs-Pool

> header note

## op-2026-06-03-01 — Wartungsvertrag (Thema 13, Cluster 7/1)
used: false
Eine Meinung.

## op-2026-06-03-02 — Barrierefreiheit (Thema 266, Cluster 6)
used: false
Noch eine.

## op-2026-06-03-03 — ohne Cluster-Angabe
used: false
Sollte leer ergeben.
`;

describe('parseOpinionClusters', () => {
    const res = parseOpinionClusters(POOL);

    it('parses one entry per "## " block', () => {
        expect(res).toHaveLength(3);
    });

    it('extracts multiple clusters from "7/1"', () => {
        expect(res[0].sort()).toEqual([1, 7]);
    });

    it('extracts a single cluster', () => {
        expect(res[1]).toEqual([6]);
    });

    it('yields an empty list when no cluster is named', () => {
        expect(res[2]).toEqual([]);
    });

    it('ignores out-of-range numbers', () => {
        const r = parseOpinionClusters('# header\n\n## x (Cluster 9)\nused: false\nfoo');
        expect(r[0]).toEqual([]);
    });
});
