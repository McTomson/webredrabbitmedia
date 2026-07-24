# Naechste Session — Preise-Seite (Stand 2026-07-25, nachts)

## Arbeitsregeln (verbindlich)
- Lies ZUERST: diesen Handoff, MEMORY.md, docs/lessons.md, betroffene Dateien.
- NIE raten — verifizieren (Code/Browser/Docs). Bei Unsicherheit fragen oder fail-closed. Verschaerft fuer PREISE.
- Erst Plan (TodoWrite), dann ausfuehren. Skills + parallele Sub-Agenten (verschiedene LLM je Aufgabe) nutzen.
- Bau-Agenten Design-Entscheidungen WOERTLICH mitgeben + verworfene Gegen-Option (L-preise-03).
- Laufend testen + `review-it` bei groesseren Schritten.
- **VOR jedem Deploy: `next lint` UND `next build` lokal gruen** (tsc reicht NICHT — L-preise-05). Dev-Server dafuer stoppen (L-preise-02), danach neu starten.
- Deploy nur Preview, nie prod. Ready NUR via `vercel inspect <url>` = Ready melden (SSO-302 luegt).
- GETEILTER Branch `relaunch`: vor Arbeit `git fetch` + `git ls-remote origin relaunch`, nur EIGENE Dateien stagen. ACHTUNG: Thomas committet teils selbst parallel im selben Working Tree (diese Session war e006b00 seiner). Vor Commit HEAD gegen Remote pruefen.

## Stand am Session-Ende (ALLES committet + gepusht + deployt)
origin/relaunch = **a89155a**. Commits dieser Session: 5a2c3da (grosser Umbau) -> e006b00 (Thomas' Build-Fix, gerades Anfuehrungszeichen) -> a89155a (Bumper-Fix). review-it: GO (Decision-Log docs/reviews/preise-talos-umbau-2026-07-24.md). Preview zuletzt Ready (Link im Chat).

### Fertig + abgenommen (Preis-Logik + Struktur)
- Preise FESTGELEGT und autoritativ in **brand/decisions-log.md 24.07.** (Basis-Team 360 Einfuehrungspreis, Setup 290, zzgl USt; Poster/Aussendienst 290, Ads ab 390, Sichtbarmacher +120; Team-Rabatt 10% ab 2 Modulen; KMU.DIGITAL nur Website+Setup; KI-Telefon RAUS). Research: docs/strategie/TALOS_MODUL_PREISE_RESEARCH_2026-07-24.md + TALOS_ADS_PREIS_RESEARCH_2026-07-24.md.
- Hero getauscht (Text links, Chart-Figur rechts). Bumper = wiederverwendeter ScrollBumper (Navy, zentriert). RisikoBand entdoppelt. Paket-Karten mit Anfrage-CTA. Betreuung = schlichter KMU-Text. Talos-Intro-Panel (Figur rechts, 135 Jahre). Mehrwert-Rechner (Basis 360 vs klassisch).
- 3D-Companion: TalosCompanionStage bekam rueckwaertskompatiblen `stationsOnly`-Prop (kapert den Preise-Hero nicht). Figur haengt als data-talos-station am Slot in TalosTalenteFahrt (anchor .78, size l, gesture wave, appear .4). Talos-Leistungsseite unveraendert (verifiziert).

## OFFEN — naechste Runde (mit Thomas per grill-me 25.07. GELOCKT)

### A) Talos-Sektion: Fahrt-Felder = PREISE statt Faehigkeits-Text
Die seitwaerts-Fahrt (TalosTalenteFahrt.tsx) zeigt aktuell 7 Faehigkeits-Slides mit Nutzen-Text, KEINE Preise. Thomas will auf der Preisseite statt dessen PREIS-Felder. Gelockte Struktur:
- **Intro-Block** (Talos-Figur + 135 Jahre) bleibt und geht **GLEICH nach rechts** in Feld 1 ueber (aktuell geht die Fahrt "erst ein Feld runter, dann nach rechts" — das ist zu fixen, Thomas' Wortlaut).
- **Feld 1 = Muss-Paket "Basis-Team 360"**: listet die 3 enthaltenen Rollen (Schreiber, Empfang, Chatbot) je mit EINER Nutzen-Zeile + Setup 290 + zzgl USt.
- **Feld 2 = Poster + Sichtbarmacher** (je Nutzen-Zeile + Preis: Poster 290, Sichtbarmacher +120).
- **Feld 3 = Aussendienst + Ads** (je Nutzen-Zeile + Preis: 290, ab 390).
- **Feld 4 = Spezial/Custom** — auf Anfrage.
- **Feld 5 = der Rechner** (letztes Feld IN der Fahrt, Thomas-Entscheidung; die letzte Slide steht still, Interaktion dort ok).
- Jede Rolle: kurze Was-macht-er-Zeile + Preis (nicht nur Name, nicht der ganze Faehigkeiten-Absatz).

### B) Rechner umbauen: Vergleich gegen BEIDE — Mitarbeiter-brutto UND Agentur
Aktuell vergleicht MehrwertRechner.tsx nur gegen "klassisch extern". Neu: zwei Vergleiche neben unserem Paket-Preis: (1) was EIGENES Personal brutto kostet (inkl. AT-Lohnnebenkosten ~+30%), (2) was Agenturen/Dienste verlangen (Anker aus dem Research schon belegt).
- **ZUERST die Brutto-Zahlen an echten AT-Gehaltsdaten verifizieren** (nicht erfinden — Ehrlichkeits-Regel). Team-Summe vs. Personal-Summe ehrlich framen (ein Modul != ein ganzer Mitarbeiter).

### C) Talos-Figur-Fixes
- Winkt mit der FALSCHEN Hand -> andere Hand.
- **Einmal** winken beim Ankommen reicht, danach NUR bei Klick (aktuell offenbar mehr). Gesten-Logik in TalosCompanionStage.tsx (GESTURES-Array, data-talos-gesture, Doppelklick-Zyklus).

### Kleinere offene Copy-/Brand-Punkte (aus review-it Security)
- SchlussCta "ohne Risiko" — starke Aussage, gedeckt; bei Bindungs-Einfuehrung neu pruefen.
- Rechner-Vergleichswert (frueher ~950) kollidierte mit Starter-Preis 950 — beim Rechner-Umbau eh neu.

## So startest du
```bash
cd ~/dev/redrabbit
git fetch && git ls-remote origin relaunch   # geteilter Branch, HEAD gegen Remote pruefen
npm run dev -- --port 9000
open http://localhost:9000/relaunch-preview/preise
```
Seite tot (kein Menue, Konsole sauber)? -> `curl -s -o /dev/null -w '%{http_code}' localhost:9000/_next/static/chunks/main-app.js` (404 = ein Build hat den Dev-Server zerschossen, kein Code-Bug).

Erster Schritt: A + C bauen (Fahrt-Felder + Figur-Fixes), parallel die Brutto-Research fuer B; dann Rechner umbauen; dann review-it + voller Build + Deploy.
