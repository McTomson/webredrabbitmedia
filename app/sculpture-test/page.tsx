"use client";

import { useEffect, useState } from "react";
import MorphSculpture from "@/components/subpages/MorphSculpture";

/**
 * QA-/Test-Route fuer das wiederverwendbare Skulptur-Modul.
 * Rendert GENAU EINE Skulptur (Default comp=4, Kopf/KI) vollflaechig auf weissem
 * Grund. Der Fortschritt 0..1 ist per Slider einstellbar UND per Global
 * `window.__sculptProgress` (fuer agent-browser: `eval "window.__sculptProgress=0.55"`).
 *
 * comp per Query-Param umschaltbar: /sculpture-test?comp=0..4.
 */
export default function SculptureTestPage() {
  const [progress, setProgress] = useState(0.55);
  const [comp, setComp] = useState(4);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("comp");
    if (q != null) {
      const n = Number(q);
      if (Number.isFinite(n) && n >= 0 && n <= 4) setComp(n);
    }
    (window as unknown as { __sculptProgress?: number }).__sculptProgress = progress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setP = (v: number) => {
    setProgress(v);
    (window as unknown as { __sculptProgress?: number }).__sculptProgress = v;
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#ffffff", zIndex: 9998 }}>
      <MorphSculpture comp={comp} progress={progress} />

      {/* Steuerleiste (unten fixiert, ausserhalb des Vergleichs-Bereichs) */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 20px",
          background: "rgba(255,255,255,0.9)",
          borderTop: "1px solid #e5e5e5",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          color: "#1c2837",
          zIndex: 10,
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>comp {comp}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={progress}
          onChange={(e) => setP(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          progress {progress.toFixed(3)}
        </span>
        {[0, 0.2, 0.55, 0.85, 1].map((v) => (
          <button
            key={v}
            onClick={() => setP(v)}
            style={{
              border: "1px solid #c9c9c9",
              background: "#fff",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
