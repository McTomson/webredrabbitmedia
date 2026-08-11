# Naechste Session — Bundesland-Rollout: 7 Laender nach Steiermark-Rezept (2026-08-11)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/BUNDESLAND_SEO_GEO_RESEARCH.md, docs/SUCHDATEN_BUNDESLAENDER_2026-08-11.md, die Steiermark-Referenz-Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- **VOR JEDEM PUSH: `npx tsc --noEmit` UND `npx eslint <geaenderte files>`.** Interne Links IMMER `next/Link`.
- **Deploy-Verifikation:** Text-/Markup-Marker (sichtbare Strings, data-Attribute) per curl mit commit-EINDEUTIGEN Markern. styled-jsx-CSS und JS-Logik stehen NIE im SSR-HTML — dafuer GitHub-Commit-Status (`gh api repos/McTomson/webredrabbitmedia/commits/<sha>/status`) oder Browser-JS (document.styleSheets). 11.08.: 25 Min verloren, weil curl nach Client-CSS suchte.
- MCP-Chrome: KEIN WebGL (Talos-3D nicht pruefbar, faellt auf Poster zurueck) und resize aendert den Viewport NICHT -> 3D + Mobile-Ansicht nimmt NUR Thomas am Geraet ab. Visuelle Fixes erst "fertig", wenn Thomas sie auf SEINEM Screen bestaetigt.
- NIE `git add .`/`-u` — nur eigene Dateien mit explizitem Pfad stagen (parallele Sessions + viel Fremd-WIP im Tree).
- Bei langen Agenten-/Hintergrund-Laeufen alle 15 Min Health-Check.

## Auftrag (Thomas 11.08., woertlich sinngemaess)
Die restlichen Bundeslaender **AUSSER WIEN** bauen — jede Seite so einzigartig, dass Google sie
als eigene Seite sieht ("das ist super wichtig"). Scroll-Funktion und Ansicht auf ALLEN
Bildschirmgroessen muessen stimmen: Abstaende, einzelne Bereiche im Vollbild (wenn ein Bereich
groesser als ein Viewport ist, ist das ok). Fragen vorab stellen, nicht raten.

**Zu bauen (7):** niederoesterreich, oberoesterreich, tirol, vorarlberg, kaernten, salzburg, burgenland.
Alt-Seiten existieren unter `app/webdesign-<land>/` (alte RegionalLandingPage) — Slugs BEHALTEN,
neue Seiten unter `app/relaunch-preview/webdesign-<land>/` (beim Go-Live ersetzt Root die Alt-Seite).
**Wien NICHT bauen** (Thomas 11.08. explizit).

## DAS STEIERMARK-REZEPT (Referenz = app/relaunch-preview/webdesign-steiermark/page.tsx + components/relaunch/RegionHome.tsx)
So wurde die Steiermark-Seite fuer Google eigenstaendig — pro Land GENAU SO vorgehen:

### 1. DATEN ZUERST (pro Land, ~15 Min — nicht ueberspringen!)
- GSC (Property `https://web.redrabbit.media/`, Thomas' Chrome ist eingeloggt):
  Leistung -> Filter Seite enthaelt `webdesign-<land>` -> Queries 3 Monate. URL-Muster:
  `https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fweb.redrabbit.media%2F&breakdown=query&num_of_months=3&page=*webdesign-<land>`
- Ads-Keyword-Planer (eingeloggt, Konto 462-025-2081): Volumina fuer `webdesign <land>`,
  `homepage erstellen <land>`, Staedte, Branchen. "Suchvolumen und Prognosen abrufen".
- Vorbefunde (Voll-Daten in docs/SUCHDATEN_BUNDESLAENDER_2026-08-11.md): OOe 1.545 Impr.
  (+ "website erstellen linz" 366, "web designer oberoesterreich" 313), Vorarlberg 1.106
  (+ "homepage erstellen (lassen) vorarlberg" 225+208!), Tirol 909 (+ "homepage erstellung
  tirol" 351!), NOe 613 (+ webdesigner noe 578, st. poelten 124, waldviertel 171+103),
  Burgenland 399 (+ EISENSTADT-Cluster 371+106+89+87...), Kaernten 322 (+ klagenfurt 122).
  Salzburg: kaum Daten -> Keyword-Planer + Autocomplete. Site-weit gross: Gastronomie-Cluster
  ~1.600, Aerzte ~640, "wie lange dauert es eine website zu erstellen" 202+60.
- Die ECHTEN Formulierungen in H1/Title/FAQ verwenden (z.B. Tirol/Vorarlberg: "Homepage
  erstellen lassen" prominent — dort ist die Nachfrage bewiesen).

### 2. Seiten-Identitaet (Server-Seite, duenn)
- Eigenes **sr-only H1**: "Webdesign <Land>: Website erstellen lassen ..." (Home hat KEIN h1 -> kein Konflikt).
- Eigener Title ("Webdesign <Land>: Website erstellen lassen | Red Rabbit Media"), eigene
  Description (KEIN Standort-/Wien-Bezug!), OpenGraph.
- Preview: `robots noindex` + Canonical auf `/relaunch-preview/webdesign-<land>`.
  GO-LIVE-LANDMINE: Canonical auf Root + index true (steht auch in SEO-Handoffs).
- Schema: WebPage + **Service mit areaServed={AdministrativeArea, name: <Land>}** + BreadcrumbList
  (URLs = Go-Live-Root). KEIN LocalBusiness, KEIN Fake-Geo, KEIN aggregateRating.

### 3. Regionaler Hauptinhalt (RegionContent-Objekt) — HIER entsteht die Einzigartigkeit
- `kiStatement` (KI-Szene), `problemBody`, `beweisIntro`: regionalisiert, pro Land andere Formulierung.
- `regionalBlock`: Eyebrow, Statement-Heading (Hook-Frage), 2 Absaetze (Absatz 2 = "Website
  erstellen lassen"-Sprache + konkrete regionale Beispiele: Branche+Ort, pro Land ANDERE!),
  reachLine (Staedte/Regionen des Landes, 2-3 natuerlich, KEIN Stuffing), trustLine (positiv,
  anonym, KEINE Firmennamen), availability-Karte.
- FAQ (5 Fragen, PreiseFaq-Design kommt automatisch): Kosten (Wortlaut "Was kostet es, eine
  professionelle Website erstellen zu lassen?" + "Festpreis"), Dauer ("Wie lange dauert es,
  eine Website erstellen zu lassen?"), Google-gefunden-werden-im-Land, EINE Branchen-Frage
  PRO LAND ANDERS (Tirol: Hotellerie/Tourismus; NOe: Handwerk/Betriebe; Burgenland: ?;
  je nach Daten), Foerderung (KMU.DIGITAL). **FAQ-Antworten pro Land umformulieren, nicht
  kopieren** — identische FAQ-Bloecke ueber 8 Seiten = Doorway-Muster!
- closingLines regionalisiert.
- **VERBOTEN:** Standort-Thema ("wir sind (nicht) vor Ort / aus Wien"), Fremd-Firmennamen/-Links,
  "guenstig"-Framing (Marken-Entscheid Wert-statt-Preis), Staedte-Stuffing, KI-Tells
  (nicht-nur-sondern-auch, Gedankenstriche, Floskel-Einleitungen, Gleichtakt-Absaetze).
  Hausstimme: frech, DU, oesterreichisch, echte Umlaute, Preise NUR 1.250/2.850/ab 4.900.

### 4. Talos-Station (im Regional-Block, RegionHome traegt sie schon)
`data-talos-station data-talos-anchor="0.8" data-talos-size="m" data-talos-appear="0.3"
data-talos-gesture="wave2" data-talos-mobile="1" data-talos-mobile-anchor="0.82"
data-talos-mobile-size="xs" data-talos-mobile-gesture="wave2" data-talos-mobile-dy="-700"`.
wave2 = andere Hand; GREET_COOLDOWN 30s drosselt Wiederhol-Winken (TalosCompanionStage);
GREETING_DURATION 4.6s (talosMotion). Textspalte max 600px links, Kopf (wd-eyebrow +
rr-statement) darf 820px.

### 5. Geteilte Bausteine (duerfen identisch sein = Template)
HomeMorph (mit sceneTexts-Override), CasePanels (themes-Override), Ablauf-Kreis-Szene
(components/subpages/leistungen/website/v2/Ablauf.tsx, 1:1), HomeClosing (closingLines),
FooterReassembly, ScrollExperience. Neue Region = NUR neues RegionContent + duenne Server-Seite.

### 6. Responsive/Scroll-QA (Thomas-Anforderung, PFLICHT pro Seite)
- Alle Breiten pruefen: Handy (<=560), Zwischenbreite (821-1040 — heute gelernt: eigene
  CSS-Stufe in Ablauf.tsx; Morph-Formationen narrow-Boost faellt 1.6->1.15 zwischen
  560-900px, lib/relaunch/morph/stage.ts), Desktop.
- Bereiche im Vollbild, Abstaende sauber; Bereich > 1 Viewport ist ok.
- Unterzeile "WEBDESIGN . SICHTBARKEIT . KI" bleibt bis zum Buchstaben-Zerfall (u=0.22,
  HomeMorph subOut) — gilt automatisch ueberall.
- Echte Mobile-/3D-Abnahme NUR durch Thomas am Geraet.

### 7. Einzigartigkeits-Check vor jedem Push (super wichtig, Thomas)
Zwei fertige Region-Seiten nebeneinander legen: Regional-Block + FAQ duerfen NICHT
austauschbar wirken (anderer Hook, andere Beispiele/Branchen, andere FAQ-Branchenfrage,
andere Formulierungen). Wenn austauschbar -> umschreiben VOR dem Push.

## Stand 11.08. (Steiermark = FERTIGE REFERENZ, live auf v2)
- Commits heute: 268b27c (wave2+FAQ-Design+Vertrauenszeile) -> 459642c (erstellen-lassen-
  Sprache, Branchen-FAQ, Daten) -> d47a946 (Ablauf-Szene statt Eigenbau, appear 0.3) ->
  ff0ba3a (Festpreis/professionell-FAQ) -> 4f2ca4f (Ablauf auch auf HOME + Statement-Heading)
  -> 79d208e (anchor 0.8, mobile-dy, 3x langsamer) -> e9e2abc (Wink-COOLDOWN statt Dauer,
  Ablauf-Zwischengroesse 821-1040) -> 7dc0abb (Unterzeile bis Zerfall, Formations-Boost
  breitenabhaengig). Alle deployt (letzter Status: success).
- **ABNAHME AUSSTEHEND (Thomas, zuerst abfragen):** 7dc0abb visuell (Unterzeile laenger,
  Formationen bei ~820px kleiner) + Talos-Feinschliff (Wiederhol-Cooldown 30s ok? mobile-dy
  -700 tief genug = "fast am unteren Rand"? Ein-Zahl-Fixes.)
- Ablauf-Kreis-Szene ist jetzt AUCH auf der echten Home (app/relaunch-preview/page.tsx).

## Offene Thomas-Entscheidungen / Fragen an ihn (Session-Start stellen)
1. Referenz-Kunden je Bundesland fuer die Beispiel-Saetze (anonym eingewoben, keine Namen):
   NOe = Fliesen-Handwerker (Tino Jugler) bekannt, OOe = Lashes-Studio bekannt. Kaernten/
   Salzburg/Tirol/Vorarlberg/Burgenland: gibt es echte Kunden/Braanchen-Anker? (Thomas 09.08.:
   "wir haben Kunden in jedem Bundesland".)
2. KundenGrid-Firmennamen (geteilte Home-Sektion, auf jeder Region-Seite): behalten oder raus? (offen seit 10.08.)
3. Reihenfolge-Vorschlag: NOe zuerst (echter Kunde + bewiesene Nachfrage), dann Tirol/Vorarlberg
   ("homepage erstellen"-Cluster), OOe, Burgenland (Eisenstadt-Cluster), Kaernten, Salzburg.

## Dateien
- Referenz: app/relaunch-preview/webdesign-steiermark/page.tsx, components/relaunch/RegionHome.tsx
- Geteilt (NICHT brechen, Defaults = Home): components/relaunch/{HomeMorph,CasePanels,HomeClosing}.tsx
- Talos: components/relaunch/talos/{TalosCompanionStage.tsx,talosMotion.ts}
- Ablauf: components/subpages/leistungen/website/v2/Ablauf.tsx (+ Zwischengroessen-Query)
- Morph-Skalierung: lib/relaunch/morph/stage.ts (narrow-Boost breitenabhaengig)
- Daten: docs/SUCHDATEN_BUNDESLAENDER_2026-08-11.md; Research/Spec: docs/BUNDESLAND_SEO_GEO_RESEARCH.md
- Alt-Inhalte als Rohstoff: lib/regional-content.ts (VORSICHT: fake projectCounts drin — NICHT uebernehmen)

## Nicht anfassen / Fremd-WIP (unstaged lassen)
components/relaunch/SiteClosing.tsx, app/relaunch-preview/faq/page.tsx,
components/subpages/faq-demo/*, docs/handoffs/NEXT_SESSION_leistungen.md, docs/seo-monitor-log.md,
app/preise-preview/, app/relaunch-preview/talos-choreo/, diverse Screenshots im Root.
