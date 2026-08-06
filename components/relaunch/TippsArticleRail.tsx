"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * TippsArticleRail — rechte Sidebar des Artikel-Templates (Relaunch-Look).
 * Struktur nach Vorbild der Live-Artikelseite (app/tipps/[slug]): Ueber-uns-
 * Kasten, Inhaltsverzeichnis mit Scrollspy, Weiterlesen, darunter STICKY die
 * Analyse-/Kontakt-Box. Desktop-only (CSS blendet die Rail < 1100px aus;
 * Mobile bekommt TOC als <details> und die CTA-Box im Hauptfluss — Markup
 * dafuer liegt im Server-Template, nicht hier).
 *
 * Scrollspy: IntersectionObserver auf den h2/h3-Ankern im .rrt-body. Headings
 * ohne id (Nicht-String-Children im MDX, gleiche Grenze wie die Live-Seite)
 * werden uebersprungen. Klick-Scroll geht ueber die geteilte Lenis-Instanz
 * (window.__rrLenis), sonst kaempft natives smooth-scrollTo mit deren
 * Wheel-Hijacking.
 */

export type RailHeading = { id: string; text: string; level: number };
export type RailRelated = { slug: string; title: string; readingTime: number };

export default function TippsArticleRail({
  headings,
  related,
}: {
  headings: RailHeading[];
  related: RailRelated[];
}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const targets = headings
      .map((h) => (h.id ? document.getElementById(h.id) : null))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Aktiv = die letzte Ueberschrift, die die Lese-Linie (oberes Drittel)
    // passiert hat. Bewusst Scroll-Listener statt IntersectionObserver: ein
    // IO feuert nur bei Schwellen-UEBERTRITT — bei Sprung-Scrolls (TOC-Klick,
    // Lenis-Snap) landet die Ueberschrift oft jenseits der Beobachtungszone,
    // ohne sie zu kreuzen, und der Spy bleibt leer (QA 29.07.). rAF-gedrosselt,
    // ~6 getBoundingClientRect pro Frame sind unkritisch.
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.32;
      let current = "";
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headings]);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    const lenis = window.__rrLenis;
    if (lenis) lenis.scrollTo(top, { duration: 0.7 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  const tocEntries = headings.filter((h) => h.id && h.level === 2);

  return (
    <aside className="rrt-rail" aria-label="Artikel-Navigation">
      {/* Wer schreibt hier — kompaktes Agentur-Signal (E-E-A-T). */}
      <div className="rrt-rail-box rrt-rail-about">
        <span className="rrt-label">(Red Rabbit)</span>
        <p>
          Agentur f&uuml;r Websites, die gefunden werden. Individuell gebaut,
          kein Baukasten.
        </p>
        <ul>
          <li>Entwurf ohne Vorkasse</li>
          <li>SEO ab dem ersten Tag</li>
          <li>Betreuung aus Wien</li>
        </ul>
        <Link className="rrt-rail-link" href="/relaunch-preview/ueber-uns">
          Mehr &uuml;ber uns
        </Link>
      </div>

      {/* Weiterlesen — bewusst NICHT sticky (der Sticky-Block muss auf jeder
          Bildschirmhoehe komplett passen, Thomas 30.07.). */}
      {related.length > 0 && (
        <nav className="rrt-rail-box rrt-rail-related" aria-label="Weiterlesen">
          <span className="rrt-label">(Weiterlesen)</span>
          {related.map((p) => (
            <Link key={p.slug} href={`/relaunch-preview/tipps/${p.slug}`}>
              {p.title}
              <span>{p.readingTime} Min</span>
            </Link>
          ))}
        </nav>
      )}

      <div className="rrt-rail-sticky">
        {/* Inhaltsverzeichnis mit Scrollspy — ohne Hoehen-Kappung. */}
        {tocEntries.length > 1 && (
          <nav className="rrt-rail-box rrt-toc" aria-label="Inhaltsverzeichnis">
            <span className="rrt-label">(Inhalt)</span>
            <ol>
              {tocEntries.map((h, i) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={activeId === h.id ? "is-active" : undefined}
                    onClick={(e) => jump(e, h.id)}
                  >
                    <span className="rrt-toc-num">{String(i + 1).padStart(2, "0")}</span>
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Kontakt-/Analyse-Box — hell und freundlich (Thomas 30.07.),
            roter Sweep-Button wie Hauptseiten-Primaer. */}
        <div className="rrt-rail-box rrt-rail-cta">
          <span className="rrt-label">(Kostenlos)</span>
          <p className="rrt-rail-cta-h">Wie performt deine Website wirklich?</p>
          <p className="rrt-rail-cta-p">
            Wir schauen uns deinen Auftritt an und sagen dir ehrlich, wo du
            stehst. Kein Verkaufsanruf.
          </p>
          <Link className="rrt-btn rrt-btn--block" href="/relaunch-preview/kontakt" data-rr-lead="analyse">
            Analyse anfordern
          </Link>
          <div className="rrt-rail-cta-alt">
            <a href="tel:+436769000955">Anrufen</a>
            <a href="mailto:office@redrabbit.media">E-Mail senden</a>
          </div>
        </div>
      </div>
    </aside>
  );
}
