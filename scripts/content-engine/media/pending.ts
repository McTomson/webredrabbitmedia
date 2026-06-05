import fs from 'node:fs';
import path from 'node:path';

// Lists open media requests (markers dropped by /api/approve or /api/media-trigger). A media
// session runs this first to see what to produce, then calls run-media for each slug. A marker
// counts as DONE once the article already embeds both the podcast and a video.
// Usage: tsx scripts/content-engine/media/pending.ts

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'content-engine/.media-requests');

function articleHasMedia(slug: string): { podcast: boolean; video: boolean } {
    const p = path.join(ROOT, 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(p)) return { podcast: false, video: false };
    const mdx = fs.readFileSync(p, 'utf8');
    return {
        podcast: mdx.includes(`/audio/${slug}-podcast.mp3`),
        video: /<VideoEmbed\b/.test(mdx),
    };
}

function main() {
    if (!fs.existsSync(DIR)) {
        console.log('Keine offenen Medien-Anfragen (Verzeichnis fehlt).');
        return;
    }
    const markers = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));
    if (!markers.length) {
        console.log('Keine offenen Medien-Anfragen.');
        return;
    }
    let open = 0;
    for (const f of markers) {
        const slug = f.replace(/\.json$/, '');
        const m = articleHasMedia(slug);
        const done = m.podcast && m.video;
        if (!done) open++;
        console.log(`${done ? 'FERTIG ' : 'OFFEN  '} ${slug}  (podcast: ${m.podcast ? 'ja' : 'nein'}, video: ${m.video ? 'ja' : 'nein'})`);
    }
    console.log(`\n${open} offen, ${markers.length - open} fertig (Marker kann nach run-media entfernt werden).`);
}

main();
