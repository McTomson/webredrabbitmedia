"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Cookie-Einstellungen im Relaunch-Look (Preview). Die Consent-LOGIK ist
 * 1:1 aus app/cookie-einstellungen/CookieEinstellungenClient.tsx kopiert
 * (Storage-Key "redrabbit-cookie-consent", gtag consent update mit
 * analytics_storage/ad_storage) — funktional identisch zum Live-Stand und
 * kompatibel mit components/CookieBanner.tsx. Nur Markup/Styling neu (rrl-).
 */

interface ConsentData {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

declare global {
  interface Window {
    gtag: (...args: Array<string | object | Date>) => void;
  }
}

export default function CookieEinstellungenPreview() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current preferences
    const cookieConsent = localStorage.getItem("redrabbit-cookie-consent");
    if (cookieConsent) {
      const consent = JSON.parse(cookieConsent);
      setPreferences({
        necessary: true, // Always true
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
      });
    }
  }, []);

  const updateGTMConsent = (consent: ConsentData) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: consent.analytics ? "granted" : "denied",
        ad_storage: consent.marketing ? "granted" : "denied",
      });
    }
  };

  const savePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("redrabbit-cookie-consent", JSON.stringify(consent));
    updateGTMConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPrefs);
    const consent = {
      ...newPrefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("redrabbit-cookie-consent", JSON.stringify(consent));
    updateGTMConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const rejectAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPrefs);
    const consent = {
      ...newPrefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("redrabbit-cookie-consent", JSON.stringify(consent));
    updateGTMConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="rrl-wrap">
      <header className="rrl-head">
        <span className="rrl-label">(Rechtliches)</span>
        <h1>
          Cookie-Einstellungen<span className="rrl-dot">.</span>
        </h1>
        <p>Verwalte deine Datenschutz-Präferenzen.</p>
      </header>

      <div className="rrl-body">
        <section>
          <div className="rrl-consent-row">
            <h2>Technisch notwendige Cookies</h2>
            <span className="rrl-badge">Immer aktiv</span>
          </div>
          <p>
            Diese Cookies sind für die grundlegenden Funktionen der Website erforderlich und können
            nicht deaktiviert werden. Sie werden normalerweise nur als Reaktion auf von dir
            durchgeführte Aktionen gesetzt, wie z.B.:
          </p>
          <ul>
            <li>Speicherung deiner Cookie-Einstellungen</li>
            <li>Session-Management</li>
            <li>Sicherheitsfunktionen</li>
            <li>Formular-Funktionalität</li>
          </ul>
        </section>

        <section>
          <div className="rrl-consent-row">
            <h2>Analytics-Cookies</h2>
            <label className="rrl-switch">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
                aria-label="Analytics-Cookies erlauben"
              />
              <span className="rrl-switch-track" />
            </label>
          </div>
          <p>
            Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren,
            indem sie Informationen anonym sammeln und melden.
          </p>
          <div className="rrl-tool">
            <h4>Google Analytics 4</h4>
            <p>
              <strong>Anbieter:</strong> Google Ireland Limited
            </p>
            <p>
              <strong>Zweck:</strong> Analyse des Nutzerverhaltens, Verbesserung der Website
            </p>
            <p>
              <strong>Speicherdauer:</strong> Bis zu 14 Monate
            </p>
          </div>
        </section>

        <section>
          <div className="rrl-consent-row">
            <h2>Marketing-Cookies</h2>
            <label className="rrl-switch">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                aria-label="Marketing-Cookies erlauben"
              />
              <span className="rrl-switch-track" />
            </label>
          </div>
          <p>
            Diese Cookies werden verwendet, um dir relevante Werbung und Inhalte zu zeigen und die
            Effektivität unserer Werbekampagnen zu messen.
          </p>
          <div className="rrl-tool">
            <h4>Meta Pixel (Facebook)</h4>
            <p>
              <strong>Anbieter:</strong> Meta Platforms Ireland Ltd.
            </p>
            <p>
              <strong>Zweck:</strong> Conversion-Tracking, Remarketing
            </p>
            <p>
              <strong>Speicherdauer:</strong> Bis zu 90 Tage
            </p>
          </div>
        </section>

        {saved && (
          <p className="rrl-saved" role="status">
            Einstellungen gespeichert. Deine Cookie-Präferenzen wurden erfolgreich aktualisiert.
          </p>
        )}

        <div className="rrl-actions">
          <button type="button" className="rrl-btn" onClick={rejectAll}>
            Alle ablehnen
          </button>
          <button type="button" className="rrl-btn rrl-btn--dark" onClick={savePreferences}>
            Auswahl speichern
          </button>
          <button type="button" className="rrl-btn rrl-btn--primary" onClick={acceptAll}>
            Alle akzeptieren
          </button>
        </div>

        <p className="rrl-footnote">
          Weitere Informationen findest du in unserer{" "}
          <Link href="/relaunch-preview/datenschutz">Datenschutzerklärung</Link>. Du kannst deine
          Einstellungen jederzeit auf dieser Seite ändern.
        </p>
      </div>
    </div>
  );
}
