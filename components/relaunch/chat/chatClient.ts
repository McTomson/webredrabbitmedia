// HTTP-Client fuer das Chat-Backend. Contract = Master A3 (bindend):
//   POST /session  Body {turnstile_token, session_id|null} -> {token, session_id}
//   POST /chat     SSE, Auth-Header "Authorization: Bearer <token>",
//                  Body {session_id, message, hp}
//                  Events "data: {type:text|done|error, ...}", Abschluss "data: [DONE]"
//                  Status 401 token_expired / 429 rate_limited / 5xx server

export interface OpenSessionResult {
  token: string;
  session_id: string;
}

export type ChatErrorCode = "token_expired" | "rate_limited" | "server";

export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "done" }
  | { type: "error"; code: ChatErrorCode; message?: string };

/** Holt/erneuert ein signiertes Session-Token. Bei bestehender session_id
 *  (Refresh) wird sie mitgeschickt, damit der Server dieselbe id behaelt. */
export async function openSession(
  apiUrl: string,
  args: { turnstileToken: string; sessionId: string | null }
): Promise<OpenSessionResult> {
  const res = await fetch(`${apiUrl}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      turnstile_token: args.turnstileToken,
      session_id: args.sessionId,
    }),
  });
  if (!res.ok) {
    throw new Error(`session ${res.status}`);
  }
  const data = (await res.json()) as Partial<OpenSessionResult>;
  if (!data.token || !data.session_id) {
    throw new Error("session: unvollstaendige Antwort");
  }
  return { token: data.token, session_id: data.session_id };
}

type ParsedSseData =
  | "DONE"
  | { type?: string; text?: string; message?: string; code?: string }
  | null;

function parseSseBlock(raw: string): ParsedSseData {
  const dataLines = raw
    .split("\n")
    .filter((l) => l.startsWith("data:"))
    .map((l) => l.slice(5).replace(/^ /, ""));
  if (dataLines.length === 0) return null;
  const payload = dataLines.join("\n");
  if (payload === "[DONE]") return "DONE";
  try {
    return JSON.parse(payload) as { type?: string; text?: string; message?: string };
  } catch {
    return null;
  }
}

/** Streamt die Bot-Antwort als normalisierte ChatEvents. */
export async function* streamChat(
  apiUrl: string,
  args: {
    sessionToken: string;
    sessionId: string;
    message: string;
    hp: string;
    signal?: AbortSignal;
  }
): AsyncGenerator<ChatEvent> {
  const res = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.sessionToken}`,
    },
    body: JSON.stringify({
      session_id: args.sessionId,
      message: args.message,
      hp: args.hp,
    }),
    signal: args.signal,
  });

  if (res.status === 401) {
    yield { type: "error", code: "token_expired" };
    return;
  }
  if (res.status === 429) {
    yield { type: "error", code: "rate_limited" };
    return;
  }
  if (!res.ok || !res.body) {
    yield { type: "error", code: "server" };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const parsed = parseSseBlock(block);
        if (parsed === null) continue;
        if (parsed === "DONE") {
          yield { type: "done" };
          return;
        }
        if (parsed.type === "text") {
          yield { type: "text", text: parsed.text ?? "" };
        } else if (parsed.type === "done") {
          yield { type: "done" };
          return;
        } else if (parsed.type === "error") {
          yield { type: "error", code: "server", message: parsed.message };
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
