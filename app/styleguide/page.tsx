import type { Metadata } from "next";
import { crimson, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "./styleguide.css";

export const metadata: Metadata = {
  title: "Styleguide — red rabbit Relaunch (intern)",
  robots: { index: false, follow: false },
};

function Swatch({ name, varName, hex, dark }: { name: string; varName: string; hex: string; dark?: boolean }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--rr-line)" }}>
      <div style={{ background: `var(${varName})`, height: 84 }} />
      <div style={{ padding: "10px 12px" }}>
        <p className="rr-body" style={{ fontWeight: 600, fontSize: 14 }}>{name}</p>
        <p className="rr-meta" style={{ fontSize: 12.5 }}>{varName} · {hex}{dark ? " · auf Dunkel" : ""}</p>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rr-section" style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="rr-wrap">
        <p className="rr-eyebrow" style={{ marginBottom: 28 }}>{label}</p>
        {children}
      </div>
      <div className="rr-wrap" style={{ marginTop: 56 }}><hr className="rr-hairline" /></div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      <header className="rr-section" style={{ paddingBottom: 24 }}>
        <div className="rr-wrap">
          <p className="rr-eyebrow" style={{ marginBottom: 18 }}>Intern · Design-System P0 · Stand 04.07.2026</p>
          <h1 className="rr-claim">
            Das red-rabbit-Design-System. Jede Seite des Relaunchs wird ausschliesslich aus diesen Bausteinen gebaut.
          </h1>
          <p className="rr-meta" style={{ marginTop: 18, maxWidth: 720 }}>
            Werte stammen aus der Live-Vermessung von all-turtles.com (Typo-Stufen, Ink-Logik) und der
            Lottie-Extraktion (Master-Easing). Markenrot #F12032 aus dem Logo gesampelt. Regeln: docs/DESIGN_SYSTEM.md
          </p>
        </div>
      </header>

      <Block label="01 · Farbe">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 16 }}>
          <Swatch name="Markenrot" varName="--rr-red" hex="#F12032" />
          <Swatch name="Rot tief (Hover)" varName="--rr-red-deep" hex="#C81222" />
          <Swatch name="Ink" varName="--rr-ink" hex="#23262E" />
          <Swatch name="Ink soft" varName="--rr-ink-soft" hex="#5A5E68" />
          <Swatch name="Paper" varName="--rr-paper" hex="#FFFFFF" />
          <Swatch name="Surface" varName="--rr-surface" hex="#F4F4F2" />
          <Swatch name="Dark" varName="--rr-dark" hex="#17181D" />
          <Swatch name="Hairline" varName="--rr-line" hex="#E4E4E0" />
          <Swatch name="Welt 1 · Petrol" varName="--rr-world-1-bg" hex="#0B3F3B" />
          <Swatch name="Welt 2 · Nacht" varName="--rr-world-2-bg" hex="#17181D" />
          <Swatch name="Welt 3 · Puder" varName="--rr-world-3-bg" hex="#F3E8E4" />
        </div>
        <p className="rr-meta" style={{ marginTop: 20, maxWidth: 720 }}>
          Ein-Rot-Prinzip auf allen Marken-Flaechen. Die drei Farbwelten existieren NUR in den Case-Panels
          (eine Welt pro Referenz, Zuordnung im Design-Pass).
        </p>
      </Block>

      <Block label="02 · Typografie (gemessene Skala)">
        <div style={{ display: "grid", gap: 34 }}>
          <div><p className="rr-meta">display-1 · Case-Headline · 135px max</p><p className="rr-display-1">Fertig gefunden.</p></div>
          <div><p className="rr-meta">display-2 · Abschluss-CTA · 89px max</p><p className="rr-display-2">Reden wir.</p></div>
          <div><p className="rr-meta">statement · 5-Punkte-Sektion · 74px max</p><p className="rr-statement">Deine Website schreibt selbst. Jede Woche neue Beitraege, die ranken.</p></div>
          <div><p className="rr-meta">claim · Hero · 47px max</p><p className="rr-claim">Wir bauen Websites, die man findet. Bei Google und in der KI.</p></div>
          <div><p className="rr-meta">sub · Case-Subline · 41px max</p><p className="rr-sub">Aus einem Anrufbeantworter wurde ein Anfrage-Kanal.</p></div>
          <div><p className="rr-meta">eyebrow-lg (Serif) + eyebrow (Grotesk)</p><p className="rr-eyebrow-lg">thermenwartung</p><p className="rr-eyebrow" style={{ marginTop: 10 }}>Handwerk · Service · Kaernten</p></div>
          <div style={{ maxWidth: 640 }}><p className="rr-meta">body-lg · 23px</p><p className="rr-body-lg">Der grosse Lauftext fuer Statements und Einleitungen. Er traegt Fraunces nicht, sondern die Grotesk, damit er ruhig bleibt.</p></div>
          <div style={{ maxWidth: 640 }}><p className="rr-meta">body · 17px / meta · 16px</p><p className="rr-body">Standard-Lauftext fuer Unterseiten und FAQ.</p><p className="rr-meta" style={{ marginTop: 8 }}>Meta, Bildunterschriften, Fussnoten.</p></div>
        </div>
      </Block>

      <Block label="03 · Buttons + Links">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
          <a className="rr-btn rr-btn--primary" href="#">Projekt anfragen</a>
          <a className="rr-btn rr-btn--secondary" href="#">Preise ansehen</a>
          <a className="rr-link" href="#">Zum Projekt</a>
        </div>
        <div style={{ background: "var(--rr-dark)", borderRadius: 16, padding: 32, marginTop: 24, display: "flex", gap: 18, alignItems: "center" }}>
          <a className="rr-btn rr-btn--ondark" href="#">Auf dunklen Flaechen</a>
          <a className="rr-link" href="#" style={{ color: "#fff" }}>Textlink auf Dunkel</a>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          Hover-Verhalten laeuft ausnahmslos ueber das Master-Easing cubic-bezier(.6, 0, .4, 1) · 200ms.
        </p>
      </Block>

      <Block label="04 · Formular">
        <div style={{ maxWidth: 480, display: "grid", gap: 18 }}>
          <div><label className="rr-label" htmlFor="sg-name">Dein Name</label><input id="sg-name" className="rr-field" placeholder="Max Muster" /></div>
          <div><label className="rr-label" htmlFor="sg-mail">E-Mail</label><input id="sg-mail" className="rr-field" placeholder="max@firma.at" /></div>
          <div><label className="rr-label" htmlFor="sg-msg">Was brauchst du?</label><textarea id="sg-msg" className="rr-field" rows={3} placeholder="Erzaehl kurz von deinem Betrieb." /></div>
          <div><a className="rr-btn rr-btn--primary" href="#">Anfrage senden</a></div>
        </div>
      </Block>

      <Block label="05 · Firmen-Namensliste (Sektion 7 der Blaupause)">
        <div className="rr-companyrow">
          <div><p className="rr-company-name">SIGNA</p><p className="rr-company-line">Digitale Auftritte fuer Immobilien-Projekte</p></div>
          <div><p className="rr-company-name">thermenwartung</p><p className="rr-company-line">Vom Anrufbeantworter zum Anfrage-Kanal</p></div>
          <div><p className="rr-company-name">Sans Souci</p><p className="rr-company-line">Markenauftritt fuer Wiener Luxus-Living</p></div>
        </div>
        <p className="rr-meta" style={{ marginTop: 20 }}>Alle Namen in EINER Farbe und EINER Schrift (Tomson 04.07.), Einzeiler in Fraunces.</p>
      </Block>

      <Block label="06 · Raum + Motion">
        <p className="rr-body-lg" style={{ maxWidth: 640 }}>
          Sektionen atmen mit clamp(96px, 12vw, 180px) vertikal. Eine Bewegung, ein Easing:
          cubic-bezier(.6, 0, .4, 1) fuer ALLES, von Button-Hover bis Morph-Choreografie. Dauern: 200 / 420 / 700ms.
          prefers-reduced-motion schaltet auf Endzustaende.
        </p>
      </Block>
    </div>
  );
}
