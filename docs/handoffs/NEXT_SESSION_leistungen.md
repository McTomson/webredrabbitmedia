# Naechste Session — LEISTUNGEN-Hub (23.07.2026, nach Neustart)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Arbeitsmodus mit Thomas (WICHTIG)
- Thomas sagt Punkte EINZELN an; je Punkt: umsetzen -> im Browser zeigen -> SEIN OK an
  SEINEM Bildschirm abwarten -> erst dann weiter. Nichts gross vorbauen.
- Er wuenscht: parallele Agenten mit UNTERSCHIEDLICHEN Modellen (sonnet/opus mischen),
  Hauptsession ist Orchestrator + QA (Memory feedback_fable_dirigent_agenten_delegieren).
- Visuelle Fixes gelten erst nach SEINER Bestaetigung als erledigt
  (Memory feedback_visuelle_fixes_thomas_bestaetigt).

## Vorgeschichte in Kurzform
1. 22.07. vormittag: Hub-Umbau auf Website-Designregeln (6904727) — Thomas NICHT zufrieden.
2. Eine andere Session drehte mit ihm vieles zurueck (74b8308): Scharnierzeile statt
   ScrollBumper, kein ProduktTueren, keine Klammer-Eyebrows im Hub. DIESER Stand ist die Basis.
3. 22.07. abends (diese Session): ehrliche Analyse geliefert, Thomas hat bestaetigt:
   - Hero-Strecke BLEIBT wie sie ist (lang, Zahnrad-Morph). Nicht anfassen.
   - Bilder-Strecke (6 Punkte mit Stockfotos) passt NICHT -> zwei Varianten gebaut (s.u.).
   - Restliche Analyse-Punkte (Preis frueh, Dauer-FAQ, Domain-FAQ, Talos-Kernsatz) = uebernehmen -> GEBAUT.
   - Talos-Sektion: gleiches Feld wie Unterseite website -> GEBAUT (TalosDashboard 1:1 im Hub).
   - "weitere anweisungen folgen" — er diktiert als naechstes Punkt fuer Punkt.

## Stand dieser Session (Commit f155bdd lokal, tsc gruen, vitest 168/168, Browser-QA ok)
Auf der LIVE-Hub-Seite /relaunch-preview/leistungen:
- TalosSlot ERSETZT durch `<TalosDashboard />` (components/subpages/leistungen/website/v2/
  TalosDashboard.tsx, 1:1 Reuse; Hub importiert jetzt wd-eyebrow.css + website.css,
  beide komplett .rr-gescoped, Konfliktcheck negativ). TalosSlot.tsx existiert noch, unbenutzt.
- LeistungenUeberblick Punkt 06 NEU: Titel "Talos ist immer dabei. Weitere Helfer stellst du
  dazu." Body beginnt mit Kernsatz "Bei jeder Website fix dabei: Talos, dein Mitarbeiter.
  Kein Extra-Paket."
- Preis-Zeile nach Punkt 06 (.lu-priceNote in leistungen-ueberblick.css): Fixpreis statt
  Stundensaetze, Entwurf gratis, Link /preise (gleiches Ziel wie Menue+FAQ). KEINE Zahlen.
- LeistungenFaq: 2 neue Fragen "Wie lange dauert das?" (ohne erfundene Fristen) und
  "Was passiert mit meiner alten Seite und meiner Domain?" — letztere enthaelt Zusagen
  (Umzug/E-Mail/Weiterleitungen), im Code markiert "TODO Thomas: Zusage-Umfang bestaetigen".

Varianten fuer die Bilder-Strecke (Vorschau-Routen, Live-Seite unveraendert):
- A "Typo-Werkbank": /relaunch-preview/leistungen/punkte-varianten/a
  (VarianteA.tsx + variante-a.css: riesige rote Ziffern, 03 als Outline-Sondermoment, keine Bilder)
- B "Echte Bauteile": /relaunch-preview/leistungen/punkte-varianten/b
  (VarianteB.tsx: 6 Skeleton-Bauteile: Notiz, Marken-Kacheln, Browser-Wireframe mit
  Entwurf-Stempel, Code-Editor, Dashboard, Freigabe-Liste; alles eckig, keine erfundenen Werte)
- Empfehlung an Thomas: B (Sektion = Produktbeweis). Joker-Idee (NICHT gebaut):
  rote Fragment-Figuren wie das Hero-Zahnrad, ein Motiv je Punkt.
- Bekannt: Variante B zeigt bei Punkt 06 noch die ALTE Copy (Route entstand parallel zur
  Copy-Aenderung) — beim Uebernehmen der Gewinner-Variante angleichen.

## Naechste konkrete Schritte
1. Dev-Server pruefen (npm run dev -- --port 9000), dann Thomas auf SEINEM Schirm zeigen:
   Hub-Aenderungen + Varianten A/B. Er waehlt Variante oder verlangt den Joker.
2. Gewinner-Variante in LeistungenUeberblick einbauen (neue Punkt-06-Copy + Preis-Zeile
   mitnehmen), Browser-QA, sein OK, Commit.
3. Domain-/Umzugs-Zusage in der FAQ von Thomas absegnen lassen (TODO im Code).
4. Danach seine weiteren Ansagen einzeln. Bestaetigte, aber NOCH NICHT beauftragte Ideen
   (nicht ungefragt bauen): Vertrauens-/Founder-Block (braucht sein Material), echtes
   Referenz-Beispiel mit Screenshot.
5. Falls er wieder eine stoerende Linie sieht: exakte Stelle mit SEINEM Screenshot klaeren,
   DOM-Scan: Array.from(document.querySelectorAll('*')).filter(el => {const s=
   getComputedStyle(el); return [s.borderTopWidth,s.borderBottomWidth].some(w=>w==='1px');})
6. Aufraeumen NACH Abnahme: Verlierer-Variante + punkte-varianten-Routen raus,
   TalosSlot.tsx/Scharnierzeile.tsx/ProduktTueren.tsx (unbenutzt, TEMP "use client" Zeile 1)
   entsorgen oder behalten.

## Blocker / Risiken
- Working Tree geteilt mit AKTIVEN Parallel-Sessions: talos/page.tsx wird umgebaut
  (Talos-Strang), neue Preise-Seite (Commits 311c10c, 25bd5f9), Talos-Companion (b9702b5).
  NUR eigene Hub-Dateien anfassen/committen. Diese Handoff-Datei wurde zwischenzeitlich
  von einer anderen Session ueberschrieben — bei Widerspruechen gilt DIESE Version (23.07.).
- Nicht pushen (Relaunch-Strang bewusst lokal).
- styled-jsx funktioniert im Relaunch NICHT zuverlaessig (2x aufgetreten: ProduktTueren,
  VarianteB): immer plain globales `<style>`-Tag mit namespaced Klassen verwenden.
- Dev-Server NIE parallel zu `next build` laufen lassen.

## Relevante Dateien/Befehle
- Hub: app/relaunch-preview/leistungen/page.tsx
- Sektionen: components/subpages/leistungen/ (LeistungenUeberblick.tsx +
  leistungen-ueberblick.css, LeistungenFaq.tsx, KundenSagen.tsx GETEILT mit Unterseite,
  SchlussCta.tsx, website/v2/TalosDashboard.tsx)
- Varianten: components/subpages/leistungen/punkte-varianten/ +
  app/relaunch-preview/leistungen/punkte-varianten/{a,b}/page.tsx
- tsc: npx tsc --noEmit · Tests: npx vitest run · QA: agent-browser Chrome, ECHTES Scrollen;
  Scroll-Sprung per JS window.scrollTo({top:N,behavior:'instant'}) funktioniert auf der Seite
