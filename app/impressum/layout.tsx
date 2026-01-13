import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Impressum | Red Rabbit Media",
    description: "Rechtliche Informationen über Red Rabbit Media - Webdesign & digitale Dienstleistungen aus Wien",
    robots: "index, follow",
};

export default function ImpressumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
