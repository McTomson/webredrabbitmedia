import type { Metadata } from "next";
import { crimson, fraunces, grotesk } from "@/lib/relaunch/fonts";
import { RabbitMark } from "@/components/relaunch/RabbitMark";
import { RelaunchDropdown } from "@/components/relaunch/RelaunchDropdown";
import "../styleguide/styleguide.css";

/* Kleine Inline-Icons (stroke=currentColor), nur fuer die Button-Demos. */
function Ico({ path, points }: { path?: string; points?: string }) {
  return (
    <span className="rr-btn__ico" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {path ? <path d={path} /> : null}
        {points ? <polyline points={points} /> : null}
      </svg>
    </span>
  );
}
const ICO_ARROW = "M5 12h14M13 6l6 6-6 6";
const ICO_PHONE = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.9.35 1.78.65 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.15a2 2 0 0 1 2.11-.45c.85.3 1.73.52 2.63.65A2 2 0 0 1 22 16.92z";
const ICO_PLUS = "M12 5v14M5 12h14";
const ICO_MAIL = "M4 4h16v16H4zM4 6l8 6 8-6";

export const metadata: Metadata = {
  title: "Design-System · Freigabe (intern) — Red Rabbit Relaunch",
  robots: { index: false, follow: false },
};

/* ============================================================
   Kleine Bausteine fuer diese Uebersichtsseite. Alle Werte sind
   1:1 aus app/styleguide/styleguide.css, lib/relaunch/fonts.ts,
   DESIGN.md und den echten Komponenten uebernommen — nichts
   hier ist erfunden.
   ============================================================ */

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rr-section" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="rr-wrap">
        <div style={dsHeadRow}>
          <p className="rr-eyebrow" style={{ margin: 0 }}>
            {n} · {title}
          </p>
          <span style={dsApprovalTag}>Zur Freigabe · Ja / Nein</span>
        </div>
        {children}
      </div>
    </section>
  );
}

const dsHeadRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 32,
  paddingBottom: 20,
  borderBottom: "1px solid var(--rr-line)",
};

const dsApprovalTag: React.CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "var(--rr-ink-soft)",
  border: "1px solid var(--rr-line)",
  borderRadius: 999,
  padding: "6px 14px",
  whiteSpace: "nowrap",
};

function Swatch({
  name,
  varName,
  hex,
  onDark,
}: {
  name: string;
  varName: string;
  hex: string;
  onDark?: boolean;
}) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--rr-line)" }}>
      <div
        style={{
          background: `var(${varName})`,
          height: 92,
          borderBottom: "1px solid var(--rr-line)",
        }}
      />
      <div style={{ padding: "12px 14px", background: onDark ? "var(--rr-dark)" : "var(--rr-paper)" }}>
        <p
          className="rr-body"
          style={{ fontWeight: 650, fontSize: 14.5, color: onDark ? "#fff" : "var(--rr-ink)" }}
        >
          {name}
        </p>
        <p className="rr-meta" style={{ fontSize: 12.5, marginTop: 3, color: onDark ? "rgba(255,255,255,0.55)" : undefined }}>
          {varName} · {hex}
        </p>
      </div>
    </div>
  );
}

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <p className="rr-meta">{label}</p>
      {children}
    </div>
  );
}

/* Eck-Rahmen-Button (aufgenommen 13) — vier Eck-Winkel als <i>, dann der Text.
   Ruhe zeigt nur die Winkel, Hover schliesst sie zum Rahmen (oder --fill). */
function FrameBtn({ variant, fill, label }: { variant: string; fill?: boolean; label: string }) {
  return (
    <a className={`rr-btn-frame rr-btn-frame--${variant}${fill ? " rr-btn-frame--fill" : ""}`} href="#">
      <i className="c1" />
      <i className="c2" />
      <i className="c3" />
      <i className="c4" />
      <span className="rr-btn-frame__t">{label}</span>
    </a>
  );
}

/* Checkbox mit rotem Haken (Section 14) */
function CheckRow({ id, label, name, defaultChecked }: { id: string; label: React.ReactNode; name?: string; defaultChecked?: boolean }) {
  return (
    <label className="rr-check" htmlFor={id}>
      <input className="rr-check__input" type="checkbox" id={id} name={name} defaultChecked={defaultChecked} />
      <span className="rr-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.2 4.2L19 6.5" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}

/* Radio mit rotem Punkt (Section 14) */
function RadioRow({ id, name, label, defaultChecked }: { id: string; name: string; label: React.ReactNode; defaultChecked?: boolean }) {
  return (
    <label className="rr-radio" htmlFor={id}>
      <input className="rr-radio__input" type="radio" id={id} name={name} defaultChecked={defaultChecked} />
      <span className="rr-radio__dot" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

/* Schalter (Kandidat 12) — Geschwister-Reihenfolge input, handle-wrapper,
   base ist Pflicht (CSS nutzt + und ~). Label umschliesst alles. */
function ToggleCell({
  id,
  label,
  variant,
  defaultChecked,
}: {
  id: string;
  label: string;
  variant?: "red";
  defaultChecked?: boolean;
}) {
  return (
    <div style={dsToggleCell}>
      <label className={`rr-toggle${variant ? ` rr-toggle--${variant}` : ""}`} htmlFor={id}>
        <input id={id} type="checkbox" className="rr-toggle__input" defaultChecked={defaultChecked} />
        <span className="rr-toggle__track">
          <span className="rr-toggle__knob" />
        </span>
      </label>
      <p className="rr-meta">{label}</p>
    </div>
  );
}

/* Kinetic-Headline (P1) — jedes Wort in Buchstaben-<span> zerlegt,
   --i steuert die gestaffelte Transition-Delay beim Hover. */
function KineticWord({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <>
      {word.split("").map((ch, idx) => (
        <span key={idx} style={{ ["--i" as string]: offset + idx }}>
          {ch}
        </span>
      ))}
    </>
  );
}

export default function DesignSystemPage() {
  return (
    <div className={`rr ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
      {/* ---------------------------------------------------------- */}
      {/* Kopf */}
      {/* ---------------------------------------------------------- */}
      <header className="rr-section" style={{ paddingBottom: 20 }}>
        <div className="rr-wrap">
          <p className="rr-eyebrow" style={{ marginBottom: 20 }}>
            Intern · Design-System zur Freigabe · Stand 05.07.2026
          </p>
          <h1 className="rr-claim" style={{ maxWidth: "16em" }}>
            Jedes Element der Relaunch-Seiten in echten Fonts und echten Farben. Bitte Seite fuer
            Seite pruefen, jeden Baustein mit Ja oder Nein freigeben.
          </h1>
          <p className="rr-meta" style={{ marginTop: 20, maxWidth: 640 }}>
            Alle Werte kommen unveraendert aus <code>app/styleguide/styleguide.css</code>,{" "}
            <code>lib/relaunch/fonts.ts</code> und den produktiven Komponenten unter{" "}
            <code>components/relaunch/</code>. Diese Seite baut nichts Neues, sie zeigt nur, was
            bereits im Code steckt.
          </p>
        </div>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* 01 · Marken-Fundament */}
      {/* ---------------------------------------------------------- */}
      <Section n="01" title="Marken-Fundament">
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48 }} className="ds-grid-2">
          <div>
            <p className="rr-meta" style={{ marginBottom: 10 }}>Positionierung</p>
            <p className="rr-sub" style={{ maxWidth: "14em" }}>
              Die faire Anti-Agentur fuer den oesterreichischen Mittelstand.
            </p>
            <p className="rr-body" style={{ marginTop: 18, maxWidth: 560, color: "var(--rr-ink-soft)" }}>
              Hochwertige, schnelle, DSGVO-konforme Websites ohne Agentur-Bullshit und ohne Risiko
              fuer den Kunden. Zielgruppe: oesterreichischer Mittelstand und KMU, Handwerk,
              Gastronomie, Dienstleister, Aerzte und Kanzleien, regional. Konservativ,
              preisbewusst, misstrauisch gegen abgehoben und teuer. Haltung ja, Arroganz nein.
            </p>
          </div>
          <div style={{ display: "grid", gap: 22 }}>
            <div>
              <p className="rr-meta" style={{ marginBottom: 8 }}>DU-Anrede (seit 04.07., ersetzt das fruehere Sie)</p>
              <p className="rr-body" style={{ background: "var(--rr-surface)", padding: "14px 18px", borderRadius: 10 }}>
                &bdquo;Du willst eine Website, die man findet? Reden wir.&ldquo;
              </p>
            </div>
            <div>
              <p className="rr-meta" style={{ marginBottom: 8 }}>Copy-Regeln, verbindlich fuer jeden Text</p>
              <ul style={dsRuleList}>
                <li>Keine Emojis, weder Code, UI noch Konversation.</li>
                <li>Echte Umlaute ä ö ü ß in jedem Text, niemals ae/oe/ue-Ersatzschreibung.</li>
                <li>
                  Kein Gedankenstrich: <span style={{ textDecoration: "line-through", opacity: 0.5 }}>Red Rabbit — Navigation</span>
                  {" "}wird zu <strong>&bdquo;Red Rabbit · Navigation&ldquo;</strong> (Mittelpunkt statt Strich).
                </li>
                <li>Ton: knallhart, ehrlich, unabhaengig. Kein Pathos, keine Ausrufezeichen-Hype in sachlichen Teilen.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 02 · Farbe */}
      {/* ---------------------------------------------------------- */}
      <Section n="02" title="Farben">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 640 }}>
          Ein-Rot-Prinzip: Markenrot ist der einzige Akzent auf allen Marken-Flaechen. Die drei
          Farbwelten existieren ausschliesslich in den Case-Panels, eine Welt pro Thema.
        </p>
        <div style={dsSwatchGrid}>
          <Swatch name="Markenrot" varName="--rr-red" hex="#F12032" />
          <Swatch name="Rot tief (Hover)" varName="--rr-red-deep" hex="#C81222" />
          <Swatch name="Ink (Text)" varName="--rr-ink" hex="#23262E" />
          <Swatch name="Ink soft (Sekundaertext)" varName="--rr-ink-soft" hex="#5A5E68" />
          <Swatch name="Paper (Grund)" varName="--rr-paper" hex="#FFFFFF" />
          <Swatch name="Surface (2. Flaeche)" varName="--rr-surface" hex="#F4F4F2" />
          <Swatch name="Dark (dunkle Sektion)" varName="--rr-dark" hex="#17181D" onDark />
          <Swatch name="Line (Hairlines)" varName="--rr-line" hex="#E4E4E0" />
        </div>
        <p className="rr-meta" style={{ margin: "36px 0 16px" }}>
          Navy · Token <code>--rr-navy</code> (#1C2837) · Footer-Hintergrund, Menue-Overlay, Hero-Statement
        </p>
        <div style={dsSwatchGrid}>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--rr-line)" }}>
            <div style={{ background: "var(--rr-navy)", height: 92, borderBottom: "1px solid var(--rr-line)" }} />
            <div style={{ padding: "12px 14px" }}>
              <p className="rr-body" style={{ fontWeight: 650, fontSize: 14.5 }}>Navy</p>
              <p className="rr-meta" style={{ fontSize: 12.5, marginTop: 3 }}>--rr-navy · #1C2837</p>
            </div>
          </div>
        </div>

        <p className="rr-meta" style={{ margin: "36px 0 16px" }}>
          Case-Farbwelten · je eine pro Thema in CasePanels.tsx, 1:1 all-turtles-Messung 05.07.
        </p>
        <div style={dsWorldGrid}>
          <div style={{ ...dsWorldTile, background: "var(--rr-world-1-bg)" }}>
            <p style={{ ...dsWorldEyebrow, color: "var(--rr-world-1-accent)" }}>Webdesign &amp; Handwerk</p>
            <p style={dsWorldHex}>bg #1D8C98 (at &bdquo;airtime&ldquo;-Tuerkis) · accent #FCFBC9 (cream)</p>
          </div>
          <div style={{ ...dsWorldTile, background: "var(--rr-world-2-bg)" }}>
            <p style={{ ...dsWorldEyebrow, color: "var(--rr-world-2-accent)" }}>Dashboard &amp; Selbstlauf</p>
            <p style={dsWorldHex}>bg #2D2D2D (at &bdquo;carrot-dark&ldquo;-Anthrazit) · accent #F35B09 (orange)</p>
          </div>
          <div style={{ ...dsWorldTile, background: "var(--rr-world-3-bg)" }}>
            <p style={{ ...dsWorldEyebrow, color: "var(--rr-world-3-accent)" }}>Sichtbarkeit: Google &amp; KI</p>
            <p style={dsWorldHex}>bg #0A8ABA (at &bdquo;sora&ldquo;-Blau) · accent #F2DC71 (gelb)</p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 03 · Typografie */}
      {/* ---------------------------------------------------------- */}
      <Section n="03" title="Typografie">
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 44, flexWrap: "wrap" }}>
          <div>
            <RabbitMark className="ds-logo-lg" />
            <p className="rr-meta" style={{ marginTop: 12 }}>RabbitMark · gross (Hero/Brand-Opening-Massstab)</p>
          </div>
          <div>
            <RabbitMark className="ds-logo-sm" />
            <p className="rr-meta" style={{ marginTop: 12 }}>RabbitMark · klein (Footer-Massstab, 48px)</p>
          </div>
          <p className="rr-meta" style={{ maxWidth: 280 }}>
            Immer Markenrot #F12032, nie Blau oder Navy. Vektor, verlustfrei in jeder Groesse.
          </p>
        </div>

        <div style={{ display: "grid", gap: 40 }}>
          <Specimen label="rr-display-1 · Fraunces · Case-Headline · clamp(58px, 9.4vw, 135px)">
            <p className="rr-display-1">Fertig gefunden.</p>
          </Specimen>
          <Specimen label="rr-display-2 · Fraunces · Abschluss-CTA · clamp(44px, 6.2vw, 89px)">
            <p className="rr-display-2">Reden wir.</p>
          </Specimen>
          <Specimen label="rr-statement · Crimson Pro w500 · 5-Punkte-Statement · clamp(34px, 4.46vw, 92px)">
            <p className="rr-statement">Deine Website schreibt selbst. Jede Woche neue Beitraege, die ranken.</p>
          </Specimen>
          <Specimen label="rr-claim · Crimson Pro w500 · Hero-Claim · clamp(28px, 3.3vw, 47px)">
            <p className="rr-claim">Wir bauen Websites, die man findet. Bei Google und in der KI.</p>
          </Specimen>
          <Specimen label="rr-sub · Fraunces · Case-Subline · clamp(22px, 2.85vw, 41px)">
            <p className="rr-sub">Aus einem Anrufbeantworter wurde ein Anfrage-Kanal.</p>
          </Specimen>
          <Specimen label="rr-eyebrow-lg · Instrument Sans · grosse Eyebrow · clamp(15px, 1.69vw, 33px)">
            <p className="rr-eyebrow-lg">thermenwartung</p>
          </Specimen>
          <Specimen label="rr-eyebrow · Instrument Sans · 13px · uppercase · Markenrot">
            <p className="rr-eyebrow">Handwerk · Service · Kärnten</p>
          </Specimen>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="ds-grid-2">
            <Specimen label="rr-body-lg · 23px / 1.5 · Grotesk">
              <p className="rr-body-lg">
                Der grosse Lauftext fuer Statements und Einleitungen. Er traegt Fraunces nicht,
                sondern die Grotesk, damit er ruhig bleibt.
              </p>
            </Specimen>
            <Specimen label="rr-body 17px / rr-meta 16px · Grotesk">
              <p className="rr-body">Standard-Lauftext fuer Unterseiten und FAQ.</p>
              <p className="rr-meta" style={{ marginTop: 8 }}>Meta, Bildunterschriften, Fussnoten.</p>
            </Specimen>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 04 · Buttons & Links */}
      {/* ---------------------------------------------------------- */}
      <Section n="04" title="Buttons — ueberarbeitet">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Neu aufgebautes, token-basiertes Button-System. Alle Bewegungen laufen ueber das
          Master-Easing cubic-bezier(.6, 0, .4, 1). Bestehende Klassennamen
          (<code>rr-btn--primary</code>, <code>--secondary</code>, <code>--ondark</code>) bleiben
          gueltig, nur eleganter. Zum Pruefen mit der Maus ueber die Buttons fahren
          (Hover-Lift + Schatten), Tab druecken (Fokus-Ring).
        </p>

        {/* Varianten */}
        <p style={dsSubhead}>Varianten</p>
        <div style={dsBtnGrid}>
          <div style={dsPairCol}>
            <div><a className="rr-btn rr-btn--primary rr-btn--arrow" href="#">Projekt anfragen</a></div>
            <p className="rr-meta">primary · Hero-CTA, Solid-Rot, Pfeil schiebt beim Hover</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn rr-btn--secondary" href="#">Referenzen ansehen</a></div>
            <p className="rr-meta">secondary · Outline/Ghost auf hell (fuellt beim Hover)</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn rr-btn--tertiary" href="#">Mehr erfahren</a></div>
            <p className="rr-meta">tertiary · Text-Button, minimal</p>
          </div>
        </div>

        {/* Groessen */}
        <p style={dsSubhead}>Groessen · sm / md / lg</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
          <a className="rr-btn rr-btn--primary rr-btn--sm" href="#">Klein</a>
          <a className="rr-btn rr-btn--primary" href="#">Standard</a>
          <a className="rr-btn rr-btn--primary rr-btn--lg rr-btn--arrow" href="#">Gross</a>
        </div>

        {/* Zustaende */}
        <p style={dsSubhead}>Zustaende</p>
        <div style={dsBtnGrid}>
          <div style={dsPairCol}>
            <div><a className="rr-btn rr-btn--primary" href="#">Standard</a></div>
            <p className="rr-meta">default · Ruhezustand mit weichem Schatten</p>
          </div>
          <div style={dsPairCol}>
            <div><button className="rr-btn rr-btn--primary is-loading" type="button">Wird gesendet</button></div>
            <p className="rr-meta">loading · <code>.is-loading</code>, Label wird zum Spinner</p>
          </div>
          <div style={dsPairCol}>
            <div><button className="rr-btn rr-btn--primary" type="button" disabled>Nicht verfuegbar</button></div>
            <p className="rr-meta">disabled · <code>:disabled</code> / <code>aria-disabled</code></p>
          </div>
          <div style={dsPairCol}>
            <div><button className="rr-btn rr-btn--secondary is-loading" type="button">Lade</button></div>
            <p className="rr-meta">loading · secondary (Spinner nimmt Ink-Farbe)</p>
          </div>
          <div style={dsPairCol}>
            <div><button className="rr-btn rr-btn--secondary" type="button" disabled>Gesperrt</button></div>
            <p className="rr-meta">disabled · secondary</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn rr-btn--primary" href="#">Fokus mit Tab</a></div>
            <p className="rr-meta">hover: Lift + Schatten · active: Press · focus-visible: Ring</p>
          </div>
        </div>

        {/* Icons */}
        <p style={dsSubhead}>Mit Icon · und Icon-only (quadratisch, mit aria-label)</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <a className="rr-btn rr-btn--primary" href="#"><Ico path={ICO_PHONE} />Anrufen</a>
          <a className="rr-btn rr-btn--secondary" href="#"><Ico path={ICO_MAIL} />Schreiben</a>
          <button className="rr-btn rr-btn--secondary rr-btn--icon" type="button" aria-label="Hinzufuegen"><Ico path={ICO_PLUS} /></button>
          <button className="rr-btn rr-btn--primary rr-btn--icon" type="button" aria-label="Weiter"><Ico path={ICO_ARROW} /></button>
          <button className="rr-btn rr-btn--secondary rr-btn--icon rr-btn--sm" type="button" aria-label="Hinzufuegen (klein)"><Ico path={ICO_PLUS} /></button>
          <button className="rr-btn rr-btn--primary rr-btn--icon rr-btn--lg" type="button" aria-label="Weiter (gross)"><Ico path={ICO_ARROW} /></button>
        </div>

        {/* Auf dunklem Grund */}
        <p style={dsSubhead}>Auf dunklem Grund</p>
        <div style={{ background: "var(--rr-navy)", borderRadius: 16, padding: "32px 34px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
            <a className="rr-btn rr-btn--ondark rr-btn--arrow" href="#">Projekt anfragen</a>
            <a className="rr-btn rr-btn--ondark-ghost" href="#">Mehr erfahren</a>
            <button className="rr-btn rr-btn--ondark rr-btn--icon" type="button" aria-label="Weiter"><Ico path={ICO_ARROW} /></button>
            <p className="rr-meta" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 220 }}>
              rr-btn--ondark (Solid) · rr-btn--ondark-ghost (Outline)
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 04b · Links */}
      {/* ---------------------------------------------------------- */}
      <Section n="04b" title="Links — ueberarbeitet">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          <code>rr-link</code> bleibt der etablierte Pfeil-Link, jetzt mit feinerer Unterstreichung
          und Pfeil-Nudge. Dazu drei neue Varianten. Zum Pruefen ueber die Links fahren
          (Unterstreichung wischt ein, Pfeil schiebt).
        </p>
        <div style={dsBtnGrid}>
          <div style={dsPairCol}>
            <div><a className="rr-link" href="#">Zum Projekt</a></div>
            <p className="rr-meta">rr-link · Pfeil-Link (Standard), unterstrichen</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-link rr-link--text" href="#">Datenschutz</a></div>
            <p className="rr-meta">rr-link--text · Fliesstext-Link, Unterstreichung wischt ein</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-link rr-link--meta" href="#">Alle Referenzen</a></div>
            <p className="rr-meta">rr-link--meta · leiser Sekundaer-Link</p>
          </div>
        </div>

        <div style={{ background: "var(--rr-navy)", borderRadius: 16, padding: "32px 34px", marginTop: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center" }}>
            <a className="rr-link rr-link--ondark" href="#">Zum Projekt</a>
            <a className="rr-link rr-link--text rr-link--ondark" href="#">Impressum</a>
            <p className="rr-meta" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 260 }}>
              rr-link--ondark · heller Text, Hover in hellem Rot (#FF5F6D). Kombinierbar mit --text.
            </p>
          </div>
        </div>

        <p className="rr-meta" style={{ marginTop: 22 }}>
          Weiterhin im Einsatz und unveraendert freigegeben: der Vollbild-Menue-Navlink
          (Fraunces, Hover Rot + Skew) und der Footer-Link auf Navy — siehe Abschnitt 06.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 04c · Dropdown & Select */}
      {/* ---------------------------------------------------------- */}
      <Section n="04c" title="Dropdown &amp; Select">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 760 }}>
          Standard = <b>D · Klar-Box</b> (Tomson 2026-07-07): das barrierefreie Listbox-Dropdown, jetzt
          eckig statt rund, roter Fokus-Ring, gewaehlte Option rot mit Haken. Bedienbar mit Maus und
          Tastatur (Pfeile, Home/End, Enter/Space, Esc, Tippen springt), schliesst bei Aussenklick,
          Oeffnen animiert ohne Layout-Shift. Daneben die <b>Eck-Rahmen-Variante</b> als Akzent (die
          Linien schliessen sich beim Oeffnen zum vollen roten Rahmen) und ein natives
          <code>&lt;select&gt;</code> im Marken-Stil.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
          <div style={{ ...dsPairCol, maxWidth: 300 }}>
            <RelaunchDropdown
              ariaLabel="Leistung waehlen"
              placeholder="Leistung waehlen"
              defaultValue="webdesign"
              options={[
                { value: "webdesign", label: "Webdesign & Handwerk" },
                { value: "dashboard", label: "Dashboard & Selbstlauf" },
                { value: "sichtbarkeit", label: "Sichtbarkeit: Google & KI" },
                { value: "seo", label: "SEO & lokale Auffindbarkeit" },
                { value: "wartung", label: "Wartung & Betreuung" },
              ]}
            />
            <p className="rr-meta">D · Standard · rr-select (Listbox, eckig, Tastatur + aria-activedescendant)</p>
          </div>
          <div style={{ ...dsPairCol, maxWidth: 300 }}>
            <details className="rr-select-frame">
              <summary>
                <span>Worum geht es?</span>
                <svg className="rr-select-frame__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                <i className="c1" />
                <i className="c2" />
                <i className="c3" />
                <i className="c4" />
              </summary>
              <div className="rr-select-frame__menu">
                <div className="rr-select-frame__opt" data-sel>Webdesign</div>
                <div className="rr-select-frame__opt">Sichtbarkeit bei Google</div>
                <div className="rr-select-frame__opt">Laufende Betreuung</div>
                <div className="rr-select-frame__opt">Weiss noch nicht</div>
              </div>
            </details>
            <p className="rr-meta">B · Akzent · rr-select-frame (Eck-Rahmen schliesst rot). Wert-Logik = Client-Wrapper.</p>
          </div>
          <div style={{ ...dsPairCol, maxWidth: 300 }}>
            <select className="rr-select-native" aria-label="Region waehlen (nativ)" defaultValue="ktn">
              <option value="ktn">Kärnten</option>
              <option value="stmk">Steiermark</option>
              <option value="ooe">Oberösterreich</option>
              <option value="sbg">Salzburg</option>
            </select>
            <p className="rr-meta">rr-select-native · natives &lt;select&gt; fuer einfache Formulare</p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 05 · Motion-Prinzip */}
      {/* ---------------------------------------------------------- */}
      <Section n="05" title="Motion-Prinzip">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="ds-grid-2">
          <div>
            <p className="rr-sub" style={{ maxWidth: "12em" }}>Typografie zerbricht und fuegt sich zusammen.</p>
            <p className="rr-body" style={{ marginTop: 18, maxWidth: 480, color: "var(--rr-ink-soft)" }}>
              Das durchgaengige Signaturbewegung des Relaunchs: Buchstaben splitten in Teile und
              setzen sich beim Scrollen neu zusammen, zum Beispiel bei der Hero-Wortmarke
              (Kontraktion, Burst, Split) und beim Footer-Einstieg (Reassembly).
            </p>
            <ul style={dsRuleList}>
              <li>Eine einzige Easing-Kurve fuer alles: <code>cubic-bezier(0.6, 0, 0.4, 1)</code>, Token <code>--rr-ease</code>.</li>
              <li>Dauern: 200ms (fast) · 420ms (medium) · 700ms (slow).</li>
              <li>Scroll-gesteuert per rAF + getBoundingClientRect, keine GSAP/ScrollTrigger.</li>
              <li>Genau eine Lenis-Instanz auf der ganzen Seite (in HomeMorph.tsx).</li>
              <li>prefers-reduced-motion schaltet immer auf den Endzustand, kein Ausnahmefall.</li>
            </ul>
          </div>
          <div>
            <p className="rr-meta" style={{ marginBottom: 14 }}>
              Kleine Demo · Maus ueber das Wort halten (settle-Animation, gleiche Kurve wie das Vollbild-Menue)
            </p>
            <div className="ds-motion-stage">
              <span className="ds-motion-word" aria-hidden="true">
                <span className="ds-motion-letter" style={{ ["--i" as string]: 0 }}>r</span>
                <span className="ds-motion-letter" style={{ ["--i" as string]: 1 }}>a</span>
                <span className="ds-motion-letter" style={{ ["--i" as string]: 2 }}>b</span>
                <span className="ds-motion-letter" style={{ ["--i" as string]: 3 }}>b</span>
                <span className="ds-motion-letter" style={{ ["--i" as string]: 4 }}>i</span>
                <span className="ds-motion-letter" style={{ ["--i" as string]: 5 }}>t</span>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 05b · Animationen & Motion-Utilities */}
      {/* ---------------------------------------------------------- */}
      <Section n="05b" title="Animationen &amp; Motion-Utilities">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Wiederverwendbare Bewegungs-Muster als Utility-Klassen, alle auf der einen Easing-Kurve.
          Zum Pruefen mit der Maus drueberfahren. <code>prefers-reduced-motion: reduce</code> schaltet
          jede Animation global auf den Endzustand (Regel steht am Ende der styleguide.css).
        </p>

        {/* Dauern-Referenz */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 34 }}>
          <span style={dsToken}>--rr-ease · cubic-bezier(.6, 0, .4, 1)</span>
          <span style={dsToken}>--rr-t-fast · 200ms</span>
          <span style={dsToken}>--rr-t-med · 420ms</span>
          <span style={dsToken}>--rr-t-slow · 700ms</span>
        </div>

        <div style={dsBtnGrid}>
          {/* hover-lift */}
          <div style={dsPairCol}>
            <div className="rr-hover-lift" style={dsMotionCard}>
              <p className="rr-body" style={{ fontWeight: 650 }}>Karte</p>
              <p className="rr-meta" style={{ marginTop: 4 }}>hebt beim Hover</p>
            </div>
            <p className="rr-meta"><code>.rr-hover-lift</code> · translateY + Schatten (420ms)</p>
          </div>

          {/* underline-wipe */}
          <div style={dsPairCol}>
            <div style={{ ...dsMotionCard, display: "flex", alignItems: "center" }}>
              <a className="rr-underline-wipe" href="#" style={{ fontFamily: "var(--rr-font-ui)", fontSize: 18, fontWeight: 550 }}>
                Unterstreichung wischt ein
              </a>
            </div>
            <p className="rr-meta"><code>.rr-underline-wipe</code> · Linie waechst von links (420ms)</p>
          </div>

          {/* fracture-settle */}
          <div style={dsPairCol}>
            <div style={{ ...dsMotionCard, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="rr-fracture-settle" aria-hidden="true" style={{ fontFamily: "var(--rr-font-display)", fontWeight: 560, fontSize: 40, color: "var(--rr-ink)" }}>
                {["r", "a", "b", "b", "i", "t"].map((c, i) => (
                  <span key={i} className="rr-fx-ch" style={{ ["--i" as string]: i }}>{c}</span>
                ))}
              </span>
            </div>
            <p className="rr-meta"><code>.rr-fracture-settle</code> · Buchstaben setzen sich zusammen (Echo der Wortmarke)</p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 06 · Bausteine */}
      {/* ---------------------------------------------------------- */}
      <Section n="06" title="Bausteine">
        <div style={dsBuildingGrid}>
          {/* Vollbild-Menue */}
          <div style={dsBuildCard}>
            <div className="ds-menu-preview">
              <p className="ds-menu-preview-eyebrow">Red Rabbit · Navigation</p>
              <p className="ds-menu-preview-link">01&nbsp;&nbsp;Start</p>
              <p className="ds-menu-preview-link">02&nbsp;&nbsp;Leistungen</p>
              <p className="ds-menu-preview-link">03&nbsp;&nbsp;Referenzen</p>
            </div>
            <p className="rr-meta" style={{ marginTop: 14 }}>
              Vollbild-Menue (RelaunchMenu.tsx) · Navy-Overlay #1C2837 mit roter Aura, Fraunces-Links
              staffeln sich mit Rotation+Versatz ein (rrmenu-settle). Bewusst kein Seiten-Panel.
            </p>
          </div>

          {/* Footer */}
          <div style={dsBuildCard}>
            <div className="ds-footer-preview">
              <RabbitMark className="ds-logo-xs" />
              <p className="ds-footer-preview-name">Red Rabbit Media</p>
              <p className="ds-footer-preview-tag">Die faire Anti-Agentur fuer den oesterreichischen Mittelstand.</p>
            </div>
            <p className="rr-meta" style={{ marginTop: 14 }}>
              Footer (FooterReassembly.tsx) · Navy #1C2837, Riesen-Wortmarke setzt sich beim
              Eintritt in den Viewport aus Scherben zusammen, darunter Marke, Navigation, Regionen,
              Kontakt.
            </p>
          </div>

          {/* Case-Panels Farbwelten */}
          <div style={dsBuildCard}>
            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", height: 140 }}>
              <div style={{ flex: 1, background: "var(--rr-world-1-bg)" }} />
              <div style={{ flex: 1, background: "var(--rr-world-2-bg)" }} />
              <div style={{ flex: 1, background: "var(--rr-world-3-bg)" }} />
            </div>
            <p className="rr-meta" style={{ marginTop: 14 }}>
              Case-Panels (CasePanels.tsx) · 3 vollflaechige Themen-Buehnen mit eigener Farbwelt:
              Webdesign &amp; Handwerk (Tuerkis), Dashboard &amp; Selbstlauf (Anthrazit), Sichtbarkeit:
              Google &amp; KI (Blau). Sticky, ~380vh Scrollstrecke pro Thema.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 07 · Spacing / Layout */}
      {/* ---------------------------------------------------------- */}
      <Section n="07" title="Spacing &amp; Layout">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 640 }}>
          <code>--rr-gutter</code>: clamp(20px, 4.6vw, 72px) horizontaler Seitenrand ·{" "}
          <code>--rr-section-y</code>: clamp(96px, 12vw, 180px) vertikaler Sektions-Rhythmus ·{" "}
          <code>--rr-max</code>: 1680px Inhaltsbreite.
        </p>
        <div className="ds-gutter-demo">
          <div className="ds-gutter-bar ds-gutter-bar--left" />
          <div className="ds-gutter-inner">
            <p className="rr-meta">rr-wrap · max-width var(--rr-max)</p>
          </div>
          <div className="ds-gutter-bar ds-gutter-bar--right" />
        </div>
        <div className="ds-rhythm-demo">
          <div className="ds-rhythm-block">Sektion A</div>
          <div className="ds-rhythm-gap">--rr-section-y</div>
          <div className="ds-rhythm-block">Sektion B</div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 08 · Was noch fehlt / Kandidaten */}
      {/* ---------------------------------------------------------- */}
      <Section n="08" title="Was noch fehlt · Kandidaten">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Nur eine Liste zum Priorisieren, nichts davon ist gebaut. Eine Marketing-Seite fuer den
          Mittelstand will spaeter vermutlich noch diese Bausteine. Bitte pro Zeile Ja
          (bauen) oder Nein (nicht noetig) entscheiden.
        </p>
        <div style={dsBtnGrid}>
          {[
            ["Formular-Inputs", "Textfeld, Textarea, Checkbox, Radio, Toggle im Marken-Stil (rr-field existiert bereits als Basis)"],
            ["Cards", "Referenz-, Preis- und Leistungs-Karten als wiederverwendbares Muster"],
            ["Accordion (FAQ)", "Aufklappbare Frage/Antwort fuer die FAQ-Sektion, animiert"],
            ["Badges / Tags", "Kleine Labels, etwa Region oder Branche (Handwerk, Gastronomie)"],
            ["Tooltip", "Kurzer Hinweis beim Hover/Fokus, barrierefrei"],
            ["Modal / Dialog", "Overlay-Fenster mit Fokus-Falle, z. B. Kontakt-Popup"],
          ].map(([title, desc]) => (
            <div key={title} style={dsCandidateCard}>
              <p className="rr-body" style={{ fontWeight: 650, marginBottom: 6 }}>{title}</p>
              <p className="rr-meta">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 11 · Cards - Soft (Kandidat) */}
      {/* ---------------------------------------------------------- */}
      <Section n="11" title="Cards - Soft">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Weiche, plastische Karten (Neumorphismus) mit doppeltem Schatten, hell und dunkel. Auf hellem
          Grund lesbar gehalten. Neutral, Markenrot und Navy zur Auswahl. Beispiel-Inhalt: Eyebrow plus
          kurzer Titel.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
          <div className="rr-card-soft rr-card-soft--red">
            <p className="rr-card-soft__eyebrow">Leistung</p>
            <p className="rr-card-soft__label">Webdesign &amp; Handwerk</p>
          </div>
          <div className="rr-card-soft rr-card-soft--navy">
            <p className="rr-card-soft__eyebrow">Leistung</p>
            <p className="rr-card-soft__label">Dashboard &amp; Selbstlauf</p>
          </div>
          <div className="rr-card-soft rr-card-soft--neutral">
            <p className="rr-card-soft__eyebrow">Leistung</p>
            <p className="rr-card-soft__label">Sichtbarkeit bei Google &amp; KI</p>
          </div>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          rr-card-soft--red · rr-card-soft--navy · rr-card-soft--neutral
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 12 · Toggle (Kandidat) */}
      {/* ---------------------------------------------------------- */}
      <Section n="12" title="Toggle">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Klarer Schiebeschalter. Grauer Track im Aus-Zustand, der Knopf gleitet nach rechts, der
          Track wird im Ein-Zustand Navy (Default) oder Markenrot (--red). Sichtbarer Fokus-Ring.
          Zum Pruefen anklicken.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
          <ToggleCell id="rr-tg-navy-off" label="Ein-Zustand Navy · aus" />
          <ToggleCell id="rr-tg-navy-on" label="Ein-Zustand Navy · ein" defaultChecked />
          <ToggleCell id="rr-tg-red-on" label="Ein-Zustand Rot · ein" variant="red" defaultChecked />
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 13 · Buttons - Aufgenommen (Sweep + Eck-Rahmen) */}
      {/* ---------------------------------------------------------- */}
      <Section n="13" title="Buttons - Aufgenommen (Sweep + Eck-Rahmen)">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 760 }}>
          Von Tomson bestaetigt (2026-07-06). Sweep-Fill als Haupt-CTA in Rot: eckig, transparenter
          Grund, der rote Balken waechst von links zur Vollflaeche. Dazu der Eck-Rahmen in vier
          Versionen: die Ruhe zeigt nur die vier Eck-Winkel, beim Hover schliessen sich die Linien
          zum Rahmen (Navy/Rot) oder der Inhalt fuellt sich (Navy/Rot). Zum Pruefen mit der Maus
          drueberfahren.
        </p>
        <div style={dsBtnGrid}>
          <div style={dsPairCol}>
            <div><a className="rr-btn-sweep rr-btn-sweep--red" href="#">Projekt anfragen</a></div>
            <p className="rr-meta">rr-btn-sweep--red · Haupt-CTA, roter Balken fuellt von links</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn-sweep rr-btn-sweep--navy" href="#">Referenzen</a></div>
            <p className="rr-meta">rr-btn-sweep--navy · gleiche Mechanik in Navy</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "48px 40px",
            alignItems: "center",
            background: "var(--rr-surface)",
            border: "1px solid var(--rr-line)",
            borderRadius: 16,
            padding: "56px 40px",
            marginTop: 24,
          }}
        >
          <FrameBtn variant="navy" label="Projekt anfragen" />
          <FrameBtn variant="red" label="Projekt anfragen" />
          <FrameBtn variant="navy" fill label="Projekt anfragen" />
          <FrameBtn variant="red" fill label="Projekt anfragen" />
        </div>
        <p className="rr-meta" style={{ marginTop: 14 }}>
          rr-btn-frame--navy / --red (Linien schliessen sich) · zusaetzlich --fill (Inhalt faehrt
          hoch, Schrift weiss)
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 14 · Formular-System */}
      {/* ---------------------------------------------------------- */}
      <Section n="14" title="Formular-System">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 760 }}>
          Der Conversion-Kern der Seite. Aufgebaut auf <code>rr-field</code> / <code>rr-label</code>:
          Label ueber dem Feld, sichtbarer Fokus-Ring, Fehler unter dem Feld (rot, mit Punkt),
          Erfolgs- und Fehler-Hinweis als Box. Checkbox und Radio im Marken-Stil mit rotem Haken
          bzw. Punkt. Submit nutzt den aufgenommenen Sweep-CTA.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px 56px", alignItems: "flex-start" }}>
          <form className="rr-form" action="#" style={{ flex: "1 1 420px" }}>
            <div className="rr-form__row">
              <div className="rr-form__group">
                <label className="rr-label" htmlFor="f-name">Name</label>
                <input className="rr-field" id="f-name" type="text" placeholder="Vor- und Nachname" />
              </div>
              <div className="rr-form__group">
                <label className="rr-label" htmlFor="f-firma">Betrieb</label>
                <input className="rr-field" id="f-firma" type="text" placeholder="Firma (optional)" />
              </div>
            </div>
            <div className="rr-form__group">
              <label className="rr-label" htmlFor="f-mail">E-Mail</label>
              <input className="rr-field" id="f-mail" type="email" aria-invalid="true" aria-describedby="f-mail-err" defaultValue="max@" />
              <p className="rr-error" id="f-mail-err">Bitte eine gueltige E-Mail-Adresse eingeben.</p>
            </div>
            <div className="rr-form__group">
              <label className="rr-label" htmlFor="f-msg">Worum geht es?</label>
              <textarea className="rr-field rr-field--textarea" id="f-msg" aria-describedby="f-msg-help" placeholder="Erzaehl kurz, was du brauchst." />
              <p className="rr-help" id="f-msg-help">Ein paar Saetze reichen. Wir melden uns innerhalb eines Werktags.</p>
            </div>
            <CheckRow id="f-consent" label="Ich stimme zu, dass meine Angaben zur Kontaktaufnahme gespeichert werden." />
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
              <a className="rr-btn-sweep rr-btn-sweep--red" href="#">Anfrage senden</a>
              <a className="rr-btn rr-btn--tertiary" href="#">Lieber anrufen</a>
            </div>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: 26, flex: "1 1 260px", minWidth: 240 }}>
            <div>
              <p style={dsSubhead}>Auswahl (Radio)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <RadioRow name="paket" id="r-starter" label="Starter · One-Pager" defaultChecked />
                <RadioRow name="paket" id="r-website" label="Website · mehrseitig" />
                <RadioRow name="paket" id="r-unsure" label="Weiss noch nicht" />
              </div>
            </div>
            <div>
              <p style={dsSubhead}>Checkbox-Zustaende</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <CheckRow id="c1" label="Standard" />
                <CheckRow id="c2" label="Vorausgewaehlt" defaultChecked />
              </div>
            </div>
            <div>
              <p style={dsSubhead}>Status-Hinweise</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="rr-formnote rr-formnote--success">Danke, deine Anfrage ist da. Wir melden uns innerhalb eines Werktags.</div>
                <div className="rr-formnote rr-formnote--error">Da ist etwas schiefgegangen. Bitte pruefe die rot markierten Felder.</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 15 · Cards - Aufgenommen (Slide, Layer, Fokus, Buch) */}
      {/* ---------------------------------------------------------- */}
      <Section n="15" title="Cards - Aufgenommen (Slide, Layer, Fokus, Buch)">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 780 }}>
          Von Tomson bestaetigt (2026-07-07). Vier Karten-Muster zur Auswahl je nach Kontext. Zum
          Pruefen mit der Maus drueberfahren.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <div>
            <p style={dsSubhead}>Slide-Reveal · rr-card-slide</p>
            <div className="rr-card-slide">
              <div className="rr-card-slide__image">
                <span className="rr-card-slide__cta">Anfrage starten &rarr;</span>
              </div>
              <div className="rr-card-slide__desc">
                <p className="rr-card-slide__title">Webdesign</p>
                <p className="rr-card-slide__body">Für deinen Betrieb gebaut, nicht aus dem Baukasten.</p>
              </div>
            </div>
          </div>

          <div>
            <p style={dsSubhead}>Layer-Schatten · rr-card-layer (einzeln)</p>
            <div className="rr-card-layer">
              <p className="rr-card-layer__eyebrow">Sichtbarkeit</p>
              <p className="rr-card-layer__title">Gefunden bei Google &amp; KI</p>
              <p className="rr-card-layer__body">Sauber gebaut, lokal auffindbar. Ohne Tricks.</p>
            </div>
          </div>

          <div>
            <p style={dsSubhead}>Buch · rr-card-book</p>
            <div className="rr-card-book">
              <div className="rr-card-book__inner">
                <p className="rr-card-book__title">Was du bekommst</p>
                <p className="rr-card-book__body">Klare Seite, faire Fixpreise, echte Betreuung.</p>
              </div>
              <div className="rr-card-book__cover">
                <p className="rr-card-book__eyebrow">Red Rabbit</p>
                <p className="rr-card-book__title">Aufmachen</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ ...dsSubhead, marginTop: 44 }}>Fokus-Stapel · rr-focus-row + rr-card-layer</p>
        <div className="rr-focus-row">
          <div className="rr-card-layer">
            <p className="rr-card-layer__eyebrow">Webdesign</p>
            <p className="rr-card-layer__title">Auftritt der arbeitet</p>
            <p className="rr-card-layer__body">Für deinen Betrieb, nicht aus dem Baukasten.</p>
          </div>
          <div className="rr-card-layer">
            <p className="rr-card-layer__eyebrow">Sichtbarkeit</p>
            <p className="rr-card-layer__title">Gefunden bei Google &amp; KI</p>
            <p className="rr-card-layer__body">Sauber gebaut, lokal auffindbar.</p>
          </div>
          <div className="rr-card-layer">
            <p className="rr-card-layer__eyebrow">Betreuung</p>
            <p className="rr-card-layer__title">Wir bleiben dran</p>
            <p className="rr-card-layer__body">Die Seite pflegt sich weitgehend selbst.</p>
          </div>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          rr-card-slide · rr-card-layer · rr-focus-row &gt; rr-card-layer · rr-card-book
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 16 · Formular-Karten (Neumorph eckig + Split) */}
      {/* ---------------------------------------------------------- */}
      <Section n="16" title="Formular-Karten (Neumorph eckig + Split)">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 800 }}>
          Von Tomson bestaetigt (2026-07-07). Zwei Anfrage-Karten. Die Neumorph-Karte ist die
          uiverse-Vorlage originalgetreu, aber ECKIG: das Label wandert beim Tippen/Fokus als roter
          eckiger Block nach oben, Submit ist der Eck-Rahmen-Button (fuellt rot). Die Split-Karte
          nutzt das rr-field/rr-label-System mit Navy-Statement-Panel. Felder sind echt: reinklicken
          und tippen.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <div>
            <p style={dsSubhead}>Neumorph eckig · rr-formcard-neu</p>
            <form className="rr-formcard-neu" action="#">
              <span className="rr-formcard-neu__title">Anfrage</span>
              <div className="rr-formcard-neu__box" style={{ ["--tx" as string]: "150px" }}>
                <input type="text" required />
                <span>E-Mail</span>
              </div>
              <div className="rr-formcard-neu__box" style={{ ["--tx" as string]: "158px" }}>
                <input type="text" required />
                <span>Name</span>
              </div>
              <div className="rr-formcard-neu__box" style={{ ["--tx" as string]: "120px" }}>
                <input type="text" required />
                <span>Nachricht</span>
              </div>
              <button className="rr-btn-frame rr-btn-frame--red rr-btn-frame--fill" type="submit" style={{ marginBottom: "1.2em" }}>
                <i className="c1" />
                <i className="c2" />
                <i className="c3" />
                <i className="c4" />
                <span className="rr-btn-frame__t">Senden</span>
              </button>
            </form>
          </div>

          <div>
            <p style={dsSubhead}>Split · rr-formcard-split</p>
            <form className="rr-formcard-split" action="#">
              <div className="rr-formcard-split__aside">
                <div>
                  <p className="rr-formcard-split__eyebrow">Kontakt</p>
                  <p className="rr-formcard-split__stmt">Online.<br />Und jetzt?</p>
                </div>
                <p className="rr-formcard-split__meta">Antwort innerhalb eines Werktags. Kein Verkaufsdruck.</p>
              </div>
              <div className="rr-formcard-split__form">
                <div className="rr-form__group" style={{ marginBottom: 16 }}>
                  <label className="rr-label" htmlFor="s-mail">E-Mail</label>
                  <input className="rr-field" id="s-mail" type="email" placeholder="name@firma.at" />
                </div>
                <div className="rr-form__group" style={{ marginBottom: 20 }}>
                  <label className="rr-label" htmlFor="s-msg">Worum geht es?</label>
                  <textarea className="rr-field rr-field--textarea" id="s-msg" placeholder="Ein paar Saetze reichen." />
                </div>
                <a className="rr-btn-sweep rr-btn-sweep--red" href="#">Anfrage senden</a>
              </div>
            </form>
          </div>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          rr-formcard-neu (+ rr-btn-frame--red--fill) · rr-formcard-split (+ rr-field / rr-btn-sweep--red)
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 17 · FAQ (A Farbwelt-Panel · B Editorial · E Konversation) */}
      {/* ---------------------------------------------------------- */}
      <Section n="17" title="FAQ (Farbwelt-Panel · Editorial · Konversation)">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 800 }}>
          Von Tomson bestaetigt (2026-07-07), am Stil der Relaunch-Panels orientiert. Natives
          <code>&lt;details&gt;</code> (barrierefrei, ohne JS), weiche grid-rows-Reveal. A = Farbwelt-Panel
          fuer die Startseite, B = Editorial fuer eine eigene FAQ-Seite, E = Konversation als
          Signatur-Moment. Zum Pruefen die Fragen auf- und zuklappen.
        </p>

        <p style={dsSubhead}>A · Farbwelt-Panel · rr-faq--panel (auch --dark / --blue)</p>
        <div className="rr-faq rr-faq--panel" style={{ marginBottom: 44 }}>
          <div className="rr-faq__inner">
            <p className="rr-faq__eyebrow">Haeufige Fragen</p>
            <details open>
              <summary>Was kostet eine Website?<span className="rr-faq__plus" /></summary>
              <div className="rr-faq__answer"><div className="rr-faq__answer-in"><p>Der Starter (One-Pager) beginnt bei 790 Euro. Mehrseitige Websites kalkulieren wir fix nach Umfang, den Preis bekommst du vorher schriftlich.</p></div></div>
            </details>
            <details>
              <summary>Muss ich in Vorkasse gehen?<span className="rr-faq__plus" /></summary>
              <div className="rr-faq__answer"><div className="rr-faq__answer-in"><p>Nein. Eine Anzahlung wird erst bei Auftragszusage faellig, nicht vorher.</p></div></div>
            </details>
          </div>
        </div>

        <p style={dsSubhead}>B · Editorial · rr-faq--editorial (heller Grund, eigene FAQ-Seite)</p>
        <div className="rr-faq rr-faq--editorial" style={{ marginBottom: 44 }}>
          <p className="rr-faq__eyebrow">Haeufige Fragen</p>
          <details open>
            <summary><span className="rr-faq__idx">01</span><span className="rr-faq__q">Was kostet eine Website?</span></summary>
            <div className="rr-faq__answer"><div className="rr-faq__answer-in"><p>Der Starter (One-Pager) beginnt bei 790 Euro. Mehrseitige Websites kalkulieren wir fix nach Umfang, den Preis bekommst du vorher schriftlich.</p></div></div>
          </details>
          <details>
            <summary><span className="rr-faq__idx">02</span><span className="rr-faq__q">Gibt es versteckte Kosten?</span></summary>
            <div className="rr-faq__answer"><div className="rr-faq__answer-in"><p>Nein. Fixpreis heisst Fixpreis. Laufende Kosten wie Hosting und Domain nennen wir offen vorab.</p></div></div>
          </details>
        </div>

        <p style={dsSubhead}>E · Konversation · rr-faq--chat (Signatur-Moment)</p>
        <div className="rr-faq rr-faq--chat">
          <div className="rr-faq__inner">
            <p className="rr-faq__eyebrow">Haeufige Fragen</p>
            <details open>
              <summary>Was kostet eine Website?</summary>
              <div className="rr-faq__answer"><div className="rr-faq__answer-in"><div className="rr-faq__bubble">Der Starter (One-Pager) beginnt bei 790 Euro. Mehrseitige Websites kalkulieren wir fix nach Umfang, den Preis bekommst du vorher schriftlich.</div></div></div>
            </details>
            <details>
              <summary>Muss ich in Vorkasse gehen?</summary>
              <div className="rr-faq__answer"><div className="rr-faq__answer-in"><div className="rr-faq__bubble">Nein. Eine Anzahlung wird erst bei Auftragszusage faellig, nicht vorher.</div></div></div>
            </details>
          </div>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          rr-faq--panel · rr-faq--editorial · rr-faq--chat (alle: rr-faq + details/summary + rr-faq__answer)
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 18 · Scroll-Reveal (E5) */}
      {/* ---------------------------------------------------------- */}
      <Section n="18" title="Scroll-Reveal (rr-reveal / rr-stagger)">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Opacity 0 + <code>translateY(16px)</code> bis sichtbar, 700ms ease-out. CSS-only ueber{" "}
          <code>animation-timeline: view()</code>; ohne Support einfach sichtbar, bei{" "}
          <code>prefers-reduced-motion</code> immer sofort sichtbar. Zum Pruefen im Kasten scrollen.
        </p>
        <div style={dsScrollStage}>
          <div className="rr-reveal">
            <div className="rr-card-layer" style={{ width: "auto" }}>
              <p className="rr-card-layer__eyebrow">rr-reveal</p>
              <p className="rr-card-layer__title">Einzelnes Element blendet ein</p>
            </div>
          </div>
          <div className="rr-stagger" style={{ display: "grid", gap: 16, marginTop: 32 }}>
            <div className="rr-card-layer" style={{ width: "auto" }}>
              <p className="rr-card-layer__title">rr-stagger · Kind 1</p>
            </div>
            <div className="rr-card-layer" style={{ width: "auto" }}>
              <p className="rr-card-layer__title">rr-stagger · Kind 2</p>
            </div>
            <div className="rr-card-layer" style={{ width: "auto" }}>
              <p className="rr-card-layer__title">rr-stagger · Kind 3</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 19 · Zitat / Testimonial (E6) */}
      {/* ---------------------------------------------------------- */}
      <Section n="19" title="Zitat / Testimonial (rr-quote)">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Ehrlich: 5,0 auf Google bei 3 Rezensionen. Echte Kundenzitate, keine erfundenen Zahlen.
        </p>
        <div className="rr-quote" style={{ marginBottom: 32 }}>
          <p className="rr-quote__mark" aria-hidden="true">&rdquo;</p>
          <p className="rr-quote__text">
            Für unsere beiden Firmen wurden zwei Webseiten erstellt. Die Zusammenarbeit war äußerst
            präzise, auf all unsere Wünsche wurde detailliert eingegangen, und wir sind mit den
            Ergebnissen sehr zufrieden! Danke!
          </p>
          <div className="rr-quote__attr">
            <span className="rr-quote__name">Rafael Danesh</span>
            <span className="rr-quote__stars" aria-label="5 von 5 Sternen">★★★★★</span>
            <span className="rr-quote__src">Google-Rezension</span>
          </div>
        </div>
        <div className="rr-quote rr-quote--editorial">
          <p className="rr-quote__mark" aria-hidden="true">&rdquo;</p>
          <p className="rr-quote__text">
            Red Rabbit hat meine Webseite erneuert. Ich habe jetzt ein Kontaktformular, Kunden
            können Termine direkt über die Webseite bei mir buchen und es wird auch mit meinem
            Kalender synchronisiert. ... Habe im ersten Monat nach der Umstellung einige neue
            Kundenanfragen bekommen und bin sehr zufrieden mit der Leistung.
          </p>
          <div className="rr-quote__attr">
            <span className="rr-quote__name">Dmitry Pashlov</span>
            <span className="rr-quote__stars" aria-label="5 von 5 Sternen">★★★★★</span>
            <span className="rr-quote__src">Google-Rezension</span>
          </div>
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          Drittes Zitat (Rene Rohrer, &bdquo;100 Prozent Empfehlung&ldquo;) steht bereit fuer eine
          dritte Einsatzstelle (z. B. Referenzen-Seite), rr-quote / rr-quote--editorial.
        </p>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 20 · Tags (E7) */}
      {/* ---------------------------------------------------------- */}
      <Section n="20" title="Tags (rr-tag)">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Outline-Basis, semantische Modifier ueber Tokens. Fuer Branche, Region oder Status.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <span className="rr-tag">Handwerk</span>
          <span className="rr-tag">Gastronomie</span>
          <span className="rr-tag rr-tag--red">Neu</span>
          <span className="rr-tag rr-tag--navy">Referenz</span>
          <span className="rr-tag rr-tag--ok">Live</span>
          <span className="rr-tag rr-tag--warn">In Arbeit</span>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 21 · Referenz-Tabelle (E8) */}
      {/* ---------------------------------------------------------- */}
      <Section n="21" title="Referenz-Tabelle (rr-reftable)">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Hairline-Tabelle statt Karten-Grid, wenn viele Referenzen kompakt gelistet werden sollen.
        </p>
        <table className="rr-reftable">
          <thead>
            <tr>
              <th scope="col">Kunde</th>
              <th scope="col">Branche</th>
              <th scope="col">Jahr</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Kunde 1", "Kosmetik", "2025"],
              ["Kunde 2", "Handwerk", "2025"],
              ["Kunde 3", "Heizung & Sanitaer", "2026"],
              ["Kunde 4", "Immobilien", "2026"],
              ["Kunde 5", "Gastronomie", "2026"],
            ].map(([name, branche, year]) => (
              <tr key={name}>
                <td><span className="rr-reftable__name">{name}</span></td>
                <td><span className="rr-reftable__branche">{branche}</span></td>
                <td><span className="rr-reftable__year">{year}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 22 · Prosa (E9) */}
      {/* ---------------------------------------------------------- */}
      <Section n="22" title="Prosa (rr-prose)">
        <p className="rr-meta" style={{ marginBottom: 24, maxWidth: 720 }}>
          Fliesstext-Regeln fuer Artikel/Blog: max-width 68ch, rote Link-Unterstreichung, rote
          Quadrat-Marker bei Listen, rote tabular-nums-Ziffern bei nummerierten Listen, schmales
          Zitat mit kleinem roten Anfuehrungszeichen.
        </p>
        <div className="rr-prose">
          <p>
            Eine gute Website ist kein Kunstprojekt, sondern ein Werkzeug. Sie soll laden, ohne dass
            man wartet, und Vertrauen aufbauen, ohne dass man es merkt. Mehr dazu in unserem{" "}
            <a href="#">Leitfaden fuer den Mittelstand</a>.
          </p>
          <ul>
            <li>Klar strukturiert statt ueberladen</li>
            <li>Schnell auf dem Handy, nicht nur am Schreibtisch</li>
            <li>Fixpreis, keine Ueberraschungen</li>
          </ul>
          <ol>
            <li>Kurzes Erstgespraech</li>
            <li>Fixangebot schriftlich</li>
            <li>Umsetzung, Anzahlung erst bei Zusage</li>
          </ol>
          <blockquote>
            Ich bin von der Firma begeistert, vor allem von der Umsetzung.
          </blockquote>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 23 · Premium-Layer — Typografie (P1, P2, P5) */}
      {/* ---------------------------------------------------------- */}
      <Section n="23" title="Premium-Layer — Kinetic, Outline, Blocktext">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Drei typografische Signatur-Effekte. Sparsam einsetzen, nicht kombinieren.
        </p>
        <div style={{ display: "grid", gap: 40 }}>
          <div>
            <p style={dsSubhead}>P1 · Kinetic-Headline (rr-kinetic) — Hover fuer Weight-Morph</p>
            <p className="rr-kinetic">
              <KineticWord word="HANDWERK" />
            </p>
          </div>
          <div style={{ background: "var(--rr-navy)", padding: "40px 32px" }}>
            <p style={{ ...dsSubhead, color: "rgba(255,255,255,0.6)" }}>
              P2 · Outline-Word (rr-outline-word--ondark) — Hover/Fokus fuellt Off-White
            </p>
            <a href="#" className="rr-outline-word rr-outline-word--ondark" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
              SICHTBAR
            </a>
          </div>
          <div>
            <p style={dsSubhead}>P5 · Block-Text (rr-blocktext) — harte Farbbloecke, max. 1x pro Seite</p>
            <p className="rr-blocktext">Fair. Schnell. Sichtbar.</p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 24 · Premium-Layer — Shatter & Draw-Line (P3, P4) */}
      {/* ---------------------------------------------------------- */}
      <Section n="24" title="Premium-Layer — Shatter &amp; Draw-Line">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          P3: Fragment-Bild setzt sich beim Scrollen zusammen (Referenzen/Case-Details, sparsam).
          P4: rote Linie waechst mit dem Scroll-Fortschritt.
        </p>
        <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div>
            <p style={dsSubhead}>P3 · rr-shatter (Duoton-Platzhalter [PROJEKT-FOTO])</p>
            <div
              className="rr-shatter"
              style={{ ["--rr-shatter-img" as string]: "linear-gradient(135deg, var(--rr-world-1-bg), var(--rr-navy))" }}
            >
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
              <div className="rr-shatter__frag" />
            </div>
          </div>
          <div>
            <p style={dsSubhead}>P4 · rr-drawline (im Kasten scrollen)</p>
            <div style={dsScrollStage}>
              <p className="rr-body" style={{ marginBottom: 24 }}>Referenzen</p>
              <div className="rr-drawline" />
              <p className="rr-meta" style={{ marginTop: 200 }}>Ende des Scroll-Bereichs.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 25 · Premium-Layer — Magnetic Button (P6) */}
      {/* ---------------------------------------------------------- */}
      <Section n="25" title="Premium-Layer — Magnetic Button">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Max. 8px Verschiebung Richtung Cursor, ease-out zurueck. Nur <code>pointer: fine</code>,
          nur 1-2 Haupt-CTAs pro Seite. Zum Pruefen mit der Maus ueber den Button fahren (Desktop).
        </p>
        <a href="#" className="rr-btn-sweep rr-btn-sweep--red rr-magnetic" data-rr-magnetic>
          Jetzt anfragen
        </a>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 26 · Premium-Layer — Bild-Duoton &amp; Grain (P7) */}
      {/* ---------------------------------------------------------- */}
      <Section n="26" title="Premium-Layer — Bild-Duoton &amp; Grain">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Bild-Standard fuer Cases/Ueber-uns: Graustufen-Foto + Farb-Overlay, dazu optional feines
          Grain-Rauschen. Platzhalter statt echtem Foto.
        </p>
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div className="rr-img-duo rr-img-duo--teal" style={{ aspectRatio: "4 / 3" }}>
            <div className="rr-img-duo__ph" style={{ background: "linear-gradient(135deg, #cfd3d8, #8a8f98)" }} />
          </div>
          <div className="rr-img-duo rr-img-duo--navy" style={{ aspectRatio: "4 / 3" }}>
            <div className="rr-img-duo__ph" style={{ background: "linear-gradient(135deg, #cfd3d8, #8a8f98)" }} />
          </div>
          <div className="rr-grain" style={{ aspectRatio: "4 / 3", background: "var(--rr-surface)", border: "1px solid var(--rr-line)" }} />
        </div>
        <p className="rr-meta" style={{ marginTop: 18 }}>
          rr-img-duo--teal · rr-img-duo--navy · rr-grain (drittes Feld, ohne Bild, zeigt nur das Rauschen)
        </p>
      </Section>

      <footer className="rr-section" style={{ paddingTop: 20 }}>
        <div className="rr-wrap">
          <hr className="rr-hairline" />
          <p className="rr-meta" style={{ marginTop: 24 }}>
            Route /design-system · noindex, nofollow · Quelle: app/styleguide/styleguide.css,
            lib/relaunch/fonts.ts, DESIGN.md, components/relaunch/*
          </p>
        </div>
      </footer>

      <style>{DS_CSS}</style>
      <script dangerouslySetInnerHTML={{ __html: MAGNETIC_JS }} />
    </div>
  );
}

const dsRuleList: React.CSSProperties = {
  margin: "0",
  padding: 0,
  listStyle: "none",
  display: "grid",
  gap: 12,
  fontFamily: "var(--rr-font-ui)",
  fontSize: 15.5,
  lineHeight: 1.5,
  color: "var(--rr-ink-soft)",
};

const dsSwatchGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: 16,
};

const dsWorldGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16,
};

const dsWorldTile: React.CSSProperties = {
  borderRadius: 12,
  padding: "28px 22px",
  minHeight: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  gap: 8,
};

const dsWorldEyebrow: React.CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 15,
  fontWeight: 650,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  margin: 0,
};

const dsWorldHex: React.CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 13,
  color: "rgba(255,255,255,0.75)",
  margin: 0,
};

const dsPairCol: React.CSSProperties = {
  display: "grid",
  gap: 10,
  maxWidth: 260,
  alignContent: "start",
};

const dsSubhead: React.CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 12.5,
  fontWeight: 650,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--rr-ink-soft)",
  margin: "34px 0 16px",
};

const dsBtnGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 24,
  alignItems: "start",
};

const dsToken: React.CSSProperties = {
  fontFamily: "var(--rr-font-ui)",
  fontSize: 13,
  fontWeight: 550,
  color: "var(--rr-ink)",
  background: "var(--rr-surface)",
  border: "1px solid var(--rr-line)",
  borderRadius: 8,
  padding: "8px 12px",
};

const dsMotionCard: React.CSSProperties = {
  background: "var(--rr-surface)",
  border: "1px solid var(--rr-line)",
  borderRadius: 14,
  padding: "22px 24px",
  minHeight: 96,
};

const dsCandidateCard: React.CSSProperties = {
  border: "1px solid var(--rr-line)",
  borderRadius: 14,
  padding: "18px 20px",
  background: "var(--rr-paper)",
};

const dsToggleCell: React.CSSProperties = {
  display: "grid",
  gap: 16,
  justifyItems: "center",
  textAlign: "center",
  width: 160,
  paddingTop: 104,
};

const dsBuildingGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 28,
};

const dsBuildCard: React.CSSProperties = {
  border: "1px solid var(--rr-line)",
  borderRadius: 16,
  padding: 20,
};

/* Scroll-Container fuer die rr-reveal/rr-stagger/rr-drawline-Demos:
   animation-timeline: view() braucht keinen echten Seiten-Scroll,
   ein eigener scrollbarer Kasten reicht (nur zur Vorschau hier). */
const dsScrollStage: React.CSSProperties = {
  height: 260,
  overflowY: "auto",
  border: "1px solid var(--rr-line)",
  padding: 24,
  background: "var(--rr-paper)",
};

/* P6 · Magnetic Button — max 8px Richtung Cursor, ease-out zurueck,
   nur pointer:fine, respektiert prefers-reduced-motion. */
const MAGNETIC_JS = `
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (reduced || !fine) return;
  var els = document.querySelectorAll("[data-rr-magnetic]");
  els.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      var max = 8;
      var tx = Math.max(-max, Math.min(max, x * 0.3));
      var ty = Math.max(-max, Math.min(max, y * 0.3));
      el.style.transform = "translate(" + tx + "px," + ty + "px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "translate(0,0)";
    });
  });
})();
`;

const DS_CSS = `
.rr .ds-logo-lg { height: 120px; width: auto; display: block; }
.rr .ds-logo-sm { height: 48px; width: auto; display: block; }
.rr .ds-logo-xs { height: 30px; width: auto; display: block; }

.rr .ds-navlink {
  font-family: var(--rr-font-display);
  font-weight: 560;
  font-size: 28px;
  color: #fff;
  letter-spacing: -0.02em;
  display: inline-block;
  transition: color 240ms var(--rr-ease), transform 240ms var(--rr-ease);
  cursor: pointer;
}
.rr .ds-navlink:hover {
  color: var(--rr-red);
  transform: translateX(10px) skewX(-5deg);
}

.rr .ds-footlink {
  font-family: var(--rr-font-ui);
  font-size: 16px;
  font-weight: 500;
  color: rgba(255,255,255,0.72);
  text-decoration: none;
  transition: color 200ms var(--rr-ease);
}
.rr .ds-footlink:hover { color: #ff5f6d; }

.rr .ds-motion-stage {
  border: 1px solid var(--rr-line);
  border-radius: 16px;
  background: var(--rr-surface);
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rr .ds-motion-word {
  display: inline-flex;
  font-family: var(--rr-font-display);
  font-weight: 560;
  font-size: clamp(48px, 6vw, 84px);
  letter-spacing: -0.01em;
  color: var(--rr-ink);
  cursor: default;
}
.rr .ds-motion-letter {
  display: inline-block;
  transform: rotate(calc((var(--i) - 2.5) * 7deg)) translateY(calc(var(--i) * 1px + 10px));
  opacity: 0.55;
  transition: transform 620ms var(--rr-ease), opacity 620ms var(--rr-ease), color 620ms var(--rr-ease);
  transition-delay: calc(var(--i) * 40ms);
}
.rr .ds-motion-word:hover .ds-motion-letter {
  transform: rotate(0deg) translateY(0);
  opacity: 1;
  color: var(--rr-red);
}

.rr .ds-menu-preview {
  background: #1c2837;
  border-radius: 12px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}
.rr .ds-menu-preview::before {
  content: "";
  position: absolute;
  top: -30%;
  right: -20%;
  width: 70%;
  height: 140%;
  background: radial-gradient(closest-side, rgba(241,32,50,0.22), rgba(241,32,50,0) 70%);
  pointer-events: none;
}
.rr .ds-menu-preview-eyebrow {
  position: relative;
  font-family: var(--rr-font-ui);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--rr-red);
  margin: 0 0 18px;
}
.rr .ds-menu-preview-link {
  position: relative;
  font-family: var(--rr-font-display);
  font-weight: 560;
  font-size: 26px;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.rr .ds-footer-preview {
  background: #1c2837;
  border-radius: 12px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.rr .ds-footer-preview-name {
  font-family: var(--rr-font-display);
  font-size: 20px;
  font-weight: 560;
  color: #fff;
  margin: 0;
}
.rr .ds-footer-preview-tag {
  font-family: var(--rr-font-ui);
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  max-width: 30ch;
  margin: 0;
}

.rr .ds-gutter-demo {
  display: grid;
  grid-template-columns: var(--rr-gutter) 1fr var(--rr-gutter);
  border: 1px solid var(--rr-line);
  border-radius: 12px;
  overflow: hidden;
  height: 96px;
}
.rr .ds-gutter-bar { background: repeating-linear-gradient(45deg, var(--rr-surface), var(--rr-surface) 6px, #fff 6px, #fff 12px); }
.rr .ds-gutter-inner { display: flex; align-items: center; justify-content: center; background: var(--rr-paper); }

.rr .ds-rhythm-demo {
  display: grid;
  margin-top: 24px;
  border: 1px solid var(--rr-line);
  border-radius: 12px;
  overflow: hidden;
}
.rr .ds-rhythm-block {
  background: var(--rr-surface);
  font-family: var(--rr-font-ui);
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rr-ink-soft);
  padding: 18px 20px;
}
.rr .ds-rhythm-gap {
  background: repeating-linear-gradient(-45deg, #fff, #fff 6px, var(--rr-surface) 6px, var(--rr-surface) 12px);
  min-height: var(--rr-section-y);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--rr-font-ui);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rr-red);
}

@media (max-width: 860px) {
  .rr .ds-grid-2 { grid-template-columns: 1fr !important; }
}
`;
