import { getPostBySlug, getAllPosts, compileBlogPost } from '@/lib/blog/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowLeft, Linkedin, CheckCircle2 } from "lucide-react";
import Container from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const posts = await getAllPosts();
    const relatedPosts = posts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .slice(0, 2);

    const compiledContent = await compileBlogPost(post.content);
    const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

    return (
        <div className="min-h-screen bg-[#fafafa] pt-20">
            <main className="py-12 md:py-20 text-left">
                <article>
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            {/* Breadcrumbs with Schema */}
                            <Breadcrumbs items={[
                                { name: 'Home', url: '/' },
                                { name: 'Tipps', url: '/tipps' },
                                { name: post.title, url: `/tipps/${slug}` }
                            ]} />

                            {/* Back Link */}
                            <Link href="/tipps" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#dc2626] mb-12 transition-colors font-medium">
                                <ArrowLeft size={16} /> Zurück zur Übersicht
                            </Link>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-[#dc2626] text-xs font-bold uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
                                    {post.category}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(post.publishedAt).toLocaleDateString('de-AT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-[#141414] leading-tight mb-10 tracking-tight">
                                {post.title}
                            </h1>

                            {/* Author Card & E-E-A-T Signals */}
                            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-100 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                                        TU
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#141414]">Thomas Uhlir MBA</span>
                                            <a href="https://www.linkedin.com/in/thomasuhlir/" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] hover:scale-110 transition-transform">
                                                <Linkedin size={18} />
                                            </a>
                                        </div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">CEO Red Rabbit Media | Web-Stratege</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase tracking-wide">
                                            <CheckCircle2 size={14} /> Fachlich geprüft
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lesezeit</span>
                                        <div className="text-[#141414] font-bold text-xs uppercase tracking-wide">{readingTime} Min.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="relative aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-soft border border-gray-100">
                                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
                            </div>

                            {/* Main Content */}
                            <div className="prose prose-lg max-w-none prose-headings:text-[#141414] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-[#141414] prose-a:text-[#dc2626] prose-a:no-underline hover:prose-a:underline">
                                {compiledContent}
                            </div>

                            {/* Global Author E-E-A-T Section */}
                            <div className="mt-20 p-8 md:p-12 bg-white border border-gray-100 rounded-2xl shadow-soft">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center font-bold text-4xl text-[#dc2626] border border-gray-100 shadow-sm">
                                        TU
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-[#141414] mb-4">Experten-Profil: Thomas Uhlir MBA</h4>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            Als Gründer von Red Rabbit Media kombiniert Thomas Uhlir betriebswirtschaftliche Exzellenz mit technologischer Innovation.
                                            Sein Fokus liegt auf der Entwicklung von Performance-Websites, die durch Schnelligkeit, E-E-A-T Konformität und erstklassiges Design überzeugen.
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                            <Link href="/#contact" className="btn-primary py-2 text-sm uppercase tracking-widest font-bold px-6">
                                                Beratung anfragen
                                            </Link>
                                            <a href="https://www.linkedin.com/in/thomasuhlir/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#141414] font-bold text-sm uppercase tracking-widest hover:text-[#dc2626] transition-colors">
                                                LinkedIn Profil <span>→</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="mt-20 pt-20 border-t border-gray-100">
                        <Container>
                            <h2 className="text-3xl font-bold text-[#141414] mb-12">Weiterführende Artikel</h2>
                            <div className="grid md:grid-cols-2 gap-8 lg:max-w-4xl mx-auto">
                                {relatedPosts.map((p) => (
                                    <Link
                                        key={p.slug}
                                        href={`/tipps/${p.slug}`}
                                        className="group block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all border border-gray-100 p-4"
                                    >
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                            <Image src={p.featuredImage} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-widest mb-2 block">{p.category}</span>
                                            <h3 className="text-xl font-bold text-[#141414] group-hover:text-[#dc2626] transition-colors leading-tight mb-2 line-clamp-2">{p.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Container>
                    </section>
                )}
            </main>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.excerpt,
                        "image": post.featuredImage,
                        "datePublished": post.publishedAt,
                        "dateModified": post.updatedAt,
                        "author": {
                            "@type": "Person",
                            "name": "Thomas Uhlir MBA",
                            "jobTitle": "CEO Red Rabbit Media",
                            "url": "https://www.linkedin.com/in/thomasuhlir/"
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
                        }
                    }),
                }}
            />
        </div>
    );
}
