/**
 * Faehigkeiten — Intro aus docs/specs/TALOS_COPY_2026-07.md Station 3, plus
 * Karten-Grid mit 5 buchbaren Faehigkeiten + 1 Massarbeit-Karte. Fusszeile
 * traegt die einzig erlaubte Preis-Logik (monatlich pro Faehigkeit,
 * jederzeit kuendbar) OHNE Zahlen. Kein Link auf /relaunch-preview/preise:
 * die Route existiert noch nicht (geprueft 22.07.), sobald sie da ist, kann
 * hier verlinkt werden.
 */
type Faehigkeit = { name: string; nutzen: string; fuerWen: string; ablauf: string };

const FAEHIGKEITEN: Faehigkeit[] = [
  {
    name: 'Der Schreiber',
    nutzen: 'Schreibt Beiträge für deinen Betrieb und verteilt sie.',
    fuerWen: 'Für dich, wenn deine Seite lebendig bleiben soll, ohne dass du selbst schreibst.',
    ablauf: 'Entwurf landet bei dir, du liest drüber, ein Klick, fertig.',
  },
  {
    name: 'Der Empfang',
    nutzen: 'Fängt Anfragen auf, hakt nach und vereinbart Termine.',
    fuerWen: 'Für dich, wenn dir sonst Anfragen zwischen Tür und Angel durchrutschen.',
    ablauf: 'Talos antwortet freundlich, du bekommst die Übersicht in Klartext.',
  },
  {
    name: 'Der Aussendienst',
    nutzen: 'Findet deine Wunschkunden und schreibt sie an.',
    fuerWen: 'Für dich, wenn du aktiv neue Kunden willst, nicht nur wartest.',
    ablauf: 'Vorschläge kommen als Entwurf, du entscheidest, wer angeschrieben wird.',
  },
  {
    name: 'Der Social-Poster',
    nutzen: 'Baut Beiträge für deine Kanäle aus dem, was ohnehin entsteht.',
    fuerWen: 'Für dich, wenn dir für Social Media schlicht die Zeit fehlt.',
    ablauf: 'Beitrag steht als Entwurf bereit, du gibst frei oder stellst auf Selbstlauf.',
  },
  {
    name: 'Die Sichtbarkeit',
    nutzen: 'Sorgt dafür, dass dich Google und die neuen Antwort-Maschinen finden.',
    fuerWen: 'Für dich, wenn du willst, dass man dich auch dort findet, wo gerade gesucht wird.',
    ablauf: 'Läuft im Hintergrund mit, du bekommst regelmäßig Klartext-Bescheid.',
  },
  {
    name: 'Massarbeit auf Anfrage',
    nutzen: 'Wir bauen jede Fähigkeit, die dein Betrieb konkret braucht.',
    fuerWen: 'Für dich, wenn keine der fünf Fähigkeiten oben genau passt.',
    ablauf: 'Kurzes Gespräch, dann bauen wir dir dein eigenes Modul.',
  },
];

export default function Faehigkeiten() {
  return (
    <section className="rr-section tl-section">
      <div className="rr-wrap rr-narrow">
        <p className="wd-eyebrow tl-eyebrow">Was Talos kann</p>
        <h2 className="rr-statement tl-title">
          Such dir aus, welche Arbeit dir Talos abnimmt.
        </h2>
        <p className="rr-body-lg tl-lead">
          Die Website ist die Basis. Darauf schaltest du Fähigkeiten dazu, wie
          Bausteine. Nimm, was du brauchst, den Rest lässt du weg.
        </p>

        <div className="tl-cards">
          {FAEHIGKEITEN.map((f) => (
            <div className={`tl-card${f.name === 'Massarbeit auf Anfrage' ? ' tl-card--muted' : ''}`} key={f.name}>
              <p className="tl-card__name">{f.name}</p>
              <p className="tl-card__text">{f.nutzen}</p>
              <p className="tl-card__text">{f.fuerWen}</p>
              <p className="tl-card__meta">{f.ablauf}</p>
            </div>
          ))}
        </div>

        <p className="tl-footnote">
          Jede Fähigkeit buchst du einzeln, monatlich, jederzeit kündbar. Du
          musst dich nicht sofort entscheiden: Fähigkeiten kannst du auch
          später noch dazubuchen. Die Preise dazu findest du auf unserer
          Preisseite.
        </p>
      </div>
    </section>
  );
}
