"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SPHERE_PROJECTS, type SphereProject } from "@/lib/relaunch/projects";

// ============================================================
// SphereGallery — 1:1-Nachbau der phantom.land-Galerie
// (Thomas-Auftrag 15.07.2026, Architektur per Bundle-Analyse
// des Originals verifiziert):
//   - FLACHES Raster aus Einheitszellen (Kachel = 0.998 der
//     Zelle -> Haarlinien-Abstaende), NICHT eine echte Kugel.
//   - Unendliches Drag-Pannen in beide Achsen (Wrap modulo
//     Rasterausdehnung), Traegheit zeitbasiert gedaempft.
//   - Die Kruemmung entsteht als Post-Processing: Barrel-
//     Distortion (Basis 0.88 + Staerke*r^2) + Vignette ueber
//     dem fertigen Bild — Kacheln bleiben rechteckig.
//   - Labels klein im dunklen Zellrand (Name / Nr / Kategorie /
//     Pill), Hover blendet die weisse Karten-Variante weich ein.
//   - Klick: Whiteout + Info-Panel (Uebergangsloesung bis es
//     Projekt-Unterseiten gibt).
// Mobile bekommt ebenfalls WebGL (touchAction pan-y, DPR-Cap);
// Fallback-Grid nur ohne WebGL oder bei reduced-motion.
// ============================================================

// Szenengrund BEWUSST nachtschwarz statt --rr-dark (Thomas 15.07.: die
// Abstaende beim Original sind dunkler, dadurch leuchten die Kacheln) —
// gilt nur fuer die WebGL-Szene; DOM-Sektionen behalten das Token.
const BG_DARK = "#0c0d10";
// Fokus-Whiteout: bewusste WebGL-Ausnahme, KEIN Off-White-Token — absichtlich
// einen Hauch grauer als --rr-surface, damit weisse Hover-Karten noch tragen.
const BG_LIGHT = "#e9e8e5";

const GRID_COLS = 7; // 7 Projekte -> jede Spalte ein anderes Projekt
const GRID_ROWS = 7; // 49 Zellen, Projekt = (col + row) % 7 (diagonal versetzt)
const CELL_H = 1.0; // QUADRATISCHE Zellen wie beim Original
const CELL_PX = 200; // Zellgroesse in CSS-Pixeln, fix wie beim Original (~190-200px)
const TILE_FRACTION = 0.998; // Kachel fuellt 99.8% der Zelle (Haarlinien-Gap)
const FOCUS_MS = 700;

// Distortion-Basis wie beim Original: Faktor = 0.88 + k * r^2.
const DISTORTION_BASE = 0.88;
const DISTORTION_K = 0.11; // Grundkruemmung (visuell gegen Original abgeglichen)
const OVERSCAN = 1.12; // Szene groesser rendern, damit der Shader nie ins Leere sampelt

function makeCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const xEst = sampleX(t) - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= xEst / d;
    }
    return t;
  };
  return (x: number) => sampleY(solveX(Math.min(1, Math.max(0, x))));
}
const EASE = makeCubicBezier(0.6, 0, 0.4, 1);

// ---- Zell-Textur ---------------------------------------------
// Canvas 1024x1024 (quadratische Zelle wie Original): Haarlinien-Rand,
// Bild schwebt mittig mit viel dunklem Raum (~70% Zellbreite), kleine
// Labels an den Zellkanten oben/unten.
const TEX_W = 1024;
const TEX_H = 1024;
const IMG_W = 720; // ~70% der Zelle
const IMG_H = 465; // 960x620-Screenshots im Seitenverhaeltnis
const IMG_X = (TEX_W - IMG_W) / 2;
const IMG_Y = (TEX_H - IMG_H) / 2 - 16; // minimal ueber Mitte (Original-Anmutung)

type Fonts = { ui: string; display: string };

function drawCell(
  p: SphereProject,
  num: string,
  img: HTMLImageElement | null,
  fonts: Fonts,
  hover: boolean
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = hover ? "#f4f4f2" : BG_DARK;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Haarlinien an den Zellkanten (ergibt im Raster durchlaufende Linien).
  if (!hover) {
    ctx.strokeStyle = "rgba(246,245,241,0.14)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, TEX_W - 2, TEX_H - 2);
  }

  // Screenshot hell und randlos in die Bildzone (cover-crop von oben links).
  if (img && img.naturalWidth > 0) {
    const targetRatio = IMG_W / IMG_H;
    const srcRatio = img.naturalWidth / img.naturalHeight;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;
    if (srcRatio > targetRatio) sw = sh * targetRatio;
    else sh = sw / targetRatio;
    ctx.drawImage(img, 0, 0, sw, sh, IMG_X, IMG_Y, IMG_W, IMG_H);
  } else {
    ctx.fillStyle = hover ? "#e4e4e0" : "#1d1f26";
    ctx.fillRect(IMG_X, IMG_Y, IMG_W, IMG_H);
  }

  const inkMain = hover ? "#23262e" : "#f6f5f1";
  const inkSoft = hover ? "#5a5e68" : "#9a9da6";
  ctx.textBaseline = "alphabetic";
  try {
    // Original nutzt weit gesperrte Mono-Labels; letterSpacing kann fehlen.
    (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "3px";
  } catch {
    /* noop */
  }

  // Oben links: Projektname. Oben rechts: laufende Nummer.
  ctx.fillStyle = inkMain;
  // Label-Groessen: Zelle rendert mit ~200 CSS-px -> Faktor ~0.2; 38px in der
  // Textur entsprechen also ~7.5px am Schirm (Mini-Labels wie im Original).
  const pad = 34;
  ctx.font = `600 38px ${fonts.ui}`;
  ctx.fillText(p.name.toUpperCase(), pad, 64);
  ctx.fillStyle = inkSoft;
  ctx.font = `500 36px ${fonts.ui}`;
  ctx.fillText(num, TEX_W - pad - ctx.measureText(num).width, 64);

  // Unten links: Kategorie. Unten rechts: WEBSITE-Pill (rund wie Original —
  // bewusste 1:1-Ausnahme vom Eckig-Gesetz, lebt nur in der WebGL-Szene).
  const rowBase = TEX_H - 44;
  ctx.fillStyle = inkSoft;
  ctx.font = `500 34px ${fonts.ui}`;
  ctx.fillText(p.cat.toUpperCase(), pad, rowBase);
  const pill = "WEBSITE";
  ctx.font = `500 32px ${fonts.ui}`;
  const pw = ctx.measureText(pill).width + 48;
  const px = TEX_W - pad - pw;
  const py = TEX_H - 96;
  ctx.strokeStyle = hover ? "#c9cbd1" : "#3a3d46";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, 64, 32);
  ctx.stroke();
  ctx.fillStyle = inkSoft;
  ctx.fillText(pill, px + 24, py + 44);

  return c;
}

// Fragment-Shader des Nachbearbeitungs-Passes: Standard-Barrel-Distortion
// (eigene Implementierung der bekannten Formel) + Vignette.
const POST_FRAG = `
uniform sampler2D tScene;
uniform vec2 uK;
uniform float uVigOffset;
uniform float uVigDark;
varying vec2 vUv;
void main() {
  vec2 m = 2.0 * (vUv - 0.5);
  float r2 = dot(m, m);
  vec2 factor = vec2(${DISTORTION_BASE}) + uK * r2;
  // Durch OVERSCAN teilen: die Szene ist groesser gerendert, das Sampling
  // bleibt so garantiert innerhalb der Textur (keine Rand-Schmierer).
  vec2 uv = 0.5 + 0.5 * m * factor / ${OVERSCAN};
  vec4 col = texture2D(tScene, uv);
  float vig = smoothstep(0.0, uVigOffset, 1.0 - length(m) * uVigDark * 0.5);
  gl_FragColor = vec4(col.rgb * mix(1.0, vig, 0.85), 1.0);
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
  base: THREE.Vector2; // Rasterposition (Zellenmitte, Welt-Einheiten)
  project: SphereProject;
  imgUrl: string; // gewaehlte Bild-Variante (img oder img2)
  num: string;
  mesh: THREE.Mesh; // dunkle Normal-Variante
  hoverMesh: THREE.Mesh; // weisse Hover-Variante (Opacity-Fade)
  mat: THREE.MeshBasicMaterial;
  hoverMat: THREE.MeshBasicMaterial;
};

type Focused = { project: SphereProject } | null;

export default function SphereGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "canvas" | "fallback">("pending");
  const [selected, setSelected] = useState<Focused>(null);
  const focusApi = useRef<{ unfocus: () => void } | null>(null);

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
    const fonts: Fonts = {
      ui: probeFont("--rr-font-ui", "sans-serif"),
      display: probeFont("--font-dmsans", "sans-serif"),
    };

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
    const bgColor = new THREE.Color(BG_DARK);
    gridScene.background = bgColor;
    const bgTarget = new THREE.Color(BG_DARK);

    // Orthografische Kamera: 1 Welt-Einheit = 1 Zellbreite; Overscan fuer den Shader.
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
        uK: { value: new THREE.Vector2(DISTORTION_K, DISTORTION_K) },
        uVigOffset: { value: 0.6 },
        uVigDark: { value: 0.6 },
      },
      vertexShader: POST_VERT,
      fragmentShader: POST_FRAG,
      depthTest: false,
      depthWrite: false,
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat);
    postScene.add(postQuad);

    // ---- Zellen ----
    const EXTENT_X = GRID_COLS; // Wrap-Ausdehnung
    const EXTENT_Y = GRID_ROWS * CELL_H;
    const tileGeo = new THREE.PlaneGeometry(TILE_FRACTION, TILE_FRACTION * CELL_H);
    const cells: Cell[] = [];
    const normalTex: THREE.CanvasTexture[] = [];
    const hoverTex: THREE.CanvasTexture[] = [];

    const makeTexture = (canvas: HTMLCanvasElement) => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      return tex;
    };

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const i = cells.length;
        const project = SPHERE_PROJECTS[(col + row) % SPHERE_PROJECTS.length];
        const num = String(((col + row) % SPHERE_PROJECTS.length) + 1).padStart(2, "0");
        const base = new THREE.Vector2(
          (col - (GRID_COLS - 1) / 2) * 1,
          (row - (GRID_ROWS - 1) / 2) * CELL_H
        );
        const nt = makeTexture(drawCell(project, num, null, fonts, false));
        const ht = makeTexture(drawCell(project, num, null, fonts, true));
        normalTex[i] = nt;
        hoverTex[i] = ht;
        const mat = new THREE.MeshBasicMaterial({
          map: nt,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const hoverMat = new THREE.MeshBasicMaterial({
          map: ht,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(tileGeo, mat);
        const hoverMesh = new THREE.Mesh(tileGeo, hoverMat);
        hoverMesh.position.z = 0.01;
        gridScene.add(mesh);
        gridScene.add(hoverMesh);
        // Ungerade Reihen zeigen die zweite Ansicht des Projekts (mehr Vielfalt).
        const imgUrl = row % 2 === 1 && project.img2 ? project.img2 : project.img;
        cells.push({ base, project, imgUrl, num, mesh, hoverMesh, mat, hoverMat });
      }
    }

    // Screenshots laden und beide Texturvarianten der betroffenen Zellen backen.
    let disposed = false;
    const rebuild = (imgUrl: string, img: HTMLImageElement) => {
      if (disposed) return;
      cells.forEach((cell, i) => {
        if (cell.imgUrl !== imgUrl) return;
        const nt = makeTexture(drawCell(cell.project, cell.num, img, fonts, false));
        const ht = makeTexture(drawCell(cell.project, cell.num, img, fonts, true));
        normalTex[i].dispose();
        hoverTex[i].dispose();
        normalTex[i] = nt;
        hoverTex[i] = ht;
        cell.mat.map = nt;
        cell.hoverMat.map = ht;
        cell.mat.needsUpdate = true;
        cell.hoverMat.needsUpdate = true;
      });
    };
    const startLoading = () => {
      const urls = [...new Set(cells.map((cell) => cell.imgUrl))];
      urls.forEach((url) => {
        const img = new Image();
        img.onload = () => rebuild(url, img);
        img.src = url;
      });
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        fonts.ui = probeFont("--rr-font-ui", "sans-serif");
        fonts.display = probeFont("--font-dmsans", "sans-serif");
        startLoading();
      });
    } else {
      startLoading();
    }

    // ---- Pan-Zustand (unendliches Wrap in beide Achsen) ----
    const offset = new THREE.Vector2(0.55, 0.4); // Intro faehrt auf (0,0)
    const targetOffset = new THREE.Vector2(0, 0);
    const vel = new THREE.Vector2(0, 0);
    let unitsPerPx = 1 / 400; // im resize() gesetzt
    let viewHalfH = 1; // sichtbare halbe Hoehe in Welt-Einheiten (resize)
    const introT0 = performance.now();
    let introDone = false;

    const wrap = (v: number, extent: number) =>
      ((((v + extent / 2) % extent) + extent) % extent) - extent / 2;

    // ---- Fokus (Whiteout + Panel) ----
    let focusState: "none" | "in" | "out" = "none";
    let focusStart = 0;
    let focusedIndex = -1;
    let zoom = 1;
    let zoomFrom = 1;
    let zoomTo = 1;
    const focusOffsetFrom = new THREE.Vector2();
    const focusOffsetTo = new THREE.Vector2();
    const preFocusOffset = new THREE.Vector2(); // Pan-Zustand vor dem Klick

    const cellScreenPos = (cell: Cell) =>
      new THREE.Vector2(wrap(cell.base.x + offset.x, EXTENT_X), wrap(cell.base.y + offset.y, EXTENT_Y));

    const focus = (i: number) => {
      focusedIndex = i;
      focusState = "in";
      focusStart = performance.now();
      const pos = cellScreenPos(cells[i]);
      // Offset so verschieben, dass die Kachel leicht oberhalb der Mitte sitzt
      // (Panel unten verdeckt sie nicht); Zoom leicht rein.
      preFocusOffset.copy(offset);
      focusOffsetFrom.copy(offset);
      zoomFrom = zoom;
      zoomTo = small ? 1.9 : 2.3;
      // Kachel sitzt nach dem Zoom im oberen Drittel (Panel unten bleibt frei).
      focusOffsetTo.set(
        offset.x - pos.x,
        offset.y - pos.y + 0.42 * (viewHalfH / zoomTo)
      );
      bgTarget.set(BG_LIGHT);
      cells.forEach((cell, j) => {
        cell.mesh.userData.dim = j === i ? 1 : 0.25;
      });
    };
    const unfocus = () => {
      if (focusedIndex < 0) return;
      focusState = "out";
      focusStart = performance.now();
      focusOffsetFrom.copy(offset);
      focusOffsetTo.copy(preFocusOffset); // Explorations-Zustand wiederherstellen
      zoomFrom = zoom;
      zoomTo = 1;
      bgTarget.set(BG_DARK);
      cells.forEach((cell) => {
        cell.mesh.userData.dim = 1;
      });
    };
    focusApi.current = { unfocus };

    // ---- Pointer: Drag-Pan, analytisches Hover/Klick-Picking ----
    // Der Distortion-Shader mappt Ausgabe-UV -> Quell-UV mit derselben Formel;
    // fuer Picking wenden wir sie auf die Zeigerposition an und rechnen dann
    // orthografisch in Weltkoordinaten um (kein Raycaster noetig).
    let hovered = -1;
    let dragging = false;
    let downOnCanvas = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let pointerUv: THREE.Vector2 | null = null;

    const toSceneUv = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const u = (clientX - rect.left) / rect.width;
      const v = (clientY - rect.top) / rect.height;
      const mx = 2 * (u - 0.5);
      const my = 2 * (v - 0.5);
      const r2 = mx * mx + my * my;
      const k = postMat.uniforms.uK.value as THREE.Vector2;
      return new THREE.Vector2(
        0.5 + (0.5 * mx * (DISTORTION_BASE + k.x * r2)) / OVERSCAN,
        0.5 + (0.5 * my * (DISTORTION_BASE + k.y * r2)) / OVERSCAN
      );
    };

    const pickCell = (): number => {
      if (!pointerUv) return -1;
      const worldX = camera.left + pointerUv.x * (camera.right - camera.left);
      const worldY = camera.top + pointerUv.y * (camera.bottom - camera.top);
      for (let i = 0; i < cells.length; i++) {
        const pos = cellScreenPos(cells[i]);
        if (
          Math.abs(worldX - pos.x) <= (TILE_FRACTION / 2) &&
          Math.abs(worldY - pos.y) <= (TILE_FRACTION * CELL_H) / 2
        ) {
          return i;
        }
      }
      return -1;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (focusState !== "none" || focusedIndex >= 0) return;
      introDone = true;
      dragging = true;
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
      const wasClick = downOnCanvas && moved <= 8;
      downOnCanvas = false;
      endDrag(e);
      if (focusedIndex >= 0) return;
      if (wasClick) {
        pointerUv = toSceneUv(e.clientX, e.clientY);
        const i = pickCell();
        if (i >= 0) {
          hovered = -1;
          focus(i);
          setSelected({ project: cells[i].project });
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    // ---- Resize ----
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      rt.setSize(Math.round(w * dpr), Math.round(h * dpr));
      // Zellgroesse fix in CSS-Pixeln (wie Original) -> sichtbare Spaltenzahl
      // ergibt sich aus der Fensterbreite. Sichtbare Hoehe darf die Raster-
      // Ausdehnung nie ueberschreiten (sonst nackte Baender): auf extremen
      // Hochformaten zoomen wir rein statt Luecken zu zeigen.
      const visibleCols = Math.max(1.6, w / CELL_PX);
      // OVERSCAN/BASE kompensiert die Zoom-Wirkung des Shaders, damit eine
      // Zelle in Bildschirmmitte tatsaechlich ~CELL_PX breit erscheint.
      let halfW = (visibleCols / 2) * (OVERSCAN / DISTORTION_BASE);
      const maxHalfH = (GRID_ROWS * CELL_H) * 0.475;
      if (halfW * (h / w) > maxHalfH) halfW = maxHalfH / (h / w);
      const halfH = halfW * (h / w);
      viewHalfH = halfH;
      camera.left = -halfW;
      camera.right = halfW;
      camera.top = halfH;
      camera.bottom = -halfH;
      camera.updateProjectionMatrix();
      unitsPerPx = ((2 * halfW) / w) * (DISTORTION_BASE / OVERSCAN);
      // Distortion aspektkorrigiert (breite Screens kruemmen horizontal staerker).
      const k = postMat.uniforms.uK.value as THREE.Vector2;
      k.set(DISTORTION_K, DISTORTION_K * (w / h) * 0.75);
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
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    // ---- Render-Loop (alle Daempfungen zeitbasiert, L-referenzen-03) ----
    let raf = 0;
    let last = performance.now();
    const appearT0 = performance.now();
    const loop = () => {
      raf = 0;
      if (!visible) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const damp = (k: number) => 1 - Math.exp(-k * dt);

      if (focusState !== "none") {
        const t = Math.min(1, (now - focusStart) / FOCUS_MS);
        const e = EASE(t);
        offset.lerpVectors(focusOffsetFrom, focusOffsetTo, e);
        targetOffset.copy(offset);
        zoom = zoomFrom + (zoomTo - zoomFrom) * e;
        if (t >= 1) {
          if (focusState === "out") focusedIndex = -1;
          focusState = "none";
        }
      } else if (focusedIndex < 0) {
        // Intro: sanft auf (0,0) fahren.
        if (!introDone) {
          const t = Math.min(1, (now - introT0) / 1600);
          offset.set(0.55 * (1 - EASE(t)), 0.4 * (1 - EASE(t)));
          targetOffset.copy(offset);
          if (t >= 1) introDone = true;
        } else {
          if (!dragging) {
            targetOffset.x += vel.x * 60 * dt;
            targetOffset.y += vel.y * 60 * dt;
            const decay = Math.exp(-4.2 * dt);
            vel.multiplyScalar(decay);
            if (vel.lengthSq() < 1e-10) vel.set(0, 0);
          }
          const d = damp(5.5);
          offset.x += (targetOffset.x - offset.x) * d;
          offset.y += (targetOffset.y - offset.y) * d;
        }

        // Hover nur ausserhalb von Drag/Fokus.
        if (!dragging) {
          const hi = pickCell();
          if (hi !== hovered) {
            hovered = hi;
            renderer.domElement.style.cursor = hi >= 0 ? "pointer" : "grab";
          }
        }
      }

      camera.zoom = zoom;
      camera.updateProjectionMatrix();
      bgColor.lerp(bgTarget, damp(5));

      // Zellen positionieren (Wrap) + Intro-Fade + Hover-/Dim-Faden.
      const dOp = damp(9);
      const appeared = Math.min(1, (now - appearT0) / 900);
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = wrap(cell.base.x + offset.x, EXTENT_X);
        const y = wrap(cell.base.y + offset.y, EXTENT_Y);
        cell.mesh.position.set(x, y, 0);
        cell.hoverMesh.position.set(x, y, 0.01);
        const dim = (cell.mesh.userData.dim as number | undefined) ?? 1;
        const isHover = i === hovered && focusedIndex < 0 && focusState === "none";
        const baseOp = appeared * dim;
        cell.mat.opacity += (baseOp - cell.mat.opacity) * dOp;
        cell.hoverMat.opacity += ((isHover ? appeared : 0) - cell.hoverMat.opacity) * dOp;
      }

      // Distortion + Zoom atmen leicht mit der Pan-Geschwindigkeit (wie
      // Original: beim Ziehen zoomt die Ansicht etwas raus, mehr Zellen sichtbar).
      const speed = Math.min(0.4, vel.length() * 60);
      const k = postMat.uniforms.uK.value as THREE.Vector2;
      const kBase = DISTORTION_K + speed * 0.18;
      k.x += (kBase - k.x) * damp(6);
      if (focusState === "none" && focusedIndex < 0) {
        const restZoom = 1 - Math.min(0.1, speed * 0.3);
        zoom += (restZoom - zoom) * damp(4);
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
      focusApi.current = null;
      tileGeo.dispose();
      postQuad.geometry.dispose();
      postMat.dispose();
      rt.dispose();
      normalTex.forEach((t) => t.dispose());
      hoverTex.forEach((t) => t.dispose());
      cells.forEach((cell) => {
        cell.mat.dispose();
        cell.hoverMat.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  const closeOverlay = () => {
    focusApi.current?.unfocus();
    setSelected(null);
  };

  // Escape schliesst das Projekt-Panel (a11y).
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {mode === "fallback" ? (
        <FallbackGrid />
      ) : (
        <div
          ref={containerRef}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, overflow: "hidden", background: BG_DARK }}
        />
      )}

      {mode === "canvas" && !selected && (
        <div
          style={{
            position: "absolute",
            left: "var(--rr-gutter)",
            bottom: 24,
            pointerEvents: "none",
          }}
        >
          <p className="rr-meta" style={{ color: "#c7c9cf" }}>
            Ziehen zum Umschauen · Kachel antippen fuer Details
          </p>
        </div>
      )}

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Referenz ${selected.project.name}`}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "var(--rr-gutter)",
            paddingBottom: 48,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 460,
              width: "100%",
              background: "var(--rr-paper)",
              borderRadius: 0,
              padding: "32px 32px 28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.30), #f12032 0 -3px 0 inset",
              pointerEvents: "auto",
            }}
          >
            <button
              type="button"
              autoFocus
              onClick={closeOverlay}
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
                borderRadius: 0,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              &#215;
            </button>
            <p className="rr-eyebrow" style={{ marginBottom: 12 }}>
              {selected.project.cat}
            </p>
            <p className="rr-claim" style={{ marginBottom: 10 }}>
              {selected.project.name}
            </p>
            <p className="rr-body" style={{ color: "var(--rr-ink-soft)", marginBottom: 22 }}>
              Live gebaut von Red Rabbit — schau es dir direkt an.
            </p>
            <a
              className="rr-link"
              href={selected.project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website ansehen
            </a>
          </div>
        </div>
      )}
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
        background: "var(--rr-dark)",
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
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#f6f5f1" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt={`Website ${p.name}`}
              style={{ display: "block", width: "100%", aspectRatio: "960/620", objectFit: "cover" }}
            />
            <span
              style={{
                display: "block",
                marginTop: 10,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
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
