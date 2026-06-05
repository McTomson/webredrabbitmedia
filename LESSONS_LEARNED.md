# LESSONS_LEARNED.md

Durable lessons for `webredrabbitmedia`.

Update this file at the end of every session when a debugging lesson, setup issue, deployment issue, or recurring mistake was discovered.

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

## Session-End Checklist

- Add new lessons with dates.
- Prefer root-cause notes over vague summaries.
- Include the command or file involved when it helps future debugging.
- Do not store secrets or credentials here.
