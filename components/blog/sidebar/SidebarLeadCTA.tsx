import Image from 'next/image';

interface SidebarLeadCTAProps {
    onFormOpen?: () => void;
}

/**
 * Sidebar Lead-CTA Komponente
 * Prominenter Call-to-Action für kostenlose Website-Analyse
 * Position: Ganz unten in Sidebar (STICKY)
 */
export function SidebarLeadCTA({ onFormOpen }: SidebarLeadCTAProps) {
    return (
        <div className="bg-gradient-to-br from-red-600 to-orange-600 p-6 rounded-2xl shadow-xl text-white">
            {/* Logo oben links */}
            <div className="mb-4">
                <div className="relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <Image
                        src="/images/logo.webp"
                        alt="Red Rabbit Media Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Badge */}
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg mb-4">
                <p className="text-xs font-bold uppercase tracking-widest">
                    KOSTENLOS Website-Analyse
                </p>
            </div>

            {/* Headline */}
            <h3 className="text-xl font-bold mb-3 leading-tight">
                Wie performt Ihre Website wirklich?
            </h3>

            {/* Description */}
            <p className="text-sm mb-5 opacity-90 leading-relaxed">
                Kostenlose SEO-Analyse, Performance-Check und Verbesserungsvorschläge von unseren Experten.
            </p>

            {/* CTA Button - ECKIG + MODAL */}
            <button
                onClick={onFormOpen}
                className="block w-full px-6 py-3 bg-white text-red-600 text-center rounded-none font-bold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
            >
                Jetzt Analyse anfordern
            </button>

            {/* Trust Signal */}
            <div className="mt-4 pt-4 border-t border-white/20 text-xs text-center opacity-75">
                ✓ 100% kostenlos • ✓ Keine Verpflichtung
            </div>
        </div>
    );
}
