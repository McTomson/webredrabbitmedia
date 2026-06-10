'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';

// Site-wide behavioural events, sent through the global GA4/GTM setup, so they apply to
// every page (articles included) without per-page wiring:
//  - scroll_depth: fires once per page at 25/50/75/100% (engagement / how far they read)
//  - outbound_click: a click on a link to another domain (where they go next)
// Conversion (generate_lead) and CTA intent (contact_form_open) live with the forms.
// Mounted once in the root layout. Resets its scroll milestones on client navigation.
export default function AnalyticsListener() {
    const pathname = usePathname();

    useEffect(() => {
        const reached = new Set<number>();
        const milestones = [25, 50, 75, 100];

        const onScroll = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;
            const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
            for (const m of milestones) {
                if (pct >= m && !reached.has(m)) {
                    reached.add(m);
                    try {
                        sendGAEvent('event', 'scroll_depth', { percent: m, page_path: pathname });
                    } catch {
                        /* never break scrolling */
                    }
                }
            }
        };

        const onClick = (e: MouseEvent) => {
            const a = (e.target as HTMLElement | null)?.closest('a');
            const href = a?.getAttribute('href');
            if (!href || !/^https?:\/\//i.test(href)) return; // internal/relative or non-link
            try {
                const url = new URL(href, window.location.href);
                if (url.host && url.host !== window.location.host) {
                    sendGAEvent('event', 'outbound_click', { url: url.href, page_path: pathname });
                }
            } catch {
                /* malformed URL, ignore */
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('click', onClick, true);
        onScroll(); // catch short pages already fully in view
        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('click', onClick, true);
        };
    }, [pathname]);

    return null;
}
