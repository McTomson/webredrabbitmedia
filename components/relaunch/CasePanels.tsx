"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clamp01 } from "@/lib/relaunch/morph/grammar";
import LighthouseCarousel from "@/components/relaunch/LighthouseCarousel";
import KundenSagen from "@/components/subpages/leistungen/KundenSagen";

/**
 * 3 Themen-Panels (Problem / Loesung / Beweis) mit HORIZONTALER Reveal-Fahrt:
 * pro Panel eine sticky-Buehne, in der mehrere "Fenster" per Scroll ueber-
 * blenden. Fenster 1 = Eyebrow + Headline; beim Weiterscrollen kommt Fenster 2
 * (Fliesstext + Link) usw. (Tomson 25.07.: die horizontale Funktion muss bleiben).
 * Beweis hat 3 Fenster: Intro -> "Messbare technische Perfektion" + Lighthouse-
 * Carousel -> KundenSagen. Linksbuendig, echte Umlaute, keine Gedankenstriche.
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
      { eyebrow: "Das Problem", headline: "Schön gebaut. Trotzdem ruft keiner an." },
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
      { eyebrow: "Die Lösung", headline: "Wir bauen nicht nur Seiten, die gefunden werden. Wir bauen dein Marketing-Team." },
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

/* ---- Fenster-Inhalt (linksbuendiger Textblock + optionale Sonder-Inhalte) ---- */
function WindowContent({ w, accent }: { w: PanelWindow; accent: string }) {
  if (w.kind === "kundensagen") {
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ffffff" }}>
        <KundenSagen />
      </div>
    );
  }

  const textBlock = (
    <div style={{ width: "min(90vw, 600px)" }}>
      {w.eyebrow && (
        <p className="rr-eyebrow-lg" style={{ color: accent, fontFamily: "var(--rr-font-sans)", letterSpacing: "0.12em", fontWeight: 600, margin: 0 }}>{w.eyebrow}</p>
      )}
      {w.headline && (
        <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(28px, 3.3vw, 46px)", lineHeight: 1.08, margin: w.eyebrow ? "0.4em 0 0" : 0, color: "inherit" }}>{w.headline}</h3>
      )}
      {w.body && (
        <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.6, fontWeight: 400, margin: (w.eyebrow || w.headline) ? "1.1em 0 0" : 0, maxWidth: "34em", color: "inherit", opacity: 0.92 }}>{w.body}</p>
      )}
      {w.linkText && w.href && (
        <p style={{ margin: "1.6em 0 0" }}>
          <Link href={w.href} style={{ color: "inherit", fontFamily: "var(--rr-font-sans)", fontSize: "clamp(19px, 1.7vw, 24px)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 6 }}>
            {w.linkText} {"→"}
          </Link>
        </p>
      )}
    </div>
  );

  if (w.kind === "lighthouse") {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(24px, 4vw, 64px)", padding: "12vh max(24px, 8vw)" }}>
        {textBlock}
        <LighthouseCarousel />
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", left: "max(24px, 8vw)", top: "50%", transform: "translateY(-50%)" }}>
      {textBlock}
    </div>
  );
}

function PanelTrack({ t }: { t: Theme }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const winRefs = useRef<(HTMLDivElement | null)[]>([]);
  const N = t.windows.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current!, giant = giantRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      giant.style.transform = `translate3d(${-p * 2.4 * vw}px, 0, 0)`;

      for (let i = 0; i < N; i++) {
        const el = winRefs.current[i];
        if (!el) continue;
        // Fenster-Mitte in p; Kreuzblende zum Nachbarn, Rand-Fenster bleiben
        // vor/nach ihrer Mitte deckend (kein leerer Moment am Anfang/Ende).
        const dp = (p - (i + 0.5) / N) * N; // Slot-Einheiten, 0 = Mitte
        let o: number;
        if (i === 0 && dp < 0) o = 1;
        else if (i === N - 1 && dp > 0) o = 1;
        else o = clamp01(1 - Math.abs(dp) / 0.62);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${dp * 34}px)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
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
    <div ref={trackRef} style={{ height: `${N * 150}vh`, position: "relative" }}>
      <section aria-label={t.key} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: t.bg, color: t.text }}>
        {/* Riesen-Thema-Wort, faehrt seitlich durch (ton-in-ton) */}
        <div ref={giantRef} aria-hidden style={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", alignItems: "flex-end", willChange: "transform", pointerEvents: "none", zIndex: 0 }}>
          <span style={{ fontFamily: "var(--rr-font-display)", fontWeight: 640, whiteSpace: "nowrap", fontSize: "min(64vh, 40vw)", lineHeight: 0.9, color: t.giantColor, transform: "translateY(0.16em)", marginLeft: "56vw" }}>{t.giant}</span>
        </div>

        {/* Fenster: absolut uebereinander, per Scroll ueberblendet */}
        {t.windows.map((w, i) => (
          <div
            key={i}
            ref={(el) => { winRefs.current[i] = el; }}
            style={{ position: "absolute", inset: 0, opacity: i === 0 ? 1 : 0, zIndex: 1, willChange: "opacity, transform" }}
          >
            <WindowContent w={w} accent={t.accent} />
          </div>
        ))}
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
            <section key={`${t.key}-${i}`} aria-label={t.key} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: w.kind === "kundensagen" ? "#fff" : t.bg, color: t.text, display: "flex", alignItems: "center" }}>
              {w.kind === "kundensagen" ? (
                <KundenSagen />
              ) : (
                <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "clamp(80px, 12vh, 160px) 0", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "clamp(24px, 4vw, 56px)" }}>
                  <div style={{ maxWidth: 600 }}>
                    {w.eyebrow && <p className="rr-eyebrow-lg" style={{ color: t.accent, margin: 0 }}>{w.eyebrow}</p>}
                    {w.headline && <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(28px, 3.6vw, 48px)", lineHeight: 1.08, margin: w.eyebrow ? "0.3em 0 0" : 0, color: "inherit" }}>{w.headline}</h3>}
                    {w.body && <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.6, maxWidth: "34em", margin: (w.eyebrow || w.headline) ? "1em 0 0" : 0, color: "inherit", opacity: 0.92 }}>{w.body}</p>}
                    {w.linkText && w.href && <p style={{ margin: "1.4em 0 0" }}><Link href={w.href} style={{ color: "inherit", fontSize: "clamp(19px, 1.7vw, 24px)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 6 }}>{w.linkText} {"→"}</Link></p>}
                  </div>
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
