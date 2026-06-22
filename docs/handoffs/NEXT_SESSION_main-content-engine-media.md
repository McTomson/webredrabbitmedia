# Naechste Session — main / content-engine media (Gemini-Bilder voll headless) — 2026-06-22

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, `content-engine/knowledge/media-notes.md`, CLAUDE.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite/TaskCreate), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- Bei langen Hintergrund-Laeufen ALLE 15 MIN Health-Check + Stichprobe. Bricht ein Tool ein → STOPP + fixen.

## Repo / Umgebung (KRITISCH)
- Arbeits-Repo = **Bot-Worktree `~/dev/redrabbit-daily`** (immer `main`). NIE `~/dev/redrabbit`. Vercel deployt nach Push auf main. Live = `https://web.redrabbit.media`, Artikel `/tipps/<slug>`.
- **Konten:** NotebookLM + Gemini = `t.uhlir@immo.red`. **Gemini-Browser-Index: `https://gemini.google.com/u/3/app`** (das bare `/app` oeffnet das FALSCHE gmail-Konto). YouTube via OAuth-Token. Substack = redrabbitlab.substack.com.
- **`claude`-CLI-FALLE (Dauerproblem):** Das nvm-Auto-Update hinterlaesst periodisch einen kaputten `claude.exe`-Stub (`~/.nvm/.../bin/claude` → "native binary not installed"), der das funktionierende Homebrew-`claude` (`/opt/homebrew/bin/claude`) im PATH ueberschattet. Ein **Shell-Hook ruft bei JEDEM Bash-Befehl `claude` auf** → wenn der Stub kaputt ist, spammt jeder Befehl die "native binary not installed"-Fehlermeldung in den Output (stoert grep/Befehlssubstitution). GEGENMITTEL: kaputten nvm-claude beiseiteschieben (`mv ~/.nvm/versions/node/v20.20.0/bin/claude{,.broken}`), dann zeigt `claude` auf Homebrew. Fuer Node-Scripts `/opt/homebrew/bin/node` direkt nutzen + `NODE_PATH="$PWD/node_modules"`. Logs IMMER in Datei schreiben (`> /tmp/x.log 2>&1`) und mit dem Read-Tool lesen (kein grep → kein Hook-Spam).
- **Zusatz:** headless `claude -p` haengt zeitweise generell → der LLM-Art-Director (`buildImagePlan`) scheitert/timeoutet. Workaround: `plan.json` SELBST schreiben (siehe unten).

## Stand dieser Session (alles committet + gepusht, live verifiziert)
Letzte Commits: bis `e5b2648`. Die zwei Tagesartikel **21.06 (`wer-uebernimmt-die-texterstellung-fuer-die-neue-website`) + 22.06 (`muessen-bilder-und-grafiken-selbst-geliefert-werden`)** waren ohne Bilder + ohne Podcast rausgegangen. JETZT BEIDE KOMPLETT (Hero + 3 Kontextbilder + Infografik + Video + Podcast) — server-seitig alle 16 Assets HTTP 200, visuell in Chrome bestaetigt.

### Ursachen (waren 2 getrennte Bugs) + was gefixt wurde
1. **Kein Podcast:** kaputter nvm-`claude` brach den MCP-Podcast (`generate-podcast.sh` ruft `claude -p`). FIX: **Podcast laeuft jetzt ueber die `notebooklm-py` CLI** = `scripts/content-engine/media/generate-podcast-cli.sh` (eigenes Notebook, eigene Auth, KEIN claude/Pool). In `run-media-check.sh` verdrahtet. Commits `e7f7f5f`, `066a1c6`. Plus `generate-podcast.sh` (alt) hat jetzt einen `resolve_claude`-Backstop.
2. **Keine Bilder / kaputtes Hero (404):** Codex (`images-only.ts`) ist LEER (Usage-Limit bis ~Mitte Juli). FIX bisher: (a) **Hero-Guard** in run-media-check.sh (laute Notification wenn Hero fehlt), (b) **Trigger wasserdicht** `5a095fc`: wenn nach dem Medien-Tail das Hero fehlt, legt der Job einen persistenten `needs-images`-Marker an (`content-engine/.media-requests/<slug>.json`, status `needs-images`) statt still "fertig" zu melden → Gemini-Bildschritt wird zuverlaessig nachgezogen statt uebersprungen.

### Bilder-Backfill-Flow (HEUTE manuell gemacht; das ist der Ablauf, den Teil 2 automatisieren soll)
1. **plan.json selbst schreiben** nach `scripts/content-engine/.work/<slug>-staging/plan.json` (NICHT auf den haengenden `buildImagePlan`-LLM warten). Schema in `scripts/content-engine/image.ts` (ImagePlan) + `scripts/content-engine/image/sketchInfographic.ts` (SketchData): `{ heroConcept, items:[ {kind:"photo",afterHeading:"<exakte H2>",concept:"<engl>",alt:"<dt>"} | {kind:"infographic",afterHeading,data:{layout:"comparison"|"keypoints",...}} ] }`. comparison = `{title,subtitle?,left:{heading,sub?,items[],verdict?,tone:"good"},right:{...tone:"bad"},footer?}`; keypoints = `{title,subtitle?,points:[{big?,text}],footer?}`. Vorlagen: die plan.json der beiden heutigen Artikel (in deren staging-Ordnern).
2. **Infografik lokal pruefen:** `renderInfographic` (in image.ts) rendert SketchData → PNG, kein Browser. (QA: gerendertes PNG mit Read-Tool ansehen.)
3. **Hero + 3 ctx via Gemini-Browser** (heute claude-in-chrome; Teil 2 = agent-browser): pro Bild NEUER Chat (`/u/3/app`, Plus/Pencil-Icon links oben), Prompt = `concept` + Markenstil. Hero-Stil = `HERO_PHOTO_STYLE` (Verlauf, rotiert: Tuerkis #19B5AE→Blau #2E6FD2, oder Violett #8B7DF0→#5A4FD0 etc.). ctx-Stil = `BRAND_PHOTO_STYLE` (natuerliches Licht, 1 roter Akzent, "No text"). Bild rendert ~60-90s. Extraktion: Canvas→`toDataURL('image/png')`→`navigator.clipboard.writeText` → im Shell `pbpaste > /tmp/imgclip.txt` → `NODE_PATH="$PWD/node_modules" /opt/homebrew/bin/node /tmp/decode-img.cjs /tmp/imgclip.txt <staging>/hero.png [public/images/blog/<slug>.png]` (das Script `decode-img.cjs` resized auf 1200 + schreibt PNG; bei Bedarf neu anlegen, Inhalt unten*).
4. **Einbetten:** `npx tsx scripts/content-engine/media/apply-images-browser.ts <slug>` (laedt gecachten plan.json, kopiert hero→`<slug>.png`, rendert Infografik, kopiert ctx versioniert, bettet nach den Headings ein).
5. **Podcast einbetten + push:** `npx tsx scripts/content-engine/media/run-media.ts --slug <slug> --podcast <m4a> --no-images --no-mail`.
6. **QA:** beide Artikel live, alle Assets HTTP 200 (Hero RAW-URL UND `/_next/image?url=...&w=1920&q=75`). Browser-Cache kann alte 400/404 zeigen → Cmd+Shift+R Hard-Reload.

## OFFEN — NAECHSTE SCHRITTE (Teil 2: Gemini-Bilder VOLL HEADLESS via agent-browser)
Ziel (User-Wunsch 22.06): die Gemini-Bilderzeugung soll NACHTS ohne Mensch/ohne Claude-Session laufen — als Ersatz fuer den toten Codex. Der User hat "Beides" gewaehlt: Teil 1 (Trigger wasserdicht) ist FERTIG; Teil 2 ist DIESE Aufgabe.

1. **agent-browser installieren** — der Auto-Schutz blockt den globalen npm-Install durch den Agenten. Der USER muss einmal ausfuehren: `! npm i -g agent-browser && agent-browser install`. (Skill-Doku: `agent-browser skills get core` / `--full`.) Pruefen: `which agent-browser`.
2. **Profil + Gemini-Login:** agent-browser braucht eine Chrome-Sitzung, die bei Gemini als `t.uhlir@immo.red` eingeloggt ist (eigenes persistentes Profil, ODER Attach an Chrome mit `--remote-debugging-port` — Chrome laeuft aktuell OHNE CDP-Port). EINMALIGER Login durch Thomas (Agent darf keine Google-Credentials eingeben). Verbindungsmodell zuerst per `agent-browser skills get core` klaeren.
3. **`scripts/content-engine/media/generate-images-gemini.sh <slug>` bauen** — analog zum heutigen manuellen Flow, nur via agent-browser statt claude-in-chrome: plan.json laden (oder via buildImagePlan wenn claude im Tageslauf funktioniert; sonst deterministischer Fallback) → pro Bild (hero+ctx1-3) neuer Gemini-Chat, Prompt tippen, ~80s warten, Canvas→Clipboard extrahieren, `decode-img.cjs` → staging → `apply-images-browser.ts`. Idempotent, fail-closed (kein leeres PNG durchreichen).
4. **In `run-media-check.sh` verdrahten:** den `images-only.ts`(Codex)-Block ersetzen/ergaenzen durch `generate-images-gemini.sh`. Reihenfolge: Bilder VOR Podcast/Video, damit das Hero fuers Video-Poster da ist. Bei Gemini-Fehler → der `needs-images`-Marker aus Teil 1 greift weiter als Sicherheitsnetz.
5. **End-to-end testen** an einem echten/Test-Slug bis ein Artikel KOMPLETT ohne Zutun bebildert wird. `review-it` ueber die neuen Scripts.

## Blocker / Risiken
- agent-browser-Install braucht User (`!`-Befehl). Gemini-Login einmalig durch Thomas.
- Browser-Automatik ist fragiler als API (Chrome muss laufen/eingeloggt bleiben). Teil-1-`needs-images`-Marker ist das Sicherheitsnetz, falls Teil 2 mal scheitert.
- `buildImagePlan` (LLM) haengt zeitweise → plan.json deterministisch erzeugen koennen.
- Codex kommt ~Mitte Juli zurueck (dann waere Codex wieder eine Option, aber Gemini-headless ist der robustere Dauerweg).
- claude-in-chrome-Tab-Downloads SANDBOXED → Bilder immer via Clipboard, nie ueber Tab-Download.

## Relevante Dateien/Befehle
- Neu/geaendert diese Session: `scripts/content-engine/media/generate-podcast-cli.sh` (NEU), `scripts/content-engine/media/extract-body.ts`, `scripts/content-engine/trigger/run-media-check.sh` (Podcast-CLI + Hero-Guard + needs-images-Marker), `scripts/content-engine/media/generate-podcast.sh` (resolve_claude).
- Tail/Helpers: `scripts/content-engine/media/{apply-images-browser.ts, run-media.ts, generate-video.sh, image.ts, image/sketchInfographic.ts}`.
- Tests: `npx vitest run scripts/content-engine/media/` (25/25 gruen). Node direkt: `/opt/homebrew/bin/node` + `NODE_PATH="$PWD/node_modules"`.
- Doku: `content-engine/knowledge/media-notes.md`, `CLAUDE.md`. Memory: `reference_redrabbit_daily_claude_enoexec_fix` (22.06-Update mit allem), `feedback_notebooklm_immer_immo_red` (Gemini /u/3/ + Extraktion).

*decode-img.cjs (falls geloescht, neu anlegen):
```js
const fs=require('fs'); const sharp=require('sharp');
const [clipFile,outStage,outPublic]=process.argv.slice(2);
let s=fs.readFileSync(clipFile,'utf8').trim(); const i=s.indexOf('base64,');
if(!s.startsWith('data:image')||i<0){console.error('NO_DATAURL');process.exit(2);}
const buf=Buffer.from(s.slice(i+7),'base64');
(async()=>{const out=await sharp(buf).resize(1200,null).png({quality:90,compressionLevel:9}).toBuffer();
fs.writeFileSync(outStage,out); if(outPublic)fs.writeFileSync(outPublic,out);
const m=await sharp(out).metadata(); console.log('OK '+m.width+'x'+m.height+' '+Math.round(out.length/1024)+'KB');})();
```
