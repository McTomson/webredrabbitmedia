import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROOT } from '../lib/roles';
import { buildImagePlan, renderInfographic, type ImagePlanItem } from '../image';

// Version suffix for cache-busting (Vercel caches /public immutable). Matches image.ts version().
const version = () => Date.now().toString(36).slice(-5);

// ───────────────────────────────────────────────────────────────────────────
// Apply the multi-image stage to an EXISTING article using BROWSER-produced
// hero/context photos (Gemini), instead of the dead Codex generatePhoto path.
//
// Inputs (staged by the browser step under scripts/content-engine/.work/<slug>-staging/):
//   hero.png   -> public/images/blog/<slug>.png        (NO version suffix; run-media/videoPoster need it)
//   ctx1.png   -> public/images/blog/<slug>-ctx1-<v>.png  (after the 1st planned photo heading)
//   ctx2.png   -> ...-ctx2-<v>.png
//   ctx3.png   -> ...-ctx3-<v>.png
// The infographic is rendered locally (sketchInfographic SVG, no browser).
//
// Idempotent: strips all old inline /images/blog/ images and re-inserts from the plan.
// Missing staged files are skipped (so it can run partially as images are produced).
//
// Usage: tsx apply-images-browser.ts <slug>
// ───────────────────────────────────────────────────────────────────────────

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

function stripInlineBlogImages(body: string): string {
    return body
        .split('\n')
        .filter((l) => !/^!\[[^\]]*\]\(\/images\/blog\/[^)]+\)\s*$/.test(l.trim()))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
}

async function main() {
    const slug = process.argv[2];
    if (!slug) throw new Error('Slug angeben: tsx apply-images-browser.ts <slug>');

    const file = path.join(ROOT, 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Artikel nicht gefunden: ${file}`);
    const stage = path.join(ROOT, 'scripts/content-engine/.work', `${slug}-staging`);
    const blogDir = path.join(ROOT, 'public/images/blog');
    fs.mkdirSync(blogDir, { recursive: true });

    const parsed = matter(fs.readFileSync(file, 'utf8'));
    const fm = parsed.data as any;
    let body = stripInlineBlogImages(parsed.content);
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
    console.log(`\n=== apply-images-browser: ${slug} (${headings.length} H2) ===`);

    // Cache the art-director plan so repeated runs (infographic now, photos after staging) use the
    // SAME concepts/headings — otherwise the non-deterministic plan would mismatch staged photos.
    const planFile = path.join(stage, 'plan.json');
    fs.mkdirSync(stage, { recursive: true });
    let plan: ReturnType<typeof buildImagePlan>;
    if (fs.existsSync(planFile)) {
        plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
        console.log('Plan aus Cache geladen.');
    } else {
        plan = buildImagePlan(fm.title, body, headings);
        fs.writeFileSync(planFile, JSON.stringify(plan, null, 2));
        console.log('Plan gebaut + gecacht.');
    }

    // Hero: staged hero.png -> <slug>.png (fixed name), set featuredImage.
    const stagedHero = path.join(stage, 'hero.png');
    if (fs.existsSync(stagedHero)) {
        const dest = path.join(blogDir, `${slug}.png`);
        fs.copyFileSync(stagedHero, dest);
        fm.featuredImage = `/images/blog/${slug}.png`;
        console.log(`hero -> ${fm.featuredImage}`);
    } else {
        console.log(`hero uebersprungen (kein ${stagedHero})`);
    }

    // Infographic (scriptable) + context photos (staged), inserted after their H2s in plan order.
    const resolved = new Map<ImagePlanItem, { imgPath: string; alt: string }>();
    let ctxIdx = 0;
    for (const item of plan.items) {
        if (item.kind === 'infographic' && item.data) {
            const imgPath = await renderInfographic(slug, item.data);
            resolved.set(item, { imgPath, alt: item.data.title });
        } else if (item.kind === 'photo') {
            ctxIdx++;
            const staged = path.join(stage, `ctx${ctxIdx}.png`);
            const alt = item.alt?.trim() || item.afterHeading?.trim() || item.concept || 'Illustration zum Abschnitt';
            if (fs.existsSync(staged)) {
                const v = version();
                const destRel = `/images/blog/${slug}-ctx${ctxIdx}-${v}.png`;
                fs.copyFileSync(staged, path.join(ROOT, 'public', destRel));
                resolved.set(item, { imgPath: destRel, alt });
                console.log(`ctx${ctxIdx} -> ${destRel}`);
            } else {
                console.log(`ctx${ctxIdx} uebersprungen (kein ${staged})`);
            }
        }
    }

    for (const item of plan.items) {
        const r = resolved.get(item);
        if (r) body = insertImageAfterHeading(body, item.afterHeading, r.imgPath, r.alt);
    }

    fs.writeFileSync(file, matter.stringify(body, fm));
    console.log('MDX geschrieben.');
    // Print the plan's photo concepts so the browser step knows what to generate.
    const out = { slug, heroConcept: plan.heroConcept, photos: plan.items.filter((i) => i.kind === 'photo').map((p, i) => ({ ctx: i + 1, afterHeading: p.afterHeading, concept: p.concept })) };
    console.log('PLAN_JSON=' + JSON.stringify(out));
}

main().catch((e) => {
    process.stderr.write(String(e?.stack || e) + '\n');
    process.exit(1);
});
