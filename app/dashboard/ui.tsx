import Link from 'next/link';
import { AlertTriangle, Settings2, Inbox, CheckCircle2, Info, AlertOctagon } from 'lucide-react';
import type { HealthSignal, HealthLevel } from '@/lib/dashboard/health';
import { worstLevel } from '@/lib/dashboard/health';

// Shared light-mode building blocks for the dashboard tabs. Data-dense style:
// modest padding, clear hierarchy, tabular figures for numeric columns.

// Single source of truth for the time-range options — used both for the switch UI
// and for validating the ?days= query param on each tab (keeps the allowlist in one place).
export const DASH_RANGES = [7, 28, 90] as const;

export function parseRange(value: string | undefined, fallback = 28): number {
    const n = Number(value);
    return (DASH_RANGES as readonly number[]).includes(n) ? n : fallback;
}

export function RangeSwitch({ basePath, active }: { basePath: string; active: number }) {
    return (
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm">
            {DASH_RANGES.map((d) => (
                <Link
                    key={d}
                    href={`${basePath}?days=${d}`}
                    aria-current={d === active ? 'true' : undefined}
                    className={`rounded-md px-3 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${d === active ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    {d} Tage
                </Link>
            ))}
        </div>
    );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function SectionCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <Card className="p-5">
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-bold text-slate-900">{title}</h2>
                {hint && <span className="text-xs text-slate-400">{hint}</span>}
            </div>
            {children}
        </Card>
    );
}

export function Kpi({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
    return (
        <Card className="p-5">
            <div className={`text-3xl font-bold tabular-nums ${accent ? 'text-red-700' : 'text-slate-900'}`}>{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
            {sub && <div className="mt-0.5 text-xs text-slate-400">{sub}</div>}
        </Card>
    );
}

// Friendly notice for "credentials missing" / API error so a tab never hard-crashes.
export function StateNotice({ kind, message }: { kind: 'unconfigured' | 'error'; message: string }) {
    const isErr = kind === 'error';
    const Icon = isErr ? AlertTriangle : Settings2;
    return (
        <Card className="p-6">
            <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${isErr ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="h-5 w-5" />
                </span>
                <div>
                    <h3 className="font-semibold text-slate-900">{isErr ? 'Google-API meldet einen Fehler' : 'Google-Anbindung noch nicht eingerichtet'}</h3>
                    <p className="mt-1 break-words text-sm text-slate-600">{message}</p>
                </div>
            </div>
        </Card>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Inbox className="h-7 w-7 text-slate-300" />
            <p className="text-sm text-slate-500">{message}</p>
        </div>
    );
}

// Table primitives with sane defaults for numeric, right-aligned, tabular columns.
export function Th({ children, numeric = false }: { children: React.ReactNode; numeric?: boolean }) {
    return <th className={`py-2 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${numeric ? 'text-right' : 'text-left'}`}>{children}</th>;
}

export function Td({ children, numeric = false, strong = false }: { children: React.ReactNode; numeric?: boolean; strong?: boolean }) {
    return (
        <td className={`py-2 pr-4 ${numeric ? 'text-right tabular-nums' : 'text-left'} ${strong ? 'font-medium text-slate-900' : 'text-slate-600'}`}>{children}</td>
    );
}

// Health / alarm card (dead-man + penalty signals). Level drives icon + colour;
// info is never alarming, alert is the loudest. Colour is paired with an icon + text
// so the state is never conveyed by colour alone.
const LEVEL_STYLE: Record<HealthLevel, { Icon: typeof CheckCircle2; chip: string; dot: string; label: string }> = {
    ok: { Icon: CheckCircle2, chip: 'bg-green-50 text-green-700', dot: 'bg-green-500', label: 'Alles im grünen Bereich' },
    info: { Icon: Info, chip: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', label: 'Hinweise' },
    warn: { Icon: AlertTriangle, chip: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: 'Beobachten' },
    alert: { Icon: AlertOctagon, chip: 'bg-red-50 text-red-700', dot: 'bg-red-500', label: 'Handlungsbedarf' },
};

export function HealthCard({ signals }: { signals: HealthSignal[] }) {
    if (signals.length === 0) return null;
    const overall = worstLevel(signals);
    const head = LEVEL_STYLE[overall];
    return (
        <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${head.dot}`} />
                <h2 className="font-bold text-slate-900">Gesundheit &amp; Alarm</h2>
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${head.chip}`}>{head.label}</span>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {signals.map((s) => {
                    const st = LEVEL_STYLE[s.level];
                    const Icon = st.Icon;
                    return (
                        <li key={s.id} className="flex items-start gap-2.5">
                            <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${st.chip}`}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                                <div className="text-xs leading-relaxed text-slate-500">{s.detail}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}
