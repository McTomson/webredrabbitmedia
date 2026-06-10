import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { ROOT, runClaude } from './lib/roles';
import { extractJsonBlock } from './lib/extract';
import { renderInfographicPng, type SketchData } from './image/sketchInfographic';

// Image system (confirmed with Thomas 2026-06): per article 1 photoreal hero + 1 hand-drawn
// sketch infographic + 3 photoreal contextual images, each tied to a section. Photos via
// Codex imagegen (0 EUR, ChatGPT Plus, NO legible text); infographic via SVG (crisp text).
// Filenames are versioned to bust Vercel's immutable image cache.

// Shared photographic art direction so hero + context images look cohesive.
export const BRAND_PHOTO_STYLE =
    'Photorealistic, authentic editorial photograph. Natural daylight, warm muted documentary color palette, ' +
    'one subtle red accent object in frame (around #E2231A). Real, relatable Austrian people and settings, ' +
    'candid and honest, NOT a posed cheesy stock smile. Shallow depth of field. ' +
    'No text, no words, no letters, no readable screen content anywhere. 16:9 wide.';

export interface ImagePlanItem {
    kind: 'infographic' | 'photo';
    afterHeading: string; // exact H2 text to insert the image after
    concept?: string; // for photo: ENGLISH scene prompt for the image generator
    alt?: string; // for photo: GERMAN descriptive alt text (SEO + a11y), NOT the English concept
    data?: SketchData; // for infographic
}
export interface ImagePlan {
    heroConcept: string;
    items: ImagePlanItem[];
}

const PLAN_SCHEMA = `{
  "heroConcept": "<englischer Satz: authentische Foto-Szene zum Kernthema, Mensch ok, KEIN Text>",
  "items": [
    { "kind":"infographic", "afterHeading":"<exakte H2-Ueberschrift aus dem Artikel>", "data": {
        "layout":"comparison", "title":"<dt. Titel>", "subtitle":"<dt.>",
        "left":{"heading":"<dt.>","sub":"<dt.>","items":["<dt.>","..."],"verdict":"<dt.>","tone":"good"},
        "right":{"heading":"<dt.>","sub":"<dt.>","items":["..."],"verdict":"<dt.>","tone":"bad"},
        "footer":"<dt. Faustregel>" } },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene zum Absatz>", "alt":"<dt. beschreibender Alt-Text: was zeigt das Bild, mit Thema-Keyword, KEIN engl. Prompt>" },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene>", "alt":"<dt. Alt-Text mit Keyword>" },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene>", "alt":"<dt. Alt-Text mit Keyword>" }
  ]
}`;

// Art-director: reads the article, returns the full image plan as JSON.
export function buildImagePlan(title: string, body: string, headings: string[]): ImagePlan {
    const prompt = [
        'Du bist Art-Director fuer einen oesterreichischen Webagentur-Blog (Marke Red Rabbit, Akzent Rot).',
        'Plane 5 Bilder fuer den Artikel: 1 Hero-Foto + 1 Sketch-Infografik + 3 Kontext-Fotos.',
        'FOTOS (Hero + 3 Kontext): authentische, photorealistische Szenen, gern mit echten Menschen, KEIN Text im Bild. Jedes Kontextfoto passt thematisch zu genau einer H2-Sektion.',
        'ALT-TEXT: jedes Kontextfoto braucht zusaetzlich "alt" = ein deutscher, beschreibender Alt-Text fuer SEO und Barrierefreiheit (was ist konkret zu sehen, mit einem Thema-Keyword), NICHT der englische Generierungs-Prompt.',
        'INFOGRAFIK: die zentrale Aussage/der Kernvergleich des Artikels als Daten. layout "comparison" (zwei Spalten) ODER "keypoints" (3-5 Kernfakten, dann statt left/right ein Feld "points":[{"big":"JA","text":"..."},{"text":"..."}]). tone good=gruen, bad=rot, neutral.',
        'Die 4 "afterHeading"-Werte muessen EXAKT vorhandene H2-Ueberschriften sein, jede nur einmal, gut ueber den Artikel verteilt.',
        '\nVerfuegbare H2-Ueberschriften:\n' + headings.map((h) => '- ' + h).join('\n'),
        '\nTITEL: ' + title,
        '\nARTIKEL:\n' + body.slice(0, 6000),
        '\nGib AUSSCHLIESSLICH einen ```json Codeblock im Schema aus:\n' + PLAN_SCHEMA,
    ].join('\n');
    const out = runClaude(prompt, { timeoutSec: 150, label: 'art-director' });
    return extractJsonBlock(out) as ImagePlan;
}

const version = () => Date.now().toString(36).slice(-5);

function blogDir(): string {
    const d = path.join(ROOT, 'public/images/blog');
    fs.mkdirSync(d, { recursive: true });
    return d;
}

// Generate a photoreal image via Codex, crop to size, strip metadata, versioned filename.
export async function generatePhoto(slug: string, tag: string, concept: string, w = 1200, h = 675): Promise<string> {
    const file = `${slug}-${tag}-${version()}.png`;
    const tmp = path.join(os.tmpdir(), `ce-${file}`);
    const prompt = `Use the imagegen skill to generate ONE image. Subject: ${concept}. Style: ${BRAND_PHOTO_STYLE} After generating, copy the final PNG to ${tmp}`;
    process.stderr.write(`  [image] Foto "${tag}" via Codex ...\n`);
    // codex auto-migrated its default model gpt-5.4 -> gpt-5.5, which reasons much longer before
    // calling image_gen (4-8 min/image). Pin gpt-5.4 (the proven-faster orchestrator; the actual
    // picture comes from the separate image model either way). reasoning.effort 'minimal' is
    // rejected for image_gen, so we keep the model default effort and a generous 600s timeout.
    execFileSync('codex', ['exec', '--sandbox', 'workspace-write', '-m', 'gpt-5.4', prompt], { encoding: 'utf8', timeout: 600 * 1000, maxBuffer: 32 * 1024 * 1024 });
    if (!fs.existsSync(tmp)) throw new Error(`Codex hat kein Bild erzeugt (${tag})`);
    await sharp(tmp).resize(w, h, { fit: 'cover', position: 'attention' }).png({ quality: 90 }).toFile(path.join(blogDir(), file));
    fs.rmSync(tmp, { force: true });
    return `/images/blog/${file}`;
}

export async function renderInfographic(slug: string, data: SketchData): Promise<string> {
    const file = `${slug}-infografik-${version()}.png`;
    await renderInfographicPng(data, path.join(blogDir(), file));
    process.stderr.write(`  [image] Sketch-Infografik gerendert\n`);
    return `/images/blog/${file}`;
}

// Backwards-compatible single concept (used by older path / fallback).
export function buildImageConcept(title: string, bodyText: string): string {
    const prompt = `Beschreibe in EINEM kurzen englischen Satz eine authentische Foto-Szene fuers Beitragsbild zum Artikel "${title}" (Mensch ok, KEIN Text im Bild). Nur den Satz.\n\n${bodyText.slice(0, 1500)}`;
    const out = runClaude(prompt, { timeoutSec: 120, label: 'art-director' });
    const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
    return (lines[lines.length - 1] || `Authentic Austrian small-business scene about ${title}`).replace(/^["']|["']$/g, '');
}

export async function generateImage(slug: string, concept: string): Promise<string> {
    return generatePhoto(slug, 'hero', concept, 1200, 630);
}
