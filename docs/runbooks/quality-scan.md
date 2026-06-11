# Runbook — Qualitäts-Scan (Punkt 4)

Vier additive Qualitäts-Scanner für die Content-Engine, integriert in den Dashboard-Tab
**Verbesserungen**. Architektur: ein CLI schreibt das SoT-Artefakt
`content-engine/.quality-report.json` (gitignored), das Dashboard liest es nur read-only.
Jeder Scanner degradiert graziös (fehlendes Tool/Netz → Status, nie Absturz des Laufs).

## Befehle

```bash
npm run quality:scan                 # Links (intern+extern) + Schema, gegen Live-Site
npm run quality:scan -- --quick      # NUR interne Links, komplett offline (schnell, kein Netz)
npm run quality:scan -- --geo        # + foglift GEO/SEO/AEO-Score (extern, KEIN API-Key nötig)
npm run quality:scan -- --a11y       # + pa11y Barrierefreiheit (nur wenn pa11y installiert)
npm run quality:scan -- --only=<slug> [--limit=N] [--base=https://...]
```

Danach Dashboard öffnen (Desktop-Icon „Red Rabbit Dashboard" → Tab **Verbesserungen** →
Sektion „Qualitäts-Scan").

## Die vier Scanner

| Scanner | Tool | Was | Abhängigkeit |
|---|---|---|---|
| `links` | reines TS + `lychee` | interne `/tipps/{slug}`-Ziele existieren (offline, immer) + externe URLs leben (lychee) | lychee via `brew install lychee` |
| `schema` | `fetch` + Parser | holt die Live-Seite, validiert JSON-LD (BlogPosting/FAQPage Pflichtfelder) | keine (Node-`fetch`) |
| `geo` | `foglift-scan` | SEO/GEO/AEO/Perf/Security/A11y-Sub-Scores + Top-Issues von foglift.io | devDependency `foglift-scan` |
| `a11y` | `pa11y` | WCAG-Verstöße via headless Chromium | **nicht installiert** (siehe unten) |

### Warum pa11y nicht installiert ist
pa11y zieht puppeteer/Chromium (~170 MB). Das widerspricht dem Plan-§15-Prinzip „kein Ballast"
im schlanken App-Repo. Der Scanner ist gebaut + unit-getestet + verdrahtet; aktivieren mit:

```bash
npm i -D pa11y
npm run quality:scan -- --a11y
```

foglift liefert bereits einen `accessibility`-Sub-Score (ohne Chromium), das ist das leichte
A11y-Signal im Alltag; pa11y ist die tiefere Opt-in-Prüfung.

## Bekannte Eigenheiten / Lehren

- **lychee 403/429 = kein kaputter Link.** Das sind fast immer Bot-Sperren (der Link funktioniert
  für echte Leser). Der Scanner akzeptiert sie bewusst (`--accept 200..=299,403,429`); nur 404/410/5xx
  werden als kaputt gemeldet. Kein Falschsignal.
- **foglift Gratis-Tier rate-limited** nach ~8 URLs pro Lauf. Die restlichen Artikel melden dann
  `geo: unavailable` (graziös). Für volle GEO-Daten den `--geo`-Lauf später wiederholen (er
  überschreibt den Report) oder mit `--only=`/`--limit=` in Etappen scannen. Voller GEO-Score
  bräuchte einen `FOGLIFT_API_KEY` (kostenpflichtig) — bewusst NICHT verdrahtet.
- **Hartcodierte Routen ausgeschlossen.** `app/tipps/{slug}/page.tsx` (z.B. `was-kostet-eine-website`)
  überschreibt die MDX-Route; deren MDX-Body wird nie gerendert. Der Scan überspringt solche Slugs
  (wie der On-Page-Audit), ihre interne Verlinkung/On-Page ist Handarbeit.
- **schema-dts** typisiert die Live-JSON-LD in `app/tipps/[slug]/page.tsx` zur Compile-Zeit
  (`next build` bricht bei Schema-Tippfehlern). Bild-`width`/`height` mussten als String stehen
  (schema.org-Typ; Google-äquivalent).

## ALARM — wenn etwas nicht mehr geht

- **Dashboard zeigt „noch nicht gelaufen":** kein `.quality-report.json`. → `npm run quality:scan`.
- **`links: Tool fehlt` (amber):** lychee nicht im PATH. → `brew install lychee`.
- **`geo: Tool fehlt`:** foglift-Binary weg (node_modules). → `npm install`.
- **`geo: unavailable` bei vielen Artikeln:** foglift-Rate-Limit (siehe oben), normal. Später erneut.
- **`schema: Tool fehlt`/`unavailable`:** Live-Site nicht erreichbar (Deploy/Netz). → Deploy + Netz prüfen.
- **Viele kaputte interne Links:** der Cluster-Linker hat einen falschen Slug geschrieben. → MDX prüfen,
  `npm run cluster:relink` ist deterministisch und sollte konsistent sein.

## Dateien

- CLI: `scripts/content-engine/quality/scan.ts` (+ `scanners/{links,schema,geo,a11y}.ts`, `types.ts`)
- Tests: `scripts/content-engine/quality/quality.test.ts`
- SoT-Artefakt: `content-engine/.quality-report.json` (gitignored)
- Dashboard-Reader: `lib/dashboard/quality.ts` → Tab `app/dashboard/verbesserungen/page.tsx`
