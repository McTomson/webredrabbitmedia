"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/posts';
import BlogHero from './BlogHero';
import AlphabetFilter from './AlphabetFilter';
import BlogTimeline from './BlogTimeline';
import BlogCTASection from './BlogCTASection';

interface BlogFilterProps {
    initialPosts: BlogPostMeta[];
    onFormOpen?: () => void;
}

export default function BlogFilter({ initialPosts, onFormOpen }: BlogFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLetter, setActiveLetter] = useState<string | null>(null);

    const handleContactClick = () => {
        if (onFormOpen) {
            onFormOpen();
        }
    };

    const handleReadArticlesClick = () => {
        const articlesSection = document.getElementById('articles-section');
        articlesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
            {/* Hero Section with Search */}
            <BlogHero
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalPosts={filteredPosts.length}
            />

            {/* A-Z Alphabet Filter */}
            <AlphabetFilter
                activeLetter={activeLetter}
                onLetterChange={setActiveLetter}
            />

            {/* CTA Section */}
            <BlogCTASection
                onContactClick={handleContactClick}
                onReadArticlesClick={handleReadArticlesClick}
            />

            {/* Timeline Display or No Results */}
            <div id="articles-section">
                {filteredPosts.length > 0 ? (
                    <BlogTimeline posts={filteredPosts} />
                ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                            <Search size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Keine Artikel gefunden</h3>
                        <p className="text-gray-500">
                            Keine Ergebnisse für "{searchQuery}" {activeLetter && `starten mit "${activeLetter}"`}.
                            <br />Versuche einen anderen Suchbegriff.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveLetter(null);
                            }}
                            className="mt-8 px-8 py-3 bg-[#141414] text-white rounded-lg font-bold hover:bg-[#dc2626] transition-colors"
                        >
                            Alle Artikel anzeigen
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
