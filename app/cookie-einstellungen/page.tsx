import type { Metadata } from "next";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import BackToTop from "@/components/relaunch/BackToTop";
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
  alternates: { canonical: "/cookie-einstellungen" },
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
      <BackToTop />

      <div className="rrl">

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
