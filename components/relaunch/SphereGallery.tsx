"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as THREE from "three";
import { SPHERE_PROJECTS, type SphereProject } from "@/lib/relaunch/projects";

// ============================================================
// SphereGallery — 1:1-Nachbau der phantom.land-Galerie.
// Kennwerte aus der vermessenen Original-Spec (scratchpad/
// phantom-spec.md: Produktions-Chunk, Original-CSS, Codrops,
// Frame-Vermessung):
//   - Quadratische Zellen, unendlich gewrappt; Kruemmung =
//     Postprocessing-Barrel (0.88 + d*r^2, d = -0.07*aspect),
//     Vignette 0.6/0.6 (woertliche Formeln).
//   - Medium max. 70% der Zelle, zentriert, wechselnde Formate.
//   - Hover = weichgezeichnetes EIGENES Medium als Zellgrund
//     (x0.7, Damp 5/s) — Blur-Verlauf, keine Flachfarbe
//     (Thomas 16.07.); Labels 0.8 -> 1.0.
//   - Drag 1:1 + Release-Decay 4/s; Grab-Zoom; Ambient-Drift;
//     Intro-Zoom aus der Tiefe, Kruemmung erst danach.
//   - Klick Projekt-Zelle: Whiteout -> Projekt-Unterseite.
//     Klick Info-Zelle: Info-Karte (DOM, DESIGN.md-Stil).
// Bewusste Abweichungen (Thomas): Zellgrund NAVY, sichtbare
// feine Rasterlinien, KEINE Nummern, unsere Schrift, Video-
// Loops nur auf einem Teil der Zellen, Info-Karten im Raster.
// ============================================================

const CELL_BG = "#1c2837"; // --rr-navy (Thomas: Navy statt Schwarz)
const GAP_BG = "#0b1017"; // Szenengrund: fast schwarz, Navy-Stich
const GRID_LINE = "rgba(246,245,241,0.11)"; // feine durchlaufende Linien (Thomas 16.07.)
const INK_MAIN = "#f6f5f1";
const INK_SOFT = "#c3c8d0";
const INFO_WASH = "#7d1522"; // Hover-Wash der Info-Zellen (dunkles Markenrot)

// Raster (Spec §1, Zellgroesse leicht reduziert auf Thomas-Wunsch 16.07.).
const CELL_PX = 260;
const TILE_FRACTION = 0.998;
const GRID_COLS = 7;
const GRID_ROWS = 7;

// Distortion (Spec §4, woertlich): factor = 0.88 + d * r^2, d = -0.07*aspect.
const DISTORTION_BASE = 0.88;
const DISTORTION_FACTOR = -0.07;
const VIG_OFFSET = 0.6;
const VIG_DARK = 0.6;

// Bewegung (Spec §5): Release-Decay 4/s, Hover-Damp 5/s, Grab-Zoom 0.832.
const RELEASE_DECAY = 4;
const HOVER_DAMP = 5;
const GRAB_ZOOM = 0.832;
const GRAB_MS = 400;
const DRIFT = 0.07;

// Medium max. 70% der Zelle (Spec §2); Formate wechseln wie im Original.
type ContentStyle = { w: number; h: number; crop: "top" | "center" };
const STYLE_WIDE: ContentStyle = { w: 0.7, h: 0.7 * (620 / 960), crop: "top" };
const STYLE_PHONE: ContentStyle = { w: 0.4, h: 0.7, crop: "top" };
const STYLE_SQUARE: ContentStyle = { w: 0.65, h: 0.65, crop: "center" };
const CONTENT_STYLES = [STYLE_WIDE, STYLE_PHONE, STYLE_SQUARE];
const STYLE_VIDEO: ContentStyle = { w: 0.7, h: 0.7 * (400 / 640), crop: "top" };

// ---- Info-Zellen (Thomas 16.07.): Hook-Karten im Raster ----------
// Inhalte nur aus verifizierten Marken-Fakten (brand/: Entwurf ohne
// Vorkasse, Anzahlung erst bei Auftragszusage, "fair + selektiv").
export type InfoCard = {
  key: string;
  cellTop: string; // kleines Label oben links in der Zelle
  cellLines: [string, string]; // grosses Statement in der Zelle
  title: string;
  body: string;
  cta?: { label: string; href: string };
};
const INFO_CARDS: InfoCard[] = [
  {
    key: "gefunden",
    cellTop: "WARUM DAS ALLES",
    cellLines: ["GEFUNDEN", "WERDEN."],
    title: "Schön reicht nicht. Gefunden werden ist der Punkt.",
    body:
      "Jede Website in dieser Galerie ist dafür gebaut, dass echte Kunden sie finden: " +
      "saubere Struktur, schnelle Ladezeiten, Texte, die Suchanfragen beantworten. " +
      "Das Design ist die Verpackung — gefunden werden ist der Job.",
  },
  {
    key: "methode",
    cellTop: "DIE RED RABBIT METHODE",
    cellLines: ["ERST SEHEN,", "DANN ZAHLEN."],
    title: "Die Red Rabbit Methode",
    body:
      "Du bekommst zuerst einen Entwurf — ohne Vorkasse. Eine Anzahlung wird erst fällig, " +
      "wenn du den Auftrag wirklich gibst. Fair und selektiv: Wir nehmen die Projekte an, " +
      "die wir richtig gut machen können.",
  },
  {
    key: "projekt",
    cellTop: "DEIN PROJEKT",
    cellLines: ["DER NÄCHSTE", "BIST DU."],
    title: "Der nächste bist du.",
    body:
      "Du hast gesehen, was wir für andere gebaut haben. Der nächste Schritt ist ein " +
      "kurzes Gespräch: unverbindlich und konkret.",
    cta: { label: "Projekt anfragen", href: "/relaunch-preview/kontakt" },
  },
];
// Position im 7x7-Raster (row,col) -> Karte; wiederholt sich mit dem Wrap.
const INFO_AT = new Map<string, InfoCard>([
  ["1,2", INFO_CARDS[0]],
  ["3,5", INFO_CARDS[1]],
  ["5,0", INFO_CARDS[2]],
]);

function easeOutPow2(t: number) {
  return 1 - (1 - t) * (1 - t);
}
function easeInOutPow3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ---- Zell-Texturen ------------------------------------------------
const TEX = 1024;
const PAD_X = Math.round(TEX * 0.12);
const PAD_Y = Math.round(TEX * 0.09);
// 10.9px-Aequivalent (Spec §3) bei CELL_PX-Zelle.
const FONT_PX = Math.round(10.9 * (TEX / CELL_PX));

type Fonts = { ui: string };
// Hover-Wash: Blur-Canvas des eigenen Mediums ODER Fallback-Farbe.
type Wash = HTMLCanvasElement | string | null;

function paintCellBase(ctx: CanvasRenderingContext2D, wash: Wash) {
  ctx.fillStyle = CELL_BG;
  ctx.fillRect(0, 0, TEX, TEX);
  if (wash) {
    // Original (Spec §6): weichgezeichnetes Medium x0.7 als Vollflaeche.
    ctx.globalAlpha = 0.7;
    if (typeof wash === "string") {
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, TEX, TEX);
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(wash, 0, 0, TEX, TEX);
    }
    ctx.globalAlpha = 1;
  }
  // Feine durchlaufende Rasterlinien (Thomas 16.07., Original-Anmutung).
  ctx.strokeStyle = GRID_LINE;
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, TEX - 3, TEX - 3);
}

function drawTagPills(
  ctx: CanvasRenderingContext2D,
  tags: string[],
  fonts: Fonts
) {
  const pillH = Math.round(15 * (TEX / CELL_PX));
  const pillFont = Math.round(FONT_PX * 0.72);
  const pillY = TEX - PAD_Y - pillH;
  ctx.font = `500 ${pillFont}px ${fonts.ui}`;
  let px = PAD_X;
  for (const tag of tags.slice(0, 3)) {
    const tw = ctx.measureText(tag).width;
    const pw = tw + Math.round(pillH * 0.9);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    // Runde Pills = bewusste 1:1-Ausnahme vom Eckig-Gesetz (nur WebGL).
    ctx.roundRect(px, pillY, pw, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = INK_SOFT;
    ctx.fillText(tag, px + Math.round(pillH * 0.45), pillY + pillH * 0.68);
    px += pw + Math.round(pillH * 0.4);
  }
}

// Projekt-Zelle: Labels an den Ecken (Spec §3: Inset ~12%/9%, Basis-
// Opacity 0.8, Hover 1.0). KEINE Nummern (Thomas 16.07.).
function drawCellBg(
  p: SphereProject,
  fonts: Fonts,
  wash: Wash
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX;
  c.height = TEX;
  const ctx = c.getContext("2d")!;
  paintCellBase(ctx, wash);

  ctx.globalAlpha = wash ? 1 : 0.8;
  ctx.textBaseline = "alphabetic";
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "3px";
  } catch {
    /* noop */
  }

  // Oben links: Projektname. Oben rechts: Website-Name (Symmetrie).
  ctx.fillStyle = INK_MAIN;
  ctx.font = `600 ${FONT_PX}px ${fonts.ui}`;
  ctx.fillText(p.name.toUpperCase(), PAD_X, PAD_Y + FONT_PX * 0.8);
  ctx.fillStyle = INK_SOFT;
  const dom = p.domain.toUpperCase();
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
    domShown = domShown.replace(/\.VERCEL\.APP$/, "");
    const afterStrip = domShown;
    while (ctx.measureText(domShown + "…").width > maxDomW && domShown.length > 4) {
      domShown = domShown.slice(0, -1);
    }
    if (domShown !== afterStrip) domShown += "…";
  }
  ctx.fillText(domShown, TEX - PAD_X - ctx.measureText(domShown).width, PAD_Y + FONT_PX * 0.8);

  drawTagPills(ctx, p.tags, fonts);
  ctx.globalAlpha = 1;
  return c;
}

// Info-Zelle: grosses Statement, kleines Label, roter Punkt als Marker.
function drawInfoCell(card: InfoCard, fonts: Fonts, wash: Wash): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX;
  c.height = TEX;
  const ctx = c.getContext("2d")!;
  paintCellBase(ctx, wash);

  ctx.globalAlpha = wash ? 1 : 0.9;
  ctx.textBaseline = "alphabetic";
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "3px";
  } catch {
    /* noop */
  }

  // Oben links: roter Punkt + Label.
  ctx.fillStyle = "#f12032";
  ctx.beginPath();
  ctx.arc(PAD_X + 9, PAD_Y + FONT_PX * 0.5, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${Math.round(FONT_PX * 0.85)}px ${fonts.ui}`;
  ctx.fillText(card.cellTop, PAD_X + 34, PAD_Y + FONT_PX * 0.8);

  // Mitte: zweizeiliges Statement.
  const big = Math.round(TEX * 0.085);
  ctx.fillStyle = INK_MAIN;
  ctx.font = `700 ${big}px ${fonts.ui}`;
  const l1w = ctx.measureText(card.cellLines[0]).width;
  const l2w = ctx.measureText(card.cellLines[1]).width;
  ctx.fillText(card.cellLines[0], (TEX - l1w) / 2, TEX / 2 - big * 0.25);
  ctx.fillText(card.cellLines[1], (TEX - l2w) / 2, TEX / 2 + big * 0.95);

  // Unten links: INFO-Pill. Unten rechts: Plus.
  drawTagPills(ctx, ["INFO"], fonts);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${Math.round(FONT_PX * 1.4)}px ${fonts.ui}`;
  const plus = "+";
  ctx.fillText(plus, TEX - PAD_X - ctx.measureText(plus).width, TEX - PAD_Y);

  ctx.globalAlpha = 1;
  return c;
}

// Blur-Verlauf des Mediums (Spec §6 / Thomas 16.07.): Bild winzig
// rendern (8x8) — das Hochskalieren mit Smoothing ergibt den weichen
// Farbverlauf wie beim Original.
function makeBlurCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const s = Math.min(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(
    img,
    (img.naturalWidth - s) / 2,
    (img.naturalHeight - s) / 2,
    s,
    s,
    0,
    0,
    8,
    8
  );
  return c;
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

// Post-Pass: woertliche Original-Formeln (Spec §4); Vignette-Werte sind
// konstant und direkt in den Shader interpoliert (Review m2).
const POST_FRAG = `
uniform sampler2D tScene;
uniform float uDistortion;
varying vec2 vUv;
void main() {
  vec2 m = 2.0 * (vUv - 0.5);
  vec2 uv = (${DISTORTION_BASE} + uDistortion * dot(m, m)) * m * 0.5 + 0.5;
  vec4 col = (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)
    ? vec4(0.0, 0.0, 0.0, 1.0)
    : texture2D(tScene, uv);
  float dist = distance(vUv, vec2(0.5));
  col.rgb *= smoothstep(0.8, ${(VIG_OFFSET * 0.799).toFixed(4)}, ${(VIG_DARK + VIG_OFFSET).toFixed(4)} * dist);
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
  project: SphereProject | null; // null = Info-Zelle
  info: InfoCard | null;
  imgUrl: string; // "" bei Info-Zellen
  bgKey: string; // Textur-Schluessel (slug oder info:<key>)
  tintKey: string; // imgUrl oder info:<key>
  style: ContentStyle;
  isVideo: boolean;
  bgMesh: THREE.Mesh;
  tintMesh: THREE.Mesh;
  contentMesh: THREE.Mesh | null;
  bgMat: THREE.MeshBasicMaterial;
  tintMat: THREE.MeshBasicMaterial;
  contentMat: THREE.MeshBasicMaterial | null;
};

export default function SphereGallery() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "canvas" | "fallback">("pending");
  const [leaving, setLeaving] = useState(false);
  const [infoCard, setInfoCard] = useState<InfoCard | null>(null);

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

  // Escape schliesst die Info-Karte (a11y).
  useEffect(() => {
    if (!infoCard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfoCard(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [infoCard]);

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

    // ---- Renderer + zwei Szenen ----
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
        uDistortion: { value: 0 }, // Intro: flach
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
    // Farb-Fallback-Tint pro PROJEKT einmal gebacken und unter beiden
    // Bild-URLs geteilt (Review M1); der echte Medium-Blur ersetzt ihn,
    // sobald das Bild geladen ist.
    const bgTexOf = new Map<string, THREE.CanvasTexture>();
    const tintTexOf = new Map<string, THREE.CanvasTexture>();
    const fallbackTintOf = new Map<string, THREE.CanvasTexture>(); // key: slug
    const washOf = new Map<string, HTMLCanvasElement>(); // key: imgUrl
    const bakeBg = () => {
      for (const p of SPHERE_PROJECTS) {
        bgTexOf.get(p.slug)?.dispose();
        bgTexOf.set(p.slug, makeTexture(drawCellBg(p, fonts, null)));
        const oldFallback = fallbackTintOf.get(p.slug);
        const fallback = makeTexture(drawCellBg(p, fonts, p.hoverColor));
        fallbackTintOf.set(p.slug, fallback);
        for (const url of [p.img, p.img2].filter(Boolean) as string[]) {
          const old = tintTexOf.get(url);
          const wash = washOf.get(url);
          if (wash) {
            old?.dispose();
            tintTexOf.set(url, makeTexture(drawCellBg(p, fonts, wash)));
          } else {
            if (old && old !== oldFallback) old.dispose();
            tintTexOf.set(url, fallback);
          }
        }
        oldFallback?.dispose();
      }
      for (const card of INFO_CARDS) {
        const k = `info:${card.key}`;
        bgTexOf.get(k)?.dispose();
        bgTexOf.set(k, makeTexture(drawInfoCell(card, fonts, null)));
        tintTexOf.get(k)?.dispose();
        tintTexOf.set(k, makeTexture(drawInfoCell(card, fonts, INFO_WASH)));
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
        const base = new THREE.Vector2(
          col - (GRID_COLS - 1) / 2,
          row - (GRID_ROWS - 1) / 2
        );
        const info = INFO_AT.get(`${row},${col}`) ?? null;
        const pIdx = (col + row) % SPHERE_PROJECTS.length;
        const project = info ? null : SPHERE_PROJECTS[pIdx];
        const imgUrl = project
          ? row % 2 === 1 && project.img2
            ? project.img2
            : project.img
          : "";
        const bgKey = info ? `info:${info.key}` : project!.slug;
        const tintKey = info ? `info:${info.key}` : imgUrl;
        const isVideo = !!project?.loop && (row + 2 * col) % 3 === 0;
        const style = isVideo
          ? STYLE_VIDEO
          : CONTENT_STYLES[(col * 3 + row * 2 + pIdx) % CONTENT_STYLES.length];

        const bgMat = new THREE.MeshBasicMaterial({
          map: bgTexOf.get(bgKey)!,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const tintMat = new THREE.MeshBasicMaterial({
          map: tintTexOf.get(tintKey)!,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        const tintMesh = new THREE.Mesh(bgGeo, tintMat);
        tintMesh.visible = false;

        let contentMesh: THREE.Mesh | null = null;
        let contentMat: THREE.MeshBasicMaterial | null = null;
        if (project) {
          contentMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#26364a"),
            transparent: true,
            opacity: 0,
            toneMapped: false,
          });
          const contentGeo = new THREE.PlaneGeometry(style.w, style.h);
          geoDisposables.push(contentGeo);
          contentMesh = new THREE.Mesh(contentGeo, contentMat);
          gridScene.add(contentMesh);
        }

        gridScene.add(bgMesh, tintMesh);
        cells.push({
          base,
          project,
          info,
          imgUrl,
          bgKey,
          tintKey,
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
      // Echten Medium-Blur als Hover-Wash backen (Original-Verhalten).
      const project = SPHERE_PROJECTS.find((p) => p.img === url || p.img2 === url);
      if (project) {
        const wash = makeBlurCanvas(img);
        washOf.set(url, wash);
        const old = tintTexOf.get(url);
        const fallback = fallbackTintOf.get(project.slug);
        tintTexOf.set(url, makeTexture(drawCellBg(project, fonts, wash)));
        if (old && old !== fallback) old.dispose();
        if (fallback && ![...tintTexOf.values()].includes(fallback)) {
          fallback.dispose();
          fallbackTintOf.delete(project.slug);
        }
      }
      for (const cell of cells) {
        if (cell.imgUrl !== url) continue;
        cell.tintMat.map = tintTexOf.get(url)!;
        cell.tintMat.needsUpdate = true;
        if (cell.isVideo || !cell.contentMat) continue;
        const style = cell.style;
        const key = `${url}|${style.w}x${style.h}|${style.crop}`;
        let tex = contentTexCache.get(key);
        if (!tex) {
          tex = makeTexture(drawContent(img, style));
          contentTexCache.set(key, tex);
        }
        cell.contentMat.map = tex;
        cell.contentMat.color.set("#ffffff");
        cell.contentMat.needsUpdate = true;
      }
    };
    const startLoading = () => {
      const urls = [...new Set(cells.map((c) => c.imgUrl).filter(Boolean))];
      urls.forEach((url) => {
        const img = new Image();
        img.onload = () => applyContent(url, img);
        img.src = url;
      });
      for (const cell of cells) {
        if (!cell.isVideo || !cell.project || !cell.contentMat) continue;
        const v = videoOf.get(cell.project.slug);
        if (!v) continue;
        cell.contentMat.map = v.tex;
        cell.contentMat.color.set("#ffffff");
        cell.contentMat.needsUpdate = true;
      }
    };
    // Bilder sofort laden; Labels nur dann NEU backen, wenn die Webfonts
    // beim Mount noch nicht da waren (Review M1: kein Blind-Doppel-Bake).
    startLoading();
    if (document.fonts && document.fonts.status !== "loaded") {
      document.fonts.ready.then(() => {
        if (disposed) return;
        fonts.ui = probeFont("--rr-font-ui", "sans-serif");
        bakeBg(); // rebakt auch bereits geladene Medium-Washes (washOf)
        cells.forEach((cell) => {
          cell.bgMat.map = bgTexOf.get(cell.bgKey)!;
          cell.tintMat.map = tintTexOf.get(cell.tintKey)!;
          cell.bgMat.needsUpdate = true;
          cell.tintMat.needsUpdate = true;
        });
      });
    }

    // ---- Pan-Zustand ----
    const offset = new THREE.Vector2(0, 0);
    const targetOffset = new THREE.Vector2(0, 0);
    const vel = new THREE.Vector2(0, 0);
    const drift = new THREE.Vector2(0, 0);
    const driftTarget = new THREE.Vector2(0, 0);
    let unitsPerPx = 1 / 400;
    let navigating = false;
    let navTimeout: number | undefined;

    const wrap = (v: number, extent: number) =>
      ((((v + extent / 2) % extent) + extent) % extent) - extent / 2;

    const cellScreenPos = (cell: Cell) =>
      new THREE.Vector2(
        wrap(cell.base.x + offset.x + drift.x, EXTENT_X),
        wrap(cell.base.y + offset.y + drift.y, EXTENT_Y)
      );

    // ---- Zoom-Phasen: Intro + Grab ----
    const introT0 = performance.now();
    const INTRO_ZOOM_MS = 700;
    const INTRO_CURVE_DELAY = 700;
    const INTRO_CURVE_MS = 1000;
    let grabT = 0;
    let grabbing = false;
    let aspectNow = 1.6;

    // ---- Pointer ----
    let hovered = -1;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let pointerUv: THREE.Vector2 | null = null;

    const currentDistortion = () => postMat.uniforms.uDistortion.value as number;

    const toSceneUv = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const u = (clientX - rect.left) / rect.width;
      const v = (clientY - rect.top) / rect.height;
      const mx = 2 * (u - 0.5);
      const my = 2 * (v - 0.5);
      const r2 = mx * mx + my * my;
      const f = DISTORTION_BASE + currentDistortion() * r2;
      return new THREE.Vector2(0.5 + 0.5 * mx * f, 0.5 + 0.5 * my * f);
    };

    const pickCell = (): number => {
      if (!pointerUv) return -1;
      // camera.zoom skaliert den sichtbaren Frustum (Intro-/Grab-Zoom):
      // ohne /zoom traefen Klicks waehrend des Intros die falsche Zelle
      // (CRITICAL-Finding Review c399f0c). Frustum ist symmetrisch um 0.
      // camera.top/bottom sind invertiert zur UV-y-Richtung; die
      // Vorzeichen heben sich mit der Shader-Formel exakt auf.
      const worldX = ((pointerUv.x - 0.5) * (camera.right - camera.left)) / camera.zoom;
      const worldY = ((pointerUv.y - 0.5) * (camera.bottom - camera.top)) / camera.zoom;
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
      // Drag-Schwelle 3px (Spec §5). `dragging` statt eigenem Flag: nach
      // pointercancel ist dragging false -> kein Ghost-Click (Review m3).
      const wasClick = dragging && moved <= 3;
      endDrag(e);
      if (navigating) return;
      if (wasClick) {
        pointerUv = toSceneUv(e.clientX, e.clientY);
        const i = pickCell();
        if (i >= 0) {
          const cell = cells[i];
          if (cell.info) {
            setInfoCard(cell.info);
            return;
          }
          if (!cell.project) return;
          navigating = true;
          setLeaving(true);
          const slug = cell.project.slug;
          navTimeout = window.setTimeout(() => {
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
      const visibleCols = Math.max(1.4, w / CELL_PX);
      let halfW = visibleCols / 2 / DISTORTION_BASE;
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
    let videoTick = 0;
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const damp = (k: number) => 1 - Math.exp(-k * dt);

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
      postMat.uniforms.uDistortion.value = DISTORTION_FACTOR * aspectNow * curveT;

      // Grab-Zoom (Spec §5): 1 -> 0.832 in 0.4s, zurueck in 0.4s.
      grabT = Math.min(1, Math.max(0, grabT + (grabbing ? (dt * 1000) / GRAB_MS : (-dt * 1000) / GRAB_MS)));
      const grabZoom = 1 + (GRAB_ZOOM - 1) * easeOutPow2(grabT);
      camera.zoom = zIntro * grabZoom;
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
        if (cell.contentMesh) cell.contentMesh.position.set(x, y, 0.01);
        const isHover = i === hovered;
        cell.bgMat.opacity += (appeared - cell.bgMat.opacity) * dAppear;
        cell.tintMat.opacity += ((isHover ? appeared : 0) - cell.tintMat.opacity) * dHover;
        // Unsichtbare Tint-Meshes nicht zeichnen (Review m1).
        cell.tintMesh.visible = cell.tintMat.opacity > 0.001;
        if (cell.contentMat) {
          cell.contentMat.opacity += (appeared - cell.contentMat.opacity) * dAppear;
        }
      }

      // Videos: nur nahe der Bildmitte spielen (Original-Verhalten).
      videoTick += dt;
      if (videoTick > 0.25) {
        videoTick = 0;
        const playRadius = Math.max(viewHalfH, 1.4);
        const shouldPlay = new Set<string>();
        for (const cell of cells) {
          if (!cell.isVideo || !cell.project) continue;
          // Gewrappte Position aus diesem Frame wiederverwenden (Review c3).
          const pos = cell.bgMesh.position;
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
      if (navTimeout) window.clearTimeout(navTimeout); // Review MAJOR-2
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
      fallbackTintOf.forEach((t) => t.dispose()); // dispose ist idempotent
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
        cell.contentMat?.dispose();
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

      {/* Info-Karte (Thomas 16.07.): DESIGN.md-Stil — Paper-Karte mit
          Layer-Schatten + rotem Innen-Balken, CTA = rr-btn-sweep--red. */}
      {infoCard && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={infoCard.title}
          onClick={() => setInfoCard(null)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--rr-gutter)",
            background: "rgba(11, 16, 23, 0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 520,
              width: "100%",
              background: "var(--rr-paper)",
              padding: "36px 36px 32px",
              boxShadow:
                "rgba(5, 8, 12, 0.45) 0 24px 80px, var(--rr-red) 0 -3px 0 inset",
            }}
          >
            <button
              type="button"
              autoFocus
              onClick={() => setInfoCard(null)}
              aria-label="Schliessen"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 38,
                height: 38,
                padding: 0,
                background: "var(--rr-surface)",
                color: "var(--rr-ink)",
                border: "1.5px solid var(--rr-line)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              &#215;
            </button>
            <p className="rr-eyebrow" style={{ color: "var(--rr-red)", marginBottom: 14 }}>
              {infoCard.cellTop}
            </p>
            <p className="rr-claim" style={{ marginBottom: 14 }}>
              {infoCard.title}
            </p>
            <p className="rr-body" style={{ color: "var(--rr-ink-soft)" }}>
              {infoCard.body}
            </p>
            {infoCard.cta && (
              <p style={{ marginTop: 26 }}>
                <Link className="rr-btn-sweep rr-btn-sweep--red" href={infoCard.cta.href}>
                  {infoCard.cta.label}
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Whiteout-Uebergang beim Klick auf eine Projekt-Zelle */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#f6f5f1",
          opacity: leaving ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.42s ease",
          zIndex: 7,
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
