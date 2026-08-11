# Naechste Session — Impeccable-Design-Review ueber den ganzen Relaunch (2026-08-11)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, docs/DESIGN_STANDARD.md, brand/README.md, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/SQL/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft. Fuer lange autonome Laeufe den `autonomous-runner` Agent verwenden.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung).
- Laufend testen + `review-it` bei groesseren Schritten. Nichts als "fertig" melden ohne verifiziertes Ergebnis.
- VOR JEDEM PUSH: `npx tsc --noEmit` UND `npx eslint <geaenderte files>`. Interne Links IMMER `next/Link`.
- NIE `git add .`/`-u` — nur eigene Dateien mit explizitem Pfad stagen (parallele Sessions + Fremd-WIP im Tree).
- MCP-Chrome: KEIN WebGL (Talos = Poster) und resize aendert den Viewport NICHT -> Mobile + 3D nimmt NUR Thomas am Geraet ab. Visuelle Fixes erst "fertig" nach Thomas-Bestaetigung auf SEINEM Screen.
- Kleinschritte, Muster matchen statt erfinden ([[feedback_kleinschritte_muster_matchen_statt_erfinden]]); Demo vor Umbau; NICHTS pauschal redesignen — Impeccable liefert BEFUNDE, umgebaut wird nur, was Thomas freigibt.

## Auftrag (Thomas 11.08.)
Mit dem Design-Skill **impeccable** (`~/.claude/skills/impeccable/`) noch einmal ALLES durchgehen
(Relaunch-Seiten auf v2). Thomas will dabei lernen, den Skill zu BEDIENEN — also jeden Schritt
kurz erklaeren (welches Kommando, warum, was es tut), bevor er laeuft.

## So bedient man Impeccable (fuer Thomas mitzuerklaeren)
1. Skill laden: Skill-Tool mit `impeccable` + Kommando als Argument, z.B. `/impeccable critique <URL/Seite>`.
2. Setup laeuft automatisch: `context.mjs` prueft PRODUCT.md. STAND 11.08.: **NO_PRODUCT_MD** ->
   ERSTER SCHRITT ist `/impeccable init` (legt PRODUCT.md + DESIGN.md an; dabei docs/DESIGN_STANDARD.md,
   brand/ und die bestehenden Token/Styles als Quelle nutzen, NICHTS neu erfinden — Identitaet ist gesetzt).
   Ausserdem meldet der Skill ein Update v3.7.1 -> v3.9.1 (`npx impeccable update`, wirkt ab Folge-Session) —
   Thomas fragen, ob VOR dem Review updaten.
3. Danach die sinnvollen Kommandos in dieser Reihenfolge (Empfehlung):
   - `/impeccable document` — DESIGN.md aus dem bestehenden Code erzeugen (Ist-System festhalten).
   - `/impeccable critique <seite>` — UX-Review mit Scoring, pro Kernseite (Home, /preise, /leistungen,
     /leistungen/website, 1-2 Bundesland-Seiten stellvertretend, /kontakt).
   - `/impeccable audit <seite>` — technische Checks (A11y, Kontrast, Responsive, Performance).
   - `/impeccable polish <seite>` — liest den critique-Befund als Backlog und arbeitet ihn ab (NUR nach Thomas-Freigabe der Befunde!).
   - Optional gezielt: `typeset` (Typo), `layout` (Abstaende), `adapt` (Geraete), `clarify` (UX-Texte).
4. Befunde IMMER erst als Liste an Thomas (visuell belegt, Screenshots), er entscheidet was umgesetzt wird.

## Modell-Empfehlung (Thomas' Frage, ehrlich)
- **Hauptsession: Opus 4.8 reicht gut** fuer Critique/Polish mit Geschmack. Fable ist die staerkste Option
  (feinere Design-Urteile, teurer); Unterschied bei diesem Task moderat, weil docs/DESIGN_STANDARD.md +
  brand/ die Richtung schon festlegen und Impeccable strukturiert fuehrt.
- **Sonnet reicht NICHT als Hauptmodell** fuer die Geschmacks-/Critique-Passes, aber sehr wohl fuer
  mechanische Sub-Agenten (Audit-Laeufe, Kontrast-/Responsive-Checks, Screenshot-Sammeln) — so aufteilen:
  Opus 4.8 (oder Fable) dirigiert, Sonnet-Subagenten sammeln Befunde.

## Stand 11.08. (Kontext)
- BUNDESLAND-ROLLOUT FERTIG: alle 8 Region-Seiten live auf v2 (Commit 60f09fc + Talos-Mobile-Fix 78f6b62,
  anchor 0.82->0.72 nach Thomas-Screenshot rechts abgeschnitten). Details/QA: NEXT_SESSION_bundesland-landingpages.md.
- OFFEN aus dem Rollout: Thomas-Geraete-Abnahme Talos-Mobile-Position 0.72 (Ein-Zahl-Fix falls noetig);
  echte Kunden-Anker Ktn/Sbg/Tirol/Vlbg/Bgld vor Go-Live; KundenGrid behalten/raus; Go-Live-Landmine noindex/Canonical.
- Review-Ziel = v2.redrabbit.media (Middleware liefert /relaunch-preview als Wurzel aus).
- Kanonisch fuer Design-Fragen: docs/DESIGN_STANDARD.md; Buttons NUR rr-btn-sweep/rr-btn-outline;
  styled-jsx meiden; keine Emojis; Preise 1.250/2.850/ab 4.900.

## Blocker / Risiken
- Impeccable-init darf die bestehende Marken-Identitaet nicht ueberschreiben (Skill will bei Neu-Projekten
  Paletten vorschlagen — wir HABEN eine, init nur dokumentierend nutzen).
- Parallel-Session arbeitet an /preise (Fremd-WIP: SiteClosing.tsx, faq/, preise-preview/ u.a. — nicht anfassen,
  vor Arbeit git fetch + git log).

## STAND 12.08. — TEIL-AUSGEFUEHRT (Commit 128d837, deployt+verifiziert live auf v2)
Impeccable bedient: init (PRODUCT.md geschrieben; DESIGN.md des Users unangetastet gelassen — er hatte
schon eine 587-Zeilen-Version), critique (7 Seiten) + audit (10 Seiten) komplett gelaufen (Detektor + echte
WCAG-Kontrast-Messung). Ergebnis: Seiten sind stark (Slop-Test bestanden, Detektor sauber, Ø ~14/20).
UMGESETZT + gepusht + auf v2 live (128d837, rein additiv/optisch minimal):
- Roter Kleintext-Kontrast siteweit: `#f12032` faellt auf hell unter AA (3.8/4.2:1). Basis der geteilten
  Klassen `.rr-eyebrow-theme` + `.wd-eyebrow` + `.rr-company-name` -> `--rr-red-deep` #c81222 (5.3-5.9:1);
  Demo-Sektions-Labels (.b/p/f-label) + Tipps-Kategorie + `.fmx__tag` ebenso. DUNKELFAELLE (Beweis-
  Betonwoerter, Talos-Invers-Modal, WertAnker-Eyebrow) -> `#f77480`/`--ondark` (nicht red-deep!). WICHTIG-
  LESSON: `.wd-eyebrow`-Basis aendern kaskadiert auf dunkle Sektionen -> jede wd-eyebrow auf navy braucht
  `--ondark` (nur WertAnker fehlte; CasePanels macht onDark automatisch, SiteClosing/HomeClosing haben keine).
- Platzhalter blass->lesbar (~2.1->4.7:1): styleguide `.rr-field`, Kontaktformular, Lead-Popup.
- Hero-Subtitle `#8a8d94`->`#6b6e76` (3.0->4.6:1).
- Kontaktformular-A11y: aria-required, `:focus-visible`-Ring, aria-invalid + Fokus 1. Fehlerfeld, Erfolgs-Fokus.
- Home: doppelter "DER BEWEIS"-Eyebrow -> "DIE ZAHLEN".
OFFEN (aus dem Audit, noch NICHT gemacht — sauber pro Untergrund angehen):
- Weiss-auf-Rot Button-Labels (`.rr-btn-sweep` hover, `.rrtn-ebtn`, `.rpm__tag`) ~4.2:1: Button-Grund
  abdunkeln = groessere optische Entscheidung, mit Thomas klaeren.
- Footer-Copyright `.rr-foot-copy` rgba(255,255,255,.45) = 4.25:1 -> alpha auf .55 (Ein-Zahl-Fix, FooterReassembly).
- Sterne-Symbole ★ (~1.85:1) sind aria-hidden/dekorativ — optional.
- Performance: mehrere rAF-Loops ohne IntersectionObserver-Gate (regionen/leistungen/website/talos) — Akku/Scroll.
- /leistungen/website ~4400vh gepinnter Scroll — Thomas-Geraete-Urteil.
- /faq: 2 von 14 FAQ-Antworten weichen sichtbarer Text vs. JSON-LD ab (Rich-Result-Risiko).
- RisikoBand (/preise) Kernaussage `<p>`->`<h2>` — Parallel-Session-Gebiet, koordinieren.
- Menue-Trigger `outline:none` ohne Fokus-Ersatz (RelaunchMenu) — a11y.
- Theming-Cleanup: hartcodierte Hex / altes `rgba(28,40,55,x)` statt Token (breit, niedrig).
LIVE-MODUS-BLOCKER dokumentiert: strenge CSP (next.config.ts:226) blockt das Impeccable-Overlay (Script/
connect nur 'self'); + Inject muesste in layout.tsx (Parallel-WIP). Live-Overlay erst wenn Branch ruhig.
