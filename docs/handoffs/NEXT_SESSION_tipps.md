# Naechste Session — Tipps-Seite (30.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session (29.07. abends — Kontakt-Seite KOMPLETT umgebaut)

### Erledigt + verifiziert (Commits 9d46e61, 26ceaec, d1b5c8e auf `relaunch`, gepusht, Vercel Ready, live auf v2 verifiziert)
- Kontakt-Seite neu: Formular im Hero neben der Gluehbirne (faehrt ein + Pflicht-Stopp via
  `window.__rrDynamicSnapTops`, distanz-gegated), Kontaktdaten-Bumper (Red Rabbit GmbH,
  **Grabnergasse 8/8** — Impressum ist autoritativ, layout.tsx-Schema sagt noch falsch "8"),
  rotes "(Was hier nicht passiert)"-Raster + alte Schluss-CTA-Sektion ENTFERNT, FAQ neu
  (6 Fragen inkl. "Agentur unter der Leitung von Thomas Uhlir MBA"), Mobile-Andocken der
  Gluehbirne (.sculpt-layer.docked), echtes h1, FAQ-Sektion volle Viewport-Hoehe,
  SiteClosing OHNE compact (Thomas: grosse Homepage-Variante).
- 3-Agenten-Review gelaufen: `docs/reviews/kontakt-hero-formular-2026-07-29.md` (GO;
  1 MAJOR als dokumentierter Trade-off deferred: sehr starker Dauer-Wisch kann den
  Formular-Stopp ueberspringen — nur am Geraet beurteilbar).
- Details: Claude-Memory `project_kontakt_hero_formular_2026_07_29.md`.

### Naechstes Ziel: /relaunch-preview/tipps ueberarbeiten
Stand der Seite (aus Code gelesen, NICHT im Browser verifiziert — zuerst anschauen!):
- `app/relaunch-preview/tipps/page.tsx`: Hero aus `components/subpages/tipps-hero-demo/`
  (Titel-Anschnitt + Malen, OHNE Skulptur, via `TippsHeroClient`), dann `TippsTunnel`
  (3D-Karten-Tunnel der Blogartikel, Vorbild ashleybrookecs.com/work), SiteClosing + Footer.
  Artikel kommen aus `getAllPosts()` (`lib/blog/posts`), nur status published.
  Artikel-Detailseiten `[slug]` nutzen das aeltere rrt-*-Layout unveraendert.
- Metadata: noindex (WIP-Standard), CSS `components/subpages/tipps-preview.css`.
- Was Thomas an der Seite stoert, hat er noch NICHT gesagt — ZUERST die Seite im Browser
  komplett durchscrollen (Desktop + Mobile), Zustand zeigen/festhalten, dann mit ihm
  klaeren was umgebaut werden soll. Nicht vorab umbauen.

### Offene Punkte aus der Kontakt-Session (NICHT automatisch miterledigen)
- Thomas-Handtest Kontakt am echten Geraet: Stopp-Gefuehl, starker-Wisch-Skip,
  Wheel im intern scrollbaren Formular-Fenster (schmale Viewports).
- Echter Formular-POST nie ausgeloest (wuerde echte Anfrage-Mail senden) — Thomas drueckt selbst.
- Deferred Review-Findings: consent + message serverseitig im /api/contact-Schema
  (Route mit Live-Site geteilt!), Adresse "Grabnergasse 8" -> "8/8" projektweit in den
  Schemas angleichen, Ue-Punkt-Totcode template-weit (zusammen mit ueber-uns) entfernen.
- Kontakt noindex/canonical-Entscheidung weiter offen.

### Blocker / Risiken
- Branch `relaunch` ist GETEILT: vor Arbeit `git fetch` + `git log -15`; nur eigene Dateien
  gezielt stagen (KEIN `git add -A` — ~74 fremde untracked WIP-Dateien im Tree).
- Dev-Server Port 9000 (`npm run dev -- --port 9000`); friert er ein (alle Routen Timeout):
  Prozess killen + neu starten, nicht an einzelner Route debuggen. KEIN `npm run build`
  bei laufendem dev-Server.
- QA: Chrome-Extension-Tab hat FIXEN Viewport 1800x807 (resize wirkt nicht) und drosselt
  rAF im Hintergrund (Engine wirkt eingefroren). Fuer Mobile-/Viewport-QA: python3 +
  playwright headless (installiert, `~/.local/bin/playwright`, Muster in Session-Scratchpad
  bzw. Review-Log). Lenis-Snap ist synthetisch NICHT testbar (docs/lessons.md L-referenzen-02).

### Relevante Dateien/Befehle
- `app/relaunch-preview/tipps/page.tsx`, `components/relaunch/TippsTunnel.tsx`,
  `components/subpages/tipps-hero-demo/`, `components/subpages/TippsHeroClient.tsx`,
  `components/subpages/tipps-preview.css`, `lib/blog/posts`.
- `npx tsc --noEmit` vor jedem Commit (>120s, im Hintergrund).
- Push auf `relaunch` -> Vercel-Preview v2.redrabbit.media (~3-4 Min); erst bei
  `vercel ls --yes` = Ready UND Live-Check mit EINDEUTIGEM Marker als live melden.
