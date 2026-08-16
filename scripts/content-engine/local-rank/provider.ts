// Rank providers for the local-rank puller. A provider answers one question:
// "at this lat/lng, for this keyword, what organic position is our listing?"
//
// - DataForSeoProvider  → real data via DataForSEO Live Maps SERP (fail-closed
//   without credentials; ToS-safe — DataForSEO handles the scraping/proxying).
// - FixtureProvider     → deterministic synthetic ranks for the demo snapshot and
//   for testing the pipeline end-to-end with no network and no cost.
//
// Verified 2026-08-16 against docs.dataforseo.com:
//   POST https://api.dataforseo.com/v3/serp/google/maps/live/advanced (HTTP Basic)
//   body: [{ keyword, location_coordinate: "lat,lng,zoom", language_code, device }]
//   response: tasks[].result[].items[] with rank_absolute + type "maps_search"
//   match business on place_id / cid / title. Cost ~$0.002 per SERP.

export interface RankResult {
    /** Organic Local-Finder position (1-based) of our listing, or null if not found within scanDepth. */
    rank: number | null;
    /** What we matched on (for debugging / audit). */
    matched?: { title?: string; placeId?: string; cid?: string };
}

export interface RankProvider {
    readonly name: string;
    fetchRank(keyword: string, lat: number, lng: number): Promise<RankResult>;
}

export interface DfsOptions {
    scanDepth: number;
    languageCode: string;
    device?: 'desktop' | 'mobile';
    /** Business Place ID for exact matching (preferred). */
    placeId?: string;
    /** cid for matching when place_id is unavailable. */
    cid?: string;
    /** Case-insensitive name substring fallback when no id matches. */
    nameMatch: string;
    /** Map zoom passed in location_coordinate (default 15). */
    zoom?: number;
}

interface DfsItem {
    type?: string;
    rank_absolute?: number;
    title?: string;
    place_id?: string;
    cid?: string;
}

const DFS_ENDPOINT = 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced';

export class DataForSeoProvider implements RankProvider {
    readonly name = 'dataforseo';
    private authHeader: string;

    constructor(login: string, password: string, private opts: DfsOptions) {
        if (!login || !password) throw new Error('DataForSeoProvider: login/password required (fail-closed).');
        this.authHeader = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
    }

    async fetchRank(keyword: string, lat: number, lng: number): Promise<RankResult> {
        const zoom = this.opts.zoom ?? 15;
        const body = [
            {
                keyword,
                location_coordinate: `${lat.toFixed(7)},${lng.toFixed(7)},${zoom}z`,
                language_code: this.opts.languageCode,
                device: this.opts.device ?? 'desktop',
                depth: Math.min(Math.max(this.opts.scanDepth, 20), 100),
            },
        ];

        const res = await fetch(DFS_ENDPOINT, {
            method: 'POST',
            headers: { Authorization: this.authHeader, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`DataForSEO HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
        const json = (await res.json()) as { tasks?: Array<{ status_code?: number; status_message?: string; result?: Array<{ items?: DfsItem[] }> }> };

        const task = json.tasks?.[0];
        if (!task || (task.status_code && task.status_code >= 40000)) {
            throw new Error(`DataForSEO task error: ${task?.status_code} ${task?.status_message ?? 'unknown'}`);
        }
        const items = task.result?.[0]?.items ?? [];

        // Organic Local-Finder list only (drop ads), ordered by absolute rank.
        const organic = items
            .filter((it) => (it.type ?? 'maps_search') === 'maps_search')
            .sort((a, b) => (a.rank_absolute ?? 999) - (b.rank_absolute ?? 999));

        const idx = organic.findIndex((it) => this.isOurs(it));
        if (idx < 0) return { rank: null };
        const organicRank = idx + 1; // 1-based position within the organic list
        if (organicRank > this.opts.scanDepth) return { rank: null };
        const it = organic[idx];
        return { rank: organicRank, matched: { title: it.title, placeId: it.place_id, cid: it.cid } };
    }

    private isOurs(it: DfsItem): boolean {
        if (this.opts.placeId && it.place_id) return it.place_id === this.opts.placeId;
        if (this.opts.cid && it.cid) return it.cid === this.opts.cid;
        return (it.title ?? '').toLowerCase().includes(this.opts.nameMatch.toLowerCase());
    }
}

/**
 * Deterministic synthetic provider: rank improves near the centre and degrades
 * with distance, with a small per-keyword offset. No network, no cost. Used to
 * generate the demo snapshot and to test the puller pipeline.
 */
export class FixtureProvider implements RankProvider {
    readonly name = 'demo';
    constructor(private center: { lat: number; lng: number }, private scanDepth: number) {}

    async fetchRank(keyword: string, lat: number, lng: number): Promise<RankResult> {
        const dLat = (lat - this.center.lat) * 110.574;
        const dLng = (lng - this.center.lng) * 110.574 * Math.cos((this.center.lat * Math.PI) / 180);
        const distKm = Math.hypot(dLat, dLng);
        // per-keyword difficulty offset, stable per keyword string
        const offset = (hash(keyword) % 5); // 0..4
        const raw = Math.round(1 + distKm * 4 + offset);
        const rank = raw > this.scanDepth ? null : raw;
        return { rank, matched: rank != null ? { title: 'Red Rabbit GmbH (demo)' } : undefined };
    }
}

function hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}
