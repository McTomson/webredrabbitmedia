"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "./RabbitMark";
import { buildWordLayout, type WordLayout } from "@/lib/relaunch/morph/pieces";
import { buildReassembly, sample, clamp01, type Keyframe } from "@/lib/relaunch/morph/grammar";

/**
 * Premium-Footer mit Wortmarken-Reassembly (Blaupause Sektion 9, all-turtles-Vorbild).
 *
 * Bewegung (Fix 05.07.): Der Fortschritt wird jetzt an der EINTRITTS-Phase der
 * Wortmarke aufgehaengt, nicht an einem 220vh-Sticky-Track. Frueher lief die
 * Reassembly waehrend die Wortmarke bereits fixiert/zentriert war -> beim
 * eigentlichen "in den Footer scrollen" stand sie schon zusammengesetzt da.
 * Jetzt: q=0 wenn die Wortmarken-Mitte knapp unter dem Viewport ist (Footer
 * taucht auf), q~0.5 wenn sie im unteren Drittel erscheint (mid-settle), q=1
 * wenn sie sich zentriert -> die Scherben setzen sich SICHTBAR beim Eintritt.
 * Danach bleibt sie zusammengesetzt stehen, waehrend die Info-Spalten hochscrollen.
 *
 * Groesse (Fix 05.07.): F = clamp(88px, 13vw, 210px) — "red" ueber "rabbit"
 * spannt fast die volle Breite (all-turtles-Massstab), statt Footer-Lottie-klein.
 */

const NAVY = "var(--rr-navy, #1C2837)";

const NAV = [
  { label: "Start", href: "/relaunch-preview" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Referenzen", href: "/referenzen-preview" },
  { label: "Preise", href: "/preise" },
  { label: "FAQ", href: "/faq" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

const REGIONEN = [
  { label: "Wien", href: "/webdesign-wien" },
  { label: "Niederösterreich", href: "/webdesign-niederoesterreich" },
  { label: "Oberösterreich", href: "/webdesign-oberoesterreich" },
  { label: "Steiermark", href: "/webdesign-steiermark" },
  { label: "Kärnten", href: "/webdesign-kaernten" },
  { label: "Salzburg", href: "/webdesign-salzburg" },
  { label: "Tirol", href: "/webdesign-tirol" },
  { label: "Vorarlberg", href: "/webdesign-vorarlberg" },
  { label: "Burgenland", href: "/webdesign-burgenland" },
];

const LEGAL = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Cookie-Einstellungen", href: "/cookie-einstellungen" },
];

export default function FooterReassembly() {
  const boxRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const box = boxRef.current!;
    let layout: WordLayout | null = null;
    let tracks: Keyframe[][] = [];
    let els: HTMLDivElement[] = [];
    let raf = 0;
    let destroyed = false;

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      // Wortmarke gross wie all-turtles, aber breitengefuehrt: die einzeilige Marke
      // "red rabbit" ist breit -> auf schmalen Screens die Groesse an die verfuegbare
      // Breite koppeln, sonst clippt overflow:hidden die Randbuchstaben (Fix 06.07.:
      // 13vw-Floor 88px ergab ~491px @390px vs. 342px Container). F fuellt die Breite
      // bis max 210px (Desktop-Kappung); Wort-Vorschub bei 100px messen = gleiche
      // Metrik wie buildWordLayout (SPACE_EM 0.9), Ink-BBox ist etwas schmaler -> safe.
      const HPAD = 24, SAFE = 20; // .rr-foot-word padding + Sicherheitsrand pro Seite
      const avail = window.innerWidth - 2 * (HPAD + SAFE);
      const mc = document.createElement("canvas").getContext("2d")!;
      mc.font = `700 100px ${fam}`;
      const adv100 = [..."red rabbit"].reduce(
        (s, ch) => s + (ch === " " ? 0.9 * 100 : mc.measureText(ch).width), 0
      );
      // Wunschgroesse unveraendert (all-turtles-Massstab), aber nie breiter als der
      // Platz: Ffit ist die Breite, bei der die Marke exakt passt -> min() greift nur
      // auf schmalen Screens, Desktop/Tablet bleiben pixelgleich zu vorher.
      const desiredF = Math.min(128, Math.max(56, window.innerWidth * 0.092)); // Tomson 06.07.: kleiner (war 13vw/210)
      const Ffit = adv100 > 0 ? (avail / adv100) * 100 : desiredF;
      const F = Math.min(desiredF, Ffit);
      const l = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!l || l.pieces.length < 10) return false;
      layout = l;
      box.style.width = `${l.boxW}px`;
      box.style.height = `${l.boxH}px`;
      box.innerHTML = "";
      els = l.pieces.map((p) => {
        const im = document.createElement("div");
        im.innerHTML = p.svg;
        im.style.cssText = `position:absolute;left:${p.hx}px;top:${p.hy}px;max-width:none;width:${p.w}px;height:${p.h}px;will-change:transform;`;
        box.appendChild(im);
        return im;
      });
      tracks = buildReassembly(
        l.pieces.map((p) => ({ cx: p.cx, cy: p.cy, w: p.w, h: p.h, letter: p.letter })),
        { viewportW: window.innerWidth, viewportH: window.innerHeight }
      );
      return true;
    }

    function render() {
      if (!layout) return;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerY = r.top + r.height / 2;
      // Fortschritt an der Eintritts-Phase: q=0 wenn die Wortmarken-Mitte knapp
      // unter dem Viewport steht (Footer taucht auf), q=1 wenn sie sich zentriert.
      // -> Die Reassembly laeuft SICHTBAR waehrend man in den Footer scrollt.
      const START = vh * 1.05; // Mitte knapp unter der Unterkante -> Anfang
      const END = vh * 0.5; // Mitte im Viewport-Zentrum -> fertig zusammengesetzt
      const q = clamp01((START - centerY) / (START - END));
      for (let i = 0; i < els.length; i++) {
        const kf = sample(tracks[i], q);
        els[i].style.transform = `translate(${kf.x}px, ${kf.y}px) rotate(${kf.rot}deg)`;
        els[i].style.opacity = q < 0.01 ? "0" : "1";
      }
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }

    let tries = 0;
    function tryBuild() {
      if (destroyed) return;
      if (build()) { render(); return; }
      if (++tries < 30) setTimeout(tryBuild, 200);
    }
    document.fonts.ready.then(tryBuild);
    raf = requestAnimationFrame(loop);

    const onResize = () => { build(); render(); };
    window.addEventListener("resize", onResize);
    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="rr-foot" style={{ background: NAVY, color: "#fff", position: "relative", overflow: "hidden" }}>
      <style>{FOOT_CSS}</style>
      <span
        ref={probeRef}
        aria-hidden
        style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}
      >
        probe
      </span>

      {/* Riesen-Wortmarke — setzt sich beim Footer-Eintritt sichtbar zusammen */}
      <div ref={wrapRef} className="rr-foot-word">
        {reduced ? (
          <p
            className="rr-claim"
            style={{
              color: "var(--rr-red)",
              fontWeight: 640,
              fontFamily: "var(--rr-font-display)",
              fontSize: "clamp(88px, 13vw, 210px)",
              lineHeight: 0.92,
              textAlign: "center",
              margin: 0,
            }}
          >
            red<br />rabbit
          </p>
        ) : (
          <div ref={boxRef} style={{ position: "relative" }} />
        )}
      </div>

      {/* Info-Spalten */}
      <div className="rr-foot-inner">
        <div className="rr-foot-cols">
          {/* Marke */}
          <div className="rr-foot-brand">
            <RabbitMark className="rr-foot-logo" color="#F12032" />
            <p className="rr-foot-brandname">Red Rabbit Media</p>
            <p className="rr-foot-tag">Die faire Anti-Agentur für den österreichischen Mittelstand.</p>
          </div>

          {/* Navigation */}
          <nav className="rr-foot-col" aria-label="Navigation">
            <h3 className="rr-foot-head">Navigation</h3>
            <ul className="rr-foot-list">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link className="rr-foot-link" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Regionen */}
          <nav className="rr-foot-col" aria-label="Regionen">
            <h3 className="rr-foot-head">Regionen</h3>
            <ul className="rr-foot-list rr-foot-list--regions">
              {REGIONEN.map((l) => (
                <li key={l.href}>
                  <Link className="rr-foot-link rr-foot-link--sm" href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontakt */}
          <div className="rr-foot-col">
            <h3 className="rr-foot-head">Kontakt</h3>
            <address className="rr-foot-contact">
              <span className="rr-foot-strong">Red Rabbit GmbH</span>
              <span>Grabnergasse 8/8, 1060 Wien</span>
              <a className="rr-foot-link" href="mailto:office@redrabbit.media">office@redrabbit.media</a>
              <a className="rr-foot-link" href="tel:+436769000955">+43 676 9000 955</a>
              <span className="rr-foot-social">
                <a className="rr-foot-link" href="https://www.instagram.com/redrabbit.media/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a className="rr-foot-link" href="https://www.linkedin.com/in/thomasuhlir/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </span>
            </address>
          </div>
        </div>

        <hr className="rr-foot-rule" />

        {/* Legal-Zeile + Bottom */}
        <div className="rr-foot-bottom">
          <nav className="rr-foot-legal" aria-label="Rechtliches">
            {LEGAL.map((l) => (
              <Link key={l.href} className="rr-foot-link rr-foot-link--sm" href={l.href}>{l.label}</Link>
            ))}
          </nav>
          <div className="rr-foot-copy">
            <span>&copy; {year} Red Rabbit GmbH. Alle Rechte vorbehalten.</span>
            <span className="rr-foot-madein">Gebaut in Wien.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FOOT_CSS = `
.rr .rr-foot { padding: 0; }
.rr .rr-foot-word {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(72px, 15vh, 168px) 24px clamp(48px, 9vh, 104px);
}
.rr .rr-foot-inner {
  max-width: var(--rr-max);
  margin: 0 auto;
  padding: 0 var(--rr-gutter) clamp(40px, 6vh, 72px);
}
.rr .rr-foot-cols {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: clamp(36px, 4vw, 72px);
  padding-top: clamp(48px, 7vh, 88px);
  border-top: 1px solid rgba(255,255,255,0.12);
}
.rr .rr-foot-brand { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.rr .rr-foot-logo { height: 48px; width: auto; display: block; }
.rr .rr-foot-brandname {
  font-family: var(--rr-font-display);
  font-size: 24px;
  font-weight: 560;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 2px 0 0;
}
.rr .rr-foot-tag {
  font-family: var(--rr-font-ui);
  font-size: 15px;
  line-height: 1.55;
  color: rgba(255,255,255,0.70);
  max-width: 30ch;
  margin: 0;
}
.rr .rr-foot-head {
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.50);
  margin: 0 0 18px;
}
.rr .rr-foot-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.rr .rr-foot-list--regions { gap: 9px; }
.rr .rr-foot-link {
  font-family: var(--rr-font-ui);
  font-size: 16px;
  font-weight: 500;
  color: rgba(255,255,255,0.72);
  text-decoration: none;
  transition: color var(--rr-t-fast, 200ms) var(--rr-ease, ease);
}
.rr .rr-foot-link:hover { color: #ff5f6d; }
.rr .rr-foot-link:focus-visible { outline: 2px solid var(--rr-red); outline-offset: 3px; border-radius: 3px; }
.rr .rr-foot-link--sm { font-size: 14.5px; color: rgba(255,255,255,0.62); }
.rr .rr-foot-contact { font-style: normal; display: flex; flex-direction: column; gap: 11px; }
.rr .rr-foot-contact > span,
.rr .rr-foot-contact > a {
  font-family: var(--rr-font-ui);
  font-size: 16px;
  line-height: 1.4;
  color: rgba(255,255,255,0.72);
}
.rr .rr-foot-strong { color: #fff; font-weight: 600; }
.rr .rr-foot-social { display: flex; gap: 20px; margin-top: 4px; }
.rr .rr-foot-rule { border: 0; border-top: 1px solid rgba(255,255,255,0.12); margin: clamp(40px, 6vh, 72px) 0 26px; }
.rr .rr-foot-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 32px;
}
.rr .rr-foot-legal { display: flex; flex-wrap: wrap; gap: 12px 26px; }
.rr .rr-foot-copy {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-family: var(--rr-font-ui);
  font-size: 13.5px;
  color: rgba(255,255,255,0.45);
}
.rr .rr-foot-madein { color: rgba(255,255,255,0.62); }

@media (max-width: 900px) {
  .rr .rr-foot-cols { grid-template-columns: 1fr 1fr; gap: 40px 32px; }
  .rr .rr-foot-brand { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .rr .rr-foot-cols { grid-template-columns: 1fr; }
  .rr .rr-foot-bottom { flex-direction: column; align-items: flex-start; }
}
`;
