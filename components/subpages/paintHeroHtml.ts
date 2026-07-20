/**
 * Baut das HTML des Paint-Hero (Wisch-Reveal) fuer ein beliebiges Wort + eine
 * Botschaft. Struktur 1:1 aus components/subpages/tipps-hero-demo/demo.body.html
 * (nur Wort + reveal-msg parametrisiert; eigene Mask-/Filter-IDs "mask-ph"/
 * "gooey-ph", damit sie nie mit dem Tipps-Hero kollidieren). Server-Util (kein
 * DOM), wird in den Leistungs-/Website-Seiten pro Request eingesetzt.
 */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildPaintHeroHtml(word: string, messageLines: string[]): string {
  const chars = [...word];
  const spans = chars
    .map((ch, i) => {
      if (ch === " ") return `<span class="ltr sp" data-l="${i}" aria-hidden="true"></span>`;
      const isDot = ch === "." || ch === "!" || ch === "?";
      const cls = isDot ? "ltr dot" : "ltr";
      return `<span class="${cls}" data-l="${i}" aria-hidden="true">${esc(ch)}</span>`;
    })
    .join("");
  const msg = messageLines.map(esc).join("<br>");
  const ariaWord = esc(word.replace(/[.!?]+$/, "").trim());

  return `
<section class="scene-main" id="sceneMain">
  <div class="main-sticky painting" id="mainSticky" data-active="0" style="--mask:url(#mask-ph)">
    <div class="layer-base">
      <div class="reveal-msg">${msg}</div>
    </div>
    <div class="layer-deck">
      <div class="hero-title" id="htitle" role="heading" aria-level="1" aria-label="${ariaWord}">${spans}</div>
    </div>

    <div class="cursor-dot"></div>
    <span class="hint" id="hint">Maus über das Bild bewegen</span>
    <button class="autobtn" data-auto>Auto abspielen</button>

    <svg class="masksvg" aria-hidden="true">
      <defs>
        <filter id="gooey-ph">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -9" result="goo"/>
        </filter>
        <mask id="mask-ph">
          <rect class="mrect" width="100%" height="100%" fill="#fff"/>
          <g class="blobs" filter="url(#gooey-ph)"></g>
        </mask>
      </defs>
    </svg>
  </div>
</section>`;
}
