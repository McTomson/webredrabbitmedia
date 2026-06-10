// Pure helpers that embed the podcast player and the YouTube video into an article MDX,
// matching the hand-built Wartungsvertrag layout: right after the single H1 come the
// <SimpleAudioPlayer/> and then the <VideoEmbed/>, each on its own line. Idempotent: if the
// component is already present for this slug/id, the MDX is returned unchanged.

const AUDIO_SRC = (slug: string) => `/audio/${slug}-podcast.mp3`;

function findH1Index(lines: string[]): number {
    return lines.findIndex((l) => /^#\s+\S/.test(l));
}

// Insert a block right after the H1 (skipping one blank line), keeping a blank line around it.
function insertAfterH1(mdx: string, block: string): string {
    const lines = mdx.split('\n');
    const h1 = findH1Index(lines);
    if (h1 === -1) return mdx; // no H1, leave untouched
    const at = h1 + 1 < lines.length && lines[h1 + 1].trim() === '' ? h1 + 2 : h1 + 1;
    lines.splice(at, 0, block, '');
    return lines.join('\n');
}

export function embedPodcast(mdx: string, slug: string, title: string): string {
    if (mdx.includes(AUDIO_SRC(slug))) return mdx; // already embedded
    const tag = `<SimpleAudioPlayer src="${AUDIO_SRC(slug)}" title="${title.replace(/"/g, "'")}" />`;
    // Place the podcast directly after the H1.
    return insertAfterH1(mdx, tag);
}

// Embed the video. When opts.src is given we self-host: the article uses the HTML5 <video>
// (src + poster) which is never blocked by content filters (uBlock/Brave/Pi-hole); the id is
// kept only for the "watch on YouTube" caption link. Without opts.src it falls back to the
// YouTube-only embed (legacy). Self-hosting is the default for the media pipeline because the
// YouTube-only embed shows a broken link in filtered browsers.
export function embedVideo(
    mdx: string,
    youtubeId: string,
    title: string,
    opts: { src?: string; poster?: string } = {},
): string {
    if (new RegExp(`<VideoEmbed[^>]*id=["']${youtubeId}["']`).test(mdx)) return mdx; // already embedded
    const srcAttr = opts.src ? ` src="${opts.src}"` : '';
    const posterAttr = opts.poster ? ` poster="${opts.poster}"` : '';
    const tag = `<VideoEmbed${srcAttr}${posterAttr} id="${youtubeId}" title="${title.replace(/"/g, "'")}" />`;
    const lines = mdx.split('\n');
    // Prefer to place the video right after the podcast player if present, else after the H1.
    const audioIdx = lines.findIndex((l) => l.includes('<SimpleAudioPlayer'));
    if (audioIdx !== -1) {
        const at = audioIdx + 1 < lines.length && lines[audioIdx + 1].trim() === '' ? audioIdx + 2 : audioIdx + 1;
        lines.splice(at, 0, tag, '');
        return lines.join('\n');
    }
    return insertAfterH1(mdx, tag);
}

// Parse the "VIDEO_URL: https://youtu.be/<id>" line that youtube_upload.py prints, and
// return the 11-char video id (or null if not found).
export function parseYoutubeId(uploaderStdout: string): string | null {
    const m = uploaderStdout.match(/VIDEO_URL:\s*https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
}
