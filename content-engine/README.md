# content-engine/ — Manifest (jeder Agent liest das ZUERST)

Das ist das datei-basierte Gedächtnis und der geteilte Zustand der Red-Rabbit-Content-Engine.
Kein Code, nur Wissen + Koordination. Der Orchestrator (`scripts/content-engine/pipeline.ts`)
und jede LLM-Rolle liest aus diesem Verzeichnis und schreibt definierte Artefakte zurück.

## Nordstern
Eine Agentur ersetzen: täglich/qualitätsgesteuert EIN exzellenter, menschlich klingender,
quellen-gestützter "Tipps"-Artikel zu real gesuchten Fragen. KPIs: Indexierung -> Klicks -> Leads.
Lieber kein Artikel als ein schlechter. Authentische Stimme schlägt Menge.

## Lese-Reihenfolge für jede Rolle
1. `README.md` (diese Datei) — Überblick + wo liegt was.
2. `guardrails.md` — harte Verbote. Bei Konflikt gewinnt immer die strengere Guardrail.
3. `conventions.md` — MDX-Frontmatter-Schema, Datei-/Slug-Benennung, Handoff-Format, Commit-Stil.
4. Die eigene Rollen-Datei in `roles/`.
5. Themen-/Stil-/Meinungs-Input je nach Rolle (siehe unten).

## Verzeichnis-Landkarte
| Pfad | Inhalt | Wer nutzt es |
|---|---|---|
| `guardrails.md` | Nordstern + harte Verbote | ALLE |
| `conventions.md` | MDX-Schema, Benennung, Handoff-JSON, Commit | finalizer, orchestrator |
| `roles/researcher.md` | Fakten + echte Quellen sammeln | researcher |
| `roles/writer.md` | Entwurf im Hausstil + Meinungs-Inject | writer |
| `roles/editor.md` | De-AI-Check + Guardrail-Durchsetzung | editor |
| `roles/finalizer.md` | valides Frontmatter, interne Links, GEO-Bausteine | finalizer |
| `voice/house.md` | DIE Stimme (Thomas' echter Stil, Register Sie, kein "–") | writer, editor |
| `voice/thomas.md`, `voice/dmitry.md` | Byline-Zuordnung (Identität aus `lib/config.ts`) | writer, finalizer |
| `opinions/pool.md` | rohe echte Meinungen von Thomas (verbraucht markiert) | writer |
| `knowledge/sources.md` | erlaubte/bevorzugte Quellen + Tabus | researcher |
| `knowledge/data-assets/` | eigene recherchierte Daten-Assets (Differenzierung) | researcher, writer |
| `topics/queue.yaml` | 365 Themen + Status + Cluster + Pillar + Winnability | orchestrator |
| `lessons.md` | gelernte Regeln aus Freigabe-Korrekturen (wächst) | ALLE, kuratiert |
| `performance/` | GSC-/Baseline-Snapshots, Headless-Spike-Messung | orchestrator, monitoring |

## Pipeline in einem Satz
orchestrator wählt Thema aus `queue.yaml` -> researcher -> writer -> editor -> finalizer
-> `gate.ts` (Quality+Risk) -> Bild -> risk-based Email-Freigabe ODER Auto-Publish ->
git push -> Vercel -> IndexNow/GSC. Medien (Podcast/Video) laufen entkoppelt nach.

## Status-Quelle der Wahrheit
`topics/queue.yaml` ist der einzige Statusspeicher (todo/drafting/review/published).
Ein Slug, der dort `published` ist, wird nie ein zweites Mal publiziert (Idempotenz).
