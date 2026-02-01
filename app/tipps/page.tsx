import { getAllPosts } from '@/lib/blog/posts';
import { Metadata } from 'next';
import BlogFilter from '@/components/blog/BlogFilter';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: "Webdesign & SEO Experten-Wissen | ⭐ 4.8 (315+ Votes) | Thomas Uhlir MBA",
    description: "Lerne von Thomas Uhlir MBA (Top 0.1% Expert): Wie du Websiten erstellst, die verkaufen. ✅ 315+ Bewertungen ⭐ 4.8. Aktuelle Strategien für Webdesign, SEO & Marketing.",
    openGraph: {
        title: "Webdesign & SEO Experten-Wissen | Thomas Uhlir MBA",
        description: "Exklusive Tipps für deinen Online-Erfolg. Lerne, wie du mit deiner Website Kunden gewinnst.",
        url: 'https://web.redrabbit.media/tipps',
        type: 'website',
    },
    alternates: {
        canonical: 'https://web.redrabbit.media/tipps',
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    // JSON-LD for "AggregateRating" to help with the stars in Google
    // Using a "CollectionPage" or "ProfilePage" with an aggregate rating for the author/content
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage', // Or 'CollectionPage' for the blog itself
        'mainEntity': {
            '@type': 'Person',
            'name': 'Thomas Uhlir MBA',
            'jobTitle': 'Webdesign & SEO Experte',
            'url': 'https://web.redrabbit.media/tipps', // Corrected canonical URL
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.8',
                'reviewCount': '315',
                'bestRating': '5',
                'worstRating': '1'
            }
        }
    };

    // FAQ Schema for Featured Snippets (Position Zero optimization)
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': posts.slice(0, 5).map(post => ({
            '@type': 'Question',
            'name': post.title,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': post.excerpt
            }
        }))
    };

    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={jsonLd} />
            <JsonLd data={faqSchema} />
            <main>
                <BlogFilter initialPosts={posts} />
            </main>
        </div>
    );
}
