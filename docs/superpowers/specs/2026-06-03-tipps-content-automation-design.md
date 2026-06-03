# Design: Tägliche Content-Maschine für "Tipps" (SEO/GEO-optimiert)

Datum: 2026-06-03
Status: Entwurf zur Freigabe
Autor-Kontext: Red Rabbit Media (web.redrabbit.media), Next.js App Router, Hosting Vercel

---

## 1. Kontext / Warum

Vor ~6 Monaten gab es bereits einen Versuch, täglich Artikel zu publizieren, um in
Google zu ranken. Das Projekt ist gescheitert. Die Obduktion (siehe §3) zeigt: Das
Problem war **nicht** die Artikel-Produktion, sondern fehlende **Autorität, Themen-
Strategie und ein Mess-/Verbesserungs-Loop**. Eine schnellere Schreibmaschine ohne
diese drei Dinge scheitert identisch erneut.

Dieses Dokument beschreibt eine **Strategie-Maschine**, die täglich qualitativ
hochwertige, E-E-A-T-starke Artikel erzeugt UND die strategischen SEO/GEO-Hebel
einbaut, die im Juni 2026 nachweislich Top-10-Rankings ermöglichen.

## 2. Ziel & ehrliche Erwartung

- **Ziel:** Täglich (gerampt) ein exzellenter Artikel auf `/tipps`, der nach Wochen/
  Monaten für gewinnbare Long-Tail-/lokale Suchanfragen Top-10 rankt, Traffic auf die
  Seite bringt, Leads erzeugt und von AI-Suchmaschinen (ChatGPT/Perplexity) zitiert wird.
- **Sekundär:** YouTube + Podcast (Substack) als Reichweiten-/Marken-Kanäle.
- **Ehrliche Erwartung:** Kurzfristig keine Top-10 für umkämpfte Head-Terms ("was kostet
  eine website"). Realistisch: Top-10 in 3–6 Monaten für Long-Tail/lokale Cluster +
  AI-Zitierbarkeit. Quelle siehe §3.

## 3. Obduktion 2026 (Recherche-gestützt)

Arbeits-Hypothesen aus Recherche (Stand Juni 2026, via GSC-Loop zu validieren — NICHT
als gesetzte Fakten behandeln; insb. das Backlink-Gewicht ist umstritten, Links zählen
weiterhin substanziell):
- **Backlinks nur noch ~13% Algorithmus-Gewicht** (früher >50%); Content-Qualität +
  Themen-Autorität + "Experience" dominieren.
- **Themen-Cluster**: ~30% mehr Traffic, Rankings halten 2,5× länger als Einzelartikel.
- **"Experience"** ist das am stärksten geprüfte E-E-A-T-Signal; eigene Daten + echte
  Erst-Hand-Erfahrung sind Pflicht.
- **Google bestraft AI-Content NICHT** (Ahrefs: 86,5% der Top-Seiten mit AI-Anteil).
  Bestraft wird **"scaled content abuse"**: 50–500 AI-Artikel/Tag ohne menschliche
  Prüfung, dünn → 50–80% Traffic-Verlust. Gegenmodell: menschlich redigierte AI-Artikel
  → +30–80% Traffic.
- **Erfolgsmodell:** 0 → 1.923 Top-10-Keywords in 12 Monaten, 700+ organische Referring
  Domains — Treiber: **proprietäre Daten**.
- **Programmatic-Benchmark:** ≥500 einzigartige Wörter UND 30–40% Differenzierung/Seite.
- **AT-Spezifika:** WKO-/Kammer-Links = hohes Trust-Signal; 46% der Suchen lokal.
- **GEO:** Gartner −25% klassisches Suchvolumen bis 2026; Bing-Index = Voraussetzung
  für ChatGPT-Zitate (IndexNow pingt Bing bereits).

Wahrscheinliche Scheiter-Ursachen damals: keine echten Backlinks/Autorität, verstreute
Themen statt Cluster, ggf. Velocity-/Thin-Content-Signal, kein Search-Console-Loop.

## 4. Architektur: Zwei entkoppelte Spuren

**Begründung:** Browser-Automation (NotebookLM/Substack) ist fragil. Wird sie an die
tägliche Artikel-Veröffentlichung gekettet, reißt ein UI-Update den ganzen Content ab.
Trennung = robuster Content-Fluss, entkoppelte Medien.

### Spur 1 — Content (robust, autonomie-fähig)
`Thema aus Cluster-Queue → Recherche → Schreiben (Hausstil) → Lektorat (KI-Verräter raus)
→ SEO/GEO-Finalizer → Bild (generativ + Marken-Standard, geo-getaggt) → MDX ins Repo
→ Freigabe-Gate → git push → Vercel deploy → IndexNow-Ping → Search Console`

Braucht **keinen** Browser-Login. Kann später als Cloud-Remote-Agent voll autonom laufen.

### Spur 2 — Medien (entkoppelt, läuft wenn Mac an)
`Artikel → NotebookLM (Audio + Video Overview) per Chrome-Automation → Download
→ YouTube-Upload via offizieller Data API + Beschreibung mit Artikel-Backlink
→ Substack-Post (Browser-Automation) → Audio/Video zurück in die Artikel-Seite einbetten
→ re-deploy`

**Robustheits-Entscheidungen:**
- YouTube-Upload über **offizielle YouTube Data API v3** (OAuth, kostenlos) statt Klick-Automation.
- Podcast-Distribution über **Substack** (eigener Podcast-RSS → Spotify/Apple). Substack
  hat keine Schreib-API → Post per Browser-Automation (User-Entscheidung: auto).
- **Nur NotebookLM** ist echte, isolierte Browser-Automation (keine API verfügbar).

## 5. Orchestrierung

- **Hosting:** bleibt **Vercel** (git-push = Auto-Deploy). Kein VPS (würde NotebookLM/
  YouTube-Cookies nicht halten, bringt fürs Hosting nichts).
- **Trigger (Start):** lokal auf dem Mac (macOS `launchd` oder Claude-geplanter Task),
  läuft wenn Rechner an ist, über das **Claude-Abo (0€)**, kein bezahlter API-Call.
  Steuert für Spur-2-Schritte den echten, eingeloggten Chrome (claude-in-chrome MCP).
- **Ausbau:** Spur 1 als **Cloud-Remote-Agent** (läuft auch wenn Mac aus).

## 6. Artikel-Engine: Mini-Redaktion (Mehr-Agenten)

Rollen nacheinander, je als fokussierter Schritt:
1. **Rechercheur** — sammelt echte AT-Fakten/Zahlen + Quellen (WebSearch/WebFetch),
   zieht aus dem proprietären Datensatz (§9).
2. **Autor** — schreibt im Hausstil; Few-Shot-Anker = die *besten* bestehenden Artikel
   in `content/blog/`; bindet echte Erfahrung/Meinung von Thomas Uhlir MBA ein.
3. **Lektor** — entfernt KI-Verräter (Listen-Manie, Floskeln wie "in der heutigen
   digitalen Welt", gleichförmige Absätze, Em-Dash-Flut, Weichspüler), variiert Struktur.
4. **SEO/GEO-Finalizer** — Featured-Snippet, FAQ, Schema, interne Verlinkung, TL;DR-Box,
   Daten-Tabellen, Claim→Beleg-Struktur; füllt das komplette MDX-Frontmatter-Schema.

**Qualitäts-Gate (gegen scaled-content):** ≥500 einzigartige Wörter, ≥30–40%
Differenzierung ggü. bestehenden Artikeln, Intent in einem Besuch erfüllt, mind. 1
proprietäres Daten-/Tabellen-Element, echte Quellen. Verfehlt der Artikel das Gate →
Stopp + Alarm, nicht publizieren.

## 7. Seiten-Template (bereits stark, gezielt ergänzen)

Vorhandene Automatik in `app/tipps/[slug]/page.tsx` + `lib/blog/posts.ts`: TOC
(`extractHeadings`), BlogPosting- + FAQPage-Schema (inkl. Autor-E-E-A-T, `knowsAbout`,
`speakable`), OG/Twitter, Lesezeit, Canonical, verwandte Artikel. → Pipeline muss das
Layout NICHT neu bauen; alles leitet sich aus der MDX ab.

**Ergänzungen:**
- **Interne Verlinkung verbessern:** `relatedPosts` filtert aktuell nur `category` +
  `slice(0,2)` (schwach). Auf **semantisch/themen-basiert + Pillar-Link + 3–5 Links**
  erweitern. Datei: `app/tipps/[slug]/page.tsx`.
- **TL;DR-Box** als MDX-Komponente (GEO: AI-Zitierbarkeit).
- **Daten-Tabellen-Komponente** (GEO + Differenzierung).

## 8. SEO/GEO-Strategie als feste Pipeline-Features

1. **Themen-Cluster:** 365 Themen → Pillar-Seiten + Supporting-Artikel mit Rückverlinkung.
2. **Proprietäre Daten** in jedem Artikel (§9).
3. **Echte Erfahrung** einweben (Kunden-Beispiele, eigene Zahlen, klare Meinung).
4. **GEO on-page:** TL;DR, Claim→Beleg, Q&A (FAQ), Daten-Tabellen, sichtbares Autor+Datum.
5. **Search-Console-Loop (monatlich):** Artikel auf Position 8–20 finden → gezielt
   verbessern; Content-Refresh alter Artikel.
6. **AT-Trust-Links:** WKO Firmen A-Z, Wirtschaftskammer, FirmenABC, regionale Verbände,
   Google Business Profile (NAP-konsistent). Aufgabenliste, teils manuell.
7. **Interne Verlinkung automatisiert:** neuer Artikel verlinkt 3–5 passende alte + Pillar;
   alte Artikel bekommen rückwirkend Link zum neuen.
8. **Distribution:** Substack-Liste, LinkedIn, YouTube/Podcast → Engagement + Markensuchen.
9. **Lokale Intent:** `webdesign-[bundesland]`-Seiten mit Artikeln verzahnen.
10. **Velocity:** sanftes Ramp-up + menschliche Freigabe (Anti-scaled-content).

## 9. Daten-Fundament (früher Schritt, vor Skalierung)

Status der "Red Rabbit Preisstudie 2026" unklar. Schritt:
- Vorhandene Projekt-/Preisdaten sichten → echten, zitierfähigen Datensatz formen; ODER
- Sauber recherchierte Daten (mit Quellenangaben) als Asset aufbauen.
Ergebnis = wiederverwendbare Datenquelle, aus der jeder Artikel ein einzigartiges
Element zieht (Differenzierung + E-E-A-T + Linkmagnet).

## 10. Themen-Strategie

User liefert ~365 Themen/echte Google-Fragen. Pipeline: **in Cluster ordnen + nach
Gewinnbarkeit priorisieren** (Suchvolumen/Schwierigkeit; Long-Tail/lokal zuerst). Nicht
strikt Listenreihenfolge. Cannibalization vermeiden (kein Doppel-Targeting gleicher
Keywords).

## 11. Bilder

Generativ (inhaltlich passend zum Artikel), **aber mit erzwungenem Standard-Look**:
- **Motiv** aus dem Artikel (variiert) vs. **Look** konstant.
- Sperre 1: fixierter Art-Direction-Prompt + Referenzbild + Seed (kein Text im Bild).
- Sperre 2: **deterministische Marken-Nachbearbeitung** (einheitlicher Rahmen/Logo/
  Farbgrading via HTML→Screenshot oder ImageMagick) → zwingt jedes Bild in denselben Look.
- **Geo-Signale (ohne Fälschung):** sprechender, regionaler Dateiname + Alt-Text + ggf.
  ImageObject-Schema. KEIN gefälschtes EXIF-GPS (bringt kein Ranking, ist erfundene
  Provenienz — gestrichen auf Review-Empfehlung).
- **Generator (Entscheidung):** Codex primär, Gemini als Fallback. Vorab bestätigen, dass
  Codex-Bildgenerierung im Abo kostenfrei + automatisierbar ist (sonst 0€-Vorgabe verletzt).
- **Konsistenz-Sperre bleibt immer aktiv:** die deterministische Marken-Nachbearbeitung
  (Sperre 2) standardisiert JEDES Bild, unabhängig vom Generator.

## 12. Benötigte Zugänge

- Google Search Console (gratis, Domain verifizieren, Sitemap einreichen) — Pflicht.
- YouTube-Kanal + einmal OAuth (YouTube Data API v3).
- NotebookLM (in Chrome eingeloggt).
- Substack (redrabbitlab.substack.com) — in Chrome eingeloggt.
- Bild-Generator (Codex und/oder Gemini) — Entscheidung nach Kalibrier-Test.
- 365-Themenliste vom User.
- Optional: 1–2 LinkedIn-Posts als Stimm-Anker.
- (Nicht nötig: Obsidian, GDS — redundante Ablage; Content lebt als MDX im Repo.)

## 13. Risiken & Gegenmaßnahmen

1. **Google scaled-content-Penalty** → Qualitäts-Gate, echte Recherche, Freigabe,
   menschlicher Autor, sanftes Tempo. (Höchstes Geschäftsrisiko.)
2. **NotebookLM Video Overview per Automation** → größtes technisches Fragezeichen.
   **Bau-Schritt 0 von Spur 2 = Machbarkeits-Probe**: Lässt sich das Video stabil
   herunterladen? Falls nein: Fallback ffmpeg-Audiogramm-Video oder Video manuell.
3. **Browser-Automation bricht bei UI-Updates** → durch Spur-Trennung + offizielle APIs
   (YouTube) minimiert; Monitoring + manueller Fallback; bei Bruch Stopp statt Müll-Live.
4. **Plan-Verbrauch** der Mehr-Agenten-Pipeline → pro Artikel messen, justieren.
5. **Mac muss an/entsperrt sein** für Spur 2 → akzeptiert; Spur 1 später cloud-autonom.

## 14. Bau-Phasen (Spur 1 zuerst)

- **Phase A — Fundament:** Daten-Fundament (§9), Themen-Clustering (§10), Bild-Standard
  kalibrieren (§11), Search Console einrichten (§12).
- **Phase B — Artikel-Maschine (Spur 1):** Mini-Redaktion (§6) + Qualitäts-Gate +
  MDX-Ausgabe + Bild + interne Verlinkung + Freigabe-Gate + Deploy + IndexNow.
- **Phase C — Template-Ergänzungen:** related-posts, TL;DR, Daten-Tabellen (§7).
- **Phase D — Orchestrierung:** lokaler Trigger (launchd/Claude-Task), Ramp-up.
- **Phase E — Mess-Loop:** Search-Console-Auswertung + Verbesserungs-Workflow (§8.5).
- **Phase F — Spur 2 Medien:** NotebookLM-Probe → Audio/Video → YouTube-API → Substack →
  Einbettung → re-deploy.
- **Phase G — Autorität:** AT-Trust-Links (§8.6), Distribution (§8.8), optional Spur 1
  in die Cloud heben.

## 15. Verifikation

- Spur 1: Artikel wird erzeugt, besteht das Qualitäts-Gate, MDX rendert lokal
  (`npm run dev`), Schema validiert (Rich Results Test), Bild geo-getaggt vorhanden,
  interne Links gesetzt, Deploy auf Vercel sichtbar, IndexNow-Ping erfolgreich,
  Seite in Search Console eingereicht/indexiert.
- Qualitäts-Gate: Stichprobe manuell gegenlesen (klingt nach Mensch? echte Daten? Mehrwert?).
- Spur 2: NotebookLM-Probe bestanden; YouTube-Video live mit Artikel-Backlink; Substack-
  Post live; Audio/Video auf der Artikelseite eingebettet.
- Mess-Loop: nach 4–6 Wochen erste Position-8–20-Artikel in Search Console identifizierbar.

## 16. Offene Punkte

- Status proprietärer Datensatz final klären (§9).
- Bild-Generator-Entscheidung nach Kalibrier-Test (§11).
- NotebookLM-Video-Machbarkeit (Risiko 2).
- LinkedIn-Stil-Samples (optional).
- Exakter Trigger-Mechanismus (launchd vs. Claude-Task) in Phase D festlegen.

---

# Addendum v2 (2026-06-03) — Probe-Verdikt, verfeinerte Orchestrierung, kritische Puzzleteile

## 17. NotebookLM-Video-Machbarkeitsprobe (durchgeführt)

Live-Stand der vorhandenen Anbindung (notebooklm MCP v2.0):
- `authenticated: false` — gespeicherte Google-Cookies aktuell ungültig (Re-Auth nötig).
- 1 Notebook vorhanden: "LinkedIn Optimierung" (bisheriger LinkedIn-Workflow).
- MCP läuft headless, Session-Timeout 900s.

Fähigkeiten:
- **Audio Overview: ja**, Deutsch voll unterstützt (seit Aug 2025 mirror'n nicht-engl.
  Overviews die englische Tiefe).
- **Video Overview: NICHT im MCP** ("not yet wrapped" — nur Audio).
- Video frei + deutsch machbar via **`notebooklm-py`** (inoffizielles CLI, lädt MP4,
  arbeitet mit Claude Code; Risiko: undokumentierte interne APIs, kann brechen).
  Fallback garantiert: **ffmpeg-Audiogramm** aus dem Audio.

**Verdikt:** Video machbar, aber als bewusst isolierter, abbruch-toleranter Schritt.
Der eigentliche Knackpunkt ist **nicht das Video, sondern die Auth-Fragilität**
(Google-Cookies laufen ab). Konsequenz → siehe §18.

## 18. Verfeinerte Orchestrierung (permanente Erlaubnis + Hintergrund)

**Entscheidung:** Statt den interaktiven Chrome fernzusteuern (braucht Session +
entsperrten Bildschirm + Erlaubnis pro Aktion) bauen/adaptieren wir ein **eigenes
NotebookLM-CLI mit dauerhaft gespeichertem Login** (Basis `notebooklm-py`). Es hält
eigene Cookies, läuft **headless im Hintergrund, ohne Claude-Browser-Erlaubnis pro
Aktion**, lädt Audio + Video. Erlaubnis wird einmalig erteilt (Persist-Auth).

**Täglicher Ablauf:**
- *Unbeaufsichtigt, headless, ohne Prompt:* (1) Spur 1 erzeugt Artikel + Bild;
  (2) Spur 2 erzeugt aus dem **Entwurfstext** (NotebookLM `add_source` nimmt Text
  direkt) Audio + Video per CLI, lädt beide; (3) alles → **eine** Freigabe-Email.
- *Dein 1–2-Min-Moment:* (4) Email mit gerendertem Artikel + Bildern + **Link zu
  Video + Podcast** → "Freigeben"; (5) dann publish + deploy + YouTube öffentlich
  (mit AI-Kennzeichnung + Artikel-Backlink) + Substack-Post + IndexNow.
- *Graceful degradation:* CLI-Auth abgelaufen → Email "Medien ausstehend, Re-Login
  nötig", Artikel bleibt trotzdem freigebbar.

**Freigabe-UX (Entscheidung):** Email mit gerendertem Artikel, Bildern, Video- und
Podcast-Link + 1-Klick-Freigabe.

**Kadenz (Entscheidung):** 1 Artikel/Tag (Site existiert bereits, nicht neu), aber zu
**wechselnden Uhrzeiten** (natürliches Velocity-Muster).

**Eigenes Tooling (Entscheidung):** dünnes CLI/Orchestrator selbst bauen, `notebooklm-py`
adaptieren statt neu erfinden (YAGNI). Kein Over-Engineering.

## 19. Die 13 kritischen Puzzleteile (mit Lösung)

**Operative Blocker:**
1. **iCloud-Git-Hänger (Show-Stopper):** Automatik-Repo MUSS raus aus iCloud.
   *Entscheidung:* Projekt nach `~/dev/redrabbit` verschieben (nicht iCloud-synct).
2. **Headless vs. Browser:** Spur 1 headless ok; Spur 2 via Persist-Auth-CLI (kein
   entsperrter Browser nötig) — siehe §18.
3. **Idempotenter, selbstheilender Trigger:** `launchd`-Job prüft bei Mac-Aufwachen
   "heutiger Artikel da?"; Bedingungen (Netz/ggf. Strom) ok → `claude` headless; **Lock**
   gegen Doppellauf; **Catch-up** für verpasste Tage.
4. **Plan-Verbrauch:** Token-Budget/Tag der Mehr-Agenten-Pipeline schätzen + einhalten
   (0€ über Plan = harte Vorgabe).

**Strategie-Lücken:**
5. **Keyword-Daten ohne Bezahltools:** Google Keyword Planner (gratis via Ads-Konto),
   Search Console, Autocomplete + "People Also Ask"-Scraping, Bing Webmaster. Eigener
   Pipeline-Baustein für Priorisierung.
6. **Tempo:** 1/Tag zu wechselnden Zeiten (statt Firehose); Qualitäts-Gate als Bremse.
7. **Autoren-Authentizität:** Thomas Uhlir UND Dmitry sind **reale Personen** (kein
   Fake-Byline) → mehrere echte Autoren legitim und gut für glaubwürdigen Takt. Optional
   Staffelung: gelegentliche, wirklich-authored Pillar-Stücke (echte Erfahrung) vs.
   häufige AI-assistierte Supporting-Stücke.
8. **Pillar-Seiten zuerst:** Cluster-Fundament vor Supporting-Artikeln (Reihenfolge).

**Qualität & Recht:**
9. **Fakten/Recht:** Fact-Checker-Schritt + Guard "keine unbelegten Rechts-/Preis-
   aussagen" (DSGVO/BFSG/€-Zahlen). Freigabe allein reicht nicht.
10. **AI-Offenlegung:** YouTube "altered content"-Kennzeichnung bei Upload setzen.
11. **Duplikat-/Kannibalisierungs-Schutz:** Ähnlichkeits-Check neuer Themen gegen
    bestehenden Korpus vor Generierung.

**Messung:**
12. **Analytics + GSC-API:** Search-Console-API (gratis, OAuth) für Position-8–20-Loop;
    prüfen ob Web-Analytics (GA4/Plausible) installiert ist, sonst nachrüsten.
13. **KPI-Scorecard + 6-Monats-Checkpoint:** indexierte Artikel, Keywords Top-20/Top-10,
    organische Klicks, Leads; fixer Review-Punkt.

## 20. Aktualisierte Phasen-Reihenfolge

- **Phase 0 — Fundament-Fixes:** Repo nach `~/dev` (§19.1); Persist-Auth-NotebookLM-CLI
  aufsetzen + verifizieren (Audio+Video-Download, deutsch); Google Search Console + GSC-API
  + YouTube-OAuth + Analytics-Check; Keyword-Daten-Quelle (§19.5); Bild-Standard kalibrieren.
- **Phase A — Daten & Themen:** Daten-Fundament (§9), Themen-Clustering + Pillar-Plan (§8.1,
  §19.8), Duplikat-Index (§19.11).
- **Phase B — Artikel-Maschine (Spur 1):** Mini-Redaktion + Qualitäts-/Fakten-Gate (§19.9)
  + MDX + Bild + interne Verlinkung + Email-Freigabe-Gate + Deploy + IndexNow.
- **Phase C — Template-Ergänzungen:** related-posts, TL;DR, Daten-Tabellen (§7).
- **Phase D — Orchestrierung:** idempotenter launchd-Trigger (§19.3), Token-Budget (§19.4).
- **Phase E — Mess-Loop:** GSC-API-Auswertung + Verbesserungs-Workflow + KPI-Scorecard (§19.12-13).
- **Phase F — Spur 2 Medien:** NotebookLM-CLI Audio+Video → YouTube-API (AI-Kennz.) →
  Substack → Einbettung → re-deploy; ffmpeg-Audiogramm als Fallback.
- **Phase G — Autorität:** AT-Trust-Links, Distribution, optional Spur 1 in die Cloud.

---

# Addendum v3 (2026-06-03) — Kritischer Review eingearbeitet

Unabhängiger adversarialer Spec-Review durchgeführt. Verdikt: Architektur solide, aber
Bedingungen vor dem Bauen. Hier die Auflösungen + Entscheidungen.

## 21. Autonomie-Modell (User-Entscheidung + ehrliche Einordnung)

**Ziel des Users:** so autonom wie möglich; Maschine arbeitet alles vor (Recherche,
Mehr-Agenten-Orchestrierung), Mensch schaut in 1-2 Min drüber + kann bei Bedarf adaptieren;
**Endziel = vollautonom** im Stil/auf Basis des Users.

**Ehrliche Auflösung des Kern-Widerspruchs (Review-Risiko 1):** Bei nur 1-2 Min
Mensch-Zeit muss **das automatische Gate die Editorial-Arbeit leisten**, nicht der Blick.
Daher ist das **maschinelle Fakten-/Qualitäts-Gate die primäre Schutzschicht**:
- Fact-Checker-Agent mit **Quellen-Zwang** (jede Zahl/Aussage belegt).
- **Harte Sperre:** keine unbelegten Preis- oder Rechtsaussagen (DSGVO/BFSG/€) publizieren.
- Quality-Gate (≥500 Wörter unique, 30-40% Differenzierung, Intent erfüllt, echtes Daten-Element).
- Mensch-Glance = letzte Sanity-Prüfung + Adapt-Option, nicht die QA.

**Weg zur Voll-Autonomie (messbar + umkehrbar):** Start Glance-Review → Search Console
parallel beobachten → zeigt sich nach der Rampe **kein** Penalty-/Qualitätssignal,
schrittweise auf Voll-Auto schalten; bei negativem Signal zurückdrehen. Das Google-
Risiko der Voll-Autonomie wird damit **bewusst getragen, aber überwacht und reversibel**,
nicht ignoriert.

## 22. Review-Fixes (in die Spec übernommen)

- **§3-Statistiken** als zu-validierende Hypothesen gekennzeichnet (nicht als Fakten);
  Backlinks NICHT allein wegen einer unsicheren Zahl deprioritisieren.
- **EXIF-GPS-Fälschung gestrichen** (§11) — kein SEO-Nutzen, erfundene Provenienz.
- **Fake-Autor entfällt** — beide Autoren sind real (§19.7 aktualisiert).
- **Bild-Kosten:** Codex primär / Gemini Fallback; Codex-Gratis-Eignung vorab bestätigen;
  Marken-Nachbearbeitung erzwingt Standard unabhängig vom Generator (§11).

## 23. Neue Pflicht-Bausteine aus dem Review

**Medien-Integrität & Auth (Spur 2):**
- Nach Download **Integritätsprüfung** (Dateigröße/Dauer/Codec, nicht leer/trunkiert)
  VOR Publish; bei Fehlschlag Artikel ohne Medien publizieren statt kaputtes Medium.
- **Re-Auth als erwartetes (≈wöchentliches) Ereignis** behandeln, schneller manueller
  Re-Login-Pfad; Auth-Ablauf nie als Edge-Case.
- **ToS-/Account-Sperr-Risiko** von NotebookLM/Substack-Automation explizit dokumentiert;
  Konsequenz Account-Sperre = Verlust des Distributionskanals. Sparsame, menschen-ähnliche
  Nutzung; bei Sperr-Signalen stoppen.

**Sicherheit & Hygiene (Spur 1):**
- **Freigabe-Link = signierter, einmaliger, ablaufender Token** (kein klickbarer Klartext-
  Publish-Link in der Email; SMTP-Infra `SMTP_*` vorhanden, wird wiederverwendet).
- **Entwürfe niemals indexierbar** (noindex/Preview-Isolation) bis Freigabe; keine
  verwaisten indexierten Reject-URLs (Soft-404/Thin-Content vermeiden).
- **Rollback/Un-Publish-Prozess** für fehlerhaft publizierte Artikel (git-revert + De-Index).

**Recht/Compliance (neuer Abschnitt):**
- **AI-Kennzeichnung auch auf den Artikeln** (nicht nur YouTube), EU-AI-Act-Transparenz.
- **DSGVO:** für Keyword-/PAA-Scraping (§19.5, ToS-Grauzone — sparsam/zulässige Quellen)
  und für **Kunden-Beispiele in Artikeln nur mit Einwilligung/anonymisiert**.
- **Bild-Lizenz/kommerzielle Nutzung** des Generators prüfen.

**Budget & Baseline (vor Skalierung):**
- **§19.4 muss eine GEMESSENE Token-/Usage-Zahl** für einen vollen Artikel liefern VOR
  Phase D; bei Limit: auf morgen schieben, nie halb publizieren. Klärung, ob geplante
  headless-Abo-Läufe ToS-konform sind (sonst Modell anpassen).
- **Domain-Baseline in Phase 0 messen** (indexierte Seiten, GSC-Impressions, bestehende
  Rankings, ist GA4/Plausible installiert?). 3-6-Monats-Ziel **bedingt** auf Baseline +
  gewinnbares Keyword-Subset reformulieren, nicht absolut versprechen.

**Daten-Fundament als harter Blocker:**
- §9 wird **Pass/Fail-Gate**: existiert nach fixer Timebox kein echter, quellen-gestützter,
  wiederverwendbarer Datensatz (idealerweise **mehrere** Daten-Winkel, da eine Tabelle nicht
  365× "unique" sein kann), ändert sich die Differenzierungs-Strategie — NICHT mit
  synthetischen Daten weiterfahren.

**Kannibalisierung & Leads:**
- Cluster-Architektur mit **Keyword-Mapping pro Seite** (eine Intent-Variante je Seite),
  nicht nur ein Ähnlichkeits-Check zur Generierungszeit.
- **Lead-Capture auf Artikelseiten** definieren (CTA/Formular), sonst ist "Leads" als KPI
  (§19.13) nicht messbar.

## 24. Offene Bestätigungen vor Phase 0

- Codex-Bildgenerierung wirklich kostenfrei + automatisierbar?
- ToS-Konformität geplanter headless-Abo-Läufe (Token-Budget-Messung).
- Existenz/Aufbaubarkeit eines echten proprietären Datensatzes (Pass/Fail).

---

# Addendum v4 (2026-06-03) — SCOPE-LOCK: der schlanke Kern (verbindlich)

User-Korrektur: kein überkomplexes System, das an sich selbst scheitert. Ziel klar =
**eine Agentur ersetzen**: gute, interessante Artikel (echte Autoren-Stimme + Meinung,
echte Quellen, echter Mehrwert) + Video + Podcast zu **aktuell gesuchten Themen**,
online stellen. v1–v3 bleiben als Strategie-Referenz; **gebaut wird NUR was hier steht.**

## 25. Was wir bauen (schlanker Kern + 1 Extra)

1. **Thema:** aus der Liste + einfacher "wird das gerade gesucht?"-Abgleich (leichter
   Check, KEIN schweres Keyword-Tool).
2. **Lean-Redaktion, 4 Rollen** (statt 8): Recherche+Quellen → Schreiben (Voice-Profil
   der ECHTEN Autoren + gebatchter Meinungs-Inject) → Lektor+Fakten-Check (Quellen-Zwang,
   harte Sperre unbelegte Preis-/Rechtsaussagen) → SEO/GEO-Finalize (Template macht das meiste).
3. **Bild:** Codex primär / Gemini Fallback + konstante Marken-Nachbearbeitung.
4. **Medien (entkoppelt):** NotebookLM Audio + Video (CLI, Persist-Auth) → YouTube
   (Data API, AI-Kennzeichnung) + Substack (Browser-Auto); ffmpeg-Audiogramm als Fallback.
5. **Freigabe (flexibel):** Email mit gerendertem Artikel + Bild + Video-/Podcast-Link.
   **Default 1-Klick-Freigabe, mit Option** den Artikel zu öffnen und Verbesserungen
   anzuweisen (Agenten arbeiten nach) — du wählst pro Artikel. Dann publish + deploy +
   IndexNow.

**Das 1 Extra: datei-basiertes Lern-Gedächtnis** (im Repo, versioniert, agent-nativ):
- Hält: Voice-Profil, Meinungs-Pool, Guardrails (Nordstern + Verbote), Themen-Queue.
- Lernt: aus deinen Freigabe-Entscheidungen (was du änderst/ablehnst → wird zur Regel).
- **Obsidian: vorerst NICHT** — Gedächtnis als Dateien, Meinungs-Input via Chat/kurze
  Datei. Obsidian später jederzeit als optionale Eingabe-Brille aufsetzbar (Vault →
  Pipeline-Ordner, nicht auf iCloud).

## 26. Bewusst NICHT jetzt (nur bei Bedarf, als Notiz)

Programmatic-Maschine · Selbst-/ML-Lern-Loop über das Datei-Gedächtnis hinaus · mehrere
Daten-Assets · Autoritäts-/Outreach-Subsystem · A/B-Themen-Sortierung · Cloud-Remote-Agent.

Die Pre-Mortem-Risiken leben als **einfache Regeln, nicht als Subsysteme**: nur gesuchte
Themen, Quellen-Pflicht, Qualitäts-/Fakten-Gate, Autorität bewusst langsam akzeptiert,
**Test-Segment vor Voll-Ausbau** (20 Artikel, ~6 Wochen messen).

## 27. Pre-Mortem-Bezug (Strategie-Notizen, separat dokumentiert)

Ergänzendes Strategie-Briefing: `2026-06-03-content-automation-erkenntnisse-und-premortem.md`
(Zwei-Maschinen-Modell, Autorität als #1-Risiko, KPIs Indexierung→Klicks→Leads,
Meinungs-Inject batchen, Daten-Asset-Preis-Framing). Bleibt Referenz für spätere Ausbaustufen;
ändert den v4-Scope nicht.
