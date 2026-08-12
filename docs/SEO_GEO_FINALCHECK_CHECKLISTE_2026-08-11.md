# SEO/E-E-A-T/GEO-Finalcheck — priorisierte Checkliste (Research 11.08.2026)

Synthese aus 3 parallelen Sonnet-Research-Agenten (aktuelle Lage Aug 2026,
E-E-A-T-Checklisten, Technik-Check von 8 top-rankenden AT-Webagenturen).
Rohdaten der Konkurrenz liegen im Session-Scratchpad (`competitors/`), die
Agenten-Reports sind in dieser Datei verdichtet. Regel: NUR echte Daten,
kein fabriziertes aggregateRating, kein Gedankenstrich in Kunden-Copy.

## P1 — Muss vor Live (hohe Wirkung, klar belegt)

1. **robots.txt / robots.ts pruefen**: KEIN KI-Crawler blockiert (Bingbot,
   OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot/User,
   Google-Extended, GPTBot alle erlauben). Sitemap-Referenz drin.
   Befund Konkurrenz: keiner der 8 Top-Ranker blockt KI-Bots.
2. **Kurz-Antwort-Absaetze (GEO/AEO)**: pro Kernseite ein kompakter,
   selbststaendiger Antwort-Absatz (3-4 Saetze) nahe der H1, der die
   Kernfrage der Seite beantwortet (Preise: die 3 Preispunkte; Regionen:
   wer/wo/was). Staerkster inhaltlicher Hebel fuer KI-Zitierung.
3. **JSON-LD-Vollausbau mit NUR echten Daten**: Organization einheitlich
   (@id, address, contactPoint, sameAs: Google Business Profile + LinkedIn;
   Founder als eigenes Person-Objekt via `founder`, NICHT im
   Organization-sameAs), spezifischer Typ ProfessionalService pruefen,
   Service/Offer je Leistung, BreadcrumbList, Article fuer Ratgeber.
   KEIN aggregateRating ohne echte, verifizierbare Google-Reviews
   (Google hat 24.07.2026 die Review-Snippet-Regeln verschaerft).
4. **FAQPage-Schema BEHALTEN/ausbauen**: Google zeigt laut Research seit
   Mai 2026 keine FAQ-Rich-Results mehr (in Phase 2 gegen offizielle
   Google-Doku verifizieren!), aber das Markup bleibt fuer
   ChatGPT/Perplexity/Copilot relevant. Kein Rueckbau.
5. **Meta-Basis pro Seite**: title-Muster, description 137-160 Zeichen,
   canonical, H1-Eindeutigkeit, interne Verlinkung
   (Kosten-Artikel <-> /preise Cross-Links pruefen), sitemap.xml sauber.
6. **OG/Twitter komplett**: og:image (Thomas' Bild, 1731x909 -> 1200x630
   skaliert + auf < 300 KB komprimiert), og:title/description,
   twitter:card summary_large_image auf ALLEN Seiten. Konkurrenz-Luecke:
   2 von 8 haben das unvollstaendig.
7. **Impressum AT doppelt pruefen**: § 5 ECG UND Offenlegung §§ 24/25
   MedienG sind ZWEI getrennte Pflichten (deutsche Vorlagen erfuellen
   MedienG nicht; bis 20.000 EUR Strafe). NAP-Konsistenz Website =
   Google Business Profile = Impressum.

## P2 — Stark empfohlen (guenstig, klarer Nutzen)

8. **IndexNow einbauen** (Bing/Copilot/ChatGPT-Bing-Index): Key-Datei +
   Ping bei Deploy/Content-Update. Google nutzt es nicht, Bing schon;
   Copilot-Familie profitiert in 3-6 Wochen.
9. **E-E-A-T sichtbar**: Ueber-uns mit echtem Foto + Werdegang +
   echten Projekt-Screenshots (kein Stock); Referenzen mit konkreten
   Ergebnissen statt Logo-Liste; Ratgeber-Artikel mit sichtbarem
   "Zuletzt aktualisiert" + echten inhaltlichen Updates + Quellen bei
   Faktenaussagen + Erfahrungs-Ich ("bei uns hat sich gezeigt...").
   Autor-Boxen pro Artikel: bei Nicht-YMYL-Thema reicht Link auf
   Ueber-uns (kein Overkill noetig).
10. **Preis-Daten maschinenlesbar**: Offer-Schema stimmt (1.250/2.850/
    ab 4.900); pruefen ob die Paket-Matrix zusaetzlich als echtes
    HTML-table-Markup sinnvoll ist (KI-Modelle extrahieren Tabellen
    nahezu woertlich) ohne das Design zu brechen.
11. **Core Web Vitals**: INP < 200 ms auf Home, /preise, Regionen
    (Risiko: Talos-3D/Spline-Hydration); LCP-Poster/Fonts checken.
    CWV ist Tiebreaker, kein Hauptfaktor: offensichtliche Ausreisser
    fixen, nicht auf Kosten von Inhalt optimieren.
12. **llms.txt + llms-full.txt redaktionell**: KI-Anbieter lesen es laut
    Lage-Research kaum (kein belegter Effekt), ABER 5 von 8 AT-
    Konkurrenten haben eins und keiner pflegt ein gutes llms-full.txt
    (Preise, Prozess, Referenzen im Klartext). Geringer Aufwand,
    Differenzierung, kein Risiko. Als letzter P2-Punkt.

## P3 — Bewusst NICHT machen

- **hreflang**: einsprachige AT-Site, nur Fehlerquelle.
- **aggregateRating ohne echte Datenbasis**: verboten (Hausregel +
  Google-Policy 07/2026 + FTC-Risiko).
- **Speakable-Schema**: Relevanz 2026 unklar, keine Prioritaet.
- **FAQ-Schema-Rueckbau**: nicht machen (siehe P1.4).

## Landminen / Regeln fuer die Umsetzung

- /relaunch-preview bleibt bis zum Live-Tausch ueberall noindex.
- /leistungen-HUB: dauerhaft noindex (eigene Regel, getrennt von der
  Preview-Pauschale); Unterseiten normal. Vorschlag neu-vs-streichen
  folgt nach dem Audit.
- Preise-Guard: 1.250 / 2.850 / ab 4.900, NIE 790.
- Executor-Agenten: model opus/sonnet; Orchestrator prueft jede
  Massnahme einzeln (SSR-HTML via curl, Browser).
- Parallel-Session auf `relaunch`: nur eigene Dateien stagen.

## Offene Thomas-Fragen (vor Phase 2/3)

1. Google Business Profile: existiert es, echte Review-Anzahl/Sterne?
   (Ohne echte Daten: Reviews nur verlinken, kein Rating-Markup.)
2. sameAs-Profile: welche existieren wirklich (LinkedIn? WKO?)?
3. Impressums-Angaben vollstaendig (UID/GISA/Firmenwortlaut)?
4. IndexNow + llms.txt: Freigabe ja/nein.
