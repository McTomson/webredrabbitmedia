/**
 * Sektion 4 — Scharnier-Zeile: der Kipp-Punkt zwischen "reines Produkt" und
 * "Talos wird eingefuehrt" (autoritativer Flow, KORREKTUR 19.07.). Als
 * vollflaechiges NAVY-Band gestaltet (der eine dunkle Farb-Moment der Seite,
 * neben dem Teal-Testimonial): der Wechsel zu Talos bekommt optisch Gewicht.
 * Off-White-Text auf Navy, roter Schlusspunkt (einziger Akzent). Bewusst keine
 * eigene Ueberschrift (genau ein <h1> auf der Seite, UNTERSEITEN_STIL.md §9).
 */
export default function Scharnierzeile() {
  return (
    <section className="lh-scharnier">
      <div className="rr-wrap rr-narrow">
        <p className="rr-statement lh-scharnier__text">
          Deine Seite kann mehr als andere Websites, weil Talos im
          Hintergrund für dich mitarbeitet<span className="lh-scharnier__dot">.</span>
        </p>
      </div>

      <style>{`
.lh-scharnier {
  background: var(--rr-navy, #1c2837);
  padding: clamp(96px, 16vh, 200px) 0;
}
.lh-scharnier .lh-scharnier__text { color: #f6f5f1; margin: 0; }
.lh-scharnier .lh-scharnier__dot { color: var(--rr-red, #f12032); }
      `}</style>
    </section>
  );
}
