import { z } from 'zod';

// Frontmatter-Validator. Quelle der Wahrheit: BlogPost-Interface (lib/blog/posts.ts)
// + conventions.md. Erzwingt zusaetzlich harte Guardrails (kein Gedankenstrich,
// nur echte Autoren, mind. 1 Quelle). Deterministisch, TDD-getestet.

const REAL_AUTHORS = ['Thomas Uhlir MBA', 'Dmitry Pashlov'];
const EM_DASH = /[–—]/; // en-dash – , em-dash —

const faqSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
});

const sourceSchema = z.object({
    name: z.string().min(1),
    // Nur http(s): z.url() liesse sonst auch javascript:/data:-URLs durch (Render landet in <a href>).
    url: z.string().url().refine((u) => /^https?:\/\//i.test(u), 'Quelle-URL muss mit http(s):// beginnen'),
});

const schema = z
    .object({
        title: z.string().min(1),
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug muss kebab-case (a-z0-9, Bindestriche) sein'),
        excerpt: z.string().min(1),
        featuredSnippetTitle: z.string().optional(),
        featuredSnippet: z.string().min(1),
        author: z.string().refine((a) => REAL_AUTHORS.includes(a), {
            message: `author muss eine reale Person sein (${REAL_AUTHORS.join(' oder ')})`,
        }),
        publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'publishedAt muss YYYY-MM-DD sein'),
        updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'updatedAt muss YYYY-MM-DD sein'),
        category: z.string().min(1),
        cluster: z.number().int().min(1).max(7).optional(),
        tags: z.array(z.string().min(1)).min(1, 'mind. 1 tag'),
        featuredImage: z.string().regex(/^\/images\/blog\/.+\.(png|jpg|jpeg|webp)$/, 'featuredImage muss /images/blog/<name>.<ext> sein'),
        status: z.enum(['draft', 'published']),
        aiAssisted: z.boolean().optional(),
        sources: z.array(sourceSchema).min(1, 'mind. 1 echte Quelle (Guardrail 5)'),
        keyTakeaways: z.array(z.string().min(1)).min(1),
        conclusionStats: z
            .array(z.object({ label: z.string(), value: z.string() }))
            .optional(),
        autoGenerateFAQs: z.boolean(),
        customFAQs: z.array(faqSchema).optional(),
    })
    .refine((fm) => fm.autoGenerateFAQs !== false || (fm.customFAQs && fm.customFAQs.length > 0), {
        message: 'autoGenerateFAQs:false braucht mind. 1 customFAQ (sonst leere FAQ)',
        path: ['customFAQs'],
    })
    .refine((fm) => fm.slug && fm.featuredImage ? fm.featuredImage.includes(fm.slug) : true, {
        message: 'featuredImage-Pfad sollte den slug enthalten',
        path: ['featuredImage'],
    });

export interface ValidationResult {
    ok: boolean;
    errors: string[];
}

// Rekursiv jeden String auf Gedankenstrich pruefen (Guardrail 8). Bindestrich "-" ist ok.
function findEmDash(value: unknown, path: string, out: string[]): void {
    if (typeof value === 'string') {
        if (EM_DASH.test(value)) {
            out.push(`Gedankenstrich (em-dash "–") verboten in "${path}": ${JSON.stringify(value.slice(0, 60))}`);
        }
    } else if (Array.isArray(value)) {
        value.forEach((v, i) => findEmDash(v, `${path}[${i}]`, out));
    } else if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) findEmDash(v, path ? `${path}.${k}` : k, out);
    }
}

export function validateFrontmatter(fm: unknown): ValidationResult {
    const errors: string[] = [];

    // 1) Gedankenstrich-Scan ueber alle Strings (auch verschachtelt).
    findEmDash(fm, '', errors);

    // 2) Struktur/Pflichtfelder via zod.
    const parsed = schema.safeParse(fm);
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            const where = issue.path.join('.') || '(root)';
            errors.push(`${where}: ${issue.message}`);
        }
    }

    return { ok: errors.length === 0, errors };
}
