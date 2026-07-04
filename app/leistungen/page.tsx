import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/relaunch/PageShell";

export const metadata: Metadata = {
  title: "Leistungen | Red Rabbit Media",
  description:
    "Webdesign, Google-Sichtbarkeit, KI-Sichtbarkeit, Content und ein eigenes Dashboard. Wir bauen Websites, die man findet und die selbst arbeiten.",
  alternates: { canonical: "https://web.redrabbit.media/leistungen" },
};

type Area = {
  eyebrow: string;
  title: string;
  teaser: string;
  href: string;
  linkLabel: string;
};

const areas: Area[] = [
  {
    eyebrow: "01",
    title: "Webdesign",
    teaser:
      "Deine Website wird schnell, klar und auf Anfragen gebaut, nicht auf Hochglanz ohne Wirkung. Den Entwurf siehst du zuerst, ganz ohne Vorkasse.",
    href: "/leistungen/webdesign",
    linkLabel: "Webdesign ansehen",
  },
  {
    eyebrow: "02",
    title: "Google-Sichtbarkeit",
    teaser:
      "Eine schöne Seite, die niemand findet, bringt nichts. Wir bauen die technische und inhaltliche Basis, damit dich Leute genau dann finden, wenn sie suchen.",
    href: "/leistungen/seo",
    linkLabel: "Google-Sichtbarkeit ansehen",
  },
  {
    eyebrow: "03",
    title: "KI-Sichtbarkeit",
    teaser:
      "Immer mehr Menschen fragen ChatGPT, Gemini und Co. statt Google. Wir sorgen dafür, dass dein Betrieb in diesen Antworten vorkommt.",
    href: "/leistungen/ki-sichtbarkeit",
    linkLabel: "KI-Sichtbarkeit ansehen",
  },
  {
    eyebrow: "04",
    title: "Content & KI-Artikel",
    teaser:
      "Regelmäßige, hilfreiche Beiträge halten deine Seite lebendig und ranken langfristig. Diese Website beweist es: sie schreibt sich selbst.",
    href: "/tipps",
    linkLabel: "Zu unseren Artikeln",
  },
  {
    eyebrow: "05",
    title: "Dashboard & Betreuung",
    teaser:
      "Ein Dashboard zeigt dir in Klartext, was deine Website bringt: Rankings, Anfragen, Sichtbarkeit. Dazu Wartung und Optimierung ohne Bindung.",
    href: "/leistungen/dashboard",
    linkLabel: "Dashboard ansehen",
  },
];

export default function LeistungenPage() {
  return (
    <PageShell
      eyebrow="Leistungen"
      title="Die Website, die selbst arbeitet."
      intro="Wir bauen nicht einfach eine Website. Wir bauen einen Kanal, der dich sichtbar macht, Anfragen bringt und dir zeigt, was er leistet. Alles aus einer Hand, in fünf Bereichen."
    >
      <section className="rr-section" style={{ paddingTop: 0 }}>
        <div className="rr-wrap rr-narrow">
          <div className="rr-grid rr-grid-2">
            {areas.map((a) => (
              <Link key={a.title} href={a.href} className="rr-card">
                <p className="rr-eyebrow" style={{ marginBottom: 14 }}>{a.eyebrow}</p>
                <h2 className="rr-sub" style={{ marginBottom: 16 }}>{a.title}</h2>
                <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17, marginBottom: 22 }}>
                  {a.teaser}
                </p>
                <span className="rr-link">{a.linkLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
