import { describe, it, expect } from 'vitest';
import { computeKpis, computeOverall, heatLevel, UNRANKED_RANK } from './kpi';
import type { RankCell, KeywordGrid } from './types';

const cell = (rank: number | null, i = 0): RankCell => ({ pointId: `p${i}`, row: 0, col: i, rank });

describe('heatLevel', () => {
    it('green for top 3, yellow for 4-10, red for 11+ and unranked', () => {
        expect(heatLevel(1)).toBe('green');
        expect(heatLevel(3)).toBe('green');
        expect(heatLevel(4)).toBe('yellow');
        expect(heatLevel(10)).toBe('yellow');
        expect(heatLevel(11)).toBe('red');
        expect(heatLevel(null)).toBe('red');
    });
});

describe('computeKpis', () => {
    it('empty grid is neutral', () => {
        const k = computeKpis([]);
        expect(k).toMatchObject({ points: 0, solv: 0, atrp: UNRANKED_RANK, arp: null, ranked: 0, unranked: 0 });
    });

    it('all top-3 → SoLV 1.0', () => {
        const k = computeKpis([cell(1, 0), cell(2, 1), cell(3, 2)]);
        expect(k.solv).toBe(1);
        expect(k.top3).toBe(3);
        expect(k.atrp).toBe(2);
        expect(k.arp).toBe(2);
        expect(k.unranked).toBe(0);
    });

    it('counts unranked as UNRANKED_RANK in ATRP but excludes from ARP', () => {
        // ranks: 2, 8, null(→21) over 3 points
        const k = computeKpis([cell(2, 0), cell(8, 1), cell(null, 2)]);
        expect(k.solv).toBeCloseTo(1 / 3, 5); // one point in top3
        expect(k.top10).toBe(2);
        expect(k.ranked).toBe(2);
        expect(k.unranked).toBe(1);
        expect(k.atrp).toBeCloseTo((2 + 8 + 21) / 3, 2);
        expect(k.arp).toBeCloseTo((2 + 8) / 2, 2); // unranked excluded
    });

    it('all unranked → ATRP = UNRANKED_RANK, ARP null', () => {
        const k = computeKpis([cell(null, 0), cell(null, 1)]);
        expect(k.atrp).toBe(UNRANKED_RANK);
        expect(k.arp).toBeNull();
        expect(k.solv).toBe(0);
    });
});

describe('computeOverall', () => {
    it('pools cells across keywords', () => {
        const kws: KeywordGrid[] = [
            { keyword: 'a', cells: [cell(1, 0), cell(2, 1)], kpis: computeKpis([cell(1, 0), cell(2, 1)]) },
            { keyword: 'b', cells: [cell(null, 0), cell(5, 1)], kpis: computeKpis([cell(null, 0), cell(5, 1)]) },
        ];
        const overall = computeOverall(kws);
        expect(overall.points).toBe(4);
        expect(overall.top3).toBe(2);
        expect(overall.ranked).toBe(3);
        expect(overall.unranked).toBe(1);
    });
});
