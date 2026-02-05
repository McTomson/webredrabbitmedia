---
description: Wie man Substack-Podcasts als minimalen Audio-Player in Blog-Posts einbindet
---

# Substack Podcast in Blog-Post einbinden

Dieser Workflow beschreibt, wie man einen Substack-Podcast als minimalen, custom Audio-Player in einen Blog-Post einbindet.

## Voraussetzungen
- Substack-Podcast-Episode ist bereits veröffentlicht
- `SimpleAudioPlayer` Komponente existiert bereits in `/components/blog/content/SimpleAudioPlayer.tsx`
- Audio-Proxy API-Route existiert in `/app/api/audio-proxy/route.ts`

## Schritt 1: Audio-URL von Substack extrahieren

1. Öffne die Substack-Podcast-Episode im Browser
2. Öffne die Browser-Entwicklertools (F12)
3. Gehe zum "Network" Tab
4. Spiele den Podcast kurz ab
5. Suche nach einer `.mp3` Datei in den Network-Requests
6. Die URL sollte so aussehen: `https://api.substack.com/feed/podcast/[ID]/[HASH].mp3`

**Beispiel:**
```
https://api.substack.com/feed/podcast/186864947/b9ccef8d82ff7a3d8ccb66ef144f79ee.mp3
```

## Schritt 2: Audio-Player in MDX-Datei einbinden

Füge den Player **nach dem Frontmatter** und **vor dem ersten Heading** ein:

```mdx
---
title: "Dein Artikel-Titel"
slug: "dein-slug"
# ... weitere Frontmatter-Felder
---

<SimpleAudioPlayer 
  src="/api/audio-proxy?url=https://api.substack.com/feed/podcast/[ID]/[HASH].mp3" 
  title="Titel deines Podcasts" 
/>

## Erste Überschrift

Dein Artikel-Inhalt...
```

**Wichtig:** 
- Verwende **immer** die Proxy-URL: `/api/audio-proxy?url=...`
- **Nicht** die direkte Substack-URL verwenden (CORS-Probleme!)

## Schritt 3: Testen

1. Lokal testen: `npm run dev`
2. Navigiere zum Blog-Post
3. Klicke auf Play - der Player sollte funktionieren

## Schritt 4: Deployen

```bash
git add content/blog/[dein-artikel].mdx
git commit -m "Add podcast player to [artikel-name]"
git push
```

## Technische Details

### SimpleAudioPlayer Komponente
- **Pfad:** `/components/blog/content/SimpleAudioPlayer.tsx`
- **Props:**
  - `src` (string, required): URL zur Audio-Datei
  - `title` (string, optional): Titel des Podcasts
  - `autoPlay` (boolean, optional): Auto-Play aktivieren (Standard: false)

### Audio-Proxy API
- **Pfad:** `/app/api/audio-proxy/route.ts`
- **Zweck:** Umgeht CORS-Beschränkungen von Substack
- **Funktionsweise:** Holt die Audio-Datei von Substack und liefert sie über die eigene Domain aus

### Features des Players
- ✅ Play/Pause Toggle
- ✅ Klickbare Progress Bar
- ✅ Zeit-Anzeige (aktuell / gesamt)
- ✅ Playback Speed (1x, 1.25x, 1.5x, 2x)
- ✅ Mute/Unmute
- ✅ Minimalistisches Design (dunkler Hintergrund, roter Play-Button)
- ✅ Responsive (Mobile & Desktop)

## Troubleshooting

### Player lädt nicht / zeigt Fehler
- Überprüfe, ob die Audio-URL korrekt ist
- Stelle sicher, dass du die **Proxy-URL** verwendest (`/api/audio-proxy?url=...`)
- Prüfe die Browser-Konsole auf Fehler

### Audio spielt nicht ab
- Stelle sicher, dass die Substack-Episode öffentlich ist
- Teste die direkte URL im Browser
- Prüfe, ob der Audio-Proxy funktioniert: `/api/audio-proxy?url=...` direkt im Browser öffnen
