"use client";

/**
 * MenueVarianten — DREI Redesigns des Vollbild-Overlay-Menues (RelaunchMenu) als
 * statische Design-Mockups zum Vergleich. Kernproblem des Bestands: 8 Punkte +
 * 2 Unterpunkte + CTA + Kontakte passen NICHT in einen Viewport (oben "Start"
 * abgeschnitten, unten "Kontakt" raus). Ziel jeder Variante: ALLES innerhalb von
 * 100vh sichtbar, auch bei ~760px Fensterhoehe.
 *
 * Farbwelt/Fonts exakt wie das Bestands-Overlay (Navy #1c2837, Off-White,
 * var(--rr-red), dezente Rot-Aura). border-radius 0 (Ausnahme: kleine Punkte).
 * Links sind statische <a href="#"> (keine Menue-Logik noetig) — dadurch keine
 * styled-jsx/next-link :global()-Falle; Hover-Zustaende sind echtes CSS.
 *
 * A "Editorial Split"  — zweispaltig: kompakte Nav links, ruhige CTA/Kontakt-Spalte rechts.
 * B "Zeilen-Register"  — Inhaltsverzeichnis-Zeilen ueber volle Breite, Hairlines, Hover-Fuellung.
 * C "Kommandozentrale" — Nav in 2 Spalten a 4, grosser roter CTA-Block, Kontakt-Zeile unten.
 */

type Sub = { label: string; href: string };
type NavItem = { label: string; href: string; children?: Sub[] };

const NAV: NavItem[] = [
  { label: "Start", href: "#" },
  {
    label: "Leistungen",
    href: "#",
    children: [
      { label: "Website", href: "#" },
      { label: "Dein digitaler Mitarbeiter · Talos", href: "#" },
    ],
  },
  { label: "Referenzen", href: "#" },
  { label: "Preise", href: "#" },
  { label: "Tipps", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Über uns", href: "#" },
  { label: "Kontakt", href: "#" },
];

const CONTACTS: { label: string; href: string; external?: boolean }[] = [
  { label: "office@redrabbit.media", href: "#" },
  { label: "Anrufen", href: "#" },
  { label: "Instagram", href: "#", external: true },
  { label: "LinkedIn", href: "#", external: true },
];

function num(i: number) {
  return String(i + 1).padStart(2, "0");
}

/* ============================================================
   A — Editorial Split
   ============================================================ */
function VarianteA() {
  return (
    <section className="mv mv-a" aria-label="Variante A — Editorial Split">
      <span className="mv-tag">A</span>
      <div className="mv-a-grid">
        {/* Links: kompakte Nav */}
        <nav className="mv-a-nav" aria-label="Seiten A">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.label}>
                <a href={item.href} className="mv-a-link">
                  <span className="mv-a-idx">{num(i)}</span>
                  <span className="mv-a-text">{item.label}</span>
                </a>
                {item.children ? (
                  <ul className="mv-a-sub">
                    {item.children.map((s) => (
                      <li key={s.label}>
                        <a href={s.href} className="mv-a-sublink">
                          <span className="mv-a-subdot" aria-hidden="true" />
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        {/* Rechts: ruhige CTA/Kontakt-Spalte */}
        <aside className="mv-a-side">
          <p className="mv-eyebrow">Red Rabbit · Navigation</p>
          <a href="#" className="mv-a-cta">
            <span className="mv-a-cta-t">Projekt anfragen</span>
            <span className="mv-a-cta-arrow" aria-hidden="true">→</span>
            <i className="c1" aria-hidden="true" />
            <i className="c2" aria-hidden="true" />
            <i className="c3" aria-hidden="true" />
            <i className="c4" aria-hidden="true" />
          </a>
          <ul className="mv-a-contacts">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="mv-a-contact"
                  {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mv-a-addr">Red Rabbit GmbH · Wien</p>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   B — Zeilen-Register
   ============================================================ */
function VarianteB() {
  return (
    <section className="mv mv-b" aria-label="Variante B — Zeilen-Register">
      <span className="mv-tag">B</span>
      <div className="mv-b-inner">
        <p className="mv-eyebrow">Red Rabbit · Navigation</p>

        <nav className="mv-b-nav" aria-label="Seiten B">
          {NAV.map((item, i) => (
            <a href={item.href} className="mv-b-row" key={item.label}>
              <span className="mv-b-idx">{num(i)}</span>
              <span className="mv-b-label">{item.label}</span>
              {item.children ? (
                <span className="mv-b-subs">
                  {item.children.map((s) => (
                    <span className="mv-b-sub" key={s.label}>
                      {s.label}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="mv-b-subs" aria-hidden="true" />
              )}
              <span className="mv-b-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </nav>

        <div className="mv-b-foot">
          <a href="#" className="mv-b-cta">
            Projekt anfragen
            <span className="mv-b-cta-arrow" aria-hidden="true">→</span>
          </a>
          <ul className="mv-b-contacts">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="mv-b-contact"
                  {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   C — Kommandozentrale
   ============================================================ */
function VarianteC() {
  const col1 = NAV.slice(0, 4);
  const col2 = NAV.slice(4, 8);
  return (
    <section className="mv mv-c" aria-label="Variante C — Kommandozentrale">
      <span className="mv-tag">C</span>
      <div className="mv-c-inner">
        <p className="mv-eyebrow">Red Rabbit · Navigation</p>

        <div className="mv-c-body">
          <nav className="mv-c-nav" aria-label="Seiten C">
            <ul className="mv-c-col">
              {col1.map((item, i) => (
                <li key={item.label}>
                  <a href={item.href} className="mv-c-link">
                    <span className="mv-c-dot" aria-hidden="true" />
                    <span className="mv-c-idx">{num(i)}</span>
                    <span className="mv-c-text">{item.label}</span>
                  </a>
                  {item.children ? (
                    <ul className="mv-c-sub">
                      {item.children.map((s) => (
                        <li key={s.label}>
                          <a href={s.href} className="mv-c-sublink">
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <ul className="mv-c-col">
              {col2.map((item, i) => (
                <li key={item.label}>
                  <a href={item.href} className="mv-c-link">
                    <span className="mv-c-dot" aria-hidden="true" />
                    <span className="mv-c-idx">{num(i + 4)}</span>
                    <span className="mv-c-text">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#" className="mv-c-cta">
            <span className="mv-c-cta-t">Projekt anfragen</span>
            <span className="mv-c-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="mv-c-contacts">
          {CONTACTS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="mv-c-contact"
                {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function MenueVarianten() {
  return (
    <div className="mv-root">
      <VarianteA />
      <VarianteB />
      <VarianteC />

      <style jsx global>{`
        .mv-root {
          font-family: var(--rr-font-ui, ui-sans-serif, system-ui, sans-serif);
        }

        /* ===== Gemeinsamer Block: 100vh, Navy, Rot-Aura, Overflow gekappt ===== */
        .mv {
          position: relative;
          height: 100vh;
          width: 100%;
          background: var(--rr-navy, #1c2837);
          color: #ffffff;
          overflow: hidden;
          display: flex;
          box-sizing: border-box;
        }
        .mv::before {
          content: "";
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(
            closest-side,
            rgba(241, 32, 50, 0.16),
            rgba(241, 32, 50, 0) 70%
          );
          pointer-events: none;
        }
        .mv-tag {
          position: absolute;
          top: clamp(14px, 2vh, 26px);
          left: clamp(18px, 2.4vw, 40px);
          z-index: 5;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 12px;
          font-weight: 650;
          letter-spacing: 0.28em;
          color: rgba(255, 255, 255, 0.32);
        }
        .mv-eyebrow {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 13px;
          font-weight: 650;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          margin: 0;
        }

        /* ============================================================
           A — Editorial Split
           ============================================================ */
        .mv-a-grid {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--rr-max, 1680px);
          margin: 0 auto;
          padding: clamp(48px, 8vh, 96px) var(--rr-gutter, clamp(24px, 5vw, 72px));
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: clamp(32px, 4vw, 72px);
          align-items: center;
          box-sizing: border-box;
        }
        .mv-a-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .mv-a-nav > ul {
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 1vh, 12px);
        }
        .mv-a-link {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(10px, 1.2vw, 18px);
          text-decoration: none;
          color: #ffffff;
          font-family: var(--rr-font-display, "DM Sans", sans-serif);
          font-weight: 600;
          font-size: clamp(28px, 4.5vw, 54px);
          line-height: 1.04;
          letter-spacing: -0.02em;
          transition: color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-a-idx {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(11px, 0.9vw, 14px);
          font-weight: 650;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.32);
          transform: translateY(-0.4em);
          transition: color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-a-link:hover,
        .mv-a-link:focus-visible {
          color: var(--rr-red, #f12032);
          transform: translateX(8px);
          outline: none;
        }
        .mv-a-link:hover .mv-a-idx,
        .mv-a-link:focus-visible .mv-a-idx {
          color: var(--rr-red, #f12032);
        }
        .mv-a-sub {
          margin: 2px 0 4px;
          padding-left: clamp(30px, 3vw, 48px);
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .mv-a-sublink {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(13px, 1.2vw, 16px);
          font-weight: 550;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          padding: 2px 0;
          transition: color 0.22s ease, transform 0.22s ease;
        }
        .mv-a-subdot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          flex: none;
          transition: background 0.22s ease;
        }
        .mv-a-sublink:hover,
        .mv-a-sublink:focus-visible {
          color: var(--rr-red, #f12032);
          transform: translateX(6px);
          outline: none;
        }
        .mv-a-sublink:hover .mv-a-subdot,
        .mv-a-sublink:focus-visible .mv-a-subdot {
          background: var(--rr-red, #f12032);
        }
        /* Hairline zwischen den Spalten */
        .mv-a-side {
          position: relative;
          border-left: 1px solid rgba(255, 255, 255, 0.14);
          padding-left: clamp(32px, 4vw, 72px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(20px, 3vh, 34px);
        }
        .mv-a-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 30px;
          text-decoration: none;
          color: #ffffff;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.01em;
          background: transparent;
        }
        .mv-a-cta .mv-a-cta-t,
        .mv-a-cta .mv-a-cta-arrow {
          position: relative;
          z-index: 2;
          transition: transform 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        /* Eck-Rahmen (rr-btn-frame-Sprache) */
        .mv-a-cta i {
          position: absolute;
          width: 14px;
          height: 14px;
          border: 0 solid var(--rr-red, #f12032);
          transition: width 260ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            height 260ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-a-cta .c1 { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; }
        .mv-a-cta .c2 { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; }
        .mv-a-cta .c3 { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; }
        .mv-a-cta .c4 { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; }
        .mv-a-cta:hover i,
        .mv-a-cta:focus-visible i {
          width: 50%;
          height: 50%;
        }
        .mv-a-cta:hover .mv-a-cta-arrow {
          transform: translateX(4px);
        }
        .mv-a-cta:focus-visible {
          outline: none;
        }
        .mv-a-contacts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mv-a-contact {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          padding-bottom: 3px;
          transition: color 200ms ease, border-color 200ms ease;
        }
        .mv-a-contact:hover,
        .mv-a-contact:focus-visible {
          color: #fff;
          border-color: var(--rr-red, #f12032);
          outline: none;
        }
        .mv-a-addr {
          margin: 0;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ============================================================
           B — Zeilen-Register
           ============================================================ */
        .mv-b-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--rr-max, 1680px);
          margin: 0 auto;
          padding: clamp(46px, 7vh, 84px) var(--rr-gutter, clamp(24px, 5vw, 72px));
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(18px, 3vh, 34px);
          box-sizing: border-box;
        }
        .mv-b-nav {
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }
        .mv-b-row {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: clamp(14px, 2vw, 30px);
          padding: clamp(9px, 1.5vh, 16px) clamp(10px, 1.4vw, 22px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          text-decoration: none;
          color: #ffffff;
          transition: background-color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-b-row::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--rr-red, #f12032);
          opacity: 0;
          transition: opacity 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
          pointer-events: none;
        }
        .mv-b-row:hover,
        .mv-b-row:focus-visible {
          outline: none;
        }
        .mv-b-row:hover::before,
        .mv-b-row:focus-visible::before {
          opacity: 0.14;
        }
        .mv-b-idx,
        .mv-b-label,
        .mv-b-subs,
        .mv-b-arrow {
          position: relative;
          z-index: 1;
        }
        .mv-b-idx {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(11px, 0.9vw, 14px);
          font-weight: 650;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.35);
          transition: color 220ms ease;
        }
        .mv-b-label {
          font-family: var(--rr-font-display, "DM Sans", sans-serif);
          font-weight: 600;
          font-size: clamp(22px, 3.2vw, 40px);
          line-height: 1.05;
          letter-spacing: -0.015em;
          transition: color 220ms ease, transform 220ms ease;
        }
        .mv-b-subs {
          display: flex;
          gap: clamp(8px, 1vw, 16px);
          justify-self: end;
        }
        .mv-b-sub {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(11px, 1vw, 14px);
          font-weight: 550;
          color: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          white-space: nowrap;
          transition: color 220ms ease, border-color 220ms ease;
        }
        .mv-b-arrow {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.55);
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            color 220ms ease;
        }
        .mv-b-row:hover .mv-b-label,
        .mv-b-row:focus-visible .mv-b-label {
          color: #fff;
          transform: translateX(6px);
        }
        .mv-b-row:hover .mv-b-idx,
        .mv-b-row:focus-visible .mv-b-idx {
          color: var(--rr-red, #f12032);
        }
        .mv-b-row:hover .mv-b-arrow,
        .mv-b-row:focus-visible .mv-b-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--rr-red, #f12032);
        }
        .mv-b-row:hover .mv-b-sub,
        .mv-b-row:focus-visible .mv-b-sub {
          border-color: rgba(255, 255, 255, 0.4);
          color: rgba(255, 255, 255, 0.85);
        }
        .mv-b-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: clamp(16px, 3vw, 40px);
        }
        .mv-b-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          background: var(--rr-red, #f12032);
          color: #fff;
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-b-cta:hover,
        .mv-b-cta:focus-visible {
          background: var(--rr-red-deep, #c81222);
          outline: none;
        }
        .mv-b-cta-arrow {
          transition: transform 200ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-b-cta:hover .mv-b-cta-arrow {
          transform: translateX(4px);
        }
        .mv-b-contacts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 26px;
        }
        .mv-b-contact {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 2px;
          transition: color 200ms ease, border-color 200ms ease;
        }
        .mv-b-contact:hover,
        .mv-b-contact:focus-visible {
          color: #fff;
          border-color: var(--rr-red, #f12032);
          outline: none;
        }

        /* ============================================================
           C — Kommandozentrale
           ============================================================ */
        .mv-c-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--rr-max, 1680px);
          margin: 0 auto;
          padding: clamp(46px, 7vh, 84px) var(--rr-gutter, clamp(24px, 5vw, 72px));
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(26px, 5vh, 56px);
          box-sizing: border-box;
        }
        .mv-c-body {
          display: grid;
          grid-template-columns: 1.5fr auto;
          gap: clamp(28px, 4vw, 64px);
          align-items: end;
        }
        .mv-c-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 52px);
        }
        .mv-c-col {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.4vh, 16px);
        }
        .mv-c-link {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(10px, 1vw, 16px);
          text-decoration: none;
          color: #ffffff;
          font-family: var(--rr-font-display, "DM Sans", sans-serif);
          font-weight: 600;
          font-size: clamp(26px, 3vw, 46px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          transition: color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1)),
            transform 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-c-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--rr-red, #f12032);
          flex: none;
          align-self: center;
          opacity: 0;
          transform: scale(0.6);
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .mv-c-idx {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(11px, 0.85vw, 13px);
          font-weight: 650;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.32);
          transform: translateY(-0.4em);
          transition: color 220ms ease;
        }
        .mv-c-link:hover,
        .mv-c-link:focus-visible {
          color: var(--rr-red, #f12032);
          transform: translateX(6px);
          outline: none;
        }
        .mv-c-link:hover .mv-c-dot,
        .mv-c-link:focus-visible .mv-c-dot {
          opacity: 1;
          transform: scale(1);
        }
        .mv-c-link:hover .mv-c-idx,
        .mv-c-link:focus-visible .mv-c-idx {
          color: var(--rr-red, #f12032);
        }
        .mv-c-sub {
          list-style: none;
          margin: 4px 0 2px;
          padding-left: clamp(24px, 2vw, 34px);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mv-c-sublink {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: clamp(13px, 1.1vw, 15px);
          font-weight: 550;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 0.22s ease, transform 0.22s ease;
          display: inline-block;
        }
        .mv-c-sublink:hover,
        .mv-c-sublink:focus-visible {
          color: var(--rr-red, #f12032);
          transform: translateX(5px);
          outline: none;
        }
        /* Grosser roter CTA-Block */
        .mv-c-cta {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: clamp(220px, 22vw, 320px);
          height: clamp(150px, 20vh, 210px);
          padding: clamp(20px, 2vw, 30px);
          background: var(--rr-red, #f12032);
          color: #ffffff;
          text-decoration: none;
          transition: background-color 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-c-cta:hover,
        .mv-c-cta:focus-visible {
          background: var(--rr-red-deep, #c81222);
          outline: none;
        }
        .mv-c-cta-t {
          font-family: var(--rr-font-display, "DM Sans", sans-serif);
          font-weight: 600;
          font-size: clamp(20px, 1.8vw, 28px);
          line-height: 1.08;
          letter-spacing: -0.01em;
        }
        .mv-c-cta-arrow {
          align-self: flex-end;
          font-size: clamp(30px, 3vw, 46px);
          line-height: 1;
          transition: transform 220ms var(--rr-ease, cubic-bezier(0.6, 0, 0.4, 1));
        }
        .mv-c-cta:hover .mv-c-cta-arrow {
          transform: translateX(6px);
        }
        .mv-c-contacts {
          list-style: none;
          margin: 0;
          padding-top: clamp(16px, 2.5vh, 26px);
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          flex-wrap: wrap;
          gap: 10px 32px;
        }
        .mv-c-contact {
          font-family: var(--rr-font-ui, sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          padding-bottom: 2px;
          transition: color 200ms ease, border-color 200ms ease;
        }
        .mv-c-contact:hover,
        .mv-c-contact:focus-visible {
          color: #fff;
          border-color: var(--rr-red, #f12032);
          outline: none;
        }

        /* ===== Schmale Fenster: Spalten brechen um, bleiben in 100vh ===== */
        @media (max-width: 720px) {
          .mv-a-grid {
            grid-template-columns: 1fr;
            gap: clamp(20px, 3vh, 32px);
            align-content: center;
          }
          .mv-a-side {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.14);
            padding-left: 0;
            padding-top: clamp(20px, 3vh, 30px);
          }
          .mv-b-subs {
            display: none;
          }
          .mv-c-body {
            grid-template-columns: 1fr;
            gap: clamp(20px, 3vh, 32px);
          }
          .mv-c-cta {
            width: 100%;
            height: auto;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .mv-c-cta-arrow {
            align-self: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mv * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
