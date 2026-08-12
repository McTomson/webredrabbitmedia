export type FaqItem = { q: string; a: string };

/**
 * SSR-crawlbarer FAQ-Block (natives details/summary, kein Client-JS noetig)
 * plus FAQPage-JSON-LD. Antworten sind Klartext, damit Markup und JSON-LD
 * identisch sind (kein Rich-Snippet-Mismatch).
 */
export default function Faq({ items, id = "faq" }: { items: FaqItem[]; id?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="rr-faq" id={id}>
        {items.map((it, i) => (
          <details key={i} open={i === 0}>
            <summary>{it.q}</summary>
            <div className="rr-faq-a">
              <p className="rr-body" style={{ color: "var(--rr-ink-soft)", fontSize: 17 }}>{it.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
