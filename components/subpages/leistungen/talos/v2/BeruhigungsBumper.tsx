/**
 * Beruhigungs-Bumper — GERUEST-Platzhalter. Vorbild ist die
 * ScrollBumper-Mechanik (components/subpages/leistungen/ScrollBumper.tsx),
 * fuer das Geruest reicht eine statische Zeile auf demselben Navy-Band.
 * Bewusste Kern-Botschaft direkt nach dem Hero: keine Verkaufs-Panik, das
 * meiste ist ohnehin schon Teil jeder Website.
 */
export default function BeruhigungsBumper() {
  return (
    <section className="rr-section tl-section tl-bumper">
      <div className="rr-wrap rr-narrow">
        <p className="rr-display-2 tl-bumper__line">
          Das meiste davon ist schon drin. Was dazukommt, entscheidest du
          <span className="tl-dot">.</span>
        </p>
      </div>
    </section>
  );
}
