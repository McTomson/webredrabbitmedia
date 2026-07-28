# PLAN — Site-Vereinheitlichung (Grill-Session 28.07.2026)

Alle Punkte mit Thomas per Grill-Me entschieden. Umsetzen OHNE Nachfragen, ausser etwas widerspricht sich beim Bauen. Referenz-Live: https://v2.redrabbit.media/ (Branch `relaunch`).

## Entschiedene Regeln (verbindlich)

### 1. Schriften — 3 Rollen behalten, streng anwenden
- DM Sans = alle Headlines · Crimson Pro = Hero-/Statement-Saetze · Instrument Sans = Body/UI/Buttons/Eyebrows.
- Fixes: `--rr-font-sans` existiert nicht (CasePanels.tsx:95,107 referenziert es) → auf `--rr-font-ui` umstellen oder Token definieren. `kunden-sagen.css` + `leistungen-ueberblick.css` hardcoden Font-Vars → auf `--rr-font-*`-Tokens umstellen.
- Bug: "WEBDESIGN · SICHTBARKEIT · KI" (HomeMorph.tsx:446) wird abgeschnitten — Ursache `whiteSpace:nowrap` + 0.34em Tracking (Z.433). Fix ohne Umbruch-Haesslichkeit (Tracking/Fontsize responsiv reduzieren).

### 2. CTA-Block ueber Footer — ueberall Homepage-Aufbau
- Struktur ueberall identisch: linksbuendig, Headline-Stil wie HomeClosing, Button-Paar, danach echte FooterReassembly.
- Text PRO SEITE angepasst (Thema der Seite aufgreifen), max. Wortzahl wie Homepage-CTA. Kontakt: kurzer Text erlaubt (Formular liegt drueber; Seite wird spaeter ueberarbeitet).
- Scope: alle Inhaltsseiten (Home, Leistungen + Website/Talos, Referenzen, Ueber uns, Preise, Tipps, FAQ, Kontakt). Rechtsseiten: nur Footer.
- Umsetzung: EINE geteilte Closing-Komponente (Props: headline/text/hrefs), alle Insel-Versionen (SchlussCta x3, TalosCta, PreiseSchlussCta, Referenzen-Inline-CTA zentriert!) ersetzen.
- FooterReassembly: ueber-uns / kontakt / faq nutzen NACHBAU im demo.body.html — durch echte Komponente ersetzen, Nachbau raus.

### 3. Hintergrund — Off-White-Basis + Wechsel (wie Homepage)
- Basis ueberall `#F4F4F2`; reines `#FFFFFF` nur als bewusste Wechsel-Flaeche; Dunkel `#23262E`.
- `#F6F5F1` (Demo-Heroes, Menue-Overlay, --rr-offwhite) ueberall → `#F4F4F2` vereinheitlichen.
- Leistungen/Preise/Referenzen-Content von `#ffffff`-Basis auf Homepage-Rhythmus umstellen.

### 4. Menue — Eck-Klammern raus
- Reticle (4 Hover-Ecken) in RelaunchMenu komplett entfernen. Hover/Aktiv-Ersatz: kleiner roter Punkt vor dem Punkt (passend zum roten Cursor-Punkt).
- Nebenbei-Fix: Menuepunkt "Preise" zeigt auf `/preise` (alt) statt `/relaunch-preview/preise`.

### 5. Buttons — nur noch 2, farbabhaengig vom Hintergrund
- Primaer `rr-btn-sweep(--red)` + Sekundaer `rr-btn-outline`. Auf dunklem Grund: helle Varianten desselben Paars (ggf. Klassen ergaenzen).
- `rr-btn-frame` site-weit ERSETZEN (SchlussCta, TalosCta(s), PreiseSchlussCta, LeistungenStory:572,607). Definition danach aus styleguide.css loeschen.
- Referenzen-Bug: `className="rr-btn-sweep--red"` ohne Basisklasse (referenzen/page.tsx:125) fixen.
- Demo-CSS-Kopien der Sweep-Definition (6x demo.css) mit Styleguide synchronisieren.
- `rr-btn`-Familie bleibt NUR fuer Formulare/Utility; keine CTA-Verwendung.

### 6. Navy komplett raus (Farbe = Footer-Dunkel #23262E)
- Stale Fallbacks/Hardcodes ersetzen: `#1c2837` (leistungen-hub:272, menue-varianten:31, sculpture-test:52, demo.engine.jstext:343,355 in 7 Demos — Auge), `#1d8c98`-Fallbacks (ProduktTueren:59, Diagnose:205, VarianteA/B/C).
- `rr-btn-sweep--navy`-Verwendungen (PreiseMatrix, GalleryChrome) → auf Paar-Logik umstellen.

### 6b. CornerLogo — Reveal spaeter
- Schwelle von 0.45 → ~2.0 Bildschirmhoehen, Fade 1200ms bleibt, Klick → Home bleibt. Einheitlich auf allen Seiten.

### 7. Abstaende — Zwei-Klassen-Regel
- Klasse A (normale Sektionen): EIN Token `--rr-section-y` (clamp 96–180px), oben=unten, kein Hardcoding mehr (HomeClosing asymmetrisch, 26vh-Spacer der Homepage, LeistungenStory min-heights etc. auf Token umstellen).
- Klasse B (Vollbild-Strecken: Bumper, Horizontal-Pan, Heroes): 100vh, buendig OHNE Zwischenabstand; Innen-Padding der Fenster vereinheitlichen (ein Wert).
- Uebergang A↔B: immer exakt Klasse-A-Abstand.

### 8. Scroll/Bumper — EIN System
- Regel: Bumper (1 Scroll = 1 Fenster, haelt) NUR fuer Kurz-Inhalte (Wort/Headline/1-2 Saetze). Lange Absaetze nie im Snap gefangen (laengerer Dwell/frei). NN/g-belegt.
- EIN Tempo site-weit: ein Lenis-Setting (~0.1), eine Easing-Kurve, ein Dwell-Wert zentral (CasePanels-Snap-Dwell als Referenzmath: smoothstep((f-0.4)/0.2), 190vh/Fenster). Dwell einheitlich etwas verlaengern ("zu schnell"-Feedback), danach Live-Feinjustage EINES Werts.
- `prefers-reduced-motion` ueberall respektieren (besteht in CasePanels, pruefen bei Rest).
- Preisseiten-Bumper (ScrollBumper.tsx, 320vh, dunkel, rr-display-2 44-89px, kein Eyebrow) → an Homepage-Standard angleichen: heller Hintergrund im Wechselrhythmus, Headline-Groesse wie CasePanels (30-52px), Fenster-Stopp-Verhalten, rote Themen-Zeile oben.

### 9. Eyebrow-Standard — rote "( Thema )"-Klammer-Zeile UEBERALL
- Der Leistungen-Stil (rote Grossbuchstaben-Zeile MIT runden Klammern, wd-eyebrow) ist DER Standard (Thomas: Referenz-Screenshot 28.07.).
- Homepage-Panels bekommen ihn auch: "( Das Problem )", "( Die Loesung )", "( Der Beweis )". Preisseiten-Bumper bekommt ihn NEU (fehlte komplett).
- Eck-Klammern (Menue-Reticle, rr-btn-frame) verschwinden trotzdem — anderes Element.

## Reihenfolge der Umsetzung
1. Tokens/Grundlagen: Farben (#F6F5F1→#F4F4F2, Navy-Reste), Fonts-Fixes, Button-Klassen (helle Varianten, frame-Ablöse), Eyebrow-Klasse zentralisieren.
2. Site-Chrome: Menue (Reticle raus, Punkt-Hover, Preise-Link), CornerLogo-Schwelle.
3. Geteilte Closing-Komponente bauen + auf allen Seiten einsetzen; FooterReassembly-Nachbauten ersetzen.
4. Abstands-Sweep (Zwei-Klassen-Regel).
5. Bumper: zentrale Dwell-Konstanten, ScrollBumper-Umbau (Preise), Homepage-Eyebrows mit Klammern.
6. Backgrounds der Unterseiten umstellen.
7. Pro Seite: CTA-Texte schreiben (Opus-Niveau, Open-Loop-Regeln, keine KI-Tells, echte Umlaute).
8. Deploy nach jedem groesseren Block: git add -u (NIE add .), push → ~3 Min Vercel → Live-Check mit EINDEUTIGEM Marker + vercel ls.

## Ergaenzungen nach kritischer Pruefung (28.07., zweiter Durchgang)

### A. Mobile-Regel (fehlte komplett)
- Bumper/Horizontal-Pan/Riesen-Woerter degradieren auf Mobile (<= ~820px) zu normalem vertikalem Scrollen mit denselben Inhalten — Vorlage: bestehende reduced-motion-Fallbacks. NN/g: Scroll-Hijacking auf Mobile schlimmer als Desktop. Riesen-Wort/nowrap-Clipping mobil pruefen.

### B. Vollstaendiges Bumper-Inventar
- Unter die zentralen Dwell-Konstanten: CasePanels, ScrollBumper (Preise), TalosTalenteFahrt, StepStack, Website-v2-Onboarding/Ablauf, LeistungenStory-Sculpt.
- AUSNAHME (festgeschrieben): kanonische Subpage-Heroes (Wisch-Reveal + MorphSculpture, demo-Ordner) bleiben unangetastet — eigener Standard, kein Bumper.

### C. Fokus-Zustaende (a11y)
- Menue-Punkt-Hover auch bei :focus-visible. Outline-Button-Hell-Variante mit sichtbarem Fokus. Keine reine Hover-Semantik.

### D. Demo-Kopien-Sync
- Farb-/Button-/BG-Fixes muessen in alle 7 demo.css/demo.engine-Kopien. Regel: Referenz = ueber-uns-demo; Aenderungen per diff/Skript in alle Kopien spiegeln, danach Kopien-Gleichheit pruefen (diff).

### E. Standard festsetzen + Abnahme
- Neues `docs/DESIGN_STANDARD.md` = EINE kanonische Quelle (Farben, Fonts, 2 Buttons, Eyebrow-Klammer, Abstands-Klassen, Bumper-Dwell + Mobile-Regel, Logo-Schwelle). UNTERSEITEN_STIL.md verweist darauf.
- Memory aktualisieren: Site-Chrome (Logo ~2vh, Menue ohne Reticle, Punkt-Hover), Button-Standard (frame tot), Eyebrow-Standard "( Thema )".
- Abnahme: pro Seite Live-Check auf v2 (Checkliste: Farben, Buttons, Eyebrow, CTA-Block, Footer-Animation, Abstaende, Bumper-Verhalten, Mobile) — fertig erst nach Thomas' visueller Bestaetigung.

## Nicht anfassen
- web.redrabbit.media (alte Live-Site). Fremde untracked WIP-Files. docs/seo-monitor-log.md nicht committen.
