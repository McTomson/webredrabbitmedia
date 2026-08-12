"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kontrollraum — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 7. Mechanik 1:1 uebernommen vom abgenommenen Navy-Browser-Frame
 * (components/subpages/leistungen/website/v2/TalosDashboard.tsx): dunkler
 * Browser-Chrome (Ampel-Punkte, URL-Pill) rahmt ein helles Panel-Feld.
 *
 * Abweichung vom Vorbild (Auftrag): KEIN TalosEntranceStage/3D hier. Der
 * seitenweite Companion-Talos uebernimmt den Auftritt, deshalb bleibt rechts
 * im Frame eine bewusst freie Flaeche (.tl-kr__stage-void, min. 30% Breite).
 * 6 Status-Panels statt der 5 Dashboard-Karten: 3 mit Tag "IMMER AN"
 * (Grundausstattung), 3 mit Tag "GEBUCHT · <Faehigkeit>" (Tuerkis #f12032,
 * gleiche Akzentfarbe wie sonst bei Talos-Elementen im Projekt). Panel-
 * Einblendung (opacity/translateY, gestaffelt per --i) 1:1 aus dem Vorbild.
 */
type Panel = { tag: string; text: string; booked: boolean };

// Panels = die Bereiche der Kommandozentrale als Live-Beispiel (Pivot Thomas
// 07.08.). Beispielwerte sind erkennbar illustrativ (Dashboard-Mock), keine
// Kennzahlen-Behauptung ueber echte Kunden.
const PANELS: Panel[] = [
  {
    tag: "Immer an · Besucher",
    text: "38 Leute waren heute da, die meisten kamen über Google.",
    booked: false,
  },
  {
    tag: "Immer an · Technik",
    text: "Seite läuft, alles schnell und erreichbar.",
    booked: false,
  },
  {
    tag: "Immer an · Bewertungen",
    text: "Neue Fünf-Sterne-Bewertung von heute Vormittag.",
    booked: false,
  },
  {
    tag: "Immer an · Anfragen",
    text: "Anfrage von heute Mittag aufgefangen, liegt für dich bereit.",
    booked: false,
  },
  {
    tag: "Gebucht · Der Schreiber",
    text: "Nächster Beitrag liegt fertig zur Freigabe bereit.",
    booked: true,
  },
  {
    tag: "Gebucht · Der Sichtbarmacher",
    text: "Arbeitet daran, dass dich mehr Leute finden.",
    booked: true,
  },
];

export default function Kontrollraum() {
  const rootRef = useRef<HTMLDivElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Mobile/Tablet-Pan (Thomas 08.08., iPhone-Screenshot: 6 gestapelte Panels =
  // "sehr lang gezogen"): gleiche gepinnte Auto-Scroll-Szene wie das Dashboard
  // der Website-Seite (TalosDashboard.tsx, Muster 01.08.) — erste Haelfte
  // sichtbar, vertikales Scrollen pannt horizontal zur zweiten Haelfte, danach
  // geht es normal weiter. Erst nach Mount gesetzt (SSR desktop-sicher).
  const [panActive, setPanActive] = useState(false);

  useEffect(() => {
    setPanActive(
      window.matchMedia("(max-width: 860px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Auto-Scroll-Pan: vertikaler Track-Fortschritt q treibt das horizontale
  // translateX des Browser-Frames. Liest nur die Scroll-Position (kapert den
  // Touch nicht), 1:1 das Muster aus TalosDashboard.tsx. BEWUSST linear, ohne
  // Halte-Plateau (Thomas 08.08.: Stops auf Handy/Tablet raus).
  useEffect(() => {
    if (!panActive) return;
    const track = rootRef.current;
    const browser = browserRef.current;
    if (!track || !browser) return;
    let raf = 0;
    let destroyed = false;
    const clamp = (n: number, a: number, b: number) => (n < a ? a : n > b ? b : n);

    const render = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const denom = rect.height - vh;
      const q = denom > 0 ? clamp(-rect.top / denom, 0, 1) : 0;
      const stageW = browser.parentElement ? browser.parentElement.clientWidth : 0;
      const shift = Math.max(0, browser.offsetWidth - stageW); // = eine Sichtfensterbreite
      browser.style.transform = `translate3d(${(-q * shift).toFixed(1)}px,0,0)`;
    };
    const loop = () => {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    render();
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, [panActive]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="rr-section tl-section tl-section--surface" data-rr-snap>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Kontrollraum</p>
        <h2 className="rr-statement tl-title">
          Was gerade alles für dich läuft, während du etwas anderes machst.
        </h2>
        <p className="rr-body-lg tl-lead">
          So sieht das aus. Die Bereiche deiner Kommandozentrale laufen immer,
          Tag und Nacht, ohne dass jemand etwas tun muss. Was du Talos
          zusätzlich übergibst, schaltet sich dazu.
        </p>

        <div className={`tl-kr__stageArea ${inView ? "is-in" : ""}`} ref={rootRef}>
          {/* Mobile/Tablet: gepinnte Szene — der Scroller ist sticky, der
              Browser doppelt so breit wie das Sichtfenster (zwei Haelften).
              Desktop: unpositionierter, transparenter Wrapper (alle Regeln
              unter @media max-width:860px), Layout unveraendert. */}
          <div className="tl-kr__scroller">
          <div className="tl-kr__browser" ref={browserRef}>
            {/* Browser-Chrome */}
            <div className="tl-kr__chrome">
              <span className="tl-kr__lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="tl-kr__url">
                <span className="tl-kr__lock" aria-hidden="true" />
                dein-dashboard.redrabbit.media
              </span>
              <span className="tl-kr__chromeSpacer" aria-hidden="true" />
            </div>

            {/* Heller Screen: Panels + bewusst freie Flaeche fuer den
                seitenweiten Companion-Talos (kein eigenes 3D hier). */}
            <div className="tl-kr__screen">
              <div className="tl-kr__panels">
                {PANELS.map((p, i) => (
                  <div
                    key={p.text}
                    className={`tl-kr__card ${p.booked ? "is-booked" : ""}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="tl-kr__tag">
                      <span className="tl-kr__dot" aria-hidden="true" />
                      {p.tag}
                    </span>
                    <span className="tl-kr__cardText">{p.text}</span>
                  </div>
                ))}
              </div>

              <div className="tl-kr__stage-void" aria-hidden="true" />
            </div>
          </div>
          </div>
        </div>

        <p className="tl-says">
          Was du eingeschaltet hast, leuchtet. Der Rest bleibt einfach dunkel.
        </p>
      </div>
    </section>
  );
}
