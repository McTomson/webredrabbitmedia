// Same-origin WASM-Runtime fuer @splinetool/loader.
//
// Der Spline-Loader holt seine 3D-Runtime (process.wasm aus @splinetool/
// modelling-wasm + ui.wasm aus @splinetool/ui-wasm) FEST von unpkg.com. Manche
// Browser-Erweiterungen (Adblocker/Privacy) sperren diesen Fremd-Host -> die
// Szene laedt nicht und Talos faellt auf die Kommandozentrale zurueck (Thomas'
// Desktop: 3D fehlte trotz same-origin-Szene, weil unpkg geblockt war).
//
// Loesung: die beiden wasm-Dateien liegen gespiegelt unter public/hero/wasm/,
// und dieser Proxy leitet den fetch dorthin um, sodass im 3D-Ladepfad KEINE
// Fremd-Domain mehr vorkommt. Der Loader liest die wasm als arraybuffer
// (wasmBinary) -> Content-Type egal.
//
// Idempotent + global: der erste Aufruf einer beliebigen Talos-Stage installiert
// den Proxy fuer die ganze Seite. Jede Stage ruft ihn vor `new SplineLoader()`.
//
// ACHTUNG bei @splinetool/loader-Upgrade: die gepinnten Versionen unten UND die
// Dateien in public/hero/wasm/ neu ziehen (curl von den unpkg-URLs), sonst
// greift der Rewrite nicht — dann faellt es sauber auf unpkg zurueck (= altes
// Verhalten, funktioniert fuer Nutzer ohne Blocker).

const WASM_UNPKG_MODELLING =
  "https://unpkg.com/@splinetool/modelling-wasm@1.12.98/build";
const WASM_UNPKG_UI = "https://unpkg.com/@splinetool/ui-wasm@1.12.98/build";

export function installSplineWasmProxy(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __rrSplineWasmProxy?: boolean };
  if (w.__rrSplineWasmProxy) return;
  w.__rrSplineWasmProxy = true;

  const origFetch = window.fetch.bind(window);
  const rewrite = (u: string) =>
    u.replace(WASM_UNPKG_MODELLING, "/hero/wasm").replace(WASM_UNPKG_UI, "/hero/wasm");

  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.includes("unpkg.com/@splinetool/")) {
      return origFetch(rewrite(input), init);
    }
    if (input instanceof Request && input.url.includes("unpkg.com/@splinetool/")) {
      return origFetch(new Request(rewrite(input.url), input), init);
    }
    return origFetch(input as RequestInfo, init);
  }) as typeof window.fetch;
}
