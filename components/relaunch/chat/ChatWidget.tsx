"use client";

// Chat-Widget im Red-Rabbit-Haus-Stil. Wurzel traegt ".rr" (zieht alle
// --rr-Tokens + die echten Button-Klassen aus styleguide.css) und ".rrchat".
// Fonts: --font-grotesk ist NICHT self-hosted (Space Grotesk) -> hier inline auf
// die self-hosted "Instrument Sans" gemappt, --font-dmsans/-crimson auf ihre
// self-hosted Familien. styled-jsx wird gemieden -> namespaced <style> (Muster
// FragTalos.tsx). Blur nur ueber den Scrim (fremdes Seiten-Markup ist nicht
// bekleidbar). A11y: dialog/aria-modal, Fokus-Falle, ESC, role=log aria-live.

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
  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const hpRef = useRef<HTMLInputElement | null>(null);

  const typewriterActive = open && !hasStarted && input.length === 0 && !reducedMotion;
  const ghost = useTypewriter(typewriterActive);
  const placeholder = useMemo(() => {
    if (hasStarted) return "Schreib uns eine Nachricht ...";
    if (typewriterActive) return ghost || " ";
    return "Frag uns etwas zu Red Rabbit ...";
  }, [hasStarted, typewriterActive, ghost]);

  const closeWidget = useCallback(() => {
    setOpen(false);
    // Fokus zurueck auf den FAB (A11y: Rueckkehr zum Ausloeser).
    window.setTimeout(() => fabRef.current?.focus(), 0);
  }, []);

  // ESC schliesst; Tab-Falle innerhalb des Dialogs.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeWidget();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
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
            src="/images/rr-logo.png"
            alt=""
            width={30}
            height={30}
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
            ref={panelRef}
            className="rrchat-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rrchat-title"
          >
            <div className="rrchat-panel-head">
              <Image
                src="/images/rr-logo.png"
                alt="Red Rabbit"
                width={34}
                height={34}
                className="rrchat-brand-logo"
              />
              <button
                type="button"
                className="rrchat-close"
                aria-label="Chat schließen"
                onClick={closeWidget}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="rrchat-body">
              {!hasStarted && (
                <div className="rrchat-intro">
                  <h2 id="rrchat-title" className="rrchat-h">
                    Wie können wir dir helfen?
                  </h2>
                  <span className="rrchat-rule" aria-hidden="true" />
                  <p className="rrchat-sub">
                    Frag uns alles zu Red Rabbit, unseren Websites, dem Ablauf
                    oder den Preisen. Wir antworten direkt.
                  </p>
                </div>
              )}
              {hasStarted && (
                <h2 id="rrchat-title" className="rrchat-sr-only">
                  Chat mit Red Rabbit
                </h2>
              )}

              <div
                ref={logRef}
                className="rrchat-log"
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {turns.map((turn) =>
                  turn.role === "user" ? (
                    <div key={turn.id} className="rrchat-umsg">
                      {turn.text}
                    </div>
                  ) : (
                    <BotBubble key={turn.id} turn={turn} sending={isSending} />
                  )
                )}
                {notice && (
                  <p className="rrchat-notice" role="status">
                    {notice}
                  </p>
                )}
              </div>
            </div>

            <div className="rrchat-inputwrap">
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

              <div className="rrchat-sendrow">
                <span className="rrchat-hint">
                  Enter sendet, Shift+Enter für eine neue Zeile.
                </span>
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
                Keine passende Antwort gefunden, oder lieber direkt mit einem
                Menschen reden?
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
      )}

      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
    </div>
  );
}

const STYLE = `
.rrchat{
  --font-dmsans:'DM Sans';
  --font-grotesk:'Instrument Sans';
  --font-crimson:'Crimson Pro';
  --rrchat-hint:#77776f;
  --rrchat-sub:#5a5e68;
  --rrchat-z:2147483000;
}
.rrchat *{ box-sizing:border-box; }

/* ---------- FAB (geschlossen) ---------- */
.rrchat-fab{
  position:fixed; right:22px; bottom:22px;
  right:calc(22px + env(safe-area-inset-right));
  bottom:calc(22px + env(safe-area-inset-bottom));
  z-index:var(--rrchat-z);
  width:64px; height:64px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:var(--rr-paper,#fff); border:1px solid var(--rr-line,#e4e4e0);
  box-shadow:0 6px 22px rgba(28,40,55,.18), 0 2px 6px rgba(28,40,55,.10);
  cursor:pointer;
  transition:transform .22s var(--rr-ease,cubic-bezier(.6,0,.4,1)), box-shadow .22s;
}
.rrchat-fab:hover{ transform:translateY(-3px); box-shadow:0 12px 30px rgba(241,32,50,.20), 0 3px 8px rgba(28,40,55,.12); }
.rrchat-fab:focus-visible{ outline:none; box-shadow:0 0 0 3px var(--rr-paper,#fff), 0 0 0 5.5px var(--rr-red,#f12032); }
.rrchat-fab-logo{ width:30px; height:30px; object-fit:contain; }

/* ---------- Overlay + Scrim ---------- */
.rrchat-overlay{ position:fixed; inset:0; z-index:var(--rrchat-z); }
.rrchat-scrim{
  position:absolute; inset:0; width:100%; height:100%; border:none; padding:0; margin:0;
  background:rgba(20,20,20,.42);
  -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px);
  cursor:pointer;
  animation:rrchat-fade .25s var(--rr-ease,ease) both;
}

/* ---------- Panel ---------- */
.rrchat-panel{
  position:absolute; left:50%; top:54%;
  transform:translate(-50%,-50%);
  width:min(560px, calc(100vw - 32px));
  max-height:min(84vh, 720px);
  display:flex; flex-direction:column;
  background:var(--rr-paper,#fff);
  border:1px solid var(--rr-line,#e4e4e0);
  box-shadow:0 24px 70px rgba(20,26,35,.28), 0 6px 18px rgba(20,26,35,.14);
  padding:20px 24px 20px;
  animation:rrchat-rise .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)) both;
}
.rrchat-panel-head{ display:flex; align-items:center; justify-content:space-between; }
.rrchat-brand-logo{ width:34px; height:34px; object-fit:contain; }
.rrchat-close{
  width:36px; height:36px; display:flex; align-items:center; justify-content:center;
  background:transparent; border:1px solid transparent; color:var(--rr-ink-soft,#5a5e68);
  cursor:pointer; transition:color .2s, border-color .2s, background .2s;
}
.rrchat-close:hover{ color:var(--rr-ink,#23262e); border-color:var(--rr-line,#e4e4e0); background:#faf9f7; }
.rrchat-close:focus-visible{ outline:none; box-shadow:0 0 0 2px var(--rr-paper,#fff), 0 0 0 4px var(--rr-red,#f12032); }

/* ---------- Body / Intro ---------- */
.rrchat-body{ display:flex; flex-direction:column; min-height:0; flex:1; margin-top:6px; }
.rrchat-intro{ padding:6px 2px 4px; }
.rrchat-h{
  font-family:var(--rr-font-display,'DM Sans',sans-serif); font-weight:700; letter-spacing:-.02em;
  font-size:clamp(1.4rem,3.4vw,1.85rem); line-height:1.1; color:var(--rr-ink,#23262e); margin:0;
}
.rrchat-rule{ display:block; width:44px; height:3px; background:var(--rr-red,#f12032); margin:14px 0 12px; }
.rrchat-sub{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.98rem; line-height:1.5;
  color:var(--rrchat-sub); margin:0; max-width:46ch;
}

/* ---------- Verlauf ---------- */
.rrchat-log{
  display:flex; flex-direction:column; gap:14px;
  overflow-y:auto; overflow-x:hidden; min-height:0; flex:1;
  margin-top:14px; padding:2px 2px 4px;
  scrollbar-width:thin;
}
.rrchat[data-open="true"] .rrchat-intro + * + .rrchat-log{ margin-top:16px; }
.rrchat-umsg{
  align-self:flex-end; max-width:82%;
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:1rem; line-height:1.5;
  color:var(--rr-ink,#23262e);
  background:#faf9f7; border:1px solid var(--rr-line,#e4e4e0);
  padding:10px 14px; white-space:pre-wrap; word-break:break-word;
}
.rrchat-amsg{
  align-self:flex-start; max-width:94%;
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:1.02rem; line-height:1.6;
  color:var(--rr-ink,#23262e); white-space:pre-wrap; word-break:break-word;
}
.rrchat-typing{ display:inline-flex; align-items:center; gap:5px; padding:8px 2px; }
.rrchat-dot{ width:7px; height:7px; border-radius:50%; background:var(--rr-ink-soft,#5a5e68);
  animation:rrchat-blink 1.2s var(--rr-ease,ease) infinite; }
.rrchat-dot:nth-child(2){ animation-delay:.18s; }
.rrchat-dot:nth-child(3){ animation-delay:.36s; }
.rrchat-notice{
  align-self:stretch; font-family:var(--rr-font-ui,'Instrument Sans',sans-serif);
  font-size:.92rem; line-height:1.5; color:var(--rr-red-deep,#c81222);
  background:color-mix(in srgb, var(--rr-red,#f12032) 8%, transparent);
  border-left:3px solid var(--rr-red,#f12032); padding:10px 12px; margin:0;
}

/* ---------- Eingabe ---------- */
.rrchat-inputwrap{ margin-top:12px; border-top:1px solid var(--rr-line,#e4e4e0); padding-top:14px; }
.rrchat-textarea{
  width:100%; resize:none; max-height:190px; overflow-y:auto;
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:1rem; line-height:1.5;
  color:var(--rr-ink,#23262e); background:var(--rr-paper,#fff);
  border:1px solid var(--rr-line,#e4e4e0); padding:11px 13px;
  transition:border-color .2s, box-shadow .2s;
}
.rrchat-textarea::placeholder{ color:var(--rrchat-hint); opacity:1; }
.rrchat-textarea:focus{ outline:none; border-color:var(--rr-ink,#23262e); box-shadow:0 0 0 3px color-mix(in srgb, var(--rr-ink,#23262e) 10%, transparent); }

/* Honeypot: sichtbar fuer Bots, weg fuer Menschen (kein display:none). */
.rrchat-hp{
  position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden;
}

.rrchat-sendrow{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:10px; }
.rrchat-hint{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.82rem; line-height:1.35;
  color:var(--rrchat-hint);
}
/* kleiner Sende-Button, Sweep-Optik bleibt erhalten (nur Groesse/min-width) */
.rrchat .rrchat-send{ min-width:auto; font-size:15px; padding:9px 20px; flex:0 0 auto; }
.rrchat .rrchat-send:disabled{ opacity:.5; cursor:not-allowed; box-shadow:none; }
.rrchat .rrchat-send:disabled::before{ width:5px; }
.rrchat .rrchat-send:disabled:hover{ color:var(--rr-ink,#23262e); box-shadow:none; }

/* ---------- Fallback ---------- */
.rrchat-fallback{ margin-top:16px; padding-top:14px; border-top:1px solid var(--rr-line,#e4e4e0); }
.rrchat-fallback-lead{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.9rem; line-height:1.45;
  color:var(--rrchat-sub); margin:0 0 12px;
}
.rrchat-fallback-actions{ display:flex; flex-wrap:wrap; gap:12px; }
.rrchat .rrchat-fallback-actions .rr-btn-sweep,
.rrchat .rrchat-fallback-actions .rr-btn-outline{ font-size:16px; padding:10px 22px; min-width:132px; }

/* ---------- Fusszeile ---------- */
.rrchat-foot{
  font-family:var(--rr-font-ui,'Instrument Sans',sans-serif); font-size:.78rem; line-height:1.45;
  color:var(--rrchat-hint); margin:14px 0 0;
}
.rrchat-foot-link{ color:var(--rr-red-deep,#c81222); text-decoration:underline; text-underline-offset:2px; }
.rrchat-foot-link:hover{ color:var(--rr-red,#f12032); }

.rrchat-sr-only{
  position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden;
  clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* ---------- Mobile: vollflaechig ---------- */
@media (max-width:600px){
  .rrchat-panel{
    top:0; left:0; transform:none;
    width:100vw; max-height:none; height:100dvh;
    padding:calc(14px + env(safe-area-inset-top)) 18px calc(16px + env(safe-area-inset-bottom));
    border:none;
  }
  .rrchat-scrim{ -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px); }
  .rrchat-fab{ width:58px; height:58px; }
  .rrchat-sendrow{ flex-wrap:wrap; }
  .rrchat-hint{ flex:1 1 100%; order:2; }
  .rrchat .rrchat-send{ order:1; }
}

/* ---------- Motion ---------- */
@keyframes rrchat-fade{ from{ opacity:0; } to{ opacity:1; } }
@keyframes rrchat-rise{ from{ opacity:0; transform:translate(-50%,calc(-50% + 14px)); } to{ opacity:1; transform:translate(-50%,-50%); } }
@keyframes rrchat-blink{ 0%,60%,100%{ opacity:.3; } 30%{ opacity:1; } }

@media (prefers-reduced-motion:reduce){
  .rrchat-fab, .rrchat-scrim, .rrchat-panel{ animation:none; transition:none; }
  .rrchat-fab:hover{ transform:none; }
  .rrchat-dot{ animation:none; opacity:.6; }
  @media (max-width:600px){ .rrchat-panel{ transform:none; } }
}
`;
