import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import WebsiteDemoClient from '@/components/subpages/WebsiteDemoClient';
// Fundament-Sektion = Variante A "Sticky-Ledger mit wanderndem Fokus"
// (Thomas' Wahl 21.07. aus /fundament-varianten; ersetzt das Karten-Grid).
import Fundament from '@/components/subpages/leistungen/website/v2/fundament-varianten/VarianteA';
import ReferenzenTeaser from '@/components/subpages/leistungen/website/v2/ReferenzenTeaser';
import Ablauf from '@/components/subpages/leistungen/website/v2/Ablauf';
// Drei Stufen = Variante B "Feature-Matrix mit Sticky-Stufe" (Thomas' Wahl
// 21.07. aus /stufen-varianten; ersetzt die Editorial-Rows von DreiStufen).
import DreiStufenMatrix from '@/components/subpages/leistungen/website/v2/DreiStufenMatrix';
// Talos-Sektion = Dashboard-Variante A "Browser-Frame" mit Fixes (Thomas'
// Wahl 21.07. aus /dashboard-varianten; ersetzt KollegeAnreisser).
import TalosDashboard from '@/components/subpages/leistungen/website/v2/TalosDashboard';
// "Was Kunden sagen" = die neue Hub-Sektion, 1:1 wiederverwendet (Thomas 21.07.).
import KundenSagen from '@/components/subpages/leistungen/KundenSagen';
import WebsiteFaq from '@/components/subpages/leistungen/website/WebsiteFaq';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';
import '@/components/subpages/leistungen/website/website.css';

/**
 * Leistungen — Website ("Der Bau"), Preview, noindex — Server-Komponente
 * nach docs/UNTERSEITEN_STIL.md, Muster 1:1 aus dem frisch gebauten Hub
 * (app/leistungen/page.tsx). Reines Produkt: Website neu
 * bauen oder relaunchen, Fixpreis, kein Baukasten, gehoert dir. Bewusst KEIN
 * Talos/3D auf dieser Seite (das ist /leistungen/talos vorbehalten) und
 * KEINE Preise (jeder Preis-Bezug verweist auf /preise).
 *
 * Copy 1:1 aus scratchpad/leistungen-copy.md Abschnitt B — Open Loop: der
 * Hero fragt "du hast schon eine Website, warum ruft keiner an", aufgeloest
 * im Schluss-CTA ("eine Website muss mehr sein als schoen").
 *
 * Chrome (RabbitMark/RelaunchMenu/FooterReassembly, Fonts, styleguide.css)
 * identisch zum Hub uebernommen (UNTERSEITEN_STIL.md §1).
 */
export const metadata: Metadata = {
  title: 'Website erstellen lassen, ohne abhängig zu werden.',
  description:
    'Jede Änderung über die Agentur, jede Rechnung dazu? Muss nicht sein. Deine Seite gehört dir, samt Helfer, der rund um die Uhr zeigt, was los ist.',
  alternates: { canonical: '/leistungen/website' },
};

export default function LeistungenWebsitePreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Volle geklonte Scroll-Strecke (Hero + Story/Haltung/FAQ/CTA bereits
  // enthalten) aus components/subpages/website-demo/. Reads pro Request
  // (IN der Komponentenfunktion, nicht auf Modulebene) fuer Dev-Hot-Reload.
  const heroDir = path.join(process.cwd(), 'components/subpages/website-demo');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroHtml = fs.readFileSync(path.join(heroDir, 'demo.body.html'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');

  return (
    <>
      {/* Organization + Service (Website) als JSON-LD. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://web.redrabbit.media/#organization',
              name: 'Red Rabbit Media',
              url: 'https://web.redrabbit.media',
            },
            {
              '@type': 'Service',
              name: 'Website',
              description:
                'Individuell gebaute Website inklusive Design, Hosting, mobiler Optimierung, rechtssicherer Umsetzung, Kontaktformular und Grund-SEO. Neu erstellt oder als Relaunch, zu einem Fixpreis, Entwurf ohne Vorkasse.',
              provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              areaServed: 'AT',
            },
          ],
        }}
      />

      {/* LCP-Poster mobil frueh laden (Thomas 04.08.), nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/website-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />

      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />
      <BackToTop />

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* 1 · Hero = die ueber-uns-Malmechanik, aber hero-only (Wort "Website" +
          Wisch + Zahnrad-Figur comp={0} + Story-Spalte). Demo-Inhalt bewusst
          AUSSERHALB des .rr-Font-Scopes (kein Style-Leak in demo.css), wie bei
          der ueber-uns-Seite. Story/Haltung/FAQ/CTA sind jetzt echte
          React-Sektionen darunter (rr-*-Bauteile). */}
      {/* data-rr-snap-exempt: eigene Scroll-Dramaturgie, kein Soft-Snap darin.
          ZUSAETZLICH data-rr-snap auf demselben Element (von ScrollExperience.tsx
          bewusst erlaubt, siehe deren Kommentar zum Track-Root): ein Scroll, der
          von OBEN in die Szene hineinlaeuft, haelt einmal an ihrem Anfang, bevor
          die Wisch/Zahnrad-Animation losgeht (Thomas 29.07., "erstens stehen
          bleiben"). Die vier Ehrlich-gesagt-Statements bekommen ihre eigenen
          Zwischenstopps ueber window.__rrDynamicSnapTops (siehe demo.engine). */}
      <div data-rr-snap-exempt data-rr-snap>
        <WebsiteDemoClient css={heroCss} html={heroHtml} js={heroJs} />
      </div>

      {/* 2-9 · Inhalts-Sektionen, echte rr-*-Bauteile im .rr-Font-Scope.
          Dramaturgie: nach dem Hero-Hook direkt in die Fakten (Ablauf/
          Fundament/Stufen), unten der Beweis-Block (Testimonials, Referenzen).
          SoBauenWir ("kein Baukasten") und die eigenstaendige Diagnose sind
          ENTFERNT (Thomas 06.08., "Desktop 1:1 wie Mobile"): Der Fragebogen
          kommt jetzt ueberall nur noch ueber den Button "Welches Paket passt
          zu mir?" bei den 3 Paketen (DreiStufenMatrix -> Diagnose als Popup).

          GRUND-RHYTHMUS (Kunde 29.07., Regel docs/DESIGN_STANDARD.md):
          Grundflaeche ist Off-White #F4F4F2, reines Weiss NUR als bewusste
          Wechsel-Flaeche und nie zweimal hintereinander. Zuordnung:
            Ablauf            WEISS      (Prozess-Strecke, Wechsel 1)
            Fundament         Off-White  (in der Komponente)
            DreiStufenMatrix  WEISS      (Feature-Matrix, Wechsel 2)
            TalosDashboard    Off-White  (in der Komponente)
            KundenSagen       WEISS      (Beweis-Block, Wechsel 3)
            ReferenzenTeaser  Off-White  (erbt)
            WebsiteFaq        WEISS      (Frage-Antwort-Papier, Wechsel 4)
            SiteClosing       Off-White  (in der Komponente) */}
      <div
        className={rrFonts}
        style={{ background: 'var(--rr-surface, #f4f4f2)', position: 'relative', zIndex: 2 }}
      >
        <div data-rr-snap style={{ background: 'var(--rr-paper, #ffffff)' }}>
          <Ablauf />
        </div>
        <div data-rr-snap>
          <Fundament />
        </div>
        <div data-rr-snap>
          <DreiStufenMatrix />
        </div>
        <div data-rr-snap>
          <TalosDashboard />
        </div>
        {/* Vollbild-Sektionen auf Mobile (Thomas 01.08.): min-height 100svh +
            vertikal zentriert ueber den Wrapper (rr-fullscreen-mobile). Nur
            Nicht-gepinnte Inhalts-Sektionen; Ablauf + TalosDashboard sind
            gepinnte Track-Szenen und bleiben ausgenommen. */}
        <div data-rr-snap className="rr-fullscreen-mobile" style={{ background: 'var(--rr-paper, #ffffff)' }}>
          <KundenSagen />
        </div>
        <div data-rr-snap className="rr-fullscreen-mobile">
          <ReferenzenTeaser />
        </div>
        <div data-rr-snap className="rr-fullscreen-mobile" style={{ background: 'var(--rr-paper, #ffffff)' }}>
          <WebsiteFaq />
        </div>
        <div className="rr-fullscreen-mobile">
          <SiteClosing
            lines={[
              'Gefunden werden ist der Anfang.',
              'Was deine Website danach für dich erledigt, zeigen wir dir gern.',
              'Reden wir.',
            ]}
          />
        </div>
      </div>

      <div className={rrFonts} data-rr-snap style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>

      {/* Site-weites Scroll-Gefuehl: Lenis + Soft-Snap (Thomas 28.07.). */}
      <ScrollExperience />
    </>
  );
}
