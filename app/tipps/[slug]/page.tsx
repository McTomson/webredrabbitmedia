import { getPostBySlug, getAllPosts, compileBlogPost, extractHeadings } from '@/lib/blog/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogPostClient } from './BlogPostClient';
import { SITE_URL, AUTHORS } from '@/lib/config';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Beitrag nicht gefunden',
        };
    }

    return {
        title: `${post.title} | Red Rabbit Media`,
        description: post.excerpt,
        alternates: {
            canonical: `${SITE_URL}/tipps/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `${SITE_URL}/tipps/${slug}`,
            images: [post.featuredImage],
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [AUTHORS.thomas.name],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.featuredImage],
        },
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const posts = await getAllPosts();
    const relatedPosts = posts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .slice(0, 2)
        .map(p => ({ slug: p.slug, title: p.title }));

    const compiledContent = await compileBlogPost(post.content);
    const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);
    const headings = extractHeadings(post.content);

    // Dynamic Author Selection based on post metadata or fallback
    const authorKey = post.author?.toLowerCase().includes('dmitry') ? 'dmitry' : 'thomas';
    const author = AUTHORS[authorKey];

    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": {
            "@type": "ImageObject",
            "url": `${SITE_URL}${post.featuredImage}`,
            "width": 1200,
            "height": 630
        },
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "author": {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.role,
            "url": author.linkedin,
            "sameAs": [author.linkedin],
            "knowsAbout": author.knowsAbout
        },
        "publisher": {
            "@type": "Organization",
            "name": "Red Rabbit Media",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/favicon.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/tipps/${slug}`
        },
        "wordCount": post.content.split(/\s+/).length,
        "timeRequired": `PT${readingTime}M`,
        "articleSection": post.category,
        "keywords": post.tags.join(', '),
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".prose h2", ".prose p"]
        }
    };

    const faqSchema = post.faqs && post.faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <>
            {/* Client Component handles UI + Modal State */}
            <BlogPostClient
                post={post}
                relatedPosts={relatedPosts}
                headings={headings}
                compiledContent={compiledContent}
                readingTime={readingTime}
                slug={slug}
            />

            {/* Structured Data (Server-side) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
