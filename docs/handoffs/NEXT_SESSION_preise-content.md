# Naechste Session — Preisseite Optik-Feinschliff (fix-forward, kleinschrittig) (2026-08-11)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, STATE.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe (TaskList/BashOutput/Monitor). Bricht ein Tool ein → STOPP + fixen, keine kaputten Daten schreiben. Nicht endlos haengen.

## WICHTIGSTE REGEL FUER DIESEN STRANG (Thomas 10./11.08., nach Frust)
- KLEINSCHRITTIG: EIN Abschnitt aendern → Screenshot zeigen (lokal MCP-Chrome geht fuer STATISCHE Sektionen) → Thomas-Freigabe → dann der naechste. NICHT gebuendelt viel auf einmal.
- Abstaende/Rhythmus/Backgrounds EXAKT von einer bestehenden Seite uebernehmen, die Thomas mag — KEINE eigenen clamp()-Werte erfinden, nichts umbauen was schon funktioniert.
- Motion/3D auf diesem Projekt NIE selbst verifizierbar (MCP-Chrome: 3D rendert nicht, rAF im Tool-Tab eingefroren) → Thomas nimmt Motion/3D auf SEINEM Geraet ab. Siehe [[feedback_kleinschritte_muster_matchen_statt_erfinden]].

## Stand dieser Session
### Erledigt + auf v2 deployed (Content SSR-verifiziert; Motion/3D NUR von Thomas abzunehmen)
- **Batch 1 (2344bf3)** — Preisseiten-Content: Hero-Satz neu ("Du willst eine neue Website? ..."), "Kein Risiko" raus, Button "Vorschlaege anfragen"; Fundament neu ("Was andere extra berechnen, ist bei uns Standard", 6→9 ausfuehrliche Aufklapp-Punkte); Pakete KUMULATIV (Starter=Fundament+One-Pager → Business="Alles aus Starter"+X → Premium="Alles aus Business"+Y), ENTKOPPELT von VarianteA/STUFEN (Website-Seite unveraendert), "Warum ab?"+Custom-Absatz raus; Review "Herrn Uhlir" raus (ehrlich gekuerzte echte Rohrer-Rezension); Foerderung aufklappbar+ehrlich (KMU.DIGITAL aktuell ausgeschoepft → neutral + Links kmudigital.at/aws, kein Betrags-Versprechen); FAQ "Was kostet eine Website" SEO-stark; Talos-Text + CTA "Nachfragen".
- **Bumper-Glide (309452a)** — ScrollBumper (EINZIGER Nutzer=/preise) hatte gehakt (hielt lang, sprang). Fix: eigene glideUnits-Kurve + Strecke 150→120vh, LOKAL (CasePanels/Homepage unberuehrt). Thomas-Rueckmeldung: lief dann "haelt lang, springt" → mit Glide-Kurve adressiert. NOCH von Thomas final abzunehmen.
- **Talos-Figur (1922a74)** — /preise-Station: Hand "wave"→"wave2" (andere Hand), Groesse "l"→"m", data-talos-mobile + mobile-anchor 0.82 + mobile-size xs (mobil klein rechts unten; Station-Element mobil IN FLOW statt display:none). Winktempo global GREETING_DURATION 3.2→4.6s (talosMotion, GETEILT: wirkt auf alle Talos-Waves inkl. Talos-Leistungsseite + Bundesland).

### Thomas' Design-Korrektur (10./11.08., Kern der offenen Arbeit)
Die Seite ist ihm ZU ENG/ZU VOLL und die dunklen Baender stoeren. Richtung:
- **Navy/Blau RAUS → dunkleres Weiss (#f4f4f2)** bei Risiko-Band UND Talos-Panel (beide waren SCHON VOR der Session navy — git-bestaetigt; Thomas will sie jetzt hell).
- **Leichter + mehr Abstand**, "wie bei den anderen Seiten". Bestehende Muster matchen, nicht erfinden.
- Talos-3D-Figur zeigt bei Thomas gerade NICHT an; "unterschiedliche Blautoene" = navy CSS vs 3D-Szene.

### IN ARBEIT — fix-forward, kleinschrittig (Content bleibt, nur Optik)
- **Schritt 1 ERLEDIGT (committet in dieser Session):** RisikoBand.tsx navy→#f4f4f2, seitenfuellender Void (min-height:100svh, war MEIN Fehler) RAUS, Textfarben auf hell (statement navy, body ink-soft, anchor dunkel), CTA bleibt. Lokal-Screenshot gezeigt, Thomas "ok".
- **Schritt 2 OFFEN:** `PreiseFundament.tsx` Abstaende leichter/mehr Luft — EXAKT an einer bestehenden Seite ausrichten, die Thomas mag (nicht erfinden). Ggf. Textdichte reduzieren (9 Punkte mit viel Text wirken eng).
- **Schritt 3 OFFEN:** `BetreuungFoerderung.tsx` Abstaende richten (gleiche Logik).
- **Schritt 4 OFFEN:** `TalosTalenteFahrt.tsx` navy→#f4f4f2. ACHTUNG: metallische 3D-Figur + Szene wurden fuer navy gebaut → auf hellem Grund Kontrast/Lesbarkeit + Figur-Anzeige neu pruefen (Thomas' Geraet). Klaeren, warum Talos bei Thomas gerade nicht anzeigt.

## Offene Flags / Risiken
- FloatingReview-Karte ragt rechts ueber den Rand (bestehendes Verhalten) — evtl. sauber reinholen.
- Dead CSS in PreiseMatrix.tsx: `.rp-matrix__ab*`, `.rp-matrix__custom` (ungenutzt seit "Warum ab?"-Block raus) — bei Gelegenheit entfernen.
- GETEILT: GREETING_DURATION-Aenderung wirkt auf ALLE Talos-Waves — Talos-Leistungsseite + Bundesland-Seiten mit anschauen.
- PARALLEL-SESSION auf `relaunch` (Steiermark/Bundesland, Commits 268b27c/5013459/ff2ffd4). NUR eigene /preise-Dateien anfassen, NIE deren Handoff `NEXT_SESSION_bundesland-landingpages.md`. FREMD-WIP nicht committen (faq/page.tsx, SiteClosing.tsx, faq-demo, docs/*).

## Relevante Dateien / Befehle
- Route: `app/relaunch-preview/preise/page.tsx`; Bausteine `components/subpages/preise/` (RisikoBand, PreiseFundament, PreiseMatrix, BetreuungFoerderung, TalosTalenteFahrt, PreiseFaq, FloatingReview).
- Bumper: `components/subpages/leistungen/ScrollBumper.tsx` (glideUnits lokal); Talos-Motion: `components/relaunch/talos/talosMotion.ts` (GREETING_DURATION geteilt), Station-Attribute in `TalosTalenteFahrt.tsx`.
- Dev: `npm run dev -- --port 9200` LAEUFT (ich habe ihn in der Session neu gestartet, war global gewedged). KEIN `npm run build` bei laufendem dev.
- Deploy: Branch `relaunch`, post-commit-Hook pusht+deployt v2 automatisch. Verifizieren: `git ls-remote origin relaunch` gegen HEAD. Preise-URL: https://v2.redrabbit.media/relaunch-preview/preise
- NIE `git add .`/`-u` — nur eigene Dateien explizit. Untracked WIP (TalosChoreoStage/talosMoodMotion/PNGs) NIE mitcommitten.
