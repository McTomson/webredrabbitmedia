"use client";

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

// TypeScript interface for consent
interface ConsentData {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: string;
}

// TypeScript declaration for gtag
declare global {
    interface Window {
        gtag: (...args: Array<string | object | Date>) => void;
    }
}

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    // OPT-OUT-Modell (Thomas 2026-08-12, NICHT auf Opt-in zuruecksetzen):
    // Tracking ist ab Seitenaufruf aktiv (Consent-Mode-Default 'granted' im <head>,
    // Clarity laedt sofort). Der Banner ist ein HINWEIS mit ehrlichem Ablehn-/
    // Verwalten-Weg. Die Toggles sind daher per Default AN (spiegeln den Ist-Zustand);
    // "Nur notwendige"/"Alle ablehnen" schaltet WIRKLICH ab (rejectAll -> denied +
    // rr:consent:false -> ClarityLoader stoppt Clarity).
    const [preferences, setPreferences] = useState({
        necessary: true,  // Always true, can't be disabled
        analytics: true,  // Opt-out: Default an, bis der Nutzer ablehnt
        marketing: true   // Opt-out: Default an, bis der Nutzer ablehnt
    });

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem('redrabbit-cookie-consent');
        if (!cookieConsent) {
            setShowBanner(true);
        }
    }, []);

    // Wir veroeffentlichen die Banner-Hoehe als CSS-Variable am <html>. Der Chat-FAB
    // (unten rechts, gleiche Ecke) hebt sich um genau diese Hoehe an -> bleibt IMMER
    // sichtbar (auch waehrend der Banner offen ist) und ueberdeckt trotzdem nichts.
    // ResizeObserver haelt die Hoehe aktuell (einfach <-> Detailansicht, Umbruch).
    useEffect(() => {
        const root = document.documentElement;
        const el = rootRef.current;
        if (!showBanner || !el) {
            root.style.setProperty('--rr-cookiebanner-h', '0px');
            return;
        }
        const setH = () => root.style.setProperty('--rr-cookiebanner-h', `${el.offsetHeight}px`);
        setH();
        const ro = new ResizeObserver(setH);
        ro.observe(el);
        return () => {
            ro.disconnect();
            root.style.setProperty('--rr-cookiebanner-h', '0px');
        };
    }, [showBanner]);

    // GTM/GA Consent-Update (Consent Mode v2). Analytics steuert analytics_storage,
    // Marketing steuert ALLE drei Google-Ads-Signale (ad_storage, ad_user_data,
    // ad_personalization). Zusaetzlich ein 'rr:consent'-Event fuer Consent-gesteuerte
    // Loader (z.B. Microsoft Clarity via ClarityLoader).
    const updateGTMConsent = (consent: ConsentData) => {
        if (typeof window !== 'undefined') {
            if (window.gtag) {
                const marketing = consent.marketing ? 'granted' : 'denied';
                window.gtag('consent', 'update', {
                    'analytics_storage': consent.analytics ? 'granted' : 'denied',
                    'ad_storage': marketing,
                    'ad_user_data': marketing,
                    'ad_personalization': marketing
                });
            }
            window.dispatchEvent(new CustomEvent('rr:consent', { detail: consent }));
        }
    };

    const acceptAll = () => {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    const acceptSelected = () => {
        const consent = {
            ...preferences,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    const rejectAll = () => {
        const consent = {
            necessary: true,
            analytics: false, // Jetzt wirklich false
            marketing: false, // Jetzt wirklich false
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('redrabbit-cookie-consent', JSON.stringify(consent));
        updateGTMConsent(consent); // GTM informieren
        setShowBanner(false);
    };

    if (!showBanner) return null;

    // Optik: minimalistisch + markengerecht (Instrument Sans, --rr-Tokens, scharfe
    // Kanten wie das Site-Chrome), grosse Tap-Targets (min-h 48px) fuers Handy.
    // Die Consent-LOGIK oben bleibt unberuehrt.
    const uiFont = { fontFamily: 'var(--rr-font-ui, system-ui, sans-serif)' };

    const Toggle = ({
        checked,
        onChange,
        label,
    }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
        <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
            <input
                type="checkbox"
                checked={checked}
                aria-label={label}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-[#d9d9d3] transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-[color:var(--rr-red,#f12032)] peer-checked:after:translate-x-full peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--rr-red,#f12032)] peer-focus-visible:ring-offset-2"></div>
        </label>
    );

    return (
        <div
            ref={rootRef}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--rr-line,#e4e4e0)] bg-white shadow-[0_-10px_40px_rgba(20,26,35,0.10)]"
            style={uiFont}
            role="dialog"
            aria-label="Cookie-Hinweis"
        >
            <div className="mx-auto max-w-6xl px-5 py-4 sm:px-6 sm:py-5">
                {!showDetails ? (
                    // Minimalistischer Hinweis
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <p className="text-[13.5px] leading-relaxed text-[color:var(--rr-ink-soft,#5a5e68)] sm:max-w-[62ch]">
                            Wir nutzen Cookies für Statistik und Marketing, damit die Seite besser wird &ndash; du entscheidest.{' '}
                            <Link
                                href="/datenschutz/"
                                className="font-medium text-[color:var(--rr-ink,#23262e)] underline underline-offset-2 transition-colors hover:text-[color:var(--rr-red,#f12032)]"
                            >
                                Datenschutz
                            </Link>
                        </p>

                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                            <button
                                onClick={() => setShowDetails(true)}
                                className="order-3 inline-flex min-h-[44px] items-center justify-center text-[14px] font-medium text-[color:var(--rr-ink-soft,#5a5e68)] underline underline-offset-2 transition-colors hover:text-[color:var(--rr-ink,#23262e)] sm:order-1 sm:min-h-0"
                            >
                                Einstellungen
                            </button>
                            <button
                                onClick={rejectAll}
                                className="order-2 min-h-[48px] border border-[color:var(--rr-ink,#23262e)] px-5 text-[15px] font-medium text-[color:var(--rr-ink,#23262e)] transition-colors hover:bg-[color:var(--rr-ink,#23262e)] hover:text-white"
                            >
                                Nur notwendige
                            </button>
                            <button
                                onClick={acceptAll}
                                className="order-1 min-h-[48px] bg-[color:var(--rr-red,#f12032)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[color:var(--rr-red-deep,#c81222)] sm:order-3"
                            >
                                Alle akzeptieren
                            </button>
                        </div>
                    </div>
                ) : (
                    // Einstellungen
                    <div className="mx-auto max-w-3xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3
                                className="text-[19px] font-semibold text-[color:var(--rr-ink,#23262e)]"
                                style={{ fontFamily: 'var(--rr-font-display, var(--rr-font-ui), sans-serif)' }}
                            >
                                Cookie-Einstellungen
                            </h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                aria-label="Schließen"
                                className="flex h-10 w-10 items-center justify-center text-[color:var(--rr-ink-soft,#5a5e68)] transition-colors hover:text-[color:var(--rr-ink,#23262e)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Necessary */}
                            <div className="border border-[color:var(--rr-line,#e4e4e0)] p-4">
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <h4 className="text-[15px] font-semibold text-[color:var(--rr-ink,#23262e)]">Technisch notwendig</h4>
                                    <span className="text-[12px] font-medium text-[color:var(--rr-ink-soft,#5a5e68)]">Immer aktiv</span>
                                </div>
                                <p className="text-[13px] leading-relaxed text-[color:var(--rr-ink-soft,#5a5e68)]">
                                    Für die Grundfunktionen der Seite erforderlich. Lässt sich nicht deaktivieren.
                                </p>
                            </div>

                            {/* Analytics */}
                            <div className="border border-[color:var(--rr-line,#e4e4e0)] p-4">
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <h4 className="text-[15px] font-semibold text-[color:var(--rr-ink,#23262e)]">Statistik</h4>
                                    <Toggle
                                        checked={preferences.analytics}
                                        onChange={(v) => setPreferences((prev) => ({ ...prev, analytics: v }))}
                                        label="Statistik-Cookies erlauben"
                                    />
                                </div>
                                <p className="text-[13px] leading-relaxed text-[color:var(--rr-ink-soft,#5a5e68)]">
                                    Hilft uns anonym zu verstehen, wie die Seite genutzt wird.
                                </p>
                            </div>

                            {/* Marketing */}
                            <div className="border border-[color:var(--rr-line,#e4e4e0)] p-4">
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <h4 className="text-[15px] font-semibold text-[color:var(--rr-ink,#23262e)]">Marketing</h4>
                                    <Toggle
                                        checked={preferences.marketing}
                                        onChange={(v) => setPreferences((prev) => ({ ...prev, marketing: v }))}
                                        label="Marketing-Cookies erlauben"
                                    />
                                </div>
                                <p className="text-[13px] leading-relaxed text-[color:var(--rr-ink-soft,#5a5e68)]">
                                    Für relevante Anzeigen und die Messung unserer Kampagnen.
                                </p>
                            </div>
                        </div>

                        {/* Aktionen */}
                        <div className="mt-5 flex flex-col gap-2.5 border-t border-[color:var(--rr-line,#e4e4e0)] pt-5 sm:flex-row sm:justify-end sm:gap-3">
                            <button
                                onClick={rejectAll}
                                className="order-3 min-h-[48px] border border-[color:var(--rr-ink,#23262e)] px-5 text-[15px] font-medium text-[color:var(--rr-ink,#23262e)] transition-colors hover:bg-[color:var(--rr-ink,#23262e)] hover:text-white sm:order-1"
                            >
                                Alle ablehnen
                            </button>
                            <button
                                onClick={acceptSelected}
                                className="order-2 min-h-[48px] border border-[color:var(--rr-ink,#23262e)] px-5 text-[15px] font-medium text-[color:var(--rr-ink,#23262e)] transition-colors hover:bg-[color:var(--rr-ink,#23262e)] hover:text-white"
                            >
                                Auswahl speichern
                            </button>
                            <button
                                onClick={acceptAll}
                                className="order-1 min-h-[48px] bg-[color:var(--rr-red,#f12032)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[color:var(--rr-red-deep,#c81222)] sm:order-3"
                            >
                                Alle akzeptieren
                            </button>
                        </div>

                        <p className="mt-4 text-center text-[12px] leading-relaxed text-[color:var(--rr-ink-soft,#5a5e68)]">
                            Mehr in der{' '}
                            <Link
                                href="/datenschutz/"
                                className="underline underline-offset-2 transition-colors hover:text-[color:var(--rr-red,#f12032)]"
                            >
                                Datenschutzerklärung
                            </Link>
                            . Du kannst deine Einstellungen jederzeit ändern.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CookieBanner;
