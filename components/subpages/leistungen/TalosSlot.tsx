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
          <p className="rr-eyebrow-lg">Ein Beispiel aus einer ganz normalen Nacht</p>
          <h2 className="rr-statement lh-talos__title">
            Eine Anfrage kommt um 23 Uhr rein. Du schläfst.
          </h2>
          <p className="rr-body-lg lh-talos__proof">
            Talos schreibt zurück, bleibt freundlich, hält den Kontakt warm und
            legt dir die Anfrage sauber für den Morgen auf den Tisch. Du wachst
            auf und der erste Kunde des Tages wartet schon, statt dass er beim
            nächsten Betrieb anruft. Das passiert direkt auf deiner Website,
            nicht in irgendeiner fremden App.
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

        <div className="lht-stage">
          <TalosEntranceStage />
        </div>
      </div>

      <style>{`
.lht-grid { display: grid; grid-template-columns: 1fr; gap: clamp(24px, 5vh, 56px); align-items: center; }
.lht-stage { position: relative; width: 100%; height: min(64vh, 560px); }
@media (min-width: 900px) {
  .lht-grid { grid-template-columns: 1fr 40%; }
  .lht-stage { height: min(78vh, 700px); }
}
      `}</style>
    </section>
  );
}
