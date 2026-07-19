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
          flyStart = clock.getElapsedTime();
        }
        (window as unknown as Record<string, unknown>).__talosScene = splineScene;
        (window as unknown as Record<string, unknown>).__talos = rig;
        (window as unknown as Record<string, unknown>).__talosMotion = motion;
        setStatus("bereit");
      },
      undefined,
      () => {
        setNo3d(true);
        setStatus("bereit");
      },
    );

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

    const T_FLIGHT = 2.6;
    const T_DIP = 0.45;
    let greeted = false;

    const targetPos = new THREE.Vector3();
    const targetTgt = new THREE.Vector3();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const now = clock.getElapsedTime();

      if (!flyDone) {
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
      } else {
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
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onGaze);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="tp-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Fixe 3D-Buehne bzw. Poster-Fallback */}
      {!no3d ? (
        <div className="tp-stage" aria-hidden="true" ref={hostRef} />
      ) : (
        <div className="tp-poster" aria-hidden="true" />
      )}

      {/* Progress-Linie oben */}
      <div className="tp-progress" aria-hidden="true">
        <span className="tp-progress-bar" ref={progressRef} />
      </div>

      {/* Kapitel-Punkte rechts (Desktop) */}
      <nav className="tp-dots" aria-label="Stationen">
        {TALOS_SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`tp-dot${i === active ? " is-active" : ""}`}
            aria-label={`Zu ${s.label}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => scrollToId(s.id)}
          >
            <span className="tp-dot-label">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* Anrufen fix */}
      <a href={`tel:${PHONE_TEL}`} className="tp-call">
        Anrufen
      </a>

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
                <a href={`tel:${PHONE_TEL}`} className="tp-btn tp-btn--ghost">
                  Anrufen
                </a>
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
.tp-root{ position:relative; color:#23262e; background:#ffffff; overflow-x:clip;
  font-family:var(--font-grotesk),"Instrument Sans",system-ui,sans-serif; }
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

/* Glass-Card: EckIG (border-radius 0, Eckig-Gesetz), heller Panel-Grund. */
.tp-card{ width:min(430px,86vw);
  background:rgba(255,255,255,.72); backdrop-filter:blur(7px) saturate(1.3);
  -webkit-backdrop-filter:blur(7px) saturate(1.3);
  border:1px solid rgba(35,38,46,.08); box-shadow:0 24px 60px rgba(20,30,45,.10);
  padding:clamp(24px,3vw,38px); }
.tp-card-center .tp-card{ width:min(520px,90vw); text-align:center; }
.tp-card--hero{ width:min(540px,90vw); background:rgba(255,255,255,.66); }

.tp-eyebrow{ font-size:.8rem; font-weight:650; letter-spacing:.18em; text-transform:uppercase;
  color:#23262e; margin:0 0 14px; }
.tp-headline{ font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:clamp(1.5rem,3vw,2.4rem); line-height:1.08; letter-spacing:-.015em; color:#23262e; margin:0; }
.tp-card--hero .tp-headline{ font-size:clamp(1.8rem,4vw,3.1rem); }
.tp-subline{ font-size:1rem; line-height:1.55; color:#5a5e68; margin:16px 0 0; }

.tp-says{ margin-top:22px; display:flex; flex-direction:column; gap:12px; }
.tp-say{ font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.1rem,1.7vw,1.35rem); line-height:1.28; color:#23262e; margin:0;
  padding-left:14px; border-left:2px solid #39c2d7; }

.tp-bullets{ list-style:none; margin:22px 0 0; padding:0; display:flex; flex-direction:column; gap:14px; }
.tp-bullet{ display:flex; flex-direction:column; gap:3px; }
.tp-bullet-title{ font-family:var(--font-dmsans),"DM Sans",sans-serif; font-weight:700;
  font-size:1.02rem; color:#23262e; }
.tp-bullet-body{ font-size:.94rem; line-height:1.5; color:#5a5e68; }

.tp-actions{ margin-top:26px; display:flex; flex-direction:column; gap:14px; align-items:flex-start; }
.tp-card-center .tp-actions{ align-items:center; }
.tp-btn{ display:inline-flex; align-items:center; justify-content:center; font-weight:600; font-size:1rem;
  padding:14px 26px; border:1px solid transparent; text-decoration:none; cursor:pointer;
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)), background .2s, color .2s; }
.tp-btn:hover{ transform:translateY(-2px); }
.tp-btn:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.tp-btn--red{ background:#f12032; color:#fff; }
.tp-btn--ghost{ background:transparent; color:#23262e; border-color:rgba(35,38,46,.3); }
.tp-note{ font-size:.9rem; color:#5a5e68; margin:0; }

/* Progress-Linie */
.tp-progress{ position:fixed; left:0; top:0; width:100%; height:3px; z-index:41; background:rgba(35,38,46,.06); }
.tp-progress-bar{ display:block; width:100%; height:100%; background:#f12032; transform:scaleX(0); transform-origin:0 50%; }

/* Kapitel-Punkte rechts */
.tp-dots{ position:fixed; right:clamp(14px,2vw,28px); top:50%; transform:translateY(-50%); z-index:40;
  display:none; flex-direction:column; gap:16px; }
.tp-dot{ position:relative; width:12px; height:12px; padding:0; cursor:pointer; background:none; border:none; }
.tp-dot::after{ content:""; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  width:8px; height:8px; background:#c7c7c2;
  transition:background .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .3s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tp-dot.is-active::after{ background:#f12032; transform:translate(-50%,-50%) scale(1.4); }
.tp-dot:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }
.tp-dot-label{ position:absolute; right:20px; top:50%; transform:translateY(-50%); white-space:nowrap;
  opacity:0; pointer-events:none; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:#23262e;
  transition:opacity .25s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tp-dot:hover .tp-dot-label,.tp-dot.is-active .tp-dot-label{ opacity:1; }
@media (min-width:960px){ .tp-dots{ display:flex; } }

/* Anrufen fix */
.tp-call{ position:fixed; left:clamp(16px,3vw,40px); bottom:clamp(16px,3vh,32px); z-index:42;
  display:inline-flex; align-items:center; padding:11px 20px; font-weight:600; font-size:.92rem;
  background:#23262e; color:#fff; text-decoration:none; transition:background .2s, transform .2s; }
.tp-call:hover{ background:#f12032; transform:translateY(-2px); }
.tp-call:focus-visible{ outline:2px solid #f12032; outline-offset:3px; }

.tp-loading{ position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); margin:0;
  font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:#8a9098; z-index:1; }

/* Reveals */
.tp-root[data-reveal="on"] .tp-reveal{ opacity:0; transform:translateY(22px);
  transition:opacity .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)), transform .7s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.tp-root[data-reveal="on"] .tp-reveal.is-in{ opacity:1; transform:none; }

/* Mobile: Card mittig, Talos dahinter */
@media (max-width:820px){
  .tp-section{ justify-content:center; padding-top:clamp(80px,14vh,120px); padding-bottom:clamp(80px,14vh,120px); }
  .tp-card{ background:rgba(255,255,255,.82); }
}

@media (prefers-reduced-motion:reduce){
  .tp-root[data-reveal="on"] .tp-reveal{ opacity:1 !important; transform:none !important; transition:none; }
  .tp-btn:hover,.tp-call:hover{ transform:none; }
}
`;
