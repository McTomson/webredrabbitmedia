"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { clamp01 } from "@/lib/relaunch/morph/grammar";
import {
  BUMPER_TRACK_VH_PER_WINDOW,
  prefersReducedMotion,
  rideUnits,
} from "@/lib/relaunch/scroll-standard";
import LighthouseCarousel from "@/components/relaunch/LighthouseCarousel";
import KundenSagen from "@/components/subpages/leistungen/KundenSagen";

/**
 * 3 Themen-Panels (Problem / Loesung / Beweis) mit horizontalem Pan, der pro
 * Fenster "stoppt" (Snap-Dwell, Tomson 26.07.): einmal weiterscrollen -> das
 * naechste 100vw-Fenster faehrt herein und bleibt stehen. Der Riesen-Buchstabe
 * bleibt fix stehen (faehrt NICHT mit). Beweis: Intro -> "Messbare technische
 * Perfektion" + Lighthouse -> KundenSagen (dunkel). Linksbuendig, echte Umlaute.
 */

export type PanelWindow = {
  eyebrow?: string;
  headline?: string;
  body?: ReactNode;
  linkText?: string;
  href?: string;
  kind?: "lighthouse" | "kundensagen" | "lighthouse-solo";
};

export type Theme = {
  key: string;
  giant: string;
  bg: string;
  text: string;
  giantColor: string;
  /** Dunkle Flaeche: Eyebrow braucht die kontraststarke ondark-Variante. */
  onDark?: boolean;
  windows: PanelWindow[];
};

const LEISTUNGEN = "/relaunch-preview/leistungen";

export const THEMES: Theme[] = [
  {
    key: "problem",
    giant: "Problem",
    bg: "var(--rr-world-1-bg)",
    text: "#23262e",
    giantColor: "rgba(35,38,46,0.05)",
    windows: [
      { eyebrow: "Das Problem", headline: "Schön gebaut. Trotzdem\nruft keiner an." },
      {
        body: "Du hast viel Geld für eine neue Website bezahlt, aber sie arbeitet nicht für dich. Wenn Kunden in deiner Region suchen, tauchst du nicht auf. Um das zu ändern, müsstest du dich abends nach der Arbeit selbst hinsetzen oder einen teuren Mitarbeiter engagieren, um mühsam SEO-Texte zu schreiben und die Seite aktuell zu halten. Dafür fehlt im Alltag schlichtweg die Zeit. Deine Website ist aktuell ein toter Gegenstand, der dich Geld kostet, statt ein Werkzeug, das dir Arbeit abnimmt. Schön allein zahlt dir keine Rechnung.",
        linkText: "Was wir anders machen",
        href: LEISTUNGEN,
      },
    ],
  },
  {
    key: "loesung",
    giant: "Lösung",
    bg: "var(--rr-world-2-bg)",
    text: "#23262e",
    giantColor: "rgba(35,38,46,0.05)",
    windows: [
      { eyebrow: "Die Lösung", headline: "Wir bauen nicht nur Seiten, die gefunden werden.\nWir bauen dein Marketing-Team." },
      {
        body: "Eine Website, die gefunden wird, ist für uns nur der Standard. Alles beginnt mit einer kompromisslos guten Website, die im klassischen Netz und in neuen KI-Suchen dominiert. Im Hintergrund arbeitet von Anfang an dein digitaler Mitarbeiter, der dir alle Erfolge übersichtlich aufbereitet. Der wahre Wert liegt in der Anpassungsfähigkeit: Du kannst deinen digitalen Helfer jederzeit mit neuen Fähigkeiten updaten. Ob er selbstständig Leads generiert, Werbung steuert oder Prozesse automatisiert, das System passt sich nahtlos deinen Zielen an.",
        linkText: "Was wir anders machen",
        href: LEISTUNGEN,
      },
    ],
  },
  {
    key: "beweis",
    giant: "Beweis",
    bg: "var(--rr-world-3-bg)",
    text: "#f4f4f2",
    giantColor: "rgba(255,255,255,0.05)",
    onDark: true,
    windows: [
      { eyebrow: "Der Beweis", headline: "Kunden, die für uns sprechen.", body: "Ergebnisse, schwarz auf weiß." },
      {
        eyebrow: "Die Zahlen",
        headline: "Messbare technische Perfektion.",
        body: (
          <>
            Ohne perfektes Fundament geht es nicht. Wir bauen Websites, die von{" "}
            <span style={{ color: "#f77480" }}>Google</span> und modernen{" "}
            <span style={{ color: "#f77480" }}>KI-Suchen</span> geliebt werden. Das ist
            keine Behauptung, das sind harte, messbare Fakten.
          </>
        ),
        kind: "lighthouse",
      },
      { kind: "kundensagen" },
    ],
  },
];

function TextBlock({ w, onDark }: { w: PanelWindow; onDark?: boolean }) {
  return (
    <div style={{ width: "min(90vw, 760px)" }}>
      {/* Eyebrow-Standard (docs/DESIGN_STANDARD.md): zentrale Klasse
          rr-eyebrow-theme, die runden Klammern kommen aus der Klasse — der
          Text wird darum OHNE Klammern uebergeben. */}
      {w.eyebrow && (
        <p className={`rr-eyebrow-theme${onDark ? " rr-eyebrow-theme--ondark" : ""}`}>{w.eyebrow}</p>
      )}
      {w.headline && (
        <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(30px, 3.6vw, 52px)", lineHeight: 1.07, margin: w.eyebrow ? "0.4em 0 0" : 0, color: "inherit" }}>
          {w.headline.split("\n").map((line, i) => (<span key={i} style={{ display: "block" }}>{line}</span>))}
        </h3>
      )}
      {w.body && (
        <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(18px, 1.55vw, 25px)", lineHeight: 1.55, fontWeight: 400, margin: (w.eyebrow || w.headline) ? "1.1em 0 0" : 0, maxWidth: "33em", color: "inherit", opacity: 0.94 }}>{w.body}</p>
      )}
      {w.linkText && w.href && (
        <p style={{ margin: "2.6em 0 0" }}>
          <Link href={w.href} style={{ color: "inherit", fontFamily: "var(--rr-font-sans)", fontSize: "clamp(21px, 1.9vw, 27px)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 7 }}>
            {w.linkText} {"→"}
          </Link>
        </p>
      )}
    </div>
  );
}

/** Ein 100vw-breites Segment auf der horizontalen Buehne. */
function Segment({ w, onDark, index, themeKey, narrow }: { w: PanelWindow; onDark?: boolean; index: number; themeKey?: string; narrow?: boolean }) {
  const base: React.CSSProperties = { position: "absolute", left: `${index * 100}vw`, top: 0, width: "100vw", height: "100%" };
  // Mobile/Tablet (Thomas 31.07.): bei Problem + Loesung NUR den langen Body-
  // Text (das Fenster mit CTA "Was wir anders machen") UNTEN verankern — genau
  // wie die Morph-Statements, unmittelbar ueber dem Nach-oben-Pfeil (Ueberlappung
  // mit dem Riesen-Thema-Wort ist ok). Die kurzen Headline-Anfaenge (nur Eyebrow +
  // Headline, kein linkText) bleiben ZENTRIERT wie zuvor (Thomas: "der Anfang soll
  // wieder hoeher"). Beweis (nicht genannt) bleibt komplett zentriert.
  const lowerText = !!narrow && (themeKey === "problem" || themeKey === "loesung") && !!w.linkText;
  const lowerPad = "max(13vh, calc(env(safe-area-inset-bottom, 0px) + 88px))";

  if (w.kind === "kundensagen") {
    // Dunkel statt Weiss (Tomson 26.07.): Grund transparent -> Panel-Dunkel bleibt,
    // Text ueber ks-ondark auf hell gedreht (Override in styleguide.css).
    return (
      <div style={{ ...base, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div className="ks-ondark" style={{ width: "100%" }}><KundenSagen /></div>
      </div>
    );
  }
  if (w.kind === "lighthouse-solo") {
    // Mobile/Tablet: die 93-Animation auf eigenem Panel, zentriert (Thomas 31.07.).
    return (
      <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vh 6vw" }}>
        <LighthouseCarousel />
      </div>
    );
  }
  if (w.kind === "lighthouse") {
    return (
      <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(24px, 4vw, 64px)", padding: "8vh 8vw" }}>
        <TextBlock w={w} onDark={onDark} />
        <LighthouseCarousel />
      </div>
    );
  }
  return (
    <div style={{ ...base, display: "flex", alignItems: lowerText ? "flex-end" : "center", paddingLeft: "8vw", paddingRight: "8vw", paddingTop: 0, paddingBottom: lowerText ? lowerPad : 0 }}>
      <TextBlock w={w} onDark={onDark} />
    </div>
  );
}

function PanelTrack({ t }: { t: Theme }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  // Mobile/Tablet (Thomas 31.07.): die "Beweis"-Lighthouse-Kachel in ZWEI
  // Panels aufteilen -> erst der Text, dann (weiterscrollen) die 93-Animation.
  // Nur schmale Viewports; Desktop behaelt Text + Gauge nebeneinander in EINEM
  // Panel. Am Mount entschieden (kein Live-Umschalten, sonst Scroll-Sprung).
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    setNarrow(typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches);
  }, []);
  const segments = useMemo<PanelWindow[]>(() => {
    if (!narrow) return t.windows;
    const out: PanelWindow[] = [];
    for (const w of t.windows) {
      if (w.kind === "lighthouse") {
        out.push({ eyebrow: w.eyebrow, headline: w.headline, body: w.body }); // Text-Panel
        out.push({ kind: "lighthouse-solo" }); // 93-Animation eigenes Panel
      } else {
        out.push(w);
      }
    }
    return out;
  }, [narrow, t.windows]);
  const N = segments.length;

  useEffect(() => {
    // Sicherheitsnetz: nur bei reduzierter Bewegung stillhalten. Die horizontale
    // Karten-Fahrt bleibt auf Handy/Tablet erhalten (Thomas 31.07.: muss mobil
    // GENAUSO horizontal scrollen wie am Desktop) — der Antrieb ist scroll-
    // positionsbasiert (getBoundingClientRect), also touch-tauglich.
    if (prefersReducedMotion()) return;
    const track = trackRef.current!, stage = stageRef.current!, giant = giantRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      // Snap-Dwell: pro Fenster stehen bleiben, Uebergang nur im schmalen
      // Fenster in der Mitte jeder Etappe -> "einmal scrollen, ankommen, stop"
      // (Tomson 26.07.). Mathe zentral in lib/relaunch/scroll-standard.ts,
      // damit alle Bumper-Strecken dieselbe Kurve fahren (Standard 28.07.).
      const units = rideUnits(p * (N - 1), N);
      stage.style.transform = `translate3d(${-units * vw}px, 0, 0)`;
      // Riesen-Wort faehrt mit (Parallax, etwas schneller) — Tomson 26.07.
      giant.style.transform = `translate3d(${-units * vw * 1.18}px, 0, 0)`;
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { destroyed = true; cancelAnimationFrame(raf); };
  }, [N]);

  return (
    // data-rr-snap = der Einstieg in den Track rastet ein (Soft-Snap,
    // components/relaunch/ScrollExperience.tsx); data-rr-snap-exempt = innen
    // regiert das eigene Dwell-System, dort wird nicht gesnappt.
    <div ref={trackRef} data-rr-snap data-rr-snap-exempt style={{ height: `${N * BUMPER_TRACK_VH_PER_WINDOW}vh`, position: "relative" }}>
      <section aria-label={t.key} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: t.bg, color: t.text }}>
        {/* Riesen-Thema-Wort: faehrt mit (Parallax) */}
        <div ref={giantRef} aria-hidden style={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", alignItems: "flex-end", pointerEvents: "none", zIndex: 0, willChange: "transform" }}>
          <span style={{ fontFamily: "var(--rr-font-display)", fontWeight: 640, whiteSpace: "nowrap", fontSize: "min(64vh, 40vw)", lineHeight: 0.9, color: t.giantColor, transform: "translateY(0.16em)", marginLeft: "58vw" }}>{t.giant}</span>
        </div>

        {/* Horizontale Buehne: N Segmente nebeneinander, translateX beim Scrollen */}
        <div ref={stageRef} style={{ position: "absolute", inset: 0, width: `${N * 100}vw`, willChange: "transform", zIndex: 1 }}>
          {segments.map((w, i) => (
            <Segment key={i} w={w} onDark={t.onDark} index={i} themeKey={t.key} narrow={narrow} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function CasePanels({ themes = THEMES }: { themes?: Theme[] } = {}) {
  // Degradiert = prefers-reduced-motion ODER schmaler Viewport (<= 820px):
  // Bumper/Pan werden dann zu normalem vertikalem Scrollen (Standard 28.07.).
  // Entscheidung beim Mount, kein Live-Umschalten bei Resize: ein Wechsel
  // mitten im Scroll wuerde die Scroll-Position der Seite zerreissen.
  const [degraded, setDegraded] = useState(false);
  useEffect(() => {
    setDegraded(prefersReducedMotion());
  }, []);

  if (degraded) {
    return (
      <div>
        {themes.map((t) =>
          t.windows.map((w, i) => (
            <section key={`${t.key}-${i}`} aria-label={t.key} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: t.bg, color: t.text, display: "flex", alignItems: "center" }}>
              {w.kind === "kundensagen" ? (
                <div className="ks-ondark" style={{ width: "100%" }}><KundenSagen /></div>
              ) : (
                <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "var(--rr-section-y, clamp(96px,12vw,180px)) clamp(28px, 7vw, 72px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "clamp(24px, 4vw, 56px)" }}>
                  <TextBlock w={w} onDark={t.onDark} />
                  {w.kind === "lighthouse" && <LighthouseCarousel />}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    );
  }

  return (
    <div>
      {themes.map((t) => <PanelTrack key={t.key} t={t} />)}
    </div>
  );
}
