import sharp from 'sharp';
import path from 'node:path';

// Branded video poster / YouTube thumbnail builder.
//
// The media pipeline used to grab a frame from the rendered NotebookLM video as the poster
// (`ffmpeg -ss 3 ...`), which produced the giant "NotebookLM" title card. Instead we build a
// branded still from the article's own hero image:
//   1. the hero, cropped to 16:9 (cover)
//   2. a subtle dark scrim (top + bottom) so it reads as a video still distinct from the inline
//      hero, and gives the play button + logo enough contrast on any background
//   3. a big YouTube-style red play badge, centred
//   4. the Red Rabbit logo top-right
//
// The same JPG serves as the self-hosted <video> poster AND the YouTube custom thumbnail, so the
// hook on the hero is what viewers see in both places. Deterministic and unit-testable (no video
// frame grab). Mirrors the sharp+SVG approach in image/sketchInfographic.ts.

export interface PosterOptions {
    width?: number; // default 1280 (YouTube thumbnail standard, 16:9)
    height?: number; // default 720
    logoPath?: string; // default <repo>/public/images/logo.png
}

const DEFAULT_LOGO = path.join('public', 'images', 'logo.png');

// Build the overlay SVG: darkening scrim + centred play badge. Kept as a pure function so the
// geometry can be exercised without sharp.
export function posterOverlaySvg(W: number, H: number): string {
    const cx = W / 2;
    const cy = H / 2;
    const pw = Math.round(W * 0.155); // play badge width
    const ph = Math.round(pw * 0.7); // YouTube badge aspect ~1.4:1
    const rx = Math.round(ph * 0.26);
    // right-pointing triangle, sized off the badge height, optically centred
    const tx = cx - ph * 0.2;
    const ty = ph * 0.27;
    const tip = cx + ph * 0.32;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#08172a" stop-opacity="0.30"/>
      <stop offset="0.45" stop-color="#08172a" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#050f1c" stop-opacity="0.44"/>
    </linearGradient>
    <filter id="pshadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <g filter="url(#pshadow)">
    <rect x="${cx - pw / 2}" y="${cy - ph / 2}" width="${pw}" height="${ph}" rx="${rx}" fill="#FF0000" fill-opacity="0.93"/>
    <path d="M ${tx} ${cy - ty} L ${tx} ${cy + ty} L ${tip} ${cy} Z" fill="#ffffff"/>
  </g>
</svg>`;
}

export async function buildVideoPoster(heroPath: string, outPath: string, opts: PosterOptions = {}): Promise<void> {
    const W = opts.width ?? 1280;
    const H = opts.height ?? 720;
    const logoPath = opts.logoPath ?? DEFAULT_LOGO;

    // hero cropped to 16:9; `attention` keeps the subject/hook in frame
    const base = sharp(heroPath).resize(W, H, { fit: 'cover', position: 'attention' });

    const composites: sharp.OverlayOptions[] = [{ input: Buffer.from(posterOverlaySvg(W, H)), top: 0, left: 0 }];

    // logo top-right: trim the transparent padding, then size to ~18% of width
    try {
        const logoW = Math.round(W * 0.18);
        const logo = await sharp(logoPath).trim().resize({ width: logoW }).png().toBuffer({ resolveWithObject: true });
        const margin = Math.round(W * 0.032);
        composites.push({ input: logo.data, top: margin, left: W - logo.info.width - margin });
    } catch {
        // logo missing/unreadable: poster still works without it, just no branding mark
    }

    await base.composite(composites).jpeg({ quality: 88, progressive: true }).toFile(outPath);
}
