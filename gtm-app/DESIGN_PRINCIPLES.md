# Design Principles — Yes Lifers GTM OS

*This document is the source of truth for all aesthetic decisions in GTM OS.
It is not a suggestion. Read it before any frontend work.*

---

## Core Philosophy

**Terminal Meets Journal, Operator Edition.**
A productivity cockpit that feels like a well-worn terminal crossed with a leather
field notebook. Clean typography, purposeful density, respect for the operator's
intelligence. Earns quality through restraint, not ornament. Every element
justifies its presence.

### Aesthetic Lineage

When in doubt, reach *toward* these references, not away from them:

- **Aston Martin** — understated confidence; the ones who know, know
- **Hermès** — quiet luxury; detail that rewards the discerning eye
- **Dieter Rams** — *less, but better*; honesty about what a thing is
- **Bauhaus / Swiss design** — typographic precision, grid discipline, no
  gratuitous decoration
- **da Vinci** — *Simplicity is the ultimate sophistication*

This is NOT startup SaaS aesthetic. NOT gamified dashboard aesthetic. NOT
"delightful" bouncy onboarding aesthetic. Those are forms of trying too hard.
GTM OS tries less, and trusts the operator to recognize that the restraint
itself is the luxury.

### The Operator Tool Distinction

A journal or reader app can be purely monochrome — color there is decoration
and decoration is noise. GTM OS is a *cockpit*: the operator scans state at a
glance. Color is therefore an **information channel**, not an ornament. We use
it, but sparingly and semantically. Every color earns its meaning. Every
non-semantic color is waste.

---

## Visual Language

### Typography

- **Monospace throughout.** Primary: JetBrains Mono. Fallbacks: Monaco, Menlo,
  `ui-monospace`, `monospace`.
- **Text is the interface.** No iconography doing work a word could do.
- **Density over whitespace.** Let content breathe through line-height, not
  padding. This is the single most important typographic rule in this project.
- **Small, strict type scale.** Suggested: 12 / 13 / 14 / 16 / 20 / 24px. Pick
  one scale and obey it across every screen.
- **Tabular figures** wherever numbers align in columns:
  `font-variant-numeric: tabular-nums`.
- **Measure.** Line length for body text capped around 70-80 characters. Beyond
  that, readability collapses.

### Color Philosophy — Muted Pastels as Information Channels

Color in GTM OS does semantic work. It is never decoration. Every color in the
interface must answer one of these questions:

- What state is this item in?
- What action is needed?
- What kind of thing am I looking at?

We use **muted pastels** — earth-tone pigments, the kind you'd find in a
naturalist's hand-colored field guide. Restrained enough to sit quietly next to
monospace text. Differentiated enough to pattern-match across a dense list.

**Forbidden:**

- Saturated or neon colors
- Gradients (unless strictly functional — e.g., data visualizations)
- Purple / slate-gray / shadcn default palette (the AI-designed mean)
- Decorative color that conveys no information
- Color added to "make the UI pop"

### The Two Modes — Day / Night Parity

Both modes are first-class citizens. Neither is an afterthought. Night mode is
not the day mode inverted. Day mode is not the night mode lightened. Both are
designed deliberately.

**Day Mode — Warm Paper**

- Background: warm cream, *not* pure white — target `oklch(95% 0.01 80)`
- Text: deep espresso, *not* pure black — target `oklch(22% 0.02 50)`
- Borders: hairline, slightly darker than bg
- Feels like: a well-used notebook, slightly yellowed, with dark ink

**Night Mode — Warm Charcoal**

- Background: warm charcoal, *not* cool blue-black — target `oklch(16% 0.01 50)`
- Text: warm bone, *not* pure white — target `oklch(88% 0.02 80)`
- Borders: hairline, slightly lighter than bg
- Feels like: leather in lamplight

### Technical Requirement: OKLCH

All theme colors as CSS custom properties in OKLCH color space. OKLCH is
perceptually uniform: a "muted ochre" feels like the same color in day and
night modes with only lightness shifted. **Do not use hex or HSL for theme
tokens.** Use OKLCH.

Example:

```css
:root {
  /* Day mode — warm paper */
  --bg:           oklch(95% 0.01 80);
  --text:         oklch(22% 0.02 50);
  --border:       oklch(85% 0.01 80);

  --color-active:   oklch(70% 0.08 75);   /* muted ochre */
  --color-waiting:  oklch(70% 0.06 20);   /* dusty rose */
  --color-done:     oklch(72% 0.06 150);  /* sage */
  --color-priority: oklch(62% 0.12 40);   /* terracotta */
  --color-deferred: oklch(65% 0.05 280);  /* slate lavender */
  --color-neutral:  oklch(62% 0.02 80);   /* weathered stone */
}

[data-theme="dark"] {
  /* Night mode — warm charcoal */
  --bg:           oklch(16% 0.01 50);
  --text:         oklch(88% 0.02 80);
  --border:       oklch(26% 0.01 50);

  --color-active:   oklch(72% 0.10 75);
  --color-waiting:  oklch(70% 0.08 20);
  --color-done:     oklch(72% 0.08 150);
  --color-priority: oklch(65% 0.14 40);
  --color-deferred: oklch(68% 0.07 280);
  --color-neutral:  oklch(65% 0.03 80);
}
```

### Semantic Color Roles

Every interface color must map to one of these roles. Do not introduce
non-semantic color. Do not add new semantic roles without deliberate reason.

| Role                  | Hue family      | Meaning            |
| --------------------- | --------------- | ------------------ |
| Active / In-progress  | muted ochre     | "doing now"        |
| Waiting / Blocked     | dusty rose      | "not my move"      |
| Done / Complete       | sage            | "finished"         |
| Priority / Alert      | terracotta      | "needs attention"  |
| Deferred / Someday    | slate lavender  | "parked"           |
| Neutral / Info        | weathered stone | "just is"          |

These OKLCH values are starting points, not gospel. Tune them once rendered.
Aim for AA contrast against the background at a minimum, AAA where feasible.

### Shape Language

- **Border-radius 4-8px throughout.** No sharp 0px corners. No pills.
- **Rectilinear, grid-aligned layouts.** No skewed, rotated, or overlapping
  decorative elements.
- **4px spacing rhythm.** All margins, paddings, gaps are multiples of 4.
- **Hairline borders** (1px, semantic color) do the dividing work. Not drop
  shadows. Not background color blocks.

### Icons and Decoration

- **NO emojis anywhere.** Ever. Not in headers, not in buttons, not in empty
  states, not in error messages. This rule has no exceptions.
- **ASCII / Unicode symbols are the only allowed iconography:**
  - `→ ← ↑ ↓` for directional movement
  - `✓ ✗` for states (or `[x] [ ]`)
  - `· •` for separators / bullets
  - `│ ─ ┌ ┐ └ ┘ ├ ┤` for ASCII box drawing where structurally useful
  - `…` for truncation
  - `§ †` for notes / footnotes
- **Functional iconography only**, if any at all. Default to text labels first.
  If icons are unavoidable, use Lucide or Heroicons at hairline stroke weight.
- **No illustrations.** No mascots. No spot illustrations. No "empty state art."
  An empty state is a sentence.

---

## Interaction Design

### Feedback

- **Fast or instant.** Transitions are 100-200ms, or zero. Nothing slower.
- Subtle state changes: opacity shift, underline appearance, color shift. No
  bouncing, shaking, scaling, spinning.
- **No loading spinners where avoidable.** Prefer optimistic updates. For
  genuine long waits, use a hairline progress indicator, not a bouncing thing.
- **Errors inline**, never as toast notifications.

### Input

- **Direct manipulation** over modal dialogs.
- **Inline editing** wherever possible.
- **Keyboard-first** (shortcuts for all primary actions), mouse-supported,
  touch-first on mobile.
- **Direct questions.** "Delete this?" not "Are you sure you want to permanently
  delete this item?"

### Navigation

- Keyboard shortcuts for all primary actions. Document them in a help overlay.
- URL-based state where reasonable (shareable, bookmarkable).
- Minimal clicks to reach any view.
- No nested menus or dropdowns where avoidable.

---

## Tone of Voice

### UI Copy

- **Terse, imperative labels.** "Save", not "Save changes". "Delete", not
  "Delete this item permanently".
- **No exclamation marks.** Ever. They signal desperation.
- **No apologies.** Errors explain what happened; they do not apologize.
- **No artificial excitement.** No "Woohoo!", no "Amazing!", no "Great job!".
- **No corporate softening.** "Done", not "All set!".

### System / AI Voice

- **Stoic.** Naval Ravikant-inspired when a persona is needed: leverage,
  compound effects, what matters most.
- **2-3 sentences maximum.** Longer only with deliberate reason.
- **No platitudes.** No generic encouragement. No "You got this!".
- **When information is sufficient, silence beats commentary.**

---

## Anti-Patterns — What We Do Not Do

- Gamification (no points, badges, leaderboards, streaks-as-punishment)
- Dark patterns (no guilt, no manufactured urgency)
- Notification spam (user initiates; the app does not nag)
- Feature creep (every addition must justify its cognitive cost)
- Modal dialogs where inline actions would work
- Loading spinners where optimistic updates would work
- Onboarding tutorials (if the interface isn't self-evident, fix the interface)
- Skeuomorphism (no fake paper / fake leather textures — evoke them through
  restraint, not simulation)
- "Delightful micro-animations" — we are not here to delight, we are here to
  be useful
- Purple / slate-gray / shadcn defaults (the AI-designed mean)

---

## Technical Constraints

### Styling

- **CSS custom properties are the theming mechanism.** OKLCH tokens defined
  once at `:root` and `[data-theme="dark"]`, referenced everywhere.
- **Utility classes for layout** (Tailwind if introduced, plain CSS utility
  classes if not). Either is acceptable; the token system matters more than
  the framework.
- **No CSS-in-JS.** No styled-components. No Emotion.
- **No inline styles** except for truly dynamic values.

### Stack

- Vite + React + localStorage + GitHub sync — already established
- Minimal external dependencies. Every new package requires justification.
- No date libraries (native `Date` is sufficient for this project).
- No heavy state management (Context + `useReducer` is enough).

### Performance

- Fast initial load. Framework overhead must be minimal.
- Optimistic updates wherever possible.
- Lazy-load non-critical routes.

### Accessibility

- **Semantic HTML** as the foundation. Headings in order. Buttons are buttons.
- **Keyboard navigable.** Focus states visible. Never `outline: none` without
  an equivalent replacement.
- **Contrast** minimum WCAG AA, tested in both modes.
- **ARIA labels** where semantic HTML is insufficient.

---

## Summary

This is a tool for a serious operator doing serious work. It respects the
operator's time and attention by being fast, focused, and free of distraction.
Every element earns its place through utility. Quality is communicated through
restraint, consistency, proportion, and detail — never through ornament.

> *Simplicity is the ultimate sophistication.*
> — Leonardo da Vinci

---

## Appendix — How to Use This Document

When doing any frontend work on GTM OS:

1. Read this document first.
2. When proposing a design, justify choices against these principles.
3. When principles conflict, **The Operator Tool Distinction** resolves it:
   color is information, density is virtue.
4. When a choice feels ambiguous, bias toward *less* rather than *more*.
5. When generating a new component, ask:
   *"Would Aston Martin ship this? Would Hermès? Would Dieter Rams?"*
   If no, redo it.
