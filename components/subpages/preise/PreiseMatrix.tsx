'use client';

import { useState } from 'react';
import Link from 'next/link';
import FloatingReview from './FloatingReview';

/**
 * Sektion 3 — die drei Pakete MIT Preis. Echter Klon von
 * components/subpages/leistungen/website/v2/DreiStufenMatrix.tsx (Thomas'
 * Grill-Entscheidung: "Exakt die sticky Matrix von der Website-Seite, nur
 * jetzt MIT grossem Preis pro Stufe"): links sticky Stufenname + Preis +
 * Badges, rechts die 2-spaltige Merkmal-Matrix mit aufklappbaren Panels,
 * Stufen UNTEREINANDER. Merkmale + Aufklapp-Verhalten 1:1 aus dem Original
 * (STUFEN-Daten importiert, nichts dupliziert). Preise NUR 1.250 / 2.850 /
 * ab 4.900 (Thomas 30.07., brand/decisions-log.md) — nie andere Zahlen.
 *
 * Styling: plain globales <style>-Tag statt <style jsx> (LESSONS_LEARNED.md
 * "styled-jsx im Relaunch meiden" — 3 dokumentierte Faelle, in denen
 * Komponenten ungestylt als roher Text rendern). EIN Block auf oberster
 * Ebene der Komponente (PreiseMatrix), nicht in der pro Stufe wiederholten
 * StufeMatrix-Unterkomponente — sonst wuerde derselbe Block 3x ins DOM
 * dupliziert. Klassen rpm-/rp- sind seiten-lokal eindeutig genug.
 */

/**
 * Eigene Paket-Daten der Preisseite (Thomas 09.08.2026): KUMULATIV aufgebaut,
 * jede Stufe enthaelt alles aus der kleineren plus den eigenen Zugewinn. Bewusst
 * ENTKOPPELT von den STUFEN aus VarianteA.tsx (die die Website-Unterseite
 * versorgen): dort zeigen die Stufen nur die Unterschiede, hier den vollen,
 * kumulativen Umfang mit deutlich mehr Text. So bleibt die Website-Seite
 * unveraendert, waehrend die Preisseite ihre eigene, ausfuehrliche Darstellung
 * bekommt. Preise sind Startpreise ("ab", Thomas 08.08.): das verbindliche
 * Angebot bekommt der Kunde bei der Auftragserteilung. Preise NUR 1.250 /
 * 2.850 / ab 4.900.
 */
type Merkmal = { titel: string; detail: string };
type Paket = {
  name: string;
  preis: string;
  text: string;
  featured?: boolean;
  merkmale: Merkmal[];
};

const PAKETE: Paket[] = [
  {
    name: 'Starter',
    preis: 'ab 1.250 €',
    text: 'Der schlanke Start: eine Seite, die sitzt. Für alle, die schnell und sauber online sein wollen.',
    merkmale: [
      {
        titel: 'Das komplette Fundament, alles inklusive',
        detail:
          'Alles, was oben steht, steckt schon in Starter drin: individuelles Design, perfekt am Handy, für Google und KI gebaut, Talos als dein Copilot, Technik, Recht, Einrichtung. Kein abgespecktes Einsteiger-Ding, sondern das volle Fundament, nur eben auf einer Seite.',
      },
      {
        titel: 'One-Pager, der alles Wichtige trägt',
        detail:
          'Eine Seite, klar aufgebaut: wer du bist, was du machst, warum dich jemand anrufen soll und wie er das tut. Alles Wichtige an einem Ort, ohne dass sich der Besucher durchklicken muss.',
      },
      {
        titel: 'Der schlanke Einstieg, der mitwächst',
        detail:
          'Perfekt, um klein zu starten. Wächst dein Betrieb, hebst du jederzeit auf Business oder Premium, ohne bei null anzufangen. Deine Seite wächst mit dir, nicht gegen dich.',
      },
    ],
  },
  {
    name: 'Business',
    preis: 'ab 2.850 €',
    text: 'Mehrseitig, gezielt auf lokale Sichtbarkeit und Anfragen gebaut. Der Sprung, den die meisten brauchen.',
    featured: true,
    merkmale: [
      {
        titel: 'Alles aus Starter, plus mehr Raum',
        detail:
          'Das komplette Starter-Paket inklusive Fundament ist hier drin. Darauf setzt Business auf: mehr Seiten, mehr Struktur, mehr Möglichkeiten, deinen Betrieb zu zeigen.',
      },
      {
        titel: 'Mehrseitig, mit Platz für alles',
        detail:
          'Eigene Seiten für Leistungen, Team, Referenzen, Anfahrt, was dein Betrieb eben zeigen will. Jede Leistung bekommt ihren Raum, statt sich auf einer Seite zu drängen.',
      },
      {
        titel: 'Lokal gefunden werden',
        detail:
          'Gezielt darauf gebaut, dass dich Leute aus deiner Gegend finden, wenn sie genau das suchen, was du anbietest. Die Kunden vor deiner Haustür sind die, die am ehesten kaufen.',
      },
      {
        titel: 'Auf Anfragen gebaut',
        detail:
          'Aufbau und Wege so gelegt, dass aus Besuchern Anfragen werden: klare Handlungsaufforderungen, kurze Wege zum Formular und zum Telefon. Damit das Telefon klingelt, nicht nur der Besucherzähler.',
      },
    ],
  },
  {
    name: 'Premium',
    preis: 'ab 4.900 €',
    text: 'Für alle, deren Seite wirklich arbeiten soll: umfangreich, auf dauerhafte Sichtbarkeit und laufende Anfragen gebaut.',
    merkmale: [
      {
        titel: 'Alles aus Business, plus volle Ausbaustufe',
        detail:
          'Das komplette Business-Paket ist drin, inklusive allem aus Starter und dem Fundament. Premium ist die große Ausbaustufe für Betriebe, deren Website richtig arbeiten soll.',
      },
      {
        titel: 'Umfangreich und skalierbar',
        detail:
          'Die große Struktur, die mitwächst, so groß dein Betrieb wird. Für Seiten, die viel zeigen und viel leisten sollen, ohne dass es unübersichtlich wird.',
      },
      {
        titel: 'Inhalte, die dich sichtbar halten',
        detail:
          'Ein Ratgeber- oder Blog-System, mit dem du Stück für Stück sichtbarer wirst, bei Google und bei KI-Suchen. Statt einmal gebaut zu verstauben, arbeitet deine Seite laufend für dich.',
      },
      {
        titel: 'Dauerhafte Sichtbarkeit',
        detail:
          'Auf dauerhafte, inhaltsgetriebene Sichtbarkeit und laufende Anfragen gebaut, nicht nur auf den ersten Tag nach dem Launch.',
      },
      {
        titel: 'Vorqualifizierte Anfragen',
        detail:
          'Formulare, die Interessenten vorsortieren, bevor sie bei dir landen. So verlierst du weniger Zeit mit dem Falschen und redest mit denen, die wirklich passen.',
      },
    ],
  },
];

function StufeMatrix({
  stufe,
  defaultActive = null,
}: {
  stufe: Paket;
  defaultActive?: number | null;
}) {
  const [active, setActive] = useState<number | null>(defaultActive);

  return (
    <div className={'rpm__stufe' + (stufe.featured ? ' rpm__stufe--featured' : '')}>
      <aside className="rpm__aside">
        <div className="rpm__asideinner">
          {stufe.featured && <span className="rpm__tag">Meistgewählt</span>}
          <h3 className="rpm__name">
            {stufe.name}
            {stufe.featured && <span className="rpm__namedot" aria-hidden="true" />}
          </h3>
          <p className="rpm__price">{stufe.preis}</p>
          <span className="rpm__badge">0 € bis zum Vorschlag</span>
          <p className="rpm__text">{stufe.text}</p>
          <Link
            href="/relaunch-preview/kontakt"
            data-rr-lead="paket"
            data-rr-lead-service={`Paket ${stufe.name} (${stufe.preis})`}
            className={
              'rpm__cta rr-btn-sweep ' +
              (stufe.featured ? 'rr-btn-sweep--red' : 'rr-btn-sweep--navy')
            }
          >
            {stufe.name} anfragen
          </Link>
        </div>
      </aside>

      <div className="rpm__matrix">
        {stufe.merkmale.map((m, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={m.titel}
              className={'rpm__cell' + (isActive ? ' is-active' : '') + (dimmed ? ' is-dim' : '')}
            >
              <button
                type="button"
                className="rpm__btn"
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : i)}
              >
                <span className="rpm__mark" aria-hidden="true" />
                <span className="rpm__titel">{m.titel}</span>
              </button>
              <div className="rpm__panel">
                <div className="rpm__panel-inner">
                  <p className="rpm__detail">{m.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PreiseMatrix() {
  return (
    <section className="rr-section rp-matrix" id="pakete" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow">Drei Pakete</p>
        <h2 className="rr-statement rp-matrix__h2">
          Drei Pakete, ein Prinzip<span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg rp-matrix__intro">
          Jedes Paket enthält alles aus dem kleineren, plus das, was diese Stufe ausmacht.
          Wähl die Stufe, die zu deinem Betrieb passt, und wachse später jederzeit in die
          nächste.
        </p>

        {PAKETE.map((s, i) => (
          <StufeMatrix key={s.name} stufe={s} defaultActive={i === 0 ? 0 : null} />
        ))}
      </div>

      <FloatingReview
        side="right"
        quote="Ich bin von der Firma begeistert, vor allem von der Umsetzung. 100 Prozent Empfehlung."
        name="Rene Rohrer, Google-Rezension"
      />

      <style>{`
        .rp-matrix {
          position: relative;
          background: #ffffff;
        }
        .rp-matrix__h2 {
          margin: 18px 0 20px;
          max-width: 16em;
        }
        .rp-matrix__intro {
          color: var(--rr-ink-soft);
          max-width: 56ch;
          margin: 0 0 clamp(20px, 3vw, 32px);
        }
        .rp-matrix__ab {
          margin-top: clamp(44px, 6vw, 72px);
          padding-top: clamp(24px, 3vw, 32px);
          border-top: 1px solid rgba(28, 40, 55, 0.14);
          max-width: 64ch;
        }
        .rp-matrix__ab-h {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          margin: 0 0 10px;
        }
        .rp-matrix__ab-body {
          font-family: var(--rr-font-ui);
          font-size: 15.5px;
          line-height: 1.62;
          color: var(--rr-ink-soft);
          margin: 0;
        }
        .rp-matrix__custom {
          margin-top: clamp(28px, 4vw, 40px);
          max-width: 60ch;
        }

        .rpm__stufe {
          display: grid;
          grid-template-columns: minmax(220px, 300px) 1fr;
          gap: clamp(28px, 5vw, 72px);
          padding: clamp(44px, 6vw, 80px) 0;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .rpm__stufe--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
        }
        .rpm__stufe--featured + .rpm__stufe {
          border-top: 0;
        }

        .rpm__aside {
          position: relative;
        }
        .rpm__asideinner {
          position: sticky;
          top: clamp(96px, 16vh, 172px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .rpm__tag {
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .rpm__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.2rem, 4vw, 3.6rem);
          line-height: 1;
          color: var(--rr-navy);
          margin: 0;
          display: inline-flex;
          align-items: flex-end;
          gap: 0.26em;
          opacity: 0.62;
        }
        .rpm__stufe--featured .rpm__name {
          opacity: 1;
          font-size: clamp(2.6rem, 4.8vw, 4.2rem);
        }
        .rpm__namedot {
          width: 0.16em;
          height: 0.16em;
          border-radius: 50%;
          background: var(--rr-red);
          margin-bottom: 0.2em;
        }
        .rpm__price {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(1.7rem, 2.8vw, 2.3rem);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          margin: 4px 0 0;
        }
        .rpm__badge {
          display: inline-block;
          border: 1px solid rgba(28, 40, 55, 0.22);
          color: var(--rr-ink-soft);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 3px 9px;
          margin-top: 2px;
        }
        .rpm__stufe--featured .rpm__badge {
          border-color: var(--rr-red);
          color: var(--rr-red);
        }
        .rpm__text {
          font-family: var(--rr-font-ui);
          font-size: 14.5px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 24em;
          margin: 6px 0 0;
        }
        .rpm__cta {
          margin-top: 18px;
          align-self: flex-start;
        }

        .rpm__matrix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: clamp(20px, 3vw, 44px);
          align-content: start;
          border-top: 1px solid rgba(28, 40, 55, 0.1);
        }
        .rpm__cell.is-active {
          grid-column: 1 / -1;
        }
        .rpm__cell {
          border-bottom: 1px solid rgba(28, 40, 55, 0.1);
          transition: opacity 0.4s var(--rr-ease, ease);
        }
        .rpm__cell.is-dim {
          opacity: 0.4;
        }

        .rpm__btn {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: clamp(13px, 1.6vw, 17px) 2px;
          text-align: left;
          transition: padding-left 0.3s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .rpm__btn:hover {
            padding-left: 10px;
          }
        }
        .rpm__mark {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          flex: none;
          transition: background 0.3s var(--rr-ease, ease), transform 0.3s var(--rr-ease, ease);
        }
        .rpm__btn:hover .rpm__mark {
          background: var(--rr-red);
        }
        .rpm__cell.is-active .rpm__mark {
          background: var(--rr-red);
          transform: scale(1.35);
        }
        .rpm__titel {
          font-family: var(--rr-font-display);
          font-weight: 500;
          font-size: clamp(1rem, 1.5vw, 1.18rem);
          letter-spacing: -0.005em;
          color: var(--rr-ink-soft);
          transition: color 0.3s var(--rr-ease, ease), font-weight 0.3s var(--rr-ease, ease);
        }
        .rpm__cell.is-active .rpm__titel {
          color: var(--rr-navy);
          font-weight: 700;
        }

        .rpm__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .rpm__cell.is-active .rpm__panel {
          grid-template-rows: 1fr;
        }
        .rpm__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .rpm__detail {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.62;
          color: var(--rr-navy);
          max-width: 42em;
          margin: 0;
          padding: 4px 2px clamp(18px, 2.4vw, 26px) 21px;
          border-left: 2px solid var(--rr-red);
          margin-left: 2px;
          opacity: 0;
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s;
        }
        .rpm__cell.is-active .rpm__detail {
          opacity: 1;
        }

        @media (max-width: 860px) {
          .rpm__stufe {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .rpm__asideinner {
            position: static;
          }
          .rpm__matrix {
            grid-template-columns: 1fr;
          }
          .rpm__cell.is-active {
            grid-column: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rpm__cell,
          .rpm__btn,
          .rpm__mark,
          .rpm__titel,
          .rpm__panel,
          .rpm__detail {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
