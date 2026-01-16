import { getPostBySlug, getAllPosts, compileBlogPost, extractHeadings } from '@/lib/blog/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogPostClient } from './BlogPostClient';

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
            canonical: `https://web.redrabbit.media/tipps/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://web.redrabbit.media/tipps/${slug}`,
            images: [post.featuredImage],
            type: 'article',
            publishedTime: post.publishedAt,
            authors: ['Thomas Uhlir MBA'],
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

            {/* Enhanced Schema.org Markup (Server-side) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.excerpt,
                        "image": {
                            "@type": "ImageObject",
                            "url": post.featuredImage,
                            "width": 1200,
                            "height": 630
                        },
                        "datePublished": post.publishedAt,
                        "dateModified": post.updatedAt,
                        "author": {
                            "@type": "Person",
                            "name": post.author,
                            "jobTitle": post.author.includes("Dmitry") ? "Lead Developer" : "CEO & Web-Stratege",
                            "url": post.author.includes("Dmitry")
                                ? "https://www.linkedin.com/in/dmitrypashlov/"
                                : "https://www.linkedin.com/in/thomasuhlir/",
                            "sameAs": [
                                post.author.includes("Dmitry")
                                    ? "https://www.linkedin.com/in/dmitrypashlov/"
                                    : "https://www.linkedin.com/in/thomasuhlir/"
                            ]
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Red Rabbit Media",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://web.redrabbit.media/favicon.png"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://web.redrabbit.media/tipps/${slug}`
                        },
                        "wordCount": post.content.split(/\s+/).length,
                        "timeRequired": `PT${readingTime}M`,
                        "articleSection": post.category,
                        "keywords": post.tags.join(', '),
                        // Enhanced with FAQ data
                        "speakable": {
                            "@type": "SpeakableSpecification",
                            "cssSelector": [".prose h2", ".prose p"]
                        },
                        ...(post.faqs && post.faqs.length > 0 && {
                            "hasPart": post.faqs.map(faq => ({
                                "@type": "Question",
                                "name": faq.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.answer
                                }
                            }))
                        })
                    }),
                }}
            />
        </>
    );
}
