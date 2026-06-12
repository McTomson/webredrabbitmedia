import { getAllPosts } from '@/lib/blog/posts';
import { Metadata } from 'next';
import BlogFilter from '@/components/blog/BlogFilter';
import JsonLd from '@/components/JsonLd';
import { aggregateRatingLd } from '@/lib/reviews';

export const metadata: Metadata = {
    title: "Webdesign & SEO Experten-Wissen | Thomas Uhlir MBA",
    description: "Lerne von Thomas Uhlir MBA: Wie du Websiten erstellst, die verkaufen. Aktuelle Strategien für Webdesign, SEO & Marketing aus 164 Kundenprojekten.",
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
            // aggregateRating wird NUR aus echten Google-Reviews gerendert (lib/reviews.ts).
            // Solange keine echten Zahlen hinterlegt sind, bleibt es weg (kein Review-Spam).
            ...(aggregateRatingLd() ? { aggregateRating: aggregateRatingLd() } : {}),
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
