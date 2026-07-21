# Naechste Session — Leistungen/Website-Unterseite (2026-07-21, IST-ZUSTAND gesichert)

## IST-ZUSTAND 21.07. (Commit 5e33e38 LOKAL, von Thomas abgenommen: "passt, von hier weiter")
Die Feedback-Runde vom 21.07. ist committet und im Browser komplett verifiziert
(localhost:9000, Hero bis Footer durchgescrollt, tsc gruen, keine Konsolen-Fehler):
- **Hero:** Zahnrad via `<MorphSculpture comp={0} style={{transform:'translateX(-4vw) scale(0.92)'}}>`
  (Figur klebte sonst an der Textspalte), Titel 19vw statt 22vw, roter Mal-Punkt (.cursor-dot) wieder AN,
  Haarlinien-Bug gefixt (belief-backing vollflaechig `inset:0` statt 58vh-Band).
- **NEU Belief-Bumper** direkt im Hero-Demo (`demo.body.html` #sceneBelief, originale ueber-uns-Push-
  Mechanik, Engine hatte den Code schon): "schoen sind / was bringen" -> "Wir koennen beides. Schoen und
  sie klingelt." -> Mitarbeiter-oben-drauf -> Pointe "Deine soll auch klingeln?" + Entwurf-CTA.
- **Sektions-Reihenfolge NEU:** SoBauenWir (Handwerk-Kontrastpaare, ersetzt alten Bumper) -> Diagnose
  (jetzt 3-Fragen-Quiz-Flow, Teal-Welt) -> Ablauf (4 Kreise, scroll-getrieben) -> Fundament =
  **fundament-varianten/VarianteA** (Sticky-Ledger, Thomas' Wahl aus A/B/C; Vorschau-Seite
  app/.../website/fundament-varianten existiert noch) -> DreiStufen (Editorial-Rows, Business-Held) ->
  KollegeAnreisser (**Talos-Dashboard**: TalosEntranceStage rechts, rendert verifiziert; links UI-Panels)
  -> KundenSagen (Hub-Sektion 1:1) -> ReferenzenTeaser (neu, schmaler Streifen) -> WebsiteFaq ->
  SchlussCta (neue Copy "Hol dir die Website, bei der das Telefon geht.").
- Alte Dateien Fundament.tsx/Testimonials.tsx sind ersetzt, aber noch im Repo.

## FEEDBACK-RUNDE 2 (21.07. abend, Commits e15914a + 7b21aba LOKAL, review-it GO)
4 parallele Agenten (Fable orchestriert), alles browser-verifiziert, tsc gruen, vitest 168/168:
- Eyebrow-Stil "(...)" rot/letterspaced (.wd-eyebrow in website.css) in ALLEN 9 Sektionen
  (DOM-geprueft; Diagnose=cream-Modifikator auf Teal, CTA=helleres Rot auf Navy).
- SoBauenWir-Paare mehr Luft; Sektions-Paddings auf var(--rr-section-y) vereinheitlicht.
- Fundament-Ledger: roter PUNKT statt Quadrat.
- DreiStufen: MEISTGEWÄHLT-Badge fix am Business-Namen; styled-jsx-:global-Fix (Row-Padding
  griff vorher NIE — Scope-Klasse propagiert nicht in next/link).
- KundenSagen (geteilt mit Hub!): weiss, Google-G+Sterne-Badge, Zitat 32px, Crossfade-Wechsel
  (key-Animation, min-height gegen Jump), Avatare hellgrau + dezenter Rot-Filter (opacity .76)
  auf aktiv, Logo-Slot (logo?-Feld) fuer spaeter, Pfeile auf Weiss.
- NEU /leistungen/website/stufen-varianten (A Editorial-Accordion / B Sticky-Matrix /
  C Stacked-Tiles; 8-10 aufklappbare Merkmale je Stufe, Daten geteilt aus VarianteA.tsx).
- NEU /leistungen/website/dashboard-varianten (A Browser-Frame mit Talos halb drueber /
  B Floating Panels mit Ganzkoerper-Talos / C dunkle Kommandozentrale, Talos schaut von oben).
  THOMAS WAEHLT je eine Variante; beim Promoten Hex-Farben auf var(--rr-*) umstellen
  (Review-Vormerkung) und nur 1 Talos-Instanz auf der Live-Seite.
- review-it (3 Agenten): GO, 0 CRITICAL/MAJOR; P1 ReferenzenTeaser-Eyebrow sofort gefixt;
  Rest dokumentiert in docs/reviews/website-feedback2-e15914a.md.

## Kleinigkeiten offen (bewusst NICHT gefixt, Thomas hat Stand so abgenommen)
- ASCII-Umlaute in KollegeAnreisser-Copy: "gewoehnlichen", "Blogbeitraege", "geprueft" — Hausregel
  waere echte Umlaute; bei naechster Copy-Runde mitziehen.
- Talos-Buehne fuellt nur den oberen Teil der rechten Spalte (feste Zellhoehe), darunter Weissraum.
- Varianten-Vorschau /leistungen/website/fundament-varianten nach finaler Abnahme entfernen.

---

# Aelterer Stand (2026-07-20)

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
