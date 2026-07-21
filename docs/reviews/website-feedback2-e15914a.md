# Review — Website-Unterseite Feedback-Runde 2 (Commit e15914a)

**Date**: 2026-07-21
**Reviewer**: review-it skill, 3 parallele Agenten (Logic/Opus, Security/Sonnet, Simplify/Opus)
**Stack**: ui (tsx, css)
**Domain**: keine (reines Frontend, kein Auth/PII/LLM)
**Verdict**: GO (0 CRITICAL, 0 MAJOR)

Autonomer Lauf (Thomas abwesend): Findings wurden nicht interaktiv durchgesprochen,
sondern nach Auftragslage disponiert; Thomas kann jede Disposition kippen.

## Findings — Accepted + gefixt (1)
- `ReferenzenTeaser.tsx:35` — P1 (Simplify) — Eyebrow-Vereinheitlichung war unvollstaendig:
  einzige Live-Sektion ohne `(…)`-`wd-eyebrow`-Stil. Fix im Folge-Commit: `(SCHON GEBAUT)`
  mit `.wd-eyebrow`; DOM-verifiziert (9/9 Eyebrows im Klammer-Stil).

## Findings — Deferred (4)
- Logic MINOR: 3 dauerlaufende WebGL-Loops auf `/dashboard-varianten` (TalosEntranceStage
  rendert ab Mount, inView steuert nur den Auftritt). Fuer die Wegwerf-Vergleichsseite
  toleriert; wenn eine Variante auf die Live-Seite promoted wird, laeuft dort nur 1 Instanz.
- Logic MINOR: `window.__talosEntrance` nicht instanz-namespaced (bestehendes
  TalosEntranceStage-Verhalten, nur QA-Hook betroffen). Vormerkung fuer den Talos-Strang.
- Simplify P3: Klammern der Eyebrows sind Literale im JSX statt `::before/::after`-Content.
  Strukturell robuster, aber 9 Dateien anfassen; verschoben (Vormerkung, verhindert
  kuenftige P1-Wiederholungen).
- Simplify P3: Dashboard-Varianten hardcoden Markenfarben als Hex (#f12032/#1c2837/#23262e/
  #5a5e68). BEIM PROMOTEN der Sieger-Variante auf var(--rr-*) umstellen (Suchen/Ersetzen).

## Findings — Rejected (1)
- Simplify P3 Kommentar-Wording in DreiStufen.tsx (:global-Ursache "Template-String" vs.
  "Custom-Component-Propagation"): Kommentar wird bei naechster Beruehrung praezisiert,
  kein eigener Commit wert.

## Cross-Phase Regressions
- Keine. L-referenzen-03 (rAF-Daempfung), L-referenzen-06 (setTimeout-Cleanup),
  L-leistungen-01/02 explizit geprueft und eingehalten.

## Security
- Keine Findings (>80 Confidence). noindex auf beiden Vorschau-Routen korrekt, Google-G
  inline (kein Hotlink), kein dangerouslySetInnerHTML, keine Secrets.
- Hinweis fuer spaeter: falls `logo`-Feld der Testimonials je aus CMS/User-Quelle kommt,
  URL-Whitelist einziehen. Google-"G"-Markennutzung ist PR-/Rechtsthema, kein Tech-Risiko.
