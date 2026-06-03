# conventions.md — Schemata, Benennung, Handoff, Commit

Verbindlich für finalizer + orchestrator. Quelle der Wahrheit fürs Frontmatter ist das
`BlogPost`-Interface in `lib/blog/posts.ts` und der Validator `scripts/content-engine/frontmatter.ts`.

## MDX-Frontmatter-Schema (Output-Pflicht des finalizer)
Datei: `content/blog/<slug>.mdx`. YAML-Frontmatter, dann MDX-Body.

| Feld | Pflicht | Typ | Hinweis |
|---|---|---|---|
| `title` | ja | string | Mit Fokus-Keyword, gern Klammer-Zusatz wie `[... Österreich 2026]`. Kein "–". |
| `slug` | ja | string | == Dateiname ohne `.mdx`. Kebab-case, ascii. |
| `excerpt` | ja | string | 1-2 Sätze, Fokus-Keyword natürlich. Kein "–". |
| `featuredSnippetTitle` | empfohlen | string | Die exakte Nutzerfrage. |
| `featuredSnippet` | ja | string | **Die 40-60-Wort-Direktantwort** (LLM/GEO + Featured Snippet). Antwort ZUERST, eigenständig zitierbar. Kein "–". |
| `author` | ja | string | "Thomas Uhlir MBA" oder "Dmitry Pashlov" (real, siehe `voice/`). |
| `publishedAt` | ja | `YYYY-MM-DD` | Lauf-Datum. |
| `updatedAt` | ja | `YYYY-MM-DD` | == publishedAt beim Erstlauf. |
| `category` | ja | string | Cluster-Label (z.B. "Kosten", "Recht", "Wartung", "SEO", "Technik", "Design", "KI"). |
| `tags` | ja | string[] | 3-6, inkl. Geo wo passend. |
| `featuredImage` | ja | string | `/images/blog/<slug>.png`. 1200x630. |
| `status` | ja | `draft` \| `published` | NEU (Phase 3). Default `draft`. Nur `published` wird gebaut/indexiert. |
| `sources` | ja (>=1) | {name,url}[] | Echte, erreichbare Quellen. Guardrail 4/5. |
| `keyTakeaways` | ja | string[] | 4-5 knackige Mitnahmen. Kein "–". |
| `conclusionStats` | optional | {label,value}[] | Nur mit belegten Zahlen. |
| `autoGenerateFAQs` | ja | bool | `false` wenn `customFAQs` gesetzt. |
| `customFAQs` | ja | {question,answer}[] | 4-5 echte Fragen (PAA-Stil), füttern FAQPage-Schema. Kein "–". |

`aiAssisted: true` als zusätzliches Frontmatter-Feld (On-Page-AI-Label, Phase 3 verdrahtet die Anzeige).

## Body-Struktur (siehe `voice/house.md` Archetyp A/B)
- Genau **eine** H1 (== title). Danach Erst-Hand-Intro (2-3 kurze Absätze).
- **Antwort zuerst** (Snippet-Block / kurze Direktantwort), dann Tiefe.
- H2 alle ~200-300 Wörter, Fokus-Keyword natürlich in erster H2 + erstem Absatz (SEO-Leitfaden).
- Mind. 1 interner Link auf passende bestehende Seite (`/kontakt`, passende `/tipps/...`, Service-Seite).
- 1 Bild mit beschreibendem Alt-Text (Geo wo passend).
- TL;DR / Key-Takeaways + faire CTA am Ende. AI-Hinweis-Zeile im Footer.
- Optional Podcast-Player direkt nach Frontmatter (Phase 4): `<SimpleAudioPlayer src="/api/audio-proxy?url=..." title="..." />`.
- Zielwortzahl 1000-1800 (Blogpost, SEO-Leitfaden), >=500 unique Wörter Pflicht (Gate).

## Slug-/Datei-Benennung
- Slug aus der Frage, kebab-case, ohne Stoppwort-Ballast, Fokus-Keyword vorn.
  Bsp: Frage "Sind die Kosten für eine Website steuerlich absetzbar?" -> `website-kosten-steuerlich-absetzbar-oesterreich`.
- Bild: `/public/images/blog/<slug>.png` (+ optional `<slug>-<abschnitt>.png` für Inline-Bilder).

## Handoff-Format zwischen Rollen (Artefakt-Kette)
Jede Rolle liest das Artefakt der Vorgängerin und schreibt ihr eigenes nach
`scripts/content-engine/.work/<slug>/`. Ein gemeinsames JSON wächst mit:

```json
{
  "topic": { "frage": "...", "slug": "...", "cluster": "...", "byline": "thomas|dmitry", "is_pillar": false },
  "research": { "facts": [ {"claim":"...","source":{"name":"...","url":"..."}} ], "enough": true, "notes": "..." },
  "opinion": { "used_ids": ["..."], "text": "..." },
  "draft_md": "# ...\n...",
  "frontmatter": { /* Schema oben */ },
  "flags": [ "price_claim", "legal_claim", "low_confidence" ]
}
```
- `research.enough=false` -> Orchestrator hält (Guardrail 5).
- `flags` steuern später das Risk-Routing in `gate.ts`.

## Commit-Stil
Conventional Commits, englisch. Beispiele:
- `feat(content-engine): add researcher role`
- `feat(blog): publish <slug>`
- `chore(engine): ...`
Trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
