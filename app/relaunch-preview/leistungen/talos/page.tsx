import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import CornerLogo from '@/components/relaunch/CornerLogo';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import TalosDemoClient from '@/components/subpages/TalosDemoClient';
import TalosCompanionStage from '@/components/relaunch/talos/TalosCompanionStage';
import WerIstTalos from '@/components/subpages/leistungen/talos/v2/WerIstTalos';
import InklusiveDashboard from '@/components/subpages/leistungen/talos/v2/InklusiveDashboard';
import Faehigkeiten from '@/components/subpages/leistungen/talos/v2/Faehigkeiten';
import FreigabePrinzip from '@/components/subpages/leistungen/talos/v2/FreigabePrinzip';
import Onboarding from '@/components/subpages/leistungen/talos/v2/Onboarding';
import Kontrollraum from '@/components/subpages/leistungen/talos/v2/Kontrollraum';
import Beweis from '@/components/subpages/leistungen/talos/v2/Beweis';
import FragTalosAnmoderation from '@/components/subpages/leistungen/talos/v2/FragTalosAnmoderation';
import TalosFaqV2 from '@/components/subpages/leistungen/talos/v2/TalosFaqV2';
import TalosSchlussCta from '@/components/subpages/leistungen/talos/v2/TalosSchlussCta';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';
import '@/components/relaunch/subpages.css';
import '@/components/subpages/leistungen/wd-eyebrow.css';
import '@/components/subpages/leistungen/talos/v2/talos-v2.css';

/**
 * Leistungen — Talos ("der digitale Mitarbeiter"), Preview, noindex —
 * GERUEST-Fassung (Etappe "Geruest", 22.07.2026). War bewusst eine 1:1-Kopie
 * von app/relaunch-preview/leistungen/website/page.tsx (Ausgangslage laut
 * Auftrag); jetzt auf die neuen v2-Sektionen dieses Ordners umgebaut. Chrome
 * (RelaunchMenu/CornerLogo/FooterReassembly, Fonts, styleguide.css) 1:1 aus
 * der Kopie uebernommen.
 *
 * Bewusst NICHT angefasst (Aufraeumen folgt separat, laut Auftrag): die
 * alten Talos-Komponenten in components/subpages/leistungen/talos/* und
 * components/relaunch/talos/TalosPresentation.tsx bleiben unveraendert
 * liegen, nur nicht mehr von dieser Seite importiert.
 *
 * Kein Feindesign, kein 3D in dieser Etappe: TalosHeroPlaceholder und der
 * .tl-stage-slot in WerIstTalos sind Platzhalter fuer die spaetere
 * Walk-in-Hero-/Naeherkommen-Buehne (Orchestrator, naechste Etappe). Der
 * FragTalos-Port (Assistent-Logik + 5 Fragen aus der alten Seite) ist als
 * Etappe-4-Kommentar vorgemerkt, noch nicht eingebaut.
 *
 * JSON-LD: Service-Eintrag aus der alten Seite (git show HEAD, vor dieser
 * Aenderung) uebernommen und auf den neuen Sprachgebrauch angepasst
 * (digitaler Mitarbeiter statt Helfer/Dashboard, Fähigkeiten statt Module).
 */
export const metadata: Metadata = {
  title: 'Talos, der digitale Mitarbeiter in deiner Website (Preview) · Red Rabbit Media',
  description:
    'Talos ist der digitale Mitarbeiter, der in jeder Website von uns steckt: Anfragen auffangen, Beiträge schreiben, Zahlen in Klartext. Du gibst per Klick frei.',
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
              name: 'Talos, der digitale Mitarbeiter',
              serviceType: 'Website mit automatisierten, buchbaren Fähigkeiten',
              description:
                'Talos ist der digitale Mitarbeiter, der in jeder Website von uns steckt. Texte und Bilder selbst ändern, Zahlen in Klartext, Ausfall-Alarm, Hosting und Pflege sind in jeder Website inklusive. Fähigkeiten wie Der Schreiber, Der Empfang, Der Aussendienst, Der Social-Poster und Die Sichtbarkeit bucht man einzeln dazu, monatlich, jederzeit kündbar.',
              provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              areaServed: 'AT',
            },
          ],
        }}
      />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />

      {/* Ecken-Logo (rote Hasen-Marke oben links). */}
      <CornerLogo />

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* Der seitenweite Companion-Talos (fixe 3D-Ebene): macht den Hero-Walk-in
          und begleitet danach die Sektionen entlang der data-talos-station-Anker. */}
      <TalosCompanionStage />

      {/* Hero-Strecke: Wort "Talos" + Wisch-Reveal + 3D-Walk-in + Story-Text +
          Beruhigungs-Bumper (Belief-Szene) — alles in der geklonten Demo. */}
      <TalosDemoClient css={heroCss} html={heroHtml} js={heroJs} />

      {/* Inhalts-Sektionen, echte tl-*-Bauteile im .rr-Font-Scope auf Weiss.
          data-talos-station-Wrapper = Halte-Punkte des Companions (anchor =
          horizontale Position 0..1, size s/m/l/xl = Naehe/Groesse, gesture =
          einmalige Geste beim Ankommen). Feintuning mit Thomas. */}
      {/* Wrapper TRANSPARENT + z20: der Companion-Canvas schaltet pro Station
          zwischen z12 (hinter dem Text, Text lesbar) und z30 (vor der Flaeche,
          Kontrollraum/CTA). Weisser Grund kommt vom body. */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 20 }}>
        <div data-talos-station data-talos-anchor="0.78" data-talos-size="l" data-talos-appear="0.5" data-talos-layer="back">
          <WerIstTalos />
        </div>
        <InklusiveDashboard />
        <Faehigkeiten />
        {/* FreigabePrinzip MIT nickendem Talos (originalgetreu wiederhergestellt,
            Thomas 24.07. spaet: "der nickende Talos war sehr gut, stell ihn wieder
            her"). Nur ONBOARDING bleibt ohne Companion — DORT war Talos "zu frueh"
            (Bild 54), erst danach am Kontrollraum wieder zentriert. layer="back",
            weil weisse Sektion (kein Navy-Body-Cut) und Text links / Talos rechts. */}
        <div data-talos-station data-talos-anchor="0.82" data-talos-size="m" data-talos-gesture="nod" data-talos-layer="back">
          <FreigabePrinzip />
        </div>
        <Onboarding />
        <div data-talos-station data-talos-anchor="0.7" data-talos-size="m" data-talos-appear="0.55" data-talos-gesture="wink" data-talos-layer="front">
          <Kontrollraum />
        </div>
        {/* Beweis "front" (nicht back): sonst schneidet der Navy-Frame beim
            Uebergang Kontrollraum->Beweis den Koerper an (Thomas 24.07., Bild 48/49). */}
        <div data-talos-station data-talos-anchor="0.8" data-talos-size="m" data-talos-appear="0.45" data-talos-layer="front">
          <Beweis />
        </div>
        {/* FragTalos MIT Companion (front): Talos soll hier noch sichtbar sein
            und genau hier anfangen zu verschwinden (Thomas 24.07., Bild 56). */}
        <div data-talos-station data-talos-anchor="0.82" data-talos-size="m" data-talos-appear="0.45" data-talos-layer="front">
          <FragTalosAnmoderation />
        </div>
        <TalosFaqV2 />
        <div data-talos-station data-talos-anchor="0.17" data-talos-size="sm" data-talos-gesture="wave" data-talos-layer="front">
          <TalosSchlussCta />
        </div>
      </div>

      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
