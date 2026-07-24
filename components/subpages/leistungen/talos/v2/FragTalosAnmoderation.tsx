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
 * bewusst frei.
 *
 * DARSTELLUNG 1:1 gegen die Quiz-Sektion der Website-Leistung abgeglichen
 * (components/subpages/leistungen/website/v2/Diagnose.tsx, Thomas 24.07.:
 * "bitte immer ueberpruefen nicht erfinden"). Eyebrow/Headline nutzen wie
 * dort nur die reinen rr-Basisklassen mit Farb-Override (volle
 * rr-statement-Groesse, keine erfundene Verkleinerung mehr); Subline,
 * Fragen-Kopf, Frage-Text und Antwort-Reihen (.ft-choice) sind wertgleich
 * zu den .wd-diag__*-Pendants aus Diagnose.tsx (Rahmen-/Hintergrund-Opacity,
 * padding, Zeilenabstand, Buchstaben-Marker, Hover-Sweep). Details je
 * Regel als Kommentar direkt bei der jeweiligen Klasse unten.
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
   .rr .wd-eyebrow-Basis unabhaengig von der Ladereihenfolge.
   Groesse/Gewicht/Letterspacing kommen unveraendert aus wd-eyebrow.css
   (0.72rem/700/.28em) -- exakt wie bei Diagnose (dort nur .wd-eyebrow--cream
   recolort genauso, keine Groesse angefasst). */
.rr .tlfrag-section .wd-eyebrow { color: #39c2d7; }
/* Diagnose hat KEINEN Abstand zwischen Eyebrow und Headline (beide margin:0,
   wd-diag__head selbst setzt keinen Gap) -- .tl-eyebrow bringt sonst
   ueberall auf der Seite 20px mit (talos-v2.css), hier auf 0 zurueckgesetzt. */
.rr .tlfrag-section .tl-eyebrow { margin: 0; }

/* Headline EXAKT wie Diagnose: .wd-diag__statement aendert an rr-statement
   NUR die Farbe (Rest = rr-fs-statement clamp(34px,4.46vw,92px), weight 500,
   line-height 1.11, letter-spacing -0.01em aus styleguide.css). Die zuvor
   hier erfundene kleinere Groesse (28-48px) war nur angenaehert (Thomas
   24.07.) -- jetzt 1:1 uebernommen, max-width/margin bleiben die
   Seiten-Basiswerte aus .tl-title (talos-v2.css, 16em / 0 0 clamp(20,3vw,28)). */
.rr .tlfrag-section .tl-title { color: #f6f5f1; }

/* Subline EXAKT wie .wd-diag__intro (Diagnose.tsx): eigene Groessen-Rezeptur,
   NICHT rr-body-lg (23px). max-width bleibt die hiesige Spalten-Breite
   (560px), weil die 3D-Talos-Ebene rechts steht -- das ist Layout, keine
   Diagnose-Typo-Groesse. */
.rr .tlfrag-section .tl-lead {
  max-width: 560px;
  margin-top: 22px;
  font-family: var(--rr-font-ui, inherit);
  font-size: clamp(1rem, 1.15vw, 1.15rem);
  line-height: 1.65;
  font-weight: 500;
  color: #ffffff;
}

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

/* Fragen-Kopf EXAKT wie .wd-diag__progress: Reihe gap 18px, margin-bottom
   20px (statt der Basis-16px/18px aus FragTalos.tsx). Label bekommt wie bei
   Diagnose die Akzentfarbe (dort --rr-world-1-accent Creme, hier Tuerkis)
   statt des bisherigen Off-White; Groesse/Gewicht/Letterspacing 1:1
   .wd-diag__progresslabel (0.78rem/700/.14em) -- Basis brachte 13px/650/.1em. */
.rr .tlfrag-section .ft-quiz-top { gap: 18px; margin-bottom: 20px; }
.rr .tlfrag-section .ft-progress-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #39c2d7;
}
/* Diagnose hat KEINEN Fortschrittsbalken (nur Text "Frage X von 3" + evtl.
   Zurueck-Button) -- FragTalos.tsx bringt strukturell einen Balken mit, den
   wir ohne Aenderung an FragTalos.tsx nicht entfernen. Farben folgen der
   Diagnose-Logik: Schiene = das dort tatsaechlich verwendete Off-White-
   Rahmen-Opacity 0.3 (wd-diag__opt border), Fuellung = Akzent Tuerkis
   wie der Balken/die Marker ueberall sonst in dieser Sektion. */
.rr .tlfrag-section .ft-progress-track { background: rgba(246, 245, 241, 0.3); }
.rr .tlfrag-section .ft-progress-bar { background: #39c2d7; }

/* Frage-Text EXAKT wie .wd-diag__question: weight 800 (Basis 700), Groesse
   clamp(1.5rem,2.6vw,2.2rem) (Basis clamp(1.25rem,2.2vw,1.7rem)), kein
   letter-spacing (Basis -.015em), margin-bottom clamp(20px,3vw,32px)
   (Basis fix 20px). line-height 1.12 war schon identisch. */
.rr .tlfrag-section .ft-question {
  color: #f6f5f1;
  font-weight: 800;
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  line-height: 1.12;
  letter-spacing: normal;
  margin-bottom: clamp(20px, 3vw, 32px);
}

/* Quiz-Slide-in wie .wd-diag__quiz (Diagnose): 0.34s ease, opacity+translateX.
   Spielt bei FragTalos nur beim ersten Erscheinen (Diagnose re-keyed die
   Frage pro Schritt fuer einen Replay -- FragTalos.tsx hat kein key={step},
   das kann ohne Aenderung an FragTalos.tsx nicht nachgezogen werden). */
.rr .tlfrag-section .ft-quiz { animation: tlfragSlide 0.34s ease both; }
@keyframes tlfragSlide {
  from { opacity: 0; transform: translateX(18px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Antwort-Reihen EXAKT wie .wd-diag__opt/.wd-diag__opts:
   - Reihenabstand (Spalte) 14px (Basis 12px)
   - align-items flex-start (Basis/Override vorher: baseline)
   - Rahmen rgba(246,245,241,.3) (Basis-Fix vorher .28)
   - Hintergrund rgba(0,0,0,.18) (Basis-Fix vorher .14)
   - padding 20px 22px (Basis 16px 20px)
   - Label-Typo: font-serif italic, clamp(1.05rem,1.35vw,1.32rem), line-height
     1.4, Farbe reines Weiss #fff (Basis-Fix vorher f6f5f1)
   - Hover: KEIN Lift (Diagnose hebt die Reihe nicht an, nur Rahmen +
     Vollflaechen-Fuellung, die von links reinzieht) -- transform hier
     explizit aufgehoben (Basis hat translateY(-2px)).
   Fuellfarbe: Diagnose nutzt eine eigene "tiefe" Weltfarbe (#0f5a63, ca. 64%
   Luminanz von --rr-world-1-bg #1d8c98) fuer den Sweep. Ein Blau-Pendant
   dazu ist im Repo nirgends definiert (nur --rr-world-3-bg #0a8aba, eine
   ANDERE, hier bewusst nicht verwendete Blau-Variante) -- daher per
   color-mix() im selben Verhaeltnis aus der hier gesetzten Sektionsfarbe
   #0a72a0 abgeleitet, statt einen neuen Hex-Wert zu erfinden. */
.rr .tlfrag-section .ft-choices { counter-reset: tlfragopt; gap: 14px; }
.rr .tlfrag-section .ft-choice {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-family: var(--rr-font-serif, Georgia, serif);
  font-style: italic;
  font-size: clamp(1.05rem, 1.35vw, 1.32rem);
  line-height: 1.4;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.18);
  background-image: linear-gradient(
    color-mix(in srgb, #0a72a0 64%, black),
    color-mix(in srgb, #0a72a0 64%, black)
  );
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0% 100%;
  border-color: rgba(246, 245, 241, 0.3);
  padding: 20px 22px;
  box-shadow: none;
  transition: border-color 0.28s ease, background-size 0.32s ease;
}
.rr .tlfrag-section .ft-choice::before {
  counter-increment: tlfragopt;
  content: counter(tlfragopt, lower-alpha);
  flex: none;
  padding-top: 6px;
  font-family: var(--rr-font-ui, inherit);
  font-style: normal;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #39c2d7;
}
/* Pfeil rechts wie .wd-diag__optarrow: unsichtbar in Ruhe, faehrt bei Hover
   ein. FragTalos.tsx hat kein eigenes Pfeil-Element -- als ::after
   nachgebaut (::before ist schon der Buchstaben-Marker). */
.rr .tlfrag-section .ft-choice::after {
  content: "\\2192";
  flex: none;
  align-self: center;
  font-family: var(--rr-font-ui, inherit);
  font-style: normal;
  font-size: 1.25rem;
  color: #39c2d7;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.rr .tlfrag-section .ft-choice:hover,
.rr .tlfrag-section .ft-choice:focus-visible {
  border-color: color-mix(in srgb, #0a72a0 64%, black);
  background-size: 100% 100%;
  transform: none;
  box-shadow: none;
}
.rr .tlfrag-section .ft-choice:hover::after,
.rr .tlfrag-section .ft-choice:focus-visible::after {
  opacity: 1;
  transform: translateX(0);
}
.rr .tlfrag-section .ft-choice:focus-visible {
  outline: 2px solid #39c2d7;
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .rr .tlfrag-section .ft-quiz { animation: none; }
  .rr .tlfrag-section .ft-choice,
  .rr .tlfrag-section .ft-choice::after {
    transition: none;
  }
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
