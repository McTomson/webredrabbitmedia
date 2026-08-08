import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import UeberUnsDemoClient from '@/components/subpages/UeberUnsDemoClient';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

// Rohteile der 1:1 portierten Demo (scratchpad/ueber-uns-gesamt-demo.html).
// Werden beim Build (Static Generation) eingelesen und inline gebacken.
// WICHTIG: Reads muessen IN der Komponente passieren (pro Request), nicht auf
// Modulebene — Next watched fs-Reads nicht, Edits an demo.* waeren im Dev-Server
// sonst unsichtbar bis zum Neustart (so gingen ganze Fix-Runden "verloren").
const DEMO_DIR = path.join(process.cwd(), 'components/subpages/ueber-uns-demo');
const readDemo = (f: string) => fs.readFileSync(path.join(DEMO_DIR, f), 'utf8');

export const metadata: Metadata = {
  title: 'Über uns · Red Rabbit Media',
  description:
    'Die faire Anti-Agentur für den österreichischen Mittelstand. Wer wir sind und warum wir den ersten Schritt machen.',
  // Self-referencing canonical (Haus-Regel, siehe app/layout.tsx). Zeigt auf den
  // AKTUELLEN Preview-Pfad — sobald diese Seite die Platzhalter-/ueber-uns ersetzt,
  // hier auf '/ueber-uns' umstellen.
  alternates: { canonical: '/relaunch-preview/ueber-uns' },
};

// Person-Schema (EEAT), gleiche @id wie das Employee-Objekt in app/layout.tsx,
// damit Google/KI-Systeme EINE Entitaet erkennen statt zwei widerspruechlicher.
// Kein `image`-Feld: es existiert noch kein echtes Foto (Platzhalter-Pfad in der
// alten app/ueber-uns/page.tsx zeigt ins Leere) — lieber weglassen als auf ein
// 404 verweisen. Ergaenzen, sobald ein echtes Foto von Thomas da ist.
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://web.redrabbit.media/#thomas-uhlir',
  name: 'Thomas Uhlir MBA',
  jobTitle: 'Gründer & Strategie',
  url: 'https://web.redrabbit.media/relaunch-preview/ueber-uns',
  sameAs: ['https://www.linkedin.com/in/thomasuhlir/'],
  worksFor: { '@id': 'https://web.redrabbit.media/#organization' },
  knowsAbout: [
    'Webdesign',
    'Suchmaschinenoptimierung (SEO)',
    'Generative Engine Optimization (GEO)',
    'Conversion-Optimierung',
    'Webdesign Österreich',
  ],
};

// FAQPage-Schema, 1:1 gespiegelt aus components/subpages/ueber-uns-demo/demo.body.html
// (Sektion "scene-faq"). WICHTIG: Diese FAQ-Texte sind PROVISORISCH (Thomas 30.07.:
// "wir machen später aber alle faq und texte neu") — bei der Text-Ueberarbeitung
// MUSS dieses Array synchron mitgezogen werden, sonst zeigt Google veraltete Antworten.
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wer steht hinter Red Rabbit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ich, Thomas Uhlir. Ich habe Red Rabbit 2019 gegründet und bin die Person, mit der du redest, von der ersten Idee bis nach dem Launch. Für Grafik, Entwicklung, SEO und KI arbeite ich mit einem handverlesenen Netzwerk aus Spezialisten, die ich seit Jahren kenne.',
      },
    },
    {
      '@type': 'Question',
      name: 'Seit wann gibt es euch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seit 2019. In der Zeit sind über 164 Projekte entstanden, und auf Google stehen wir bei 5,0 Sternen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Arbeitet ihr nur in Wien?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nein. Unsere Kunden sitzen in 9 Bundesländern. Die meiste Arbeit passiert ohnehin remote, per Anruf oder Video, nicht im Meetingraum.',
      },
    },
    {
      '@type': 'Question',
      name: 'Warum nehmt ihr nicht jedes Projekt an?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Weil wir uns für jedes Projekt Zeit nehmen wollen. Wenn wir merken, dass wir jemandem nicht wirklich helfen können, sagen wir das lieber ehrlich, statt den Auftrag trotzdem anzunehmen. Zufriedenheit ist uns wichtiger als Menge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Was heißt Entwurf ohne Vorkasse?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du bekommst zuerst 1-2 grafische Vorschläge zu sehen, bevor du einen Euro bezahlst. Gefallen sie dir und sagst du zu, fällt eine Anzahlung an. Gefallen sie dir nicht, hast du nichts verloren. Das Risiko liegt bei uns, nicht bei dir.',
      },
    },
  ],
};

export default function UeberUnsPage() {
  const css = readDemo('demo.css');
  const html = readDemo('demo.body.html');
  const js = readDemo('demo.engine.jstext');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {/* Fonts wie in der Demo (DM Sans, Instrument Sans, Crimson Pro). */}
      {/* LCP-Poster mobil frueh laden (Thomas 04.08.): entfernt den Load-Delay,
          bis der Inline-Engine das Video baut. Nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/ueber-uns-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />
      {/* Hamburger-Menue der Hauptseite. Wrapper liefert NUR die .rr-Font-Variablen
          fuer das styled-jsx-gekapselte Menue; der Demo-Inhalt bleibt bewusst
          AUSSERHALB des .rr-Scopes (keine Style-Leaks in demo.css). */}
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: 'transparent' }}
      >
        <RelaunchMenu />
      </div>
      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />
      <BackToTop />
      {/* Stopps pro Szene: data-rr-snap/-exempt sitzen seit 29.07. direkt an
          den <section>-Tags im demo.body.html (Sticky-Szenen exempt, normale
          Szenen = Pflicht-Stopp-Ziele). Kein pauschaler Exempt mehr. */}
      <div>
        <UeberUnsDemoClient css={css} html={html} js={js} />
      </div>

      {/* Abschluss-Block + ECHTER Footer (28.07., Design-Vereinheitlichung):
          der Nachbau-Footer und der zentrierte Schluss-CTA im demo.body.html
          sind raus, hier stehen die gemeinsamen Bauteile. Wrapper liefert nur
          die .rr-Font-Variablen (Muster wie beim Menue oben). */}
      {/* Abschluss am Handy fensterhoch: site-weite Regel .rr-section.sc-full in
          styleguide.css (Thomas 02.08.) — kein Seiten-Sonderfall mehr noetig. */}
      <div className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <SiteClosing
          lines={[
            'Jetzt kennst du uns.',
            'Wir würden gern erfahren, was du vorhast.',
            'Reden wir.',
          ]}
        />
        <div data-rr-snap>
          <FooterReassembly />
        </div>
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />
    </>
  );
}
