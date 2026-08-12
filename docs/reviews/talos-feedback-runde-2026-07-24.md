# Review — Talos-Feedback-Runde 24.07.2026 (Bilder 1-16)

**Datum**: 2026-07-24
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic / Security / Simplify)
**Stack**: ui (React/Next), 3D-Engine (three-spline), css, copy
**Domain**: keine kritische (kein Auth/PII/Payment/DB)
**Scope**: Working-Tree-Aenderungen am Talos-Bereich (10 geaenderte + 4 neue Dateien, ~277 Insertions + 2 Faehigkeiten-Varianten)
**Verdikt**: GO

## Findings — Accepted & gefixt (1)
- MINOR (Simplify): FAEHIGKEITEN-Array byte-identisch in `faehigkeiten-data.ts` UND `Faehigkeiten.tsx` (Drift-Risiko).
  Fix: `Faehigkeiten.tsx` zieht das Array jetzt via `import { FAEHIGKEITEN } from './faehigkeiten-data'`. Duplikat entfernt, Drift strukturell unmoeglich. tsc gruen, Live-Rendering unveraendert (6 Karten).

## Findings — Rejected/Deferred (keine echten)
- Logic: keine Findings >= Confidence 80. Bestaetigt korrekt: Augen-Schreibpfad (blinkOpen/winkOpen, kein TDZ), Nod/Wink-Loop-Arming (idempotent, kein Doppelfeuern), centerPull-Vorzeichen (Koerper 60/-60, Kopf 40/-40, konsistent mit +yaw=rechts), setEyeOpenSided (base.x eindeutig signiert), Hero-Offscreen (halfWidthAt(HERO_Z)), page.tsx-Stations-Attribute.
- Security: Angriffsflaeche sauber. dangerouslySetInnerHTML nur statische CSS-Strings, keine dynamische Injektion, keine externen/unsicheren Links (alle CTAs interne next/link), keine Secrets. Test-Route noindex.
- Simplify (kosmetisch, bewusst so, NICHT geaendert): zwei Schwellen 60 vs 40 (Koerper/Kopf, Feinabstimmung); 4x Feld-Block in den Varianten (lesbar); `.tlfrag-panel` ohne `.rr`-Praefix (funktioniert).

## Unkritische Notizen (Logic, Confidence < 80, keine Aktion)
- `Math.sign(1)`-Faktor in walkPhase-Akkumulation = No-op-Altrest (vorbestehend).
- Nod/Wink-Tween kann bei sehr schnellem Stationswechsel auslaufen (kosmetisch).
- `triggerBow` prueft `greetT` aber nicht `greetBT` (vorbestehend, ausserhalb dieses Diffs).
- A11y (Security-Agent, kein Security-Issue): Modal-Fokusfalle in FaehigkeitenKachel haelt Fokus nicht hart im Dialog. Fuer die vom Kunden gewaehlte Variante nachziehen.

## Manuelle Browser-QA (Fable, aktiver Tab, Frames deterministisch getrieben)
Bild 1 (oben unsichtbar), Haltung-zur-Mitte an allen Stationen (gemessen yaw ±0.30), Verkleinerung (Fuesse),
Nicken (Kopf-Dip 0.16 rad / 10s), Zwinkern (rechtes Auge, Asymmetrie 0.4 / 10s), Kontrollraum-Position,
Beweis-Station, SchlussCta-Richtung, Bug Bild 16 (verwaiste Says-border), FragTalos-Blau + Off-White-Text,
Dashboard-rote-Ueberschrift, beide Faehigkeiten-Varianten (Modal + Accordion). tsc gruen, keine Konsolenfehler.
