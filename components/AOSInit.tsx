"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// CSS statisch (winzig, ~KB); das schwere aos-JS wird unten dynamisch geladen.
import 'aos/dist/aos.css';

// AOS nur fuer die ALT-Site laden. Die Relaunch-Routen (/relaunch-preview/*)
// nutzen eigene Animationen (Lenis/RevealOnScroll) und KEIN data-aos -> dort
// waere AOS totes JS+CSS (Perf, Thomas 04.08.). aos + CSS werden erst im Effect
// dynamisch importiert, liegen also nicht mehr im Initial-Bundle der Relaunch-
// Seiten. Die Alt-Site (auch die Root-Homepage) bleibt unveraendert.
const AOSInit = () => {
    const pathname = usePathname();
    useEffect(() => {
        // Relaunch erkennen: entweder direkter /relaunch-preview-Pfad ODER der
        // v2-Test-Host (dort ist ALLES Relaunch, aber die Middleware versteckt das
        // /relaunch-preview-Praefix in der URL). Die Alt-Site (web.redrabbit.media)
        // hat keinen dieser Marker -> AOS bleibt dort aktiv.
        const isRelaunch =
            (pathname && pathname.startsWith('/relaunch-preview')) ||
            (typeof window !== 'undefined' && window.location.host.startsWith('v2.'));
        if (isRelaunch) return;
        let cancelled = false;
        (async () => {
            const AOS = (await import('aos')).default;
            if (cancelled) return;
            const isMobile = window.innerWidth < 768;
            AOS.init({
                once: true,
                duration: 800,
                easing: 'ease-out-cubic',
                offset: isMobile ? 50 : 100, // Trigger earlier on mobile for smoother feel
            });
        })();
        return () => { cancelled = true; };
    }, [pathname]);

    return null;
};

export default AOSInit;
