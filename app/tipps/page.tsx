import { getAllPosts } from '@/lib/blog/posts';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight } from "lucide-react";
import Container from '@/components/Container';

export const metadata: Metadata = {
    title: "Website-Tipps & Ratgeber | Red Rabbit Media",
    description: "Erfahren Sie alles über Website-Kosten, SEO und modernes Webmarketing in Österreich. Fachwissen von Thomas Uhlir MBA.",
};

export default async function BlogPage() {
    const posts = await getAllPosts();
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    return (
        <div className="min-h-screen bg-[#fafafa] pt-20">
            <main className="py-20">
                {/* Hero Section */}
                <section className="mb-20">
                    <Container>
                        <div className="max-w-4xl">
                            <h1 className="text-5xl md:text-7xl font-bold text-[#141414] leading-tight tracking-tight mb-6">
                                Wissen & <span className="text-[#dc2626]">Expertise.</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                Aktuelle Einblicke in Webdesign, SEO und digitale Strategie
                                für den österreichischen Markt – praxisnah und fundiert von Thomas Uhlir MBA.
                            </p>
                        </div>
                    </Container>
                </section>

                {/* Featured Post */}
                {featuredPost && (
                    <section className="mb-20">
                        <Container>
                            <Link
                                href={`/tipps/${featuredPost.slug}`}
                                className="group relative block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all border border-gray-100"
                            >
                                <div className="grid lg:grid-cols-2 gap-0 overflow-hidden">
                                    <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                                        <Image
                                            src={featuredPost.featuredImage}
                                            alt={featuredPost.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                                        <span className="text-xs font-bold text-[#dc2626] uppercase tracking-widest mb-4 block">Aktuellster Beitrag</span>
                                        <h2 className="text-3xl md:text-4xl font-bold text-[#141414] leading-tight mb-6 group-hover:text-[#dc2626] transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">TU</div>
                                            <div>
                                                <p className="text-sm font-bold text-[#141414]">Thomas Uhlir MBA</p>
                                                <p className="text-xs text-gray-400 uppercase tracking-widest">{featuredPost.readingTime} Min. Lesezeit</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Container>
                    </section>
                )}

                {/* Grid Section */}
                <section>
                    <Container>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/tipps/${post.slug}`}
                                    className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-medium transition-all"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-widest mb-3 block">{post.category}</span>
                                        <h3 className="text-xl font-bold text-[#141414] group-hover:text-[#dc2626] transition-colors leading-tight mb-4 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <span className="text-xs font-bold text-[#141414] uppercase tracking-widest flex items-center gap-2 group-hover:text-[#dc2626] transition-colors">
                                            Weiterlesen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>
            </main>
        </div>
    );
}
