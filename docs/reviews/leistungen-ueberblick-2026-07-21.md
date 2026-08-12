# Review — Leistungen-Strang (uncommitted, 21.07.2026)

**Date**: 2026-07-21
**Reviewer**: review-it skill, 3 parallele Agenten (Logic=Sonnet, Security=Sonnet, Simplify=Haiku)
**Scope**: page.tsx (leistungen), LeistungenHero2Client, MorphSculpture (navyPiece),
leistungen-hero2-demo/*, LeistungenUeberblick (+css), public/relaunch/leistungen/*.jpg
**Stack**: ui (tsx/css) + Vanilla-JS-Demo-Engine
**Verdict**: CONDITIONAL -> nach Sofort-Fixes GO

## Findings — Accepted + gefixt (5)
1. MAJOR (Logic) leistungen-ueberblick.css:36 — Overlap -130vh deckte Story-Ende und
   Zahnrad-Zerfall mit WEISSEM Block ab (ueber-uns overlappt transparent). Fix:
   margin-top -84vh (aus DIS0=0.92 hergeleitet: 0.92*1050vh+100vh-1150vh) +
   background transparent. Browser-verifiziert: Zerfall frei sichtbar, Intro laeuft ein.
2. MEDIUM (Logic) LeistungenHero2Client — window.__sculptProgress global, stale bei
   Soft-Navigation von ueber-uns/kontakt (Figur-Flash in falscher Pose). Fix: =0 vor
   Engine-Boot, delete im Cleanup. Nur eigener Client angefasst (Fremd-Straenge tabu).
3. MAJOR (Simplify) demo.css — ~60% tote Regeln (Belief/Partner/FAQ/CTA/Footer ohne
   Markup im gekuerzten Body). Fix: 615 -> 240 Zeilen, selektorbasiert entfernt.
4. MINOR (Simplify) page.tsx — Doc-Kommentar beschrieb den alten 9-Sektionen-Fluss
   + SLOTs. Fix: auf Schnitt 21.07. aktualisiert. Dabei gefunden: Gedankenstrich in
   der sichtbaren meta description (Haus-Regel Nr. 1) — ersetzt.
5. COSMETIC (Security) punkt-04-website.jpg traegt EXIF Artist/Copyright-Credit.
   Kein Risiko (kein GPS). OFFEN als Live-Gang-Hygiene: EXIF-Strip fuer Stock-Bilder.

## Findings — Rejected (2, nach eigener Verifikation)
- Simplify: "Karte dupliziert inner-JSX in zwei Branches" — falsch, `inner` ist einmal
  definiert und wird in beiden Zweigen referenziert.
- Simplify: "navyPiece-Effect laeuft bei Aenderung nicht neu" — falsch, Prop steht in
  den Effect-Deps (MorphSculpture.tsx:315), Effect rebuildet; Prop aendert sich zur
  Laufzeit ohnehin nie.

## Findings — Tradeoff dokumentiert (1)
- Simplify MAJOR: 3 fast identische Demo-Clients (UeberUns/Kontakt/LeistungenHero2,
  je ~105 LOC). Bewusste Duplikation: kontakt/ueber-uns sind Fremd-Straenge
  (Arbeitsregel: nicht anfassen). Konsolidierung erst, wenn ein Strang ohnehin alle
  drei Seiten anfasst. -> lessons.md T-leistungen-01.

## Sauber (explizit verifiziert)
Engine-Kuerzung ohne tote Referenzen (Grep ueber alle entfernten Bezeichner leer);
StrictMode/Teardown-Muster korrekt; IO-Cleanup vorhanden; reduced-motion per CSS
abgedeckt; Injection-Flaeche statisch (keine Request-Daten in HTML/CSS/JS-Strings);
Engine ohne eval/innerHTML/fetch; noindex intakt; keine Secrets; Bilder ohne GPS-EXIF.

## Nach-Fix-Verifikation
tsc gruen, vitest 168/168, Browser: Overlap beginnt exakt bei Zerfallsbeginn
(lu-top 9594 = Szene-Ende - 84vh), Hero-Choreografie nach CSS-Kuerzung unveraendert,
Cursor sichtbar, data-active=1.
