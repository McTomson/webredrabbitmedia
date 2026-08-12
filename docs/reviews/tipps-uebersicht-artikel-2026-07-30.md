# Review — Tipps-Uebersicht (Filter/Empty-State/SEO) + Artikel-Template-Umbau

**Date**: 2026-07-30
**Reviewer**: review-it skill, 3 parallel agents (Logic / Security / Simplify)
**Scope**: Uncommitted working tree — components/relaunch/TippsTunnel.tsx,
app/relaunch-preview/tipps/page.tsx, app/relaunch-preview/tipps/[slug]/page.tsx,
components/relaunch/TippsArticleRail.tsx (neu), components/subpages/tipps-preview.css
(+ Folge-Fixes: tipps-hero-demo/demo.engine.jstext, TippsHeroClient.tsx)
**Stack**: ui (Next.js App Router, Client-Komponenten, CSS)
**Domain**: seo/llm (JSON-LD, E-E-A-T), scroll-choreografie (Lenis)
**Verdict**: GO (nach Anwendung aller Fixes; 0 CRITICAL, 1 MAJOR gefixt)

## Findings — Accepted + gefixt (5)
- MAJOR (Logic, TippsTunnel.tsx): Suchfeld feuerte pro TASTENDRUCK eine eigene
  0.7s-Lenis-Scrollfahrt (Effect-Dep auf query ohne Debounce) — Seite kaempfte
  beim Tippen gegen sich selbst. FIX: scrollToFocus als useCallback, Kategorie-
  Klick scrollt sofort, Sucheingabe debounced (450ms). Empirisch verifiziert
  (Playwright: kein Scroll waehrend Tippen, ein Scroll nach Ruhe).
- MINOR (Simplify, tipps-hero-demo/demo.engine.jstext): rrt-Index-Reveal-Block
  war nach dem CSS-Cleanup garantierter No-op (kein .rrt auf der Uebersicht).
  FIX: Block entfernt + Doku-Kommentar in TippsHeroClient.tsx korrigiert.
  Hero-Engine danach verifiziert lebendig (__diag vorhanden).
- MINOR (Simplify, tipps/page.tsx): toter Import von tipps-preview.css auf der
  Uebersicht. FIX: entfernt (rrt-* lebt nur noch auf [slug]).
- COSMETIC (Simplify, [slug]/page.tsx): Wortzaehlung doppelt. FIX: wordCount
  einmal gehoisted (readingTime + Schema nutzen dieselbe Zahl).
- COPY (Simplify-Randnotiz): authorBio enthielt ASCII-Umlaute ("Gruender",
  "dafuer") in user-sichtbarem Text + Dreierfigur. FIX: echte Umlaute, Liste
  auf zwei Elemente.

## Findings — Deferred (3, dokumentierte Gruende)
- MINOR (Security): JSON-LD via JSON.stringify ohne <-Escaping — EXAKT
  dasselbe Muster wie die Live-Seite app/tipps/[slug]; Quelle repo-kontrolliert,
  Build-Zeit. Wenn haerten, dann als eigener Sweep ueber ALLE JSON-LD-Stellen
  der Site (auch Live), nicht als Einzel-Patch hier.
- MINOR (Security): sources-URLs ungefiltert als href (javascript:-Hardening
  via https-Guard moeglich) — bestehendes Live-Muster, repo-kontrolliert.
- MINOR (Simplify): tocEntries-Filter doppelt (Server-Template fuer Mobile-TOC,
  Rail fuer Desktop) — bewusst: die Rail braucht ALLE Headings fuer den
  Scrollspy (auch h3), Konsolidierung wuerde Props aufblasen. Vertretbar.
- COSMETIC (Simplify): Autor-Bios inline statt in AUTHORS (lib/config) —
  Drift-Risiko zur Live-Bio beim Go-Live; beim Go-Live-Sweep zentralisieren.

## Explizit geprueft, kein Finding
- Draft-Leakage in generateStaticParams (getAllPosts filtert intern), 404 fuer
  Draft-Slugs korrekt. AUTHORS-Lookup mit hartem Fallback (L-preise-01 ok).
- headingId identisch mit extractHeadings (TOC/Scrollspy-ids matchen, empirisch
  6/6 im DOM verifiziert). WeakMap-Cache fixt den "Filter tut nichts"-Bug korrekt.
- __rrLenis nur gelesen, nie geschrieben (L-leistungen-02 ok). Telefon nur
  hinter tel:-Link, target=_blank ueberall mit noopener noreferrer.
- CSS bidirektional sauber: 46 Klassen, keine Waise in beiden Richtungen
  (grep-verifiziert durch Simplify-Agent).

## Kontext-Entscheidungen dieser Runde (nicht Review-getrieben)
- Artikel-Seiten BEWUSST ohne Pflicht-Stopps im Lesetext (DESIGN_STANDARD:
  lange Absaetze nie im Snap fangen); einziges Snap-Ziel = Footer-Kante.
- Interne MDX-Links /tipps/<slug> werden NUR im Preview-Template auf
  /relaunch-preview/tipps/ umgeschrieben (a-Komponente in compileMDX);
  beim Go-Live faellt das Mapping weg (MDX-Quellen bleiben unangetastet).
- Schema-URLs (BASE) tragen das /relaunch-preview-Prefix; beim Go-Live
  Prefix entfernen (Kommentar an beiden Stellen).
- Rail-Copy ohne Preiszahlen (Relaunch-Preise 950/2900/ab 4900 sind NICHT
  789/790-kompatibel; Artikel-INHALTE (MDX) nennen weiter alte Preise —
  das ist Content-Thema, nicht Template-Thema, separat mit Thomas klaeren).
