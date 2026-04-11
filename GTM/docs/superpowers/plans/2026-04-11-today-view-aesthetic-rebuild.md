# Today View Aesthetic Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate DESIGN_PRINCIPLES.md into executable code on the Today view, so the operator can react to the Terminal-Meets-Journal aesthetic in the browser and iterate the doc against reality.

**Architecture:** Rewrite the theme token layer in `index.css` first (OKLCH, semantic role names, legacy aliases kept for other views). Ship JetBrains Mono locally as `.woff2` files in `public/fonts/`. Rewrite `TodayView.jsx` + `TodayView.css` to exercise the new tokens under the principles. Day mode only in v1 — `[data-theme="dark"]` block and DAY/NIGHT toggle deferred to a follow-up task.

**Tech Stack:** Vite 5, React 18, React Router v6, plain CSS custom properties. No CSS framework. No CSS-in-JS. No date libraries. Self-hosted JetBrains Mono `.woff2` in `gtm-app/public/fonts/`.

---

## Decisions locked in (2026-04-11)

1. **Token shift affects all views.** Non-Today views inherit the new muted palette passively. They are not deliberately redesigned in this task.
2. **Day mode only in v1.** No `[data-theme="dark"]` block, no theme toggle, no `src/lib/theme.js`, no NavBar edit, no `main.jsx` hydration. The OKLCH structure in `:root` is set up so adding night mode later is a drop-in paste.
3. **Local-hosted fonts.** `.woff2` files downloaded into `gtm-app/public/fonts/` from the JetBrains/JetBrainsMono GitHub repo. Weights: 400 (Regular), 500 (Medium). No 700 — principles doc favors restraint; add later if needed.
4. **In-place edits.** No `/today-v2` side-by-side. `git diff` is the before/after tool.
5. **Plan saved to disk** at this path before execution.

## Out of scope

- Business logic (data layer, cadence data, stage gate data, phase checklists)
- React state shapes (`config`, `metrics`, `contentItems`, `checked`, `expandedAlert`)
- Routing and navigation
- Other views (`WeeklyReview`, `Playbook`, `Content`, `Control`, `Reference`, `Settings`)
- `DESIGN_PRINCIPLES.md` edits (we iterate on it after seeing results)
- `BUILD_LOG.md` update (only if explicitly requested)
- Night mode / theme toggle (deferred)

---

## File Structure

**Modify (5):**
- `gtm-app/index.html` — remove Google Fonts CDN links (preconnect + stylesheet)
- `gtm-app/src/index.css` — replace `:root` token block, add `@font-face` declarations, remap `--font-display`/`--font-body` to JetBrains Mono, add semantic role names alongside legacy aliases
- `gtm-app/src/views/TodayView.jsx` — new banner structure, `[ ]`/`[x]` text checklist, text tags, remove per-section card wrappers
- `gtm-app/src/views/TodayView.css` — full rewrite matching new JSX; tabular-nums, hairline dividers, 2px left rules, no shadows
- Nothing else

**Create (3 assets + 0 source files):**
- `gtm-app/public/fonts/JetBrainsMono-Regular.woff2` (downloaded)
- `gtm-app/public/fonts/JetBrainsMono-Medium.woff2` (downloaded)
- `gtm-app/public/fonts/` directory itself

---

## Task 1 — Download JetBrains Mono fonts to public/fonts/

**Files:**
- Create: `gtm-app/public/fonts/JetBrainsMono-Regular.woff2`
- Create: `gtm-app/public/fonts/JetBrainsMono-Medium.woff2`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p gtm-app/public/fonts
```

- [ ] **Step 2: Download Regular (weight 400)**

```bash
curl -L -o gtm-app/public/fonts/JetBrainsMono-Regular.woff2 \
  https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/webfonts/JetBrainsMono-Regular.woff2
```

- [ ] **Step 3: Download Medium (weight 500)**

```bash
curl -L -o gtm-app/public/fonts/JetBrainsMono-Medium.woff2 \
  https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/webfonts/JetBrainsMono-Medium.woff2
```

- [ ] **Step 4: Verify both files exist and are non-zero**

```bash
ls -lh gtm-app/public/fonts/
```

Expected: two `.woff2` files, each > 10 KB.

---

## Task 2 — Strip Google Fonts CDN links from index.html

**File:** `gtm-app/index.html`

- [ ] **Step 1: Remove lines 7-12 (the three `<link>` tags for Google Fonts)**

Delete:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Leave the `<title>`, `<meta>`, and the rest of the file intact.

- [ ] **Step 2: Verify**

```bash
grep -c "fonts.googleapis.com" gtm-app/index.html
```

Expected: `0`

---

## Task 3 — Rewrite index.css tokens + @font-face

**File:** `gtm-app/src/index.css`

- [ ] **Step 1: Replace `:root` block (lines 1-47) with OKLCH day-mode tokens**

New block:

```css
/* ── Yes Lifers GTM — Design Tokens (Day Mode / Warm Paper) ── */

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

:root {
  /* ── Surfaces (warm paper) ── */
  --bg:              oklch(95% 0.010 80);
  --bg-elevated:     oklch(97% 0.010 80);
  --bg-sunken:       oklch(92% 0.012 80);
  --bg-hover:        oklch(93% 0.012 80);

  /* ── Text (deep espresso) ── */
  --text:            oklch(22% 0.020 50);
  --text-muted:      oklch(48% 0.015 60);
  --text-subtle:     oklch(62% 0.012 70);

  /* ── Rules / borders (hairline) ── */
  --rule:            oklch(82% 0.012 70);
  --rule-strong:     oklch(70% 0.015 60);

  /* ── Semantic color roles (muted pastels) ── */
  --color-active:    oklch(60% 0.09 75);   /* muted ochre    — "doing now"    */
  --color-waiting:   oklch(58% 0.08 20);   /* dusty rose     — "not my move"  */
  --color-done:      oklch(58% 0.08 150);  /* sage           — "finished"     */
  --color-priority:  oklch(55% 0.13 40);   /* terracotta     — "attention"    */
  --color-deferred:  oklch(55% 0.06 280);  /* slate lavender — "parked"       */
  --color-neutral:   oklch(52% 0.02 80);   /* weathered stone— "just is"      */

  /* ── Legacy aliases (kept so other views don't break) ── */
  --bg-primary:         var(--bg);
  --bg-surface:         var(--bg-elevated);
  --bg-surface-hover:   var(--bg-hover);
  --text-primary:       var(--text);
  --text-secondary:     var(--text-muted);
  --accent-blue:        var(--color-active);
  --accent-blue-soft:   oklch(88% 0.025 75);
  --status-green:       var(--color-done);
  --status-green-bg:    oklch(92% 0.020 150);
  --status-amber:       var(--color-active);
  --status-amber-bg:    oklch(92% 0.025 75);
  --status-red:         var(--color-priority);
  --status-red-bg:      oklch(92% 0.025 40);
  --border:             var(--rule);
  --border-active:      var(--rule-strong);

  /* ── Typography ── */
  --font-mono:    'JetBrains Mono', ui-monospace, Menlo, Monaco, monospace;
  --font-display: 'JetBrains Mono', ui-monospace, Menlo, Monaco, monospace;
  --font-body:    'JetBrains Mono', ui-monospace, Menlo, Monaco, monospace;

  /* ── Type scale (strict: 11/12/13/14/16/20/24) ── */
  --fs-micro: 11px;
  --fs-xs:    12px;
  --fs-sm:    13px;
  --fs-md:    14px;
  --fs-lg:    16px;
  --fs-xl:    20px;
  --fs-xxl:   24px;

  /* ── Spacing rhythm (multiples of 4) ── */
  --space-unit:     4px;
  --card-padding:   16px;
  --section-gap:    24px;
  --page-padding-x: 24px;
  --page-padding-y: 32px;

  /* ── Radius (4-8px, no pills) ── */
  --radius-card:   6px;
  --radius-badge:  4px;
  --radius-button: 4px;
}
```

- [ ] **Step 2: Update `body` declaration to use warm paper background and mono body font**

Leave everything from `/* ── Reset & Base ── */` onward mostly intact, but:
- Change `body { line-height: 1.6 }` — keep
- Confirm body uses `var(--bg)` via legacy alias `var(--bg-primary)` — already does

- [ ] **Step 3: Verify the file parses**

```bash
npx vite build --mode development 2>&1 | head -20
```

(This is a lightweight parse check; a full verification happens in Task 6.)

---

## Task 4 — Rewrite TodayView.jsx

**File:** `gtm-app/src/views/TodayView.jsx`

- [ ] **Step 1: Replace JSX structure**

Keep all imports, hooks, state, effects, and derived calculations identical. Only the return-block JSX changes.

Key changes to implement:
1. **Banner** — three-line structure: greeting (small muted), date/week/phase line (mono, separators = ` · `), objective (left rule + quote)
2. **Alerts** — `<li>` row = `[status-dot] label ········· value / target` with leader dots via `::after` content
3. **Cadence** — visually-hidden real `<input type="checkbox">` with a sibling `<span>` rendering `[x]` or `[ ]`
4. **Content** — text tags `[STATUS]` instead of pill badges; overdue gets leading `!`
5. **Section containers** — each `<section>` no longer has its own card background; just a heading + content + hairline bottom rule

See the full JSX in Step 2.

- [ ] **Step 2: Commit the new render block**

(Full JSX in the implementation; omitted from this plan to avoid duplication — follows the structure above.)

- [ ] **Step 3: Verify in browser**

Manual: `npm run dev`, open `/today`, verify all four sections render, click-to-expand on alerts still works, checkbox toggles still update state.

---

## Task 5 — Rewrite TodayView.css

**File:** `gtm-app/src/views/TodayView.css`

- [ ] **Step 1: Delete entire existing file content and rewrite**

Rules to drop:
- `.today-banner { background; border; border-radius; padding }` — gone
- `.today-card { background; border; border-radius; padding }` — gone
- `.today-card:hover { box-shadow }` — gone
- `.today-alert--red { background }`, `.today-alert--amber { background }` — gone (replaced with left rule)
- `.today-checklist__item:hover { background }` — gone (replaced with text brightness shift)
- `.status-badge { background }` — gone (text tags only)

Rules to add:
- `.today-view { display: flex; flex-direction: column; gap: 0 }` (sections separated by hairline, not gap)
- `.today-section { padding: 20px 0; border-bottom: 1px solid var(--rule) }`
- `.today-section:last-child { border-bottom: none }`
- `.today-section__heading { font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 12px }`
- `.today-banner__greeting { font-size: var(--fs-sm); color: var(--text-muted) }`
- `.today-banner__meta { font-size: var(--fs-md); color: var(--text); margin-top: 4px }`
- `.today-banner__objective { font-size: var(--fs-sm); color: var(--text-muted); margin-top: 12px; padding-left: 12px; border-left: 2px solid var(--rule); line-height: 1.6 }`
- `.today-alert { display: grid; grid-template-columns: auto 1fr auto auto; gap: 8px; align-items: baseline; padding: 6px 0 6px 10px; border-left: 2px solid transparent }`
- `.today-alert--red { border-left-color: var(--color-priority) }`
- `.today-alert--amber { border-left-color: var(--color-active) }`
- `.today-alert--green { border-left-color: var(--color-done) }`
- `.today-alert__label { font-size: var(--fs-sm); color: var(--text) }`
- `.today-alert__label::after { content: ""; flex: 1; border-bottom: 1px dotted var(--rule); margin: 0 8px 4px }` (leader dots)
- `.today-alert__value { font-size: var(--fs-sm); font-variant-numeric: tabular-nums; color: var(--text) }`
- `.today-alert__target { font-size: var(--fs-xs); font-variant-numeric: tabular-nums; color: var(--text-muted) }`
- `.today-checklist__item { display: grid; grid-template-columns: auto 1fr auto auto; gap: 10px; padding: 4px 0; align-items: baseline }`
- `.today-checklist__cb-native { position: absolute; opacity: 0; pointer-events: none }` (visually hidden)
- `.today-checklist__cb-text { font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-muted); user-select: none }`
- `.today-checklist__label:hover .today-checklist__cb-text { color: var(--text) }`
- `.today-checklist__text--done { text-decoration: line-through; color: var(--text-subtle) }`
- `.today-content-item { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 4px 0; align-items: baseline }`
- `.today-content-tag { font-size: var(--fs-micro); color: var(--color-active); text-transform: uppercase; letter-spacing: 0.05em; padding: 0 6px; border: 1px solid var(--color-active); border-radius: var(--radius-badge) }`
- `.today-content-tag--drafted { color: var(--color-active); border-color: var(--color-active) }`
- `.today-content-tag--published { color: var(--color-done); border-color: var(--color-done) }`
- `.today-content-tag--scheduled { color: var(--color-deferred); border-color: var(--color-deferred) }`
- `.today-content-item__overdue { color: var(--color-priority); font-weight: 500; margin-right: 4px }` (the `!` glyph)

Responsive:
- `@media (max-width: 480px)` — tighten type sizes, stack content rows

- [ ] **Step 2: Verify no stale rules remain**

```bash
grep -n "box-shadow" gtm-app/src/views/TodayView.css
```

Expected: no matches.

---

## Task 6 — Build verification

- [ ] **Step 1: Run Vite build**

```bash
cd gtm-app && npm run build
```

Expected: build succeeds with zero errors. Warnings about unused legacy tokens are acceptable.

- [ ] **Step 2: Inspect output**

If the build passes, the plan is mechanically correct. Visual verification happens next in the browser (manual, user-driven).

---

## Self-Review Checklist

- [x] Spec coverage: every principle area (typography, color, shape, icons, tone) is touched by at least one task.
- [x] Placeholder scan: no "TBD" / "implement later" / "add validation". Task 5's list of CSS rules is explicit.
- [x] Type consistency: token names used in TodayView.css (e.g., `--color-priority`, `--rule`) are defined in index.css in Task 3.
- [x] Legacy compat: every token used by other views (`--accent-blue`, `--status-red`, `--bg-surface`, etc.) has an alias in the new `:root` block pointing at a semantic OKLCH value.

## Known follow-ups (not in this task)

1. Night mode — `[data-theme="dark"]` block with warm charcoal palette
2. `DAY | NIGHT` toggle in NavBar + `src/lib/theme.js` helper + pre-React hydration
3. Rebuild of the remaining views to match the new aesthetic. Done: TodayView (4e98456), WeeklyReviewView (d4ed34e). Remaining: Playbook, Content, Control, Reference, Settings.
4. Possibly adding JetBrains Mono weight 700 if emphasis needs a third weight beyond 400/500
5. Verifying AA contrast in both modes after night mode ships
