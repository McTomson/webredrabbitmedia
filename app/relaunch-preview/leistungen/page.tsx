import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog/posts';
import TalosPage from '@/components/relaunch/talos/TalosPage';
import { RabbitMark } from '@/components/relaunch/RabbitMark';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import FooterReassembly from '@/components/relaunch/FooterReassembly';
import JsonLd from '@/components/JsonLd';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

/**
 * Leistungen als TALOS-Scroll-Erlebnis (Preview, noindex). Server-Komponente:
 * aller Kapitel-Text ist SSR (Crawler/LLM + Fallback ohne JS/WebGL lesen alles).
 * Die 3D-Buehne (Three.js, eigenes Rendering, kein Spline-Player) laedt clientseitig
 * und nur auf faehigen Geraeten; schwache Geraete / reduced-motion sehen Poster +
 * normale Scroll-Reveals. Chrome wie die Tipps-Seite (RabbitMark, RelaunchMenu,
 * FooterReassembly). Die alte LeistungenStory/Hero-Version bleibt ungenutzt im Repo.
 */
export const metadata: Metadata = {
  title: 'Leistungen · Red Rabbit Media',
  description:
    'Deine Website bekommt einen Mitarbeiter: Talos passt auf, nimmt Anfragen an und sorgt für Sichtbarkeit. Fundament mit Hosting, Pflege und Klartext-Zahlen inklusive. Individuell gebaut, kein Baukasten.',
  robots: { index: false, follow: false },
};

export default async function LeistungenPreviewPage() {
  const posts = (await getAllPosts()).filter((p) => p.status === 'published');
  const articleCount = posts.length;

  const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

  return (
    <>
      {/* Service-Liste (ItemList) als JSON-LD — nur echte, belegbare Leistungen. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Leistungen von Red Rabbit Media',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@type': 'Service',
                name: 'Website',
                description:
                  'Individuell gebaute Website inklusive Hosting, Pflege, monatlichem Check und Zahlen im Klartext. Kein Baukasten, kein Wartungsvertrag.',
                provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@type': 'Service',
                name: 'Der Schreiber',
                description:
                  'Automatisierte Inhalte: Die Website erstellt regelmäßig neue Beiträge zum Handwerk des Betriebs, die per Klick freigegeben werden, für Sichtbarkeit bei Google und in Antwortmaschinen.',
                provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                '@type': 'Service',
                name: 'Der Empfang',
                description:
                  'Termine buchen sich online, Anfragen werden angenommen und beantwortet, wahlweise als Vorschlag zur Freigabe oder im Autopilot.',
                provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              },
            },
            {
              '@type': 'ListItem',
              position: 4,
              item: {
                '@type': 'Service',
                name: 'Maßarbeit',
                description:
                  'Individuell programmierte Shops, Kundenportale, Rechner und Schnittstellen. Kein Baukasten.',
                provider: { '@type': 'Organization', name: 'Red Rabbit Media' },
              },
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

      {/* Rote Hasen-Marke oben links (NICHT auf Talos' Brust — nur die kleine
          UI-Wortmarke der Seite, Link zur Startseite). */}
      <Link
        href="/relaunch-preview"
        aria-label="Zur Startseite"
        style={{
          position: 'fixed',
          top: 'clamp(18px, 2.4vw, 34px)',
          left: 'var(--rr-gutter, clamp(20px, 4vw, 64px))',
          zIndex: 43,
          display: 'block',
          lineHeight: 0,
        }}
      >
        <RabbitMark style={{ display: 'block', width: 'clamp(18px, 1.8vw, 21px)', height: 'auto' }} />
      </Link>

      {/* Hamburger-Menue der Hauptseite; .rr-Wrapper liefert nur Font-Variablen. */}
      <div className={rrFonts} style={{ background: 'transparent' }}>
        <RelaunchMenu />
      </div>

      {/* TALOS: Scroll-Praesentation (3D-Buehne + SSR-Kapiteltext). */}
      <div className={rrFonts} style={{ background: '#ffffff' }}>
        <TalosPage articleCount={articleCount} />
      </div>

      {/* Footer der Hauptseite (opak, deckt die fixe Buehne beim Herunterscrollen). */}
      <div className={rrFonts} style={{ background: 'transparent', position: 'relative', zIndex: 2 }}>
        <FooterReassembly />
      </div>
    </>
  );
}
