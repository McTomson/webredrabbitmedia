"use client";

/* Karten-Screenshots sind lokale Assets fester Groesse und werden vom rAF-Loop
   in 3D bewegt (next/image bringt hier keinen Nutzen, nur Layout-Komplexitaet). */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * TippsTunnel — 3D-Karten-Tunnel fuer die Tipps-Uebersicht (Vorbild:
 * ashleybrookecs.com/work). Die Blogartikel-Karten liegen mit zufaelligen
 * X/Y-Positionen im Raum und fliegen beim Scrollen aus der Tiefe (z -3000)
 * an der Kamera vorbei (z +700). Timeline 1:1 aus dem Original extrahiert
 * (docs/specs/TIPPS_TUNNEL_SPEC.md): Stagger 0.5, zDuration 1.75, fadeIn 1
 * (blur 20->0), fadeOut 0.6 ab 67,5 % der z-Strecke, erstes Item sofort
 * sichtbar. Umsetzung OHNE GSAP: eigener rAF-Loop, Scroll -> Timeline-Mapping,
 * Lerp auf dem Fortschritt (Scrub-Gefuehl). Gescrollt wird NATIV; die Buehne
 * ist sticky (kein Scroll-Hijacking -> Touch funktioniert).
 *
 * SSR: alle Karten stehen als normale Links im server-gerenderten DOM (SEO/
 * LLM), per CSS zunaechst visibility:hidden; der Loop schaltet sie sichtbar.
 * reduced-motion: statisches, lesbares Karten-Grid.
 */

export type TunnelPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: number;
  featuredImage: string;
  excerpt?: string;
  tags?: string[];
};

// --- Timeline-Konstanten ---
// Basis: Original-Extraktion (TIPPS_TUNNEL_SPEC.md), nachjustiert am
// vermessenen Referenz-VIDEO (scratchpad/ashley-frames f_004..f_030, 16.07.),
// an dem Thomas abnimmt:
// - Dichte: 1 scharfe Karte + max. 1 blurry im An-/Abflug -> STAGGER 0.85
//   (Spec-0.5 ergab 3 gleichzeitig deutlich sichtbare Karten).
// - Abflug waechst blurry auf ~50 % Viewportbreite -> Z_END 1200 (statt 700),
//   fadeOut spaeter (ab T-start 1.4) und schneller (0.35), endet exakt am
//   Ende der z-Reise.
// - Blur haengt an der TIEFE (z), nicht an der Fade-Zeit: Ankunft blurry,
//   Fokus-Fenster scharf (Kartenbreite ~30-33 %), Abflug wieder blurry.
const STAGGER = 0.85;
const Z_DURATION = 1.75;
const Z_END = 1200;
const Z_START = -3000;
const Z_START_FIRST = -2000;
const FADE_IN = 0.6;
const FADE_OUT = 0.35;
const FADE_OUT_AT = 1.4;

// HARTES Schaerfe-Fenster in der Tiefe (perspective 250vw): blur exakt 0 im
// breiten mittleren z-Bereich [-600, +150] (die Karte, die man gerade
// betrachtet, ist ABSOLUT scharf); Rampen nur davor (Ankunft, klein) und
// dahinter (Abflug, gross). Werte < 0.3px werden im Loop auf 0 gesnappt.
const blurOf = (z: number): number =>
  z < -600 ? Math.min(20, ((-600 - z) / 1800) * 20) : z <= 150 ? 0 : Math.min(16, ((z - 150) / 1050) * 16);

// Der Tunnel-Root ueberlappt den KOMPLETTEN Hero (scene-main 160vh, negativer
// Margin): die Buehne ist ab scrollY=0 gepinnt -> Karten haben immer feste
// Viewport-Positionen (nichts schiebt sich von unten ins Bild). Waehrend der
// Scatter-Phase blendet der Hero seine Deckflaechen aus (demo.engine.jstext)
// und die erste Karte waechst sichtbar HINTER den fliegenden Buchstaben.
const HERO_OVERLAP_VH = 160;
// Timeline-Totzone: t=0 des Tunnels liegt am Scatter-Beginn des Heros.
// Hero-Pin = 60vh Scroll, Scatter ab Pm=0.52 -> Lead = 0.52*0.6 = 0.312
// Viewport-Hoehen.
const LEAD_VH = 0.312;

// Deterministischer Zufall (mulberry32) — seeded per Index, damit SSR und CSR
// exakt dieselben Positionen erzeugen (kein Hydration-Sprung, kein Math.random
// pro Render).
function seeded(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Rotierende Selbst-Tipp-Stichwoerter des Suchfelds (echte Umlaute).
const TYPE_WORDS = ["SEO", "Was kostet eine Website", "KI-Sichtbarkeit", "Wartung"];

type Laid = {
  post: TunnelPost;
  x: number; // % der Buehne
  y: number; // % der Buehne
  rot: number; // seeded -3..3deg
  startTime: number;
  zStart: number;
  isFirst: boolean;
  isLast: boolean;
};

function layout(posts: TunnelPost[]): Laid[] {
  return posts.map((post, i) => {
    const rx = seeded(i * 2 + 1);
    const ry = seeded(i * 7 + 3);
    const rr = seeded(i * 13 + 5);
    // Das erste Item sitzt bewusst fast mittig (statt seeded): es waechst
    // waehrend der Scatter-Phase des Heros hinter den fliegenden Buchstaben
    // aus der Tiefe. Alle weiteren Items verteilen sich in die BREITE
    // (Referenz-Video): abwechselnd linke Haelfte [0.18..0.42] und rechte
    // Haelfte [0.58..0.82], y aus [0.25..0.70]. Kippung minimal (+-1.5deg).
    return {
      post,
      x: i === 0 ? 50 : (i % 2 === 1 ? 0.18 + rx * 0.24 : 0.58 + rx * 0.24) * 100,
      y: i === 0 ? 34 : (0.25 + ry * 0.45) * 100,
      rot: i === 0 ? 0 : rr * 3 - 1.5,
      startTime: i * STAGGER,
      zStart: i === 0 ? Z_START_FIRST : Z_START,
      isFirst: i === 0,
      isLast: i === posts.length - 1,
    };
  });
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

// Tag-Zeile im Label-Streifen (Referenz f_014/f_020): Kategorie + max. 1 Tag,
// winzig, rot, uppercase, Punkt-Trenner.
const tagsLine = (p: TunnelPost): string =>
  [p.category, ...(p.tags ?? []).slice(0, 1)].join(" · ");

function Card({ l }: { l: Laid }) {
  const p = l.post;
  return (
    <a
      className="rrtn-card"
      href={`/relaunch-preview/tipps/${p.slug}`}
      style={{ left: `${l.x}%`, top: `${l.y}%` }}
      data-slug={p.slug}
    >
      <img
        className="rrtn-img"
        src={p.featuredImage}
        alt={p.title}
        loading="lazy"
        decoding="async"
        onError={(e) => e.currentTarget.closest("a")?.classList.add("rrtn-noimg")}
      />
      <span className="rrtn-info">
        <span className="rrtn-box">
          <span className="rrtn-boxrow">
            <span className="rrtn-title">{p.title}</span>
            <span className="rrtn-arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </span>
          <span className="rrtn-cat">{tagsLine(p)}</span>
        </span>
      </span>
    </a>
  );
}

export default function TippsTunnel({ posts }: { posts: TunnelPost[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const layoutRef = useRef<Laid[]>([]);
  const measureRef = useRef<(() => void) | null>(null);
  const didInit = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [activeCat, setActiveCat] = useState("Alle");
  const [query, setQuery] = useState("");

  const cats = useMemo(() => {
    const seen: string[] = [];
    for (const p of posts) if (!seen.includes(p.category)) seen.push(p.category);
    return seen;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = posts.filter((p) => {
      if (activeCat !== "Alle" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
    // Alle Treffer (datumssortiert, neueste zuerst). Kein Cap: die gleichzeitig
    // sichtbare Dichte (1 scharf + max. 1 blurry) regelt allein die Timeline
    // (STAGGER/Fades), nicht die Gesamtzahl. Neue Artikel kommen vorne dazu.
    return matched;
  }, [posts, activeCat, query]);

  const laid = useMemo(() => layout(filtered), [filtered]);

  // Wurzelhoehe skaliert mit der Kartenzahl (Spec-Startwert n*60vh).
  const rootHeight = Math.max(120, laid.length * 60);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // layoutRef aktuell halten + Ref-Array auf die neue Laenge trimmen; die
  // Root-Hoehe haengt an der Kartenzahl -> Layout-Cache des Loops neu messen
  // (nach dem React-Commit, daher rAF).
  useEffect(() => {
    layoutRef.current = laid;
    cardRefs.current.length = laid.length;
    const raf = requestAnimationFrame(() => measureRef.current?.());
    return () => cancelAnimationFrame(raf);
  }, [laid]);

  // Bei Filter-/Suchaenderung sanft an den Tunnel-Anfang scrollen (nicht beim
  // ersten Mount — da steht der Nutzer noch im Hero).
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    // Absolute Dokument-Position der Wurzel + Hero-Pin-Strecke (0.6vh): der
    // Root ueberlappt den Hero, der sichtbare Tunnel-Anfang liegt am Ende der
    // Hero-Pin-Strecke. Erst nach dem Re-Layout messen.
    requestAnimationFrame(() => {
      const top = root.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.6;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, [activeCat, query]);

  // Selbst-tippender, rotierender Platzhalter im Suchfeld.
  useEffect(() => {
    if (!mounted || reduced) return;
    const el = searchRef.current;
    if (!el) return;
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = TYPE_WORDS[wi];
      if (!deleting) {
        ci++;
        el.setAttribute("placeholder", word.slice(0, ci) + "│");
        if (ci >= word.length) {
          deleting = true;
          timer = setTimeout(tick, 2500);
          return;
        }
        timer = setTimeout(tick, 90);
      } else {
        ci--;
        el.setAttribute("placeholder", word.slice(0, ci) + "│");
        if (ci <= 0) {
          deleting = false;
          wi = (wi + 1) % TYPE_WORDS.length;
          timer = setTimeout(tick, 380);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [mounted, reduced]);

  // Der Tunnel-Loop: Scroll -> Timeline -> 3D-Transform je Karte, plus
  // Maus-Parallaxe auf der Buehne. Laeuft nur ohne reduced-motion.
  useEffect(() => {
    if (!mounted || reduced) return;
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;

    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

    let raf = 0;
    let pS = 0; // gedaempfter Scroll-Fortschritt
    let rx = 0;
    let ry = 0; // gedaempfte Parallaxe-Rotation
    let tX = 0;
    let tY = 0; // Ziel-Rotation aus der Maus

    const onMouse = (e: MouseEvent) => {
      tY = (e.clientX / window.innerWidth - 0.5) * 10;
      tX = -(e.clientY / window.innerHeight - 0.5) * 10;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Layout-Groessen EINMAL messen (kein getBoundingClientRect im Frame-Loop);
    // neu messen bei Resize und wenn sich die Kartenmenge (Filter) aendert.
    let rootTopAbs = 0;
    let rootH = 0;
    let vh = window.innerHeight;
    const measure = () => {
      vh = window.innerHeight;
      const r = root.getBoundingClientRect();
      rootTopAbs = r.top + window.scrollY;
      rootH = r.height;
    };
    measure();
    measureRef.current = measure;
    window.addEventListener("resize", measure);

    // Style-Caches pro Karte: filter/opacity/visibility nur schreiben, wenn
    // sich der Wert wirklich aendert (staendige filter-Updates erzwingen
    // sonst Repaints -> ruckelt).
    const lastBlur: number[] = [];
    const lastOp: string[] = [];
    const lastVis: boolean[] = [];
    const lastTf: string[] = [];

    const applyCard = (l: Laid, el: HTMLAnchorElement, T: number, i: number) => {
      // z
      let z: number;
      if (T <= l.startTime) z = l.zStart;
      else if (T >= l.startTime + Z_DURATION) z = Z_END;
      else z = l.zStart + ((T - l.startTime) / Z_DURATION) * (Z_END - l.zStart);

      // opacity zeitgesteuert (fadeIn/fadeOut), blur TIEFEN-gesteuert (blurOf).
      let op: number;
      const foStart = l.startTime + FADE_OUT_AT;
      const foEnd = foStart + FADE_OUT;
      if (!l.isFirst && T < l.startTime) {
        op = 0;
      } else if (!l.isFirst && T < l.startTime + FADE_IN) {
        const u = (T - l.startTime) / FADE_IN;
        op = 1 - (1 - u) * (1 - u); // power2.out
      } else if (T < foStart) {
        op = 1;
      } else if (!l.isLast && T < foEnd) {
        const u = (T - foStart) / FADE_OUT;
        op = 1 - u * u; // power2.in
      } else if (!l.isLast) {
        op = 0;
      } else {
        op = 1;
      }

      // Blur in 0.5px-Stufen quantisieren + hart auf 0 snappen (<0.3px):
      // sonst bleibt durch das Lerp permanent ein Rest-Blur stehen und die
      // Fokus-Karte wirkt nie ganz scharf.
      let blur = blurOf(z);
      blur = blur < 0.3 ? 0 : Math.round(blur * 2) / 2;

      const tf = `translate3d(-50%, -50%, ${z.toFixed(1)}px) rotate(${l.rot}deg)`;
      if (lastTf[i] !== tf) {
        lastTf[i] = tf;
        el.style.transform = tf;
      }
      const opStr = op.toFixed(3);
      if (lastOp[i] !== opStr) {
        lastOp[i] = opStr;
        el.style.opacity = opStr;
        el.style.pointerEvents = op > 0.02 ? "auto" : "none";
      }
      if (lastBlur[i] !== blur) {
        lastBlur[i] = blur;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "";
      }
      const vis = op > 0.001;
      if (lastVis[i] !== vis) {
        lastVis[i] = vis;
        el.style.visibility = vis ? "visible" : "hidden";
      }
    };

    const loop = () => {
      // Lead-Totzone: der Root beginnt (per -160vh Margin) am Seitenanfang,
      // die Timeline aber erst am Scatter-Beginn des Heros (LEAD_VH).
      const lead = LEAD_VH * vh;
      const scrollable = rootH - vh - lead;
      const p = scrollable > 0 ? clamp01((window.scrollY - rootTopAbs - lead) / scrollable) : 0;
      pS += (p - pS) * 0.1;
      if (Math.abs(p - pS) < 0.0002) pS = p;

      const lay = layoutRef.current;
      const n = lay.length;
      const totalDur = n > 0 ? (n - 1) * STAGGER + Z_DURATION : Z_DURATION;
      const T = pS * totalDur;

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (el) applyCard(lay[i], el, T, i);
      }

      // Maus-Parallaxe weich nachfuehren.
      rx += (tX - rx) * 0.08;
      ry += (tY - ry) * 0.08;
      scene.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", measure);
      measureRef.current = null;
    };
  }, [mounted, reduced]);

  // ---- reduced-motion / statischer Fallback: lesbares Grid ----
  if (mounted && reduced) {
    return (
      <div className="rrtn-shell rrtn-static">
        <style>{CSS}</style>
        <div className="rrtn-static-grid">
          {laid.map((l) => (
            <Card key={l.post.slug} l={l} />
          ))}
        </div>
        {laid.length === 0 && (
          <p className="rrtn-empty">
            Nichts gefunden. <Link href="/relaunch-preview/kontakt">Frag uns direkt.</Link>
          </p>
        )}
        <FilterBar
          cats={cats}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
        />
      </div>
    );
  }

  return (
    <div className="rrtn-shell">
      <style>{CSS}</style>

      <div
        className="rrtn-root"
        ref={rootRef}
        style={{ height: `calc(${rootHeight}vh + ${HERO_OVERLAP_VH}vh)` }}
      >
        <div className="rrtn-stage" ref={stageRef}>
          <div className="rrtn-scene" ref={sceneRef}>
            {laid.map((l, i) => (
              <a
                key={l.post.slug}
                className="rrtn-card"
                href={`/relaunch-preview/tipps/${l.post.slug}`}
                style={{ left: `${l.x}%`, top: `${l.y}%` }}
                data-slug={l.post.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <img
                  className="rrtn-img"
                  src={l.post.featuredImage}
                  alt={l.post.title}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => e.currentTarget.closest("a")?.classList.add("rrtn-noimg")}
                />
                <span className="rrtn-info">
                  <span className="rrtn-box">
                    <span className="rrtn-boxrow">
                      <span className="rrtn-title">{l.post.title}</span>
                      <span className="rrtn-arrow" aria-hidden="true">
                        <ArrowIcon />
                      </span>
                    </span>
                    <span className="rrtn-cat">{tagsLine(l.post)}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          {laid.length === 0 && (
            <p className="rrtn-empty">
              Nichts gefunden. <Link href="/relaunch-preview/kontakt">Frag uns direkt.</Link>
            </p>
          )}
        </div>
      </div>

      <FilterBar
        cats={cats}
        activeCat={activeCat}
        setActiveCat={setActiveCat}
        query={query}
        setQuery={setQuery}
        searchRef={searchRef}
      />
    </div>
  );
}

function FilterBar({
  cats,
  activeCat,
  setActiveCat,
  query,
  setQuery,
  searchRef,
}: {
  cats: string[];
  activeCat: string;
  setActiveCat: (c: string) => void;
  query: string;
  setQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="rrtn-bar" role="search">
      <div className="rrtn-bar-scroll">
        <button
          type="button"
          className={`rrtn-chip${activeCat === "Alle" ? " is-active" : ""}`}
          onClick={() => setActiveCat("Alle")}
          aria-pressed={activeCat === "Alle"}
        >
          Alle
        </button>
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`rrtn-chip${activeCat === c ? " is-active" : ""}`}
            onClick={() => setActiveCat(c)}
            aria-pressed={activeCat === c}
          >
            {c}
          </button>
        ))}
      </div>
      <input
        ref={searchRef}
        className="rrtn-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Suchen"
        aria-label="Tipps durchsuchen"
      />
    </div>
  );
}

const CSS = `
.rrtn-shell{ position:relative; background:#ffffff; overflow-x:clip; }

/* ===== Scroll-Wurzel + sticky 3D-Buehne ===== */
/* Der Root zieht sich per negativem Margin unter den GESAMTEN Hero (160vh):
   die Buehne ist ab scrollY=0 gepinnt (feste Karten-Positionen, nichts kommt
   von unten) und liegt im Stacking UNTER dem Hero-Sticky (z-index 3), dessen
   Flaechen die Engine beim Buchstaben-Scatter transparent faded. */
.rrtn-root{ position:relative; margin-top:-160vh; }
.rrtn-stage{
  position:sticky; top:0;
  height:100vh; height:100dvh;
  overflow:hidden; background:#ffffff;
  perspective:250vw;
  z-index:1;
}
.rrtn-scene{
  position:absolute; inset:0;
  transform-style:preserve-3d;
  transform-origin:50% 10%;
  will-change:transform;
  /* WICHTIG: die Scene-Ebene liegt bei z=0 und faengt sonst im 3D-Hit-Test
     alle Klicks auf Karten mit negativem z ab (Karte hinter der Ebene =
     nicht klickbar). Karten schalten ihre pointer-events selbst (Loop). */
  pointer-events:none;
}

/* ===== Karte (Anatomie 1:1 Original .media > * { width:100%; height:auto }):
   das BILD bestimmt die Kartenhoehe — natuerliches Seitenverhaeltnis, KEIN
   object-fit-Crop (unsere featuredImages enthalten Text, der nicht
   abgeschnitten werden darf). Der weisse Info-Kasten schwebt unten IM Bild
   mit exakt GLEICHEM Abstand links/rechts/unten (4 % der Kartenbreite,
   Referenz-Zoom). Kein Rahmen, Schatten 1px 1px 30px rgba(0,0,0,.08). ===== */
.rrtn-card{
  position:absolute;
  width:33%;
  transform:translate3d(-50%,-50%,0);
  /* Ohne JS unsichtbar (Links bleiben im SSR-DOM fuer SEO); der rAF-Loop
     schaltet sichtbar und setzt transform/opacity/filter pro Frame. */
  visibility:hidden;
  opacity:0;
  pointer-events:none;
  text-decoration:none;
  background:#23262e; /* Ink-Platzhalter, falls ein Bild fehlt */
  box-shadow:1px 1px 30px rgba(0,0,0,.08);
  will-change:transform,opacity,filter;
}
/* Nur fuer kaputte/fehlende Bilder (per onError-Handler): ohne Bild wuerde
   die Karte sonst auf 0 Hoehe kollabieren. */
.rrtn-card.rrtn-noimg{ aspect-ratio:10 / 7; }
.rrtn-card.rrtn-noimg .rrtn-img{ display:none; }
.rrtn-img{
  display:block; width:100%; height:auto;
}
.rrtn-info{
  position:absolute; inset:0;
  display:flex; align-items:flex-end;
  padding:4%;
}
.rrtn-box{
  display:flex; flex-direction:column; gap:7px;
  width:100%;
  background:#ffffff;
  padding:.85em 1em .95em;
}
.rrtn-boxrow{
  display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
}
.rrtn-title{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(18px,1.55vw,22px); line-height:1.12; letter-spacing:-.01em;
  color:#23262e; min-width:0;
}
.rrtn-cat{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
  color:#f12032;
}
.rrtn-arrow{
  flex:none; display:grid; place-items:center;
  width:20px; height:20px; margin-top:2px; color:#23262e;
}

/* ===== leere Treffermenge ===== */
.rrtn-empty{
  position:absolute; left:0; right:0; top:34%;
  text-align:center; padding:0 6vw; z-index:2;
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.4rem,3vw,2.1rem); color:#23262e;
}
.rrtn-empty a{ color:#f12032; text-underline-offset:4px; }

/* ===== Filter-/Suchleiste: fix unten rechts, Navy, eckig ===== */
.rrtn-bar{
  position:fixed; right:0; bottom:0; z-index:40;
  display:flex; align-items:stretch; gap:0;
  /* Breit genug, dass auf Desktop alle Kategorien inkl. "KI & Automatisierung"
     unbeschnitten neben dem Suchfeld stehen; darunter scrollt die Chip-Zeile. */
  max-width:min(96vw,1120px);
  background:#1c2837; color:#f6f5f1;
  border-radius:0;
}
.rrtn-bar-scroll{
  display:flex; align-items:stretch; gap:0;
  overflow-x:auto; scrollbar-width:none;
}
.rrtn-bar-scroll::-webkit-scrollbar{ display:none; }
.rrtn-chip{
  flex:none;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:13px; font-weight:500; letter-spacing:.01em;
  color:rgba(246,245,241,.62);
  background:transparent; border:0; border-radius:0;
  padding:15px 16px; cursor:pointer; white-space:nowrap;
  transition:color .25s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrtn-chip:hover{ color:#f6f5f1; }
.rrtn-chip.is-active{ color:#f6f5f1; font-weight:700; }
.rrtn-search{
  flex:none; width:clamp(150px,18vw,240px);
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:13px; color:#f6f5f1;
  background:transparent; border:0; border-radius:0;
  padding:15px 16px; outline:none;
  border-left:1px solid rgba(246,245,241,.14);
}
.rrtn-search::placeholder{ color:rgba(246,245,241,.55); }
.rrtn-search:focus{ box-shadow:inset 0 -2px 0 #f12032; }
/* clear-Kreuz des type=search neutralisieren (kein heller Kasten) */
.rrtn-search::-webkit-search-cancel-button{ -webkit-appearance:none; appearance:none; }

/* ===== reduced-motion / statisch: lesbares Grid ===== */
.rrtn-static{ padding:6vh 6vw 22vh; }
.rrtn-static-grid{
  max-width:1240px; margin:0 auto;
  display:grid; grid-template-columns:repeat(3,1fr); gap:26px;
}
.rrtn-static .rrtn-card{
  position:static; width:100%;
  transform:none; visibility:visible; opacity:1; pointer-events:auto;
  will-change:auto;
}
.rrtn-static .rrtn-empty{ position:static; margin:8vh 0; }

@media (max-width:900px){
  .rrtn-static-grid{ grid-template-columns:repeat(2,1fr); }
}
/* reduced-motion: kein Hero-Overlap (der Hero ist dann statisch/auto-hoch);
   greift auch VOR der Hydration als CSS-Kill-Switch. */
@media (prefers-reduced-motion:reduce){
  .rrtn-root{ margin-top:0; }
}
@media (max-width:768px){
  .rrtn-card{ width:80%; }
  .rrtn-bar{ left:0; right:0; max-width:100vw; }
  .rrtn-search{ width:44vw; }
  .rrtn-static-grid{ grid-template-columns:1fr; }
}
`;
