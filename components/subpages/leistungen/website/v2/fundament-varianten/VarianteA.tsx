"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Fundament — Variante A: STICKY-LEDGER MIT WANDERNDEM FOKUS.
 * Zweispaltig: links eine sticky Zeilenliste aller 12 Punkte (Label + Nummer,
 * die 2 Gruppen als Zwischen-Ueberschriften), rechts scrollen die Detail-Saetze
 * als grosse Typo-Bloecke vorbei. Der Listenpunkt des gerade mittig sichtbaren
 * Details wird voll hervorgehoben (navy, fett) + roter Marker, der Rest dimmt
 * auf opacity .35. IntersectionObserver, sauber aufgeraeumt, prefers-reduced-
 * motion -> statische Fassung (kein Dimmen). Kandidaten-Ersatz fuer Fundament.tsx.
 */

type Item = { tag: string; text: string };
type Group = { heading: string; items: Item[] };

const GROUPS: Group[] = [
  {
    heading: "Was auf der Seite steckt",
    items: [
      { tag: "Design", text: "Individuelles Design, gebaut auf deinen Betrieb." },
      { tag: "Handy", text: "Sauber am Handy, weil da deine Kunden suchen." },
      {
        tag: "Recht",
        text: "Rechtssicher nach AT-Recht: Impressum und Datenschutz passen.",
      },
      { tag: "SEO", text: "Grund-SEO, damit dich Leute aus deiner Gegend finden." },
      { tag: "Kontakt", text: "Kontaktformular, das direkt bei dir ankommt." },
      { tag: "Domain", text: "Eigene Domain, gehört dir." },
    ],
  },
  {
    heading: "Was im Hintergrund für dich mitläuft",
    items: [
      {
        tag: "Hosting inklusive",
        text: "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
      },
      {
        tag: "Selbst ändern",
        text: "Öffnungszeiten, Texte, Bilder: das machst du selbst, ohne uns anzurufen und ohne Zusatzkosten.",
      },
      {
        tag: "Zahlen im Klartext",
        text: "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch.",
      },
      {
        tag: "Ein Wächter passt auf",
        text: "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab.",
      },
      {
        tag: "Monatlicher Check",
        text: "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist.",
      },
      {
        tag: "Pflege inklusive",
        text: "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
      },
    ],
  },
];

// Flache Liste mit laufender Nummer, plus Zuordnung zur Gruppe (fuer die
// Zwischen-Ueberschrift in der Ledger-Liste).
const FLAT: (Item & { n: number; groupStart: string | null })[] = (() => {
  const out: (Item & { n: number; groupStart: string | null })[] = [];
  let n = 0;
  for (const g of GROUPS) {
    g.items.forEach((it, i) => {
      out.push({ ...it, n: ++n, groupStart: i === 0 ? g.heading : null });
    });
  }
  return out;
})();

export default function VarianteA() {
  const [active, setActive] = useState(0);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setActive(-1); // -1 => kein Dimmen, alle voll
      return;
    }

    const els = detailRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    // Ein Detail gilt als aktiv, sobald es das mittlere Sichtband kreuzt.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="lwa">
      <div className="lwa__wrap">
        <p className="wd-eyebrow">WAS DRINSTECKT</p>
        <h2 className="rr-statement lwa__h2">Das Fundament ist immer schon drin.</h2>
        <p className="rr-body-lg lwa__intro">
          Nicht als Zusatzpaket, nicht als Kleingedrucktes. Sondern als das,
          womit jede Seite von uns startet.
        </p>

        <div className="lwa__grid">
          {/* Mobile: schlanke Sticky-Leiste statt der linken Ledger-Spalte.
              Zeigt immer den gerade aktiven Punkt + Fortschritt, damit der
              "wandernde Fokus" auch am Handy erlebbar bleibt (Thomas 21.07.:
              die einspaltige Fallback-Liste passte nicht). Desktop: display:none. */}
          <div className="lwa__mobilebar" aria-hidden="true">
            <span className="lwa__mobilecurrent">
              {String(FLAT[Math.max(0, active)].n).padStart(2, '0')} ·{' '}
              {FLAT[Math.max(0, active)].tag}
            </span>
            <span className="lwa__mobilecount">
              {Math.max(0, active) + 1} / {FLAT.length}
            </span>
            <span
              className="lwa__mobileprogress"
              style={{
                transform: `scaleX(${(Math.max(0, active) + 1) / FLAT.length})`,
              }}
            />
          </div>

          {/* Sticky Ledger links */}
          <aside className="lwa__aside" aria-hidden="true">
            <ol className="lwa__list">
              {FLAT.map((it, idx) => (
                <li key={it.tag} className="lwa__li">
                  {it.groupStart && (
                    <span className="lwa__grouphd">{it.groupStart}</span>
                  )}
                  <span
                    className={
                      "lwa__row" + (idx === active ? " is-active" : "")
                    }
                  >
                    <span className="lwa__mark" />
                    <span className="lwa__num">
                      {String(it.n).padStart(2, "0")}
                    </span>
                    <span className="lwa__label">{it.tag}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          {/* Scrollende Detail-Bloecke rechts */}
          <div className="lwa__details">
            {FLAT.map((it, idx) => (
              <div
                key={it.tag}
                data-idx={idx}
                ref={(el) => {
                  detailRefs.current[idx] = el;
                }}
                className="lwa__detail"
              >
                <p className="lwa__detailTag">
                  {String(it.n).padStart(2, "0")} · {it.tag}
                </p>
                <p className="lwa__detailText">{it.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="lwa__closer">Keine Extra-Rechnung. Kein Wartungsvertrag. Drin.</p>
        <p className="rr-meta lwa__meta">
          Was das kostet, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, keine Überraschung am Ende.
        </p>
      </div>

      <style jsx>{`
        .lwa {
          /* Design-Lead 22.07.: zur Abgrenzung ein ganz dezenter warmer
             Off-White-Ton (projektweit etabliertes #f6f5f1, kein kaltes Grau)
             statt reinem Weiss. Kein var-Token vorhanden (--rr-surface ist
             #f4f4f2, ein anderer Wert), daher Hex wie im restlichen Projekt. */
          background: #f6f5f1;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .lwa__wrap {
          max-width: 1180px;
          margin: 0 auto;
        }
        .lwa__h2 {
          max-width: 14em;
          margin: 20px 0 20px;
          color: var(--rr-navy);
        }
        .lwa__intro {
          max-width: 44em;
          color: var(--rr-ink-soft);
          margin-bottom: clamp(48px, 7vw, 88px);
        }
        .lwa__grid {
          display: grid;
          grid-template-columns: minmax(240px, 340px) 1fr;
          gap: clamp(32px, 5vw, 88px);
        }
        .lwa__aside {
          position: sticky;
          top: clamp(96px, 16vh, 172px);
          align-self: start;
        }
        .lwa__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .lwa__grouphd {
          display: block;
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin: 22px 0 10px;
        }
        .lwa__li:first-child .lwa__grouphd {
          margin-top: 0;
        }
        .lwa__row {
          display: grid;
          grid-template-columns: 12px auto 1fr;
          align-items: baseline;
          gap: 10px;
          padding: 7px 0;
          opacity: 0.35;
          color: var(--rr-ink-soft);
          transition: opacity 0.42s var(--rr-ease), color 0.42s var(--rr-ease);
        }
        .lwa__row.is-active {
          opacity: 1;
          color: var(--rr-navy);
        }
        .lwa__mark {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--rr-red);
          transform: translateY(2px) scale(0);
          transition: transform 0.42s var(--rr-ease);
        }
        .lwa__row.is-active .lwa__mark {
          transform: translateY(2px) scale(1);
        }
        .lwa__num {
          font-family: var(--rr-font-serif);
          font-size: 15px;
          font-variant-numeric: tabular-nums;
          color: inherit;
        }
        .lwa__label {
          font-family: var(--rr-font-display);
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.005em;
        }
        .lwa__row.is-active .lwa__label {
          font-weight: 700;
        }
        .lwa__details {
          min-width: 0;
        }
        .lwa__detail {
          min-height: 62vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(20px, 5vh, 56px) 0;
          border-top: 1px solid color-mix(in srgb, var(--rr-ink) 12%, transparent);
        }
        .lwa__detail:first-child {
          border-top: 0;
        }
        .lwa__detailTag {
          font-family: var(--rr-font-ui);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--rr-red);
          margin: 0 0 18px;
        }
        .lwa__detailText {
          font-family: var(--rr-font-display);
          font-weight: 500;
          font-size: clamp(1.55rem, 3.4vw, 2.7rem);
          line-height: 1.18;
          letter-spacing: -0.015em;
          color: var(--rr-navy);
          max-width: 15em;
          margin: 0;
        }
        .lwa__closer {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          color: var(--rr-ink);
          margin: clamp(40px, 6vw, 72px) 0 0;
        }
        .lwa__meta {
          margin-top: 12px;
        }

        .lwa__mobilebar {
          display: none;
        }
        @media (max-width: 860px) {
          .lwa__grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          /* Die volle Ledger-Spalte waere am Handy nur eine doppelte Liste. */
          .lwa__aside {
            display: none;
          }
          .lwa__mobilebar {
            position: sticky;
            top: 0;
            z-index: 2;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            background: var(--rr-surface);
            /* padding-top schiebt die Zeile unter das fixe Seiten-Chrome
               (Hasen-Logo links, Hamburger rechts), die Flaeche deckt den
               dahinter scrollenden Text ab. */
            padding: 56px 0 12px;
            border-bottom: 1px solid rgba(28, 40, 55, 0.14);
          }
          .lwa__mobilecurrent {
            font-family: var(--rr-font-ui);
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--rr-red);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .lwa__mobilecount {
            font-family: var(--rr-font-ui);
            font-size: 0.78rem;
            color: var(--rr-ink);
            opacity: 0.55;
            flex: none;
          }
          .lwa__mobileprogress {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            height: 2px;
            background: var(--rr-red);
            transform-origin: left;
            transition: transform 0.3s ease;
          }
          .lwa__detail {
            min-height: auto;
            padding: clamp(26px, 7vw, 34px) 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lwa__row {
            opacity: 1;
            color: var(--rr-navy);
            transition: none;
          }
          .lwa__mark {
            transform: translateY(2px) scale(1);
            transition: none;
          }
          /* Ohne Observer (active=-1) wuerde die Leiste dauerhaft "01" zeigen. */
          .lwa__mobilebar {
            display: none;
          }
          .lwa__detail {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
