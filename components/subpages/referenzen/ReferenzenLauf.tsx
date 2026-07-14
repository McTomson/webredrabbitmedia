"use client";

/* Bewusst rohe <img>: das Frame-0-Poster braucht fetchpriority=high fuers LCP und
   der Canvas uebernimmt sofort; die Karten-Screenshots sind lokale, lazy geladene
   Assets fester Groesse — next/image bringt hier keinen Nutzen, nur Komplexitaet. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

/**
 * ReferenzenLauf — der scroll-gescrubte "Hasen-Lauf".
 *
 * Eine lange Scroll-Strecke (rf-track 800vh) mit einer sticky 100dvh-Buehne,
 * auf der ein <canvas> eine 125-Frame-WebP-Sequenz cover-fit zeichnet. Der
 * Scroll-Fortschritt (0..1) treibt einen Ziel-Frame; ein rAF-Loop daempft den
 * aktuellen Frame weich hinterher (current += (target-current)*0.14) -> fluessig
 * wie ein Computerspiel, kein hartes Mapping. Frame 0 liegt zusaetzlich als
 * fetchpriority=high-<img> hinter dem Canvas (sofortiges LCP), bis der Canvas
 * uebernimmt. Frames werden in Wellen geladen (jeder 8., dann jeder 4., dann
 * alle) — Grob-Scrub ist sofort moeglich; noch nicht geladene Frames zeichnen
 * den naechstgelegenen geladenen.
 *
 * Die sieben Projekt-Karten sind echtes SSR-HTML (absolute im Track, ueber dem
 * Canvas), erscheinen im Tunnel-Abschnitt und blenden per CSS Scroll-Driven
 * Animation (animation-timeline: view()) ein/aus. Ohne view()-Support sind sie
 * statisch sichtbar (kein JS noetig).
 *
 * prefers-reduced-motion: kein Scrub — statisches Frame-0-Bild, Karten und
 * Abschluss als normal gestapelte Sektionen.
 */

export type Copy = {
  h1: string;
  closeStmt: string;
  cta: string;
};

type Card = {
  slug: string;
  href: string;
  name: string;
  cat: string;
  top: string; // vertikale Position im Track (Desktop/Mobile teilen sich den Wert)
  side: "left" | "right";
};

const KONTAKT = "/relaunch-preview/kontakt";

// Reihenfolge/Daten laut Spec. K2 bewusst als VORLETZTE Position (Position 6).
// Karten-Positionen (Thomas-QA 14.07.): Karten erst, wenn der Hase IM Bau ist.
// Track = 800vh -> 700vh scrollbar. Tunnel (Frame 60) liegt mit der piecewise
// Progress->Frame-Map bei Progress ~0.43; eine Karte wird ~100vh vor ihrem top
// sichtbar. Erste Karte top 450vh -> Eintritt bei Scroll 350vh = Progress 0.50
// (Frame ~68, klar im Tunnel). Letzte Karte top 655vh -> komplett durchgelaufen
// (~45vh Kartenhoehe) bei Scroll ~700vh = exakt Track-Ende.
const CARDS: Card[] = [
  { slug: "thermewarten", href: "https://thermewarten.at", name: "Thermewarten", cat: "Thermenwartung Wien", top: "450vh", side: "left" },
  { slug: "lashesbydanesh", href: "https://lashesbydanesh.at", name: "LashesbyDanesh", cat: "Beauty-Studio", top: "485vh", side: "right" },
  { slug: "la-morra", href: "https://pizza-4.vercel.app", name: "Ristorante La Morra", cat: "Gastronomie", top: "520vh", side: "left" },
  { slug: "almtal-invest", href: "https://almtal-invest.vercel.app", name: "Almtal Invest", cat: "Immobilien-Investment", top: "555vh", side: "right" },
  { slug: "rero-heizsysteme", href: "https://heating-systems.at", name: "ReRo Heizsysteme", cat: "Heizungstechnik", top: "590vh", side: "left" },
  { slug: "k2-dach-bau", href: "https://k2-dream-builder.vercel.app", name: "K2 Dach & Bau", cat: "Dach & Bau", top: "625vh", side: "right" },
  { slug: "global-insights", href: "https://ruderes-insights.at", name: "Global Insights", cat: "Beratung", top: "655vh", side: "left" },
];

const FRAME_COUNT = 125;
const LAST = FRAME_COUNT - 1;

// Story-Beats der Quell-Sequenz: der Hase SITZT lange (Frames 0-19), erst ab
// Frame 20 laeuft er los. Ein lineares Mapping erzeugt eine tote Zone nach dem
// Headline-Fade. Piecewise-Map (Thomas-QA 14.07.): Progress 0-0.08 deckt die
// Sitz-Frames 0-19 ab, Progress 0.08-1.0 die Bewegung (Frames 20-124) linear.
const SIT_LAST = 19;
const P_SIT = 0.08;
const mapProgressToFrame = (p: number): number =>
  p <= P_SIT
    ? (p / P_SIT) * SIT_LAST
    : SIT_LAST + ((p - P_SIT) / (1 - P_SIT)) * (LAST - SIT_LAST);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

function CardLink({ c }: { c: Card }) {
  return (
    <a
      className="rf-card__inner"
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${c.name}, ${c.cat} — Website ansehen (öffnet in neuem Tab)`}
    >
      <span className="rf-card__shot">
        {/* Alle sieben Screenshots liegen bereit; falls einer fehlt, greift der
            Ink-Platzhalter (#23262e) per CSS-Hintergrund unter dem <img>. */}
        <img
          className="rf-card__img"
          src={`/relaunch/referenzen/cards/${c.slug}.webp`}
          alt={`Website ${c.name}`}
          width={960}
          height={600}
          loading="lazy"
          decoding="async"
        />
        <span className="rf-card__arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      </span>
      <span className="rf-card__meta">
        <span className="rf-card__cat">{c.cat}</span>
        <span className="rf-card__name">{c.name}</span>
      </span>
    </a>
  );
}

function ClosingSection({ copy }: { copy: Copy }) {
  // Letzte Interpunktion abtrennen -> roter Schlusspunkt (einziger Akzent).
  const m = copy.closeStmt.match(/^([\s\S]*?)([.?!…]+)$/);
  const body = m ? m[1] : copy.closeStmt;
  const punct = m ? m[2] : "";
  return (
    <section className="rf-close" aria-labelledby="rf-close-head">
      <div className="rr-wrap rr-narrow rf-close-inner">
        <h2 id="rf-close-head" className="rf-close__stmt">
          {body}
          {punct ? <span className="rf-close__dot">{punct}</span> : null}
        </h2>
        <div className="rf-close__actions">
          <a className="rr-btn-sweep rr-btn-sweep--red" href={KONTAKT}>
            {copy.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ReferenzenLauf({ copy }: { copy: Copy }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const img0Ref = useRef<HTMLImageElement>(null);

  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Scrub-/Frame-Engine. Laeuft nur ohne reduced-motion.
  useEffect(() => {
    if (!mounted || reduced) return;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !track) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Drawable = { img: CanvasImageSource; w: number; h: number };

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const dir = isMobile ? "m" : "d";
    const frames: (Drawable | undefined)[] = new Array(FRAME_COUNT);
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);

    let cancelled = false;
    let dpr = 1;
    let needsRedraw = true;
    let lastDrawn = -1;
    let current = 0;
    let target = 0;
    let hidPoster = false;

    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const url = (i: number) => `/relaunch/referenzen/frames/${dir}/f-${String(i).padStart(3, "0")}.webp`;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      needsRedraw = true;
    };

    const store = (i: number, d: Drawable) => {
      frames[i] = d;
      loaded[i] = true;
      needsRedraw = true;
    };

    const load = async (i: number): Promise<void> => {
      if (loaded[i]) return;
      try {
        if ("createImageBitmap" in window) {
          const res = await fetch(url(i));
          const blob = await res.blob();
          const bmp = await createImageBitmap(blob);
          if (cancelled) {
            bmp.close?.();
            return;
          }
          store(i, { img: bmp, w: bmp.width, h: bmp.height });
          return;
        }
      } catch {
        /* Fallback auf Image() unten */
      }
      await new Promise<void>((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          if (!cancelled) store(i, { img: im, w: im.naturalWidth, h: im.naturalHeight });
          resolve();
        };
        im.onerror = () => resolve();
        im.src = url(i);
      });
    };

    const nearest = (i: number): number => {
      if (loaded[i]) return i;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d;
        if (i + d < FRAME_COUNT && loaded[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (i: number) => {
      const idx = nearest(i);
      if (idx < 0) return;
      const f = frames[idx]!;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / f.w, ch / f.h);
      const dw = f.w * scale;
      const dh = f.h * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(f.img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      if (!hidPoster && img0Ref.current) {
        img0Ref.current.style.opacity = "0";
        hidPoster = true;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    // iOS: Adressleisten-Kollaps aendert 100dvh, feuert aber nicht immer ein
    // window-resize -> Canvas-Backing-Store wuerde von der Buehne abweichen.
    window.visualViewport?.addEventListener("resize", resize);

    // Progressive Lade-Wellen: erst jeder 8., dann jeder 4., dann alle.
    (async () => {
      await load(0);
      if (cancelled) return;
      draw(0);
      const wave = async (step: number) => {
        const idxs: number[] = [];
        for (let i = 0; i < FRAME_COUNT; i += step) idxs.push(i);
        await Promise.all(idxs.map((i) => load(i)));
      };
      await wave(8);
      if (cancelled) return;
      await wave(4);
      if (cancelled) return;
      await wave(1);
    })();

    let raf = 0;
    const loop = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;

      target = mapProgressToFrame(p);
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.02) current = target;

      const frame = Math.round(current);
      if (frame !== lastDrawn || needsRedraw) {
        draw(frame);
        lastDrawn = frame;
        needsRedraw = false;
      }

      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - clamp01(p / 0.06));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      for (const f of frames) {
        if (f?.img instanceof ImageBitmap) f.img.close();
      }
    };
  }, [mounted, reduced]);

  // Statische, gestapelte Variante fuer reduced-motion.
  if (mounted && reduced) {
    return (
      <div className="rf-shell rf-static">
        <style>{RF_CSS}</style>
        <section className="rf-static-hero" aria-labelledby="rf-h1">
          <picture className="rf-static-poster">
            <source media="(max-width: 767px)" srcSet="/relaunch/referenzen/frames/m/f-000.webp" />
            <img src="/relaunch/referenzen/frames/d/f-000.webp" alt="Roter Hase, der den Besucher ansieht" width={1280} height={720} />
          </picture>
          <div className="rf-hero-text rf-static-herotext">
            <p className="rf-kicker">(Referenzen)</p>
            <h1 id="rf-h1" className="rf-h1">{copy.h1}</h1>
          </div>
        </section>

        <section className="rf-static-cards" aria-label="Projekte">
          <div className="rr-wrap rr-narrow rf-static-grid">
            {CARDS.map((c) => (
              <div key={c.slug} className="rf-card rf-card--static">
                <CardLink c={c} />
              </div>
            ))}
          </div>
        </section>

        <ClosingSection copy={copy} />
      </div>
    );
  }

  return (
    <div className="rf-shell">
      <style>{RF_CSS}</style>

      <div className="rf-track" ref={trackRef}>
        <div className="rf-stage">
          {/* Frame 0 als LCP-Poster, bis der Canvas den ersten Frame zeichnet. */}
          <picture className="rf-poster">
            <source media="(max-width: 767px)" srcSet="/relaunch/referenzen/frames/m/f-000.webp" />
            <img
              ref={img0Ref}
              src="/relaunch/referenzen/frames/d/f-000.webp"
              alt="Roter Hase, der den Besucher ansieht"
              width={1280}
              height={720}
              fetchPriority="high"
            />
          </picture>

          <canvas ref={canvasRef} className="rf-canvas" aria-hidden="true" />

          <div className="rf-hero-text" ref={heroRef}>
            <p className="rf-kicker">(Referenzen)</p>
            <h1 className="rf-h1">{copy.h1}</h1>
          </div>
        </div>

        {/* Karten: echtes SSR-HTML, absolute im Track, ueber dem Canvas. */}
        <div className="rf-cards" aria-label="Projekte">
          {CARDS.map((c) => (
            <div
              key={c.slug}
              className="rf-card"
              data-side={c.side}
              style={{ ["--rf-top" as string]: c.top }}
            >
              <CardLink c={c} />
            </div>
          ))}
        </div>
      </div>

      <ClosingSection copy={copy} />
    </div>
  );
}

const RF_CSS = `
.rf-shell { position: relative; overflow-x: clip; background: #ffffff; }

/* ============ Scroll-Track + sticky Buehne ============ */
.rf-track { position: relative; height: 800vh; }
.rf-stage {
  position: sticky; top: 0;
  height: 100vh; height: 100dvh;
  overflow: hidden;
  background: #ffffff; /* passt zu Frame 0 (heller Studiogrund), kein Flash */
  z-index: 1;
}
.rf-poster, .rf-poster img,
.rf-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}
.rf-poster img { object-fit: cover; object-position: center; transition: opacity .3s var(--rr-ease); z-index: 1; }
.rf-canvas { display: block; z-index: 2; }

/* ---- Hero-Layer (H1 + Kicker) ueber der Buehne ---- */
.rf-hero-text {
  position: absolute; z-index: 3;
  left: var(--rr-gutter); right: var(--rr-gutter);
  bottom: clamp(64px, 12vh, 150px);
  max-width: 15em;
  pointer-events: none;
}
.rf-kicker {
  font-family: var(--rr-font-ui); font-size: var(--rr-fs-meta);
  color: var(--rr-ink-soft); margin: 0 0 14px; letter-spacing: 0.01em;
}
.rf-h1 {
  font-family: var(--rr-font-serif); font-weight: 500;
  font-size: var(--rr-fs-statement); line-height: 1.08; letter-spacing: -0.01em;
  color: var(--rr-navy); margin: 0; text-wrap: balance;
}

/* ============ Karten ============ */
.rf-cards { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
.rf-card {
  position: absolute; top: var(--rf-top);
  width: clamp(300px, 31vw, 400px);
  pointer-events: none;
}
.rf-card[data-side="left"] { left: clamp(20px, 6vw, 96px); }
.rf-card[data-side="right"] { right: clamp(20px, 6vw, 96px); }

.rf-card__inner {
  display: block; pointer-events: auto;
  background: #ffffff; color: var(--rr-ink);
  text-decoration: none;
  box-shadow: var(--rr-shadow-layer, 0 2px 4px rgba(28,40,55,.26), 0 7px 13px -3px rgba(28,40,55,.18));
  border: 1px solid var(--rr-line);
  /* ohne view()-Support: statisch sichtbar */
  opacity: 1;
  transition: box-shadow .4s var(--rr-ease), transform .4s var(--rr-ease);
  will-change: opacity, transform;
}
.rf-card__inner:hover { box-shadow: 0 18px 44px rgba(28,40,55,.28); }
.rf-card__inner:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--rr-paper), 0 0 0 4.5px var(--rr-red);
}

.rf-card__shot {
  position: relative; display: block;
  aspect-ratio: 960 / 600; overflow: hidden;
  background: #23262e; /* Ink-Platzhalter, falls ein Screenshot fehlt */
}
.rf-card__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.rf-card__arrow {
  position: absolute; top: 0; right: 0;
  display: grid; place-items: center;
  width: 40px; height: 40px;
  background: #ffffff; color: var(--rr-ink);
  transition: background .3s var(--rr-ease), color .3s var(--rr-ease);
}
.rf-card__inner:hover .rf-card__arrow { background: var(--rr-red); color: #fff; }

.rf-card__meta {
  display: flex; flex-direction: column; gap: 6px;
  padding: 16px 18px 18px;
}
.rf-card__cat {
  font-family: var(--rr-font-ui); font-size: 12px; font-weight: 650;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--rr-red);
}
.rf-card__name {
  font-family: var(--rr-font-display); font-weight: 700;
  font-size: clamp(19px, 1.5vw, 23px); line-height: 1.1;
  letter-spacing: -0.01em; color: var(--rr-ink);
}

/* Scroll-Driven Ein-/Ausblenden + Aufwaerts-Drift (nur mit Support) */
@supports (animation-timeline: view()) {
  .rf-track .rf-card__inner {
    opacity: 0;
    animation: rf-card-cycle linear both;
    animation-timeline: view();
    animation-range: entry 4% exit 96%;
  }
}
@keyframes rf-card-cycle {
  0%   { opacity: 0; transform: translateY(48px); }
  20%  { opacity: 1; transform: translateY(0); }
  74%  { opacity: 1; transform: translateY(-6px); }
  100% { opacity: 0; transform: translateY(-34px); }
}

/* ============ Abschluss-Sektion (normaler Flow, weiss) ============ */
.rf-close {
  position: relative; z-index: 5; background: #ffffff;
  padding: clamp(96px, 16vh, 200px) var(--rr-gutter) clamp(90px, 14vh, 170px);
}
/* Zentrierte Komposition wie das ueber-uns-Demo-Ende (Thomas-Referenz):
   Statement mittig, CTA mittig darunter. */
.rf-close-inner { text-align: center; }
.rf-close__stmt {
  font-family: var(--rr-font-display); font-weight: 700;
  font-size: var(--rr-fs-display-2); line-height: 1.04; letter-spacing: -0.02em;
  color: var(--rr-ink); margin: 0 auto; max-width: 16em; text-wrap: balance;
  transform-origin: center center;
}
.rf-close__dot { color: var(--rr-red); }
.rf-close__actions { margin-top: clamp(32px, 5vh, 52px); }

@supports (animation-timeline: view()) {
  .rf-close__stmt {
    animation: rf-pump linear both;
    animation-timeline: view();
    animation-range: entry 6% cover 42%;
  }
}
@keyframes rf-pump {
  from { transform: scale(0.92); opacity: 0.55; }
  to   { transform: scale(1); opacity: 1; }
}

/* ============ Mobile ============ */
@media (max-width: 767px) {
  .rf-hero-text {
    top: clamp(96px, 16vh, 180px); bottom: auto;
    left: var(--rr-gutter); right: var(--rr-gutter);
    max-width: none;
  }
  .rf-card {
    left: 50%; right: auto;
    transform: translateX(-50%);
    width: min(420px, 86vw);
  }
  .rf-card[data-side="left"],
  .rf-card[data-side="right"] { left: 50%; right: auto; }
}

/* ============ Reduced-Motion: statisch gestapelt ============ */
.rf-static-hero { position: relative; background: #ffffff; }
.rf-static-poster img {
  display: block; width: 100%; height: auto; max-height: 82vh; object-fit: cover; object-position: center;
}
.rf-static-herotext {
  position: absolute; left: var(--rr-gutter); bottom: clamp(40px, 8vh, 90px);
  max-width: 15em;
}
.rf-static-cards { background: #ffffff; padding: clamp(56px, 9vh, 120px) 0; }
.rf-static-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(22px, 3vw, 40px);
}
.rf-card--static { position: static; width: 100%; transform: none; }
.rf-card--static .rf-card__inner { opacity: 1 !important; transform: none !important; animation: none !important; }
@media (max-width: 767px) {
  .rf-static-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .rf-card__inner, .rf-close__stmt {
    opacity: 1 !important; transform: none !important; animation: none !important;
  }
  .rf-poster img { transition: none; }
}
`;
