import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardNav } from './DashboardTabs';

// Internal, local-only dashboard. The guard lives in the shared layout so it covers
// every sub-route (overview / search / analytics) in one place. Hidden on production
// (Vercel) unless DASHBOARD_ENABLED is set — it carries GSC/GA4 data and must never be public.
export const metadata: Metadata = {
    title: 'Content-Engine Dashboard',
    robots: { index: false, follow: false },
};

// Apple/macOS feel: SF Pro via the system stack (renders natively on the owner's Mac),
// Apple off-white canvas, hairline dividers, a quiet left sidebar.
const APPLE_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV === 'production' && !process.env.DASHBOARD_ENABLED) {
        notFound();
    }
    return (
        <div className="min-h-dvh bg-[#f5f5f7] text-slate-900 antialiased" style={{ fontFamily: APPLE_FONT }}>
            <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
                {/* Sidebar (desktop) / top bar (mobile) */}
                <aside className="border-b border-black/[0.06] md:min-h-dvh md:w-60 md:flex-shrink-0 md:border-b-0 md:border-r">
                    <div className="px-5 pb-1 pt-6 md:pb-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-[11px] font-bold text-white">RR</span>
                            <span className="text-[15px] font-semibold tracking-tight text-slate-900">Dashboard</span>
                            <span className="ml-auto rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">lokal</span>
                        </div>
                        <p className="mt-2 hidden text-[12px] leading-snug text-slate-400 md:block">Red Rabbit Media · Sichtbarkeit, Suche und Traffic.</p>
                    </div>
                    <DashboardNav />
                </aside>

                {/* Content */}
                <main className="min-w-0 flex-1 px-5 py-7 md:px-10 md:py-10">{children}</main>
            </div>
        </div>
    );
}
