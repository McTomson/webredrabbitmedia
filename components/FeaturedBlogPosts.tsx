"use client";

import Link from 'next/link';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { AOSWrapper } from './AnimatedSection';

const featuredPosts = [
    {
        slug: 'was-kostet-eine-website',
        title: 'Was kostet eine Website?',
        excerpt: 'Detaillierte Kostenübersicht für professionelle Websites in Österreich 2026.',
        readTime: '8 min',
        category: 'Kosten & Preise',
        featured: true
    },
    {
        slug: 'website-selbst-erstellen-vs-agentur',
        title: 'Website selbst erstellen vs. Agentur',
        excerpt: 'Vor- und Nachteile im direkten Vergleich. Was lohnt sich wirklich?',
        readTime: '6 min',
        category: 'Ratgeber'
    },
    {
        slug: '10-fehler-beim-website-erstellen',
        title: '10 häufige Fehler beim Website-Erstellen',
        excerpt: 'Diese Fehler kosten Sie Kunden. So vermeiden Sie die größten Stolperfallen.',
        readTime: '7 min',
        category: 'Best Practices'
    }
];

export default function FeaturedBlogPosts() {
    return (
        <section className="py-24 px-8 bg-white" id="blog-featured">
            <div className="max-w-7xl mx-auto">
                <AOSWrapper animation="fade-up">
                    <div className="text-center mb-16">
                        <span className="text-red-600 font-medium text-sm uppercase tracking-wider">
                            Wissen & Ratgeber
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-light mt-4 mb-6 text-gray-900">
                            Aktuelle Tipps & Insights
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Expertenwissen rund um Webdesign, Kosten und Best Practices –
                            direkt aus unserer täglichen Arbeit mit über 315 Kunden.
                        </p>
                    </div>
                </AOSWrapper>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {featuredPosts.map((post, index) => (
                        <AOSWrapper key={post.slug} animation="fade-up" delay={100 + index * 100}>
                            <Link
                                href={`/tipps/${post.slug}`}
                                className="block bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
                            >
                                {/* Category Badge */}
                                <div className="p-6 pb-0">
                                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-medium mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime}
                                        </div>

                                        <div className="flex items-center gap-2 text-red-600 font-medium group-hover:gap-3 transition-all">
                                            Lesen
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </AOSWrapper>
                    ))}
                </div>

                {/* CTA to Blog Overview */}
                <AOSWrapper animation="fade-up" delay={400}>
                    <div className="text-center">
                        <Link
                            href="/tipps"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-all duration-300 group"
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span>Alle Artikel entdecken</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </AOSWrapper>
            </div>
        </section>
    );
}
