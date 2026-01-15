"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Search, Star } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/posts';

interface BlogFilterProps {
    initialPosts: BlogPostMeta[];
}

export default function BlogFilter({ initialPosts }: BlogFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    // Alphabet for the filter
    const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const filteredPosts = useMemo(() => {
        let posts = initialPosts;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        if (activeLetter) {
            if (activeLetter === "#") {
                // 0-9 check
                posts = posts.filter(post => /^[0-9]/.test(post.title));
            } else {
                posts = posts.filter((post) =>
                    post.title.toUpperCase().startsWith(activeLetter)
                );
            }
        }

        return posts;
    }, [initialPosts, searchQuery, activeLetter]);

    return (
        <div className="w-full">
            {/* Hero / Expert Section (Neil Patel Style) */}
            <div className="bg-white border-b border-gray-100 mb-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-[#dc2626]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={20} fill={star < 5 ? "#dc2626" : "none"} className={star === 5 ? "fill-[#dc2626] opacity-50" : ""} />
                                    ))}
                                </div>
                                <span className="text-gray-500 font-medium text-sm">4.8/5.0 (315+ Bewertungen)</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#141414] leading-[1.1] mb-6 tracking-tight">
                                Willst du mehr <span className="text-[#dc2626]">Traffic?</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                                Erfahre, wie du deine Website zum Kundenmagneten machst. Strategien für Websiten, SEO und Umsatz – direkt von Thomas Uhlir MBA.
                            </p>

                            {/* Search Bar - Prominent */}
                            <div className="relative max-w-lg">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Was möchtest du heute lernen? (z.B. SEO, Webdesign)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg outline-none focus:border-[#dc2626] focus:bg-white transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Expert Image/Graphic placeholder - simulates the personal connection */}
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                            <div className="text-center lg:text-right">
                                <div className="inline-block relative">
                                    {/* Circle Background */}
                                    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 mx-auto overflow-hidden relative border-4 border-white shadow-xl">
                                        {/* Placeholder for Thomas - abstract if no image available, or text */}
                                        <span className="text-6xl font-bold text-gray-300">TU</span>
                                    </div>
                                    <div className="bg-white px-6 py-3 rounded-xl shadow-medium border border-gray-100 inline-block">
                                        <p className="font-bold text-[#141414]">Thomas Uhlir MBA</p>
                                        <p className="text-sm text-gray-500">Expert for SEO & Web Design</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* A-Z Filter Section */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-30 shadow-subtle/50 backdrop-blur-md bg-white/90">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        <button
                            onClick={() => setActiveLetter(null)}
                            className={`px-3 py-1 text-sm md:text-base font-bold rounded-lg transition-colors ${!activeLetter ? 'bg-[#141414] text-white' : 'text-gray-500 hover:text-[#dc2626] hover:bg-red-50'}`}
                        >
                            ALLE
                        </button>
                        {alphabet.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => setActiveLetter(letter)}
                                className={`px-2 py-1 text-sm md:text-base font-medium rounded-lg transition-colors ${activeLetter === letter ? 'bg-[#dc2626] text-white shadow-md' : 'text-gray-400 hover:text-[#141414] hover:bg-gray-50'}`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                {filteredPosts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/tipps/${post.slug}`}
                                className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                                    {/* Overlay Gradient for better text readability if we had text on top, but we don't here. Keeping clean. */}
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#dc2626] uppercase tracking-wider shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-xl md:text-2xl font-bold text-[#141414] group-hover:text-[#dc2626] transition-colors leading-tight mb-4">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3 text-sm md:text-base flex-grow">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {post.readingTime} Min. Read
                                        </span>
                                        <span className="flex items-center text-[#dc2626] font-bold text-sm group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight size={16} className="ml-2" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                            <Search size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Keine Artikel gefunden</h3>
                        <p className="text-gray-500">
                            Keine Ergebnisse für "{searchQuery}" {activeLetter && `starten mit "${activeLetter}"`}.
                            <br />Versuche einen anderen Suchbegriff.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveLetter(null); }}
                            className="mt-8 px-8 py-3 bg-[#141414] text-white rounded-lg font-bold hover:bg-[#dc2626] transition-colors"
                        >
                            Alle Artikel anzeigen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
