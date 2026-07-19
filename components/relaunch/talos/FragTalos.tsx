"use client";

// Frag-Talos: der 5-Fragen-Fragebogen (unser Konfigurator). Logik 1:1 aus
// TalosPage uebernommen. Eigenstaendige Client-Insel fuer den Leistungs-Hub.
// Haus-Stil ueber die --rr-Tokens (Seite laeuft im .rr-Wrapper), eckig.
import { useState } from "react";
import Link from "next/link";

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
          ? "Sorgt für regelmäßig Neues auf deiner Seite. Kurz gesagt: Das macht dich sichtbar, ganz ohne dass du tippst."
          : "Sorgt dafür, dass auf deiner Seite jede Woche etwas Neues passiert.",
    });
  }
  return items;
}

export default function FragTalos() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = QUESTIONS.length;
  const done = step >= total;

  const pick = (id: string, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="ft">
      {!open ? (
        <button type="button" className="ft-start" onClick={() => setOpen(true)}>
          Los geht&apos;s
        </button>
      ) : done ? (
        <div className="ft-result" role="status">
          <p className="ft-result-lead">Das passt zu deinem Betrieb:</p>
          <ul className="ft-result-list">
            {buildResult(answers).map((it) => (
              <li key={it.title} className="ft-result-item">
                <span className="ft-result-title">{it.title}</span>
                <span className="ft-result-text">{it.text}</span>
              </li>
            ))}
          </ul>
          <p className="ft-say">
            Das ist ein Vorschlag, kein Vertrag. Im Erstgespräch schauen wir gemeinsam, was wirklich Sinn ergibt.
          </p>
          <div className="ft-actions">
            <Link href="/relaunch-preview/kontakt" className="ft-btn ft-btn--red">
              Entwurf ohne Vorkasse holen
            </Link>
            <button type="button" className="ft-btn ft-btn--ghost" onClick={reset}>
              Nochmal
            </button>
          </div>
        </div>
      ) : (
        <div className="ft-quiz">
          <div className="ft-quiz-top">
            <span className="ft-progress-label">
              Frage {step + 1} von {total}
            </span>
            <span className="ft-progress-track" aria-hidden="true">
              <span className="ft-progress-bar" style={{ transform: `scaleX(${(step + 1) / total})` }} />
            </span>
          </div>
          <p className="ft-question">{QUESTIONS[step].q}</p>
          <div className="ft-choices">
            {QUESTIONS[step].choices.map((c) => (
              <button
                key={c.value}
                type="button"
                className="ft-choice"
                onClick={() => pick(QUESTIONS[step].id, c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
.ft{ margin-top:28px; }
.ft-start,.ft-btn,.ft-choice{ font-family:inherit; cursor:pointer; border:1px solid transparent; }
.ft-start{ display:inline-flex; align-items:center; padding:15px 30px; font-weight:600; font-size:1.02rem;
  background:var(--rr-red,#f12032); color:#fff;
  box-shadow:var(--rr-shadow-btn,0 1px 2px rgba(28,40,55,.10),0 2px 8px rgba(28,40,55,.06));
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)),background .2s; }
.ft-start:hover{ transform:translateY(-2px); background:var(--rr-red-deep,#c81222); }
.ft-start:focus-visible{ outline:2px solid var(--rr-red,#f12032); outline-offset:3px; }

.ft-quiz-top{ display:flex; align-items:center; gap:16px; margin-bottom:18px; }
.ft-progress-label{ font-size:13px; font-weight:650; letter-spacing:.1em; text-transform:uppercase;
  color:var(--rr-ink-soft,#5a5e68); white-space:nowrap; }
.ft-progress-track{ flex:1; height:3px; background:var(--rr-line,#e4e4e0); }
.ft-progress-bar{ display:block; height:100%; background:var(--rr-red,#f12032); transform-origin:0 50%;
  transition:transform .35s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }

.ft-question{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.015em;
  font-size:clamp(1.25rem,2.2vw,1.7rem); line-height:1.12; color:var(--rr-ink,#23262e); margin:0 0 20px; }
.ft-choices{ display:flex; flex-direction:column; gap:12px; }
.ft-choice{ text-align:left; padding:16px 20px; font-size:1.02rem; color:var(--rr-ink,#23262e);
  background:var(--rr-paper,#fff); border-color:var(--rr-line,#e4e4e0);
  transition:border-color .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)),transform .2s,box-shadow .2s; }
.ft-choice:hover{ border-color:var(--rr-ink,#23262e); transform:translateY(-2px);
  box-shadow:var(--rr-shadow-btn,0 1px 2px rgba(28,40,55,.10),0 2px 8px rgba(28,40,55,.06)); }
.ft-choice:focus-visible{ outline:2px solid var(--rr-red,#f12032); outline-offset:3px; }

.ft-result-lead{ font-size:13px; font-weight:650; letter-spacing:.14em; text-transform:uppercase;
  color:var(--rr-red,#f12032); margin:0 0 16px; }
.ft-result-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:14px; }
.ft-result-item{ display:flex; flex-direction:column; gap:3px; padding:16px 18px;
  background:var(--rr-paper,#fff); border:1px solid var(--rr-line,#e4e4e0); border-left:3px solid var(--rr-red,#f12032); }
.ft-result-title{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.01em;
  font-size:1.05rem; color:var(--rr-ink,#23262e); }
.ft-result-text{ font-size:.96rem; line-height:1.5; color:var(--rr-ink-soft,#5a5e68); }
.ft-say{ font-family:var(--rr-font-serif,"Crimson Pro",Georgia,serif); font-weight:500;
  font-size:1.15rem; line-height:1.3; color:var(--rr-ink,#23262e); margin:20px 0 0;
  padding-left:15px; border-left:2px solid #39c2d7; }

.ft-actions{ margin-top:26px; display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
.ft-btn{ display:inline-flex; align-items:center; justify-content:center; padding:14px 26px; font-weight:600; font-size:1rem;
  text-decoration:none; transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)),background .2s,border-color .2s; }
.ft-btn:hover{ transform:translateY(-2px); }
.ft-btn:focus-visible{ outline:2px solid var(--rr-red,#f12032); outline-offset:3px; }
.ft-btn--red{ background:var(--rr-red,#f12032); color:#fff; }
.ft-btn--red:hover{ background:var(--rr-red-deep,#c81222); }
.ft-btn--ghost{ background:transparent; color:var(--rr-ink,#23262e); border-color:var(--rr-line,#e4e4e0); }
.ft-btn--ghost:hover{ border-color:var(--rr-ink,#23262e); }

@media (prefers-reduced-motion:reduce){
  .ft-start:hover,.ft-choice:hover,.ft-btn:hover{ transform:none; }
  .ft-progress-bar{ transition:none; }
}
`,
        }}
      />
    </div>
  );
}
