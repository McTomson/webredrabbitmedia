import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { ROOT, runClaude } from './lib/roles';

// Fixed brand art direction. Same look across every article (Task 3.1). The per-article
// SUBJECT is derived from the text by an art-director step; this style string is constant.
export const BRAND_STYLE =
    'Clean modern flat vector illustration, generous white background, professional business tone, ' +
    'Red Rabbit Media brand red accent (around #E2231A) used sparingly, subtle depth and soft shadows, ' +
    'no text, no words, no letters, no logos, balanced 16:9 wide composition.';

// Art-director: read the article, return ONE short visual subject (no text-in-image).
export function buildImageConcept(title: string, body: string): string {
    const prompt = [
        'Du bist Art-Director fuer einen oesterreichischen Webagentur-Blog (Marke Red Rabbit, Akzent Rot).',
        'Lies den Artikel und beschreibe in EINEM kurzen englischen Satz das MOTIV fuer das Beitragsbild',
        '(konkrete Bildidee/Metapher passend zum Kerninhalt, KEINE Woerter/Buchstaben im Bild, kein Logo).',
        'Gib NUR den einen Satz aus, ohne Anfuehrungszeichen, ohne Vorrede.',
        `\nTITEL: ${title}\n\nARTIKEL (Auszug):\n${body.slice(0, 2500)}`,
    ].join('\n');
    const out = runClaude(prompt, { timeoutSec: 120, label: 'art-director' });
    // take the last non-empty line as the concept
    const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
    return (lines[lines.length - 1] || `Editorial illustration about: ${title}`).replace(/^["']|["']$/g, '');
}

// Generate the image via Codex imagegen (built-in tool, runs on ChatGPT Plus, 0 EUR),
// then post-process to the 1200x630 OG format and strip metadata.
export async function generateImage(slug: string, concept: string): Promise<string> {
    const tmp = path.join(os.tmpdir(), `ce-img-${slug}-${process.pid}.png`);
    const fullPrompt =
        `Use the imagegen skill to generate ONE featured blog image. Subject: ${concept}. ` +
        `Style: ${BRAND_STYLE} After generating, copy the final PNG to ${tmp}`;

    process.stderr.write(`  [image] Codex generiert Motiv ...\n`);
    execFileSync('codex', ['exec', '--full-auto', '-c', 'sandbox_mode=workspace-write', fullPrompt], {
        encoding: 'utf8',
        timeout: 240 * 1000,
        maxBuffer: 32 * 1024 * 1024,
    });
    if (!fs.existsSync(tmp)) throw new Error('Codex hat kein Bild erzeugt (tmp fehlt)');

    const destDir = path.join(ROOT, 'public/images/blog');
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, `${slug}.png`);

    // 1200x630 cover-crop, strip EXIF/GPS (sharp drops metadata unless withMetadata()).
    await sharp(tmp).resize(1200, 630, { fit: 'cover', position: 'attention' }).png({ quality: 90 }).toFile(dest);
    fs.rmSync(tmp, { force: true });
    process.stderr.write(`  [image] -> public/images/blog/${slug}.png (1200x630)\n`);
    return `/images/blog/${slug}.png`;
}
