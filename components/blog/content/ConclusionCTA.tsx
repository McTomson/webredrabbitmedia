import Link from 'next/link';

interface ConclusionCTAProps {
    title?: string;
    summary: string;
    ctaText?: string;
    ctaLink?: string;
    stats?: Array<{ label: string; value: string }>;
    onFormOpen?: () => void;
}

/**
 * Conclusion CTA Komponente
 * Erscheint vor den FAQs als Abschluss des Artikels
 * - Fazit-Summary
 * - Optional: Stats-Grid
 * - Dual-CTA: Primär (öffnet Modal) + Sekundär (Link zu Artikeln)
 */
export function ConclusionCTA({
    title = "Fazit",
    summary,
    ctaText = "Jetzt Website erstellen lassen",
    ctaLink = "/#contact",
    stats,
    onFormOpen
}: ConclusionCTAProps) {
    return (
        <section className="my-16 p-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl text-white">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>

            {/* Summary */}
            <div className="prose prose-lg prose-invert mb-8">
                <p className="text-xl leading-relaxed text-gray-200">{summary}</p>
            </div>

            {/* Stats Grid (Optional) */}
            {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-700">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-red-400 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {/* Primary Button - öffnet Modal wenn onFormOpen vorhanden */}
                {onFormOpen ? (
                    <button
                        onClick={onFormOpen}
                        className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 rounded-none font-bold text-xl transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300 text-center"
                    >
                        {ctaText}
                    </button>
                ) : (
                    <Link
                        href={ctaLink}
                        className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 rounded-none font-bold text-xl transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300 text-center"
                    >
                        {ctaText}
                    </Link>
                )}
                {/* Secondary Button - Link zu Artikeln */}
                <Link
                    href="/tipps"
                    className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-none font-bold text-xl transition-all duration-300 text-center"
                >
                    Mehr Artikel lesen
                </Link>
            </div>
        </section>
    );
}
