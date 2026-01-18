import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedArticle {
    slug: string;
    title: string;
}

interface RelatedArticlesProps {
    articles: RelatedArticle[];
}

/**
 * RelatedArticles Component for MDX Blog Posts
 * 
 * Usage in MDX:
 * <RelatedArticles articles={[
 *   { slug: 'was-kostet-eine-website', title: 'Was kostet eine Website?' },
 *   { slug: '10-fehler-beim-website-erstellen', title: '10 häufige Fehler' }
 * ]} />
 */
export default function RelatedArticles({ articles }: RelatedArticlesProps) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-medium mb-6 text-gray-900">
                Verwandte Artikel
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/tipps/${article.slug}`}
                        className="group block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h4 className="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors flex-1">
                                {article.title}
                            </h4>
                            <ArrowRight className="w-5 h-5 text-red-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
