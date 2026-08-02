"use client";

import { useEffect, useRef } from "react";
import MorphSculpture from "@/components/subpages/MorphSculpture";

/**
 * MOBILE-HERO als Video (Thomas 02.08.): auf Handy/Tablet ersetzt ein
 * abgefilmtes, stumm geschleiftes Video den interaktiven Canvas-Hero (Desktop
 * bleibt der Canvas). Aufbau angelehnt an den Desktop-Hero:
 *
 *   1. Das Wort "Website." (wie das Deck der Desktop-Szene) — echtes <h1> in
 *      DM Sans mit rotem Schlusspunkt (nicht ins Video gebrannt, damit es
 *      markengenau/scharf/responsiv bleibt). Thomas 02.08.: "es fehlt das Wort".
 *   2. Das gepinnte Video (die abgefilmte Wisch/Reveal-Animation), das beim
 *      Runterscrollen ausblendet, aber an seinem Ort bleibt.
 *   3. Der SIGNATUR-MOMENT: die gehaltene Zahnrad-Skulptur (MorphSculpture
 *      comp=0), wie der Desktop-Kopf — in einer VOLL-VIEWPORT-Buehne, weil die
 *      Skulptur ihre Kamera/Positionen aus window.innerWidth/innerHeight baut
 *      und in einer kleinen Box ausserhalb des Sichtfensters landet (das war
 *      Thomas' "die Funktion mit dem Zahnrad fehlt" — vorher leere weisse Box).
 *      Muster 1:1 aus LeistungenStory (.rrls-sculpt-*), wo es bewiesen laeuft.
 *   4. Der Story-Text (1:1 aus dem Hero-Demo).
 *
 * Autoplay-Regeln: muted + playsInline + loop, sonst spielt iOS/Chrome das
 * Video nicht selbststaendig. Das Video ist rein dekorativ (aria-hidden); der
 * echte Satz steht im sichtbar-versteckten Teil des <h1> fuer SEO/Screenreader.
 */
export default function MobileVideoHero({ src }: { src: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay anstossen (manche Browser starten trotz autoplay-Attribut erst
  // nach explizitem play()).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // React setzt das `muted`-ATTRIBUT, aber nicht immer die muted-PROPERTY ->
    // iOS/Chrome sehen das Video dann als "mit Ton" und blocken Autoplay.
    // Property hier explizit setzen (bekannte React-Eigenheit).
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    // iOS-Stromsparmodus blockt Autoplay ganz -> beim ersten Antippen der Seite
    // nachstarten (dann laeuft es, sonst bleibt das Poster stehen).
    const onFirst = () => {
      tryPlay();
    };
    window.addEventListener("touchstart", onFirst, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", onFirst);
  }, []);

  // Fade beim Scrollen: das Wort + Video halten kurz voll, blenden dann ueber die
  // Track-Strecke aus. Sticky haelt sie an ihrem Ort. Liest nur die
  // Scroll-Position (kapert den Touch nicht), Muster wie Ablauf/StufenFahrt.
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;
    let raf = 0;
    let dead = false;
    const clamp = (n: number, a: number, b: number) => (n < a ? a : n > b ? b : n);
    const render = () => {
      const r = track.getBoundingClientRect();
      const denom = r.height - window.innerHeight;
      const q = denom > 0 ? clamp(-r.top / denom, 0, 1) : 0;
      // bis 0.15 voll sichtbar, dann linear auf 0 bis 0.85
      const o = 1 - clamp((q - 0.15) / 0.7, 0, 1);
      sticky.style.opacity = o.toFixed(3);
    };
    const loop = () => {
      if (dead) return;
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    render();
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };
  }, []);

  return (
    <div className="mvh">
      {/* 1+2 · Gepinntes Wort + Video, blendet beim Scrollen aus (bleibt am Ort). */}
      <div ref={trackRef} className="mvh__track">
        <div ref={stickyRef} className="mvh__sticky">
          <h1 className="mvh__word">
            <span aria-hidden="true">
              Website<span className="mvh__dot">.</span>
            </span>
            <span className="mvh__sr">
              Website. Schön kann fast jeder. Die Frage ist: ruft bei dir auch
              wer an?
            </span>
          </h1>
          <video
            ref={videoRef}
            className="mvh__video"
            src={src}
            poster="/hero/website-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 3 · Signatur-Moment: gehaltene Zahnrad-Skulptur (comp 0), voll-Viewport
          gebaut wie der Desktop-Kopf. navyPiece={false}: der dunkle Balken wirkt
          am Zahnrad wie eine Fremd-Linie (Thomas 21.07.). */}
      <div className="mvh__sculpt" aria-hidden="true">
        <div className="mvh__sculpt-sticky">
          <MorphSculpture
            comp={0}
            progress={0.55}
            ignoreGlobalProgress
            navyPiece={false}
            style={{ background: "transparent" }}
          />
          <p className="mvh__sculpt-msg">Sie arbeitet von Anfang an.</p>
        </div>
      </div>

      {/* 4 · Story-Text (1:1 aus dem Hero-Demo). */}
      <section className="mvh__story" aria-label="Die Website">
        <div className="mvh__text">
          <p className="mvh__eyebrow">DIE WEBSITE</p>
          <p className="mvh__statement">
            Eine Website, die nicht nur dasteht, sondern was tut.
          </p>
          <p className="mvh__ch">
            Die meiste Seite für den kleinen Betrieb kommt aus dem Baukasten. Du
            schiebst dir selbst ein paar Blöcke zurecht, klickst auf
            veröffentlichen und bist online. Nur: online sein ist halt das eine.
            Ob dich dann auch jemand findet und anruft, ist das andere.
          </p>
          <p className="mvh__ch">
            Wir bauen deine Seite von Hand, auf deinen Betrieb. Keine Vorlage, die
            tausend andere auch haben. Und das Beste merken die meisten erst
            später: das ganze Fundament ist bei uns von Anfang an dabei. Schnelles
            Hosting, sauber am Handy, rechtssicher nach österreichischem Recht, ein
            Kontaktformular, das direkt bei dir landet, und Grund-SEO, damit dich
            die Leute aus deiner Gegend überhaupt finden.
          </p>
          <p className="mvh__ch">
            Den Entwurf siehst du zuerst, entschieden wird erst danach. Und wenn
            die Seite live geht, gehört sie dir. Mit Domain, Texten und allen
            Zugängen. Kein Knebelvertrag, keine Miete, die im Hintergrund ewig
            weiterläuft.
          </p>
          <p className="mvh__close">
            Und noch was: sie kommt nicht allein. Ein digitaler Kollege ist schon
            dabei.
          </p>
          <p className="mvh__byline">
            Thomas Uhlir<span>Gründer</span>
          </p>
        </div>
      </section>

      <style>{`
        .mvh { background: var(--rr-surface, #f4f4f2); }
        .mvh__track {
          position: relative;
          width: 100%;
          height: 165svh;
        }
        .mvh__sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2.5svh, 26px);
          padding: max(64px, 9svh) 16px 16px;
          overflow: hidden;
          background: var(--rr-surface, #f4f4f2);
          will-change: opacity;
        }
        .mvh__word {
          margin: 0;
          font-family: "DM Sans", sans-serif;
          font-weight: 700;
          color: #23262e;
          font-size: clamp(3rem, 18vw, 6rem);
          line-height: 0.9;
          letter-spacing: -0.03em;
          text-align: center;
          white-space: nowrap;
        }
        .mvh__dot { color: #f12032; }
        .mvh__video {
          width: 100%;
          flex: 1 1 auto;
          min-height: 0;
          object-fit: contain;
          display: block;
          background: var(--rr-surface, #f4f4f2);
        }
        /* sichtbar-versteckt (SEO/A11y), nicht display:none */
        .mvh__sr {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0 0 0 0);
          white-space: nowrap; border: 0;
        }

        /* Signatur-Zahnrad: Muster aus LeistungenStory (.rrls-sculpt-*). Die
           Buehne MUSS voll-Viewport sein, sonst rendert die Skulptur ausserhalb
           des Sichtfensters (viewport-basierte Kamera). */
        .mvh__sculpt { position: relative; height: auto; }
        .mvh__sculpt-sticky {
          position: relative;
          height: 78svh;
          width: 100%;
          overflow: hidden;
          background: var(--rr-surface, #f4f4f2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mvh__sculpt-msg {
          position: relative; z-index: 2;
          margin: 0;
          font-family: var(--rr-font-serif, "Crimson Pro", Georgia, serif);
          font-style: italic;
          font-size: clamp(1.3rem, 6vw, 1.9rem);
          line-height: 1.15; color: #23262e;
          text-align: center; max-width: 16ch;
          background: rgba(244, 244, 242, 0.72);
          padding: 0.3em 0.6em;
          backdrop-filter: blur(2px);
        }

        .mvh__story {
          max-width: 720px;
          margin: 0 auto;
          padding: clamp(24px, 8vw, 64px) var(--rr-gutter, clamp(20px, 4vw, 64px))
            var(--rr-section-y, clamp(96px, 12vw, 180px));
          display: flex;
          flex-direction: column;
          gap: clamp(18px, 5vw, 30px);
        }
        .mvh__text { display: flex; flex-direction: column; gap: 16px; }
        .mvh__eyebrow {
          font-family: var(--rr-font-ui);
          font-size: 12px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--rr-red); margin: 0;
        }
        .mvh__statement {
          font-family: var(--rr-font-display);
          font-weight: 800;
          font-size: clamp(1.6rem, 7.5vw, 2.3rem);
          line-height: 1.08; letter-spacing: -0.01em;
          color: var(--rr-navy); margin: 0;
        }
        .mvh__ch {
          font-family: var(--rr-font-ui);
          font-size: clamp(1rem, 4vw, 1.12rem);
          line-height: 1.6; color: var(--rr-ink); margin: 0;
        }
        .mvh__close {
          font-family: var(--rr-font-serif, Georgia, serif);
          font-style: italic;
          font-size: clamp(1.05rem, 4.4vw, 1.2rem);
          line-height: 1.5; color: var(--rr-navy); margin: 6px 0 0;
        }
        .mvh__byline {
          font-family: var(--rr-font-ui);
          font-size: 14px; color: var(--rr-ink-soft); margin: 6px 0 0;
          display: flex; flex-direction: column;
        }
        .mvh__byline span { font-size: 12px; opacity: 0.7; }
      `}</style>
    </div>
  );
}
