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

### Hook-Art (verbindliche Kriterien, Thomas 2026-06-14, geschaerft 14.06 (c))
Ein guter Hook macht NEUGIERIG UND macht das Thema sofort erkennbar — **beides zugleich ist Pflicht**,
weil das Bild im Internet OHNE den Artikel-Titel auftaucht (Feed-Thumbnail, Google-Bildersuche, geteilt,
YouTube-Thumbnail). Ein Fremder, der nur das Bild sieht, muss das Thema verstehen. Reine Mystery ohne
Thema = Scroll-weiter; Thema + offene Frage = Klick.
- **KORREKTES, SINNVOLLES DEUTSCH (Thomas 14.06):** der Hook ist ein vollstaendiger, grammatisch
  richtiger, sinnvoller deutscher Satz/Frage — KEIN Telegramm-Fragment. "wie viel budget?" ist KEIN
  Deutsch ("Bammish"). Richtig: "was darf meine website kosten?".
- **WORKFLOW (Thomas 14.06): erst Hook waehlen, DANN Bild erzeugen.** Nicht das Bild mehrfach neu
  rendern. Pro Artikel zuerst 3 verschiedene Hook-Saetze (proper Deutsch, Standalone) vorschlagen, der
  User waehlt einen (AskUserQuestion / Freigabe-Email-Nummer), erst dann den gewaehlten Hook ins Hero.
- **STANDALONE-TEST (wichtigste Regel, Thomas 14.06):** lies den Hook OHNE den Artikel daneben. Weiss
  ein Fremder, worum es geht, UND bleibt er neugierig? Wenn das Thema unklar ist -> ein themenbenennendes
  Wort einbauen. **Schlecht: "wie viel budget?"** (welches Budget?). **Gut: "website: wie viel budget?"**
  / "was kostet eine neue website?" / "relaunch — lohnt sich das?". Immer ein Substantiv aus dem Feld
  rein: website, relaunch, kosten, hosting, budget...
- **Laenge: bis ~5-6 Woerter / ~35 Zeichen** (frueher strikt 2-4 — gelockert, damit das Thema reinpasst).
  Trotzdem in 1-2 Sekunden lesbar, sonst 3 Zeilen und Effekt weg.
- **Klingt gesprochen**, wie es jemand wirklich sagt (Thomas-Stimme, Tag-Frage "oder?" erlaubt).
  Nicht werblich, nicht gestelzt.
- **Neugier-Luecke:** offene Frage oder Spannung, beantwortet NICHT schon alles.
- kleingeschrieben, cremeweiss Handschrift, im Negativraum. KEIN Gedankenstrich (ausser unvermeidbar),
  kein Hochglanz, kein Clickbait der am Thema vorbeigeht.
- Gut (Zahlungs-Artikel): "website gleich zahlen?". Schwach (Thema fehlt standalone): "wie viel budget?",
  "wann zahl ich?". Tot (kein Sog): "Zahlungsmodalitaeten erklaert".

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
(Modell gpt-5.5). Liefert KEINEN Hook-Text. **ACHTUNG: Codex-Nutzungslimit erreicht, zurueck erst ~14.07.2026**
(`You've hit your usage limit`) -> Codex faellt aktuell ganz aus, Gemini-Browser ist der EINZIGE Weg.

## VARIATION (Thomas 2026-06-16, PFLICHT) — nicht jeder Artikel/jedes Bild gleich
Die Bilder duerfen nicht immer „Frau + Laptop + Cafe" sein. Regeln (auch in der Engine verankert,
`image.ts` Art-Director + `content-engine/knowledge/recent-image-motifs.json`):
- **Inhaltsgetrieben:** jedes Bild aus dem KONKRETEN Text SEINER Sektion ableiten (Absatz lesen, genau
  diesen Punkt zeigen), nicht generisch. „du bist knapp vorbei" = Motiv passt nicht klar zum Thema.
- **Archetypen mischen** ueber die 4 Fotos: (a) Konzept/Still-Life ohne Person, (b) Detail/Nahaufnahme,
  (c) Umgebung/Ort, (d) Mensch-in-Aktion (Geschlecht/Alter/Setting variieren). **HOECHSTENS 1× „Person
  am Laptop"** — Laptop nur, wenn die Sektion es wirklich verlangt.
- **Hero-Verlauf ROTIERT** pro Artikel (Palette in `image.ts`: turquoise-blue / teal-green /
  golden-yellow-amber / violet-indigo) — fuer Abwechslung + spaeter messen, was Leute moegen.
- **Infografik-Format rotieren** (comparison / keypoints), nicht immer die 2-Spalten.
- Wiederhol-Sperre: die letzten ~12 Hero-Motive meiden.

## LESSONS Bild-Browser (16.06)
- **Verlauf-Hintergrund ≠ echte Wand/Location.** Prompt MUSS sagen „background is NOT a real location and
  NOT a wall: a smooth horizontal colour gradient …" und das Subjekt isoliert im Vordergrund halten. Eine
  Szenen-Beschreibung mit Umgebung (Pack-Raum, Werkstatt) erzeugt eine echte Wand → kein sauberer Verlauf.
- **Hook im EINEN Generierungs-Prompt mitschreiben**, nicht als Folge-Edit. Gemini verweigerte 16.06 den
  nachtraeglichen „add handwritten text"-Edit („I'm having a hard time…"). Im Erst-Prompt funktioniert:
  „No logos and no other text anywhere, EXCEPT exactly one handwritten caption in the upper-left: large,
  casual, dark espresso-brown handwritten lowercase script reading: <hook>." Hook-Farbe an Verlauf anpassen
  (creme-weiss auf dunkel/tuerkis, dunkles Espresso-Braun auf gelb) fuer Kontrast.
- **Browser-Stoerquellen:** LanguageTool/Grammarly-Extension-Popups koennen den Senden-Klick abfangen;
  Senden-Button-Position wandert (oranger Pfeil im Eingabefeld). Bild-Klick → Editor → Download-Pfeil oben
  rechts; Download landet in `~/Downloads/Gemini_Generated_Image_*.png`, dann per Bash ins Repo (sharp
  resize Breite 1200, NICHT oben beschneiden sonst Hook weg).
