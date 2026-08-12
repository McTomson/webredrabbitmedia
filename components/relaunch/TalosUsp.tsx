import Link from "next/link";

/**
 * TalosUsp — USP-Block, der Red Rabbit von herkoemmlichen Webagenturen
 * abgrenzt (Thomas 12.08.): Bei jeder Website ist der Copilot Talos dabei,
 * ein eigener Bereich, in dem der Kunde sieht, ob er gefunden wird, woher
 * seine Besucher kommen und wer sich meldet. Ohne das ist man nach dem
 * Launch blind.
 *
 * Muster = LeistungenStory/TippsTunnel: eigener <style>-Block, Prefix
 * `.rrtu-`, KEIN styled-jsx, kein 3D, keine Motion-Abhaengigkeit. Nur eine
 * dezente CSS-Transition beim Hover (prefers-reduced-motion killt sie).
 *
 * Wird INNERHALB des `.rr`-Font-Wrappers gerendert, damit die echten
 * Marken-Bauteile greifen (rr-eyebrow-theme, rr-statement, rr-body-lg,
 * rr-btn-sweep--red). Die `.rrtu-`-Klassen liefern nur Layout/Struktur.
 */
export default function TalosUsp() {
  return (
    <section className="rrtu-root" aria-labelledby="rrtu-head">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rrtu-inner">
        <p className="rr-eyebrow-theme rrtu-eyebrow">Der Unterschied</p>
        <h2 id="rrtu-head" className="rr-statement rrtu-head">
          Die meisten Agenturen bauen deine Website und sind dann weg. Bei uns
          ist auf jeder Seite Talos dabei.
        </h2>
        <p className="rr-body-lg rrtu-lead">
          Talos ist dein Copilot, ein eigener Bereich, den nur du siehst.
        </p>

        <div className="rrtu-grid">
          <div className="rrtu-card rrtu-card--muted">
            <p className="rrtu-card-label">Herkömmliche Webagentur</p>
            <p className="rrtu-card-body">
              Website abgegeben, Rechnung bezahlt, fertig. Ob dich jemand
              findet, woher deine Besucher kommen, wer sich meldet, all das
              bleibt im Dunkeln. Nach dem Launch bist du blind.
            </p>
          </div>

          <div className="rrtu-card rrtu-card--rr">
            <p className="rrtu-card-label">Mit Red Rabbit</p>
            <p className="rrtu-card-body">
              Talos ist bei jeder Website dabei, dein eigener Bereich. Da siehst
              du, ob dich Google und die KI-Suchen finden, woher deine Besucher
              kommen und wer sich bei dir meldet. In Klartext, ohne dass du
              irgendwen anrufen musst.
            </p>
          </div>
        </div>

        <p className="rrtu-close">
          Ohne diesen Blick tappst du im Dunkeln. Mit Talos nicht.
        </p>
        <div className="rrtu-actions">
          <Link href="/leistungen/talos" className="rr-btn-sweep rr-btn-sweep--red">
            Talos ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.rrtu-root{
  background:#ffffff;
  color:#23262e;
  padding:var(--rr-section-y) var(--rr-gutter);
  overflow-x:clip;
}
.rrtu-root *{ box-sizing:border-box; }
.rrtu-inner{ max-width:1080px; margin:0 auto; }
.rrtu-eyebrow{ margin-bottom:18px; }
.rrtu-head{ max-width:24ch; }
.rrtu-lead{
  color:#5a5e68; margin-top:20px; max-width:44ch;
}
.rrtu-grid{
  display:grid; grid-template-columns:1fr 1fr; gap:20px;
  margin-top:clamp(36px,6vh,64px);
}
.rrtu-card{
  border:1px solid #e4e4e0; background:#ffffff; border-radius:0;
  padding:clamp(26px,3.4vw,40px);
  transition:transform .25s var(--rr-ease,cubic-bezier(.6,0,.4,1)), border-color .25s var(--rr-ease,cubic-bezier(.6,0,.4,1));
}
.rrtu-card--muted{ background:#f4f4f2; }
.rrtu-card--rr{ border-color:#f12032; border-width:1.5px; }
.rrtu-card--rr:hover{ transform:translateY(-3px); }
.rrtu-card-label{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:.8rem; text-transform:uppercase; letter-spacing:.12em;
  color:#5a5e68; margin:0 0 14px;
}
.rrtu-card--rr .rrtu-card-label{ color:#c81222; }
.rrtu-card-body{
  font-family:var(--font-grotesk),"Instrument Sans",sans-serif;
  font-size:clamp(1rem,1.4vw,1.12rem); line-height:1.6; color:#3a3e48;
  margin:0; max-width:42ch;
}
.rrtu-close{
  font-family:var(--font-crimson),"Crimson Pro",Georgia,serif;
  font-size:clamp(1.3rem,2.4vw,1.9rem); line-height:1.2; color:#23262e;
  margin:clamp(36px,6vh,64px) 0 0; max-width:28ch;
}
.rrtu-actions{ margin-top:clamp(24px,4vh,36px); }

@media (max-width:820px){
  .rrtu-grid{ grid-template-columns:1fr; }
}
@media (prefers-reduced-motion:reduce){
  .rrtu-card,.rrtu-card--rr:hover{ transition:none; transform:none; }
}
`;
