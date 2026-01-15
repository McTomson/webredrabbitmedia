"use client";

import { Search } from 'lucide-react';

interface BlogHeroProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalPosts: number;
}

export default function BlogHero({ searchQuery, onSearchChange, totalPosts }: BlogHeroProps) {
    return (
        <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-8">
                    <div className="w-2 h-2 bg-[#dc2626] rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-[#dc2626] uppercase tracking-wider">
                        Red Rabbit Wissen
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#141414] leading-[1.1] mb-6 tracking-tight">
                    Entdecke Wissen,<br />das <span className="text-[#dc2626]">wirkt</span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Expertenwissen für erfolgreiche Online-Präsenzen. Von Webdesign über SEO bis Marketing.
                </p>

                {/* Search Field */}
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Wonach suchst du? (z.B. SEO, Webdesign, Marketing)"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-14 pr-6 py-6 bg-white border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-[#dc2626] focus:ring-4 focus:ring-red-50 transition-all shadow-lg hover:shadow-xl"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
                </div>

                {/* Meta Info */}
                <p className="mt-8 text-sm text-gray-500">
                    {totalPosts} Artikel • Regelmäßig neue Insights
                </p>
            </div>
        </div>
    );
}
