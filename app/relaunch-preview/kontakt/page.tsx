import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import KontaktDemoClient from '@/components/subpages/KontaktDemoClient';
import RelaunchMenu from '@/components/relaunch/RelaunchMenu';
import { crimson, dmsans, fraunces, grotesk } from '@/lib/relaunch/fonts';
import '@/app/styleguide/styleguide.css';

// Rohteile der Kontakt-Seite (Template = ueber-uns-demo, Inhalte Kontakt).
// WICHTIG: Reads muessen IN der Komponente passieren (pro Request), nicht auf
// Modulebene — Next watched fs-Reads nicht, Edits an demo.* waeren im Dev-Server
// sonst unsichtbar bis zum Neustart (Lesson vom 14.07., ueber-uns).
const DEMO_DIR = path.join(process.cwd(), 'components/subpages/kontakt-demo');
const readDemo = (f: string) => fs.readFileSync(path.join(DEMO_DIR, f), 'utf8');

export const metadata: Metadata = {
  title: 'Kontakt · Red Rabbit Media',
  description:
    'Erzähl uns kurz, wo es hakt. Kein Verkaufsanruf, kein Newsletter: wir lesen, schauen uns deinen Betrieb an und schreiben dir zurück.',
  robots: { index: false, follow: false },
};

export default function KontaktPage() {
  const css = readDemo('demo.css');
  const html = readDemo('demo.body.html');
  const js = readDemo('demo.engine.jstext');
  return (
    <>
      {/* Fonts wie in der Demo (DM Sans, Instrument Sans, Crimson Pro). */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Crimson+Pro:ital,wght@0,500;1,500&display=swap"
      />
      {/* Hamburger-Menue der Hauptseite. Wrapper liefert NUR die .rr-Font-Variablen
          fuer das styled-jsx-gekapselte Menue; der Demo-Inhalt bleibt bewusst
          AUSSERHALB des .rr-Scopes (keine Style-Leaks in demo.css). */}
      <div
        className={`rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}
        style={{ background: 'transparent' }}
      >
        <RelaunchMenu />
      </div>
      <KontaktDemoClient css={css} html={html} js={js} />
    </>
  );
}
