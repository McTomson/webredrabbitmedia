"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { buildWordLayout } from "@/lib/relaunch/morph/pieces";
import { clamp01, masterEase } from "@/lib/relaunch/morph/grammar";
import {
  buildStagePlan, sampleTimeline, U_HERO, U_TOTAL,
  type PieceTimeline, type PoolPieceIn, type SceneLayout,
} from "@/lib/relaunch/morph/stage";
import { SCENE_TEXTS } from "@/lib/relaunch/morph/scene-content";
import { RabbitMark } from "./RabbitMark";
import atShapes1 from "@/lib/relaunch/morph/at-shapes-comp1.json";
import atShapes2 from "@/lib/relaunch/morph/at-shapes-comp2.json";
import atShapes3 from "@/lib/relaunch/morph/at-shapes-comp3.json";
import atShapes4 from "@/lib/relaunch/morph/at-shapes-comp4.json";
import atShapes5 from "@/lib/relaunch/morph/at-shapes-comp5.json";

/** alle 5 vermessenen Kompositionen (Index = Szene). */
const COMPS = [atShapes1, atShapes2, atShapes3, atShapes4, atShapes5];

/**
 * Marken-Auftakt (Phasen 1-2) VOR dem Morph: zusaetzliche Scroll-Zeit am Anfang.
 * uScroll laeuft [0, U_INTRO + U_TOTAL]; der Morph-u (= uScroll - U_INTRO, ab 0)
 * treibt unveraendert die bestehende Timeline. So teilen Hasenkopf, Statement und
 * Wortmarke EIN Koordinatensystem -> nahtloser Lockup -> Shatter-Uebergang.
 */
const U_INTRO = 1.6;
const U_SPAN = U_INTRO + U_TOTAL;
/** Hoehe des Hasenkopfs (konstant, ~50% kleiner als frueher). */
const HEAD_VH = 30;
/**
 * Phase-1-Peek: Kopf-Mitte (vh, relativ zur Viewport-Mitte) so tief parken, dass
 * die untere Viewport-Kante GENAU durch die vertikale Mitte des runden Auge-Lochs
 * schneidet. Auge-Mitte liegt bei y=190.8/267 (f=0.715) im RabbitMark-viewBox
 * (Bezier-Analyse des eye-Subpfads), Kopf fuellt den 174/267-Rahmen exakt:
 *   dyC = 50 - HEAD_VH*(f - 0.5) = 50 - 30*0.215 ≈ 43.6vh.
 */
const HEAD_PEEK_DY = 43.6;
/** Lockup-Position der Kopf-Mitte (vh): Kopf oben, klarer Abstand zur Wortmarke. */
const HEAD_LOCK_DY = -20;
/** Lockup-Ruheposition der Wortmarke (vh unter der Mitte): sitzt tiefer als der Kopf
 *  -> klarer Abstand Kopf<->Wortmarke am Lockup. Gleitet danach (u 0->0.22) zur Mitte
 *  und kontrahiert/zerfaellt unveraendert. */
const LOCK_STAGE_VH = 22;
/** Statement-Mitte (vh, relativ zur Viewport-Mitte) am Scroll-Anfang: EXAKT
 *  vertikal zentriert (oben/unten gleicher Abstand). */
const STMT_TOP_DY = 0;
/** Starrer Aufwaerts-Weg des GANZEN Stacks vom Peek in den Lockup (vh). Alle drei
 *  Elemente teilen exakt diesen Shift -> es liest sich wie normales Seiten-Scrollen. */
const STACK_TRAVEL = HEAD_PEEK_DY - HEAD_LOCK_DY; // 63.6vh

/**
 * Durchgehende Morph-Buehne: Wortmarke -> Kontraktion -> Burst mit sichtbarer
 * Teile-Vermehrung -> Vollbild-Zerfall -> 5 Formations-Szenen (vermessene
 * Original-Kompositionen, Seiten-Alternierung) — OHNE leeren Screen, ein
 * Teile-Pool ueber die ganze Fahrt (at-Struktur: EIN Lottie, kein Schnitt).
 */
export default function HomeMorph() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const track = trackRef.current!, stage = stageRef.current!;
    let timelines: PieceTimeline[] = [];
    let sceneLayouts: SceneLayout[] = [];
    let els: HTMLDivElement[] = [];
    let camWraps: HTMLDivElement[] = [];
    let cameras: Array<(u: number) => { k: number; tx: number; ty: number }> = [];
    // Lockup-Wortmarkenhoehe (vh) dynamisch bestimmt, damit der Abstand
    // Kopf<->Wortmarke EXAKT dem Abstand oberer Rand<->Kopf entspricht (A == B) —
    // auf jeder Breite (Wortmarke skaliert breitenabhaengig). Fallback bis gemessen.
    let lockStageVh = LOCK_STAGE_VH;
    let lockMeasured = false;
    let raf = 0;
    let destroyed = false;

    // schwerere Daempfung als Default — at-Fahrt wirkt gedaempfter (Delta-Punkt 8)
    const lenis = new Lenis({ autoRaf: false, lerp: 0.075 });

    function build() {
      const fam = getComputedStyle(probeRef.current!).fontFamily;
      // Wortmarke groesser (Tomson 05.07.): so gross wie moeglich, damit sie im
      // Massstab zu den einfliegenden Szenen-Teilen passt ("alles gleich gross").
      // Obergrenze so, dass "red rabbit" im Lockup unter dem Kopf mit balanciertem
      // Abstand noch VOLL in den Viewport passt (Hoehe ~1.6*F, Kopf bei 30vh).
      const F = Math.min(200, Math.max(72, window.innerWidth * 0.15));
      const layout = buildWordLayout(fam, F, window.devicePixelRatio || 1);
      if (!layout || layout.pieces.length < 10) return false;

      // Pool: 18 Wortmarken-Teile + die extrahierten all-turtles-Original-
      // Teilformen aller 5 Comps (Szene 0..4).
      const kBase = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const pool: PoolPieceIn[] = [];
      const srcOf: number[] = [];
      layout.pieces.forEach((src, idx) => {
        pool.push({ cx: src.cx, cy: src.cy, w: src.w, h: src.h, letter: src.letter, clone: false });
        srcOf.push(idx);
      });
      COMPS.forEach((comp, scene) => {
        comp.pieces.forEach((jp, idx) => {
          const elW = jp.w * Math.abs(jp.sx) * kBase;
          const elH = jp.h * Math.abs(jp.sy) * kBase;
          pool.push({ cx: 0, cy: 0, w: elW, h: elH, letter: -1, clone: true, at: idx, scene });
          srcOf.push(-1);
        });
      });
      // Farbtupfer (Tomson 06.07.): die markante gestreckte Balken-Form (max.
      // Seitenverhaeltnis) ist der Navy-Akzent — und zwar JEDE Instanz genau
      // dieser Form (identischer SVG-Pfad), damit dasselbe Teil ueberall in
      // Dunkelblau wiederkehrt und homogen wirkt. Der Rest bleibt rot.
      const asp = (jp: { w: number; h: number; sx: number; sy: number }) => {
        const W = jp.w * Math.abs(jp.sx), H = jp.h * Math.abs(jp.sy);
        return Math.max(W / H, H / W);
      };
      const navyPathByScene = COMPS.map((comp) => {
        const ref = comp.pieces.reduce(
          (best, jp, idx) => (asp(jp) > asp(comp.pieces[best]) ? idx : best), 0
        );
        return comp.pieces[ref].d;
      });
      const plan = buildStagePlan(pool, { w: window.innerWidth, h: window.innerHeight });
      timelines = plan.timelines;
      sceneLayouts = plan.scenes;
      cameras = plan.cameras;

      // Schaerfe: Element in seiner GROESSTEN Verwendung rendern und Timeline-Scales
      // darauf normieren — CSS-transform darf nur noch verkleinern (Upscale = Matsch).
      timelines.forEach((tl, i) => {
        let m = 0;
        const states = new Set<{ scale: number }>();
        tl.segs.forEach((s) => { states.add(s.a); states.add(s.b); });
        states.forEach((st) => { m = Math.max(m, st.scale); });
        if (m > 1) {
          states.forEach((st) => { st.scale /= m; });
          const p = pool[i];
          p.w *= m; p.h *= m;
        }
      });

      stage.innerHTML = "";
      lockMeasured = false; // pro (Re-)Build neu vermessen (Breite kann sich aendern)
      // Ein Kamera-Wrapper pro Szene: nimmt die at-Teile dieser Szene auf
      // (Zoom/Pan der jeweiligen Szenen-Fahrt); die 18 Wortmarken-Teile haengen
      // direkt in der Stage.
      camWraps = COMPS.map(() => {
        const w = document.createElement("div");
        w.style.cssText = "position:absolute;inset:0;will-change:transform;transform-origin:50% 50%;";
        stage.appendChild(w);
        return w;
      });
      els = pool.map((p, i) => {
        const el = document.createElement("div");
        if (p.at != null && p.scene != null) {
          const jp = COMPS[p.scene].pieces[p.at];
          const navy = jp.d === navyPathByScene[p.scene];
          el.innerHTML = `<svg width="100%" height="100%" viewBox="${-jp.w / 2} ${-jp.h / 2} ${jp.w} ${jp.h}" preserveAspectRatio="none" style="display:block;overflow:visible"><g transform="scale(${jp.sx < 0 ? -1 : 1} ${jp.sy < 0 ? -1 : 1})"><path d="${jp.d}" fill="${navy ? "#1C2837" : "#F12032"}"/></g></svg>`;
        } else {
          el.innerHTML = layout.pieces[srcOf[i]].svg;
        }
        el.style.cssText =
          `position:absolute;left:50%;top:50%;max-width:none;width:${p.w}px;height:${p.h}px;` +
          `margin-left:${-p.w / 2}px;margin-top:${-p.h / 2}px;will-change:transform;opacity:1;`;
        (p.at != null && p.scene != null ? camWraps[p.scene] : stage).appendChild(el);
        return el;
      });

      // Statement-Bloecke auf die Gegenseite der jeweiligen Formation setzen;
      // mobil: Formation zentriert oben, Text unten ueber die volle Breite
      const narrow = window.innerWidth < 900;
      textRefs.current.forEach((el, s) => {
        if (!el || !sceneLayouts[s]) return;
        el.dataset.center = narrow ? "0" : "1";
        if (narrow) {
          el.style.left = "24px";
          el.style.right = "24px";
          el.style.top = "auto";
          el.style.bottom = "7vh";
          el.style.maxWidth = "none";
        } else {
          const side = sceneLayouts[s].textSide;
          el.style.left = side === "left" ? "var(--rr-gutter)" : "auto";
          el.style.right = side === "right" ? "var(--rr-gutter)" : "auto";
          el.style.top = "50%";
          el.style.bottom = "auto";
          el.style.maxWidth = "min(40%, 560px)";
        }
      });
      return true;
    }

    function render() {
      if (!timelines.length) return;
      const r = track.getBoundingClientRect();
      const p = clamp01(-r.top / (r.height - window.innerHeight));
      // QA-Override: window.__uScroll erzwingt den Gesamt-Scroll-u, __morphU den
      // Morph-u (nur wenn gesetzt) -> Lenis-unabhaengige Frame-Pruefung.
      const w = window as unknown as { __morphU?: number; __uScroll?: number };
      const uScroll = typeof w.__uScroll === "number" ? w.__uScroll : p * U_SPAN;
      // u = Morph-Fortschritt (Wortmarke -> Shatter -> Szenen), erst NACH dem Intro.
      const u =
        typeof w.__morphU === "number" ? w.__morphU : Math.max(0, uScroll - U_INTRO);

      for (let i = 0; i < els.length; i++) {
        const st = sampleTimeline(timelines[i], u);
        els[i].style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.rot}deg) scale(${st.scale})`;
        els[i].style.opacity = String(st.o);
        // 700 Teile: unsichtbare aus dem Paint nehmen (kein display:none -> kein
        // Layout-Thrash).
        els[i].style.visibility = st.o <= 0.001 ? "hidden" : "visible";
      }

      // Kamera-Fahrt pro Szene: Zoom/Pan des jeweiligen Szenen-Wrappers.
      // Waehrend des Marken-Auftakts (u=0) sind die Szenen-/Shatter-Teile NICHT
      // Teil des ruhenden "red rabbit"-Lockups -> ausblenden, damit im Intro nur
      // Wortmarke + Kopf + Statement (voll deckend) zu sehen sind. Ab u>0 treibt
      // wieder die Teile-Timeline die Sichtbarkeit (unveraendert).
      const sceneVis = u > 0 ? "1" : "0";
      for (let s = 0; s < camWraps.length; s++) {
        const c = cameras[s](u);
        camWraps[s].style.transform = `translate(${c.tx}px, ${c.ty}px) scale(${c.k})`;
        camWraps[s].style.opacity = sceneVis;
      }

      // ---- Marken-Auftakt: EIN starrer vertikaler STACK, der beim Scrollen nach
      // oben wandert (wie normales Seiten-Scrollen). Reihenfolge oben->unten:
      // [1] Statement  [2] Hasenkopf  [3] "red rabbit"-Wortmarke. ALLE drei bei
      // VOLLER Deckkraft die ganze Zeit — sie BEWEGEN sich nur (kein Fade-In/Out).
      // ip = linearer Intro-Fortschritt (kein Easing -> Seiten-Scroll-Gefuehl).
      const ip = clamp01(uScroll / U_INTRO);
      const introShift = ip * STACK_TRAVEL; // gemeinsamer Aufwaerts-Weg (vh)

      // Einmalig (bei u=0, Wortmarke montiert) die Lockup-Ruhehoehe so bestimmen,
      // dass Abstand Kopf-Unterkante -> Wortmarke-Oberkante (B) == Abstand oberer
      // Rand -> Kopf-Oberkante (A). Herleitung mit Kopf-Oberkante = (50+LOCK-15)vh
      // und Wortmarke-Oberkante = (50 + S + off)vh:  S = 50 + 2*HEAD_LOCK_DY - off.
      // off = Wortmarken-Oberkante relativ zur Stage-Mitte (vh) — translateY-neutral.
      if (!lockMeasured && u === 0) {
        const sr = stage.getBoundingClientRect();
        let wtop = Infinity;
        for (const c of Array.from(stage.children) as HTMLElement[]) {
          if (c.tagName === "DIV" && c.style.inset !== "0px" && c.querySelector("svg")) {
            const r = c.getBoundingClientRect();
            if (r.width > 1 && r.height > 1) wtop = Math.min(wtop, r.top);
          }
        }
        if (isFinite(wtop)) {
          const offVh = ((wtop - sr.top - window.innerHeight / 2) / window.innerHeight) * 100;
          lockStageVh = 50 + 2 * HEAD_LOCK_DY - offVh;
          lockMeasured = true;
        }
      }

      // Wortmarke (Stage): steigt starr mit dem Stack vom unteren Rand herauf und
      // ruht am Lockup (u=0) in der lockStageVh-Position (klarer, gleichmaessiger
      // Abstand unter dem Kopf, A == B). Ab u>0 uebernimmt der Settle-Slide
      // (lockStageVh -> 0) + danach unveraendert Kontraktion/Shatter. Immer voll
      // deckend (kein Fade-In).
      const introStageY = lockStageVh + STACK_TRAVEL - introShift; // ip=0 -> weit unten; ip=1 -> lockStageVh
      const settleY = (1 - masterEase(clamp01(u / 0.22))) * lockStageVh; // u 0->0.22: lockStageVh -> 0
      const stageY = u > 0 ? settleY : introStageY; // stetig: introStageY(ip=1)=lockStageVh=settleY(u=0)
      stage.style.opacity = "1";
      stage.style.transform = `translateY(${stageY}vh)`;

      // Hasenkopf: peekt am Anfang (Auge-Mitte an der Unterkante), faehrt starr mit
      // dem Stack in den Lockup. Voll deckend im Intro UND waehrend die Wortmarke
      // noch starr nach oben gleitet (u 0->0.22 = U_REST, Wort noch unveraendert).
      // Ab u>0 bleibt der Kopf NICHT stehen (sonst verdeckt ihn die aufsteigende
      // Wortmarke, Tomson 05.07. Bild 21), sondern faehrt WEITER nach oben:
      // erst starr mit der Wortmarke (Settle u 0->0.22, Abstand bleibt), dann ganz
      // aus dem Bild. Deckkraft bleibt voll bis zur Kontraktion (u=0.22), danach raus.
      if (headRef.current) {
        const settleUp = masterEase(clamp01(u / 0.22)) * lockStageVh; // starr mit Wortmarke
        const postUp = masterEase(clamp01((u - 0.22) / 0.4)) * 55;    // danach ganz nach oben raus
        const headUp = u > 0 ? settleUp + postUp : 0;
        const dyC = HEAD_PEEK_DY - introShift - headUp; // 43.6 -> -20 (Lockup) -> weiter hoch
        const headFade = 1 - clamp01((u - 0.22) / 0.42); // u<0.22: voll; 0.22->0.64: raus
        headRef.current.style.transform = `translate(-50%, calc(-50% + ${dyC}vh))`;
        headRef.current.style.opacity = String(headFade);
      }

      // Statement: startet in der oberen/mittigen Zone, scrollt mit dem Stack nach
      // oben aus dem Bild — OHNE zu verblassen (volle Deckkraft durchgehend).
      if (statementRef.current) {
        const stY = STMT_TOP_DY - introShift; // -12 -> off top
        statementRef.current.style.opacity = "1";
        statementRef.current.style.transform = `translate(-50%, calc(-50% + ${stY}vh))`;
      }

      // R3: Statement steigt VON UNTEN hoch waehrend die Formation entsteht —
      // nie vorher da, nie nachher eingeblendet. Szene 0 laeuft waehrend des
      // Hero-Einflugs (eigenes tin-Fenster ab u=1.9).
      textRefs.current.forEach((el, s) => {
        if (!el) return;
        const local = u - (U_HERO + s);
        const isLast = s === textRefs.current.length - 1;
        const tin = s === 0 ? clamp01((u - 1.9) / 0.45) : clamp01((local - 0.22) / 0.35);
        // Ausblenden erst ab local 1.05
        const tout = isLast ? 1 : clamp01((1.4 - local) / 0.35);
        const eased = masterEase(tin);
        const o = eased * tout;
        el.style.opacity = String(o);
        const base = el.dataset.center === "1" ? "translateY(-50%) " : "";
        // Aufstieg von +56px (tin=0) auf 0 (tin=1)
        el.style.transform = `${base}translateY(${(1 - eased) * 56}px)`;
      });
    }

    function loop(time: number) {
      if (destroyed) return;
      lenis.raf(time);
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
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={trackRef} style={{ height: `${U_SPAN * 150 + 100}vh`, position: "relative" }}>
      <span ref={probeRef} aria-hidden style={{ fontFamily: "var(--rr-font-display)", position: "absolute", opacity: 0, pointerEvents: "none" }}>probe</span>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Teile-Buehne: Origin = Viewport-Zentrum (Wortmarke -> Shatter) */}
        {!reduced && <div ref={stageRef} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", willChange: "transform, opacity" }} />}

        {/* Marken-Auftakt (Phase 1-2): Hasenkopf, steigt vom unteren Rand auf */}
        {!reduced && (
          <div
            ref={headRef}
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              height: `${HEAD_VH}vh`,
              aspectRatio: "174 / 267",
              transform: `translate(-50%, calc(-50% + ${HEAD_PEEK_DY}vh))`,
              zIndex: 4,
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <RabbitMark className="rr-heromark" color="var(--rr-red)" title="Red Rabbit" />
          </div>
        )}

        {/* Marken-Auftakt (Phase 1-2): Statement, ruhig oben-mittig (Crimson Pro) */}
        {!reduced && (
          <div
            ref={statementRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(90vw, 900px)",
              textAlign: "center",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <p style={{
              margin: 0,
              fontFamily: "var(--rr-font-serif)",
              fontWeight: 500,
              fontSize: "clamp(24px, 3vw, 42px)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "var(--rr-navy)",
            }}>
              Wir bauen ästhetische Websites,<br />die man dort findet, wo deine Kunden sind.
            </p>
          </div>
        )}

        {reduced && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3vh", padding: "0 24px" }}>
            <p style={{ fontFamily: "var(--rr-font-serif)", fontWeight: 500, fontSize: "clamp(24px, 3vw, 42px)", lineHeight: 1.2, textAlign: "center", color: "var(--rr-navy)", maxWidth: "min(90vw, 900px)", margin: 0 }}>
              Wir bauen ästhetische Websites,<br />die man dort findet, wo deine Kunden sind.
            </p>
            <div style={{ height: "30vh", aspectRatio: "174 / 267" }}>
              <RabbitMark className="rr-heromark" color="var(--rr-red)" title="Red Rabbit" />
            </div>
            <p className="rr-display-2" style={{ color: "var(--rr-red)", fontWeight: 640, textAlign: "center", margin: 0 }}>red<br />rabbit</p>
          </div>
        )}

        <style>{`.rr-heromark{display:block;width:100%;height:100%}`}</style>

        {/* Statements (SEO-Text immer im DOM), Seite = Gegenseite der Formation */}
        {!reduced && SCENE_TEXTS.map((t, i) => (
          <div
            key={t.key}
            ref={(el) => { textRefs.current[i] = el; }}
            style={{ position: "absolute", right: "var(--rr-gutter)", top: "50%", transform: "translateY(-50%)", maxWidth: "min(40%, 560px)", opacity: 0 }}
          >
            <h2 className="rr-eyebrow-lg" style={{ marginBottom: 18 }}>{t.eyebrow}</h2>
            <p className="rr-statement">{t.statement}</p>
          </div>
        ))}
      </div>
      {/* reduced-motion: Statements als normale Sektionen */}
      {reduced && SCENE_TEXTS.map((t) => (
        <section key={t.key} className="rr-section">
          <div className="rr-wrap">
            <h2 className="rr-eyebrow-lg" style={{ marginBottom: 18 }}>{t.eyebrow}</h2>
            <p className="rr-statement">{t.statement}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
