import { AlertTriangle, Settings2, Inbox } from 'lucide-react';

// Shared light-mode building blocks for the dashboard tabs. Data-dense style:
// modest padding, clear hierarchy, tabular figures for numeric columns.

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
