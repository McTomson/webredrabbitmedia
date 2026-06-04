import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROOT } from './lib/roles';
import { buildImagePlan, generatePhoto, renderInfographic } from './image';

// ──────────────────────────────────────────────────────────────────────────
// Apply ONLY the multi-image stage of the pipeline to an EXISTING article,
// without re-writing the approved text. Strips current inline blog images,
// runs the art-director plan (1 infographic + 3 context photos), and inserts
// them after their headings. featuredImage (hero) is preserved unless --hero.
// Usage: tsx scripts/content-engine/images-only.ts <slug> [--hero]
// ──────────────────────────────────────────────────────────────────────────

function insertImageAfterHeading(mdx: string, heading: string, imgPath: string, alt: string): string {
    const lines = mdx.split('\n');
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const target = norm(heading);
    for (let i = 0; i < lines.length; i++) {
        if (/^##\s+/.test(lines[i]) && norm(lines[i].replace(/^##\s+/, '')) === target) {
            const img = `\n![${alt.replace(/[[\]]/g, '')}](${imgPath})\n`;
            const at = i + 1 < lines.length && lines[i + 1].trim() === '' ? i + 2 : i + 1;
            lines.splice(at, 0, img);
            return lines.join('\n');
        }
    }
    process.stderr.write(`  WARN Heading nicht gefunden, Bild uebersprungen: "${heading}"\n`);
    return mdx;
}

// Remove all inline markdown images pointing at /images/blog/ (keeps featuredImage in frontmatter).
function stripInlineBlogImages(body: string): string {
    return body
        .split('\n')
        .filter((l) => !/^!\[[^\]]*\]\(\/images\/blog\/[^)]+\)\s*$/.test(l.trim()))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
}

async function main() {
    const args = process.argv.slice(2);
    const slug = args.find((a) => !a.startsWith('--'));
    const regenHero = args.includes('--hero');
    if (!slug) throw new Error('Slug angeben: tsx scripts/content-engine/images-only.ts <slug> [--hero]');

    const file = path.join(ROOT, 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Artikel nicht gefunden: ${file}`);

    const raw = fs.readFileSync(file, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as any;
    const cleanBody = stripInlineBlogImages(parsed.content);
    const headings = [...cleanBody.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
    console.log(`\n=== Images-only: ${slug} ===`);
    console.log(`   H2-Abschnitte: ${headings.length}`);

    console.log('1/3 Art-Director plant Bilder ...');
    const plan = buildImagePlan(fm.title, cleanBody, headings);

    let body = cleanBody;

    // Optional fresh hero (otherwise keep approved featuredImage).
    if (regenHero) {
        console.log('2/3 Hero-Foto via Codex ...');
        const heroPath = await generatePhoto(slug, 'hero', plan.heroConcept, 1200, 630);
        fm.featuredImage = heroPath;
    } else {
        console.log('2/3 Hero uebersprungen (approved featuredImage bleibt)');
    }

    console.log(`3/3 ${plan.items.length} Inline-Bilder (Infografik + Kontextfotos) ...`);
    let nCtx = 0;
    for (const item of plan.items) {
        let imgPath: string;
        let alt: string;
        if (item.kind === 'infographic' && item.data) {
            imgPath = await renderInfographic(slug, item.data);
            alt = item.data.title;
        } else if (item.kind === 'photo' && item.concept) {
            imgPath = await generatePhoto(slug, `ctx${++nCtx}`, item.concept);
            alt = item.concept;
        } else continue;
        body = insertImageAfterHeading(body, item.afterHeading, imgPath, alt);
    }

    const out = matter.stringify(body, fm);
    fs.writeFileSync(file, out);
    console.log(`\nOK. ${slug}: Hero ${regenHero ? '(neu)' : '(behalten)'} + Infografik + ${nCtx} Kontextfotos -> ${file}`);
}

main().catch((e) => {
    console.error('\nIMAGES-ONLY-FEHLER:', e.message);
    process.exit(1);
});
