"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TILES, TILE_COLORS, type Tile } from "@/lib/relaunch/projects";

// ============================================================
// SphereGallery (P2b) — Betrachter im Inneren einer Kugel aus
// Referenz-Kacheln, left-click-drag zum Umschauen (Lenis-Gefuehl).
// Vanilla three.js (kein react-three-fiber, kleineres Bundle).
// Fallback: kein WebGL / reduced-motion / < 768px -> 2D-Grid.
// ============================================================

const SPHERE_RADIUS = 14;
const TILE_W = 4.4;
const TILE_H = 5.4;
const DAMPING = 0.06; // Nachlauf-Daempfung (Lenis-Gefuehl)
const HOVER_SCALE = 1.06;
const FOCUS_MS = 700; // Kamera-Zoom-Dauer

// Master-Easing cubic-bezier(.6,0,.4,1) fuer diskrete Uebergaenge.
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

// Fibonacci-Sphere: N Punkte gleichmaessig verteilt.
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return pts;
}

// Kachel-Textur per Canvas (Projektname in Instrument Sans auf Flaechenfarbe).
function drawTileTexture(tile: Tile, fontFamily: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  const W = 512;
  const H = 640;
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const col = TILE_COLORS[tile.colorIndex];

  ctx.fillStyle = col.bg;
  ctx.fillRect(0, 0, W, H);

  // duenner Rahmen in Akzentfarbe
  ctx.strokeStyle = col.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  const pad = 52;

  // Eyebrow
  ctx.fillStyle = col.accent;
  ctx.font = `600 22px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("R E F E R E N Z", pad, 96);

  // Projektname (mit einfachem Word-Wrap)
  ctx.fillStyle = col.text;
  const nameSize = 58;
  ctx.font = `700 ${nameSize}px ${fontFamily}`;
  const words = tile.name.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > W - pad * 2 && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  let y = H / 2 - ((lines.length - 1) * nameSize * 1.06) / 2 + nameSize / 3;
  for (const l of lines) {
    ctx.fillText(l, pad, y);
    y += nameSize * 1.06;
  }

  // Einzeiler unten
  ctx.fillStyle = col.text;
  ctx.globalAlpha = 0.72;
  ctx.font = `500 26px ${fontFamily}`;
  ctx.fillText(tile.line, pad, H - pad);
  ctx.globalAlpha = 1;

  return c;
}

type Focused = { tile: Tile } | null;

export default function SphereGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  // "pending" bis Faehigkeit geklaert (SSR-sicher), dann canvas | fallback.
  const [mode, setMode] = useState<"pending" | "canvas" | "fallback">("pending");
  const [selected, setSelected] = useState<Focused>(null);

  // Ref auf die three-Steuerung, damit der Close-Button entfokussieren kann.
  const focusApi = useRef<{ focus: (i: number) => void; unfocus: () => void } | null>(null);

  // Faehigkeit pruefen (nur Client).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let webgl = false;
    try {
      const test = document.createElement("canvas");
      webgl = !!(test.getContext("webgl2") || test.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setMode(!webgl || reduce || small ? "fallback" : "canvas");
  }, []);

  useEffect(() => {
    if (mode !== "canvas") return;
    const container = containerRef.current;
    if (!container) return;

    // Aufgeloeste UI-Schrift (Instrument Sans) fuer die Canvas-Texturen ermitteln.
    const probe = document.createElement("span");
    probe.style.fontFamily = "var(--rr-font-ui)";
    container.appendChild(probe);
    const fontFamily = getComputedStyle(probe).fontFamily || "sans-serif";
    container.removeChild(probe);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d0e12");

    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 100);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    // ---- Kacheln erzeugen ----
    const positions = fibonacciSphere(TILES.length, SPHERE_RADIUS);
    const geo = new THREE.PlaneGeometry(TILE_W, TILE_H);
    const meshes: THREE.Mesh[] = [];
    const textures: THREE.Texture[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    const targetScale: number[] = [];

    let fontReady = false;
    const buildTextures = () => {
      TILES.forEach((tile, i) => {
        const tex = new THREE.CanvasTexture(drawTileTexture(tile, fontFamily));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
        const mat = materials[i];
        if (mat.map) mat.map.dispose();
        mat.map = tex;
        mat.needsUpdate = true;
        textures[i] = tex;
      });
    };

    TILES.forEach((tile, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const tex = new THREE.CanvasTexture(drawTileTexture(tile, "sans-serif"));
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      textures[i] = tex;
      materials[i] = mat;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(positions[i]);
      mesh.lookAt(0, 0, 0); // +Z -> zur Kugel-Mitte (Kachel schaut zur Kamera)
      mesh.userData.index = i;
      mesh.userData.baseScale = 1;
      scene.add(mesh);
      meshes.push(mesh);
      targetScale[i] = 1;
    });

    // Sobald die echte Schrift geladen ist, Texturen scharf neu zeichnen.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fontReady = true;
        buildTextures();
      });
    }

    // ---- Blickrichtung (Yaw/Pitch) mit Traegheit ----
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let velYaw = 0;
    let velPitch = 0;
    const PITCH_LIMIT = 1.15;

    // ---- Fokus-Tween (Kamera-Zoom auf Kachel) ----
    let focusState: "none" | "in" | "out" = "none";
    let focusStart = 0;
    const camFrom = new THREE.Vector3();
    const camTo = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();
    let focusedIndex = -1;

    const applyLook = () => {
      const dir = new THREE.Vector3(
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch),
        Math.cos(pitch) * Math.cos(yaw)
      );
      camera.lookAt(dir.add(camera.position));
    };

    const focus = (i: number) => {
      focusedIndex = i;
      focusState = "in";
      focusStart = performance.now();
      camFrom.copy(camera.position);
      camTo.copy(positions[i]).multiplyScalar(0.5); // bis ~halbe Distanz heran
      lookTarget.copy(positions[i]);
    };
    const unfocus = () => {
      if (focusedIndex < 0) return;
      focusState = "out";
      focusStart = performance.now();
      camFrom.copy(camera.position);
      camTo.set(0, 0, 0);
      lookTarget.copy(positions[focusedIndex]);
    };
    focusApi.current = { focus, unfocus };

    // ---- Pointer-Interaktion ----
    const ndc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let hovered = -1;

    const setNdc = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (focusState !== "none" || focusedIndex >= 0) return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      setNdc(e);
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        moved += Math.abs(dx) + Math.abs(dy);
        const k = 0.0032;
        velYaw = -dx * k;
        velPitch = -dy * k;
        targetYaw += velYaw;
        targetPitch += velPitch;
        targetPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, targetPitch));
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
      renderer.domElement.style.cursor = "grab";
    };
    const onPointerUp = (e: PointerEvent) => {
      const wasDrag = moved > 8;
      endDrag(e);
      if (focusedIndex >= 0) return;
      if (!wasDrag) {
        // Klick -> Kachel treffen?
        setNdc(e);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        if (hit) {
          const i = (hit.object as THREE.Mesh).userData.index as number;
          focus(i);
          setSelected({ tile: TILES[i] });
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
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ---- Sichtbarkeit: RAF pausieren wenn nicht im Viewport ----
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && raf === 0) loop();
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    // ---- Render-Loop ----
    let raf = 0;
    const loop = () => {
      raf = 0;
      if (!visible) return; // pausiert bis IntersectionObserver reaktiviert

      if (focusState !== "none") {
        const t = Math.min(1, (performance.now() - focusStart) / FOCUS_MS);
        const e = EASE(t);
        camera.position.lerpVectors(camFrom, camTo, e);
        camera.lookAt(lookTarget);
        if (t >= 1) {
          if (focusState === "out") {
            // Freies Umschauen fortsetzen, ausgerichtet auf die Kachel (kein Sprung).
            const d = positions[focusedIndex].clone().normalize();
            yaw = targetYaw = Math.atan2(d.x, d.z);
            pitch = targetPitch = Math.asin(Math.max(-1, Math.min(1, d.y)));
            focusedIndex = -1;
            camera.position.set(0, 0, 0);
          }
          focusState = "none";
        }
      } else if (focusedIndex < 0) {
        // Traegheit: Ziel laeuft mit abklingender Geschwindigkeit weiter.
        if (!dragging) {
          targetYaw += velYaw;
          targetPitch += velPitch;
          targetPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, targetPitch));
          velYaw *= 0.92;
          velPitch *= 0.92;
          if (Math.abs(velYaw) < 1e-5) velYaw = 0;
          if (Math.abs(velPitch) < 1e-5) velPitch = 0;
        }
        // Sanftes Nachlaufen (Lenis-Gefuehl).
        yaw += (targetYaw - yaw) * DAMPING;
        pitch += (targetPitch - pitch) * DAMPING;
        applyLook();

        // Hover (nur ohne aktives Drag).
        if (!dragging) {
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObjects(meshes, false)[0];
          const hi = hit ? ((hit.object as THREE.Mesh).userData.index as number) : -1;
          if (hi !== hovered) {
            hovered = hi;
            renderer.domElement.style.cursor = hi >= 0 ? "pointer" : "grab";
          }
        }
      }

      // Hover-Scale weich interpolieren.
      for (let i = 0; i < meshes.length; i++) {
        targetScale[i] = i === hovered && focusedIndex < 0 ? HOVER_SCALE : 1;
        const s = meshes[i].scale.x + (targetScale[i] - meshes[i].scale.x) * 0.15;
        meshes[i].scale.setScalar(s);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // ---- Cleanup ----
    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", endDrag);
      focusApi.current = null;
      geo.dispose();
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      void fontReady;
    };
  }, [mode]);

  const closeOverlay = () => {
    focusApi.current?.unfocus();
    setSelected(null);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {mode === "fallback" ? (
        <FallbackGrid />
      ) : (
        <div
          ref={containerRef}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0d0e12" }}
        />
      )}

      {mode === "canvas" && (
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
          aria-label={`Referenz ${selected.tile.name}`}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--rr-gutter)",
            background: "rgba(13,14,18,0.55)",
            backdropFilter: "blur(2px)",
          }}
          onClick={closeOverlay}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 440,
              width: "100%",
              background: "var(--rr-paper)",
              borderRadius: "var(--rr-radius-lg)",
              padding: "40px 36px 36px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            }}
          >
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Schliessen"
              className="rr-btn"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                padding: 0,
                justifyContent: "center",
                background: "var(--rr-surface)",
                color: "var(--rr-ink)",
                border: "1.5px solid var(--rr-line)",
              }}
            >
              &#215;
            </button>
            <p className="rr-eyebrow" style={{ marginBottom: 16 }}>
              Referenz
            </p>
            <p className="rr-claim" style={{ marginBottom: 12 }}>
              {selected.tile.name}
            </p>
            <p className="rr-body-lg" style={{ color: "var(--rr-ink-soft)", marginBottom: 28 }}>
              {selected.tile.line}
            </p>
            {selected.tile.href ? (
              <a
                className="rr-link"
                href={selected.tile.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Zur Website
              </a>
            ) : (
              <p className="rr-meta">Website-Link folgt</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 2D-Grid-Fallback (kein WebGL / reduced-motion / < 768px) mit rr-Tokens.
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
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 16,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {TILES.map((tile, i) => {
          const col = TILE_COLORS[tile.colorIndex];
          const inner = (
            <div
              style={{
                background: col.bg,
                color: col.text,
                border: `2px solid ${col.accent}`,
                borderRadius: "var(--rr-radius)",
                padding: "18px 16px",
                minHeight: 132,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 650,
                  letterSpacing: "0.16em",
                  color: col.accent,
                }}
              >
                REFERENZ
              </span>
              <span style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, marginTop: 12 }}>
                {tile.name}
              </span>
              <span style={{ fontSize: 13, opacity: 0.72, marginTop: 8 }}>{tile.line}</span>
            </div>
          );
          return tile.href ? (
            <a
              key={i}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              {inner}
            </a>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
