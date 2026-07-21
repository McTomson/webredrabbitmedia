'use client';

/**
 * "So bauen wir" (Handwerk statt Fabrik), nach Hero + Belief-Szene.
 * Selbstbeweis + 3 Kontrast-Paare (Fabrik-Zeile gedimmt, Wir-Zeile voll),
 * Eintritt ueber die CSS-only .rr-reveal/.rr-stagger aus dem Styleguide.
 * Der fruehere eigene Bumper ist ERSETZT durch die originale ueber-uns
 * Belief-Szene direkt im Hero-Demo (website-demo/demo.body.html, #sceneBelief),
 * Thomas 21.07.: Push-Mechanik exakt wie ueber-uns. Keine Trennlinien,
 * kompakter Rhythmus (Thomas: "Linie weg, zu viel Platz").
 * Hausregeln: du-Anrede, kein Gedankenstrich, echte Umlaute, kein "KI",
 * border-radius:0, nur <h2> (das eine h1 sitzt im Hero).
 */

type Paar = { fabrik: string; wir: string };

const PAARE: Paar[] = [
  {
    fabrik: 'Vorlage auf, Logo rein, fertig.',
    wir: 'Wir fangen bei dir an. Erst wenn klar ist, was deine Seite können muss, wird gebaut.',
  },
  {
    fabrik: 'Masse. Je mehr durchlaufen, desto besser.',
    wir: 'Maß. Wir nehmen nur an, was wir sauber schaffen.',
  },
  {
    fabrik: 'Jeder Auftrag ist ein guter Auftrag.',
    wir: 'Wenn dir das Kleine reicht, sagen wir dir das.',
  },
];

export default function SoBauenWir() {
  return (
    <section className="wd-hand" aria-labelledby="wd-hand-title">
      <div className="wd-hand__inner rr-reveal">
        <p className="rr-eyebrow-lg">SO BAUEN WIR</p>
        <h2 id="wd-hand-title" className="rr-statement wd-hand__statement">
          Das hier ist kein Baukasten. Merkst du gerade selbst.
        </h2>
        <p className="wd-hand__beweis">
          Das Wort, das du oben weggewischt hast, und das Zahnrad, das sich daraus
          zusammengesetzt hat: alles nur für diese eine Seite gebaut. So entsteht
          auch deine.
        </p>

        <div className="wd-hand__paare rr-stagger">
          {PAARE.map((p, i) => (
            <div className="wd-hand__paar rr-reveal" key={i}>
              <div className="wd-hand__col wd-hand__col--fabrik">
                <p className="wd-hand__collabel">Die Fabrik</p>
                <p className="wd-hand__coltext">{p.fabrik}</p>
              </div>
              <div className="wd-hand__col wd-hand__col--wir">
                <p className="wd-hand__collabel wd-hand__collabel--wir">Wir</p>
                <p className="wd-hand__coltext">{p.wir}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wd-hand {
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px)) calc(var(--rr-section-y, clamp(96px, 12vw, 180px)) * 1.5);
        }
        .wd-hand__inner {
          max-width: 1080px;
          margin: 0 auto;
        }
        .wd-hand__statement {
          max-width: 15em;
          color: var(--rr-navy, #1c2837);
        }
        .wd-hand__beweis {
          margin-top: 24px;
          max-width: 62ch;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1.02rem, 1.2vw, 1.18rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
        }
        .wd-hand__paare {
          margin-top: clamp(32px, 4.5vw, 56px);
          display: flex;
          flex-direction: column;
          gap: clamp(22px, 3vw, 36px);
        }
        .wd-hand__paar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
          gap: clamp(20px, 4vw, 64px);
        }
        .wd-hand__collabel {
          font-family: var(--rr-font-ui, inherit);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-ink, #23262e);
          opacity: 0.45;
        }
        .wd-hand__collabel--wir {
          color: var(--rr-red, #f12032);
          opacity: 1;
        }
        .wd-hand__coltext {
          margin-top: 8px;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(0.98rem, 1.1vw, 1.1rem);
          line-height: 1.6;
        }
        .wd-hand__col--fabrik .wd-hand__coltext {
          color: var(--rr-ink, #23262e);
          opacity: 0.55;
        }
        .wd-hand__col--wir .wd-hand__coltext {
          color: var(--rr-ink, #23262e);
          font-family: var(--rr-font-display, inherit);
          font-weight: 560;
        }
        @media (max-width: 620px) {
          .wd-hand__paar {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </section>
  );
}
