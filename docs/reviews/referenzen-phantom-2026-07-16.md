# Review — Referenzen phantom.land Iteration 2 (Commit c399f0c + Folge-Fixes)

**Date**: 2026-07-16
**Reviewer**: review-it skill, 3 parallel agents (Logic / Security / Simplify)
**Stack**: ui (three.js WebGL, Next 15 App Router)
**Domain**: —
**Verdict**: NO-GO auf c399f0c -> alle Findings gefixt im Folge-Commit (GO)

## Findings — Accepted (alle autonom umgesetzt, Thomas-Loop-Mandat)

- CRITICAL `SphereGallery.tsx` (Logic): `pickCell` ignorierte `camera.zoom` —
  Klicks waehrend Intro (zoom 0.32..1) oder Grab-Zoom trafen falsche/keine
  Zelle. Fix: Frustum um 0 symmetrisch, Koordinaten durch `camera.zoom`
  geteilt.
- MAJOR `SphereGallery.tsx` (Logic): `setTimeout(router.push, 420)` ueberlebte
  den Unmount und konnte eine spaetere Navigation ueberschreiben. Fix:
  `navTimeout` + `clearTimeout` im Cleanup.
- MAJOR `SphereGallery.tsx` (Simplify M1): Texturen wurden bei fonts.ready
  blind doppelt gebacken, Farb-Fallback-Tint pro URL statt pro Projekt
  dupliziert. Fix: Fallback pro Projekt geteilt (beide URL-Keys), Rebake nur
  wenn `document.fonts.status !== "loaded"` beim Mount; Bilder laden sofort.
- MINOR (Simplify m1): unsichtbare Tint-Meshes werden per `visible=false`
  vom Draw ausgeschlossen (~1/3 Draw-Calls gespart).
- MINOR (Simplify m2): Vignette-Uniforms in Shader-Konstanten gefaltet,
  `uDistortion` vec2 -> float.
- MINOR (Simplify m3): `downOnCanvas` entfernt; `wasClick` liest `dragging`
  VOR `endDrag` -> pointercancel kann keinen Ghost-Click mehr ausloesen.
- MINOR (Simplify m4): alle `rf-gal-*`/`rf-talk-*`-CSS-Regeln in EINEM Block
  (GalleryChrome styled-jsx) konsolidiert; page.tsx-Style-Block entfernt.
- COSMETIC c2/c3: `zoom`-State lokalisiert; Video-Naehe-Check nutzt die
  bereits gewrappte Mesh-Position.

## Findings — Deferred

- MINOR (Security): `*.vercel.app`-Referenz-Links (la-morra, almtal, k2)
  sind Plattform-Subdomains -> Link-Hijack-Fenster falls Projekte geloescht
  werden. Mittel-/langfristig auf Kunden-Domains umstellen; URLs stammen
  von Thomas (Freigabe 04.07.). Periodisch pruefen.
- COSMETIC c6: Fallback-Modus zeigt Projekte doppelt (FallbackGrid + SSR-
  Liste). Bewusste Abwaegung: SEO-Liste bleibt; Nutzer ohne WebGL sind
  selten. Nicht geaendert.
- COSMETIC c1/c4/c5 (Alias-Konstanten, indexOf, Einrueckung): bewusst
  belassen (Lesbarkeit/Trivialitaet).

## Bekanntes fremdes Problem (nicht dieser Strang)

- Hydration-Mismatch aus `RelaunchMenu` (`useId`-abhaengige
  `aria-controls`/`id` differieren zwischen SSR und Client). Gehoert der
  Parallel-Session (RelaunchMenu ist fremde Datei); auf allen
  relaunch-preview-Seiten sichtbar (Dev-Overlay "1 Issue").

## Nach dem Review (Thomas-Feedback 16.07., gleicher Folge-Commit)

Sichtbare feine Rasterlinien; Hover-Wash = echter Blur-VERLAUF des Mediums
(8x8-Downscale hochskaliert) statt Flachfarbe; Nummern entfernt; CELL_PX
281 -> 260; 3 Info-Zellen im Raster (Hook-Karten, Klick = DESIGN.md-Panel);
Logo rot; Nav + Let's talk = rr-btn-frame, Karten-CTAs = rr-btn-sweep;
Let's-talk-Karten als Paper-Karten (Layer-Schatten + roter Innen-Balken);
Telefonnummer nur noch hinter "Anrufen"-Button (Dauerregel, Memory).
