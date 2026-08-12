import type { Metadata } from "next";

// QA-/Test-Route: nie indexieren (Muster wie /morph-lab und /design-system).
// page.tsx ist "use client" und kann selbst kein metadata exportieren, daher
// setzt dieses Layout das robots-noindex fuer die Route.
export const metadata: Metadata = {
  title: "Sculpture-Test — Skulptur-Modul QA (intern)",
  robots: { index: false, follow: false },
};

export default function SculptureTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
