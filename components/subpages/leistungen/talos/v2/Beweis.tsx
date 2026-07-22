import fs from 'node:fs';
import path from 'node:path';

/**
 * Beweis — Copy aus docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md, Sektion
 * 8. Zaehlt content/blog/ live (fs.readdirSync in der Komponentenfunktion,
 * nicht auf Modulebene, fuer Dev-Hot-Reload-Konsistenz mit dem Rest der
 * Unterseiten) und traegt die echte Zahl in den Fliesstext ein (Platzhalter
 * {articleCount} aus der Spec), statt der pauschalen "über 100"-Aussage der
 * alten Fassung. Bestehende articleCount-Logik beibehalten (nur die Zahl
 * selbst, kein Schwellenwert-Text mehr noetig).
 */
export default function Beweis() {
  let articleCount = 0;
  try {
    const blogDir = path.join(process.cwd(), 'content/blog');
    articleCount = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx')).length;
  } catch {
    articleCount = 0;
  }

  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Beweis</p>
        <h2 className="rr-statement tl-title">Diese Seite hier ist der Beweis.</h2>
        <p className="rr-body-lg tl-lead">
          Was wir dir versprechen, machen wir zuerst mit uns selbst. Die
          Beiträge auf unserer eigenen Seite werden von genau diesem Kollegen
          geschrieben und verteilt. Bis heute sind das {articleCount} Stück,
          und sie haben uns sichtbar gemacht.
        </p>
        <p className="tl-says">
          Was ich für dich tun soll, mache ich hier jeden Tag schon selbst.
        </p>
      </div>
    </section>
  );
}
