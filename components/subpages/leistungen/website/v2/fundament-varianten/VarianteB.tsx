"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Fundament — Variante B: NUMMERN-INDEX MIT PROGRESS-LEISTE.
 * Einspaltig editorial. 12 Zeilen mit grosser Serif-Nummer 01..12 links + Label
 * fett + Satz. Am linken Rand laeuft eine duenne vertikale Linie mit rotem
 * Fuellstand synchron zum Scroll (rAF). Beim Passieren wird jede Zeile einmalig
 * "abgehakt": Nummer wechselt von outline-grau auf navy, ein roter Unterstrich
 * schlaegt unter dem Label ein (scaleX). Gruppenwechsel als grosse Zwischenzeile.
 * prefers-reduced-motion -> alles statisch/abgehakt, keine Leiste-Animation.
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

// Rendersequenz: Gruppen-Zwischenzeile gefolgt von ihren Zeilen, mit laufender
// Nummer ueber beide Gruppen hinweg.
type Row =
  | { kind: "group"; heading: string }
  | { kind: "item"; tag: string; text: string; n: number };

const ROWS: Row[] = (() => {
  const out: Row[] = [];
  let n = 0;
  for (const g of GROUPS) {
    out.push({ kind: "group", heading: g.heading });
    for (const it of g.items) {
      out.push({ kind: "item", tag: it.tag, text: it.text, n: ++n });
    }
  }
  return out;
})();

export default function VarianteB() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      // Statische Fassung: alles abgehakt, Leiste voll, keine Animation.
      setChecked(new Set(Array.from({ length: 12 }, (_, i) => i + 1)));
      if (fillRef.current) fillRef.current.style.height = "100%";
      return;
    }

    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      // Fortschritt: wie weit die Bildschirmmitte durch die Liste gewandert ist.
      const total = rect.height;
      const passed = vh * 0.5 - rect.top;
      const pct = Math.max(0, Math.min(1, passed / total));
      fill.style.height = (pct * 100).toFixed(2) + "%";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Abhaken beim Passieren (einmalig): Zeile kreuzt das mittlere Sichtband.
    const observer = new IntersectionObserver(
      (entries) => {
        setChecked((prev) => {
          let changed = false;
          const next = new Set(prev);
          for (const e of entries) {
            if (e.isIntersecting) {
              const num = Number((e.target as HTMLElement).dataset.num);
              if (!next.has(num)) {
                next.add(num);
                changed = true;
              }
            }
          }
          return changed ? next : prev;
        });
      },
      { rootMargin: "0px 0px -42% 0px", threshold: 0 }
    );

    const items = list.querySelectorAll<HTMLElement>("[data-num]");
    items.forEach((el) => observer.observe(el));

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="lwb">
      <div className="lwb__wrap">
        <p className="rr-eyebrow-lg">WAS DRINSTECKT</p>
        <h2 className="rr-statement lwb__h2">Das Fundament ist immer schon drin.</h2>
        <p className="rr-body-lg lwb__intro">
          Nicht als Zusatzpaket, nicht als Kleingedrucktes. Sondern als das,
          womit jede Seite von uns startet.
        </p>

        <div className="lwb__list" ref={listRef}>
          <div className="lwb__track" aria-hidden="true">
            <div className="lwb__fill" ref={fillRef} />
          </div>

          {ROWS.map((row, i) =>
            row.kind === "group" ? (
              <p key={"g" + i} className="lwb__group">
                {row.heading}
              </p>
            ) : (
              <div
                key={row.tag}
                data-num={row.n}
                className={"lwb__row" + (checked.has(row.n) ? " is-checked" : "")}
              >
                <span className="lwb__num">{String(row.n).padStart(2, "0")}</span>
                <div className="lwb__body">
                  <span className="lwb__label">{row.tag}</span>
                  <p className="lwb__text">{row.text}</p>
                </div>
              </div>
            )
          )}
        </div>

        <p className="lwb__closer">Keine Extra-Rechnung. Kein Wartungsvertrag. Drin.</p>
        <p className="rr-meta lwb__meta">
          Was das kostet, steht schwarz auf weiß auf der{" "}
          <Link href="/preise" className="rr-link rr-link--text">
            Preisseite
          </Link>
          . Fixpreis, keine Überraschung am Ende.
        </p>
      </div>

      <style jsx>{`
        .lwb {
          background: #ffffff;
          color: var(--rr-ink);
          padding: clamp(72px, 12vh, 148px) var(--rr-gutter, clamp(20px, 4vw, 64px));
        }
        .lwb__wrap {
          max-width: 1080px;
          margin: 0 auto;
        }
        .lwb__h2 {
          max-width: 14em;
          margin: 20px 0 20px;
          color: var(--rr-navy);
        }
        .lwb__intro {
          max-width: 44em;
          color: var(--rr-ink-soft);
          margin-bottom: clamp(48px, 7vw, 88px);
        }
        .lwb__list {
          position: relative;
          padding-left: clamp(28px, 6vw, 60px);
        }
        .lwb__track {
          position: absolute;
          left: clamp(4px, 1.4vw, 14px);
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: color-mix(in srgb, var(--rr-navy) 16%, transparent);
        }
        .lwb__fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 0;
          background: var(--rr-red);
        }
        .lwb__group {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          line-height: 1.15;
          color: var(--rr-navy);
          margin: clamp(20px, 4vw, 40px) 0 clamp(6px, 1.4vw, 14px);
        }
        .lwb__group:first-of-type {
          margin-top: 0;
        }
        .lwb__row {
          display: grid;
          grid-template-columns: clamp(56px, 8vw, 100px) 1fr;
          gap: clamp(16px, 3vw, 40px);
          align-items: baseline;
          padding: clamp(26px, 4.4vh, 52px) 0;
          border-bottom: 1px solid
            color-mix(in srgb, var(--rr-ink) 12%, transparent);
        }
        .lwb__num {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1;
          font-variant-numeric: tabular-nums;
          color: transparent;
          -webkit-text-stroke: 1.5px
            color-mix(in srgb, var(--rr-navy) 34%, transparent);
          transition: color 0.5s var(--rr-ease),
            -webkit-text-stroke-color 0.5s var(--rr-ease);
        }
        @supports not ((-webkit-text-stroke: 1px black)) {
          .lwb__num {
            color: color-mix(in srgb, var(--rr-navy) 34%, transparent);
          }
        }
        .lwb__row.is-checked .lwb__num {
          color: var(--rr-navy);
          -webkit-text-stroke-color: transparent;
        }
        .lwb__body {
          min-width: 0;
        }
        .lwb__label {
          position: relative;
          display: inline-block;
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(1.1rem, 1.9vw, 1.5rem);
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--rr-navy);
        }
        .lwb__label::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 100%;
          height: 2px;
          background: var(--rr-red);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.5s var(--rr-ease);
        }
        .lwb__row.is-checked .lwb__label::after {
          transform: scaleX(1);
        }
        .lwb__text {
          font-family: var(--rr-font-ui);
          font-size: 16px;
          line-height: 1.55;
          color: var(--rr-ink-soft);
          margin: 12px 0 0;
          max-width: 40em;
        }
        .lwb__closer {
          font-family: var(--rr-font-display);
          font-weight: 600;
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          color: var(--rr-ink);
          margin: clamp(40px, 6vw, 72px) 0 0;
        }
        .lwb__meta {
          margin-top: 12px;
        }

        @media (max-width: 620px) {
          .lwb__row {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .lwb__num {
            font-size: clamp(1.7rem, 9vw, 2.4rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lwb__num,
          .lwb__label::after {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
