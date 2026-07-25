"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google-Lighthouse-Ergebnisse als langsames Auto-Carousel ueber 3 echte
 * Kundenprojekte. Werte 1:1 aus der Portfolio-Komponente (Tomson-Entscheidung
 * 25.07.: bestehende Werte nehmen). Dunkles Theme, passend zum Beweis-Panel.
 * Ringe animieren beim Wechsel von 0 auf den Zielwert. Minimalistisch: ein
 * grosser Gesamt-Ring + fuenf kleine, kein Aufklappen (bewusst ruhig).
 */

type Scores = { performance: number; accessibility: number; bestPractices: number; seo: number; llm: number };

const CLIENTS: { domain: string; scores: Scores }[] = [
  { domain: "www.thermewarten.at", scores: { performance: 93, accessibility: 91, bestPractices: 95, seo: 92, llm: 94 } },
  { domain: "www.lashesbydanesh.at", scores: { performance: 94, accessibility: 93, bestPractices: 96, seo: 95, llm: 97 } },
  { domain: "www.ruderes-insights.at", scores: { performance: 93, accessibility: 91, bestPractices: 95, seo: 92, llm: 94 } },
];

const LABELS: [keyof Scores, string][] = [
  ["performance", "Leistung"],
  ["accessibility", "Barrierefreiheit"],
  ["bestPractices", "Best Practices"],
  ["seo", "SEO"],
  ["llm", "LLM"],
];

function Ring({ value, size, stroke, fontSize, active }: { value: number; size: number; stroke: number; fontSize: number; active: boolean }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  // animiert: startet leer, faehrt auf Zielwert wenn aktiv
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!active) { setShown(0); return; }
    const id = setTimeout(() => setShown(value), 60);
    return () => clearTimeout(id);
  }, [active, value]);
  const offset = circ - (shown / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#31d07a" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#f6f5f1" fontSize={fontSize} fontWeight={500} fontFamily="var(--rr-font-ui)">{value}</text>
    </svg>
  );
}

export default function LighthouseCarousel() {
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  // Erst animieren + weiterschalten, wenn das Widget ins Sichtfeld faehrt.
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !("IntersectionObserver" in window)) { setActive(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(true); }),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % CLIENTS.length), 5200);
    return () => clearInterval(id);
  }, [active]);

  const c = CLIENTS[idx];
  const avg = Math.round((c.scores.performance + c.scores.accessibility + c.scores.bestPractices + c.scores.seo + c.scores.llm) / 5);

  return (
    <div ref={hostRef} style={{
      width: "min(92vw, 440px)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
      padding: "clamp(20px, 2.4vw, 30px)", color: "#f6f5f1",
    }}>
      <p style={{ margin: "0 0 18px", fontSize: 11.5, lineHeight: 1.45, letterSpacing: "0.02em", color: "rgba(246,245,241,0.6)", fontFamily: "var(--rr-font-ui)" }}>
        Offizielles Google Lighthouse-Ergebnis für das Projekt:<br />
        <span style={{ color: "#f6f5f1", fontWeight: 600 }}>{c.domain}</span> (Stand: Juli 2026)
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 22 }}>
        <Ring key={`avg-${idx}`} value={avg} size={104} stroke={6} fontSize={30} active={active} />
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(246,245,241,0.6)", fontFamily: "var(--rr-font-ui)" }}>Gesamtpunktzahl</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {LABELS.map(([k, label]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Ring key={`${k}-${idx}`} value={c.scores[k]} size={48} stroke={3} fontSize={14} active={active} />
            <span style={{ fontSize: 9.5, color: "rgba(246,245,241,0.55)", fontFamily: "var(--rr-font-ui)", textAlign: "center", lineHeight: 1.2 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 22 }}>
        {CLIENTS.map((_, i) => (
          <span key={i} style={{ width: i === idx ? 20 : 7, height: 7, borderRadius: 0, background: i === idx ? "#f12032" : "rgba(255,255,255,0.22)", transition: "width .35s, background .35s" }} />
        ))}
      </div>
    </div>
  );
}
