"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/posts';

interface BlogTimelineCardProps {
    post: BlogPostMeta;
    position: 'left' | 'right';
    index: number;
}

export default function BlogTimelineCard({ post, position, index }: BlogTimelineCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('de-AT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <motion.article
            initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            <Link
                href={`/tipps/${post.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
                {/* Featured Image with Text Overlay */}
                <div className="relative aspect-video overflow-hidden">
                    {/* Background Image */}
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        priority={index < 2}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Text Content (Bottom Positioned) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                        <span className="inline-block bg-[#dc2626] px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider mb-4">
                            {post.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-3 line-clamp-2">
                            {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-white/80">
                            <span>{post.readingTime} Min. Lesezeit</span>
                            <span>•</span>
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Card Content Below Image */}
                <div className="p-6 md:p-8">
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                            Artikel lesen
                        </span>
                        <span className="flex items-center gap-2 text-[#dc2626] font-bold group-hover:translate-x-2 transition-transform duration-300">
                            Mehr erfahren
                            <ArrowRight size={18} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
