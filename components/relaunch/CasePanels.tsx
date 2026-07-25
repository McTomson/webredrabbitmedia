"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clamp01 } from "@/lib/relaunch/morph/grammar";
import LighthouseCarousel from "@/components/relaunch/LighthouseCarousel";
import KundenSagen from "@/components/subpages/leistungen/KundenSagen";

/**
 * 3 Themen-Panels (Problem / Loesung / Beweis) mit horizontalem Pan, der pro
 * Fenster "stoppt" (Snap-Dwell, Tomson 26.07.): einmal weiterscrollen -> das
 * naechste 100vw-Fenster faehrt herein und bleibt stehen. Der Riesen-Buchstabe
 * bleibt fix stehen (faehrt NICHT mit). Beweis: Intro -> "Messbare technische
 * Perfektion" + Lighthouse -> KundenSagen (dunkel). Linksbuendig, echte Umlaute.
 */

type PanelWindow = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  linkText?: string;
  href?: string;
  kind?: "lighthouse" | "kundensagen";
};

type Theme = {
  key: string;
  giant: string;
  bg: string;
  text: string;
  accent: string;
  giantColor: string;
  windows: PanelWindow[];
};

const LEISTUNGEN = "/relaunch-preview/leistungen";

const THEMES: Theme[] = [
  {
    key: "problem",
    giant: "Problem",
    bg: "var(--rr-world-1-bg)",
    text: "#23262e",
    accent: "var(--rr-red)",
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
    accent: "var(--rr-red)",
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
    text: "#f6f5f1",
    accent: "var(--rr-red)",
    giantColor: "rgba(255,255,255,0.05)",
    windows: [
      { eyebrow: "Der Beweis", headline: "Kunden, die für uns sprechen.", body: "Ergebnisse, schwarz auf weiß." },
      {
        eyebrow: "Der Beweis",
        headline: "Messbare technische Perfektion.",
        body: "Bevor dein digitaler Mitarbeiter für dich verkaufen kann, braucht er das perfekte Fundament. Wir bauen Websites, die von Google und modernen KI-Suchen geliebt werden. Das ist keine Behauptung, das sind harte, messbare Fakten.",
        kind: "lighthouse",
      },
      { kind: "kundensagen" },
    ],
  },
];

function TextBlock({ w, accent }: { w: PanelWindow; accent: string }) {
  return (
    <div style={{ width: "min(88vw, 640px)" }}>
      {w.eyebrow && (
        <p className="rr-eyebrow-lg" style={{ color: accent, fontFamily: "var(--rr-font-sans)", letterSpacing: "0.12em", fontWeight: 600, margin: 0 }}>{w.eyebrow}</p>
      )}
      {w.headline && (
        <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(30px, 3.6vw, 52px)", lineHeight: 1.07, margin: w.eyebrow ? "0.4em 0 0" : 0, color: "inherit" }}>
          {w.headline.split("\n").map((line, i) => (<span key={i} style={{ display: "block" }}>{line}</span>))}
        </h3>
      )}
      {w.body && (
        <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(17px, 1.45vw, 23px)", lineHeight: 1.55, fontWeight: 400, margin: (w.eyebrow || w.headline) ? "1.1em 0 0" : 0, maxWidth: "27em", color: "inherit", opacity: 0.94 }}>{w.body}</p>
      )}
      {w.linkText && w.href && (
        <p style={{ margin: "1.7em 0 0" }}>
          <Link href={w.href} style={{ color: "inherit", fontFamily: "var(--rr-font-sans)", fontSize: "clamp(21px, 1.9vw, 27px)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 7 }}>
            {w.linkText} {"→"}
          </Link>
        </p>
      )}
    </div>
  );
}

/** Ein 100vw-breites Segment auf der horizontalen Buehne. */
function Segment({ w, accent, index }: { w: PanelWindow; accent: string; index: number }) {
  const base: React.CSSProperties = { position: "absolute", left: `${index * 100}vw`, top: 0, width: "100vw", height: "100%" };

  if (w.kind === "kundensagen") {
    // Dunkel statt Weiss (Tomson 26.07.): Grund transparent -> Panel-Dunkel bleibt,
    // Text ueber ks-ondark auf hell gedreht (Override in styleguide.css).
    return (
      <div style={{ ...base, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div className="ks-ondark" style={{ width: "100%" }}><KundenSagen /></div>
      </div>
    );
  }
  if (w.kind === "lighthouse") {
    return (
      <div style={{ ...base, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(24px, 4vw, 64px)", padding: "8vh 8vw" }}>
        <TextBlock w={w} accent={accent} />
        <LighthouseCarousel />
      </div>
    );
  }
  return (
    <div style={{ ...base, display: "flex", alignItems: "center", padding: "0 8vw" }}>
      <TextBlock w={w} accent={accent} />
    </div>
  );
}

function smoothstep(x: number) { const t = clamp01(x); return t * t * (3 - 2 * t); }

function PanelTrack({ t }: { t: Theme }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const N = t.windows.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current!, stage = stageRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      // Snap-Dwell: pro Fenster stehen bleiben, Uebergang nur im mittleren Drittel
      // jeder Etappe -> "einmal scrollen, ankommen, stop" (Tomson 26.07.).
      const seg = p * (N - 1);            // 0..N-1
      const i = Math.min(N - 2, Math.floor(seg));
      const f = seg - i;                   // 0..1 innerhalb der Etappe
      // Langer Dwell: Fenster bleibt ~80% der Etappe stehen, Uebergang nur im
      // mittleren 20%-Fenster -> "klebt" laenger, schneller Snap dazwischen.
      const units = i + smoothstep((f - 0.4) / 0.2);
      stage.style.transform = `translate3d(${-units * vw}px, 0, 0)`;
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
    <div ref={trackRef} style={{ height: `${N * 190}vh`, position: "relative" }}>
      <section aria-label={t.key} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: t.bg, color: t.text }}>
        {/* Riesen-Thema-Wort: bleibt FIX stehen (faehrt nicht mit) */}
        <div aria-hidden style={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", alignItems: "flex-end", pointerEvents: "none", zIndex: 0 }}>
          <span style={{ fontFamily: "var(--rr-font-display)", fontWeight: 640, whiteSpace: "nowrap", fontSize: "min(64vh, 40vw)", lineHeight: 0.9, color: t.giantColor, transform: "translateY(0.16em)", marginLeft: "58vw" }}>{t.giant}</span>
        </div>

        {/* Horizontale Buehne: N Segmente nebeneinander, translateX beim Scrollen */}
        <div ref={stageRef} style={{ position: "absolute", inset: 0, width: `${N * 100}vw`, willChange: "transform", zIndex: 1 }}>
          {t.windows.map((w, i) => (
            <Segment key={i} w={w} accent={t.accent} index={i} />
          ))}
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
        {THEMES.map((t) =>
          t.windows.map((w, i) => (
            <section key={`${t.key}-${i}`} aria-label={t.key} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: t.bg, color: t.text, display: "flex", alignItems: "center" }}>
              {w.kind === "kundensagen" ? (
                <div className="ks-ondark" style={{ width: "100%" }}><KundenSagen /></div>
              ) : (
                <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "clamp(80px, 12vh, 160px) 0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "clamp(24px, 4vw, 56px)" }}>
                  <TextBlock w={w} accent={t.accent} />
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
      {THEMES.map((t) => <PanelTrack key={t.key} t={t} />)}
    </div>
  );
}
