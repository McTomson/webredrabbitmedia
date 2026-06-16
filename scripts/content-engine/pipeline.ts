import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { ROOT, CE, readMemory, runClaude } from './lib/roles';
import { readKillSwitch } from './lib/killSwitch';
import { extractJsonBlock, extractMdxBlock } from './lib/extract';
import { verifySources, type Source } from './lib/verifySources';
import { validateFrontmatter } from './frontmatter';
import { buildImagePlan, generatePhoto, renderInfographic, heroPhotoStyle, pickHeroColorIndex } from './image';
import { loadVault, searchVault, formatVaultContext, appendFacts, type NewFactInput } from './lib/vault';

// ──────────────────────────────────────────────────────────────────────────
// Content-Engine orchestrator. Runs the 4-role newsroom headless (claude -p)
// and produces a validated draft MDX. dry-run: writes to .work/, no publish.
// Usage: tsx scripts/content-engine/pipeline.ts <slug-or-id> [--emit]
//   --emit  also writes the final MDX into content/blog/<slug>.mdx (status: draft)
// ──────────────────────────────────────────────────────────────────────────

interface Topic {
    id: number;
    frage: string;
    slug: string;
    cluster: number;
    byline: 'thomas' | 'dmitry';
    authorName: string;
}

const AUTHOR_NAME = { thomas: 'Thomas Uhlir MBA', dmitry: 'Dmitry Pashlov' } as const;

// Clean demo slugs override the auto-generated queue slug (kept readable / keyword-first).
const SLUG_OVERRIDE: Record<number, string> = {
    13: 'website-wartungsvertrag-sinnvoll',
    12: 'website-kosten-steuerlich-absetzbar-oesterreich',
    266: 'bfsg-barrierefreiheit-website-pflicht-strafen',
};

// Per-topic status overrides live in a small sidecar so queue.yaml (with its comments)
// stays the static backlog. status: todo | drafting | review | published.
function statusPath(): string {
    return path.join(CE, 'topics/status.json');
}
function readStatus(): Record<string, string> {
    try {
        return JSON.parse(fs.readFileSync(statusPath(), 'utf8'));
    } catch {
        return {};
    }
}
function setStatus(id: number, status: string): void {
    const s = readStatus();
    s[String(id)] = status;
    fs.writeFileSync(statusPath(), JSON.stringify(s, null, 2) + '\n');
}
function effectiveStatus(t: any, overrides: Record<string, string>): string {
    return overrides[String(t.id)] || t.status || 'todo';
}

function toTopic(t: any): Topic {
    const byline: 'thomas' | 'dmitry' = [2, 3].includes(t.cluster) ? 'dmitry' : 'thomas';
    return { id: t.id, frage: t.frage, slug: SLUG_OVERRIDE[t.id] || t.slug, cluster: t.cluster, byline, authorName: AUTHOR_NAME[byline] };
}

function loadTopic(key: string): Topic {
    const q = yaml.load(readMemory('topics/queue.yaml')) as any;
    const t = (q.topics as any[]).find((x) => String(x.id) === key || x.slug === key);
    if (!t) throw new Error(`Thema "${key}" nicht in queue.yaml gefunden`);
    return toTopic(t);
}

// Pick the next topic to write: status todo, pillar first, then by id. Demo topics first.
function selectNextTopic(): Topic {
    const q = yaml.load(readMemory('topics/queue.yaml')) as any;
    const overrides = readStatus();
    const candidates = (q.topics as any[])
        .filter((t) => effectiveStatus(t, overrides) === 'todo' && t.status !== 'covered')
        .sort((a, b) => Number(!!b.demo) - Number(!!a.demo) || Number(!!b.is_pillar) - Number(!!a.is_pillar) || a.id - b.id);
    if (!candidates.length) throw new Error('HALT: kein todo-Thema in der Queue (alles abgearbeitet?).');
    return toTopic(candidates[0]);
}

// Pull opinion-pool sections relevant to this topic: by topic id (e.g. "Thema 13") or by
// cluster (e.g. "Cluster 1"), so bundled per-cluster interview sessions also feed the writer.
function loadOpinion(t: Topic): string {
    const pool = readMemory('opinions/pool.md');
    const sections = pool.split(/\n## /).map((s, i) => (i === 0 ? s : '## ' + s));
    const byId = new RegExp(`Thema ${t.id}\\b`);
    const byCluster = new RegExp(`Cluster\\s*[^)]*\\b${t.cluster}\\b`);
    const hit = sections.filter((s) => byId.test(s) || byCluster.test(s));
    return hit.join('\n\n').trim();
}

function workDir(slug: string): string {
    const d = path.join(ROOT, 'scripts/content-engine/.work', slug);
    fs.mkdirSync(d, { recursive: true });
    return d;
}

function save(dir: string, name: string, data: string) {
    fs.writeFileSync(path.join(dir, name), data);
}

// ── Role prompt builders ────────────────────────────────────────────────────

// A chunk of real existing-article prose as a flow model for the writer (natural German).
function readArticleSample(): string {
    try {
        const raw = fs.readFileSync(path.join(ROOT, 'content/blog/website-selbst-erstellen-vs-agentur.mdx'), 'utf8');
        const body = matter(raw).content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '');
        return body.replace(/–/g, ',').trim().slice(0, 1800);
    } catch {
        return '(kein Vorbild verfuegbar)';
    }
}

// Query the local knowledge vault first (§3): hand the researcher our own verified facts so
// it cites those and only searches the web for the gaps. Empty string when the vault has no
// hit, so the prompt is unchanged in that case (purely additive, never blocks).
function vaultContextFor(t: Topic, today: string): string {
    const ctx = formatVaultContext(searchVault(loadVault(), t.frage, t.cluster, today));
    return ctx ? '\n--- WISSENS-VAULT (zuerst pruefen, dann Web fuer Luecken) ---\n' + ctx : '';
}

function researcherPrompt(t: Topic, vaultCtx: string): string {
    return [
        readMemory('roles/researcher.md'),
        '\n--- knowledge/sources.md ---\n',
        readMemory('knowledge/sources.md'),
        vaultCtx,
        '\n--- guardrails.md (Kurz) ---\nKeine erfundenen Quellen. Jede URL muss real und erreichbar sein. AT-Bezug bevorzugen.',
        'Vault-Treffer (oben) sind bereits verifiziert: bevorzugt als Beleg verwenden, NUR Luecken neu im Web recherchieren. Als VERALTET markierte Vault-Fakten vor Verwendung im Web neu bestaetigen.',
        `\n\n=== AUFGABE ===\nThema (Frage): "${t.frage}"\nCluster: ${t.cluster}. Markt: Oesterreich (AT), DACH.`,
        'Recherchiere 3-6 belegte, artikel-tragende Fakten mit ECHTEN, ueberpruefbaren Quellen (offizielle/seriose URLs bevorzugt).',
        'Gib AUSSCHLIESSLICH am Ende einen ```json Codeblock aus mit Schema:',
        '{"facts":[{"claim":"...","source":{"name":"...","url":"https://..."},"as_of":"YYYY-MM"}],"enough":true,"notes":"..."}',
        'enough=false nur wenn du weniger als 3 belegte Fakten findest. Keine Prosa nach dem JSON.',
    ].join('\n');
}

function writerPrompt(t: Topic, research: any, opinion: string): string {
    const facts = research.facts.map((f: any, i: number) => `(${i + 1}) ${f.claim}  [Quelle: ${f.source.name}]`).join('\n');
    return [
        readMemory('roles/writer.md'),
        '\n--- voice/house.md (DIE Stimme, vollstaendig befolgen) ---\n',
        readMemory('voice/house.md'),
        `\n--- voice/${t.byline}.md ---\n`,
        readMemory(`voice/${t.byline}.md`),
        '\n--- conventions.md (Body-Struktur) ---\n',
        readMemory('conventions.md'),
        '\n=== BELEGTE FAKTEN (nur diese verwenden, nichts dazu erfinden) ===\n' + facts,
        '\n=== THOMAS MEINUNG/AUFTRAG zu diesem Thema (echt, hieraus schoepfen) ===\n' + (opinion || '(keine spezifische Meinung hinterlegt, dann rein sachlich-quellen-basiert schreiben, keine Ich-Erfahrung erfinden)'),
        '\n--- LESEFLUSS-VORBILD (so soll es klingen, natuerliches Deutsch) ---\n',
        readArticleSample(),
        `\n=== AUFGABE ===\nSchreibe den ARTIKEL-BODY (Markdown, KEIN YAML-Frontmatter) zur Frage: "${t.frage}".`,
        'Register Sie. ZIELLAENGE 1700 bis 2200 Woerter. Direktantwort frueh (snippet-tauglich, 40-60 Woerter), dann echte Tiefe.',
        'SCHREIBSTIL (das Wichtigste): Schreibe in VOLLSTAENDIGEN, FLUESSIGEN, natuerlichen deutschen Saetzen wie im Lesefluss-Vorbild oben. KEINE abgehackten Fragmente, keine staccato-Ein-Wort-Saetze, kein gehetzter E-Mail-Rhythmus. Es muss klingen wie ein kluger Mensch, der sorgfaeltig schreibt. Analogien einfach und sofort verstaendlich (Vorbild: "ein Haus ist nicht fertig, nur weil man im Baumarkt eine Schaufel kauft"), NICHT technisch ueberladen oder unrealistisch. Tag-Frage "oder?" hoechstens 1-2 mal im ganzen Text. Lies jeden Satz laut, klingt er un-deutsch oder gestelzt, schreib ihn um.',
        'TIEFE statt Fuelltext: konkrete oesterreichische Beispiele und Mini-Szenarien, Unterfaelle, Rechenbeispiele mit Zahlen, ein "Schritt fuer Schritt was Sie konkret tun"-Teil, haeufige Irrtuemer/Fallen, je Abschnitt eine klare Empfehlung. Mehr Substanz, NICHT mehr Floskeln.',
        'HARTE REGEL: NIEMALS einen Gedankenstrich "–" verwenden (Komma/Punkt stattdessen). Keine Dreierfiguren, kein Marketing-Hochglanz, kein Geschwurbel zum Strecken.',
        'Genau eine H1 (==Titel), danach natuerliche Erst-Hand-Einleitung, 6 bis 8 H2-Abschnitte mit Substanz, mind. 1 interner Link auf /kontakt oder eine passende Seite, Key-Takeaways-Block, fairer CTA am Ende.',
        'Gib NUR den Markdown-Body in einem ```mdx Codeblock aus.',
    ].join('\n');
}

function editorPrompt(draftBody: string): string {
    return [
        readMemory('roles/editor.md'),
        '\n--- voice/house.md (NO-GOs) ---\n',
        readMemory('voice/house.md'),
        '\n=== ENTWURF (Body) ===\n' + draftBody,
        '\n=== AUFGABE ===\nWende die De-AI-Checkliste an. Entferne JEDEN Gedankenstrich "–". Brich Dreierfiguren und Hochglanz auf.',
        'Variiere Satzlaengen. Halte die Stimme (direkt, Sie, Tag-Frage "oder" sparsam).',
        'Gib den BEREINIGTEN Body in einem ```mdx Codeblock aus, danach einen ```json Codeblock {"flags":["..."]} mit etwaigen Risiko-Flags (price_claim, legal_claim, low_confidence, opinion_missing). Leere Liste wenn nichts.',
    ].join('\n');
}

// Kanonische Cluster -> category-Labels. Quelle der Wahrheit: content-engine/topics/queue.yaml `clusters:`.
const CLUSTER_CATEGORY: Record<number, string> = {
    1: 'Strategie & Kosten',
    2: 'Technik & Performance',
    3: 'KI & Automatisierung',
    4: 'SEO & GEO',
    5: 'Design & UX',
    6: 'Recht & Sicherheit',
    7: 'Wartung & Analyse',
};

function finalizerPrompt(t: Topic, body: string, sources: Source[], today: string, repairErrors?: string[]): string {
    const category = CLUSTER_CATEGORY[t.cluster] || 'Strategie & Kosten';
    return [
        readMemory('roles/finalizer.md'),
        '\n--- conventions.md (Frontmatter-Schema, EXAKT einhalten) ---\n',
        readMemory('conventions.md'),
        '\n--- knowledge/playbook.md §2 GEO/On-Page (anwenden: Antwort-Block, FAQ, Jahr im Titel, Quell-Links) ---\n',
        readMemory('knowledge/playbook.md'),
        '\n=== BEREINIGTER BODY ===\n' + body,
        '\n=== VERIFIZIERTE QUELLEN (genau diese als sources, URLs nicht aendern) ===\n' + JSON.stringify(sources, null, 2),
        `\n=== FIXE WERTE ===\nslug: ${t.slug}\nauthor: ${t.authorName}\npublishedAt/updatedAt: ${today}\nstatus: draft\naiAssisted: true\nfeaturedImage: /images/blog/${t.slug}.png\ncategory: "${category}"\ncluster: ${t.cluster}`,
        repairErrors && repairErrors.length
            ? '\n=== KORREKTUR NOETIG (vorheriger Output war invalide) ===\n' + repairErrors.join('\n') + '\nBehebe GENAU diese Fehler. Achte besonders auf: kein "–" irgendwo, valides Schema, customFAQs gesetzt.'
            : '',
        '\n=== AUFGABE ===\nErzeuge die VOLLSTAENDIGE MDX-Datei (YAML-Frontmatter nach Schema + Body).',
        'featuredSnippet = 40-60-Wort-Direktantwort, kein "–". keyTakeaways 4-5. customFAQs 4-5 (autoGenerateFAQs:false).',
        'KEINEN KI-Hinweis und keine "redaktionell geprueft"-Zeile anhaengen (vom Kunden ausdruecklich nicht gewuenscht).',
        'Gib NUR die fertige MDX in einem ```mdx Codeblock aus. KEIN Gedankenstrich "–" in keinem Feld.',
    ].join('\n');
}

// ── Orchestrate ─────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const key = args.find((a) => !a.startsWith('--'));
    const emit = args.includes('--emit');
    const useNext = args.includes('--next');
    if (!key && !useNext) throw new Error('Slug/ID oder --next angeben: tsx scripts/content-engine/pipeline.ts <slug-or-id|--next> [--emit]');

    // Kill-switch: when indexation dropped below threshold, do NOT publish onto a
    // possibly-penalised site. Only blocks --emit (dry runs stay allowed for testing).
    // Clear via `rm content-engine/.kill-switch.json` once the issue is resolved.
    if (emit) {
        const ks = readKillSwitch();
        if (ks.active) {
            console.log(`\nKILL-SWITCH AKTIV — Produktion pausiert: ${ks.reason || 'Indexierung unter Schwelle'}.`);
            console.log('   Tageslauf bricht ohne Veroeffentlichung ab. Nach Behebung: rm content-engine/.kill-switch.json');
            process.exit(0);
        }
    }

    const t = useNext ? selectNextTopic() : loadTopic(key!);
    const dir = workDir(t.slug);
    const today = new Date().toISOString().slice(0, 10);
    console.log(`\n=== Pipeline: #${t.id} "${t.frage}" -> ${t.slug} (byline: ${t.byline}) ===`);

    const reuse = args.includes('--reuse-research');
    let research: any;
    let sources: Source[];

    if (reuse && fs.existsSync(path.join(dir, 'sources.verified.json')) && fs.existsSync(path.join(dir, 'research.raw.txt'))) {
        // Reuse already-verified research (no re-research, same proven sources).
        console.log('1-2/5 Recherche WIEDERVERWENDET (bereits verifizierte Quellen) ...');
        research = extractJsonBlock(fs.readFileSync(path.join(dir, 'research.raw.txt'), 'utf8')) as any;
        sources = JSON.parse(fs.readFileSync(path.join(dir, 'sources.verified.json'), 'utf8'));
        const surviving = new Set(sources.map((s) => s.url));
        research.facts = research.facts.filter((f: any) => surviving.has(f.source.url));
    } else {
        // 1) Researcher (web) — vault-first: own verified facts injected, web fills gaps
        console.log('1/5 Researcher ...');
        const vaultCtx = vaultContextFor(t, today);
        if (vaultCtx) console.log('   Vault-Treffer injiziert (zuerst pruefen, dann Web).');
        const rOut = runClaude(researcherPrompt(t, vaultCtx), { web: true, timeoutSec: 600, label: 'researcher' });
        save(dir, 'research.raw.txt', rOut);
        research = extractJsonBlock(rOut) as any;
        if (!research.enough) throw new Error('HALT: Researcher meldet enough=false (zu wenig belegte Fakten). Kein halber Artikel.');

        // 2) Verify source URLs (no-hallucination gate)
        console.log(`2/5 Quellen verifizieren (${research.facts.length}) ...`);
        const rawSources: Source[] = research.facts.map((f: any) => f.source);
        const { kept, dropped } = await verifySources(rawSources);
        if (dropped.length) console.log('   verworfen (unerreichbar):', dropped.map((d) => `${d.url} [${d.code}]`).join(', '));
        sources = kept.filter((s, i) => kept.findIndex((k) => k.url === s.url) === i);
        if (sources.length < 1) throw new Error('HALT: keine verifizierbare Quelle uebrig (Guardrail 5).');
        save(dir, 'sources.verified.json', JSON.stringify(sources, null, 2));
        const survivingUrls = new Set(sources.map((s) => s.url));
        research.facts = research.facts.filter((f: any) => survivingUrls.has(f.source.url));
    }

    // Sanitize source names: research/web titles often contain en/em-dashes, which would
    // poison the frontmatter (Guardrail 8). URLs stay untouched, only the display name.
    const deDash = (n: string) => n.replace(/\s*[–—]\s*/g, ' - ');
    sources = sources.map((s) => ({ ...s, name: deDash(s.name) }));
    research.facts = research.facts.map((f: any) => ({ ...f, source: { ...f.source, name: deDash(f.source.name) } }));

    // 3) Writer
    const opinion = loadOpinion(t);
    console.log('3/5 Writer ...');
    const wOut = runClaude(writerPrompt(t, research, opinion), { timeoutSec: 480, label: 'writer' });
    save(dir, 'draft.raw.txt', wOut);
    const draftBody = extractMdxBlock(wOut);
    save(dir, 'draft.body.md', draftBody);

    // 4) Editor
    console.log('4/5 Editor ...');
    const eOut = runClaude(editorPrompt(draftBody), { timeoutSec: 480, label: 'editor' });
    save(dir, 'edited.raw.txt', eOut);
    const editedBody = extractMdxBlock(eOut);
    let flags: string[] = [];
    try {
        flags = (extractJsonBlock(eOut) as any).flags || [];
    } catch {
        /* flags optional */
    }
    save(dir, 'edited.body.md', editedBody);
    console.log('   flags:', flags.length ? flags.join(', ') : '(keine)');

    // 5) Finalizer (+ repair loop on validation)
    console.log('5/5 Finalizer ...');
    let mdx = '';
    let fm: any = null;
    let errors: string[] = [];
    for (let attempt = 1; attempt <= 3; attempt++) {
        const fOut = runClaude(finalizerPrompt(t, editedBody, sources, today, attempt > 1 ? errors : undefined), {
            // 600s: the finalizer is the heaviest role (full MDX assembly + outgoing links +
            // conclusionStats) and consistently exceeded the old 360s limit, which killed the
            // whole daily run via ETIMEDOUT (2026-06-12). Match the researcher's headroom.
            timeoutSec: 600,
            label: `finalizer (Versuch ${attempt})`,
        });
        save(dir, `final.attempt${attempt}.txt`, fOut);
        mdx = ensureSingleDisclosure(quoteFrontmatterDates(extractMdxBlock(fOut)));
        const parsed = matter(mdx);
        fm = parsed.data;
        const v = validateFrontmatter(fm);
        errors = v.errors;
        if (v.ok) break;
        console.log(`   Frontmatter invalide (Versuch ${attempt}):`, errors.slice(0, 4).join(' | '));
        if (attempt === 3) throw new Error('HALT: Frontmatter nach 3 Versuchen invalide:\n' + errors.join('\n'));
    }

    // Multi-image system: photoreal hero (featured) + sketch infographic + 3 contextual photos.
    if (!args.includes('--no-image')) {
        try {
            const headings = [...matter(mdx).content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
            const plan = buildImagePlan(fm.title, matter(mdx).content, headings);
            const heroPath = await generatePhoto(t.slug, 'hero', plan.heroConcept, 1200, 630, heroPhotoStyle(pickHeroColorIndex()));
            mdx = setHeroImage(mdx, t.slug, heroPath);
            let nCtx = 0;
            for (const item of plan.items) {
                let imgPath: string;
                let alt: string;
                if (item.kind === 'infographic' && item.data) {
                    imgPath = await renderInfographic(t.slug, item.data);
                    alt = item.data.title;
                } else if (item.kind === 'photo' && item.concept) {
                    imgPath = await generatePhoto(t.slug, `ctx${++nCtx}`, item.concept);
                    alt = item.concept;
                } else continue;
                mdx = insertImageAfterHeading(mdx, item.afterHeading, imgPath, alt);
            }
            console.log(`   Bilder: 1 Hero + ${plan.items.length} (Infografik + ${nCtx} Kontext)`);
        } catch (e: any) {
            console.log(`   WARN Bilder fehlgeschlagen (Artikel bleibt gueltig): ${e.message}`);
        }
    }

    // Hook-Kandidaten fuers Hero-Bild: 3 kurze, gesprochene Teaser nach den fixen Kriterien
    // (siehe .agent/workflows/bilder-gemini-browser.md). Landen im Frontmatter; die Review-Mail
    // zeigt sie, Thomas waehlt einen, der gewaehlte Hook kommt beim Bild-Schritt aufs Hero.
    try {
        const hooks = generateHooks(fm.title, fm.featuredSnippet || fm.excerpt || '');
        if (hooks.length) {
            mdx = injectHookCandidates(mdx, hooks);
            console.log(`   Hook-Vorschlaege: ${hooks.map((h) => `"${h}"`).join(' | ')}`);
        }
    } catch (e: any) {
        console.log(`   WARN Hook-Vorschlaege fehlgeschlagen (Artikel bleibt gueltig): ${e.message}`);
    }

    save(dir, 'final.mdx', mdx);
    console.log(`\nOK. Valide Draft-MDX -> scripts/content-engine/.work/${t.slug}/final.mdx`);
    console.log(`   Titel: ${fm.title}`);
    console.log(`   Quellen: ${sources.length} | Flags: ${flags.length ? flags.join(', ') : 'keine'} | Woerter: ${parsedWordCount(mdx)}`);

    if (emit) {
        const dest = path.join(ROOT, 'content/blog', `${t.slug}.mdx`);
        fs.writeFileSync(dest, mdx);
        setStatus(t.id, 'review'); // taken out of the todo pool, awaiting approval
        console.log(`   --emit: geschrieben nach content/blog/${t.slug}.mdx (status: draft, queue: review)`);

        // Backflow (§3): this article's verified facts become reusable vault knowledge.
        // The article's reviewed answer (featuredSnippet) is added separately on publish via
        // backfill_vault.ts; here we record the underlying research facts with their own sources.
        try {
            const kw = t.frage
                .toLowerCase()
                .replace(/[^a-zäöüß0-9 ]/g, ' ')
                .split(/\s+/)
                .filter((w) => w.length >= 4)
                .slice(0, 8);
            const newFacts: NewFactInput[] = research.facts.map((f: any) => ({
                cluster: t.cluster,
                keywords: kw,
                aussage: String(f.claim).replace(/\s+/g, ' ').trim(),
                quelle: f.source.url,
                quelleName: f.source.name,
            }));
            const { added, skipped } = appendFacts(newFacts, today, { idPrefix: `t${t.id}` });
            console.log(`   Vault-Rueckfluss: ${added} neue Fakten, ${skipped} schon vorhanden.`);
        } catch (e: any) {
            console.log(`   WARN Vault-Rueckfluss uebersprungen (Artikel bleibt gueltig): ${e.message}`);
        }
    }
}

// YAML parses an unquoted YYYY-MM-DD as a Date object. Quote date values so gray-matter
// keeps them as strings (matches the existing articles and the validator contract).
function quoteFrontmatterDates(mdx: string): string {
    return mdx.replace(/^(publishedAt|updatedAt):\s*(\d{4}-\d{2}-\d{2})\s*$/gm, '$1: "$2"');
}

// The customer does NOT want any AI-assistance disclosure ("KI-unterstuetzt ... redaktionell
// geprueft"). Strip any such line the model still emits. Pure legal disclaimers (e.g. "ersetzt
// keine Rechtsberatung") that do NOT mention KI are kept.
function ensureSingleDisclosure(mdx: string): string {
    const lines = mdx.split('\n').filter((l) => {
        const t = l.trim().replace(/^\*+|\*+$/g, '').trim();
        return !(/\bKI[- ]?unterst/i.test(t) || /mit KI-Unterst/i.test(t)) || !/redaktionell gepr/i.test(t);
    });
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// Generate up to 3 hook candidates for the hero image. Criteria (Thomas 2026-06-14, fixed in
// .agent/workflows/bilder-gemini-browser.md): 2-4 words, ~max 25 chars, sounds spoken (tag-question
// "oder?" ok), curiosity gap + a topic-anchor word so it works as a feed thumbnail without the
// title, lowercase, no em-dash, no glossy clickbait. One small LLM call; failure is non-fatal.
function generateHooks(title: string, snippet: string): string[] {
    const prompt = [
        'Du textest Hook-Zeilen fuer das Hero-Bild eines Blogartikels (Marke Red Rabbit, Webagentur Oesterreich).',
        'Erzeuge GENAU 3 verschiedene Hook-Vorschlaege nach diesen Kriterien:',
        '- KORREKTES, SINNVOLLES DEUTSCH: jeder Hook ist ein vollstaendiger, grammatisch richtiger, sinnvoller',
        '  deutscher Satz/Frage. KEINE Telegramm-Fragmente. Schlecht/kein Deutsch: "wie viel budget?".',
        '  Gut: "was darf meine website kosten?".',
        '- WICHTIGSTE REGEL: der Hook muss STANDALONE funktionieren. Das Bild taucht ohne den Artikel-Titel',
        '  im Internet auf (Feed, Google-Bildersuche, geteilt, YouTube-Thumbnail). Ein Fremder, der NUR den',
        '  Hook sieht, muss das Thema verstehen UND neugierig bleiben. Darum IMMER ein themenbenennendes',
        '  Substantiv aus dem Feld einbauen (website, relaunch, kosten, budget, hosting, ...).',
        '  Schlecht: "wie viel budget?" (welches Budget?). Gut: "website: wie viel budget?".',
        '- bis ca. 5-6 Woerter / max ca. 35 Zeichen, trotzdem in 1-2 Sekunden lesbar.',
        '- klingt gesprochen, wie es jemand wirklich sagt (Tag-Frage "oder?" erlaubt), nicht werblich.',
        '- macht neugierig (offene Frage oder Spannung), beantwortet NICHT schon alles.',
        '- kleingeschrieben. KEIN Gedankenstrich. Kein Hochglanz, kein Clickbait der am Thema vorbeigeht.',
        `\nThema/Titel: ${title}`,
        `Kernaussage: ${snippet}`,
        '\nGib NUR die 3 Hooks aus, je einer pro Zeile, ohne Nummerierung, ohne Anfuehrungszeichen.',
    ].join('\n');
    const out = runClaude(prompt, { timeoutSec: 90, label: 'hooks' });
    return out
        .split('\n')
        .map((l) => l.trim().replace(/^[-*\d.)\s]+/, '').replace(/^["']|["']$/g, '').replace(/[–—]/g, ',').trim())
        .filter((l) => l.length > 0 && l.length <= 40)
        .slice(0, 3);
}

// Append hookCandidates into the existing frontmatter block WITHOUT reserialising the rest
// (keeps the finalizer's exact YAML). Inserts before the closing '---' of the frontmatter.
function injectHookCandidates(mdx: string, hooks: string[]): string {
    if (!mdx.startsWith('---')) return mdx;
    const fmEnd = mdx.indexOf('\n---', 3);
    if (fmEnd < 0) return mdx;
    const block = '\nhookCandidates:\n' + hooks.map((h) => `  - ${JSON.stringify(h)}`).join('\n');
    return mdx.slice(0, fmEnd) + block + mdx.slice(fmEnd);
}

// Point featuredImage (frontmatter) and the inline placeholder at the real hero file.
function setHeroImage(mdx: string, slug: string, heroPath: string): string {
    const placeholder = new RegExp(`/images/blog/${slug}\\.png`, 'g');
    return mdx.replace(placeholder, heroPath);
}

// Insert an image right after the matching "## Heading" line (and its following blank line).
function insertImageAfterHeading(mdx: string, heading: string, imgPath: string, alt: string): string {
    const lines = mdx.split('\n');
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const target = norm(heading);
    for (let i = 0; i < lines.length; i++) {
        if (/^##\s+/.test(lines[i]) && norm(lines[i].replace(/^##\s+/, '')) === target) {
            const img = `\n![${alt.replace(/[[\]]/g, '')}](${imgPath})\n`;
            // insert after the heading line; skip an immediately following blank line
            const at = i + 1 < lines.length && lines[i + 1].trim() === '' ? i + 2 : i + 1;
            lines.splice(at, 0, img);
            return lines.join('\n');
        }
    }
    return mdx; // heading not found, skip silently
}

function parsedWordCount(mdx: string): number {
    const body = matter(mdx).content;
    return body.split(/\s+/).filter(Boolean).length;
}

main().catch((e) => {
    console.error('\nPIPELINE-FEHLER:', e.message);
    process.exit(1);
});
