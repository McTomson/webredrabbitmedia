# Review — Talos-Hero Mobile-Fixes (10eee0c..f6dbaac)

**Date**: 2026-08-08
**Reviewer**: review-it, 2 parallele Agenten (Logic, Simplify). Security uebersprungen (keine Angriffsflaeche: reine Animations-/Rendering-Logik).
**Stack**: ui (React/Three.js), Hero-Choreografie
**Verdict**: GO (nach MAJOR-Fix)

## Kontext
Handy-Hero der Talos-Seite: Poster-Bug (dunkler Fleck steckte im Poster-JPG),
Walk-in versehentlich entfernt (zurueckgeholt), Desktop-No-3D-Fallback pinnte
Dashboard-Frame dauerhaft (entfernt).

## Findings — Accepted (1)
- MAJOR TalosCompanionStage.tsx (applyStations else-Zweig): HERO_MOBILE_DY galt
  nur in applyHero -> Y-Pop (+55) beim Uebergang Hero->Stationen auf Handy.
  FIX f6dbaac: Offset auch im Stations-Fallback anwenden solange Handy-Breite.

## Findings — Deferred (1)
- MINOR (Konfidenz ~65) heroZFor/heroEndFracFor lesen window.innerWidth pro Frame;
  Geraete-Rotation exakt WAEHREND des Hero-Scrollens (Breite kreuzt 700/1180)
  laesst z/x hart springen. Randfall (nur Rotation mitten im Hero-Scroll),
  nicht bei normalem Scrollen. Zurueckgestellt; ggf. hz/endFrac bei Hero-Eintritt
  einfrieren statt pro Frame lesen.

## Findings — Rejected (0)

## Geprueft, korrekt (keine Befunde)
- writeWalkPose setzt position.y absolut -> HERO_MOBILE_DY += driftet nicht.
- Walk-in-Mathe fuer Desktop (endX links) und Handy (endX rechts) stetig, kein Teleport.
- is-dash-Fallback-Entfernung: regulaerer wantFrame-Toggle bleibt konsistent, kein verwaister Toggle/CSS.
- Video-opacity-Gating konsistent mit Poster (kein Naht-/Doppelsetz-Widerspruch).
- Simplify: kein toter Code, keine lohnende Duplizierung; gemeinsamer Codepfad via Vorzeichen/Sentinel.
