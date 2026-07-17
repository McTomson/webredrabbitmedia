# Leistungen & Zukunft — Research-Synthese (17.07.2026)

Grundlage: 5 parallele Research-Agenten (DACH-Konkurrenz, globale AI-Frontier,
Modul-Machbarkeit, eigenes Code-Inventar, 5-10-Jahres-Thesen). Rohberichte mit
allen Quellen-URLs liegen im Session-Scratchpad (research-*.md); die tragenden
Fakten sind hier mit Quelle uebernommen. Regel: keine erfundenen Zahlen —
Preis-Argumente stuetzen sich nur auf verifizierte Marktanker oder sind als
ZU VERIFIZIEREN markiert.

## Thomas-Entscheidungen aus dem Grill (17.07.)

1. **Geschaeftsmodell: Hybrid.** Website einmalig (950 / 2.900 / ab 4.900),
   Dashboard-Abo obendrauf.
2. **Autonomie: primaer Freigabe-Modell**, Kunde kann pro Automation auf
   Autopilot umschalten.
3. **Jede Website hat ein Basis-Dashboard inklusive** + Content-Editing light
   ("Mini-WordPress": Texte + Bilder selbst aendern). Alles andere = zubuchbare
   Module. Preise NICHT erfunden, sondern aus Kosten/Wert/Marktanker argumentiert.
4. Kern-Verkaufslogik (O-Ton): "Welche Arbeit, die nervt, nehmen wir ihnen weg,
   dass sie sagen: ja bitte, ich hab keine Nerven fuer so was, brauch es aber —
   hier, ich zahle."

## 1. Marktlage (verifiziert)

### DACH-Konkurrenz
- Website-Pakete AT: 999-8.000 EUR einmalig (webhead, Designtiger, orangetree u.a.).
- Wartungsvertraege AT: 39-150 EUR/Mon (haddes 39/79, digitalatelier 60/90/150,
  jetcode bis 220). Social-Betreuung als Extra ~199 EUR/Mon (orangetree).
- Website-Miete: 29,90-249 EUR/Mon (nwkt, wolfcom, webzucker, IONOS-Designservice) —
  alle mit begrenzten Aenderungs-Kontingenten, KEIN Self-Service-Dashboard.
- Content-Automation wird separat verkauft: 290-1.790 EUR/Mon.
- **Niemand in DACH kombiniert Website + Kunden-Dashboard + Analytics/Heatmaps +
  Content-Automation + Monitoring als EIN Produkt.** Naechster Kandidat:
  NEUZEITWERBER (D) wirbt fast wortgleich "Ihre Website wird zum aktiven
  Mitarbeiter" — hat aber kein sichtbares Kunden-Dashboard. Formulierung fuer
  unsere Positionierung differenzieren.
- Foerder-Hebel: KMU.DIGITAL (bis 6.000 EUR Zuschuss) wird von Agenturen aktiv
  im Verkauf genutzt — auch fuer uns pruefen.

### Globale Frontier
- AI-Builder (Wix Harmony $17-159, Squarespace $16-139, Durable $12-22,
  Framer $10-100, Hostinger ab ~$3) kommoditisieren das untere Ende. Wichtig:
  ~93-95% der Hostinger-AI-Nutzer sind Erstbauer — Net-Neu-Nachfrage, nicht
  Agentur-Abwanderung. Konsens der Reviews: "gut fuer den Entwurf, nicht fuer
  den Kunden-Launch ohne Nacharbeit".
- "AI Employee" ist als Markt real, v.a. Telefon: fonio.ai (Wien, ab 99),
  HalloPetra (Handwerk, 99-499, >1.000 Betriebe), Goai (Linz, ab 39),
  VITAS ab 39-98. Infrastruktur fuer Eigenbau: Vapi $0,05/Min, Retell $0,07/Min.
- Chatbots: Chatbase real $40-500+/Mon; Intercom Fin $0,99 pro geloester
  Konversation (skaliert gegen den Kunden — Flat-Preis ist ein echtes
  Verkaufsargument). Review-Tools: Birdeye/Podium $299-599/Mon/Standort.
- Voll-autonome Website-Betreuung existiert nur als Marketing-Versprechen;
  jede seriose Quelle nennt den Freigabe-Schritt. Genau unser Modell.

### 5-10 Jahre (harte Zahlen)
- Pew 07/2025: mit AI Overview Klickrate 8% statt 15%; Zero-Click 56%->69%
  (2024->2025); Ahrefs: bis -58% Klicks auf Top-Positionen; Gartner: Suchvolumen
  -25% bis 2026, -50% bis 2028. ChatGPT ~900 Mio WAU (02/2026).
- Agentic Commerce ist live: OpenAI/Stripe ACP + ChatGPT Instant Checkout
  (seit 09/2025). Belastbarer "agentenlesbar"-Layer heute: Schema.org +
  strukturierte Daten + GBP; NICHT llms.txt (Google lehnt ab, kein LLM nutzt ihn).
- Gegenthese ist stark: Impressumspflicht AT (ECG/UGB/MedienG, Strafe bis
  3.000 EUR) macht die Website zum rechtlichen Anker; 8 von 10 Top-Local-Signalen
  kommen aus dem Google Business Profile; 94% faktenchecken KI-Antworten
  (TrustRadius 2026) — die Website wird Vertrauens-/Abschlussanker + Datenquelle
  fuer KI, sie verschwindet nicht.
- Agentur-Modelle: reine Umsetzung stirbt (Commoditization), Productized
  Services + Betreuungs-Abos wachsen (Buytaert "agency unbundling", Forbes 03/2025).

## 2. Was wir SCHON haben (Code-Inventar)

Produktiv laufend (nur intern/Single-Tenant):
- Content-Engine: 4-Rollen-Pipeline (Research->Write->Edit->Finalize) mit
  Quellen-Verifikation, Quality-/Risk-Gate, taeglicher Cron, Bild-Pipeline.
- Ein-Klick-Freigabe per E-Mail (signierter Token -> publish + Redeploy + IndexNow).
- GSC/GA4-Anbindung (lib/dashboard/google.ts) inkl. Visibility-Trend/Penalty-Alarm.
- Internes Dashboard mit 6 Tabs (app/dashboard, prod-geblockt via Env-Flag).
- Health-Signal-Engine (Dead-Man-Switch, Indexierungs-Warnung) — direkt generisch.
- E-Mail-Infrastruktur (Review/Ops/Published), Kontaktformular-API (Zod, Rate-Limit,
  Honeypot), Distribution-Kit (LinkedIn/Substack/Medium/Bluesky), YouTube-Upload.

Was zum verkaufbaren Produkt fehlt: Mandantenfaehigkeit (DB statt Dateien,
OAuth pro Kunde statt lokaler Tokens), Kunden-Login, Self-Service-Onboarding
("Search Console verbinden"-Button), Paket-/Billing-Logik, Verallgemeinerung
der Content-Engine (Voice/Themen pro Kunde konfigurierbar statt hart codiert).
Einordnung: Umbau, kein Neuanfang.

## 3. Modul-Katalog mit Kosten-Fakten

| Modul | Unsere Kosten | Marktanker (verifiziert) | Build-Aufwand |
|---|---|---|---|
| Uptime-Alert | ~0 (Cron+Ping+Resend) | Teil von Wartung 39-150/Mon | 1-2 Tage |
| Speed-/SEO-Report | ~0 (PSI-API gratis, 25k/Tag) | meist PDF-Monatsbericht der Konkurrenz | 3-5 Tage |
| Analytics-Dashboard (GSC+GA4) | ~0 (APIs gratis) | Konkurrenz: passiver Monatsbericht | 5-8 Tage (Multi-Tenant) |
| Heatmaps | 0 (MS Clarity gratis; PostHog Free 5k Recordings, EU-Cloud) | Hotjar kostenpflichtig | 1-8 Tage |
| Content-Editing light | Payload CMS MIT-Lizenz, ~7 EUR/Mon Infra | Konkurrenz loest es per CMS-Schulung | 10-15 Tage |
| KI-Chatbot (RAG ueber Site) | 1-10 EUR/Kunde/Mon (Haiku + Caching) | Chatbase $40-500+/Mon | 6-10 Tage |
| Terminbuchung | Cal.com self-hosted ~4,50 EUR/Mon | Calendly $10-16/User/Mon | 5-7 Tage |
| Review-Management | GBP-API gratis (Moderations-Gate 2026 beachten) | Birdeye/Podium $299-599/Mon | mittel |
| Lead + Follow-up-Mails | Resend Free 3k Mails, Pro $20/50k | CRM-Markt unuebersichtlich | 6-9 Tage |
| Auto-Artikel + Social | API-Kosten niedrig (eigene Pipeline!) | Content-Abos DACH 290-1.790/Mon | Pipeline steht; Meta-App-Review 2-4 Wochen VORLAUF — sofort starten |
| KI-Telefon (white-label) | Vapi $0,05/Min / Retell $0,07/Min | fonio ab 99, HalloPetra 99-499/Mon | NICHT selbst bauen, integrieren |

ZU VERIFIZIEREN (bewusst keine Zahl erfunden): ueblicher Freelancer-Preis pro
SEO-Artikel in AT/DE; Zahlungsbereitschaft unserer konkreten Zielkunden
(Interviews/Testverkauf); White-Label-Faehigkeit von Clarity.

## 4. Empfohlene Leistungs-Architektur

**Positionierungssatz (Arbeitsstand):** "Wir bauen keine Websites. Wir bauen
Mitarbeiter, die wie Websites aussehen." — Vorsicht: "Website als Mitarbeiter"
ist bei NEUZEITWERBER fast wortgleich besetzt; unsere Differenzierung ist der
BEWEIS (echtes Dashboard, echte Automationen, Fixpreise) statt des Slogans.

**In jeder Website inklusive (Grenzkosten ~0, Verkaufshebel fuer 950/2.900/4.900):**
Dashboard mit Analytics in Klartext (GSC/GA4), Uptime-Alert, monatlicher
Speed-/SEO-Report, Content-Editing light (Texte/Bilder selbst aendern).
Das loest das nie eingeloeste Versprechen der Live-Seite ("Dashboard ab
Business-Paket gratis") ein und schlaegt JEDE Website-Miete der Konkurrenz.

**Zubuchbare Mitarbeiter-Module (Abo, Preise nach Verifikation festlegen):**
1. Content-Mitarbeiter: X Artikel/Mon + Social-Verteilung, Freigabe per Klick.
   Anker: Konkurrenz verlangt 290-1.790/Mon; unsere Grenzkosten nahe null.
2. Empfangs-Mitarbeiter: Chatbot (Eigenbau, Flat) + optional KI-Telefon
   (Vapi/Retell white-label) + Terminbuchung (Cal.com).
3. Ruf-Mitarbeiter: Review-Monitoring + Antwort-Entwuerfe mit Freigabe.
   Anker: US-Tools $299-599/Mon.
4. Sichtbarkeits-Mitarbeiter (GEO/AEO): Schema-Pflege, KI-Sichtbarkeits-
   Monitoring ("empfiehlt ChatGPT dich bei 'Installateur Linz'?"), GBP-Pflege.
   First-Mover-Fenster, kaum Konkurrenz im KMU-Segment.
5. CRO-Modul: Heatmaps + monatliche Empfehlung, spaeter A/B.

**Preisfindungs-Methode (statt erfundener Zahlen):** pro Modul den Anker
"was ersetzt es" ansetzen (Mini-Job/Freelancer/US-Tool), darunter bleiben,
mit 3-5 Pilotkunden testverkaufen, dann festschreiben.

## 5. Ungeschoente Einschaetzung (Fable, 17.07.)

1. Die Founder-These stimmt und der Markt bestaetigt sie praezise: statische
   Sites kommoditisieren (ab $10/Mon), betreute smarte Sites sind eine offene
   Nische in DACH. Das Zeitfenster ist real, aber nicht ewig (GEO-Fenster
   schliesst sich, Telefon-KI ist schon dicht besetzt).
2. Der "Mitarbeiter" ist strategisch vor allem eine MRR-Maschine: Einmal-
   Websites skalieren nicht, Abos schon. Hybrid ist richtig.
3. Nicht zu frueh SaaS bauen. Erst 5-10 Pilotkunden mit Dashboard v1
   (bestehenden Code minimal mandantenfaehig machen), Module teils "concierge"
   (intern halbmanuell) erbringen, erst dann automatisieren, was sich wiederholt.
4. Groesstes Risiko ist nicht Technik, sondern Betreuungs-Last: jedes Modul
   mit Freigabe-Schleife erzeugt Support. Deshalb Module scharf abgrenzen,
   Freigabe-UX radikal einfach (Ein-Klick wie unsere Review-Mail).
5. Nicht bauen: eigener Voice-Stack, eigenes CMS-von-Grund-auf, Wetten auf
   llms.txt, voll-autonome Set-and-forget-Agenten.
6. Meta/Instagram-App-Review (2-4 Wochen) sofort anstossen — einziger externer
   Blocker mit Vorlaufzeit.

## 6. ENTSCHEIDUNGEN Thomas (17.07.2026, verbindlich — nicht neu aufrollen)

**Metapher:** Mitarbeiter-Idee bleibt, aber eigene Sprache (NEUZEITWERBER,
neuzeitwerber.de, besetzt "Website wird zum aktiven Mitarbeiter" als Slogan).

**Paket-Logik:** Jede Website inklusive (im Kaufpreis): Hosting (Vercel),
Dashboard mit Klartext-Analytics, Content-Editing light (Texte/Bilder selbst),
Uptime-Alarm, Speed-Report, Pflege unsichtbar eingebacken. Darauf Module als
Abo ("Modul 1, 2, ... was brauche ich, was kostet es").

**Aktiv verkaufte Module (erste Welle):**
1. Content-Mitarbeiter (Artikel + Social, Freigabe per Klick) — Pipeline steht.
2. Empfangs-Mitarbeiter (Terminbuchung + Anfragen-Erfassung + Auto-Nachfassen).
   Chatbot ausdruecklich NICHT im Kern (Thomas unsicher) — spaetere Option.
3. Outreach-Mitarbeiter B2B (findet + kontaktiert Wunschkunden) — NUR auf
   Anfrage mit Gespraech: (a) Rechtslage AT (TKG/UWG, E-Mail ohne Einwilligung
   auch B2B heikel) VOR Produktisierung sauber pruefen, Setup so bauen dass der
   Kunde kein Abmahnrisiko traegt; (b) Technik existiert = Pumukel-System
   (eigener Vertrieb, ~/dev/pumukel-api), muesste mandantenfaehig werden.

**Nur auf der Website vermerkt, Leistung "auf Anfrage" (noch nicht aktiv
anbieten):** Ruf-Mitarbeiter (Reviews), Sichtbarkeits-Mitarbeiter (GEO/KI),
Conversion-Mitarbeiter (Heatmaps/CRO). Anfragen zeigen, was der Markt will,
bevor wir produktisieren. Lead-Modul ist im Empfang aufgegangen.

**Preise:** weiterhin OFFEN, nichts erfinden. Methode: Anker "was ersetzt es",
Verifikation ueber Freelancer-Marktpreise + 3-5 Bestandskunden-Gespraeche.
Website-Kaufpreise unveraendert 950 / 2.900 / ab 4.900 (PREISE_SEITE_BRIEF.md).

## 7. Naechste Schritte (Vorschlag)

1. Thomas entscheidet: Modul-Schnitt + Namensgebung (Mitarbeiter-Metapher ja,
   aber eigene Sprache) + welche 2-3 Module zuerst.
2. Preis-Verifikation: Freelancer-Artikelpreise belegen, 3-5 bestehende Kunden
   befragen/testverkaufen.
3. Leistungsseiten im Relaunch dann auf dieser Architektur aufbauen (statt die
   alten 5 Leistungen 1:1 zu portieren), Preise-Seite danach.
4. Parallel: Dashboard v1 Mandantenfaehigkeits-Plan (eigenes Projekt, nicht
   im Relaunch-Strang).
