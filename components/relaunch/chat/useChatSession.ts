"use client";

// Netz-/State-Logik des Chat-Widgets. Haelt den Verlauf (turns) + die Session
// (sessionRef). Lazy: /session wird erst beim ersten Senden geholt. Streamt den
// Bot-Text in den letzten Turn. 401 -> stiller Refresh (gleiche session_id) +
// genau EIN Retry; 429 -> notice; sonstiger Fehler -> Fehlertext im Bot-Turn.

import { useCallback, useRef, useState } from "react";
import { getTurnstileToken } from "./turnstile";
import { openSession, streamChat } from "./chatClient";

export type TurnRole = "user" | "bot";
export interface Turn {
  id: string;
  role: TurnRole;
  text: string;
}

export const RATE_LIMIT_MSG =
  "Kurze Pause, du warst gerade sehr fleißig. Probier es in etwa einer Minute nochmal, oder nimm direkt über die Buttons unten Kontakt auf.";
export const ERROR_MSG =
  "Da ist gerade etwas schiefgelaufen. Probier es bitte nochmal, oder nimm direkt über die Buttons unten Kontakt auf.";

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Outcome = "ok" | "expired" | "rate_limited" | "error";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useChatSession() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const sessionRef = useRef<{ token: string; sessionId: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);

  const ensureSession = useCallback(async (force: boolean) => {
    if (!force && sessionRef.current) return sessionRef.current;
    const turnstileToken = await getTurnstileToken(SITE_KEY);
    const res = await openSession(API_URL, {
      turnstileToken,
      sessionId: sessionRef.current?.sessionId ?? null,
    });
    sessionRef.current = { token: res.token, sessionId: res.session_id };
    return sessionRef.current;
  }, []);

  const patchBot = useCallback((botId: string, updater: (prev: string) => string) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === botId ? { ...t, text: updater(t.text) } : t))
    );
  }, []);

  const send = useCallback(
    async (raw: string, hp: string) => {
      const message = raw.trim();
      if (!message || sendingRef.current) return;
      sendingRef.current = true;
      setNotice(null);
      setIsSending(true);

      const botId = uid();
      setTurns((prev) => [
        ...prev,
        { id: uid(), role: "user", text: message },
        { id: botId, role: "bot", text: "" },
      ]);

      const runStream = async (
        retry: boolean
      ): Promise<{ outcome: Outcome; gotText: boolean }> => {
        let gotText = false;
        try {
          const session = await ensureSession(retry);
          if (retry) patchBot(botId, () => "");
          const ctrl = new AbortController();
          abortRef.current = ctrl;
          for await (const ev of streamChat(API_URL, {
            sessionToken: session.token,
            sessionId: session.sessionId,
            message,
            hp,
            signal: ctrl.signal,
          })) {
            if (ev.type === "text") {
              gotText = true;
              patchBot(botId, (p) => p + ev.text);
            } else if (ev.type === "done") {
              return { outcome: "ok", gotText };
            } else if (ev.type === "error") {
              if (ev.code === "token_expired") return { outcome: "expired", gotText };
              if (ev.code === "rate_limited")
                return { outcome: "rate_limited", gotText };
              return { outcome: "error", gotText };
            }
          }
          return { outcome: "ok", gotText };
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            return { outcome: "ok", gotText };
          }
          return { outcome: "error", gotText };
        }
      };

      try {
        let result = await runStream(false);
        if (result.outcome === "expired") {
          // Token mitten im Gespraech abgelaufen -> genau ein stiller Retry.
          result = await runStream(true);
        }

        if (result.outcome === "rate_limited") {
          setNotice(RATE_LIMIT_MSG);
          setTurns((prev) =>
            prev.filter((t) => !(t.id === botId && t.text === ""))
          );
        } else if (result.outcome === "ok" && result.gotText) {
          // erfolgreiche Antwort steht bereits im Bot-Turn
        } else {
          patchBot(botId, () => ERROR_MSG);
        }
      } finally {
        abortRef.current = null;
        sendingRef.current = false;
        setIsSending(false);
      }
    },
    [ensureSession, patchBot]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearNotice = useCallback(() => setNotice(null), []);

  return {
    turns,
    isSending,
    notice,
    hasStarted: turns.length > 0,
    send,
    stop,
    clearNotice,
  };
}
