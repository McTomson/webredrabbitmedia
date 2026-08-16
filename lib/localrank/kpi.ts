import type { RankCell, GridKpis, KeywordGrid } from './types';

// Pure KPI math for the local-rank grid. Mirrors how LocalFalcon/BrightLocal
// report a grid scan, so the numbers are comparable to industry tools:
//   SoLV  = Share of Local Voice: fraction of points in the top 3
//   ATRP  = Average Total Rank Position: mean over ALL points, unranked = UNRANKED_RANK
//   ARP   = Average Rank Position: mean over ranked points only
// No IO — feed it cells, get KPIs. Fully testable.

/** Rank assigned to a point where we were NOT found within the scan depth. */
export const UNRANKED_RANK = 21;

export type HeatLevel = 'green' | 'yellow' | 'red';

/** Heatmap bucket for a single rank: green ≤3, yellow 4–10, red 11+/unranked. */
export function heatLevel(rank: number | null): HeatLevel {
    if (rank == null) return 'red';
    if (rank <= 3) return 'green';
    if (rank <= 10) return 'yellow';
    return 'red';
}

export function computeKpis(cells: RankCell[]): GridKpis {
    const points = cells.length;
    if (points === 0) {
        return { points: 0, solv: 0, atrp: UNRANKED_RANK, arp: null, top3: 0, top10: 0, ranked: 0, unranked: 0 };
    }

    let top3 = 0;
    let top10 = 0;
    let rankedSum = 0;
    let rankedCount = 0;
    let totalSum = 0; // unranked contributes UNRANKED_RANK

    for (const cell of cells) {
        const r = cell.rank;
        if (r == null) {
            totalSum += UNRANKED_RANK;
            continue;
        }
        totalSum += r;
        rankedSum += r;
        rankedCount++;
        if (r <= 3) top3++;
        if (r <= 10) top10++;
    }

    return {
        points,
        solv: top3 / points,
        atrp: round2(totalSum / points),
        arp: rankedCount > 0 ? round2(rankedSum / rankedCount) : null,
        top3,
        top10,
        ranked: rankedCount,
        unranked: points - rankedCount,
    };
}

/** Pool every keyword's cells and compute one overall KPI set. */
export function computeOverall(keywords: KeywordGrid[]): GridKpis {
    return computeKpis(keywords.flatMap((k) => k.cells));
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}
