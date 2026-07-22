# Naechste Session — LEISTUNGEN-Hub Feedback-Runde (22.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## WICHTIGSTER KONTEXT: Thomas hat den Umbau NICHT abgenommen
Session 22.07. hat den Hub auf die Website-Designregeln gebracht (Commit 6904727) —
Thomas' Urteil danach: "leider nicht wirklich alles umgesetzt wie ich es wollte,
die Linie ist immer noch da und der Rest passt auch noch nicht". Er will in der
naechsten Session PUNKT FUER PUNKT durchgehen und einzeln ansagen, was zu tun ist.
ALSO: NICHTS gross vorbauen — Session starten, Seite oeffnen, seine Ansagen einzeln
umsetzen, jede Aenderung SOFORT mit ihm am Browser verifizieren bevor die naechste kommt.

## Stand dieser Session (Commit 6904727 lokal, tsc gruen, vitest nicht noetig)
Umgesetzt auf /relaunch-preview/leistungen (Hub):
- wd-eyebrow (Klammer-Stil) in geteilte Datei components/subpages/leistungen/wd-eyebrow.css
  verschoben (aus website.css raus); Hub-Sektionen (Ueberblick, TalosSlot, FAQ, SchlussCta)
  auf wd-eyebrow umgestellt (.lu-eyebrow entfernt).
- Sektionsabstaende auf --rr-section-y-Rhythmus (Ausnahme bewusst: LeistungenUeberblick-
  Anfang, an Hero-Zerfall-Mathe gekoppelt, -84vh — NICHT anfassen).
- TalosSlot-Sektion auf Grau var(--rr-surface, #f4f4f2).
- SchlussCta nach lw-cta-Muster (wd-eyebrow--ondark, display-2 + roter Punkt, 2 Buttons
  sweep-red Entwurf + frame-red Anrufen; "Preise ansehen"-Button entfernt).
- NEU ScrollBumper.tsx (eigenstaendige Stups-Mechanik: Satz steht, naechster schiebt von
  unten; rAF + Rect-Progress; reduced-motion statisch) — ersetzt Scharnierzeile im Hub
  mit 3 Saetzen (pointe "Rund um die Uhr. Mit Talos im Team."). Scharnierzeile.tsx existiert noch.
- NEU ProduktTueren.tsx: Teal-Sektion (world-1-bg) "Eine Website. Und ein Mitarbeiter,
  der schon drinsteckt." mit grosser Teal-Flaeche "Die Website" + eingebetteter Navy-Karte
  "Talos, dein Mitarbeiter" (Router zu beiden Unterseiten; Hierarchie = Talos ist Teil,
  kein zweites Produkt). Eingebaut zwischen TalosSlot und KundenSagen.
- kunden-sagen.css: border-top/border-bottom der .ks-section ENTFERNT.

## OFFENE PROBLEME (Thomas' Feedback, noch NICHT geklaert)
1. **DIE LINIE IST IMMER NOCH DA.** Die entfernten ks-section-Borders waren offenbar
   nicht (die einzige) Quelle. NAECHSTER SCHRITT: mit Thomas klaeren WO genau er sie
   sieht (Screenshot/Scrollposition), dann im DOM den Verursacher finden (Kandidaten:
   ReferenzenTeaser hat borderTop/Bottom inline; LeistungenUeberblick-CSS; evtl.
   Dev-Server-Cache/HMR — Seite hart neu laden bevor gefixt wird; evtl. schaute er
   auf /leistungen/website statt Hub). Dokumentweiter Scan:
   Array.from(document.querySelectorAll('*')).filter(el => {const s=getComputedStyle(el);
   return [s.borderTopWidth,s.borderBottomWidth].some(w=>w==='1px');})
2. Bumper-Copy, ProduktTueren-Look/-Texte, CTA-Umbau: alles von mir entworfen, Thomas
   hat NICHTS davon abgenommen ("der Rest passt auch noch nicht"). Auf seine Ansagen warten.
3. ProduktTueren.tsx hat in Zeile 1 ein TEMP "use client" (kam von Parallel-Session-QA,
   Kommentar sagt "wird zurueckgesetzt") — bei Gelegenheit pruefen/entfernen (Komponente
   war als Server-Komponente mit plain <style> gebaut).
4. Offene inhaltliche Vorschlaege an Thomas (aus meiner Analyse, unbeantwortet):
   Preis-Hinweis frueher (ohne Zahlen!), Founder-/Gesicht-Block vor KundenSagen,
   FAQ-Ergaenzungen (Dauer, alte Seite/Domain), Zielgruppen-Wiedererkennung (Quiz-Teaser).
   NICHT ungefragt bauen.

## Naechste konkrete Schritte
1. Dev-Server pruefen/starten: cd ~/dev/redrabbit && npm run dev -- --port 9000
2. Seite mit Thomas oeffnen (http://localhost:9000/relaunch-preview/leistungen), HART
   neu laden (Cache), Linie lokalisieren und fixen — erst wenn ER sie weg sieht, weiter.
3. Dann seine Punkte einzeln entgegennehmen, je Punkt: umsetzen -> Browser zeigen -> OK holen.
4. Erst nach seiner Abnahme: Sammel-Commit(s) lokal, Handoff aktualisieren.

## Blocker / Risiken
- Working Tree geteilt mit Parallel-Straengen (Rechtsseiten, Talos-Seite, GalleryChrome
  u.v.m. modified + viele untracked PNGs) — NUR eigene Hub-Dateien committen.
- Nicht pushen (Relaunch-Strang bewusst lokal).
- Lesson dieser Session: "Linie weg" wurde von mir als verifiziert gemeldet, Thomas sieht
  sie trotzdem. Visuelle Fixes erst als erledigt melden, wenn Thomas sie auf SEINEM
  Bildschirm bestaetigt hat (siehe Memory feedback_visuelle_fixes_thomas_bestaetigt).

## Relevante Dateien/Befehle
- Hub: app/relaunch-preview/leistungen/page.tsx; Sektionen unter components/subpages/leistungen/
  (LeistungenUeberblick, ScrollBumper NEU, TalosSlot, ProduktTueren NEU, KundenSagen,
  LeistungenFaq, SchlussCta, wd-eyebrow.css NEU, leistungen.css, kunden-sagen.css)
- Vorbild: /relaunch-preview/leistungen/website (Regeln-Inventar siehe Session 22.07.,
  Eyebrow website->wd-eyebrow.css, Buttons styleguide.css:746ff sweep/frame)
- tsc: npx tsc --noEmit · Tests: npx vitest run · QA: agent-browser/Chrome, ECHTES Scrollen
