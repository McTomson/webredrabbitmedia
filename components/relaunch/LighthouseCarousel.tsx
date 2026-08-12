"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google-Lighthouse-Ergebnisse als langsames Auto-Carousel ueber 3 echte
 * Kundenprojekte. Werte 1:1 aus der Portfolio-Komponente (Tomson 25.07.).
 * Dunkles Theme, passend zum Beweis-Panel. Ringe animieren beim Reinscrollen.
 * Wechsel bewusst langsam (Tomson 26.07.).
 *
 * Erklaerungen zu den 5 Metriken (Tomson 29.07.): Bei ausreichend Platz
 * (Text + Widget nebeneinander, keine Zeilenumbrueche noetig -> ab
 * LHC_WIDE_BREAKPOINT) bleibt die Erklaerung permanent sichtbar unter den
 * Ringen. Sobald der Platz nicht reicht und Text+Widget untereinander
 * gestapelt werden, wuerde der volle Erklaerungs-Block die Sektion (fixe
 * 100vh-Buehne, siehe CasePanels.tsx) nach unten sprengen und verdeckt
 * werden -> dort stattdessen kompakt nur die Ringe, Erklaerung je Punkt per
 * Hover/Tap (Tooltip). Umschaltung rein per CSS-Media-Query (kein JS-Resize-
 * Listener noetig, kein Layout-Thrash).
 */
const LHC_WIDE_BREAKPOINT = 1750; // siehe Rechnung im Kommentar unten (Segment-Layout)

type Scores = { performance: number; accessibility: number; bestPractices: number; seo: number; llm: number };

const CLIENTS: { domain: string; scores: Scores }[] = [
  { domain: "www.thermewarten.at", scores: { performance: 93, accessibility: 91, bestPractices: 95, seo: 92, llm: 94 } },
  { domain: "www.lashesbydanesh.at", scores: { performance: 94, accessibility: 93, bestPractices: 96, seo: 95, llm: 97 } },
  { domain: "www.ruderes-insights.at", scores: { performance: 93, accessibility: 91, bestPractices: 95, seo: 92, llm: 94 } },
];

const METRICS: { key: keyof Scores; label: string; info: string }[] = [
  { key: "performance", label: "Leistung", info: "Wie schnell lädt die Website? Schnelle Ladezeiten bedeuten weniger Wartezeit für deine Kunden und bessere Rankings bei Google." },
  { key: "accessibility", label: "Barrierefreiheit", info: "Kann jeder die Website nutzen? Wir stellen sicher, dass auch Menschen mit Einschränkungen deine Inhalte problemlos erreichen." },
  { key: "bestPractices", label: "Best Practices", info: "Werden moderne Web-Standards eingehalten? Sicherheit, HTTPS und aktuelle Technik sind heute Pflicht für seriöse Websites." },
  { key: "seo", label: "SEO", info: "Wird deine Website von Google gefunden? Optimierte Inhalte, Meta-Tags und Struktur bringen dich bei Google nach vorne." },
  { key: "llm", label: "LLM", info: "Kann ChatGPT deine Website verstehen? Wir strukturieren sie so, dass KI-Tools deine Inhalte perfekt lesen und empfehlen." },
];

function Ring({ value, size, stroke, fontSize, active }: { value: number; size: number; stroke: number; fontSize: number; active: boolean }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
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
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#f4f4f2" fontSize={fontSize} fontWeight={500} fontFamily="var(--rr-font-ui)">{value}</text>
    </svg>
  );
}

export default function LighthouseCarousel() {
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [tipKey, setTipKey] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

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
    const id = setInterval(() => setIdx((i) => (i + 1) % CLIENTS.length), 9000);
    return () => clearInterval(id);
  }, [active]);

  const c = CLIENTS[idx];
  const avg = Math.round((c.scores.performance + c.scores.accessibility + c.scores.bestPractices + c.scores.seo + c.scores.llm) / 5);
  const uiFont = "var(--rr-font-ui)";
  const muted = "rgba(246,245,241,0.6)";

  return (
    <div ref={hostRef} className="lhc" style={{
      width: "min(94vw, 600px)", display: "flex", flexDirection: "column",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
      padding: "clamp(20px, 2.4vw, 30px)", color: "#f4f4f2",
    }}>
      <style>{`
        .lhc-metric { position: relative; }
        .lhc-tooltip {
          display: none;
          position: absolute; bottom: calc(100% + 12px); width: min(210px, 60vw);
          background: #1c1d21; border: 1px solid rgba(255,255,255,0.14); border-radius: 10px;
          padding: 12px 14px; font-size: 11.5px; line-height: 1.45; color: #f4f4f2;
          box-shadow: 0 14px 30px rgba(0,0,0,0.4); z-index: 20; text-align: left;
          opacity: 0; transform: translateY(4px); transition: opacity .18s ease-out, transform .18s ease-out;
          pointer-events: none;
        }
        .lhc-tooltip.is-active { display: block; opacity: 1; transform: translateY(0); }
        .lhc-tooltip::after {
          content: ""; position: absolute; top: 100%; width: 0; height: 0;
          border-left: 6px solid transparent; border-right: 6px solid transparent;
          border-top: 6px solid #1c1d21;
        }
        .lhc-metric--first .lhc-tooltip { left: 0; }
        .lhc-metric--first .lhc-tooltip::after { left: 16px; }
        .lhc-metric--last .lhc-tooltip { right: 0; }
        .lhc-metric--last .lhc-tooltip::after { right: 16px; }
        .lhc-metric--mid .lhc-tooltip { left: 50%; transform: translate(-50%, 4px); }
        .lhc-metric--mid .lhc-tooltip.is-active { transform: translate(-50%, 0); }
        .lhc-metric--mid .lhc-tooltip::after { left: 50%; transform: translateX(-50%); }
        .lhc-wide-detail { display: none; }
        @media (min-width: ${LHC_WIDE_BREAKPOINT}px) {
          .lhc-wide-detail { display: grid; }
          .lhc-tooltip.is-active { display: none; }
        }
      `}</style>

      <p style={{ margin: "0 0 16px", fontSize: 11.5, lineHeight: 1.45, letterSpacing: "0.02em", color: muted, fontFamily: uiFont }}>
        Offizielles Google Lighthouse-Ergebnis für das Projekt:<br />
        <span style={{ color: "#f4f4f2", fontWeight: 600 }}>{c.domain}</span> (Stand: Juli 2026)
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <Ring key={`avg-${idx}`} value={avg} size={100} stroke={6} fontSize={29} active={active} />
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: muted, fontFamily: uiFont }}>Gesamtpunktzahl</span>
      </div>

      {/* Ab LHC_WIDE_BREAKPOINT (Text+Widget nebeneinander, siehe CasePanels.tsx)
          bleibt die Erklaerung permanent unter den Ringen sichtbar, kein Hover
          noetig. Darunter (Text+Widget gestapelt, Platz wuerde sonst nicht
          reichen) nur die Ringe, Erklaerung je Punkt per Hover/Tap. */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}
        onMouseMove={(e) => {
          const el = (e.target as HTMLElement).closest<HTMLElement>("[data-metric-key]");
          setTipKey(el ? el.dataset.metricKey! : null);
        }}
        onMouseLeave={() => setTipKey(null)}
      >
        {METRICS.map((m, i) => {
          const posClass = i === 0 ? "lhc-metric--first" : i === METRICS.length - 1 ? "lhc-metric--last" : "lhc-metric--mid";
          const isTipActive = tipKey === m.key;
          return (
            <div
              key={m.key}
              data-metric-key={m.key}
              className={`lhc-metric ${posClass}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-expanded={isTipActive}
              aria-label={`${m.label}: ${m.info}`}
              onFocus={() => setTipKey(m.key)}
              onBlur={() => setTipKey((k) => (k === m.key ? null : k))}
              onClick={() => setTipKey((k) => (k === m.key ? null : m.key))}
            >
              <Ring key={`${m.key}-${idx}`} value={c.scores[m.key]} size={46} stroke={3} fontSize={13} active={active} />
              <span style={{ fontSize: 9.5, color: muted, fontFamily: uiFont, textAlign: "center", lineHeight: 1.2 }}>{m.label}</span>
              <div className={`lhc-tooltip${isTipActive ? " is-active" : ""}`} role="tooltip">{m.info}</div>
            </div>
          );
        })}
      </div>

      <div className="lhc-wide-detail" style={{ marginTop: 20, gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: "16px 26px" }}>
        {METRICS.map((m) => (
          <div key={m.key}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, fontFamily: uiFont, color: "#f4f4f2" }}>
              {m.label} <span style={{ color: "#31d07a", fontWeight: 700 }}>{c.scores[m.key]}</span>
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11.5, lineHeight: 1.42, color: muted, fontFamily: uiFont }}>{m.info}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
        {CLIENTS.map((_, i) => (
          <button key={i} aria-label={`Projekt ${i + 1}`} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 7, height: 7, border: "none", padding: 0, cursor: "pointer", background: i === idx ? "#f12032" : "rgba(255,255,255,0.22)", transition: "width .35s, background .35s" }} />
        ))}
      </div>
    </div>
  );
}
