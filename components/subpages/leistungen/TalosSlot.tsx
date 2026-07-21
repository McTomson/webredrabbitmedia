import Link from "next/link";
import TalosEntranceStage from "@/components/relaunch/talos/TalosEntranceStage";

/**
 * Sektion 5 — Talos, der Helfer. Der Auftritt im GLEICHEN Website-Rahmen (kein
 * eigener App-Screenshot, Anti-Pattern laut IA-Doc): Copy links, Talos gleitet
 * rechts ins Bild, dreht sich zum User und winkt (TalosEntranceStage, spielt bei
 * Sichtbarkeit; reduced-motion/kein-WebGL -> statische Pose/Poster).
 */
export default function TalosSlot() {
  return (
    <section className="rr-section lh-talos">
      <div className="rr-wrap lht-grid">
        <div className="lht-copy">
          <p className="rr-eyebrow-lg">So sieht das in echt aus</p>
          <h2 className="rr-statement lh-talos__title">
            Eine Anfrage kommt um 23 Uhr rein. Du schläfst.
          </h2>
          <p className="rr-body-lg lh-talos__proof">
            Deine Seite fängt sie auf, bestätigt dem Interessenten, dass seine
            Nachricht angekommen ist, und legt dir eine fertige Antwort für den
            Morgen bereit. Du liest drüber und gibst mit einem Klick frei.
            Standardmäßig geht nichts in deinem Namen raus, das du nicht gesehen
            hast. Willst du, dass sie mehr allein erledigt, stellst du das um,
            aber das entscheidest du. Das freundliche Gesicht dahinter heißt
            Talos, und das läuft direkt auf deiner Website, nicht in einer
            fremden App.
          </p>
          <Link
            href="/relaunch-preview/leistungen/talos"
            className="rr-btn-frame rr-btn-frame--red"
          >
            <i className="c1" />
            <i className="c2" />
            <i className="c3" />
            <i className="c4" />
            <span className="rr-btn-frame__t">Was Talos alles kann</span>
          </Link>
        </div>

        <div className="lht-browser">
          <div className="lht-browser__bar">
            <span className="lht-browser__dot lht-browser__dot--red" aria-hidden="true" />
            <span className="lht-browser__dot" aria-hidden="true" />
            <span className="lht-browser__dot" aria-hidden="true" />
            <span className="lht-browser__addr" aria-hidden="true">deine-website.at</span>
          </div>
          <div className="lht-browser__page">
            <div className="lht-browser__skeleton" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="lht-stage">
              <TalosEntranceStage />
            </div>
          </div>
        </div>
      </div>

      <style>{`
.lht-grid { display: grid; grid-template-columns: 1fr; gap: clamp(24px, 5vh, 56px); align-items: center; }

/* ---- Browser-Mockup, in dem Talos "steht" ---- */
.lht-browser {
  position: relative;
  width: 100%;
  border-radius: 16px;
  background: var(--rr-paper);
  box-shadow: var(--rr-shadow-pop);
  overflow: visible;
}
.lht-browser__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  background: var(--rr-navy);
  border-radius: 16px 16px 0 0;
}
.lht-browser__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  flex: none;
}
.lht-browser__dot--red { background: var(--rr-red); }
.lht-browser__addr {
  margin-left: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--rr-font-ui);
  font-size: 12px;
  letter-spacing: 0.01em;
}
.lht-browser__page {
  position: relative;
  overflow: visible;
  background: var(--rr-surface);
  border-radius: 0 0 16px 16px;
}
.lht-browser__skeleton {
  position: absolute;
  top: 22px;
  left: 22px;
  display: grid;
  gap: 10px;
  z-index: 0;
  pointer-events: none;
}
.lht-browser__skeleton span {
  display: block;
  height: 8px;
  border-radius: 4px;
  background: rgba(28, 40, 55, 0.06);
}
.lht-browser__skeleton span:nth-child(1) { width: 120px; }
.lht-browser__skeleton span:nth-child(2) { width: 84px; }
.lht-browser__skeleton span:nth-child(3) { width: 100px; }

.lht-stage { position: relative; width: 100%; height: min(64vh, 560px); z-index: 1; }

@media (min-width: 900px) {
  .lht-grid { grid-template-columns: 1fr 40%; }
  .lht-stage { height: min(78vh, 700px); }
}
      `}</style>
    </section>
  );
}
