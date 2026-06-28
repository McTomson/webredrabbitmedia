import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { ROOT, runClaude } from './lib/roles';
import { extractJsonBlock } from './lib/extract';
import { renderInfographicPng, type SketchData } from './image/sketchInfographic';

// Image system (confirmed with Thomas 2026-06): per article 1 photoreal hero + 1 hand-drawn
// sketch infographic + 3 photoreal contextual images, each tied to a section. Photos via
// Codex imagegen (0 EUR, ChatGPT Plus, NO legible text); infographic via SVG (crisp text).
// Filenames are versioned to bust Vercel's immutable image cache.

// Shared photographic art direction so hero + context images look cohesive.
export const BRAND_PHOTO_STYLE =
    'Photorealistic, authentic editorial photograph. Natural daylight, warm muted documentary color palette, ' +
    'one subtle red accent object in frame (around #E2231A). Real, relatable Austrian people and settings, ' +
    'candid and honest, NOT a posed cheesy stock smile. Shallow depth of field. ' +
    'The scene must depict a real, plausible everyday situation that makes immediate logical sense and looks ' +
    'aesthetically pleasing; absolutely no surreal, abstract or impossible arrangements, and no random objects ' +
    'staged on a surface as a metaphor. ' +
    'No text, no words, no letters, no readable screen content anywhere. 16:9 wide.';

// Hero-specific art direction (Thomas, 2026-06-14): the hero subject stays the same authentic
// editorial person/scene as the context photos, but the BACKGROUND is replaced by a smooth,
// friendly horizontal colour gradient that blends turquoise into a matching blue. No real
// location behind the subject, no red accent here (would clash with the cool gradient).
// NOTE: this Codex path is now the FALLBACK only. Primary image generation is Gemini-in-browser
// (gratis, adds the handwritten hook the brand wants) per .agent/workflows/bilder-gemini-browser.md.
// This style intentionally has no hook text (Codex avoids legible text).
export const HERO_PHOTO_STYLE =
    'Photorealistic, authentic editorial portrait. A real, relatable Austrian person in the foreground, ' +
    'candid and honest, upper body, naturally doing something related to the topic, NOT a posed cheesy stock smile. ' +
    'Soft, even studio lighting, shallow depth of field on the subject. ' +
    'The BACKGROUND is NOT a real location: it is a clean, smooth HORIZONTAL colour gradient that blends ' +
    'turquoise (about #19B5AE) on the left seamlessly and harmoniously into a matching friendly blue ' +
    '(about #2E6FD2) on the right. The two colours flow softly into each other, warm and welcoming, ' +
    'no hard edge, no banding. No text, no words, no letters, no logos, no readable screen content anywhere. 16:9 wide.';

// Hero background gradient ROTATES per article (Thomas 2026-06-16) so the feed/blog does not look
// monochrome over time and we can later measure which palette performs. The subject art-direction
// stays the same authentic editorial style; only the two gradient colours change.
// Rotation order (Thomas 2026-06-28): Gelb -> Gruen -> Blau -> Orange -> Rot, then repeat.
// name.split('-')[0] feeds heroPhotoStyle() as the spoken left-colour word, so keep the first
// token a clean colour name. The blue slot keeps the proven turquoise->blue brand look.
const HERO_GRADIENTS: Array<{ name: string; left: string; right: string }> = [
    { name: 'yellow-amber', left: '#F7C948', right: '#E8951C' },
    { name: 'green-emerald', left: '#2FB457', right: '#1E8E4E' },
    { name: 'turquoise-blue', left: '#19B5AE', right: '#2E6FD2' },
    { name: 'orange-tangerine', left: '#FF9E40', right: '#F2660A' },
    { name: 'red-coral', left: '#F2585B', right: '#D32F3A' },
];
export function heroPhotoStyle(idx: number): string {
    const g = HERO_GRADIENTS[((idx % HERO_GRADIENTS.length) + HERO_GRADIENTS.length) % HERO_GRADIENTS.length];
    return HERO_PHOTO_STYLE.replace(
        'turquoise (about #19B5AE) on the left seamlessly and harmoniously into a matching friendly blue (about #2E6FD2) on the right',
        `${g.name.split('-')[0]} (about ${g.left}) on the left seamlessly and harmoniously into ${g.right} on the right`,
    );
}
// Advance the hero gradient by exactly one per article and persist the cursor.
// (Bug fixed 2026-06-28: the old formula `heroes.length % N` was permanently stuck because
// recordMotif caps `heroes` at 12 entries -> 12 % 4 == 0 forever -> always the same colour.
// A dedicated UNBOUNDED cursor rotates reliably.) Called once per article at plan time and the
// result is pinned to gemini-meta.json, so reruns do not advance it twice.
export function pickHeroColorIndex(): number {
    const log = readMotifLog();
    const cur = log.colorCursor || 0;
    writeMotifLog({ ...log, colorCursor: cur + 1 });
    return cur % HERO_GRADIENTS.length;
}

export interface ImagePlanItem {
    kind: 'infographic' | 'photo';
    afterHeading: string; // exact H2 text to insert the image after
    concept?: string; // for photo: ENGLISH scene prompt for the image generator
    alt?: string; // for photo: GERMAN descriptive alt text (SEO + a11y), NOT the English concept
    data?: SketchData; // for infographic
}
export interface ImagePlan {
    heroConcept: string;
    items: ImagePlanItem[];
}

const PLAN_SCHEMA = `{
  "heroConcept": "<englischer Satz: NUR die Person/das Motiv im VORDERGRUND zum Kernthema (Mensch ok), KEINE Umgebung/Location beschreiben (der Hintergrund wird separat als Farbverlauf gesetzt), KEIN Text>",
  "items": [
    { "kind":"infographic", "afterHeading":"<exakte H2-Ueberschrift aus dem Artikel>", "data": {
        "layout":"comparison", "title":"<dt. Titel>", "subtitle":"<dt.>",
        "left":{"heading":"<dt.>","sub":"<dt.>","items":["<dt.>","..."],"verdict":"<dt.>","tone":"good"},
        "right":{"heading":"<dt.>","sub":"<dt.>","items":["..."],"verdict":"<dt.>","tone":"bad"},
        "footer":"<dt. Faustregel>" } },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene zum Absatz>", "alt":"<dt. beschreibender Alt-Text: was zeigt das Bild, mit Thema-Keyword, KEIN engl. Prompt>" },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene>", "alt":"<dt. Alt-Text mit Keyword>" },
    { "kind":"photo", "afterHeading":"<exakte H2>", "concept":"<engl. Szene>", "alt":"<dt. Alt-Text mit Keyword>" }
  ]
}`;

// Cross-article variety memory (Thomas 2026-06-16): without this, every cost-themed article kept
// landing on the same "person at a laptop reviewing paper" motif and the same 2-column infographic.
// We persist the last ~12 hero concepts + infographic layouts and feed them back so the art-director
// actively avoids repeating itself. So the variation is measurable later (what readers respond to).
const MOTIF_LOG = path.join(ROOT, 'content-engine', 'knowledge', 'recent-image-motifs.json');
interface MotifLog { heroes: string[]; layouts: string[]; colorCursor: number }
function readMotifLog(): MotifLog {
    try { const m = JSON.parse(fs.readFileSync(MOTIF_LOG, 'utf8')); return { heroes: m.heroes || [], layouts: m.layouts || [], colorCursor: m.colorCursor || 0 }; }
    catch { return { heroes: [], layouts: [], colorCursor: 0 }; }
}
function writeMotifLog(log: MotifLog): void {
    try { fs.mkdirSync(path.dirname(MOTIF_LOG), { recursive: true }); fs.writeFileSync(MOTIF_LOG, JSON.stringify(log, null, 2)); } catch { /* best-effort */ }
}
function recordMotif(heroConcept: string, layout?: string): void {
    const log = readMotifLog();
    log.heroes = [heroConcept, ...log.heroes].slice(0, 12);
    if (layout) log.layouts = [layout, ...log.layouts].slice(0, 12);
    writeMotifLog(log); // preserves colorCursor
}

// Art-director: reads the article, returns the full image plan as JSON. Each image is derived from the
// content of the SECTION it sits in, archetypes are varied (so not every article looks the same), and
// recently-used motifs are avoided.
export function buildImagePlan(title: string, body: string, headings: string[]): ImagePlan {
    const recent = readMotifLog();
    const prompt = [
        'Du bist Art-Director fuer einen oesterreichischen Webagentur-Blog (Marke Red Rabbit, Akzent Rot).',
        'Plane 5 Bilder fuer den Artikel: 1 Hero-Foto + 1 Sketch-Infografik + 3 Kontext-Fotos.',
        'OBERSTE REGEL (Thomas): die Bilder eines Artikels duerfen NICHT alle gleich aussehen, und ueber',
        'Artikel hinweg soll sich das Motiv DREHEN. Jedes Foto wird aus dem KONKRETEN Inhalt SEINER Sektion',
        'abgeleitet - lies den Absatz und zeige eine Szene, die genau diesen Punkt illustriert (nicht generisch).',
        'REALISMUS-PFLICHT (Thomas 2026-06-28, WICHTIGSTE BILDREGEL): Jedes Foto zeigt eine REALE, alltaegliche,',
        'sofort verstaendliche Situation aus dem echten (oesterreichischen) Geschaeftsleben. STRENG VERBOTEN sind',
        'abstrakte Metaphern und symbolische Objekt-Arrangements: KEINE zufaellig auf Tisch/Boden drapierten',
        'Gegenstaende (Lego, Werkzeug, Holzkloetze, Modellhaeuser, Bauplaene als Stillleben), KEINE surrealen oder',
        'unmoeglichen Kompositionen, KEIN "Objekte die etwas symbolisieren". Wenn ein Punkt nur als Metapher',
        'funktioniert, zeige stattdessen eine konkrete Szene mit echten Menschen, die genau diese Situation erleben.',
        'Das Bild muss logisch und aesthetisch ansprechend sein - so wie ein gutes redaktionelles Magazinfoto.',
        'ARCHETYPEN VARIIEREN (innerhalb des Realismus): nutze ueber die 4 Fotos BEWUSST VERSCHIEDENE, aber immer',
        'REALE Bild-Typen, mische aus: (a) eine Person bei genau der Taetigkeit der Sektion (variiere Geschlecht,',
        'Alter, Setting), (b) zwei Menschen im Gespraech (Kunde+Beraterin, Team), (c) echter Ort/Umgebung',
        '(Buero, Werkstatt, Geschaeft, Zuhause, Cafe) in dem das Thema real spielt, (d) ehrliche Detail-Nahaufnahme',
        'einer realen Handlung (Haende bei einer konkreten Taetigkeit - NICHT ein arrangiertes Objekt-Stillleben).',
        'HOECHSTENS EIN Bild zeigt eine Person an Laptop/Schreibtisch - nur wenn die Sektion es wirklich verlangt.',
        'Variiere Perspektive (nah/weit) und Setting, aber immer plausibel und realistisch.',
        'FOTOS: authentische, photorealistische, gut komponierte redaktionelle Szenen, KEIN Text/Logo im Bild.',
        'HERO: beschreibe NUR das Motiv im Vordergrund - bevorzugt EINE reale, sympathische Person (Oberkoerper),',
        'die etwas Konkretes zum Thema tut; KEINE Umgebung/Location/Wand (der Hintergrund wird separat als weicher',
        'Farbverlauf gesetzt), und KEIN abstraktes Objekt-Stillleben. Der Hero soll das Artikel-Thema sofort',
        'erkennbar machen (Standalone, da das Bild auch ohne Titel im Feed/Bildersuche auftaucht).',
        recent.heroes.length ? 'VERMEIDE diese zuletzt genutzten Hero-Motive (nimm etwas anderes):\n- ' + recent.heroes.join('\n- ') : '',
        'KONTEXT (3 Fotos): jeweils passend zu genau einer H2-Sektion, je ein ANDERER Archetyp (s.o.).',
        'ALT-TEXT: jedes Kontextfoto braucht zusaetzlich "alt" = ein deutscher, beschreibender Alt-Text fuer SEO und Barrierefreiheit (was ist konkret zu sehen, mit einem Thema-Keyword), NICHT der englische Generierungs-Prompt.',
        'INFOGRAFIK: die zentrale Aussage/der Kernvergleich des Artikels als Daten. WAEHLE das Layout passend',
        'zum Inhalt UND moeglichst anders als zuletzt: "comparison" (zwei Spalten gut/schlecht) ODER "keypoints"',
        '(3-5 Kernfakten, dann statt left/right ein Feld "points":[{"big":"JA","text":"..."},{"text":"..."}]).',
        recent.layouts.length ? 'Zuletzt genutzte Layouts (nimm moeglichst ein anderes): ' + recent.layouts.slice(0, 3).join(', ') : '',
        'tone good=gruen, bad=rot, neutral.',
        'Die 4 "afterHeading"-Werte muessen EXAKT vorhandene H2-Ueberschriften sein, jede nur einmal, gut ueber den Artikel verteilt.',
        '\nVerfuegbare H2-Ueberschriften:\n' + headings.map((h) => '- ' + h).join('\n'),
        '\nTITEL: ' + title,
        '\nARTIKEL:\n' + body.slice(0, 6000),
        '\nGib AUSSCHLIESSLICH einen ```json Codeblock im Schema aus:\n' + PLAN_SCHEMA,
    ].filter(Boolean).join('\n');
    const out = runClaude(prompt, { timeoutSec: 150, label: 'art-director' });
    const plan = extractJsonBlock(out) as ImagePlan;
    const infoLayout = plan.items?.find((i) => i.kind === 'infographic')?.data?.layout;
    recordMotif(plan.heroConcept, infoLayout);
    return plan;
}

const version = () => Date.now().toString(36).slice(-5);

function blogDir(): string {
    const d = path.join(ROOT, 'public/images/blog');
    fs.mkdirSync(d, { recursive: true });
    return d;
}

// Generate a photoreal image via Codex, crop to size, strip metadata, versioned filename.
export async function generatePhoto(slug: string, tag: string, concept: string, w = 1200, h = 675, style = BRAND_PHOTO_STYLE): Promise<string> {
    const file = `${slug}-${tag}-${version()}.png`;
    const tmp = path.join(os.tmpdir(), `ce-${file}`);
    const prompt = `Use the imagegen skill to generate ONE image. Subject: ${concept}. Style: ${style} After generating, copy the final PNG to ${tmp}`;
    process.stderr.write(`  [image] Foto "${tag}" via Codex ...\n`);
    // Model pin (2026-06-14): gpt-5.4 is now REJECTED for ChatGPT accounts ("model is not supported
    // when using Codex with a ChatGPT account"), which silently broke ALL image generation. gpt-5.5
    // is the current supported default and works. It reasons a bit longer before calling image_gen,
    // so we keep the generous 600s timeout. The picture itself comes from the separate image model.
    execFileSync('codex', ['exec', '--sandbox', 'workspace-write', '-m', 'gpt-5.5', prompt], { encoding: 'utf8', timeout: 600 * 1000, maxBuffer: 32 * 1024 * 1024 });
    if (!fs.existsSync(tmp)) throw new Error(`Codex hat kein Bild erzeugt (${tag})`);
    await sharp(tmp).resize(w, h, { fit: 'cover', position: 'attention' }).png({ quality: 90 }).toFile(path.join(blogDir(), file));
    fs.rmSync(tmp, { force: true });
    return `/images/blog/${file}`;
}

export async function renderInfographic(slug: string, data: SketchData): Promise<string> {
    const file = `${slug}-infografik-${version()}.png`;
    await renderInfographicPng(data, path.join(blogDir(), file));
    process.stderr.write(`  [image] Sketch-Infografik gerendert\n`);
    return `/images/blog/${file}`;
}

// Backwards-compatible single concept (used by older path / fallback).
export function buildImageConcept(title: string, bodyText: string): string {
    const prompt = `Beschreibe in EINEM kurzen englischen Satz eine authentische Foto-Szene fuers Beitragsbild zum Artikel "${title}" (Mensch ok, KEIN Text im Bild). Nur den Satz.\n\n${bodyText.slice(0, 1500)}`;
    const out = runClaude(prompt, { timeoutSec: 120, label: 'art-director' });
    const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
    return (lines[lines.length - 1] || `Authentic Austrian small-business scene about ${title}`).replace(/^["']|["']$/g, '');
}

export async function generateImage(slug: string, concept: string): Promise<string> {
    return generatePhoto(slug, 'hero', concept, 1200, 630, HERO_PHOTO_STYLE);
}
