import { CheckCircle2 } from 'lucide-react';

interface KeyTakeawaysProps {
    items: string[];
    title?: string;
}

/**
 * Key Takeaways Komponente
 * Zeigt wichtigste Erkenntnisse des Artikels
 * Position: Nach Autor-Card, vor Featured Image
 */
export function KeyTakeaways({ items, title = "Wichtigste Erkenntnisse" }: KeyTakeawaysProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="my-8 p-8 bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-600 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                    <ul className="space-y-3">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    {i + 1}
                                </span>
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
