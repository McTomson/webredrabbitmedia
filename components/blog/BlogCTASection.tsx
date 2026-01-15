"use client";

interface BlogCTASectionProps {
    onContactClick: () => void;
    onReadArticlesClick: () => void;
}

export default function BlogCTASection({ onContactClick, onReadArticlesClick }: BlogCTASectionProps) {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-white border-y border-gray-100 py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Headline */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-6">
                    Bereit für deine professionelle Website?
                </h2>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Unser Team erstellt deine Website – von der Strategie bis zum Launch.
                    Oder entdecke zuerst unsere Artikel und lerne, worauf es ankommt.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={onContactClick}
                        className="w-full sm:w-auto px-8 py-4 bg-[#dc2626] text-white rounded-xl font-bold text-lg hover:bg-[#b91c1c] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300"
                    >
                        Ja, Website erstellen lassen
                    </button>
                    <button
                        onClick={onReadArticlesClick}
                        className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-[#141414] rounded-xl font-bold text-lg hover:border-[#dc2626] hover:text-[#dc2626] transition-all shadow-md hover:shadow-lg"
                    >
                        Erst mal Artikel lesen
                    </button>
                </div>

                {/* Trust Signal */}
                <p className="mt-8 text-sm text-gray-500">
                    ⭐ 4.8/5.0 • 315+ zufriedene Kunden • Zahlung erst bei Zufriedenheit
                </p>
            </div>
        </section>
    );
}
