# Runbook: NotebookLM headless (Podcast-Erzeugung über MCP)

**Zweck:** Wenn die automatische headless-Podcast-Erzeugung bricht, sagt dieses Dokument WO, WIE, WANN und WAS zu tun ist. Diese Schicht ist bewusst fragil (NotebookLM hat keine offizielle API; der MCP fernsteuert die Webseite über veränderliche Selektoren). Erwartung: bricht periodisch bei NotebookLM-UI-Umbauten.

## Konto (wichtig, war eine Fehlerquelle)
- **Produktiv-NotebookLM-Konto = `t.uhlir@immo.red` (BEZAHLT).** Alle Red-Rabbit-Notebooks gehören hierher.
- `thomas.uhlir@gmail.com` ist ein GRATIS-Konto; das frühere Kosten-Pilot-Notebook (`3eccf288…`) wurde dort versehentlich angelegt → Waise, NICHT verwenden.
- Der MCP muss als `t.uhlir@immo.red` eingeloggt sein. Prüfen: `get_health` (authenticated), und ein `get_audio_status` auf ein t.uhlir-Notebook muss klappen.
- Konto wechseln: MCP-Tool `re_auth` (show_browser:true) → im aufpoppenden Fenster als t.uhlir@immo.red einloggen. NUR der Mensch gibt das Passwort ein.

## Wie der MCP funktioniert (Kurzmodell)
- Paket: `notebooklm-mcp@2.0.0` via npx. Quelle im Cache: `~/.npm/_npx/0d29dd9f4e472da9/node_modules/notebooklm-mcp/`.
- Auth = Playwright `storageState` (Cookies) in `state.json` im browserStateDir. Cookies laufen ab → dann `re_auth`.
- Kette: `generate_audio` → `get_audio_status` (pollt bis `ready`) → `download_audio` (.m4a).
- Selektoren (die brechen) liegen in `dist/notebooklm/selectors.js` unter `studio.*`.

## SYMPTOME → URSACHE
| Symptom (MCP-Fehler) | Ursache | Fix |
|---|---|---|
| `Could not find NotebookLM chat input` bei EINEM Notebook, anderes geht | Falsches Konto / kein Zugriff auf das Notebook | `re_auth` als t.uhlir@immo.red; sicherstellen, dass das Notebook diesem Konto gehört |
| `Could not find NotebookLM chat input` bei ALLEN Notebooks | Cookies abgelaufen ODER `textarea.query-box-input` / `textarea[aria-label="Feld für Anfragen"]` geändert | erst `re_auth`; wenn weiter kaputt → Selektor `chat`/`waitForNotebookLMReady` prüfen |
| `Could not find Audio more-menu button … UI may have changed` | MEIST falsches Konto (kein Zugriff → Seite rendert kein Artefakt) ODER Timing/Render-Race. Selten echter Selektor-Drift. | erst `re_auth` als t.uhlir@immo.red + sicherstellen dass das Notebook diesem Konto gehört; erneut versuchen; erst wenn es DANN reproduzierbar bricht → Selektor-Patch |
| Download-Menüpunkt nicht gefunden | `studio.audioDownloadMenuItem` veraltet (Stand 06/2026: Menüpunkt = Text "Herunterladen", Icon `save_alt` statt `download` — Text-Selektor greift noch) | Selektor-Patch siehe unten; alternativ Browser-Klick-Fallback |

## WIE den Selektor-Patch machen (Schritt für Schritt)
1. **Ground Truth holen:** In Chrome (als t.uhlir@immo.red) ein Notebook mit FERTIGEM Audio öffnen. DOM des Audio-Artefakts inspizieren:
   ```js
   const item=document.querySelector('artifact-library-item');
   [...item.querySelectorAll('button')].map(b=>({aria:b.getAttribute('aria-label'),cls:b.className,icon:(b.querySelector('mat-icon')||{}).textContent,trigger:b.classList.contains('mat-mdc-menu-trigger')}));
   ```
   Den Drei-Punkte-Button identifizieren (heute meist `button.mat-mdc-menu-trigger` mit aria-label "Mehr"). Dann den Button klicken und den Download-Menüpunkt inspizieren:
   ```js
   [...document.querySelectorAll('[role=menuitem]')].map(m=>({txt:m.textContent.trim(),icon:(m.querySelector('mat-icon')||{}).textContent}));
   ```
2. **Patchen:** Datei `~/.npm/_npx/0d29dd9f4e472da9/node_modules/notebooklm-mcp/dist/notebooklm/selectors.js`, Block `studio.audioMoreMenuButton` und `studio.audioDownloadMenuItem`. Neue Selektoren VORNE einfügen (Array wird der Reihe nach probiert), alte als Fallback lassen.
3. **Testen:** `mcp__notebooklm__generate_audio` + `get_audio_status` (ready) + `download_audio` auf ein t.uhlir-Notebook. Datei muss in destination_dir landen.
4. **Persistenz:** Der Cache-Patch hält, solange npm-latest = installierte Version (heute 2.0.0). Prüfen: `npm view notebooklm-mcp version`. Wird upstream > 2.0.0 → Patch nach Update erneut anwenden ODER die Version pinnen.

## WANN nachschauen (Alarm)
- Self-Check-Befehl (manuell jederzeit): siehe `scripts/content-engine/media/notebooklm_selfcheck.md` — Anleitung, den Dreischritt gegen ein Mini-Notebook zu fahren.
- Dead-Man: Wenn die headless-Medienkette produktiv läuft und KEIN Podcast erzeugt wird, schlägt der bestehende Gesundheits-/Totmann-Alarm an (Medien-Rückstau). Dann dieses Runbook abarbeiten.

## Browser-Klick-Fallback (wenn der MCP-Download mal bricht)
Im echten Chrome (eingeloggt als Besitzer-Konto des Notebooks) am fertigen Audio-Artefakt:
1. Drei-Punkte-Button klicken: `artifact-library-item button[aria-label="Mehr"]` (Icon `more_vert`, `mat-mdc-menu-trigger`).
2. Im Overlay den Menüpunkt klicken: `[role=menuitem]` mit Text **"Herunterladen"** (Icon `save_alt`).
3. WICHTIG: Echter Maus-Klick nötig (claude-in-chrome `computer`/`find`-Tool). Ein synthetisches `element.click()` via JS löst den Angular-Download NICHT aus (verifiziert).
4. Datei landet im Chrome-Download-Ordner → an Zielpfad verschieben.

## Stand 2026-06-11 (verifiziert)
- **Volle headless-Kette funktioniert auf t.uhlir@immo.red:** `generate_audio` → `get_audio_status` (ready) → `download_audio` → echte 40-MB-.m4a auf Platte. KEIN Selektor-Patch nötig.
- **Wahre Ursache der früheren Fehler war das KONTO**, nicht ein kaputtes Werkzeug: der MCP hing am falschen Konto (LinkedIn/Gratis) ohne Zugriff auf die Ziel-Notebooks → "chat input not found" / "more-menu not found". Nach `re_auth` als t.uhlir@immo.red: alles grün. Die Selektoren sind aktuell korrekt.
- **OFFEN für Produktivnutzung:** Die Red-Rabbit-Cluster-Notebooks müssen unter **t.uhlir@immo.red** liegen. Das Kosten-Pilot-Notebook (`3eccf288…`) ist eine Waise auf gmail → unter t.uhlir@immo.red neu anlegen.
- **Video:** NotebookLM kann es inzwischen NATIV ("Videoübersicht" im Studio), aber `notebooklm-mcp@2.0.0` wrappt nur Audio. Video bleibt vorerst manuell/anderer MCP.
