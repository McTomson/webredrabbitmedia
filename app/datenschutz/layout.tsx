import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | Red Rabbit Media",
    description: "Informationen zum Schutz Ihrer persönlichen Daten bei Red Rabbit Media",
    robots: "index, follow",
};

export default function DatenschutzLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
