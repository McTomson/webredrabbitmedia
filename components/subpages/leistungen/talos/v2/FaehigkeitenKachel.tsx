'use client';

/**
 * Faehigkeiten — VARIANTE A "Kachel-Raster + Modal" (Vergleichs-Entwurf).
 * Referenz: Massimo-Osti-Archiv — dichtes Raster aus umrandeten Feldern, je
 * Feld NUR ein Name (Index + Name), kein Beschreibungstext. Klick oeffnet ein
 * Overlay mit der vollen Beschreibung (Nutzen / Fuer wen / So laeuft es /
 * Warum gut + Talos-Sprechzeile) und einem CTA darunter. Schliessbar via X,
 * Backdrop-Klick und Esc.
 *
 * Daten aus ./faehigkeiten-data (geteilt mit Faehigkeiten.tsx-Copy). Der
 * Sektions-Intro (Eyebrow/H2/Lead/says) ist 1:1 aus Faehigkeiten.tsx
 * uebernommen und bleibt unveraendert. Farben/Radius/Typo aus dem Bestand
 * (rr-*-Tokens, radius 0). Die 6. Faehigkeit "Die Sonderanfertigung"
 * (invers) = Navy-Grund mit Tuerkis-Labels #39c2d7, kein Rot auf Navy: ihr
 * CTA ist deshalb ein Eck-Rahmen-Button in Tuerkis statt rr-btn-sweep--red.
 *
 * Kein styled-jsx (greift im Projekt nicht zuverlaessig): ein plain <style>
 * mit namespaced Klassen (.tlfab-a-*). talos-v2.css bleibt unberuehrt.
 */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FAEHIGKEITEN } from './faehigkeiten-data';

const KONTAKT = '/relaunch-preview/kontakt';

export default function FaehigkeitenKachel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = openIndex !== null ? FAEHIGKEITEN[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  // Esc schliesst; Body-Scroll sperren, solange offen; Fokus in den Dialog.
  useEffect(() => {
    if (openIndex === null) {
      lastFocus.current?.focus?.();
      return;
    }
    lastFocus.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close]);

  return (
    <section className="rr-section tl-section">
      <style>{CSS}</style>
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Wenn du mehr willst</p>
        <h2 className="rr-statement tl-title">
          Und wenn dir das noch nicht reicht, gib Talos einfach mehr Arbeit.
        </h2>
        <p className="rr-body-lg tl-lead">
          Über die Grundausstattung hinaus kannst du Talos einzelne Aufgaben
          übergeben. Jede wie ein eigener Kollege, den du dazuholst. Nimm, was
          dein Betrieb gerade braucht, und lass den Rest weg. Der Katalog
          wächst laufend.
        </p>
        <p className="tl-says">
          Such dir aus, was dir Arbeit abnimmt. Alles andere ignorierst du
          einfach.
        </p>

        <div className="tlfab-a-grid" role="list">
          {FAEHIGKEITEN.map((f, i) => (
            <button
              type="button"
              role="listitem"
              key={f.name}
              className={`tlfab-a-tile${f.invers ? ' tlfab-a-tile--invers' : ''}`}
              onClick={() => setOpenIndex(i)}
              aria-haspopup="dialog"
            >
              <span className="tlfab-a-tile__idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="tlfab-a-tile__name">{f.name}</span>
              <span className="tlfab-a-tile__cue" aria-hidden="true">Ansehen</span>
            </button>
          ))}
        </div>

        <p className="tl-footnote">
          Jede Fähigkeit buchst du einzeln, Monat für Monat. Du kannst
          jederzeit dazunehmen, was du brauchst, und jederzeit kündigen, was
          du nicht mehr brauchst. Keine Mindestlaufzeit, keine Vertragsfalle.
          Was das im Einzelnen kostet, steht offen auf der Preisseite.
          Maßarbeit richtet sich nach der Komplexität, das besprechen wir
          vorher.
        </p>
      </div>

      {open && (
        <div
          className="tlfab-a-backdrop"
          onClick={close}
          aria-hidden={false}
        >
          <div
            className={`tlfab-a-modal${open.invers ? ' tlfab-a-modal--invers' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tlfab-a-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              ref={closeRef}
              className="tlfab-a-close"
              onClick={close}
              aria-label="Schließen"
            >
              <span aria-hidden="true">×</span>
            </button>

            <p className="tlfab-a-modal__idx">
              {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(FAEHIGKEITEN.length).padStart(2, '0')}
            </p>
            <h3 id="tlfab-a-modal-title" className="tlfab-a-modal__name">
              {open.name}
            </h3>

            <div className="tlfab-a-modal__grid">
              <div className="tlfab-a-block">
                <p className="tlfab-a-label">Nutzen</p>
                <p className="tlfab-a-text">{open.nutzen}</p>
              </div>
              <div className="tlfab-a-block">
                <p className="tlfab-a-label">Für wen</p>
                <p className="tlfab-a-text">{open.fuerWen}</p>
              </div>
              <div className="tlfab-a-block">
                <p className="tlfab-a-label">So läuft es</p>
                <p className="tlfab-a-text">{open.ablauf}</p>
              </div>
              <div className="tlfab-a-block">
                <p className="tlfab-a-label">Warum gut</p>
                <p className="tlfab-a-text">{open.warum}</p>
              </div>
            </div>

            <p className="tlfab-a-says">{open.says}</p>

            <div className="tlfab-a-modal__cta">
              {open.invers ? (
                <Link href={KONTAKT} className="rr-btn-frame tlfab-a-frame--teal">
                  <i className="c1" />
                  <i className="c2" />
                  <i className="c3" />
                  <i className="c4" />
                  <span className="rr-btn-frame__t">Sonderanfertigung besprechen</span>
                </Link>
              ) : (
                <Link href={KONTAKT} className="rr-btn-sweep rr-btn-sweep--red">
                  Diese Fähigkeit dazubuchen
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const CSS = `
.rr .tlfab-a-grid {
  margin-top: clamp(32px, 4.5vw, 56px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Geteilte Hairlines wie im Archiv-Raster: Container traegt oben+links,
     jede Kachel rechts+unten -> keine doppelten Linien. */
  border-top: 1px solid var(--rr-line);
  border-left: 1px solid var(--rr-line);
}
.rr .tlfab-a-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-height: clamp(150px, 17vw, 190px);
  padding: 16px 18px;
  border-right: 1px solid var(--rr-line);
  border-bottom: 1px solid var(--rr-line);
  border-top: 0;
  border-left: 0;
  border-radius: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: var(--rr-navy);
  transition: background 0.25s var(--rr-ease), color 0.25s var(--rr-ease);
}
.rr .tlfab-a-tile:hover,
.rr .tlfab-a-tile:focus-visible { background: var(--rr-surface); outline: none; }
.rr .tlfab-a-tile:focus-visible { box-shadow: inset 0 0 0 2px var(--rr-red); }
.rr .tlfab-a-tile__idx {
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--rr-red);
}
.rr .tlfab-a-tile__name {
  margin-top: auto;
  font-family: var(--rr-font-serif);
  font-size: clamp(19px, 2vw, 24px);
  line-height: 1.1;
  color: inherit;
}
.rr .tlfab-a-tile__cue {
  font-family: var(--rr-font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rr-ink-soft);
  opacity: 0;
  transform: translateY(3px);
  transition: opacity 0.25s var(--rr-ease), transform 0.25s var(--rr-ease);
}
.rr .tlfab-a-tile:hover .tlfab-a-tile__cue,
.rr .tlfab-a-tile:focus-visible .tlfab-a-tile__cue { opacity: 1; transform: none; }

/* Invers-Kachel: Navy-Grund, Tuerkis-Akzent (kein Rot auf Navy). */
.rr .tlfab-a-tile--invers { background: var(--rr-navy); color: #f6f5f1; }
.rr .tlfab-a-tile--invers:hover,
.rr .tlfab-a-tile--invers:focus-visible { background: #16202c; }
.rr .tlfab-a-tile--invers:focus-visible { box-shadow: inset 0 0 0 2px #39c2d7; }
.rr .tlfab-a-tile--invers .tlfab-a-tile__idx { color: #39c2d7; }
.rr .tlfab-a-tile--invers .tlfab-a-tile__cue { color: rgba(246, 245, 241, 0.7); }

@media (max-width: 1180px) { .rr .tlfab-a-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .rr .tlfab-a-grid { grid-template-columns: 1fr; } }

/* ---- Overlay ---- */
.rr .tlfab-a-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(28, 40, 55, 0.55);
  backdrop-filter: blur(2px);
  animation: tlfab-a-fade 0.2s var(--rr-ease);
}
.rr .tlfab-a-modal {
  position: relative;
  width: min(640px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  padding: clamp(28px, 4vw, 48px);
  background: var(--rr-paper);
  border: 1px solid var(--rr-line);
  border-radius: 0;
  box-shadow: 0 24px 60px rgba(28, 40, 55, 0.28);
  animation: tlfab-a-rise 0.24s var(--rr-ease);
}
.rr .tlfab-a-modal--invers { background: var(--rr-navy); border-color: var(--rr-navy); }
.rr .tlfab-a-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  line-height: 1;
  color: var(--rr-navy);
  background: transparent;
  border: 1px solid var(--rr-line);
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s var(--rr-ease), color 0.2s var(--rr-ease);
}
.rr .tlfab-a-close:hover { background: var(--rr-red); color: #fff; border-color: var(--rr-red); }
.rr .tlfab-a-close:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--rr-paper), 0 0 0 4px var(--rr-red); }
.rr .tlfab-a-modal--invers .tlfab-a-close { color: #f6f5f1; border-color: rgba(246, 245, 241, 0.3); }
.rr .tlfab-a-modal--invers .tlfab-a-close:hover { background: #39c2d7; color: var(--rr-navy); border-color: #39c2d7; }

.rr .tlfab-a-modal__idx {
  margin: 0 0 10px;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--rr-red);
}
.rr .tlfab-a-modal--invers .tlfab-a-modal__idx { color: #39c2d7; }
.rr .tlfab-a-modal__name {
  margin: 0 0 clamp(20px, 3vw, 28px);
  font-family: var(--rr-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 4.4vw, 46px);
  line-height: 1.05;
  color: var(--rr-navy);
}
.rr .tlfab-a-modal--invers .tlfab-a-modal__name { color: #f6f5f1; }
.rr .tlfab-a-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(18px, 2.4vw, 26px);
}
@media (max-width: 520px) { .rr .tlfab-a-modal__grid { grid-template-columns: 1fr; } }
.rr .tlfab-a-block { display: flex; flex-direction: column; gap: 5px; }
.rr .tlfab-a-label {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rr-red);
}
.rr .tlfab-a-modal--invers .tlfab-a-label { color: #39c2d7; }
.rr .tlfab-a-text {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 15px;
  line-height: 1.5;
  color: var(--rr-ink-soft);
}
.rr .tlfab-a-modal--invers .tlfab-a-text { color: rgba(246, 245, 241, 0.82); }
.rr .tlfab-a-says {
  margin: clamp(22px, 3vw, 30px) 0 0;
  font-family: var(--rr-font-serif);
  font-style: italic;
  font-size: clamp(17px, 1.9vw, 20px);
  line-height: 1.4;
  color: var(--rr-navy);
}
.rr .tlfab-a-says::before { content: '\\201E'; }
.rr .tlfab-a-says::after { content: '\\201C'; }
.rr .tlfab-a-modal--invers .tlfab-a-says { color: rgba(246, 245, 241, 0.92); }
.rr .tlfab-a-modal__cta { margin-top: clamp(24px, 3.2vw, 32px); }

/* Tuerkis-Eck-Rahmen fuer die Invers-CTA (rr-btn-frame, nur Farbe --c). */
.rr .tlfab-a-frame--teal { --c: #39c2d7; }

@keyframes tlfab-a-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tlfab-a-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .rr .tlfab-a-backdrop, .rr .tlfab-a-modal { animation: none; }
  .rr .tlfab-a-tile, .rr .tlfab-a-tile__cue { transition: none; }
}
`;
