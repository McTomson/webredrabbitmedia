# Review — Content-Engine v2 Phase 0 (uncommitted, 2026-06-10)

**Reviewer**: review-it Skill, 3 parallele Agenten (Logic / Security / Simplify) + claude-code-guide (Prompt-Caching-Verifikation)
**Stack**: ui (tsx), service (content-engine ts), content (mdx), config
**Domain**: llm, seo
**Verdict**: GO (kein CRITICAL). 3 MAJOR + 3 MINOR, alle adressiert.

## Findings — Accepted + gefixt
- MAJOR (Logic) gate.ts/review-notify Risk-Routing: tote Eintraege "Steuer"/"Compliance" nach Label-Normalisierung. FIX: cluster===6 als robuster Trigger + Wort-Fallback (`HIGH_RISK_CATEGORY_WORDS`), in gate.ts + app/api/review-notify/route.ts.
- MAJOR (Logic) Alt-Text-Fallback konnte leer werden bei leerem afterHeading. FIX: images-only.ts Kette `alt || afterHeading || concept || 'Illustration zum Abschnitt'`.
- MAJOR (Simplify) lib/blog/types.ts war tote 3. Kopie der Cluster-Liste (nie importiert). FIX: geloescht (Option A), posts.ts-Kommentar auf queue.yaml umgebogen. SoT = queue.yaml (Autoritaet) + pipeline.ts CLUSTER_CATEGORY (Erzeuger).
- MINOR (Logic) page.tsx nutzte Inline-Related-Logik, getRelatedPosts (cluster-Scoring) lief ins Leere. FIX: page.tsx ruft jetzt getRelatedPosts(slug,2).
- MINOR (Security) Quellen-URLs nicht auf http(s) beschraenkt (javascript:/data:). FIX: frontmatter.ts sourceSchema .refine(http(s)) + ArticleSources.tsx render-seitiger Guard (nicht-http → nur Text).

## Findings — No-Action (begruendet)
- MINOR (Logic) JSON-LD `citation` ist kein Standard-BlogPosting-Property → harmlos, DOM-Anzeige (ArticleSources) ist der echte E-E-A-T/GEO-Nutzen. Belassen.
- COSMETIC (Simplify) Validierungs-Asymmetrie Generator/Reader → mit types.ts-Loeschung gegenstandslos.
- Vorbestehend: `parsed.data as any` (images-only.ts:51) eslint-Error, NICHT durch diesen Diff verursacht, keine Typ-Kaskade losgetreten. Belassen.

## Verifikation
tsc --noEmit grün; vitest 48/48 grün; `next build` grün (alle /tipps + Regio-Seiten prerendered); eslint changed files clean (ausser vorbestehendem `any`).

## Verworfen ausserhalb Review
- Prompt-Caching in roles.ts: verifiziert (claude-code-guide) dass `claude -p` ueber getrennte Prozesse kein Caching nutzt. Nur per Agent-SDK-Portierung moeglich = destabilisierend. Status quo, erst messen.

## Offen (Phase 0)
- Slug-Hygiene: 37 abgeschnittene Slugs in queue.yaml + ~4 published. Braucht 301-Redirects (next.config.ts redirects() Pattern existiert) + vorsichtige Renames der Live-Artikel. Separat angehen.
