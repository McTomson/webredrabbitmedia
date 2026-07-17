"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "@/components/relaunch/RabbitMark";
import MorphSculpture from "@/components/subpages/MorphSculpture";

/**
 * LeistungenStory — self-contained Scroll-Story der Leistungs-Hub-Seite
 * (/relaunch-preview/leistungen). Muster = TippsTunnel: eigener <style>-Block,
 * Prefix `.rrls-`, KEIN GSAP, nur transform/opacity, IntersectionObserver + ein
 * schlanker rAF-Loop nur fuer die Skulptur-Kopplung. prefers-reduced-motion:
 * alles statisch sichtbar (CSS-Kill-Switch + JS-Zweige).
 *
 * Wird auf der Seite INNERHALB des `.rr`-Font-Wrappers gerendert, damit die
 * echten Marken-Bauteile (rr-eyebrow-lg, rr-statement, rr-btn-sweep--red,
 * rr-btn-frame, rr-card-soft) greifen (Stil-Gesetz: echte Klassen, nicht
 * nachgebaut). Die `.rrls-`-Klassen liefern nur Layout/Struktur.
 *
 * Kapitel: 0 Weiche (+ Assistent) / 1 Fundament (+ Zahnraeder-Skulptur comp0) /
 * 2 Team (Split-Screen-Sticky) / 3 Massarbeit / 4 Beweis + Start.
 */

const PHONE_TEL = "+436769000955";

// Rotierende Selbst-Tipp-Titel des Schreibers (echte Umlaute).
const SCHREIBER_TITLES = [
  "Was kostet eine Therme in Oberösterreich?",
  "Heizung entlüften: so geht es richtig.",
  "Förderung 2026: das steht dir zu.",
];

// ---- Assistent: Fragen + Antworten (Logik exakt aus Konzept v3) ----
type Choice = { value: string; label: string };
type Question = { id: string; q: string; choices: Choice[] };

const QUESTIONS: Question[] = [
  {
    id: "website",
    q: "Hast du schon eine Website?",
    choices: [
      { value: "alt", label: "Ja, gibt es schon" },
      { value: "neu", label: "Noch nicht" },
    ],
  },
  {
    id: "empfang",
    q: "Sollen Termine und Anfragen online reinkommen?",
    choices: [
      { value: "ja", label: "Ja, gerne" },
      { value: "nein", label: "Nein, mach ich selbst" },
      { value: "weiss-nicht", label: "Weiß nicht, was bringt das?" },
    ],
  },
  {
    id: "schreiber",
    q: "Soll regelmäßig Neues erscheinen, ohne dass du selbst schreibst?",
    choices: [
      { value: "ja", label: "Ja, klingt gut" },
      { value: "nein", label: "Nein, brauch ich nicht" },
      { value: "weiss-nicht", label: "Weiß nicht" },
    ],
  },
  {
    id: "zahlen",
    q: "Willst du sehen, was die Seite dir bringt?",
    choices: [
      { value: "ja", label: "Ja, zeig mir Zahlen" },
      { value: "egal", label: "Egal, Hauptsache läuft" },
    ],
  },
  {
    id: "groesse",
    q: "Wie groß soll das Ganze werden?",
    choices: [
      { value: "klein", label: "Klein und fein" },
      { value: "ordentlich", label: "Ordentlich" },
      { value: "gross", label: "Groß" },
      { value: "keine-ahnung", label: "Keine Ahnung, beratet mich" },
    ],
  },
];

type ResultItem = { title: string; text: string };

// Ergebnis: NUR die gewaehlten Teile (Website immer; Empfang bei ja/weiss-nicht;
// Schreiber bei ja/weiss-nicht). Bei "weiss nicht" wird der Nutzen-Satz ergaenzt.
function buildResult(answers: Record<string, string>): ResultItem[] {
  const items: ResultItem[] = [
    {
      title: "Deine Website",
      text: "Individuell gebaut, gehört dir, läuft ab dem ersten Tag.",
    },
  ];
  const empfang = answers.empfang;
  if (empfang === "ja" || empfang === "weiss-nicht") {
    items.push({
      title: "Der Empfang",
      text:
        empfang === "weiss-nicht"
          ? "Nimmt Termine und Anfragen an. Kurz gesagt: Keine Anfrage geht mehr verloren, nur weil du gerade am Dach stehst."
          : "Nimmt Termine und Anfragen an, auch wenn du gerade keine Zeit hast.",
    });
  }
  const schreiber = answers.schreiber;
  if (schreiber === "ja" || schreiber === "weiss-nicht") {
    items.push({
      title: "Der Schreiber",
      text:
        schreiber === "weiss-nicht"
          ? "Sorgt für regelmäßig Neues auf deiner Seite. Kurz gesagt: Das macht dich bei Google und den neuen Antwortmaschinen sichtbar, ganz ohne dass du tippst."
          : "Sorgt dafür, dass auf deiner Seite jede Woche etwas Neues passiert.",
    });
  }
  return items;
}

// Skulptur-Kopplung: aA = Einflug (Assemble), bB = Aufloesung (Dissolve).
// progress-Kurve wie kontakt-demo: bB>0 ? 0.55 + bB*0.45 : aA*0.55.
function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

// ---- Kapitel-Orientierung (rechts, Desktop) ----
const CHAPTERS = [
  { id: "ls-weiche", label: "Weiche" },
  { id: "ls-fundament", label: "Fundament" },
  { id: "ls-team", label: "Team" },
  { id: "ls-massarbeit", label: "Maßarbeit" },
  { id: "ls-start", label: "Start" },
];

export default function LeistungenStory({ articleCount }: { articleCount: number }) {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Assistent-State
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1, dann Ergebnis
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const assistantRef = useRef<HTMLDivElement>(null);

  // Schreiber-Selbsttipp
  const typeRef = useRef<HTMLSpanElement>(null);

  // Skulptur
  const sculptWrapRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Skulptur startet dissolved (progress 0), sonst blitzt kurz die gehaltene
  // Zahnraeder-Figur auf (MorphSculpture-Default ist 0.55 = gehalten).
  useEffect(() => {
    (window as unknown as { __sculptProgress?: number }).__sculptProgress = 0;
  }, []);

  // Skulptur-Kopplung an den Scroll (nur ohne reduced-motion; bei reduced
  // ignoriert MorphSculpture den Global und haelt statisch).
  useEffect(() => {
    if (!mounted || reduced) return;
    const wrap = sculptWrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const g = window as unknown as { __sculptProgress?: number };
    const loop = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = rect.height - vh;
      const p = span > 0 ? clamp01(-rect.top / span) : 0;
      const aA = clamp01(p / 0.4); // Einflug in den ersten 40 %
      const bB = clamp01((p - 0.65) / 0.35); // Aufloesung im letzten 35 %
      g.__sculptProgress = bB > 0 ? 0.55 + bB * 0.45 : aA * 0.55;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduced]);

  // Dezente Scroll-Reveals (opacity/transform) — fail-open: ohne JS bleibt
  // alles sichtbar (data-reveal gated).
  useEffect(() => {
    if (!mounted || reduced) return;
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    root.setAttribute("data-reveal", "on");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".rrls-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, reduced]);

  // Kapitel-Orientierung: aktiven Punkt per IntersectionObserver setzen.
  useEffect(() => {
    if (!mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = CHAPTERS.findIndex((c) => c.id === e.target.id);
            if (idx >= 0) setActiveChapter(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [mounted]);

  // Schreiber-Selbsttipp (rotierende Artikel-Titel). reduced-motion: statisch.
  useEffect(() => {
    if (!mounted || reduced) return;
    const el = typeRef.current;
    if (!el) return;
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = SCHREIBER_TITLES[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci >= word.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 45);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci <= 0) {
          deleting = false;
          wi = (wi + 1) % SCHREIBER_TITLES.length;
          timer = setTimeout(tick, 320);
          return;
        }
        timer = setTimeout(tick, 22);
      }
    };
    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [mounted, reduced]);

  const openAssistant = useCallback(() => {
    setAssistantOpen(true);
    setStep(0);
    setAnswers({});
    // Nach dem Aufklappen sanft in den Assistenten scrollen.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        assistantRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }, [reduced]);

  const scrollToId = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduced],
  );

  const answer = useCallback(
    (id: string, value: string) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));
      setStep((s) => s + 1);
    },
    [],
  );

  const result = useMemo(() => buildResult(answers), [answers]);
  const atResult = step >= QUESTIONS.length;

  return (
    <section className="rrls-root" ref={rootRef} aria-label="Was wir für dich bauen">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Kapitel-Orientierung (rechts, Desktop >=900px) */}
      <nav className="rrls-dots" aria-label="Kapitel">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`rrls-dot${i === activeChapter ? " is-active" : ""}`}
            aria-label={`Zu ${c.label}`}
            aria-current={i === activeChapter ? "true" : undefined}
            onClick={() => scrollToId(c.id)}
          >
            <span className="rrls-dot-label">{c.label}</span>
          </button>
        ))}
      </nav>

      {/* ============ Kapitel 0 — Weiche ============ */}
      <div className="rrls-section rrls-weiche" id="ls-weiche">
        <h2 className="rr-statement rrls-h2 rrls-reveal">
          Du kannst eine Website haben. Oder eine, die für dich arbeitet.
        </h2>

        <div className="rrls-doors rrls-reveal">
          <button type="button" className="rrls-door" onClick={openAssistant} aria-expanded={assistantOpen}>
            <span className="rrls-door-title">Nimm mich an die Hand</span>
            <span className="rrls-door-sub">Ein paar Fragen, dann zeigen wir dir, was zu dir passt.</span>
          </button>
          <button type="button" className="rrls-door" onClick={() => scrollToId("ls-fundament")}>
            <span className="rrls-door-title">Ich schau mich selbst um</span>
            <span className="rrls-door-sub">Scroll dich durch. Alles steht da.</span>
          </button>
        </div>

        {/* Assistent (aufklappbar, kein Modal) */}
        <div
          className={`rrls-assistant${assistantOpen ? " is-open" : ""}`}
          ref={assistantRef}
          aria-hidden={!assistantOpen}
        >
          {assistantOpen && (
            <div className="rrls-assistant-inner">
              <div className="rrls-assistant-top">
                <div className="rrls-progress" aria-hidden="true">
                  {QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={`rrls-progress-dot${
                        i < step ? " is-done" : i === step && !atResult ? " is-current" : ""
                      }`}
                    />
                  ))}
                </div>
                <Link href="/relaunch-preview/kontakt" className="rrls-exit">
                  Ich weiß schon, was ich will
                </Link>
              </div>

              {!atResult ? (
                <div className="rrls-question" key={step}>
                  <p className="rrls-q">{QUESTIONS[step].q}</p>
                  <div className="rrls-choices">
                    {QUESTIONS[step].choices.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className="rrls-choice"
                        onClick={() => answer(QUESTIONS[step].id, c.value)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button type="button" className="rrls-back" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                      Zurück
                    </button>
                  )}
                </div>
              ) : (
                <div className="rrls-result">
                  <p className="rrls-result-lead">Dann passt für den Anfang das hier:</p>
                  <ul className="rrls-result-list">
                    {result.map((item) => (
                      <li key={item.title} className="rrls-result-item">
                        <span className="rrls-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
                            <path d="M4 12.5 10 18.5 20 6.5" />
                          </svg>
                        </span>
                        <span>
                          <strong className="rrls-result-title">{item.title}.</strong>{" "}
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="rrls-result-closing">So starten die meisten Betriebe.</p>
                  <div className="rrls-result-actions">
                    <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
                      Kostenlosen Entwurf genau dafür anfragen
                    </Link>
                    <button type="button" className="rrls-back" onClick={() => setStep(QUESTIONS.length - 1)}>
                      Zurück
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ Kapitel 1 — Das Fundament ============ */}
      <div className="rrls-section rrls-fundament" id="ls-fundament">
        <p className="rr-eyebrow-lg rrls-eyebrow rrls-reveal">Das Fundament</p>
        <h2 className="rr-statement rrls-h2 rrls-reveal">
          Zuerst die Website selbst. Da ist alles Wichtige schon drin.
        </h2>
      </div>

      {/* Signatur-Moment: Zahnraeder-Skulptur (comp0), scroll-gekoppelt. */}
      <div className="rrls-sculpt-wrap" ref={sculptWrapRef}>
        <div className="rrls-sculpt-sticky">
          <div className="rrls-sculpt-stage" aria-hidden="true">
            <MorphSculpture comp={0} style={{ background: "transparent" }} />
          </div>
          <p className="rrls-sculpt-msg">Sie arbeitet von Anfang an.</p>
        </div>
      </div>

      <div className="rrls-section rrls-fundament-list">
        <ul className="rrls-checklist">
          {FUNDAMENT.map((f) => (
            <li key={f.title} className="rrls-checkitem rrls-reveal">
              <details className="rrls-details">
                <summary className="rrls-summary">
                  <span className="rrls-check rrls-check--red" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
                      <path d="M4 12.5 10 18.5 20 6.5" />
                    </svg>
                  </span>
                  <span className="rrls-summary-title">{f.title}</span>
                  <span className="rrls-summary-plus" aria-hidden="true" />
                </summary>
                <p className="rrls-details-body">{f.body}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="rrls-fundament-foot rrls-reveal">
          <p className="rrls-foot-strong">Keine Extra-Rechnung. Kein Wartungsvertrag. Drin.</p>
          <p className="rrls-foot-hint">
            Pakete und Fixpreise stehen auf der{" "}
            <Link href="/preise" className="rrls-inline-link">Preisseite</Link>.
          </p>
        </div>
      </div>

      {/* ============ Kapitel 2 — Das Team ============ */}
      <div className="rrls-section rrls-team-intro" id="ls-team">
        <h2 className="rr-statement rrls-h2 rrls-reveal">
          Und jetzt der Teil, den es nur bei uns gibt.
        </h2>
        <p className="rrls-lead rrls-reveal">Deine Website kann Kollegen einstellen.</p>
      </div>

      {/* Kollege 01 — Der Schreiber (rot) */}
      <div className="rrls-kollege">
        <div className="rrls-kollege-figure">
          <div className="rrls-figure-inner">
            <RabbitMark color="#F12032" title="Der Schreiber" style={{ display: "block", height: "clamp(140px, 18vw, 200px)", width: "auto" }} />
            <p className="rrls-kollege-name">Der Schreiber</p>
            <p className="rrls-kollege-tag">dein digitaler Kollege</p>
            <p className="rrls-kollege-claim">Sorgt dafür, dass auf deiner Seite etwas passiert. Jede Woche.</p>
          </div>
        </div>
        <div className="rrls-kollege-beats">
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Er schreibt über dein Handwerk.</p>
            <div className="rrls-type" aria-hidden="true">
              <span className="rrls-type-text" ref={typeRef}>{SCHREIBER_TITLES[0]}</span>
              <span className="rrls-type-caret" />
            </div>
          </div>
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Du gibst mit einem Klick frei.</p>
            <details className="rrls-details rrls-details--inline">
              <summary className="rrls-summary rrls-summary--inline">
                <span className="rrls-summary-title">Wie das genau funktioniert</span>
                <span className="rrls-summary-plus" aria-hidden="true" />
              </summary>
              <p className="rrls-details-body">
                Du bekommst eine kurze Mail: Hier ist ein neuer Beitrag. Passt er, klickst du auf Freigeben.
                Passt er nicht, klickst du ihn weg. Nichts geht ohne dich online.
              </p>
            </details>
          </div>
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Google liest mit. Und die neuen Antwortmaschinen auch.</p>
          </div>
        </div>
      </div>

      {/* Kollege 02 — Der Empfang (navy) */}
      <div className="rrls-kollege rrls-kollege--navy">
        <div className="rrls-kollege-figure">
          <div className="rrls-figure-inner">
            <RabbitMark color="#1c2837" title="Der Empfang" style={{ display: "block", height: "clamp(140px, 18vw, 200px)", width: "auto" }} />
            <p className="rrls-kollege-name">Der Empfang</p>
            <p className="rrls-kollege-tag">dein digitaler Kollege</p>
            <p className="rrls-kollege-claim">Nimmt an, was reinkommt. Auch wenn du am Dach stehst.</p>
          </div>
        </div>
        <div className="rrls-kollege-beats">
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Termine buchen sich von allein.</p>
          </div>
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Keine Anfrage bleibt liegen.</p>
            <details className="rrls-details rrls-details--inline">
              <summary className="rrls-summary rrls-summary--inline">
                <span className="rrls-summary-title">Wie das genau funktioniert</span>
                <span className="rrls-summary-plus" aria-hidden="true" />
              </summary>
              <p className="rrls-details-body">
                Kommt eine Anfrage rein, bekommt der Kunde sofort eine Antwort und du eine Notiz.
                Niemand wartet, niemand geht verloren.
              </p>
            </details>
          </div>
          <div className="rrls-beat rrls-reveal">
            <p className="rrls-beat-head">Du entscheidest, wie viel er darf.</p>
            <p className="rrls-beat-sub">Nur vorschlagen und dich fragen, oder direkt erledigen. Dein Ruf, deine Regeln.</p>
          </div>
        </div>
      </div>

      {/* Auf-Anfrage-Reihe */}
      <div className="rrls-section rrls-anfrage-wrap">
        <div className="rrls-anfrage-grid">
          {ANFRAGE.map((a) => (
            <div key={a.name} className="rrls-anfrage-card rrls-reveal">
              <RabbitMark color="#5a5e68" title={a.name} style={{ display: "block", height: "40px", width: "auto" }} />
              <p className="rrls-anfrage-name">{a.name}</p>
              <p className="rrls-anfrage-text">{a.text}</p>
              <span className="rrls-anfrage-badge">auf Anfrage</span>
            </div>
          ))}
        </div>
        <p className="rrls-anfrage-foot rrls-reveal">Und das Team lernt ständig neue Fähigkeiten dazu.</p>
      </div>

      {/* ============ Kapitel 3 — Massarbeit ============ */}
      <div className="rrls-section rrls-massarbeit" id="ls-massarbeit">
        <h2 className="rr-statement rrls-h2 rrls-reveal">
          Und wenn du etwas brauchst, das es nicht gibt? Dann bauen wir es.
        </h2>
        <p className="rrls-body rrls-reveal">
          Shops, Kundenportale, Rechner, Schnittstellen zu deiner Software: alles selbst programmiert,
          kein Baukasten, kein Flickwerk. Wenn dein Betrieb es braucht, finden wir einen Weg.
        </p>
        <div className="rrls-reveal">
          <Link href="/relaunch-preview/kontakt" className="rr-btn-frame">
            <span className="rr-btn-frame__t">Erzähl uns davon</span>
            <i className="c1" /><i className="c2" /><i className="c3" /><i className="c4" />
          </Link>
        </div>
      </div>

      {/* ============ Kapitel 4 — Beweis + Start ============ */}
      <div className="rrls-section rrls-start" id="ls-start">
        <p className="rrls-beweis rrls-reveal">
          Übrigens: Diese Website hier hat den Schreiber selbst. Schau in seine{" "}
          <Link href="/relaunch-preview/tipps" className="rrls-inline-link">
            {articleCount} {articleCount === 1 ? "Artikel" : "Artikel"}
          </Link>
          .
        </p>

        <div className="rrls-steps rrls-reveal">
          {STEPS.map((s, i) => (
            <div key={s.label} className="rr-card-soft rr-card-soft--neutral rrls-step">
              <p className="rr-card-soft__eyebrow">Schritt {String(i + 1).padStart(2, "0")}</p>
              <p className="rr-card-soft__label">{s.label}</p>
              {s.sub && <p className="rrls-step-sub">{s.sub}</p>}
            </div>
          ))}
        </div>

        <div className="rrls-cta-panel rrls-reveal">
          <h2 className="rr-statement rrls-cta-h2">
            Zeig uns deinen Betrieb. Wir zeigen dir dein Team.
          </h2>
          <div className="rrls-cta-actions">
            <Link href="/relaunch-preview/kontakt" className="rr-btn-sweep rr-btn-sweep--red">
              Kostenlosen Entwurf anfragen
            </Link>
            <a href={`tel:${PHONE_TEL}`} className="rr-btn-frame">
              <span className="rr-btn-frame__t">Anrufen</span>
              <i className="c1" /><i className="c2" /><i className="c3" /><i className="c4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Kapitel-1-Inklusiv-Punkte ----
const FUNDAMENT: { title: string; body: string }[] = [
  { title: "Hosting inklusive", body: "Deine Seite liegt bei uns, schnell und sicher. Du musst dich um nichts kümmern." },
  { title: "Selbst ändern", body: "Öffnungszeiten, Texte, Bilder: das änderst du selbst, ohne uns anzurufen und ohne Zusatzkosten." },
  { title: "Zahlen im Klartext", body: "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch." },
  { title: "Ein Wächter passt auf", body: "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab." },
  { title: "Monatlicher Check", body: "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist." },
  { title: "Pflege inklusive", body: "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit." },
];

// ---- Auf-Anfrage-Kollegen ----
const ANFRAGE: { name: string; text: string }[] = [
  { name: "Der Vertriebler", text: "Sucht deine Wunschkunden und meldet sich bei ihnen." },
  { name: "Der Rufhüter", text: "Behält deine Google-Bewertungen im Blick." },
  { name: "Der Sichtbarmacher", text: "Sorgt dafür, dass dich auch die Antwortmaschinen empfehlen." },
];

// ---- Die 3 Schritte ----
const STEPS: { label: string; sub?: string }[] = [
  { label: "Du meldest dich" },
  { label: "Du siehst deinen Entwurf", sub: "Ganz ohne Vorkasse." },
  { label: "Erst dann entscheidest du" },
];

const CSS = `
.rrls-root{
  position:relative;
  background:#ffffff;
  color:#23262e;
  overflow-x:clip;
  padding-bottom:2vh;
}
.rrls-root *{ box-sizing:border-box; }

/* ===== Layout / Sektionen ===== */
.rrls-section{
  max-width:1080px;
  margin:0 auto;
  padding:clamp(48px,9vh,96px) clamp(20px,5vw,64px);
}
.rrls-h2{
  font-size:clamp(1.7rem,3.8vw,2.9rem);
  max-width:20ch;
}
.rrls-eyebrow{ color:#23262e; margin-bottom:16px; }
.rrls-lead{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.25rem,2.6vw,1.9rem);
  line-height:1.2; color:#23262e; margin-top:18px;
}
.rrls-body{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:clamp(1rem,1.4vw,1.15rem); line-height:1.6;
  color:#3a3e48; max-width:56ch; margin:20px 0 30px;
}

/* ===== Reveals (nur transform/opacity) ===== */
.rrls-root[data-reveal="on"] .rrls-reveal{
  opacity:0; transform:translateY(22px);
  transition:opacity .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .7s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-root[data-reveal="on"] .rrls-reveal.is-in{ opacity:1; transform:none; }

/* ===== Kapitel 0: Weiche ===== */
.rrls-weiche{ text-align:left; }
.rrls-doors{
  display:grid; grid-template-columns:1fr 1fr; gap:18px;
  margin-top:clamp(28px,5vh,52px);
}
.rrls-door{
  display:flex; flex-direction:column; gap:8px;
  text-align:left; cursor:pointer;
  background:#f6f5f1; border:1px solid #e4e4e0; border-radius:0;
  padding:26px 24px;
  transition:transform .25s var(--rr-ease,cubic-bezier(.6,0,.4,1)), border-color .25s var(--rr-ease,cubic-bezier(.6,0,.4,1)), background .25s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-door:hover{ transform:translateY(-3px); border-color:#f12032; background:#ffffff; }
.rrls-door:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.rrls-door-title{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.15rem,1.9vw,1.5rem); letter-spacing:-.01em; color:#23262e;
}
.rrls-door-sub{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.95rem; line-height:1.45; color:#5a5e68;
}

/* ===== Assistent ===== */
.rrls-assistant{
  overflow:hidden; max-height:0;
  transition:max-height .5s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-assistant.is-open{ max-height:1400px; }
.rrls-assistant-inner{
  margin-top:22px;
  background:#ffffff; border:1px solid #e4e4e0; border-radius:0;
  padding:clamp(22px,3.5vw,38px);
}
.rrls-assistant-top{
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  flex-wrap:wrap; margin-bottom:24px;
}
.rrls-progress{ display:flex; gap:8px; }
.rrls-progress-dot{
  width:26px; height:4px; border-radius:0; background:#e4e4e0;
  transition:background .3s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-progress-dot.is-done{ background:#23262e; }
.rrls-progress-dot.is-current{ background:#f12032; }
.rrls-exit{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.85rem; color:#5a5e68; text-decoration:none;
  border-bottom:1px solid rgba(90,94,104,.35); padding-bottom:1px;
  transition:color .2s, border-color .2s;
}
.rrls-exit:hover,.rrls-exit:focus-visible{ color:#f12032; border-color:#f12032; outline:none; }
.rrls-question{ animation:rrls-fade .4s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
@keyframes rrls-fade{ from{ opacity:0; transform:translateY(10px);} to{ opacity:1; transform:none;} }
.rrls-q{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.35rem,2.6vw,2rem); line-height:1.18; color:#23262e;
  margin-bottom:22px; max-width:22ch;
}
.rrls-choices{ display:flex; flex-direction:column; gap:10px; max-width:520px; }
.rrls-choice{
  text-align:left; cursor:pointer;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1.02rem; font-weight:500; color:#23262e;
  background:#f6f5f1; border:1px solid #e4e4e0; border-radius:0;
  padding:15px 18px;
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)), border-color .2s, background .2s;
}
.rrls-choice:hover{ transform:translateX(4px); border-color:#f12032; background:#ffffff; }
.rrls-choice:focus-visible{ outline:2px solid #f12032; outline-offset:2px; }
.rrls-back{
  margin-top:20px; cursor:pointer;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.9rem; color:#5a5e68; background:none; border:none; padding:6px 0;
}
.rrls-back:hover,.rrls-back:focus-visible{ color:#f12032; outline:none; }
.rrls-result{ animation:rrls-fade .5s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.rrls-result-lead{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.95rem; text-transform:uppercase; letter-spacing:.08em; color:#5a5e68;
  margin-bottom:18px;
}
.rrls-result-list{ list-style:none; margin:0 0 26px; padding:0; display:flex; flex-direction:column; gap:16px; }
.rrls-result-item{
  display:flex; gap:14px; align-items:flex-start;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1.05rem; line-height:1.5; color:#3a3e48; max-width:60ch;
}
.rrls-result-title{ color:#23262e; font-weight:700; }
.rrls-check{ flex:none; color:#f12032; margin-top:1px; }
.rrls-result-closing{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.15rem,2vw,1.5rem); color:#23262e; margin-bottom:22px;
}
.rrls-result-actions{ display:flex; align-items:center; gap:22px; flex-wrap:wrap; }

/* ===== Kapitel 1: Skulptur ===== */
.rrls-sculpt-wrap{ position:relative; height:190vh; }
.rrls-sculpt-sticky{
  position:sticky; top:0; height:100vh; height:100dvh;
  overflow:hidden; background:#ffffff;
  display:flex; align-items:center; justify-content:center;
}
.rrls-sculpt-stage{ position:absolute; inset:0; }
.rrls-sculpt-msg{
  position:relative; z-index:2;
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.5rem,3.4vw,2.6rem); line-height:1.12; color:#23262e;
  text-align:center; max-width:16ch;
  background:rgba(255,255,255,.72);
  padding:.3em .6em;
  backdrop-filter:blur(2px);
}

/* ===== Kapitel 1: Checkliste ===== */
.rrls-fundament-list{ padding-top:clamp(24px,4vh,48px); }
.rrls-checklist{
  list-style:none; margin:0; padding:0;
  display:grid; grid-template-columns:1fr 1fr; gap:2px;
  border:1px solid #e4e4e0; background:#e4e4e0;
}
.rrls-checkitem{ background:#ffffff; }
.rrls-details{ }
.rrls-summary{
  display:flex; align-items:center; gap:14px; cursor:pointer;
  padding:20px 22px; list-style:none;
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.05rem,1.5vw,1.2rem); color:#23262e;
}
.rrls-summary::-webkit-details-marker{ display:none; }
.rrls-summary-title{ flex:1; }
.rrls-check--red{ color:#f12032; }
.rrls-summary-plus{
  flex:none; position:relative; width:16px; height:16px;
}
.rrls-summary-plus::before,.rrls-summary-plus::after{
  content:""; position:absolute; left:50%; top:50%; background:#5a5e68;
  transition:transform .3s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-summary-plus::before{ width:14px; height:2px; transform:translate(-50%,-50%); }
.rrls-summary-plus::after{ width:2px; height:14px; transform:translate(-50%,-50%); }
.rrls-details[open] .rrls-summary-plus::after{ transform:translate(-50%,-50%) scaleY(0); }
.rrls-details-body{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1rem; line-height:1.55; color:#5a5e68;
  padding:0 22px 22px 50px; margin:0;
}
.rrls-fundament-foot{ margin-top:34px; }
.rrls-foot-strong{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.15rem,2vw,1.5rem); letter-spacing:-.01em; color:#23262e;
}
.rrls-foot-hint{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.98rem; color:#5a5e68; margin-top:8px;
}
.rrls-inline-link{ color:#f12032; text-decoration:none; border-bottom:1px solid rgba(241,32,50,.4); }
.rrls-inline-link:hover,.rrls-inline-link:focus-visible{ border-color:#f12032; outline:none; }

/* ===== Kapitel 2: Team ===== */
.rrls-kollege{
  max-width:1080px; margin:0 auto;
  padding:clamp(24px,4vh,48px) clamp(20px,5vw,64px);
  display:grid; grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);
  gap:clamp(28px,5vw,64px); align-items:start;
}
.rrls-kollege-figure{ position:sticky; top:16vh; align-self:start; }
.rrls-figure-inner{ display:flex; flex-direction:column; gap:6px; }
.rrls-kollege-name{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.4rem,2.6vw,2rem); letter-spacing:-.01em; color:#23262e;
  margin-top:18px;
}
.rrls-kollege-tag{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.8rem; text-transform:uppercase; letter-spacing:.12em; color:#f12032;
}
.rrls-kollege--navy .rrls-kollege-tag{ color:#1c2837; }
.rrls-kollege-claim{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.15rem,1.8vw,1.4rem); line-height:1.25; color:#3a3e48;
  margin-top:10px; max-width:24ch;
}
.rrls-kollege-beats{ display:flex; flex-direction:column; }
.rrls-beat{
  min-height:50vh; display:flex; flex-direction:column; justify-content:center;
  padding:4vh 0; border-top:1px solid #ececea;
}
.rrls-beat:first-child{ border-top:none; }
.rrls-beat-head{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.3rem,2.6vw,2rem); line-height:1.12; letter-spacing:-.015em; color:#23262e;
  max-width:20ch;
}
.rrls-beat-sub{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1.02rem; line-height:1.5; color:#5a5e68; margin-top:12px; max-width:34ch;
}
.rrls-type{
  margin-top:20px; display:inline-flex; align-items:center;
  background:#f6f5f1; border:1px solid #e4e4e0;
  padding:14px 18px; max-width:100%;
}
.rrls-type-text{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(.95rem,1.4vw,1.15rem); color:#23262e;
  white-space:nowrap; overflow:hidden; text-overflow:clip;
}
.rrls-type-caret{
  display:inline-block; width:2px; height:1.1em; background:#f12032; margin-left:2px;
  animation:rrls-blink 1s steps(1) infinite;
}
@keyframes rrls-blink{ 50%{ opacity:0; } }

/* Inline-Aufklapper in den Beats */
.rrls-details--inline{ margin-top:16px; max-width:44ch; }
.rrls-summary--inline{
  padding:12px 0; gap:10px; font-size:1rem; color:#5a5e68; font-weight:600;
  border-bottom:1px solid #ececea;
}
.rrls-summary--inline .rrls-summary-title{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; }
.rrls-details--inline .rrls-details-body{ padding:14px 0 4px; }

/* ===== Auf-Anfrage-Reihe ===== */
.rrls-anfrage-grid{
  display:grid; grid-template-columns:repeat(3,1fr); gap:16px;
}
.rrls-anfrage-card{
  border:1px dashed #c7c7c2; border-radius:0; background:#ffffff;
  padding:24px 22px; display:flex; flex-direction:column; gap:8px;
}
.rrls-anfrage-name{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:1.15rem; color:#23262e; margin-top:12px;
}
.rrls-anfrage-text{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.95rem; line-height:1.5; color:#5a5e68; flex:1;
}
.rrls-anfrage-badge{
  align-self:flex-start;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.7rem; text-transform:uppercase; letter-spacing:.1em; color:#5a5e68;
  border:1px solid #d7d7d2; padding:4px 8px;
}
.rrls-anfrage-foot{
  margin-top:28px;
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.1rem,1.9vw,1.45rem); color:#23262e; text-align:center;
}

/* ===== Kapitel 3: Massarbeit ===== */
.rrls-massarbeit .rr-btn-frame{ margin-top:6px; }

/* ===== Kapitel 4: Beweis + Start ===== */
.rrls-beweis{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.25rem,2.4vw,1.8rem); line-height:1.25; color:#23262e;
  max-width:30ch; margin-bottom:clamp(36px,6vh,64px);
}
.rrls-steps{
  display:grid; grid-template-columns:repeat(3,1fr); gap:18px;
  margin-bottom:clamp(44px,7vh,80px);
}
.rrls-step{ width:auto; height:auto; min-height:200px; }
.rrls-step-sub{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.9rem; color:#5a5e68; margin-top:6px;
}
.rrls-cta-panel{
  background:#1c2837; color:#f6f5f1; border-radius:0;
  padding:clamp(40px,7vw,80px) clamp(26px,5vw,64px);
  text-align:center;
}
.rrls-cta-h2{ color:#f6f5f1; font-size:clamp(1.7rem,3.6vw,2.8rem); max-width:22ch; margin:0 auto; }
.rrls-cta-actions{
  display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap;
  margin-top:clamp(26px,4vh,40px);
}
.rrls-cta-panel .rr-btn-sweep{ background:#ffffff; color:#1c2837; }
.rrls-cta-panel .rr-btn-frame{ --c:#f6f5f1; color:#f6f5f1; }

/* ===== Kapitel-Orientierung (rechts) ===== */
.rrls-dots{
  position:fixed; right:clamp(14px,2vw,28px); top:50%; transform:translateY(-50%);
  z-index:50; display:none; flex-direction:column; gap:16px;
}
.rrls-dot{
  position:relative; width:12px; height:12px; padding:0; cursor:pointer;
  background:none; border:none;
}
.rrls-dot::after{
  content:""; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  width:8px; height:8px; border-radius:50%; background:#c7c7c2;
  transition:background .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .3s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-dot.is-active::after{ background:#f12032; transform:translate(-50%,-50%) scale(1.35); }
.rrls-dot:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.rrls-dot-label{
  position:absolute; right:20px; top:50%; transform:translateY(-50%);
  white-space:nowrap; opacity:0; pointer-events:none;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:#23262e;
  transition:opacity .25s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrls-dot:hover .rrls-dot-label,.rrls-dot.is-active .rrls-dot-label{ opacity:1; }
@media (min-width:900px){ .rrls-dots{ display:flex; } }

/* ===== Mobile ===== */
@media (max-width:820px){
  .rrls-doors{ grid-template-columns:1fr; }
  .rrls-checklist{ grid-template-columns:1fr; }
  .rrls-kollege{ grid-template-columns:1fr; gap:24px; }
  .rrls-kollege-figure{ position:static; top:auto; }
  .rrls-figure-inner{ align-items:flex-start; }
  .rrls-beat{ min-height:auto; padding:22px 0; }
  .rrls-anfrage-grid{ grid-template-columns:1fr; }
  .rrls-steps{ grid-template-columns:1fr; }
  .rrls-sculpt-wrap{ height:auto; }
  .rrls-sculpt-sticky{ position:relative; height:70vh; }
}

/* ===== Reduced Motion: alles statisch sichtbar ===== */
@media (prefers-reduced-motion:reduce){
  .rrls-root[data-reveal="on"] .rrls-reveal{ opacity:1 !important; transform:none !important; transition:none; }
  .rrls-question,.rrls-result{ animation:none; }
  .rrls-type-caret{ animation:none; }
  .rrls-sculpt-wrap{ height:auto; }
  .rrls-sculpt-sticky{ position:relative; height:70vh; }
  .rrls-kollege-figure{ position:static; }
  .rrls-door:hover,.rrls-choice:hover{ transform:none; }
}
`;
