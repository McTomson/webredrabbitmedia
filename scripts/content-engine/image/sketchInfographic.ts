import sharp from 'sharp';

// Hand-drawn "sketchnote" infographic renderer. Crisp, readable text (real umlauts) via
// macOS hand fonts that librsvg renders (Marker Felt, Chalkboard SE). This is the deliberate
// contrast to the photographic hero/context images. Brand: red #E2231A, green #1a7f37, paper.

const RED = '#E2231A';
const GREEN = '#1a7f37';
const INK = '#1a1a1a';
const PAPER = '#fbf6ec';

export interface SketchColumn {
    heading: string;
    sub?: string;
    items: string[];
    verdict?: string;
    tone: 'good' | 'bad' | 'neutral';
}
export type SketchData =
    | { layout: 'comparison'; title: string; subtitle?: string; left: SketchColumn; right: SketchColumn; footer?: string }
    | { layout: 'keypoints'; title: string; subtitle?: string; points: { big?: string; text: string }[]; footer?: string };

function esc(s: string): string {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const head = (s: string, size: number, x: number, y: number, fill = INK, anchor = 'start') =>
    `<text x="${x}" y="${y}" font-family="Marker Felt" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const body = (s: string, size: number, x: number, y: number, fill = '#333', anchor = 'start') =>
    `<text x="${x}" y="${y}" font-family="Chalkboard SE" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

const DEFS = `<defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter></defs>`;
const brandTag = (w: number) => head('Red Rabbit', 20, w - 30, 80, RED, 'end').replace('<text', `<text transform="rotate(6 ${w - 30} 80)"`);

function toneColor(t: SketchColumn['tone']): string {
    return t === 'good' ? GREEN : t === 'bad' ? RED : INK;
}

function renderColumn(c: SketchColumn, x: number, w: number, rot: number): string {
    const col = toneColor(c.tone);
    const cx = x + w / 2;
    let s = `<g transform="rotate(${rot} ${cx} 430)">`;
    s += `<rect x="${x}" y="190" width="${w}" height="470" rx="18" fill="#fff" stroke="${col}" stroke-width="4" filter="url(#rough)"/>`;
    // icon
    s += `<circle cx="${x + 65}" cy="255" r="34" fill="${c.tone === 'good' ? '#eafaf0' : c.tone === 'bad' ? '#fdecec' : '#f0f0f0'}" stroke="${col}" stroke-width="3"/>`;
    if (c.tone === 'good') s += `<path d="M${x + 50} 255 l12 13 l20 -26" stroke="${GREEN}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    else if (c.tone === 'bad') s += head('!', 36, x + 65, 268, RED, 'middle');
    else s += head('?', 32, x + 65, 266, INK, 'middle');
    s += head(c.heading, 31, x + 120, 250);
    if (c.sub) s += body(c.sub, 18, x + 120, 281, '#777');
    let yy = 340;
    for (const it of c.items.slice(0, 5)) {
        s += body('- ' + it, 22, x + 35, yy, '#333');
        yy += 42;
    }
    if (c.verdict) {
        s += `<rect x="${x + 35}" y="525" width="${w - 70}" height="60" rx="12" fill="${col}" filter="url(#rough)"/>`;
        s += head(c.verdict, 25, x + 65, 565, '#fff');
    }
    s += `</g>`;
    return s;
}

export function renderSketchSVG(d: SketchData): string {
    const W = 1200, H = 760;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}<rect width="${W}" height="${H}" fill="${PAPER}"/>`;
    s += head(d.title, 44, 60, 78);
    s += `<path d="M60 98 q 300 14 560 4" stroke="${RED}" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#rough)"/>`;
    if (d.subtitle) s += body(d.subtitle, 23, 60, 136, '#555');
    s += brandTag(W);

    if (d.layout === 'comparison') {
        s += renderColumn(d.left, 70, 520, -1.2);
        s += `<circle cx="600" cy="425" r="42" fill="${INK}"/>` + head('vs', 30, 600, 436, '#fff', 'middle');
        s += renderColumn(d.right, 610, 520, 1.2);
    } else {
        // keypoints: numbered hand-drawn list
        let yy = 230;
        d.points.slice(0, 5).forEach((p, i) => {
            const rot = i % 2 === 0 ? -0.8 : 0.8;
            s += `<g transform="rotate(${rot} 600 ${yy + 35})"><rect x="70" y="${yy}" width="1060" height="82" rx="14" fill="#fff" stroke="${INK}" stroke-width="3" filter="url(#rough)"/>`;
            s += `<circle cx="125" cy="${yy + 41}" r="30" fill="${i % 2 ? RED : GREEN}"/>` + head(p.big || String(i + 1), p.big ? 22 : 28, 125, yy + 50, '#fff', 'middle');
            s += body(p.text, 24, 185, yy + 50, '#222') + `</g>`;
            yy += 98;
        });
    }
    if (d.footer) {
        s += `<rect x="70" y="690" width="1060" height="50" rx="10" fill="${INK}"/>` + head(d.footer, 23, 600, 724, '#fff', 'middle');
    }
    s += `</svg>`;
    return s;
}

export async function renderInfographicPng(d: SketchData, outPath: string): Promise<void> {
    await sharp(Buffer.from(renderSketchSVG(d))).png().toFile(outPath);
}
