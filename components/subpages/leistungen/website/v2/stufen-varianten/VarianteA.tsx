"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Stufen — Variante A: EDITORIAL ACCORDION.
 * Jede Stufe ist eine grosse Editorial-Row mit riesigem Stufennamen. Die
 * Merkmale liegen als Accordion-Zeilen darunter, getrennt durch haarduenne
 * Linien. Marker = kleiner roter Punkt statt Nummer; ein Plus dreht beim
 * Aufklappen dezent zu einem x. Klick klappt den Erklaertext auf
 * (grid-template-rows 0fr -> 1fr, Text fadet ein). Beim Scroll-Eintritt
 * staggern die Zeilen herein. prefers-reduced-motion -> alles statisch offen-fahig
 * ohne Bewegung. Copy identisch zu Variante B/C.
 */

type Merkmal = { titel: string; detail: string };
type Stufe = {
  name: string;
  text: string;
  featured?: boolean;
  merkmale: Merkmal[];
};

// Merkmale + Erklaertexte ausschliesslich aus dokumentierten Quellen
// (DreiStufen.tsx + fundament-varianten/VarianteA.tsx). Nichts Neues versprochen.
export const STUFEN: Stufe[] = [
  {
    name: "Starter",
    text: "Für alle, die schlank starten und erstmal gefunden werden wollen. One-Pager, sauber, schnell.",
    merkmale: [
      {
        titel: "One-Pager",
        detail:
          "Eine Seite, sauber und schnell. Alles Wichtige an einem Ort, damit du erstmal online bist und gefunden wirst.",
      },
      {
        titel: "Individuelles Design",
        detail: "Individuelles Design, gebaut auf deinen Betrieb.",
      },
      {
        titel: "Sauber am Handy",
        detail: "Sauber am Handy, weil da deine Kunden suchen.",
      },
      {
        titel: "Rechtssicher",
        detail:
          "Rechtssicher nach AT-Recht: Impressum und Datenschutz passen.",
      },
      {
        titel: "Kontaktformular",
        detail: "Kontaktformular, das direkt bei dir ankommt.",
      },
      {
        titel: "Eigene Domain",
        detail: "Eigene Domain, gehört dir.",
      },
      {
        titel: "Hosting inklusive",
        detail:
          "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
      },
      {
        titel: "Pflege inklusive",
        detail:
          "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
      },
    ],
  },
  {
    name: "Business",
    text: "Für Betriebe, die ernst machen wollen. Mehrseitig, auf lokale Sichtbarkeit und Anfragen gebaut.",
    featured: true,
    merkmale: [
      {
        titel: "Mehrseitig",
        detail:
          "Mehrere Seiten statt einer, mit Platz für Leistungen, Team und alles, was dein Betrieb zeigen will.",
      },
      {
        titel: "Lokale Sichtbarkeit",
        detail:
          "Auf lokale Sichtbarkeit gebaut, damit dich Leute aus deiner Gegend finden.",
      },
      {
        titel: "Auf Anfragen gebaut",
        detail:
          "Auf Anfragen gebaut: das Kontaktformular kommt direkt bei dir an.",
      },
      {
        titel: "Individuelles Design",
        detail: "Individuelles Design, gebaut auf deinen Betrieb.",
      },
      {
        titel: "Sauber am Handy",
        detail: "Sauber am Handy, weil da deine Kunden suchen.",
      },
      {
        titel: "Rechtssicher",
        detail:
          "Rechtssicher nach AT-Recht: Impressum und Datenschutz passen.",
      },
      {
        titel: "Eigene Domain",
        detail: "Eigene Domain, gehört dir.",
      },
      {
        titel: "Selbst ändern",
        detail:
          "Öffnungszeiten, Texte, Bilder: das machst du selbst, ohne uns anzurufen und ohne Zusatzkosten.",
      },
      {
        titel: "Hosting inklusive",
        detail:
          "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
      },
      {
        titel: "Pflege inklusive",
        detail:
          "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
      },
    ],
  },
  {
    name: "Premium",
    text: "Für alle, deren Seite wirklich arbeiten soll. Umfangreich, auf dauerhafte Sichtbarkeit und laufende Anfragen gebaut, mit Inhalten, die mitwachsen.",
    merkmale: [
      {
        titel: "Umfangreich",
        detail:
          "Die umfangreichste Stufe. Für alle, deren Seite wirklich arbeiten soll.",
      },
      {
        titel: "Dauerhafte Sichtbarkeit",
        detail:
          "Auf dauerhafte Sichtbarkeit und laufende Anfragen gebaut.",
      },
      {
        titel: "Inhalte wachsen mit",
        detail: "Mit Inhalten, die mitwachsen.",
      },
      {
        titel: "Grund-SEO",
        detail:
          "Grund-SEO, damit dich Leute aus deiner Gegend finden.",
      },
      {
        titel: "Zahlen im Klartext",
        detail:
          "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch.",
      },
      {
        titel: "Ein Wächter passt auf",
        detail:
          "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab.",
      },
      {
        titel: "Monatlicher Check",
        detail:
          "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist.",
      },
      {
        titel: "Selbst ändern",
        detail:
          "Öffnungszeiten, Texte, Bilder: das machst du selbst, ohne uns anzurufen und ohne Zusatzkosten.",
      },
      {
        titel: "Hosting inklusive",
        detail:
          "Deine Seite liegt bei uns, schnell und sicher. Du kümmerst dich um nichts.",
      },
      {
        titel: "Pflege inklusive",
        detail:
          "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit.",
      },
    ],
  },
];

function StufeBlock({ stufe }: { stufe: Stufe }) {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setShown(true);
      return;
    }
    const el = listRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={"eac__stufe" + (stufe.featured ? " eac__stufe--featured" : "")}>
      <div className="eac__head">
        <div className="eac__namewrap">
          <h3 className="eac__name">
            {stufe.name}
            {stufe.featured && <span className="eac__namedot" aria-hidden="true" />}
          </h3>
          {stufe.featured && <span className="eac__tag">MEISTGEWÄHLT</span>}
        </div>
        <p className="eac__text">{stufe.text}</p>
      </div>

      <div ref={listRef} className={"eac__list" + (shown ? " is-in" : "")}>
        {stufe.merkmale.map((m, i) => {
          const isOpen = open === i;
          return (
            <div
              key={m.titel}
              className={"eac__item" + (isOpen ? " is-open" : "")}
              style={{ transitionDelay: shown ? `${Math.min(i, 9) * 45}ms` : "0ms" }}
            >
              <button
                type="button"
                className="eac__trigger"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="eac__dot" aria-hidden="true" />
                <span className="eac__titel">{m.titel}</span>
                <span className="eac__plus" aria-hidden="true">
                  <span className="eac__plus-h" />
                  <span className="eac__plus-v" />
                </span>
              </button>
              <div className="eac__panel">
                <div className="eac__panel-inner">
                  <p className="eac__detail">{m.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .eac__stufe {
          padding: clamp(40px, 6vw, 72px) 0;
          border-top: 1px solid rgba(28, 40, 55, 0.12);
        }
        .eac__stufe--featured {
          border-top: 1px solid var(--rr-red);
          border-bottom: 1px solid var(--rr-red);
        }
        .eac__stufe--featured + .eac__stufe {
          border-top: 0;
        }

        .eac__head {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: clamp(20px, 4vw, 56px);
          align-items: end;
          margin-bottom: clamp(28px, 4vw, 48px);
        }
        .eac__namewrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .eac__name {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          line-height: 0.98;
          color: var(--rr-navy);
          margin: 0;
          display: inline-flex;
          align-items: flex-end;
          gap: 0.28em;
          opacity: 0.62;
        }
        .eac__stufe--featured .eac__name {
          opacity: 1;
          font-size: clamp(2.9rem, 6.2vw, 5.4rem);
        }
        .eac__namedot {
          width: 0.16em;
          height: 0.16em;
          border-radius: 50%;
          background: var(--rr-red);
          margin-bottom: 0.22em;
        }
        .eac__tag {
          align-self: flex-start;
          border: 1px solid var(--rr-red);
          color: var(--rr-red);
          font-family: var(--rr-font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
        }
        .eac__text {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          max-width: 40em;
          margin: 0;
        }

        .eac__list {
          border-top: 1px solid rgba(28, 40, 55, 0.1);
        }
        .eac__item {
          border-bottom: 1px solid rgba(28, 40, 55, 0.1);
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s var(--rr-ease, ease),
            transform 0.5s var(--rr-ease, ease);
        }
        .eac__list.is-in .eac__item {
          opacity: 1;
          transform: none;
        }

        .eac__trigger {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: grid;
          grid-template-columns: 14px 1fr 18px;
          align-items: center;
          gap: 16px;
          padding: clamp(14px, 1.8vw, 20px) 4px;
          text-align: left;
          color: var(--rr-navy);
          transition: padding-left 0.3s var(--rr-ease, ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .eac__trigger:hover {
            padding-left: 12px;
          }
        }
        .eac__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(28, 40, 55, 0.28);
          transition: background 0.3s var(--rr-ease, ease),
            transform 0.3s var(--rr-ease, ease);
        }
        .eac__item.is-open .eac__dot,
        .eac__trigger:hover .eac__dot {
          background: var(--rr-red);
          transform: scale(1.25);
        }
        .eac__titel {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.05rem, 1.8vw, 1.4rem);
          letter-spacing: -0.01em;
          color: var(--rr-navy);
        }
        .eac__plus {
          position: relative;
          width: 16px;
          height: 16px;
          transition: transform 0.35s var(--rr-ease, ease);
        }
        .eac__item.is-open .eac__plus {
          transform: rotate(45deg);
        }
        .eac__plus-h,
        .eac__plus-v {
          position: absolute;
          background: var(--rr-navy);
        }
        .eac__plus-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1.5px;
          transform: translateY(-50%);
        }
        .eac__plus-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1.5px;
          transform: translateX(-50%);
        }

        .eac__panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s var(--rr-ease, ease);
        }
        .eac__item.is-open .eac__panel {
          grid-template-rows: 1fr;
        }
        .eac__panel-inner {
          overflow: hidden;
          min-height: 0;
        }
        .eac__detail {
          font-family: var(--rr-font-ui);
          font-size: 15px;
          line-height: 1.6;
          color: var(--rr-ink-soft);
          max-width: 40em;
          margin: 0;
          padding: 0 4px clamp(18px, 2.4vw, 26px) 34px;
          opacity: 0;
          transform: translateY(-4px);
          transition: opacity 0.35s var(--rr-ease, ease) 0.05s,
            transform 0.35s var(--rr-ease, ease) 0.05s;
        }
        .eac__item.is-open .eac__detail {
          opacity: 1;
          transform: none;
        }

        @media (max-width: 720px) {
          .eac__head {
            grid-template-columns: 1fr;
            gap: 16px;
            align-items: start;
          }
          .eac__name,
          .eac__stufe--featured .eac__name {
            font-size: clamp(2.2rem, 11vw, 3rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .eac__item {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .eac__trigger,
          .eac__dot,
          .eac__plus,
          .eac__panel,
          .eac__detail {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function VarianteA() {
  return (
    <section className="eac">
      <div className="eac__wrap">
        <p className="rr-eyebrow-lg">DREI STUFEN</p>
        <h2 className="eac__h2">Drei Stufen. Eine passt zu dir.</h2>

        {STUFEN.map((s) => (
          <StufeBlock key={s.name} stufe={s} />
        ))}

        <p className="rr-meta eac__meta">
          Was die Stufen kosten, steht schwarz auf weiß auf der{" "}
          <Link href="/relaunch-preview/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, kein Stundensatz-Ratespiel.
        </p>
      </div>

      <style jsx>{`
        .eac {
          background: #f6f5f1;
          color: var(--rr-ink);
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .eac__wrap {
          max-width: 1120px;
          margin: 0 auto;
        }
        .eac__h2 {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2rem, 4.5vw, 3.4rem);
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--rr-navy);
          max-width: 16em;
          margin: 18px 0 clamp(36px, 5vw, 56px);
        }
        .eac__meta {
          margin-top: clamp(40px, 5vw, 64px);
        }
      `}</style>
    </section>
  );
}
