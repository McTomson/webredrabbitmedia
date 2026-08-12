"use client";

// Chat-Widget im Red-Rabbit-Haus-Stil, Vollbild-Overlay (Design-Vorlage
// chatbot-widget-mockup.html, von Thomas abgenommen). Wurzel traegt ".rr" (zieht
// alle --rr-Tokens + die echten Button-Klassen aus styleguide.css) und ".rrchat".
// SCHRIFTEN: ausschliesslich die echten Site-Tokens -- Headline = --rr-font-display
// (DM Sans), alles andere = --rr-font-ui (Instrument Sans). KEIN Space Grotesk,
// keine hardcodierten Familien (DESIGN_STANDARD.md). styled-jsx wird gemieden ->
// namespaced <style> (Muster FragTalos.tsx). Blur ueber den Scrim (backdrop-filter,
// fremdes Seiten-Markup ist nicht direkt bekleidbar). A11y: dialog/aria-modal,
// Fokus-Falle, ESC, role=log aria-live. Verdrahtung (useChatSession) unveraendert.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useChatSession,
  type Turn,
} from "./useChatSession";

const TEL = "+436769000955";
const SUGGESTIONS = [
  "Was kostet eine Website bei euch?",
  "Wie läuft ein Projekt bei euch ab?",
  "Macht ihr auch SEO und KI-Sichtbarkeit?",
  "Für wen arbeitet ihr eigentlich?",
];
const MAX_INPUT_CHARS = 800;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Typewriter-Ghost: tippt Vorschlaege, loescht sie, naechster. Stoppt, sobald
// der Nutzer tippt oder das Gespraech begonnen hat (oder reduced-motion).
function useTypewriter(active: boolean): string {
  const [text, setText] = useState("");
  const stateRef = useRef({ idx: 0, char: 0, deleting: false });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      return;
    }
    const tick = () => {
      const st = stateRef.current;
      const full = SUGGESTIONS[st.idx % SUGGESTIONS.length];
      if (!st.deleting) {
        st.char += 1;
        setText(full.slice(0, st.char));
        if (st.char >= full.length) {
          st.deleting = true;
          timerRef.current = window.setTimeout(tick, 1600);
          return;
        }
        timerRef.current = window.setTimeout(tick, 45 + Math.random() * 45);
      } else {
        st.char -= 1;
        setText(full.slice(0, Math.max(st.char, 0)));
        if (st.char <= 0) {
          st.deleting = false;
          st.idx += 1;
          timerRef.current = window.setTimeout(tick, 260);
          return;
        }
        timerRef.current = window.setTimeout(tick, 28);
      }
    };
    timerRef.current = window.setTimeout(tick, 400);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active]);

  return text;
}

function BotBubble({ turn, sending }: { turn: Turn; sending: boolean }) {
  const empty = turn.text.length === 0;
  if (empty && sending) {
    return (
      <div className="rrchat-amsg rrchat-typing" aria-label="Antwort wird geschrieben">
        <span className="rrchat-dot" />
        <span className="rrchat-dot" />
        <span className="rrchat-dot" />
      </div>
    );
  }
  return <div className="rrchat-amsg">{turn.text}</div>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const reducedMotion = usePrefersReducedMotion();

  const { turns, isSending, notice, hasStarted, send, clearNotice } =
    useChatSession();

  const fabRef = useRef<HTMLButtonElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const hpRef = useRef<HTMLInputElement | null>(null);

  const typewriterActive = open && !hasStarted && input.length === 0 && !reducedMotion;
  const ghost = useTypewriter(typewriterActive);
  const placeholder = useMemo(() => {
    if (hasStarted) return "Schreib uns eine Nachricht ...";
    if (typewriterActive) return ghost || " ";
    return "Frag uns etwas zu Red Rabbit ...";
  }, [hasStarted, typewriterActive, ghost]);

  const closeWidget = useCallback(() => {
    setOpen(false);
    // Fokus zurueck auf den FAB (A11y: Rueckkehr zum Ausloeser).
    window.setTimeout(() => fabRef.current?.focus(), 0);
  }, []);

  // ESC schliesst; Tab-Falle innerhalb des Dialogs (die Stage traegt role=dialog).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeWidget();
        return;
      }
      if (e.key !== "Tab") return;
      const stage = stageRef.current;
      if (!stage) return;
      const focusables = stage.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([type="hidden"]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, closeWidget]);

  // Body-Scroll sperren, solange offen; Fokus auf die Textarea legen.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => textareaRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open]);

  // Auto-Scroll des Verlaufs ans Ende bei neuem Text.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 190)}px`;
  }, []);

  const submit = useCallback(() => {
    if (isSending) return;
    const value = input.trim();
    if (!value) return;
    // Honeypot: ist das versteckte Feld befuellt, ignorieren wir den Send still.
    if (hpRef.current?.value) return;
    void send(value, hpRef.current?.value ?? "");
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, isSending, send]);

  const onKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  // Klick auf die leere Stage-Flaeche (nicht auf das Panel) schliesst ebenfalls.
  const onStagePointer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeWidget();
  };

  return (
    <div className="rr rrchat" data-open={open ? "true" : "false"}>
      {!open && (
        <button
          ref={fabRef}
          type="button"
          className="rrchat-fab"
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Chat mit Red Rabbit öffnen"
          onClick={() => setOpen(true)}
        >
          <Image
            src="/images/rr-mark.png"
            alt=""
            width={32}
            height={32}
            className="rrchat-fab-logo"
          />
        </button>
      )}

      {open && (
        <div className="rrchat-overlay">
          <button
            type="button"
            className="rrchat-scrim"
            aria-label="Chat schließen"
            tabIndex={-1}
            onClick={closeWidget}
          />
          <div
            ref={stageRef}
            className="rrchat-stage"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rrchat-title"
            onMouseDown={onStagePointer}
          >
            <div className="rrchat-logotop" aria-hidden="true">
              <Image
                src="/images/rr-mark.png"
                alt="Red Rabbit"
                width={26}
                height={26}
                className="rrchat-logotop-img"
              />
            </div>
            <button
              type="button"
              className="rrchat-close"
              aria-label="Chat schließen"
              onClick={closeWidget}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="rrchat-panel" data-chatting={hasStarted ? "true" : "false"}>
              <div className="rrchat-intro">
                <h2 id="rrchat-title" className="rrchat-h">
                  Wie können wir dir helfen?
                  <span className="rrchat-rule" aria-hidden="true" />
                </h2>
                <p className="rrchat-sub">
                  Frag uns alles zu Red Rabbit, unseren Websites, dem Ablauf
                  oder den Preisen. Wir antworten direkt.
                </p>
              </div>

              <div
                ref={logRef}
                className="rrchat-log"
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {turns.map((turn) =>
                  turn.role === "user" ? (
                    <div key={turn.id} className="rrchat-turn">
                      <div className="rrchat-umsg">{turn.text}</div>
                    </div>
                  ) : (
                    <div key={turn.id} className="rrchat-turn">
                      <BotBubble turn={turn} sending={isSending} />
                    </div>
                  )
                )}
                {notice && (
                  <p className="rrchat-notice" role="status">
                    {notice}
                  </p>
                )}
              </div>

              <div className="rrchat-box">
                <div className="rrchat-field">
                  <label htmlFor="rrchat-input" className="rrchat-sr-only">
                    Deine Nachricht an Red Rabbit
                  </label>
                  <textarea
                    id="rrchat-input"
                    ref={textareaRef}
                    className="rrchat-textarea"
                    rows={1}
                    value={input}
                    placeholder={placeholder}
                    maxLength={MAX_INPUT_CHARS}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (notice) clearNotice();
                      autoGrow();
                    }}
                    onKeyDown={onKeyDownTextarea}
                  />

                  {/* Honeypot: fuer Menschen unsichtbar, aber NICHT display:none,
                      damit naive Bots es trotzdem befuellen. */}
                  <div className="rrchat-hp" aria-hidden="true">
                    <label htmlFor="rrchat-hp-field">Bitte dieses Feld frei lassen</label>
                    <input
                      id="rrchat-hp-field"
                      ref={hpRef}
                      type="text"
                      name="hp"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="rrchat-sendrow">
                  <span className="rrchat-hint">Nur Fragen zu Red Rabbit</span>
                  <button
                    type="button"
                    className="rr-btn-sweep rr-btn-sweep--red rrchat-send"
                    onClick={submit}
                    disabled={isSending || input.trim().length === 0}
                  >
                    {isSending ? "Sendet ..." : "Senden"}
                  </button>
                </div>
              </div>

              <div className="rrchat-fallback">
                <p className="rrchat-fallback-lead">
                  Keine passende Antwort gefunden? <b>Hast du noch Fragen?</b>
                </p>
                <div className="rrchat-fallback-actions">
                  <a className="rr-btn-sweep rr-btn-sweep--red" href={`tel:${TEL}`}>
                    Anrufen
                  </a>
                  <Link
                    className="rr-btn-outline"
                    href="/kontakt"
                    data-rr-lead="chat"
                  >
                    E-Mail senden
                  </Link>
                </div>
              </div>

              <p className="rrchat-foot">
                Digitaler Assistent von Red Rabbit. Antworten sind unverbindlich und
                ersetzen kein persönliches Angebot.{" "}
                <Link href="/datenschutz" className="rrchat-foot-link">
                  Datenschutz
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
    </div>
  );
}

const STYLE = `
.rrchat{
  --rrchat-hint:#a4a49b;
  --rrchat-sub:#5a5e68;
  --rrchat-paper:var(--rr-paper,#ffffff);
  --rrchat-line:var(--rr-line,#e4e4e0);
  --rrchat-ink:var(--rr-ink,#23262e);
  --rrchat-bg:#f4f4f2;
  --rrchat-z:2147483000;
}
.rrchat *{ box-sizing:border-box; }

/* ---------- FAB (geschlossen) = Kreis mit Marke ---------- */
.rrchat-fab{
  position:fixed; right:26px; bottom:26px;
  right:calc(26px + env(safe-area-inset-right));
  bottom:calc(26px + env(safe-area-inset-bottom));
  z-index:var(--rrchat-z);
  width:64px; height:64px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:var(--rrchat-paper); border:1px solid var(--rrchat-line);
  box-shadow:0 12px 30px rgba(0,0,0,.14), 0 2px 6px rgba(28,40,55,.08);
  cursor:pointer;
  transition:transform .22s var(--rr-ease,cubic-bezier(.6,0,.4,1)), box-shadow .22s;
}
.rrchat-fab:hover{ transform:translateY(-3px); box-shadow:0 16px 36px rgba(241,32,50,.22), 0 3px 8px rgba(28,40,55,.10); }
.rrchat-fab:focus-visible{ outline:none; box-shadow:0 0 0 3px var(--rrchat-paper), 0 0 0 5.5px var(--rr-red,#f12032); }
.rrchat-fab-logo{ width:32px; height:32px; object-fit:contain; }

/* ---------- Overlay + Scrim (hell, Seite dahinter wird geblurrt) ---------- */
.rrchat-overlay{ position:fixed; inset:0; z-index:var(--rrchat-z); }
.rrchat-scrim{
  position:absolute; inset:0; width:100%; height:100%; border:none; padding:0; margin:0;
  background:rgba(244,244,242,.76);
  -webkit-backdrop-filter:blur(9px) saturate(.98); backdrop-filter:blur(9px) saturate(.98);
  cursor:pointer;
  animation:rrchat-fade .35s var(--rr-ease,ease) both;
}

/* ---------- Stage (Vollbild, scrollbar) ---------- */
.rrchat-stage{
  position:absolute; inset:0; z-index:1;
  display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
  padding:0 20px; overflow-y:auto; overscroll-behavior:contain;
  animation:rrchat-fade .4s var(--rr-ease,ease) both;
}
.rrchat-logotop{
  position:fixed; top:24px; left:50%; transform:translateX(-50%); z-index:2;
  pointer-events:none;
}
.rrchat-logotop-img{ width:26px; height:26px; object-fit:contain; opacity:.95; }
.rrchat-close{
  position:fixed; top:20px; right:24px; z-index:2;
  right:calc(24px + env(safe-area-inset-right));
  width:40px; height:40px; display:flex; align-items:center; justify-content:center;
  background:transparent; border:none; color:var(--rr-ink-soft,#5a5e68);
  cursor:pointer; transition:color .2s, transform .2s;
}
.rrchat-close:hover{ color:var(--rrchat-ink); transform:rotate(90deg); }
.rrchat-close:focus-visible{ outline:none; color:var(--rrchat-ink); box-shadow:0 0 0 2px var(--rr-red,#f12032); border-radius:50%; }

/* ---------- Panel (Inhaltsspalte) ---------- */
.rrchat-panel{
  width:min(680px, 100%);
  margin-top:min(15vh, 128px); margin-bottom:56px;
  display:flex; flex-direction:column;
  animation:rrchat-rise .4s var(--rr-ease,cubic-bezier(.6,0,.4,1)) both;
}

/* ---------- Intro (kollabiert, sobald das Gespraech laeuft) ---------- */
.rrchat-intro{
  text-align:center; overflow:hidden;
  max-height:220px; opacity:1;
  transition:max-height .45s var(--rr-ease,ease), opacity .35s ease, margin .45s ease;
  margin-bottom:8px;
}
.rrchat-panel[data-chatting="true"] .rrchat-intro{
  max-height:0; opacity:0; margin-bottom:0;
}
.rrchat-h{
  position:relative;
  font-family:var(--rr-font-display,'DM Sans',sans-serif); font-weight:600; letter-spacing:-.01em;
  font-size:clamp(1.75rem,4.4vw,2.25rem); line-height:1.15; color:var(--rrchat-ink);
  margin:0 0 8px; padding-bottom:10px;
}
.rrchat-rule{
  display:block; height:1px; width:100%; margin:8px auto 0;
  background:linear-gradient(to right, transparent, rgba(241,32,50,.5), transparent);
}
.rrchat-sub{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.98rem; line-height:1.55;
  color:var(--rrchat-sub); margin:14px auto 0; max-width:52ch;
}

/* ---------- Verlauf (Claude-Look: User rechts als Pill, Bot reiner Text) ---------- */
.rrchat-log{
  display:flex; flex-direction:column;
  overflow-y:auto; overflow-x:hidden; min-height:0;
  max-height:44vh; margin:0 2px 22px; padding-right:4px;
  scrollbar-width:thin;
}
.rrchat-log:empty{ display:none; }
.rrchat-turn{ margin-bottom:22px; }
.rrchat-turn:last-child{ margin-bottom:2px; }
.rrchat-umsg{
  max-width:80%; margin-left:auto;
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.98rem; line-height:1.55;
  color:var(--rrchat-ink);
  background:#faf9f7; border:1px solid var(--rrchat-line); border-radius:16px;
  padding:12px 16px; white-space:pre-wrap; word-break:break-word;
}
.rrchat-amsg{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:1.02rem; line-height:1.7;
  color:var(--rrchat-ink); margin-top:14px; white-space:pre-wrap; word-break:break-word;
}
.rrchat-typing{ display:inline-flex; align-items:center; gap:5px; }
.rrchat-dot{ width:6px; height:6px; border-radius:50%; background:#c9c9c1;
  animation:rrchat-blink 1.2s var(--rr-ease,ease) infinite; }
.rrchat-dot:nth-child(2){ animation-delay:.2s; }
.rrchat-dot:nth-child(3){ animation-delay:.4s; }
.rrchat-notice{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif);
  font-size:.92rem; line-height:1.5; color:var(--rr-red-deep,#c81222);
  background:color-mix(in srgb, var(--rr-red,#f12032) 8%, transparent);
  border-left:3px solid var(--rr-red,#f12032); padding:10px 12px; margin:4px 0 0;
}

/* ---------- Eingabe-Box (schwebende Karte, ein Feld) ---------- */
.rrchat-box{
  background:var(--rrchat-paper); border:1px solid var(--rrchat-line); border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.07); overflow:hidden;
}
.rrchat-field{ position:relative; padding:16px 20px 4px; }
.rrchat-textarea{
  width:100%; border:none; outline:none; resize:none;
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:1rem; line-height:1.55;
  color:var(--rrchat-ink); background:none;
  min-height:30px; max-height:190px; overflow-y:auto;
}
.rrchat-textarea::placeholder{ color:#b7b7ae; opacity:1; }
.rrchat-sendrow{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:8px 14px 12px 20px;
}
.rrchat-hint{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.78rem; letter-spacing:.02em;
  color:var(--rrchat-hint);
}
/* kleiner Sende-Button, Sweep-Optik bleibt erhalten (nur Groesse/min-width) */
.rrchat .rrchat-send{ min-width:auto; font-size:15px; padding:9px 20px; flex:0 0 auto; }
.rrchat .rrchat-send:disabled{ opacity:.5; cursor:not-allowed; box-shadow:none; }
.rrchat .rrchat-send:disabled::before{ width:5px; }
.rrchat .rrchat-send:disabled:hover{ color:var(--rrchat-ink); box-shadow:none; }

/* Honeypot: aus dem Blickfeld, aber nicht display:none. */
.rrchat-hp{ position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden; }

/* ---------- Fallback ---------- */
.rrchat-fallback{ margin-top:32px; text-align:center; }
.rrchat-fallback-lead{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.98rem; line-height:1.5;
  color:var(--rrchat-ink); margin:0 0 16px;
}
.rrchat-fallback-lead b{ font-weight:700; }
.rrchat-fallback-actions{ display:flex; flex-wrap:wrap; gap:14px; justify-content:center; }
.rrchat .rrchat-fallback-actions .rr-btn-sweep,
.rrchat .rrchat-fallback-actions .rr-btn-outline{ font-size:17px; padding:11px 24px; min-width:150px; }

/* ---------- Fusszeile ---------- */
.rrchat-foot{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.72rem; line-height:1.5;
  color:var(--rrchat-hint); margin:24px 0 0; text-align:center;
}
.rrchat-foot-link{ color:var(--rr-red-deep,#c81222); text-decoration:underline; text-underline-offset:2px; }
.rrchat-foot-link:hover{ color:var(--rr-red,#f12032); }

.rrchat-sr-only{
  position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden;
  clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* ---------- Mobile ---------- */
@media (max-width:600px){
  .rrchat-stage{ padding:0 16px; }
  .rrchat-panel{ margin-top:14vh; margin-bottom:40px; }
  .rrchat-h{ font-size:1.6rem; }
  .rrchat-log{ max-height:40vh; }
  .rrchat-fab{ width:58px; height:58px; right:18px; bottom:18px;
    right:calc(18px + env(safe-area-inset-right)); bottom:calc(18px + env(safe-area-inset-bottom)); }
  .rrchat-fallback-actions{ gap:12px; }
  .rrchat .rrchat-fallback-actions .rr-btn-sweep,
  .rrchat .rrchat-fallback-actions .rr-btn-outline{ flex:1 1 100%; }
}

/* ---------- Motion ---------- */
@keyframes rrchat-fade{ from{ opacity:0; } to{ opacity:1; } }
@keyframes rrchat-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:translateY(0); } }
@keyframes rrchat-blink{ 0%,60%,100%{ opacity:.3; } 30%{ opacity:1; } }

@media (prefers-reduced-motion:reduce){
  .rrchat-fab, .rrchat-scrim, .rrchat-stage, .rrchat-panel, .rrchat-intro{ animation:none; transition:none; }
  .rrchat-fab:hover{ transform:none; }
  .rrchat-close:hover{ transform:none; }
  .rrchat-dot{ animation:none; opacity:.6; }
}
`;
