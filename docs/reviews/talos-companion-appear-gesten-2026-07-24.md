# Review — Talos-Companion Erscheinen/Groesse/Cut/Doppelklick-Gesten (staged ueber 249b190)

**Datum**: 2026-07-24 (nachts)
**Reviewer**: review-it, 2 parallele Agenten (Logic + Simplify; Security bei reiner
Companion-Animation ohne Datenflaeche weggelassen, wie Runde 3)
**Stack**: ui (tsx)
**Scope**: app/relaunch-preview/leistungen/talos/page.tsx +
components/relaunch/talos/TalosCompanionStage.tsx
**Verdikt**: GO (nach Fix des einen konvergenten Findings)

## Umgesetzte Feedback-Punkte (Thomas, Bilder 46-52)
- Talos erscheint erst am Kontrollraum wieder: FreigabePrinzip- + FragTalos-Station
  entfernt (Talos verschwindet dort, opacity 0 per QA bestaetigt).
- Eine Spur kleiner: SIZE_Z m -70->-150, l 110->40.
- Body-Cut beim Rechts-Bewegen behoben: Beweis layer back->front (kein Navy-Frame-Cut
  mehr im Uebergang Kontrollraum->Beweis, QA-Screenshot: voller Koerper).
- Doppelklick auf Talos -> zyklische Geste (Winken/Nicken/Zwinkern/Verbeugen/anderer Arm)
  via window-dblclick + projizierte Trefferbox (Canvas ist pointer-events:none).

## Finding — Accepted & gefixt (konvergent 2/2)
- MAJOR (Logic) / MINOR (Simplify): dblclick-Trefferzone pruefte nur X (horizontaler
  Streifen), nicht Y -> Kommentar "wirklich auf Talos" ueberzeichnet; Doppelklick zum
  Wort-Markieren in Talos' X-Spalte haette eine Geste ausloesen koennen.
  FIX: echte X+Y-Trefferbox (horizontal ~±17% Breite, vertikal ~±42% Hoehe), Kommentar
  praezisiert. QA: Klicks oben/unten in der X-Spalte werden jetzt abgelehnt, mittig auf
  Talos loest aus.
- MINOR (beide): Magic `botBase.py + 90` unkommentiert -> Kommentar "~Torso-Hoehe" ergaenzt.

## Clean bestaetigt
- Kamera-X-Projektion korrekt (camera.project inkl. CAM_POS x=30-Offset).
- Kein Closure-Race (Handler gated hart auf loaded); Listener sauber im teardown entfernt.
- Kein toter Code (triggerNod/setNodLoop weiter genutzt; FreigabePrinzip/FragTalos weiter
  als normale Komponenten gerendert).
- Kein Teleport/Flackern durch entfernte Stationen (opacity<0.05-Reset-Pfad intakt).
- SIZE_Z-Verkleinerung ohne Clipping-Nebenwirkung.
- dblclick-Ansatz angemessen (nicht ueberkomplex); GESTURES-Array idiomatisch.
