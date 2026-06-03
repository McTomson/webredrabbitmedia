# guardrails.md — harte Verbote (nicht verhandelbar)

Diese Regeln stehen über allen anderen. Bei Konflikt gewinnt die strengere. Verletzt ein
Artikel eine harte Sperre, HÄLT die Pipeline (kein halber Output, kein Publish).

## Nordstern
Echter Mehrwert pro Artikel. Wir ersetzen eine Agentur, also liefern wir Beratung, nicht
Fülltext. Wenn ein Artikel keinem Leser nützt, geht er nicht raus.

## HARTE SPERREN (Pipeline hält, wenn verletzt)
1. **Keine unbelegten Preis-Aussagen.** Jede konkrete Zahl/Preisspanne braucht eine Quelle
   (`knowledge/`, Daten-Asset, oder offizielle AT/DE-Quelle). Sonst raus oder als "grobe
   Hausnummer" kennzeichnen UND belegen.
2. **Keine unbelegten Rechts-Aussagen.** DSGVO/BFSG/Impressum/Steuer: nur mit Quelle und
   ohne verbindliche Rechtsberatung-Behauptung. Immer Hinweis "keine Rechtsberatung" bei
   Rechtsthemen. Kein erfundener Paragraf, kein erfundenes Strafmaß.
3. **Keine erfundenen Meinungen oder Erfahrungen.** Persönliche Takes ("ich sehe in der
   Praxis…") nur aus `opinions/pool.md`. Ist der Pool zum Thema leer -> Artikel hält ODER
   wird rein sachlich/quellen-basiert geschrieben (ohne Ich-Erfahrung). Kein Fake-Anekdoten.
4. **Keine erfundenen Quellen.** Jede `source` muss real existieren und erreichbar sein.
   Lieber weniger Quellen als eine halluzinierte. Researcher prüft URLs.
5. **Kein Publish ohne mindestens EIN echtes Element:** echte Quelle/Daten-Asset ODER echte
   Meinung aus dem Pool. Reiner Allgemeinplatz-Text ohne Substanz geht nie live.
6. **Keine erfundenen Autoren.** Nur Thomas Uhlir oder Dmitry Pashlov (beide real, Identität
   aus `lib/config.ts`). Byline nach Thema (siehe `voice/`).
7. **Kein Duplicate/Kannibalisierung.** Neues Thema darf kein bestehendes `content/blog/*`
   Fokus-Keyword doppelt targeten (Dedup-Check im Orchestrator).

## STIL-SPERRE (Anti-KI, sonst klingt es nicht nach Thomas)
8. **NIEMALS Gedankenstrich "–" (en/em-dash).** Härtester KI-Marker. Komma/Punkt/"..."
   stattdessen. Gilt für JEDEN veröffentlichten Satz inkl. Frontmatter/excerpt/FAQ.
   (Bindestrich "-" in Wörtern wie "E-Commerce" ist erlaubt; gemeint ist der lange Strich.)
9. Keine Dreierfiguren/rule-of-three, kein "nicht nur … sondern auch", kein "in der heutigen
   schnelllebigen Welt", keine makellos ausbalancierten Werbe-Slogans, kein Buzzword-Hochglanz.
10. Keine Emojis im Artikel-Text/Frontmatter (Projektregel). Ausnahme: bestehende UI-Komponenten.

## COMPLIANCE
11. **AI-Kennzeichnung** sichtbar pro Artikel ("KI-unterstützt, redaktionell geprüft") plus
    auf YouTube ("altered/synthetic content"). EU-AI-Act.
12. **Keine indexierten Entwürfe.** `status: draft` wird nie gebaut/indexiert/in Sitemap.
13. **Kein EXIF-GPS** in Bildern. Sprechender Alt-Text mit Geo-Keyword wo passend.

## Bei Unsicherheit
Lieber halten und in die Review-Email schreiben als raten. Eine gehaltene Pipeline ist
ein Feature, kein Fehler.
