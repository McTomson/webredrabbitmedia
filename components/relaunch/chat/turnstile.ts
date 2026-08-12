// Cloudflare Turnstile Lazy-Loader fuer das Chat-Widget.
// Laedt api.js erst beim ersten Bedarf (kein Render-Blocking auf jeder Seite),
// rendert genau EIN unsichtbares Widget und liefert pro Aufruf einen frischen
// Token (Erst-Session + spaeterer Refresh). Prod-CSP muss den Host erlauben
// (script-src + frame-src https://challenges.cloudflare.com, siehe next.config.ts).

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileRenderOptions {
  sitekey: string;
  size?: "normal" | "compact" | "invisible" | "flexible";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
  "expired-callback"?: () => void;
  appearance?: "always" | "execute" | "interaction-only";
}

interface TurnstileApi {
  render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
  execute: (id?: string, opts?: Partial<TurnstileRenderOptions>) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("turnstile: kein window"));
  }
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const waitReady = () => {
      if (window.turnstile) resolve();
      else window.setTimeout(waitReady, 40);
    };
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      waitReady();
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = waitReady;
    s.onerror = () => reject(new Error("turnstile: script laedt nicht"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

let container: HTMLElement | null = null;
let widgetId: string | null = null;
let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null =
  null;

function ensureContainer(): HTMLElement {
  if (container) return container;
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.position = "fixed";
  el.style.bottom = "0";
  el.style.left = "0";
  el.style.width = "0";
  el.style.height = "0";
  el.style.overflow = "hidden";
  el.style.pointerEvents = "none";
  el.style.opacity = "0";
  document.body.appendChild(el);
  container = el;
  return el;
}

/**
 * Liefert einen frischen Turnstile-Token. Beim ersten Aufruf wird ein
 * unsichtbares Widget gerendert (fuehrt die Challenge automatisch aus), bei
 * jedem weiteren Aufruf via reset()+execute() neu ausgefuehrt.
 */
export async function getTurnstileToken(siteKey: string): Promise<string> {
  await loadScript();
  const turnstile = window.turnstile;
  if (!turnstile) throw new Error("turnstile: nicht verfuegbar");
  const el = ensureContainer();

  return new Promise<string>((resolve, reject) => {
    pending = { resolve, reject };
    const settleOk = (token: string) => {
      pending?.resolve(token);
      pending = null;
    };
    const settleErr = (msg: string) => {
      pending?.reject(new Error(msg));
      pending = null;
    };

    if (widgetId === null) {
      widgetId = turnstile.render(el, {
        sitekey: siteKey,
        size: "invisible",
        callback: settleOk,
        "error-callback": () => settleErr("turnstile: error-callback"),
        "timeout-callback": () => settleErr("turnstile: timeout"),
        "expired-callback": () => settleErr("turnstile: expired"),
      });
    } else {
      turnstile.reset(widgetId);
      turnstile.execute(widgetId);
    }
  });
}
