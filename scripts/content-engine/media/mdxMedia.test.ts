import { describe, it, expect } from 'vitest';
import { embedPodcast, embedVideo, parseYoutubeId } from './mdxMedia';

const base = `---
title: Test
---

# Eine Ueberschrift

Erster Absatz.
`;

describe('embedPodcast', () => {
    it('inserts the SimpleAudioPlayer right after the H1', () => {
        const out = embedPodcast(base, 'mein-slug', 'Podcast: Test');
        const lines = out.split('\n').filter((l) => l.trim() !== '');
        const h1i = lines.findIndex((l) => l.startsWith('# '));
        expect(lines[h1i + 1]).toContain('<SimpleAudioPlayer');
        expect(out).toContain('/audio/mein-slug-podcast.mp3');
    });

    it('is idempotent for the same slug', () => {
        const once = embedPodcast(base, 'mein-slug', 'Podcast: Test');
        const twice = embedPodcast(once, 'mein-slug', 'Podcast: Test');
        expect(twice).toBe(once);
    });
});

describe('embedVideo', () => {
    it('places the video after the podcast player when present', () => {
        const withAudio = embedPodcast(base, 'mein-slug', 'Podcast: Test');
        const out = embedVideo(withAudio, 'abcDEF12345', 'Video: Test');
        const lines = out.split('\n').filter((l) => l.trim() !== '');
        const ai = lines.findIndex((l) => l.includes('<SimpleAudioPlayer'));
        expect(lines[ai + 1]).toContain('<VideoEmbed');
        expect(lines[ai + 1]).toContain('abcDEF12345');
    });

    it('falls back to after the H1 when no podcast present', () => {
        const out = embedVideo(base, 'abcDEF12345', 'Video: Test');
        const lines = out.split('\n').filter((l) => l.trim() !== '');
        const h1i = lines.findIndex((l) => l.startsWith('# '));
        expect(lines[h1i + 1]).toContain('<VideoEmbed');
    });

    it('is idempotent for the same id', () => {
        const once = embedVideo(base, 'abcDEF12345', 'Video: Test');
        expect(embedVideo(once, 'abcDEF12345', 'Video: Test')).toBe(once);
    });
});

describe('parseYoutubeId', () => {
    it('extracts the id from a youtu.be VIDEO_URL line', () => {
        expect(parseYoutubeId('foo\nVIDEO_URL: https://youtu.be/f8QS2zGI-K8\nbar')).toBe('f8QS2zGI-K8');
    });
    it('extracts the id from a watch?v= VIDEO_URL line', () => {
        expect(parseYoutubeId('VIDEO_URL: https://www.youtube.com/watch?v=f8QS2zGI-K8')).toBe('f8QS2zGI-K8');
    });
    it('returns null when absent', () => {
        expect(parseYoutubeId('no url here')).toBeNull();
    });
});
