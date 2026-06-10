// Canonical cluster -> name map for the content-engine scripts tree. Source of truth for
// cluster taxonomy: content-engine/topics/queue.yaml. lib/dashboard/overview.ts keeps its
// own copy for the Next app side (which cannot reach into the scripts tree cleanly).
export const CLUSTER_NAMES: Record<number, string> = {
    1: 'Strategie & Kosten',
    2: 'Technik & Performance',
    3: 'KI & Automatisierung',
    4: 'SEO & GEO',
    5: 'Design & UX',
    6: 'Recht & Sicherheit',
    7: 'Wartung & Analyse',
};
