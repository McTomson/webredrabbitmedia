# Naechste Session — relaunch (Stand 2026-07-05 nachts, LAUFENDE Session-Fortsetzung)

## FUER OPUS 4.8 (falls Fable 5 ausfaellt): Du uebernimmst AUTONOM, ohne Rueckfragen.
Tomson-Auftrag: alle 5 Morph-Szenen 1:1 identisch zu all-turtles.com, testen im Browser,
loopen bis fertig. Regeln unten strikt befolgen; bei Design-Zweifeln NICHT improvisieren,
sondern gegen Original-Daten/Overlays verifizieren (die Werkzeuge dafuer existieren alle).

## WAS BEREITS FUNKTIONIERT (nicht neu bauen, nicht anfassen)
1. **Extraktion (BEWIESEN, IoU 0.975-0.996 an den Halte-Frames):**
   `tools/extract-at-shapes.py comp_N` -> `lib/relaunch/morph/at-shapes-comp{1..5}.json`.
   Verifikation: `python3 tools/verify-at-shapes.py comp_N` (Simulation vs lottie-web-GT,
   Overlays im Scratchpad). Erkenntnisse eingebaut: Keyframe-t = COMP-Zeit (st ignorieren!),
   Easing ueberall cubic-bezier(0.6,0,0.4,1) = masterEase, Slot = eigener Ankunfts-Keyframe,
   "Kamera" = animierter Null-Parent (Pan+Zoom 100->55%) als separater Track, ip/op =
   Reveal-Fenster, Rotationen UNWRAPPED (nie normalisieren), 23 Layer mit Flip (sy<0).
2. **Szene 0 (Zahnraeder) 1:1 in der Engine:** stage.ts + HomeMorph.tsx spielen comp_1 ab
   (Entry->Slot, Original-Timing, Kamera-Wrapper). Wortmarke: Ruhe->Kontraktion->Burst->
   Abflug ueber den Rand. at-Teile erscheinen erst mit Flugbeginn (Original-Cut-Trick
   braucht comp_0-Burst als Deckung, den wir nicht haben). Live-QA: Standbild vs Original-
   Frame f_0022 strukturgleich; Formation-Groesse bei 1440x900 pixelgleich (554px vs 555px).
3. **Typografie:** Statements/Claims = Crimson Pro w500 (Heldane-Doppelgaenger, at-Messung:
   4.46vw, lh 1.11, ls -1%); Eyebrow = Instrument Sans uppercase; Fraunces nur Wortmarke.
4. **Farbtupfer (Tomson):** genau EIN laengliches comp_1-Teil in Dunkelblau #1C2837 (navyIdx
   in HomeMorph).

## WORAN GERADE GEARBEITET WIRD (Stand beim Schreiben)
- Ein Opus-Agent baut nach detaillierter Spec die Szenen 1-4 auf 1:1 um (at-shapes-comp2..5):
  Harte Schnitte wie im Original (Szene-s-Teile verschwinden am Cut, Szene-s+1-Teile stehen
  ab Cut sichtbar an ihren Entry-Positionen = exakt wo die Vorgaenger-Formation stand ->
  nahtloser Morph-Eindruck), GLOBALES Canvas-Mapping X(xN)=(xN-0.5)*1920*k mit
  k=min(vw/1920, vh/810), 5 Kamera-Wrapper, ip/op-Reveal-Fenster, Perf via visibility:hidden.
  Szenen-Fenster: Szene 0 Build [0.45, 2.3], Cut 2.7; Szene s>=1: Build [1.7+s, 1.7+s+0.75],
  Cut 1.7+s+1. Details siehe Git-Log/stage.ts-Kommentare nach Merge.
- Danach offen: voller QA-Loop (siehe unten), Tomson-Video, Push.

## QA-WERKZEUGE (alle erprobt, benutzen statt neu erfinden)
- Dev: `npm run dev -- --port 9000`, Seite: http://localhost:9000/relaunch-preview
- Headless: `agent-browser --session X open URL`, `set viewport 1440 900`, `eval`, `screenshot`.
  ACHTUNG Lenis-Smooth-Scroll: window.scrollTo 2-3x mit 0.5-1s Abstand setzen + 3-4s warten,
  sonst Screenshots mitten in der Lerp-Fahrt. Scroll-Formel: y = (u/6.7) * (trackHeight - vh),
  track = erstes div im body. Szenen-Holds: u=2.55 (Zahnraeder), 3.55 (Birne), 4.55 (Dokument),
  5.55 (Chart), 6.35 (Kopf). Bewegungs-Video: record start/stop + WheelEvents dispatchen.
- Referenz-Frames: ~/dev/at-reference-videos/frames-original/ (f_0022=Zahnraeder-Hold).
  Original live: all-turtles.com (gleiche Viewport-Groesse verwenden!).
- Overlay-Vergleich (Python/PIL): Rot-Maske (r>120, r-g>50, r-b>50), IoU; Beispiele im
  Scratchpad dieser Session und in tools/verify-at-shapes.py.
- Lottie-Quelle (NUR lesen): ~/dev/at-reference-lottie/anim_0.json

## ARBEITSREGELN (verbindlich)
- NIE raten — immer verifizieren (Messdaten/Overlays/Browser). Fail-closed.
- Sub-Agenten: Opus fuer Mechanik NUR mit ausgekauter Spec (jede Entscheidung vorgeben);
  Sonnet fuer Mess-/Massenarbeit nach bewiesenem Muster; Ergebnisse IMMER reviewen (Code +
  Browser). Nach jedem Agenten-Merge: tsc + Live-Check.
- Tomson fragen NUR bei echten Design-Entscheidungen; sonst autonom loopen. Visuelle
  Entscheidungen als Bilder vorlegen.
- Commits: conventional, regelmaessig; Push auf origin/relaunch am Ende jedes Meilensteins.
- Session-Abschluss via session-end Skill; brand/decisions-log.md datiert pflegen.

## OFFENE PUNKTE / RISIKEN
- comp_2 Mid-Flug-IoU 0.898 (Gate 0.90): Restrauschen grosser Rotations-Sweeps, kein
  Strukturfehler. Bei sichtbaren Artefakten in Szene 1: v-overlay-comp_2-17.png ansehen.
- Mobile/narrow: globales Mapping zentriert nicht mehr pro Szene — nach Desktop-Abnahme
  pruefen und ggf. per Szenen-Wrapper-Offset zentrieren (Cut-Pop auf mobile akzeptiert).
- Copyright at-Teilformen + Heldane: Uebergangsloesung, dokumentiert in brand/decisions-log.md
  (04./05.07.) — WIEDERVORLAGE vor Launch (eigene Teile / Font-Kauf-Frage).
- Spaeter-Liste: B2B-Logos/Schrift, Footer-Detail-Typografie, Case-Panel-Schriftpositionen,
  Case-Panel-Auswahl (Tomson), "Red Rabbit Methode", Kugel-Texturen.
