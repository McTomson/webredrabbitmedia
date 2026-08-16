'use client';

import { Fragment, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { LEAD_STATUSES, type Lead } from '@/lib/leads/types';

const STATUS_STYLE: Record<string, string> = {
    neu: 'bg-red-50 text-red-700 ring-red-600/20',
    kontaktiert: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    gewonnen: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    verloren: 'bg-slate-100 text-slate-500 ring-slate-500/20',
};

const SOURCE_LABEL: Record<string, string> = {
    formular: 'Formular',
    popup: 'Popup',
    chatbot: 'Chatbot',
};

function fmtDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string>('alle');
    const [sourceFilter, setSourceFilter] = useState<string>('alle');
    const [busy, setBusy] = useState<string | null>(null);
    const [open, setOpen] = useState<string | null>(null);

    const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))), [leads]);

    const filtered = leads.filter(
        (l) => (statusFilter === 'alle' || l.status === statusFilter) && (sourceFilter === 'alle' || l.source === sourceFilter),
    );

    async function setStatus(id: string, status: string) {
        setBusy(id);
        try {
            const res = await fetch('/api/dashboard/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) router.refresh();
        } finally {
            setBusy(null);
        }
    }

    async function remove(id: string) {
        if (!confirm('Diesen Lead endgültig löschen?')) return;
        setBusy(id);
        try {
            const res = await fetch(`/api/dashboard/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (res.ok) router.refresh();
        } finally {
            setBusy(null);
        }
    }

    const chip = (active: boolean) =>
        `rounded-full px-3 py-1 text-xs font-medium transition ${
            active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`;

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <button className={chip(statusFilter === 'alle')} onClick={() => setStatusFilter('alle')}>
                    Alle
                </button>
                {LEAD_STATUSES.map((s) => (
                    <button key={s} className={chip(statusFilter === s)} onClick={() => setStatusFilter(s)}>
                        {s}
                    </button>
                ))}
                {sources.length > 1 && (
                    <span className="ml-2 flex flex-wrap gap-2">
                        <span className="self-center text-xs text-slate-300">|</span>
                        <button className={chip(sourceFilter === 'alle')} onClick={() => setSourceFilter('alle')}>
                            alle Quellen
                        </button>
                        {sources.map((s) => (
                            <button key={s} className={chip(sourceFilter === s)} onClick={() => setSourceFilter(s)}>
                                {SOURCE_LABEL[s] || s}
                            </button>
                        ))}
                    </span>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                            <th className="py-2 pr-3 font-medium">Datum</th>
                            <th className="py-2 pr-3 font-medium">Quelle</th>
                            <th className="py-2 pr-3 font-medium">Kontakt</th>
                            <th className="py-2 pr-3 font-medium">Leistung</th>
                            <th className="py-2 pr-3 font-medium">Status</th>
                            <th className="py-2 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((l) => (
                            <Fragment key={l.id}>
                                <tr className={`border-b border-slate-50 ${busy === l.id ? 'opacity-50' : ''}`}>
                                    <td className="py-2.5 pr-3 whitespace-nowrap tabular-nums text-slate-500">{fmtDate(l.created_at)}</td>
                                    <td className="py-2.5 pr-3">
                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                            {SOURCE_LABEL[l.source] || l.source}
                                        </span>
                                    </td>
                                    <td className="py-2.5 pr-3">
                                        <div className="font-medium text-slate-800">
                                            {l.name || '—'}
                                            {l.company ? <span className="text-slate-400"> · {l.company}</span> : null}
                                        </div>
                                        <div className="flex flex-wrap gap-x-3 text-xs text-slate-500">
                                            {l.email ? (
                                                <a href={`mailto:${l.email}`} className="hover:text-slate-900 hover:underline">
                                                    {l.email}
                                                </a>
                                            ) : null}
                                            {l.phone ? (
                                                <a href={`tel:${l.phone}`} className="hover:text-slate-900 hover:underline">
                                                    {l.phone}
                                                </a>
                                            ) : null}
                                        </div>
                                        {l.message ? (
                                            <button
                                                onClick={() => setOpen(open === l.id ? null : l.id)}
                                                className="mt-0.5 text-xs text-slate-400 hover:text-slate-700"
                                            >
                                                {open === l.id ? 'Nachricht verbergen' : 'Nachricht anzeigen'}
                                            </button>
                                        ) : null}
                                    </td>
                                    <td className="py-2.5 pr-3 text-slate-600">{l.service || '—'}</td>
                                    <td className="py-2.5 pr-3">
                                        <select
                                            value={LEAD_STATUSES.includes(l.status as never) ? l.status : 'neu'}
                                            onChange={(e) => setStatus(l.id, e.target.value)}
                                            disabled={busy === l.id}
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[l.status] || STATUS_STYLE.neu}`}
                                        >
                                            {LEAD_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-2.5 text-right">
                                        <button
                                            onClick={() => remove(l.id)}
                                            disabled={busy === l.id}
                                            aria-label="Lead löschen"
                                            className="rounded-md p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                                {open === l.id && l.message ? (
                                    <tr className="border-b border-slate-50">
                                        <td colSpan={6} className="px-1 pb-3 text-sm whitespace-pre-wrap text-slate-600">
                                            {l.message}
                                        </td>
                                    </tr>
                                ) : null}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">Keine Leads für diesen Filter.</p>
                ) : null}
            </div>
        </div>
    );
}
