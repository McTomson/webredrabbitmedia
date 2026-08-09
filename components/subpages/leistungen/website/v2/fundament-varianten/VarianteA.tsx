"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  TRANSITION_EASING,
  TRANSITION_MS,
  isBumperDegraded,
  rideUnits,
} from "@/lib/relaunch/scroll-standard";

/**
 * Fundament — Variante A: STICKY-LEDGER MIT WANDERNDEM FOKUS.
 * Zweispaltig: links die Zeilenliste aller 12 Punkte (Label + Nummer, die 2
 * Gruppen als Zwischen-Ueberschriften), rechts steht der Detail-Satz des
 * aktiven Punktes als grosser Typo-Block. Der aktive Listenpunkt ist voll
 * hervorgehoben (navy, fett) + roter Marker, der Rest dimmt auf opacity .35.
 *
 * SCROLL (Kunde 29.07.: "der Kunde muss bei jedem Punkt durchatmen koennen,
 * nicht in 2 Sekunden durch die Seite"): der fruehere frei durchlaufende
 * Ledger (12 x 62vh) ist ersetzt durch eine gepinnte Strecke nach dem
 * Scroll-Standard (lib/relaunch/scroll-standard.ts). Track = 12 x
 * TRACK_VH_PER_POINT, ein 100vh-Sticky-Pin, und rideUnits() sorgt fuer den
 * Dwell: jeder Punkt steht rund 80% seiner Etappe still, der Wechsel passiert
 * im schmalen mittleren Fenster. Der Track traegt data-rr-snap (Einstieg
 * rastet ein) + data-rr-snap-exempt (innen regiert der Dwell, nicht die
 * Soft-Snap-Engine), wie CasePanels.tsx.
 *
 * Mobile (<= MOBILE_BREAKPOINT) und prefers-reduced-motion degradieren wie
 * bisher zu normalem vertikalem Scrollen: alle Detail-Bloecke untereinander,
 * aktiver Punkt per IntersectionObserver fuer die schlanke Sticky-Leiste.
 */

/**
 * Scroll-Strecke pro Punkt in vh. Bewusst UNTER dem Bumper-Standard von 190vh
 * (12 x 190 = 2280vh waere fuer eine Inhalts-Sektion absurd lang), aber klar
 * ueber einer Viewport-Hoehe. Track = 100vh Sticky-Pin + 12 x 130vh = 1660vh,
 * davon 1560vh echte Scroll-Strecke auf 11 Uebergaenge, also rund 142vh je
 * Etappe. Mit dem snapUnits-Dwell (DWELL_START .4 / DWELL_WIDTH .2) steht
 * jeder Punkt rund 114vh still und wechselt dann in rund 28vh Scroll-Strecke.
 */
const TRACK_VH_PER_POINT = 130;

/**
 * Ab hier abwaerts degradiert die Strecke zu normalem vertikalem Scrollen.
 * Deckungsgleich mit der bestehenden Mobile-Media-Query dieser Komponente
 * (die Ledger-Spalte bricht schon bei 860px, nicht erst bei MOBILE_BREAKPOINT).
 */
const LEDGER_BREAKPOINT = 860;

type Item = { tag: string; text: string };
type Group = { heading: string; items: Item[] };

const GROUPS: Group[] = [
  {
    heading: "Was auf der Seite steckt",
    items: [
      {
        tag: "Talos",
        text: "Talos, dein Copilot: Texte und Bilder änderst du selbst, und du siehst an einem Ort, was auf deiner Seite läuft.",
      },
      { tag: "Design", text: "Individuelles Design, gebaut auf deinen Betrieb." },
      { tag: "Handy", text: "Sauber am Handy, weil da deine Kunden suchen." },
      {
        tag: "Recht",
        text: "Impressum und Datenschutz nach AT-Recht, sauber aufgesetzt.",
      },
      {
        tag: "Gefunden werden",
        text: "So gebaut, dass Google und KI-Suchen wie ChatGPT deine Seite verstehen.",
      },
      { tag: "Kontakt", text: "Kontaktformular, das direkt bei dir ankommt." },
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
  // null = noch nicht gemessen (SSR); danach true = degradiert (Handy /
  // reduzierte Bewegung), false = gepinnte Strecke.
  const [degraded, setDegraded] = useState<boolean | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const N = FLAT.length;

  // Muss deckungsgleich mit den Media Queries unten bleiben, sonst laeuft der
  // rAF-Loop gegen ein Layout, das gar nicht gepinnt ist.
  useEffect(() => {
    const sync = () => setDegraded(isBumperDegraded(LEDGER_BREAKPOINT));
    sync();
    const mqs = [
      window.matchMedia(`(max-width: ${LEDGER_BREAKPOINT}px)`),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    mqs.forEach((m) => m.addEventListener("change", sync));
    return () => mqs.forEach((m) => m.removeEventListener("change", sync));
  }, []);

  // Gepinnte Strecke: Fortschritt -> snapUnits -> aktiver Punkt (mit Dwell).
  useEffect(() => {
    if (degraded !== false) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let dead = false;

    function render() {
      const r = track!.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const raw = total > 0 ? -r.top / total : 0;
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      const idx = Math.round(rideUnits(p * (N - 1), N));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    }

    function loop() {
      if (dead) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
    };
  }, [degraded, N]);

  // Degradiert: die Detail-Bloecke stehen untereinander, der aktive Punkt
  // kommt wie bisher aus dem IntersectionObserver (treibt die Sticky-Leiste).
  useEffect(() => {
    if (degraded !== true) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      // Horizontal zentrierte Karte erkennen (Deck wischt seitwaerts), nicht vertikal.
      { rootMargin: "0px -48% 0px -48%", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [degraded]);

  return (
    <section className="lwa">
      <div className="lwa__wrap">
        <p className="wd-eyebrow">WAS DRINSTECKT</p>
        <h2 className="rr-statement lwa__h2">Das Fundament ist immer schon drin.</h2>
        <p className="rr-body-lg lwa__intro">
          Nicht als Zusatzpaket, nicht als Kleingedrucktes. Sondern als das,
          womit jede Seite von uns startet.
        </p>

        {/* Gepinnte Strecke: data-rr-snap = der Einstieg rastet ein,
            data-rr-snap-exempt = innen regiert der eigene Dwell (Soft-Snap-
            Engine in components/relaunch/ScrollExperience.tsx). Degradiert
            faellt die Hoehe auf auto zurueck (Media Query unten). */}
        <div
          ref={trackRef}
          className="lwa__track"
          data-rr-snap
          data-rr-snap-exempt
          style={{ ["--lwa-n" as string]: String(N) }}
        >
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

          {/* Detail-Bloecke: Desktop = scrollendes Reveal (active). Mobile =
              zwei Wisch-Decks (je Gruppe eins) mit Gruppen-Ueberschrift; Karten
              horizontal wischbar (Thomas 01.08.: "zum Wischen, aber aufgeteilt").
              .lwa__deck ist auf Desktop display:contents (transparent), die
              Reihenfolge bleibt also die FLAT-Ledger-Reihenfolge. */}
          <div className="lwa__details">
            {GROUPS.map((g, gi) => {
              const base = gi === 0 ? 0 : GROUPS[0].items.length;
              return (
                <Fragment key={g.heading}>
                  <p className="lwa__mobilegroup">{g.heading}</p>
                  <div className="lwa__deck">
                    {g.items.map((it, ii) => {
                      const idx = base + ii;
                      const isOn = idx === active || active === -1;
                      return (
                        <div
                          key={it.tag}
                          data-idx={idx}
                          ref={(el) => {
                            detailRefs.current[idx] = el;
                          }}
                          className={"lwa__detail" + (isOn ? " is-on" : "")}
                        >
                          <p className="lwa__detailTag">
                            {String(idx + 1).padStart(2, "0")} · {it.tag}
                          </p>
                          <p className="lwa__detailText">{it.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              );
            })}
            </div>
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
             Off-White-Ton (projektweit etabliertes #f4f4f2, kein kaltes Grau)
             statt reinem Weiss. Kein var-Token vorhanden (--rr-surface ist
             #f4f4f2, ein anderer Wert), daher Hex wie im restlichen Projekt. */
          background: #f4f4f2;
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
        /* Grundzustand = degradiert: Track ohne eigene Hoehe, Detail-Bloecke
           stehen untereinander. Die gepinnte Strecke schaltet die Media Query
           ganz unten dazu (Progressive Enhancement wie in Ablauf.tsx). */
        .lwa__track {
          position: relative;
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
        /* Desktop: Deck-Wrapper transparent (display:contents -> Reihenfolge =
           FLAT-Ledger, Reveal unveraendert), Gruppen-Ueberschrift versteckt.
           Beides wird nur auf Mobile aktiv (siehe @media). */
        .lwa__deck {
          display: contents;
        }
        .lwa__mobilegroup {
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
          /* Zwei Wisch-Decks, je Gruppe eins, mit Gruppen-Ueberschrift
             (Thomas 01.08.: "zum Wischen, aber aufgeteilt"). .lwa__details
             stapelt die zwei Decks vertikal; jedes .lwa__deck ist ein
             horizontaler scroll-snap-Streifen, Karte ~78% mit Peek der
             naechsten als Wisch-Hinweis. Die globale Fortschritts-Leiste
             faellt weg (die zwei Gruppen-Titel geben die Orientierung). */
          .lwa__mobilebar {
            display: none;
          }
          .lwa__details {
            display: block;
          }
          .lwa__mobilegroup {
            display: block;
            font-family: var(--rr-font-ui);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--rr-red);
            margin: 30px 0 10px;
          }
          .lwa__mobilegroup:first-of-type {
            margin-top: 6px;
          }
          .lwa__deck {
            display: flex;
            flex-direction: row;
            gap: 14px;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scroll-padding-left: 6vw;
            padding: 6px 6vw 18px;
            margin: 0 calc(-1 * var(--rr-gutter, clamp(20px, 4vw, 64px)));
            scrollbar-width: none;
          }
          .lwa__deck::-webkit-scrollbar {
            display: none;
          }
          .lwa__detail {
            flex: 0 0 78%;
            scroll-snap-align: center;
            min-height: 34vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 14px;
            padding: clamp(22px, 6vw, 30px);
            background: #ffffff;
            border: 1px solid rgba(28, 40, 55, 0.1);
            border-top: 0;
            border-radius: 20px;
            box-shadow: 0 20px 44px -30px rgba(28, 40, 55, 0.45);
          }
          .lwa__detailText {
            font-size: clamp(1.15rem, 4.6vw, 1.5rem);
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

        /* ------------------------------------------------------------------
           Gepinnte Strecke (Desktop + Bewegung erlaubt). Kunde 29.07.: jeder
           Punkt soll stehen bleiben, statt in Sekunden durchzurauschen. Der
           Breakpoint muss deckungsgleich mit LEDGER_BREAKPOINT im JS bleiben,
           sonst laeuft der rAF-Loop gegen ein nicht gepinntes Layout.
           ------------------------------------------------------------------ */
        @media (min-width: ${LEDGER_BREAKPOINT + 1}px) and (prefers-reduced-motion: no-preference) {
          .lwa__track {
            /* 100vh Pin + 12 x 130vh Scroll-Strecke. */
            height: calc(100vh + var(--lwa-n) * ${TRACK_VH_PER_POINT}vh);
          }
          .lwa__grid {
            position: sticky;
            top: 0;
            height: 100vh;
            align-items: center;
          }
          /* Im Pin haengt die Ledger-Spalte ohnehin fest, kein zweites Sticky. */
          .lwa__aside {
            position: static;
            align-self: center;
          }
          /* Listendichte an die Fensterhoehe koppeln, damit die 12 Zeilen auch
             auf flachen Laptops in den 100vh-Pin passen. */
          .lwa__row {
            padding: clamp(3px, 0.8vh, 7px) 0;
          }
          .lwa__grouphd {
            margin: clamp(10px, 2vh, 22px) 0 clamp(5px, 1vh, 10px);
          }
          .lwa__details {
            position: relative;
            min-height: clamp(220px, 38vh, 380px);
          }
          /* Alle 12 Detail-Bloecke liegen uebereinander; sichtbar ist der
             aktive. Der Wechsel ist eine kurze Blende in der Standard-Dauer,
             das Stehenbleiben macht der snapUnits-Dwell im rAF-Loop. */
          .lwa__detail {
            position: absolute;
            inset: 0;
            min-height: 0;
            padding: 0;
            border-top: 0;
            opacity: 0;
            transform: translateY(14px);
            pointer-events: none;
            transition: opacity ${TRANSITION_MS}ms ${TRANSITION_EASING},
              transform ${TRANSITION_MS}ms ${TRANSITION_EASING};
          }
          .lwa__detail.is-on {
            opacity: 1;
            transform: none;
            pointer-events: auto;
          }
        }
      `}</style>
    </section>
  );
}
