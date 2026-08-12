"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ============================================================
// GalleryChrome — DOM-Overlay der Referenzen-Galerie.
// Umsetzung nach DESIGN.md (Thomas 16.07.):
//   - Logo (Hasenkopf) oben links in MARKENROT
//   - Buttons = rr-btn-outline--light (Button-System 28.07.: Sweep primaer +
//     Outline sekundaer) fuer Let's talk + Nav; CTAs in den Karten =
//     rr-btn-sweep--red (Primaer-CTA-Rolle). Zwei Effekt-Stile, mehr nicht.
//   - Let's-talk-Overlay: durchsichtiger Blur-Grund bleibt,
//     Karten sind PAPER-Karten im rr-card-layer-Duktus
//     (Layer-Schatten + roter Innen-Balken, rote Eyebrows).
//   - Telefonnummer NIE im Klartext — nur "Anrufen"-Button
//     mit tel:-Link (Thomas-Dauerregel, Memory).
// ============================================================

const EMAIL = "office@redrabbit.media";
const PHONE_TEL = "+436769000955"; // nur im tel:-Link, nie sichtbar

// Helle Outline-Sekundaerbuttons (Button-System 28.07.) fuer die Galerie-
// Buehne (immer auf dunklem/photografischem Grund). `tone` markiert die
// aktuelle Seite rot statt hell (Border + Text).
function FrameBtn({
  href,
  onClick,
  children,
  tone,
  current = false,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: string;
  current?: boolean;
}) {
  const cls = `rr-btn-outline rr-btn-outline--light rf-frame${current ? " rf-frame--current" : ""}`;
  const style = tone ? ({ borderColor: tone, color: tone } as React.CSSProperties) : undefined;
  if (href) {
    return (
      <Link
        className={cls}
        style={style}
        href={href}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {children}
    </button>
  );
}

export default function GalleryChrome() {
  const [talkOpen, setTalkOpen] = useState(false);

  useEffect(() => {
    if (!talkOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTalkOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [talkOpen]);

  return (
    <>
      {/* Ecken-Logo wird jetzt seitenweit von <CornerLogo /> gerendert
          (app/referenzen/page.tsx), damit Groesse/Position
          und das verzoegerte Einblenden auf allen Seiten identisch sind. */}

      {/* Let's talk oben rechts, links neben dem Burger des RelaunchMenu */}
      <div
        style={{
          position: "absolute",
          top: "clamp(18px, 2.4vw, 34px)",
          right: "calc(clamp(18px, 2.4vw, 40px) + 64px)",
          zIndex: 5,
        }}
      >
        <FrameBtn onClick={() => setTalkOpen(true)}>Let&#8217;s talk</FrameBtn>
      </div>

      {/* Nav mittig unten: Eck-Rahmen-Buttons, aktive Seite rot markiert */}
      <nav
        className="rf-gal-nav"
        aria-label="Galerie-Navigation"
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          gap: 14,
        }}
      >
        <FrameBtn href="/">Start</FrameBtn>
        <FrameBtn href="/referenzen" current>
          Referenzen
        </FrameBtn>
        <FrameBtn href="/kontakt">Kontakt</FrameBtn>
      </nav>

      {/* Let's-talk-Overlay: Blur-Grund (bleibt), Karten neu im
          DESIGN.md-Stil (Paper, Layer-Schatten, roter Innen-Balken). */}
      {talkOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Let's talk"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1002,
            background: "rgba(12, 14, 20, 0.72)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            overflowY: "auto",
            padding:
              "calc(var(--rr-gutter) + 48px) var(--rr-gutter) var(--rr-gutter)",
          }}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setTalkOpen(false)}
            aria-label="Schliessen"
            className="rf-talk-close"
          >
            &#215;
          </button>

          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <p
              className="rr-eyebrow-lg"
              style={{ color: "var(--rr-red)", marginBottom: 14 }}
            >
              Let&#8217;s talk
            </p>
            <p
              className="rr-display-2"
              style={{ color: "#f4f4f2", marginBottom: 48, maxWidth: "22ch" }}
            >
              Willkommen! Schön, dich zu treffen.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              <TalkCard eyebrow="Zusammenarbeit" line="Ich will eine Website von euch.">
                <Link
                  className="rr-btn-sweep rr-btn-sweep--red"
                  href="/kontakt"
                >
                  Projekt anfragen
                </Link>
              </TalkCard>

              <TalkCard eyebrow="Team" line="Ich will bei euch mitbauen.">
                <a
                  className="rr-btn-sweep rr-btn-sweep--navy"
                  href={`mailto:${EMAIL}?subject=Team%20Red%20Rabbit`}
                >
                  E-Mail schreiben
                </a>
              </TalkCard>

              <TalkCard eyebrow="Sonst was" line="Einfach Hallo sagen.">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                  <a className="rf-talk-mail" href={`mailto:${EMAIL}`}>
                    {EMAIL}
                  </a>
                  <a className="rr-btn-sweep rr-btn-sweep--red" href={`tel:${PHONE_TEL}`}>
                    Anrufen
                  </a>
                </div>
              </TalkCard>
            </div>

            <p style={{ marginTop: 40 }}>
              <Link
                href="/datenschutz"
                style={{
                  color: "#c7c9cf",
                  fontSize: 14,
                  textDecorationColor: "rgba(246,245,241,0.4)",
                }}
              >
                Datenschutz
              </Link>
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Eck-Rahmen-Buttons kompakt fuer die Galerie-Buehne */
        .rr .rf-frame {
          padding: 13px 22px;
          font-size: 14.5px;
          background: rgba(11, 16, 23, 0.35);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        /* Aktive Seite: Rahmen/Text dauerhaft rot statt hell */
        .rr .rf-frame--current {
          border-color: var(--rr-red);
          color: var(--rr-red);
        }
        .rf-talk-close {
          position: fixed;
          top: clamp(18px, 2.4vw, 34px);
          right: clamp(18px, 2.4vw, 40px);
          width: 44px;
          height: 44px;
          padding: 0;
          background: transparent;
          color: #f4f4f2;
          border: 1.5px solid rgba(246, 245, 241, 0.4);
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
        }
        .rf-talk-close:hover {
          background: var(--rr-red);
          border-color: var(--rr-red);
        }
        /* Paper-Karten im rr-card-layer-Duktus (DESIGN.md §10) */
        .rf-talk-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 300px;
          padding: 30px 30px 28px;
          background: var(--rr-paper);
          box-shadow:
            rgba(5, 8, 12, 0.45) 0 24px 80px,
            var(--rr-red) 0 -3px 0 inset;
        }
        .rf-talk-mail {
          color: var(--rr-ink);
          font-size: 15px;
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--rr-red) 55%, transparent);
          text-underline-offset: 4px;
        }
        .rf-talk-mail:hover {
          color: var(--rr-red);
        }
        /* Mobile: Claim + Hinweistext weichen, Nav wird kompakt */
        @media (max-width: 700px) {
          .rf-gal-claim {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .rf-gal-meta {
            display: none;
          }
          .rr .rf-gal-nav {
            gap: 8px;
          }
          .rr .rf-frame {
            padding: 11px 14px;
            font-size: 12.5px;
          }
        }
      `}</style>
    </>
  );
}

function TalkCard({
  eyebrow,
  line,
  children,
}: {
  eyebrow: string;
  line: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rf-talk-card">
      <div>
        <p className="rr-eyebrow" style={{ color: "var(--rr-red)", marginBottom: 18 }}>
          {eyebrow}
        </p>
        <p className="rr-claim" style={{ maxWidth: "14ch" }}>
          {line}
        </p>
      </div>
      <div style={{ marginTop: 28 }}>{children}</div>
    </div>
  );
}
