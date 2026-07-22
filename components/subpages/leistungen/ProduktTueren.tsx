"use client"; // TEMP (QA-only, wird zurueckgesetzt) — Datei ist untracked WIP und blockiert sonst die Hydration

import Link from 'next/link';

/**
 * Produkt-Tueren — der eine Teal-Farbmoment nach TalosSlot, Router zu den
 * beiden Unterseiten. Aufbau bewusst NICHT gleichrangig (UNTERSEITEN_STIL.md
 * §Kern-Regel: erst das Produkt Website beweisen, Talos bleibt Verb/Teil
 * davon, kein zweiter Pfeiler): eine grosse Teal-Flaeche "Die Website" traegt
 * eine kleinere, versetzte Navy-Karte "Talos, dein Mitarbeiter" in sich, die
 * optisch eingebettet wirkt statt eigenstaendig daneben zu stehen.
 * Eckig-Gesetz: border-radius 0 (wie die Diagnose-Teal-Welt auf der
 * Website-Unterseite, components/subpages/leistungen/website/v2/Diagnose.tsx).
 */
export default function ProduktTueren() {
  return (
    <section className="rr-section pt-section" aria-labelledby="pt-title">
      <div className="rr-wrap pt-inner">
        <p className="wd-eyebrow wd-eyebrow--cream">Geh tiefer rein</p>
        <h2 id="pt-title" className="rr-statement pt-title">
          Eine Website. Und ein Mitarbeiter, der schon drinsteckt.
        </h2>

        <div className="pt-website">
          <div className="pt-website__body">
            <h3 className="pt-website__label">Die Website</h3>
            <p className="pt-website__text">
              Individuell gebaut, nicht zusammengeklickt. Sie rankt bei
              Google, sieht auf jedem Gerät gut aus und bringt dir echte
              Anfragen statt nur ein hübsches Bild im Netz.
            </p>
            <Link href="/relaunch-preview/leistungen/website" className="rr-btn-sweep rr-btn-sweep--red">
              Mehr über die Website
            </Link>
          </div>

          <div className="pt-talos">
            <h3 className="pt-talos__label">Talos, dein Mitarbeiter</h3>
            <p className="pt-talos__text">
              Bei jeder Website fix dabei, kein Extra-Paket. Er steckt in
              deiner Seite drin und arbeitet, während du Feierabend hast.
            </p>
            <Link href="/relaunch-preview/leistungen/talos" className="rr-btn-frame rr-btn-frame--red pt-talos__cta">
              <i className="c1" />
              <i className="c2" />
              <i className="c3" />
              <i className="c4" />
              <span className="rr-btn-frame__t">Was Talos alles kann</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Plain globales <style> statt styled-jsx (Kontrakt: Server-Komponente
          bleiben, kein "use client" noetig — Muster aus Scharnierzeile.tsx/
          TalosSlot.tsx; Klassennamen pt-* sind seiten-lokal eindeutig). */}
      <style>{`
        .pt-section {
          background: var(--rr-world-1-bg, #1d8c98);
        }
        .pt-inner {
          max-width: 1180px;
        }
        .pt-title {
          color: #f6f5f1;
          max-width: 16em;
          margin: 20px 0 0;
        }

        /* ---- Grosse Teal-Flaeche "Die Website" ---- */
        .pt-website {
          position: relative;
          margin-top: clamp(48px, 6vw, 84px);
          /* Keine Rahmen-Hairline (Thomas: Linien weg) — die dunklere
             Teal-Flaeche allein setzt die Tuer ab. */
          border-radius: 0;
          padding: clamp(32px, 4vw, 56px);
          /* Leicht abgesetzt vom Sektions-Teal, damit die Flaeche als eigene
             Tuer erkennbar bleibt, ohne Rot direkt auf Teal zu legen. */
          background: rgba(0, 0, 0, 0.12);
        }
        .pt-website__body {
          max-width: 640px;
        }
        .pt-website__label {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(22px, 2.6vw, 30px);
          color: #f6f5f1;
          margin: 0 0 14px;
        }
        .pt-website__text {
          font-family: var(--rr-font-ui);
          font-size: clamp(16px, 1.4vw, 18px);
          line-height: 1.6;
          color: #ffffff;
          margin: 0 0 28px;
        }
        /* Kontrast-Fix wie website.css (.lw-cta .rr-btn-sweep): rr-btn-sweep
           hat im Ruhezustand Ink-Text, auf Teal muss er hell sein. */
        .pt-website .rr-btn-sweep {
          color: #f6f5f1;
        }

        /* ---- Kleinere, eingebettete Navy-Karte "Talos" ---- */
        .pt-talos {
          position: relative;
          margin-top: clamp(28px, 4vw, 40px);
          margin-left: clamp(0px, 8vw, 96px);
          max-width: 460px;
          border-radius: 0;
          padding: clamp(24px, 3vw, 36px);
          /* Flach und eckig wie der Rest der Marke: kein Rahmen, kein
             Schatten — Navy auf Teal traegt die Trennung von selbst. */
          background: var(--rr-navy, #1c2837);
        }
        .pt-talos__label {
          font-family: var(--rr-font-display);
          font-weight: 700;
          font-size: clamp(18px, 1.8vw, 22px);
          color: #f6f5f1;
          margin: 0 0 10px;
        }
        .pt-talos__text {
          font-family: var(--rr-font-ui);
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.55;
          color: rgba(246, 245, 241, 0.82);
          margin: 0 0 20px;
        }

        @media (max-width: 640px) {
          .pt-talos {
            margin-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
