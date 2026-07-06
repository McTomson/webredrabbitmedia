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

/* Line-Draw-Button (Kandidat 10) — feste Markup-Reihenfolge:
   zwei Kappen-Linien, Text, zwei drow-Akzente. */
function DrawBtn({ variant, label }: { variant: string; label: string }) {
  return (
    <a className={`rr-btn-draw rr-btn-draw--${variant}`} href="#">
      <span className="rr-btn-draw__line" />
      <span className="rr-btn-draw__line" />
      <span className="rr-btn-draw__text">{label}</span>
      <span className="rr-btn-draw__drow1" />
      <span className="rr-btn-draw__drow2" />
    </a>
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
        <span className="rr-toggle__handle-wrapper">
          <span className="rr-toggle__handle">
            <span className="rr-toggle__knob" />
            <span className="rr-toggle__bar-wrapper">
              <span className="rr-toggle__bar" />
            </span>
          </span>
        </span>
        <span className="rr-toggle__base">
          <span className="rr-toggle__base-inside" />
        </span>
      </label>
      <p className="rr-meta">{label}</p>
    </div>
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
            <p className="rr-eyebrow">Handwerk · Service · Kaernten</p>
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
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Barrierefreies Dropdown (Listbox-Semantik) fuer Navigation und Formulare, plus ein
          natives <code>&lt;select&gt;</code> im Marken-Stil. Bedienbar mit Maus und Tastatur:
          Pfeil hoch/runter, Home/End, Enter/Space waehlt, Esc schliesst, Tippen springt zum
          Eintrag. Schliesst bei Aussenklick. Oeffnen ist animiert (Master-Easing), ohne
          Layout-Shift.
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
            <p className="rr-meta">RelaunchDropdown.tsx · role=&quot;listbox&quot;, Tastatur + aria-activedescendant</p>
          </div>
          <div style={{ ...dsPairCol, maxWidth: 300 }}>
            <select className="rr-select-native" aria-label="Region waehlen (nativ)" defaultValue="ktn">
              <option value="ktn">Kaernten</option>
              <option value="stmk">Steiermark</option>
              <option value="ooe">Oberoesterreich</option>
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
      {/* 09 · Buttons - Metallisch (Kandidat) */}
      {/* ---------------------------------------------------------- */}
      <Section n="09" title="Buttons - Metallisch">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Taktiler Druckknopf mit Verlaufs-Flaeche und geschichteten Schatten. Beim Hover ein leichtes
          Leuchten, beim Druecken sinkt die Flaeche ein (Inset). Drei Flaechen zur Auswahl, Markenrot
          immer dabei. Zum Pruefen mit der Maus drueberfahren und klicken.
        </p>
        <div style={dsBtnGrid}>
          <div style={dsPairCol}>
            <div><a className="rr-btn-metal rr-btn-metal--red" href="#">Projekt anfragen</a></div>
            <p className="rr-meta">rr-btn-metal--red · rote Flaeche, heller Text</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn-metal rr-btn-metal--navy" href="#">Referenzen</a></div>
            <p className="rr-meta">rr-btn-metal--navy · dunkle Navy-Flaeche</p>
          </div>
          <div style={dsPairCol}>
            <div><a className="rr-btn-metal rr-btn-metal--light" href="#">Mehr erfahren</a></div>
            <p className="rr-meta">rr-btn-metal--light · neutral, hell (Original-Anmutung)</p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* 10 · Buttons - Line-Draw (Kandidat) */}
      {/* ---------------------------------------------------------- */}
      <Section n="10" title="Buttons - Line-Draw">
        <p className="rr-meta" style={{ marginBottom: 28, maxWidth: 720 }}>
          Beim Hover spreizt sich die Schrift, eine abgerundete Linie zeichnet sich rund um die Pille
          und kleine Akzente ziehen ein. Drei Farbthemen ueber <code>--line_color</code> /{" "}
          <code>--back_color</code>, Markenrot inklusive. Zum Pruefen mit der Maus drueberfahren.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "56px 48px",
            alignItems: "center",
            background: "var(--rr-surface)",
            border: "1px solid var(--rr-line)",
            borderRadius: 16,
            padding: "64px 40px",
          }}
        >
          <DrawBtn variant="red" label="ANFRAGEN" />
          <DrawBtn variant="navy" label="REFERENZEN" />
          <DrawBtn variant="ink" label="KONTAKT" />
        </div>
        <p className="rr-meta" style={{ marginTop: 14 }}>
          rr-btn-draw--red (Markenrot) · rr-btn-draw--navy · rr-btn-draw--ink
        </p>
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
          Schalter mit rotem Knopf, der beim Umlegen rotiert (maskierter Griff, plastische Basis). Der
          Knopf ist bereits markenkonform rot. Das Stock-Gruen im Ein-Zustand ist auf Navy umgestellt,
          alternativ auf Markenrot. Zum Pruefen anklicken.
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
