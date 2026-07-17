"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { talosBus } from "./talosController";

/**
 * TalosPage — scrollende Text-Huelle UEBER der 3D-Buehne. Die 7 Kapitel aus der
 * Spec liegen als normale, SSR-lesbare Sektionen im DOM (Crawler/LLM + Fallback
 * ohne JS/WebGL sehen alles). Die fixe Buehne (TalosStage) wird nur bei faehigem
 * Geraet dynamisch (ssr:false) nachgeladen und weich eingeblendet — LCP-Schutz.
 *
 * Der Scroll steuert einen zentralen Fortschritt: pro sichtbarem Kapitel wird
 * ein exakter Keyframe-Bereich [pStart,pEnd] linear durchfahren, damit die
 * Kamera-Regie zur Leseposition passt (statt grobem globalem scrollY). Alles
 * reversibel. prefers-reduced-motion / schwaches Geraet: kein 3D, Poster-Hero +
 * normale Reveals.
 */

const TalosStage = dynamic(() => import("./TalosStage"), { ssr: false });

const PHONE_TEL = "+436769000955";

// ---- Assistent (Logik 1:1 aus LeistungenStory) ------------------------------
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

function buildResult(answers: Record<string, string>): ResultItem[] {
  const items: ResultItem[] = [
    { title: "Deine Website", text: "Individuell gebaut, gehört dir, läuft ab dem ersten Tag." },
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

// ---- Kapitel: Keyframe-Bereich pro Kapitel (deckt talosController-Anker) -----
type Chapter = { id: string; label: string; pStart: number; pEnd: number };
const CHAPTERS: Chapter[] = [
  { id: "tal-hero", label: "Hallo", pStart: 0.0, pEnd: 0.08 },
  { id: "tal-wer", label: "Wer", pStart: 0.1, pEnd: 0.2 },
  { id: "tal-fundament", label: "Fundament", pStart: 0.24, pEnd: 0.36 },
  { id: "tal-faehig", label: "Können", pStart: 0.4, pEnd: 0.56 },
  { id: "tal-tag", label: "Arbeitstag", pStart: 0.58, pEnd: 0.74 },
  { id: "tal-frag", label: "Frag Talos", pStart: 0.78, pEnd: 0.86 },
  { id: "tal-start", label: "Start", pStart: 0.9, pEnd: 1.0 },
];

const SCHREIBER_TITLES = [
  "Was kostet eine Therme in Oberösterreich?",
  "Heizung entlüften: so geht es richtig.",
  "Förderung 2026: das steht dir zu.",
];

const FUNDAMENT = [
  { title: "Hosting inklusive", body: "Deine Seite liegt bei uns, schnell und sicher. Du musst dich um nichts kümmern." },
  { title: "Selbst ändern", body: "Öffnungszeiten, Texte, Bilder: das änderst du selbst, ohne uns anzurufen und ohne Zusatzkosten." },
  { title: "Zahlen im Klartext", body: "Du siehst, wie viele Leute vorbeischauen und wie viele sich melden. Ohne Fachchinesisch." },
  { title: "Ein Wächter passt auf", body: "Geht etwas nicht, merken wir es meist vor dir. Ausfälle fängt die Seite selbst ab." },
  { title: "Monatlicher Check", body: "Einmal im Monat schauen wir drauf, ob alles rund läuft und aktuell ist." },
  { title: "Pflege inklusive", body: "Updates, kleine Korrekturen, Sicherheit: das läuft im Hintergrund einfach mit." },
];

const LERNT = [
  { name: "Der Vertriebler", text: "Sucht deine Wunschkunden und meldet sich bei ihnen." },
  { name: "Der Rufhüter", text: "Behält deine Google-Bewertungen im Blick." },
  { name: "Der Sichtbarmacher", text: "Sorgt dafür, dass dich auch die Antwortmaschinen empfehlen." },
];

const TAG = [
  { time: "06:00", head: "Noch vor dir wach.", body: "Er prüft in Ruhe, ob über Nacht alles rund gelaufen ist." },
  { time: "09:15", head: "Die erste Anfrage kommt rein.", body: "Er antwortet sofort, und du bekommst eine kurze Notiz." },
  { time: "12:30", head: "Während du Mittag machst,", body: "schreibt er schon am nächsten Beitrag für deine Seite." },
  { time: "17:40", head: "Feierabend für dich.", body: "Er bucht in Ruhe noch einen Termin für nächste Woche ein." },
  { time: "22:41", head: "Längst dunkel.", body: "Er hält die Seite wach, damit du ruhig schlafen kannst." },
];

const STEPS = [
  { label: "Du meldest dich", sub: undefined as string | undefined },
  { label: "Du siehst deinen Entwurf", sub: "Ganz ohne Vorkasse." },
  { label: "Erst dann entscheidest du", sub: undefined },
];

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

export default function TalosPage({ articleCount }: { articleCount: number }) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [enable3d, setEnable3d] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);

  // Assistent-State
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const assistantRef = useRef<HTMLDivElement>(null);

  // ---- Setup: reduced-motion + Geraete-Faehigkeit --------------------------
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setR = () => {
      setReduced(mq.matches);
      talosBus.reduced = mq.matches;
    };
    setR();
    mq.addEventListener?.("change", setR);

    // WebGL2 + Speicher-Heuristik (Spec: deviceMemory<=4 oder kein WebGL2 -> 2D).
    let webgl2 = false;
    try {
      const c = document.createElement("canvas");
      webgl2 = !!c.getContext("webgl2");
    } catch {
      webgl2 = false;
    }
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const capable = webgl2 && !mq.matches && (mem === undefined || mem > 4);

    let idleHandle: number | undefined;
    let io: IntersectionObserver | undefined;
    if (capable) {
      // 3D erst nach First Paint / bei Idle bzw. wenn der Hero sichtbar ist.
      const load = () => setEnable3d(true);
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      const hero = document.getElementById("tal-hero");
      if (hero && "IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (ents) => {
            if (ents.some((e) => e.isIntersecting)) {
              if (ric) idleHandle = ric(load);
              else idleHandle = window.setTimeout(load, 200);
              io?.disconnect();
            }
          },
          { rootMargin: "200px" },
        );
        io.observe(hero);
      } else {
        idleHandle = window.setTimeout(load, 300);
      }
    }
    return () => {
      mq.removeEventListener?.("change", setR);
      io?.disconnect();
      if (idleHandle) window.clearTimeout(idleHandle);
    };
  }, []);

  // ---- Scroll -> zentraler Fortschritt (pro Kapitel exakter Keyframe-Bereich)
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    let pending = false;
    const compute = () => {
      pending = false;
      const vh = window.innerHeight;
      const center = vh / 2;
      // aktives Kapitel = dessen Sektion die Viewport-Mitte enthaelt.
      let p = 0;
      let chosen = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= center && r.bottom >= center) {
          const local = clamp01((center - r.top) / Math.max(1, r.height));
          p = CHAPTERS[i].pStart + (CHAPTERS[i].pEnd - CHAPTERS[i].pStart) * local;
          chosen = i;
          break;
        }
        if (r.bottom < center) {
          p = CHAPTERS[i].pEnd;
          chosen = i;
        }
      }
      talosBus.progress = p;
      talosBus.invalidate?.();
      // UI-Fortschrittslinie (global) + aktiver Punkt.
      const doc = document.documentElement;
      const g = clamp01(window.scrollY / Math.max(1, doc.scrollHeight - vh));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${g})`;
      setActiveChapter(chosen);
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  // ---- Cursor-Blickfolge (nur feiner Pointer / Desktop) --------------------
  useEffect(() => {
    if (!mounted || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      talosBus.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      talosBus.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      talosBus.invalidate?.();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, reduced]);

  // ---- Reveals (opacity/transform; ohne JS bleibt alles sichtbar) ----------
  useEffect(() => {
    if (!mounted || reduced) return;
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    root.setAttribute("data-reveal", "on");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".tal-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, reduced]);

  // ---- Schreiber-Selbsttipp -------------------------------------------------
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

  const scrollToId = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [reduced],
  );

  const openAssistant = useCallback(() => {
    setAssistantOpen(true);
    setStep(0);
    setAnswers({});
    talosBus.activeQuestion = 0;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        assistantRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      });
    });
  }, [reduced]);

  const answer = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setStep((s) => {
      const next = s + 1;
      talosBus.activeQuestion = next < QUESTIONS.length ? next : -1;
      talosBus.invalidate?.();
      return next;
    });
  }, []);

  const result = useMemo(() => buildResult(answers), [answers]);
  const atResult = step >= QUESTIONS.length;

  return (
    <div className="tal-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* 3D-Buehne (fixed, hinter dem Text). Nur bei faehigem Geraet. */}
      {enable3d && (
        <div className="tal-stage" aria-hidden="true">
          <TalosStage />
        </div>
      )}
      {/* Poster-Fallback: sanfter Bronze-Verlauf, wenn kein 3D. */}
      {mounted && !enable3d && <div className="tal-poster" aria-hidden="true" />}

      {/* Kapitel-Punkte rechts (Desktop) */}
      <nav className="tal-dots" aria-label="Kapitel">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`tal-dot${i === activeChapter ? " is-active" : ""}`}
            aria-label={`Zu ${c.label}`}
            aria-current={i === activeChapter ? "true" : undefined}
            onClick={() => scrollToId(c.id)}
          >
            <span className="tal-dot-label">{c.label}</span>
          </button>
        ))}
      </nav>

      {/* Scroll-Progress-Linie oben */}
      <div className="tal-progress" aria-hidden="true">
        <span className="tal-progress-bar" ref={progressRef} />
      </div>

      {/* Anrufen fix erreichbar */}
      <a href={`tel:${PHONE_TEL}`} className="tal-call" aria-label="Anrufen">
        Anrufen
      </a>

      {/* ================= 0 HERO ================= */}
      <section className="tal-section tal-hero" id="tal-hero" aria-label="Hallo">
        <div className="tal-hero-copy tal-reveal">
          <h1 className="tal-h1">Deine Website bekommt einen Mitarbeiter.</h1>
          <p className="tal-hero-sub">Das ist Talos. Er arbeitet ab dem ersten Tag.</p>
          <p className="tal-scrollhint">Scroll weiter, er zeigt dir alles.</p>
        </div>
      </section>

      {/* ================= 1 WER IST TALOS ================= */}
      <section className="tal-section tal-wer" id="tal-wer" aria-label="Wer ist Talos">
        <div className="tal-lines">
          <p className="tal-line tal-reveal">Ich passe auf deine Website auf.</p>
          <p className="tal-line tal-reveal">Ich nehme an, was bei dir reinkommt.</p>
          <p className="tal-line tal-reveal">Und ich sorge dafür, dass etwas passiert.</p>
        </div>
      </section>

      {/* ================= 2 FUNDAMENT ================= */}
      <section className="tal-section tal-fundament" id="tal-fundament" aria-label="Das Fundament">
        <div className="tal-panel tal-reveal">
          <p className="tal-eyebrow">Das Fundament</p>
          <p className="tal-say">Das ist bei jeder Website von uns drin. Keine Extra-Rechnung.</p>
        </div>
        <ul className="tal-checklist">
          {FUNDAMENT.map((f) => (
            <li key={f.title} className="tal-checkitem tal-reveal">
              <details className="tal-details">
                <summary className="tal-summary">
                  <span className="tal-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
                      <path d="M4 12.5 10 18.5 20 6.5" />
                    </svg>
                  </span>
                  <span className="tal-summary-title">{f.title}</span>
                  <span className="tal-summary-plus" aria-hidden="true" />
                </summary>
                <p className="tal-details-body">{f.body}</p>
              </details>
            </li>
          ))}
        </ul>
        <p className="tal-foot tal-reveal">
          Pakete und Fixpreise stehen auf der{" "}
          <Link href="/preise" className="tal-inline-link">Preisseite</Link>.
        </p>
      </section>

      {/* ================= 3 FAEHIGKEITEN ================= */}
      <section className="tal-section tal-faehig" id="tal-faehig" aria-label="Was Talos kann">
        <div className="tal-panel tal-reveal">
          <p className="tal-eyebrow">Was ich kann</p>
          <p className="tal-say">Zwei Dinge übernehme ich sofort für dich. Ganz von allein.</p>
        </div>

        <div className="tal-skill tal-reveal">
          <p className="tal-skill-name">Ich schreibe über dein Handwerk.</p>
          <div className="tal-type" aria-hidden="true">
            <span className="tal-type-text" ref={typeRef}>{SCHREIBER_TITLES[0]}</span>
            <span className="tal-type-caret" />
          </div>
          <p className="tal-skill-body">Jede Woche etwas Neues, damit Google und die Antwortmaschinen dich finden.</p>
        </div>

        <div className="tal-skill tal-reveal">
          <p className="tal-skill-name">Ich nehme Termine und Anfragen an.</p>
          <div className="tal-demo" aria-hidden="true">
            <span className="tal-demo-dot" />
            <span>Neue Anfrage angenommen, Termin am Dienstag vorgeschlagen.</span>
          </div>
          <p className="tal-skill-body">Auch dann, wenn du gerade keine Zeit hast oder am Dach stehst.</p>
        </div>

        <div className="tal-freigabe tal-reveal">
          <p className="tal-say tal-say--center">Nichts geht raus ohne dich. Ein Klick von dir genügt.</p>
        </div>

        <div className="tal-lernt tal-reveal">
          <p className="tal-lernt-head">Das lerne ich gerade dazu:</p>
          <div className="tal-lernt-grid">
            {LERNT.map((l) => (
              <div key={l.name} className="tal-lernt-card">
                <p className="tal-lernt-name">{l.name}</p>
                <p className="tal-lernt-text">{l.text}</p>
                <span className="tal-badge">auf Anfrage</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4 EIN ARBEITSTAG ================= */}
      <section className="tal-section tal-tag" id="tal-tag" aria-label="Ein Arbeitstag">
        <div className="tal-panel tal-reveal">
          <p className="tal-eyebrow">Ein ganz normaler Tag</p>
          <p className="tal-say">So sieht ein Arbeitstag von mir aus, während du deinen machst.</p>
        </div>
        <ol className="tal-timeline">
          {TAG.map((t) => (
            <li key={t.time} className="tal-tl-item tal-reveal">
              <span className="tal-tl-time">{t.time}</span>
              <div className="tal-tl-body">
                <p className="tal-tl-head">{t.head}</p>
                <p className="tal-tl-text">{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= 5 FRAG TALOS ================= */}
      <section className="tal-section tal-frag" id="tal-frag" aria-label="Frag Talos">
        <div className="tal-panel tal-reveal">
          <p className="tal-eyebrow">Frag mich</p>
          <p className="tal-say">Ein paar Fragen, dann zeige ich dir, was zu deinem Betrieb passt.</p>
        </div>

        {!assistantOpen ? (
          <div className="tal-frag-start tal-reveal">
            <button type="button" className="tal-btn tal-btn--red" onClick={openAssistant}>
              Los geht&apos;s
            </button>
            <Link href="/relaunch-preview/kontakt" className="tal-exit">
              Ich weiß schon, was ich will
            </Link>
          </div>
        ) : (
          <div className="tal-assistant" ref={assistantRef}>
            <div className="tal-assistant-top">
              <div className="tal-qprogress" aria-hidden="true">
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`tal-qdot${i < step ? " is-done" : i === step && !atResult ? " is-current" : ""}`}
                  />
                ))}
              </div>
              <Link href="/relaunch-preview/kontakt" className="tal-exit">
                Ich weiß schon, was ich will
              </Link>
            </div>

            {!atResult ? (
              <div className="tal-question" key={step}>
                <p className="tal-q">{QUESTIONS[step].q}</p>
                <div className="tal-choices">
                  {QUESTIONS[step].choices.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className="tal-choice"
                      onClick={() => answer(QUESTIONS[step].id, c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    className="tal-back"
                    onClick={() => {
                      setStep((s) => Math.max(0, s - 1));
                      talosBus.activeQuestion = Math.max(0, step - 1);
                    }}
                  >
                    Zurück
                  </button>
                )}
              </div>
            ) : (
              <div className="tal-result">
                <p className="tal-result-lead">Dann passt für den Anfang das hier:</p>
                <ul className="tal-result-list">
                  {result.map((item) => (
                    <li key={item.title} className="tal-result-item">
                      <span className="tal-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
                          <path d="M4 12.5 10 18.5 20 6.5" />
                        </svg>
                      </span>
                      <span>
                        <strong className="tal-result-title">{item.title}.</strong> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="tal-result-closing">So starten die meisten Betriebe.</p>
                <div className="tal-result-actions">
                  <Link href="/relaunch-preview/kontakt" className="tal-btn tal-btn--red">
                    Kostenlosen Entwurf genau dafür anfragen
                  </Link>
                  <button type="button" className="tal-back" onClick={() => setStep(QUESTIONS.length - 1)}>
                    Zurück
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ================= 6 MASSARBEIT + BEWEIS + START ================= */}
      <section className="tal-section tal-start" id="tal-start" aria-label="Maßarbeit und Start">
        <div className="tal-panel tal-reveal">
          <p className="tal-say">Braucht dein Betrieb etwas, das es nicht gibt? Wir bauen es.</p>
          <p className="tal-mass-body">
            Shops, Kundenportale, Rechner, Schnittstellen zu deiner Software: alles selbst programmiert, kein
            Baukasten.
          </p>
        </div>

        <p className="tal-beweis tal-reveal">
          Übrigens: Diese Website hier hat den Schreiber selbst. Schau in seine{" "}
          <Link href="/relaunch-preview/tipps" className="tal-inline-link">
            {articleCount} Artikel
          </Link>
          .
        </p>

        <div className="tal-steps tal-reveal">
          {STEPS.map((s, i) => (
            <div key={s.label} className="tal-step">
              <p className="tal-step-eyebrow">Schritt {String(i + 1).padStart(2, "0")}</p>
              <p className="tal-step-label">{s.label}</p>
              {s.sub && <p className="tal-step-sub">{s.sub}</p>}
            </div>
          ))}
        </div>

        <div className="tal-cta tal-reveal">
          <h2 className="tal-cta-h2">Zeig uns deinen Betrieb. Wir zeigen dir dein Team.</h2>
          <div className="tal-cta-actions">
            <Link href="/relaunch-preview/kontakt" className="tal-btn tal-btn--white">
              Kostenlosen Entwurf anfragen
            </Link>
            <a href={`tel:${PHONE_TEL}`} className="tal-btn tal-btn--ghost">
              Anrufen
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const CSS = `
.tal-root{ position:relative; color:#23262e; background:#ffffff; overflow-x:clip; }
.tal-root *{ box-sizing:border-box; }

/* 3D-Buehne fest hinter dem Text; Poster als 2D-Fallback. */
.tal-stage{ position:fixed; inset:0; z-index:0; pointer-events:none; }
.tal-stage canvas{ pointer-events:none; }
.tal-poster{
  position:fixed; inset:0; z-index:0; pointer-events:none;
  background:
    radial-gradient(120% 80% at 50% 30%, #fbf1e3 0%, #f6eee4 40%, #eef1f4 100%);
}

/* Sektionen liegen ueber der Buehne, transparent, damit Talos durchscheint. */
.tal-section{
  position:relative; z-index:1;
  max-width:1120px; margin:0 auto;
  padding:clamp(56px,10vh,120px) clamp(20px,5vw,72px);
  min-height:110vh;
  display:flex; flex-direction:column; justify-content:center;
}
.tal-hero{ min-height:100vh; }

/* Lesbarkeits-Panel ueber wechselndem 3D-Hintergrund. */
.tal-panel{
  align-self:flex-start; max-width:34ch;
  background:rgba(255,255,255,.78); backdrop-filter:blur(3px);
  padding:clamp(18px,2.4vw,26px) clamp(20px,2.6vw,30px);
  border:1px solid rgba(35,38,46,.06);
}
.tal-eyebrow{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.8rem; text-transform:uppercase; letter-spacing:.14em; color:#23262e;
  margin-bottom:12px;
}
.tal-say{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.3rem,2.8vw,2.1rem); line-height:1.2; color:#23262e;
}
.tal-say--center{ text-align:center; max-width:22ch; margin:0 auto; }

/* Hero */
.tal-hero-copy{ max-width:15ch; align-self:flex-start; }
@media (min-width:821px){ .tal-hero-copy{ max-width:26ch; } }
.tal-h1{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:800;
  font-size:clamp(2.1rem,6vw,4.2rem); line-height:1.02; letter-spacing:-.02em;
  color:#23262e; margin:0;
  text-shadow:0 1px 24px rgba(255,255,255,.6);
}
.tal-hero-sub{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.2rem,2.6vw,1.9rem); line-height:1.25; color:#3a3e48;
  margin-top:20px; max-width:24ch;
}
.tal-scrollhint{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.9rem; letter-spacing:.06em; color:#5a5e68; margin-top:clamp(28px,5vh,52px);
}

/* Kapitel 1: gestaffelte Sprechzeilen */
.tal-lines{ display:flex; flex-direction:column; gap:clamp(20px,4vh,44px); max-width:22ch; }
.tal-line{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.5rem,3.4vw,2.6rem); line-height:1.16; color:#23262e;
  background:rgba(255,255,255,.7); backdrop-filter:blur(2px);
  padding:.15em .45em; align-self:flex-start;
}

/* Kapitel 2: Checkliste */
.tal-checklist{
  list-style:none; margin:clamp(24px,4vh,44px) 0 0; padding:0;
  display:grid; grid-template-columns:1fr 1fr; gap:2px;
  border:1px solid #e4e4e0; background:#e4e4e0;
}
.tal-checkitem{ background:#ffffff; }
.tal-summary{
  display:flex; align-items:center; gap:14px; cursor:pointer;
  padding:20px 22px; list-style:none;
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.02rem,1.5vw,1.18rem); color:#23262e;
}
.tal-summary::-webkit-details-marker{ display:none; }
.tal-summary-title{ flex:1; }
.tal-check{ flex:none; color:#f12032; margin-top:1px; }
.tal-summary-plus{ flex:none; position:relative; width:16px; height:16px; }
.tal-summary-plus::before,.tal-summary-plus::after{
  content:""; position:absolute; left:50%; top:50%; background:#5a5e68;
  transition:transform .3s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.tal-summary-plus::before{ width:14px; height:2px; transform:translate(-50%,-50%); }
.tal-summary-plus::after{ width:2px; height:14px; transform:translate(-50%,-50%); }
.tal-details[open] .tal-summary-plus::after{ transform:translate(-50%,-50%) scaleY(0); }
.tal-details-body{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1rem; line-height:1.55; color:#5a5e68; padding:0 22px 22px 50px; margin:0;
}
.tal-foot{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.98rem; color:#5a5e68; margin-top:22px;
}
.tal-inline-link{ color:#f12032; text-decoration:none; border-bottom:1px solid rgba(241,32,50,.4); }
.tal-inline-link:hover,.tal-inline-link:focus-visible{ border-color:#f12032; outline:none; }

/* Kapitel 3: Faehigkeiten */
.tal-skill{ max-width:40ch; margin-top:clamp(40px,8vh,90px); }
.tal-skill:nth-of-type(odd){ align-self:flex-start; }
.tal-skill-name{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.3rem,2.6vw,2rem); line-height:1.14; letter-spacing:-.015em; color:#23262e;
}
.tal-skill-body{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:1.02rem; line-height:1.5; color:#5a5e68; margin-top:14px; max-width:34ch;
}
.tal-type{
  margin-top:18px; display:inline-flex; align-items:center;
  background:#ffffff; border:1px solid #e4e4e0; padding:14px 18px; max-width:100%;
}
.tal-type-text{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(.95rem,1.4vw,1.12rem); color:#23262e; white-space:nowrap; overflow:hidden;
}
.tal-type-caret{ display:inline-block; width:2px; height:1.1em; background:#f12032; margin-left:2px; animation:tal-blink 1s steps(1) infinite; }
@keyframes tal-blink{ 50%{ opacity:0; } }
.tal-demo{
  margin-top:18px; display:inline-flex; align-items:center; gap:10px;
  background:#ffffff; border:1px solid #e4e4e0; padding:14px 18px;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.98rem; color:#3a3e48;
}
.tal-demo-dot{ width:9px; height:9px; border-radius:50%; background:#f12032; flex:none; }
.tal-freigabe{ margin:clamp(48px,9vh,100px) 0; display:flex; justify-content:center; }
.tal-freigabe .tal-say{
  background:rgba(255,255,255,.85); backdrop-filter:blur(3px);
  border:1px solid rgba(35,38,46,.06); padding:clamp(16px,2.2vw,24px) clamp(20px,2.8vw,32px);
}
.tal-lernt{ margin-top:clamp(24px,4vh,48px); }
.tal-lernt-head{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.82rem; text-transform:uppercase; letter-spacing:.12em; color:#5a5e68; margin-bottom:16px;
}
.tal-lernt-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.tal-lernt-card{
  border:1px dashed #c7c7c2; background:rgba(255,255,255,.82); padding:22px 20px;
  display:flex; flex-direction:column; gap:8px;
}
.tal-lernt-name{ font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700; font-size:1.1rem; color:#23262e; }
.tal-lernt-text{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.93rem; line-height:1.5; color:#5a5e68; flex:1; }
.tal-badge{
  align-self:flex-start; font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.68rem; text-transform:uppercase; letter-spacing:.1em; color:#5a5e68;
  border:1px solid #d7d7d2; padding:4px 8px;
}

/* Kapitel 4: Timeline */
.tal-timeline{ list-style:none; margin:clamp(24px,4vh,44px) 0 0; padding:0; display:flex; flex-direction:column; gap:clamp(28px,6vh,64px); }
.tal-tl-item{ display:flex; gap:clamp(18px,3vw,40px); align-items:baseline; max-width:44ch; }
.tal-tl-time{
  font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:800;
  font-size:clamp(1.1rem,2vw,1.6rem); color:#f12032; letter-spacing:-.01em; flex:none; min-width:5ch;
}
.tal-tl-head{ font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700; font-size:clamp(1.1rem,2vw,1.5rem); color:#23262e; line-height:1.15; }
.tal-tl-text{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:1rem; line-height:1.5; color:#5a5e68; margin-top:6px; }

/* Kapitel 5: Assistent */
.tal-frag-start{ display:flex; align-items:center; gap:24px; flex-wrap:wrap; margin-top:clamp(28px,5vh,52px); }
.tal-assistant{
  margin-top:clamp(28px,5vh,52px); max-width:600px;
  background:rgba(255,255,255,.92); backdrop-filter:blur(4px);
  border:1px solid #e4e4e0; padding:clamp(24px,3.6vw,40px);
}
.tal-assistant-top{ display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:24px; }
.tal-qprogress{ display:flex; gap:8px; }
.tal-qdot{ width:26px; height:4px; background:#e4e4e0; transition:background .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tal-qdot.is-done{ background:#23262e; }
.tal-qdot.is-current{ background:#f12032; }
.tal-exit{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.85rem; color:#5a5e68;
  text-decoration:none; border-bottom:1px solid rgba(90,94,104,.35); padding-bottom:1px;
}
.tal-exit:hover,.tal-exit:focus-visible{ color:#f12032; border-color:#f12032; outline:none; }
.tal-question{ animation:tal-fade .4s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
@keyframes tal-fade{ from{ opacity:0; transform:translateY(10px);} to{ opacity:1; transform:none;} }
.tal-q{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.35rem,2.6vw,2rem); line-height:1.18; color:#23262e; margin-bottom:22px; max-width:22ch;
}
.tal-choices{ display:flex; flex-direction:column; gap:10px; max-width:520px; }
.tal-choice{
  text-align:left; cursor:pointer;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:1.02rem; font-weight:500; color:#23262e;
  background:#f6f5f1; border:1px solid #e4e4e0; padding:15px 18px;
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)), border-color .2s, background .2s;
}
.tal-choice:hover{ transform:translateX(4px); border-color:#f12032; background:#ffffff; }
.tal-choice:focus-visible{ outline:2px solid #f12032; outline-offset:2px; }
.tal-back{ margin-top:20px; cursor:pointer; font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.9rem; color:#5a5e68; background:none; border:none; padding:6px 0; }
.tal-back:hover,.tal-back:focus-visible{ color:#f12032; outline:none; }
.tal-result{ animation:tal-fade .5s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tal-result-lead{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.95rem; text-transform:uppercase; letter-spacing:.08em; color:#5a5e68; margin-bottom:18px; }
.tal-result-list{ list-style:none; margin:0 0 26px; padding:0; display:flex; flex-direction:column; gap:16px; }
.tal-result-item{ display:flex; gap:14px; align-items:flex-start; font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:1.05rem; line-height:1.5; color:#3a3e48; max-width:60ch; }
.tal-result-title{ color:#23262e; font-weight:700; }
.tal-result-closing{ font-family:var(--font-crimson),"Crimson Pro",Georgia,serif; font-size:clamp(1.15rem,2vw,1.5rem); color:#23262e; margin-bottom:22px; }
.tal-result-actions{ display:flex; align-items:center; gap:22px; flex-wrap:wrap; }

/* Kapitel 6: Massarbeit + Beweis + Start */
.tal-mass-body{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:1.02rem; line-height:1.55; color:#3a3e48; margin-top:16px; }
.tal-beweis{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.25rem,2.4vw,1.8rem); line-height:1.25; color:#23262e;
  max-width:30ch; margin:clamp(40px,7vh,80px) 0 clamp(30px,5vh,56px);
  background:rgba(255,255,255,.7); backdrop-filter:blur(2px); padding:.2em .4em; align-self:flex-start;
}
.tal-steps{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:clamp(44px,7vh,80px); }
.tal-step{ background:rgba(255,255,255,.9); border:1px solid #e4e4e0; padding:26px 24px; min-height:180px; }
.tal-step-eyebrow{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.78rem; text-transform:uppercase; letter-spacing:.12em; color:#5a5e68; }
.tal-step-label{ font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700; font-size:clamp(1.1rem,1.8vw,1.4rem); color:#23262e; margin-top:14px; }
.tal-step-sub{ font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.9rem; color:#5a5e68; margin-top:6px; }
.tal-cta{ background:#1c2837; color:#f6f5f1; padding:clamp(40px,7vw,80px) clamp(26px,5vw,64px); text-align:center; }
.tal-cta-h2{ font-family:var(--font-crimson),"Crimson Pro",Georgia,serif; font-weight:500; color:#f6f5f1; font-size:clamp(1.7rem,3.6vw,2.8rem); line-height:1.15; max-width:22ch; margin:0 auto; }
.tal-cta-actions{ display:flex; align-items:center; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:clamp(26px,4vh,40px); }

/* Buttons (Eckig-Gesetz) */
.tal-btn{
  display:inline-flex; align-items:center; justify-content:center;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-weight:600; font-size:1rem;
  padding:15px 26px; border:1px solid transparent; text-decoration:none; cursor:pointer;
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)), background .2s, color .2s;
}
.tal-btn:hover{ transform:translateY(-2px); }
.tal-btn:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.tal-btn--red{ background:#f12032; color:#ffffff; }
.tal-btn--white{ background:#ffffff; color:#1c2837; }
.tal-btn--ghost{ background:transparent; color:#f6f5f1; border-color:rgba(246,245,241,.5); }

/* Orientierung: Kapitel-Punkte rechts */
.tal-dots{ position:fixed; right:clamp(14px,2vw,28px); top:50%; transform:translateY(-50%); z-index:40; display:none; flex-direction:column; gap:16px; }
.tal-dot{ position:relative; width:12px; height:12px; padding:0; cursor:pointer; background:none; border:none; }
.tal-dot::after{ content:""; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:8px; height:8px; border-radius:50%; background:#c7c7c2; transition:background .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tal-dot.is-active::after{ background:#f12032; transform:translate(-50%,-50%) scale(1.35); }
.tal-dot:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.tal-dot-label{ position:absolute; right:20px; top:50%; transform:translateY(-50%); white-space:nowrap; opacity:0; pointer-events:none; font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:#23262e; transition:opacity .25s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tal-dot:hover .tal-dot-label,.tal-dot.is-active .tal-dot-label{ opacity:1; }
@media (min-width:960px){ .tal-dots{ display:flex; } }

/* Progress-Linie oben */
.tal-progress{ position:fixed; left:0; top:0; width:100%; height:3px; z-index:41; background:rgba(35,38,46,.06); }
.tal-progress-bar{ display:block; width:100%; height:100%; background:#f12032; transform:scaleX(0); transform-origin:0 50%; }

/* Anrufen fix */
.tal-call{
  position:fixed; left:clamp(16px,3vw,40px); bottom:clamp(16px,3vh,32px); z-index:42;
  display:inline-flex; align-items:center; padding:11px 20px;
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif; font-weight:600; font-size:.92rem;
  background:#23262e; color:#ffffff; text-decoration:none;
  transition:background .2s, transform .2s;
}
.tal-call:hover{ background:#f12032; transform:translateY(-2px); }
.tal-call:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }

/* Reveals */
.tal-root[data-reveal="on"] .tal-reveal{ opacity:0; transform:translateY(22px); transition:opacity .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tal-root[data-reveal="on"] .tal-reveal.is-in{ opacity:1; transform:none; }

/* Mobile */
@media (max-width:820px){
  .tal-section{ min-height:auto; padding-top:clamp(64px,12vh,110px); padding-bottom:clamp(64px,12vh,110px); }
  /* Am Handy steht Talos oft direkt hinter dem Text: Flusstexte bekommen
     denselben Weiss-Unterleger wie die Sprechzeilen (Lesbarkeit vor Poesie). */
  .tal-skill-body,.tal-tl-body,.tal-foot,.tal-skill-name,.tal-lernt-head,.tal-mass-body{
    background:rgba(255,255,255,.82); backdrop-filter:blur(2px);
    padding:.2em .4em; width:fit-content;
  }
  .tal-checklist{ grid-template-columns:1fr; }
  .tal-lernt-grid{ grid-template-columns:1fr; }
  .tal-steps{ grid-template-columns:1fr; }
  .tal-call{ padding:9px 16px; font-size:.85rem; }
}

/* Reduced motion: alles statisch */
@media (prefers-reduced-motion:reduce){
  .tal-root[data-reveal="on"] .tal-reveal{ opacity:1 !important; transform:none !important; transition:none; }
  .tal-question,.tal-result{ animation:none; }
  .tal-type-caret{ animation:none; }
  .tal-btn:hover,.tal-choice:hover,.tal-call:hover{ transform:none; }
}
`;
