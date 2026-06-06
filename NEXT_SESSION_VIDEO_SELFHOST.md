# NEXT SESSION — Video selbst hosten (YouTube-Embed-Blocking endgueltig loesen)

Stand: 2026-06-06 Spaet-Abend. Vom User mit hoher Prioritaet gewuenscht:
**Das eingebettete Video MUSS bei JEDEM Besucher abspielen, darf NIE blockiert werden.**

## Das Problem (verifiziert)

Auf der Artikelseite (`/tipps/<slug>`) zeigt das Video ein kaputtes/graues Kaestchen bzw.
"Dieser Inhalt ist blockiert". Der **Podcast direkt darueber funktioniert**.

Ursache (durch Screenshot bewiesen): Der Podcast ist **selbst gehostet**
(`SimpleAudioPlayer` -> `/audio/<slug>-podcast.mp3` auf der eigenen Domain) und laedt immer.
Das Video laeuft ueber **YouTube-Domains** und genau die werden client-seitig geblockt:
- `components/blog/content/VideoEmbed.tsx` nutzt `youtube-nocookie.com/embed/<id>` (iframe)
  + Poster `i.ytimg.com/vi/<id>/...`.
- Blocker (uBlock Origin, Brave Shields, Privacy Badger, Pi-hole/NextDNS, Firmen-Proxies)
  blocken youtube.com UND youtube-nocookie.com UND i.ytimg.com. Betrifft NICHT nur Thomas'
  Chrome, sondern einen relevanten Anteil aller Besucher.
- Die aktuelle VideoEmbed "degradiert grafzioes" (Poster wird versteckt, youtu.be-Link in der
  Caption) -- aber das **spielt das Video nicht ab**, und genau das will der User.

Die frueher notierte Lehre "kaputtes Kaestchen = Client-Blocker, kein Server-Bug" stimmt fuer
die URSACHE, ist aber als Loesung UNGENUEGEND. Der User will, dass das Video trotzdem laeuft.

## Die Loesung: Video selbst hosten (HTML5 `<video>`), wie der Podcast

Kein YouTube-iframe mehr als Primaerquelle -> es gibt keine blockbare YouTube-Domain ->
das Video laeuft immer. YouTube bleibt optional als Zweitkanal (SEO/Reichweite) per Link.

Das MP4 laden wir ohnehin von NotebookLM herunter (z.B. `~/Downloads/GEO__Leitfaden_2026.mp4`,
37 MB). Es muss nur erreichbar gehostet werden.

### Entscheidung VOR dem Bau: Wo wird das MP4 gehostet?
- **NICHT** ins git-Repo / `public/` direkt (37 MB x viele Artikel = Repo-Bloat + Vercel
  Deploy-Size-Limit). Allenfalls mit Vorsicht fuer 1-2 Videos, aber nicht skalierbar.
- **Option A — Vercel Blob** (`@vercel/blob`): nativ zu Vercel, simpel
  (`put(name, file, {access:'public'})` -> liefert oeffentliche URL auf
  `*.public.blob.vercel-storage.com`). Free-Tier + danach pay-per-GB. EMPFEHLUNG fuer schnellen,
  sauberen Start (kein YouTube-Domain -> nicht geblockt).
- **Option B — Cloudflare R2**: S3-kompatibel, sehr guenstig, kein Egress-Cost, eigene Domain
  moeglich. Mehr Setup.
- **Option C — Bunny.net Stream**: echtes Video-CDN mit adaptivem Streaming + eigenem Player,
  ~$0.005/GB. Beste Streaming-Performance, eigener Account noetig.
- User fragen (oder Vercel Blob als 0-Setup-Default nehmen, da Projekt schon auf Vercel laeuft).

### Bauschritte
1. **VideoEmbed.tsx erweitern**: neue optionale Props `src` (MP4-URL) + `poster` (eigenes
   Standbild, NICHT i.ytimg.com). Wenn `src` gesetzt -> HTML5
   `<video controls preload="metadata" poster={poster}>` mit `<source src={src} type="video/mp4">`.
   Kein YouTube-iframe. `id` (YouTube) nur noch optionaler "auch auf YouTube ansehen"-Link in der
   figcaption. Abwaerts-kompatibel: ohne `src` faellt es auf das alte YouTube-Verhalten zurueck.
2. **Poster-Frame** aus dem MP4 ziehen (ffmpeg: `ffmpeg -i in.mp4 -ss 3 -vframes 1 poster.jpg`),
   auch auf den Storage hochladen, eigene Domain -> nie geblockt. (ffmpeg ist auf dem Mac via
   brew verfuegbar; falls nicht, `brew install ffmpeg`.)
3. **run-media.ts erweitern** (`scripts/content-engine/media/run-media.ts`): nach (oder statt)
   dem YouTube-Upload das MP4 + Poster zum Storage hochladen und
   `<VideoEmbed src="<mp4-url>" poster="<poster-url>" id="<yt-id>" title="..." />` in den mdx
   schreiben (statt nur `id`). YouTube-Upload kann als Zweitkanal bleiben.
4. **Bestehende Artikel nachruesten**: GEO (`was-ist-generative-engine-optimization-geo-und-warum-ersetzt`)
   und #105 KI-Technologien (`wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites`).
   MP4s liegen noch in `~/Downloads/` (`GEO__Leitfaden_2026.mp4`, `Moderne_KI-Websites_2026.mp4`).
   Hochladen -> mdx auf self-hosted `src` umstellen -> commit/push -> auf der Live-Seite
   verifizieren (am besten in einem Browser mit Adblocker, sonst per `curl`/anderem Profil), dass
   das Video laedt.
5. **Verifikation**: Artikelseite oeffnen, Video MUSS abspielen, auch mit aktivem Blocker.

## Was in DIESER Session (06.06) schon fertig wurde (Kontext)
- GEO-Artikel komplett durch den Medien-Schritt gefahren: Podcast + Video erzeugt (NotebookLM),
  Video public auf YouTube (https://youtu.be/TRJC1jbYUgI), Podcast + Video in den Artikel
  eingebettet, gepusht. Substack-Post live (web-only, KEIN Newsletter, mit Backlink + Video).
  Schluss-Mail raus.
- 2 Code-Fixes committed+gepusht: (a) Bilder erst nach Freigabe erzeugen (`run-daily.sh --no-image`
  + `run-media.ts` ruft `images-only --hero`), (b) YouTube-Uploader nutzt dediziertes venv
  (`~/.config/redrabbit-youtube/venv`), weil Homebrew python3 auf 3.14 ging und google-auth weg war.
- NotebookLM war heute ueberlastet: Audio-Podcast erster Versuch hing ~57 Min und schlug fehl
  (roter Fehler), ein zweiter parallel erzeugter Podcast wurde fertig. Video ~24 Min. Lehre:
  bei haengendem Audio frueher einen zweiten Lauf starten statt endlos warten.

## Wichtige Fakten / Stolpersteine (aus dieser Session)
- Mails der Content-Engine landen im **Gmail-Postfach thomas.uhlir@gmail.com**, nicht im
  immo.red-Client (Versand via Gmail SMTP). Bei "keine Mail" zuerst Gmail pruefen.
- Medien-Schritt braucht aktive Browser-Sitzung (NotebookLM/Substack haben keine API, nicht
  headless). Self-Hosting-Upload (Storage) ist dagegen reines CLI -> kann spaeter Teil der
  Teilautomatik werden.
- Substack: Rubrik PFLICHT; Video-Embed per Paste auf LEERER Zeile; Erst-Publish ohne Video,
  Video per "Aktualisieren" nachziehen (kein erneuter Newsletter bei Update). Veroeffentlichen
  "Nur im Web" = Checkbox "Per E-Mail senden" deaktivieren (kein Massen-Mail).
- Repo: `~/dev/redrabbit` (NICHT iCloud-Desktop). main sauber, alles gepusht.
