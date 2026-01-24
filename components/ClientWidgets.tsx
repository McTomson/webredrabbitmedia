"use client";

import dynamic from 'next/dynamic';

const FloatingWhatsApp = dynamic(() => import('@/components/FloatingWhatsApp'), {
    ssr: false
});
const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
    ssr: false
});
const AccessibilityWidget = dynamic(() => import('@/components/AccessibilityWidget'), {
    ssr: false
});

const ClientWidgets = () => {
    return (
        <>
            <AccessibilityWidget />
            <CookieBanner />
            <FloatingWhatsApp />
        </>
    );
};

export default ClientWidgets;
