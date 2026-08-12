# SERP-Vorschau - Go-Live 12.08.2026

Stand: 12.08.2026 vormittags, direkt nach dem Go-Live von web.redrabbit.media (82 URLs laut `sitemap.xml`). Alle Werte unten kommen aus dem live ausgelieferten SSR-HTML (`curl https://web.redrabbit.media/<pfad>`), nicht aus dem Code - das ist genau das, was Google beim naechsten Crawl sieht.

## Wie Thomas selbst nachschauen kann

- **Google-Index pruefen:** In der Google-Suche `site:web.redrabbit.media` eingeben. Direkt nach Go-Live liefert das meist noch die alte Seite oder wenige Treffer - normal.
- **Google Search Console (GSC):** Leistungsbericht (Performance) unter Property `web.redrabbit.media` zeigt Klicks/Impressionen/Position pro URL, sobald erste Daten reinkommen (typischerweise ab Tag 2-3). URL-Pruefung (URL Inspection) fuer einzelne Seiten zeigt sofort, ob eine Seite schon gecrawlt/indexiert ist.
- **Bing:** Bing Webmaster Tools, Property `web.redrabbit.media`, ebenfalls Leistungsbericht + URL-Pruefung. Durch den IndexNow-Ping (siehe unten) reagiert Bing meist schneller als Google.
- **Live-Snapshot einer Seite:** `curl -s https://web.redrabbit.media/<pfad> | grep -o "<title>[^<]*</title>"` zeigt sofort, was aktuell ausgeliefert wird, ohne auf einen Crawl zu warten.

## Erwartung zum Zeitverlauf

- **Kernseiten (Home, /preise, /webdesign-wien):** heute manuell in der GSC zur Indexierung angestossen. Neu-Crawl realistisch innerhalb von Stunden bis 1-2 Tagen.
- **Sitemap:** heute neu bei Google (GSC) eingereicht - das signalisiert Google, alle 82 URLs zu pruefen, ersetzt aber keinen sofortigen Crawl jeder einzelnen Seite.
- **IndexNow-Ping:** heute an Bing gesendet, 82 URLs, Antwort **202 Accepted**. Bing/Copilot-Suche reagiert damit erfahrungsgemaess schneller als Google.
- **Volle Neu-Indexierung aller 82 URLs:** realistisch mehrere Wochen. Google crawlt priorisiert nach interner Verlinkung, Sitemap-Reihenfolge und wahrgenommener Wichtigkeit - Kernseiten zuerst, Long-Tail-Ratgeberartikel zuletzt.
- Bis zum naechsten Crawl zeigt eine echte Google-Suche unter Umstaenden noch den alten Titel/Snippet der Vorgaenger-Seite. Das ist kein Fehler dieser Analyse, sondern normale Crawl-Verzoegerung.

## Kritischer Befund - behoben im Zuge dieser Analyse

Beim Abgleich fiel auf, dass die Homepage (`/`) im Live-HTML **nicht** den echten Title-Tag ausgeliefert hat, sondern einen internen Platzhalter aus der Bauphase:

> Alt (live vor dem Fix): `Relaunch-Preview - Homepage nach Blaupause (intern)`

Ursache: `app/page.tsx` Zeile 16 hatte diesen Platzhalter-String hartcodiert, waehrend Description und Canonical bereits korrekt gesetzt waren. Das haette bedeutet, dass Google fuer die wichtigste Seite der ganzen Domain diesen internen Titel indexiert und im Suchergebnis anzeigt. Wurde im Zuge dieser Aufgabe direkt korrigiert (siehe Commit) auf:

> Neu: `Webdesign aus Österreich · Red Rabbit Media`

Der Fix ist im Code, wird aber erst nach dem naechsten Deploy live ausgeliefert. Die Vorschau unten zeigt bereits den korrigierten Titel, da er das ist, was ab dem naechsten Deploy im SERP erscheinen wird.

## Legende

- **Title-Limit:** ca. 60 Zeichen, danach steigt das Risiko, dass Google den Title in der Suche abschneidet oder selbst umschreibt.
- **Description-Limit:** ca. 158 Zeichen, danach schneidet Google meist ab.
- Grenzwerte sind Pixel-basiert (Google schneidet nach Breite, nicht stur nach Zeichenzahl) - die Zeichenzahl ist ein zuverlaessiger Naeherungswert.

---

## Home - `/`

> **Webdesign aus Österreich · Red Rabbit Media**
> **web.redrabbit.media**
> Webdesign aus Österreich: Websites, die bei Google und in der KI-Suche gefunden werden. Vorschläge ohne Vorkasse, mit Talos als digitalem Mitarbeiter.

- Title: 43 Zeichen - ok (nach Fix, siehe oben)
- Description: 150 Zeichen - ok
- Canonical: `https://web.redrabbit.media` - vorhanden

## Preise - `/preise`

> **Preise · Red Rabbit Media**
> **web.redrabbit.media › preise**
> Klare Website-Pakete ab 1.250 Euro. Du bekommst zuerst 1-2 Vorschläge ohne Vorkasse und beauftragst uns erst, wenn sie dir gefallen. Talos immer dabei.

- Title: 25 Zeichen - ok
- Description: 151 Zeichen - ok
- Canonical: `https://web.redrabbit.media/preise` - vorhanden

## Kontakt - `/kontakt`

> **Kontakt · Red Rabbit Media**
> **web.redrabbit.media › kontakt**
> Erzähl uns kurz, wo es hakt. Kein Verkaufsanruf, kein Newsletter: wir lesen, schauen uns deinen Betrieb an und schreiben dir zurück.

- Title: 26 Zeichen - ok
- Description: 132 Zeichen - ok
- Canonical: **fehlt** - kein `<link rel="canonical">` im Live-HTML gefunden

## FAQ - `/faq`

> **FAQ · Red Rabbit Media**
> **web.redrabbit.media › faq**
> Ehrliche Antworten auf die häufigsten Fragen: Preise, Ablauf, Vorkasse, Förderung, Sichtbarkeit bei Google und in KI, Eigentum an der Website und Hosting.

- Title: 22 Zeichen - ok
- Description: 154 Zeichen - ok (knapp unter dem Limit)
- Canonical: **fehlt**

## Über uns - `/ueber-uns`

> **Über uns · Red Rabbit Media**
> **web.redrabbit.media › ueber-uns**
> Die faire Anti-Agentur für den österreichischen Mittelstand. Wer wir sind und warum wir den ersten Schritt machen.

- Title: 27 Zeichen - ok
- Description: 114 Zeichen - ok
- Canonical: `https://web.redrabbit.media/ueber-uns` - vorhanden

## Referenzen - `/referenzen`

> **Referenzen - Webdesign-Projekte aus Österreich | Red Rabbit Media**
> **web.redrabbit.media › referenzen**
> Ausgewählte Webdesign-Projekte von Red Rabbit Media: Websites für Betriebe aus Österreich, von Thermenwartung über Gastronomie bis Immobilien. Sieh dir an, was wir bauen.

- Title: 65 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 170 Zeichen - **ueber 158, Abschneide-Risiko**
- Canonical: `https://web.redrabbit.media/referenzen` - vorhanden

## Tipps - `/tipps`

> **Tipps · Red Rabbit Media**
> **web.redrabbit.media › tipps**
> Ehrliche Antworten auf die Fragen, die dich wirklich Geld kosten: Website-Preise, SEO, KI-Sichtbarkeit.

- Title: 24 Zeichen - ok
- Description: 103 Zeichen - ok
- Canonical: `https://web.redrabbit.media/tipps` - vorhanden

## Leistungen - Website - `/leistungen/website`

> **Website · Leistungen · Red Rabbit Media**
> **web.redrabbit.media › leistungen › website**
> Individuell gebaute Website, neu erstellt oder von Grund auf erneuert. Fixpreis, kein Baukasten, kein Wartungsvertrag, Entwurf ohne Vorkasse.

- Title: 39 Zeichen - ok
- Description: 141 Zeichen - ok
- Canonical: `https://web.redrabbit.media/leistungen/website` - vorhanden

## Leistungen - Talos - `/leistungen/talos`

> **Talos, Kommandozentrale deiner Website · Red Rabbit Media**
> **web.redrabbit.media › leistungen › talos**
> Talos steckt in jeder Website von uns: Texte selbst ändern, Besucher sehen, bei Google und ChatGPT gefunden werden, Alarm bei Ausfall. Alles an einem Ort.

- Title: 57 Zeichen - ok (knapp unter dem Limit)
- Description: 154 Zeichen - ok (knapp unter dem Limit)
- Canonical: **fehlt**

## Webdesign Wien - `/webdesign-wien`

> **Webdesign Wien: Website erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-wien**
> Website erstellen lassen in Wien: Seiten für Kanzleien, Ordinationen und Betriebe, die bei Google und in der KI-Suche vorne stehen. Ohne Vorkasse.

- Title: 59 Zeichen - ok (knapp unter dem Limit)
- Description: 146 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-wien` - vorhanden

## Webdesign Oberösterreich - `/webdesign-oberoesterreich`

> **Webdesign Oberösterreich: Websites für Betriebe in OÖ | Red Rabbit Media**
> **web.redrabbit.media › webdesign-oberoesterreich**
> Webdesign in Oberösterreich: Websites für Betriebe von Linz bis ins Salzkammergut, sichtbar bei Google und in der KI-Suche. Entwurf zuerst, ohne Vorkasse.

- Title: 72 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 154 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-oberoesterreich` - vorhanden

## Webdesign Niederösterreich - `/webdesign-niederoesterreich`

> **Webdesign Niederösterreich: Website erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-niederoesterreich**
> Website erstellen lassen in Niederösterreich: Seiten für Betriebe vom Waldviertel bis Wiener Neustadt, gefunden bei Google und in der KI-Suche. Ohne Vorkasse.

- Title: 71 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 158 Zeichen - genau am Limit, kein Puffer
- Canonical: `https://web.redrabbit.media/webdesign-niederoesterreich` - vorhanden

## Webdesign Steiermark - `/webdesign-steiermark`

> **Webdesign Steiermark: Website erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-steiermark**
> Website erstellen lassen in der Steiermark: Seiten für Betriebe von Graz bis ins Ennstal, gefunden bei Google und in der KI-Suche. Ohne Vorkasse.

- Title: 65 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 145 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-steiermark` - vorhanden

## Webdesign Tirol - `/webdesign-tirol`

> **Webdesign Tirol: Homepage erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-tirol**
> Homepage erstellen lassen in Tirol: Websites für Hotels, Vermieter und Betriebe von Innsbruck bis ins Zillertal, sichtbar bei Google und KI. Ohne Vorkasse.

- Title: 61 Zeichen - **ueber 60, knapp, Abschneide-Risiko**
- Description: 155 Zeichen - ok (knapp unter dem Limit)
- Canonical: `https://web.redrabbit.media/webdesign-tirol` - vorhanden

## Webdesign Salzburg - `/webdesign-salzburg`

> **Webdesign Salzburg: Website erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-salzburg**
> Website erstellen lassen in Salzburg: Seiten für Betriebe von der Stadt bis in den Pinzgau, gefunden bei Google und in der KI-Suche. Ohne Vorkasse.

- Title: 63 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 147 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-salzburg` - vorhanden

## Webdesign Kärnten - `/webdesign-kaernten`

> **Webdesign Kärnten: Homepage erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-kaernten**
> Homepage erstellen lassen in Kärnten: Websites für Ordinationen und Betriebe von Klagenfurt bis zum Wörthersee, sichtbar bei Google und KI. Ohne Vorkasse.

- Title: 63 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 154 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-kaernten` - vorhanden

## Webdesign Vorarlberg - `/webdesign-vorarlberg`

> **Webdesign Vorarlberg: Homepage erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-vorarlberg**
> Homepage erstellen lassen in Vorarlberg: Websites für Betriebe vom Rheintal bis zum Arlberg, gebaut für Google und die KI-Suche. Ohne Vorkasse.

- Title: 66 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 143 Zeichen - ok
- Canonical: `https://web.redrabbit.media/webdesign-vorarlberg` - vorhanden

## Webdesign Burgenland - `/webdesign-burgenland`

> **Webdesign Burgenland: Homepage erstellen lassen | Red Rabbit Media**
> **web.redrabbit.media › webdesign-burgenland**
> Homepage erstellen lassen im Burgenland: Websites für Weingüter und Betriebe von Eisenstadt bis ins Südburgenland, sichtbar bei Google und KI. Ohne Vorkasse.

- Title: 66 Zeichen - **ueber 60, Abschneide-Risiko**
- Description: 157 Zeichen - ok (knapp unter dem Limit)
- Canonical: `https://web.redrabbit.media/webdesign-burgenland` - vorhanden

## Impressum - `/impressum`

> **Impressum · Red Rabbit Media**
> **web.redrabbit.media › impressum**
> Rechtliche Informationen über Red Rabbit Media.

- Title: 28 Zeichen - ok
- Description: 47 Zeichen - sehr knapp, laesst SERP-Flaeche ungenutzt (kein Abschneide-Risiko, eher Chance liegen gelassen)
- Canonical: **fehlt**

---

## Zusammenfassung der Auffaelligkeiten

1. **Kritisch, behoben:** Home-Titel war ein interner Platzhalter (`Relaunch-Preview...`), siehe oben. Fix ist im Code, wird erst mit dem naechsten Deploy live.
2. **Title zu lang (> 60 Zeichen), Abschneide-Risiko bei Google:** 8 von 9 Bundesland-Landingpages - Oberösterreich (72), Niederösterreich (71), Vorarlberg (66), Burgenland (66), Steiermark (65), Salzburg (63), Kärnten (63), Tirol (61). Nur `/webdesign-wien` (59) bleibt unter dem Limit. Referenzen (65) ist ebenfalls betroffen.
3. **Description zu lang (> 158 Zeichen):** nur `/referenzen` (170 Zeichen).
4. **Description genau am Limit (158), kein Puffer:** `/webdesign-niederoesterreich`.
5. **Fehlende Canonical-Tags:** `/kontakt`, `/faq`, `/leistungen/talos`, `/impressum`. Sollten canonical-Alternates bekommen (Haus-Regel laut `app/page.tsx`-Kommentar: alle anderen Seiten setzen `alternates.canonical`, Home war laut Kommentar die "einzige Ausnahme" - trifft laut diesem Check auf mindestens vier weitere Seiten zu).
6. **Description ungenutzt kurz:** `/impressum` (47 Zeichen) - kein Fehler, aber liegen gelassene SERP-Flaeche.

Diese Liste ist eine Momentaufnahme des Live-HTML zum Go-Live-Zeitpunkt, keine vollstaendige technische SEO-Pruefung aller 82 URLs (die restlichen Tipps-Artikel und Rechtsseiten wie Datenschutz/AGB wurden fuer diese Vorschau nicht einzeln geprueft).
