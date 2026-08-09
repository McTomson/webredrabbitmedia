# SEO/GEO Off-Site-Checkliste — für Thomas (Stand 09.08.2026)

Warum das zählt (Research-Beleg, `last30days` 08/2026): **KI-Zitate (ChatGPT/Perplexity/AI-Overviews) und Local-Ranking kommen überwiegend von DRITTPLATTFORMEN** — Google-Profil, Branchenverzeichnisse, Bewertungen, Foren — NICHT von der eigenen Schema-Politur. Die On-Site-Technik (Code) mache ich; die folgenden Punkte liegen außerhalb des Codes und brauchen dich (Logins, echte Einträge, Bewertungen).

Priorität: 1 = größter Hebel.

---

## 0. NAP-Konsistenz FESTLEGEN (Voraussetzung für alles andere)
NAP = Name, Address, Phone. Muss auf ALLEN Plattformen ZEICHENGLEICH sein, sonst zerfasert das Local-/GEO-Signal.

**ENTSCHEIDUNG NÖTIG (deine):** Der Code/JSON-LD sagt **"Red Rabbit Media"**, das Google-Profil heißt **"Red Rabbit GmbH"**. Das ist eine echte Inkonsistenz. Leg EINE kanonische Schreibweise fest (Empfehlung: der eingetragene Firmenname, den auch das Impressum trägt) — ich ziehe den Code dann exakt darauf nach.

Kanonischer NAP-Satz (bitte bestätigen/korrigieren):
- **Name:** Red Rabbit GmbH _(oder "Red Rabbit Media"? → du entscheidest)_
- **Adresse:** Grabnergasse 8, 1060 Wien, Österreich
- **Telefon:** +43 676 9000955
- **E-Mail:** office@redrabbit.media
- **Web:** https://web.redrabbit.media

---

## 1. Google Business Profile (GBP) — größter einzelner Hebel
- [ ] Profil vollständig ausfüllen: **Primärkategorie** "Webdesigner" (exakt richtige Kategorie schlägt jedes Keyword-Stuffing), passende Sekundärkategorien (Werbeagentur, Marketingagentur).
- [ ] NAP exakt wie oben. Öffnungszeiten, Leistungen, Servicegebiet (Wien + Bundesländer) eintragen.
- [ ] **Wöchentlich 1 Post** (Projekt, Tipp, Angebot) — Aktivität ist ein Ranking-Signal.
- [ ] **Fragen & Antworten** selbst befüllen: die echten Nutzerfragen aus der Keyword-Research ("Was kostet eine Website?", "Wie lange dauert's?") als Q&A anlegen — genau das ziehen Answer Engines.
- [ ] Foto-Set aktuell (Team/Thomas, Arbeitsproben).

## 2. Echte Google-Bewertungen aktiv einholen (E-E-A-T + CTR)
- [ ] Nach jedem Projektabschluss um eine ehrliche Google-Rezension bitten (kurzer Link/QR im Abschluss-Mail). Ziel: von aktuell wenigen auf zweistellig.
- [ ] **Regel bleibt:** nur ECHTE Bewertungen, kein Fabrizieren (deckt sich mit dem Rating-Ehrlichkeits-Grundsatz). Sobald mehr echte Reviews da sind, spiele ich Sterne + `aggregateRating` wieder aus.
- [ ] Auf jede Bewertung öffentlich antworten (Signal + Vertrauen).

## 3. Branchenverzeichnisse mit konsistentem NAP (Citations)
Strukturierte, aktuelle Einträge zählen (Research: "Zeilen in Datensätzen, die Answer Engines zurücklesen") — Massen-Spam-Verzeichnisse NICHT.
- [ ] **WKO Firmen A-Z** (wko.at) — als österreichisches Unternehmen Pflicht-Citation, hohe Autorität.
- [ ] **Herold.at** — starkes AT-Verzeichnis, rankt selbst gut.
- [ ] **firmenabc.at** / firmenapp.
- [ ] Bing Places (eigenes Pendant zu GBP, füttert Copilot/ChatGPT-Search).
- [ ] Apple Business Connect (füttert Apple/Siri-Ergebnisse).
- [ ] Optional: Clutch/Sortlist (Agentur-Vergleichsportale — genau die Drittquellen, aus denen LLMs "welche Webagentur in Wien" beantworten).
- [ ] Überall IDENTISCHER NAP. Alte/abweichende Einträge (falsche Adresse/Telefon) aufspüren und korrigieren.

## 4. Zitierfähige Drittpräsenz für GEO
- [ ] Da LLMs "beste Webagentur Wien" meist aus **Vergleichs-/Listicle-Seiten** beantworten: prüfen, wo RR in solche Listen kommt (Clutch, Sortlist, "beste Webdesign-Agenturen Wien 2026"-Artikel).
- [ ] Preistransparenz ist ein zitierbarer USP — die klaren Tiers (1.250/2.850/4.900) sind genau die Art Fakt, die Answer Engines gern aufgreifen (mache ich on-site zitierfähig).

## 5. Nach dem Go-Live (Search Console)
- [ ] Neue Sitemap in der Search Console einreichen.
- [ ] Wöchentlich auf **"Gecrawlt – zurzeit nicht indexiert"** prüfen (2026 der reale Engpass, auch bei gutem Content).
- [ ] URL-Inspection der Kernseiten (Home, Preise, Leistungen).
- [ ] `redrabbit.media` → 301 auf `web.redrabbit.media` verifizieren.

---

## BEWUSST NICHT tun (Research: Zeit-/Geldverschwendung)
- `llms.txt` anlegen — kein bestätigter Hebel (ein AI-Scanner-Betreiber hat die Bewertung dafür selbst wieder rausgenommen).
- Teure GEO-Tools (Profound/PromptWatch) — für unsere Größe reicht manuelles Monitoring.
- Massen-Verzeichnis-Submissions als "Backlink-Strategie".
- Keyword-Stuffing im Firmennamen/GBP.
- Core Web Vitals über das grüne Minimum hinaus optimieren (ist Hygiene, kein Ranking-Hebel).
