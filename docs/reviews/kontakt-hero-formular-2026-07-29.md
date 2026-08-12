# Review — Kontakt-Seiten-Umbau (Hero-Formular), 29.07.2026

**Scope**: uncommitted Working Tree, Branch `relaunch` — `components/subpages/kontakt-demo/{demo.body.html,demo.css,demo.engine.jstext}`, `components/subpages/KontaktDemoClient.tsx`, `app/relaunch-preview/kontakt/page.tsx`
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic, Security, Simplify)
**Stack**: ui (Demo-HTML/CSS/vanilla-JS-Engine, Next.js Client-Wrapper) · Domain: pii (Kontaktformular)
**Verdict**: **CONDITIONAL → nach Fixes GO** (0 CRITICAL, 1 MAJOR als dokumentierter Trade-off deferred, Rest MINOR/COSMETIC — sichere Fixes direkt umgesetzt)

## Findings — Umgesetzt in dieser Session
- **Simplify 1-4, 6, 7 (MINOR/COSMETIC)**: Toter Code entfernt — Footer-Nachbau-CSS (`.rr-foot-*`-Block inkl. Media-Queries), toter Engine-Hook K13 (`#rrFoot`-IO), verwaiste `.footer`/`.outro`, verwaiste Story-Text-Klassen (`.t-statement`, `.t-ch`, `.t-close`, `.t-byline`), ungenutzte CSS-Variablen (`--blue`/`--anthra`/`--line`/`--hairline`), wirkungslose Reduced-Motion-Regel `.head-col svg{opacity:1}`. Verifiziert: 0 Rest-Referenzen, Seite rendert unveraendert (headless Desktop+Mobile, 0 pageerrors, 0 horizontaler Overflow).
- **Adress-Inkonsistenz (eigener Fund beim QA)**: Daten-Bumper + Maps-Link auf `Grabnergasse 8/8` korrigiert (Impressum/AGB/Datenschutz = autoritativ; layout.tsx-Schema sagt aelter "8").

## Findings — Deferred (bewusst, mit Begruendung)
- **Logic MAJOR (Konfidenz 80): Formular-Pflicht-Stopp kann von EINEM sehr starken Dauer-Scroll uebersprungen werden.** `formCheckpointTops()` meldet den Checkpoint erst ab `scrollY >= cp - 2.4vh` (Gate). `ScrollExperience.beginGesture()` loest die Grenze nur EINMAL am Gesten-Anfang auf — eine Geste, die vor dem Gate startet und ohne >220ms-Pause durchzieht, kappt erst an `#sceneDaten`. **Warum deferred**: Das Gate ist die Abwehr eines schlimmeren Bugs (finishDynamicBoundary faehrt dynamische Kanten IMMER distanzunabhaengig zu Ende — ohne Gate wuerde jeder Wheel-Tick im Hero die komplette Gluehbirnen-Choreo im Schnelldurchlauf ueberspringen). Fix (a) des Reviewers (Boundary mid-gesture neu evaluieren) veraendert das geteilte `ScrollExperience.tsx` fuer alle Seiten. Erst am echten Geraet testen, ob der Skip praktisch auftritt; dann ggf. gezielt nachziehen.
- **Logic (unverifizierbar per Code): Wheel ueber dem intern scrollbaren `.text-window` bei Lenis** — ob Desktop-Wheel den inneren Scroll erreicht, wenn das Formular hoeher als das Fenster ist. Am Geraet gegentesten (Viewport schmal ziehen, DSGVO+Absenden per Wheel erreichen).
- **Security M1 (MINOR)**: DSGVO-Checkbox wird nur clientseitig geprueft, Consent nicht im Payload/Schema. Empfehlung: `consent: z.literal(true)` in `/api/contact`. **Deferred**: Route ist geteilt mit der Live-Site (`KontaktForm.tsx`) — Schema-Aenderung braucht beide Clients, eigene Runde.
- **Security M3 (MINOR)**: Server hat `message` optional, Client verlangt >=10 Zeichen. Gleicher Grund deferred.
- **Security M2 (Kontext, pre-existing)**: Rate-Limiter pro Lambda-Instanz + `x-forwarded-for`-Fallback 'Anonymous'. Kein Handlungsbedarf jetzt.
- **Simplify 5+8 (COSMETIC)**: Ue-Punkt-Maschinerie (~100 Zeilen, laeuft als No-op, Template-Erbe von ueber-uns) — bleibt fuer Template-Paritaet; bei einer Template-weiten Aufraeumrunde zusammen mit ueber-uns entfernen.

## Cross-Phase-Regressionen
- Keine neuen. L-referenzen-02 (Scroll-QA gegen Lenis) und L-referenzen-03 (rAF-Drosselung inaktiver Tabs) haben sich beim QA dieser Session erneut bestaetigt (synthetische Wheel-Events bewegen Lenis nicht; Hintergrund-Tab fror die Engine scheinbar ein).

## Verifiziert unauffaellig (Auszug)
Client-Payload == Server-Kontrakt (inkl. Honeypot-Mapping website→honeyPot, Silent-200), keine Injection-Flaechen (User-Input nur via textContent), tel: nur hinter "Anrufen", target=_blank mit noopener, alle Engine-DOM-Referenzen aufgeloest, Teardown-Guards vollstaendig, Reduced-Motion-Pfad intakt, `.sculpt-layer.docked` sauber auf Mobile-MQ begrenzt.
