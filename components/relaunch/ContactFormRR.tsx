"use client";

import { useState } from "react";
import Link from "next/link";

type Errors = Partial<Record<"name" | "email" | "message" | "dsgvo", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactFormRR() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    dsgvo: false,
    honeyPot: "",
  });

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
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Bitte gib eine gueltige E-Mail-Adresse an.";
    if (form.message.trim().length < 10) next.message = "Schreib uns kurz, worum es geht (mind. 10 Zeichen).";
    if (!form.dsgvo) next.dsgvo = "Bitte stimme der Datenschutzerklaerung zu.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company || undefined,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
          honeyPot: form.honeyPot,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setForm({ name: "", company: "", email: "", phone: "", message: "", dsgvo: false, honeyPot: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rr-card" style={{ background: "var(--rr-surface)", borderColor: "transparent" }}>
        <p className="rr-sub" style={{ marginBottom: 12 }}>Angekommen.</p>
        <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>
          Danke fuer deine Nachricht. Wir melden uns zeitnah bei dir, in der Regel am selben Werktag.
        </p>
        <button
          type="button"
          className="rr-link"
          style={{ marginTop: 24, background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onClick={() => setStatus("idle")}
        >
          Noch eine Nachricht schreiben
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "grid", gap: 20 }}>
      {/* Honeypot: fuer Menschen unsichtbar */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="rr-website">Website</label>
        <input
          id="rr-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeyPot}
          onChange={(e) => update("honeyPot", e.target.value)}
        />
      </div>

      <div className="rr-grid rr-grid-2">
        <div>
          <label className="rr-label" htmlFor="rr-name">Dein Name</label>
          <input
            id="rr-name"
            className="rr-field"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? "rr-name-err" : undefined}
            placeholder="Max Muster"
          />
          {errors.name ? (
            <p id="rr-name-err" className="rr-meta" style={{ color: "var(--rr-red)", marginTop: 8 }}>{errors.name}</p>
          ) : null}
        </div>
        <div>
          <label className="rr-label" htmlFor="rr-company">Firma (optional)</label>
          <input
            id="rr-company"
            className="rr-field"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Deine Firma"
          />
        </div>
      </div>

      <div className="rr-grid rr-grid-2">
        <div>
          <label className="rr-label" htmlFor="rr-email">E-Mail</label>
          <input
            id="rr-email"
            type="email"
            className="rr-field"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "rr-email-err" : undefined}
            placeholder="max@firma.at"
          />
          {errors.email ? (
            <p id="rr-email-err" className="rr-meta" style={{ color: "var(--rr-red)", marginTop: 8 }}>{errors.email}</p>
          ) : null}
        </div>
        <div>
          <label className="rr-label" htmlFor="rr-phone">Telefon (optional)</label>
          <input
            id="rr-phone"
            type="tel"
            className="rr-field"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+43 ..."
          />
        </div>
      </div>

      <div>
        <label className="rr-label" htmlFor="rr-message">Worum geht es?</label>
        <textarea
          id="rr-message"
          className="rr-field"
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "rr-message-err" : undefined}
          placeholder="Erzaehl kurz von deinem Betrieb und was du brauchst."
          style={{ resize: "vertical" }}
        />
        {errors.message ? (
          <p id="rr-message-err" className="rr-meta" style={{ color: "var(--rr-red)", marginTop: 8 }}>{errors.message}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rr-dsgvo" style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <input
            id="rr-dsgvo"
            type="checkbox"
            checked={form.dsgvo}
            onChange={(e) => update("dsgvo", e.target.checked)}
            aria-invalid={errors.dsgvo ? "true" : undefined}
            style={{ width: 20, height: 20, marginTop: 2, accentColor: "var(--rr-red)", flexShrink: 0 }}
          />
          <span className="rr-meta" style={{ color: "var(--rr-ink-soft)" }}>
            Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden.
            Details in der <Link href="/datenschutz" style={{ color: "var(--rr-ink)", textDecoration: "underline" }}>Datenschutzerklaerung</Link>.
          </span>
        </label>
        {errors.dsgvo ? (
          <p className="rr-meta" style={{ color: "var(--rr-red)", marginTop: 8 }}>{errors.dsgvo}</p>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="rr-btn rr-btn--primary" disabled={status === "sending"}>
          {status === "sending" ? "Wird gesendet ..." : "Anfrage senden"}
        </button>
        {status === "error" ? (
          <p className="rr-meta" style={{ color: "var(--rr-red)" }}>
            Das hat nicht geklappt. Bitte versuch es noch einmal oder ruf uns direkt an.
          </p>
        ) : null}
      </div>
    </form>
  );
}
