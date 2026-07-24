import FragTalos from '@/components/relaunch/talos/FragTalos';

/**
 * "Frag Talos" — Anmoderation vor dem bestehenden 5-Fragen-Assistenten
 * (Copy v2 Sektion 9). Der Assistent selbst (components/relaunch/talos/
 * FragTalos.tsx) wird unveraendert eingebunden, exakt wie in dessen
 * Referenz-Verwendung im Leistungs-Hub (app/relaunch-preview/
 * leistungen-hub/page.tsx): eigener SSR-Rahmen mit Eyebrow/H2/Subline +
 * Talos-Sprechzeilen, danach direkt <FragTalos />.
 *
 * VOLLFLAECHIGE Blau-Sektion (Thomas 24.07.), nach dem Vorbild des Quiz
 * "Sag uns, wer du bist" (components/subpages/leistungen/website/v2/
 * Diagnose.tsx, Teal-Welt) — hier in BLAU (#0a72a0, das etablierte,
 * barrierefreie --blue). Off-White-Statement, Eyebrow/Akzente in
 * Tuerkis/Off-White. HARTE REGEL: niemals Rot auf Blau.
 *
 * FragTalos.tsx bringt selbst KEINE durchgehende helle Flaeche mit (nur
 * einzelne Zeilen/Karten wie .ft-choice/.ft-result-item sind weiss) —
 * ohne Panel wuerden .ft-start (roter Button) und Text/CTA-Zeilen direkt
 * auf dem Blau liegen (Rot-auf-Blau + Kontrast-Problem). Deshalb wird der
 * Assistent hier in ein eingesetztes Off-White-Panel gefasst (sauberer
 * Uebergang, "Panel auf der Farbflaeche"). FragTalos.tsx selbst bleibt
 * unangetastet, Logik/Ablauf 1:1.
 */
export default function FragTalosAnmoderation() {
  return (
    <section className="rr-section tl-section tl-frag tlfrag-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow tlfrag-eyebrow">Noch unsicher?</p>
        <h2 className="rr-statement tl-title tlfrag-title">
          Du weißt nicht, was dein Betrieb wirklich braucht? Dann frag mich.
        </h2>
        <p className="rr-body-lg tl-lead tlfrag-lead">
          Fünf kurze Fragen, dann sage ich dir ehrlich, welche Website und
          welche Kollegen zu dir passen. Und was du getrost weglassen kannst.
          Kein Verkaufsgespräch, du steigst aus, wann du willst.
        </p>

        <p className="tl-says tl-says--ondark">
          Beantworte mir kurz fünf Fragen, dann wird es konkret.
        </p>
        <p className="tl-says tl-says--ondark">
          Und keine Sorge, ich rede dir nichts ein, was du nicht brauchst.
        </p>

        <div className="tlfrag-panel">
          <FragTalos />
        </div>
      </div>

      <style>{`
.tlfrag-section { background: #0a72a0; }
/* Eyebrow-Klammerstil bleibt (wd-eyebrow), Farbe auf Blau umgestellt:
   Markenrot vibriert auf Blau und faellt im Kontrast durch -> Tuerkis,
   selber Ton wie die uebrigen Akzente auf dunklem Grund in dieser Seite
   (tl-card--invers, tl-says Border). 3 Klassen Spezifitaet schlagen die
   .rr .wd-eyebrow-Basis + Varianten unabhaengig von der Ladereihenfolge. */
.rr .tlfrag-section .wd-eyebrow { color: #39c2d7; }
/* 3-Klassen-Spezifitaet, sonst schlaegt .rr .tl-title / .rr-statement (Navy)
   die Off-White-Farbe und die Headline steht dunkel auf Blau (verifiziert 24.07.). */
.rr .tlfrag-section .tl-title { color: #f6f5f1; }
.rr .tlfrag-section .tl-lead { color: rgba(246, 245, 241, 0.85); }

/* Eingesetztes Panel fuer den Assistenten: FragTalos.tsx erwartet einen
   hellen Grund (dunkler Fliesstext, roter Button/Akzente) -> auf Blau
   direkt waere das Rot-auf-Blau (verboten) und der Fliesstext zu
   kontrastarm. Als Off-White-Karte eingesetzt bleibt FragTalos unveraendert
   und wirkt als "sauberer Uebergang" auf der Farbflaeche. */
.tlfrag-panel {
  margin-top: clamp(32px, 4.5vw, 48px);
  background: var(--rr-paper, #fff);
  border: 1px solid rgba(246, 245, 241, 0.5);
  box-shadow: 0 18px 44px rgba(6, 34, 48, 0.28);
  padding: clamp(24px, 3.4vw, 44px);
}
@media (max-width: 640px) {
  .tlfrag-panel { padding: clamp(20px, 6vw, 28px); }
}
      `}</style>
    </section>
  );
}
