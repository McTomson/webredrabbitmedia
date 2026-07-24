'use client';

/**
 * Faehigkeiten — Raster im KUNDENLISTE-Look (Thomas 24.07.). Der bisherige
 * Karten-/Massimo-Osti-Look ist ersetzt durch das Zellen-Raster der
 * Hauptseite (components/relaunch/KundenGrid.tsx): weisser Grund, 3-Spalten-
 * Grid mit 1px-Hairline-Fugen (#e4e4e0), border-radius 0, in jeder Zelle NUR
 * der Faehigkeits-Name in DM Sans (var(--font-dmsans), weight 300). Die
 * Zellen sind hier <button>s: Klick oeffnet ein Modal mit der vollen
 * Beschreibung (4 Bloecke Nutzen / Fuer wen / So laeuft es / Warum gut, rote
 * Labels), der Talos-Sprechzeile und einem CTA -> /relaunch-preview/kontakt.
 *
 * Look-Referenz 1:1 der <style>-Block-Werte aus KundenGrid.tsx
 * (.rrkg-cell/.rrkg-name/.rrkg-grid). Die Sonderanfertigung-Zelle ist navy
 * abgesetzt (#1c2837, Name off-white) — KEIN Rot auf Navy.
 *
 * Daten aus ./faehigkeiten-data (geteilt, NICHT dupliziert). Kein styled-jsx
 * (greift im Projekt nicht zuverlaessig): plain namespaced <style> (.tlfg-*).
 * talos-v2.css bleibt unberuehrt; der Intro-Block nutzt weiter die tl-*-Klassen
 * (harmonisch mit dem Rest der Seite).
 */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FAEHIGKEITEN } from './faehigkeiten-data';

const KONTAKT = '/relaunch-preview/kontakt';

export default function Faehigkeiten() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = openIndex !== null ? FAEHIGKEITEN[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  // Esc schliesst; Body-Scroll sperren; Fokus in den Dialog und eine harte
  // Fokusfalle (Tab/Shift+Tab bleiben im Dialog); Fokus beim Schliessen zurueck.
  useEffect(() => {
    if (openIndex === null) return;
    lastFocus.current = document.activeElement as HTMLElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialog.contains(active as Node)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
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

        <div className="tlfg-grid">
          {FAEHIGKEITEN.map((f, i) => (
            <button
              type="button"
              key={f.name}
              className={`tlfg-cell${f.invers ? ' tlfg-cell--invers' : ''}`}
              onClick={() => setOpenIndex(i)}
              aria-haspopup="dialog"
            >
              <span className="tlfg-name">{f.name}</span>
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
        <div className="tlfg-backdrop" onClick={close}>
          <div
            ref={dialogRef}
            className={`tlfg-modal${open.invers ? ' tlfg-modal--invers' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tlfg-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              ref={closeRef}
              className="tlfg-close"
              onClick={close}
              aria-label="Schließen"
            >
              <span aria-hidden="true">×</span>
            </button>

            <p className="tlfg-modal__idx">
              {String((openIndex ?? 0) + 1).padStart(2, '0')} /{' '}
              {String(FAEHIGKEITEN.length).padStart(2, '0')}
            </p>
            <h3 id="tlfg-modal-title" className="tlfg-modal__name">
              {open.name}
            </h3>

            <div className="tlfg-modal__grid">
              <div className="tlfg-block">
                <p className="tlfg-label">Nutzen</p>
                <p className="tlfg-text">{open.nutzen}</p>
              </div>
              <div className="tlfg-block">
                <p className="tlfg-label">Für wen</p>
                <p className="tlfg-text">{open.fuerWen}</p>
              </div>
              <div className="tlfg-block">
                <p className="tlfg-label">So läuft es</p>
                <p className="tlfg-text">{open.ablauf}</p>
              </div>
              <div className="tlfg-block">
                <p className="tlfg-label">Warum gut</p>
                <p className="tlfg-text">{open.warum}</p>
              </div>
            </div>

            <p className="tlfg-says">{open.says}</p>

            <div className="tlfg-modal__cta">
              {open.invers ? (
                <Link href={KONTAKT} className="rr-btn-frame tlfg-frame--teal">
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
/* ---- Raster im KundenGrid-Look (Werte 1:1 aus KundenGrid.tsx) ---- */
.rr .tlfg-grid {
  margin-top: clamp(32px, 4.5vw, 56px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e4e4e0;
  border: 1px solid #e4e4e0;
}
.rr .tlfg-cell {
  display: flex;
  align-items: center;
  min-height: 140px;
  padding: clamp(2rem, 2.6vw, 3.1rem);
  background: #ffffff;
  border: 0;
  border-radius: 0;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s var(--rr-ease, cubic-bezier(.6,0,.4,1));
}
.rr .tlfg-cell:hover { background: #f4f4f2; }
.rr .tlfg-cell:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px #f12032;
}
.rr .tlfg-name {
  font-family: var(--font-dmsans), "DM Sans", sans-serif;
  font-weight: 300;
  font-size: clamp(1.4rem, 1.85vw, 1.7rem);
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: #23262e;
}

/* Sonderanfertigung: navy abgesetzt, Name off-white — KEIN Rot auf Navy. */
.rr .tlfg-cell--invers { background: #1c2837; }
.rr .tlfg-cell--invers:hover { background: #16202c; }
.rr .tlfg-cell--invers:focus-visible { box-shadow: inset 0 0 0 2px #f6f5f1; }
.rr .tlfg-cell--invers .tlfg-name { color: #f6f5f1; }

@media (min-width: 769px) and (max-width: 1120px) {
  .rr .tlfg-cell { min-height: 122px; padding: clamp(1.5rem, 2.2vw, 2.2rem); }
  .rr .tlfg-name { font-size: clamp(1.2rem, 2.15vw, 1.42rem); }
}
@media (max-width: 768px) {
  .rr .tlfg-grid { grid-template-columns: repeat(2, 1fr); }
  .rr .tlfg-cell { min-height: 88px; padding: 1.1rem 1.2rem; }
  .rr .tlfg-name { font-size: 1.15rem; }
}
@media (max-width: 460px) {
  .rr .tlfg-grid { grid-template-columns: 1fr; }
}

/* ---- Modal ---- */
.rr .tlfg-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(28, 40, 55, 0.55);
  backdrop-filter: blur(2px);
  animation: tlfg-fade 0.2s var(--rr-ease, ease);
}
.rr .tlfg-modal {
  position: relative;
  width: min(640px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  padding: clamp(28px, 4vw, 48px);
  background: var(--rr-paper);
  border: 1px solid var(--rr-line);
  border-radius: 0;
  box-shadow: 0 24px 60px rgba(28, 40, 55, 0.28);
  animation: tlfg-rise 0.24s var(--rr-ease, ease);
}
.rr .tlfg-modal--invers { background: #1c2837; border-color: #1c2837; }
.rr .tlfg-close {
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
  transition: background 0.2s var(--rr-ease, ease), color 0.2s var(--rr-ease, ease);
}
.rr .tlfg-close:hover { background: var(--rr-red); color: #fff; border-color: var(--rr-red); }
.rr .tlfg-close:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--rr-paper), 0 0 0 4px var(--rr-red); }
.rr .tlfg-modal--invers .tlfg-close { color: #f6f5f1; border-color: rgba(246, 245, 241, 0.3); }
.rr .tlfg-modal--invers .tlfg-close:hover { background: #39c2d7; color: #1c2837; border-color: #39c2d7; }

.rr .tlfg-modal__idx {
  margin: 0 0 10px;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: var(--rr-red);
}
.rr .tlfg-modal--invers .tlfg-modal__idx { color: #39c2d7; }
.rr .tlfg-modal__name {
  margin: 0 0 clamp(20px, 3vw, 28px);
  font-family: var(--font-dmsans), "DM Sans", sans-serif;
  font-weight: 300;
  font-size: clamp(30px, 4.4vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--rr-navy);
}
.rr .tlfg-modal--invers .tlfg-modal__name { color: #f6f5f1; }
.rr .tlfg-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(18px, 2.4vw, 26px);
}
@media (max-width: 520px) { .rr .tlfg-modal__grid { grid-template-columns: 1fr; } }
.rr .tlfg-block { display: flex; flex-direction: column; gap: 5px; }
.rr .tlfg-label {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rr-red);
}
.rr .tlfg-modal--invers .tlfg-label { color: #39c2d7; }
.rr .tlfg-text {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 15px;
  line-height: 1.5;
  color: var(--rr-ink-soft);
}
.rr .tlfg-modal--invers .tlfg-text { color: rgba(246, 245, 241, 0.82); }
.rr .tlfg-says {
  margin: clamp(22px, 3vw, 30px) 0 0;
  font-family: var(--rr-font-serif);
  font-style: italic;
  font-size: clamp(17px, 1.9vw, 20px);
  line-height: 1.4;
  color: var(--rr-navy);
}
.rr .tlfg-says::before { content: '\\201E'; }
.rr .tlfg-says::after { content: '\\201C'; }
.rr .tlfg-modal--invers .tlfg-says { color: rgba(246, 245, 241, 0.92); }
.rr .tlfg-modal__cta { margin-top: clamp(24px, 3.2vw, 32px); }

/* Tuerkis-Eck-Rahmen fuer die Invers-CTA (rr-btn-frame, nur Farbe --c). */
.rr .tlfg-frame--teal { --c: #39c2d7; }

@keyframes tlfg-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes tlfg-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .rr .tlfg-backdrop, .rr .tlfg-modal { animation: none; }
  .rr .tlfg-cell { transition: none; }
}
`;
