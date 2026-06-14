import { describe, it, expect } from 'vitest';
import sharp from 'sharp';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { buildVideoPoster, posterOverlaySvg } from './videoPoster';

// Synthesize a fake "hero" so the test has no external asset dependency.
async function makeHero(p: string, w = 1200, h = 670) {
    await sharp({
        create: { width: w, height: h, channels: 3, background: { r: 25, g: 181, b: 174 } },
    })
        .png()
        .toFile(p);
}

describe('posterOverlaySvg', () => {
    it('is valid sharp-renderable SVG with a play badge and scrim', () => {
        const svg = posterOverlaySvg(1280, 720);
        expect(svg).toContain('<svg');
        expect(svg).toContain('url(#scrim)');
        expect(svg).toContain('#FF0000'); // play badge
        expect(svg).toContain('<path'); // triangle
    });
});

describe('buildVideoPoster', () => {
    it('produces a 1280x720 JPEG with the play badge composited centre', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'poster-'));
        const hero = path.join(dir, 'hero.png');
        const out = path.join(dir, 'poster.jpg');
        await makeHero(hero);

        await buildVideoPoster(hero, out);

        expect(fs.existsSync(out)).toBe(true);
        const meta = await sharp(out).metadata();
        expect(meta.format).toBe('jpeg');
        expect(meta.width).toBe(1280);
        expect(meta.height).toBe(720);

        // The play badge must actually be composited (this is exactly what was broken about the
        // NotebookLM frame). Centre = white play triangle; just left of it = red badge.
        const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
        const cx = Math.floor(info.width / 2);
        const cy = Math.floor(info.height / 2);
        const px = (x: number, y: number) => {
            const i = (y * info.width + x) * info.channels;
            return [data[i], data[i + 1], data[i + 2]];
        };
        const [cr, cg, cb] = px(cx, cy); // triangle tip region -> white
        expect(cr).toBeGreaterThan(200);
        expect(cg).toBeGreaterThan(200);
        expect(cb).toBeGreaterThan(200);
        const [rr, rg, rb] = px(cx - Math.round(info.width * 0.05), cy); // red badge body
        expect(rr).toBeGreaterThan(150);
        expect(rg).toBeLessThan(90);
        expect(rb).toBeLessThan(90);

        fs.rmSync(dir, { recursive: true, force: true });
    });

    it('honours custom dimensions', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'poster-'));
        const hero = path.join(dir, 'hero.png');
        const out = path.join(dir, 'poster.jpg');
        await makeHero(hero);

        await buildVideoPoster(hero, out, { width: 640, height: 360 });

        const meta = await sharp(out).metadata();
        expect(meta.width).toBe(640);
        expect(meta.height).toBe(360);
        fs.rmSync(dir, { recursive: true, force: true });
    });
});
