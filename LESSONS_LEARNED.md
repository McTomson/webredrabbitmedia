# LESSONS_LEARNED.md

Durable lessons for `webredrabbitmedia`.

Update this file at the end of every session when a debugging lesson, setup issue, deployment issue, or recurring mistake was discovered.

## 2026-06-27 — Gemini-Bildpipeline laeuft headless auf dem IONOS-VPS (7 Bugs gefixt)

Ziel des VPS-Umzugs erreicht: der heutige Artikel wurde ERSTMALS komplett headless auf dem VPS bebildert (Hero+Infografik+3 Kontext, Gemini/Nano-Banana-2, 0 API-Kosten), live auf web.redrabbit.media. Sieben aufeinanderfolgende Bugs, alle in `generate-images-gemini.sh` gefixt (commit `8ecbbab`):

- **macOS-Hardcodes brechen auf Linux (2x).** (a) `/opt/homebrew/bin/node` existiert auf dem VPS nicht → Plan-Parsing/Decode scheitern still („Plan enthielt keine Bilder"). Fix: `NODE_BIN="$(command -v node)"`. (b) `valid_png()` nutzte `stat -f%z` (BSD/macOS = Dateigroesse); auf Linux ist `-f` Dateisystem-Info → valid_png immer false → der finale Hero-Guard schlug FAELSCHLICH an + apply-images wurde uebersprungen, obwohl alle 4 PNGs valide in Staging lagen. Fix: `wc -c` (portabel). Lehre: vor VPS-Lauf das ganze Skript auf `stat -f`, `/opt/homebrew`, `sed -i ''`, `sysctl` etc. gegen-greppen.
- **`agent-browser 0.27 wait --fn` ignoriert `--timeout`** (nur `--download` honoriert es) → Default 30s, zu kurz fuer Gemini-Bildgenerierung (~60-120s). Jeder Render lief in „Wait timed out after 30000ms". Fix: eigenes Poll-Loop per `eval` bis RENDER_TIMEOUT_MS (robuster als auf undokumentiertes Flag-Verhalten zu vertrauen).
- **KERNFUND — headless Gemini entfuehrt die Seite zu `/glic`.** ~14s nach dem Absenden eines Bild-Prompts navigiert die headless-Session von `/app/<id>` zur Gemini-in-Chrome-Oberflaeche `/glic?mode=mi` (0-Breite-Body, KEINE `<img>`). Das sah aus wie 3 verschiedene Fehler (Detektion „no", Screenshot „0 width", Text nur „Conversation with Gemini") — war EINE Ursache: eine Navigation. Die Diagnose-Batterie (lebt Chrome? `eval 6*7`=42? welche `get url`?) trennte „Crash" von „Navigation". Das Bild wird trotzdem server-seitig in `/app/<id>` generiert (als 1024px `blob:`-URL). **Loesung (Zwei-Phasen):** nach Submit Konversations-ID `/app/<id>` merken → ~42s warten (Bild fertig) → Session schliessen → in einer FRISCHEN Session `/app/<id>` laden → das fertige blob-Bild rendert in ~3s (vor dem erneuten Hijack) → Canvas-Extraktion (same-origin blob = kein tainting).
- **SingletonLock beim Session-Wechsel.** Phase 1 (`gemini-img`) schliessen + Phase 2 (`gemini-load`) auf demselben Profil oeffnen → Chrome bricht ab mit „Failed to create SingletonLock: File exists (17)" (stale Lock-Datei). Fix: `rm -f $PROFILE/Singleton*` vor jedem Open (Chrome legt sie neu an; sicher, solange nur EIN Browser das Profil nutzt).
- **Bild-Duplikate (identische md5).** Oeffnet `/app` nach einem vorigen Bild manchmal die juengste Konversation, greift das Folgebild dessen Bild. Fix: `_LAST_CID`-Guard — akzeptiere nach Submit nur eine NEUE Konversations-ID (≠ vorige). Jedes Bild = eigene Konversation.
- **setsid-Zombie-Akkumulation.** Detachte Test-Laeufe ueberlebten `pkill -f genimg.sh` (der Launcher wurde via `exec` durch `generate-images-gemini.sh` ersetzt → Muster matchte nicht mehr) → 3 Worker liefen parallel ins SELBE Log/dieselben Dateien → Duplikate + verschachteltes Log. Fix: selbst-bereinigender Launcher (killt Vor-Worker + chrome) + IMMER per exakter PID killen und `count==0` verifizieren vor Neustart.
- **Resilienz > Perfektion:** der einzelne Load-Versuch ist flaky (Cold-Start vs. ~14s-Hijack-Fenster), aber die 3-Versuch-Retry-Schleife (jeder Retry = frische Konversation, unabhaengiges Race) macht den Gesamtprozess zuverlaessig. Beobachtet: hero+ctx1 je 2 Versuche, ctx2/ctx3 sofort → 4/4 distinkte Bilder.
- **Architektur-Entscheidung:** VPS = Bilder (der schwere, Mac-ueberlastende Teil), Mac = Text + Podcast/Video (notebooklm-py CLI, leicht, schon eingerichtet, hat den Mac nie ueberlastet). Podcast laeuft seit 22.06 ueber `generate-podcast-cli.sh` (notebooklm-py CLI), NICHT mehr die MCP+claude+Pool-Variante.

## 2026-06-27 — Medien-Browser-Stau (Last 74) Root-Cause + VPS-Umzug

- **Symptom:** Beim Bildschritt stapelten sich ~130 chrome-150-Prozesse → Systemlast 74 → Mac unbrauchbar, Bilder kamen nie durch. Mehrfach am selben Tag.
- **Root causes (mehrschichtig):** (1) `run-media-check.sh` hatte KEINEN Concurrency-Lock → der 30-Min-launchd-Tick startete einen 2. Lauf, waehrend der 1. noch rendert → mehrere agent-browser-Daemons + Chrome parallel. (2) Ein simpler `if -f LOCK`-Check hat ein TOCTOU-Race → zwei fast gleichzeitige Ticks rutschen beide durch. (3) **Der Haupttreiber:** `generate-images-gemini.sh` schloss den Browser NICHT zwischen den 3 Render-Retries — unter Last wirft `open` os-error-35, laesst aber einen halb-toten Chrome zurueck; jeder Retry oeffnet einen WEITEREN → ein EINZELNER Lauf stapelt Dutzende. (4) Cleanup-Trap feuert nur am EXIT, hilft also NICHT waehrend eines grindenden Laufs.
- **Fixes (alle live):** atomarer `mkdir`-Lock (`4580600`), Last-Schutz `>12 → skip` (`7a3f8d0`), Cleanup-Trap (`452b55f`), und der entscheidende: **`agent-browser close --all` zwischen Retries** (`7624130`). Beweis: danach blieb chrome-150 bei 0, auch bei Last 30.
- **Diagnose-Reflex:** bei explodierender Last ZUERST `pgrep -fc 'chrome-150'` + `uptime`. Beim Aufraeumen IMMER zuerst die Skript-ELTERN killen (`run-media-check.sh`,`generate-images`), DANN die Browser — sonst respawnt der noch lebende Lauf sie sofort (133 Chromes ueberlebten den Kill, bis die Eltern weg waren).
- **Strukturelle Lehre:** Headless-Chrome-Bildrender braucht eine RUHIGE Maschine (Hero bei Last 5 in Sek., bei Last 16-30 Timeouts). Auf einem busy Personal-Mac unzuverlaessig → **Umzug auf den idle IONOS-VPS** (Login headless verifiziert, Details in Memory `reference_vps_redrabbit_media_setup` + `docs/handoffs/NEXT_SESSION_main-vps-media.md`).
- **Tooling-Notiz (VPS):** macOS-Chrome-Cookies sind Keychain-verschluesselt (Schluessel NICHT im Profil) → Profil-Kopie auf Linux transferiert den Login NICHT. Frischer Login noetig (TigerVNC Xvnc + headful Chrome + xdotool fuer `@`, da VNC-Keymap das `@` verschluckt).

## 2026-06-23 — Gemini-Bildschritt scheiterte: agent-browser-Kaltstart + Maschinen-Ueberlast (nicht Login)

- **Symptom:** Nach Freigabe bekam der Artikel keine Bilder; Tageslog zeigte „Render-Versuch 1/2/3 fehlgeschlagen" fuer Hero+ctx, dann FATAL. Der Hero-Guard tippte auf „Login? Google-Block?" — das war eine FALSCHE Faehrte.
- **Root cause 1 (Code): async-launch vs sync-returncode.** Auf kaltem agent-browser-Daemon liefert `open` os error 35 („Could not configure browser, daemon may be busy", nach 5 internen Retries), waehrend der Browser ~16s spaeter trotzdem fertig hochfaehrt. Der alte `open "$URL" || return 1` verwarf diesen verspaeteten Erfolg → jeder der 3 Render-Versuche brach sofort ab. Beweis: manuelles, geduldiges `open` + poll `get url` bis gemini.google.com geladen war, lief sauber durch.
- **Fix:** `_ensure_gemini_loaded()` — oeffnet und pollt `get url` bis die Seite wirklich auf gemini.google.com ist (bis ~120s), statt dem Exit-Code zu vertrauen. Plus einmaliges Vorwaermen vor der Render-Schleife (Kaltstart einmal bezahlen → jeder per-Bild-`open` ist warm). Lehre: bei CLI-Tools, die einen Hintergrund-Prozess starten, NIE nur den Exit-Code pruefen — den TATSAECHLICHEN Zustand verifizieren.
- **Root cause 2 (Umgebung): Maschinen-Ueberlast erzeugt denselben os error 35.** Auch nach dem Fix kam os error 35 bei `wait --fn` zurueck — diesmal weil die Maschine unter Last ~11-57 stand (User-Chrome mit Video via VTDecoderXPCService + laufende VM + 50+ verwaiste chrome-150-Testprozesse aus meinen eigenen Wiederhol-Tests). Unter dieser Last antwortet der agent-browser-Daemon-Socket zeitweise mit EAGAIN. Beweis: ein einzelner sauberer Test bei Load <4 lief in 4-5s durch (Hero+ctx1 sauber gerendert, 1200x670 PNG mit Hook); bei Load 57 grindete ctx2 durch 200s-Timeouts. Lehre: bei intermittierendem os error 35 ZUERST `uptime`/Load + `ps aux | grep -c chrome-150` pruefen; eigene Test-Browser nach JEDEM Lauf killen (sie haeufen sich und verschaerfen die Last selbst).
- **Diagnose-Diskriminator, der half:** OHNE Profil example.com oeffnen (lud in 4s = agent-browser gesund) vs MIT Profil Gemini (haengt) → grenzte „Tool kaputt" gegen „Last/Profil/Ziel-spezifisch" ein. `agent-browser doctor` zeigte Launch-Test „pass aber 16s (slow)".
- **Embedding ist lokal, kein Browser.** `apply-images-browser.ts <slug>` kopiert Staging-PNGs → public/, setzt featuredImage, rendert Infografik (SVG) — alles ohne Browser und tolerant gegen fehlende ctx. Deshalb liess sich der bereits gerenderte Hero+ctx1 sofort live bringen, OHNE auf ctx2/ctx3 (last-blockiert) zu warten. Lehre: kritisches Teil-Ergebnis (Hero) sofort einbetten statt auf Vollstaendigkeit zu warten; Staging ist idempotent (valide PNGs werden bei Re-Run uebersprungen).
- **macOS-Locale-Falle (bash):** `sysctl -n vm.loadavg` liefert Komma-Dezimal (`22,91`) in DE-Locale. `awk -v a="22,91" 'BEGIN{exit !(a<5)}'` macht daraus einen STRING-Vergleich („22,91" < „5.0" zeichenweise wahr) → Load-Gate feuerte faelschlich bei Load 22. Fix: `... | tr ',' '.'` und `a+0 < t+0` erzwingen. Lehre: vor numerischen awk-Vergleichen Komma→Punkt normalisieren.

## 2026-06-16 — Daily-Mail blieb stumm: Bot-Job teilte sich die Working-Copy mit Dev-Arbeit

- **Root cause (nicht Scheduling): `git checkout main` im GETEILTEN Checkout scheitert an dirty Feature-Branch.** run-daily.sh lief in `~/dev/redrabbit` und machte `git checkout main`. Stand der Checkout auf einem Feature-Branch mit uncommitteten Änderungen (hier brand/* + MEMORY.md), bricht git mit „local changes would be overwritten" ab → **jeder** 3h-Catch-up-Lauf (an dem Tag 6×) scheiterte identisch an derselben Zeile; nur der Ops-Alert ging raus, nie ein Artikel/eine Review-Mail. Die Memory hatte fälschlich „kein Catch-up" vermutet — der StartInterval-Catch-up lief sehr wohl (6 Läufe), er scheiterte nur jedes Mal. Lehre: bei „Cron lief nicht" ZUERST das Tageslog auf die *erste* fehlschlagende Zeile lesen, nicht das Scheduling verdächtigen.
- **Fix = dediziertes git-worktree für den Bot.** `git worktree add ~/dev/redrabbit-daily main` → der Job läuft dauerhaft in einem bot-only Checkout auf main, komplett isoliert von den Branch-Wechseln/Dirty-States des Menschen. run-daily.sh ist jetzt **self-locating** (löst REPO aus `BASH_SOURCE`-Pfad) und nutzt `git fetch origin main` + `git reset --hard origin/main` statt `checkout` (safe, weil bot-only → immer clean+aktuell, kein Orphan-Commit-Drift nach fehlgeschlagenem Push). plist zeigt aufs Worktree-Script. Stolperfalle: `node_modules` (748M) + `.env.local` sind gitignored → fehlen im Worktree; **Symlink** auf das Haupt-Repo (nicht kopieren). CAVEAT: Haupt-Repo nicht löschen, sonst brechen die Symlinks.
- **`RunAtLoad=true` ergänzt** (war false): Mac war zur Cron-Zeit aus → bei nächstem Login/Boot läuft der Job sofort. Der Per-Tag-Stempel macht den zusätzlichen Trigger idempotent (verifiziert: Boot-Lauf endete mit „Heute schon gelaufen, Abbruch"). Für garantierten Lauf trotz nachts-ausgeschaltetem Mac gäbe es `sudo pmset repeat wakeorpoweron` — bewusst NICHT gesetzt (intrusiv).
- **Role-Runner verschluckte den echten claude-Fehler.** `lib/roles.ts` (`execFileSync('claude', ['-p', prompt])`) warf nur `error.message` = „Command failed: claude -p <riesiger Prompt>" — der eigentliche Grund (rate limit/overload/SIGKILL-Timeout/E2BIG) steckt in `error.stderr/.status/.signal` und ging verloren → Ops-Mail sagte nur „Pipeline hat gehalten". Jetzt werden status/signal/stderr pro Versuch geloggt und in die geworfene Fehlermeldung gebacken. Lehre: bei `execFileSync`/`spawnSync` IMMER stderr+status mitloggen, sonst ist ein Halt nicht diagnostizierbar.
- **Finalizer-Totalausfall war Parallel-Last, kein Bug.** Im ersten manuellen Testlauf scheiterte die finalizer-Rolle alle 4 Versuche — Ursache: ich (Claude-Session) war gleichzeitig auf demselben Konto aktiv → Rate-Limit beim 4. schweren `claude`-Aufruf. Zweiter Lauf (ich still gehalten) lief sauber durch. Lehre: Content-Pipeline NICHT testen, während eine andere claude-Session aktiv ist; der Retry/Backoff in roles.ts fängt Transientes, aber nicht dauerhafte Parallel-Last.
- **DERSELBE Branch-Bug traf auch den media-checker → freigegebene Artikel bekamen NIE Medien.** Nach der Freigabe per Review-Mail wird ein Marker `content-engine/.media-requests/<slug>.json` (status `requested`) auf **main** committet; `run-media-check.sh` (alle 30 Min) soll ihn finden, headless Bilder erzeugen + Notification für die Browser-Session (NotebookLM/YouTube/Substack) schicken. Lief NICHT, zwei Bugs: (1) `REPO=$HOME/dev/redrabbit` = geteilter Checkout auf Feature-Branch → Marker (auf main) unsichtbar; (2) Parser-Bug: grep `'"requestedAt":"…"'` OHNE Leerzeichen, Marker ist aber pretty-printed mit Leerzeichen → matchte nie (auch der Vortag fiel deshalb aus). Fix: self-locating REPO (läuft aus `~/dev/redrabbit-daily`-Worktree) + `git fetch && git merge --ff-only origin/main` (sieht neue Freigaben, fail-safe kein Clobber) + node-`JSON.parse` statt grep. **REGEL (gilt für ALLE launchd-Bot-Scripts): NIE `REPO=$HOME/dev/redrabbit` (Mensch-Checkout, driftet auf Feature-Branches) — IMMER self-locating aus dem Bot-Worktree `~/dev/redrabbit-daily` (immer main).** Alle drei Jobs (run-daily, run-media-check, run-remind) sind jetzt so. Wer einen neuen Bot-Job baut: gleiches Muster, sonst dieser Ausfall erneut.
- **„Kompletter Prozess nach Freigabe" ist NICHT 100% headless.** Der media-checker macht headless nur Bilder (Codex `images-only.ts`) + Notification. **Podcast (NotebookLM), Video (nur Browser), Substack** brauchen zwingend eine Browser-/Claude-Session → diese Schritte erfordern, dass eine Session sie ausführt (Runbook media-notes.md). „Immer automatisch" heißt also: Freigabe → Bilder+Notification zuverlässig automatisch; Podcast/Video/Substack in der Session. YouTube-Public/Substack-Publish = OK von Thomas holen.

## 2026-06-12 (Teil 3) — Slug-Renames: 4 Blindspots + Build-Langsamkeit ≠ Hang

- **Slug = Dateiname** (posts.ts), aber jede .mdx hat ZUSÄTZLICH ein `slug:`-Frontmatter-Feld UND `queue.yaml` hat `slug:`-Felder. status.json trackt per numerischer ID (nicht Slug) — gut. Beim Rename ALLE drei konsistent halten + Cross-Cluster-Links in anderen .mdx.
- **GRÖSSTER Blindspot: Bilddateien.** Ein globales sed „alter-slug -> neuer-slug" über die .mdx ersetzt auch die **Bildpfade** im Frontmatter/Body — aber die Dateien in `public/images/blog/` heißen weiter alt → 404-Bilder. Lösung: Bilddateien per Präfix mit-umbenennen (Suffix wie `-hero-khuiu` bleibt). IMMER nach Slug-Rename die referenzierten Bilder auf Existenz prüfen (`[ -f public$ref ]`) + ein Bild im Browser auf 200.
- **zsh-Falle:** `declare -a ARR=(...)` + `&&`-verkettete Multiline in `bash -c`/zsh-Eval lief mit LEEREM ersten Index → `grep -rl ""` matcht ALLE Dateien → `sed -i '' "s||"` (leere Regex) scheitert und lässt überall `.!PID!name`-Temp-Dateien zurück. Lehre: keine `declare`-Arrays in dem Eval-Kontext; lieber explizite Einzelbefehle oder eine Funktion mit Positionsargumenten. Nach sed-Crash immer `find -name '.!*' -delete` + `git diff --stat` zur Integritätsprüfung (Originale waren intakt, sed bricht vor dem Schreiben ab).
- **Build-Langsamkeit ist kein Hang.** Unter Disk-/Swap-Last dauerte `next build` Compile 5,2 Min (statt ~100s) und die Type-Check-Phase >10 Min — wirkte wie ein Hang. `tsc --noEmit` separat (EXIT 0, 0 Fehler) beweist: Typen grün, nur langsam. Lehre: bei vermeintlichem Build-Hang ZUERST `tsc --noEmit` isolieren + stray next/node-Prozesse killen (akkumulieren über viele Builds/Dev-Server). Verifikation dann über Dev + Produktions-Curl + Vercel-Build (mehr Ressourcen) statt auf den lahmen Local-Build zu warten.
- **301/308 verstanden (für den User):** Rename + Redirect = Seite bleibt, alte URL leitet permanent weiter (Next nutzt 308 ≙ 301 für SEO), ~alle Linkkraft wandert mit. KEINE Duplikat-Seiten erzeugen.

## 2026-06-12 — Ehrlichkeit-Pivot bei Ratings + Fabrikations-Funde

- **Owner-Entscheidung kann sich umkehren — und eine andere (Cowork-)Session hatte schon vorgegriffen.** Der Plan hielt fest "315/4,9-Schema bleibt (Userwunsch)". Ein Cowork-Commit (`db2fe81`, 11.06) hatte das aggregateRating aber bereits entfernt. NICHT blind reverten oder annehmen — beim User rueckfragen. Ergebnis: Pivot auf Ehrlichkeit. Lehre: vor jeder Arbeit an einer "festen" Entscheidung den echten Code-Stand UND die letzte Owner-Aussage prüfen; Widerspruch = Frage, kein Raten ([[feedback_redrabbit_rating_ehrlichkeit_echte_google_sterne]]).
- **Fake-Zahlen sitzen in 4 Schichten, nicht einer.** "315/4.8" steckte in: (a) JSON-LD-Schema, (b) sichtbaren Komponenten (Hero-Sterne, Sidebar, CTA, About), (c) Meta/Title von 9 Seiten (Bundesland-SERP + layout + tipps), (d) Artikel-Frontmatter (`conclusionStats` mit "315+", "4.9/5", "+315%"). Ein einzelner Grep über `app/components/lib` findet (d) NICHT (liegt in content/blog) und Stats in MDX-eingebetteten Datenblöcken auch nicht über die offensichtlichen Strings. Lehre: bei Zahlen-Bereinigung IMMER zusätzlich die gerenderte HTML der Schlüsselseiten greppen (`fetch` + Kontext-Slice), nicht nur den Quellcode — sonst bleiben generierte/eingebettete Vorkommen stehen.
- **Single Source of Truth für Social-Proof-Zahlen** (`lib/reviews.ts`): rendert aggregateRating + Sterne nur bei `hasRealRating()`. So ist der Default ehrlich (nichts) und echte Google-Zahlen erscheinen automatisch überall, sobald eingetragen. Trust-Psychologie: spezifische "164" > rundes "315+" (wirkt gezählt statt geschätzt); Meta/Title sind KEIN Ranking-Faktor (nur CTR), also Zahl frei wählbar ohne Ranking-Risiko — aber muss wahr sein.
- **Inkonsistente Bestandsdaten = das eigentliche Risiko:** Regional-Projektzahlen (187/179/...) > neue Gesamtzahl 164 → unmöglich. Ohne echte Verteilung NICHT runterraten (fail-closed: flaggen oder entfernen). cities.ts-Wien-"315" entfernt statt geschätzt.

## 2026-06-11 (Teil 10) — SEO-Batch aus Quality-Scan-Funden

- **Doppelte H1 war systemisch + die conventions.md verursachte sie.** Jede MDX-Artikelseite hatte 2 H1 (Titel-Hero + Body-`# Titel`). Fix zweistufig: Render (`stripLeadingTitleH1` in posts.ts + `mdx-components` `#`→`<h2>`) UND Generator (`conventions.md` verbot Body-H1). Lehre: wenn ein Fehler in JEDEM generierten Artikel steckt, immer auch die Generator-Vorgabe (conventions.md/Prompt) prüfen, nicht nur die Artikel patchen — sonst regrediert es beim nächsten Tageslauf.
- **conventions.md `title`-Regel empfahl aktiv lange Klammer-Titel** (`[... Österreich 2026]`) → 20 Titel liefen 64-110 Zeichen (SERP-Truncation). Regel auf ≤60/keyword-first/keine Marketing-Klammern geändert. Titel-Änderung ist sicher (kein 301 nötig, Slug bleibt); Anker aktualisiert `cluster:relink` automatisch (idempotent).
- **Meta-Description-Cap gehört in die Metadata-Schicht, nicht in den Content.** `clampDescription()` kappt nur das `<meta>`/og/twitter (excerpt + Listing-Cards bleiben voll) — kein Content-Edit über 7+ Dateien.
- **Skip-Nav-Fokus im Automations-Browser:** nach `navigate` liegt der Fokus evtl. auf der Browser-Leiste, Tab fokussiert dann nicht das erste Seiten-Element. Skip-Link-Sichtbarkeit zuverlässig per `javascript_tool` prüfen (`.focus()` + `getBoundingClientRect` 1x1→sichtbar), nicht per Tab+Screenshot.
- **`/llms.txt` als Route-Handler** (`app/llms.txt/route.ts`, runtime nodejs, revalidate 1h) aus `getAllPosts()` — auto-aktuell, kein manueller Pflegeaufwand.
- **Bespoke-Seiten erben das Root-OpenGraph, wenn sie keins setzen.** `app/tipps/was-kostet-eine-website/page.tsx` setzte nur `metadata.title`+`description` → Next vererbte das Root-Layout-`openGraph` (Startseiten-og:title/og:url/og:image). Folge: jedes Social-Sharing UND der Medium-Importer zogen die Startseite („Website ab 790€" + Startseiten-Banner) statt des Artikels. Fix: jede bespoke /tipps-Seite braucht eigenes `openGraph` (title/url/image) + `alternates.canonical` auf sich selbst. Die MDX-Artikel (über `generateMetadata`) sind korrekt; nur hartcodierte Seiten muss man von Hand mit OG versorgen. Prüfen: `curl <url> | grep 'og:title\|og:url\|canonical'` — og:url darf NICHT die Startseite sein.
- **Medium-Import (`medium.com/p/import`) nutzt die OG-Tags der Quelle** für Titel/Bild und erzeugt einen editierbaren Entwurf (NICHT sofort öffentlich). Canonical wird auf die Quelle gesetzt — daher MUSS die Quellseite korrektes og:url/canonical haben, sonst rankt die Startseite/Medium statt des Artikels. Login macht IMMER der User; Agent gibt keine Passwörter ein, legt keine Konten an. Medium-Konto verifiziert = rabbit.red.media@gmail.com.

## 2026-06-11 (Teil 9) — Qualitäts-Scan (Punkt 4): vier Scanner + Dashboard

- **schema-dts OOM-crasht `next build` (wichtigster Fund).** `import type { WithContext, BlogPosting } from 'schema-dts'` und Annotation der Live-JSON-LD in `app/tipps/[slug]/page.tsx` expandiert zu einem riesigen Schema.org-Union-Typ. `tsc --noEmit` überlebte knapp (exit 0), aber der `next build`-Type-Check-Worker lief in den 2GB-Heap-Limit → `FATAL ERROR: JavaScript heap out of memory` / SIGABRT NACH "Compiled successfully". **Lehre: schema-dts-Inline-Typisierung NICHT verwenden (destabilisiert Build/Deploy, §15-Ballast). Schema-Sicherheit stattdessen zur Laufzeit** (`scripts/content-engine/quality/scanners/schema.ts` validiert die deployte Seite). Diagnose-Reihenfolge bei Build-SIGABRT: head des Logs lesen — "Last few GCs"/"heap out of memory" = OOM, nicht Code-Fehler; Phase "Linting and checking validity of types" = Type-Check-Worker.
- **Pipe verschluckt den echten Exit-Code.** `npx next build 2>&1 | tail -20` meldet IMMER exit 0 (von `tail`), auch wenn der Build crasht. Für den echten Status `set -o pipefail` ODER ohne Pipe in eine Datei schreiben und `$?` direkt prüfen. Sonst hält man einen gecrashten Build für grün.
- **lychee 403/429 = Bot-Sperre, kein toter Link.** Viele seriöse Seiten (z.B. armanino.com) geben dem lychee-User-Agent 403, funktionieren im Browser. `--accept 200..=299,403,429` verhindert das Falschsignal; nur 404/410/5xx = wirklich kaputt.
- **foglift-Gratis-Tier rate-limited nach ~8 URLs/Lauf.** Danach `geo: unavailable` (graziös). Voller GEO-Score über alle Artikel bräuchte mehrere Läufe oder `FOGLIFT_API_KEY` (kostenpflichtig, NICHT verdrahtet). Scanner degradiert pro Artikel, bricht nie den Lauf ab.
- **Scan-Architektur (additiv, §15):** CLI `scripts/content-engine/quality/scan.ts` → gitignored SoT `content-engine/.quality-report.json` → read-only `lib/dashboard/quality.ts` → dünne Verbesserungen-Page. Reine Parser (links/schema/geo/a11y) getrennt von den `spawnSync`-Shells = testbare Nähte (30 Unit-Tests). pa11y NICHT installiert (puppeteer/Chromium ~170MB = Ballast), opt-in per `npm i -D pa11y`. Runbook: `docs/runbooks/quality-scan.md`. review-it: GO, alle Befunde gefixt (`docs/reviews/quality-scan-2026-06-11.md`).

## 2026-06-11 (Teil 8) — Phase-3-Abschluss + launchd-Race

- **launchd-Tageslauf arbeitet im SELBEN Arbeits-Repo wie eine interaktive Session.** Während ich editierte, feuerte `com.redrabbit.contentengine` (run-daily.sh, 02:00): es lief das neue `cluster:relink`-Safety-Net, committete + pushte selbständig, generierte dann den Tages-Draft und pushte erneut. Das ging diesmal gut (geteiltes Repo → der Lauf committete auf meinen frischen Commit auf, Push war ff), KÖNNTE aber übel enden: hätte ich uncommittete .mdx-Edits gehabt, hätte `git add content/blog` des Laufs sie mitgenommen. LEHRE: bei interaktiver Arbeit am Repo daran denken, dass der Daily-/Media-launchd jederzeit committen/pushen kann. Arbeitsbaum bei Pausen sauber halten; nicht mitten in einem laufenden run-daily git-Surgery machen (erst Prozess-Ende abwarten: `ps -p <pid>`). Das `cluster:relink`-Safety-Net ist .mdx-scoped (git-Pathspec) genau deswegen.
- **Titel-Änderung propagiert automatisch in Anker-Texte.** Wird der `title` eines Artikels geändert, aktualisiert der nächste `cluster:relink`-Lauf den Anker-Text in ALLEN Blöcken, die ihn verlinken (Anker = bereinigter Titel). Beim Tageslauf passiert das von selbst; idempotent. Verifiziert (765b0ba aktualisierte 4 Blöcke auf "...5 Seiten 2026?").
- **year_in_title-Hebel ehrlich, nicht erzwungen.** Preis-/Trend-/Listicle-Artikel: Jahr in den Titel (echte Frische). Zeitlose Konzept-Artikel: `evergreen: true` im Frontmatter → On-Page-Audit überspringt den Jahr-Check (ein erzwungenes Jahr läse sich als Spam). Kein Gaming der Metrik, sondern korrekte Klassifikation.

## 2026-06-11 (Teil 7) — Interne Cluster-Verlinkung (Phase 3 #1-Hebel)

- **Hartcodierte Route schlägt MDX-[slug].** `app/tipps/{slug}/page.tsx` (bespoke React) hat Vorrang vor der dynamischen `[slug]`-MDX-Route. Der Flaggschiff-Artikel `was-kostet-eine-website` ist so eine Seite — sein `content/blog/was-kostet-eine-website.mdx`-Body wird NIE gerendert (nur die Frontmatter speist Listings/Related/RSS). Folge: jedes Content-Tooling muss solche Slugs als QUELLE ausschließen (kein toter Block schreiben, nicht als MDX auditieren), sie bleiben aber gültige LINK-ZIELE. Erkennung: `app/tipps/*/page.tsx` scannen. Diese Seiten brauchen interne Verlinkung/On-Page von Hand.
- **Gerenderter Inhalt != Datei auf Platte? ZUERST hartcodierte Route prüfen, dann Cache.** Symptom: der Dev-Server liefert Strings, die nicht in der MDX stehen. Ursache war NICHT `.next`-Cache, sondern die hartcodierte Route. Reihenfolge der Diagnose: (1) gibt es `app/.../{slug}/page.tsx`? (2) erst dann `rm -rf .next` + frischer Dev. (Die Stale-`.next`-Falle nach `next build` existiert zusätzlich — vor Browser-Verifikation immer `.next` löschen.)
- **`main` wird von Automatik gepusht — IMMER `git fetch` vor `git push`.** Ein lokaler Commit landete in dieser Session ohne expliziten Push auf origin/main (Hook/geplanter run-media-Lauf pusht main). Lehre: nicht `--amend`/force-push auf bereits-gepushte Commits; Korrekturen als NEUEN Commit obendrauf (reset --hard origin/main + Fix-Patch + neuer Commit), um divergierende Historie sauber aufzulösen.
- **Idempotenz muss Single-Run UND diff-sauber sein.** Ein globales `\n{3,}->\n\n` normalisierte unbeteiligten Body-Whitespace (Diff-Rauschen) und der Append-Zweig stabilisierte erst im 2. Lauf. Fix: nur die Naht um den Block anfassen, sonst nichts; den Block immer ans Body-Ende anhängen statt fragiler Footer-Regex (die im echten Korpus ohnehin nie matchte und mit `[\s\S]*$` Inhalt verschieben konnte).
- **LLM-Titel sind ungetrauter Input für MDX.** Anker-Text aus Artikel-Titeln, der in einen mit next-mdx-remote kompilierten Body eingebettet wird, MDX-escapen (`\ \` * _ [ ] < > { } |`): ein Titel mit `{`/`<` würde sonst serverseitig evaluiert oder bricht den Render/Build aller Cluster-Nachbarn (auto-gepusht). Slugs zusätzlich auf `^[a-z0-9-]+$` prüfen.

## 2026-06-11 (Teil 6) — Tracking, Playbook/Audit, Erinnerung, NotebookLM-Pilot

- **`next build` lintet — KEIN `any` in lib/.** tsc allein war grün, `next build` brach mit `@typescript-eslint/no-explicit-any` (in `lib/dashboard/onpage.ts`). Frontmatter aus gray-matter als schmales Interface typisieren, nicht `as any`. Immer `next build` als finalen Gate fahren, nicht nur `tsc`.
- **Tracking-Lücke: nur EIN Formular war instrumentiert.** `generate_lead` feuerte nur in `ContactFormHighEnd` (/kontakt), nicht im site-weiten `ContactForm`-Modal (Hero/Pricing/Blog) → eine echte Anfrage wurde nie erfasst. Lehre: bei Conversion-Events ALLE Eintrittspunkte prüfen. Jetzt: Modal feuert generate_lead, `ContactFormProvider.openForm` feuert contact_form_open, `AnalyticsListener` (global im Layout) feuert scroll_depth + outbound_click. Vergangene Submits erscheinen NICHT rückwirkend; GA4 hat Verarbeitungs-Latenz.
- **Dev-Modus-Tab-Lag ist kein Bug.** "Tabs reagieren nicht" = Next kompiliert jede Route beim ERSTEN Aufruf neu (~3-6s, Analytics länger wg. Live-GA4). Fix: Launcher (`dashboard-launcher.command`) wärmt nach Start alle Tabs per curl vor.
- **NotebookLM: headless-MCP unzuverlässig, UI-Bulk-Paste funktioniert.** `mcp__notebooklm__add_source`/`ask_question` scheitern reproduzierbar mit "Could not find NotebookLM chat input" (Phase-4-Fragilität). Was geht: Notebook in der UI anlegen, "Quelle hinzufügen → Websites → alle URLs auf einmal (leerzeichen-getrennt) → Einfügen" (Import asynchron ~10-20s), Fragen im In-App-Chat (geerdet + zitiert), dann `npm run notebooklm:record`. `add_notebook` (Registrierung per URL) geht. MCP-Konto muss t.uhlir@immo.red sein (`get_health`, sonst `re_auth`).
- **DNS-Aussetzer ≠ Code-Bug.** `getaddrinfo ENOTFOUND oauth2.googleapis.com` (Dashboard-Google-Fehler + NotebookLM-Login) war ein transienter Router-DNS-Aussetzer; Minuten später lief alles. Bei Google-API-Fehlern zuerst DNS/Konnektivität prüfen (`nslookup`, `curl`).
- **Manifest + Vault sind REPO-versioniert** (Wissens-SoT), nicht gitignored: `content-engine/knowledge/vault.md` + `notebooklm-manifest.json`.

## 2026-06-10 (Teil 5) — Phase 2 Moat: Vault, /interview-me, Wissen-Tab, Desktop-Launcher

- **Vault ist Repo-versioniert, nicht Runtime-State.** `content-engine/knowledge/vault.md` ist Wissens-SoT (§15) und wird committet, im Gegensatz zu `.kill-switch.json`/`.indexation.json` (gitignored). Nicht aus Versehen ignorieren.
- **Vitest loest den tsconfig-Alias `@/` NICHT von selbst auf.** Symptom: "Failed to load url @/scripts/...". Fix: in `vitest.config.ts` `resolve.alias { '@': path.resolve(__dirname, '.') }` setzen (spiegelt tsconfig `@/* -> ./*`). tsc + Next bauen es ohne, Vitest nicht.
- **`parseVault`/`parseOpinionClusters` verwerfen das erste Split-Segment** (Datei-Header vor dem ersten `## `). Test-Inputs brauchen einen fuehrenden Header (`# h\n\n## ...`), sonst landet der einzige Eintrag im verworfenen Segment.
- **Node-Skripte koennen MCP nicht aufrufen.** NotebookLM-Anreicherung ist deshalb zweigeteilt: ein Plan-Skript (`notebooklm:plan`) berechnet die offenen Quell-URLs pro Cluster + schreibt das Manifest, der Agent fuehrt `add_notebook`/`add_source` ueber die MCP-Tools aus, `notebooklm:record` zieht das Manifest nach. Headless-Vollautomatik erst Phase 4 (video-faehiger MCP).
- **NotebookLM-MCP war `authenticated:false`.** `get_health` zuerst pruefen. Erst-Login (`setup_auth`) oeffnet einen Browser-Tab = einmalige Nutzer-Aktion; ein Agent kann/darf das Login nicht selbst machen. Live-Pilot wartet darauf.
- **Desktop-Launcher braucht expliziten nvm-PATH.** Ein aus dem Finder gestartetes `.command` erbt die nvm-Shell nicht; `export PATH="/Users/McTomson/.nvm/versions/node/v20.20.0/bin:$PATH"` voranstellen, sonst "node not found". Launcher: `scripts/dashboard-launcher.command` (Kopie auf dem Desktop), oeffnet `localhost:9000/dashboard` und startet den Dev-Server falls noetig.
- **Verwechslung Startseite vs. Dashboard:** `localhost:9000` ist die Marketing-Startseite, das Dashboard liegt auf `/dashboard`. Das Icon zeigt direkt dorthin.

## 2026-06-10 (Teil 4) — Dashboard GSC/GA4-Tabs, Deploy-Verifikations-Falle

- **Hartkodierte Route schlägt `[slug]`.** `app/tipps/was-kostet-eine-website/page.tsx` ist eine statische Eigenseite und überschreibt in Next.js die dynamische `[slug]`-Route. Sie nutzt BlogPostClient/ArticleSources NICHT. Die vorige Session hat ausgerechnet diesen Slug zur Deploy-Verifikation gewählt → fälschlich "Deploy hängt" geschlossen. **Lehre: Zum Verifizieren eines Pipeline-Features einen echten Pipeline-Artikel testen (z.B. `wie-setzen-sich-die-kosten...`), nicht eine Money-Page mit Eigenroute.** Vercel-Deploy war die ganze Zeit erfolgreich + live. (Hartkodierte /tipps-Routen: nur `was-kostet-eine-website`.)
- **`x-vercel-cache: HIT` mit wachsendem `age` ist KEIN Beweis für hängenden Deploy.** Erst im Vercel-Dashboard prüfen (Deployment = Ready?) und an einem korrekten Pfad gegentesten, bevor man "Deploy-Problem" annimmt.
- **GA4 runReport `limit` muss STRING sein** (`limit: '25'`), nicht number — `next build` (Type-Check) fängt das, `npm run dev` nicht (Dev macht keinen vollen Type-Check). Immer `next build` vor Deploy.
- **GSC- und GA4-Zeitfenster bewusst angleichen:** GSC `searchanalytics` start/end sind inklusiv → für `N` Tage endend gestern: start=`now-N`, end=`now-1` (nicht `now-(N+1)`, das gibt N+1 Tage). GA4 dann `${N}daysAgo`..`yesterday` (nicht `today`, sonst 1 Tag mehr + unvollständiger heutiger Tag).
- **Fehlermeldungen von googleapis NIE roh ins UI** — können Token/Secret-Fragmente enthalten. `safeErrorMessage()` mappt invalid_grant/401 auf Hinweis und redigiert token-artige Query-Params.
- **Marketing-Header/-Footer auf `/dashboard` ausblenden:** Sie kommen aus dem Root-`app/layout.tsx` (`<Header/>`/`<Footer/>`). Root-Layout kann kein `usePathname` (Server). Lösung ohne Route-Group-Umbau: Header.tsx + Footer.tsx (sind 'use client') prüfen `usePathname()?.startsWith('/dashboard')` → `return null` (NACH allen Hooks, sonst Rules-of-Hooks-Bruch). Der fixierte Marketing-Header überlagerte sonst den Dashboard-Inhalt.
- **Transienter Build-Fehler `next build` direkt nach `kill` des Dev-Servers:** beide teilen `.next`. `next build` unmittelbar nach dem Stoppen von `npm run dev` kann mit EXIT 1 fehlschlagen (halb-geschriebenes `.next`). Fix: `rm -rf .next` + sauberer Build OHNE laufenden Dev-Server. Nicht als echten Code-Fehler fehldeuten.
- **Browser-Automatisierung: "Permission denied by user" bei localhost ≠ Chrome-Block.** Navigiert man einen bereits auf anderer Origin geladenen Tab nach localhost, kann die Aktion abgelehnt werden. Lösung: FRISCHEN Tab via tabs_create_mcp anlegen und dorthin navigieren. Dev-Server muss laufen + erste Anfrage kompiliert lange (Renderer-Timeout möglich) → Route per curl vorwärmen, dann lesen.
- **GSC-URL-Inspection-API braucht den EXAKTEN Property-String — mit Schrägstrich.** `sites.list()` zeigte die verifizierte Property als `https://web.redrabbit.media/` (mit `/`). Die Search-Analytics-API tolerierte `https://web.redrabbit.media` (ohne), die URL-Inspection NICHT → "You do not own this site". Fix: `siteUrl` für Inspektion auf trailing-slash normalisieren. Coverage "indexed" = `verdict==='PASS'` ODER coverageState enthält "indexed".
- **Kill-Switch-Architektur:** `check_indexation.ts` (npm `engine:indexation`) misst Indexierung → schreibt `content-engine/.indexation.json` + `.kill-switch.json` (beide gitignored). `pipeline.ts` prüft `readKillSwitch()` VOR `--emit`, bricht bei active sauber ab (exit 0, kein Fehler). Fail-safe: fehlende/kaputte Flag = inaktiv. MIN_SAMPLE=5 verhindert Fehlalarm bei junger Seite. Manuelles Lösen: `rm content-engine/.kill-switch.json`. NOCH offen: check_indexation in den launchd-Tageslauf vor `npm run engine` einhängen.
- **Apple-Look im Web:** System-Font-Stack `-apple-system, BlinkMacSystemFont, "SF Pro Text"...` rendert echtes SF Pro auf dem Mac (kein Webfont nötig). Off-White-Canvas `#f5f5f7`, `rounded-2xl`-Karten + Haarlinien `border-black/[0.06]` + zweilagiger weicher Schatten, Segmented-Control (heller Track, weiße aktive Pille). GitHub-Trend für Analytics-Dashboards 2026: **Tremor** (tremor.so, Recharts-basiert, shadcn-kompatibel) — Empfehlung für spätere Charts.

## 2026-06-10 (Teil 3) — GSC/GA4-Anbindung, Cluster-Taxonomie, Prompt-Caching-Mythos

- **Personal-Gmail kann KEINE Service-Accounts als GSC-Nutzer adden** ("E-Mail gehört nicht zu Google-Konto"); GA4 zickt ebenso. Domain-wide delegation nur bei Workspace. **Lösung: OAuth mit Besitzer-Konto** (refresh_token, wie YouTube-Muster). Service-Account-Weg fuer GSC/GA4 bei privatem Konto verwerfen.
- **OAuth-Client-Secret-Download in GCP ist "nicht mehr möglich"** fuer bestehende Clients; bei NEU-Erstellung bietet der Dialog "JSON herunterladen", aber der Button löst per Browser-Automatisierung oft KEINEN Download aus. Workaround: vorhandenes Desktop-Client-JSON wiederverwenden (lag in ~/Downloads) ODER Secret aus Detailseite. Creds immer ausserhalb Repo + .env.local (gitignored), nie committen.
- **GA4: es gab mehrere "web.redrabbit.media"-Properties**, die meisten LEER. Die mit echten Daten (Property 519842891, account 380548873) ist die richtige. Property-ID steht in der Analytics-URL (`p<ID>`). Immer per echten Daten verifizieren, nicht die erstbeste nehmen.
- **Prompt-Caching bei `claude -p` bringt NICHTS über getrennte Prozesse** (jeder Rollen-Call = eigener HTTP-Request, kein gemeinsamer Cache; keine CLI-Flags). Nur per Agent-SDK-Port (Conversation-Reuse). Bei 1 Artikel/Tag nicht wert → Status quo, erst messen.
- **`category` war Freitext-Chaos** ("Wartung" vs "Technik & Performance" etc.). Eingeführt: kontrolliertes `cluster`-Feld (1-7, Quelle queue.yaml `clusters:`) + Normalisierung. category-String-Risk-Routing (gate.ts `includes`) bleibt für "Recht & Sicherheit" gültig, aber tote Wörter "Steuer"/"Compliance" → cluster===6 als robuster Trigger ergänzt.
- **Internes Dashboard (`app/dashboard`) in Produktion via `notFound()` versteckt** ausser `DASHBOARD_ENABLED` gesetzt — lokales Werkzeug nie öffentlich (trägt bald GSC/GA4-Daten).

## 2026-06-10 (Teil 2) — Researcher-Timeout, run-media Selfhost-Fix, Hero-Luecke, Gemini-Fallen

- **Tages-Pipeline starb am Researcher-Timeout (`spawnSync claude ETIMEDOUT`):** Web-Recherche
  (`claude -p` mit WebSearch/WebFetch) braucht oft >320s; alle 4 Retries laufen in denselben
  Timeout (Retries helfen gegen ein Dauerproblem NICHT). **FIX:** Rollen-Timeouts erhoeht in
  `pipeline.ts` (Researcher 320->600, Writer 320->480, Editor/Finalizer 240->360). Trivialer
  `claude -p` Test (26s OK) beweist: Auth/Guthaben ok, nur Dauer. Diagnose-Reihenfolge: erst
  `claude -p "OK"` testen (Auth), dann Timeout pruefen.
- **run-media Video-Selfhost gefixt (Wurzel):** `mdxMedia.ts` `embedVideo` kann jetzt optional
  `src`/`poster` (selbst-gehostet) statt nur YouTube-id; `run-media.ts` kopiert die MP4 nach
  `public/videos/<slug>-video.mp4`, zieht per ffmpeg einen Poster-Frame und committet `public/videos`.
  Damit kommt der Broken-Link-Bug bei kuenftigen Artikeln nicht wieder. Mit Unit-Test verifiziert.
- **Hero-Luecke bei freigegebenen Artikeln:** Die Tages-Pipeline shippt NUR Text (`--no-image`);
  `featuredImage` zeigt im Frontmatter auf eine Datei, die erst der spaetere Medien-Schritt (Codex)
  erzeugt. Solange der nicht lief (Codex-Credits leer), hat der LIVE-Artikel ein **kaputtes Hero**
  (Optimizer 400) und eine kaputte Listing-Card. Pruefen:
  `curl -s -o /dev/null -w '%{http_code}' ".../_next/image?url=%2Fimages%2Fblog%2F<slug>.png&w=1200&q=75"`.
  Bei 400/404 Hero via Gemini im cinematic+Hook-Stil nacherzeugen (Hook mit Umlaut geht, z.B.
  "jahr fuer jahr?").
- **Gemini-Bildgenerierung, drei konkrete Fallen:**
  1. **Klick auf den Bildkoerper oeffnet den Markup-Editor** (Skizze/Text), NICHT Download. Nur das
     kleine Overlay-Download-Icon oben rechts am Bild nutzen (oder im Editor das Download-Icon oben).
  2. **Mehrzeilige Prompts:** Return fuegt eine neue Zeile ein statt zu senden -> den blauen
     Senden-Pfeil klicken.
  3. **Frische Konversation:** nach `navigate gemini.google.com/app` ist die Seite ~5s nicht bereit,
     der erste type geht verloren -> Prompt erneut tippen. Modell faellt manchmal auf "Flash" zurueck
     (erzeugt trotzdem brauchbare Bilder), gelegentlich Fehler "(1099)" -> einfach erneut senden.
  Download immer per **md5-Eindeutigkeit** verifizieren (race: "neueste Datei" kann das vorige Bild sein).
- **Media-Checker haengt NICHT:** `run-media-check.sh` macht Bilder headless (Codex, faengt Fehler ab)
  + macOS-Notification fuer die Browser-Schritte + Tagesstempel. Podcast/Video brauchen weiter eine
  Browser-Session (`npm run media`).

## 2026-06-10 — Video-Selfhost-Bug, Multi-Bild-Luecke, Gemini-Download-Falle, Lenis-Scroll

- **Video-Broken-Link doppelt verursacht (wichtigster Fund):** `run-media` bettet Videos als
  `<VideoEmbed id="<YouTubeId>" />` ein. Die `VideoEmbed`-Komponente bevorzugt aber selbst-gehostetes
  `src`+`poster` (HTML5 `<video>`), weil YouTube-Embeds in content-gefilterten Browsern (uBlock/Brave/
  Pi-hole) geblockt werden. Nur-`id` faellt auf den YouTube-Pfad zurueck -> bei Thomas Broken Link.
  ZUSAETZLICH lagen die MP4s nur in `scripts/content-engine/.work/` und waren nie deployed (live 404).
  **FIX:** MP4 nach `public/videos/<slug>-video.mp4`, Poster-Frame `ffmpeg -ss 3 -i x.mp4 -frames:v 1
  -vf scale=1280:-2 <slug>-poster.jpg` nach `public/videos/`, Embed auf
  `<VideoEmbed src="/videos/..-video.mp4" poster="/videos/..-poster.jpg" id="<yt>" title=".." />`
  (id bleibt nur fuer den Caption-Link). Genau wie die 3 bereits funktionierenden Videos.
  **Lehre: `run-media` muss kuenftig direkt selbst-hosten (src/poster) statt nur YouTube-id.**
- **Multi-Bild-Luecke:** `run-media`/Pipeline erzeugte fuer #313 + Kosten nur das Hero-Bild (1x, inline
  wiederverwendet). Alle anderen Artikel haben 4-6 Bilder. Pruefen mit
  `for f in content/blog/*.mdx; do echo "$(grep -cE '^!\[' $f)  $f"; done | sort -n`. Pro Artikel 3
  zusaetzliche Inline-Bilder nach passenden `## ` Sektionen platzieren (Schema `<slug>-ctxN-<hash>.png`).
- **Gemini-Download-Falle (kostete Zeit):** Das `...`-Menue -> "Bild herunterladen" laedt das FALSCHE
  Bild (das erste/featured der Konversation), nicht das gehoverte. NUR das per-Bild-Hover-Download-Icon
  oben rechts am jeweiligen Bild verwenden ("Wird in Originalgroesse heruntergeladen..."). Und NICHT per
  "neueste Datei" zuordnen (race + Chrome haengt " (1)" an gleiche Basenamen) -> per **md5** verifizieren,
  dass jede ctx-Datei eindeutig ist. Gemini benennt Downloads deterministisch je Bildinhalt.
- **Gemini Charakter-Konsistenz:** Folge-Prompts im SELBEN Chat behandelt Gemini als Edits und behaelt
  dieselbe Person -> ideal fuer einen roten Faden ueber einen Artikel (gleiche/r Protagonist/in). Fuer
  eine NEUE Person frischen Chat (`gemini.google.com/app`) starten. Stil-Preset: "cinematic editorial
  photograph, 16:9, warm teal-and-amber grade, soft window light, shallow DoF, premium agency look,
  authentic Austrian office, upper body only, no text/logos/watermarks". Modell "Pro" = Nano Banana.
- **redrabbit nutzt Smooth-Scroll (Lenis o.ae.):** synthetische Wheel-/Page_Down-Events scrollen die
  Live-Seiten im Automations-Browser NICHT (Seite bleibt oben haengen, wirkt "eingefroren"). **Stattdessen
  `javascript_tool` mit `el.scrollIntoView({behavior:'instant',block:'center'})`** + danach Screenshot.
  Achtung: JS-Rueckgaben mit URLs/Query-Strings werden vom Tool als "Cookie/query string data" geblockt
  -> nur sanitierte Werte zurueckgeben (Counts, Dimensionen), keine `src`-URLs.
- **Listing-Card (`BlogTimelineCard`)** nutzt framer-motion `initial opacity:0` + `whileInView`. Im
  Automations-/JS-eingeschraenkten Kontext feuert der IntersectionObserver evtl. nicht -> Karte bleibt
  unsichtbar. Artikel-Inline-Bilder (mdx `img`) sind NICHT gegated und rendern immer.

## 2026-06-09 (spaet) — NotebookLM-Video-Vergiftung, Gemini-Bilder, Substack-Button

- **NotebookLM-Video "Vergiftung" (wichtigster Fund):** Eine fehlgeschlagene Video-Generierung bleibt
  im Notebook HAENGEN. Jede "Wiederholen"-Aktion scheitert danach SOFORT erneut (RPC `Rytqqe`/`gArtLc`
  liefern HTTP 200, aber der Payload meldet Fehlschlag); auch Karte-Loeschen und Seiten-Reload helfen
  nicht. Es ist NICHT konto-weit (Podcast im selben Notebook lief; Login also ok) und NICHT die Quelle
  (gleiche URL ging im frischen Notebook). **FIX: neues Notebook anlegen, Quelle neu adden, Video dort
  erzeugen -> laeuft sofort.** Diagnose-Reihenfolge: Podcast geht? -> Auth ok. RPC 200 aber Fehler? ->
  Backend-/Notebook-Problem, nicht Client.
- **Cross-Notebook-Parallelitaet:** Zwei Videos gleichzeitig ueber ZWEI Notebooks laufen problemlos;
  Audio + Video GLEICHZEITIG im SELBEN Notebook -> das zweite scheitert (pro Notebook seriell). Fuer
  Tempo: pro Artikel je ein Notebook fuer Video, ein weiteres fuer Audio -> parallel.
- **Bilder gratis via Gemini-Browser (Nano Banana 2):** `images-only.ts` ruft OpenAI Codex; dessen
  Credits waren erschoepft ("You've hit your usage limit ... try again at Jun 11th 2026 11:00").
  Ersatz: gemini.google.com (eingeloggtes Google-Konto) -> Bild-Prompt -> "Bild in Originalgroesse
  herunterladen" -> `~/Downloads/Gemini_Generated_Image_*.png` -> nach `public/images/blog/<slug>.png`
  (kommt 1376x768). Artikel-MDX referenziert das Bild bereits (featuredImage + Body), also reicht die
  Datei. Body-Alt-Text danach an das echte Motiv anpassen (Pipeline schrieb "Infografik/Zeitstrahl").
  **Bildstil-Standard:** cinematic Foto + handschriftlicher Hook, Person nur Oberkoerper/aktiv;
  KEINE Clipart, kein Vollrot, kein helles Stockfoto (Referenz: User-Notebook "2026 Thumbnail Trends":
  Negative Space als Pattern Interrupt, max 2 Farben, ruhig+professionell).
- **Browser-Eingabe-Robustheit:** Bei Gemini/Substack verrutschen Koordinaten beim Fenster-Resize ->
  Eingabefelder/Buttons per `find` (ref) ansteuern. Umlaut-Text zuverlaessig per `pbcopy` + cmd+v.
- **Substack "Weiter" advanciert nicht:** Das sichtbare "Weiter" ist oft nur ein Label-Element
  (`find` ref_16, klickt nicht). Der ECHTE Button ist ein separates Element (`ref_52` "Next").
  In dieser Session advancierte auch das nicht -> in frischer Session erneut (Extension-Friktion).
  Substack-Regeln unveraendert: Rubrik PFLICHT; YouTube-Embed per Paste auf leerer Zeile; Erst-Publish
  mit Video haengt -> erst Text, dann Video per "Aktualisieren".

## 2026-06-06 (Nacht) — voller autonomer Durchlauf + Substack + Embed-Resilienz

- **Voller Content-Engine-Durchlauf bewiesen (Artikel #105):** Freigabe -> `/api/approve` setzt
  `published` UND legt still einen Medien-Marker an -> NotebookLM Podcast+Video (Browser) ->
  `run-media` (npm `media`): Podcast einbetten + Video PUBLIC zu YouTube + einbetten + push +
  Schluss-Mail. Neue, getestete Werkzeuge: `scripts/content-engine/media/{run-media,mdxMedia,pending}.ts`.
  2-Mail-Flow (Mail 2 verworfen, User-Wunsch).
- **Substack veroeffentlichen (Browser), drei Stolpersteine:** (1) **Rubrik ist PFLICHT** -> ohne
  Rubrik haengt "Ohne Buttons veroeffentlichen" und der Post bleibt Entwurf. (2) YouTube-Embed nur
  per **Paste auf LEERER Zeile** (getippt/ueber-Auswahl = nur Link). (3) Erst-Publish MIT Video
  haengt die Share-Center-Seite -> erst TEXT veroeffentlichen, dann Video per "Aktualisieren"
  nachziehen (Update sendet keine Mail). Status nur in FRISCHEM Tab pruefen, Editor-Tab mit Embed
  wird unresponsiv. Konto hat 0 Abos.
- **"Kaputtes Video" = Client-Blocker, kein Server-Bug:** Thomas' Chrome blockt YouTube-Domains
  (youtube-nocookie.com UND i.ytimg.com). Erst messen (curl-Markup, Data-API uploadStatus/embeddable,
  oEmbed 200), dann fixen. `VideoEmbed.tsx` jetzt Lite-Embed ("use client"): Poster + Play-Button,
  Player erst beim Klick, Poster `onError` -> hide (nie kaputtes Kaestchen), Caption = youtu.be-Link.
- **Nicht over-engineeren:** Thomas fragt aktiv nach ("tust du overingenieren? funktioniert es?").
  Server zuerst verifizieren, ehrlich sagen ob es funktioniert, gezielt minimal fixen.

## 2026-06-05 Abend

- **launchd-PATH:** `bash -lc` liest `~/.zshrc` NICHT, also fehlte nvm (`claude`) -> Tagesjob starb
  an `spawnSync claude ENOENT`. Fix: nvm-default-major-bin + homebrew explizit in `run-daily.sh`.
  Auth (`claude -p`) ist session/keychain-gebunden, nicht PATH (env -i meldet faelschlich "not logged in").
- **YouTube nur via Data-API, nicht Browser:** Das `file_upload`-Browser-Tool akzeptiert keine
  lokalen Dateipfade mehr ("no longer accepts host filesystem paths"). Damit ist KEIN Browser-Datei-
  Upload moeglich (Substack-Audio/-Bild, YouTube-Web-Upload). YouTube laeuft serverseitig per API.
- **OAuth-Cross-Account-Falle:** Kanal gehoert rabbit.red.media, GCP-Projekte teils t.uhlir/
  thomas.uhlir@gmail. Altes Projekt `claude-email-manager-484501` war fuer ALLE unzugaenglich. Loesung:
  ALLES unter dem Kanal-Konto rabbit.red.media (eigenes Projekt blissful-answer-468100-v3): API enablen
  (gcloud), Desktop-OAuth-Client (Console, JSON-Download), Consent-Screen veroeffentlichen, dann
  `youtube_auth.py`. `accounts.google.com` ist fuer Browser-Automatik gesperrt -> Consent macht User.
- **Scopes:** `youtube.upload` darf NUR insert, NICHT `videos().update` (Sichtbarkeit/Beschreibung
  -> 403 insufficient scopes). Fuer nachtraegliche Aenderungen `youtube` (verwalten) Scope noetig.
  Pragmatisch: kuenftige Videos direkt mit `privacyStatus=public` hochladen. Ungelistete Videos
  erscheinen NICHT unter /@kanal/videos, sind aber einbettbar.
- **Backlink-Wahrheit:** YouTube-Beschreibungslinks sind nofollow (Referral-Traffic, kaum SEO-Juice).
  Staerkster Backlink = eingebettetes Video auf eigener Artikelseite + der Artikel selbst.
- **Substack-Publish-Klick** haengt nur auf einem EINGEFRORENEN Tab (alte Interaktionen). Auf
  FRISCHEM Tab geht der Durchlauf inkl. Tags. Substack hat keine API; Audio/Bild brauchen Datei-Upload.
- **Wiederkehrender Fehler:** User-sichtbaren deutschen Text (Substack, YouTube-Beschreibung) NIE in
  ASCII (ae/oe/ue) schreiben, IMMER echte Umlaute. Zweimal beanstandet.

## 2026-06-02

- Fresh GitHub checkout for local testing was created at `/private/tmp/webredrabbitmedia-9000`.
- The site was successfully run on `http://localhost:9000`.
- Copying `node_modules` from another checkout caused dependency drift: `@next/third-parties/google` was missing even though `package.json` and `package-lock.json` required `@next/third-parties`.
- Running `npm install` in the checkout fixed the missing module by making `node_modules` match `package-lock.json`.
- The dev server then returned `HTTP/1.1 200 OK` on `http://localhost:9000`.
- Project memory files were added: `CLAUDE.md`, `MEMORY.md`, and `LESSONS_LEARNED.md`.
- `CLAUDE.md` now documents that `MEMORY.md` and `LESSONS_LEARNED.md` should be updated at every session end when relevant.
- Frontend work should use the `frontend-design` and `ui-ux-pro-max` skills for design quality, UX, accessibility, and responsive checks.
- Removed hardcoded SMTP credential fallback from `app/api/contact/route.ts`; SMTP secrets must be provided through env vars.
- Added shared API security helpers in `lib/api-security.ts` for admin-token checks, Web Red Rabbit URL validation, and audio proxy URL allowlisting.
- Protected `/api/indexing` and `/api/indexnow` so unauthenticated public requests fail closed.
- Hardened `/api/audio-proxy` by requiring HTTPS allowlisted hosts, audio content types, timeout, and max size checks.
- Resolved `/robots.txt` route conflict by keeping `app/robots.ts` and deleting `public/robots.txt`.
- Fixed missing blog image references by pointing MDX frontmatter/inline images to existing files in `public/images/blog`.
- `npm audit fix` plus targeted updates to `nodemailer@8.0.10` and `googleapis@173.0.0` reduced audit findings from 26 to 3 moderate `next/postcss` findings with no available fix.
- Codex and Claude Code should use the same memory files (`CLAUDE.md`, `MEMORY.md`, `LESSONS_LEARNED.md`) as the shared source of truth.
- Responsive root causes found on 2026-06-02:
  - The full Header nav at `md` overflowed 768px tablets; use `lg` for desktop nav and mobile drawer below that.
  - Rendering the closed offcanvas drawer still increased `scrollWidth`; render the drawer only while open.
  - `AOS` horizontal reveals (`fade-left`/`fade-right`) can temporarily push content outside the viewport; centralize them to `fade-up`.
  - Extra `left: -10000px` on `sr-only` SEO content can distort overflow checks; rely on the `sr-only` utility itself.
- Responsive verification script should scroll pages before checking images and should test image URLs via HTTP response/content-type instead of relying on `naturalWidth`, because lazy-loaded Next images can otherwise appear falsely broken.
- Additional responsive root causes found before commit:
  - The About testimonial carousel expanded the flex track to multiple slide widths, which increased document width; keep the visible track at 100% and translate by whole-slide widths.
  - Footer regional/city SEO links can overflow at tablet/desktop widths unless the wrapping container is constrained and overflow-safe.
  - `RegionalSEOContent` had the same manual offscreen positioning issue as `SEOContent`; rely on `sr-only`.
- ESLint cleanup on 2026-06-02 removed unused imports and changed unused `catch (_err)` to `catch`; `app/[slug]/cluster-content.ts` keeps a file-local unused-vars disable because its generated/template content intentionally includes unused placeholder parameters.
- `npm view next version` returned `16.2.7` on 2026-06-02. The remaining audit finding still reports vulnerable `next/postcss` with no fix available, so do not churn dependencies until a safe Next release exists.
- Vercel deployment lesson from 2026-06-02:
  - A fresh checkout without `.vercel/project.json` can create a new Vercel project during `vercel --prod --yes` instead of deploying to the existing custom-domain project.
  - Add `.vercelignore` to avoid uploading local caches/logs/build output; this reduced the upload from 399.7 MB to 194.4 MB and allowed the second deploy to complete.
  - Do not alias `web.redrabbit.media` to a newly created Vercel project until the existing production environment variables are confirmed or migrated.
- Vercel env lesson from 2026-06-03:
  - Do not trust `vercel env add` in this environment unless followed by a verified `env pull`, dashboard check, or live endpoint result. It returned exit 0 with only `Retrieving project…`, but `/api/indexnow` still showed missing env.
  - Vercel API DNS for `api.vercel.com` was intermittent; retry from a stable network or use the Vercel dashboard for env changes.

## 2026-06-03 (Content-Engine Planung)

- iCloud-Desktop-Checkout (`Desktop/Tomson/.../webredrabbitmedia`) lässt git hängen (ausgelagerte
  dataless Packs). Lösung: frischer `git clone` von origin nach `~/dev/redrabbit`. Dort weiterarbeiten.
  `mv` aus iCloud vermeiden (lädt erst herunter → hängt). Dateinamen listen geht, Datei-INHALTE
  lesen hängt; Workaround `perl -e 'alarm N; exec @ARGV'` als timeout.
- VOICE-LEKTION: Die bestehenden `content/blog/*`-Artikel sind KI-generiert und taugen NICHT als
  Stil-Vorbild für den echten Autor. Stil aus den ECHTEN Texten des Users ziehen (gesendete Mails).
  Word-Docs auf dem Rechner waren entweder Verträge/Exposés oder KI-Coaching-Texte (FÜR ihn, nicht
  VON ihm) → ungeeignet + teils sensibel.
- Thomas' stärkster KI-Tell = **Gedankenstrich "–"** (tippt er nie; KI ständig). Außerdem
  Dreierfiguren/rule-of-three, "nicht nur…sondern auch", Hochglanz-Marketing. Harte Content-Regel:
  kein "–". Verankert in `content-engine/voice/house.md`.
- Vor dem Planen neuer Infra IMMER Repo prüfen: GA4 (`G-09FNC6THTD`), Google Indexing API
  (`app/api/indexing/route.ts`, Service-Account), IndexNow, SMTP, `ADMIN_API_TOKEN` waren BEREITS da.
- Bildgenerierung: Claude/Claude Code hat KEIN natives Bildmodell; Design-Skills nutzen Gemini
  (kostet) oder HTML→Screenshot. Bester 0€-Weg: `codex` CLI `imagegen`-Skill (Terminal, headless via
  Shell aus der Pipeline aufrufbar, läuft über ChatGPT-Plus-Limit).
- GSC ist verifiziert (`web.redrabbit.media`), aber Baseline ~11 Klicks/3 Monate = nahe Null →
  ehrliche Erwartung: Top-10 nur für gewinnbare Long-Tail/lokal, ~3-6 Monate, kompoundierend.

## 2026-06-04 (Content-Engine Bau + Deploy)

- **Vercel Bild-Cache (KRITISCH):** Dateien in `public/` werden mit `cache-control: max-age=31536000, immutable`
  ausgeliefert (`x-vercel-cache: HIT`). Ein Bild unter DEMSELBEN Dateinamen zu ueberschreiben aendert
  NICHTS am CDN, das alte Bild bleibt. Loesung: Bild-Dateinamen IMMER versionieren
  (`<slug>-hero-<v>.png`). Ist in `scripts/content-engine/image.ts` (Funktion `version()`) verankert.
- **Codex imagegen** (`codex exec --full-auto -c sandbox_mode=workspace-write "use imagegen ... copy to <path>"`)
  laeuft headless, 0 EUR ueber ChatGPT-Plus, ABER kann KEINEN lesbaren Text (Woerter werden Kauderwelsch).
  Nur fuer Bilder OHNE Text (Fotos/Illustrationen). Infografiken mit Text/Zahlen = als SVG bauen und via
  `sharp(Buffer.from(svg)).png()` rendern. macOS-Hand-Fonts (Marker Felt, Chalkboard SE, Bradley Hand)
  rendern in librsvg → handgezeichnete Sketchnote-Infografiken mit gestochenem Text moeglich.
- **Content-Stimme:** Artikel in natuerlichem, fluessigem Deutsch mit vollstaendigen Saetzen schreiben
  (Vorbild = bestehende Tipps-Artikel), NICHT im knappen E-Mail-Staccato des Users. Seine Mails = Quelle
  fuer Persoenlichkeit/Ehrlichkeit, NICHT fuer den Prosa-Rhythmus. Abgehackte Fragmente + erzwungenes
  "oder?" lesen sich un-deutsch/nach KI. Fix in `content-engine/voice/house.md` (Sektion ARTIKEL-PROSA)
  + Writer-Prompt mit echtem Artikel als Lesefluss-Vorbild (`readArticleSample()`).
- **`claude -p` headless** funktioniert fuer die 4-Rollen-Pipeline. Unter PARALLEL-Last (3 gleichzeitig)
  kann der Finalizer transient fehlschlagen → 1 Retry in `runClaude`, riskante Schritte lieber sequenziell.
- **YAML + Frontmatter:** unquotiertes `YYYY-MM-DD` wird als Date-Objekt geparst → String-Validator faellt
  durch. Daten im MDX quoten (Pipeline normalisiert via `quoteFrontmatterDates`).
- **Quellen-Namen** aus Web-Recherche enthalten oft en/em-dashes ("Evario — ...") → vergiften das
  no-em-dash-Frontmatter. Pipeline saniert Quellen-Namen (Dash → Bindestrich).
- **Vercel-Env:** Projekt `webredrabbitmedia` (Domain web.redrabbit.media) hatte GAR KEINE Env-Variablen
  (auch kein SMTP → Kontaktformular sendet nicht). Setzen via `vercel env add <NAME> production`
  (stdin-pipe), verifizieren via `vercel env pull`. Aktiv wird Env erst beim naechsten Deploy.
- **Sicherheit:** den breiten `gh auth token` (Scopes repo/workflow/gist) in die Vercel-Env zu schreiben
  wird vom Permission-Classifier blockiert (Credential-Leak). Stattdessen fein-granularer PAT
  (nur Contents:write auf das eine Repo). SMTP-Passwort existiert nirgends abrufbar → nur vom User.
- **Vercel Build-Queue** kann nach vielen schnellen Pushes hintereinander minutenlang in "Queued"
  haengen bleiben (kein aktiver Build). Deploys buendeln, Queue nicht fluten.

## 2026-06-05 (Medien + Email + Automatik live)

- **Vercel Hobby = 1 paralleler Build fuers ganze Konto.** Ein Duplikat-Projekt `webredrabbitmedia-9000`
  war ans gleiche GitHub-Repo gekoppelt -> jeder Push baute doppelt, ein haengender `-9000`-Build (30+ Min
  "Initializing") blockierte den einzigen Slot, alle echten Deploys hingen in "Queued". **Loesung: `-9000`
  Git-Verbindung im Vercel-Dashboard trennen** (Settings -> Git -> Disconnect). Queued-Deploys cancelt man
  per Dashboard (3-Punkte -> Cancel Deployment) oder API `PATCH /v12/deployments/{id}/cancel`. Frischen
  Deploy aus GitHub triggern: API `POST /v13/deployments` mit `gitSource{type:github,ref:main,repoId}`.
- **codex auto-migriert Modell `gpt-5.4 -> gpt-5.5`** (`config.toml [notice.model_migrations]`). 5.5 reasoned
  viel laenger -> 4-8 min/Bild, lief in 260s-Timeout. Fix: `codex exec --sandbox workspace-write -m gpt-5.4`
  + Timeout 600s. `image_gen`-Tool lehnt `reasoning.effort minimal` AB (400). codex v0.136 liest die
  imagegen-SKILL.md bei jedem Call (Extra-Overhead). Fotos parallel via Promise.all = Wall-Clock ~1 Bild.
- **SMTP fuer immo.red:** Domain ist Google Workspace, dort sind App-Passwoerter oft Admin-gesperrt
  ("Einstellung nicht verfuegbar"). Loesung: privates Gmail `thomas.uhlir@gmail.com` mit App-Passwort,
  `smtp.gmail.com:587`. **Gmail-SMTP-From MUSS = authentifiziertes Konto** (From=gmail, To=immo.red ok).
  App-Passwort als `encrypted` Vercel-Env, NIE ins Repo. Env wird erst beim naechsten Deploy aktiv.
- **NotebookLM Quelle:** URL-Import zieht Menue/Footer-Muell der Seite mit ("Ueber uns, erstellen lassen,
  (c) Red Rabbit GmbH"). Fuer sauberen Podcast/Video den VOLLEN Artikeltext via "Kopierter Text" einfuegen,
  URL-Quelle loeschen (3-Punkte -> Quelle entfernen). "Quellenuebersicht" ist nur die Auto-Zusammenfassung,
  NICHT der gespeicherte Volltext (User dachte sonst, Artikel sei unvollstaendig). Pro Artikel ein eigenes
  Notebook (User-Regel, sonst vermischen sich Infos).
- **Clipboard-Falle bei Browser-Automation:** `pbcopy` setzt die Zwischenablage, aber wenn der User
  parallel auf seinem Mac etwas kopiert, wird sie ueberschrieben. Einmal landete so sein App-Passwort beim
  `cmd+v` im NotebookLM-Feld. Immer DIREKT vor dem Paste frisch `pbcopy` + per Screenshot verifizieren, was
  wirklich eingefuegt wurde, bevor man "Einfuegen"/Submit klickt.
- **Podcast-Hosting:** NotebookLM-Audio (m4a) -> `ffmpeg -ac 1 -b:a 96k` (22min ~14MB) -> `public/audio/`
  -> `<SimpleAudioPlayer src="/audio/<slug>-podcast.mp3" title="..." />` nach der H1. Komponente ist in
  `mdx-components.tsx` registriert. `audio-proxy` nur fuer EXTERNE (Substack) mp3s noetig, nicht same-origin.
- **YouTube/Substack Backlink-Muster (User):** ganz unten in die Beschreibung `mehr infos unter:` +
  konkreter Artikel-URL + `web.redrabbit.media` + `redrabbit.media`. Das ist der SEO-Backlink-Zweck. Seine
  bisherigen Substack-Posts haben den Backlink NOCH NICHT -> kuenftig immer rein.
- **Branch-Konsistenz:** Daily-Job (`run-daily.sh`) + Freigabe-Flow (`/api/approve` editiert GitHub main)
  brauchen main = aktueller Live-Stand. main war divergiert (alte Merge/Chore-Commits aus git-Deploys).
  `git merge -s ours origin/main` behaelt feats Inhalt komplett, verbindet nur die Historie -> ff-push.
- **launchd LaunchAgent braucht KEIN offenes Terminal** (laeuft im Hintergrund, nur der User muss eingeloggt
  /Mac an sein). plist via `/bin/bash -lc` expandiert `$HOME`. `plutil -lint` vor `launchctl load`.
  Mac-Selbst-Wecken fuer feste Uhrzeit: `pmset repeat wakeorpoweron ...` (nur am Strom, nicht bei Komplett-Aus).

## 2026-06-09 — Content-Engine Resilienz, Graphify/Obsidian Tooling

- **runClaude ETIMEDOUT-Haenger geloest (`scripts/content-engine/lib/roles.ts`):** Der headless
  `claude -p`-Call faellt unter Service-Ueberlast transient mit ETIMEDOUT aus. Die alte 2-Versuch-
  Schleife retryte SOFORT (kein Delay) -> traf denselben ueberlasteten Service -> gab in Sekunden auf
  -> blockierte die Tages-Pipeline (Artikel #262, #313 haengten tagelang). **Fix: 4 Versuche mit
  exponentiellem Backoff (15s/30s/60s) via dependency-freiem `Atomics.wait`-Sleep auf SharedArrayBuffer.**
  Live bewiesen: #313-Editor scheiterte Versuch 1, wartete 15s, Versuch 2 erfolgreich. Tests 48/48 gruen.
- **Festhaengender Artikel manuell nachziehen:** Wenn ein launchd-Lauf scheitert (ETIMEDOUT/Safety),
  Artikel direkt generieren mit `npx tsx scripts/content-engine/pipeline.ts --next --emit --no-image`,
  dann Deploy abwarten (`curl /tipps/<slug>` bis 200), dann Review-Mail manuell ausloesen:
  `set -a && . ./.env.local && set +a; curl -X POST $SITE_URL/api/review-notify -H "Authorization: Bearer $ADMIN_API_TOKEN" -d '{"slug":"..."}'`.
- **Researcher blockiert bei Rechtsthemen (Safety-Filter):** Thema #262 (DSGVO "abmahnsicher") liess den
  Researcher bei jedem Versuch scheitern -> Endlosschleife auf dem Thema. **Loesung: in
  `content-engine/topics/status.json` das Thema auf `"skip"` setzen**, dann zieht `--next` das naechste.
- **Graphify NUR code-only laufen lassen (0 API-Kosten):** `graphify . --backend claude` ODER `graphify label`
  rufen die Anthropic API = Extra-Kosten. Stattdessen `graphify update . --no-cluster --force` (reine lokale
  AST-Extraktion, kein LLM). `.graphifyignore` excludet `content/`, `public/`, `*.md`, Bilder. Post-commit-Hook
  `.git/hooks/post-commit` aktualisiert den Graph automatisch (code-only, gratis). Graph: `graphify-out/graph.json`.
- **`npx skills add` installiert PROJEKT-lokal nach `.agents/skills/`:** Nicht global. `.agents/` ist
  gitignored, `skills-lock.json` wird committed (wie package-lock.json) -> Restore via `npx skills install`.

### 2026-06-13 — Tägliche Mail blieb aus: Kill-Switch durch Slug-Rename falsch ausgelöst
- **Symptom:** Keine Review-Mail mit neuem Artikel, obwohl Mac lief. **Ursache:** Der Indexierungs-
  Kill-Switch (`content-engine/.kill-switch.json`, geschrieben von `dashboard/check_indexation.ts`)
  pausiert die Produktion, wenn die Google-Indexierungsrate < 60% fällt. Die 4 am 12.06 umbenannten
  Slugs + frische Tages-Artikel waren "unknown to Google" (normale Crawl-Lag von Tagen-Wochen), Rate
  fiel auf 50% → Tageslauf brach bei `pipeline.ts` (pre-emit Kill-Switch-Read) ab, kein Stamp, keine Mail.
- **Fix:** **Schonfrist** in `check_indexation.ts` (`RR_INDEXATION_GRACE_DAYS`, default 21): URLs deren
  Artikel publishedAt/updatedAt < 21 Tage zurückliegt zählen NICHT in die Quote. Verifiziert: reife Quote
  100% statt 50%. Lehre: Eine URL am Tag nach Anlegen/Rename als "nicht indexiert = Fehler" zu werten ist
  falsch. **Slug-Renames bestehender Seiten = realer Schaden** (Re-Index-Lag triggert Schutzmechanismen);
  URL-Länge ist KEIN Ranking-Faktor (Google offiziell) → bestehende Slugs nicht umbenennen.
- **Kill-Switch manuell lösen:** `npx tsx scripts/content-engine/dashboard/check_indexation.ts` (re-evaluiert
  + schreibt active:false) ODER `rm content-engine/.kill-switch.json`. Stamp wird erst am Ende (`touch`) nach
  Publish geschrieben → ein gescheiterter Lauf "verbraucht" den Tag NICHT, der nächste Catch-up (alle 3h) zieht nach.

### 2026-06-13 — Engine-Langsamkeit: Timeout wurde nicht durchgesetzt (SIGTERM)
- **Symptom:** Gesunde Läufe ~10-15 Min (Rollen je 70-300s), aber gelegentlich (abends/unter Last) ein Lauf
  ~2h. **Ursache:** Ein einzelner `claude -p`-Aufruf lief ~7140s TROTZ 600s-Timeout. `execFileSync` schickt
  per Default SIGTERM, das die headless-`claude`-CLI ignoriert/zu langsam behandelt → Aufruf hängt, Parent
  blockiert. Baseline: ein nackter `claude -p` braucht ~30s Startup-Overhead (×5 Rollen = ~150s Sockel).
- **Fix:** `killSignal: 'SIGKILL'` in `runClaude` (`lib/roles.ts`) → hängender Aufruf stirbt bei timeoutSec,
  Retry/Backoff greift. Healthy <200s bleibt unberührt (Limits 480-600s). Worst Case pro Rolle: ~2h → ~42 Min.
- **Falls Hänger trotzdem wiederkehren:** Nächster Schritt = `claude` detached (eigene Prozessgruppe) starten
  und bei Timeout die ganze Gruppe killen (`process.kill(-pid)`), da Enkel-Prozesse (MCP) die Pipe offenhalten
  könnten. Erst nötig, wenn SIGKILL allein nicht reicht.

### 2026-06-22 — `grep` spammte "claude native binary not installed" (Shell-Snapshot-Funktion)
- **Symptom:** Jeder Bash-Befehl mit `grep` (auch via Redirect `> file 2>&1`) gab die mehrzeilige Fehlermeldung
  `Error: claude native binary not installed ...` statt der grep-Treffer aus → grep/Befehlssubstitution unbrauchbar,
  Diagnose-Befehle korrumpiert. `which -a claude` zeigte NUR das funktionierende Homebrew-claude → irreführend.
- **Ursache:** `grep` ist eine **Shell-Funktion** aus dem Claude-Code-Shell-Snapshot (`~/.claude/shell-snapshots/...`),
  die grep durch `claude` als `ugrep` routet: `ARGV0=ugrep "$CLAUDE_CODE_EXECPATH" -G ...`. `CLAUDE_CODE_EXECPATH`
  zeigte auf den **kaputten 500-Byte nvm-`claude.exe`-Stub** (`~/.nvm/versions/node/v20.20.0/.../claude.exe`, vom
  Auto-Update ohne native Binary). Der Stub druckt die Fehlermeldung → landet als grep-Ausgabe.
- **Fix:** Den kaputten nvm-Stub durch einen **Symlink auf die echte Homebrew-claude.exe** ersetzen
  (`ln -sf /opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe <nvm-stub-pfad>`). Danach läuft
  sowohl `claude` als auch die grep-`ugrep`-Route sauber. (Auto-Updates können den Stub neu anlegen → bei Wiederkehr
  erneut symlinken; die echte Absicherung für den Tageslauf ist der `resolve_claude`-Guard in run-daily.sh.)
- **Diagnose-Kürzel:** `type grep` → ist es eine Funktion, die `$CLAUDE_CODE_EXECPATH` aufruft? `file $CLAUDE_CODE_EXECPATH`
  → "ASCII text" (kaputt) vs "Mach-O" (ok). Homebrew-claude funktioniert separat (`/opt/homebrew/bin/claude --version`).

### 2026-06-22 — macOS `/bin/bash` ist 3.2: kein `mapfile`/`readarray`
- **Symptom:** Ein neues Trigger-Script (`generate-images-gemini.sh`, Shebang `#!/bin/bash`) nutzte `mapfile -t arr < <(...)`.
  `bash -n` (Syntax) war grün, aber zur Laufzeit: `mapfile: command not found` + unter `set -u` Folgefehler `arr: unbound variable`.
- **Ursache:** Der Shebang `#!/bin/bash` löst auf macOS zu **/bin/bash 3.2.57** auf (Apple friert bash bei 3.2 ein, GPLv3).
  `mapfile`/`readarray` kamen erst mit bash 4.0. Homebrew-bash (5.x) liegt unter `/opt/homebrew/bin/bash`, wird aber vom
  absoluten Shebang NICHT genutzt.
- **Fix/Regel:** In allen `#!/bin/bash`-Trigger-Scripts **bash-3.2-kompatibel** bleiben: statt `mapfile` ein Read-Loop
  `arr=(); while IFS= read -r l; do arr+=("$l"); done < <(...)`; leere Arrays unter `set -u` mit Count-Check absichern.
  Keine `declare -A`, kein `${var^^}`. Vor Commit Logik unter `/bin/bash <script>` testen, nicht nur `bash -n`.

## Session-End Checklist

- Add new lessons with dates.
- Prefer root-cause notes over vague summaries.
- Include the command or file involved when it helps future debugging.
- Do not store secrets or credentials here.
