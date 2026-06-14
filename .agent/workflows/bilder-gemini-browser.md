# Workflow: Artikel-Bilder via Gemini-Browser (PRIMAER)

> Entscheidung Thomas, 2026-06-14: Bilder werden **primaer ueber Gemini im Browser**
> (Nano Banana, gratis, eingeloggtes Google-Konto thomas.uhlir@gmail.com) erzeugt.
> Codex (`scripts/content-engine/images-only.ts`) ist nur noch **Fallback**, falls keine
> Browser-Session verfuegbar ist. Grund: Codex wird aktuell nicht genutzt; der headless
> `codex exec`-Pfad rendert ausserdem derzeit nicht (image_gen-Tool nicht exponiert,
> kein OPENAI_API_KEY). Gemini ist gratis und liefert den besseren Foto-Stil.

## Wann
Nach Freigabe eines Artikels (der taegliche Cron schickt bewusst Text-only zur Review).
Die Bild-Erzeugung laeuft in einer **Claude+Chrome-Session** (Browser-Automation), nicht
im headless Cron. 5 Bilder pro Artikel: 1 Hero (mit Hook) + 1 Infografik + 3 Kontextfotos.

## Voraussetzung
Chrome offen, in Gemini (https://gemini.google.com/app) als Thomas eingeloggt. Modell egal
(Flash erzeugt Nano-Banana-Bilder). Pro Bild ein eigener Prompt; Folge-Edits im selben Chat.

## Hero (mit Verlauf + Hook) — PFLICHT
Stil: Person/Motiv im Vordergrund (Oberkoerper, authentisch, freundlich, kein gestelltes
Stockfoto-Laecheln, weiches Licht, geringe Schaerfentiefe). Hintergrund = **weicher
HORIZONTALER Farbverlauf Tuerkis (#19B5AE) links -> passendes Blau (#2E6FD2) rechts**,
harmonisch ineinanderlaufend, kein harter Rand, kein Banding, freundlich. 16:9.

Dann ein zweiter Prompt im selben Chat: **handschriftlicher Hook-Text in cremeweiss** in die
ruhige tuerkise Flaeche oben links (gross, gut lesbar, nicht ueber Gesicht/Objekt).
WICHTIG: Wenn der erste Prompt "kein Text" gesagt hat, im Hook-Prompt explizit schreiben
*"die Regel 'kein Text' gilt nicht mehr, schreibe jetzt tatsaechlich den Schriftzug"* —
sonst laesst Gemini den Hook im selben Chat weg.

### Hook-Art (verbindliche Kriterien, Thomas 2026-06-14)
Ein guter Hook macht NEUGIERIG und macht das Thema sofort erkennbar. Beides zugleich, weil das
Bild auch als Feed-Thumbnail OHNE den Artikel-Titel daneben funktionieren muss ("Pattern
Interrupt im Feed"). Reine Mystery ohne Thema = Scroll-weiter; Thema + offene Frage = Klick.
- **2 bis 4 Woerter, ~max 25 Zeichen.** Gross, in einer Sekunde lesbar. Laenger -> 3 Zeilen,
  kleiner, Effekt weg.
- **Klingt gesprochen**, wie es jemand wirklich sagt (Thomas-Stimme, Tag-Frage "oder?" erlaubt).
  Nicht werblich, nicht gestelzt.
- **Neugier-Luecke:** offene Frage oder Spannung, beantwortet NICHT schon alles.
- **Thema-Anker:** ein Wort, das das Thema traegt (z.B. "website"), damit es ohne Titel klar ist.
- kleingeschrieben, cremeweiss Handschrift, im Negativraum. KEIN Gedankenstrich, kein Hochglanz,
  kein Clickbait der am Thema vorbeigeht.
- Gut (Beispiel Zahlungs-Artikel): "website gleich zahlen?". Schwach: "wann zahl ich?" (Thema
  fehlt im Feed), "Zahlungsmodalitaeten erklaert" (kein Sog).

> UMGESETZT (2026-06-14): die Engine generiert pro Artikel **3 Hook-Kandidaten** nach diesen
> Kriterien (`generateHooks` in pipeline.ts, eine kleine LLM-Anfrage) und schreibt sie ins
> Frontmatter (`hookCandidates`). Die Freigabe-Email listet sie nummeriert; Thomas antwortet mit
> der Nummer, der gewaehlte Hook kommt beim Bild-Schritt aufs Hero. Eigener Vorschlag jederzeit ok.

## Infografik (1) + Kontextfotos (3)
- Infografik: zentrale Aussage/Kernvergleich des Artikels als klare Daten-Grafik (zwei
  Spalten ODER 3-5 Kernfakten), Markenakzent Rot erlaubt. (Alternativ weiter der gratis
  SVG-Renderer `scripts/content-engine/image/sketchInfographic.ts` — scharfer Text.)
- 3 Kontextfotos: je eine authentische Szene zu genau einer H2-Sektion, KEIN Text im Bild,
  warmer dokumentarischer Stil. Diese brauchen KEINEN Verlauf und KEINEN Hook (nur der Hero).

## Speichern + einbinden
- Hero "in Originalgroesse herunterladen" -> `public/images/blog/<slug>.png`
  (featuredImage im Frontmatter zeigt darauf).
- Kontextfotos -> `public/images/blog/<slug>-ctxN-<v>.png`, Infografik ->
  `public/images/blog/<slug>-infografik-<v>.png`; jeweils per `![alt](pfad)` nach der
  passenden H2 einfuegen (deutscher, beschreibender Alt-Text, Thema-Keyword).
- commit + push. Vercel cached Bilder immutable -> Dateinamen versionieren.

## Fallback (Codex)
Nur wenn keine Browser-Session moeglich: `npx tsx scripts/content-engine/images-only.ts <slug> --hero`
(nutzt `HERO_PHOTO_STYLE` in `scripts/content-engine/image.ts`, Modell gpt-5.5). Liefert KEINEN
Hook-Text. Erst lauffaehig, wenn der Codex-image_gen-Pfad wieder rendert.
