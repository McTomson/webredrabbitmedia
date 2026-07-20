'use client';

/**
 * Ablauf "So läuft das ab" (Copy v2 §4). Vier Schritte als klare Timeline mit
 * rotem Nummern-Rail. Der Kern: "Entwurf zuerst" selbstbewusst geframt (Schritt 3),
 * nicht als Rabatt. Server-Komponente, kein Scroll-Rig (robust, kein Fremd-CSS,
 * ersetzt das ungestylte StepStack-Bauteil). rr-* Tokens, Eckig-Gesetz
 * border-radius:0, DU-Anrede, echte Umlaute, kein Gedankenstrich, kein "KI"-Wort.
 * Nur <h2> (das eine h1 sitzt im Hero).
 */

type Schritt = { titel: string; text: string; ergebnis: string };

const SCHRITTE: Schritt[] = [
  {
    titel: 'Du erzählst uns deinen Betrieb.',
    text: 'Kurz, wer du bist, was du machst, wer deine Kunden sind. Kein Formular-Marathon, ein Gespräch reicht.',
    ergebnis: 'Wir wissen, worum es geht. Ohne dass du dafür schon einen Cent zahlst.',
  },
  {
    titel: 'Wir bauen deinen Entwurf.',
    text: 'Den großen Teil der Arbeit machen wir, nicht du. Kein wochenlanges Hin und Her, den ersten Entwurf hast du meist in ein paar Tagen.',
    ergebnis: 'Du siehst deine echte Seite, fertig gestaltet. Nicht eine Skizze, nicht eine Vorlage. Deine.',
  },
  {
    titel: 'Du schaust sie dir in Ruhe an.',
    text: 'Das ist der Punkt, an dem andere Agenturen längst die halbe Rechnung geschickt hätten. Wir nicht. Du legst dich erst fest, wenn die Seite vor dir steht und sitzt. Wir zeigen sie dir zuerst, weil wir ziemlich sicher sind, dass sie dich überzeugt. Gefällt sie dir nicht, hat es dich nichts gekostet.',
    ergebnis: 'Du entscheidest mit dem Ergebnis vor Augen, nicht auf gut Glück.',
  },
  {
    titel: 'Feinschliff, dann geht sie live.',
    text: 'Sagst du Ja, feilen wir so lange, bis es passt. Dann stellen wir sie online, mit deiner Domain und allen Zugängen in deiner Hand.',
    ergebnis: 'Deine Seite ist live und gehört dir. Der Kollege legt am selben Tag los.',
  },
];

export default function Ablauf() {
  return (
    <section className="wd-abl" aria-labelledby="wd-abl-title">
      <div className="wd-abl__head">
        <p className="rr-eyebrow-lg">SO LÄUFT DAS AB</p>
        <h2 id="wd-abl-title" className="rr-statement">
          Vier Schritte. Und du siehst deine Seite echt, bevor du dich festlegst.
        </h2>
      </div>

      <ol className="wd-abl__list">
        {SCHRITTE.map((s, i) => (
          <li className="wd-abl__step" key={i}>
            <div className="wd-abl__rail" aria-hidden="true">
              <span className="wd-abl__num">0{i + 1}</span>
            </div>
            <div className="wd-abl__body">
              <h3 className="wd-abl__titel">{s.titel}</h3>
              <p className="wd-abl__text">{s.text}</p>
              <p className="wd-abl__erg">
                <span className="wd-abl__ergtag">Ergebnis</span>
                {s.ergebnis}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <style jsx>{`
        .wd-abl {
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
          max-width: 1080px;
          margin: 0 auto;
        }
        .wd-abl__head {
          max-width: 780px;
          margin-bottom: clamp(40px, 6vw, 72px);
        }
        .wd-abl__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .wd-abl__step {
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          gap: clamp(16px, 3vw, 40px);
        }
        .wd-abl__rail {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .wd-abl__rail::before {
          content: '';
          position: absolute;
          top: 6px;
          bottom: 0;
          width: 1px;
          background: rgba(28, 40, 55, 0.16);
        }
        .wd-abl__step:last-child .wd-abl__rail::before {
          display: none;
        }
        .wd-abl__num {
          position: relative;
          z-index: 1;
          font-family: var(--rr-font-display, inherit);
          font-weight: 800;
          font-size: clamp(1.5rem, 2.2vw, 2rem);
          line-height: 1;
          color: var(--rr-red, #f12032);
          background: #fff;
          padding-bottom: 8px;
        }
        .wd-abl__body {
          padding-bottom: clamp(40px, 6vw, 64px);
        }
        .wd-abl__step:last-child .wd-abl__body {
          padding-bottom: 0;
        }
        .wd-abl__titel {
          margin: 0;
          font-family: var(--rr-font-display, inherit);
          font-weight: 700;
          font-size: clamp(1.35rem, 2.2vw, 1.9rem);
          line-height: 1.14;
          color: var(--rr-navy, #1c2837);
          letter-spacing: -0.01em;
          padding-top: 2px;
        }
        .wd-abl__text {
          margin: 16px 0 0;
          font-family: var(--rr-font-ui, inherit);
          font-size: clamp(1rem, 1.1vw, 1.12rem);
          line-height: 1.65;
          color: var(--rr-ink, #23262e);
          max-width: 62ch;
        }
        .wd-abl__erg {
          margin: 18px 0 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px 14px;
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.02rem, 1.25vw, 1.22rem);
          line-height: 1.45;
          color: var(--rr-navy, #1c2837);
          max-width: 60ch;
        }
        .wd-abl__ergtag {
          font-family: var(--rr-font-ui, inherit);
          font-style: normal;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          border: 1px solid var(--rr-red, #f12032);
          border-radius: 0;
          padding: 3px 8px;
          transform: translateY(-2px);
        }
        @media (max-width: 620px) {
          .wd-abl__step {
            grid-template-columns: 54px minmax(0, 1fr);
            gap: 14px;
          }
          .wd-abl__num {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
}
