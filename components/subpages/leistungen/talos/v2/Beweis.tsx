import fs from 'node:fs';
import path from 'node:path';

/**
 * Beweis — Spec Station 6b. Zaehlt content/blog/ live (fs.readdirSync in der
 * Komponentenfunktion, nicht auf Modulebene, fuer Dev-Hot-Reload-Konsistenz
 * mit dem Rest der Unterseiten). Regel aus dem Auftrag: "über 100 Beiträge"
 * NUR wenn die echte Zahl das hergibt, sonst ohne Zahl. Stand 22.07.: 26
 * Dateien in content/blog/ -> unter 100 -> bewusst OHNE erfundene Zahl.
 */
export default function Beweis() {
  let showCount = false;
  try {
    const blogDir = path.join(process.cwd(), 'content/blog');
    const count = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx')).length;
    showCount = count > 100;
  } catch {
    showCount = false;
  }

  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Der Beweis</p>
        <h2 className="rr-statement tl-title">Diese Seite ist der Beweis.</h2>
        <p className="rr-body-lg tl-lead">
          Was wir dir versprechen, machen wir zuerst mit uns selbst.{' '}
          {showCount
            ? 'Unsere eigene Artikel-Maschine hat bis heute über 100 Beiträge geschrieben, verteilt und uns damit sichtbar gemacht.'
            : 'Unsere eigene Artikel-Maschine schreibt und verteilt für uns selbst, jede Woche, und macht uns damit sichtbar.'}
        </p>
        <p className="tl-beweis__quote">
          „Was ich für dich tue, tue ich hier schon jeden Tag.“
        </p>
      </div>
    </section>
  );
}
