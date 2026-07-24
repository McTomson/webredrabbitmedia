'use client';

/**
 * Faehigkeiten — EXAKTER Klon des Kundenliste-Rasters der Hauptseite
 * (components/relaunch/KundenGrid.tsx), inkl. Schreib-/Tipp-Effekt (Thomas
 * 24.07.). Die Grid-/Zellen-/Namen-/Caret-Werte sind 1:1 aus dem <style>-Block
 * von KundenGrid.tsx uebernommen (.rrkg-grid / .rrkg-cell / .rrkg-name /
 * .rrkg-caret): weisser Grund #ffffff, Hover #f4f4f2, 3-Spalten-Grid mit
 * 1px-Hairline-Fugen auf #e4e4e0, border 1px #e4e4e0, border-radius 0, Zelle
 * min-height 140px, padding clamp(2rem,2.6vw,3.1rem), Name DM Sans weight 300,
 * font-size clamp(1.4rem,1.85vw,1.7rem), letter-spacing -.01em, color #23262e.
 * Die Font-Metrik steht — wie im Original — auf der ZELLE, damit die Caret-
 * Groesse (.14em / 1.05em) exakt mitzieht.
 *
 * Tipp-Effekt 1:1 aus KundenGrid.tsx Zeilen 133-198: rAF-Loop, State-Machine
 * idle -> del -> pause -> type -> idle, DEL_MS/TYPE_MS/PAUSE_MS identisch, jede
 * Zelle tippt IHREN eigenen Namen neu (kein Fremdname), rAF nur aktiv solange
 * die Sektion im Viewport steht (bounding-rect-Check), prefers-reduced-motion
 * => kein Tippen (statische Namen, kein Caret).
 *
 * Abweichungen von KundenGrid (bewusst, markenkonform):
 *  - 6 Faehigkeits-Namen statt Kundennamen; kein CTA-/Chevron-Feld.
 *  - Zellen sind <button>: Klick oeffnet ein Modal (4 Bloecke, rote Labels,
 *    says-Zeile, CTA -> /relaunch-preview/kontakt). Modal-Logik unveraendert
 *    uebernommen (Esc/X/Backdrop, Body-Scroll-Lock, harte Fokusfalle).
 *  - Klick-Zeichen (kleines Plus) unten rechts je Zelle als Klickbarkeits-
 *    Signal (border-radius 0), hover -> Rot.
 *  - Sonderanfertigung-Zelle navy #1c2837, Name off-white, Caret + Plus in
 *    Tuerkis #39c2d7 — KEIN Rot auf Navy.
 *
 * Daten aus ./faehigkeiten-data (geteilt, NICHT dupliziert). Kein styled-jsx
 * (greift im Projekt nicht zuverlaessig): plain namespaced <style> (.tlfg-*).
 * talos-v2.css bleibt unberuehrt; der Intro-Block nutzt weiter die tl-*-Klassen.
 */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FAEHIGKEITEN } from './faehigkeiten-data';

const KONTAKT = '/relaunch-preview/kontakt';

// Timing 1:1 aus KundenGrid.tsx (Zeilen 42-44).
const DEL_MS = 42;
const TYPE_MS = 78;
const PAUSE_MS = 320;

type CellState = 'idle' | 'del' | 'pause' | 'type';

interface CellRuntime {
  cur: string;
  target: string;
  state: CellState;
  t0: number;
}

export default function Faehigkeiten() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Refs fuer den Tipp-Effekt (1:1-Aufbau wie KundenGrid.tsx).
  const sectionRef = useRef<HTMLElement | null>(null);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const nameRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Zwei Akkordeons im Modal: die Fähigkeiten (rechts) und die 4 Beschreibungs-
  // punkte (unten). Beide starten EINGEKLAPPT (-1); Klick oeffnet je genau eins.
  const [activeFae, setActiveFae] = useState<number>(-1);
  const [activeDesc, setActiveDesc] = useState<number>(-1);

  const open = openIndex !== null ? FAEHIGKEITEN[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  // Tipp-Loop 1:1 aus KundenGrid.tsx (Zeilen 133-198). rAF-Loop, State-Machine
  // idle -> del -> pause -> type -> idle, jede Zelle tippt ihren eigenen Namen
  // neu. rAF laeuft nur weiter, wenn die Sektion im Viewport steht
  // (bounding-rect-Check). prefers-reduced-motion => kein Tippen.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const cells: CellRuntime[] = FAEHIGKEITEN.map((f) => ({
      cur: f.name,
      target: '',
      state: 'idle',
      t0: 0,
    }));
    let nextLaunch = performance.now() + 1500;
    let rrIndex = 0;
    let raf = 0;

    function partnerTick(now: number) {
      const section = sectionRef.current;
      if (section) {
        const r = section.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) {
          raf = requestAnimationFrame(partnerTick);
          return;
        }
      }
      let active = 0;
      for (const c of cells) if (c.state !== 'idle') active++;
      if (active < 2 && now > nextLaunch) {
        for (let k = 0; k < cells.length; k++) {
          const idx = (rrIndex + k) % cells.length;
          const c = cells[idx];
          if (c.state === 'idle') {
            rrIndex = (rrIndex + k + 1) % cells.length;
            c.state = 'del';
            c.t0 = now;
            c.target = c.cur; // eigenen Namen neu tippen (kein Fremdname)
            cellRefs.current[idx]?.classList.add('typing');
            break;
          }
        }
        nextLaunch = now + 2600 + Math.random() * 1600;
      }
      cells.forEach((c, idx) => {
        const nameEl = nameRefs.current[idx];
        if (!nameEl) return;
        if (c.state === 'del') {
          const n = Math.max(0, c.cur.length - Math.floor((now - c.t0) / DEL_MS));
          nameEl.textContent = c.cur.slice(0, n);
          if (n === 0) {
            c.state = 'pause';
            c.t0 = now;
          }
        } else if (c.state === 'pause') {
          if (now - c.t0 > PAUSE_MS) {
            c.state = 'type';
            c.t0 = now;
          }
        } else if (c.state === 'type') {
          const n = Math.min(c.target.length, Math.floor((now - c.t0) / TYPE_MS) + 1);
          nameEl.textContent = c.target.slice(0, n);
          if (n >= c.target.length) {
            c.cur = c.target;
            c.state = 'idle';
            cellRefs.current[idx]?.classList.remove('typing');
          }
        }
      });
      raf = requestAnimationFrame(partnerTick);
    }

    raf = requestAnimationFrame(partnerTick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
    <section className="rr-section tl-section" ref={sectionRef}>
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
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              onClick={() => {
                setOpenIndex(i);
                setActiveFae(-1);
                setActiveDesc(-1);
              }}
              aria-haspopup="dialog"
            >
              <span
                className="tlfg-name"
                ref={(el) => {
                  nameRefs.current[i] = el;
                }}
              >
                {f.name}
              </span>
              <i className="tlfg-caret" aria-hidden="true" />
              <span className="tlfg-plus" aria-hidden="true">
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
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

            {/* Kopf: links Name + Einzeiler, rechts die konkreten Fähigkeiten
                als Klick-Akkordeon (alle eingeklappt, + = ausklappbar). */}
            <div className="tlfg-modal__head">
              <div className="tlfg-modal__headL">
                <h3 id="tlfg-modal-title" className="tlfg-modal__name">
                  {open.name}
                </h3>
                <p className="tlfg-modal__kurz">{open.kurz}</p>
              </div>

              <div className="tlfg-modal__headR">
                <p className="tlfg-modal__eyebrow">
                  {open.invers ? 'Das bauen wir dir' : 'Das kann er konkret'}
                </p>
                <div className="tlfg-mx">
                  {open.koennen.map((k, ki) => (
                    <AccRow
                      key={k.titel}
                      titel={k.titel}
                      detail={k.detail}
                      isActive={activeFae === ki}
                      dimmed={
                        activeFae >= 0 &&
                        activeFae < open.koennen.length &&
                        activeFae !== ki
                      }
                      onToggle={() => setActiveFae(activeFae === ki ? -1 : ki)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <hr className="tlfg-divider" />

            {/* Beschreibung: die 4 Punkte in ZWEI getrennten Spalten-Stapeln
                (links Nutzen/So läufts, rechts Für wen/Warum gut). Jede Spalte
                oeffnet fuer sich -> der Detailtext bleibt in Feldbreite und
                spannt NICHT ueber die ganze Breite. */}
            <p className="tlfg-modal__eyebrow tlfg-modal__eyebrow--desc">Beschreibung</p>
            <div className="tlfg-desc">
              <div className="tlfg-mx">
                <AccRow
                  titel="Nutzen"
                  detail={open.nutzen}
                  isActive={activeDesc === 0}
                  dimmed={activeDesc >= 0 && activeDesc !== 0}
                  onToggle={() => setActiveDesc(activeDesc === 0 ? -1 : 0)}
                />
                <AccRow
                  titel="So läuft es"
                  detail={open.ablauf}
                  isActive={activeDesc === 2}
                  dimmed={activeDesc >= 0 && activeDesc !== 2}
                  onToggle={() => setActiveDesc(activeDesc === 2 ? -1 : 2)}
                />
              </div>
              <div className="tlfg-mx">
                <AccRow
                  titel="Für wen"
                  detail={open.fuerWen}
                  isActive={activeDesc === 1}
                  dimmed={activeDesc >= 0 && activeDesc !== 1}
                  onToggle={() => setActiveDesc(activeDesc === 1 ? -1 : 1)}
                />
                <AccRow
                  titel="Warum gut"
                  detail={open.warum}
                  isActive={activeDesc === 3}
                  dimmed={activeDesc >= 0 && activeDesc !== 3}
                  onToggle={() => setActiveDesc(activeDesc === 3 ? -1 : 3)}
                />
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

// Eine Akkordeon-Zeile (fuer Faehigkeiten UND Beschreibung). Eingeklappt mit
// Ausklapp-Zeichen (+); offen rotiert das + zu x, Detail faehrt auf (roter Rand).
function AccRow({
  titel,
  detail,
  isActive,
  dimmed,
  onToggle,
}: {
  titel: string;
  detail: string;
  isActive: boolean;
  dimmed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={
        'tlfg-mx__cell' + (isActive ? ' is-active' : '') + (dimmed ? ' is-dim' : '')
      }
    >
      <button
        type="button"
        className="tlfg-mx__btn"
        aria-expanded={isActive}
        onClick={onToggle}
      >
        <span className="tlfg-mx__mark" aria-hidden="true" />
        <span className="tlfg-mx__titel">{titel}</span>
        <span className="tlfg-mx__sign" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </button>
      <div className="tlfg-mx__panel">
        <div className="tlfg-mx__panel-inner">
          <p className="tlfg-mx__detail">{detail}</p>
        </div>
      </div>
    </div>
  );
}

const CSS = `
/* ---- Raster: EXAKTER Klon von KundenGrid.tsx (.rrkg-grid/.rrkg-cell/
       .rrkg-name/.rrkg-caret), Werte 1:1 ---- */
.rr .tlfg-grid {
  margin-top: clamp(32px, 4.5vw, 56px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e4e4e0;
  border: 1px solid #e4e4e0;
  user-select: none;
  -webkit-user-select: none;
}
.rr .tlfg-cell {
  position: relative;
  background: #ffffff;
  border: 0;
  border-radius: 0;
  min-height: 140px;
  display: flex;
  align-items: center;
  padding: clamp(2rem, 2.6vw, 3.1rem);
  font-family: var(--font-dmsans), "DM Sans", sans-serif;
  font-weight: 300;
  font-size: clamp(1.4rem, 1.85vw, 1.7rem);
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: #23262e;
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
}
/* Caret 1:1 aus .rrkg-caret (KundenGrid.tsx Zeilen 278-283). */
.rr .tlfg-caret {
  display: none;
  flex: none;
  width: 0.14em;
  height: 1.05em;
  margin-left: 2px;
  background: #f12032;
}
.rr .tlfg-cell.typing .tlfg-caret { display: inline-block; }

/* Klick-Zeichen unten rechts: kleines Plus (dazubuchen), border-radius 0,
   dezent; hover -> Marken-Rot. Signalisiert Klickbarkeit. */
.rr .tlfg-plus {
  position: absolute;
  bottom: clamp(12px, 1.4vw, 18px);
  right: clamp(14px, 1.6vw, 20px);
  width: 14px;
  height: 14px;
  color: #b7b7b1;
  pointer-events: none;
  transition: color 0.3s var(--rr-ease, cubic-bezier(.6,0,.4,1)),
              transform 0.3s var(--rr-ease, cubic-bezier(.6,0,.4,1));
}
.rr .tlfg-plus svg { display: block; width: 100%; height: 100%; }
.rr .tlfg-cell:hover .tlfg-plus { color: #f12032; transform: scale(1.12); }

/* Sonderanfertigung: navy abgesetzt, Name off-white — KEIN Rot auf Navy.
   Caret + Plus in Tuerkis. */
.rr .tlfg-cell--invers { background: #1c2837; }
.rr .tlfg-cell--invers:hover { background: #16202c; }
.rr .tlfg-cell--invers:focus-visible { box-shadow: inset 0 0 0 2px #f6f5f1; }
.rr .tlfg-cell--invers .tlfg-name { color: #f6f5f1; }
.rr .tlfg-cell--invers .tlfg-caret { background: #39c2d7; }
.rr .tlfg-cell--invers .tlfg-plus { color: #6fd4e5; }
.rr .tlfg-cell--invers:hover .tlfg-plus { color: #39c2d7; transform: scale(1.12); }

/* Responsive 1:1 zu KundenGrid.tsx (Zeilen 300-308). */
@media (min-width: 769px) and (max-width: 1120px) {
  .rr .tlfg-cell {
    min-height: 122px;
    padding: clamp(1.5rem, 2.2vw, 2.2rem);
    font-size: clamp(1.2rem, 2.15vw, 1.42rem);
  }
}
@media (max-width: 768px) {
  .rr .tlfg-grid { grid-template-columns: repeat(2, 1fr); }
  .rr .tlfg-cell { min-height: 88px; font-size: 1.05rem; padding: 1.1rem 1.2rem; }
}
@media (max-width: 440px) {
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
  width: min(960px, 100%);
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
  margin: 0 0 10px;
  font-family: var(--font-dmsans), "DM Sans", sans-serif;
  font-weight: 300;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--rr-navy);
  overflow-wrap: break-word;
  hyphens: auto;
}
.rr .tlfg-modal--invers .tlfg-modal__name { color: #f6f5f1; }

/* Kopf: Name links, Fähigkeiten-Akkordeon rechts. */
.rr .tlfg-modal__head {
  display: grid;
  grid-template-columns: minmax(170px, 248px) 1fr;
  gap: clamp(20px, 3.4vw, 44px);
  align-items: start;
}
@media (max-width: 620px) {
  .rr .tlfg-modal__head { grid-template-columns: 1fr; gap: 16px; }
}
.rr .tlfg-modal__headL { padding-top: 2px; }
.rr .tlfg-modal__kurz {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 14px;
  line-height: 1.45;
  color: var(--rr-ink-soft);
  max-width: 18em;
}
.rr .tlfg-modal--invers .tlfg-modal__kurz { color: rgba(246, 245, 241, 0.7); }

.rr .tlfg-modal__eyebrow {
  margin: 0 0 8px;
  font-family: var(--rr-font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rr-red);
}
.rr .tlfg-modal--invers .tlfg-modal__eyebrow { color: #39c2d7; }

/* Fähigkeiten-Akkordeon (Mechanik aus DreiStufenMatrix, single-column im Modal). */
.rr .tlfg-mx { display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--rr-line); }
.rr .tlfg-modal--invers .tlfg-mx { border-top-color: rgba(246, 245, 241, 0.18); }
/* Beschreibung: zwei getrennte Spalten-Stapel nebeneinander, damit der
   geoeffnete Detailtext in Feldbreite bleibt (nicht ueber beide spannt). */
.rr .tlfg-desc { display: grid; grid-template-columns: 1fr 1fr; column-gap: clamp(20px, 3vw, 44px); align-items: start; }
@media (max-width: 620px) { .rr .tlfg-desc { grid-template-columns: 1fr; } }
.rr .tlfg-mx__cell {
  border-bottom: 1px solid var(--rr-line);
  transition: opacity 0.4s var(--rr-ease, ease);
}
.rr .tlfg-modal--invers .tlfg-mx__cell { border-bottom-color: rgba(246, 245, 241, 0.18); }
.rr .tlfg-mx__cell.is-dim { opacity: 0.45; }
.rr .tlfg-mx__btn {
  width: 100%;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 2px;
  text-align: left;
  transition: padding-left 0.3s var(--rr-ease, ease);
}
.rr .tlfg-mx__btn:hover { padding-left: 8px; }
.rr .tlfg-mx__btn:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--rr-red); }
.rr .tlfg-modal--invers .tlfg-mx__btn:focus-visible { box-shadow: inset 0 0 0 2px #39c2d7; }
.rr .tlfg-mx__mark {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(28, 40, 55, 0.28); flex: none;
  transition: background 0.3s var(--rr-ease, ease), transform 0.3s var(--rr-ease, ease);
}
.rr .tlfg-modal--invers .tlfg-mx__mark { background: rgba(246, 245, 241, 0.3); }
.rr .tlfg-mx__btn:hover .tlfg-mx__mark { background: var(--rr-red); }
.rr .tlfg-modal--invers .tlfg-mx__btn:hover .tlfg-mx__mark { background: #39c2d7; }
.rr .tlfg-mx__cell.is-active .tlfg-mx__mark { background: var(--rr-red); transform: scale(1.35); }
.rr .tlfg-modal--invers .tlfg-mx__cell.is-active .tlfg-mx__mark { background: #39c2d7; }
.rr .tlfg-mx__titel {
  font-family: var(--font-dmsans), "DM Sans", sans-serif;
  font-weight: 400;
  font-size: clamp(15px, 1.5vw, 17px);
  letter-spacing: -0.005em;
  color: var(--rr-ink-soft);
  transition: color 0.3s var(--rr-ease, ease), font-weight 0.3s var(--rr-ease, ease);
}
.rr .tlfg-modal--invers .tlfg-mx__titel { color: rgba(246, 245, 241, 0.8); }
.rr .tlfg-mx__cell.is-active .tlfg-mx__titel { color: var(--rr-navy); font-weight: 600; }
.rr .tlfg-modal--invers .tlfg-mx__cell.is-active .tlfg-mx__titel { color: #f6f5f1; }
/* Ausklapp-Zeichen (+): signalisiert Klickbarkeit; offen rotiert es zu x. */
.rr .tlfg-mx__sign {
  margin-left: auto;
  flex: none;
  width: 13px;
  height: 13px;
  color: #b7b7b1;
  transition: color 0.3s var(--rr-ease, ease), transform 0.3s var(--rr-ease, ease);
}
.rr .tlfg-mx__sign svg { display: block; width: 100%; height: 100%; }
.rr .tlfg-mx__btn:hover .tlfg-mx__sign { color: var(--rr-red); }
.rr .tlfg-mx__cell.is-active .tlfg-mx__sign { color: var(--rr-red); transform: rotate(45deg); }
.rr .tlfg-modal--invers .tlfg-mx__sign { color: rgba(246, 245, 241, 0.5); }
.rr .tlfg-modal--invers .tlfg-mx__btn:hover .tlfg-mx__sign,
.rr .tlfg-modal--invers .tlfg-mx__cell.is-active .tlfg-mx__sign { color: #39c2d7; }
.rr .tlfg-mx__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--rr-ease, ease);
}
.rr .tlfg-mx__cell.is-active .tlfg-mx__panel { grid-template-rows: 1fr; }
.rr .tlfg-mx__panel-inner { overflow: hidden; min-height: 0; }
.rr .tlfg-mx__detail {
  margin: 0 0 0 2px;
  padding: 2px 2px 16px 19px;
  border-left: 2px solid var(--rr-red);
  font-family: var(--rr-font-ui);
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--rr-navy);
  opacity: 0;
  transition: opacity 0.35s var(--rr-ease, ease) 0.05s;
}
.rr .tlfg-modal--invers .tlfg-mx__detail { border-left-color: #39c2d7; color: rgba(246, 245, 241, 0.9); }
.rr .tlfg-mx__cell.is-active .tlfg-mx__detail { opacity: 1; }

/* Trennlinie zwischen Fähigkeiten-Kopf und Beschreibungsfeld. */
.rr .tlfg-divider {
  border: 0;
  height: 1px;
  background: var(--rr-line);
  margin: clamp(24px, 3.2vw, 34px) 0 clamp(16px, 2.2vw, 22px);
}
.rr .tlfg-modal--invers .tlfg-divider { background: rgba(246, 245, 241, 0.18); }
.rr .tlfg-modal__eyebrow--desc { color: var(--rr-ink-soft); }
.rr .tlfg-modal--invers .tlfg-modal__eyebrow--desc { color: rgba(246, 245, 241, 0.55); }

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
  .rr .tlfg-cell.typing .tlfg-caret { display: none; }
  .rr .tlfg-mx__cell, .rr .tlfg-mx__btn, .rr .tlfg-mx__mark,
  .rr .tlfg-mx__titel, .rr .tlfg-mx__panel, .rr .tlfg-mx__detail,
  .rr .tlfg-mx__sign { transition: none; }
}
`;
