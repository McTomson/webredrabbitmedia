import Link from 'next/link';
import { AlertTriangle, Settings2, Inbox, CheckCircle2, Info, AlertOctagon } from 'lucide-react';
import type { HealthSignal, HealthLevel } from '@/lib/dashboard/health';
import { worstLevel } from '@/lib/dashboard/health';

// Shared Apple/macOS-style building blocks for the dashboard. Calm light surfaces,
// hairline borders, soft layered shadows, generous whitespace, tabular figures, one red accent.

// Reusable soft card shadow (two layers, very subtle — Apple-style depth).
const CARD = 'rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)]';

export const DASH_RANGES = [7, 28, 90] as const;

export function parseRange(value: string | undefined, fallback = 28): number {
    const n = Number(value);
    return (DASH_RANGES as readonly number[]).includes(n) ? n : fallback;
}

// Apple segmented control: light track, white selected pill with a soft shadow.
export function RangeSwitch({ basePath, active }: { basePath: string; active: number }) {
    return (
        <div className="inline-flex items-center rounded-[10px] bg-black/[0.05] p-0.5 text-[13px]">
            {DASH_RANGES.map((d) => (
                <Link
                    key={d}
                    href={`${basePath}?days=${d}`}
                    aria-current={d === active ? 'true' : undefined}
                    className={`rounded-lg px-3 py-1 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
                        d === active ? 'bg-white text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    {d} Tage
                </Link>
            ))}
        </div>
    );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`${CARD} ${className}`}>{children}</div>;
}

export function SectionCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <Card className="p-5 md:p-6">
            <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h2>
                {hint && <span className="text-xs text-slate-400">{hint}</span>}
            </div>
            {children}
        </Card>
    );
}

export function Kpi({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
    return (
        <Card className="p-5">
            <div className={`text-[30px] font-semibold leading-none tracking-tight tabular-nums ${accent ? 'text-red-600' : 'text-slate-900'}`}>{value}</div>
            <div className="mt-2.5 text-[13px] font-medium text-slate-600">{label}</div>
            {sub && <div className="mt-0.5 text-[11px] text-slate-400">{sub}</div>}
        </Card>
    );
}

export function StateNotice({ kind, message }: { kind: 'unconfigured' | 'error'; message: string }) {
    const isErr = kind === 'error';
    const Icon = isErr ? AlertTriangle : Settings2;
    return (
        <Card className="p-6">
            <div className="flex items-start gap-3.5">
                <span className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${isErr ? 'bg-amber-50 text-amber-600' : 'bg-black/[0.04] text-slate-500'}`}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                    <h3 className="font-semibold text-slate-900">{isErr ? 'Google-API meldet einen Fehler' : 'Google-Anbindung noch nicht eingerichtet'}</h3>
                    <p className="mt-1 break-words text-sm leading-relaxed text-slate-500">{message}</p>
                </div>
            </div>
        </Card>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Inbox className="h-7 w-7 text-slate-300" strokeWidth={1.75} />
            <p className="text-sm text-slate-400">{message}</p>
        </div>
    );
}

// Table primitives — quiet headers, tabular numeric columns, soft hover.
export function Th({ children, numeric = false }: { children: React.ReactNode; numeric?: boolean }) {
    return <th className={`py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400 ${numeric ? 'text-right' : 'text-left'}`}>{children}</th>;
}

export function Td({ children, numeric = false, strong = false }: { children: React.ReactNode; numeric?: boolean; strong?: boolean }) {
    return (
        <td className={`py-2.5 pr-4 ${numeric ? 'text-right tabular-nums' : 'text-left'} ${strong ? 'font-medium text-slate-900' : 'text-slate-500'}`}>{children}</td>
    );
}

// Health / alarm card. Level drives icon + colour; colour is always paired with an icon + text.
const LEVEL_STYLE: Record<HealthLevel, { Icon: typeof CheckCircle2; chip: string; dot: string; label: string }> = {
    ok: { Icon: CheckCircle2, chip: 'bg-green-50 text-green-600', dot: 'bg-green-500', label: 'Alles im grünen Bereich' },
    info: { Icon: Info, chip: 'bg-black/[0.04] text-slate-500', dot: 'bg-slate-400', label: 'Hinweise' },
    warn: { Icon: AlertTriangle, chip: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', label: 'Beobachten' },
    alert: { Icon: AlertOctagon, chip: 'bg-red-50 text-red-600', dot: 'bg-red-500', label: 'Handlungsbedarf' },
};

export function HealthCard({ signals }: { signals: HealthSignal[] }) {
    if (signals.length === 0) return null;
    const overall = worstLevel(signals);
    const head = LEVEL_STYLE[overall];
    return (
        <Card className="p-5 md:p-6">
            <div className="mb-5 flex items-center gap-2.5">
                <span className={`inline-block h-2 w-2 rounded-full ${head.dot}`} />
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">Gesundheit &amp; Alarm</h2>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${head.chip}`}>{head.label}</span>
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {signals.map((s) => {
                    const st = LEVEL_STYLE[s.level];
                    const Icon = st.Icon;
                    return (
                        <li key={s.id} className="flex items-start gap-3">
                            <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${st.chip}`}>
                                <Icon className="h-[15px] w-[15px]" strokeWidth={2.25} />
                            </span>
                            <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-slate-900">{s.title}</div>
                                <div className="text-[12px] leading-relaxed text-slate-500">{s.detail}</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}
