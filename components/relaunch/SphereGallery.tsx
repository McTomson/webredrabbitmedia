"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { SPHERE_PROJECTS, type SphereProject } from "@/lib/relaunch/projects";

// ============================================================
// SphereGallery — 1:1-Nachbau der phantom.land-Galerie.
// Alle Kennwerte stammen aus der vermessenen Original-Spec
// (scratchpad/phantom-spec.md, Quellen: Produktions-Chunk,
// Original-CSS, Codrops-Case-Study, Frame-Vermessung):
//   - Quadratische Zellen, Pitch ~281 CSS-px (Bildschirmmitte),
//     Fuge 0.002 Welt-Einheiten, unendlich gewrappt.
//   - Kruemmung = Postprocessing-Barrel: (0.88 + d*r^2)*uv mit
//     d = -0.07 * aspect; Vignette 0.6/0.6 (woertliche Formel).
//   - Medium max. 70% der Zelle, zentriert, wechselnde Formate.
//   - Hover = weichgezeichnete Durchschnittsfarbe des EIGENEN
//     Mediums als Zellgrund (x0.7), Intensitaet gedaempft 5/s;
//     Labels 0.8 -> 1.0. Keine Zell-Skalierung.
//   - Drag 1:1 + Release-Decay 4/s; Grab-Zoom (Kamera weicht
//     0.4s zurueck); Ambient-Drift pointer*0.07; Intro =
//     Zoom-in aus der Tiefe, Kruemmung erst danach (1s).
//   - Klick: kurzer Whiteout (DOM) -> Projekt-Unterseite.
// Abweichungen vom Original (bewusst, Thomas 15.07.):
//   Zellgrund NAVY (--rr-navy) statt Schwarz, Fugen fast schwarz;
//   unsere Schrift statt Mono; Video-Loops nur auf einem Teil
//   der Zellen; kein Sound/Filter.
// ============================================================

const CELL_BG = "#1c2837"; // --rr-navy (Thomas: Navy statt Schwarz)
const GAP_BG = "#0b1017"; // Fugen/Szenengrund: fast schwarz, Navy-Stich
const INK_MAIN = "#f6f5f1";
const INK_SOFT = "#c3c8d0";

// Raster (Spec §1): quadratische Zellen, ~281 px Pitch in der Mitte.
const CELL_PX = 281;
const TILE_FRACTION = 0.998; // Fuge 0.002 Welt-Einheiten
const GRID_COLS = 7;
const GRID_ROWS = 7;

// Distortion (Spec §4, woertlich): factor = 0.88 + d * r^2, d = -0.07*aspect.
const DISTORTION_BASE = 0.88;
const DISTORTION_FACTOR = -0.07;
const VIG_OFFSET = 0.6;
const VIG_DARK = 0.6;

// Bewegung (Spec §5): Release-Decay 4/s, Hover-Damp 5/s, Grab-Zoom 0.832
// (Kamera-z 3.43 -> 3.83 bei Grid-Abstand 1.98 => Skalierung 1.98/2.38).
const RELEASE_DECAY = 4;
const HOVER_DAMP = 5;
const GRAB_ZOOM = 0.832;
const GRAB_MS = 400;
const DRIFT = 0.07;

// Medium max. 70% der Zelle (Spec §2, MEDIA_ZOOM 0.7); Formate wechseln
// wie beim Original (breit / Hochformat-"Phone" / Quadrat, gemessen §2).
type ContentStyle = { w: number; h: number; crop: "top" | "center" };
const STYLE_WIDE: ContentStyle = { w: 0.7, h: 0.7 * (620 / 960), crop: "top" };
const STYLE_PHONE: ContentStyle = { w: 0.4, h: 0.7, crop: "top" };
const STYLE_SQUARE: ContentStyle = { w: 0.65, h: 0.65, crop: "center" };
const CONTENT_STYLES = [STYLE_WIDE, STYLE_PHONE, STYLE_SQUARE];
const STYLE_VIDEO: ContentStyle = { w: 0.7, h: 0.7 * (400 / 640), crop: "top" };

function easeOutPow2(t: number) {
  return 1 - (1 - t) * (1 - t);
}
function easeInOutPow3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ---- Zellgrund-Textur (Navy + Labels an den Ecken) -------------
// Spec §3: Labels INNERHALB der Zelle, Inset ~12% horizontal / ~9%
// vertikal, ~10.9px-Aequivalent uppercase, Grundopacity 0.8 (Hover 1.0).
// Pro Projekt geteilt; Hover-Variante bekommt den Media-Farbwash.
const TEX = 1024;
const PAD_X = Math.round(TEX * 0.12);
const PAD_Y = Math.round(TEX * 0.09);
// 10.9 px am Schirm bei 281px-Zelle -> 10.9 * (1024/281) = ~40px Textur.
const FONT_PX = 40;

type Fonts = { ui: string };

function drawCellBg(
  p: SphereProject,
  num: string,
  fonts: Fonts,
  washColor: string | null
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX;
  c.height = TEX;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = CELL_BG;
  ctx.fillRect(0, 0, TEX, TEX);
  if (washColor) {
    // Hover-Wash: Durchschnittsfarbe des Mediums, x0.7 (CELL_BLUR_OPACITY).
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = washColor;
    ctx.fillRect(0, 0, TEX, TEX);
    ctx.globalAlpha = 1;
  }

  // Fuge: hauchduenne fast-schwarze Kante (0.002 Welt = ~0.5px Schirm).
  ctx.strokeStyle = GAP_BG;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, TEX - 2, TEX - 2);

  const labelAlpha = washColor ? 1 : 0.8; // INACTIVE_LABEL_OPACITY 0.8
  ctx.globalAlpha = labelAlpha;
  ctx.textBaseline = "alphabetic";
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "3px";
  } catch {
    /* noop */
  }

  // Oben links: Projektname. Oben rechts: Website-Name (Thomas: Symmetrie).
  ctx.fillStyle = INK_MAIN;
  ctx.font = `600 ${FONT_PX}px ${fonts.ui}`;
  ctx.fillText(p.name.toUpperCase(), PAD_X, PAD_Y + FONT_PX * 0.8);
  ctx.fillStyle = INK_SOFT;
  const dom = p.domain.toUpperCase();
  // Langer Domain-Name darf nicht in den Projektnamen laufen: Schrift
  // schrittweise verkleinern, bis er passt (Symmetrie-Slot bleibt immer da).
  const nameW = ctx.measureText(p.name.toUpperCase()).width;
  const maxDomW = TEX - 2 * PAD_X - nameW - 40;
  let domFont = Math.round(FONT_PX * 0.85);
  let domShown = dom;
  ctx.font = `500 ${domFont}px ${fonts.ui}`;
  while (ctx.measureText(domShown).width > maxDomW && domFont > 26) {
    domFont -= 2;
    ctx.font = `500 ${domFont}px ${fonts.ui}`;
  }
  if (ctx.measureText(domShown).width > maxDomW) {
    // Vercel-Hostnames sind zu lang fuer den Slot: Suffix weglassen
    // (Anzeige-Kuerzel, kein Domain-Claim), notfalls mit Ellipse kappen.
    domShown = domShown.replace(/\.VERCEL\.APP$/, "");
    const afterStrip = domShown;
    while (ctx.measureText(domShown + "…").width > maxDomW && domShown.length > 4) {
      domShown = domShown.slice(0, -1);
    }
    if (domShown !== afterStrip) domShown += "…";
  }
  ctx.fillText(domShown, TEX - PAD_X - ctx.measureText(domShown).width, PAD_Y + FONT_PX * 0.8);

  // Unten links: Tag-Pills (Spec §3: Kapseln ~15px hoch, 1px helle Border,
  // Fuellung rgba(255,255,255,0.05); runde Pills = bewusste 1:1-Ausnahme
  // vom Eckig-Gesetz, lebt nur in der WebGL-Szene).
  const pillH = Math.round(15 * (TEX / CELL_PX)); // ~55px Textur
  const pillFont = Math.round(FONT_PX * 0.72);
  const pillY = TEX - PAD_Y - pillH;
  ctx.font = `500 ${pillFont}px ${fonts.ui}`;
  let px = PAD_X;
  for (const tag of p.tags.slice(0, 3)) {
    const tw = ctx.measureText(tag).width;
    const pw = tw + Math.round(pillH * 0.9);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(px, pillY, pw, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = INK_SOFT;
    ctx.fillText(tag, px + Math.round(pillH * 0.45), pillY + pillH * 0.68);
    px += pw + Math.round(pillH * 0.4);
  }

  // Unten rechts: laufende Nummer (Jahr-Slot des Originals).
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${Math.round(FONT_PX * 0.85)}px ${fonts.ui}`;
  ctx.fillText(num, TEX - PAD_X - ctx.measureText(num).width, pillY + pillH * 0.68);

  ctx.globalAlpha = 1;
  return c;
}

// Durchschnittsfarbe des Medium-Zentrums (Spec §6: BLUR_ZOOM 20 sampelt
// einen winzigen Zentrumsbereich -> praktisch die Durchschnittsfarbe).
function averageCenterColor(img: HTMLImageElement): string {
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const cw = img.naturalWidth * 0.5;
  const ch = img.naturalHeight * 0.5;
  ctx.drawImage(img, (img.naturalWidth - cw) / 2, (img.naturalHeight - ch) / 2, cw, ch, 0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${d[0]},${d[1]},${d[2]})`;
}

// Content-Canvas: Screenshot ins Stil-Format croppen (cover).
function drawContent(img: HTMLImageElement, style: ContentStyle): HTMLCanvasElement {
  const cw = 768;
  const ch = Math.round((cw * style.h) / style.w);
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d")!;
  const targetRatio = cw / ch;
  const srcRatio = img.naturalWidth / img.naturalHeight;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (srcRatio > targetRatio) sw = sh * targetRatio;
  else sh = sw / targetRatio;
  const sy = style.crop === "top" ? 0 : (img.naturalHeight - sh) / 2;
  const sx = (img.naturalWidth - sw) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  return c;
}

// Post-Pass: woertliche Original-Formeln (Spec §4).
const POST_FRAG = `
uniform sampler2D tScene;
uniform vec2 uDistortion;
uniform float uVigOffset;
uniform float uVigDark;
varying vec2 vUv;
void main() {
  vec2 m = 2.0 * (vUv - 0.5);
  vec2 uv = (${DISTORTION_BASE} + uDistortion * dot(m, m)) * m * 0.5 + 0.5;
  vec4 col = (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)
    ? vec4(0.0, 0.0, 0.0, 1.0)
    : texture2D(tScene, uv);
  float dist = distance(vUv, vec2(0.5));
  col.rgb *= smoothstep(0.8, uVigOffset * 0.799, (uVigDark + uVigOffset) * dist);
  gl_FragColor = vec4(col.rgb, 1.0);
}
`;
const POST_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

type Cell = {
  base: THREE.Vector2;
  project: SphereProject;
  imgUrl: string;
  style: ContentStyle;
  isVideo: boolean;
  bgMesh: THREE.Mesh;
  tintMesh: THREE.Mesh;
  contentMesh: THREE.Mesh;
  bgMat: THREE.MeshBasicMaterial;
  tintMat: THREE.MeshBasicMaterial;
  contentMat: THREE.MeshBasicMaterial;
};

export default function SphereGallery() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "canvas" | "fallback">("pending");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const test = document.createElement("canvas");
      webgl = !!(test.getContext("webgl2") || test.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setMode(!webgl || reduce ? "fallback" : "canvas");
  }, []);

  useEffect(() => {
    if (mode !== "canvas") return;
    const container = containerRef.current;
    if (!container) return;

    const small = window.matchMedia("(max-width: 767px)").matches;

    const probeFont = (cssVar: string, fallback: string) => {
      const probe = document.createElement("span");
      probe.style.fontFamily = `var(${cssVar})`;
      container.appendChild(probe);
      const fam = getComputedStyle(probe).fontFamily || fallback;
      container.removeChild(probe);
      return fam;
    };
    const fonts: Fonts = { ui: probeFont("--rr-font-ui", "sans-serif") };

    // ---- Renderer + zwei Szenen (Raster -> RenderTarget -> Distortion) ----
    const dpr = Math.min(window.devicePixelRatio, 2);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = small ? "pan-y" : "none";

    const gridScene = new THREE.Scene();
    gridScene.background = new THREE.Color(GAP_BG);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.set(0, 0, 5);

    const rt = new THREE.WebGLRenderTarget(2, 2, {
      samples: 4,
      colorSpace: THREE.SRGBColorSpace,
    });
    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: rt.texture },
        uDistortion: { value: new THREE.Vector2(0, 0) }, // Intro: flach
        uVigOffset: { value: VIG_OFFSET },
        uVigDark: { value: VIG_DARK },
      },
      vertexShader: POST_VERT,
      fragmentShader: POST_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
    postScene.add(postQuad);

    const makeTexture = (canvas: HTMLCanvasElement) => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      return tex;
    };

    // ---- Geteilte Grund-Texturen ----
    // Normal: pro Projekt. Hover-Wash: pro Bild-Variante (das Original
    // nimmt die Durchschnittsfarbe des EIGENEN Mediums); bis das Bild da
    // ist, dient die gesampelte Markenfarbe aus projects.ts als Fallback.
    const bgTexOf = new Map<string, THREE.CanvasTexture>();
    const tintTexOf = new Map<string, THREE.CanvasTexture>(); // key: imgUrl
    const numOf = (p: SphereProject) =>
      String(SPHERE_PROJECTS.indexOf(p) + 1).padStart(2, "0");
    const bakeBg = () => {
      for (const p of SPHERE_PROJECTS) {
        bgTexOf.get(p.slug)?.dispose();
        bgTexOf.set(p.slug, makeTexture(drawCellBg(p, numOf(p), fonts, null)));
        for (const url of [p.img, p.img2].filter(Boolean) as string[]) {
          tintTexOf.get(url)?.dispose();
          tintTexOf.set(url, makeTexture(drawCellBg(p, numOf(p), fonts, p.hoverColor)));
        }
      }
    };
    bakeBg();

    // ---- Video-Loops: ein <video> + eine Textur pro Projekt ----
    const videoOf = new Map<string, { el: HTMLVideoElement; tex: THREE.VideoTexture }>();
    for (const p of SPHERE_PROJECTS) {
      if (!p.loop) continue;
      const el = document.createElement("video");
      el.src = p.loop;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.preload = "metadata";
      const tex = new THREE.VideoTexture(el);
      tex.colorSpace = THREE.SRGBColorSpace;
      videoOf.set(p.slug, { el, tex });
    }

    // ---- Zellen ----
    const EXTENT_X = GRID_COLS;
    const EXTENT_Y = GRID_ROWS;
    const bgGeo = new THREE.PlaneGeometry(TILE_FRACTION, TILE_FRACTION);
    const geoDisposables: THREE.BufferGeometry[] = [bgGeo];
    const cells: Cell[] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const pIdx = (col + row) % SPHERE_PROJECTS.length;
        const project = SPHERE_PROJECTS[pIdx];
        const base = new THREE.Vector2(
          col - (GRID_COLS - 1) / 2,
          row - (GRID_ROWS - 1) / 2
        );
        const imgUrl = row % 2 === 1 && project.img2 ? project.img2 : project.img;
        // Video nur auf einem Teil der Zellen (Thomas: "nicht alle bewegen
        // sich"), immer im breiten Format.
        const isVideo = !!project.loop && (row + 2 * col) % 3 === 0;
        const style = isVideo
          ? STYLE_VIDEO
          : CONTENT_STYLES[(col * 3 + row * 2 + pIdx) % CONTENT_STYLES.length];

        const bgMat = new THREE.MeshBasicMaterial({
          map: bgTexOf.get(project.slug)!,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const tintMat = new THREE.MeshBasicMaterial({
          map: tintTexOf.get(imgUrl)!,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const contentMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#26364a"),
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });

        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        const tintMesh = new THREE.Mesh(bgGeo, tintMat);
        const contentGeo = new THREE.PlaneGeometry(style.w, style.h);
        geoDisposables.push(contentGeo);
        const contentMesh = new THREE.Mesh(contentGeo, contentMat);

        gridScene.add(bgMesh, tintMesh, contentMesh);
        cells.push({
          base,
          project,
          imgUrl,
          style,
          isVideo,
          bgMesh,
          tintMesh,
          contentMesh,
          bgMat,
          tintMat,
          contentMat,
        });
      }
    }

    // ---- Content laden ----
    let disposed = false;
    const contentTexCache = new Map<string, THREE.CanvasTexture>();
    const applyContent = (url: string, img: HTMLImageElement) => {
      if (disposed) return;
      // Hover-Wash jetzt aus dem echten Medium backen (Original-Verhalten).
      const project = SPHERE_PROJECTS.find((p) => p.img === url || p.img2 === url);
      if (project) {
        const wash = averageCenterColor(img);
        tintTexOf.get(url)?.dispose();
        const tex = makeTexture(drawCellBg(project, numOf(project), fonts, wash));
        tintTexOf.set(url, tex);
      }
      for (const cell of cells) {
        if (cell.imgUrl !== url) continue;
        cell.tintMat.map = tintTexOf.get(url)!;
        cell.tintMat.needsUpdate = true;
        if (cell.isVideo) continue;
        const key = `${url}|${cell.style.w}x${cell.style.h}|${cell.style.crop}`;
        let tex = contentTexCache.get(key);
        if (!tex) {
          tex = makeTexture(drawContent(img, cell.style));
          contentTexCache.set(key, tex);
        }
        cell.contentMat.map = tex;
        cell.contentMat.color.set("#ffffff");
        cell.contentMat.needsUpdate = true;
      }
    };
    const startLoading = () => {
      const urls = [...new Set(cells.map((c) => c.imgUrl))];
      urls.forEach((url) => {
        const img = new Image();
        img.onload = () => applyContent(url, img);
        img.src = url;
      });
      for (const cell of cells) {
        if (!cell.isVideo) continue;
        const v = videoOf.get(cell.project.slug);
        if (!v) continue;
        cell.contentMat.map = v.tex;
        cell.contentMat.color.set("#ffffff");
        cell.contentMat.needsUpdate = true;
      }
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        fonts.ui = probeFont("--rr-font-ui", "sans-serif");
        bakeBg();
        cells.forEach((cell) => {
          cell.bgMat.map = bgTexOf.get(cell.project.slug)!;
          cell.tintMat.map = tintTexOf.get(cell.imgUrl)!;
          cell.bgMat.needsUpdate = true;
          cell.tintMat.needsUpdate = true;
        });
        startLoading();
      });
    } else {
      startLoading();
    }

    // ---- Pan-Zustand ----
    const offset = new THREE.Vector2(0, 0);
    const targetOffset = new THREE.Vector2(0, 0);
    const vel = new THREE.Vector2(0, 0);
    const drift = new THREE.Vector2(0, 0); // Ambient-Drift (pointer*0.07)
    const driftTarget = new THREE.Vector2(0, 0);
    let unitsPerPx = 1 / 400;
    let navigating = false;

    const wrap = (v: number, extent: number) =>
      ((((v + extent / 2) % extent) + extent) % extent) - extent / 2;

    const cellScreenPos = (cell: Cell) =>
      new THREE.Vector2(
        wrap(cell.base.x + offset.x + drift.x, EXTENT_X),
        wrap(cell.base.y + offset.y + drift.y, EXTENT_Y)
      );

    // ---- Zoom-Phasen: Intro (aus der Tiefe) + Grab-Zoom ----
    // Intro (Spec §8): Grid faehrt aus z -2.75 heran (ortho: zoom 0.32 -> 1,
    // 0.7s power3.inOut) + Opacity 0 -> 1 (0.4s); Kruemmung erst DANACH
    // (0 -> -0.07*aspect in 1s power2.out).
    const introT0 = performance.now();
    const INTRO_ZOOM_MS = 700;
    const INTRO_CURVE_DELAY = 700;
    const INTRO_CURVE_MS = 1000;
    let grabT = 0; // 0..1 Anteil Grab-Zoom
    let grabbing = false;
    let aspectNow = 1.6;

    // ---- Pointer ----
    let hovered = -1;
    let dragging = false;
    let downOnCanvas = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let pointerUv: THREE.Vector2 | null = null;

    const currentDistortion = () => (postMat.uniforms.uDistortion.value as THREE.Vector2).x;

    const toSceneUv = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const u = (clientX - rect.left) / rect.width;
      const v = (clientY - rect.top) / rect.height;
      const mx = 2 * (u - 0.5);
      const my = 2 * (v - 0.5);
      const r2 = mx * mx + my * my;
      const d = currentDistortion();
      const f = DISTORTION_BASE + d * r2;
      return new THREE.Vector2(0.5 + 0.5 * mx * f, 0.5 + 0.5 * my * f);
    };

    const pickCell = (): number => {
      if (!pointerUv) return -1;
      const worldX = camera.left + pointerUv.x * (camera.right - camera.left);
      const worldY = camera.top + pointerUv.y * (camera.bottom - camera.top);
      // camera.top/bottom sind invertiert zur UV-y-Richtung; die Vorzeichen
      // heben sich mit der Shader-Formel exakt auf (dokumentiert im Review
      // der Vorversion) — Werte hier unveraendert uebernehmen.
      for (let i = 0; i < cells.length; i++) {
        const pos = cellScreenPos(cells[i]);
        if (
          Math.abs(worldX - pos.x) <= TILE_FRACTION / 2 &&
          Math.abs(worldY - pos.y) <= TILE_FRACTION / 2
        ) {
          return i;
        }
      }
      return -1;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (navigating) return;
      dragging = true;
      grabbing = true;
      downOnCanvas = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      vel.set(0, 0);
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      pointerUv = toSceneUv(e.clientX, e.clientY);
      const rect = renderer.domElement.getBoundingClientRect();
      driftTarget.set(
        ((e.clientX - rect.left) / rect.width - 0.5) * DRIFT,
        -((e.clientY - rect.top) / rect.height - 0.5) * DRIFT
      );
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        vel.set(dx * unitsPerPx, -dy * unitsPerPx);
        targetOffset.x += vel.x;
        targetOffset.y += vel.y;
      }
    };
    const endDrag = (e: PointerEvent) => {
      grabbing = false;
      if (!dragging) return;
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      renderer.domElement.style.cursor = hovered >= 0 ? "pointer" : "grab";
    };
    const onPointerUp = (e: PointerEvent) => {
      const wasClick = downOnCanvas && moved <= 3; // Drag-Schwelle 3px (Spec §5)
      downOnCanvas = false;
      endDrag(e);
      if (navigating) return;
      if (wasClick) {
        pointerUv = toSceneUv(e.clientX, e.clientY);
        const i = pickCell();
        if (i >= 0) {
          navigating = true;
          setLeaving(true);
          const slug = cells[i].project.slug;
          window.setTimeout(() => {
            router.push(`/relaunch-preview/referenzen/${slug}`);
          }, 420);
        }
      }
    };

    // Wheel pannt das Raster (das Original hat keinen nativen Scroll).
    const onWheel = (e: WheelEvent) => {
      if (navigating) return;
      e.preventDefault();
      const f = unitsPerPx * 0.9;
      targetOffset.x -= e.deltaX * f;
      targetOffset.y += e.deltaY * f;
      vel.set(-e.deltaX * f * 0.25, e.deltaY * f * 0.25);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // ---- Resize ----
    let viewHalfH = 1;
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      rt.setSize(Math.round(w * dpr), Math.round(h * dpr));
      aspectNow = w / h;
      // Zellpitch fix ~CELL_PX in der Bildschirmmitte. Der Shader
      // vergroessert das Zentrum um 1/0.88 -> Kamera kompensiert.
      const visibleCols = Math.max(1.4, w / CELL_PX);
      let halfW = visibleCols / 2 / DISTORTION_BASE;
      // Sichtbare Hoehe darf die Rasterausdehnung nie ueberschreiten
      // (sonst nackte Wrap-Baender auf extremen Hochformaten).
      const maxHalfH = EXTENT_Y * 0.475;
      if (halfW * (h / w) > maxHalfH) halfW = maxHalfH / (h / w);
      const halfH = halfW * (h / w);
      viewHalfH = halfH;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();
      unitsPerPx = ((2 * halfW) / w) * DISTORTION_BASE;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ---- Sichtbarkeit ----
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && raf === 0) {
          last = performance.now();
          loop();
        }
        if (!visible) videoOf.forEach((v) => v.el.pause());
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    // ---- Render-Loop (alle Daempfungen zeitbasiert, L-referenzen-03) ----
    let raf = 0;
    let last = performance.now();
    let zoom = 0.32;
    let videoTick = 0;
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const damp = (k: number) => 1 - Math.exp(-k * dt);

      // Traegheit: Drag 1:1 (in onPointerMove), Release-Decay 4/s (Spec §5).
      if (!dragging) {
        targetOffset.x += vel.x * 60 * dt;
        targetOffset.y += vel.y * 60 * dt;
        const decay = Math.exp(-RELEASE_DECAY * dt);
        vel.multiplyScalar(decay);
        if (vel.lengthSq() < 1e-10) vel.set(0, 0);
      }
      const d = damp(5.5);
      offset.x += (targetOffset.x - offset.x) * d;
      offset.y += (targetOffset.y - offset.y) * d;
      drift.x += (driftTarget.x - drift.x) * damp(3);
      drift.y += (driftTarget.y - drift.y) * damp(3);

      // Hover nur ausserhalb von Drag (Touch: pointermove feuert kaum
      // ausserhalb des Drags -> praktisch uebersprungen wie im Original).
      if (!dragging && !navigating) {
        const hi = pickCell();
        if (hi !== hovered) {
          hovered = hi;
          renderer.domElement.style.cursor = hi >= 0 ? "pointer" : "grab";
        }
      }

      // Intro-Choreografie (Spec §8).
      const tIntro = now - introT0;
      const zIntro = 0.32 + 0.68 * easeInOutPow3(Math.min(1, tIntro / INTRO_ZOOM_MS));
      const appeared = Math.min(1, tIntro / 400);
      const curveT = easeOutPow2(
        Math.min(1, Math.max(0, (tIntro - INTRO_CURVE_DELAY) / INTRO_CURVE_MS))
      );
      const dist = postMat.uniforms.uDistortion.value as THREE.Vector2;
      const dTargetVal = DISTORTION_FACTOR * aspectNow * curveT;
      dist.set(dTargetVal, dTargetVal);

      // Grab-Zoom (Spec §5): 1 -> 0.832 in 0.4s, zurueck in 0.4s.
      grabT = Math.min(1, Math.max(0, grabT + (grabbing ? dt * 1000 / GRAB_MS : -dt * 1000 / GRAB_MS)));
      const grabZoom = 1 + (GRAB_ZOOM - 1) * easeOutPow2(grabT);
      zoom = zIntro * grabZoom;
      camera.zoom = zoom;
      camera.updateProjectionMatrix();

      // Zellen positionieren (Wrap) + Fades (Hover-Damp 5/s, Spec §6).
      const dHover = damp(HOVER_DAMP);
      const dAppear = damp(9);
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = wrap(cell.base.x + offset.x + drift.x, EXTENT_X);
        const y = wrap(cell.base.y + offset.y + drift.y, EXTENT_Y);
        cell.bgMesh.position.set(x, y, 0);
        cell.tintMesh.position.set(x, y, 0.005);
        cell.contentMesh.position.set(x, y, 0.01);
        const isHover = i === hovered;
        cell.bgMat.opacity += (appeared - cell.bgMat.opacity) * dAppear;
        cell.tintMat.opacity += ((isHover ? appeared : 0) - cell.tintMat.opacity) * dHover;
        cell.contentMat.opacity += (appeared - cell.contentMat.opacity) * dAppear;
      }

      // Videos: nur nahe der Bildmitte spielen (Original-Verhalten).
      videoTick += dt;
      if (videoTick > 0.25) {
        videoTick = 0;
        const playRadius = Math.max(viewHalfH, 1.4);
        const shouldPlay = new Set<string>();
        for (const cell of cells) {
          if (!cell.isVideo) continue;
          const pos = cellScreenPos(cell);
          if (Math.abs(pos.x) < playRadius * aspectNow && Math.abs(pos.y) < playRadius) {
            shouldPlay.add(cell.project.slug);
          }
        }
        videoOf.forEach((v, slug) => {
          if (shouldPlay.has(slug)) {
            if (v.el.paused) v.el.play().catch(() => undefined);
          } else if (!v.el.paused) {
            v.el.pause();
          }
        });
      }

      renderer.setRenderTarget(rt);
      renderer.render(gridScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCam);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // ---- Cleanup ----
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", endDrag);
      renderer.domElement.removeEventListener("wheel", onWheel);
      postQuad.geometry.dispose();
      postMat.dispose();
      rt.dispose();
      geoDisposables.forEach((g) => g.dispose());
      bgTexOf.forEach((t) => t.dispose());
      tintTexOf.forEach((t) => t.dispose());
      contentTexCache.forEach((t) => t.dispose());
      videoOf.forEach((v) => {
        v.el.pause();
        v.el.removeAttribute("src");
        v.el.load();
        v.tex.dispose();
      });
      cells.forEach((cell) => {
        cell.bgMat.dispose();
        cell.tintMat.dispose();
        cell.contentMat.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, router]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {mode === "fallback" ? (
        <FallbackGrid />
      ) : (
        <div
          ref={containerRef}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, overflow: "hidden", background: GAP_BG }}
        />
      )}

      {mode === "canvas" && (
        <div
          className="rf-gal-meta"
          style={{
            position: "absolute",
            left: "var(--rr-gutter)",
            bottom: 24,
            pointerEvents: "none",
          }}
        >
          <p className="rr-meta" style={{ color: "#c7c9cf" }}>
            Ziehen zum Umschauen · Kachel antippen für das Projekt
          </p>
        </div>
      )}

      {/* Whiteout-Uebergang beim Klick (DOM statt WebGL: bleibt auch
          waehrend der Navigation zuverlaessig sichtbar) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#f6f5f1",
          opacity: leaving ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.42s ease",
          zIndex: 4,
        }}
      />
    </div>
  );
}

// 2D-Fallback (kein WebGL / reduced-motion): Screenshot-Karten.
function FallbackGrid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        background: "var(--rr-navy)",
        padding: "var(--rr-gutter)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        {SPHERE_PROJECTS.map((p) => (
          <a
            key={p.slug}
            href={`/relaunch-preview/referenzen/${p.slug}`}
            style={{ textDecoration: "none", color: "#f6f5f1" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={`Website ${p.name}`}
              style={{ display: "block", width: "100%", aspectRatio: "960/620", objectFit: "cover" }}
            />
            <span style={{ display: "block", marginTop: 10, fontSize: 15, fontWeight: 700 }}>
              {p.name}
            </span>
            <span style={{ display: "block", fontSize: 12.5, opacity: 0.7, marginTop: 3 }}>
              {p.cat}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
