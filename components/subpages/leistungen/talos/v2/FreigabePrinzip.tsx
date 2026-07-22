/**
 * Freigabe-Prinzip — Spec Station 3c ("Das Freigabe-Prinzip") plus die
 * Ergaenzung aus dem Auftrag: pro Aufgabe Entwurf-Modus (du klickst auf
 * Senden) oder Selbstlauf, jederzeit umstellbar; Kommunikation per Mail
 * oder Telegram.
 */
export default function FreigabePrinzip() {
  return (
    <section className="rr-section tl-section tl-section--surface">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Du hast das Sagen</p>
        <h2 className="rr-statement tl-title">Nichts passiert ohne dich.</h2>
        <p className="rr-body-lg tl-lead">
          Talos bereitet alles vor, du gibst frei. Willst du bei einer Aufgabe
          nicht mehr jedes Mal gefragt werden, schaltest du sie auf Selbstlauf.
          Deine Entscheidung, jederzeit umstellbar.
        </p>

        <div className="tl-modes">
          <div className="tl-mode">
            <p className="tl-mode__label">Entwurf-Modus</p>
            <p className="tl-mode__text">
              Talos bereitet die Aufgabe vor, du bekommst sie zum Lesen und
              klickst selbst auf Senden.
            </p>
          </div>
          <div className="tl-mode">
            <p className="tl-mode__label">Selbstlauf</p>
            <p className="tl-mode__text">
              Talos erledigt die Aufgabe eigenständig. Du kannst das für jede
              Aufgabe einzeln umstellen, jederzeit zurück.
            </p>
          </div>
        </div>

        <p className="tl-footnote" style={{ marginTop: 'clamp(24px, 3.5vw, 32px)', borderTop: 'none', paddingTop: 0 }}>
          Wie ihr redet, entscheidest du: per Mail oder per Telegram.
        </p>
      </div>
    </section>
  );
}
