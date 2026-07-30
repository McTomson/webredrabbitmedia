# Naechste Session — Preise-Seite (Stand 2026-07-30, vormittags)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## Stand dieser Session (30.07. vormittags — Tipps-Seite + Preise-Update, ALLES committet + gepusht + live verifiziert)

### Erledigt + verifiziert
- **Tipps-Seite komplett fertig** (Commit `75eb812`, siehe Claude-Memory
  `project_tipps_uebersicht_artikel_2026_07_30.md` fuer Details): Filter-Bug
  gefixt, Artikel-Template neu gebaut (Sticky-Rail, E-E-A-T, helle Kaesten),
  9 Blog-Artikel auf neue Preise umgestellt.
- **Preise-Seite auf neue Preise umgestellt** (Commit `be2d77a`, Claude-Memory
  `project_preise_seite_cockpit_2026_07_30.md`): Starter **1.250 €** (war 950),
  Business **2.850 €** (war 2.900), Premium unveraendert **ab 4.900 €**.
  Geaendert: `PreiseMatrix.tsx` (PREIS-Map + Guard-Kommentare), `page.tsx`
  (JSON-LD Offers, Meta-Description), `agb/page.tsx` (Preisbindungsklausel).
- **Neues Merkmal "Dein Cockpit"** in allen drei Paketen ergaenzt
  (`stufen-varianten/VarianteA.tsx` — speist auch die Leistungen-Website-Seite
  automatisch mit): "Dein persönliches Dashboard: sammelt die wichtigsten
  Infos zu deinem Auftritt aus Google und anderen Quellen an einem Ort. Talos
  und die KI-Agenten kommen bald dazu." Begriff bewusst "Cockpit" (nicht
  "Kommandozentrale"/"Copilot" — Fable-Entscheidung auf Thomas' "such dir aus").
- **Talos-Talente als "Bald verfügbar" markiert**: roter Badge + Satz in
  `TalosTalenteFahrt.tsx` und `MehrwertRechner.tsx` — Ehrlichkeit zum
  Produktstand (Talos-Talente sind noch NICHT buchbar, nur das Cockpit ist
  ab Tag 1 dabei).
- Beide Deploys: Vercel Ready, Live-Marker auf v2.redrabbit.media verifiziert
  (curl + Playwright headless, Screenshots geprüft, kein horizontaler
  Overflow, keine Konsolen-Fehler).
- Preis-Entscheidungen dokumentiert in `brand/decisions-log.md` (zwei
  Eintraege vom 30.07.: Artikel-Preise + Preise-Seite/Cockpit).

### Offen / naechste konkrete Schritte

**Sofort einsammelbar (kurz, klar):**
1. **Premium-Preis bestaetigen lassen** — Thomas hat nur Starter/Business neu
   genannt (1.250/2.850). "ab 4.900 €" fuer Premium ist der ALTE Wert, einfach
   unveraendert gelassen. Falls sich der auch aendert: `PREIS`-Map in
   `PreiseMatrix.tsx`, JSON-LD-Offer in `page.tsx`, ggf. `PreiseFaq.tsx`-Antwort
   "Was bedeutet 'ab 4.900' beim Premium-Paket?" anpassen.
2. **Blog-Artikel-Preis-Fragen aus der Tipps-Session** (siehe
   `NEXT_SESSION_tipps.md` UPDATE-Block): 1.990-Nennungen in
   `website-10-seiten-kosten.mdx` + `herold-webseite-vs-agentur-vergleich.mdx`,
   ROI-Beispiel 2.500 in `was-kostet-eine-website.mdx:103`.
3. **FAQ-Seite** (`app/relaunch-preview/faq/page.tsx`,
   `components/subpages/faq-demo/demo.body.html`) nennt noch "Starter ab 950,
   Business ab 2.900" — NICHT angefasst, weil eine ANDERE parallele Session
   dort gerade uncommittete WIP-Aenderungen hat (Arbeitsregel: fremde Straenge
   nicht anfassen). Erst pruefen ob die Session noch aktiv ist (`git status`),
   dann nachziehen.
4. **GROSSE Angleichung (eigene Runde, mit Thomas absprechen):**
   `lib/config.ts` `PRICING` (`baseline: 'ab 790 €'`, `standard: '1.990 €'`,
   `premium: 'ab 3.500 €'` — das ist die LIVE-Seite, komplett anderer Stand),
   `brand/pricing.md`, `brand/PREISE_SEITE_BRIEF.md`. Widerspruch zwischen
   950/2.900/4.900 (aelterer decisions-log-Stand) und jetzt 1.250/2.850/4.900
   ist dokumentiert, aber NICHT projektweit aufgeloest.

**Von Thomas bereits gegrillt/gelockt (25.07.), noch NICHT gebaut — weiterhin gueltig, Prioritaet pruefen ob noch aktuell nach dem Preis-Update:**

### A) Talos-Sektion: Fahrt-Felder = PREISE statt Faehigkeits-Text
Die seitwaerts-Fahrt (TalosTalenteFahrt.tsx) zeigt aktuell 7 Faehigkeits-Slides mit Nutzen-Text, KEINE Preise. Thomas wollte auf der Preisseite statt dessen PREIS-Felder. **ACHTUNG:** seit dem 30.07.-Update ist die Talos-Sektion als "Bald verfügbar" markiert — mit Thomas klaeren, ob Preis-Felder fuer ein noch-nicht-buchbares Feature ueberhaupt noch Sinn ergeben, oder ob das Konzept sich durch "Coming Soon" veraendert hat. Gelockte Struktur (25.07., vor der Coming-Soon-Entscheidung):
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

### Kleinere offene Copy-/Brand-Punkte (aus review-it Security, 25.07.)
- SchlussCta "ohne Risiko" — starke Aussage, gedeckt; bei Bindungs-Einfuehrung neu pruefen.
- Rechner-Vergleichswert (frueher ~950) kollidierte mit Starter-Preis — jetzt durch das 30.07.-Update ohnehin ueberholt (Starter ist 1.250, BASE_CLASSIC im Rechner ist weiterhin 950 als reiner Team-Vergleichswert, NICHT der Paketpreis — beim Rechner-Umbau (Punkt B) sauber trennen).

## Blocker / Risiken
- Branch `relaunch` ist GETEILT: vor Arbeit `git fetch` + `git log -15`; nur
  eigene Dateien gezielt stagen (KEIN `git add -A` — Dutzende fremde
  untracked WIP-Dateien im Tree, u.a. eine aktive FAQ-Session).
- Dev-Server Port 9000 (`npm run dev -- --port 9000`); friert er ein (alle
  Routen Timeout): Prozess killen + neu starten. KEIN `npm run build` bei
  laufendem dev-Server.
- QA: Chrome-Extension-Tab hat FIXEN Viewport 1800x807 (resize wirkt nicht)
  und drosselt rAF im Hintergrund. Fuer Mobile-/Viewport-QA: python3 +
  playwright headless (installiert, `~/.local/bin/playwright`).

## So startest du
```bash
cd ~/dev/redrabbit
git fetch && git log --oneline -10   # geteilter Branch, Stand pruefen
npm run dev -- --port 9000
open http://localhost:9000/relaunch-preview/preise
```
Seite tot (kein Menue, Konsole sauber)? -> `curl -s -o /dev/null -w '%{http_code}' localhost:9000/_next/static/chunks/main-app.js` (404 = ein Build hat den Dev-Server zerschossen, kein Code-Bug).
