# Naechste Session — Relaunch-Unterseiten (Stand 17.07.2026 frueh)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.
- GSD ist installiert (gsd-* Skills/Agents) — Thomas wuenscht GSD fuer groessere Pakete.

## Stand dieser Session (16./17.07., Commits ce02215..6b39451, alle LOKAL auf Branch relaunch, NICHT gepusht)

### Erledigt + verifiziert
1. **Seiten-Netz komplett:** RelaunchMenu (Hamburger) + FooterReassembly auf ALLEN Relaunch-
   Seiten (Start, ueber-uns, kontakt, referenzen, tipps + Artikel, faq, 4 Rechtsseiten).
   Alle Links auf 200 gesweept. Leistungen/Preise zeigen bewusst noch auf die ALTEN
   Live-Seiten (Thomas-Entscheid), FAQ auf die neue /relaunch-preview/faq.
2. **NEU /relaunch-preview/faq:** Template ohne Skulptur, Pinsel-Hero "FAQ.", 14 Fragen
   (wortgleich) in 3 Gruppen, FAQPage-JSON-LD. Von mir browser-verifiziert.
3. **NEU Rechtsseiten** impressum/datenschutz/agb/cookie-einstellungen unter
   /relaunch-preview/ (.rrl-Scope, Texte 1:1, Consent-Logik identisch: Key
   `redrabbit-cookie-consent`).
4. **Startseite:** Firmen-Block ersetzt durch KundenGrid (Typing-Grid der ueber-uns-
   Kundenliste auf Weiss, rotes Chevron -> Referenzen), Typing live verifiziert.
5. **Alle 4 Hero-Titel:** roter Schlusspunkt ("Tipps.", "FAQ.", "Kontakt.", "Ueber uns."),
   Punkt fliegt beim Scatter mit.
6. **TIPPS-UEBERSICHT = 3D-Karten-Tunnel** nach ashleybrookecs.com/work (Thomas' Wunsch,
   1:1 bis auf Schrift/Farben): components/relaunch/TippsTunnel.tsx (ohne GSAP, eigener
   rAF-Loop). Verbindliche Spec mit Original-Zahlen: docs/specs/TIPPS_TUNNEL_SPEC.md
   (aus deren Script extrahiert; Thomas-Video per ffmpeg vermessen, Frames in der
   alten Session-Scratchpad). Kern: Karten an festen seeded Positionen (abwechselnd
   links/rechts), fliegen aus der Tiefe (z -3000 -> +1200), Blur tiefengesteuert mit
   hartem Scharf-Fenster, 1 scharfe + max 1 blurry Karte gleichzeitig, Bilder in
   NATUERLICHEM Format ohne Crop, weisser Info-Kasten schwebt eingerueckt IM Bild,
   neueste Beitraege zuerst. Filter-/Suchleiste fix unten rechts (Navy, eckig,
   Kategorien + Suchfeld mit selbsttippendem Platzhalter, filtert live mit Rebuild).
   Hero-Overlap: Tunnel-Root margin-top:-240vh hinter dem Hero, Hero-Grund wird beim
   Scatter transparent -> erste Karte waechst zwischen den fliegenden Buchstaben.
7. **Tempo (letzter Thomas-Wunsch, umgesetzt):** Hero-Szene 240vh (Scatter 2.3x
   langsamer), 135vh Scrollweg pro Karte, Scrub-Lerp 0.065. Pinsel unveraendert.
   Regler: demo.css .scene-main Hoehe (+ HERO_OVERLAP_VH/LEAD_VH/Root-Margin in
   TippsTunnel.tsx IMMER mitziehen!), rootHeight-Faktor, pS-Lerp.
8. **Review-Fixes:** Engine-Teardown-Guards (isConnected) in allen 4 Demo-Engines +
   Script-Cleanup in allen 4 Demo-Clients (booted-Ref im Cleanup NICHT zuruecksetzen —
   StrictMode!); Telefonnummer ueberall hinter "Anrufen"-Button (Standing-Rule);
   transparenter Hero-Sticky schluckte Karten-Klicks -> .scene-main pointer-events:none,
   nur .painting interaktiv; 13 Artikel-500er gefixt (compileMDX braucht die 4 Custom-
   Tags SimpleAudioPlayer/VideoEmbed/Herold-/RegionComparisonTable).
9. 168/168 Tests + tsc gruen. Letzter Preview-Deploy:
   https://webredrabbitmedia-2p67mp3uc-toms-projects-17d37f0b.vercel.app

### Offen / naechste Pakete (Thomas 17.07.)
1. **ARTIKEL-Detailseiten aufwerten (ZUERST, Thomas-Wunsch):** /relaunch-preview/tipps/[slug]
   ist funktional, aber gegenueber den Live-Artikeln (app/tipps/[slug]/BlogPostClient.tsx)
   fehlen: Sidebar (TOC, LeadCTA, MiniAbout, RelatedArticles), Breadcrumbs, SocialShare,
   ContactForm-Sektion, Article-JSON-LD; und es fehlt ein Wow-Moment (Animations-Effekt
   im neuen Stil — Vorschlag: Scroll-Progress + Reveal im Template-Vokabular). Ziel:
   Feature-Paritaet mit Live + neuer Look. Quelle fuer Features: BlogPostClient.tsx +
   mdx-components.tsx.
2. **PREISE-Seite:** Brief liegt KOMPLETT in brand/PREISE_SEITE_BRIEF.md (autoritativ!
   NUR 950 / 2.900 / ab 4.900 EUR verwenden, NIE 790; Entwurf-zuerst ohne Vorkasse =
   Risiko-Umkehr; Ziel = Anfrage auf kostenlosen Entwurf). Thomas-Entscheidung offen:
   HORIZONTAL scrollend (Ref rabenrifaie.com, Memory project_redrabbit_preisseite_horizontal)
   vs. vertikal im Template. ERST GRILLEN. Skulptur-Kandidat comp3 (Chart).
3. **LEISTUNGS-Seiten:** Live-Struktur = app/leistungen/{webdesign,seo,ki-sichtbarkeit,
   dashboard}. Skulpturen reserviert: comp0 Zahnraeder (Webdesign), comp2 Dokument
   (Content/SEO). Aufbau nach Template-Rezept (docs/SKULPTUREN_REUSE.md).
4. Danach: /tipps + Unterseiten live umziehen (SEO-Metadata/JSON-LD der Live-Seiten
   uebernehmen), Branch pushen NUR auf Thomas-Ansage.
5. Uncommitted fremde Straenge (DESIGN.md, brand/*, Footer/Header, HomeMorph,
   seo-monitor-log) NICHT anfassen/committen.

### Blocker / Risiken / QA-Fallen
- Dev-Server :9000 haengt gelegentlich (curl-Test; Neustart: kill + nohup npm run dev -- --port 9000).
- Chrome-QA: Hintergrund-Tab pausiert rAF KOMPLETT (Tab aktivieren, sonst sehen Messungen
  wie tote Loops aus — zweimal drauf reingefallen!); Zoom pro Origin; Fenster-Minimum
  ~500px (echter 390px-Test nur am Handy); Thomas testet oft parallel im eigenen Tab —
  IMMER eigenen Tab nehmen, seinen nicht anfassen.
- Shell-Hook-Noise "claude native binary not installed" schluckt Output mancher Pipes —
  git/vitest ggf. via python3 subprocess wrappen.
- Agenten sterben am Session-Limit (0 Uhr Wien) — Dateizustand danach per grep verifizieren,
  Arbeit ist meist schon auf Platte.
- Vercel: NIE --prod; Deployment Protection an (Thomas loggt sich am Handy ein);
  .vercelignore enthaelt graphify-out (108MB-Falle).

### Relevante Dateien/Befehle
- Tunnel: components/relaunch/TippsTunnel.tsx + docs/specs/TIPPS_TUNNEL_SPEC.md +
  components/subpages/tipps-hero-demo/ (Hero-Kopplung!).
- Template-Rezept: docs/SKULPTUREN_REUSE.md, docs/UNTERSEITEN_STIL.md,
  Memory reference_ueber_uns_template_rezept (KANONISCH) + project_relaunch_seiten_netz_2026_07_16.
- Artikel-Features: app/tipps/[slug]/BlogPostClient.tsx, mdx-components.tsx,
  app/relaunch-preview/tipps/[slug]/page.tsx, components/subpages/tipps-preview.css.
- Deploy: vercel deploy --yes (Preview). Tests: npx vitest run. Graph: graphify query.
