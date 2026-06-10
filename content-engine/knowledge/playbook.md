# Methodik-Playbook (Red Rabbit Content-Engine)

> Angewandtes Handwerks-Wissen: SEO/GEO, Schreibstil, Ranking-Hebel. SINGLE SOURCE OF TRUTH
> fuer die Engine-Rollen (Writer/Finalizer lesen den relevanten Teil) und fuer den
> On-Page-Audit im Dashboard. Roh-Quellen (SEO-Artikel, Videos) sammeln wir im NotebookLM
> "Methodik"-Notebook und destillieren neue Erkenntnisse HIERHER. Nicht den Artikel-Inhalt
> mit SEO-Meta vermischen: das hier steuert WIE geschrieben wird, nicht WORUEBER.
> Quellen der Hebel: v2-Plan §11 (web-verifiziert 10.06), Princeton GEO-Paper, Google Spam-Policies.

## 1. Schreibstil (verbindlich, deckt sich mit voice/house.md)

- Vollstaendige, fluessige, natuerliche deutsche Saetze. Keine abgehackten Fragmente, kein Staccato.
- NIEMALS Gedankenstrich "–". Komma oder Punkt stattdessen.
- Keine Dreierfiguren, kein Marketing-Hochglanz, keine Fuellfloskeln zum Strecken.
- Echte Umlaute (ä/ö/ü/ß) im Inhalt. Tag-Frage "oder?" hoechstens 1-2x pro Text.
- Analogien einfach und sofort verstaendlich, nicht technisch ueberladen.
- Erst-Hand-Haltung nur wo durch opinions/pool.md gedeckt, sonst sachlich-quellenbasiert.

## 2. GEO / On-Page (das ziehen LLMs + Featured Snippets) — checkbar

- ANTWORT-BLOCK: 40-60-Wort-Direktantwort ganz oben (Feld featuredSnippet + sichtbar gerendert).
- H2 als echte Nutzerfrage formulieren; je Abschnitt eine Selbstantwort in den ersten 2 Saetzen.
- ENTITAETEN explizit benennen (Orte, Institutionen, Normen), nicht nur umschreiben.
- PRIMAERQUELLEN zitieren mit Zahl + Quelle (laut Princeton-Paper wirksamste Einzeltaktik).
- FAQ-Block (customFAQs 4-5): 3,2x wahrscheinlicher in Google AI Overviews.
- "2026" (aktuelles Jahr) in Titel/Headings: ~30% mehr LLM-Citations.
- Ausgehende Quell-Links in der Prosa: jede genannte Studie/Institution beim ersten Vorkommen verlinken.
- Alt-Texte deutsch + beschreibend + Thema/Geo-Keyword (nicht der rohe englische Bild-Prompt).

## 3. Topical Authority (#1 Hebel, verifiziert)

- TIEFE vor Breite: pro Cluster erst Pillar, dann 5-10 Spokes, alle untereinander verlinkt.
- INTERNE LINKS bidirektional: neuer Artikel verlinkt nach aussen UND passende aeltere Artikel
  bekommen einen Link auf den neuen. Cluster-bewusst, mind. 2 interne Links je Artikel,
  nicht nur /kontakt.
- Winnability-First: Long-Tail/geringer-Wettbewerb/hohe-Absicht zuerst.

## 4. Frische-Loop (GEO-Doppelnutzen)

- Artikel auf Pos 8-20 eher AKTUALISIEREN als ein neues Thema: frische Zahlen, neues updatedAt,
  neue interne Links, IndexNow-Ping. Oft schneller auf Seite 1 als ein Neuer.
- Jahr-Signale + Frische werden von Perplexity/Google stark gewichtet.

## 5. Plattform-Quellen kennen (steuert Distribution)

- ChatGPT zitiert ~48% Wikipedia/enzyklopaedisch → Entitaeten + Wikidata staerken.
- Perplexity ~46% aus Reddit + Frische → echte hilfreiche Reddit-Antworten (kein Spam).
- Google AI Overviews ~97% aus Top-20-Organic → klassisches SEO bleibt Voraussetzung.

## 6. Scaled-Content-Safety (Schutz fuer 1/Tag, verifiziert)

- Jede Seite beantwortet eine DISTINKTE Frage. Keine near-duplicates, kein Template-Variablen-Tausch.
- Echte first-hand Erfahrung/Meinung ist Pflicht-Anteil (opinions/pool.md) — sonst Penalty-Muster.
- Menschliche Freigabe bleibt (Review-Mail). KEIN fabriziertes Zusatz-Schema, keine Fake-Reviews.

## 7. Bewusst NICHT (Reputationsrisiko)

- Keine Massen-Backlinks, Text-Spinning, PBNs, Doorway-Per-Region-Seiten, Humanizer/Detector-Tricks.
- Kein dunkelgrau/schwarz. Band bleibt weiss bis hellgrau.
