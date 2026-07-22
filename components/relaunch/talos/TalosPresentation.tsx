"use client";

// Talos-Praesentation: die neue three-spline-Buehne (Original-Szene, fixierte
// Augen, Bewegungs-Rig) fest hinter scrollenden Stationen. Auftakt = Fly-in +
// Landung + Winken (laeuft von selbst). Danach steuert der Scroll die Kino-
// Kamera pro Station (Talos links, Glass-Card rechts). Weiches Section-Snap.
// Reduced-Motion / kein WebGL: statische Pose + normale Reveals, Text immer da.
//
// Buehne laeuft auf der isolierten three-spline (three@0.149) Instanz.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three-spline";
import SplineLoader from "@splinetool/loader";
import { buildTalosRig, type TalosRig } from "./talosRig";
import { createTalosMotion, type TalosMotion } from "./talosMotion";
import { TALOS_SECTIONS, type CamKey } from "./talosSections";

const SCENE_URL = "https://prod.spline.design/bN7MTDW-zSkVIOxf/scene.splinecode";
const PHONE_TEL = "+436769000955";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const dampFactor = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

export default function TalosPresentation() {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const camTargetRef = useRef<CamKey>(TALOS_SECTIONS[0].cam);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"laedt" | "bereit" | "fehler">("laedt");
  const [no3d, setNo3d] = useState(false);

  // ---- 3D-Buehne ------------------------------------------------------------
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Geraete-Faehigkeit (WebGL2 + Speicher), sonst 2D-Fallback.
    let webgl2 = false;
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2 = false;
    }
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const capable = webgl2 && (mem === undefined || mem > 4);
    if (!capable) {
      setNo3d(true);
      setStatus("bereit");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 10, 100000);
    const hero = TALOS_SECTIONS[0].cam;
    // Live-Kamera-Zustand (wird pro Frame Richtung camTargetRef gelerpt).
    const curPos = new THREE.Vector3(...hero.pos);
    const curTgt = new THREE.Vector3(...hero.target);
    let curFov = hero.fov;
    camera.position.copy(curPos);
    camera.lookAt(curTgt);

    scene.add(new THREE.AmbientLight(0xffffff, 0.66));
    const key = new THREE.PointLight(0xffffff, 1.4, 4000, 1);
    key.position.set(180, 460, 420);
    scene.add(key);
    const fill = new THREE.PointLight(0xdfe7ee, 0.5, 4000, 1);
    fill.position.set(-260, 120, 220);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // Fly-in Startpose: weit hinten, hoch, gekippt.
    const START = { x: 90, y: 470, z: -1500, rotX: 0.3, rotY: -0.5 };
    const setFlightPose = (t: number) => {
      const e = easeOutCubic(t);
      pivot.position.set(START.x * (1 - e), START.y * (1 - e), START.z * (1 - e));
      pivot.rotation.x = START.rotX * (1 - e);
      pivot.rotation.y = START.rotY * (1 - e);
    };

    let disposed = false;
    let rig: TalosRig | null = null;
    let motion: TalosMotion | null = null;
    let flyStart = 0;
    let flyDone = reduced;
    let greeted = false;

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const onGaze = (e: PointerEvent) => {
      motion?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onGaze);

    const clock = new THREE.Clock();

    // Gemeinsamer Teardown: sowohl bei Unmount ALS AUCH bei Ladefehler
    // (sonst laeuft der Renderloop weiter, waehrend die Buehne aus dem DOM faellt).
    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };

    const loader = new SplineLoader() as unknown as {
      load: (u: string, ok: (s: unknown) => void, p?: unknown, e?: (e: unknown) => void) => void;
    };
    loader.load(
      SCENE_URL,
      (splineScene) => {
        if (disposed) return;
        pivot.add(splineScene as never);
        rig = buildTalosRig(THREE, splineScene);
        if (rig) {
          motion = createTalosMotion(rig, splineScene);
          motion.setReducedMotion(reduced);
        }
        if (reduced) {
          setFlightPose(1);
          pivot.rotation.y = hero.yaw;
        } else {
          setFlightPose(0);
          flyStart = clock.getElapsedTime(); // Auftakt startet erst beim Laden
        }
        (window as unknown as Record<string, unknown>).__talosScene = splineScene;
        (window as unknown as Record<string, unknown>).__talos = rig;
        (window as unknown as Record<string, unknown>).__talosMotion = motion;
        setStatus("bereit");
      },
      undefined,
      () => {
        teardown();
        setNo3d(true);
        setStatus("bereit");
      },
    );

    const T_FLIGHT = 2.6;
    const T_DIP = 0.45;
    const targetPos = new THREE.Vector3();
    const targetTgt = new THREE.Vector3();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const now = clock.getElapsedTime();

      if (!flyDone && rig) {
        // Fly-in laeuft erst, wenn die Szene wirklich geladen ist.
        const t = now - flyStart;
        if (t < T_FLIGHT) {
          setFlightPose(t / T_FLIGHT);
        } else if (t < T_FLIGHT + T_DIP) {
          const p = (t - T_FLIGHT) / T_DIP;
          pivot.position.set(0, Math.sin(p * Math.PI) * -14, 0);
          pivot.rotation.set(0, 0, 0);
        } else {
          pivot.position.set(0, 0, 0);
          if (!greeted) {
            greeted = true;
            motion?.triggerGreeting();
          }
          flyDone = true;
        }
      } else if (flyDone) {
        // Kino-Kamera Richtung aktive Station lerpen.
        const c = camTargetRef.current;
        targetPos.set(...c.pos);
        targetTgt.set(...c.target);
        const k = dampFactor(3.2, delta);
        curPos.lerp(targetPos, k);
        curTgt.lerp(targetTgt, k);
        curFov += (c.fov - curFov) * k;
        camera.position.copy(curPos);
        camera.lookAt(curTgt);
        camera.fov = curFov;
        camera.updateProjectionMatrix();
        pivot.rotation.y += (c.yaw - pivot.rotation.y) * k;
      }

      motion?.update(delta);
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      rig?.dispose();
      teardown();
    };
  }, []);

  // ---- Scroll -> aktive Station + Kamera-Ziel + Snap -------------------------
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const docEl = document.documentElement;
    if (!reduced) docEl.style.scrollSnapType = "y proximity";

    let raf = 0;
    let pending = false;
    const compute = () => {
      pending = false;
      const vh = window.innerHeight;
      const center = vh / 2;
      let chosen = 0;
      for (let i = 0; i < TALOS_SECTIONS.length; i++) {
        const el = document.getElementById(TALOS_SECTIONS[i].id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= center && r.bottom >= center) {
          chosen = i;
          break;
        }
        if (r.bottom < center) chosen = i;
      }
      camTargetRef.current = TALOS_SECTIONS[chosen].cam;
      setActive(chosen);
      const g = clamp01(window.scrollY / Math.max(1, docEl.scrollHeight - vh));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${g})`;
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      docEl.style.scrollSnapType = "";
    };
  }, []);

  // ---- Reveals (ohne JS bleibt alles sichtbar) ------------------------------
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (reduced || !root || !("IntersectionObserver" in window)) return;
    root.setAttribute("data-reveal", "on");
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".tp-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="tp-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Buehne bleibt immer gemountet (Teardown-/ref-Stabilitaet);
          Poster liegt als Overlay drueber, wenn kein 3D. */}
      <div className="tp-stage" aria-hidden="true" ref={hostRef} />
      {no3d && <div className="tp-poster" aria-hidden="true" />}

      {/* Ecken-Logo wird jetzt seitenweit von <CornerLogo /> gerendert
          (auf app/relaunch-preview/leistungen/talos + talos-intro), damit
          Groesse/Position und das verzoegerte Einblenden ueberall gleich sind. */}

      {/* Progress-Linie oben */}
      <div className="tp-progress" aria-hidden="true">
        <span className="tp-progress-bar" ref={progressRef} />
      </div>

      {/* Scroll-Hinweis: nur im Hero, verschwindet beim ersten Scrollen. */}
      <button
        type="button"
        className={`tp-scrollcue${active === 0 ? " is-shown" : ""}`}
        aria-label="Weiter zu: Wer ist Talos"
        tabIndex={active === 0 ? 0 : -1}
        onClick={() => scrollToId(TALOS_SECTIONS[1].id)}
      >
        <span className="tp-scrollcue-label">Scroll weiter</span>
        <span className="tp-scrollcue-arrow" aria-hidden="true" />
      </button>

      {/* Stationen */}
      {TALOS_SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`tp-section tp-card-${s.cardSide}`}
          aria-label={s.label}
        >
          <div className={`tp-card tp-reveal${i === 0 ? " tp-card--hero" : ""}`}>
            <p className="tp-eyebrow">{s.eyebrow}</p>
            <h2 className="tp-headline">{s.headline}</h2>
            {s.subline && <p className="tp-subline">{s.subline}</p>}

            {s.says.length > 0 && (
              <div className="tp-says">
                {s.says.map((q) => (
                  <p key={q} className="tp-say">
                    {q}
                  </p>
                ))}
              </div>
            )}

            {s.bullets && (
              <ul className="tp-bullets">
                {s.bullets.map((b) => (
                  <li key={b.title} className="tp-bullet">
                    <span className="tp-bullet-title">{b.title}</span>
                    {b.body && <span className="tp-bullet-body">{b.body}</span>}
                  </li>
                ))}
              </ul>
            )}

            {s.id === "tal-frag" && (
              <div className="tp-actions">
                <Link href="/relaunch-preview/kontakt" className="tp-btn tp-btn--red">
                  Los geht&apos;s
                </Link>
              </div>
            )}
            {s.id === "tal-start" && (
              <div className="tp-actions">
                <Link href="/relaunch-preview/kontakt" className="tp-btn tp-btn--red">
                  Kostenlosen Entwurf anfragen
                </Link>
                <div className="tp-actions-row">
                  <a href={`tel:${PHONE_TEL}`} className="tp-btn tp-btn--ghost">
                    Anrufen
                  </a>
                  <Link href="/preise" className="tp-btn tp-btn--ghost">
                    Preise ansehen
                  </Link>
                </div>
                <p className="tp-note">Lieber schreiben? Ein Satz genügt, wir melden uns.</p>
              </div>
            )}
          </div>
        </section>
      ))}

      {status === "laedt" && <p className="tp-loading">Talos kommt …</p>}
    </div>
  );
}

const CSS = `
.tp-root{ position:relative; color:var(--rr-ink,#23262e); background:#ffffff; overflow-x:clip;
  font-family:var(--rr-font-ui,var(--font-grotesk),"Instrument Sans",system-ui,sans-serif); }
.tp-root *{ box-sizing:border-box; }

.tp-stage{ position:fixed; inset:0; z-index:0; pointer-events:none; }
.tp-stage canvas{ display:block; }
.tp-poster{ position:fixed; inset:0; z-index:0; pointer-events:none;
  background:radial-gradient(120% 80% at 50% 34%, #ffffff 0%, #f4f4f2 55%, #e9edf0 100%); }

/* Stationen scrollen ueber der Buehne, jede eine Folie. */
.tp-section{ position:relative; z-index:1; min-height:100vh; scroll-snap-align:start;
  display:flex; align-items:center;
  padding:clamp(72px,12vh,140px) var(--rr-gutter,clamp(20px,4.6vw,72px)); }
.tp-card-right{ justify-content:flex-end; }
.tp-card-left{ justify-content:flex-start; }
.tp-card-center{ justify-content:center; }

/* Haus-Panel: solide + opak (kein Glas/Blur), eckig, Haarlinie + roter Top-Akzent,
   flacher Layer-Schatten. Werte aus styleguide.css (--rr-surface/--rr-line/--rr-shadow-layer). */
.tp-card{ width:min(440px,86vw);
  background:var(--rr-surface,#f4f4f2);
  border:1px solid var(--rr-line,#e4e4e0); border-top:3px solid var(--rr-red,#f12032);
  box-shadow:var(--rr-shadow-layer,rgba(28,40,55,.26) 0 2px 4px,rgba(28,40,55,.18) 0 7px 13px -3px);
  padding:clamp(26px,3vw,40px); }
.tp-card-center .tp-card{ width:min(540px,90vw); text-align:center; }
.tp-card--hero{ width:min(560px,90vw); background:var(--rr-paper,#ffffff); }

/* rote Eyebrow, Haus-Wert (13px / 0.18em / --rr-red) */
.tp-eyebrow{ font-family:var(--rr-font-ui,inherit); font-size:13px; font-weight:650; letter-spacing:.18em;
  text-transform:uppercase; color:var(--rr-red,#f12032); margin:0 0 16px; }
/* DM-Sans-Headline auf Haus-Skala (letter-spacing -.018em, line-height 1.02) */
.tp-headline{ font-family:var(--rr-font-display,var(--font-dmsans),"DM Sans",sans-serif); font-weight:700;
  font-size:clamp(1.55rem,3vw,2.5rem); line-height:1.04; letter-spacing:-.018em;
  color:var(--rr-ink,#23262e); margin:0; text-wrap:balance; }
.tp-card--hero .tp-headline{ font-size:clamp(1.9rem,4.2vw,3.2rem); }
.tp-subline{ font-size:clamp(1rem,1.1vw,1.06rem); line-height:1.5; color:var(--rr-ink-soft,#5a5e68); margin:18px 0 0; }

/* Talos-Stimme: Crimson, tuerkiser Rand = Augenfarbe (offene Entscheidung Thomas) */
.tp-says{ margin-top:24px; display:flex; flex-direction:column; gap:12px; }
.tp-say{ font-family:var(--rr-font-serif,var(--font-crimson),"Crimson Pro",Georgia,serif); font-weight:500;
  font-size:clamp(1.12rem,1.7vw,1.35rem); line-height:1.24; color:var(--rr-ink,#23262e); margin:0;
  padding-left:15px; border-left:2px solid #39c2d7; }

.tp-bullets{ list-style:none; margin:24px 0 0; padding:0; display:flex; flex-direction:column; gap:16px; }
.tp-bullet{ display:flex; flex-direction:column; gap:3px; }
.tp-bullet-title{ font-family:var(--rr-font-display,var(--font-dmsans),"DM Sans",sans-serif); font-weight:700;
  font-size:1.02rem; letter-spacing:-.01em; color:var(--rr-ink,#23262e); }
.tp-bullet-body{ font-size:.95rem; line-height:1.5; color:var(--rr-ink-soft,#5a5e68); }

.tp-actions{ margin-top:28px; display:flex; flex-direction:column; gap:14px; align-items:flex-start; }
.tp-actions-row{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
.tp-card-center .tp-actions{ align-items:center; }
.tp-card-center .tp-actions-row{ justify-content:center; }
.tp-btn{ display:inline-flex; align-items:center; justify-content:center; font-weight:600; font-size:1rem;
  padding:14px 26px; border:1px solid transparent; text-decoration:none; cursor:pointer;
  box-shadow:var(--rr-shadow-btn,0 1px 2px rgba(28,40,55,.10),0 2px 8px rgba(28,40,55,.06));
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)), background .2s, color .2s, box-shadow .2s; }
.tp-btn:hover{ transform:translateY(-2px); box-shadow:var(--rr-shadow-btn-hover,0 4px 14px rgba(28,40,55,.14),0 2px 6px rgba(28,40,55,.08)); }
.tp-btn:focus-visible{ outline:2px solid var(--rr-red,#f12032); outline-offset:3px; }
.tp-btn--red{ background:var(--rr-red,#f12032); color:#fff; }
.tp-btn--red:hover{ background:var(--rr-red-deep,#c81222); }
.tp-btn--ghost{ background:transparent; color:var(--rr-ink,#23262e); border-color:var(--rr-line,#e4e4e0); box-shadow:none; }
.tp-btn--ghost:hover{ border-color:var(--rr-ink,#23262e); }
.tp-note{ font-size:.9rem; color:var(--rr-ink-soft,#5a5e68); margin:0; }

/* Progress-Linie */
.tp-progress{ position:fixed; left:0; top:0; width:100%; height:3px; z-index:41; background:rgba(35,38,46,.06); }
.tp-progress-bar{ display:block; width:100%; height:100%; background:#f12032; transform:scaleX(0); transform-origin:0 50%; }

/* Scroll-Hinweis (nur Hero) */
.tp-scrollcue{ position:fixed; left:50%; bottom:clamp(18px,3vh,34px); transform:translateX(-50%) translateY(6px);
  z-index:42; display:inline-flex; flex-direction:column; align-items:center; gap:8px;
  background:none; border:none; padding:6px 10px; cursor:pointer; color:#5a5e68;
  opacity:0; pointer-events:none;
  transition:opacity .5s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .5s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tp-scrollcue.is-shown{ opacity:1; transform:translateX(-50%); pointer-events:auto; }
.tp-scrollcue-label{ font-size:.72rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; }
.tp-scrollcue-arrow{ width:11px; height:11px; border-right:2px solid currentColor; border-bottom:2px solid currentColor;
  transform:rotate(45deg); animation:tp-cuebob 1.8s var(--rr-ease,cubic-bezier(.6,0,.4,1)) infinite; }
.tp-scrollcue:hover{ color:#f12032; }
.tp-scrollcue:focus-visible{ outline:2px solid #f12032; outline-offset:4px; }
@keyframes tp-cuebob{ 0%,100%{ transform:rotate(45deg) translate(0,0); } 50%{ transform:rotate(45deg) translate(3px,3px); } }

.tp-loading{ position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); margin:0;
  font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:#8a9098; z-index:1; }

/* Reveals */
.tp-root[data-reveal="on"] .tp-reveal{ opacity:0; transform:translateY(22px);
  transition:opacity .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tp-root[data-reveal="on"] .tp-reveal.is-in{ opacity:1; transform:none; }

/* Mobile: Card mittig, Talos dahinter. Card bleibt solide/opak (Lesbarkeit). */
@media (max-width:820px){
  .tp-section{ justify-content:center; padding-top:clamp(80px,14vh,120px); padding-bottom:clamp(80px,14vh,120px); }
  .tp-card{ background:var(--rr-paper,#ffffff); }
}

@media (prefers-reduced-motion:reduce){
  .tp-root[data-reveal="on"] .tp-reveal{ opacity:1 !important; transform:none !important; transition:none; }
  .tp-btn:hover,.tp-call:hover{ transform:none; }
  .tp-scrollcue-arrow{ animation:none; }
}
`;
