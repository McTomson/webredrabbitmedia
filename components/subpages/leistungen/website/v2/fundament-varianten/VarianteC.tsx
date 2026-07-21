"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Fundament — Variante C: ZEILEN-LEDGER MIT DETAIL (Speisekarten-Prinzip).
 * 12 einzeilige Eintraege: Label links, punktierte Fuell-Linie, kurzes Stichwort
 * rechts, Hairline-Trenner. Desktop-Hover UND Fokus oeffnet die Zeile weich nach
 * unten (grid-template-rows 0fr -> 1fr) und zeigt den ganzen Satz in Serif kursiv.
 * Auf Touch/Mobile per echtem <button> (aria-expanded) auf-/zugeklappt. Scroll-
 * Eintritt: Zeilen staggern per globaler Klasse rr-stagger. prefers-reduced-motion
 * -> keine Aufklapp-Animation (sofort), rr-stagger ist ohnehin reduced-safe.
 */

type Item = { tag: string; word: string; text: string };
type Group = { heading: string; items: Item[] };

const GROUPS: Group[] = [
  {
    heading: "Was auf der Seite steckt",
    items: [
      {
        tag: "Design",
        word: "individuell",
        text: "Individuelles Design, gebaut auf deinen Betrieb.",
      },
      {
        tag: "Handy",
        word: "mobil",
        text: "Sauber am Handy, weil da deine Kunden suchen.",
      },
      {
        tag: "Recht",
        word: "AT-konform",
        text: "Rechtssicher nach AT-Recht: Impressum und Datenschutz passen.",
      },
      {
        tag: "SEO",
        word: "auffindbar",
        text: "Grund-SEO, damit dich Leute aus deiner Gegend finden.",
      },
      {
        tag: "Kontakt",
        word: "direkt",
        text: "Kontaktformular, das direkt bei dir ankommt.",
      },
      {
        tag: "Domain",
        word: "deine",
        text: "Eigene Domain, gehört dir.",
      },
    ],
  },
  {
    heading: "Was im Hintergrund für dich mitläuft",
    items: [
      {
        tag: "Hosting inklusive",
        word: "inklusive",
        text: "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
      },
      {
        tag: "Selbst ändern",
        word: "selbst",
        text: "Öffnungszeiten, Texte, Bilder: das machst du selbst, ohne uns anzurufen und ohne Zusatzkosten.",
      },
      {
        tag: "Zahlen im Klartext",
        word: "klar",
        text: "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch.",
      },
      {
        tag: "Ein Wächter passt auf",
        word: "bewacht",
        text: "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab.",
      },
      {
        tag: "Monatlicher Check",
        word: "monatlich",
        text: "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist.",
      },
      {
        tag: "Pflege inklusive",
        word: "gepflegt",
        text: "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
      },
    ],
  },
];

export default function VarianteC() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <section className="lwc">
      <div className="lwc__wrap">
        <p className="rr-eyebrow-lg">WAS DRINSTECKT</p>
        <h2 className="rr-statement lwc__h2">Das Fundament ist immer schon drin.</h2>
        <p className="rr-body-lg lwc__intro">
          Nicht als Zusatzpaket, nicht als Kleingedrucktes. Sondern als das,
          womit jede Seite von uns startet.
        </p>

        {GROUPS.map((g) => (
          <div key={g.heading} className="lwc__group">
            <p className="rr-eyebrow lwc__grouphd">{g.heading}</p>
            <div className="lwc__rows rr-stagger">
              {g.items.map((it) => {
                const isOpen = open.has(it.tag);
                return (
                  <button
                    key={it.tag}
                    type="button"
                    className={"lwc__row" + (isOpen ? " is-open" : "")}
                    aria-expanded={isOpen}
                    onClick={() => toggle(it.tag)}
                  >
                    <span className="lwc__summary">
                      <span className="lwc__label">{it.tag}</span>
                      <span className="lwc__lead" aria-hidden="true" />
                      <span className="lwc__word">{it.word}</span>
                      <span className="lwc__sign" aria-hidden="true" />
                    </span>
                    <span className="lwc__panel">
                      <span className="lwc__panelInner">
                        <span className="lwc__detail">{it.text}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p className="lwc__closer">Keine Extra-Rechnung. Kein Wartungsvertrag. Drin.</p>
        <p className="rr-meta lwc__meta">
          Was das kostet, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, keine Überraschung am Ende.
        </p>
      </div>

      <style jsx>{`
        .lwc {
          background: var(--rr-surface);
          color: var(--rr-ink);
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .lwc__wrap {
          max-width: 1080px;
          margin: 0 auto;
        }
        .lwc__h2 {
          max-width: 14em;
          margin: 20px 0 20px;
          color: var(--rr-navy);
        }
        .lwc__intro {
          max-width: 44em;
          color: var(--rr-ink-soft);
          margin-bottom: clamp(40px, 6vw, 72px);
        }
        .lwc__group + .lwc__group {
          margin-top: clamp(36px, 5vw, 64px);
        }
        .lwc__grouphd {
          margin: 0 0 4px;
        }
        .lwc__rows {
          border-top: 1px solid
            color-mix(in srgb, var(--rr-ink) 16%, transparent);
        }
        .lwc__row {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          border-bottom: 1px solid
            color-mix(in srgb, var(--rr-ink) 16%, transparent);
          background: transparent;
          text-align: left;
          font: inherit;
          color: inherit;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
        }
        .lwc__summary {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding: clamp(16px, 2.4vw, 24px) 4px;
        }
        .lwc__label {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.05rem, 1.9vw, 1.4rem);
          letter-spacing: -0.01em;
          color: var(--rr-navy);
          flex: 0 0 auto;
        }
        .lwc__lead {
          flex: 1 1 auto;
          border-bottom: 1.5px dotted
            color-mix(in srgb, var(--rr-ink) 34%, transparent);
          transform: translateY(-5px);
          min-width: 24px;
        }
        .lwc__word {
          font-family: var(--rr-font-ui);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--rr-ink-soft);
          flex: 0 0 auto;
          transition: color 0.3s var(--rr-ease);
        }
        .lwc__sign {
          position: relative;
          flex: 0 0 auto;
          width: 12px;
          height: 12px;
          align-self: center;
        }
        .lwc__sign::before,
        .lwc__sign::after {
          content: "";
          position: absolute;
          background: var(--rr-red);
          transition: transform 0.35s var(--rr-ease), opacity 0.3s var(--rr-ease);
        }
        .lwc__sign::before {
          left: 0;
          top: 5px;
          width: 12px;
          height: 2px;
        }
        .lwc__sign::after {
          left: 5px;
          top: 0;
          width: 2px;
          height: 12px;
        }
        .lwc__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.42s var(--rr-ease);
        }
        .lwc__panelInner {
          overflow: hidden;
          min-height: 0;
        }
        .lwc__detail {
          display: block;
          font-family: var(--rr-font-serif);
          font-style: italic;
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          line-height: 1.4;
          color: var(--rr-ink);
          max-width: 34em;
          padding: 0 4px clamp(18px, 2.4vw, 26px);
        }

        /* Aufklappen: Hover/Fokus (Desktop) ODER getoggelt (Touch). */
        .lwc__row:hover .lwc__panel,
        .lwc__row:focus-visible .lwc__panel,
        .lwc__row.is-open .lwc__panel {
          grid-template-rows: 1fr;
        }
        .lwc__row:hover .lwc__word,
        .lwc__row:focus-visible .lwc__word,
        .lwc__row.is-open .lwc__word {
          color: var(--rr-red);
        }
        .lwc__row:hover .lwc__sign::after,
        .lwc__row:focus-visible .lwc__sign::after,
        .lwc__row.is-open .lwc__sign::after {
          transform: rotate(90deg);
          opacity: 0;
        }
        .lwc__row:focus-visible {
          outline: 2px solid var(--rr-navy);
          outline-offset: 2px;
        }

        .lwc__closer {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          color: var(--rr-ink);
          margin: clamp(40px, 6vw, 72px) 0 0;
        }
        .lwc__meta {
          margin-top: 12px;
        }

        @media (hover: none) {
          /* Auf Touch nicht per Hover oeffnen, nur per Tap-Toggle. */
          .lwc__row:hover .lwc__panel {
            grid-template-rows: 0fr;
          }
          .lwc__row.is-open .lwc__panel {
            grid-template-rows: 1fr;
          }
          .lwc__row:hover .lwc__word {
            color: var(--rr-ink-soft);
          }
          .lwc__row.is-open .lwc__word {
            color: var(--rr-red);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lwc__panel {
            transition: none;
          }
          .lwc__sign::before,
          .lwc__sign::after,
          .lwc__word {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
