import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { ROOT, CE, readMemory, runClaude } from './lib/roles';
import { extractJsonBlock, extractMdxBlock } from './lib/extract';
import { verifySources, type Source } from './lib/verifySources';
import { validateFrontmatter } from './frontmatter';
import { buildImageConcept, generateImage } from './image';

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

// Pull opinion-pool sections that reference this topic id (e.g. "Thema 13").
function loadOpinion(topicId: number): string {
    const pool = readMemory('opinions/pool.md');
    const sections = pool.split(/\n## /).map((s, i) => (i === 0 ? s : '## ' + s));
    const hit = sections.filter((s) => new RegExp(`Thema ${topicId}\\b`).test(s));
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

function researcherPrompt(t: Topic): string {
    return [
        readMemory('roles/researcher.md'),
        '\n--- knowledge/sources.md ---\n',
        readMemory('knowledge/sources.md'),
        '\n--- guardrails.md (Kurz) ---\nKeine erfundenen Quellen. Jede URL muss real und erreichbar sein. AT-Bezug bevorzugen.',
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

function finalizerPrompt(t: Topic, body: string, sources: Source[], today: string, repairErrors?: string[]): string {
    return [
        readMemory('roles/finalizer.md'),
        '\n--- conventions.md (Frontmatter-Schema, EXAKT einhalten) ---\n',
        readMemory('conventions.md'),
        '\n=== BEREINIGTER BODY ===\n' + body,
        '\n=== VERIFIZIERTE QUELLEN (genau diese als sources, URLs nicht aendern) ===\n' + JSON.stringify(sources, null, 2),
        `\n=== FIXE WERTE ===\nslug: ${t.slug}\nauthor: ${t.authorName}\npublishedAt/updatedAt: ${today}\nstatus: draft\naiAssisted: true\nfeaturedImage: /images/blog/${t.slug}.png\ncategory: passend zum Cluster ${t.cluster}`,
        repairErrors && repairErrors.length
            ? '\n=== KORREKTUR NOETIG (vorheriger Output war invalide) ===\n' + repairErrors.join('\n') + '\nBehebe GENAU diese Fehler. Achte besonders auf: kein "–" irgendwo, valides Schema, customFAQs gesetzt.'
            : '',
        '\n=== AUFGABE ===\nErzeuge die VOLLSTAENDIGE MDX-Datei (YAML-Frontmatter nach Schema + Body).',
        'featuredSnippet = 40-60-Wort-Direktantwort, kein "–". keyTakeaways 4-5. customFAQs 4-5 (autoGenerateFAQs:false).',
        'Fuege am Body-Ende eine Zeile hinzu: "Dieser Artikel wurde KI-unterstuetzt erstellt und redaktionell geprueft."',
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
        // 1) Researcher (web)
        console.log('1/5 Researcher ...');
        const rOut = runClaude(researcherPrompt(t), { web: true, timeoutSec: 320, label: 'researcher' });
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
    const opinion = loadOpinion(t.id);
    console.log('3/5 Writer ...');
    const wOut = runClaude(writerPrompt(t, research, opinion), { timeoutSec: 320, label: 'writer' });
    save(dir, 'draft.raw.txt', wOut);
    const draftBody = extractMdxBlock(wOut);
    save(dir, 'draft.body.md', draftBody);

    // 4) Editor
    console.log('4/5 Editor ...');
    const eOut = runClaude(editorPrompt(draftBody), { timeoutSec: 240, label: 'editor' });
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
            timeoutSec: 240,
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

    save(dir, 'final.mdx', mdx);
    console.log(`\nOK. Valide Draft-MDX -> scripts/content-engine/.work/${t.slug}/final.mdx`);
    console.log(`   Titel: ${fm.title}`);
    console.log(`   Quellen: ${sources.length} | Flags: ${flags.length ? flags.join(', ') : 'keine'} | Woerter: ${parsedWordCount(mdx)}`);

    // Image (codex imagegen + sharp), unless skipped. Concept derived from the article text.
    if (!args.includes('--no-image')) {
        try {
            const concept = buildImageConcept(fm.title, matter(mdx).content);
            console.log(`   Bildmotiv: ${concept}`);
            await generateImage(t.slug, concept);
        } catch (e: any) {
            console.log(`   WARN Bild fehlgeschlagen (Artikel bleibt gueltig): ${e.message}`);
        }
    }

    if (emit) {
        const dest = path.join(ROOT, 'content/blog', `${t.slug}.mdx`);
        fs.writeFileSync(dest, mdx);
        setStatus(t.id, 'review'); // taken out of the todo pool, awaiting approval
        console.log(`   --emit: geschrieben nach content/blog/${t.slug}.mdx (status: draft, queue: review)`);
    }
}

// YAML parses an unquoted YYYY-MM-DD as a Date object. Quote date values so gray-matter
// keeps them as strings (matches the existing articles and the validator contract).
function quoteFrontmatterDates(mdx: string): string {
    return mdx.replace(/^(publishedAt|updatedAt):\s*(\d{4}-\d{2}-\d{2})\s*$/gm, '$1: "$2"');
}

// The finalizer is told to add an AI-label line, but the body sometimes already contains
// a nicer disclosure. Keep exactly one (drop the trailing plain line if a richer one exists).
const PLAIN_DISCLOSURE = 'Dieser Artikel wurde KI-unterstuetzt erstellt und redaktionell geprueft.';
function ensureSingleDisclosure(mdx: string): string {
    const count = (mdx.match(/redaktionell gepr/gi) || []).length;
    if (count > 1) {
        const esc = PLAIN_DISCLOSURE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return mdx.replace(new RegExp('\\n+' + esc + '\\s*$'), '\n').trimEnd() + '\n';
    }
    return mdx;
}

function parsedWordCount(mdx: string): number {
    const body = matter(mdx).content;
    return body.split(/\s+/).filter(Boolean).length;
}

main().catch((e) => {
    console.error('\nPIPELINE-FEHLER:', e.message);
    process.exit(1);
});
