'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './variante-a.css';

/**
 * Punkte-Varianten / Variante A — "Typo-Werkbank".
 * Rein typografische Fassung der 6-Punkte-Sektion aus LeistungenUeberblick.tsx:
 * KEINE Bilder, KEINE Stockfotos. Grosse flaechige Ziffern (DM Sans, sehr fett,
 * teils als Outline), Titel in Crimson Pro, Fliesstext DM Sans. Versetztes,
 * alternierendes Layout mit viel Weissraum statt Bildkarten. Copy 1:1 aus
 * LeistungenUeberblick.tsx uebernommen (nichts umformuliert).
 * Eigenstaendige Vorschau, beruehrt die Live-Sektion nicht.
 */

interface Punkt {
  n: string;
  title: string;
  body: string;
  href?: string;
  more?: string;
}

const P: Punkt[] = [
  {
    n: '01',
    title: 'Zuerst schauen wir uns deinen Betrieb an',
    body: 'Kein Fragebogen von der Stange. Wir reden mit dir, schauen uns an, was du kannst, wer deine Kunden sind und woran es bisher hakt. Daraus entsteht ein Plan, der zu deinem Betrieb passt und nicht zu irgendeinem.',
  },
  {
    n: '02',
    title: 'Ein Auftritt, der nach dir aussieht',
    body: 'Logo, Farben, Auftreten: neu aufgebaut oder aufgefrischt. Wir gestalten kein Vorlagen-Design, sondern ein Gesicht, das man deinem Betrieb glaubt. Klare Botschaft statt Werbesprech.',
  },
  {
    n: '03',
    title: 'Du siehst den Entwurf, bevor du zahlst',
    body: 'Wir bauen dir zuerst einen echten Entwurf deiner Seite. Gefällt er dir nicht, kostet er dich nichts. Erst wenn du sagst, ja, das bin ich, geht es weiter. So einfach ist das.',
  },
  {
    n: '04',
    title: 'Handarbeit statt Baukasten',
    body: 'Deine Seite wird programmiert, nicht zusammengeklickt. Schnell geladen, sauber am Handy, gefunden bei Google und rechtssicher nach österreichischem Recht. Sie arbeitet wie ein guter Mitarbeiter am Empfang.',
  },
  {
    n: '05',
    title: 'Deine Kommandozentrale ist eingebaut',
    body: 'Das liefert dir sonst keiner mit: ein Dashboard, in dem du deine Seite im Blick hast. Zahlen in Klartext statt Statistik-Wirrwarr. Texte und Bilder änderst du selbst, mit ein paar Klicks. Kein Wartungsvertrag, kein Anruf bei der Agentur.',
  },
  {
    n: '06',
    title: 'Helfer, die du dazustellen kannst',
    body: 'In der Kommandozentrale warten Helfer auf Arbeit. Einer schreibt Beiträge über dein Handwerk, einer beantwortet Anfragen, einer kümmert sich um Termine. Du gibst per Klick frei, sie erledigen den Rest.',
    href: '/relaunch-preview/leistungen/talos',
    more: 'Mehr über die Agenten',
  },
];

function Zeile({ p, index }: { p: Punkt; index: number }) {
  const isInterlude = p.n === '03';
  const align = index % 2 === 1 ? 'pva-row--right' : '';

  const inner = (
    <>
      <div className={`pva-num ${isInterlude ? 'pva-num--outline' : ''}`} aria-hidden="true">
        {p.n}
      </div>
      <div className="pva-copy">
        <h3 className="pva-title">{p.title}</h3>
        <p className="pva-body">{p.body}</p>
        {p.more && (
          <span className="pva-more">
            {p.more}
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" aria-hidden="true">
              <path
                d="M11.5 1l5.5 5.5-5.5 5.5M17 6.5H0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  const rowClass = `pva-row ${align} ${isInterlude ? 'pva-row--interlude' : ''} pva-reveal`;

  if (p.href) {
    return (
      <Link className={rowClass} href={p.href} aria-label={`${p.title}. ${p.more}`}>
        {inner}
      </Link>
    );
  }
  return <div className={rowClass}>{inner}</div>;
}

export default function VarianteA() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = [...root.querySelectorAll('.pva-reveal')];
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
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className="pva-wrap" ref={rootRef}>
      <div className="pva-inner">
        <div className="pva-intro pva-reveal">
          <p className="pva-eyebrow">Was wir anders machen</p>
          <h2 className="pva-h">
            Eine normale Website kriegst du überall. Unsere hat eine{' '}
            <span className="pva-accent">Kommandozentrale</span>.
          </h2>
          <p className="pva-lead">
            Jede Website von uns kommt mit einem Backend, das sonst keiner mitliefert: ein
            Dashboard, in dem du alles im Blick hast und alles selbst änderst. Und wenn du
            willst, stellst du dir dort Helfer dazu, die Arbeit übernehmen. Beiträge schreiben,
            Anfragen beantworten, Termine annehmen. Du gibst frei, sie arbeiten. So läuft das ab,
            vom ersten Gespräch bis zum fertigen Auftritt.
          </p>
        </div>

        <div className="pva-list">
          {P.map((p, i) => (
            <Zeile key={p.n} p={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
