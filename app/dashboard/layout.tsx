import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardTabs } from './DashboardTabs';

// Internal, local-only dashboard. The guard lives in the shared layout so it covers
// every sub-route (overview / search / analytics) in one place. Hidden on production
// (Vercel) unless DASHBOARD_ENABLED is set — it carries GSC/GA4 data and must never be public.
export const metadata: Metadata = {
    title: 'Content-Engine Dashboard',
    robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV === 'production' && !process.env.DASHBOARD_ENABLED) {
        notFound();
    }
    return (
        <div className="min-h-dvh bg-[#F8FAFC] text-slate-800">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <header className="mb-5">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
                        <h1 className="text-xl font-bold text-slate-900">Content-Engine Dashboard</h1>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">lokal</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Red Rabbit Media · Sichtbarkeit, Suche und Traffic auf einen Blick.</p>
                </header>
                <DashboardTabs />
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
}
