"use client";

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import type { BlogPostMeta } from '@/lib/blog/posts';
import BlogTimelineCard from './BlogTimelineCard';

interface BlogTimelineProps {
    posts: BlogPostMeta[];
}

export default function BlogTimeline({ posts }: BlogTimelineProps) {
    const [visibleCount, setVisibleCount] = useState(6);
    const lastPostRef = useRef<HTMLDivElement>(null);

    // Lazy Loading mit Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && visibleCount < posts.length) {
                    setVisibleCount(prev => Math.min(prev + 6, posts.length));
                }
            },
            { threshold: 0.5, rootMargin: '100px' }
        );

        if (lastPostRef.current) {
            observer.observe(lastPostRef.current);
        }

        return () => observer.disconnect();
    }, [visibleCount, posts.length]);

    if (posts.length === 0) {
        return null;
    }

    const visiblePosts = posts.slice(0, visibleCount);

    return (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Timeline Container */}
            <div className="relative flex flex-col lg:grid lg:grid-cols-[1fr_2px_1fr] gap-8 lg:gap-16">
                {/* Central Timeline Line (Desktop only) */}
                <motion.div
                    className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{
                        transformOrigin: 'top',
                        background: 'linear-gradient(to bottom, transparent 0%, #dc2626 5%, #dc2626 95%, transparent 100%)'
                    }}
                />

                {/* Timeline Articles */}
                {visiblePosts.map((post, index) => {
                    const position = index % 2 === 0 ? 'left' : 'right';
                    const isLastPost = index === visiblePosts.length - 1;

                    return (
                        <div
                            key={post.slug}
                            ref={isLastPost ? lastPostRef : null}
                            className="relative"
                            style={{
                                gridColumn: position === 'left' ? '1' : '3',
                                gridRow: index + 1  // FIX: Jede Card eigene Row für versetztes Layout
                            }}
                        >
                            <BlogTimelineCard
                                post={post}
                                position={position}
                                index={index}
                            />
                        </div>
                    );
                })}

                {/* Loading Indicator (optional) */}
                {visibleCount < posts.length && (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc2626]"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
