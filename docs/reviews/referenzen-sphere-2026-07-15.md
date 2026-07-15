# Review — Referenzen Sphaeren-Galerie (phantom.land-Nachbau), 15.07.2026

**Scope**: uncommitted — components/relaunch/SphereGallery.tsx (Neufassung), lib/relaunch/projects.ts, app/relaunch-preview/referenzen/page.tsx, app/referenzen-preview/page.tsx
**Reviewer**: review-it, 3 parallele Agenten (Logic / Security / Simplify, Sonnet)
**Stack**: ui (three.js 0.185 WebGL, Next 15 App Router) · **Verdict**: CONDITIONAL -> nach Fixes GO

## Findings — Accepted + gefixt (5)
1. MAJOR (Logic) SphereGallery rebuildProject: Hover-Kachel fiel beim Nachladen des Screenshots auf Normal-Textur zurueck. Fix: `map = i === hovered ? ht : nt`.
2. MAJOR (Simplify) projects.ts: tote Exporte TILE_COLORS/TILES/TILE_COUNT/Tile (P2b-Vorstufe) entfernt.
3. MAJOR (Simplify) app/referenzen-preview: alte Preview-Route zeigte abweichende Projektliste (BASE_PROJECTS, 10 Eintraege teils ohne Link) neben derselben Kugel. Fix: Route redirectet auf /relaunch-preview/referenzen.
4. MINOR (Simplify) BG_DARK #0d0e12 != --rr-dark. Fix: auf #17181d gezogen + Token-Kommentar (Literal noetig, weil Canvas-Texturen den Wert vor CSS brauchen).
5. COSMETIC (Security) Dialog ohne Fokus-Management. Fix: autoFocus auf Schliessen-Button; Escape-Handler existierte schon.

## Findings — Deferred (2)
- COSMETIC (Simplify): Tuning-Werte (COLS, FOV, Drag-k, Klick-Toleranz, Dimm-0.22) nicht als Konstanten eleviert — beim naechsten Feintuning mitziehen.
- COSMETIC (Security): echte Fokus-Falle (inert auf Hintergrund) — Preview-Seite, nicht blockierend.

## Kein Handlungsbedarf
Security sonst sauber (kein XSS-Vektor, alle target=_blank mit noopener noreferrer, keine Drittserver-Ressourcen, noindex korrekt). Logic bestaetigt: StrictMode-Cleanup, rAF-Pause/Resume, Fokus-Zustandsmaschine, ndc-Init korrekt.

## Empirische Bugs aus Browser-QA (vor Review gefixt)
- Zeitbasierte Daempfung statt Per-Frame-Lerp: Chrome drosselt rAF in inaktiven Tabs/verdeckten Fenstern massiv — Whiteout/Ruecktransition kroch minutenlang. Alle Lerps auf `1 - exp(-k*dt)` umgestellt (dt-Clamp 0.1s).
- Geister-Klick: pointerup auf Canvas ohne vorheriges pointerdown auf dem Canvas oeffnete ein Panel (moved-Zaehler stale). Fix: downOnCanvas-Flag.
- Fokus-Framing: lookTarget.y -= 2.6, damit die Kachel oberhalb des Info-Panels sitzt.
