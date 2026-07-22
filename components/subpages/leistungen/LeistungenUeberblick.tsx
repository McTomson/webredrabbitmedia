'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './leistungen-ueberblick.css';

/**
 * Leistungs-Ueberblick — die 6 Leistungen, Layout 1:1 vom pixelperfektion.de/
 * leistungen-"Design"-Block VERMESSEN (20.07.) und exakt nachgebaut:
 *   Paar (01|02, rechte Spalte +100 px versetzt) -> kleiner Interlude (03,
 *   eingerueckt, Text daneben) -> Paar (04|05) -> Einzel (06, links).
 * Bilder 553x450, Container 1230, Fliesstext 20 px, Reveal 0.6 s.
 * Marke aber Red Rabbit (DM Sans / Crimson Pro, roter Badge, KEIN Schwarzweiss),
 * Bilder vorerst Platzhalter. Punkt 6 verlinkt auf die Agenten-Unterseite.
 * Davor der Unterschied-Hook ("Website +"). Fragebogen bewusst NICHT hier.
 */

interface Punkt {
  n: string;
  title: string;
  body: string;
  /** Stimmungsbild unter public/ (Unsplash/Pexels-Lizenz, Doku im Handoff). */
  img: string;
  /** Beschreibender Alt-Text (Stimmungsbild, kein Produkt-Screenshot). */
  alt: string;
  href?: string;
  more?: string;
}

const P: Record<string, Punkt> = {
  s1: {
    img: '/relaunch/leistungen/punkt-01-strategie.jpg',
    alt: 'Aufgeschlagenes Notizbuch mit Stift auf einem Holztisch',
    n: '01',
    title: 'Zuerst schauen wir uns deinen Betrieb an',
    body: 'Kein Fragebogen von der Stange. Wir reden mit dir, schauen uns an, was du kannst, wer deine Kunden sind und woran es bisher hakt. Daraus entsteht ein Plan, der zu deinem Betrieb passt und nicht zu irgendeinem.',
  },
  s2: {
    img: '/relaunch/leistungen/punkt-02-design.jpg',
    alt: 'Pinsel mit Farbresten vor warmem Hintergrund',
    n: '02',
    title: 'Ein Auftritt, der nach dir aussieht',
    body: 'Logo, Farben, Auftreten: neu aufgebaut oder aufgefrischt. Wir gestalten kein Vorlagen-Design, sondern ein Gesicht, das man deinem Betrieb glaubt. Klare Botschaft statt Werbesprech.',
  },
  s3: {
    img: '/relaunch/leistungen/punkt-03-entwurf.jpg',
    alt: 'Hand zeichnet einen Entwurf mit Druckbleistift auf Papier',
    n: '03',
    title: 'Du siehst den Entwurf, bevor du zahlst',
    body: 'Wir bauen dir zuerst einen echten Entwurf deiner Seite. Gefällt er dir nicht, kostet er dich nichts. Erst wenn du sagst, ja, das bin ich, geht es weiter. So einfach ist das.',
  },
  s4: {
    img: '/relaunch/leistungen/punkt-04-website.jpg',
    alt: 'Aufgeklappter Laptop auf einem Holztisch von oben',
    n: '04',
    title: 'Handarbeit statt Baukasten',
    body: 'Deine Seite wird programmiert, nicht zusammengeklickt. Schnell geladen, sauber am Handy, gefunden bei Google und rechtssicher nach österreichischem Recht. Sie arbeitet wie ein guter Mitarbeiter am Empfang.',
  },
  s5: {
    img: '/relaunch/leistungen/punkt-05-backend.jpg',
    alt: 'Monitor mit warmem rot-orangem Bild auf einem hellen Schreibtisch',
    n: '05',
    title: 'Deine Kommandozentrale ist eingebaut',
    body: 'Das liefert dir sonst keiner mit: ein Dashboard, in dem du deine Seite im Blick hast. Zahlen in Klartext statt Statistik-Wirrwarr. Texte und Bilder änderst du selbst, mit ein paar Klicks. Kein Wartungsvertrag, kein Anruf bei der Agentur.',
  },
  s6: {
    img: '/relaunch/leistungen/punkt-06-agenten.jpg',
    alt: 'Mehrere Teile greifen ineinander',
    n: '06',
    title: 'Helfer, die du dazustellen kannst',
    body: 'In der Kommandozentrale warten Helfer auf Arbeit. Einer schreibt Beiträge über dein Handwerk, einer beantwortet Anfragen, einer kümmert sich um Termine. Du gibst per Klick frei, sie erledigen den Rest.',
    href: '/relaunch-preview/leistungen/talos',
    more: 'Mehr über die Agenten',
  },
};

function Karte({ p }: { p: Punkt }) {
  const inner = (
    <>
      <div className="lu-figure">
        <div className="lu-media">
          {/* Plain <img>: statisches Asset unter public/, Groesse via CSS-aspect-ratio.
              loading=lazy — die Sektion liegt weit unter dem Fold. */}
          <img src={p.img} alt={p.alt} loading="lazy" />
        </div>
        <div className="lu-num" aria-hidden="true">{p.n}</div>
      </div>
      <h3 className="lu-title">{p.title}</h3>
      <p className="lu-body">{p.body}</p>
      {p.more && (
        <span className="lu-more">
          {p.more}
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden="true">
            <path d="M11.5 1l5.5 5.5-5.5 5.5M17 6.5H0" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );

  if (p.href) {
    return (
      <Link className="lu-card" href={p.href} aria-label={`${p.title}. ${p.more}`}>
        {inner}
      </Link>
    );
  }
  return <article className="lu-card">{inner}</article>;
}

/* Interlude-Karte (03): Hochformat-Bild links, daneben Badge UEBER dem Text —
   exakt wie das Original (dort traegt das Keyvisual keinen Badge; die "03"
   steht als eigener Kreis ueber dem Textblock). */
function Interlude({ p }: { p: Punkt }) {
  return (
    <div className="lu-interlude">
      <div className="lu-figure" style={{ margin: 0 }}>
        <div className="lu-media">
          <img src={p.img} alt={p.alt} loading="lazy" />
        </div>
      </div>
      <div>
        <div className="lu-num lu-num--static" aria-hidden="true">{p.n}</div>
        <h3 className="lu-title">{p.title}</h3>
        <p className="lu-body">{p.body}</p>
      </div>
    </div>
  );
}

export default function LeistungenUeberblick() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = [...root.querySelectorAll('.lu-reveal')];
    if (!('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lu-wrap" ref={rootRef}>
      <div className="lu-inner">
        <div className="lu-intro lu-reveal">
          <p className="wd-eyebrow">Was wir anders machen</p>
          <h2 className="lu-h">
            Eine normale Website kriegst du überall. Unsere hat eine{' '}
            <span className="plus">Kommandozentrale</span>.
          </h2>
          <p className="lu-lead">
            Jede Website von uns kommt mit einem Backend, das sonst keiner mitliefert:
            ein Dashboard, in dem du alles im Blick hast und alles selbst änderst. Und
            wenn du willst, stellst du dir dort Helfer dazu, die Arbeit übernehmen.
            Beiträge schreiben, Anfragen beantworten, Termine annehmen. Du gibst frei,
            sie arbeiten. So läuft das ab, vom ersten Gespräch bis zum fertigen Auftritt.
          </p>
        </div>

        <div className="lu-blocks">
          {/* Paar 01 | 02 (rechte Spalte +100 px versetzt) */}
          <div className="lu-pair">
            <div className="lu-reveal"><Karte p={P.s1} /></div>
            <div className="lu-reveal"><Karte p={P.s2} /></div>
          </div>

          {/* Interlude 03: kleines Bild eingerueckt, Text daneben */}
          <div className="lu-reveal"><Interlude p={P.s3} /></div>

          {/* Paar 04 | 05 */}
          <div className="lu-pair">
            <div className="lu-reveal"><Karte p={P.s4} /></div>
            <div className="lu-reveal"><Karte p={P.s5} /></div>
          </div>

          {/* Einzel 06 (links, mit Agenten-Link) */}
          <div className="lu-reveal lu-single"><Karte p={P.s6} /></div>
        </div>
      </div>
    </div>
  );
}
