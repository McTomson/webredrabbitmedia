# Review — Preise-Umbau + Talos-3D-Companion (2026-07-24, uncommitted Working Tree)

**Date**: 2026-07-24
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic, Security, Simplify)
**Stack**: ui (Next.js App Router, tsx), client-side rAF/3D (three-spline)
**Domain**: marketing/pricing page (kein Login/DB/Payment/PII)
**Verdict**: CONDITIONAL -> nach Fixes GO (1 MAJOR + 1 MEDIUM behoben, kein CRITICAL)

## Scope
9 geaenderte + 2 neue Dateien: page.tsx (Verdrahtung + Companion-Mount), TalosCompanionStage.tsx
(neuer stationsOnly-Modus, GETEILT mit Talos-Leistungsseite), TalosTalenteFahrt.tsx (Umbau),
Bumper.tsx (neu), MehrwertRechner.tsx (neu), PreiseDemoClient.tsx, demo.css, RisikoBand/
PreiseMatrix/PreiseSchlussCta/BetreuungFoerderung.tsx.

## Findings — Accepted + Fixed (4)
- **MAJOR (Logic) — Mobile-Stapelreihenfolge gekippt.** `demo.css` `.text-col{order:-1}` galt
  seitenweit -> auf <768px landete der Text im 44vh-Track (statt auto), `.text-window` (46vh)
  waere uebergelaufen. FIX: `.text-col{order:0}` in der Mobile-Media-Query, order:-1 wirkt nur
  Desktop.
- **MEDIUM (Simplify) — doppelte `id="rechner"`.** page.tsx-Wrapper-Div + MehrwertRechner-Section
  trugen beide die id (ungueltiges HTML, Anker traf den Wrapper). FIX: Wrapper-Div entfernt,
  Section-id reicht.
- **LOW/MED (Simplify) — Namenskollision `ScrollBumper`.** Bumper.tsx hatte eine interne Funktion
  gleichen Namens wie components/subpages/leistungen/ScrollBumper.tsx. FIX: intern zu
  `KineticStack` umbenannt.
- **MINOR (Logic) — is-dash/reduced-motion nicht stationsOnly-gegated.** Der reduced-motion-
  Load-Block setzte Talos auf die Hero-Position + opacity 1 — in stationsOnly (Preisseite ohne
  Talos-Hero) falsch. FIX: `if (reduced && !stationsOnly)` + Error-Pfad-is-dash gegated. Talos
  bleibt auf der Preisseite unter reduced-motion unsichtbar (statisches Wortmarken-Wort traegt).

## Findings — Deferred (2, LOW, optional)
- Sticky-Scroll-Progress-Muster (`p = clamp01(-r.top/(r.height-innerHeight))`) dupliziert zwischen
  Bumper.tsx und TalosTalenteFahrt (und CasePanels/leistungen-ScrollBumper). Extraktion in einen
  `useScrollProgress`-Hook nur lohnend, wenn das Muster weiter ausgerollt wird. Belassen.
- Identisches Link-CSS `.tf-static__link` / `.tf-slide__link` in TalosTalenteFahrt. Winziger
  Gewinn. Belassen.

## Sauber bestaetigt (keine Aenderung)
- stationsOnly-Gate: alle #sceneMain/__sculptProgress-Lesestellen gegated; Default false laesst
  die Talos-Leistungsseite unveraendert (verifiziert: talos-leistungen liefert weiter 200).
- window-Globale (__talosCompanion vs __sculptProgress) getrennt, PreiseDemoClient raeumt auf
  (Lesson L-leistungen-02 eingehalten).
- rAF rein scroll-abgeleitet (kein Per-Frame-Drift, L-referenzen-03 ok).
- Security: keine Luecken. dangerouslySetInnerHTML rein statisch (fs.readFileSync lokaler Dateien),
  keine Secrets, CTAs intern, tel:-Link konform.
- styled-jsx-Regel ueberall eingehalten (plain <style> + Praefix-Klassen).

## Offene Nicht-Code-Punkte (Thomas)
- **Bewusster Tradeoff dokumentiert:** Der Talos-3D-Companion haengt an einer externen Spline-
  Szene (`prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode`, `@splinetool/loader`). Externe
  Runtime-Abhaengigkeit, kein SRI moeglich; graziler Fallback (no3d-Poster bei WebGL2/RAM-Mangel).
  Gilt jetzt auch auf der Preisseite.
- **Copy-Flags (Brand/Recht, kein Code-Bug):** (1) SchlussCta "ohne Risiko" ist eine starke
  Absolutaussage, durch das Vorkasse-freie Modell gedeckt; bei Einfuehrung einer Bindung neu
  pruefen. (2) Rechner-Basisvergleich "klassisch ~950" faellt zufaellig mit dem echten Starter-
  Preis 950 zusammen (verschiedene Dinge) — evtl. den Vergleichsanker anders setzen.
- **Visuelle Abnahme + 3D-Figur-Position** (anchor .78 / size l / appear .4) stehen noch aus
  (Thomas auf seinem Schirm).
