"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';

interface SidebarTOCProps {
    headings: Array<{ id: string; text: string; level: number }>;
}

/**
 * Sidebar Table of Contents Komponente
 * - Sticky beim Scrollen
 * - Scroll-Spy für aktive Section (wird in Schritt 7 implementiert)
 * - Smooth-Scroll zu Sections
 */
export function SidebarTOC({ headings }: SidebarTOCProps) {
    const [activeId, setActiveId] = useState<string>('');

    // Scroll-Spy wird in Schritt 7 implementiert
    useEffect(() => {
        // TODO: IntersectionObserver für Scroll-Spy
        // Wird in Schritt 7 hinzugefügt
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-red-600" />
                Inhaltsverzeichnis
            </h3>

            {/* TOC Navigation */}
            <nav className="space-y-2">
                {headings.map((heading) => (
                    <Link
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`
                            block text-sm py-2 px-3 rounded-lg transition-all
                            ${heading.level === 2 ? 'font-semibold' : 'pl-6 font-normal'}
                            ${activeId === heading.id
                                ? 'bg-red-50 text-red-600 border-l-2 border-red-600'
                                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                            }
                        `}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                                // Smooth scroll mit offset für sticky header
                                const yOffset = -100; // 96px header + padding
                                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                                setActiveId(heading.id);
                            }
                        }}
                    >
                        {heading.text}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
