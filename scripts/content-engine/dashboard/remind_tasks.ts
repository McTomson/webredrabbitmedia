import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import nodemailer from 'nodemailer';
import { getOnPageAudit } from '../../../lib/dashboard/onpage';
import { CLUSTER_NAMES } from '../lib/clusters';

// Weekly nudge so the user never forgets the small inputs the moat needs (Pre-Mortem #5):
//  - clusters missing a first-hand opinion  -> /interview-me <n>
//  - feed new SEO/writing sources into the NotebookLM "Methodik" notebook, then ask to distill
//  - the single biggest on-page improvement across all articles
// Pure local computation + one email via the existing SMTP env. Schedule weekly via launchd.
// Use --dry-run to print without sending.

const ROOT = process.cwd();
const CE = path.join(ROOT, 'content-engine');
const BLOG_DIR = path.join(ROOT, 'content/blog');

function opinionClustersInPool(): Set<number> {
    const out = new Set<number>();
    try {
        const md = fs.readFileSync(path.join(CE, 'opinions/pool.md'), 'utf8');
        for (const b of md.split(/\n##\s+/).slice(1)) {
            const header = b.split('\n')[0];
            const m = header.match(/Cluster\s*([0-9/, ]+)/i);
            for (const n of m ? m[1].match(/\b([1-7])\b/g) || [] : []) out.add(Number(n));
        }
    } catch {
        /* no pool yet */
    }
    return out;
}

function clustersWithArticles(): Set<number> {
    const out = new Set<number>();
    if (!fs.existsSync(BLOG_DIR)) return out;
    for (const f of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
        const c = Number((matter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8')).data as { cluster?: number }).cluster) || 0;
        if (c) out.add(c);
    }
    return out;
}

function buildTasks(): string[] {
    const tasks: string[] = [];
    const haveOpinion = opinionClustersInPool();
    const withArticles = clustersWithArticles();
    const gaps = [...withArticles].filter((c) => !haveOpinion.has(c)).sort();
    for (const c of gaps) tasks.push(`Meinung fehlt zu Cluster ${c} (${CLUSTER_NAMES[c]}) -> sag Claude "/interview-me ${c}" (2 Min).`);

    tasks.push('Neue SEO-/Schreibstil-Quellen (Artikel, YouTube, Studien) gefunden? Ins NotebookLM-Methodik-Notebook legen und Claude "Methodik destillieren" sagen.');

    const audit = getOnPageAudit();
    if (audit.issueFrequency[0]) {
        const top = audit.issueFrequency[0];
        tasks.push(`Groesste On-Page-Luecke: ${top.count} Artikel - ${top.label}. Im Dashboard-Tab "Verbesserungen".`);
    }
    return tasks;
}

async function main() {
    const dry = process.argv.includes('--dry-run');
    const tasks = buildTasks();
    const today = new Date().toISOString().slice(0, 10);

    const lines = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
    const text = `Woechentliche Anstoesse (Red Rabbit Content-Engine), Stand ${today}:\n\n${lines}\n\nDashboard: http://localhost:9000/dashboard (Icon "Red Rabbit Dashboard" am Desktop).\n`;
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
<p style="font-size:13px;color:#666;margin:0 0 4px">Red Rabbit Content-Engine, woechentliche Anstoesse</p>
<h1 style="font-size:20px;margin:0 0 14px">Was das System diese Woche von dir braucht</h1>
<ol style="font-size:14px;line-height:1.6;color:#333;padding-left:20px">${tasks.map((t) => `<li style="margin-bottom:8px">${t}</li>`).join('')}</ol>
<p style="font-size:12px;color:#999;margin:14px 0 0">Dashboard-Tab "Verbesserungen" + "Wissen &amp; Moat" zeigen die Details. Kleine Inputs, grosse Wirkung.</p>
</div>`;

    if (dry) {
        console.log(text);
        return;
    }

    const to = process.env.SMTP_TO || process.env.REVIEW_TO;
    const smtpUser = process.env.SMTP_USER;
    if (!to || !smtpUser) {
        console.log('SMTP nicht konfiguriert (SMTP_TO/SMTP_USER) - nur Anzeige:\n');
        console.log(text);
        return;
    }
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS },
    });
    await transporter.sendMail({
        from: process.env.SMTP_FROM || smtpUser,
        to,
        subject: `Red Rabbit: ${tasks.length} offene Anstoesse (woechentlich)`,
        text,
        html,
    });
    console.log(`Erinnerungs-Mail an ${to} gesendet (${tasks.length} Anstoesse).`);
}

main().catch((e) => {
    console.error('REMIND-FEHLER:', e.message);
    process.exit(1);
});
