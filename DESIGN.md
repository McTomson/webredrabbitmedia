# DESIGN.md — web.redrabbit.media RELAUNCH Design System

Reference doc for building new pages in the `relaunch` branch consistently. All values below are
quoted verbatim from source files — do not eyeball or re-derive them. When a value is needed that
is not covered here, read the source file, don't guess (see root `CLAUDE.md` / `~/CLAUDE.md`:
"Nie raten — immer verifizieren").

Sources: `app/styleguide/styleguide.css`, `lib/relaunch/fonts.ts`, `brand/README.md`,
`brand/positioning.md`, `brand/decisions-log.md`, `components/relaunch/*`, `lib/relaunch/morph/*`.

---

## 1. Brand foundation

- **Positioning** (`brand/positioning.md`): Red Rabbit Media is the **"faire Anti-Agentur für den
  österreichischen Mittelstand"** — hochwertige, schnelle, DSGVO-konforme Websites ohne
  Agentur-Bullshit, ohne Risiko für den Kunden. Marken-Richtung = Option 3 "fair + selektiv":
  Kern bleibt zugänglich/risikofrei, aufgeladen mit Menschlichkeit, Haltung/Feindbild und sanfter
  Selektivität (kein Fake-Scarcity, keine echte Exklusivität).
- **Zielgruppe:** österreichischer Mittelstand/KMU — Handwerk, Gastronomie, Dienstleister,
  Ärzte/Kanzleien, regional. Konservativ, preisbewusst, misstrauisch gegen "abgehoben/teuer" →
  Haltung ja, Arroganz nein.
- **DU-Anrede** (`brand/decisions-log.md`, 2026-07-04): Die gesamte Website duzt, direkte
  Ansprache. Gilt für alle Seiten, Regionalseiten, FAQ, Formulare. Ersetzt das frühere Sie.
- **House rules for all UI copy** (verbindlich, gilt für jeden neuen Text/jede Komponente):
  - **Keine Emojis** — weder Code, UI noch Konversation.
  - **Echte Umlaute** ä ö ü ß in jedem User-facing Text. Niemals ae/oe/ue-Ersatzschreibung.
  - **Kein Gedankenstrich "—"/"–" in UI-Copy.** Stattdessen Mittelpunkt "·" oder Komma verwenden
    (Quelle: `content-engine/voice/house.md` — "sofortiger KI-Verdacht, NIE"). Beispiel im Code:
    `RelaunchMenu.tsx` nutzt `"Red Rabbit · Navigation"`.
- **Ton:** knallhart, ehrlich, unabhängig; nicht "lieb und nett"; darf Kante/Feindbild haben, aber
  kein Pathos, keine Ausrufezeichen-Hype in sachlichen Teilen.

## 2. Color tokens

All from `.rr` scope in `app/styleguide/styleguide.css` (verbatim):

```css
--rr-red: #f12032;          /* Markenrot, einziger Akzent */
--rr-red-deep: #c81222;     /* Hover/gedrückt */
--rr-ink: #23262e;          /* Text, warm-dunkles Schiefer */
--rr-ink-soft: #5a5e68;     /* Sekundärtext */
--rr-paper: #ffffff;        /* Grund */
--rr-surface: #f4f4f2;      /* zweite Fläche */
--rr-dark: #17181d;         /* dunkle Sektion */
--rr-line: #e4e4e0;         /* Hairlines */

/* Case-Farbwelten (1:1 all-turtles, live gemessen 05.07.) */
--rr-world-1-bg: #1d8c98;      /* at "airtime"-Türkis */
--rr-world-1-accent: #fcfbc9;  /* cream Eyebrow */
--rr-world-2-bg: #2d2d2d;      /* at "carrot-dark" Anthrazit */
--rr-world-2-accent: #f35b09;  /* Orange Eyebrow */
--rr-world-3-bg: #0a8aba;      /* at "sora"-Blau */
--rr-world-3-accent: #f2dc71;  /* Gelb Eyebrow */

/* Semantische Farben (Formular-/Statuszustaende; Tomson 2026-07-06) */
--rr-success: #17915b; --rr-success-ink: #146e46; --rr-success-bg: #e8f5ee;
--rr-warning: #c8890a; --rr-warning-ink: #8a5f05; --rr-warning-bg: #fbf3e2;
--rr-error: var(--rr-red); --rr-error-ink: #b1101f; --rr-error-bg: #fdeaec;
--rr-info: var(--rr-navy); --rr-info-bg: #edf0f3;
```

**Semantic colors (locked 2026-07-06):** brand **red doubles as the error/danger signal** (red
already means "attention", keeps the palette minimal and red special). Error text uses `--rr-error-ink`
for AA contrast on the light `--rr-error-bg`, the accent bar/border/dot uses the brand red itself.
Success = a desaturated green, warning = amber, info/hint = navy, each with its own light tint bg and
an AA-contrast ink. The three non-red hues are deliberately quiet so **only the brand red truly pops**.
`ink` accents/dots use the base token, text uses the `-ink` variant. Dark-section variants of the light
`-bg` tints are TBD (site is predominantly light; add when a dark form/banner surface actually appears).

Navy `#1C2837` is used as a hardcoded literal (not yet a `--rr-*` token) in `FooterReassembly.tsx`
(`const NAVY = "#1C2837"`, used for the footer background) and in `BrandOpening.tsx` (statement
text color `#1C2837`). It is also the exact `.rrmenu-overlay` background in `RelaunchMenu.tsx`.

**Hard rules:**
- The rabbit logo (`RabbitMark`) is **always red** (`#F12032` default `color` prop) — never blue,
  never navy. Navy is not a logo color.
- The navy accent `#1C2837` appears as **exactly ONE piece per morph scene**, deterministically
  chosen as the most elongated (highest aspect-ratio) piece of that scene's formation
  (`HomeMorph.tsx`: `navyIdxByScene` picks `comp.pieces.reduce(...)` by `asp()`). Do not add a
  second navy piece or make it a general accent color — it is a single deliberate color pop per
  scene (Tomson decision, decisions-log 2026-07-05 late night: "genau EIN längliches Teil der
  Zahnrad-Formation in Dunkelblau #1C2837").

## 3. Typography

### Role → font → CSS variable (`lib/relaunch/fonts.ts`)

| Role | Font | next/font variable | Notes |
|---|---|---|---|
| Display / Headlines / wordmark ("red rabbit") | **DM Sans** (OFL) | `--font-dmsans` (to add to `fonts.ts`) | **Bold (700).** Chosen 2026-07-06 to replace Fraunces. The real brand logo wordmark is a bold geometric sans (side-by-side, black, mark red — see `docs/handoffs/assets/real-logo-redrabbitmedia.png`), and DM Sans is the closest free match that ALSO works as a workhorse headline font across the whole site (Variante B: sans carries wordmark + all headings). Montserrat was closest to the pure logo look but too wide/tiring for running headlines. Full wordmark spec in §3.1. |
| Statements / claims | **Crimson Pro** (OFL) | `--font-crimson` | w500. Unchanged. Chosen 2026-07-05 as the free look-alike for all-turtles' commercial Heldane (both Kis-Antiqua descendants). Kept deliberately: geometric sans headings + humanist serif statements is an intentional, high-end pairing. |
| UI / eyebrows / nav / meta / forms | **Instrument Sans** (OFL) | `--font-grotesk` | Unchanged. |

> **Fraunces is retired from the display role** (decision 2026-07-06, Tomson). It was the wrong genre (Didone serif) for a brand whose real logo wordmark is a geometric sans. The actual font swap in the hero morph is **pending and owned by the Hero session** — the `pieces.ts` clip-rects are Fraunces-glyph-specific and must be re-tuned for DM Sans, and `buildWordLayout()` must change from stacked-two-line to single-line (§3.1). Do not flip `--rr-font-display` to DM Sans until that swap lands, or the morph breaks. See `docs/handoffs/HERO_font-swap_dm-sans.md`.

Every relaunch page imports these three and applies `.variable` classes on the root wrapper (see
§4 and §7). `styleguide.css` maps the roles onto its own aliases:

```css
--rr-font-display: var(--font-fraunces), Georgia, serif;
--rr-font-serif: var(--font-crimson), Georgia, serif;   /* Statements/Claims */
--rr-font-ui: var(--font-grotesk), ui-sans-serif, system-ui, sans-serif;
```

### 3.1 Wortmarke "red rabbit" — locked spec (Tomson decisions 2026-07-06)

The wordmark and the rabbit mark are **two independent elements** — never lock them together
like the `.ai` corporate lockup (that layout is only a brand-guideline example).

- **Font:** DM Sans, **Bold (700)**, both words same weight (no thin/bold contrast — a light
  "rabbit" reads weak under the heavy red mark).
- **Arrangement:** "red rabbit" **side-by-side, one line** (NOT stacked two-line). This matches the
  real logo and reads as one coherent unit ("stimmiger", Tomson). Keep a **clear word space**
  between "red" and "rabbit" (~`0.9em` at display size — smaller reads as one word "redrabbit",
  which Tomson explicitly rejected). "media" is **dropped** for web use.
- **Color:** the wordmark is **all one red** (`--rr-red` #f12032). **No single-letter accent color
  inside the wordmark** — rejected 2026-07-06 as gimmicky ("wirkt wie Kinderschokolade"). The one
  deliberate navy (`#1C2837`) piece belongs ONLY to the morph **scene formations** (§2 hard rule),
  never to the wordmark itself.
- **Mark:** the rabbit mark (`RabbitMark`) is always red and sits **above** the wordmark in the
  hero (independent element), not to its left.
- **Hero-swap TODO (Hero session):** add DM Sans to `fonts.ts`; re-tune `pieces.ts` clip-rects to
  DM Sans glyph shapes; change `buildWordLayout()` from stacked two-line to a single line; keep the
  fracture pieces all red; set the `.rr-display-*` roles to DM Sans **Bold 700** (was `font-weight:
  560`; Bold-over-Medium confirmed 2026-07-06). Visual reference of the locked result:
  `docs/handoffs/HERO_font-swap_dm-sans.md`.

### Type scale (clamps, `styleguide.css`)

```css
--rr-fs-display-1: clamp(58px, 9.4vw, 135px);   /* Case-Headline */
--rr-fs-display-2: clamp(44px, 6.2vw, 89px);    /* Abschluss-CTA */
--rr-fs-statement: clamp(34px, 4.46vw, 92px);   /* 5-Punkte-Statements, at-Messung 05.07 */
--rr-fs-claim: clamp(28px, 3.3vw, 47px);        /* Hero-Claim */
--rr-fs-sub: clamp(22px, 2.85vw, 41px);         /* Case-Subline */
--rr-fs-eyebrow-lg: clamp(15px, 1.69vw, 33px);  /* große Eyebrow, at-Messung 05.07 */
--rr-fs-body-lg: 23px;
--rr-fs-ui: 20px;
--rr-fs-meta: 16px;
--rr-fs-nav: 15px;
```

Type roles (`.rr-display-1/2`, `.rr-statement`, `.rr-claim`, `.rr-sub`) share:
`font-family: var(--rr-font-display); font-weight: 560; letter-spacing: -0.018em; line-height: 1.02;
font-variation-settings: "opsz" 144, "SOFT" 0, "WONK" 0; text-wrap: balance;` — then
`.rr-statement`/`.rr-claim` override to `font-family: var(--rr-font-serif); font-weight: 500;
font-variation-settings: normal;` with their own line-height (`1.11` / `1.15`) and
`letter-spacing: -0.01em`.

`.rr-eyebrow`: 13px, weight 650, `letter-spacing: 0.18em`, uppercase, color `var(--rr-red)`.
`.rr-eyebrow-lg`: `var(--rr-fs-eyebrow-lg)`, weight 460, `letter-spacing: 0.04em`, uppercase.
`.rr-body-lg`: 23px/1.5. `.rr-body`: 17px/1.55. `.rr-meta`: `var(--rr-fs-meta)` (16px), color
`var(--rr-ink-soft)`.

Elsewhere: `RelaunchMenu.tsx` nav links use `var(--rr-font-display)`, weight 560,
`clamp(40px, 7vw, 76px)`. `FooterReassembly.tsx` brand name uses `var(--rr-font-display)`, 24px,
weight 560. `BrandOpening.tsx` statement uses `var(--rr-font-serif)`, weight 500,
`clamp(28px, 4vw, 56px)`.

## 4. Layout & spacing

```css
--rr-section-y: clamp(96px, 12vw, 180px);  /* vertical section rhythm */
--rr-gutter: clamp(20px, 4.6vw, 72px);     /* horizontal page gutter */
--rr-max: 1680px;                          /* content max-width */
--rr-radius: 12px;
--rr-radius-lg: 22px;
```

Layout primitives:
```css
.rr .rr-section { padding: var(--rr-section-y) var(--rr-gutter); }
.rr .rr-wrap { max-width: var(--rr-max); margin: 0 auto; }
.rr .rr-hairline { border: 0; border-top: 1px solid var(--rr-line); margin: 0; }
```

**Every relaunch page/section must be wrapped in the `.rr` scope** (all tokens and type roles are
scoped under `.rr` — nothing works outside it, and it deliberately doesn't touch legacy pages).
See §7 for the exact wrapper pattern used in `app/relaunch-preview/page.tsx`.

## 5. Motion system

The signature move across the whole relaunch: **typography that fractures into pieces and
reassembles into new formations while you scroll.**

- **Single master easing**, used everywhere (buttons, links, fields, menu, morph, footer):
  `cubic-bezier(0.6, 0, 0.4, 1)` — CSS token `var(--rr-ease)`, JS implementation
  `masterEase(x)` in `lib/relaunch/morph/grammar.ts` (analytic Newton-solved evaluation of the
  same curve, used to interpolate between keyframes in `sample()`). Durations:
  `--rr-t-fast: 200ms`, `--rr-t-med: 420ms`, `--rr-t-slow: 700ms`.
- **Scroll-driven, not GSAP/ScrollTrigger:** components read scroll progress themselves via
  `requestAnimationFrame` + `element.getBoundingClientRect()` against `window.innerHeight`,
  clamp to 0..1 (`clamp01`), then drive transforms directly (`BrandOpening.tsx`,
  `FooterReassembly.tsx`, `HomeMorph.tsx`, `CasePanels.tsx` all follow this exact pattern).
- **Lenis is a SINGLE instance living in `HomeMorph.tsx`** (`new Lenis({ autoRaf: false, lerp:
  0.075 })`, driven manually inside the shared rAF loop via `lenis.raf(time)`) and is exposed
  globally as `window.lenis` so other components (menus, modals) can pause/resume it. **Do not
  instantiate a second Lenis anywhere else** — `BrandOpening`/`FooterReassembly` are explicitly
  scroll-agnostic and read `getBoundingClientRect()` directly instead of creating their own
  smooth-scroll instance.
- **Scroll-locking modals/overlays MUST pause/resume `window.lenis`.** Pattern from
  `RelaunchMenu.tsx`:
  ```ts
  const lenis = (window as unknown as { lenis?: { stop?: () => void; start?: () => void } }).lenis;
  lenis?.stop?.();   // on open
  // ... cleanup on close:
  lenis?.start?.();
  ```
  Also lock body scroll (`document.body.style.overflow = "hidden"`, compensate scrollbar width via
  `paddingRight`) alongside the Lenis pause. Forgetting to resume freezes the whole page's scroll.
- **`prefers-reduced-motion: reduce` must always be honored.** Global CSS kill-switch in
  `styleguide.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .rr * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  }
  ```
  In addition, every scroll-driven component checks
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` on mount and renders a static
  fallback branch instead of running the rAF loop at all (see `reduced` state in `BrandOpening`,
  `HomeMorph`, `FooterReassembly`). New motion components must follow the same two-layer approach
  (CSS instant-transition fallback + JS branch that skips the animation loop entirely), not just
  one of the two.
- **Fracture/reassemble motif mechanics** (`lib/relaunch/morph/`):
  - `pieces.ts` — the letter system. `PIECES` is a hand-tuned map of clip-rectangles per glyph
    (`r/e/a/d/b/i/t`, the letters needed for "red rabbit"), Tomson-approved 2026-07-05
    ("Naturbruch-Regel": cuts only at the thinnest part of a letterform — hairline joints, never
    through thick strokes). `renderPiece()` clips a canvas-rendered glyph to those rects, trims to
    ink bounding box, and outputs the piece as an **inline SVG** (not canvas — vector stays crisp
    at any size/rotation, fixed 2026-07-05 after a "fuzzy/pixelated pieces" review finding).
    `buildWordLayout()` lays out "red" over "rabbit" as two lines with an intentional **line-1
    indent (~11% of line-2 width)** and tight line-height (measured from the at reference video,
    not centered) and returns each piece's home position/center/`letter` id.
  - `grammar.ts` — `masterEase`, `sample()` (keyframe interpolation), `buildHeroChoreo()` (the
    hero contraction → burst → split choreography: rest → contraction with **zero rotation**,
    burst radially outward with only ~40% of letters rotating, then per-piece split at
    `P_SPLIT = 0.52` where "further = faster" applies), `buildReassembly()` (footer: pieces rain
    in from above, straight paths, staggered starts, rotation ends exactly at 0 on arrival).
  - `stage.ts` — builds the full continuous morph timeline/pool (`buildStagePlan`,
    `sampleTimeline`) that HomeMorph consumes; combines wordmark pieces with the 5
    scene-formation piece pools (`at-shapes-comp1..5.json`, extracted all-turtles piece shapes
    used as an interim measured-geometry stand-in, per-scene camera pan/zoom).
  - This is a keyframe-choreography player, explicitly **not a physics simulation** — new motion
    should be authored the same way (measured/deliberate keyframes + the one master easing), not
    with spring/physics libraries.

## 6. Component inventory (`components/relaunch/`)

- **`RabbitMark.tsx`** — the rabbit-head logo mark as a crisp vector `<svg>` (potrace-traced from
  the source PNG, viewBox `0 0 174 267`). Props: `className`, `color` (default `#F12032`, i.e.
  brand red — never override to blue/navy), `title` (a11y label, default `"Red Rabbit"`). Use for
  any large/hero rendering of the logo (safe at any size since it's a vector path).
- **`RelaunchMenu.tsx`** — fixed hamburger trigger + **full-viewport overlay** nav. Deliberately
  **NOT a side panel** (explicit differentiation from all-turtles' pattern). Renders its own
  trigger and overlay, manages its own open state, no external deps beyond React/`next/link`.
  Overlay background is navy `#1c2837`; nav links stagger in with a rotate+translateY "settle"
  animation (`rrmenu-settle`, master easing) echoing the brand's fracture/assemble motif. Handles
  focus trap, Escape-to-close, body-scroll lock, and **stops/starts `window.lenis`** on open/close.
  Nav items and contact links are hardcoded arrays (`NAV_ITEMS`, `CONTACTS`) inside the component —
  update there when routes change.
- **`BrandOpening.tsx`** — the brand-intro section sitting above the morph stage: a centered,
  static Crimson Pro statement up top, and a giant `RabbitMark` that rises from being clipped at
  the bottom edge of the viewport up into full view as the user scrolls (200vh scroll track,
  sticky 100vh inner). Scroll-agnostic (own rAF + `getBoundingClientRect`, no Lenis instance).
- **`HomeMorph.tsx`** — the core, continuous morph stage: hero claim + wordmark contraction/burst
  → 5 scene formations with alternating text side. Owns the **single page Lenis instance**
  (exposed as `window.lenis`). Props: `claim: string` (the hero headline text, rendered in
  `.rr-claim`). Consumes `SCENE_TEXTS` from `lib/relaunch/morph/scene-content.ts` and the 5
  `at-shapes-compN.json` files. Has a full non-JS/reduced-motion fallback rendering the statements
  as plain stacked `<section className="rr-section">` blocks (SEO text is always in the DOM
  either way).
- **`CasePanels.tsx`** — 3 full-bleed horizontal-scroll "theme stage" panels (Webdesign/Handwerk,
  Dashboard/Selbstlauf, Sichtbarkeit Google & KI), each its own color world
  (`--rr-world-{1,2,3}-bg/accent`), ~380vh track per theme, sticky 100vh, linear 300vw stage
  travel (smoothing comes from the shared Lenis, no per-panel easing/snapping). Each panel has: a
  fading eyebrow+headline intro slide, a giant theme word with parallax, a themed
  animation/illustration (`PawTrail`, `DashCard`, `AnswerCard`), and a sticky closing
  statement+link. Content (`THEMES` array) is the single place to edit copy/links/colors per
  theme.
- **`FooterReassembly.tsx`** — dark (`#1C2837`) footer whose giant two-line "red / rabbit"
  wordmark visibly reassembles from scattered pieces as the footer enters the viewport (progress
  keyed to the wordmark's own bounding-rect position, not a fixed-height sticky track), using
  `buildReassembly()` from `grammar.ts`. Below it: brand blurb + `RabbitMark`, nav columns
  (Navigation / Regionen / Kontakt), legal row, copyright. `NAV`, `REGIONEN`, `LEGAL` arrays are
  the source of truth for footer links — keep in sync with `RelaunchMenu.tsx`'s `NAV_ITEMS`.
- **`HomeClosing.tsx`** — plain (non-animated) sections 6–8 of the homepage blueprint: a numbers
  statement (currently placeholder-marked, do not remove the "PLATZHALTER" note until Tomson
  supplies real figures), a 3-per-row company/B2B name grid (`.rr-companyrow`), and the giant
  closing CTA (`.rr-display-2` + primary/secondary buttons). Good reference for a plain static
  `.rr-section` page pattern with no scroll-driven motion at all.
- **`PageShell.tsx`, `MorphLab.tsx`, `SphereGallery.tsx`, `ContactFormRR.tsx`, `Faq.tsx`,
  `subpages.css`** — exist in the same folder but weren't in scope for this doc; check them
  directly before reuse (`MorphLab` is a dev/QA lab page, not production UI).

## 7. Building a new page — checklist

1. **Wrap the whole page** in the `.rr` scope plus all three font variables, exactly like
   `app/relaunch-preview/page.tsx`:
   ```tsx
   import { crimson, fraunces, grotesk } from "@/lib/relaunch/fonts";
   import "../styleguide/styleguide.css"; // adjust relative path

   export default function NewPage() {
     return (
       <div className={`rr ${fraunces.variable} ${grotesk.variable} ${crimson.variable}`}>
         {/* content */}
       </div>
     );
   }
   ```
   Nothing under `.rr` renders correctly without both the class scope and the font variable
   classes present on the same element (or an ancestor).
2. **Use tokens, not hardcoded values.** Colors → `var(--rr-*)`, spacing → `var(--rr-gutter)` /
   `var(--rr-section-y)` / `.rr-section`/`.rr-wrap`, type → the `.rr-display-1/2`, `.rr-statement`,
   `.rr-claim`, `.rr-sub`, `.rr-eyebrow(-lg)`, `.rr-body(-lg)`, `.rr-meta` classes, easing →
   `var(--rr-ease)`. The one known exception already in the codebase is the literal navy
   `#1C2837`/`#1c2837` (footer bg, menu overlay bg, brand-opening statement color) — it has no
   `--rr-*` token yet; match the existing literal rather than inventing a new hex.
3. **Link only real routes.** Cross-check against `RelaunchMenu.tsx`'s `NAV_ITEMS` and
   `FooterReassembly.tsx`'s `NAV`/`REGIONEN`/`LEGAL` — several relaunch routes are still
   `-preview` suffixed (e.g. `/relaunch-preview`, `/referenzen-preview`); don't link a page that
   doesn't exist yet.
4. **Copy must follow house rules**: DU-Anrede, real umlauts, no emojis, no em/en-dash (use "·" or
   a comma instead).
5. **A11y baseline:** visible focus states (`:focus-visible` outlines already patterned in
   `styleguide.css` buttons/fields/links — reuse, don't strip), `aria-label`/`aria-expanded`/
   `aria-controls`/`role="dialog"` + `aria-modal` for any overlay (copy `RelaunchMenu.tsx`'s
   pattern), keyboard support (Escape to close, focus trap, initial focus target via
   `data-menu-focus`-style marker), semantic headings (`h1`/`h2` in the right order per section).
6. **Any new scroll-locking UI (modal, drawer, overlay) must pause/resume `window.lenis`** (see
   §5) in addition to locking `document.body` scroll — otherwise the page freezes after it closes.
7. **Any new scroll-driven animation must**: read progress via `getBoundingClientRect()` +
   `requestAnimationFrame` (not a new Lenis instance, not GSAP/ScrollTrigger), use `masterEase`/
   `var(--rr-ease)` for all interpolation, and have a `prefers-reduced-motion` branch that renders
   a static end-state instead of animating (both the CSS `@media` kill-switch and a JS
   `matchMedia` check that skips the rAF loop).
8. **Verify before calling it done:** no horizontal scroll on mobile or desktop (check widths near
   `--rr-gutter` clamp minimums and maximums), responsive at common breakpoints (styleguide/
   components use `860px`/`900px`/`560px` as their existing breakpoints — match them rather than
   inventing new ones), and confirm the page still builds/lints (`npm run build`, `npm run lint`)
   per root `CLAUDE.md` before considering the task finished.

## 8. Buttons — aufgenommene Stile (Tomson-Entscheidung 2026-07-06)

Neben dem vollständigen Solid-System (`rr-btn--primary/secondary/tertiary/ondark`, Sektion 04) hat
Tomson zwei weitere Stile fest aufgenommen. Beide sind bewusst **eckig** (kein Pillen-Radius) und
sitzen auf `app/styleguide/styleguide.css`; live auf `/design-system` Sektion 13.

- **`rr-btn-sweep`** — Sweep-Fill (uiverse, originalgetreu übernommen, nur Farbe + Schrift auf Marke).
  Eckig, transparenter Grund, ein farbiger Balken wächst beim Hover von links (`::before`, `width`
  5px → 100%) zur Vollfläche, Schrift invertiert auf Weiß. Farbe über die CSS-Var `--c`, Modifier
  `--red` (Haupt-CTA) / `--navy`. Markup: `<a class="rr-btn-sweep rr-btn-sweep--red">Label</a>`.
- **`rr-btn-frame`** — Eck-Rahmen. Ruhe zeigt **nur die vier Eck-Winkel** (`<i class="c1..c4">`, je
  zwei Border-Kanten) plus die Schrift in `--c`, Grund bleibt die Seitenfarbe. Beim Hover wachsen die
  vier Winkel auf `50%` und **schließen den vollen Rahmen** (spiegelt das Fracture/Reassemble-Motiv
  der Seite). Modifier `--navy` / `--red` für die Farbe, zusätzlich `--fill` (statt Rahmen fährt eine
  farbige Füllung hoch, Schrift wird weiß). Alle vier Kombinationen sind aufgenommen. Markup: vier
  `<i class="c1..c4">` vor `<span class="rr-btn-frame__t">Label</span>` (Helper `FrameBtn` in
  `app/design-system/page.tsx`).

**Rollen-Empfehlung (offen, wartet auf finale Tomson-Zuordnung):** `rr-btn-sweep--red` als
Haupt-CTA (Rot = einzige Aktionsfarbe), `rr-btn-frame` als sekundärer/Outline-CTA. Nicht mehr als
zwei Effekt-Stile pro Seite, sonst wirkt es nach Template.

## 9. Formular-System (2026-07-06)

Conversion-Kern der Seite, aufgebaut auf der bestehenden `rr-field` / `rr-label`-Basis. Live auf
`/design-system` Sektion 14, CSS in `app/styleguide/styleguide.css` (Abschnitt "Formular-System").

- **`rr-field`** (Input) + `rr-label` (Label darüber, 13.5px/600) waren die Basis. Neu ergänzt: ein
  additiver **Fokus-Ring** (`:focus` box-shadow, im Fehlerfall rot) und die Textarea-Variante
  `rr-field--textarea` (bzw. `textarea.rr-field`), `min-height:132px`, `resize:vertical`.
- **Fehler/Hilfe:** `rr-error` (rot, `--rr-error-ink`, mit rotem Punkt davor) und `rr-help`
  (`--rr-ink-soft`) unter dem Feld, per `aria-describedby` verdrahtet; das Feld bekommt
  `aria-invalid="true"` (färbt Rahmen rot).
- **Checkbox** `rr-check` (verstecktes native Input + `rr-check__box` mit rotem Haken, SVG-Pfad im
  Markup) und **Radio** `rr-radio` (`rr-radio__dot`, roter Innenpunkt). Beide mit sichtbarem
  `:focus-visible`-Ring. Helper `CheckRow` / `RadioRow` in `page.tsx`.
- **Layout:** `rr-form` (grid, gap 20, max 560px), `rr-form__row` (2 Spalten, unter 560px einspaltig),
  `rr-form__group`.
- **Status-Box:** `rr-formnote--success` / `--error` nutzen die semantischen Tokens (grüner bzw.
  roter heller Fond + AA-Ink). Submit im Formular = `rr-btn-sweep--red`.
- **Server-Komponente:** `app/design-system/page.tsx` ist eine Server Component (exportiert
  `Metadata`). Keine Event-Handler (`onSubmit` etc.) als Props übergeben, sonst 500. Interaktive
  Zustände laufen rein über CSS (`:checked`, `:focus-visible`) oder ausgelagerte Client-Komponenten.

## 10. Karten — aufgenommene Muster (Tomson-Entscheidung 2026-07-07)

Vier Karten-Muster, aus uiverse-Vorlagen originalgetreu übernommen (Mechanik exakt, nur Farbe auf
Marke + Schrift gedreht — Dauerregel „Fremd-Komponenten originalgetreu"). Live auf `/design-system`
Sektion 15, CSS in `app/styleguide/styleguide.css` (Abschnitt „Aufgenommene Karten"). Reine
CSS-Interaktion (`:hover`), kein JS; jede hat einen `prefers-reduced-motion`-Fallback.

- **`rr-card-slide`** (Slide-Reveal) — 190x254, geclippt. Beschreibungs-Fläche (`__desc`, `__title`,
  `__body`) liegt über einer Navy→Rot-Fläche (`__image` mit `__cta`) und fährt beim Hover per
  `translateY(100%)` nach unten weg. Für einzelne Blickfang-/CTA-Karten.
- **`rr-card-layer`** (Layer-Schatten) — 190 breit, gestapelte Schatten + roter Innen-Balken unten
  (`box-shadow ... var(--rr-red) 0 -3px 0 inset`). `__eyebrow` (rot) / `__title` / `__body`. Ruhig als
  Einzelkarte; Standard-Leistungskarte.
- **`rr-focus-row`** (Fokus-Stapel, V2xV3) — Wrapper um mehrere `rr-card-layer`. Karte unter dem
  Cursor rückt in den Fokus (`translateY(-6px) scale(1.03)`), die anderen treten unscharf und blass
  zurück (`:hover > :not(:hover)` → `blur(7px)`, `opacity .35`). Für Leistungs-Übersichten.
- **`rr-card-book`** (Buch) — 180x250, `perspective`. Roter Deckel (`__cover`) klappt beim Hover per
  `rotateY(-68deg)` auf, Innenseite (`__inner`, `transform-origin:100%`) schwenkt heraus. Flacher
  Öffnungswinkel + `overflow:hidden`, damit Text im Rahmen bleibt. Sparsam, max. ein Moment (z.B.
  „Über uns"), nicht als System.
- **Noch offen (nicht aufgenommen):** Fragment-Karte (Hero-Splitter-Cluster) und Mechanik-Karte
  (Zahnräder) aus Runde 3 — als Prototyp gebaut, warten auf Tomson-Entscheidung.

## 11. Formular-Karten (Tomson-Entscheidung 2026-07-07)

Zwei bestätigte Anfrage-Karten. Ersetzen die Formular-Optik aus §9/Sektion 14; die
`rr-field`/`rr-label`/`rr-form`-Primitive bleiben die Basis (die Split-Karte nutzt sie direkt).
Live auf `/design-system` Sektion 16, CSS in `styleguide.css` (Abschnitt „Formular-Karten").

- **`rr-formcard-neu`** (Neumorph, eckig) — uiverse-Vorlage originalgetreu übernommen, aber auf
  Wunsch **eckig statt rund** (kein Radius) und auf Marke umgefärbt. Weiche Doppelschatten-Karte,
  300px. `__title` (DM Sans, uppercase) + `__box` (transparentes Input mit `border-left`/`-bottom`
  in Ink + `<span>`-Label). Das Label wandert per `input:focus ~ span` / `input:valid ~ span`
  (`required` nötig) als **roter eckiger Block** nach oben rechts; Verschiebeweite pro Feld über
  `--tx`. **Submit = `rr-btn-frame--red rr-btn-frame--fill`** (kein Sweep-Button — Tomson-Wunsch:
  die vier Eck-Winkel, die beim Hover rot füllen). Kompakte Anfrage-Karte. Hinweis: die weichen
  Neumorph-Schatten sind das einzige „runde" Element — bei Bedarf straffen oder auf 1px-Rahmen.
- **`rr-formcard-split`** (Statement + Formular) — 560px, Navy-`__aside` (`__eyebrow`, `__stmt` in
  Crimson Pro, `__meta`) links, `__form` rechts auf `rr-field`/`rr-label` + `rr-btn-sweep--red`.
  Unter 560px einspaltig. Für eine ganze Kontakt-Sektion. Editorial, all-turtles-nah.
