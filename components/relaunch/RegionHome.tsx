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
  /** Dedizierter Regional-Bereich: sichtbare, scannbare Ranking-Substanz
   *  (~400-700 Woerter regionaler Text, echte Referenz-Karten, Vor-Ort-Logistik).
   *  Traegt die region-spezifische Substanz, damit Google die Seite als eigene
   *  wertet und die bestehenden Impressions nicht verloren gehen. Kein generischer
   *  Preis-/Prozess-Text (der lebt auf /preise, /leistungen). */
  regionalBlock: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    reachLine: string;
    proof: { name: string; ort: string; what: string; href?: string }[];
    logistikHeading: string;
    logistikText: string;
  };
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

      {/* Dedizierter Regional-Bereich: sichtbare, scannbare Ranking-Substanz.
          Kurze Absaetze + echte Referenz-Karten + Vor-Ort-Logistik. Traegt den
          region-spezifischen Unique-Content (Impressions-Schutz), ohne Textwand. */}
      <section className="rr rr-section">
        <div className="rr-wrap rr-narrow">
          <p className="rr-eyebrow" style={{ marginBottom: 16 }}>{region.regionalBlock.eyebrow}</p>
          <h2 className="rr-sub" style={{ marginBottom: 22, maxWidth: 780 }}>{region.regionalBlock.heading}</h2>
          <div className="rr-prose" style={{ display: "grid", gap: 18 }}>
            {region.regionalBlock.paragraphs.map((p, i) => (
              <p key={i} className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 18, lineHeight: 1.6 }}>{p}</p>
            ))}
            <p className="rr-body" style={{ fontSize: 18, lineHeight: 1.6 }}>{region.regionalBlock.reachLine}</p>
          </div>

          {/* Echte Referenz-Karten (Proof statt Prosa) */}
          <div className="rr-grid rr-grid-2" style={{ marginTop: 40 }}>
            {region.regionalBlock.proof.map((c) => (
              <div key={c.name} className="rr-card">
                <h3 className="rr-sub" style={{ marginBottom: 6, fontSize: 22 }}>{c.name}</h3>
                <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 15, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.ort}</p>
                <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17, marginBottom: c.href ? 14 : 0 }}>{c.what}</p>
                {c.href && (
                  <a className="rr-link" href={c.href} target="_blank" rel="noopener noreferrer">
                    {c.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Vor-Ort-Logistik (ehrlich, beantwortet "kommt ihr vor Ort") */}
          <div className="rr-card rr-card--surface" style={{ marginTop: 28 }}>
            <h3 className="rr-sub" style={{ marginBottom: 12, fontSize: 22 }}>{region.regionalBlock.logistikHeading}</h3>
            <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 18, lineHeight: 1.6 }}>{region.regionalBlock.logistikText}</p>
          </div>

          {/* Kontextuelle Links zu den geteilten Detailseiten (statt Preise zu duplizieren) */}
          <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 18, marginTop: 28 }}>
            Wie wir arbeiten, steht bei den <a className="rr-link" href="/leistungen">Leistungen</a>. Was es kostet, offen auf der <a className="rr-link" href="/preise">Preisseite</a>.
          </p>
        </div>
      </section>

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
