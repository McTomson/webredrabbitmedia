# SEO/E-E-A-T/GEO Voll-Audit — konsolidierte Befunde (11.08.2026)

3 parallele Sonnet-Audit-Agenten (Technik-SEO, E-E-A-T/Recht, GEO/CWV),
Orchestrator-konsolidiert. Checkliste dazu: SEO_GEO_FINALCHECK_CHECKLISTE_2026-08-11.md.

## P0 — Sofort-Fixes (unstrittig, Executor beauftragt 11.08.)

1. **NOINDEX-LANDMINE VERLETZT**: `app/relaunch-preview/ueber-uns/page.tsx`
   steht auf `index,follow` — einzige indexierbare Preview-Seite. -> noindex.
2. **790-EUR-Leichen im live ausgespielten Markup** (Preise-Guard-Verstoss):
   `app/layout.tsx:43-47` (twitter-Default "Website ab 790€", erbt auf fast
   alle Seiten) + `lib/schema/organization.ts:43` und websiteSchema:88-89.
   -> auf echte Preise (ab 1.250) umformulieren.
3. **Kein echtes `<h1>` auf 7 Kernseiten** (/, /preise, /faq, /leistungen,
   /leistungen/website, /leistungen/talos, /tipps): Hero rendert
   `<div role="heading" aria-level="1">`. Korrekte Vorlage existiert:
   `components/subpages/kontakt-demo/demo.body.html` + ueber-uns-demo
   (echtes `<h1 class="hero-title">`). -> 1:1 auf h1 umstellen, optisch ident.
4. **og:image weg auf 9 Seiten** (Referenzen + 8 webdesign-*): eigenes
   `openGraph`-Objekt ohne `images` toetet die Vererbung (Next.js merged
   nicht tief). Ausserdem: geerbtes Bild ist og-image-wien.jpg (falsches
   Motiv), twitter:card existiert NIRGENDS im Preview-Baum.
   -> Thomas' neues Link-Bild (1731x909 -> 1200x630, <300 KB) als globales
   og:image + twitter:card summary_large_image; betroffene Seiten images
   explizit setzen.
5. **Descriptions**: Home hat KEINE; zu lang (>160): /preise 190,
   /leistungen 165, /leistungen/talos 176, 6 von 8 Bundesland-Seiten.
   Talos-title 71 Zeichen (zu lang).
6. **robots doppelt**: `app/robots.ts` (gut, alle KI-Bots erlaubt) UND
   `public/robots.txt` parallel -> statische Datei entfernen (Route gewinnt).
7. **llms.txt + llms-full.txt** (Thomas-Freigabe): redaktionell, echte
   Daten (Preise, Prozess, Referenzen; KEINE Follower-Zahlen, keine
   Bewertungs-Claims). **IndexNow** (Thomas-Freigabe): Key-Datei + Ping.

## P1 — Braucht Thomas-Entscheid/Input (NICHT ohne Freigabe umsetzen)

A. **aggregateRating 5,0/8 im JSON-LD** (`lib/reviews.ts:29-32`, gerendert
   via layout.tsx/organization.ts/tipps): Profil hat laut Thomas 11.08.
   aktuell 3 echte Reviews; die 8 stammen vom 12.06. und widersprechen
   KundenSagen-Verifikation 22.07. (genau 3). Empfehlung: Rating-Markup
   ganz raus (Google-Policy 24.07.26 + UWG), sichtbare Copy = Thomas' Call
   ("Zahlen lassen"). Auch "164 Projekte"/"8 Google-Bewertungen" in
   Hero.tsx:223 + ueber-uns-FAQ betroffen.
B. **Regionale Testimonial-Komponenten der ALTEN Seiten** (Steiermark/Wien/
   OOe/Tirol/Vlbg/Sbg/NOe, z.B. `components/SteiermarkTestimonials.tsx`):
   Namen wie "Andreas H.", "Lisa M." mit 5 Sternen, Echtheit unbelegt.
   Klaeren: real mit Zustimmung oder komponiert? (UWG-Risiko.)
C. **MedienG-Offenlegung (§§ 24/25) FEHLT komplett** (eigene Pflicht neben
   ECG, bis 20.000 EUR). Entwurf kann gebaut werden (Medieninhaber =
   Red Rabbit GmbH, Unternehmensgegenstand, Blattlinie fuer Ratgeber),
   braucht Thomas-Freigabe der Angaben.
D. **§ 5 ECG**: konkrete Gewerbebezeichnung fehlt (nur RIS-Link).
   Thomas: was steht am Gewerbeschein?
E. **BaFG-Artikel** `content/blog/bfsg-...mdx` steht auf `status: draft`
   — beabsichtigt?
F. **Diese Fixes betreffen auch PRODUKTION (main)**: 790€/Rating/Impressum
   sind JETZT live auf web.redrabbit.media. Frage: kleinen Hotfix auf main
   cherry-picken oder bis Live-Tausch warten?
G. **Kurz-Antwort-Absaetze (GEO)**: /preise zeigt die erste Preiszahl erst
   bei ~21% des Dokuments; Regionen-Seiten ohne Kernantwort nach dem H1.
   Einbau = sichtbare Content-Aenderung -> Vorschlag zeigen, Thomas nimmt
   auf seinem Screen ab.

## Positiv (kein Handlungsbedarf)

- robots.ts erlaubt bereits ALLE relevanten KI-Crawler.
- Kein hreflang (korrekt). Organization-@id ueberall konsistent.
- /faq + Ratgeber-Artikel sind GEO-vorbildlich (details/summary,
  FAQPage-Schema, Frage-Antwort-Boxen). SSR-Text ueberall vorhanden
  (Scroll-Animationen verstecken nichts vor Crawlern).
- /leistungen-hub ist KOMPLETT unverlinkt -> Streichen waere ohne
  Linkbruch moeglich (Entscheidung offen).
- NAP fast konsistent (nur Impressum "Grabnergasse 8/8" vs. Schema
  "Grabnergasse 8" -> vereinheitlichen, klein).
- Bundesland-Seiten: sources-belegte FAQ, H1 vorhanden (sr-only).

## Offen / nicht messbar

- Core Web Vitals: PageSpeed-API Quota 429 (kein Key). Spaeter messen
  (PSI-Key oder npx lighthouse gegen v2-URLs, KEIN lokaler Build bei
  laufendem dev-Server).
- tipps/[slug] + referenzen/[slug] Einzel-Instanzen nicht alle gecurlt.
