# sources.md — erlaubte/bevorzugte Quellen + Tabus

Leitlinie für den Researcher. AT-Bezug priorisieren, offizielle Quellen bevorzugen,
nichts halluzinieren (Guardrail 4).

## Bevorzugt (hohe Vertrauenswürdigkeit, gut zitierbar)
- **Recht/Steuer AT/DE:** RIS (ris.bka.gv.at), oesterreich.gv.at, WKO (wko.at),
  USP (usp.gv.at), BMF, EU-Recht (eur-lex.europa.eu), offizielle BFSG/EAA-Texte.
- **Markt/Statistik:** Statistik Austria, Statista (mit Vorsicht/Datum), WKO-Branchendaten.
- **Technik/SEO:** offizielle Google-Doku (developers.google.com/search), web.dev,
  Vercel/Next.js-Doku, Core-Web-Vitals-Doku, MDN.
- **Eigene Assets:** `knowledge/data-assets/*` (eigener recherchierter Winkel) bevorzugt für
  Differenzierung.

## Mit Vorsicht (sekundär, nur ergänzend, Datum prüfen)
- Fachblogs/Agentur-Posts, Branchenmagazine. Nie als alleinige Quelle für harte Zahlen/Recht.

## Tabu
- Keine erfundenen/nicht-erreichbaren URLs. Keine Forenposts als Faktenquelle.
- Keine veralteten Rechtsstände ohne Datumshinweis.
- Keine direkten Konkurrenz-Inhalte kopieren (Duplicate, Guardrail 7).

## Pflicht-Notizen pro Fakt
`as_of` (Monat/Jahr der Quelle) + Quelle-Name + URL. Rechtsthemen: Hinweis "keine Rechtsberatung".

## Hinweis Preise
Preisaussagen für Red Rabbit: `lib/config.ts` `PRICING` (ab 790 €, 1.990 €, ab 3.500 €).
Marktspannen immer mit externer Quelle belegen, eigene Preise als Beleg-Anker (Spec §23).
