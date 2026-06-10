'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3 } from 'lucide-react';

const NAV = [
    { href: '/dashboard', label: 'Überblick', icon: LayoutDashboard },
    { href: '/dashboard/search', label: 'Search Console', icon: Search },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

// macOS-style sidebar nav on desktop; horizontal scroll row on mobile.
// Selected row = white pill + soft shadow + red accent, the rest quiet slate.
export function DashboardNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Dashboard-Bereiche">
            <ul className="flex gap-1 overflow-x-auto px-4 pb-3 md:flex-col md:overflow-visible md:px-0 md:pb-0">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <li key={href} className="flex-shrink-0">
                            <Link
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
                                    active
                                        ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/5'
                                        : 'text-slate-500 hover:bg-black/[0.04] hover:text-slate-800'
                                }`}
                            >
                                <Icon className={`h-[18px] w-[18px] ${active ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-500'}`} strokeWidth={2} />
                                <span className="whitespace-nowrap">{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
