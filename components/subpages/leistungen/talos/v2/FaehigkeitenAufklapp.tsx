'use client';

/**
 * Faehigkeiten — VARIANTE B "Aufklapp-Karte + CTA" (Vergleichs-Entwurf).
 * Referenz: das Starter-Paket — eine Karte, Faehigkeiten als Zeilen-Liste mit
 * Punkt-Markern (runde Dots). Klick auf eine Zeile klappt sie inline auf und
 * zeigt die volle Beschreibung (Nutzen / Fuer wen / So laeuft es / Warum gut +
 * Talos-Sprechzeile) und darunter einen CTA. Accordion, immer nur eine Zeile
 * offen.
 *
 * Daten aus ./faehigkeiten-data (geteilt). Sektions-Intro 1:1 aus
 * Faehigkeiten.tsx, unveraendert. Radius 0 (rund nur die Punkte). Die 6.
 * Faehigkeit "Die Sonderanfertigung" (invers) klappt als Navy-Panel mit
 * Tuerkis-Labels #39c2d7 auf, kein Rot auf Navy -> ihr CTA ist ein
 * Tuerkis-Eck-Rahmen statt rr-btn-sweep--red.
 *
 * Kein styled-jsx: plain <style> mit namespaced Klassen (.tlfab-b-*).
 * Aufklapp-Animation ueber grid-template-rows 0fr -> 1fr (weich, ohne feste
 * Hoehe). talos-v2.css bleibt unberuehrt.
 */
import Link from 'next/link';
import { useState } from 'react';
import { FAEHIGKEITEN } from './faehigkeiten-data';

const KONTAKT = '/relaunch-preview/kontakt';

export default function FaehigkeitenAufklapp() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

        <div className="tlfab-b-card">
          {FAEHIGKEITEN.map((f, i) => {
            const isOpen = openIndex === i;
            const panelId = `tlfab-b-panel-${i}`;
            const btnId = `tlfab-b-btn-${i}`;
            return (
              <div
                className={`tlfab-b-row${f.invers ? ' tlfab-b-row--invers' : ''}${isOpen ? ' is-open' : ''}`}
                key={f.name}
              >
                <h3 className="tlfab-b-row__h">
                  <button
                    type="button"
                    id={btnId}
                    className="tlfab-b-head"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="tlfab-b-dot" aria-hidden="true" />
                    <span className="tlfab-b-name">{f.name}</span>
                    <span className="tlfab-b-sign" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="tlfab-b-panel"
                >
                  <div className="tlfab-b-panel__inner">
                    <div className="tlfab-b-grid">
                      <div className="tlfab-b-block">
                        <p className="tlfab-b-label">Nutzen</p>
                        <p className="tlfab-b-text">{f.nutzen}</p>
                      </div>
                      <div className="tlfab-b-block">
                        <p className="tlfab-b-label">Für wen</p>
                        <p className="tlfab-b-text">{f.fuerWen}</p>
                      </div>
                      <div className="tlfab-b-block">
                        <p className="tlfab-b-label">So läuft es</p>
                        <p className="tlfab-b-text">{f.ablauf}</p>
                      </div>
                      <div className="tlfab-b-block">
                        <p className="tlfab-b-label">Warum gut</p>
                        <p className="tlfab-b-text">{f.warum}</p>
                      </div>
                    </div>

                    <p className="tlfab-b-says">{f.says}</p>

                    <div className="tlfab-b-cta">
                      {f.invers ? (
                        <Link href={KONTAKT} className="rr-btn-frame tlfab-b-frame--teal">
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
              </div>
            );
          })}
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
    </section>
  );
}

const CSS = `
.rr .tlfab-b-card {
  margin-top: clamp(32px, 4.5vw, 56px);
  border: 1px solid var(--rr-line);
  border-radius: 0;
  background: var(--rr-paper);
}
.rr .tlfab-b-row { border-top: 1px solid var(--rr-line); }
.rr .tlfab-b-row:first-child { border-top: 0; }

.rr .tlfab-b-row__h { margin: 0; }
.rr .tlfab-b-head {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: clamp(18px, 2.2vw, 24px) clamp(18px, 2.4vw, 28px);
  background: transparent;
  border: 0;
  border-radius: 0;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s var(--rr-ease);
}
.rr .tlfab-b-head:hover { background: var(--rr-surface); }
.rr .tlfab-b-head:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--rr-red); }

.rr .tlfab-b-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--rr-red);
  flex: none;
}
.rr .tlfab-b-name {
  font-family: var(--rr-font-serif);
  font-weight: 500;
  font-size: clamp(20px, 2.3vw, 27px);
  line-height: 1.1;
  color: var(--rr-navy);
}
/* Plus/Minus-Zeichen aus zwei Strichen, rein per CSS (kein Icon, kein Emoji). */
.rr .tlfab-b-sign {
  position: relative;
  width: 16px;
  height: 16px;
  flex: none;
}
.rr .tlfab-b-sign::before,
.rr .tlfab-b-sign::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: var(--rr-red);
  transition: transform 0.28s var(--rr-ease), opacity 0.28s var(--rr-ease);
}
.rr .tlfab-b-sign::before { width: 16px; height: 1.5px; transform: translate(-50%, -50%); }
.rr .tlfab-b-sign::after { width: 1.5px; height: 16px; transform: translate(-50%, -50%); }
.rr .tlfab-b-row.is-open .tlfab-b-sign::after { transform: translate(-50%, -50%) scaleY(0); opacity: 0; }

/* Aufklapp-Animation ueber grid-template-rows 0fr -> 1fr. */
.rr .tlfab-b-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.32s var(--rr-ease);
}
.rr .tlfab-b-row.is-open .tlfab-b-panel { grid-template-rows: 1fr; }
.rr .tlfab-b-panel__inner {
  overflow: hidden;
  min-height: 0;
  visibility: hidden;
  transition: visibility 0s linear 0.32s;
}
.rr .tlfab-b-row.is-open .tlfab-b-panel__inner {
  visibility: visible;
  transition: visibility 0s linear 0s;
}
.rr .tlfab-b-row.is-open .tlfab-b-panel__inner {
  padding: 0 clamp(18px, 2.4vw, 28px) clamp(24px, 3vw, 32px) calc(clamp(18px, 2.4vw, 28px) + 9px + 16px);
}

.rr .tlfab-b-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 2.2vw, 24px);
  max-width: 720px;
}
@media (max-width: 560px) { .rr .tlfab-b-grid { grid-template-columns: 1fr; } }
.rr .tlfab-b-block { display: flex; flex-direction: column; gap: 5px; }
.rr .tlfab-b-label {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rr-red);
}
.rr .tlfab-b-text {
  margin: 0;
  font-family: var(--rr-font-ui);
  font-size: 15px;
  line-height: 1.5;
  color: var(--rr-ink-soft);
}
.rr .tlfab-b-says {
  margin: clamp(18px, 2.4vw, 24px) 0 0;
  font-family: var(--rr-font-serif);
  font-style: italic;
  font-size: clamp(16px, 1.8vw, 19px);
  line-height: 1.4;
  color: var(--rr-navy);
  max-width: 720px;
}
.rr .tlfab-b-says::before { content: '\\201E'; }
.rr .tlfab-b-says::after { content: '\\201C'; }
.rr .tlfab-b-cta { margin-top: clamp(22px, 3vw, 28px); }

/* Invers-Zeile: Tuerkis-Punkt/Zeichen, aufgeklappt als Navy-Panel. */
.rr .tlfab-b-row--invers .tlfab-b-dot { background: #39c2d7; }
.rr .tlfab-b-row--invers .tlfab-b-sign::before,
.rr .tlfab-b-row--invers .tlfab-b-sign::after { background: #39c2d7; }
.rr .tlfab-b-row--invers.is-open { background: var(--rr-navy); }
.rr .tlfab-b-row--invers.is-open .tlfab-b-head { background: var(--rr-navy); }
.rr .tlfab-b-row--invers.is-open .tlfab-b-name { color: #f6f5f1; }
.rr .tlfab-b-row--invers.is-open .tlfab-b-label { color: #39c2d7; }
.rr .tlfab-b-row--invers.is-open .tlfab-b-text { color: rgba(246, 245, 241, 0.82); }
.rr .tlfab-b-row--invers.is-open .tlfab-b-says { color: rgba(246, 245, 241, 0.92); }
.rr .tlfab-b-frame--teal { --c: #39c2d7; }

@media (max-width: 560px) {
  .rr .tlfab-b-name { font-size: clamp(18px, 5vw, 22px); }
}
@media (prefers-reduced-motion: reduce) {
  .rr .tlfab-b-panel { transition: none; }
  .rr .tlfab-b-sign::before, .rr .tlfab-b-sign::after,
  .rr .tlfab-b-head { transition: none; }
}
`;
