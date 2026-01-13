"use client";

import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

const FloatingWhatsApp = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(
            "Hallo! Ich interessiere mich für eine neue Website für meinen Installationsbetrieb. Können Sie mir mehr Informationen zum 790€ Angebot geben?"
        );
        window.open(`https://wa.me/436769000955?text=${message}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Expanded Info */}
            {isExpanded && (
                <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 max-w-xs animate-fade-in-up">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-gray-900">Red Rabbit Media</div>
                                <div className="text-xs text-gray-500">Normalerweise antwortet in wenigen Minuten</div>
                            </div>
                        </div>
                        <button
                            className="h-6 w-6 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                            onClick={() => setIsExpanded(false)}
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        Hast du Fragen zu unserem 790€ Website-Angebot? Schreib uns direkt!
                    </p>
                    <button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-medium"
                    >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp öffnen
                    </button>
                </div>
            )}

            {/* Main Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
            >
                {isExpanded ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageSquare className="w-6 h-6" />
                )}
            </button>

            {/* Notification dot */}
            {!isExpanded && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs text-white font-bold">1</span>
                </div>
            )}
        </div>
    );
};

export default FloatingWhatsApp;
