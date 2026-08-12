"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  resolveLeadConfig,
  SERVICE_OPTIONS,
  type LeadOpenOpts,
} from "@/lib/relaunch/leadPresets";
import LeadSelect from "./LeadSelect";
import { sendGAEvent } from "@next/third-parties/google";
// Das Popup kann global (auch auf Seiten ohne eigenen styleguide-Import)
// aufgehen. Es traegt sein eigenes .rr-Design-System mit, damit rr-field/
// rr-label/rr-select-native/rr-btn-sweep IMMER greifen. Via LeadProvider
// lazy geladen -> dieses CSS kommt nur, wenn das Popup wirklich rendert.
import "@/app/styleguide/styleguide.css";

/**
 * Wiederverwendbares Anfrage-Popup fuer ALLE Lead-CTAs im Relaunch
 * (Thomas 06.08.2026). Kurzformular auf die echte /api/contact-Route
 * (nodemailer -> IONOS-SMTP, Felder name/company/email/phone/service/message/
 * honeyPot). KEIN Nachbau des alten Tailwind-Modals: nutzt die echten
 * Styleguide-Klassen (rr-field, rr-label, rr-select-native, rr-btn-sweep,
 * rr-formnote) im .rr-Scope.
 *
 * Praesentiert via LeadProvider: der oeffnet das Popup je nach geklicktem
 * Button mit einem Preset (Standard / Paket / Talos / Analyse / Quiz-Ergebnis).
 *
 * Fehlertolerant: schlaegt der Versand fehl (z.B. SMTP nicht konfiguriert ->
 * 500), zeigt das Popup sofort den direkten Anruf-/Mail-Weg, damit nie ein
 * Lead ins Leere laeuft.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL = "+436769000955";
const TEL_HREF = "tel:+436769000955";
const MAIL = "office@redrabbit.media";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "url" | "dsgvo", string>>;

export default function LeadDialog({
  opts,
  onClose,
}: {
  opts: LeadOpenOpts;
  onClose: () => void;
}) {
  const cfg = useMemo(() => resolveLeadConfig(opts), [opts]);
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: cfg.service,
    url: "",
    message: cfg.messagePrefill,
    dsgvo: false,
    honeyPot: "",
  });

  // ESC schliesst, Body-Scroll sperren, Fokus ins Panel.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Fokus nach dem Mount setzen (naechster Frame, sonst greift es nicht).
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [onClose]);

  // Wenn das Dropdown einen vorbefuellten service hat, der nicht in der Liste
  // steht (z.B. "Paket Business (2.850 EUR)"), zeigen wir ihn als erste Option.
  const serviceOptions = useMemo(() => {
    if (cfg.service && !SERVICE_OPTIONS.includes(cfg.service)) {
      return [cfg.service, ...SERVICE_OPTIONS];
    }
    return SERVICE_OPTIONS;
  }, [cfg.service]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof Errors];
        return next;
      });
    }
  }

  function validate(): boolean {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Bitte gib deinen Namen an.";
    if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Bitte gib eine gültige E-Mail-Adresse an.";
    if (cfg.showUrl && form.url.trim().length < 3)
      next.url = "Bitte gib deine aktuelle Website an.";
    if (!form.dsgvo) next.dsgvo = "Bitte stimme der Datenschutzerklärung zu.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    // Nachricht zusammensetzen: optionaler Vorbefuell-Text (Quiz-Empfehlung),
    // die aktuelle Website (Analyse-Variante) und der Freitext des Nutzers.
    const parts: string[] = [];
    if (cfg.messagePrefill) parts.push(cfg.messagePrefill);
    if (cfg.showUrl && form.url.trim()) parts.push(`Aktuelle Website: ${form.url.trim()}`);
    if (form.message.trim()) parts.push(form.message.trim());
    const message = parts.join("\n\n");

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          service: form.service || undefined,
          message: message || undefined,
          honeyPot: form.honeyPot,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      // GA4-Conversion: erfolgreicher Lead aus dem Anfrage-Popup. Feldnamen
      // konsistent zu ContactForm.tsx (form_location + page_path); page_path
      // ordnet den Lead der Seite zu, von der aus das Popup gesendet wurde.
      // Wird NUR hier gefeuert (LeadProvider feuert nur contact_form_open),
      // damit pro Submit genau EIN generate_lead entsteht.
      try {
        sendGAEvent("event", "generate_lead", {
          form_location: "lead_dialog",
          page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        });
      } catch {
        /* analytics must never break the form */
      }
    } catch {
      setStatus("error");
    }
  }

  const nameId = `${uid}-name`;
  const emailId = `${uid}-email`;
  const phoneId = `${uid}-phone`;
  const serviceId = `${uid}-service`;
  const urlId = `${uid}-url`;
  const messageId = `${uid}-message`;
  const dsgvoId = `${uid}-dsgvo`;
  const titleId = `${uid}-title`;

  return (
    <div
      className="rr rrlead-overlay"
      role="presentation"
      onMouseDown={(e) => {
        // Nur ein Klick auf den Hintergrund (nicht das Panel) schliesst.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="rrlead-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="rrlead-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          &times;
        </button>

        {status === "success" ? (
          <div className="rrlead-body">
            <div className="rrlead-eyebrow">Ohne Vorkasse</div>
            <h2 id={titleId} className="rrlead-title">
              Angekommen. Danke.
            </h2>
            <p className="rrlead-sub">
              Wir schauen uns deinen Betrieb an und melden uns bei dir, in der Regel
              am selben Werktag. Die ersten 1-2 Vorschläge entstehen ohne Vorkasse. Kein
              Verkaufsdruck, versprochen.
            </p>
            <div className="rrlead-actions">
              <button type="button" className="rr-btn-sweep rr-btn-sweep--red" onClick={onClose}>
                Schließen
              </button>
            </div>
          </div>
        ) : (
          <form className="rrlead-body" onSubmit={onSubmit} noValidate>
            <div className="rrlead-eyebrow">Ohne Vorkasse</div>
            <h2 id={titleId} className="rrlead-title">
              {cfg.title}
            </h2>
            <p className="rrlead-sub">{cfg.sub}</p>

            {/* Honeypot: fuer Menschen unsichtbar */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
            >
              <label htmlFor={`${uid}-website`}>Website</label>
              <input
                id={`${uid}-website`}
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeyPot}
                onChange={(e) => update("honeyPot", e.target.value)}
              />
            </div>

            <div className="rrlead-form">
              <div className="rrlead-row">
                <div>
                  <label className="rr-label" htmlFor={nameId}>
                    Dein Name
                  </label>
                  <input
                    id={nameId}
                    className="rrlead-field"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? `${nameId}-err` : undefined}
                    placeholder="Max Muster"
                    autoComplete="name"
                  />
                  {errors.name ? (
                    <p id={`${nameId}-err`} className="rr-error">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="rr-label" htmlFor={emailId}>
                    E-Mail
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    className="rrlead-field"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? `${emailId}-err` : undefined}
                    placeholder="max@firma.at"
                    autoComplete="email"
                  />
                  {errors.email ? (
                    <p id={`${emailId}-err`} className="rr-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rrlead-row">
                <div>
                  <label className="rr-label" htmlFor={phoneId}>
                    Telefon (optional)
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    className="rrlead-field"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+43 ..."
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="rr-label" htmlFor={serviceId}>
                    Worum geht&apos;s?
                  </label>
                  <LeadSelect
                    id={serviceId}
                    value={form.service}
                    options={serviceOptions}
                    placeholder="Bitte wählen"
                    onChange={(v) => update("service", v)}
                  />
                </div>
              </div>

              {cfg.showUrl ? (
                <div>
                  <label className="rr-label" htmlFor={urlId}>
                    Deine aktuelle Website
                  </label>
                  <input
                    id={urlId}
                    type="text"
                    inputMode="url"
                    className="rrlead-field"
                    value={form.url}
                    onChange={(e) => update("url", e.target.value)}
                    aria-invalid={errors.url ? "true" : undefined}
                    aria-describedby={errors.url ? `${urlId}-err` : undefined}
                    placeholder="www.deine-seite.at"
                    autoComplete="url"
                  />
                  {errors.url ? (
                    <p id={`${urlId}-err`} className="rr-error">
                      {errors.url}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label className="rr-label" htmlFor={messageId}>
                  Kurz {cfg.showUrl ? "(optional)" : "(optional)"}
                </label>
                <textarea
                  id={messageId}
                  className="rrlead-field rrlead-area"
                  rows={3}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Was machst du, und was soll die Seite für dich tun?"
                />
              </div>

              <label
                htmlFor={dsgvoId}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
              >
                <input
                  id={dsgvoId}
                  type="checkbox"
                  checked={form.dsgvo}
                  onChange={(e) => update("dsgvo", e.target.checked)}
                  aria-invalid={errors.dsgvo ? "true" : undefined}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: "var(--rr-red)", flexShrink: 0 }}
                />
                <span className="rrlead-consent">
                  Ich bin einverstanden, dass wir meine Angaben zur Bearbeitung der Anfrage
                  verwenden. Details in der{" "}
                  <Link href="/datenschutz" style={{ color: "var(--rr-ink)", textDecoration: "underline" }}>
                    Datenschutzerklärung
                  </Link>
                  .
                </span>
              </label>
              {errors.dsgvo ? <p className="rr-error">{errors.dsgvo}</p> : null}

              <div className="rrlead-actions">
                <button
                  type="submit"
                  className="rr-btn-sweep rr-btn-sweep--red rrlead-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Wird gesendet ..." : cfg.submitLabel}
                </button>
                <a href={TEL_HREF} className="rr-btn-outline">
                  Anrufen
                </a>
              </div>

              {status === "error" ? (
                <div className="rr-formnote rr-formnote--error" role="alert">
                  Das hat gerade nicht geklappt. Ruf uns direkt an unter{" "}
                  <a href={TEL_HREF} style={{ color: "inherit", textDecoration: "underline" }}>
                    {TEL}
                  </a>{" "}
                  oder schreib an{" "}
                  <a href={`mailto:${MAIL}`} style={{ color: "inherit", textDecoration: "underline" }}>
                    {MAIL}
                  </a>
                  .
                </div>
              ) : null}
            </div>
          </form>
        )}
      </div>

      {/* Plain globales style-Tag, namespaced (LESSONS_LEARNED: styled-jsx im
          Relaunch meiden). Tokens kommen aus dem .rr-Scope am Overlay-Root. */}
      <style>{`
        .rrlead-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 4vw, 40px);
          background: rgba(20, 26, 34, 0.55);
          -webkit-backdrop-filter: blur(3px);
          backdrop-filter: blur(3px);
          overflow-y: auto;
          animation: rrlead-fade 0.22s var(--rr-ease, ease);
        }
        .rrlead-panel {
          position: relative;
          width: min(560px, 100%);
          max-height: calc(100dvh - clamp(24px, 8vw, 80px));
          overflow-y: auto;
          background: var(--rr-paper, #fff);
          border: 1px solid var(--rr-line, #e4e4e0);
          box-shadow: 0 40px 90px -40px rgba(20, 26, 34, 0.6);
          outline: none;
          animation: rrlead-rise 0.28s var(--rr-ease, ease);
        }
        .rrlead-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          width: 40px;
          height: 40px;
          font-size: 26px;
          line-height: 1;
          color: var(--rr-ink, #23262e);
          background: var(--rr-paper, #fff);
          border: 1px solid var(--rr-line, #e4e4e0);
          border-radius: 50%;
          cursor: pointer;
          transition: border-color var(--rr-t-fast, 0.2s) var(--rr-ease, ease), color var(--rr-t-fast, 0.2s) var(--rr-ease, ease);
        }
        .rrlead-close:hover { border-color: var(--rr-ink, #23262e); color: var(--rr-red, #f12032); }
        .rrlead-body { padding: clamp(28px, 5vw, 48px) clamp(22px, 4.5vw, 44px) clamp(24px, 4.5vw, 40px); }
        .rrlead-eyebrow {
          font-family: var(--rr-font-ui, "Instrument Sans"), sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rr-red, #f12032);
          margin: 0 0 12px;
        }
        .rrlead-title {
          font-family: var(--rr-font-display, "DM Sans"), sans-serif;
          font-size: clamp(24px, 3.4vw, 32px);
          font-weight: 640;
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: var(--rr-ink, #23262e);
          margin: 0 0 12px;
        }
        .rrlead-sub {
          font-family: var(--rr-font-ui, "Instrument Sans"), sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: var(--rr-ink-soft, #5a5e68);
          margin: 0 0 24px;
          max-width: 44ch;
        }
        .rrlead-form { display: grid; gap: 20px; }
        .rrlead-row { display: grid; gap: 20px; grid-template-columns: 1fr 1fr; }
        /* Felder = Unterstrich statt Kasten (Stil aus dem Kontakt-Formular
           .k-field): keine Umrandung, eine 2px-Linie unten, die beim Fokus
           von Grau auf Rot waechst. */
        .rrlead-field {
          width: 100%;
          font-family: var(--rr-font-ui, "Instrument Sans"), sans-serif;
          font-size: 16px;
          color: var(--rr-ink, #23262e);
          background:
            linear-gradient(var(--rr-red, #f12032), var(--rr-red, #f12032)) left bottom / 0 2px no-repeat,
            linear-gradient(rgba(35, 38, 46, 0.2), rgba(35, 38, 46, 0.2)) left bottom / 100% 2px no-repeat;
          border: none;
          outline: none;
          border-radius: 0;
          padding: 9px 2px 10px;
          transition: background-size 0.45s var(--rr-ease, ease);
        }
        .rrlead-field::placeholder { color: rgba(35, 38, 46, 0.66); }
        .rrlead-field:focus { background-size: 100% 2px, 100% 2px; }
        .rrlead-field[aria-invalid="true"] {
          background: linear-gradient(var(--rr-red, #f12032), var(--rr-red, #f12032)) left bottom / 100% 2px no-repeat;
        }
        .rrlead-area { min-height: 84px; line-height: 1.5; resize: vertical; }
        /* Marken-Dropdown (LeadSelect): Trigger = Unterstrich wie die uebrigen
           Felder; das offene Menue kommt aus styleguide.css (.rr-select__menu /
           .rr-select__opt) statt aus dem dunklen OS-Menue (Thomas 07.08.). */
        .rrlead-selectwrap { position: relative; display: block; width: 100%; }
        .rrlead-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          font-family: var(--rr-font-ui, "Instrument Sans"), sans-serif;
          font-size: 16px;
          text-align: left;
          color: var(--rr-ink, #23262e);
          cursor: pointer;
          border: none;
          outline: none;
          border-radius: 0;
          padding: 9px 2px 10px;
          background:
            linear-gradient(var(--rr-red, #f12032), var(--rr-red, #f12032)) left bottom / 0 2px no-repeat,
            linear-gradient(rgba(35, 38, 46, 0.2), rgba(35, 38, 46, 0.2)) left bottom / 100% 2px no-repeat;
          transition: background-size 0.45s var(--rr-ease, ease);
        }
        .rrlead-trigger:focus-visible,
        .rrlead-trigger[aria-expanded="true"] { background-size: 100% 2px, 100% 2px; }
        .rrlead-trigger-val { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rrlead-trigger-val--ph { color: rgba(35, 38, 46, 0.66); }
        .rrlead-trigger-chev {
          flex: 0 0 auto;
          color: var(--rr-ink-soft, #5a5e68);
          transition: transform var(--rr-t-med, 0.3s) var(--rr-ease, ease);
        }
        .rrlead-trigger[aria-expanded="true"] .rrlead-trigger-chev { transform: rotate(180deg); }
        .rrlead-consent {
          font-family: var(--rr-font-ui, "Instrument Sans"), sans-serif;
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--rr-ink-soft, #5a5e68);
        }
        .rrlead-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
        /* Primaerer CTA kraeftiger: rr-btn-sweep ist in Ruhe transparent mit
           5px-Balken; hier von Anfang an voll rot gefuellt, weisser Text, mehr
           Praesenz. Sweep-Farbwelt bleibt, nur der Ruhezustand ist gefuellt. */
        .rr .rrlead-submit { color: #fff; padding: 14px 34px; letter-spacing: 0.005em; }
        .rr .rrlead-submit::before { width: 100%; }
        .rr .rrlead-submit:hover { color: #fff; box-shadow: 0 12px 30px rgba(241, 32, 50, 0.42); }
        .rr .rrlead-submit:hover::before { width: 100%; background: var(--rr-red-deep, #c81222); }
        .rr .rrlead-submit:disabled { opacity: 0.6; cursor: default; }
        .rr .rrlead-submit:disabled:hover { box-shadow: none; }
        .rr .rrlead-submit:disabled:hover::before { background: var(--rr-red, #f12032); }
        @media (max-width: 560px) {
          .rrlead-row { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rrlead-overlay, .rrlead-panel { animation: none; }
        }
        @keyframes rrlead-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rrlead-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
