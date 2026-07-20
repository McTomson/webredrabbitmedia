import Link from "next/link";

/**
 * v2 — "Ein Kollege ist schon dabei" (leichter Anreisser), Copy aus
 * scratchpad/website-copy-v2.md §6. Ruhiger Navy-Band-Moment, optisch an
 * Scharnierzeile.tsx orientiert (dunkler Farb-Moment, Off-White-Text, roter
 * Akzent), aber eigene Datei mit Text + Verweis-Link statt reiner
 * Statement-Zeile. Kein "KI"-Wort.
 */
export default function KollegeAnreisser() {
  return (
    <section className="rr-section" style={{ background: "var(--rr-navy)", textAlign: "center" }}>
      <div className="rr-wrap rr-narrow">
        <p
          className="rr-eyebrow-lg"
          style={{ color: "rgba(246, 245, 241, 0.82)", marginBottom: 16 }}
        >
          NICHT NUR EINE SEITE
        </p>
        <h2
          className="rr-statement"
          style={{ color: "#f6f5f1", maxWidth: "16em", margin: "0 auto" }}
        >
          Deine Website kommt nicht allein
          <span style={{ color: "var(--rr-red)" }}>.</span>
        </h2>
        <p
          className="rr-body-lg"
          style={{
            color: "rgba(246, 245, 241, 0.78)",
            maxWidth: "42em",
            margin: "clamp(24px, 3vw, 32px) auto 0",
          }}
        >
          In jeder Seite steckt von Anfang an ein digitaler Kollege. Einer,
          der dir Arbeit abnimmt, während du deinen Job machst: Anfragen
          entgegennehmen, dranbleiben, damit nichts liegen bleibt. Und wenn
          du merkst, dass dir woanders noch mehr abgenommen werden soll,
          holst du dir monatlich weitere dazu.
        </p>
        <p style={{ marginTop: "clamp(20px, 3vw, 28px)" }}>
          <Link
            href="/relaunch-preview/leistungen"
            className="rr-link rr-link--ondark"
          >
            Wer da alles für dich arbeiten kann, zeigen wir dir auf der
            Leistungs-Seite.
          </Link>
        </p>
      </div>
    </section>
  );
}
