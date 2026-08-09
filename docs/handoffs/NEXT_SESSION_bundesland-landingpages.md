# Naechste Session — Bundesland-Landingpages (Steiermark-Referenz + Rollout) (2026-08-10)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/BUNDESLAND_SEO_GEO_RESEARCH.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- **VOR JEDEM PUSH: `npx tsc --noEmit` UND `npx eslint <geaenderte files>`.** tsc allein reicht NICHT: `@next/next/no-html-link-for-pages` (internes `<a href="/...">` statt `<Link>`) liess in dieser Session den Vercel-Build fehlschlagen, obwohl tsc gruen war. Interne Links IMMER `next/Link`.
- Deploy-Verifikation nur mit Markern, die EINDEUTIG zum neuen Commit gehoeren (geteilte Phrasen -> falsches "ist nicht live"). Vercel-Deploy dauert ~1-3 Min; ein `until curl | grep -q "<unique-marker>"`-Loop wartet zuverlaessig.
- Bei langen Agenten-/Hintergrund-Laeufen alle 15 Min Health-Check.

## Ziel des Strangs
9 Bundesland-Landingpages im Relaunch-Design, jede eigenstaendig fuer Google (kein Doorway/Duplikat),
Impressions der bestehenden Seiten NICHT verlieren. Steiermark ist die Referenz-Vorlage; wenn sie
sitzt -> die anderen 8 + `/webdesign`-Hub ueber dieselbe Basis nachziehen. Vollstaendige Research +
gelockte Entscheidungen: **docs/BUNDESLAND_SEO_GEO_RESEARCH.md** (TEIL 1-6).

## Architektur (steht, wiederverwendbar)
- `components/relaunch/RegionHome.tsx` — Client-Wrapper, komponiert die HOME (HomeMorph -> CasePanels ->
  Regional-Bereich -> FAQ -> HomeClosing -> Footer) mit regionalem Inhalt aus einem `RegionContent`-Objekt.
- `components/relaunch/{HomeMorph,CasePanels,HomeClosing}.tsx` — bekamen optionale Content-Props MIT
  Default = jetziger Wert. Die HOME ruft sie ohne Props -> byte-identisch, KEINE Home-Regression. Nicht kaputt machen.
- `app/relaunch-preview/webdesign-steiermark/page.tsx` — Server-Seite: Metadata + Title/Canonical + eigenes
  H1 (die Home hat keins!) + Schema (WebPage + Service areaServed=Steiermark + BreadcrumbList) + das
  `steiermark: RegionContent`-Objekt. Rendert `<RegionHome region={steiermark} />`.
- Neue Region = nur ein neues `RegionContent`-Objekt + duenne Server-Seite unter `app/relaunch-preview/webdesign-<land>/`.
- Slugs bleiben bestehend (`/webdesign-steiermark` usw., kein Redirect). Preview: noindex + Canonical auf
  Preview-Pfad; beim GO-LIVE Canonical auf Root + index true (ersetzt die alte RegionalLandingPage am selben Slug).

## Stand dieser Session (Steiermark)
Erledigt + LIVE auf v2 (v2.redrabbit.media/webdesign-steiermark):
- Home-basierte Seite mit regionalisiertem Hero/Panels, eigenem H1, Schema, Content-Paritaet (~3126 Woerter).
- Copy neu in Hausstimme (frech, oesterreichisch, subtil-SEO): Hook "Dein naechster Kunde in der Steiermark
  googelt gerade. Sieht er dich?", "Bloed, aber so laeuft es", "schaut-nett-aus", Verfuegbarkeit statt Standort.
- KEIN Standort-Thema (Thomas: nie andeuten, dass wir nicht in der Region sind) — auch aus Meta/OG-Description raus.
- "Frag die KI"-Block wieder RAUS (Thomas: nicht gebraucht).
- Firmen-Karten + Firmennamen (ReRo/Global Insights) aus MEINEM Bereich raus.
- Talos eingebaut (data-talos-station gesture=wave, mobil via data-talos-mobile); Groesse zurueck auf "m"
  (Thomas wollte wie vorher), Textspalte schmal/links (max 600px) -> Text verdeckt Talos nicht mehr.

## OFFEN — genau diese Punkte bearbeiten (Thomas 10.08.)
1. **Talos winkt mit der FALSCHEN Hand und zu schnell/zu oft.**
   - Hand: `components/relaunch/talos/talosMotion.ts` -> `triggerGreeting(arm?: "primary"|"other")`. Default
     "primary" (arm1/Hand2). Gewuenscht: die ANDERE Hand -> "other".
   - Tempo/Haeufigkeit: Winken ist zu schnell und wiederholt sich (re-triggert beim Scrollen). Nur EINMAL,
     langsamer.
   - ACHTUNG: Das ist GETEILTE Talos-Steuerung (`TalosCompanionStage.tsx` ruft die Geste), benutzt auch von
     `/preise` (TalosTalenteFahrt) + `/leistungen/talos`. Es gibt KEINEN per-station-Knopf fuer Hand/Tempo
     (nur anchor/size/gesture/yaw/appear/mobile, siehe scanStations ~Z.253). -> Entweder global aendern
     (dann /preise + /leistungen/talos mitpruefen) ODER sauberer: neue per-station data-attrs einfuehren
     (`data-talos-hand="other"`, `data-talos-wave-once`) und in TalosCompanionStage auswerten.
   - **Kein 3D/WebGL auf der Agent-Seite** (MCP-Chrome webgl2=false) -> Thomas muss jede Talos-Aenderung auf
     seinem Geraet abnehmen. Klein iterieren.
2. **FAQ-Sektion ist falsch designt.** Aktuell der plain `Faq`-Accordion (components/relaunch/Faq.tsx). Thomas
   will es "wie auf den anderen Seiten (Preise oder den anderen)". -> Pruefen, wie `/preise` (PreiseFaq) bzw.
   /leistungen die FAQ rendern, und ANGLEICHEN. Dabei FAQPage-Schema erhalten.
   - **Platzierung:** Thomas: "war die nicht immer weiter unten, sollen wir sie da lassen?" -> FAQ weiter unten
     positionieren (wie auf den anderen Seiten gewohnt), nicht direkt nach dem Regional-Bereich. Mit Thomas kurz
     bestaetigen.
3. **Vertrauenszeile ueberdenken.** Aktuell: "Ein paar steirische Betriebe haben uns frueh vertraut. Die meisten
   sind heute noch da. Rausgeworfen hat uns keiner." Thomas: **negativ + schlecht formuliert, macht das ueberhaupt
   Sinn?** -> Neu formulieren (positiver, anonymer Vertrauens-Beweis ohne Firmennamen) ODER ganz streichen.
   Grundregel: keine Fremd-Firmen-Namen/-Links; positiv, treffend, Hausstimme, kein 0815.
4. **DANN Rollout:** die anderen 8 Bundeslaender + `/webdesign`-Hub ueber die RegionHome-Basis. Je RegionContent
   mit echten Kunden pro Region wo vorhanden (NOE hat Tino Jugler / fliesen-handwerker.net). Kein Staedte-Stuffing.

## Weitere offene Thomas-Entscheidungen
- **KundenGrid (Home-Kundenliste)** nennt ReRo/Global Insights (Namen, keine Links) und erscheint auf jeder
  Region-Seite (geteilte Home-Sektion). Thomas' "keine Fremd-Firmen-Werbung" — gilt das auch fuer diese
  bestehende Namensliste (dann site-weit betroffen) oder nur fuer verlinkte Karten? -> Entscheidung offen.
- **SEO-Keyword-Dichte:** durch Streichen des Staedte-Absatzes/Karten sank graz 30->9, leoben 12->2 (steiermark
  bleibt stark, ~60). Bewusst NICHT wieder gestopft (Thomas will nicht auffaellig-SEO). Falls GSC spaeter bei
  Stadt-Queries ("Webdesign Graz") faellt -> 1-2 natuerliche Erwaehnungen zurueckweben.

## Nicht anfassen / Fremd-WIP (unstaged lassen)
`components/relaunch/SiteClosing.tsx`, `app/relaunch-preview/faq/page.tsx`,
`components/subpages/faq-demo/*`, `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md`.
NIE `git add .`/`-u` — nur eigene Dateien mit explizitem Pfad stagen.

## Relevante Dateien
- components/relaunch/RegionHome.tsx (RegionContent-Typ + Komposition + Talos-Station)
- app/relaunch-preview/webdesign-steiermark/page.tsx (Steiermark-Config, Schema, H1, Metadata)
- components/relaunch/{HomeMorph,CasePanels,HomeClosing}.tsx (prop-faehig, Defaults NICHT brechen)
- components/relaunch/talos/{TalosCompanionStage.tsx,talosMotion.ts,talosRig.ts} (Winkhand/Tempo)
- components/relaunch/Faq.tsx + PreiseFaq (Vorbild-FAQ-Design)
- docs/BUNDESLAND_SEO_GEO_RESEARCH.md (Spec + Research, TEIL 1-6)
- scratchpad/research_bundesland_{technical,geo_llm,migration,ux_text}.md (Volltext-Research)

## Commits dieses Strangs
6282f5c (Landing, ersetzt) -> a6b6596 (home-based) -> c0378e7 (Regional-Block) -> 9fe2b67 (Build-Fix
interne Links) -> 74d9dae (kein Standort + Talos + Frag-die-KI) -> ff2ffd4 (Copy Hausstimme, Frag-die-KI
raus, Talos klein) -> + Talos-Groesse zurueck auf "m".
