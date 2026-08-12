# Naechste Session — SERP-Snippets: Monitoring + naechste Runde (2026-08-12)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md (Eintraege snippet-hooks-dashboard-feature, vorkasse-claim-praezise-formulieren, redrabbit-golive-vollzogen-2026-08-12), betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Agenten-/Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein: STOPP + fixen.
- ORCHESTRIERUNG: Fable 5 plant/prueft nur; Code schreiben NUR Subagenten (opus fuer Code, sonnet fuer Research), Executor in Worktrees von origin/main. NEUE REGEL (Thomas 12.08.): Es wird NUR NOCH auf main gearbeitet (= live web.redrabbit.media), Branch relaunch ist eingefroren. Lokaler Checkout traegt fremde WIP — NIE fremde Dateien stagen.

## Stand dieser Session (12.08. nachmittags/abends)
- Erledigt + verifiziert: Finale verkaufsoptimierte SERP-Snippets (17 Seiten) LIVE auf web.redrabbit.media (Commit dd96896 auf main, curl-verifiziert). Nur metadata title/description + og synchron; sichtbare H1/Heros bewusst NICHT geaendert. IndexNow 17 URLs 200 OK; GSC-Indexierung beantragt fuer /leistungen/talos, /leistungen/website, /faq (Home, /preise, /webdesign-wien steckten schon in der Warteschlange von 12.08. frueh).
- Wissensbasis: Snippet-Playbook v3 als Artefakt "Snippet-Playbook v3 — Red Rabbit bei Google" (63 Varianten: 9 Seiten x 7 Muster A-G + 8 Bundesland-Varianten + Schema + Sterne/Emoji/Bilder-Verdikt + Quellen). Scratchpad-Quelle ist session-gebunden — bei Bedarf Artefakt per WebFetch lesen.
- Entschieden (Thomas): Sterne/Emoji NEIN (Google filtert, UWG); ✓ in Descriptions JA; Preis nur auf /preise; "aus Oesterreich" nicht als Hauptclaim; Bundeslaender einheitlich "Webdesign [Land]: Warum rufen keine Kunden an?" statt Branchen-Nischen; Frage im Titel wird in der Description NIE beantwortet (nur anfuettern).

## MISSION naechste Session
1. **SERP-Watch:** site:web.redrabbit.media (gesamt + Kernseiten) — ersetzen die neuen Hook-Titel die alten Cache-Snippets? Schreibt Google Titel um (Rewrite-Check: angezeigter vs. gesetzter Titel)? Befund je Seite dokumentieren.
2. **GSC-Baseline + CTR:** Leistungsbericht je URL+Query notieren (Baseline ab 12.08.). REGEL: Urteile erst ab ~300-500 Impressionen je Seite; vorher nur sammeln. Nach ~4 Wochen: Verlierer gegen naechste Variante aus dem Playbook tauschen (Executor, Worktree, main).
3. **Title-Rewrite-Gegenmassnahme (nur falls noetig):** Wenn Google Hook-Titel massenhaft umschreibt: H1-Sync-Frage mit Thomas klaeren (H1=Title senkt Rewrite-Risiko von ~61-76% auf ~20%, aendert aber sichtbare Ueberschriften -> Geraete-Abnahme!).
4. **Bild-Hebel (aus Playbook Abschnitt 02, noch OFFEN):** Favicon als 48x48-PNG korrekt deklariert? og:image/prominentes Bild fuer Mobile-Thumbnail? Breadcrumb-Schema ueberall aktiv? GBP-Fotos einpflegen (mit Thomas).
5. **Sichtbare Copy-Korrektur (OFFEN):** "ohne Vorkasse"-Formulierungen im SEITENTEXT (nicht Metadaten) gegen Memory-Regel vorkasse-claim-praezise-formulieren pruefen und korrigieren ("Vorschlaege gratis, bevor du dich entscheidest").
6. **Dashboard-Feature vormerken:** Snippet-Varianten + CTR-Messung kommt in die Talos-Konsole (Memory snippet-hooks-dashboard-feature) — bei Dashboard-Arbeit einplanen.

## Blocker / Risiken / Lessons
- GSC-UI-Falle: Klick in die URL-Pruefungs-Suchbox per Koordinate schlaegt fehl; Return loest stattdessen den "Live-URL testen"-Flow aus. FIX: Element per mcp find (ref) klicken, dann tippen. Fenstergroesse kann sich aendern -> Koordinaten nie wiederverwenden.
- Worktree hat kein node_modules: Executor hat Symlink auf Haupt-Checkout gelegt (gitignored) — Muster fuer kuenftige Builds im Worktree.
- GSC-Kontingent: 12.08. insgesamt 6 URL-Antraege (frueh 3 + abends 3). Nicht doppelt beantragen ("Ein Fehler ist aufgetreten").
- Fremde Parallel-WIP im Checkout (faq, SiteClosing, preise-preview, talos-choreo u.a.) — NIE stagen.
- Weiter offen aus Vor-Straengen: Thomas-Geraete-Abnahmen (Talos-3D, Mobile, USP-Wortlaut), GBP/Bing-UI-Anmeldung, v2-Stilllegung, Dashboard-Routen-Diaet, generate_lead ist inzwischen von Parallel-Session gebaut (5de25cf).
