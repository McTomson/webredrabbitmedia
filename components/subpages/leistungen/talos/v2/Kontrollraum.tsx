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
 * (Grundausstattung), 3 mit Tag "GEBUCHT · <Faehigkeit>" (Tuerkis #39c2d7,
 * gleiche Akzentfarbe wie sonst bei Talos-Elementen im Projekt). Panel-
 * Einblendung (opacity/translateY, gestaffelt per --i) 1:1 aus dem Vorbild.
 */
type Panel = { tag: string; text: string; booked: boolean };

const PANELS: Panel[] = [
  { tag: "Immer an", text: "Seite läuft, alles schnell und erreichbar.", booked: false },
  {
    tag: "Immer an",
    text: "Deine Zahlen werden mitgeschrieben, jederzeit abrufbar in Klartext.",
    booked: false,
  },
  {
    tag: "Immer an",
    text: "Wächter aktiv, meldet sich sofort, falls etwas klemmt.",
    booked: false,
  },
  {
    tag: "Gebucht · Der Schreiber",
    text: "Nächster Beitrag liegt fertig zur Freigabe bereit.",
    booked: true,
  },
  {
    tag: "Gebucht · Der Empfang",
    text: "Anfrage von heute Mittag aufgefangen, Antwort wartet auf dein Ja.",
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
  const [inView, setInView] = useState(false);

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
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Kontrollraum</p>
        <h2 className="rr-statement tl-title">
          Was gerade alles für dich läuft, während du etwas anderes machst.
        </h2>
        <p className="rr-body-lg tl-lead">
          Talos arbeitet nicht der Reihe nach, sondern an vielem gleichzeitig,
          Tag und Nacht. Die Grundausstattung läuft immer. Was du dazubuchst,
          schaltet sich zusätzlich ein.
        </p>

        <div className={`tl-kr__stageArea ${inView ? "is-in" : ""}`} ref={rootRef}>
          <div className="tl-kr__browser">
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

        <p className="tl-says">
          Was du eingeschaltet hast, leuchtet. Der Rest bleibt einfach dunkel.
        </p>
      </div>
    </section>
  );
}
