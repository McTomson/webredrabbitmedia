# Review — Talos-Pivot "Kommandozentrale" (Working Tree, vor Commit)

**Date**: 2026-08-07
**Reviewer**: review-it skill, 3 parallele Agenten (Logic / Security / Simplify)
**Stack**: ui (Next.js 15, Server Components + 1 Client-Quiz), css
**Domain**: Marketing-Copy, JSON-LD, Wettbewerbs-/Preisaussagen
**Scope**: page.tsx (Sektions-Umbau), 5 neue v2-Sektionen (KennstDuDas, Bereiche,
WertAnker, VorherNachher, TalosTest) + bereiche-data.ts, Copy-Aenderungen in
WerIstTalos/Kontrollraum/demo.body.html, +~220 Zeilen talos-v2.css
**Verdict**: GO (nach Fixes; der einzige CRITICAL entstand DURCH einen
Review-Fix und wurde sofort behoben)

## Findings — Accepted / Gefixt (6)
- CRITICAL Bereiche.tsx:44 — JSX-Kommentar INNERHALB des `{cond && (...)}`-
  Ausdrucks eingefuegt (waehrend des Reviews, beim Einarbeiten des
  Security-Findings) -> Build brach. Fix: Kommentar vor den Ausdruck gezogen.
  tsc danach gruen.
- LOW/MAJOR-vor-Go-Live (Security) — Badge "Das hat sonst keiner" +
  "Konkurrenz weiss nicht einmal" = woertliche Spitzenstellungsbehauptung,
  UWG-angreifbar (KI-Sichtbarkeits-Tools existieren am Markt). Fix: "Das hat
  sonst fast keiner" + "denkt daran meist nicht einmal".
- MINOR (Simplify) — tl-br__grid/tl-vn__grid: #e4e4e0 hartkodiert ->
  var(--rr-line) (Konvention der Datei).
- MINOR (Simplify) — WertAnker "&euro;"-Entity inkonsistent -> literales €.
- MINOR (Simplify) — page.tsx-Header-Kommentar beschrieb den ueberholten
  Geruest-Stand -> auf Pivot-Stand 07.08. neu geschrieben.
- COSMETIC (Logic/Simplify) — tl-vn__col--after (gesetzt, nie definiert)
  entfernt; .tl-qz__btn{cursor:pointer} redundant -> entfernt (Klasse im
  TSX belassen, schadet nicht — nur die CSS-Regel entfiel).

## Findings — Rejected (0)

## Findings — Deferred (2)
- Totes CSS: kompletter tl-ink-*-Block (~140 Zeilen, InklusiveDashboard)
  bleibt vorerst — Aufraeum-Etappe zusammen mit den verwaisten Dateien
  InklusiveDashboard.tsx + TalosHeroPlaceholder.tsx (im page.tsx-Kommentar
  vorgemerkt). Grund: Thomas hat den Sektions-Stand noch nicht abgenommen;
  vor Abnahme nichts loeschen.
- Randnotiz Security: TalosFaqV2 "WordPress ... mehr nicht" (Bestand, nicht
  Teil des Diffs) — bei Gelegenheit zu "viel mehr nicht" abschwaechen.

## Bestaetigt sauber (Auszug)
- Stations-Kette des 3D-Companions intakt (DOM-Reihenfolge WerIstTalos ->
  Kontrollraum -> FreigabePrinzip -> Beweis -> FragTalos -> SiteClosing).
- TalosTest-State-Machine ohne Out-of-bounds, reduced-motion abgedeckt,
  kein Nutzer-Input verlaesst den Browser.
- JSON-LD ohne aggregateRating/review (Rating-Ehrlichkeits-Regel).
- WertAnker-Marktpreise als Groessenordnung ("ab/rund") formuliert, Summe
  konservativ gerechnet (real ~2.580 EUR/Jahr, behauptet "ueber 2.000").
- Design-Standard vollstaendig eingehalten (radius 0, Marken-Farben/-Fonts,
  nur rr-btn-sweep/rr-btn-outline, Fugen-Raster 1:1 wie KundenGrid).

## Cross-Phase Regressions
Keine (rAF-Damping-, Lenis-QA- und dvh-Canvas-Lessons geprueft, nicht
einschlaegig — neue Sektionen sind statische Flow-Sections).
