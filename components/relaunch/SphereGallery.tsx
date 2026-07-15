"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SPHERE_PROJECTS, type SphereProject } from "@/lib/relaunch/projects";

// ============================================================
// SphereGallery — Betrachter im Inneren einer Kugel aus echten
// Projekt-Screenshots (phantom.land-Look, Umbau 15.07.2026).
// Drei Breitengrad-Ringe mit festen Spalten (gerade Spalten in
// der Mitte, kruemmen zum Rand weg), Drag mit Traegheit, Hover
// legt eine weisse Meta-Karte hinter die Kachel, Klick zoomt
// heran und hellt die Szene auf (Projekt-Panel).
// Vanilla three.js (kein react-three-fiber, kleineres Bundle).
// Mobile bekommt ebenfalls WebGL (weniger Kacheln, DPR-Cap);
// Fallback nur ohne WebGL oder bei reduced-motion.
// ============================================================

const SPHERE_RADIUS = 14;
const FOCUS_MS = 700; // Kamera-Zoom-Dauer
const PITCH_LIMIT = 0.62; // Ringe enden bei ~0.46 rad — nie ins Leere kippen
// Szenengrund == Design-Token --rr-dark (#17181d). Als Literal, weil die
// Kachel-Texturen (Canvas 2D) denselben Wert brauchen, bevor CSS verfuegbar
// ist — bei Token-Aenderung hier mitziehen.
const BG_DARK = "#17181d";
// Fokus-Whiteout: bewusste WebGL-Ausnahme, KEIN Off-White-Token — absichtlich
// einen Hauch grauer als --rr-surface, damit weisse Hover-Karten noch tragen.
const BG_LIGHT = "#e9e8e5";
const IDLE_YAW = 0.0011; // sanfte Eigendrehung bis zur ersten Interaktion

// Kachel-Layout: 16:10-Screenshots + Label-Zeilen oben/unten.
const TILE_W = 6.0;
const TILE_H = 4.6; // inkl. Label-Zonen in der Textur

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

// Ring-Layout: Reihen auf festen Breitengraden, Spalten gleichmaessig
// um 360 Grad, ungerade Reihen um eine halbe Spalte versetzt.
type TileSlot = { position: THREE.Vector3; project: SphereProject; index: number };

function ringLayout(cols: number, projects: SphereProject[]): TileSlot[] {
  const rows = [-0.38, 0, 0.38]; // Breitengrade (rad) — dicht wie beim Original
  const slots: TileSlot[] = [];
  let n = 0;
  rows.forEach((phi, r) => {
    const y = SPHERE_RADIUS * Math.sin(phi);
    const ringR = SPHERE_RADIUS * Math.cos(phi);
    const offset = r % 2 === 1 ? 0 : Math.PI / cols; // Versatz halbe Spalte
    for (let c = 0; c < cols; c++) {
      const theta = (c / cols) * Math.PI * 2 + offset;
      slots.push({
        position: new THREE.Vector3(Math.sin(theta) * ringR, y, Math.cos(theta) * ringR),
        project: projects[n % projects.length],
        index: n,
      });
      n++;
    }
  });
  return slots;
}

// ---- Kachel-Texturen ----------------------------------------
// Canvas 768x564: Label-Zeile oben (Name links, Nr. rechts),
// Screenshot-Flaeche 768x440 (cover-crop), Chips-Zeile unten.
// Normal: Labels hell auf Szenen-Dunkel (schweben im Raum).
// Hover: weisse Karte hinter allem, Labels in Ink.
const TEX_W = 768;
const TEX_H = 564;
const IMG_Y = 56;
const IMG_H = 440;

type Fonts = { ui: string; display: string };

function drawTile(
  p: SphereProject,
  index: number,
  img: HTMLImageElement | null,
  fonts: Fonts,
  hover: boolean
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext("2d")!;

  if (hover) {
    ctx.fillStyle = "#f4f4f2";
    ctx.fillRect(0, 0, TEX_W, TEX_H);
  } else {
    ctx.fillStyle = BG_DARK;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
  }

  // Screenshot cover-croppen (Quelle 960x620-ish -> 768x440)
  if (img && img.naturalWidth > 0) {
    const targetRatio = TEX_W / IMG_H;
    const srcRatio = img.naturalWidth / img.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;
    if (srcRatio > targetRatio) {
      sw = sh * targetRatio;
      sx = 0; // links anschneiden vermeiden: Websites sind links-ausgerichtet
    } else {
      sh = sw / targetRatio;
      sy = 0; // oben behalten (Header/Hero ist der Wiedererkennungswert)
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, IMG_Y, TEX_W, IMG_H);
    if (!hover) {
      // leicht abdunkeln, damit Rot/Weiss der Labels traegt und die
      // Szene ruhig bleibt (phantom laesst Bilder ebenfalls gedimmt)
      ctx.fillStyle = "rgba(13,14,18,0.16)";
      ctx.fillRect(0, IMG_Y, TEX_W, IMG_H);
    }
  } else {
    ctx.fillStyle = hover ? "#e4e4e0" : "#181a20";
    ctx.fillRect(0, IMG_Y, TEX_W, IMG_H);
  }

  const inkMain = hover ? "#23262e" : "#f6f5f1";
  const inkSoft = hover ? "#5a5e68" : "#9a9da6";

  // Label-Zeile oben: Name links, laufende Nummer rechts
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = inkMain;
  ctx.font = `700 30px ${fonts.display}`;
  ctx.fillText(p.name.toUpperCase(), 4, 38);
  ctx.fillStyle = inkSoft;
  ctx.font = `500 24px ${fonts.ui}`;
  const num = String((index % SPHERE_PROJECTS.length) + 1).padStart(2, "0");
  ctx.fillText(num, TEX_W - ctx.measureText(num).width - 4, 38);

  // Chips-Zeile unten: Kategorie + WEBSITE
  const chipY = IMG_Y + IMG_H + 14;
  let chipX = 4;
  const chips = [p.cat.toUpperCase(), "WEBSITE"];
  ctx.font = `600 20px ${fonts.ui}`;
  chips.forEach((label) => {
    const w = ctx.measureText(label).width + 24;
    ctx.strokeStyle = hover ? "#c9cbd1" : "#3a3d46";
    ctx.lineWidth = 2;
    ctx.strokeRect(chipX, chipY, w, 36);
    ctx.fillStyle = inkSoft;
    ctx.fillText(label, chipX + 12, chipY + 25);
    chipX += w + 12;
  });

  return c;
}

type Focused = { project: SphereProject } | null;

export default function SphereGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  // "pending" bis Faehigkeit geklaert (SSR-sicher), dann canvas | fallback.
  const [mode, setMode] = useState<"pending" | "canvas" | "fallback">("pending");
  const [selected, setSelected] = useState<Focused>(null);

  // Ref auf die three-Steuerung, damit der Close-Button entfokussieren kann.
  const focusApi = useRef<{ unfocus: () => void } | null>(null);

  // Faehigkeit pruefen (nur Client). Mobile bekommt ebenfalls Canvas.
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
    const COLS = small ? 9 : 12;

    // Aufgeloeste Schriften fuer die Canvas-Texturen ermitteln.
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

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(BG_DARK);
    scene.background = bgColor;
    const bgTarget = new THREE.Color(BG_DARK);

    const camera = new THREE.PerspectiveCamera(small ? 74 : 66, 1, 0.1, 100);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.75 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.cursor = "grab";
    // Mobile: vertikales Wischen scrollt die Seite weiter (sonst saesse man
    // im 100dvh-Canvas fest), horizontales Wischen rotiert die Kugel.
    renderer.domElement.style.touchAction = small ? "pan-y" : "none";

    // ---- Kacheln erzeugen ----
    const slots = ringLayout(COLS, SPHERE_PROJECTS);
    const geo = new THREE.PlaneGeometry(TILE_W, TILE_H);
    const meshes: THREE.Mesh[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    const normalTex: THREE.CanvasTexture[] = [];
    const hoverTex: (THREE.CanvasTexture | null)[] = [];
    const targetScale: number[] = [];
    const targetOpacity: number[] = [];
    const appearAt: number[] = [];

    const makeTexture = (canvas: HTMLCanvasElement) => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      return tex;
    };

    const t0 = performance.now();
    slots.forEach((slot, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      });
      const tex = makeTexture(drawTile(slot.project, i, null, fonts, false));
      mat.map = tex;
      normalTex[i] = tex;
      hoverTex[i] = null;
      materials[i] = mat;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(slot.position);
      mesh.lookAt(0, 0, 0); // +Z -> zur Kugel-Mitte (Kachel schaut zur Kamera)
      mesh.userData.index = i;
      scene.add(mesh);
      meshes.push(mesh);
      targetScale[i] = 1;
      targetOpacity[i] = 1;
      // Intro: Spaltenweise einblenden
      appearAt[i] = t0 + 120 + (i % COLS) * 55 + Math.floor(i / COLS) * 90;
    });

    // Screenshots laden, dann beide Texturvarianten pro Projekt backen
    // und auf alle Kacheln des Projekts verteilen.
    let disposed = false;
    const images = new Map<string, HTMLImageElement>();
    const rebuildProject = (p: SphereProject) => {
      if (disposed) return;
      const img = images.get(p.slug) ?? null;
      slots.forEach((slot, i) => {
        if (slot.project.slug !== p.slug) return;
        const nt = makeTexture(drawTile(p, i, img, fonts, false));
        const ht = makeTexture(drawTile(p, i, img, fonts, true));
        normalTex[i].dispose();
        normalTex[i] = nt;
        hoverTex[i]?.dispose();
        hoverTex[i] = ht;
        // Gehoverte Kachel behaelt die Hover-Variante (sonst faellt sie beim
        // Nachladen des Screenshots sichtbar auf die Normal-Textur zurueck).
        materials[i].map = i === hovered ? ht : nt;
        materials[i].needsUpdate = true;
      });
    };
    const startLoading = () => {
      SPHERE_PROJECTS.forEach((p) => {
        const img = new Image();
        img.onload = () => {
          images.set(p.slug, img);
          rebuildProject(p);
        };
        img.src = p.img;
      });
    };
    // Erst Schrift abwarten (sonst backen wir mit Ersatzfont), dann Bilder.
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

    // ---- Blickrichtung (Yaw/Pitch) mit Traegheit ----
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let velYaw = 0;
    let velPitch = 0;
    let interacted = false;

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
      camTo.copy(slots[i].position).multiplyScalar(0.45);
      // Blickpunkt unter die Kachel legen -> Kachel erscheint in der oberen
      // Bildschirmhaelfte, das Info-Panel unten verdeckt sie nicht.
      lookTarget.copy(slots[i].position);
      lookTarget.y -= 2.6;
      bgTarget.set(BG_LIGHT);
      meshes.forEach((_, j) => {
        targetOpacity[j] = j === i ? 1 : 0.22;
      });
    };
    const unfocus = () => {
      if (focusedIndex < 0) return;
      focusState = "out";
      focusStart = performance.now();
      camFrom.copy(camera.position);
      camTo.set(0, 0, 0);
      lookTarget.copy(slots[focusedIndex].position);
      bgTarget.set(BG_DARK);
      meshes.forEach((_, j) => {
        targetOpacity[j] = 1;
      });
    };
    focusApi.current = { unfocus };

    // ---- Pointer-Interaktion ----
    const ndc = new THREE.Vector2(2, 2); // ausserhalb, bis erste Bewegung
    const raycaster = new THREE.Raycaster();
    let dragging = false;
    let downOnCanvas = false; // pointerup ohne pointerdown auf dem Canvas ist kein Klick
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let hovered = -1;

    const setNdc = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const setHover = (hi: number) => {
      if (hi === hovered) return;
      if (hovered >= 0 && hoverTex[hovered]) {
        materials[hovered].map = normalTex[hovered];
        materials[hovered].needsUpdate = true;
      }
      hovered = hi;
      if (hovered >= 0 && hoverTex[hovered]) {
        materials[hovered].map = hoverTex[hovered];
        materials[hovered].needsUpdate = true;
      }
      renderer.domElement.style.cursor = hovered >= 0 ? "pointer" : "grab";
    };

    const onPointerDown = (e: PointerEvent) => {
      if (focusState !== "none" || focusedIndex >= 0) return;
      interacted = true;
      dragging = true;
      downOnCanvas = true;
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
        const k = small ? 0.0042 : 0.0032;
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
      renderer.domElement.style.cursor = hovered >= 0 ? "pointer" : "grab";
    };
    const onPointerUp = (e: PointerEvent) => {
      const wasClick = downOnCanvas && moved <= 8;
      downOnCanvas = false;
      endDrag(e);
      if (focusedIndex >= 0) return;
      if (wasClick) {
        // Klick -> Kachel treffen?
        setNdc(e);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        if (hit) {
          const i = (hit.object as THREE.Mesh).userData.index as number;
          setHover(-1);
          focus(i);
          setSelected({ project: slots[i].project });
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
    // Alle Daempfungen zeitbasiert (exponentiell mit dt), damit das Verhalten
    // unabhaengig von der Framerate ist — Chrome drosselt rAF in verdeckten
    // Fenstern massiv, per-Frame-Lerps wuerden dann minutenlang kriechen.
    let raf = 0;
    let last = performance.now();
    const loop = () => {
      raf = 0;
      if (!visible) return; // pausiert bis IntersectionObserver reaktiviert
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const damp = (k: number) => 1 - Math.exp(-k * dt);

      if (focusState !== "none") {
        const t = Math.min(1, (now - focusStart) / FOCUS_MS);
        const e = EASE(t);
        camera.position.lerpVectors(camFrom, camTo, e);
        camera.lookAt(lookTarget);
        if (t >= 1) {
          if (focusState === "out") {
            // Freies Umschauen fortsetzen, ausgerichtet auf die Kachel (kein Sprung).
            const d = slots[focusedIndex].position.clone().normalize();
            yaw = targetYaw = Math.atan2(d.x, d.z);
            pitch = targetPitch = Math.asin(Math.max(-1, Math.min(1, d.y)));
            focusedIndex = -1;
            camera.position.set(0, 0, 0);
          }
          focusState = "none";
        }
      } else if (focusedIndex < 0) {
        // Sanfte Eigendrehung bis zur ersten Interaktion.
        if (!interacted) targetYaw += IDLE_YAW * 60 * dt;
        // Traegheit: Ziel laeuft mit abklingender Geschwindigkeit weiter.
        if (!dragging) {
          targetYaw += velYaw * 60 * dt;
          targetPitch += velPitch * 60 * dt;
          targetPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, targetPitch));
          const decay = Math.exp(-5 * dt); // entspricht 0.92/Frame bei 60fps
          velYaw *= decay;
          velPitch *= decay;
          if (Math.abs(velYaw) < 1e-5) velYaw = 0;
          if (Math.abs(velPitch) < 1e-5) velPitch = 0;
        }
        // Sanftes Nachlaufen (Lenis-Gefuehl), zeitbasiert.
        const dLook = damp(3.7); // entspricht DAMPING 0.06/Frame bei 60fps
        yaw += (targetYaw - yaw) * dLook;
        pitch += (targetPitch - pitch) * dLook;
        applyLook();

        // Hover (nur ohne aktives Drag).
        if (!dragging) {
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObjects(meshes, false)[0];
          setHover(hit ? ((hit.object as THREE.Mesh).userData.index as number) : -1);
        }
      }

      // Hintergrund weich Richtung Ziel (Whiteout bei Fokus).
      bgColor.lerp(bgTarget, damp(5));

      // Scale/Opacity weich interpolieren (Intro, Hover, Fokus-Dimmen).
      const dScale = damp(7.7);
      const dOpacity = damp(6.3);
      for (let i = 0; i < meshes.length; i++) {
        const appeared = now >= appearAt[i];
        const ts = (i === hovered && focusedIndex < 0 ? 1.05 : 1) * (appeared ? 1 : 0.6);
        const to = appeared ? targetOpacity[i] : 0;
        const s = meshes[i].scale.x + (ts - meshes[i].scale.x) * dScale;
        meshes[i].scale.setScalar(s);
        materials[i].opacity += (to - materials[i].opacity) * dOpacity;
      }

      renderer.render(scene, camera);
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
      geo.dispose();
      normalTex.forEach((t) => t.dispose());
      hoverTex.forEach((t) => t?.dispose());
      materials.forEach((m) => m.dispose());
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
