import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import CornerLogo from "@/components/relaunch/CornerLogo";
import RelaunchMenu from "@/components/relaunch/RelaunchMenu";
import FooterReassembly from "@/components/relaunch/FooterReassembly";
import TalosHeroStage from "@/components/relaunch/talos/TalosHeroStage";
import FragTalos from "@/components/relaunch/talos/FragTalos";
import { crimson, dmsans, fraunces, grotesk } from "@/lib/relaunch/fonts";
import "@/app/styleguide/styleguide.css";

// Leistungs-HUB (Entwurf, noindex). Hauptseite = beide Haelften (Website + Talos),
// Haus-Stil (.rr). Talos lebendig im Hero (kontainiert), Frag-Talos eingebettet.
// Preise NICHT hier (leben auf /preise). Struktur: docs/strategie/LEISTUNGEN_IA_2026-07.md.
export const metadata: Metadata = {
  title: "Leistungen (Hub-Entwurf) · Red Rabbit Media",
  robots: { index: false, follow: false },
};

const PHONE_TEL = "+436769000955";
const rrFonts = `rr ${dmsans.variable} ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`;

const FUNDAMENT: { title: string; body: string }[] = [
  { title: "Schnelles, sicheres Hosting", body: "Deine Seite ist rund um die Uhr erreichbar und lädt zügig." },
  { title: "Dein Dashboard in Klartext", body: "Die Zahlen zu deiner Seite, ohne Fachchinesisch, auf einen Blick." },
  { title: "Texte und Bilder selbst ändern", body: "Neuer Preis, neues Foto vom Projekt? Änderst du in Minuten, ohne uns anzurufen." },
  { title: "Ausfall-Alarm", body: "Sollte etwas haken, wissen wir es sofort, oft bevor du es merkst." },
  { title: "Monatlicher Bericht", body: "Kurz und ehrlich: wie schnell deine Seite ist und wie gut man dich findet." },
  { title: "Pflege im Hintergrund", body: "Technik und Sicherheit bleiben aktuell, ohne dass du einen Finger rührst." },
];

const MODULE: { title: string; body: string }[] = [
  { title: "Der Schreiber", body: "Schreibt Beiträge für deinen Betrieb und verteilt sie, damit man dich findet. Nichts geht raus ohne deinen Klick." },
  { title: "Der Empfang", body: "Nimmt Termine und Anfragen entgegen und hakt von selbst nach, wenn sich jemand nicht meldet." },
  { title: "Auf Anfrage", body: "Vertrieb, Ruf und Bewertungen, mehr Sichtbarkeit: sag Talos, was du brauchst." },
];

const SCHRITTE: { title: string; body: string }[] = [
  { title: "Wir reden kurz", body: "Du erzählst von deinem Betrieb, wir hören zu. Kein Verkaufsdruck." },
  { title: "Wir bauen einen Entwurf, ohne Vorkasse", body: "Du siehst deine Seite, bevor du einen Cent zahlst." },
  { title: "Gefällt er dir, geht sie live", body: "Erst dann wird es fest. Sagt dir was nicht zu, kostet es dich nichts." },
];

export default async function LeistungenHubPage() {
  const posts = (await getAllPosts()).filter((p) => p.status === "published");
  const articleCount = posts.length;

  return (
    <>
      {/* Ecken-Logo (rote Hasen-Marke oben links) — gemeinsames Bauteil,
          blendet erst nach dem Zerlegen der Hero-Woerter ein. */}
      <CornerLogo />

      <div className={rrFonts} style={{ background: "transparent" }}>
        <RelaunchMenu />
      </div>

      <div className={rrFonts} style={{ background: "#ffffff" }}>
        <main className="lh">
          {/* 1 — HERO */}
          <section className="lh-hero">
            <div className="lh-hero-text">
              <p className="lh-eyebrow">Deine neue Website</p>
              <h1 className="lh-h1">
                Wir bauen deine Website. Talos zieht ein und arbeitet ab Tag eins für dich.
              </h1>
              <p className="lh-sub">
                Individuell gebaut, kein Baukasten, kein Template von der Stange. Zum Fixpreis, und sie
                gehört dir. Sie steht nicht nur schön da, sondern bleibt in Bewegung.
              </p>
              <p className="lh-say">
                Ich bin Talos. Ich sitze in deiner Website und halte den Laden am Laufen, während du auf
                der Baustelle stehst.
              </p>
              <div className="lh-cta-row">
                <Link href="/relaunch-preview/kontakt" className="lh-btn lh-btn--red">
                  Entwurf ohne Vorkasse holen
                </Link>
                <a href="#frag-talos" className="lh-btn lh-btn--ghost">
                  Frag Talos
                </a>
              </div>
            </div>
            <div className="lh-hero-stage">
              <TalosHeroStage />
            </div>
          </section>

          {/* 2 — DIE ZWEI HAELFTEN */}
          <section className="lh-section">
            <div className="lh-wrap">
              <h2 className="lh-h2 lh-center">Du bekommst zwei Dinge, die zusammengehören.</h2>
              <div className="lh-halves">
                <article className="lh-panel">
                  <p className="lh-panel-eyebrow">Teil 1</p>
                  <h3 className="lh-panel-title">Deine Website</h3>
                  <p className="lh-panel-body">
                    Von Hand für deinen Betrieb gebaut, nicht aus der Schublade. Sie lädt schnell, sieht aus
                    wie dein Handwerk und gehört dir, ohne monatliche Miete auf den Bau. Ein Fixpreis, den du
                    vorher kennst.
                  </p>
                  <Link href="/relaunch-preview/leistungen" className="lh-link">
                    Mehr zur Website
                  </Link>
                </article>
                <article className="lh-panel">
                  <p className="lh-panel-eyebrow">Teil 2</p>
                  <h3 className="lh-panel-title">Talos, dein Dashboard</h3>
                  <p className="lh-panel-body">
                    Talos ist die Figur, die in deiner Seite wohnt. Bei ihm loggst du dich ein und siehst in
                    Klartext, was deine Website macht. Die Basis kann er ab dem ersten Tag. Kann er mehr,
                    mietest du ihm einfach eine Fähigkeit dazu.
                  </p>
                  <Link href="/relaunch-preview/talos-intro" className="lh-link">
                    Was Talos kann
                  </Link>
                </article>
              </div>
            </div>
          </section>

          {/* 3 — DIE BRUECKE */}
          <section className="lh-section lh-section--surface">
            <div className="lh-wrap">
              <p className="lh-eyebrow lh-center">In jeder Website drin</p>
              <h2 className="lh-h2 lh-center">In jeder Website steckt schon ein Fundament.</h2>
              <p className="lh-sub lh-center lh-measure">
                Sechs Dinge sind immer dabei, ohne Aufpreis. Damit deine Seite nicht nur online ist, sondern
                auch am Laufen bleibt.
              </p>
              <ul className="lh-grid lh-grid-3">
                {FUNDAMENT.map((f) => (
                  <li key={f.title} className="lh-feature">
                    <span className="lh-feature-title">{f.title}</span>
                    <span className="lh-feature-body">{f.body}</span>
                  </li>
                ))}
              </ul>

              <h3 className="lh-h3 lh-center lh-mt">Dazu mietest du Talos Fähigkeiten dazu.</h3>
              <ul className="lh-grid lh-grid-3">
                {MODULE.map((m) => (
                  <li key={m.title} className="lh-module">
                    <span className="lh-module-title">{m.title}</span>
                    <span className="lh-module-body">{m.body}</span>
                  </li>
                ))}
              </ul>
              <p className="lh-center lh-mt-sm">
                <Link href="/relaunch-preview/talos-intro" className="lh-link">
                  Alles, was Talos kann
                </Link>
              </p>
            </div>
          </section>

          {/* 4 — DER BEWEIS */}
          <section className="lh-section">
            <div className="lh-wrap lh-narrow">
              <p className="lh-eyebrow">Kein Versprechen, ein Nachweis</p>
              <h2 className="lh-h2">Wir machen das zuerst mit uns selbst.</h2>
              <p className="lh-sub">
                Unsere eigene Artikel-Maschine hat bis heute {articleCount} Beiträge geschrieben und
                verteilt. Dieselbe Technik, die wir dir in die Website setzen. Wenn es bei uns nicht laufen
                würde, würden wir es dir nicht verkaufen.
              </p>
              <p className="lh-say">
                Die {articleCount} Beiträge hab ich nicht über Nacht getippt. Ich mach das jeden Tag, still
                im Hintergrund. Genau so arbeite ich auch für dich.
              </p>
            </div>
          </section>

          {/* 5 — FRAG TALOS */}
          <section id="frag-talos" className="lh-section lh-section--surface">
            <div className="lh-wrap lh-narrow">
              <p className="lh-eyebrow">Unsicher, was du brauchst?</p>
              <h2 className="lh-h2">Stell Talos ein paar Fragen, dann weißt du mehr.</h2>
              <p className="lh-sub">
                Fünf kurze Fragen zu deinem Betrieb, mehr nicht. Danach sagt dir Talos ehrlich, was zu dir
                passt und was du dir sparen kannst. Unverbindlich, und du kannst jederzeit aussteigen.
              </p>
              <p className="lh-say">Ich verkauf dir nichts, was du nicht brauchst. Fang ruhig klein an.</p>
              <FragTalos />
            </div>
          </section>

          {/* 6 — SO ARBEITEN WIR */}
          <section className="lh-section">
            <div className="lh-wrap">
              <h2 className="lh-h2 lh-center">In drei Schritten steht deine Seite.</h2>
              <ol className="lh-grid lh-grid-3 lh-steps">
                {SCHRITTE.map((s, i) => (
                  <li key={s.title} className="lh-step">
                    <span className="lh-step-num">{i + 1}</span>
                    <span className="lh-step-title">{s.title}</span>
                    <span className="lh-step-body">{s.body}</span>
                  </li>
                ))}
              </ol>
              <p className="lh-center lh-honest">
                Du musst nicht alles auf einmal nehmen. Fang mit der Website an und hol dir Talos Fähigkeiten
                dazu, wenn du sie brauchst.
              </p>
            </div>
          </section>

          {/* 7 — SCHLUSS-CTA */}
          <section className="lh-section lh-section--close">
            <div className="lh-wrap lh-narrow lh-center">
              <h2 className="lh-h2">Lass uns deine Seite bauen. Talos wartet schon.</h2>
              <p className="lh-sub lh-measure lh-mx-auto">
                Ein kurzes Gespräch, ein Entwurf ohne Vorkasse, kein Risiko für dich. Du entscheidest erst,
                wenn du deine fertige Seite siehst.
              </p>
              <div className="lh-cta-row lh-cta-center">
                <Link href="/relaunch-preview/kontakt" className="lh-btn lh-btn--red">
                  Entwurf ohne Vorkasse holen
                </Link>
                <a href={`tel:${PHONE_TEL}`} className="lh-btn lh-btn--ghost">
                  Anrufen
                </a>
              </div>
              <p className="lh-note">
                Was das kostet?{" "}
                <Link href="/preise" className="lh-link">
                  Preise ansehen
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>

      <div className={rrFonts} style={{ background: "transparent", position: "relative", zIndex: 50 }}>
        <FooterReassembly />
      </div>

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </>
  );
}

const CSS = `
.lh{ position:relative; color:var(--rr-ink,#23262e);
  font-family:var(--rr-font-ui,"Instrument Sans",system-ui,sans-serif); }
.lh *{ box-sizing:border-box; }
.lh-wrap{ max-width:1180px; margin:0 auto; }
.lh-narrow{ max-width:760px; }
.lh-measure{ max-width:640px; }
.lh-mx-auto{ margin-left:auto; margin-right:auto; }
.lh-center{ text-align:center; }
.lh-mt{ margin-top:clamp(48px,6vw,84px); }
.lh-mt-sm{ margin-top:28px; }

.lh-eyebrow{ font-family:var(--rr-font-ui,inherit); font-size:13px; font-weight:650; letter-spacing:.18em;
  text-transform:uppercase; color:var(--rr-red,#f12032); margin:0 0 16px; }
.lh-h1{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.02em;
  font-size:clamp(2rem,4.4vw,3.4rem); line-height:1.02; color:var(--rr-ink,#23262e); margin:0; text-wrap:balance; }
.lh-h2{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.018em;
  font-size:clamp(1.6rem,3.2vw,2.5rem); line-height:1.06; color:var(--rr-ink,#23262e); margin:0; text-wrap:balance; }
.lh-h3{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.015em;
  font-size:clamp(1.25rem,2.2vw,1.7rem); line-height:1.1; color:var(--rr-ink,#23262e); margin:0; }
.lh-sub{ font-size:clamp(1.02rem,1.25vw,1.15rem); line-height:1.55; color:var(--rr-ink-soft,#5a5e68); margin:18px 0 0; }
.lh-say{ font-family:var(--rr-font-serif,"Crimson Pro",Georgia,serif); font-weight:500;
  font-size:clamp(1.15rem,1.7vw,1.4rem); line-height:1.28; color:var(--rr-ink,#23262e); margin:22px 0 0;
  padding-left:16px; border-left:2px solid #39c2d7; }

/* Sektionen */
.lh-section{ padding:clamp(80px,11vw,160px) var(--rr-gutter,clamp(20px,4.6vw,72px)); }
.lh-section--surface{ background:var(--rr-surface,#f4f4f2); }
.lh-section--close{ background:var(--rr-navy,#1c2837); color:#f6f5f1; }
.lh-section--close .lh-h2{ color:#fff; }
.lh-section--close .lh-sub{ color:#c9d2dc; }

/* Hero */
.lh-hero{ display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(24px,4vw,64px); align-items:center;
  padding:clamp(96px,12vw,168px) var(--rr-gutter,clamp(20px,4.6vw,72px)) clamp(64px,8vw,120px);
  max-width:1320px; margin:0 auto; }
.lh-hero-text{ max-width:620px; }
.lh-hero-stage{ position:relative; height:clamp(360px,52vh,600px); overflow:hidden; }

.lh-cta-row{ margin-top:30px; display:flex; flex-wrap:wrap; gap:14px; align-items:center; }
.lh-cta-center{ justify-content:center; }
.lh-btn{ display:inline-flex; align-items:center; justify-content:center; padding:15px 30px; font-weight:600; font-size:1.02rem;
  border:1px solid transparent; text-decoration:none; cursor:pointer;
  transition:transform .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)),background .2s,border-color .2s,color .2s; }
.lh-btn:hover{ transform:translateY(-2px); }
.lh-btn:focus-visible{ outline:2px solid var(--rr-red,#f12032); outline-offset:3px; }
.lh-btn--red{ background:var(--rr-red,#f12032); color:#fff;
  box-shadow:var(--rr-shadow-btn,0 1px 2px rgba(28,40,55,.10),0 2px 8px rgba(28,40,55,.06)); }
.lh-btn--red:hover{ background:var(--rr-red-deep,#c81222); }
.lh-btn--ghost{ background:transparent; color:var(--rr-ink,#23262e); border-color:var(--rr-line,#e4e4e0); }
.lh-btn--ghost:hover{ border-color:var(--rr-ink,#23262e); }
.lh-section--close .lh-btn--ghost{ color:#f6f5f1; border-color:rgba(246,245,241,.4); }
.lh-section--close .lh-btn--ghost:hover{ border-color:#f6f5f1; }

/* Zwei Haelften */
.lh-halves{ margin-top:clamp(40px,5vw,72px); display:grid; grid-template-columns:1fr 1fr; gap:clamp(20px,2.6vw,34px); }
.lh-panel{ background:var(--rr-paper,#fff); border:1px solid var(--rr-line,#e4e4e0); border-top:3px solid var(--rr-red,#f12032);
  padding:clamp(28px,3vw,44px); display:flex; flex-direction:column; }
.lh-panel-eyebrow{ font-size:13px; font-weight:650; letter-spacing:.16em; text-transform:uppercase;
  color:var(--rr-ink-soft,#5a5e68); margin:0 0 12px; }
.lh-panel-title{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.015em;
  font-size:clamp(1.4rem,2.4vw,1.9rem); color:var(--rr-ink,#23262e); margin:0; }
.lh-panel-body{ font-size:1.02rem; line-height:1.55; color:var(--rr-ink-soft,#5a5e68); margin:14px 0 0; }
.lh-link{ margin-top:auto; padding-top:22px; align-self:flex-start; font-weight:600; color:var(--rr-red,#f12032);
  text-decoration:none; border-bottom:1px solid transparent; transition:border-color .2s var(--rr-ease,cubic-bezier(.6,0,.4,1)); }
.lh-link:hover{ border-bottom-color:var(--rr-red,#f12032); }
.lh-link::after{ content:" \\2192"; }

/* Grids */
.lh-grid{ list-style:none; margin:clamp(40px,5vw,64px) 0 0; padding:0; display:grid; gap:clamp(20px,2.6vw,32px); }
.lh-grid-3{ grid-template-columns:repeat(3,1fr); }
.lh-feature{ display:flex; flex-direction:column; gap:6px; padding:22px; background:var(--rr-paper,#fff);
  border:1px solid var(--rr-line,#e4e4e0); }
.lh-section--surface .lh-feature{ background:var(--rr-paper,#fff); }
.lh-feature-title{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.01em;
  font-size:1.05rem; color:var(--rr-ink,#23262e); }
.lh-feature-body{ font-size:.95rem; line-height:1.5; color:var(--rr-ink-soft,#5a5e68); }
.lh-module{ display:flex; flex-direction:column; gap:6px; padding:26px 24px; background:var(--rr-paper,#fff);
  border:1px solid var(--rr-line,#e4e4e0); border-top:3px solid var(--rr-red,#f12032); }
.lh-module-title{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.01em;
  font-size:1.15rem; color:var(--rr-ink,#23262e); }
.lh-module-body{ font-size:.96rem; line-height:1.5; color:var(--rr-ink-soft,#5a5e68); }

/* So arbeiten wir */
.lh-steps{ counter-reset:none; }
.lh-step{ display:flex; flex-direction:column; gap:8px; padding:28px 24px; background:var(--rr-surface,#f4f4f2);
  border:1px solid var(--rr-line,#e4e4e0); }
.lh-step-num{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; font-size:1.4rem;
  color:var(--rr-red,#f12032); line-height:1; }
.lh-step-title{ font-family:var(--rr-font-display,"DM Sans",sans-serif); font-weight:700; letter-spacing:-.01em;
  font-size:1.08rem; color:var(--rr-ink,#23262e); }
.lh-step-body{ font-size:.96rem; line-height:1.5; color:var(--rr-ink-soft,#5a5e68); }
.lh-honest{ margin:clamp(36px,4vw,56px) auto 0; max-width:640px; font-size:1.02rem; line-height:1.55;
  color:var(--rr-ink-soft,#5a5e68); }

.lh-note{ margin:24px 0 0; font-size:1rem; color:#c9d2dc; }
.lh-section--close .lh-link{ color:#fff; }
.lh-section--close .lh-link:hover{ border-bottom-color:#fff; }

/* Reveals leicht (fail-open: ohne Support sichtbar) */
@supports (animation-timeline: view()){
  .lh-hero-text,.lh-halves > *,.lh-feature,.lh-module,.lh-step,.lh-narrow{
    animation:lh-rise 700ms var(--rr-ease,cubic-bezier(.6,0,.4,1)) both; animation-timeline:view();
    animation-range:entry 0% cover 34%; }
}
@keyframes lh-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }

@media (max-width:900px){
  .lh-hero{ grid-template-columns:1fr; }
  .lh-hero-stage{ order:-1; height:clamp(300px,44vh,420px); }
  .lh-halves,.lh-grid-3{ grid-template-columns:1fr; }
}
@media (prefers-reduced-motion:reduce){
  .lh-btn:hover,.lh-link:hover{ transform:none; }
  .lh-hero-text,.lh-halves > *,.lh-feature,.lh-module,.lh-step,.lh-narrow{ animation:none; }
}
`;
