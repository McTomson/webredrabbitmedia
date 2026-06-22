// gemini-extract.js — runs IN the Gemini page (agent-browser eval --stdin).
// Returns the most recently generated image as a PNG data URL string, or '' if none.
//
// Strategy: collect all <img> whose source is a generated blob:/data: image (Gemini renders
// generated images as same-origin blobs), keep the largest by pixel area (the full-size result,
// not a thumbnail/avatar), prefer the LAST one in DOM order (newest response). If the src is
// already a data:image URL we return it directly; otherwise we draw it onto a canvas and read
// it back as PNG (same-origin blob -> canvas is not tainted -> toDataURL works).
//
// CALIBRATION: if Gemini wraps generated images differently (e.g. background-image, <canvas>,
// or a download-only blob), adjust the candidate collection here after inspecting the live DOM
// with `agent-browser ... snapshot` / `eval`.
(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
        .filter((i) => {
            const s = i.currentSrc || i.src || '';
            return /^(blob:|data:image)/.test(s) && (i.naturalWidth || 0) >= 256 && (i.naturalHeight || 0) >= 256;
        })
        .map((i) => ({ i, area: (i.naturalWidth || 0) * (i.naturalHeight || 0) }));
    if (!imgs.length) return '';

    // Largest area wins; ties -> last in DOM order (newest).
    imgs.sort((a, b) => a.area - b.area);
    const best = imgs[imgs.length - 1].i;
    const src = best.currentSrc || best.src || '';
    if (src.startsWith('data:image')) return src;

    try {
        const c = document.createElement('canvas');
        c.width = best.naturalWidth;
        c.height = best.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(best, 0, 0);
        return c.toDataURL('image/png');
    } catch (e) {
        return ''; // tainted canvas / cross-origin -> caller fails closed
    }
})();
