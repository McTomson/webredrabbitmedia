import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AGB | Red Rabbit Media",
    description: "Allgemeine Geschäftsbedingungen der Red Rabbit GmbH",
    robots: "index, follow",
};

export default function AGBLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
