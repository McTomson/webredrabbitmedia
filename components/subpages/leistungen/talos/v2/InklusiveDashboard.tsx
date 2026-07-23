"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Inklusive-Sektion — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md,
 * Sektion 3. Mechanik 1:1 uebernommen von der abgenommenen Sticky-Ledger-
 * Variante A des Fundaments
 * (components/subpages/leistungen/website/v2/fundament-varianten/VarianteA.tsx):
 * links eine sticky Liste der 4 Punkte, rechts scrollen die Detail-Saetze als
 * grosse Typo-Bloecke vorbei; der Listenpunkt des gerade mittig sichtbaren
 * Details wird hervorgehoben (voll deckend + roter Marker), der Rest dimmt auf
 * opacity .35. IntersectionObserver, prefers-reduced-motion -> statische
 * Fassung (kein Dimmen). Nur 4 Eintraege, deshalb keine Gruppen-Zwischen-
 * ueberschriften wie im Vorbild (dort 2 Gruppen à 6 Punkte).
 */
type Item = { tag: string; text: string };

// Copy: REVISION 23.07. (Login/eigenes Backend + Kommandozentrale, ENTWURF).
const ITEMS: Item[] = [
  {
    tag: "Selbst ändern",
    text: "Bilder und Texte tauschst du in deinem Dashboard selbst aus. Das geht einfacher als bei WordPress, und du brauchst dafür keinen Anruf bei uns.",
  },
  {
    tag: "Zahlen in Klartext",
    text: "Du siehst, wie oft du gefunden wirst und wo die Leute klicken. Verständlich aufbereitet, mit Google Search Console und Heatmap dahinter.",
  },
  {
    tag: "Ausfall-Alarm per Mail",
    text: "Klemmt etwas oder fällt die Seite aus, bekommst du sofort eine Mail. Du erfährst es von uns, nicht von deinen Kunden.",
  },
  {
    tag: "Hosting läuft mit",
    text: "Hosting, Pflege und Updates übernehmen wir im Hintergrund. Um nichts davon musst du dich kümmern, deine Seite bleibt schnell und sicher.",
  },
];

export default function InklusiveDashboard() {
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

  const shown = Math.max(0, active);

  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Bei jeder Website dabei</p>
        <h2 className="rr-statement tl-title">
          Du bekommst dein eigenes Dashboard. Und die Talos-Kommandozentrale
          gleich dazu.
        </h2>
        <p className="rr-body-lg tl-lead">
          Zu jeder Website von uns bekommst du einen Login. Dahinter liegt dein
          eigenes Dashboard. Dort tauschst du Bilder und Texte selbst aus,
          ähnlich wie bei WordPress, nur einfacher. Und daneben liegt die
          Talos-Kommandozentrale, in der die Sachen hier schon eingebaut sind.
          Alles ohne Aufpreis. So bekommst du das sonst nirgends.
        </p>

        <div className="tl-ink-grid">
          {/* Mobile: schlanke Sticky-Leiste statt der linken Ledger-Spalte,
              1:1 aus dem Vorbild uebernommen. */}
          <div className="tl-ink-mobilebar" aria-hidden="true">
            <span className="tl-ink-mobilecurrent">
              {String(shown + 1).padStart(2, "0")} · {ITEMS[shown].tag}
            </span>
            <span className="tl-ink-mobilecount">
              {shown + 1} / {ITEMS.length}
            </span>
            <span
              className="tl-ink-mobileprogress"
              style={{ transform: `scaleX(${(shown + 1) / ITEMS.length})` }}
            />
          </div>

          {/* Sticky Ledger links */}
          <aside className="tl-ink-aside" aria-hidden="true">
            <ol className="tl-ink-list">
              {ITEMS.map((it, idx) => (
                <li key={it.tag} className="tl-ink-li">
                  <span
                    className={
                      "tl-ink-row" + (idx === active ? " is-active" : "")
                    }
                  >
                    <span className="tl-ink-mark" />
                    <span className="tl-ink-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="tl-ink-label">{it.tag}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          {/* Scrollende Detail-Bloecke rechts */}
          <div className="tl-ink-details">
            {ITEMS.map((it, idx) => (
              <div
                key={it.tag}
                data-idx={idx}
                ref={(el) => {
                  detailRefs.current[idx] = el;
                }}
                className="tl-ink-detail"
              >
                <p className="tl-ink-detailTag">
                  {String(idx + 1).padStart(2, "0")} · {it.tag}
                </p>
                <p className="tl-ink-detailText">{it.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="tl-says">
          Das steckt alles schon drin. Dafür zahlst du keinen Cent extra.
        </p>
      </div>
    </section>
  );
}
