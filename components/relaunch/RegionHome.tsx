"use client";

import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import BackToTop from "@/components/relaunch/BackToTop";
import HomeMorph from "@/components/relaunch/HomeMorph";
import CasePanels, { THEMES, type Theme } from "@/components/relaunch/CasePanels";
import HomeClosing from "@/components/relaunch/HomeClosing";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import ScrollExperience from "@/components/relaunch/ScrollExperience";
import Faq, { type FaqItem } from "@/components/relaunch/Faq";
import { SCENE_TEXTS } from "@/lib/relaunch/morph/scene-content";

/**
 * Region-Variante der Homepage (Bundesland-Landingpages, Thomas 09.08.).
 * BASIS = die echte Home-Komposition (HomeMorph -> CasePanels -> Regional-FAQ ->
 * HomeClosing -> Footer). Regionalisiert wird NUR ueber die Content-Props der
 * bereits vorhandenen Bausteine (safe: die Home selbst ruft sie ohne Props und
 * bleibt unveraendert). So sieht Google jede Region als eigene, inhaltlich
 * unterschiedliche Seite statt als Home-Kopie. Spec: docs/BUNDESLAND_SEO_GEO_RESEARCH.md.
 *
 * Diese Client-Komponente baut die Themes/Szenen im Client-Scope (die Beweis-
 * Kachel traegt JSX), damit nichts ueber die Server/Client-Grenze bricht. Das
 * H1 + Schema + Metadata liefert die Server-Seite drumherum.
 */

export type RegionContent = {
  name: string;
  /** Ueberschreibt die KI-Szene ("besten Betrieb der <Region>"). */
  kiStatement: string;
  /** Regionaler Problem-Text (langer Absatz im Problem-Panel). */
  problemBody: string;
  /** Regionaler Beweis-Einstieg (nennt echte regionale Kunden). */
  beweisIntro: string;
  /** Eyebrow ueber der FAQ, z. B. "Haeufige Fragen aus der Steiermark". */
  faqEyebrow: string;
  /** Regionale FAQ (SSR-crawlbar, eigenes FAQPage-Schema). */
  faq: FaqItem[];
  /** Abschluss-CTA-Zeilen. */
  closingLines: string[];
};

export default function RegionHome({ region }: { region: RegionContent }) {
  const sceneTexts = SCENE_TEXTS.map((s) =>
    s.key === "ki" ? { ...s, statement: region.kiStatement } : s,
  );

  const themes: Theme[] = THEMES.map((t) => {
    if (t.key === "problem") {
      return {
        ...t,
        windows: t.windows.map((w) =>
          typeof w.body === "string" ? { ...w, body: region.problemBody } : w,
        ),
      };
    }
    if (t.key === "beweis") {
      return {
        ...t,
        windows: t.windows.map((w, i) =>
          i === 0 ? { ...w, body: region.beweisIntro } : w,
        ),
      };
    }
    return t;
  });

  return (
    <>
      <RelaunchMenu />
      <CornerLogo />
      <BackToTop />

      {/* Hero + 5 Leistungs-Szenen (KI-Szene regionalisiert) */}
      <HomeMorph sceneTexts={sceneTexts} />

      {/* Atempause wie auf der Home */}
      <div aria-hidden style={{ height: "var(--rr-section-y)" }} />

      {/* Problem / Loesung / Beweis (Problem + Beweis regionalisiert) */}
      <CasePanels themes={themes} />

      {/* Regionale FAQ (Zusatzblock ggue. Home: echte regionale Fragen, GEO-zitierfaehig) */}
      <section className="rr rr-section" style={{ background: "var(--rr-surface)" }}>
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 12 }}>{region.faqEyebrow}</p>
          <Faq items={region.faq} id={`faq-${region.name.toLowerCase()}`} />
        </div>
      </section>

      {/* Zahlen/Kundenliste + Abschluss-CTA (CTA regionalisiert) */}
      <HomeClosing closingLines={region.closingLines} />

      {/* Footer mit Wortmarken-Reassembly */}
      <div data-rr-snap>
        <FooterReassembly />
      </div>

      <ScrollExperience />
    </>
  );
}
