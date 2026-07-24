import FragTalos from '@/components/relaunch/talos/FragTalos';

/**
 * "Frag Talos" — Anmoderation vor dem bestehenden 5-Fragen-Assistenten
 * (Copy v2 Sektion 9). Der Assistent selbst (components/relaunch/talos/
 * FragTalos.tsx) wird UNVERAENDERT eingebunden; sein Look wird hier nur
 * ueber SCOPED CSS-Overrides (.rr .tlfrag-section .ft-*) auf den blauen
 * Grund gebracht.
 *
 * VOLLFLAECHIGE Blau-Sektion (Thomas 24.07.) im Look des Quiz "Sag uns, wer
 * du bist" (components/subpages/leistungen/website/v2/Diagnose.tsx, dort
 * Teal-Welt) — hier in BLAU (#0a72a0, das etablierte, barrierefreie --blue).
 * Der Assistent sitzt OHNE weisse Panel-Box DIREKT auf dem Blau: die
 * Antwort-Reihen sind durchscheinende, umrandete Zeilen (Rahmen Off-White,
 * Hover-Fuellung), Text Off-White #f6f5f1. HARTE REGEL: niemals Rot auf Blau
 * — alle roten Elemente aus FragTalos (Start-Button, Fortschritt, Ergebnis-
 * Label, Buttons) sind scoped auf Off-White/Tuerkis umgestellt.
 *
 * Komposition (Thomas 24.07.): ruhiger, ausgewogen, Text/Quiz in einer
 * linken Spalte — die Sektion hat eine fixe 3D-Talos-Ebene DARUEBER, die
 * rechts steht (data-talos-anchor 0.8). Deshalb bleibt die rechte Haelfte
 * bewusst frei; die Ueberschrift ist bewusst kleiner gesetzt als das
 * volle rr-statement.
 */
export default function FragTalosAnmoderation() {
  return (
    <section className="rr-section tl-section tl-frag tlfrag-section">
      <div className="rr-wrap rr-narrow">
        <div className="tlfrag-col">
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

          <div className="tlfrag-quiz">
            <FragTalos />
          </div>
        </div>
      </div>

      <style>{`
.tlfrag-section { background: #0a72a0; }

/* Linke Spalte: die 3D-Talos-Ebene steht rechts (data-talos-anchor 0.8),
   darum bleibt die rechte Haelfte frei. Text + Quiz teilen sich eine
   ruhige, ausgewogene Spalte. */
.rr .tlfrag-section .tlfrag-col { max-width: 640px; }

/* Eyebrow-Klammerstil (wd-eyebrow) bleibt, Farbe auf Blau in Tuerkis:
   Markenrot vibriert auf Blau. 3-Klassen-Spezifitaet schlaegt die
   .rr .wd-eyebrow-Basis unabhaengig von der Ladereihenfolge. */
.rr .tlfrag-section .wd-eyebrow { color: #39c2d7; }

/* Headline ruhiger: das volle rr-statement (bis 92px) wirkt hier zu
   dominant (Thomas 24.07.) und braucht Platz fuer Talos. Kleiner + Off-White.
   3-Klassen-Spezifitaet, sonst schlaegt .rr .tl-title/.rr-statement die Werte. */
.rr .tlfrag-section .tl-title {
  color: #f6f5f1;
  font-size: clamp(28px, 3.1vw, 48px);
  line-height: 1.08;
  max-width: 15em;
  margin-bottom: clamp(18px, 2.4vw, 24px);
}
.rr .tlfrag-section .tl-lead { color: rgba(246, 245, 241, 0.85); max-width: 560px; }

/* ---- FragTalos DIREKT auf Blau (kein weisses Panel), im Diagnose-Look.
   Alle Overrides scoped ueber .rr .tlfrag-section .ft-* (3 Klassen), damit
   FragTalos.tsx SELBST unveraendert bleibt (wird evtl. woanders genutzt).
   Off-White = #f6f5f1, Akzent = Tuerkis #39c2d7. NIE Rot auf Blau. ---- */

.rr .tlfrag-section .tlfrag-quiz { max-width: 620px; }

/* Start-Button (war rot) -> primaerer Off-White-Button, dunkler Text. */
.rr .tlfrag-section .ft-start {
  background: #f6f5f1;
  color: var(--rr-ink, #23262e);
  border-color: transparent;
  box-shadow: 0 10px 26px rgba(6, 34, 48, 0.24);
}
.rr .tlfrag-section .ft-start:hover { background: #ffffff; }
.rr .tlfrag-section .ft-start:focus-visible {
  outline: 2px solid #39c2d7;
  outline-offset: 3px;
}

/* Fortschritt: Label Off-White, Schiene durchscheinend, Balken Tuerkis. */
.rr .tlfrag-section .ft-progress-label { color: rgba(246, 245, 241, 0.75); }
.rr .tlfrag-section .ft-progress-track { background: rgba(246, 245, 241, 0.22); }
.rr .tlfrag-section .ft-progress-bar { background: #39c2d7; }

/* Frage Off-White. */
.rr .tlfrag-section .ft-question { color: #f6f5f1; }

/* Antwort-Reihen: durchscheinend + umrandet DIREKT auf dem Blau, mit
   Buchstaben-Marker (a/b/c) wie in Diagnose. */
.rr .tlfrag-section .ft-choices { counter-reset: tlfragopt; }
.rr .tlfrag-section .ft-choice {
  display: flex;
  align-items: baseline;
  gap: 16px;
  color: #f6f5f1;
  background: rgba(0, 0, 0, 0.14);
  border-color: rgba(246, 245, 241, 0.28);
  box-shadow: none;
}
.rr .tlfrag-section .ft-choice::before {
  counter-increment: tlfragopt;
  content: counter(tlfragopt, lower-alpha);
  flex: none;
  font-family: var(--rr-font-ui, inherit);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #39c2d7;
}
.rr .tlfrag-section .ft-choice:hover {
  border-color: rgba(246, 245, 241, 0.6);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: none;
}
.rr .tlfrag-section .ft-choice:focus-visible {
  outline: 2px solid #39c2d7;
  outline-offset: 3px;
}

/* Ergebnis: Label Tuerkis (war rot), Karten als durchscheinende Reihen mit
   Tuerkis-Kante (war weisse Karte mit roter Kante), Text Off-White. */
.rr .tlfrag-section .ft-result-lead { color: #39c2d7; }
.rr .tlfrag-section .ft-result-item {
  background: rgba(0, 0, 0, 0.14);
  border-color: rgba(246, 245, 241, 0.24);
  border-left: 3px solid #39c2d7;
}
.rr .tlfrag-section .ft-result-title { color: #f6f5f1; }
.rr .tlfrag-section .ft-result-text { color: rgba(246, 245, 241, 0.82); }

/* Talos-Sprechzeile im Ergebnis: Off-White (Border ist schon Tuerkis). */
.rr .tlfrag-section .ft-say { color: #f6f5f1; }

/* Ergebnis-Buttons: primaer Off-White (war rot), sekundaer Off-White-Ghost. */
.rr .tlfrag-section .ft-btn--red {
  background: #f6f5f1;
  color: var(--rr-ink, #23262e);
}
.rr .tlfrag-section .ft-btn--red:hover { background: #ffffff; }
.rr .tlfrag-section .ft-btn--ghost {
  color: #f6f5f1;
  border-color: rgba(246, 245, 241, 0.4);
}
.rr .tlfrag-section .ft-btn--ghost:hover { border-color: #f6f5f1; }
.rr .tlfrag-section .ft-btn:focus-visible {
  outline: 2px solid #39c2d7;
  outline-offset: 3px;
}
      `}</style>
    </section>
  );
}
