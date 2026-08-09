"use client";

import Link from "next/link";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import CornerLogo from "@/components/relaunch/CornerLogo";
import BackToTop from "@/components/relaunch/BackToTop";
import HomeMorph from "@/components/relaunch/HomeMorph";
import CasePanels, { THEMES, type Theme } from "@/components/relaunch/CasePanels";
import HomeClosing from "@/components/relaunch/HomeClosing";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import ScrollExperience from "@/components/relaunch/ScrollExperience";
import Faq, { type FaqItem } from "@/components/relaunch/Faq";
import TalosCompanionStageLazy from "@/components/relaunch/talos/TalosCompanionStageLazy";
import { SCENE_TEXTS } from "@/lib/relaunch/morph/scene-content";

/**
 * Region-Variante der Homepage (Bundesland-Landingpages, Thomas 09.08.).
 * BASIS = die echte Home-Komposition (HomeMorph -> CasePanels -> Regional-Bereich ->
 * FAQ -> HomeClosing -> Footer). Regionalisiert wird ueber die Content-Props der
 * vorhandenen Bausteine (safe: die Home ruft sie ohne Props und bleibt unveraendert).
 *
 * WICHTIG (Thomas 09.08.): KEIN Standort-Thema in der sichtbaren Copy. Wir deuten
 * nicht an, dass wir nicht in der Region sind. Statt "vor Ort/remote" -> Verfuegbarkeit
 * ("wir sind da, wenn du uns brauchst"). Statt verlinkter Fremd-Firmen -> anonyme
 * Vertrauenszeile. areaServed=Region bleibt still im Schema (Server-Seite).
 * Talos winkt rechts (data-talos-station, mobil klein via data-talos-mobile).
 * Spec: docs/BUNDESLAND_SEO_GEO_RESEARCH.md.
 */

export type RegionContent = {
  name: string;
  /** Ueberschreibt die KI-Szene ("besten ... der <Region>"). */
  kiStatement: string;
  /** Regionaler Problem-Text (langer Absatz im Problem-Panel). */
  problemBody: string;
  /** Regionaler Beweis-Einstieg. */
  beweisIntro: string;
  /** Dedizierter Regional-Bereich: sichtbare, scannbare Ranking-Substanz ohne
   *  Standort-Thema. Traegt den region-spezifischen Unique-Content. */
  regionalBlock: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    reachLine: string;
    /** Anonyme Vertrauenszeile (keine Firmennamen/Links). */
    trustLine: string;
    availabilityHeading: string;
    availabilityText: string;
  };
  /** Eyebrow ueber der FAQ. */
  faqEyebrow: string;
  /** Ueberschrift der FAQ (Themen-Label wie /preise "Preis und Ablauf."). */
  faqHeading: string;
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

  const rb = region.regionalBlock;

  return (
    <>
      <RelaunchMenu />
      <CornerLogo />
      <BackToTop />

      {/* Talos-Companion (rechts, winkt an der Regional-Station; mobil klein unten rechts).
          Lazy: three-spline liegt in eigenem Chunk, nicht im Initial-Bundle. */}
      <TalosCompanionStageLazy />

      {/* Hero + 5 Leistungs-Szenen (KI-Szene regionalisiert) */}
      <HomeMorph sceneTexts={sceneTexts} />

      {/* Atempause wie auf der Home */}
      <div aria-hidden style={{ height: "var(--rr-section-y)" }} />

      {/* Problem / Loesung / Beweis (Problem + Beweis regionalisiert) */}
      <CasePanels themes={themes} />

      {/* Dedizierter Regional-Bereich: scannbare Ranking-Substanz, kein Standort-Thema.
          data-talos-station = Talos gleitet hier rechts rein und winkt. */}
      <section
        className="rr rr-section"
        data-talos-station
        data-talos-anchor="0.84"
        data-talos-size="m"
        data-talos-appear="0.45"
        data-talos-gesture="wave2"
        data-talos-mobile="1"
        data-talos-mobile-anchor="0.82"
        data-talos-mobile-size="xs"
        data-talos-mobile-gesture="wave2"
      >
        <div className="rr-wrap rr-narrow">
          {/* Textspalte bewusst schmal + linksbuendig, damit Talos rechts frei bleibt
              (Thomas 09.08.: Text darf Talos nicht verdecken). Mobil ist Talos klein
              unten rechts, die Spalte darf voll breit sein. */}
          <div style={{ maxWidth: 600 }}>
            <p className="rr-eyebrow" style={{ marginBottom: 16 }}>{rb.eyebrow}</p>
            <h2 className="rr-sub" style={{ marginBottom: 24 }}>{rb.heading}</h2>
            <div className="rr-prose" style={{ display: "grid", gap: 18 }}>
              {rb.paragraphs.map((p, i) => (
                <p key={i} className="rr-body-lg" style={{ color: "var(--rr-ink-soft)" }}>{p}</p>
              ))}
              <p className="rr-body-lg">{rb.reachLine}</p>
            </div>

            {/* Anonyme Vertrauenszeile (keine Fremd-Firmen) */}
            <p
              className="rr-body"
              style={{ marginTop: 32, fontSize: 19, fontStyle: "italic", color: "var(--rr-ink)" }}
            >
              {rb.trustLine}
            </p>

            {/* Verfuegbarkeit statt Standort */}
            <div className="rr-card rr-card--surface" style={{ marginTop: 32 }}>
              <h3 className="rr-sub" style={{ marginBottom: 12, fontSize: 22 }}>{rb.availabilityHeading}</h3>
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 18, lineHeight: 1.6 }}>{rb.availabilityText}</p>
            </div>

            {/* Kontextuelle Links zu den geteilten Detailseiten (statt Preise zu duplizieren) */}
            <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 18, marginTop: 32 }}>
              Wie wir arbeiten, steht bei den <Link className="rr-link" href="/leistungen">Leistungen</Link>. Was es kostet, offen auf der <Link className="rr-link" href="/preise">Preisseite</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Regionale FAQ — Design 1:1 wie /preise (PreiseFaq): zweispaltig, sticky
          Themen-Label links, Accordion rechts. Position bleibt hier (weit unten,
          direkt vor dem Abschluss-CTA) wie auf /preise. Eigenes FAQPage-Schema
          liefert die Faq-Komponente mit. */}
      <section className="rr-section rp-faq" data-rr-snap>
        <div className="rr-wrap rr-narrow rp-faq__grid">
          <div className="rp-faq__label">
            <p className="wd-eyebrow">{region.faqEyebrow}</p>
            <h2 className="rr-statement rp-faq__heading">
              {region.faqHeading}<span className="rp-faq__dot">.</span>
            </h2>
          </div>
          <div className="rp-faq__accordion">
            <Faq items={region.faq} id={`faq-${region.name.toLowerCase()}`} />
          </div>
        </div>

        {/* Gleiche Styles wie PreiseFaq.tsx (plain globales style-Tag, styled-jsx
            im Relaunch meiden — LESSONS_LEARNED.md). */}
        <style>{`
          .rp-faq { background: #ffffff; }
          .rp-faq__grid {
            display: grid;
            grid-template-columns: minmax(260px, 0.82fr) 1.18fr;
            gap: clamp(2.5rem, 6vw, 6.5rem);
            align-items: start;
          }
          .rp-faq__label { position: sticky; top: 14vh; }
          .rp-faq__heading { margin: 14px 0 0; color: var(--rr-ink); }
          .rp-faq__dot { color: var(--rr-red); }
          @media (max-width: 860px) {
            .rp-faq__grid { grid-template-columns: 1fr; gap: 2rem; }
            .rp-faq__label { position: static; }
          }
        `}</style>
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
