"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isRelaunchPath } from '@/lib/relaunch/routes';
// CSS statisch (winzig, ~KB); das schwere aos-JS wird unten dynamisch geladen.
import 'aos/dist/aos.css';

// AOS nur fuer die ALT-Site laden. Die Relaunch-Routen nutzen eigene Animationen
// (Lenis/RevealOnScroll) und KEIN data-aos -> dort waere AOS totes JS+CSS (Perf,
// Thomas 04.08.). aos + CSS werden erst im Effect dynamisch importiert, liegen
// also nicht mehr im Initial-Bundle der Relaunch-Seiten.
const AOSInit = () => {
    const pathname = usePathname();
    useEffect(() => {
        // Relaunch-Seiten (finale Root-Pfade, siehe lib/relaunch/routes.ts) laden
        // KEIN AOS. Die verbleibenden Alt-/Dev-Seiten behalten es.
        if (isRelaunchPath(pathname)) return;
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
