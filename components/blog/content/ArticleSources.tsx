import { BookOpen, ExternalLink } from 'lucide-react';

interface ArticleSourcesProps {
    sources?: Array<{ name: string; url: string }>;
}

/**
 * Quellen-/Referenzliste am Artikelende.
 * Macht die im Frontmatter gepflegten Quellen sichtbar und verlinkt sie (E-E-A-T + GEO-Zitierbarkeit).
 * Bewusst zurueckhaltend gestaltet, damit es die Key-Takeaways-Box nicht ueberstrahlt.
 */
export function ArticleSources({ sources }: ArticleSourcesProps) {
    if (!sources || sources.length === 0) return null;

    return (
        <section className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="quellen-heading">
            <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-red-600" />
                <h2 id="quellen-heading" className="text-lg font-bold text-gray-900">
                    Quellen
                </h2>
            </div>
            <ul className="space-y-2">
                {sources.map((source, i) => {
                    // Render-seitige Absicherung: nur http(s) verlinken (kein javascript:/data:).
                    const safeUrl = /^https?:\/\//i.test(source.url) ? source.url : undefined;
                    return (
                        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-gray-400 select-none">{i + 1}.</span>
                            {safeUrl ? (
                                <a
                                    href={safeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-gray-700 hover:text-red-600 underline decoration-gray-300 hover:decoration-red-600 transition-colors"
                                >
                                    {source.name}
                                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                                </a>
                            ) : (
                                <span className="text-gray-700">{source.name}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
