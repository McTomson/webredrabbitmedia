# Naechste Session — Leistungen/Website-Unterseite (2026-07-20)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Scope-Abgrenzung (WICHTIG, Thomas 20.07.)
- MEINE Seite = NUR `/relaunch-preview/leistungen/website` (die Website-Unterseite).
- Die Leistungs-HAUPTSEITE (`/relaunch-preview/leistungen`, der Hub) macht JEMAND ANDERES. NICHT anfassen.
- Working Tree ist geteilt mit vielen Fremd-Straengen (talos-*, preise-preview, leistungen-hero2, SubpageHero, StepStack, BrushReveal, KontaktForm, PNGs, brand/PREISE_SEITE_BRIEF.md, docs/specs/FUCHAI*). NUR eigene Website-Dateien committen.

## Stand dieser Session (erledigt + verifiziert, committet ad3e41c LOKAL, nicht gepusht)
Die Website-Unterseite ist inhaltlich + technisch FERTIG und deployt.
- **Architektur:** Hero-only ueber-uns-"painting"-Mechanik (Wort "Website" + Wisch + Figur), Figur = ZAHNRAD. Darunter echte React-Sektionen mit rr-*-Bauteilen.
- **DIE FIGUR-ERKENNTNIS (Gold wert, hat 4 Runden gekostet):** Die Figur wird NICHT vom inline `#headSvg`/`COMP5`-Code gerendert (der ist per CSS `display:none`), sondern von der React-Komponente `<MorphSculpture comp={N}>`, portalt vom `WebsiteDemoClient` in `.main-sticky`, getrieben von `window.__sculptProgress`. comp ist 0-INDEXIERT auf `COMPS=[atShapes1..5]`: **comp0=Zahnrad(Webdesign), comp1=Gluehbirne(Kontakt), comp2=Dokument(Content), comp3=Chart(Betreuung), comp4=Kopf(ueber-uns)**. Figur tauschen = EINE Zeile (`comp={0}`), NICHT die COMP5-Daten grafte(n). Siehe [[reference_subpage_hero_figur_morphsculpture]].
- **Sektionen (Copy in scratchpad/website-copy-v2.md):** Hero → Fundament ("Was drinsteckt", 6+6 Haekchen) → **Diagnose** (interaktiv: Persona-Klick → ehrliche Empfehlung Starter/Business/Premium, Kollege immer dabei) → Ablauf (4-Schritt-Timeline, "Entwurf zuerst" charmant, NICHT billig) → 3 Stufen (nur Namen + Verweis /preise, KEIN Preis) → Kollege-Anreisser (Navy-Band, "digitaler Kollege", KEIN Wort "KI", Link /leistungen) → Testimonials (Teal, echte Danesh+Rohrer, "5,0 aus 8") → FAQ (6) → Schluss-CTA ("Deine ruft an.", loest Hero-Hook).
- **Qualitaet:** tsc gruen, vitest 168/168, keine Konsolen-Fehler, Browser real durchgescrollt (alle 9 Sektionen), Mobile ok (kein Overflow, Diagnose stapelt), Hausregeln sauber (du, kein Gedankenstrich, keine Emojis, kein "KI", echte Umlaute, ein h1, echte Reviews, keine Preise).
- **Deploy (Preview):** https://webredrabbitmedia-elynqfexd-toms-projects-17d37f0b.vercel.app/relaunch-preview/leistungen/website

## Offen / UNKLAR / Naechste konkrete Schritte
- Thomas will die Seite in Ruhe anschauen und dann gemeinsam Sektion fuer Sektion FEIN durchgehen (Copy, Reihenfolge, Design-Details). Auf sein Feedback warten, nicht vorgreifen.
- Moegliche Fein-Themen (nur wenn Thomas es will): Navy-Rhythmus (Kollege-Band + CTA + Footer alle navy im unteren Drittel), Diagnose-Feinschliff, evtl. Wisch-Botschaft/Hero-Copy schaerfen.
- **reduced-motion:** der gehaltene Hero ueberlappt den Story-Text — IDENTISCH zur ueber-uns-Referenz (geerbt, KEIN Regress). Falls Fix gewuenscht: separater Fix fuer ueber-uns + alle Klone.
- Trivial offen: ein paar em-dashes in JSDoc-Kommentaren (nicht user-facing).

## Blocker / Risiken
- Keine. Seite laeuft. Dev-Server lokal ggf. neu starten: `cd ~/dev/redrabbit && npm run dev -- --port 9000`.

## Relevante Dateien/Befehle
- Seite: `app/relaunch-preview/leistungen/website/page.tsx`
- Hero-Demo (hero-only, getrimmt + engine null-geguardet): `components/subpages/website-demo/{demo.body.html,demo.css,demo.engine.jstext}` + Wrapper `components/subpages/WebsiteDemoClient.tsx` (`<MorphSculpture comp={0}>` = Zahnrad).
- Sektionen: `components/subpages/leistungen/website/v2/{Fundament,Diagnose,Ablauf,DreiStufen,KollegeAnreisser,Testimonials}.tsx` + `../{WebsiteFaq,SchlussCta}.tsx`.
- Copy: `scratchpad/website-copy-v2.md`. Voice-Regeln: `content-engine/voice/house.md`. Preis-Regeln: `brand/PREISE_SEITE_BRIEF.md` (nur 950/2.900/ab 4.900, nie 790). Figur-Motive: `docs/UNTERSEITEN_STIL.md §4`.
- Dev: `npm run dev -- --port 9000`. tsc: `npx tsc --noEmit`. Deploy Preview: `vercel deploy --yes`.
- LESSON StepStack: `components/subpages/StepStack.tsx` hat GAR KEIN CSS (kt-* Klassen nirgends definiert) → Schritte stapeln unlesbar. NICHT verwenden, bis CSS existiert. Ablauf nutzt eigene Timeline.
