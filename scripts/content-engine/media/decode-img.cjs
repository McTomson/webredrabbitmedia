// decode-img.cjs — decode a browser-extracted image into a sized PNG.
//
// Input: a file whose content is EITHER a `data:image/...;base64,<...>` URL,
// OR a raw base64 string, optionally wrapped in JSON quotes (agent-browser
// `eval` may print the value JSON-encoded). We strip quotes/whitespace and
// take everything after the first `base64,` marker if present.
//
// Output: a PNG resized to width 1200 (height auto, aspect kept), written to
// <outStage> and optionally also to <outPublic>. Fail-closed: exits non-zero
// (no file written) if the input is not a usable image, so the caller never
// stages an empty/garbage hero.
//
// Usage: node decode-img.cjs <clipFile> <outStage> [outPublic]
//   NODE_PATH must include the repo node_modules so `sharp` resolves, e.g.
//   NODE_PATH="$PWD/node_modules" /opt/homebrew/bin/node decode-img.cjs ...
const fs = require('fs');
const sharp = require('sharp');

const [clipFile, outStage, outPublic] = process.argv.slice(2);
if (!clipFile || !outStage) {
    console.error('Usage: node decode-img.cjs <clipFile> <outStage> [outPublic]');
    process.exit(2);
}

let s = fs.readFileSync(clipFile, 'utf8').trim();
// Unwrap a JSON-encoded string ("...") if agent-browser printed it that way.
if (s.startsWith('"') && s.endsWith('"')) {
    try { s = JSON.parse(s); } catch { s = s.slice(1, -1); }
}
s = s.trim();

const marker = s.indexOf('base64,');
let b64;
if (s.startsWith('data:image') && marker >= 0) {
    b64 = s.slice(marker + 'base64,'.length);
} else if (/^[A-Za-z0-9+/=\s]+$/.test(s) && s.length > 1000) {
    // Looks like a bare base64 blob (PNG/JPEG are >1KB once encoded).
    b64 = s;
} else {
    console.error('NO_DATAURL: input is not a data:image URL or base64 blob (len=' + s.length + ')');
    process.exit(2);
}

const buf = Buffer.from(b64.replace(/\s+/g, ''), 'base64');
if (buf.length < 1000) {
    console.error('TOO_SMALL: decoded ' + buf.length + ' bytes — not a real image');
    process.exit(2);
}

(async () => {
    try {
        const out = await sharp(buf)
            .resize(1200, null, { withoutEnlargement: false })
            .png({ quality: 90, compressionLevel: 9 })
            .toBuffer();
        const meta = await sharp(out).metadata();
        if (!meta.width || !meta.height) throw new Error('decoded image has no dimensions');
        fs.writeFileSync(outStage, out);
        if (outPublic) fs.writeFileSync(outPublic, out);
        console.log('OK ' + meta.width + 'x' + meta.height + ' ' + Math.round(out.length / 1024) + 'KB');
    } catch (e) {
        console.error('DECODE_FAIL: ' + (e && e.message ? e.message : e));
        process.exit(3);
    }
})();
