"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RabbitMark } from "@/components/relaunch/RabbitMark";

// ============================================================
// GalleryChrome — DOM-Overlay der Referenzen-Galerie
// (phantom.land-Anmutung, aber in unserem Stil / Eckig-Gesetz):
//   - Logo (Hasenkopf) oben links, weiss auf dunkler Buehne
//   - "Let's talk"-Button oben rechts (links neben dem Burger-
//     Menue des RelaunchMenu, das fix oben rechts sitzt)
//   - Nav-Buttons mittig unten (unsere ondark-Buttonklassen,
//     KEINE Pillen-Form — Thomas 15.07.: bestehende Buttons)
//   - Let's-talk-Overlay: 3 Karten wie beim Original, Inhalte
//     verifiziert von der Live-Site (office@redrabbit.media,
//     +43 676 9000 955 — Impressum web.redrabbit.media 15.07.)
// ============================================================

const EMAIL = "office@redrabbit.media";
const PHONE_DISPLAY = "+43 676 9000 955";
const PHONE_TEL = "+436769000955";

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
      {/* Logo oben links */}
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
        <RabbitMark color="#f6f5f1" className="rf-gal-logo" />
      </Link>

      {/* Let's talk oben rechts, links neben dem Burger des RelaunchMenu */}
      <button
        type="button"
        className="rr-btn rr-btn--ondark"
        onClick={() => setTalkOpen(true)}
        style={{
          position: "absolute",
          top: "clamp(18px, 2.4vw, 34px)",
          right: "calc(clamp(18px, 2.4vw, 40px) + 72px)",
          zIndex: 5,
        }}
      >
        Let&#8217;s talk
      </button>

      {/* Nav-Buttons mittig unten */}
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
          gap: 10,
        }}
      >
        <Link className="rr-btn rr-btn--ondark-ghost" href="/relaunch-preview">
          Start
        </Link>
        <span className="rr-btn rr-btn--ondark" aria-current="page" style={{ cursor: "default" }}>
          Referenzen
        </span>
        <Link className="rr-btn rr-btn--ondark-ghost" href="/relaunch-preview/kontakt">
          Kontakt
        </Link>
      </nav>

      {/* Let's-talk-Overlay: 3 Karten wie das Original, in unserem Stil */}
      {talkOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Let's talk"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1002,
            background: "rgba(12, 14, 20, 0.78)",
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
            style={{
              position: "fixed",
              top: "clamp(18px, 2.4vw, 34px)",
              right: "clamp(18px, 2.4vw, 40px)",
              width: 44,
              height: 44,
              padding: 0,
              background: "transparent",
              color: "#f6f5f1",
              border: "1.5px solid rgba(246,245,241,0.4)",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            &#215;
          </button>

          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <p className="rr-eyebrow-lg" style={{ color: "#c7c9cf", marginBottom: 14 }}>
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
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <TalkCard eyebrow="Zusammenarbeit" line="Ich will eine Website von euch.">
                <Link
                  href="/relaunch-preview/kontakt"
                  aria-label="Zum Kontaktformular"
                  className="rf-talk-arrow"
                >
                  &#8594;
                </Link>
              </TalkCard>

              <TalkCard eyebrow="Team" line="Ich will bei euch mitbauen.">
                <a
                  href={`mailto:${EMAIL}?subject=Team%20Red%20Rabbit`}
                  aria-label="E-Mail ans Team schreiben"
                  className="rf-talk-arrow"
                >
                  &#8594;
                </a>
              </TalkCard>

              <TalkCard eyebrow="Sonst was" line="Einfach Hallo sagen.">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <a className="rf-talk-chip" href={`mailto:${EMAIL}`}>
                    <span>E-Mail</span>
                    {EMAIL}
                  </a>
                  <a className="rf-talk-chip" href={`tel:${PHONE_TEL}`}>
                    <span>Telefon</span>
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </TalkCard>
            </div>

            <p style={{ marginTop: 40 }}>
              <Link
                href="/datenschutz"
                style={{ color: "#c7c9cf", fontSize: 14, textDecorationColor: "rgba(246,245,241,0.4)" }}
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
            .rf-talk-arrow {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 52px;
              height: 52px;
              border: 1.5px solid rgba(246, 245, 241, 0.45);
              color: #f6f5f1;
              font-size: 22px;
              text-decoration: none;
              transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
            }
            .rf-talk-arrow:hover {
              background: var(--rr-red);
              border-color: var(--rr-red);
              color: #fff;
            }
            .rf-talk-chip {
              display: inline-flex;
              flex-direction: column;
              gap: 4px;
              padding: 10px 14px;
              border: 1.5px solid rgba(246, 245, 241, 0.3);
              background: rgba(246, 245, 241, 0.08);
              color: #f6f5f1;
              font-size: 13.5px;
              text-decoration: none;
              transition: border-color 0.25s ease, background 0.25s ease;
            }
            .rf-talk-chip span {
              font-size: 11px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #c7c9cf;
            }
            .rf-talk-chip:hover {
              border-color: rgba(246, 245, 241, 0.7);
              background: rgba(246, 245, 241, 0.14);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 300,
        padding: "26px 26px 24px",
        border: "1px solid rgba(246, 245, 241, 0.22)",
        background: "rgba(18, 21, 30, 0.55)",
      }}
    >
      <div>
        <p
          className="rr-eyebrow"
          style={{ color: "#c7c9cf", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--rr-red)",
              display: "inline-block",
            }}
          />
          {eyebrow}
        </p>
        <p className="rr-claim" style={{ color: "#f6f5f1", maxWidth: "14ch" }}>{line}</p>
      </div>
      <div style={{ marginTop: 28 }}>{children}</div>
    </div>
  );
}
