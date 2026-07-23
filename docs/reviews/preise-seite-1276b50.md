# Review — Preise-Seite (Commits 311c10c..1276b50)

**Date**: 2026-07-23
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic/Security/Simplify)
**Scope**: app/relaunch-preview/preise/page.tsx, components/subpages/PreiseDemoClient.tsx,
components/subpages/preise-demo/*, components/subpages/preise/*.tsx (7 Sektionen)
**Stack**: ui (Next.js App Router, Client-Komponenten, injizierte Vanilla-Engine)
**Domain**: keine (statische Marketing-Seite, kein Auth/Backend/PII-Verarbeitung)
**Verdict**: CONDITIONAL (0 CRITICAL, 1 MAJOR) — MAJOR sofort gefixt in e7454dd

## Findings — Accepted (4)

1. **MAJOR / REGRESSION L-leistungen-02** — `components/subpages/PreiseDemoClient.tsx:44-74`
   `window.__sculptProgress` wurde weder bei Mount initialisiert noch im Cleanup geloescht.
   MorphSculpture liest die Globale MIT VORRANG vor der eigenen progress-Prop; nach
   Soft-Navigation von der Preisseite weg konnte die Figur der Zielseite bis zum
   fonts.ready-Boot in der eingefrorenen Preise-Pose flashen. Konfidenz 82.
   **Fix (e7454dd)**: `__sculptProgress = 0` vor dem Engine-Boot, `delete` im Cleanup,
   Muster 1:1 aus LeistungenHero2Client (dortiger Review-Fix 21.07.).
   **Verifiziert**: Browser-Soft-Nav /preise -> /faq, danach `'__sculptProgress' in window === false`.

2. **P2** — `components/subpages/preise/PreiseMatrix.tsx:25-43`
   Preis-Lookup `PREIS[stufe.name]` gegen die importierten STUFEN-Namen: eine Umbenennung
   in VarianteA.tsx haette still eine LEERE Preiszeile gerendert.
   **Fix (e7454dd)**: fail-closed Modul-Guard, der beim (statischen) Build hart bricht.
   Bewusst weiterhin namens- statt indexbasiert: eine geaenderte Reihenfolge wuerde bei
   Index-Zuordnung einen FALSCHEN Preis zeigen, und falsch ist schlimmer als leer.

3. **P3** — `components/subpages/preise/TalosTalenteFahrt.tsx`
   Magic Numbers ohne Herleitung (105vh je Slide, 10 Riesenwort-Slots).
   **Fix (e7454dd)**: Rechen-Kommentare ergaenzt (690vw Fahrtweg / 140vw je Slot -> 6 noetig,
   10 als Puffer; 5vh Scroll-Puffer je Slide fuer den Sticky-Ausstieg).

4. **P3** — `components/subpages/leistungen/website/v2/stufen-varianten/VarianteA.tsx`
   Der Dateiname liest sich wie ein A/B/C-Experiment, der STUFEN-Export ist aber produktive
   Datenquelle fuer DreiStufenMatrix UND PreiseMatrix.
   **Fix (e7454dd)**: Warnhinweis im Datei-Kommentar (Schutz beim geplanten Varianten-Aufraeumen).

## Findings — Rejected (0)

## Findings — Deferred (1)

- **P3 Beobachtung** — `rr-btn-frame`-Icon-Markup (4x `<i class="cN">`) ist innerhalb preise 3x
  dupliziert, projektweit in 16+ weiteren Dateien identisch kopiert. Kein gemeinsames
  `<RrBtnFrame>`-Bauteil existiert. Ein Fix nur fuer preise waere inkonsistent -> projektweites
  Cleanup-Ticket, nicht Teil dieses Strangs.

## Security

Keine Findings. Geprueft: dangerouslySetInnerHTML-Quellen (ausschliesslich lokale, committete
Dateien, konstante fs-Pfade), Script-Injection im DemoClient (idempotent + Cleanup), JSON-LD
(statisch), Secrets (keine), Telefonnummer (nur im tel:-Href, nie im Klartext), target=_blank,
externe Requests (nur Google-Fonts-CDN).

## Nicht geflaggt (bewusste Projekt-Entscheidungen)

- PreiseDemoClient als 4. fast identischer Wrapper (Tradeoff T-leistungen-01, Fremd-Strang-Regel).
- Der komplette preise-demo-Klon inkl. toter scene-belief/partner/faq-Reste — beide Reviewer
  haben verifiziert, dass demo.engine.jstext BYTE-IDENTISCH zu website-demo ist und alle Guards
  fuer entfernte Sektionen greifen (kein ungeguardeter Zugriff auf fehlende DOM-Knoten).
- plain `<style>`-Tags statt styled-jsx (Projekt-Regel LESSONS_LEARNED.md 23.07.).

## Prozess-Lesson dieser Runde (ausserhalb der Reviewer-Findings)

Der Bau-Agent hat `npm run build` laufen lassen, waehrend der Dev-Server auf Port 9000 lief.
Das ueberschreibt `.next/`, die Chunks liefern danach 404 und React hydratisiert nicht mehr —
die Seite wirkt komplett tot (kein Menue, keine Engine), obwohl der Code fehlerfrei ist.
Fehldiagnose-Gefahr in der QA. Siehe neue Lesson L-preise-02.
