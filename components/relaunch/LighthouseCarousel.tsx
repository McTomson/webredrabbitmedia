"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google-Lighthouse-Ergebnisse als langsames Auto-Carousel ueber 3 echte
 * Kundenprojekte. Werte 1:1 aus der Portfolio-Komponente (Tomson 25.07.).
 * Dunkles Theme, passend zum Beweis-Panel. Ringe animieren beim Reinscrollen.
 * "Details" klappt kurze Erklaerungen auf (im Widget scrollbar -> passt auf die
 * Seite). Wechsel bewusst langsam (Tomson 26.07.).
 */

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
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#f6f5f1" fontSize={fontSize} fontWeight={500} fontFamily="var(--rr-font-ui)">{value}</text>
    </svg>
  );
}

export default function LighthouseCarousel() {
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
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
    if (!active || open) return; // beim Aufklappen nicht weiterschalten
    const id = setInterval(() => setIdx((i) => (i + 1) % CLIENTS.length), 9000);
    return () => clearInterval(id);
  }, [active, open]);

  const c = CLIENTS[idx];
  const avg = Math.round((c.scores.performance + c.scores.accessibility + c.scores.bestPractices + c.scores.seo + c.scores.llm) / 5);
  const uiFont = "var(--rr-font-ui)";
  const muted = "rgba(246,245,241,0.6)";

  return (
    <div ref={hostRef} style={{
      width: "min(92vw, 460px)", maxHeight: "76vh", overflow: "hidden", display: "flex", flexDirection: "column",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
      padding: "clamp(20px, 2.4vw, 30px)", color: "#f6f5f1",
    }}>
      <p style={{ margin: "0 0 16px", fontSize: 11.5, lineHeight: 1.45, letterSpacing: "0.02em", color: muted, fontFamily: uiFont }}>
        Offizielles Google Lighthouse-Ergebnis für das Projekt:<br />
        <span style={{ color: "#f6f5f1", fontWeight: 600 }}>{c.domain}</span> (Stand: Juli 2026)
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 }}>
        <Ring key={`avg-${idx}`} value={avg} size={100} stroke={6} fontSize={29} active={active} />
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: muted, fontFamily: uiFont }}>Gesamtpunktzahl</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {METRICS.map((m) => (
          <div key={m.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Ring key={`${m.key}-${idx}`} value={c.scores[m.key]} size={46} stroke={3} fontSize={13} active={active} />
            <span style={{ fontSize: 9.5, color: muted, fontFamily: uiFont, textAlign: "center", lineHeight: 1.2 }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Details: aufklappbar, im Widget scrollbar (passt immer auf die Seite) */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ marginTop: 18, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", color: "#f12032", fontFamily: uiFont, fontSize: 13, fontWeight: 600, padding: 0 }}
      >
        {open ? "Weniger anzeigen" : "Was heißt das?"}
        <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }}>▾</span>
      </button>

      {open && (
        <div style={{ marginTop: 14, overflowY: "auto", display: "grid", gap: 12, paddingRight: 6 }}>
          {METRICS.map((m) => (
            <div key={m.key} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Ring value={c.scores[m.key]} size={40} stroke={3} fontSize={12} active={active} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: uiFont }}>{m.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, lineHeight: 1.45, color: muted, fontFamily: uiFont }}>{m.info}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
        {CLIENTS.map((_, i) => (
          <button key={i} aria-label={`Projekt ${i + 1}`} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 7, height: 7, border: "none", padding: 0, cursor: "pointer", background: i === idx ? "#f12032" : "rgba(255,255,255,0.22)", transition: "width .35s, background .35s" }} />
        ))}
      </div>
    </div>
  );
}
