import type { Metadata } from "next";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import CookieEinstellungenPreview from "@/components/subpages/CookieEinstellungenPreview";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "@/components/subpages/legal-preview.css";

/**
 * Cookie-Einstellungen im Relaunch-Look (Preview, noindex). Texte und
 * Consent-Logik 1:1 aus app/cookie-einstellungen/CookieEinstellungenClient.tsx
 * (siehe components/subpages/CookieEinstellungenPreview.tsx).
 */
export const metadata: Metadata = {
  title: "Cookie-Einstellungen · Red Rabbit Media",
  description: "Verwalte deine Datenschutz-Präferenzen.",
  robots: { index: false, follow: false },
};

export default function CookieEinstellungenPreviewPage() {
  return (
    <>
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: "transparent" }}
      >
        <RelaunchMenu />
      </div>

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil. */}
      <CornerLogo />

      <div className="rrl">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Instrument+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
        />

        <CookieEinstellungenPreview />
      </div>

      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: "transparent" }}
      >
        <FooterReassembly />
      </div>
    </>
  );
}
