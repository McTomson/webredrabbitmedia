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

**Rollen (fest, Tomson-Entscheidung 2026-07-08):** `rr-btn-sweep--red` = Primär-CTA (Rot = einzige
Aktionsfarbe), `rr-btn-frame` = Sekundär-/Outline-CTA, `rr-btn` (Solid-System, Sektion 04) = reiner
Formular-/Utility-Button (Submit-Fallback, kleine Aktionen). Nicht mehr als zwei Effekt-Stile pro
Seite, sonst wirkt es nach Template. `rr-btn-metal` und `rr-btn-draw` wurden 2026-07-08 (E3, eine
Button-Sprache) entfernt; archiviert in `docs/handoffs/entfernte-kandidaten-2026-07-08.patch`.

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

## 12. Dropdown / Select (Tomson-Entscheidung 2026-07-07)

Aus 5 Vorschlägen gewählt: **D · Klar-Box als Standard, B · Eck-Rahmen als Akzent.** Live auf
`/design-system` Sektion 04c, CSS im Abschnitt „DROPDOWN / SELECT" in `styleguide.css`.

- **Standard = `rr-select`** (das bestehende barrierefreie Listbox-Dropdown, `RelaunchDropdown.tsx`,
  Hero-Session-Komponente) — jetzt **eckig** statt rund (alle `border-radius` auf 0, nur per CSS,
  Komponente unangetastet). Roter Fokus-Ring, gewählte Option rot mit Haken (`rr-select__opt-check`).
  Volle Tastatur-/ARIA-Semantik bleibt. Auch `rr-select-native` (natives `<select>`) ist eckig.
- **Akzent = `rr-select-frame`** — vier Eck-Winkel wie `rr-btn-frame`; beim Hover/Öffnen wachsen sie
  auf 50/50 und **schließen den vollen roten Rahmen ohne Lücken** (Tomson-Fix). `<details>`-basiert
  (Open/Close ohne JS); die Wert-Auswahl-Logik braucht später einen Client-Wrapper analog
  `RelaunchDropdown`. Für prominente Stellen (z.B. ein Filter über den Referenzen).

## 13. FAQ-Akkordeon (Tomson-Entscheidung 2026-07-07)

Aus zwei Runden gewählt: **A · Farbwelt-Panel, B · Editorial, E · Konversation.** Live auf
`/design-system` Sektion 17, CSS im Abschnitt „FAQ-Akkordeon" in `styleguide.css`. Alle als natives
`<details>` (barrierefrei, kein JS), weiche `grid-template-rows: 0fr → 1fr`-Reveal, am Stil der
Relaunch-Panels (Farbwelten, DM-Sans-Riesentype, Off-White #f6f5f1). Basis-Markup:
`div.rr-faq > details > (summary + div.rr-faq__answer > div.rr-faq__answer-in > p)`.

- **`rr-faq--panel`** (A) — volles Farb-Panel wie die Startseiten-Sektionen, `--rr-world-1-bg` (Teal,
  Default) bzw. `.rr-faq--dark` / `.rr-faq--blue`. Riesige Off-White-Frage, Plus→Minus (`rr-faq__plus`).
  Für die **Startseite**.
- **`rr-faq--editorial`** (B) — heller Grund, große DM-Sans-Frage, feine Linien, `rr-faq__idx` +
  offene Frage in Rot. Für eine **eigene FAQ-/Preisseite**.
- **`rr-faq--chat`** (E) — dunkles Panel (`--rr-world-2-bg`), Frage als rote Bubble rechts, Antwort
  (`rr-faq__bubble`) blendet links weich ein. **Signatur-Moment**, sparsam.
- **Empfohlene Kombi:** `rr-faq--panel` als Häppchen auf der Startseite → Link „Alle Fragen" auf eine
  FAQ-Seite mit `rr-faq--editorial`. `rr-faq--chat` als einmaliger Effekt.
- **Verworfen (getestet, dokumentiert):** animiertes Fächer-System (horizontale Expander-Panels) und
  durchblätterbarer Karten-Stapel (beide aus Tomson-Vorlagen adaptiert) — gut als Showpiece für 4–7
  Fragen, aber nicht scannbar für eine lange FAQ. Prototypen im Scratchpad, nicht ins System übernommen.

## 14. Stand der Relaunch-Entscheidungen (2026-07-07)

Festgezurrt und im `/design-system` + `styleguide.css` umgesetzt:

- **Wortmarke / Fonts:** DM Sans Bold (Headlines/Wortmarke), Instrument Sans (Fließtext/UI/Buttons),
  Crimson Pro (Serif-Statements). Fraunces retired. (§3)
- **Farben:** Rot `#f12032` als einziger Akzent; Panel-Farbwelten Teal `#1d8c98`, Anthrazit `#2d2d2d`,
  Blau `#0a8aba`, Off-White `#f6f5f1`; Navy `#1c2837`. (§2)
- **Buttons:** `rr-btn-sweep` (Haupt-CTA, roter Balken füllt) + `rr-btn-frame` (Eck-Rahmen, 4 Winkel). (§8)
- **Karten:** `rr-card-slide`, `rr-card-layer`, `rr-focus-row`, `rr-card-book`. (§10)
- **Formular-Karten:** `rr-formcard-neu` (Neumorph eckig) + `rr-formcard-split`. (§11)
- **Dropdown:** `rr-select` (eckig, Standard) + `rr-select-frame` (Akzent). (§12)
- **FAQ:** `rr-faq--panel` / `--editorial` / `--chat`. (§13)
- **Formular-Primitive:** `rr-field`, `rr-check`, `rr-radio`, `rr-toggle`, `rr-formnote`. (§9)

Zahlen-/Stat-Boxen, Badges/Tags, Testimonial/Zitat sind mit der Eckig-Konsequenz und dem
Premium-Layer (2026-07-08, §15) umgesetzt. Noch offen: Kunden-Logo-Leiste.

## 15. Entscheidungs-Stand 08.07.2026 — Eckig-Konsequenz, Premium-Layer, Testimonials/Tags/Reftable/Prose

Zweiter großer Entscheidungs-Block nach §14 (2026-07-07). Alles live auf `/design-system`
(Sektionen 18–26), CSS-Ergänzungen am Ende von `app/styleguide/styleguide.css`.

### Fundament E1–E9

- **E1 · Buttons eckig:** `.rr-btn` (Solid-System, Sektion 04) hat jetzt `border-radius: 0` statt
  Pille; die Varianten `--primary/--secondary/--tertiary/--ondark` bleiben. Rollen siehe §8.
- **E2 · Radius 0 ist Gesetz:** `--rr-radius` / `--rr-radius-lg` sind auf `0` gesetzt (Tokens
  bleiben bestehen, damit alle `var()`-Verweise mitziehen). Eckig: `.rr-field`, `.rr-formnote`,
  `.rr-card-slide` (+ inneres Bild), `.rr-card-layer`, `.rr-card-book` (Cover + Karte),
  `.rr-check__box`, FAQ-Chat-Bubbles (`rr-faq--chat summary`, `rr-faq__bubble`). **Einzige
  Ausnahmen:** `.rr-toggle__track` / `.rr-toggle__knob` und `.rr-radio__dot` (konventionell rund).
  Kleine Status-Punkte (Spinner, `rr-error::before`) bleiben aus demselben Grund rund — sie sind
  keine Flächen/Karten, sondern Mini-Indikatoren.
- **E3 · Kandidaten entfernt:** `rr-btn-metal` und `rr-btn-draw` raus (eine Button-Sprache);
  archiviert in `docs/handoffs/entfernte-kandidaten-2026-07-08.patch`. `.rr-card-soft` bleibt, jetzt
  eckig (Neumorph-Schatten unverändert).
- **E4 · Zwei Schatten-Sprachen:** Neuer Token `--rr-shadow-layer` (`rgba(28,40,55,.26) 0 2px 4px,
  rgba(28,40,55,.18) 0 7px 13px -3px`). Flat ist Standard (kein Schatten); `--rr-shadow-layer` hebt
  `rr-card-layer` / `rr-card-book` dezent ab (roter Inset bei `rr-card-layer` bleibt separat).
  Neumorph-Doppelschatten nur als bewusste Ausnahme: `rr-formcard-neu`, `rr-card-soft`.
- **E5 · Scroll-Reveal (`rr-reveal` / `rr-stagger`):** Opacity 0 + `translateY(16px)` bis sichtbar,
  700ms ease-out, rein CSS über `@supports (animation-timeline: view())`. Ohne Support: sofort
  sichtbar (`@supports not`). `prefers-reduced-motion`: immer sofort sichtbar. Sektion 18. Hinweis:
  `RevealOnScroll.tsx` (Hero-Strang, `pp-reveal`) ist ein eigener, älterer Mechanismus und wird hier
  nicht angefasst — kann bei Gelegenheit auf `rr-reveal` migrieren.
- **E6 · Zitat/Testimonial (`rr-quote` / `rr-quote--editorial`):** Teal-Panel, Crimson Pro italic
  `clamp(28px,4vw,44px)`, Off-White, großes eckiges Anführungszeichen, Attribution (Name + 5 Sterne +
  "Google-Rezension"). `--editorial` = heller Einsatz mit Hairlines. Sektion 19, mit den drei echten
  Google-Rezensionen (Rafael Danesh, Dmitry Pashlov, Rene Rohrer). Ehrlich: **5,0 auf Google bei 3
  Rezensionen**, keine erfundene Zahl.
- **E7 · Tags (`rr-tag`):** Outline-Basis (Hairline, uppercase), Modifier `--red` (solid),
  `--navy`, `--ok`, `--warn` (semantische Tokens). Sektion 20.
- **E8 · Referenz-Tabelle (`rr-reftable`):** Hairline-Tabelle, `<table>` mit `<th scope="col">`.
  Name (DM Sans 600, groß) | Branche (Ink-Soft) | Jahr (tabular-nums, rechtsbündig). Hover: Name
  wird rot. Sektion 21.
- **E9 · Prosa (`rr-prose`):** `p` max-width 68ch/1.6; Links Ink mit roter 1px-Unterstreichung
  (Hover 2px); `ul` mit rotem 7px-Quadrat-Marker; `ol` mit roten tabular-nums-Ziffern; `blockquote`
  eingerückt, Crimson Pro italic, kleines rotes Anführungszeichen (kein Farbbalken). Sektion 22.

### Premium-Layer P1–P7 (P8 verworfen)

Sparsame Signatur-Effekte, nicht als Flächendecker gedacht — max. 1–2 pro Seite, nie kombiniert.

- **P1 · Kinetic-Headline (`rr-kinetic`):** Buchstaben-`<span>` morphen gestaffelt im Font-Weight
  (500→700) + leichtes `scaleY` bei Hover. Fließender Morph bräuchte eine Variable Font; ohne sie
  springt der Weight diskret (aktuell akzeptierter Zwischenstand). Sektion 23.
- **P2 · Outline-Word (`rr-outline-word`):** `-webkit-text-stroke`, transparent gefüllt; Hover/Fokus
  füllt Rot (hell) bzw. Off-White (`--ondark`, dunkel). Sektion 23.
- **P3 · Shatter, Variante B (`rr-shatter`):** 3×3-Fragment-Raster über `background-position`;
  Eintritt via `animation-timeline: view()` — Fragmente fliegen aus versetzten Richtungen zusammen
  (alt zerfällt, neu setzt sich zusammen). Hover: minimales Auseinanderdriften. Reduced-motion:
  statisch. Bildquelle über die Custom Property `--rr-shatter-img`. **Einsatzort: Referenzen /
  Case-Details, sparsam.** Sektion 24.
- **P4 · Draw-Line (`rr-drawline`):** rote Linie wächst per `scaleX` mit dem Scroll-Fortschritt
  (`animation-timeline: view()`). Sektion 24.
- **P5 · Block-Text (`rr-blocktext`):** `background-clip: text` mit harten Farbblöcken
  (Teal/Anthrazit/Blau, harte Stops, kein weicher Verlauf). **Regel: maximal eine Stelle pro
  Seite.** Sektion 23.
- **P6 · Magnetic Button:** Marker-Klasse `rr-magnetic` + `data-rr-magnetic`-Attribut, die
  Cursor-Anziehung läuft über ein kleines Inline-Script (max. 8px Verschiebung Richtung Cursor,
  ease-out zurück via CSS-Transition). Nur bei `pointer: fine`, nur `prefers-reduced-motion: no
  preference`, nur 1–2 Haupt-CTAs pro Seite. Sektion 25.
- **P7 · Bild-Duoton + Grain (`rr-img-duo--teal` / `--navy`, `rr-grain`):** Graustufen-Bild +
  Farb-Overlay über `::after` (`mix-blend-mode: multiply`); `rr-grain` legt ein feines
  SVG-`feTurbulence`-Rauschen (`data:`-URI, Opacity ~0.05, `pointer-events: none`) darüber. **Neuer
  Bild-Standard für Cases/Über-uns.** Sektion 26.
- **P8 · Custom Cursor — bewusst verworfen (D4).** Höchstens später als Overlay-Menü-Idee, kein
  eigener Cursor-Ersatz auf der ganzen Seite.

### Weitere Entscheidungen

- **D1 — ein Signature-Moment pro Seite:** Premium-Layer-Effekte (P1–P7) werden pro Seite höchstens
  einmal eingesetzt, nie gestapelt. Verhindert Templat-Gefühl trotz vieler verfügbarer Effekte.
- **D2 — Bild-Zerlegung auf Referenzen:** `rr-shatter` (P3) ist für die Referenzen-/Case-Seiten
  reserviert, nicht für Startseite oder Leistungen.
- **D3 — kein neues WebGL außer der bestehenden Kugel-Galerie:** Die 3D-Kugel-Galerie aus
  `referenzen-preview` bleibt die **einzige** 3D-Signature der Seite; keine weiteren
  WebGL-Experimente ohne neue Tomson-Freigabe.
- **D4 — kein Custom Cursor** (siehe P8).

### 3-Welten-Konzept (Planungsstand, noch nicht gebaut)

- **Leistungen** = Teal (`--rr-world-1-bg`) + geplant Scroll-Zoom / Video-Scrub.
- **Referenzen** = Anthrazit (`--rr-world-2-bg`) + Kugel-Galerie + Bild-Zerlegung (P3/D2).
- **Preise** = Blau (`--rr-world-3-bg`) + Paket-Snap, eventuell horizontal (siehe
  `project_redrabbit_preisseite_horizontal`-Notiz).

### Video-Scrub-Specs (für das kommende Flow-Video, Leistungen-Welt)

Eine Kamerafahrt ohne Schnitte, ruhiger Start und ruhiges Ende, kein Text im Video, Format 16:9,
ca. 100–150 WebP-Frames (Scrub-Sequenz statt klassischem Videoplayer).
Ganz offen (kein Bedarf entschieden): Fragment-/Mechanik-Karte aus Karten-Runde 3.
