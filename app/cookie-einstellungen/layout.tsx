import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie-Einstellungen | Red Rabbit Media",
    description: "Verwalte deine Cookie-Einstellungen und Datenschutz-Präferenzen",
    robots: "noindex, nofollow", // Cookie-Seiten sollten nicht indexiert werden
};

export default function CookieEinstellungenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
