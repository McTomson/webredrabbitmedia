import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ROOT } from '../lib/roles';
import {
    buildImagePlan,
    heroPhotoStyle,
    pickHeroColorIndex,
    BRAND_PHOTO_STYLE,
    type ImagePlan,
} from '../image';

// ───────────────────────────────────────────────────────────────────────────
// build-image-plan.ts — single source of truth for the Gemini-headless image
// step. Builds (or loads the cached) art-director plan for <slug> and emits the
// FULLY-ASSEMBLED Gemini prompts as JSON, so the shell driver
// (generate-images-gemini.sh) never has to re-implement the brand styles.
//
// Output (stdout, last line, prefixed GEMINI_PLAN=):
//   { slug, colorIdx, hook, images: [ { tag, out, prompt, afterHeading?, alt? } ] }
//   images[0] is always the hero (out=hero.png), then ctx1.png, ctx2.png, ...
//
// Side effects (in scripts/content-engine/.work/<slug>-staging/):
//   plan.json        — the ImagePlan (consumed afterwards by apply-images-browser.ts)
//   gemini-meta.json — { colorIdx, hook } pinned so reruns reproduce identical prompts
//
// The infographic item is intentionally NOT in `images` — it is rendered locally
// (no browser) by apply-images-browser.ts via the SVG renderer.
//
// Usage: tsx build-image-plan.ts <slug> [--hook-index N] [--hook "custom text"] [--no-hook]
// ───────────────────────────────────────────────────────────────────────────

function stripInlineBlogImages(body: string): string {
    return body
        .split('\n')
        .filter((l) => !/^!\[[^\]]*\]\(\/images\/blog\/[^)]+\)\s*$/.test(l.trim()))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
}

// Turn the rotating hero gradient style into a Gemini hero prompt that BAKES IN the
// handwritten brand hook in ONE prompt (per .agent/workflows/bilder-gemini-browser.md:
// Gemini refuses a follow-up "add text" edit, so the hook MUST be in the first prompt,
// and the Codex "No text anywhere" clause must be replaced with the single-caption exception).
function heroStyleWithHook(colorIdx: number, hook: string | null): string {
    const base = heroPhotoStyle(colorIdx);
    if (!hook) return base; // fail-safe: no candidate -> clean hero, no invented text
    // Adapt the hook ink to the gradient for contrast (runbook lesson 16.06:
    // "creme-weiss auf dunkel/tuerkis, dunkles Espresso-Braun auf gelb"). The hook sits in the
    // upper-LEFT, so the LEFT gradient colour decides. Derive luminance from the actual hex in the
    // generated style string instead of hard-coding the palette index (survives palette reordering).
    const leftHex = base.match(/\(about (#[0-9a-fA-F]{6})\) on the left/)?.[1] || '#19B5AE';
    const r = parseInt(leftHex.slice(1, 3), 16);
    const g = parseInt(leftHex.slice(3, 5), 16);
    const b = parseInt(leftHex.slice(5, 7), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // perceived brightness 0..1
    const ink = lum > 0.6 ? 'dark espresso-brown' : 'cream-white';
    return base.replace(
        /No text, no words, no letters, no logos, no readable screen content anywhere\./,
        `No logos and no other text anywhere, EXCEPT exactly ONE handwritten caption placed in the calm upper-left area of the gradient (NOT over the face or subject): large, casual, ${ink} lowercase handwritten script with strong contrast against the background, clearly legible in 1-2 seconds, reading exactly: "${hook}".`,
    );
}

function main() {
    const args = process.argv.slice(2);
    const slug = args.find((a) => !a.startsWith('--'));
    if (!slug) throw new Error('Slug angeben: tsx build-image-plan.ts <slug> [--hook-index N] [--hook "..."] [--no-hook]');

    const hookIndexArg = args.includes('--hook-index') ? Number(args[args.indexOf('--hook-index') + 1]) : 0;
    const hookOverride = args.includes('--hook') ? args[args.indexOf('--hook') + 1] : null;
    const noHook = args.includes('--no-hook');

    const file = path.join(ROOT, 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(file)) throw new Error(`Artikel nicht gefunden: ${file}`);

    const parsed = matter(fs.readFileSync(file, 'utf8'));
    const fm = parsed.data as { title?: string; hookCandidates?: string[]; chosenHook?: string };
    const body = stripInlineBlogImages(parsed.content);
    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());

    const stage = path.join(ROOT, 'scripts/content-engine/.work', `${slug}-staging`);
    fs.mkdirSync(stage, { recursive: true });
    const planFile = path.join(stage, 'plan.json');
    const metaFile = path.join(stage, 'gemini-meta.json');

    // Plan: reuse the cached plan.json so this step and apply-images-browser.ts agree on
    // the SAME concepts/headings (otherwise the non-deterministic plan would mismatch the
    // staged photos). Only call the art-director (LLM) the first time.
    let plan: ImagePlan;
    if (fs.existsSync(planFile)) {
        plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
        process.stderr.write('  [plan] aus Cache geladen\n');
    } else {
        process.stderr.write('  [plan] Art-Director laeuft (claude -p) ...\n');
        plan = buildImagePlan(fm.title || slug, body, headings);
        fs.writeFileSync(planFile, JSON.stringify(plan, null, 2));
        process.stderr.write('  [plan] gebaut + gecacht\n');
    }

    // Pin colorIdx + hook once (idempotent reruns reproduce identical prompts).
    let colorIdx: number;
    let hook: string | null;
    if (fs.existsSync(metaFile)) {
        const m = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
        colorIdx = m.colorIdx;
        hook = m.hook ?? null;
    } else {
        colorIdx = pickHeroColorIndex();
        const candidates = Array.isArray(fm.hookCandidates) ? fm.hookCandidates : [];
        // Priority: explicit CLI override > the hook Thomas chose via the review email
        // (frontmatter.chosenHook, written by /api/approve) > a CLI index > candidate 1 > none.
        if (noHook) hook = null;
        else if (hookOverride) hook = hookOverride.trim();
        else if (fm.chosenHook?.trim()) hook = fm.chosenHook.trim();
        else if (args.includes('--hook-index')) hook = candidates[hookIndexArg]?.trim() || null;
        else hook = candidates[0]?.trim() || null;
        fs.writeFileSync(metaFile, JSON.stringify({ colorIdx, hook }, null, 2));
    }

    const images: Array<{ tag: string; out: string; prompt: string; afterHeading?: string; alt?: string }> = [];
    images.push({
        tag: 'hero',
        out: 'hero.png',
        prompt: `${plan.heroConcept}. ${heroStyleWithHook(colorIdx, hook)}`,
    });

    let ctx = 0;
    for (const item of plan.items) {
        if (item.kind !== 'photo' || !item.concept) continue;
        ctx++;
        images.push({
            tag: `ctx${ctx}`,
            out: `ctx${ctx}.png`,
            prompt: `${item.concept}. ${BRAND_PHOTO_STYLE}`,
            afterHeading: item.afterHeading,
            alt: item.alt,
        });
    }

    const result = { slug, colorIdx, hook, images };
    // Human-readable to stderr, machine-readable to stdout.
    process.stderr.write(`  [plan] Hero-Verlauf Variante ${colorIdx}, Hook: ${hook ? `"${hook}"` : '(keiner)'}, ${ctx} Kontextfotos\n`);
    process.stdout.write('GEMINI_PLAN=' + JSON.stringify(result) + '\n');
}

main();
