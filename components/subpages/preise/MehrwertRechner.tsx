'use client';

import { useMemo, useState } from 'react';

/**
 * Mehrwert-Rechner — Portierung der Demo-Vorlage
 * (scratchpad/mehrwert-rechner.html) in eine echte Komponente. Links das
 * Talos-Team zum Zusammenklicken (Basis-Team fix, Add-ons zuschaltbar),
 * rechts eine sticky Ergebnis-Karte (Navy) die live "mit Talos" gegen
 * "klassisch extern" rechnet.
 *
 * Zahlen sind AUTORITATIV aus brand/decisions-log.md (24.07.) — nicht raten,
 * nichts erfinden. Basis-Team 360 €/Monat (Untergrenze), Add-ons Poster
 * 290/~490, Sichtbarmacher +120/~250, Außendienst 290/~600, Ads ab 390/~800.
 * Setup 290 € einmalig, alle Preise zzgl. USt, "Einführungspreis für
 * Pilotkunden". Die "klassisch“-Werte sind marktübliche Größenordnung für
 * dieselbe Arbeit extern (Freelancer/Agentur/Dienst) — keine Fixzusage,
 * kein erfundenes Angestellten-Gehalt (siehe Disclaimer am Fußende).
 *
 * Styling: plain globales <style>-Tag statt <style jsx>
 * (LESSONS_LEARNED.md "styled-jsx im Relaunch meiden" — Styles greifen sonst
 * nicht). Klassen mwr- sind seiten-lokal eindeutig.
 */

type Addon = {
  id: string;
  name: string;
  desc: string;
  talos: number;
  classicLabel: string;
  classicValue: number;
  talosPrefix?: string;
};

const BASE_TALOS = 360;
const BASE_CLASSIC = 950;
const SETUP = 290;

const ADDONS: Addon[] = [
  {
    id: 'poster',
    name: 'Poster',
    desc: 'Regelmäßige Social-Posts, in deinem Ton.',
    talos: 290,
    classicLabel: 'Betreuung',
    classicValue: 490,
  },
  {
    id: 'sichtbarmacher',
    name: 'Sichtbarmacher',
    desc: 'Gefunden werden bei Google und den KI-Antwort-Maschinen.',
    talos: 120,
    classicLabel: 'Tools + Service',
    classicValue: 250,
  },
  {
    id: 'aussendienst',
    name: 'Außendienst',
    desc: 'Sucht täglich passende Kunden, schreibt E-Mails als Entwurf oder per Knopfdruck raus.',
    talos: 290,
    classicLabel: 'SDR-Dienst',
    classicValue: 600,
  },
  {
    id: 'ads',
    name: 'Ads',
    desc: 'Kampagnen aufsetzen, auswerten und laufend nachschärfen.',
    talos: 390,
    classicLabel: 'Agentur',
    classicValue: 800,
    talosPrefix: 'ab',
  },
];

function euro(n: number): string {
  return n.toLocaleString('de-AT') + ' €';
}

function euroApprox(n: number): string {
  return '~' + euro(n);
}

export default function MehrwertRechner() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const { talosTotal, classicTotal, ersparnis } = useMemo(() => {
    let t = BASE_TALOS;
    let c = BASE_CLASSIC;
    ADDONS.forEach((a) => {
      if (active[a.id]) {
        t += a.talos;
        c += a.classicValue;
      }
    });
    return { talosTotal: t, classicTotal: c, ersparnis: c - t };
  }, [active]);

  return (
    <section className="rr-section mwr-section" id="rechner">
      <div className="rr-wrap rr-narrow mwr-head">
        <p className="wd-eyebrow">Was dir das bringt</p>
        <h2 className="rr-statement mwr-h2">
          Rechne nach, was ein Team dich sonst kosten würde
          <span style={{ color: 'var(--rr-red)' }}>.</span>
        </h2>
        <p className="rr-body-lg mwr-intro">
          Stell dir dein Talos-Team zusammen. Rechts siehst du, was dieselbe Arbeit
          klassisch kostet, wenn du sie extern einkaufst.
        </p>
      </div>

      <div className="rr-wrap rr-narrow mwr-grid">
        <div className="mwr-pick">
          <p className="mwr-label">Basis-Team &middot; immer dabei</p>
          <div className="mwr-row mwr-row--locked">
            <div className="mwr-box" aria-hidden="true">
              &#10003;
            </div>
            <div className="mwr-body">
              <div className="mwr-name">Schreiber &middot; Empfang &middot; Chatbot</div>
              <div className="mwr-desc">
                2 Beiträge pro Woche mit Bildern und Podcast, Anfrage-Erfassung mit
                Terminbuchung und Nachfassen, Chatbot auf deiner Seite.
              </div>
            </div>
            <div className="mwr-prices">
              <div className="mwr-talos">{euro(BASE_TALOS)}</div>
              <div className="mwr-classic">
                klassisch <s>{euroApprox(BASE_CLASSIC)}</s>
              </div>
            </div>
          </div>

          <p className="mwr-label">Dazubuchen &middot; wenn du mehr willst</p>
          {ADDONS.map((a) => {
            const isOn = !!active[a.id];
            return (
              <button
                type="button"
                key={a.id}
                className={'mwr-row' + (isOn ? ' mwr-row--on' : '')}
                aria-pressed={isOn}
                onClick={() =>
                  setActive((prev) => ({ ...prev, [a.id]: !prev[a.id] }))
                }
              >
                <span className="mwr-box" aria-hidden="true">
                  {isOn ? '✓' : ''}
                </span>
                <span className="mwr-body">
                  <span className="mwr-name">{a.name}</span>
                  <span className="mwr-desc">{a.desc}</span>
                </span>
                <span className="mwr-prices">
                  <span className="mwr-talos">
                    {a.talosPrefix ? a.talosPrefix + ' ' : '+'}
                    {euro(a.talos)}
                  </span>
                  <span className="mwr-classic">
                    {a.classicLabel} +{euroApprox(a.classicValue)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mwr-result">
          <p className="mwr-r-eyebrow">Dein Talos-Team</p>
          <div className="mwr-r-classic">
            Klassisch extern: <b>{euroApprox(classicTotal)}</b>/Monat
          </div>
          <div className="mwr-r-talos">
            <span className="mwr-num">{talosTotal.toLocaleString('de-AT')}</span>
            <span className="mwr-per">€/Monat mit Talos</span>
          </div>
          <div className="mwr-r-save">
            Du sparst rund <b>{euroApprox(ersparnis)}</b> im Monat gegenüber dem
            klassischen Einkauf.
          </div>
          <div className="mwr-r-meta">
            Einmalige Einrichtung <b>{euro(SETUP)}</b>
            <br />
            Alle Preise zzgl. USt &middot; <b>Einführungspreis</b> für Pilotkunden
            <br />
            Monatlich, jederzeit kündbar &middot; jederzeit nachbuchbar
          </div>
          <p className="mwr-r-trust">
            Fixe Pauschale je Mitarbeiter. Keine Kosten pro Klick, Nachricht oder
            Minute.
          </p>
        </div>
      </div>

      <p className="rr-meta mwr-disclaimer">
        Die „klassisch“-Werte zeigen die marktübliche Größenordnung für dieselbe
        Arbeit extern eingekauft, etwa über Freelancer, Agentur oder Dienstleister.
        Keine Fixzusage und kein erfundenes Angestellten-Gehalt, sondern bewusst
        ehrlich das, was diese Arbeit draußen kostet.
      </p>

      <style>{`
        .mwr-section {
          background: var(--rr-paper, #f6f5f1);
        }
        .mwr-head {
          margin-bottom: clamp(28px, 4vw, 48px);
        }
        .mwr-h2 {
          margin: 18px 0 16px;
          max-width: 18em;
        }
        .mwr-intro {
          color: var(--rr-ink-soft);
          max-width: 56ch;
        }

        .mwr-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: clamp(20px, 3vw, 44px);
          align-items: start;
        }

        .mwr-pick {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mwr-label {
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-ink-soft);
          margin: 6px 2px 0;
        }

        .mwr-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          width: 100%;
          background: #fff;
          border: 1px solid rgba(28, 40, 55, 0.12);
          border-radius: 4px;
          padding: 16px 18px;
          cursor: pointer;
          text-align: left;
          font: inherit;
          color: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        @media (hover: hover) and (pointer: fine) {
          .mwr-row:hover:not(.mwr-row--locked) {
            border-color: rgba(28, 40, 55, 0.3);
          }
        }
        .mwr-row--on {
          border-color: var(--rr-red);
          box-shadow: 0 1px 0 var(--rr-red) inset, 0 0 0 1px var(--rr-red);
        }
        .mwr-row--locked {
          cursor: default;
          background: #fbfbf9;
          box-shadow: none;
        }

        .mwr-box {
          flex: 0 0 auto;
          width: 22px;
          height: 22px;
          border: 1.5px solid rgba(28, 40, 55, 0.35);
          border-radius: 4px;
          margin-top: 2px;
          display: grid;
          place-items: center;
          font-size: 14px;
          color: #fff;
          transition: 0.15s;
        }
        .mwr-row--on .mwr-box {
          background: var(--rr-red);
          border-color: var(--rr-red);
        }
        .mwr-row--locked .mwr-box {
          background: var(--rr-navy);
          border-color: var(--rr-navy);
        }

        .mwr-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .mwr-name {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: 17px;
          color: var(--rr-navy);
        }
        .mwr-desc {
          font-family: var(--rr-font-ui);
          font-size: 13.5px;
          color: var(--rr-ink-soft);
          margin-top: 3px;
        }

        .mwr-prices {
          flex: 0 0 auto;
          text-align: right;
          white-space: nowrap;
          margin-left: 8px;
          display: flex;
          flex-direction: column;
        }
        .mwr-talos {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: 16px;
          color: var(--rr-navy);
        }
        .mwr-classic {
          font-family: var(--rr-font-ui);
          font-size: 12.5px;
          color: var(--rr-ink-soft);
          margin-top: 2px;
        }
        .mwr-classic s {
          opacity: 0.8;
        }

        .mwr-result {
          position: sticky;
          top: clamp(20px, 4vh, 96px);
          background: var(--rr-navy);
          color: #fff;
          border-radius: 6px;
          padding: clamp(24px, 3vw, 34px);
          overflow: hidden;
        }
        .mwr-r-eyebrow {
          font-family: var(--rr-font-ui);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .mwr-r-classic {
          margin-top: 18px;
          font-family: var(--rr-font-ui);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
        .mwr-r-classic b {
          color: #fff;
          font-weight: 600;
        }
        .mwr-r-talos {
          margin-top: 6px;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .mwr-num {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(2.6rem, 7vw, 3.6rem);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .mwr-per {
          font-family: var(--rr-font-ui);
          color: rgba(255, 255, 255, 0.7);
          font-size: 15px;
        }
        .mwr-r-save {
          margin-top: 16px;
          background: rgba(241, 32, 50, 0.16);
          border: 1px solid rgba(241, 32, 50, 0.5);
          border-radius: 4px;
          padding: 12px 14px;
          font-family: var(--rr-font-ui);
          font-size: 14px;
        }
        .mwr-r-save b {
          color: #ff7a86;
        }
        .mwr-r-meta {
          margin-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          padding-top: 16px;
          font-family: var(--rr-font-ui);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.7;
        }
        .mwr-r-meta b {
          color: #fff;
          font-weight: 600;
        }
        .mwr-r-trust {
          margin-top: 14px;
          font-family: var(--rr-font-serif);
          font-style: italic;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
        }

        .mwr-disclaimer {
          max-width: 68ch;
          margin: clamp(24px, 3vw, 32px) auto 0;
        }

        @media (max-width: 840px) {
          .mwr-grid {
            grid-template-columns: 1fr;
          }
          .mwr-result {
            position: static;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mwr-row,
          .mwr-box {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
