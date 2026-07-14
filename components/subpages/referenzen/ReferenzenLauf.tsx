"use client";

/* Bewusst rohe <img>: das Frame-0-Poster braucht fetchpriority=high fuers LCP und
   der Canvas uebernimmt sofort; die Karten-Screenshots sind lokale, lazy geladene
   Assets fester Groesse — next/image bringt hier keinen Nutzen, nur Komplexitaet. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

/**
 * ReferenzenLauf — der scroll-gescrubte "Hasen-Lauf".
 *
 * Eine lange Scroll-Strecke (rf-track 1150vh) mit einer sticky 100dvh-Buehne,
 * auf der ein <canvas> eine 125-Frame-WebP-Sequenz cover-fit zeichnet. Der
 * Scroll-Fortschritt (0..1) wird im rAF-Loop gedaempft (pS += (p - pS) * 0.14)
 * und treibt Frame UND Karten -> ein gemeinsamer Raum mit EINER Traegheit,
 * fluessig wie ein Computerspiel. Frame 0 liegt zusaetzlich als
 * fetchpriority=high-<img> hinter dem Canvas (sofortiges LCP), bis der Canvas
 * uebernimmt. Frames werden in Wellen geladen (jeder 8., dann jeder 4., dann
 * alle) — Grob-Scrub ist sofort moeglich; noch nicht geladene Frames zeichnen
 * den naechstgelegenen geladenen.
 *
 * Die sieben Projekt-Karten sind echtes SSR-HTML und leben AUF der Sticky-
 * Buehne (gleiche Ebene wie der Canvas, z-index darueber): sie entstehen
 * winzig links/rechts neben dem Hasen, wachsen mit dem gedaempften Progress
 * in den scharfen Lese-Moment und ziehen dann gross an der Kamera vorbei.
 * Pro Karte ein Progress-Fenster [t0,t1]; Kurven werden per JS direkt als
 * style gesetzt (KEIN animation-timeline: view() — Buehnen-fixe Elemente
 * haben kein eigenes Scroll-Fenster). Kein Von-unten-Einscrollen mehr.
 * Optik zitiert rr-card-layer (DESIGN.md §10): Off-White-Flaeche, gestapelte
 * Schatten, roter Innen-Balken unten, eckig.
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
  side: "left" | "right"; // Seiten-Slot neben dem Hasen
  cx: number; // Basis-X in % der Buehne (links ~32, rechts ~68, leicht variiert)
  cy: number; // Basis-Y in % (~50, leicht variiert)
  t0: number; // Progress-Fenster im Track (Tunnel-Bereich ~0.42-0.98)
  t1: number;
  exitX: number; // Exit-Vektor (vw): an der Kamera vorbei Richtung Rand/Ecke
  exitY: number; // (vh)
};

const KONTAKT = "/relaunch-preview/kontakt";

// Reihenfolge/Daten laut Spec. K2 bewusst als VORLETZTE Position (Position 6).
// Fenster (Thomas-Runde 3): 7 Karten gestaffelt im Tunnel-Bereich, t0 von
// 0.42 bis 0.815 (Schritt ~0.065, leicht unregelmaessig), Fensterlaenge je
// 0.16 -> Overlap benachbarter Karten gewollt, letzte endet bei 0.975.
// Exit-Vektoren bewusst UNREGELMAESSIG (links oben / links / rechts /
// rechts oben). Basis-Slots nahe Bildmitte neben dem Hasen, leicht variiert.
const CARDS: Card[] = [
  { slug: "thermewarten", href: "https://thermewarten.at", name: "Thermewarten", cat: "Thermenwartung Wien", side: "left", cx: 31, cy: 48, t0: 0.42, t1: 0.58, exitX: -130, exitY: -45 },
  { slug: "lashesbydanesh", href: "https://lashesbydanesh.at", name: "LashesbyDanesh", cat: "Beauty-Studio", side: "right", cx: 69, cy: 52, t0: 0.49, t1: 0.65, exitX: 135, exitY: -12 },
  { slug: "la-morra", href: "https://pizza-4.vercel.app", name: "Ristorante La Morra", cat: "Gastronomie", side: "left", cx: 33, cy: 50, t0: 0.55, t1: 0.71, exitX: -140, exitY: -8 },
  { slug: "almtal-invest", href: "https://almtal-invest.vercel.app", name: "Almtal Invest", cat: "Immobilien-Investment", side: "right", cx: 67, cy: 47, t0: 0.62, t1: 0.78, exitX: 125, exitY: -50 },
  { slug: "rero-heizsysteme", href: "https://heating-systems.at", name: "ReRo Heizsysteme", cat: "Heizungstechnik", side: "left", cx: 30, cy: 53, t0: 0.68, t1: 0.84, exitX: -120, exitY: -28 },
  { slug: "k2-dach-bau", href: "https://k2-dream-builder.vercel.app", name: "K2 Dach & Bau", cat: "Dach & Bau", side: "right", cx: 68, cy: 49, t0: 0.745, t1: 0.905, exitX: 140, exitY: -38 },
  { slug: "global-insights", href: "https://ruderes-insights.at", name: "Global Insights", cat: "Beratung", side: "left", cx: 32, cy: 51, t0: 0.815, t1: 0.975, exitX: -128, exitY: -18 },
];

const FRAME_COUNT = 125;
const LAST = FRAME_COUNT - 1;

// Native Frame-Groesse der Desktop-Quelle. Die neuen AI-upgescalten Frames
// kommen in 1920x1080; die Zeichenlogik liest ohnehin die echte Bitmap-
// Groesse, die Konstanten dienen nur den Poster-width/height-Attributen.
const FRAME_W = 1920;
const FRAME_H = 1080;

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

// Stueckweise lineare Kurve: stops = [[p, wert], ...], p aufsteigend.
const pl = (p: number, stops: [number, number][]): number => {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i][0]) {
      const [p0, v0] = stops[i - 1];
      const [p1, v1] = stops[i];
      return v0 + ((p - p0) / (p1 - p0)) * (v1 - v0);
    }
  }
  return stops[stops.length - 1][1];
};

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
  const posterRef = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Scrub-/Frame-/Karten-Engine. Laeuft nur ohne reduced-motion.
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
    let pS = 0; // gedaempfter Progress (treibt Frame UND Karten)
    let hidPoster = false;

    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const url = (i: number) => `/relaunch/referenzen/frames/${dir}/f-${String(i).padStart(3, "0")}.webp`;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // Groessenaenderung resettet den 2D-Kontext-State -> Smoothing hier
      // (nach JEDEM Resize) neu setzen, nicht nur einmal beim Mount.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
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

    // Einfacher cover-fit ueber den ganzen Canvas (Vollbild). Die Schaerfe
    // kommt aus den AI-upgescalten 1920er-Frames + imageSmoothingQuality
    // "high" — kein Cap/Blur-Backdrop/Feder-Kruecke mehr (Thomas-Runde 3).
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
      if (!hidPoster && posterRef.current) {
        posterRef.current.style.opacity = "0";
        hidPoster = true;
      }
    };

    // Karten-Fly-Through auf der Buehne, getrieben vom gedaempften Progress.
    // Lokales p' = clamp((pS - t0)/(t1 - t0)) pro Karte. Kurven (stueckweise
    // linear): winzig neben dem Hasen entstehen -> Lese-Moment (~0.55-0.75,
    // scale 0.9-1.0, scharf) -> gross an der Kamera vorbei (Exit-Vektor).
    const updateCards = (p: number) => {
      for (let i = 0; i < CARDS.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const c = CARDS[i];
        const lp = clamp01((p - c.t0) / (c.t1 - c.t0));
        if (lp <= 0 || lp >= 1) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.pointerEvents = "none";
          }
          continue;
        }
        const drift = (c.side === "left" ? -1 : 1) * (isMobile ? 3 : 4); // vw, leicht nach aussen
        const scale = pl(lp, [[0, 0.06], [0.55, 0.9], [0.75, 1.0], [1, 2.4]]);
        const opacity = pl(lp, [[0, 0], [0.12, 1], [0.85, 1], [1, 0]]);
        const blur = pl(lp, [[0, 6], [0.45, 0], [0.75, 0], [1, 6]]);
        const tx = pl(lp, [[0, 0], [0.55, drift * 0.6], [0.75, drift], [1, c.exitX]]);
        const ty = pl(lp, [[0, 2], [0.75, 0], [1, c.exitY]]);
        el.style.visibility = "visible";
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate(-50%, -50%) translate3d(${tx.toFixed(2)}vw, ${ty.toFixed(2)}vh, 0) scale(${scale.toFixed(4)})`;
        el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "";
        // Klickbar nur im grossen, scharfen Lese-Fenster.
        el.style.pointerEvents = lp > 0.3 && lp < 0.85 ? "auto" : "none";
      }
    };

    // Mobile: die Seiten-Slots (32%/68%) wuerden die fast bildbreite Karte
    // aus der Buehne schieben -> Basis mittig, Seite bleibt im Drift/Exit.
    if (isMobile) {
      for (const el of cardRefs.current) {
        if (el) el.style.left = "50%";
      }
    }

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

      // Daempfung auf dem Progress selbst: Frame und Karten teilen sich
      // exakt dieselbe Traegheit -> wirkt wie EIN Raum.
      pS += (p - pS) * 0.14;
      if (Math.abs(p - pS) < 0.0002) pS = p;

      const frame = Math.round(mapProgressToFrame(pS));
      if (frame !== lastDrawn || needsRedraw) {
        draw(frame);
        lastDrawn = frame;
        needsRedraw = false;
      }

      updateCards(pS);

      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - clamp01(pS / 0.06));
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
            <img src="/relaunch/referenzen/frames/d/f-000.webp" alt="Roter Hase, der den Besucher ansieht" width={FRAME_W} height={FRAME_H} />
          </picture>
          <div className="rf-hero-text rf-static-herotext">
            <p className="rf-kicker">(Referenzen)</p>
            <h1 id="rf-h1" className="rf-h1">{copy.h1}</h1>
          </div>
        </section>

        <section className="rf-static-cards" aria-label="Projekte">
          <div className="rr-wrap rr-narrow rf-static-grid">
            {CARDS.map((c) => (
              <div key={c.slug} className="rf-scard rf-card--static">
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
              ref={posterRef}
              src="/relaunch/referenzen/frames/d/f-000.webp"
              alt="Roter Hase, der den Besucher ansieht"
              width={FRAME_W}
              height={FRAME_H}
              fetchPriority="high"
            />
          </picture>

          <canvas ref={canvasRef} className="rf-canvas" aria-hidden="true" />

          <div className="rf-hero-text" ref={heroRef}>
            <p className="rf-kicker">(Referenzen)</p>
            <h1 className="rf-h1">{copy.h1}</h1>
          </div>

          {/* Karten: echtes SSR-HTML AUF der Buehne (ueber dem Canvas).
              Position/Groesse/Unschaerfe setzt der rAF-Loop aus dem
              gedaempften Progress; ohne JS bleiben sie unsichtbar, die
              Links stehen trotzdem im server-gerenderten DOM (SEO). */}
          <div className="rf-scards" aria-label="Projekte">
            {CARDS.map((c, i) => (
              <div
                key={c.slug}
                className="rf-scard"
                data-side={c.side}
                style={{ left: `${c.cx}%`, top: `${c.cy}%` }}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <CardLink c={c} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ClosingSection copy={copy} />
    </div>
  );
}

const RF_CSS = `
.rf-shell { position: relative; overflow-x: clip; background: #ffffff; }

/* ============ Scroll-Track + sticky Buehne ============ */
/* 1150vh (Thomas-Runde 3): mehr Scrollweg pro Frame -> ruhigerer Lauf. */
.rf-track { position: relative; height: 1150vh; }
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

/* ============ Karten AUF der Buehne (JS-Fly-Through) ============ */
.rf-scards { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
.rf-scard {
  position: absolute;
  width: clamp(300px, 31vw, 400px);
  transform: translate(-50%, -50%);
  /* Ohne JS unsichtbar (Links bleiben im SSR-DOM); der rAF-Loop schaltet
     sichtbar und setzt transform/opacity/filter pro Tick. */
  visibility: hidden;
  pointer-events: none;
  will-change: transform, opacity, filter;
}

/* ---- Karten-Optik: zitiert rr-card-layer (DESIGN.md §10 / styleguide.css)
   — Off-White-Flaeche (--rr-surface), gestapelte Schatten (--rr-shadow-layer),
   roter Innen-Balken unten, eckig, DM-Sans-Eyebrow in Rot. Eigene rf-Klassen,
   styleguide.css bleibt unangetastet. ---- */
.rf-card__inner {
  display: block; pointer-events: inherit;
  background: var(--rr-surface);
  color: var(--rr-ink);
  text-decoration: none;
  border-radius: 0;
  box-shadow: var(--rr-shadow-layer, rgba(28,40,55,.26) 0 2px 4px, rgba(28,40,55,.18) 0 7px 13px -3px), var(--rr-red) 0 -3px 0 inset;
  transition: box-shadow .4s var(--rr-ease);
}
.rf-card__inner:hover {
  box-shadow: 0 18px 44px rgba(28,40,55,.28), var(--rr-red) 0 -3px 0 inset;
}
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
  background: var(--rr-surface); color: var(--rr-ink);
  transition: background .3s var(--rr-ease), color .3s var(--rr-ease);
}
.rf-card__inner:hover .rf-card__arrow { background: var(--rr-red); color: #fff; }

.rf-card__meta {
  display: flex; flex-direction: column; gap: 8px;
  padding: 18px 20px 21px; /* etwas Luft ueber dem roten Innen-Balken */
}
.rf-card__cat {
  font-family: var(--rr-font-display); font-weight: 700; font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--rr-red);
}
.rf-card__name {
  font-family: var(--rr-font-display); font-weight: 700;
  font-size: clamp(19px, 1.4vw, 21px); line-height: 1.15;
  letter-spacing: -0.01em; color: var(--rr-ink);
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
  .rf-scard { width: min(420px, 86vw); }
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
.rf-card--static {
  position: static; width: 100%; transform: none;
  visibility: visible; pointer-events: auto; will-change: auto;
}
.rf-card--static .rf-card__inner {
  opacity: 1 !important; transform: none !important; animation: none !important;
  pointer-events: auto;
}
@media (max-width: 767px) {
  .rf-static-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .rf-card__inner, .rf-close__stmt {
    opacity: 1 !important; transform: none !important; animation: none !important;
    filter: none !important;
  }
  .rf-poster img { transition: none; }
}
`;
