import KundenGrid from "@/components/relaunch/KundenGrid";
import SiteClosing from "@/components/relaunch/SiteClosing";

/**
 * Blaupause Sektionen 6-8. Sektionen 6+7 (Zahlen-Statement + statische
 * Firmen-Liste) sind seit 16.07. durch das Typing-Grid KundenGrid ersetzt
 * (Port des ueber-uns-Kundenlisten-Blocks auf Weiss statt Blau). Sektion 8
 * (Abschluss-CTA) ist seit 28.07. die geteilte Komponente SiteClosing —
 * gleiches Markup, gleiche Klassen, nur die Zeilen kommen als Prop
 * (Vereinheitlichung: jede Inhaltsseite nutzt denselben Abschluss-Block).
 */

const DEFAULT_CLOSING = [
  "Du willst eine Website, die man findet?",
  "Und die für dich im Hintergrund Kunden gewinnt?",
  "Reden wir.",
];

export default function HomeClosing({ closingLines = DEFAULT_CLOSING }: { closingLines?: string[] } = {}) {
  return (
    <>
      {/* Sektionen 6+7: Kundenliste-Typing-Grid (Port ueber-uns, weiss statt blau).
          data-rr-snap = Soft-Snap-Ziel (ScrollExperience.tsx). */}
      <div data-rr-snap>
        <KundenGrid />
      </div>

      {/* Sektion 8: Abschluss-CTA — eigener luftiger Block, Off-White-Grund */}
      <SiteClosing lines={closingLines} />
    </>
  );
}
