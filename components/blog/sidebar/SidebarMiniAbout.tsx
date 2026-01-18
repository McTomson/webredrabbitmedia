import { Rocket, CheckCircle2 } from 'lucide-react';

interface SidebarMiniAboutProps {
    onFormOpen?: () => void;
}

export function SidebarMiniAbout({ onFormOpen }: SidebarMiniAboutProps) {
    return (
        <div className="bg-red-600 text-white rounded-2xl p-6 shadow-xl mb-6 border border-red-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-white leading-tight">Red Rabbit Media</h4>
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Webdesign & Performance</p>
                </div>
            </div>

            <p className="text-sm text-white/95 leading-relaxed mb-5 font-medium">
                Wir bauen Ihre professionelle Website <span className="text-white font-black underline decoration-white/30 underline-offset-4">ab nur 790 €</span> – ohne Vorkasse, ohne Risiko, mit 100% Zufriedenheitsgarantie.
            </p>

            <ul className="space-y-2 mb-6 text-xs text-white/90 font-medium">
                <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Individuelles Design (Kein Baukasten)
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Vollständige SEO-Optimierung
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Blitzschnelle Ladezeiten
                </li>
            </ul>

            <button
                onClick={onFormOpen}
                className="block w-full text-center py-3 bg-white text-red-600 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-md hover:translate-y-[-1px]"
            >
                Jetzt Projekt anfragen
            </button>
        </div>
    );
}
