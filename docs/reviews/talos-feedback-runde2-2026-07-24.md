# Review — Talos-Feedback-Runde 2, 24.07.2026 (Bilder 17-26)

**Datum**: 2026-07-24 (nachmittags)
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic / Security / Simplify)
**Stack**: ui (React/Next), 3D-Engine (three-spline), css
**Domain**: keine kritische
**Scope**: Working-Tree ueber Commit 09b240a (Faehigkeiten neu, FragTalos neu, Engine-Konstanten, Loeschungen)
**Verdikt**: GO

## Umgesetzte Feedback-Punkte (Bilder 17-26)
- Koerper DEUTLICH zur Bildmitte: STAND_BIAS 0.30->0.50. Empirisch verifiziert (bei 0.70 klar
  Richtung Mitte -> Vorzeichen war korrekt, nur zu subtil). An allen Stationen live geprueft
  (rechts yaw -0.50, links +0.50 = zur Mitte).
- Kopf schaut nicht mehr in die Luft: targetPitch = clamp(0.05 - pointerY*0.1, -0.04, 0.2).
  Selbst bei Maus ganz oben nur -0.04 (praktisch waagerecht) statt vorher -0.18.
- SchlussCta: weiter rein (anchor 0.08->0.17) + kleiner (neue Groesse sm=-200).
- FragTalos-Talos stand HINTER dem Blau (Bild 18): Station layer back->front, size m, anchor 0.82.
- Frag-mich als Quiz-Look in BLAU (Diagnose.tsx-Vorbild): weisse Panel-Box weg, Antwortreihen
  durchscheinend+umrandet auf Blau, Off-White-Text, Tuerkis-Marker/-Fortschritt, Start-Button
  Off-White (kein Rot auf Blau); Komposition harmonischer (kleinere Headline, linke Spalte).
- Faehigkeiten wie das Firmen-Grid (KundenGrid): 3-Spalten weisse Zellen, Hairline-Fugen,
  nur Name je Zelle, Klick -> Modal mit Funktion + CTA. Sonderanfertigung navy.

## Findings — Accepted & gefixt
- MINOR (Simplify): stale Header-Kommentar in faehigkeiten-data.ts (nannte geloeschte Varianten) -> korrigiert.
- MINOR (Simplify, A11y): role="listitem" auf <button> ueberschrieb Button-Rolle -> role="list"/"listitem" entfernt, Zellen sind wieder echte Buttons.

## Findings — Cosmetic, bewusst gelassen
- 2 redundante CSS-No-ops in FragTalosAnmoderation (.ft-start border-color transparent; .ft-choice Ruhe-box-shadow none) — harmlos, kein Churn.
- Modal-Feld-Bloecke koennten per map() verdichtet werden (lesbar so, optional).

## Clean bestaetigt
- Logic: Modal-Scroll-Lock/Fokusfalle/Listener korrekt; ALLE .ft-*-Overrides treffen echte
  FragTalos-Klassen (kein Rot bleibt auf Blau); Pitch-Klemmung vorzeichenrichtig; SIZE_Z konsistent.
- Security: reines Client-UI, keine dynamische HTML-Injektion, keine Secrets, interne Links.
- Simplify: keine verwaisten Referenzen nach Loeschung der Varianten; kein Over-Engineering.

## Manuelle Browser-QA (Fable, aktiver Tab, Frames deterministisch getrieben)
Haltung zur Mitte (WerIstTalos/FreigabePrinzip/Kontrollraum/Beweis/FragTalos/SchlussCta),
Kopf-Klemmung (Maus-oben-Simulation -0.04), SchlussCta rein+kleiner, FragTalos vor Blau +
Quiz-Antwortreihen live (Off-White auf Blau), Faehigkeiten-Grid + Modal-Klick. tsc gruen, keine Konsolenfehler.
