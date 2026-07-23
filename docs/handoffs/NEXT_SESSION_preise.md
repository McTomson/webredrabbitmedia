# Naechste Session — Preise-Seite (Stand 2026-07-23 abends)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, docs/lessons.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden. Gilt verschaerft fuer PREISE.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben.
- Bau-Agenten die Design-Entscheidungen WOERTLICH mitgeben inkl. verworfener Gegen-Option (Lesson 23.07.: sonst wird die branchenuebliche Standardloesung gebaut = eine Umbau-Runde verloren).

## WICHTIG: Branch-Status
Der Branch `relaunch` ist GEPUSHT (origin/relaunch stand am 23.07. abends auf demselben Commit wie lokal).
Er ist ein GETEILTER Branch — mehrere parallele Straenge (Preise, Talos, Leistungen-Hub) committen darauf.
Vor dem Arbeiten `git fetch` + `git log --oneline -15` pruefen, und NUR eigene Dateien committen.

## Was fertig ist (Branch relaunch, gepusht)

Neue Seite: `/relaunch-preview/preise`. Dev-Server: `cd ~/dev/redrabbit && npm run dev -- --port 9000`.

Commits (aelteste zuerst): `311c10c` (Bau) · `25bd5f9` (QA-Runde 1) · `3ec643b` (QA-Addendum)
· `d7530d9` (FAQ-Dublette) · `1276b50` (Fahrt full-bleed, Karte) · `e7454dd` (Review-Findings)
· `4f398a1` (Review-Log + Lessons) · `1458c3d` (Hero-Figur links) · `89956fb` (Log-Nachtrag)
· `b93377d` (Karten rechts) · `e3ac108` (dieser Handoff) · `46c2f22` (Brief nach brand/).

Zwischendrin liegen Fremd-Commits des Talos-Strangs (`f8a5afd`, `893a330`, `9beaa73`, `c00d614`) —
derselbe Branch, anderer Strang. Nicht wundern und nicht anfassen.

Zustand am Session-Ende: `npx tsc --noEmit` gruen, `npx vitest run` 168/168 gruen,
Seite liefert 200 auf `localhost:9000/relaunch-preview/preise`.

## Konzept (mit Thomas per grill-me festgelegt, NICHT neu aufrollen)

- Grundgeruest vertikal mit EINEM horizontalen Moment: die Talos-Talente fahren als
  CasePanels-Adaption seitwaerts. Website-Pakete bleiben vertikal vergleichbar.
- rabenrifaie.com wurde live geprueft: scrollt NICHT horizontal. Uebernommen wurde von dort
  nur die Idee der schwebenden 5-Sterne-Karten.
- Sektionsfolge: Painting-Hero (MorphSculpture comp={3} Chart) -> Risiko-Umkehr (Navy)
  -> PreiseMatrix (DreiStufenMatrix-Klon MIT Preisen) -> Betreuung + KMU.DIGITAL
  -> Talos-Talente-Fahrt -> Preis-FAQ -> SchlussCta -> FooterReassembly.

## Dateien

- `app/relaunch-preview/preise/page.tsx`
- `components/subpages/PreiseDemoClient.tsx` + `components/subpages/preise-demo/` (Hero-Klon)
- `components/subpages/preise/{RisikoBand,PreiseMatrix,BetreuungFoerderung,TalosTalenteFahrt,PreiseFaq,PreiseSchlussCta,FloatingReview}.tsx`
- Review-Log: `docs/reviews/preise-seite-1276b50.md`

## Lessons aus dieser Session (stehen in docs/lessons.md)

- **L-preise-01**: autoritative Werte (Preise) nie per weichem Lookup gegen eine Fremd-Datei —
  PreiseMatrix hat jetzt einen fail-closed Guard, der im Build bricht statt still leer zu rendern.
- **L-preise-02**: KEIN `npm run build`, solange der Dev-Server laeuft — zerschiesst `.next`,
  die Seite wirkt komplett tot. Bei "Seite reagiert nicht" ZUERST
  `curl -o /dev/null -w '%{http_code}' localhost:9000/_next/static/chunks/main-app.js` (404 = das).
- Scroll-QA nur mit echten Wheel-Events (L-referenzen-02), nie mit `window.scrollTo` messen.

## OFFEN — braucht Thomas

1. **Abnahme am eigenen Schirm** (Regel: visuelle Fixes gelten erst, wenn Thomas sie sieht).
2. **Talos-Modul-Preise fehlen weiterhin.** Die Fahrt zeigt bewusst nur die Logik
   (monatlich, jederzeit kuendbar, nachbuchbar, Fixbetrag statt Credit-Raetsel) und
   "Preis auf Anfrage". Zahlen NIE erfinden — sobald Thomas sie festlegt, in
   `TalosTalenteFahrt.tsx` eintragen und in `brand/decisions-log.md` dokumentieren.
3. **Talent-Namen sind Arbeitstitel** (Schreiber, Empfang, Aussendienst, Poster,
   Sichtbarmacher, Sonderanfertigung) — stammen von der Talos-Seite, Thomas hat sie
   noch nicht final abgenommen.
4. **Mobile wurde nicht visuell geprueft** — das Chrome-Fenster liess sich nicht unter
   ~1500px verkleinern. Code-seitig geprueft: alle Sektionen haben Breakpoints bzw.
   fluide Einheiten, die Talos-Fahrt schaltet unter 900px auf einen statischen Stapel,
   der Hero-Figur-Versatz ist auf `min-width: 769px` begrenzt (darunter stapelt
   `.story-grid`). Trotzdem: am echten Geraet gegenchecken.
5. Deploy-Preview steht aus (Regel: Deploy-Status nur via `vercel ls` = Ready melden).

## So startest du nach dem Rechner-Neustart

```bash
cd ~/dev/redrabbit
git fetch && git log --oneline -15        # geteilter Branch: erst schauen, was dazugekommen ist
npm run dev -- --port 9000                # Dev-Server (NICHT parallel `npm run build`!)
open http://localhost:9000/relaunch-preview/preise
```
Wenn die Seite tot wirkt (kein Menue, keine Animation, Konsole sauber):
`curl -s -o /dev/null -w '%{http_code}' localhost:9000/_next/static/chunks/main-app.js`
→ 404 heisst, ein Build hat den Dev-Server zerschossen. Dev-Server neu starten, kein Code-Bug.

Erster inhaltlicher Schritt der neuen Session: Seite gemeinsam mit Thomas durchgehen
(Abnahme Punkt 1), dabei die offenen Punkte 2 und 3 klaeren (Talos-Preise, Talent-Namen).
