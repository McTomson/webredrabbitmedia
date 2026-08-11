'use client';

import { useEffect, useRef, useState } from 'react';
import { smoothstep, prefersReducedMotion } from '@/lib/relaunch/scroll-standard';

/**
 * ScrollBumper — jetzt 1:1 die BELIEF-BUMPER-Mechanik der Website-Seite
 * (components/subpages/website-demo/demo.engine.jstext, applyBelief + Sticky-
 * Stups). Thomas 11.08. mit Video-Vorlage: "der Satz bleibt in der Mitte
 * stehen, der neue kommt von unten, stoesst ihn an, der alte geht nach oben
 * weg — und beim letzten kommt der Call-to-Action-Button. Genau so wie auf
 * der Website-Seite, das muss immer so sein."
 *
 * Die vorige Buehnen-Mechanik (eine Stage, alle Saetze 100vh uebereinander,
 * translate der ganzen Buehne) konnte das Anstupsen nicht: dort fuhr der alte
 * Satz nach oben WEG, waehrend der neue erst am unteren Rand erschien —
 * dazwischen war die Mitte leer (Thomas' "falsch"-Video). Hier stattdessen
 * das Original-Rezept, Konstanten unveraendert uebernommen:
 *
 * - Jeder Satz ist ABSOLUT in der Fenstermitte; sein Abstand zur eigenen
 *   Slot-Mitte ist d (in Slot-Breiten). |d|<=HOLD: steht zentral, voll lesbar
 *   (genau EIN Satz zentral = der Stop). HOLD..EDGE: leichtes Anstupsen —
 *   der wegziehende und der aufsteigende Satz beruehren sich kurz (~10%
 *   Ueberlappung, touch = 45% der Satzhoehe). EDGE..EDGE+FADE: der alte
 *   faehrt verblassend nach oben raus (EXIT), der neue kommt verblassend von
 *   unten herein (PARK). Ausserhalb: unsichtbar geparkt — nie drei Saetze
 *   gleichzeitig.
 * - Der letzte Satz (pointe) wird NIE nach oben rausgestupst (d = max(d, 0)),
 *   er bleibt als Endbild zentral stehen; darunter blendet der CTA-Button ein
 *   (Fade + 28px-Anfahrt, klickbar erst ab 60% Einblendung).
 * - Fortschritt bp laeuft durch dieselbe Lerp-Glaettung (BUMPER_LERP=0.065)
 *   wie im Original — dadurch entsteht das weiche Nachziehen.
 * - Slot-Mitten wie im Original von 0.13 bis 0.85 verteilt; die Track-Hoehe
 *   skaliert so, dass pro Satz dieselbe Scroll-Strecke bleibt wie im Vorbild
 *   (4 Saetze = 460vh -> ~86vh pro Etappe).
 * - R4-Stopps: die Slot-Mitten werden als window.__rrDynamicSnapTops
 *   registriert (types.d.ts), damit ScrollExperience jeden Satz als eigenen
 *   Halt anfaehrt — exakt wie die Belief-Szene der Website-Seite.
 *
 * Degradiert wird NUR bei prefers-reduced-motion (statische Liste); auf
 * Geraetegroessen laeuft die Mechanik ueberall (Thomas 11.08.: "immer und
 * ueberall").
 *
 * Styling: plain globales <style>-Tag statt <style jsx> (LESSONS_LEARNED.md
 * "styled-jsx im Relaunch meiden"), Klassen sb- namespaced. Satz-Typo 1:1 vom
 * Vorbild: Serif (var(--rr-font-serif)) fuer die Saetze, Display-Sans fett
 * fuer die Pointe, Eyebrow zentriert oben (b-label-Muster).
 */

export interface ScrollBumperStatement {
  text: string;
  /** Schluss-Satz: bleibt als Endbild stehen (nie rausgestupst), roter Akzent. */
  pointe?: boolean;
}

export interface ScrollBumperCta {
  label: string;
  href: string;
  /** data-rr-lead-Wert fuer das Lead-Tracking (optional). */
  lead?: string;
  leadService?: string;
}

interface ScrollBumperProps {
  statements: ScrollBumperStatement[];
  /** Rote Themen-Zeile, zentriert oben im Fenster (ohne Klammern uebergeben). */
  label?: string;
  /** CTA unter dem letzten Satz (Vorbild: bCta der Website-Seite). */
  cta?: ScrollBumperCta;
}

/* Konstanten 1:1 aus applyBelief (website-demo/demo.engine.jstext). */
const B_FIRST = 0.13;
const B_LAST = 0.85;
const B_HOLD = 0.34;
const B_EDGE = 0.5;
const B_FADE = 0.12;
const BUMPER_LERP = 0.065; // PIECE_LERP des Originals
/** Scroll-Strecke pro Satz-Etappe in vh: Original 4 Saetze/460vh Track ->
 *  Span 360vh * Step 0.24 = 86.4vh. */
const VH_PER_STEP = 86.4;

export default function ScrollBumper({ statements, label, cta }: ScrollBumperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stmtRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [degraded, setDegraded] = useState(false);

  const n = statements.length;
  const step = n > 1 ? (B_LAST - B_FIRST) / (n - 1) : 1;
  const centers = statements.map((_, i) => B_FIRST + i * step);
  const trackVh = Math.round(100 + VH_PER_STEP / step);

  useEffect(() => {
    // Nur reduzierte Bewegung degradiert (Thomas 11.08.: Stops immer/ueberall).
    setDegraded(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (degraded) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let destroyed = false;
    let smBp: number | null = null;
    const heights: number[] = [];

    function measure() {
      stmtRefs.current.forEach((el, i) => {
        if (!el) return;
        const prevT = el.style.transform;
        const prevO = el.style.opacity;
        el.style.transform = 'translate(-50%,-50%)';
        el.style.opacity = '0';
        heights[i] = el.getBoundingClientRect().height;
        el.style.transform = prevT;
        el.style.opacity = prevO;
      });
    }
    measure();
    window.addEventListener('resize', measure);

    function apply(bp: number) {
      const vh = window.innerHeight;
      const EXIT = vh * 0.62; // nach oben ganz aus dem Bild
      const PARK = vh * 0.42; // unter dem Bild wartend
      for (let i = 0; i < n; i++) {
        const el = stmtRefs.current[i];
        if (!el) continue;
        let d = (centers[i] - bp) / step; // >0: unter der Mitte, <0: darueber
        if (i === n - 1) d = Math.max(d, 0); // Pointe bleibt zentral
        const ad = Math.abs(d);
        const sgn = d < 0 ? -1 : 1;
        const touch = (heights[i] || vh * 0.24) * 0.45;
        let y: number;
        let o: number;
        if (ad <= B_HOLD) {
          y = 0;
          o = 1;
        } else if (ad <= B_EDGE) {
          const k = smoothstep((ad - B_HOLD) / (B_EDGE - B_HOLD));
          y = sgn * k * touch;
          o = 1;
        } else if (ad <= B_EDGE + B_FADE) {
          const m = smoothstep((ad - B_EDGE) / B_FADE);
          const far = sgn < 0 ? EXIT : PARK;
          y = sgn * (touch + (far - touch) * m);
          o = 1 - m;
        } else {
          y = sgn * (sgn < 0 ? EXIT : PARK);
          o = 0;
        }
        el.style.transform = `translate(-50%,-50%) translateY(${y.toFixed(1)}px)`;
        el.style.opacity = o.toFixed(3);
      }
      const ctaEl = ctaRef.current;
      if (ctaEl) {
        const cp = Math.min(1, Math.max(0, (bp - (centers[n - 1] + 0.05)) / 0.08));
        const ce = smoothstep(cp);
        ctaEl.style.opacity = ce.toFixed(3);
        ctaEl.style.transform = `translateY(${((1 - ce) * 28).toFixed(1)}px)`;
        ctaEl.style.pointerEvents = cp > 0.6 ? 'auto' : 'none';
      }
    }

    function loop() {
      if (destroyed) return;
      const vh = window.innerHeight;
      const rect = section!.getBoundingClientRect();
      const total = rect.height - vh;
      if (total > 0 && rect.bottom > 0 && rect.top < vh) {
        const rawBp = Math.min(1, Math.max(0, -rect.top / total));
        smBp = smBp === null ? rawBp : smBp + (rawBp - smBp) * BUMPER_LERP;
        apply(smBp);
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    // R4-Stopps: Slot-Mitten als dynamische Snap-Ziele melden (wie die
    // Belief-Szene der Website-Seite). Frisch gerechnet, Resize-sicher.
    const snapTops = () => {
      if (!section.isConnected) return [];
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return [];
      const top = rect.top + window.scrollY;
      return centers.map((c) => top + c * span);
    };
    window.__rrDynamicSnapTops = snapTops;

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
      if (window.__rrDynamicSnapTops === snapTops) {
        delete window.__rrDynamicSnapTops;
      }
    };
    // centers/step sind aus statements abgeleitet; n genuegt als Abhaengigkeit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degraded, n]);

  const renderText = (s: ScrollBumperStatement) => {
    const isPointe = !!s.pointe;
    const endsDot = s.text.endsWith('.') || s.text.endsWith('?') || s.text.endsWith('!');
    const text = isPointe && endsDot ? s.text.slice(0, -1) : s.text;
    const mark = isPointe && endsDot ? s.text.slice(-1) : null;
    return (
      <>
        {text}
        {mark && <span className="sb-dot">{mark}</span>}
      </>
    );
  };

  const ctaNode = cta ? (
    <a
      ref={ctaRef}
      className="rr-btn-sweep rr-btn-sweep--red sb-cta"
      href={cta.href}
      data-rr-lead={cta.lead}
      data-rr-lead-service={cta.leadService}
    >
      {cta.label}
    </a>
  ) : null;

  if (degraded) {
    return (
      <section className="sb-section sb-section--static">
        {label && <p className="sb-label">({label})</p>}
        <div className="sb-static">
          {statements.map((s, i) => (
            <p key={i} className={`sb-stmt${s.pointe ? ' sb-stmt--pointe' : ''} sb-stmt--flow`}>
              {renderText(s)}
            </p>
          ))}
          {cta && (
            <a
              className="rr-btn-sweep rr-btn-sweep--red sb-cta sb-cta--flow"
              href={cta.href}
              data-rr-lead={cta.lead}
              data-rr-lead-service={cta.leadService}
            >
              {cta.label}
            </a>
          )}
        </div>
        <ScrollBumperStyles />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="sb-section"
      // Eigene Scroll-Dramaturgie: Snap-Kanten kommen aus __rrDynamicSnapTops.
      data-rr-snap
      data-rr-snap-exempt
      style={{ '--sb-track': `${trackVh}vh` } as React.CSSProperties}
    >
      <div className="sb-sticky">
        {label && <p className="sb-label">({label})</p>}
        {statements.map((s, i) => (
          <p
            key={i}
            ref={(el) => {
              stmtRefs.current[i] = el;
            }}
            className={`sb-stmt${s.pointe ? ' sb-stmt--pointe' : ''}`}
          >
            {renderText(s)}
            {s.pointe && ctaNode && <span className="sb-cta-slot">{ctaNode}</span>}
          </p>
        ))}
      </div>
      <ScrollBumperStyles />
    </section>
  );
}

function ScrollBumperStyles() {
  return (
    <style>{`
      .sb-section {
        position: relative;
        height: var(--sb-track, 460vh);
        background: var(--rr-world-2-bg, #f4f4f2);
        color: var(--rr-navy, #23262e);
      }
      .sb-sticky {
        position: sticky;
        top: 0;
        height: 100vh;
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
      }
      /* Eyebrow zentriert oben — 1:1 das b-label des Vorbilds. */
      .sb-label {
        position: absolute;
        top: 9vh;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--rr-font-ui, "DM Sans", sans-serif);
        font-size: 0.72rem;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--rr-red, #f12032);
        font-weight: 700;
        white-space: nowrap;
        margin: 0;
        z-index: 2;
      }
      /* Satz-Typo 1:1 vom Vorbild (.stmt): Serif, zentriert, absolute Mitte. */
      .rr .sb-stmt {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(90vw, 900px);
        font-family: var(--rr-font-serif, Georgia, serif);
        font-weight: 500;
        font-size: clamp(24px, 3vw, 42px);
        line-height: 1.2;
        letter-spacing: -0.01em;
        color: var(--rr-navy, #23262e);
        text-align: center;
        text-wrap: balance;
        will-change: transform, opacity;
        transform: translate(-50%, -50%);
        margin: 0;
        opacity: 0;
      }
      .rr .sb-stmt--pointe {
        font-family: var(--rr-font-display, "DM Sans", sans-serif);
        font-weight: 700;
        font-size: clamp(1.9rem, 4vw, 3.5rem);
        line-height: 1.12;
        letter-spacing: -0.02em;
        color: var(--rr-ink, #17191f);
      }
      .sb-dot {
        color: var(--rr-red, #f12032);
      }
      /* CTA absolut UNTER dem Pointe-Satz (Vorbild R4: die Satz-Box umfasst nur
         den Text, translate zentriert den Text, der Button haengt darunter). */
      .sb-cta-slot {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: clamp(2.2rem, 6vh, 4.5rem);
        white-space: nowrap;
      }
      .sb-cta {
        display: inline-block;
        will-change: transform, opacity;
        opacity: 0;
        pointer-events: none;
      }

      /* Reduced Motion: normales Scrollen, alles sichtbar untereinander. */
      .sb-section--static {
        height: auto;
        padding: var(--rr-section-y, clamp(96px, 12vw, 180px)) var(--rr-gutter, clamp(20px, 4vw, 64px));
      }
      .sb-section--static .sb-label {
        position: static;
        transform: none;
        text-align: center;
        margin-bottom: clamp(24px, 5vw, 40px);
      }
      .sb-static {
        display: flex;
        flex-direction: column;
        gap: clamp(24px, 4vw, 40px);
        align-items: center;
      }
      .rr .sb-stmt--flow {
        position: static;
        transform: none;
        opacity: 1;
        margin: 0 auto;
      }
      .sb-cta--flow {
        opacity: 1;
        pointer-events: auto;
      }
    `}</style>
  );
}
