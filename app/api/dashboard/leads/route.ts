import { NextRequest, NextResponse } from 'next/server';
import { updateLead, deleteLead } from '@/lib/leads/store';
import { normalizeStatus } from '@/lib/leads/types';

export const dynamic = 'force-dynamic';

// Constant-time-ish compare (length-independent enough for this use).
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

// Verify the same dashboard Basic-Auth the middleware enforces. Host-independent, so
// this write endpoint is protected even if reached on the main host. Local dev (no
// DASHBOARD_PASSWORD set) is allowed, mirroring the middleware's checkBasicAuth.
function authorized(req: NextRequest): boolean {
    const password = process.env.DASHBOARD_PASSWORD;
    if (!password) return true; // local dev
    const header = req.headers.get('authorization') || '';
    if (!header.startsWith('Basic ')) return false;
    let decoded = '';
    try {
        decoded = atob(header.slice(6));
    } catch {
        return false;
    }
    const idx = decoded.indexOf(':');
    if (idx < 0) return false;
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    return safeEqual(user, process.env.DASHBOARD_USER || 'redrabbit') && safeEqual(pass, password);
}

export async function PATCH(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    let body: { id?: string; status?: string; note?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'invalid json' }, { status: 400 });
    }
    if (!body.id) return NextResponse.json({ error: 'id fehlt' }, { status: 400 });

    const patch: { status?: 'neu' | 'kontaktiert' | 'gewonnen' | 'verloren'; note?: string } = {};
    if (body.status !== undefined) {
        const s = normalizeStatus(body.status);
        if (!s) return NextResponse.json({ error: 'ungültiger status' }, { status: 400 });
        patch.status = s;
    }
    if (body.note !== undefined) patch.note = String(body.note).slice(0, 2000);
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nichts zu ändern' }, { status: 400 });

    try {
        await updateLead(body.id, patch);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('updateLead fehlgeschlagen:', e);
        return NextResponse.json({ error: 'update fehlgeschlagen' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id fehlt' }, { status: 400 });
    try {
        await deleteLead(id);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('deleteLead fehlgeschlagen:', e);
        return NextResponse.json({ error: 'delete fehlgeschlagen' }, { status: 500 });
    }
}
