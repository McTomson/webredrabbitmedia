'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Search, BarChart3 } from 'lucide-react';

const TABS = [
    { href: '/dashboard', label: 'Überblick', icon: LayoutDashboard },
    { href: '/dashboard/search', label: 'Search Console', icon: Search },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export function DashboardTabs() {
    const pathname = usePathname();
    return (
        <nav className="border-b border-gray-200" aria-label="Dashboard-Bereiche">
            <ul className="-mb-px flex gap-1">
                {TABS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`group inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                    active
                                        ? 'border-red-600 text-red-700'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
                                }`}
                            >
                                <Icon className={`h-4 w-4 ${active ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
