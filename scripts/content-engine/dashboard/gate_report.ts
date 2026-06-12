import { getSearchConsoleData, getVisibilityTrend, getAnalyticsData } from '../../../lib/dashboard/google';

// Read-only GATE report (Plan §14 / §4): pulls real GSC + GA4 numbers so the
// "prove one cluster before scaling" decision rests on data, not guesswork.
// Run: npx tsx scripts/content-engine/dashboard/gate_report.ts [days]

const days = Number(process.argv[2] || '90');

function pct(n: number) {
    return `${Math.round(n * 1000) / 10}%`;
}

async function main() {
    console.log(`\n=== GATE-REPORT (letzte ${days} Tage) ===\n`);

    const sc = await getSearchConsoleData(days);
    if (sc.state !== 'ok') {
        console.log(`Search Console: ${sc.state} — ${sc.message}`);
    } else {
        const d = sc.data;
        console.log(`SEARCH CONSOLE (${d.startDate}..${d.endDate})`);
        console.log(`  Klicks: ${d.totals.clicks} | Impressionen: ${d.totals.impressions} | CTR: ${pct(d.totals.ctr)} | Ø-Position: ${d.totals.position}`);
        console.log(`\n  TOP-SEITEN (Klicks):`);
        d.topPages.slice(0, 12).forEach((p) => console.log(`    ${String(p.clicks).padStart(3)} Klicks | ${p.impressions} Impr | Pos ${p.position} | ${p.key}`));
        console.log(`\n  STRIKING DISTANCE (Pos 8-20, >=5 Impr — schnellste Seite-1-Gewinne):`);
        if (d.strikingDistance.length === 0) console.log('    (keine — noch zu wenig Impressionen in dem Positionsband)');
        d.strikingDistance.forEach((q) => console.log(`    Pos ${String(q.position).padStart(5)} | ${String(q.impressions).padStart(4)} Impr | ${q.clicks} Klicks | "${q.key}"`));
    }

    const tr = await getVisibilityTrend(7);
    if (tr.state === 'ok') {
        const t = tr.data;
        console.log(`\nTREND (7T vs. Vorwoche): Klicks ${t.clicks.current} (${t.clicks.deltaPct > 0 ? '+' : ''}${t.clicks.deltaPct}%) | Impr ${t.impressions.current} (${t.impressions.deltaPct > 0 ? '+' : ''}${t.impressions.deltaPct}%)`);
    }

    const ga = await getAnalyticsData(days);
    if (ga.state !== 'ok') {
        console.log(`\nGA4: ${ga.state} — ${ga.message}`);
    } else {
        console.log(`\nGA4 (Verhalten):`);
        console.log(JSON.stringify(ga.data, null, 2).split('\n').slice(0, 40).join('\n'));
    }
    console.log('');
}

main().catch((e) => {
    console.error('GATE-REPORT-FEHLER:', e instanceof Error ? e.message : e);
    process.exit(1);
});
