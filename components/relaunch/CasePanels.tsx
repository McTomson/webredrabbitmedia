"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clamp01 } from "@/lib/relaunch/morph/grammar";

/**
 * 3 Themen-Panels nach live vermessener all-turtles-Grammatik (05.07.):
 * - Pro Thema ein Track (~380vh), sticky 100vh, Buehne 300vw, LINEARE Fahrt
 *   (Smoothing kommt vom globalen Lenis, kein Segment-Snapping).
 * - Slide 1 (links): Eyebrow 27px Sans letterspaced (Akzent, gedimmt) +
 *   Headline 135px Serif weiss; fadet waehrend der Fahrt aus (gemessen ~0.38).
 * - Riesiges Thema-Wort (Original: SVG ~503px hoch) zieht ton-in-ton mit
 *   Parallax (~1.25x) durch die Buehne.
 * - Medien/Animationen schweben versetzt auf der Buehne (Original: echte
 *   Autoplay-Videos 437px, gerundet) — bei uns die Themen-Animationen +
 *   PLATZHALTER-Karten fuer echtes Site-Material.
 * - Abschluss-Statement 41px Serif + Link 20px Sans 500 KLEBT im Viewport
 *   (Original: absolute right-0 im Sticky) und blendet gegen Ende ein.
 * Themen-Zuordnung: Tomson 05.07. (Webdesign / Dashboard-Selbstlauf / Sichtbarkeit).
 */

type Theme = {
  key: string;
  eyebrow: string;
  headline: string;
  /** Fliesstext-Absatz unter der Headline (linksbuendig). */
  body: string;
  linkText: string;
  href: string;
  giant: string;
  bg: string;
  text: string;
  accent: string;
  giantColor: string;
  /** Track-Hoehe in vh (mehr = laengere horizontale Fahrt). */
  trackVh: number;
};

const THEMES: Theme[] = [
  {
    key: "problem",
    eyebrow: "Das Problem",
    headline: "Schön gebaut. Trotzdem ruft keiner an.",
    body: "Du hast viel Geld für eine neue Website bezahlt, aber sie arbeitet nicht für dich. Wenn Kunden in deiner Region suchen, tauchst du nicht auf. Um das zu ändern, müsstest du dich abends nach der Arbeit selbst hinsetzen oder einen teuren Mitarbeiter engagieren, um mühsam SEO-Texte zu schreiben und die Seite aktuell zu halten. Dafür fehlt im Alltag schlichtweg die Zeit. Deine Website ist aktuell ein toter Gegenstand, der dich Geld kostet, statt ein Werkzeug, das dir Arbeit abnimmt. Schön allein zahlt dir keine Rechnung.",
    linkText: "Was wir anders machen",
    href: "/relaunch-preview/leistungen",
    giant: "Problem",
    bg: "var(--rr-world-1-bg)",
    text: "#23262e",
    accent: "var(--rr-red)",
    giantColor: "rgba(35,38,46,0.05)",
    trackVh: 150,
  },
  {
    key: "loesung",
    eyebrow: "Die Lösung",
    headline: "Wir bauen nicht nur Seiten, die gefunden werden. Wir bauen dein Marketing-Team.",
    body: "Eine Website, die gefunden wird, ist für uns nur der Standard. Alles beginnt mit einer kompromisslos guten Website, die im klassischen Netz und in neuen KI-Suchen dominiert. Im Hintergrund arbeitet von Anfang an dein digitaler Mitarbeiter, der dir alle Erfolge übersichtlich aufbereitet. Der wahre Wert liegt in der Anpassungsfähigkeit: Du kannst deinen digitalen Helfer jederzeit mit neuen Fähigkeiten updaten. Ob er selbstständig Leads generiert, Werbung steuert oder Prozesse automatisiert, das System passt sich nahtlos deinen Zielen an.",
    linkText: "Was wir anders machen",
    href: "/relaunch-preview/leistungen",
    giant: "Lösung",
    bg: "var(--rr-world-2-bg)",
    text: "#23262e",
    accent: "var(--rr-red)",
    giantColor: "rgba(35,38,46,0.05)",
    trackVh: 170,
  },
  {
    key: "beweis",
    eyebrow: "Der Beweis",
    headline: "Kunden, die für uns sprechen.",
    body: "Ergebnisse, schwarz auf weiß.",
    linkText: "Alle Referenzen",
    href: "/relaunch-preview/referenzen",
    giant: "Beweis",
    bg: "var(--rr-world-3-bg)",
    text: "#f6f5f1",
    accent: "var(--rr-red)",
    giantColor: "rgba(255,255,255,0.05)",
    trackVh: 380,
  },
];

/* Beweis-Karte (Panel 3): echte Google-Rezension, Wortlaut 1:1 (verifiziert
   22.07.2026 gegen das Live-Google-Profil; Dmitry = Team, bewusst nicht gezeigt). */
function ReviewCard({ quote, name, left, top }: { quote: string; name: string; left: string; top: string }) {
  return (
    <div aria-hidden style={{
      position: "absolute", left, top, width: "clamp(300px, 32vw, 480px)",
      background: "#fff", padding: "22px 24px",
      boxShadow: "0 24px 60px rgba(0,0,0,.30)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true" style={{ flex: "0 0 auto" }}>
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <span style={{ color: "#f5b400", fontSize: 16, letterSpacing: "1px" }}>★★★★★</span>
      </div>
      <p style={{ fontFamily: "var(--rr-font-serif)", fontWeight: 500, fontSize: 19, lineHeight: 1.42, color: "#23262e", margin: "0 0 14px" }}>
        {`„${quote}“`}
      </p>
      <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: 14, fontWeight: 600, color: "#23262e", margin: 0 }}>
        {name} <span style={{ fontWeight: 400, color: "#8a8d94" }}>· Google-Rezension</span>
      </p>
    </div>
  );
}

function PanelTrack({ t }: { t: Theme }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current!, stage = stageRef.current!, giant = giantRef.current!;
    let raf = 0, destroyed = false;

    function render() {
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const vw = window.innerWidth;
      // Fahrt ab p=0.1 linear; der Textblock ist gepinnt (faehrt NICHT), nur die
      // Buehnen-Karten und das Riesen-Wort ziehen seitlich durch.
      const pd = clamp01((p - 0.1) / 0.9);
      stage.style.transform = `translate3d(${-pd * 2 * vw}px, 0, 0)`;
      giant.style.transform = `translate3d(${-pd * 2.5 * vw}px, 0, 0)`;
    }

    function loop() {
      if (destroyed) return;
      render();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { destroyed = true; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={trackRef} style={{ height: `${t.trackVh}vh`, position: "relative" }}>
      <section aria-label={`Thema ${t.eyebrow}`} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: t.bg, color: t.text }}>
        {/* Riesen-Thema-Wort, Parallax-Layer (ton-in-ton) */}
        <div ref={giantRef} aria-hidden style={{ position: "absolute", left: 0, top: 0, height: "100%", display: "flex", alignItems: "flex-end", willChange: "transform", pointerEvents: "none" }}>
          <span style={{
            fontFamily: "var(--rr-font-display)", fontWeight: 640, whiteSpace: "nowrap",
            fontSize: "min(64vh, 40vw)", lineHeight: 0.9, color: t.giantColor,
            transform: "translateY(0.16em)", marginLeft: "54vw",
          }}>{t.giant}</span>
        </div>

        {/* Gepinnter, linksbuendig lesbarer Textblock (faehrt NICHT mit) */}
        <div style={{ position: "absolute", left: "max(24px, 8vw)", top: "50%", transform: "translateY(-50%)", width: "min(90vw, 600px)", zIndex: 2 }}>
          <p className="rr-eyebrow-lg" style={{ color: t.accent, fontFamily: "var(--rr-font-sans)", letterSpacing: "0.12em", fontWeight: 600, margin: 0 }}>{t.eyebrow}</p>
          <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(28px, 3.3vw, 46px)", lineHeight: 1.08, margin: "0.4em 0 0", color: "inherit" }}>{t.headline}</h3>
          <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.6, fontWeight: 400, margin: "1.1em 0 0", maxWidth: "34em", color: "inherit", opacity: 0.92 }}>{t.body}</p>
          <p style={{ margin: "1.5em 0 0" }}>
            <Link href={t.href} style={{ color: "inherit", fontFamily: "var(--rr-font-sans)", fontSize: 18, fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 5 }}>
              {t.linkText} {"→"}
            </Link>
          </p>
        </div>

        {/* Buehne 300vw: nur die Beweis-Rezensionskarten fahren seitlich durch */}
        <div ref={stageRef} style={{ position: "absolute", inset: 0, width: "300vw", willChange: "transform", pointerEvents: "none" }}>
          {t.key === "beweis" && (
            <>
              <ReviewCard
                left="60vw" top="24vh"
                name="Rafael Danesh"
                quote="Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die Zusammenarbeit war äußerst präzise, auf all unsere Wünsche wurde detailliert eingegangen, und wir sind mit den Ergebnissen sehr zufrieden! Danke!"
              />
              <ReviewCard
                left="132vw" top="30vh"
                name="Rene Rohrer"
                quote="Ich bin von der Firma begeistert vor allem von der Umsetzung, ein Lob an Herrn Uhlir der mich durch die Zeit der Umsetzung begleitet hat. Vielen lieben Dank :-) 100 Prozent Empfehlung"
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CasePanels() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div>
        {THEMES.map((t) => (
          <section key={t.key} aria-label={`Thema ${t.eyebrow}`} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: t.bg, color: t.text, display: "flex", alignItems: "center" }}>
            <div className="rr-wrap" style={{ position: "relative", width: "100%", padding: "clamp(96px, 16vh, 200px) 0" }}>
              <p className="rr-eyebrow-lg" style={{ color: t.accent }}>{t.eyebrow}</p>
              <h3 style={{ fontFamily: "var(--rr-font-display)", fontWeight: 700, letterSpacing: "-0.018em", fontSize: "clamp(28px, 3.6vw, 48px)", lineHeight: 1.08, margin: "0.3em 0 0.5em", color: "inherit" }}>{t.headline}</h3>
              <p style={{ fontFamily: "var(--rr-font-ui)", fontSize: "clamp(15px, 1.1vw, 18px)", lineHeight: 1.6, maxWidth: "34em", margin: 0, color: "inherit", opacity: 0.92 }}>{t.body}</p>
              <p style={{ marginTop: 40 }}><Link href={t.href} style={{ color: "inherit", fontSize: 20, textDecoration: "underline", textUnderlineOffset: 5 }}>{t.linkText} {"→"}</Link></p>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div>
      {THEMES.map((t) => <PanelTrack key={t.key} t={t} />)}
    </div>
  );
}
