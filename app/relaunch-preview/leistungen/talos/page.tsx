import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import CornerLogo from '@/components/relaunch/CornerLogo';
import BackToTop from '@/components/relaunch/BackToTop';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import TalosDemoClient from '@/components/subpages/TalosDemoClient';
import TalosCompanionStage from '@/components/relaunch/talos/TalosCompanionStageLazy';
import WerIstTalos from '@/components/subpages/leistungen/talos/v2/WerIstTalos';
import KennstDuDas from '@/components/subpages/leistungen/talos/v2/KennstDuDas';
import Bereiche from '@/components/subpages/leistungen/talos/v2/Bereiche';
import WertAnker from '@/components/subpages/leistungen/talos/v2/WertAnker';
import VorherNachher from '@/components/subpages/leistungen/talos/v2/VorherNachher';
import TalosTest from '@/components/subpages/leistungen/talos/v2/TalosTest';
import Faehigkeiten from '@/components/subpages/leistungen/talos/v2/Faehigkeiten';
import Kontrollraum from '@/components/subpages/leistungen/talos/v2/Kontrollraum';
import TalosFaqV2 from '@/components/subpages/leistungen/talos/v2/TalosFaqV2';
import SiteClosing from '@/components/relaunch/SiteClosing';
import ScrollExperience from '@/components/relaunch/ScrollExperience';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';
import '@/components/subpages/leistungen/talos/v2/talos-v2.css';

/**
 * Leistungen — Talos, Preview, noindex — PIVOT "Kommandozentrale"
 * (Thomas 07.08.2026): Talos wird als Kommandozentrale der Website erzaehlt
 * (selbst aendern + alles sehen + haelt sich von allein aktuell). Aufbau:
 * Hero (geklonte Demo-Strecke) -> KennstDuDas (Einfuehlung) -> WerIstTalos
 * (die Antwort) -> Bereiche (9 Karten, Herzstueck) -> Kontrollraum
 * (Live-Beleg) -> WertAnker (Rechnung + Haken-Klaerung) -> VorherNachher ->
 * TalosTest (Quiz) -> Faehigkeiten (optional dazubuchen) -> Bestand
 * (Freigabe, Onboarding, Beweis, FragTalos, FAQ, Closing).
 *
 * Aufraeumen folgt separat: alte Talos-Komponenten in components/subpages/
 * leistungen/talos/* und components/relaunch/talos/TalosPresentation.tsx
 * sowie die jetzt ungenutzten v2-Dateien InklusiveDashboard.tsx und
 * TalosHeroPlaceholder.tsx bleiben vorerst liegen (nicht mehr importiert).
 *
 * JSON-LD: Service-Eintrag auf den Kommandozentrale-Sprachgebrauch
 * angepasst; FAQPage-JSON-LD kommt weiter aus TalosFaqV2.
 */
export const metadata: Metadata = {
  title: 'Talos, die Kommandozentrale deiner Website (Preview) · Red Rabbit Media',
  description:
    'Talos steckt in jeder Website von uns: Texte und Bilder selbst ändern, Besucher und Klicks sehen, bei Google und ChatGPT gefunden werden, Alarm bei Ausfall. Alles an einem Ort.',
  robots: { index: false, follow: false },
};

export default function TalosLeistungPreviewPage() {
  const rrFonts = `rr ${dmsans.variable} ${crimson.variable} ${grotesk.variable}`;

  // Geklonte Scroll-Strecke (Wort-Zerlegung + Talos-Walk-in + Story +
  // Beruhigungs-Bumper) aus components/subpages/talos-demo/. Reads pro Request
  // (IN der Komponentenfunktion, nicht auf Modulebene) fuer Dev-Hot-Reload —
  // gleiches Muster wie die Website-Seite.
  const heroDir = path.join(process.cwd(), 'components/subpages/talos-demo');
  const heroCss = fs.readFileSync(path.join(heroDir, 'demo.css'), 'utf8');
  const heroHtml = fs.readFileSync(path.join(heroDir, 'demo.body.html'), 'utf8');
  const heroJs = fs.readFileSync(path.join(heroDir, 'demo.engine.jstext'), 'utf8');

  return (
    <>
      {/* Organization + Service (Talos) als JSON-LD. FAQPage-JSON-LD kommt
          automatisch aus der echten Faq-Komponente in TalosFaqV2
          (components/relaunch/Faq.tsx) — nicht doppeln. */}
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
              name: 'Talos, die Kommandozentrale deiner Website',
              serviceType: 'Website mit Kommandozentrale und buchbaren Fähigkeiten',
              description:
                'Talos steckt in jeder Website von uns. Die Kommandozentrale zeigt Besucher, Klicks, Suchbegriffe, Sichtbarkeit bei Google und ChatGPT, Bewertungen, Anfragen und die Technik-Gesundheit der Seite; Texte und Bilder ändert man selbst. Fähigkeiten wie Der Schreiber, Der Empfang und Der Sichtbarmacher bucht man einzeln dazu, monatlich, jederzeit kündbar.',
              provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              areaServed: 'AT',
            },
          ],
        }}
      />

      {/* LCP-Poster mobil frueh laden (Thomas 04.08.), nur Mobile/Tablet. */}
      <link rel="preload" as="image" href="/hero/talos-hero-poster.jpg" fetchPriority="high" media="(max-width: 1024px)" />

      {/* Ecken-Logo (rote Hasen-Marke oben links). */}
      <CornerLogo />
      <BackToTop />

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* Der seitenweite Companion-Talos (fixe 3D-Ebene): macht den Hero-Walk-in
          und begleitet danach die Sektionen entlang der data-talos-station-Anker. */}
      <TalosCompanionStage />

      {/* Hero-Strecke: Wort "Talos" + Wisch-Reveal + 3D-Walk-in + Story-Text +
          Beruhigungs-Bumper (Belief-Szene) — alles in der geklonten Demo. */}
      {/* data-rr-snap-exempt: eigene Scroll-Dramaturgie, kein Soft-Snap darin. */}
      <div data-rr-snap-exempt>
        <TalosDemoClient css={heroCss} html={heroHtml} js={heroJs} />
      </div>

      {/* Inhalts-Sektionen, echte tl-*-Bauteile im .rr-Font-Scope auf Weiss.
          data-talos-station-Wrapper = Halte-Punkte des Companions (anchor =
          horizontale Position 0..1, size s/m/l/xl = Naehe/Groesse, gesture =
          einmalige Geste beim Ankommen). Feintuning mit Thomas. */}
      {/* Wrapper TRANSPARENT + z20: der Companion-Canvas schaltet pro Station
          zwischen z12 (hinter dem Text, Text lesbar) und z30 (vor der Flaeche,
          Kontrollraum/CTA). Weisser Grund kommt vom body. */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 20 }}>
        {/* PIVOT Kommandozentrale (Thomas 07.08.): Einfuehlung zuerst — der
            Besucher erkennt sich in den fuenf Fragen wieder, DANN kommt die
            Antwort (WerIstTalos). Ohne Station: Talos ist nach dem Hero-Abgang
            hier noch nicht wieder da, die Fragen gehoeren dem Leser. */}
        <div data-rr-snap>
          <KennstDuDas />
        </div>
        <div data-rr-snap data-talos-station data-talos-anchor="0.78" data-talos-size="l" data-talos-appear="0.5" data-talos-layer="back">
          <WerIstTalos />
        </div>
        {/* Das neue Herzstueck: die 9 Bereiche der Kommandozentrale. Ohne
            Station (dichtes Karten-Raster, Talos wuerde Text verdecken). */}
        <div data-rr-snap>
          <Bereiche />
        </div>
        {/* Kontrollraum direkt nach den Bereichen: erst lesen, was er alles
            sieht — dann sehen, wie es aussieht (Live-Beleg). Station wie gehabt. */}
        <div data-rr-snap data-talos-station data-talos-anchor="0.7" data-talos-size="m" data-talos-appear="0.55" data-talos-gesture="wink" data-talos-layer="front">
          <Kontrollraum />
        </div>
        <div data-rr-snap>
          <WertAnker />
        </div>
        <div data-rr-snap>
          <VorherNachher />
        </div>
        <div data-rr-snap>
          <TalosTest />
        </div>
        <div data-rr-snap>
          <Faehigkeiten />
        </div>
        {/* GESTRICHEN (Thomas 07.08., "wir haben zu viel"): FreigabePrinzip
            (Botschaft steckt in Faehigkeiten-Modal + FAQ), Onboarding (Kernsatz
            wandert in die SiteClosing-Zeilen), FragTalosAnmoderation (widerspricht
            dem ehrlichen "Kommt bald" des Assistenten; kommt zurueck, wenn der
            Assistent real ist), Beweis (zweite Runde: "den Bereich geben wir
            auch weg"). Dateien bleiben fuer die Aufraeum-Etappe liegen. */}
        <div data-rr-snap>
          <TalosFaqV2 />
        </div>
        {/* Anchor 0.8 = Talos RECHTS, Text links (Thomas 07.08., Screenshot:
            bei 0.17 stand er ueber dem Text). */}
        <div data-rr-snap data-talos-station data-talos-anchor="0.8" data-talos-size="sm" data-talos-gesture="wave" data-talos-layer="front">
          <SiteClosing
            lines={[
              'Du hast Talos kennengelernt.',
              'Kein Aufwand für dich: er arbeitet sich selbst ein.',
              'Ob er auch für dich arbeitet, klärt ein kurzes Gespräch.',
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
