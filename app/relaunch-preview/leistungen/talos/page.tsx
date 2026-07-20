import type { Metadata } from "next";
import TalosPresentation from "@/components/relaunch/talos/TalosPresentation";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import JsonLd from "@/components/JsonLd";
import WasTalosIst from "@/components/subpages/leistungen/talos/WasTalosIst";
import Fundament from "@/components/subpages/leistungen/talos/Fundament";
import Module from "@/components/subpages/leistungen/talos/Module";
import Arbeitstag from "@/components/subpages/leistungen/talos/Arbeitstag";
import FragTalosSection from "@/components/subpages/leistungen/talos/FragTalosSection";
import TalosFaq from "@/components/subpages/leistungen/talos/TalosFaq";
import TalosCta from "@/components/subpages/leistungen/talos/TalosCta";
import { crimson, dmsans, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";
import "@/components/subpages/leistungen/talos/talos-sub.css";

export const metadata: Metadata = {
  title: "Talos, dein Helfer · Red Rabbit Media",
  description:
    "Talos arbeitet auf deiner Website, auch wenn du gerade keine Zeit hast: Anfragen erfassen, nachfassen, Zahlen in Klartext. Du gibst per Klick frei.",
  robots: { index: false, follow: false },
};

/**
 * Talos / Dashboard / Helfer — Unterseite mit der 3D-Scroll-Praesentation
 * (components/relaunch/talos/TalosPresentation.tsx, unveraendert
 * importiert) plus SSR-Substanz danach, fuer Crawler/LLMs UND fuer
 * Nutzer, die weiterscrollen, statt die Buehne bis zum Ende zu erleben.
 *
 * Chrome 1:1 aus app/relaunch-preview/talos-intro/page.tsx gespiegelt
 * (RelaunchMenu oben, FooterReassembly unten opak/z50, gleiche Font-
 * Variablen). Die 3D-Buehne (tp-stage) ist innerhalb TalosPresentation
 * fixed mit z-index:0 — der SSR-Block danach braucht darum selbst
 * position:relative + z-index>=1 (siehe talos-sub.css .lt-substance),
 * sonst faellt der Text optisch hinter die Buehne.
 *
 * Genau EIN <h1> auf der Seite: TalosPresentation rendert pro Station
 * nur <h2 class="tp-headline"> (geprueft, kein <h1> im Deck), darum
 * traegt WasTalosIst() das erste Statement als <h1>. Alle folgenden
 * Zwischenueberschriften sind <h2> (grep-verifiziert vor Abgabe).
 */
export default function TalosLeistungPage() {
  const rrFonts = `rr ${dmsans.variable} ${grotesk.variable} ${crimson.variable}`;

  return (
    <>
      {/* Service (Talos als Dashboard/Helfer-Leistung) + Organization.
          FAQPage-JSON-LD kommt automatisch aus der echten Faq-Komponente
          in TalosFaq (components/relaunch/Faq.tsx) — nicht doppeln. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://web.redrabbit.media/#organization",
              name: "Red Rabbit Media",
              url: "https://web.redrabbit.media",
            },
            {
              "@type": "Service",
              name: "Talos, Helfer und Dashboard",
              serviceType: "Website-Betreuung mit automatisierter Anfragen-Erfassung",
              description:
                "Talos sitzt in der Website und erfasst Anfragen, schreibt freundlich zurück, fasst nach und legt alles zur Freigabe vor. Zahlen in Klartext, Uptime-Wache und Speed-Report sind in jeder Website inklusive; Der Schreiber und Der Empfang sind dazu buchbare Module.",
              provider: { "@type": "Organization", name: "Red Rabbit Media" },
              areaServed: "AT",
            },
          ],
        }}
      />

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: "transparent" }}>
        <RelaunchMenu />
      </div>

      {/* Talos: Scroll-Praesentation (3D-Buehne + Stationen). */}
      <div className={rrFonts} style={{ background: "#ffffff" }}>
        <TalosPresentation />
      </div>

      {/* SSR-Substanz nach der Buehne: der crawlbare/LLM-lesbare Kern der
          Seite, in normalem Fluss, ueber der fixen 3D-Buehne (z-index). */}
      <div className={rrFonts} style={{ background: "#ffffff" }}>
        <WasTalosIst />
        <Fundament />
        <Module />
        <Arbeitstag />
        <FragTalosSection />
        <TalosFaq />
        <TalosCta />
      </div>

      {/* Footer der Hauptseite (opak). z-index 50 deckt beim Herunterscrollen die
          fixe 3D-Buehne UND das fixe Talos-Chrome (Anrufen, Logo, Dots, Progress:
          z40-43) ab; der globale Menue-Trigger (z1001) bleibt darueber erreichbar. */}
      <div className={rrFonts} style={{ background: "transparent", position: "relative", zIndex: 50 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
