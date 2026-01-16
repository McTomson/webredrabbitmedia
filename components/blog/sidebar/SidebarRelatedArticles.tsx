import Link from 'next/link';
import { FileText } from 'lucide-react';

interface RelatedArticle {
    slug: string;
    title: string;
}

interface SidebarRelatedArticlesProps {
    articles: RelatedArticle[];
}

/**
 * Sidebar Related Articles Komponente
 * Design inspiriert von Neil Patel's "Tools" Section
 * - Weißer Hintergrund mit Border
 * - Orange/Rot Marker-Icons
 * - Liste von verlinkten Artikeln
 * Position: Zwischen TOC und About in der Sidebar
 */
export function SidebarRelatedArticles({ articles }: SidebarRelatedArticlesProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Weiterführende Artikel
            </h3>

            {/* Articles List */}
            <ul className="space-y-3">
                {articles.map((article) => (
                    <li key={article.slug} className="flex items-start gap-3 group">
                        {/* Orange Marker Icon (wie bei Neil Patel) */}
                        <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-sm mt-2"></div>

                        {/* Article Link */}
                        <Link
                            href={`/tipps/${article.slug}`}
                            className="flex-1 text-gray-700 hover:text-red-600 transition-colors leading-relaxed"
                        >
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
