import Link from 'next/link';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    // BreadcrumbList Schema für Google Rich Snippets
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };

    return (
        <>
            {/* Breadcrumb Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <nav aria-label="Breadcrumb" className="py-4">
                <ol className="flex gap-2 text-sm text-gray-600">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {index > 0 && <span className="text-gray-400">/</span>}
                            {index === items.length - 1 ? (
                                <span className="text-gray-900 font-medium">{item.name}</span>
                            ) : (
                                <Link href={item.url} className="hover:text-red-600 transition-colors">
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
