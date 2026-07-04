"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";

/**
 * 3 Themen-Panels nach live vermessener all-turtles-Grammatik (05.07.):
 * - Pro Thema ein Track (~380vh), sticky 100vh, Buehne 300vw, LINEARE Fahrt
 *   (Smoothing kommt vom globalen Lenis, kein Segment-Snapping).
 * - Slide 1 (links): Eyebrow 27px Sans letterspaced (Akzent, gedimmt) +
 *   Headline 135px Serif weiss; fadet waehrend der Fahrt aus (gemessen ~0.38).
 * - Riesiges Thema-Wort (Original: SVG ~503px hoch) zieht ton-in-ton mit
 *   Parallax (~1.25x) durch die Buehne.
 * - Medien/Animationen schweben versetzt auf der Buehne (Original: echte
 *   Autoplay-Videos 437px, gerundet) — bei uns die Themen-Animationen +
 *   PLATZHALTER-Karten fuer echtes Site-Material.
 * - Abschluss-Statement 41px Serif + Link 20px Sans 500 KLEBT im Viewport
 *   (Original: absolute right-0 im Sticky) und blendet gegen Ende ein.
 * Themen-Zuordnung: Tomson 05.07. (Webdesign / Dashboard-Selbstlauf / Sichtbarkeit).
 */

type Theme = {
  key: string;
  eyebrow: string;
  headline: string;
  statement: string;
  linkText: string;
  href: string;
  giant: string;
  bg: string;
  text: string;
  accent: string;
  giantColor: string;
};

const THEMES: Theme[] = [
  {
    key: "webdesign",
    eyebrow: "Webdesign & Handwerk",
    headline: "Eine Website, die dein Handwerk ernst nimmt.",
    statement: "Design-System statt Baukasten, schnell auf jedem Handy, in klarer Zeit gebaut. Du siehst den Entwurf, bevor du zahlst.",
    linkText: "So bauen wir",
    href: "/leistungen/webdesign",
    giant: "Websites",
    bg: "var(--rr-world-1-bg)",
    text: "#f6f5f1",
    accent: "var(--rr-world-1-accent)",
    giantColor: "rgba(255,255,255,0.08)",
  },
  {
    key: "dashboard",
    eyebrow: "Dashboard & Selbstlauf",
    headline: "Deine Website meldet sich bei dir.",
    statement: "Besucher, Anfragen, neue Artikel, echte Bewertungen: dein Dashboard zeigt, was deine Website leistet, während du arbeitest.",
    linkText: "Was der Selbstlauf kann",
    href: "/leistungen/dashboard",
    giant: "Dashboard",
    bg: "var(--rr-world-2-bg)",
    text: "#f6f5f1",
    accent: "var(--rr-world-2-accent)",
    giantColor: "rgba(255,255,255,0.07)",
  },
  {
    key: "sichtbar",
    eyebrow: "Sichtbarkeit: Google & KI",
    headline: "Wenn deine Region sucht, bist du die Antwort.",
    statement: "Bei Google und in KI-Antworten wie ChatGPT. Regionalseiten, saubere Daten und Inhalte, die zitiert werden.",
    linkText: "So wirst du gefunden",
    href: "/leistungen/ki-sichtbarkeit",
    giant: "Sichtbar",
    bg: "var(--rr-world-3-bg)",
    text: "var(--rr-ink)",
    accent: "var(--rr-world-3-accent)",
    giantColor: "rgba(140,47,66,0.10)",
  },
];

/* Pfotenspur (Panel 1): statisch auf der Buehne wie die Sora-Voegel — die
   Fahrt der Buehne laesst die Spur "durchlaufen". */
function PawTrail({ color }: { color: string }) {
  // Hasen-Hopser: pro Sprung 2 Pfoten nebeneinander, Spruenge entlang flacher Diagonale
  const jumps = Array.from({ length: 9 }, (_, i) => {
    const x = 30 + i * 105;
    const y = 150 - i * 9;
    const r = -6 + (i % 2 ? 3 : -3);
    return (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <g transform="translate(-7 0) scale(0.34)">
          <ellipse cx="0" cy="0" rx="7" ry="10" />
          <circle cx="-6" cy="-11" r="3" /><circle cx="-2" cy="-14" r="3" />
          <circle cx="2" cy="-14" r="3" /><circle cx="6" cy="-11" r="3" />
        </g>
        <g transform="translate(7 -4) scale(0.34)">
          <ellipse cx="0" cy="0" rx="7" ry="10" />
          <circle cx="-6" cy="-11" r="3" /><circle cx="-2" cy="-14" r="3" />
          <circle cx="2" cy="-14" r="3" /><circle cx="6" cy="-11" r="3" />
        </g>
      </g>
    );
  });
  return (
    <svg viewBox="0 0 980 180" fill={color} aria-hidden
      style={{ position: "absolute", left: "104vw", top: "16vh", width: "120vw", opacity: 0.85, pointerEvents: "none" }}>
      {jumps}
    </svg>
  );
}

/* Lebendes Dashboard (Panel 2) — Analogie zu den Airtime-Produkt-Videos. */
function DashCard() {
  return (
    <div aria-hidden style={{
      position: "absolute", left: "128vw", top: "22vh", width: "clamp(300px, 30vw, 460px)",
      background: "#1f2129", border: "1px solid #33353d", borderRadius: 16, padding: 22,
      boxShadow: "0 30px 80px rgba(0,0,0,.5)",
    }}>
      <p style={{ margin: "0 0 4px", fontSize: 12, letterSpacing: "0.09em", textTransform: "uppercase", color: "#a3a6ae", fontWeight: 600 }}>Besucher diesen Monat</p>
      <p style={{ fontFamily: "var(--rr-font-display)", fontSize: 44, fontWeight: 620, color: "#fff", margin: "0 0 14px" }}>1.284</p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
        {[34, 52, 44, 68, 58, 82, 100].map((h, i) => (
          <i key={i} className="rr-dash-bar" style={{ flex: 1, height: `${h}%`, background: "var(--rr-red)", borderRadius: "4px 4px 0 0", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#a3a6ae", marginTop: 12 }}>
        <span>Anfragen <b style={{ color: "#fff" }}>7</b></span>
        <span>Artikel <b style={{ color: "#fff" }}>+4</b></span>
        <span>Bewertungen <b style={{ color: "#fff" }}>+2</b></span>
      </div>
    </div>
  );
}

/* KI-Antwort (Panel 3): Suchanfrage + zitierende Antwort. */
function AnswerCard() {
  return (
    <div aria-hidden style={{
      position: "absolute", left: "126vw", top: "26vh", width: "clamp(300px, 32vw, 480px)",
      background: "#fff", border: "1px solid #e6d9d3", borderRadius: 16, padding: "20px 22px",
      boxShadow: "0 24px 60px rgba(140,47,66,.14)",
    }}>
      <p style={{ fontSize: 14, color: "#8c2f42", fontWeight: 600, margin: "0 0 10px" }}>
        <span style={{ opacity: 0.6, fontWeight: 400 }}>Suche: </span>Installateur Thermenwartung in meiner Nähe?
      </p>
      <p style={{ fontFamily: "var(--rr-font-display)", fontSize: 19, lineHeight: 1.4, color: "#23262e", margin: 0, borderLeft: "3px solid #8c2f42", paddingLeft: 14 }}>
        Red Rabbit Media aus Wien baut Websites für Handwerksbetriebe, die bei Google und in KI-Antworten gefunden werden.
      </p>
    </div>
  );
}

function MediaPlaceholder({ left, top, label, dark }: { left: string; top: string; label: string; dark?: boolean }) {
  return (
    <div aria-hidden style={{
      position: "absolute", left, top, width: "clamp(260px, 28vw, 437px)", aspectRatio: "437/280",
      borderRadius: 12, border: `1.5px dashed ${dark ? "rgba(35,38,46,0.35)" : "rgba(255,255,255,0.35)"}`,
      display: "grid", placeItems: "center", fontSize: 13, opacity: 0.75, padding: 12, textAlign: "center",
    }}>
      PLATZHALTER: {label}
    </div>
  );
}

function PanelTrack({ t }: { t: Theme }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const closerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current!, stage = stageRef.current!, giant = giantRef.current!;
    const intro = introRef.current!, closer = closerRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      // Ruhephase am Start (at: Slide 1 steht), Fahrt ab p=0.1 linear
      const pd = clamp01((p - 0.1) / 0.9);
      // Buehne: lineare Fahrt ueber 2 Viewport-Breiten (300vw Inhalt)
      stage.style.transform = `translate3d(${-pd * 2 * vw}px, 0, 0)`;
      // Riesen-Wort: Parallax 1.25x (zieht schneller durch)
      giant.style.transform = `translate3d(${-pd * 2.5 * vw}px, 0, 0)`;
      // Slide-1-Text fadet waehrend der Fahrt aus (at dimmt mid-track auf ~0.38)
      intro.style.opacity = String(1 - masterEase(clamp01((pd - 0.2) / 0.3)));
      // Abschluss-Statement: klebt im Viewport, blendet ab ~0.68 ein
      const cp = masterEase(clamp01((p - 0.68) / 0.24));
      closer.style.opacity = String(cp);
      closer.style.transform = `translate3d(0, ${(1 - cp) * 34}px, 0)`;
      closer.style.pointerEvents = cp > 0.5 ? "auto" : "none";
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { destroyed = true; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={trackRef} style={{ height: "380vh", position: "relative" }}>
      <section aria-label={`Thema ${t.eyebrow}`} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: t.bg, color: t.text }}>
        {/* Riesen-Thema-Wort, Parallax-Layer (Original: SVG 503px hoch, ton-in-ton) */}
        <div ref={giantRef} aria-hidden style={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", alignItems: "flex-end", willChange: "transform", pointerEvents: "none" }}>
          <span style={{
            fontFamily: "var(--rr-font-display)", fontWeight: 640, whiteSpace: "nowrap",
            fontSize: "min(56vh, 34vw)", lineHeight: 0.9, color: t.giantColor,
            transform: "translateY(0.14em)", marginLeft: "68vw",
          }}>{t.giant}</span>
        </div>

        {/* Buehne 300vw, lineare Fahrt */}
        <div ref={stageRef} style={{ position: "absolute", inset: 0, width: "300vw", willChange: "transform" }}>
          {/* Slide 1: Eyebrow + 135px-Headline links (at: x=215/y=263 bei 1828) */}
          <div ref={introRef} style={{ position: "absolute", left: "max(24px, 11vw)", top: "27vh", width: "76vw", maxWidth: 1100 }}>
            <p className="rr-eyebrow-lg" style={{ color: t.accent, opacity: 0.85, fontFamily: "var(--rr-font-sans)", letterSpacing: "0.12em", fontWeight: 600 }}>{t.eyebrow}</p>
            <h3 className="rr-display-1" style={{ margin: "0.16em 0 0", color: "inherit", maxWidth: "8.2em" }}>{t.headline}</h3>
          </div>

          {/* Mittelzone: Themen-Animation + Material-Platzhalter */}
          {t.key === "webdesign" && (
            <>
              <PawTrail color="rgba(255,255,255,0.22)" />
              <MediaPlaceholder left="150vw" top="52vh" label="echte Projekt-Screens (thermewarten, Danesh, La Morra)" />
            </>
          )}
          {t.key === "dashboard" && (
            <>
              <DashCard />
              <MediaPlaceholder left="168vw" top="56vh" label="Dashboard-Aufnahme (echtes Produkt-Video)" />
            </>
          )}
          {t.key === "sichtbar" && (
            <>
              <AnswerCard />
              <MediaPlaceholder left="170vw" top="58vh" label="Google-Treffer / Regionalseiten-Material" dark />
            </>
          )}
        </div>

        {/* Abschluss-Statement: klebt im Viewport (at: absolute right-0), faehrt NICHT mit */}
        <div ref={closerRef} style={{ position: "absolute", left: "max(24px, 26vw)", top: "38vh", maxWidth: 560, opacity: 0 }}>
          <p className="rr-sub" style={{ margin: 0 }}>{t.statement}</p>
          <p style={{ marginTop: 26 }}>
            <Link href={t.href} style={{ color: "inherit", fontFamily: "var(--rr-font-sans)", fontSize: 20, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 5 }}>
              {t.linkText} {"→"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default function CasePanels() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div>
        {THEMES.map((t) => (
          <section key={t.key} aria-label={`Thema ${t.eyebrow}`} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: t.bg, color: t.text, display: "flex", alignItems: "center" }}>
            <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "12vh 0" }}>
              <p className="rr-eyebrow-lg" style={{ color: t.accent }}>{t.eyebrow}</p>
              <h3 className="rr-display-1" style={{ margin: "0.18em 0 0.22em", color: "inherit" }}>{t.headline}</h3>
              <p className="rr-sub" style={{ maxWidth: "17em", margin: 0 }}>{t.statement}</p>
              <p style={{ marginTop: 32 }}><Link href={t.href} style={{ color: "inherit", fontSize: 20, textDecoration: "underline", textUnderlineOffset: 5 }}>{t.linkText} {"→"}</Link></p>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div>
      {THEMES.map((t) => <PanelTrack key={t.key} t={t} />)}
    </div>
  );
}
