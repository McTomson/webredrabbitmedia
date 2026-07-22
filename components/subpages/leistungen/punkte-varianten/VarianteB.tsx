'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * Variante B — "Echte Bauteile" (Vorschau, noindex).
 *
 * Ersatz-Vorschlag fuer die Stockfotos in LeistungenUeberblick.tsx: statt
 * austauschbarer Stimmungsbilder zeigt jeder Punkt ein abstrahiertes PRODUKT-
 * Bauteil als reines HTML/CSS-Mockup (Skeleton-Aesthetik, keine echten
 * Screenshots, keine erfundenen Zahlen/Bewertungen/Kennzahlen).
 *
 * Copy 1:1 verbatim aus LeistungenUeberblick.tsx (echte Umlaute, unveraendert).
 * Layout vereinfacht auf abwechselnde Zeilen (Bauteil <-> Text), damit jedes
 * Bauteil Platz zum Atmen hat.
 *
 * Stil dockt an das bereits abgenommene Talos-Dashboard (wda__*) an:
 * Navy-Chrome, quadratische Ampel-Punkte, Skeleton-Balken, EIN roter Akzent.
 * Harte Marken-Regeln eingehalten: border-radius 0 ueberall, flach, keine
 * Schatten, KEINE 1px-Haarlinien/Borders (Trennung nur ueber Flaechen-Kontrast).
 * Alle Namen mit Prefix pvb- (kollisionsfrei).
 */

/* ---- Bauteile (reines Skeleton, kein echter Inhalt) ---------------------- */

/** 01 — Notiz-/Plan-Skeleton: Zeilen-Balken mit einer roten Markierung. */
function MockNotiz() {
  return (
    <div className="pvb-mock pvb-note" aria-hidden="true">
      <div className="pvb-noteHead">
        <span className="pvb-noteTab" />
        <span className="pvb-bar pvb-bar--title" style={{ width: '52%' }} />
      </div>
      <span className="pvb-bar" style={{ width: '92%' }} />
      <span className="pvb-bar" style={{ width: '78%' }} />
      <span className="pvb-bar pvb-bar--mark" style={{ width: '64%' }} />
      <span className="pvb-bar" style={{ width: '86%' }} />
      <span className="pvb-bar" style={{ width: '44%' }} />
    </div>
  );
}

/** 02 — Marken-Kacheln (Rot/Navy/Off-White) + Aa-Schriftprobe. */
function MockMarke() {
  return (
    <div className="pvb-mock pvb-brand" aria-hidden="true">
      <div className="pvb-swatches">
        <span className="pvb-sw pvb-sw--red" />
        <span className="pvb-sw pvb-sw--navy" />
        <span className="pvb-sw pvb-sw--paper" />
      </div>
      <div className="pvb-typo">
        <span className="pvb-typoAa">Aa</span>
        <div className="pvb-typoLines">
          <span className="pvb-bar" style={{ width: '100%' }} />
          <span className="pvb-bar" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}

/** 03 — Browser-Frame mit Wireframe-Skeleton + eckigem roten "Entwurf"-Stempel. */
function MockEntwurf() {
  return (
    <div className="pvb-mock pvb-browser" aria-hidden="true">
      <div className="pvb-chrome">
        <span className="pvb-lights">
          <span />
          <span />
          <span />
        </span>
        <span className="pvb-urlPill" />
      </div>
      <div className="pvb-screen">
        <span className="pvb-wire pvb-wire--hero" />
        <div className="pvb-wireRow">
          <span className="pvb-wire pvb-wire--col" />
          <span className="pvb-wire pvb-wire--col" />
        </div>
        <span className="pvb-wire pvb-wire--line" style={{ width: '86%' }} />
        <span className="pvb-wire pvb-wire--line" style={{ width: '58%' }} />
        <span className="pvb-stamp">Entwurf</span>
      </div>
    </div>
  );
}

/** 04 — Code-Editor-Skeleton: eingerueckte Zeilen + ein rotes Cursor-Rechteck. */
function MockCode() {
  const rows = [
    { indent: 0, w: '46%' },
    { indent: 1, w: '68%' },
    { indent: 2, w: '54%', cursor: true },
    { indent: 2, w: '72%' },
    { indent: 1, w: '38%' },
    { indent: 0, w: '30%' },
  ];
  return (
    <div className="pvb-mock pvb-code" aria-hidden="true">
      <div className="pvb-gutter">
        {rows.map((_, i) => (
          <span key={i} className="pvb-lineNo" />
        ))}
      </div>
      <div className="pvb-codeLines">
        {rows.map((r, i) => (
          <span
            key={i}
            className="pvb-codeLine"
            style={{ marginLeft: `${r.indent * 22}px`, width: r.w }}
          >
            {r.cursor && <span className="pvb-cursor" />}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 05 — Dashboard-Panel-Skeleton: Sidebar + Panel-Raster (ein roter Akzent). */
function MockDashboard() {
  return (
    <div className="pvb-mock pvb-dash" aria-hidden="true">
      <aside className="pvb-dashSide">
        <span className="pvb-sideDot" />
        <span className="pvb-sideLine pvb-sideLine--on" />
        <span className="pvb-sideLine" />
        <span className="pvb-sideLine" />
        <span className="pvb-sideLine pvb-sideLine--short" />
      </aside>
      <div className="pvb-dashPanels">
        <div className="pvb-panel pvb-panel--wide">
          <span className="pvb-bar pvb-bar--title" style={{ width: '38%' }} />
          <span className="pvb-bar" style={{ width: '64%' }} />
        </div>
        <div className="pvb-panel">
          <span className="pvb-donut" />
        </div>
        <div className="pvb-panel">
          <div className="pvb-bars">
            <span style={{ height: '48%' }} />
            <span style={{ height: '70%' }} />
            <span style={{ height: '40%' }} />
            <span className="pvb-bars--hot" style={{ height: '86%' }} />
            <span style={{ height: '58%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 06 — Aufgaben-/Chat-Skeleton mit eckigem Freigabe-Haken (kein rundes UI). */
function MockAgenten() {
  return (
    <div className="pvb-mock pvb-tasks" aria-hidden="true">
      <div className="pvb-task pvb-task--done">
        <span className="pvb-check">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path
              d="M2.5 8.5l3.5 3.5 7.5-8"
              fill="none"
              stroke="#f6f5f1"
              strokeWidth="2.2"
            />
          </svg>
        </span>
        <span className="pvb-bar" style={{ width: '62%' }} />
      </div>
      <div className="pvb-task">
        <span className="pvb-box" />
        <span className="pvb-bar" style={{ width: '78%' }} />
      </div>
      <div className="pvb-task">
        <span className="pvb-box" />
        <span className="pvb-bar" style={{ width: '54%' }} />
      </div>
      <div className="pvb-chat">
        <span className="pvb-bubble pvb-bubble--in" style={{ width: '58%' }} />
        <span className="pvb-bubble pvb-bubble--out" style={{ width: '46%' }} />
      </div>
    </div>
  );
}

/* ---- Punkte (Copy 1:1 verbatim aus LeistungenUeberblick.tsx) ------------- */

interface Punkt {
  n: string;
  title: string;
  body: string;
  mock: React.ReactNode;
  href?: string;
  more?: string;
}

const PUNKTE: Punkt[] = [
  {
    n: '01',
    title: 'Zuerst schauen wir uns deinen Betrieb an',
    body: 'Kein Fragebogen von der Stange. Wir reden mit dir, schauen uns an, was du kannst, wer deine Kunden sind und woran es bisher hakt. Daraus entsteht ein Plan, der zu deinem Betrieb passt und nicht zu irgendeinem.',
    mock: <MockNotiz />,
  },
  {
    n: '02',
    title: 'Ein Auftritt, der nach dir aussieht',
    body: 'Logo, Farben, Auftreten: neu aufgebaut oder aufgefrischt. Wir gestalten kein Vorlagen-Design, sondern ein Gesicht, das man deinem Betrieb glaubt. Klare Botschaft statt Werbesprech.',
    mock: <MockMarke />,
  },
  {
    n: '03',
    title: 'Du siehst den Entwurf, bevor du zahlst',
    body: 'Wir bauen dir zuerst einen echten Entwurf deiner Seite. Gefällt er dir nicht, kostet er dich nichts. Erst wenn du sagst, ja, das bin ich, geht es weiter. So einfach ist das.',
    mock: <MockEntwurf />,
  },
  {
    n: '04',
    title: 'Handarbeit statt Baukasten',
    body: 'Deine Seite wird programmiert, nicht zusammengeklickt. Schnell geladen, sauber am Handy, gefunden bei Google und rechtssicher nach österreichischem Recht. Sie arbeitet wie ein guter Mitarbeiter am Empfang.',
    mock: <MockCode />,
  },
  {
    n: '05',
    title: 'Deine Kommandozentrale ist eingebaut',
    body: 'Das liefert dir sonst keiner mit: ein Dashboard, in dem du deine Seite im Blick hast. Zahlen in Klartext statt Statistik-Wirrwarr. Texte und Bilder änderst du selbst, mit ein paar Klicks. Kein Wartungsvertrag, kein Anruf bei der Agentur.',
    mock: <MockDashboard />,
  },
  {
    n: '06',
    title: 'Helfer, die du dazustellen kannst',
    body: 'In der Kommandozentrale warten Helfer auf Arbeit. Einer schreibt Beiträge über dein Handwerk, einer beantwortet Anfragen, einer kümmert sich um Termine. Du gibst per Klick frei, sie erledigen den Rest.',
    mock: <MockAgenten />,
    href: '/relaunch-preview/leistungen/talos',
    more: 'Mehr über die Agenten',
  },
];

function Zeile({ p, flip }: { p: Punkt; flip: boolean }) {
  const copy = (
    <div className="pvb-copy">
      <div className="pvb-num" aria-hidden="true">
        {p.n}
      </div>
      <h3 className="pvb-title">{p.title}</h3>
      <p className="pvb-body">{p.body}</p>
      {p.href && p.more && (
        <Link className="pvb-more" href={p.href}>
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
        </Link>
      )}
    </div>
  );

  return (
    <div className={`pvb-row pvb-reveal ${flip ? 'pvb-row--flip' : ''}`}>
      <div className="pvb-mockWrap">{p.mock}</div>
      {copy}
    </div>
  );
}

export default function VarianteB() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = [...root.querySelectorAll('.pvb-reveal')];
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
    <div className="pvb-wrap" ref={rootRef}>
      <div className="pvb-inner">
        <div className="pvb-intro pvb-reveal">
          <p className="wd-eyebrow">Was wir anders machen</p>
          <h2 className="pvb-h">
            Eine normale Website kriegst du überall. Unsere hat eine{' '}
            <span className="pvb-plus">Kommandozentrale</span>.
          </h2>
          <p className="pvb-lead">
            Jede Website von uns kommt mit einem Backend, das sonst keiner mitliefert:
            ein Dashboard, in dem du alles im Blick hast und alles selbst änderst. Und
            wenn du willst, stellst du dir dort Helfer dazu, die Arbeit übernehmen.
            Beiträge schreiben, Anfragen beantworten, Termine annehmen. Du gibst frei,
            sie arbeiten. So läuft das ab, vom ersten Gespräch bis zum fertigen Auftritt.
          </p>
        </div>

        <div className="pvb-rows">
          {PUNKTE.map((p, i) => (
            <Zeile key={p.n} p={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>

      {/* Plain globales <style> statt styled-jsx (styled-jsx greift in diesem
          Setup nicht zuverlaessig; Muster aus ProduktTueren/Scharnierzeile,
          Klassen pvb-* sind seiten-lokal eindeutig). */}
      <style>{`
        .pvb-wrap {
          padding: var(--rr-section-y, clamp(96px, 12vw, 180px))
            var(--rr-gutter, clamp(20px, 4vw, 64px));
          background: var(--rr-paper, #ffffff);
        }
        .pvb-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ---- Intro ---- */
        .pvb-intro {
          max-width: 40em;
          margin-bottom: clamp(56px, 8vw, 104px);
        }
        .pvb-h {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(30px, 4.6vw, 52px);
          line-height: 1.08;
          letter-spacing: -0.01em;
          color: var(--rr-ink);
          margin: 16px 0 0;
        }
        .pvb-plus {
          color: var(--rr-red);
        }
        .pvb-lead {
          font-family: var(--rr-font-ui);
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.6;
          color: var(--rr-ink-soft);
          margin: clamp(20px, 2.4vw, 30px) 0 0;
        }

        /* ---- Zeilen ---- */
        .pvb-rows {
          display: flex;
          flex-direction: column;
          gap: clamp(64px, 9vw, 128px);
        }
        .pvb-row {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        .pvb-row--flip .pvb-mockWrap {
          order: 2;
        }

        .pvb-copy {
          max-width: 30em;
        }
        .pvb-num {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(24px, 2.6vw, 30px);
          letter-spacing: 0.02em;
          color: var(--rr-red);
          line-height: 1;
        }
        .pvb-title {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(22px, 2.6vw, 30px);
          line-height: 1.14;
          letter-spacing: -0.01em;
          color: var(--rr-ink);
          margin: 14px 0 0;
        }
        .pvb-body {
          font-family: var(--rr-font-ui);
          font-size: clamp(15px, 1.35vw, 18px);
          line-height: 1.62;
          color: var(--rr-ink-soft);
          margin: 16px 0 0;
        }
        .pvb-more {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 22px;
          font-family: var(--rr-font-ui);
          font-size: 15px;
          font-weight: 600;
          color: var(--rr-ink);
          text-decoration: none;
        }
        .pvb-more:hover {
          color: var(--rr-red);
        }

        /* ---- Bauteil-Rahmen (Flaeche, keine Border) ---- */
        .pvb-mockWrap {
          background: var(--rr-surface, #f4f4f2);
          padding: clamp(22px, 3vw, 40px);
        }
        .pvb-mock {
          width: 100%;
        }

        /* Skeleton-Balken (Grundton) */
        .pvb-bar {
          display: block;
          height: 11px;
          margin-top: 12px;
          background: color-mix(in srgb, var(--rr-navy) 14%, transparent);
        }
        .pvb-bar:first-child {
          margin-top: 0;
        }
        .pvb-bar--title {
          height: 14px;
          background: color-mix(in srgb, var(--rr-navy) 38%, transparent);
        }
        .pvb-bar--mark {
          background: var(--rr-red);
        }

        /* 01 Notiz */
        .pvb-note {
          background: var(--rr-paper, #fff);
          padding: clamp(20px, 2.6vw, 30px);
        }
        .pvb-noteHead {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .pvb-noteTab {
          width: 16px;
          height: 16px;
          background: var(--rr-red);
          flex: none;
        }

        /* 02 Marke */
        .pvb-brand {
          background: var(--rr-paper, #fff);
          padding: clamp(20px, 2.6vw, 30px);
          display: grid;
          gap: 20px;
        }
        .pvb-swatches {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .pvb-sw {
          height: clamp(64px, 8vw, 96px);
        }
        .pvb-sw--red {
          background: var(--rr-red);
        }
        .pvb-sw--navy {
          background: var(--rr-navy);
        }
        .pvb-sw--paper {
          background: #f6f5f1;
        }
        .pvb-typo {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .pvb-typoAa {
          font-family: var(--rr-font-serif);
          font-weight: 500;
          font-size: clamp(40px, 6vw, 64px);
          line-height: 0.9;
          color: var(--rr-ink);
          flex: none;
        }
        .pvb-typoLines {
          flex: 1;
          display: grid;
          gap: 10px;
        }

        /* 03 Browser + Entwurf-Stempel */
        .pvb-browser {
          background: var(--rr-navy);
        }
        .pvb-chrome {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 14px;
        }
        .pvb-lights {
          display: inline-flex;
          gap: 7px;
        }
        .pvb-lights span {
          width: 10px;
          height: 10px;
          background: rgba(246, 245, 241, 0.32);
        }
        .pvb-lights span:first-child {
          background: var(--rr-red);
        }
        .pvb-urlPill {
          flex: 1;
          height: 20px;
          background: rgba(246, 245, 241, 0.12);
        }
        .pvb-screen {
          position: relative;
          background: var(--rr-paper, #fff);
          margin: 0 10px 10px;
          padding: clamp(18px, 2.4vw, 26px);
        }
        .pvb-wire {
          display: block;
          background: color-mix(in srgb, var(--rr-navy) 12%, transparent);
        }
        .pvb-wire--hero {
          height: clamp(64px, 9vw, 96px);
          margin-bottom: 16px;
        }
        .pvb-wireRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 16px;
        }
        .pvb-wire--col {
          height: clamp(46px, 6vw, 64px);
        }
        .pvb-wire--line {
          height: 11px;
          margin-top: 11px;
        }
        .pvb-stamp {
          position: absolute;
          top: clamp(14px, 2vw, 22px);
          right: clamp(14px, 2vw, 22px);
          transform: rotate(-7deg);
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(15px, 1.8vw, 20px);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rr-red);
          background: color-mix(in srgb, var(--rr-red) 12%, #fff);
          padding: 8px 14px;
        }

        /* 04 Code-Editor */
        .pvb-code {
          background: var(--rr-navy);
          display: grid;
          grid-template-columns: 40px 1fr;
          padding: clamp(18px, 2.4vw, 26px) clamp(16px, 2vw, 22px);
          gap: 0 16px;
        }
        .pvb-gutter {
          display: grid;
          gap: 14px;
          align-content: start;
        }
        .pvb-lineNo {
          height: 10px;
          width: 14px;
          background: rgba(246, 245, 241, 0.22);
        }
        .pvb-codeLines {
          display: grid;
          gap: 14px;
          align-content: start;
        }
        .pvb-codeLine {
          position: relative;
          height: 10px;
          background: rgba(246, 245, 241, 0.4);
        }
        .pvb-cursor {
          position: absolute;
          right: -12px;
          top: -2px;
          width: 7px;
          height: 14px;
          background: var(--rr-red);
        }

        /* 05 Dashboard */
        .pvb-dash {
          background: var(--rr-paper, #fff);
          display: grid;
          grid-template-columns: 96px 1fr;
        }
        .pvb-dashSide {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: clamp(18px, 2.2vw, 24px) 16px;
          background: var(--rr-surface, #f4f4f2);
        }
        .pvb-sideDot {
          width: 12px;
          height: 12px;
          background: var(--rr-red);
          margin-bottom: 6px;
        }
        .pvb-sideLine {
          height: 9px;
          background: color-mix(in srgb, var(--rr-navy) 14%, transparent);
        }
        .pvb-sideLine--on {
          width: 80%;
          background: color-mix(in srgb, var(--rr-navy) 42%, transparent);
        }
        .pvb-sideLine--short {
          width: 60%;
        }
        .pvb-dashPanels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: clamp(16px, 2vw, 22px);
        }
        .pvb-panel {
          background: var(--rr-surface, #f4f4f2);
          padding: 16px;
          min-height: 88px;
        }
        .pvb-panel--wide {
          grid-column: 1 / -1;
        }
        .pvb-donut {
          display: block;
          width: 46px;
          height: 46px;
          background: conic-gradient(
            var(--rr-red) 0turn 0.7turn,
            color-mix(in srgb, var(--rr-navy) 16%, transparent) 0.7turn 1turn
          );
        }
        .pvb-bars {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 48px;
        }
        .pvb-bars span {
          flex: 1;
          background: color-mix(in srgb, var(--rr-navy) 20%, transparent);
          min-height: 4px;
        }
        .pvb-bars span.pvb-bars--hot {
          background: var(--rr-red);
        }

        /* 06 Aufgaben/Chat */
        .pvb-tasks {
          background: var(--rr-paper, #fff);
          padding: clamp(18px, 2.4vw, 26px);
          display: grid;
          gap: 14px;
        }
        .pvb-task {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--rr-surface, #f4f4f2);
          padding: 14px 16px;
        }
        .pvb-box,
        .pvb-check {
          width: 18px;
          height: 18px;
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pvb-box {
          background: color-mix(in srgb, var(--rr-navy) 16%, transparent);
        }
        .pvb-check {
          background: var(--rr-red);
        }
        .pvb-task .pvb-bar {
          margin-top: 0;
          flex: 1;
        }
        .pvb-chat {
          display: grid;
          gap: 10px;
          margin-top: 4px;
        }
        .pvb-bubble {
          height: 26px;
        }
        .pvb-bubble--in {
          justify-self: start;
          background: color-mix(in srgb, var(--rr-navy) 12%, transparent);
        }
        .pvb-bubble--out {
          justify-self: end;
          background: color-mix(in srgb, var(--rr-red) 16%, #fff);
        }

        /* ---- Reveal ---- */
        @media (prefers-reduced-motion: no-preference) {
          .pvb-reveal {
            opacity: 0;
            transform: translateY(18px);
            transition:
              opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
          }
          .pvb-reveal.is-in {
            opacity: 1;
            transform: none;
          }
        }

        /* ---- Responsive ---- */
        @media (max-width: 820px) {
          .pvb-row {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .pvb-row--flip .pvb-mockWrap {
            order: 0;
          }
        }
      `}</style>
    </div>
  );
}
