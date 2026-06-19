import { describe, it, expect } from 'vitest';
import { stripMdxToText } from './extract-body';

const SAMPLE = `---
title: "Wie viel kostet eine Website?"
excerpt: "Eine kurze Antwort auf die Kostenfrage."
slug: kosten
---

<SimpleAudioPlayer src="/audio/kosten-podcast.mp3" title="Podcast: Kosten" />

<VideoEmbed src="/videos/kosten-video.mp4" poster="/videos/kosten-poster.jpg" id="abc12345678" title="Video: Kosten" />

## Die Grundlagen

Eine **Website** kostet je nach [Anbieter](https://example.at) unterschiedlich viel.

![Ein Diagramm](/images/blog/kosten.png)

- Punkt eins
- Punkt zwei

> Ein wichtiger Hinweis zur Kalkulation.

\`\`\`ts
const preis: number = 42; // sollte NICHT im Video-Skript landen
\`\`\`
`;

describe('stripMdxToText', () => {
    const out = stripMdxToText(SAMPLE);

    it('prepends title and excerpt as context', () => {
        expect(out.startsWith('Wie viel kostet eine Website?\n\nEine kurze Antwort auf die Kostenfrage.')).toBe(true);
    });

    it('removes the JSX media embeds entirely', () => {
        expect(out).not.toContain('SimpleAudioPlayer');
        expect(out).not.toContain('VideoEmbed');
        expect(out).not.toContain('abc12345678');
    });

    it('removes markdown image lines', () => {
        expect(out).not.toContain('/images/blog/kosten.png');
        expect(out).not.toContain('Diagramm');
    });

    it('collapses links to their label and drops URLs', () => {
        expect(out).toContain('Anbieter');
        expect(out).not.toContain('example.at');
        expect(out).not.toContain('](');
    });

    it('strips heading, emphasis, list and quote markers but keeps the text', () => {
        expect(out).toContain('Die Grundlagen');
        expect(out).not.toMatch(/^##/m);
        expect(out).toContain('Website kostet');
        expect(out).not.toContain('**');
        expect(out).toContain('Punkt eins');
        expect(out).not.toMatch(/^- Punkt/m);
        expect(out).toContain('Ein wichtiger Hinweis');
        expect(out).not.toMatch(/^>/m);
    });

    it('strips fenced code blocks entirely', () => {
        expect(out).not.toContain('const preis');
        expect(out).not.toContain('```');
        expect(out).not.toContain('NICHT im Video-Skript');
    });

    it('produces no run of 3+ blank lines', () => {
        expect(out).not.toMatch(/\n{3,}/);
    });
});
