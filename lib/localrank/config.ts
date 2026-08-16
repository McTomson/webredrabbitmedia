// Static configuration for the Local-Rank tracker. Business identity, the Vienna
// grid geometry, and the buyer keywords we measure. Secrets (DataForSEO login,
// GBP place id) come from env — never hard-coded here.

/**
 * Business centre = Red Rabbit GmbH, Habsburgergasse 8, 1010 Wien.
 * Geocode VERIFIED 2026-08-16 (see content-engine/local-rank/README.md for sources).
 * Overridable via RR_LOCALRANK_LAT / RR_LOCALRANK_LNG for testing other centres.
 */
export const CENTER = {
    lat: Number(process.env.RR_LOCALRANK_LAT ?? '48.208590'),
    lng: Number(process.env.RR_LOCALRANK_LNG ?? '16.368577'),
    label: 'Red Rabbit GmbH · Habsburgergasse 8, 1010 Wien',
};

/** 7x7 grid, ~600 m spacing → ~3.6 km across, dense over the 1st district + inner belt. */
export const GRID_SIZE = 7;
export const SPACING_KM = 0.6;
/** How deep to scan the Local Finder before calling a point "unranked". */
export const SCAN_DEPTH = 20;

/** Buyer-intent keywords for Vienna web design. Order = display order. */
export const KEYWORDS = [
    'webdesign wien',
    'webagentur wien',
    'webdesigner wien',
    'website erstellen lassen wien',
] as const;

/** How we recognise our own listing in the Local Finder results. */
export const BUSINESS = {
    /** Google Place ID of the GBP listing — from env (used for exact matching + review deep link). */
    placeId: process.env.RR_GBP_PLACE_ID || '',
    /** Fallback name match when no place id is set (case-insensitive substring). */
    nameMatch: 'red rabbit',
};

export const GA_LANGUAGE = 'de';
export const GA_COUNTRY = 'Austria';
