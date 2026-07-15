"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

// ============================================================
// GalleryChrome — DOM-Overlay der Referenzen-Galerie.
// Umsetzung nach DESIGN.md (Thomas 16.07.):
//   - Logo (Hasenkopf) oben links in MARKENROT
//   - Buttons = rr-btn-frame (Eck-Rahmen, DESIGN.md §8) fuer
//     Let's talk + Nav; CTAs in den Karten = rr-btn-sweep--red
//     (Primaer-CTA-Rolle). Zwei Effekt-Stile, mehr nicht.
//   - Let's-talk-Overlay: durchsichtiger Blur-Grund bleibt,
//     Karten sind PAPER-Karten im rr-card-layer-Duktus
//     (Layer-Schatten + roter Innen-Balken, rote Eyebrows).
//   - Telefonnummer NIE im Klartext — nur "Anrufen"-Button
//     mit tel:-Link (Thomas-Dauerregel, Memory).
// ============================================================

const EMAIL = "office@redrabbit.media";
const PHONE_TEL = "+436769000955"; // nur im tel:-Link, nie sichtbar

// Eck-Rahmen-Button (DESIGN.md §8): vier <i class="c1..c4"> + Label.
// `tone` steuert die Farbe ueber die CSS-Var --c.
function FrameBtn({
  href,
  onClick,
  children,
  tone = "#f6f5f1",
  current = false,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: string;
  current?: boolean;
}) {
  const cls = `rr-btn-frame rf-frame${current ? " rf-frame--current" : ""}`;
  const style = { "--c": tone } as React.CSSProperties;
  const inner = (
    <>
      <i className="c1" />
      <i className="c2" />
      <i className="c3" />
      <i className="c4" />
      <span className="rr-btn-frame__t">{children}</span>
    </>
  );
  if (href) {
    return (
      <Link
        className={cls}
        style={style}
        href={href}
        aria-current={current ? "page" : undefined}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {inner}
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
      {/* Logo oben links — Markenrot (Thomas 16.07.) */}
      <Link
        href="/relaunch-preview"
        aria-label="Zur Startseite"
        style={{
          position: "absolute",
          top: "clamp(18px, 2.4vw, 34px)",
          left: "var(--rr-gutter)",
          zIndex: 5,
          display: "block",
          lineHeight: 0,
        }}
      >
        <RabbitMark className="rf-gal-logo" />
      </Link>

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
        <FrameBtn href="/relaunch-preview">Start</FrameBtn>
        <FrameBtn href="/relaunch-preview/referenzen" tone="var(--rr-red)" current>
          Referenzen
        </FrameBtn>
        <FrameBtn href="/relaunch-preview/kontakt">Kontakt</FrameBtn>
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
              style={{ color: "#f6f5f1", marginBottom: 48, maxWidth: "22ch" }}
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
                  href="/relaunch-preview/kontakt"
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
        .rf-gal-logo {
          width: clamp(30px, 3vw, 40px);
          height: auto;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.45));
        }
        /* Eck-Rahmen-Buttons kompakt fuer die Galerie-Buehne */
        .rr .rf-frame {
          padding: 13px 22px;
          font-size: 14.5px;
          background: rgba(11, 16, 23, 0.35);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        /* Aktive Seite: Rahmen dauerhaft geschlossen */
        .rr .rf-frame--current i {
          width: 50%;
          height: 50%;
        }
        .rf-talk-close {
          position: fixed;
          top: clamp(18px, 2.4vw, 34px);
          right: clamp(18px, 2.4vw, 40px);
          width: 44px;
          height: 44px;
          padding: 0;
          background: transparent;
          color: #f6f5f1;
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
