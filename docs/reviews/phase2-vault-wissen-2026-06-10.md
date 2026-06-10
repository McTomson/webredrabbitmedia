# Review — Phase 2 (Vault, /interview-me, Wissen-Tab, NotebookLM-Plan)

**Datum:** 2026-06-10
**Reviewer:** review-it, 3 parallele Agenten (Logic / Security / Simplify)
**Scope:** commit `e825e3a`
**Verdikt:** CONDITIONAL → alle Befunde behoben in Folge-Commit

## Befunde

### Security — MAJOR (behoben)
Unvalidierte URL als `href` in `app/dashboard/wissen/page.tsx` (`f.quelle`, `r.notebookUrl`).
`f.quelle` stammt aus LLM-/Web-Recherche und floss über `vault.ts` ungeprüft ins Dashboard
(`javascript:`/`data:`-Schema möglich). **Fix:** Schema-Erzwingung beim Schreiben in
`appendFacts` (`^https?://`) + render-seitiger `safeHref`-Guard. Test ergänzt.
Produktions-Guard für die verschachtelte Route, E-Mail-Block, Pfade, Secrets: verifiziert sauber.

### Logic — MAJOR (behoben, Conf. 82)
`parseOpinionClusters` (`lib/dashboard/knowledge.ts`) extrahierte Einzelziffern
(`/[1-7]/g`), wodurch ein künftiger zweistelliger Header-Wert ("Cluster 12") fälschlich
Cluster 1+2 zählt. Latent (aktueller Pool ok). **Fix:** `\b([1-7])\b`. Test ergänzt.
Übrige geprüfte Stellen (appendFacts-Newline, seq/dedup, loadOpinion-Regex, isStale,
searchVault fresh/stale-Split, ensureSingleDisclosure) als korrekt bestätigt.

### Simplify — MINOR (behoben)
- `CLUSTER_NAMES` doppelt in den beiden NotebookLM-Skripten → ausgelagert nach
  `scripts/content-engine/lib/clusters.ts`, beide importieren es.
- Totes `today` in `notebooklm_plan.ts` entfernt.
- `appendFacts`-Append-Glue vereinfacht (redundanten zweiten `readFileSync` entfernt).

### Akzeptiert (nicht geändert)
- `lib/dashboard/overview.ts` behält eigene `CLUSTER_NAMES`-Kopie (Next-Seite, kein sauberer
  Import aus dem scripts-Baum) — bewusste Modulgrenze.
- Vorbestehende unescaped `sourcesList`-Interpolation in `reviewEmail.ts` (nur an Owner,
  außerhalb dieses Commits) — für späteren Pass vermerkt.

## Verifikation nach Fixes
tsc grün, 89/89 Tests grün, `next build` grün, `/dashboard/wissen` Browser-verifiziert.
