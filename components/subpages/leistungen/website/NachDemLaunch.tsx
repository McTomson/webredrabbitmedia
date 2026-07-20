/**
 * Abschnitt (neu) — "Nach dem Start bist du nicht allein": Betreuung/Pflege
 * nach dem Launch. Beantwortet die Angst "und dann, lasst ihr mich allein".
 * Statement + Fliesstext, dazu zwei kurze rr-card-soft--neutral Karten als
 * Beruhigungs-Anker (Reveal ueber rr-stagger). Kein Wartungsvertrag-Zwang,
 * kein Preis. DU-Anrede, kein "KI"/"AI"-Wort, kein Gedankenstrich.
 */
const CARDS: { tag: string; label: string; body: string }[] = [
  {
    tag: "Sicher",
    label: "Aktuell und geschützt",
    body: "Updates, Backups und die Technik dahinter laufen bei uns im Hintergrund mit. Du musst dich um nichts davon kümmern.",
  },
  {
    tag: "Erreichbar",
    label: "Da, wenn sich was ändert",
    body: "Neue Öffnungszeiten, ein neues Angebot, ein frisches Foto? Kurz melden, wir ziehen es nach. Ohne Wartungsvertrag, ohne Warteschleife.",
  },
];

export default function NachDemLaunch() {
  return (
    <section className="rr-section lw-launch">
      <div className="rr-wrap rr-narrow">
        <p className="rr-eyebrow-lg">Nach dem Start</p>
        <h2 className="rr-statement lw-launch__title">
          Wenn die Seite online ist, sind wir nicht plötzlich weg.
        </h2>
        <p className="rr-body-lg lw-launch__body">
          Deine Seite bleibt sicher und aktuell, ohne dass du dich um Updates
          oder Technik kümmern musst. Du machst dein Geschäft, wir halten die
          Seite am Laufen.
        </p>
        <div className="rr-grid rr-grid-2 rr-stagger lw-launch__grid">
          {CARDS.map((c) => (
            <article key={c.tag} className="rr-card-soft rr-card-soft--neutral lw-launch__card">
              <p className="rr-card-soft__eyebrow">{c.tag}</p>
              <p className="rr-card-soft__label lw-launch__label">{c.label}</p>
              <p className="rr-body lw-launch__cardbody">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
