# Task-Specs Relaunch web.redrabbit.media — Arbeitsteilung nach Modell (Stand 04.07.2026)

Prinzip: Jede Aufgabe geht an das guenstigste Modell, das sie sicher kann. Fable 5 ist IMMER die Kontrollinstanz: jedes Zwischenergebnis wird von Fable gegen die Akzeptanzkriterien reviewt, BEVOR es in den Branch gemerged wird. Tomson sieht nur Gates (Vercel-Previews).

Mechanik: Fable spawnt Subagenten direkt aus der Session (Agent-Tool mit model-Override `opus` / `sonnet`; lange Laeufe via `autonomous-runner`). Keine separaten Chat-Sessions noetig. Bau-Branch: `relaunch`.

## Was noch fehlt (komplette Rest-Inventur)

**Dokumente/Design (P0):**
- [ ] Design-System/Design-Guide: Farb-Tokens (Markenrot #F12032 + Neutrals + 3 Case-Farbwelten), Typo-Skala (Fraunces-Rollen 135/89/74/47/41/27/23/20/16 aus der Messung), Buttons (primaer/sekundaer/Ghost + Hover mit Master-Easing), Formularfelder, Links, Abstaende-System (all-turtles-Luft), Motion-Regeln (EIN Easing cubic-bezier(.6,0,.4,1), Dauer-Raster), Grid/Breakpoints. Als MD + lebende /styleguide-Seite.
- [ ] Positionierung/Messaging final in brand/ (Klammer "Die Website, die selbst arbeitet", 5 Problem-Statements, Du-Anrede, Claim-Varianten fuer Hero).
- [ ] Wortmarken-Spezifikation final (Fraunces-Schnitt, Abstaende, Clip-Koordinaten der 14+ Teile — existiert in bauplan-v10/PIECES, formalisieren).

**Engine/Interaktion (P1):**
- [ ] Keyframe-Choreografie-Player (scroll-scrub, Interpolator, Master-Easing) in Next.js.
- [ ] Hero-Choreo (Kontraktion/Burst nach §0-Grammatik) + 5 Motiv-Formationen fuer die Leistungs-Szenen + Footer-Reassembly.
- [ ] Mobile-Fallback + prefers-reduced-motion (Standbilder), Performance-Budget LCP<2,5s.

**Homepage (P2):** Bau exakt nach docs/HOMEPAGE_BLAUPAUSE_ALLTURTLES.md; Kern-Copy; 3 Case-Panels; Firmen-Namensliste; CTA + Formular.
**Kugel-Galerie (P2b):** Three.js+GSAP nach phantom.land-Spec; Kacheln = Site-Screenshots (wiederholen erlaubt); crawlbare HTML-Liste; 2D-Fallback.
**Unterseiten (P3):** /referenzen + 10 Case-Detailseiten, /leistungen + 4 Unterseiten (webdesign, seo, ki-sichtbarkeit, dashboard), /preise (3 Pakete + Abo + KMU.DIGITAL), /ueber-uns (Bio, B2B-Vergangenheit), /faq, /kontakt (Formular+Telefon), Impressum/Datenschutz-Ueberarbeitung.
**Texte:** Homepage + Statements = Fable (tonkritisch). Unterseiten/FAQ/Regionalseiten = Opus/Sonnet nach Copy-Leitplanken (Du, keine KI-Tells, echte Umlaute, keine Emojis), Fable reviewt jede Seite.
**SEO/Regional (P4):** SEO/GEO/LLM-Playbook (Dokument), 9 Bundesland- + 10-15 Stadt-Landingpages, Schema-Vollausbau, llms.txt, interne Verlinkung, 301-Mapping, Alt-Bugs-Fix (Canonical, 404, Fake-Rating raus), Artikel-Engine-Voice auf Du angleichen, 9 Pillar-Artikel.
**Assets:** Screenshots/Scroll-Videos aller 10 Referenz-Sites (automatisiert), OG-Images, Favicon-Refresh.
**Tomson liefert:** Bio+Foto, Google-Business-Link, belegbare Kundenzahl, spaeter echte Case-Zahlen (bis dahin markierte PLATZHALTER).

## Zuteilung nach Modell

**FABLE 5 (Design-kritisch + Kontrolle — macht selbst):**
1. Design-System/Guide + /styleguide-Seite
2. Morph-Engine-Kern + alle Choreografien/Motive
3. Homepage-Bau (Layout, Hero, Case-Panels-Gerüst) + Kern-Copy (Claim, 5 Statements, CTA)
4. Kugel-Galerie DESIGN-Abnahme (Bau durch Opus, Feel-Tuning Fable)
5. SEO/GEO/LLM-Playbook (Strategie)
6. "Die Red Rabbit Methode": eigenes markenfaehiges Framework-Wort entwickeln (2-3 Vorschlaege aus cult-brand-playbook + USP, VISUELL zur Tomson-Entscheidung; LLM-Zitierbarkeit als Ziel). Danach eigenes Grill-Thema "Inhalte" (Copy-/Artikel-/Regional-Themen) mit Vorschlaegen.
7. JEDES Review gegen Akzeptanzkriterien + alle Gates mit Tomson

**OPUS 4.8 (komplexe Mechanik nach praeziser Spec):**
1. Kugel-Galerie-Implementierung (Three.js+GSAP, Drag-Easing, Karten-Tap-Transition, 2D-Fallback) — Spec liefert Fable
2. Unterseiten-Templates + Case-Detailseiten-Template (nach Design-System)
3. Formular-Flow /kontakt (mehrstufig, Validierung, Mail-Anbindung)
4. Schema-/SEO-Implementierung (JSON-LD LocalBusiness/Service/FAQ/Person, llms.txt, Sitemap, 301-Middleware)
5. Migration bestehender Inhalte (/artikel bleibt) auf neues Layout

**SONNET (Massenarbeit nach Muster, guenstig):**
1. 19-24 Regionalseiten aus Template + Regionaldaten (je eigene Substanz! Checkliste pro Seite)
2. FAQ-Seite ausformulieren (aus Fable-Leitplanken)
3. Meta-Descriptions, Alt-Texte, OG-Texte fuer alle Seiten
4. Redirect-Tabelle alt->neu vollstaendig
5. 9 Pillar-Artikel-Entwuerfe (Fable reviewt Ton)
6. Referenz-Screenshots/Assets-Automatisierung (Skript laeuft, Sonnet sortiert/benennt)

**Akzeptanzkriterien (gelten fuer JEDEN Task):** Design-System eingehalten (Tokens, Easing, Abstaende); Du-Anrede, echte Umlaute, keine Emojis, keine KI-Tells; keine erfundenen Fakten (PLATZHALTER-Markierung wo Beleg fehlt); mobil sauber (kein Overflow, LCP-Budget); Lint+Build gruen; Graphify-Query vor Codeaenderung; jede Seite crawlbar (SSR), Schema valide.

## Ablauf pro Arbeitspaket
1. Fable schreibt Task-Prompt (Spec + Akzeptanzkriterien + Dateipfade) und spawnt Agent (model-Override).
2. Agent arbeitet auf `relaunch` (bei Parallelarbeit: worktree-Isolation), meldet Ergebnis.
3. Fable reviewt (Code + Browser-Screenshot + Kriterien-Check), laesst nachbessern oder merged.
4. Pro Phase: Vercel-Preview -> Tomson-Gate.

## Reihenfolge (naechste Sessions)
S1: P0 komplett (Design-System, Messaging, Wortmarke) + P1-Engine-Start -> Gate 1.
S2: P1 fertig + P2-Homepage -> Gate 2. S3: P2b Kugel + P3-Start. S4: P3 fertig -> Gate 3. S5: P4 -> Gate 4 = Launch-Freigabe. S6: P5 Launch.
