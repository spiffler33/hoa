# Yes Lifers GTM OS — Project Context

## Project Layout

- `GTM/` *(this directory)* — specs, build logs, task prompts for Claude Code
  - `gtm_app_spec.md` — full technical spec
  - `BUILD_LOG.md` — running log of shipped tasks
  - `claude_code_prompt.md` — template for task prompts
- `gtm-app/` — the React app (Vite + React + localStorage + GitHub sync)
  - `src/views/` — routed views (Today, WeeklyReview, Playbook, Content,
    Control, Reference, Settings)
  - `src/components/` — shared components (NavBar, Layout, LoadingSpinner,
    EmptyState)

## Design & Frontend Work — MANDATORY

Before any frontend, UI, styling, or design-related work, read and strictly
follow:

    ../gtm-app/DESIGN_PRINCIPLES.md

This applies to:

- Any change to a `.jsx` file's visual output
- Any CSS or styling change
- Any new component
- Any empty-state, error-state, loading-state, or tooltip copy
- Any theme, color, typography, spacing, or shape decision

`DESIGN_PRINCIPLES.md` is the source of truth for aesthetic decisions. It is
not a suggestion. When in doubt, it resolves the doubt.

The short version, to save you a read on small decisions:

- **Aesthetic:** Terminal Meets Journal, Operator Edition — restraint, density,
  monospace, no ornament. Reach toward Aston Martin, Hermès, Dieter Rams.
- **Color:** Muted pastels as semantic information channels only. OKLCH custom
  properties. Day mode is warm paper (cream/espresso); night mode is warm
  charcoal (charcoal/bone). Never pure black or pure white.
- **Typography:** JetBrains Mono throughout. Density via line-height, not
  padding.
- **Decoration:** No emojis. No illustrations. ASCII / Unicode symbols only.
  No gradients or shadows unless strictly functional.
- **Copy:** Terse, imperative, no exclamation marks, no apologies, no corporate
  softening.

Read the full doc for anything non-trivial.

## Stack Conventions

- Vite + React + localStorage + GitHub sync
- Plain CSS + CSS custom properties for theming (not Tailwind, not CSS-in-JS)
- Context + `useReducer` for state (no Redux, no Zustand)
- Native `Date` (no date libraries)
- Minimal dependencies; every new package requires justification

## Workflow Notes

- Builds are task-by-task with strict protocol — see `claude_code_prompt.md`
  for the task prompt template
- `BUILD_LOG.md` is updated after each shipped task
