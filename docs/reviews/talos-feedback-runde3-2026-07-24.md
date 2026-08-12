# Review — Talos-Feedback-Runde 3, 24.07.2026 (Bilder 27-36)

**Datum**: 2026-07-24 (abends)
**Reviewer**: review-it (fokussiert, token-bewusst): Logic + Design-Fidelity (Security 2x sauber, weggelassen)
**Scope**: Working-Tree ueber Commit 0cf1040 (6 Dateien)
**Verdikt**: GO

## Umgesetzte Feedback-Punkte (Bilder 27-36)
- KOPF schaut immer den USER an (Kamera), nicht die Bildmitte (Bild 28/31). Umbau:
  setHeadYaw(-Koerper-Yaw) im Stand, 0 beim Gehen; Hero: -yaw ausser beim Abgang.
  Empirisch verifiziert (headLocalYaw gleicht bodyYaw aus; visuell Visier zum Betrachter).
- Koerper nur LEICHT angedeutet: STAND_BIAS 0.50->0.24 (0.50 zeigte den Ruecken, Bild 31).
- WerIstTalos: Headline auf einen Satz gekuerzt (war 3 Saetze/60px, "zu viel"; Rest steht
  im Lead), Wrap rr-narrow->rr-wrap (Text weniger mittig), Talos anchor 0.78->0.84 (weiter aussen).
- Faehigkeiten = EXAKTER KundenGrid-Klon: Tipp-/Schreib-Effekt (rAF-State-Machine, Timing
  1:1), Typo/Groesse/Layout desktop+tablet pixelidentisch, Plus-Marker unten rechts
  (Klickbarkeits-Signal), Klick->Modal. (Bild 29/30/35/36)
- FragTalos = IDENTISCH zur Diagnose-Quiz-Sektion, nur Blau statt Teal (Antwortreihen,
  Marker a/b/c, Pfeil, Hover-Sweep, Frage-Kopf, Headline voll). Wert-fuer-Wert abgeglichen. (Bild 34)
- Bug (Bild 33): schwebende Beine im Uebergang Kontrollraum->Beweis. Ursache: back-Layer-Talos
  erschien zu frueh, waehrend der opake Kontrollraum-Frame seinen Oberkoerper verdeckte.
  Fix: Beweis-Station data-talos-appear 0.45. Bug (Bild 32, Ruecken/Ueberdrehung) via Koerper-Reduktion.

## Findings — Accepted & gefixt
- Kommentar (Design-Fidelity): rr-statement "weight 700" -> 500 korrigiert.
- Kommentar (Logic): veralteter centerPull-"zur-Bildmitte"-Satz in talosMotion.ts entfernt.

## Clean bestaetigt
- Logic: Kopf-Kompensation frame-synchron/konsistent, centerPull-API restlos entfernt,
  Tipp-rAF-Loop ohne Leak + kein Render-Konflikt mit dem imperativen textContent-Schreiben,
  Modal-Fokusfalle/Scroll-Lock intakt, alle .ft-*-Overrides treffen echte Klassen, kein Rot
  auf Blau, color-mix gueltige CSS.
- Design-Fidelity: Faehigkeiten desktop+tablet pixelidentisch zu KundenGrid (Mobile bewusst
  groessere Tap-Targets); FragTalos optisch identisch zu Diagnose bis auf beauftragte
  Blau-Transposition + FragTalos-Strukturzwaenge (Fortschrittsbalken, 5 Fragen, kein Replay).

## Manuelle Browser-QA (Fable, aktiver Tab, Frames getrieben)
Kopf-zum-User an Stationen links (SchlussCta) + rechts (Kontrollraum/WerIstTalos/Beweis) + Hero
(headLocalYaw = -bodyYaw, Visier zum Betrachter); WerIstTalos-Komposition; Faehigkeiten-Grid mit
Tipp-Caret + Plus-Marker + Modal-Klick; FragTalos-Quiz-Reihen im Diagnose-Look (blau); Bug-33-
Uebergang sauber (opacity 0). tsc gruen, keine Konsolenfehler.
