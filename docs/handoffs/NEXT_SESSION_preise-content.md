# Naechste Session — Preisseite Inhalt optimieren + brainstormen (2026-08-09)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Auftrag (Thomas 09.08.)
"Wir muessen den INHALT der Preisseite noch optimieren und dazu brainstormen."
=> Diese Session START mit BRAINSTORMING, nicht sofort bauen. Erst Richtung
festlegen (mit Thomas), dann umsetzen. Thomas will mitdenken.

## WICHTIG: Marken-/Marketing-Skills sind PFLICHT (stehen in CLAUDE.md)
- Vor JEDER Marken-/Preis-/Copy-/Conversion-Arbeit ZUERST `brand/README.md` lesen
  (Single Source of Truth: positioning, cult-brand-playbook, messaging,
  decisions-log). Marken-Richtung = Option 3 "fair + selektiv".
- Marketing-Skills VON SELBST einsetzen (nicht warten bis Thomas sie nennt):
  - `pricing` — Preise/Pakete/Tiers/Monetarisierung.
  - `offers` — Angebot/Value-Framing/Garantie/Risiko-Umkehr/Paket-Naming.
  - `cro` — Preisseite "konvertiert nicht" / Seite verbessern.
  - `copywriting` (neu schreiben) / `copy-editing` (bestehende schaerfen).
  - `marketing-psychology` — Anchoring/Social Proof/Framing.
  - ggf. `site-architecture` (Seiten-Hierarchie) falls Struktur zur Debatte steht.
- Diese Skills sind zum AUFBAUEN + fuer EINMALIGEN Audit da — NICHT um in
  `brand/decisions-log.md` festgezurrte Entscheidungen dauernd neu aufzurollen.
  Neue Erkenntnisse datiert in decisions-log.md, dann festzurren.

## Stand: Preisseite Struktur (diese Session b9a6a1e schon erledigt+live)
- Buchbare Zusatz-Module RAUS. Zusatzleistungen = "auf Anfrage".
- Alle Preise "ab": Starter ab 1.250 EUR / Business ab 2.850 EUR / Premium ab 4.900 EUR.
  (PREIS-Map in PreiseMatrix.tsx). NIE wieder 790/950/2.900 — alte Werte.
- "1-2 grafische Vorschlaege" statt "ein Entwurf" site-weit.
- 40 % Anzahlung: in der relaunch-AGB (app/relaunch-preview/agb/page.tsx, §2/§4).
- Ablauf-Botschaft: unverbindliche Anfrage -> 1-2 Vorschlaege ohne Vorkasse ->
  gefaellt es -> Auftrag -> konkretes Angebot -> 40 % Anzahlung.
- FAQ-Preise korrigiert (950/2.900 -> 1.250/2.850).
- Entscheidung dokumentiert: brand/decisions-log.md (Eintrag 2026-08-08).

## Relevante Dateien (Preisseite)
- Route: `app/relaunch-preview/preise/page.tsx` (MehrwertRechner ENTFERNT/ungenutzt).
- Bausteine: `components/subpages/preise/`
  - `PreiseMatrix.tsx` — Paket-Matrix + PREIS-Map + Badge + Intro/Custom-Note.
  - `RisikoBand.tsx` — Risiko-Umkehr-Band (1-2 Vorschlaege, ohne Vorkasse, 40 %).
  - `PreiseFaq.tsx` — FAQ (4 Antworten ueberarbeitet).
  - `TalosTalenteFahrt.tsx` — jetzt NUR schlankes Talos-Intro-Panel (Module raus;
    3D-Station + "135 Jahre Erfahrung" bleiben).
  - `BetreuungFoerderung.tsx`, `FloatingReview.tsx` — weiter aktiv.
  - `MehrwertRechner.tsx` — VERWAIST (nicht mehr importiert). Kandidat fuer Aufraeumen.
- AGB: `app/relaunch-preview/agb/page.tsx` (relaunch, hat 40 %).

## Offene Content-Flags (fuer die Optimierung mitnehmen)
- CTA-Text "Kostenlosen Entwurf holen" existiert noch in `components/relaunch/
  SiteClosing.tsx` (Default, FREMD-WIP — nicht anfassen ohne Abstimmung) und
  `app/preise-preview/page.tsx`. Inkonsistent zur neuen "1-2 Vorschlaege"-Sprache
  UND "kostenlos"/"gratis" ist in sichtbarer Copy unerwuenscht. Mit Thomas klaeren.
- LEGACY-LIVE-AGB `app/agb/AGBClient.tsx` hat die 40 %-Klausel NICHT (bewusst
  nicht angefasst = sofort geltende Rechtstexte). Mit Thomas klaeren ob nachziehen.
- Kosmetik offen: `<circle> r NaN` in LighthouseCarousel/CasePanels guarden.

## Deploy / Branch
- Branch `relaunch`, live auf v2.redrabbit.media (git push -> Auto-Deploy via
  post-commit-Hook; `git push` sagt oft "up-to-date", weil der Hook schon gepusht
  hat — mit `git ls-remote origin relaunch` gegen HEAD pruefen). NIE `vercel --prod`.
- Deploy-Verifikation: `vercel inspect <url>` (Status ● Ready + v2-Alias). SSR-
  Signal im HTML pollen wo moeglich; JS-only-Changes ueber Build-Timing/Status.

## Standing Constraints
- NIE `git add .`/`git add -u` — nur eigene Dateien mit explizitem Pfad stagen.
- UNTRACKED-WIP-FALLE: `components/relaunch/talos/TalosChoreoStage.tsx` +
  `TalosApproachStage.tsx` + `talosMoodMotion.ts` sind untracked WIP -> NIE
  mitcommitten (brechen den Vercel-Build: "Cannot find module ./talosMoodMotion").
  Vor jedem add `git status --short` pruefen.
- FREMD-WIP nicht anfassen: `app/relaunch-preview/faq/page.tsx`,
  `components/relaunch/SiteClosing.tsx`, `components/subpages/faq-demo/demo.body.html`,
  `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md`.
- Keine Emojis. Echte Umlaute in User-Content, ASCII in Shell/Commits/Code.
- Kein "gratis" in sichtbarer Copy. Telefon nur hinter Anruf-Button.
- Commit-Trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
  `Claude-Session: https://claude.ai/code/session_01DW1kafYLq21SHob1YFsbkZ`.
- Visuelle Fixes erst "fertig" wenn auf Thomas' Geraet bestaetigt.

## Erledigt kurz vor Session-Ende (Talos, live)
- Talos-Figur wieder sichtbar auf allen Plattformen (same-origin Szene+WASM).
- Handy-Feinschliff Talos-Leistungsseite: Hero-Figur tiefer; Schluss-CTA-Talos
  erscheint jetzt auch mobil (kleiner, rechts, verbeugt sich) via neuem
  `data-talos-mobile`-Opt-in. Temp [RRTALOS]-Logs entfernt.
