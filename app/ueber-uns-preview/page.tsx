import type { Metadata } from "next";
import Link from "next/link";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import AboutHero from "@/components/subpages/AboutHero";
import AboutRabbit from "@/components/subpages/AboutRabbit";
import HaltungAnchor from "@/components/subpages/HaltungAnchor";
import Reveal from "@/components/subpages/Reveal";
import "../styleguide/styleguide.css";
import "./ueber-uns.css";

export const metadata: Metadata = {
  title: "Über uns | Red Rabbit Media",
  description:
    "Red Rabbit Media ist die faire Anti-Agentur aus Österreich: Websites für den Mittelstand, Entwurf ohne Vorkasse, feste Preise, Anzahlung erst bei Zusage.",
  robots: { index: false, follow: false },
};

/**
 * Standard-Unterseite /ueber-uns-preview — Template-Blaupause fuer die Relaunch-
 * Unterseiten. Server Component: alle Inhalte (h1, Prosa, Statements, Zitat) sind
 * echter SSR-Text im DOM; die Client-Komponenten animieren nur per transform/opacity
 * darueber. Ganze Seite im .rr-Scope + drei Font-Variablen (DESIGN.md §7).
 */
export default function UeberUnsPreviewPage() {
  return (
    <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <RelaunchMenu />

      <main>
        {/* 1 · AUFTAKT — Wort-Zerfall + Serif-Reveal */}
        <AboutHero />

        {/* 2 · INTRO-PROSA */}
        <section className="rr-section uup-intro">
          <div className="rr-wrap">
            <Reveal>
              <p className="rr-eyebrow">Über Red Rabbit Media</p>
              <p className="uup-intro__lede">
                Wir holen Betriebe aus der digitalen Unsichtbarkeit. Persönlich,
                transparent, ohne Risiko.
              </p>
            </Reveal>
            <Reveal className="rr-prose" stagger>
              <p>
                Red Rabbit Media ist eine Webdesign-Agentur aus Österreich. Wir bauen
                Websites für den Mittelstand, für Handwerk, Gastronomie, Ärzte,
                Kanzleien und Dienstleister, die online endlich gefunden werden wollen.
                Kein Agentur-Sprech, keine Meeting-Marathons, keine intransparenten
                Stundensätze.
              </p>
              <p>
                Anti-Agentur heißt: Du siehst zuerst das Ergebnis. Den Entwurf bekommst
                du ohne Vorkasse, eine Anzahlung fällt erst an, wenn du zusagst. Feste
                Preise statt Überraschungen, ehrliche Empfehlungen statt Verkaufsshow.
                Wir arbeiten schnell, sagen dir klar, was Sinn ergibt und was nicht, und
                liefern eine Seite, die zu deinem Betrieb passt.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 3 · FIGUREN-SZENE — Hase */}
        <AboutRabbit />

        {/* 4 · HALTUNGS-ANKER */}
        <HaltungAnchor />

        {/* 5 · FARBWELT-PANEL — echtes Danesh-Testimonial (Teal, .rr-quote) */}
        <section className="rr-section">
          <div className="rr-wrap">
            <Reveal className="uup-quote__panel">
              <figure className="rr-quote">
                <p className="rr-quote__mark" aria-hidden="true">&ldquo;</p>
                <blockquote className="rr-quote__text">
                  Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die
                  Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde
                  detailliert eingegangen, und wir sind mit den Ergebnissen sehr
                  zufrieden! Danke!
                </blockquote>
                <figcaption className="rr-quote__attr">
                  <span className="rr-quote__name">Rafael Danesh</span>
                  <span className="rr-quote__stars" aria-label="5 von 5 Sternen">★★★★★</span>
                  <span className="rr-quote__src">Google-Rezension</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* 6 · ABSCHLUSS-CTA — Navy-Band + Kalligrafie-Echo */}
        <section className="rr-section uup-cta" style={{ position: "relative" }}>
          {/* Rote Kalligrafie-Schwuenge als stilles Echo im Weissraum */}
          <span className="uup-swish uup-swish--a" aria-hidden="true">
            <svg viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 82 C58 20 120 18 150 54 C168 76 150 104 124 98 C104 93 108 62 138 52 C176 39 214 52 234 30"
                stroke="currentColor" strokeWidth="6" strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="rr-wrap">
            <Reveal>
              <h2 className="uup-cta__title">Bereit für eine Seite, die arbeitet?</h2>
              <p className="uup-cta__sub">
                Erzähl uns kurz von deinem Betrieb. Der erste Entwurf kommt ohne
                Vorkasse, du entscheidest erst danach.
              </p>
              <Link href="/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
                Projekt anfragen
              </Link>
            </Reveal>
          </div>
          <span className="uup-swish uup-swish--b" aria-hidden="true">
            <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 40 C40 8 96 12 120 44 C134 62 118 86 98 78 C84 72 90 50 116 48 C150 45 176 62 194 84"
                stroke="currentColor" strokeWidth="5" strokeLinecap="round"
              />
            </svg>
          </span>
        </section>
      </main>
    </div>
  );
}
