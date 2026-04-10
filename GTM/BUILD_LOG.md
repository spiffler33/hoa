# Yes Lifers — GTM Operating System: Build Log

A single-page React application that serves as the daily operating cockpit for the GTM Lead running the Yes Lifers go-to-market. Built with Vite + React + React Router (hash), styled with vanilla CSS (dark theme, mission-control aesthetic), and backed by Google Sheets via Apps Script. Hosted on GitHub Pages. The app enforces daily/weekly discipline through cadence checklists, metric tracking with traffic-light alerts, phase playbooks, content calendar management, stage gate monitoring, and a reference library — all drawn from the companion strategy document (`gtm_content.md`).

---

## Task Checklist

- [x] Task 0: Setup & plan
- [x] Task 1: Scaffold — Vite + React + Router + CSS + Layout + Nav
- [x] Task 2: Static data files — stageGates, cadence, phaseChecklists
- [x] Task 3: Static data files — contentBriefs, referenceContent, killCriteria
- [x] Task 4: Data layer — sheetsApi, localStore, offline fallback
- [x] Task 5: Settings view — Sheet connection, phase config
- [x] Task 6: Today view — Daily cadence, alerts, content due
- [x] Task 7: Weekly Review view — Metric input, status badges, save
- [x] Task 8: Weekly Review view — Trend sparklines, copy-to-clipboard
- [x] Task 9: Playbook view — Phase tabs, checklists, exit criteria, progress
- [x] Task 10: Content view — Calendar grid, status dropdowns, week nav
- [ ] Task 11: Content view — Brief modals, add content form, pre-populate
- [ ] Task 12: Control view — Stage gates, kill criteria, funnel model
- [ ] Task 13: Reference view — Accordion sections, static content rendering
- [ ] Task 14: Reference view — Interactive partnerships + compliance checklist
- [ ] Task 15: Polish — Responsive, transitions, loading/error/empty states
- [ ] Task 16: Deployment — GitHub Pages setup, final QA

---

## Build Log

### Task 0 — Setup & Plan (2026-04-10)

**What was done:**
- Read and understood both spec files (`gtm_app_spec.md` ~880 lines, `gtm_content.md` ~1305 lines)
- Created this BUILD_LOG.md with project description, task checklist, decisions, and issues sections
- Initialized git repo, connected to GitHub remote `spiffler33/hoa`
- Initial commit and push

**Files created:**
- `GTM/BUILD_LOG.md` (this file)

**Key understanding captured:**
- App is a discipline engine for one user (GTM Lead), not a team tool
- 7 views: Today (default), Weekly Review, Content, Playbook, Control, Reference, Settings
- Data model: 7 Google Sheet tabs (weekly_metrics, content_calendar, phase_checklist, raci, compliance_log, partnerships, config)
- Static data files extracted from gtm_content.md: stageGates, cadence, contentBriefs, referenceContent, phaseChecklists, complianceChecklist
- Architecture: Vite + React + React Router (hash) + vanilla CSS + Google Fonts (DM Sans, JetBrains Mono)
- No CSS framework, no charting library (SVG sparklines), no state management library
- Offline: localStorage cache + queued writes + disconnected banner
- Component tree: 11 reusable components, 7 view components, 7 data files, 3 util files

### Task 1 — Scaffold (2026-04-10)

**What was done:**
- Scaffolded Vite + React project at `hoa/gtm-app/` (see Decision 3 below for naming)
- Installed react-router-dom
- Set up `index.css` with all CSS custom properties from the spec: 18 color tokens, 3 font families, spacing/radius vars, reset, base styles, navbar + layout CSS
- Added Google Fonts link (DM Sans 400/500/700, JetBrains Mono 400/500) to `index.html`
- Created `createHashRouter` in `App.jsx` with 7 routes, each rendering a placeholder view
- Created `Layout.jsx` (sticky nav + max-width 960px centered main area) and `NavBar.jsx` (tab-style navigation with active state highlighting)
- Set `base: '/hoa/'` in `vite.config.js` for GitHub Pages
- Cleaned out all default Vite boilerplate (logos, counter demo, default CSS)
- Verified: `npm run build` succeeds, dev server serves correct HTML with fonts

**Files created/modified:**
- `gtm-app/` — new Vite + React project root
- `gtm-app/index.html` — custom title, Google Fonts links
- `gtm-app/src/index.css` — all design tokens + reset + navbar/layout CSS
- `gtm-app/src/App.css` — emptied (global styles in index.css)
- `gtm-app/src/App.jsx` — hash router with 7 routes wrapped in Layout
- `gtm-app/src/main.jsx` — unchanged (Vite default entry)
- `gtm-app/src/components/Layout.jsx` — NavBar + Outlet
- `gtm-app/src/components/NavBar.jsx` — 7 tab-style NavLinks with active state
- `gtm-app/src/views/TodayView.jsx` — placeholder
- `gtm-app/src/views/WeeklyReviewView.jsx` — placeholder
- `gtm-app/src/views/ContentView.jsx` — placeholder
- `gtm-app/src/views/PlaybookView.jsx` — placeholder
- `gtm-app/src/views/ControlView.jsx` — placeholder
- `gtm-app/src/views/ReferenceView.jsx` — placeholder
- `gtm-app/src/views/SettingsView.jsx` — placeholder
- `gtm-app/vite.config.js` — base path set to `/hoa/`
- Empty dirs created: `src/data/`, `src/utils/` (for Tasks 2–4)

### Task 2 — Static Data Files: stageGates, cadence, phaseChecklists (2026-04-10)

**What was done:**
- Created `stageGates.js` — 29 metrics across 4 phases, each with id, label, target, unit, amber/red thresholds, prescribed actions, and applicableFrom. Phase 0–2 have full threshold data from Sections 4.4, 4.13, 4.20. Phase 3 KPIs from Section 4.27 have targets only (no amber/red in source doc, set to null).
- Created `cadence.js` — Phase 0 keyed by week (1–4) then by day with task arrays (from Section 4.2). Phase 1 keyed by day-of-week (mon–sun) with recurring rhythm (from Section 4.7). Multi-day tasks (Mon–Tue) split across individual day entries.
- Created `phaseChecklists.js` — All 4 phases with objective, weeks, infrastructure array, exitCriteria array. Phase 0 includes 12 infrastructure items (Section 4.3), 8 exit criteria (Section 4.5), and weekByWeek breakdown. Phase 1 has 9 exit criteria (Section 4.14). Phase 2 has 7 exit criteria (Section 4.21). Phase 3 has 4 exit criteria (from Phase overview table).
- Build verified: `npm run build` passes (43 modules, 543ms)

**Files created:**
- `gtm-app/src/data/stageGates.js` (10.5 KB)
- `gtm-app/src/data/cadence.js` (9 KB)
- `gtm-app/src/data/phaseChecklists.js` (9.3 KB)

### Task 3 — Static Data Files: contentBriefs, referenceContent, killCriteria (2026-04-10)

**What was done:**
- Created `contentBriefs.js` — 4 channels (linkedin, instagram, email, community) with format definitions. LinkedIn has 4 format types (philosophy, story, framework, engagement), each with type, frequency, purpose, tone, structure array, and briefTemplate. Also includes 3 examplePosts, 4 engagementExamples, and the 12-week Friday framework rotation (weekRotation). Instagram has 3 formats (carousel, reel, stories). Email has welcome drip (4-email sequence with day/subject/content/cta) and ongoing newsletter. Community has 3 formats (sayYesMoment with 5 rotating prompts, hellYesDecision thread template, podCheckIn).
- Created `referenceContent.js` — 6 sections (icp, roles, compliance, community, monetisation, vocabulary) with subsections. ICP: 5 subsections from Sections 1.2–1.4. Roles: 4 subsections from Sections 2.2–2.5 (role map, RACI, founder time, hiring triggers). Compliance: 7 subsections from Sections 3.2–3.8 (SEBI context, disclosure, claims, testimonials, boundary, checklist, cadence). Community: 5 subsections from Sections 4.8–4.11 (platform/channels, entry flow, pods, rituals, partnerships). Monetisation: 4 subsections from Sections 6.1–6.4 (revenue, unit economics, advisory capacity, pricing). Vocabulary: 10 terms from Appendix A.
- Created `killCriteria.js` — 5 kill criteria from Section 8.4, each with id, condition, signal, and action. Covers: wedge wrong, community model failure, app bridge broken, revenue model failure, founder burnout.
- Build verified: `npm run build` passes (43 modules, 641ms)

**Files created:**
- `gtm-app/src/data/contentBriefs.js` (19 KB)
- `gtm-app/src/data/referenceContent.js` (21 KB)
- `gtm-app/src/data/killCriteria.js` (1.6 KB)

### Task 4 — Data Layer: sheetsApi, localStore, dataLayer (2026-04-10)

**What was done:**
- Created `sheetsApi.js` — 7 async functions (fetchMetrics, saveMetrics, fetchContentCalendar, saveContentItem, fetchPhaseChecklist, saveChecklistItem, fetchConfig) that call a Google Apps Script web app URL. Reads connection config (appsScriptUrl, sheetId) from localStorage. Each call has a 10-second AbortController timeout, HTTP error checking, and JSON parsing. Returns null gracefully when no connection is configured.
- Created `localStore.js` — localStorage wrapper with `yeslifers_` prefix. Cache layer stores `{ data, timestamp }` so views can display staleness. Write queue stores pending saves with unique queueIds for offline→online sync. Includes `isOffline()` using `navigator.onLine` heuristic.
- Created `dataLayer.js` — The single import point for all views. Implements read-through caching (try remote → update cache on success → serve cache on failure) and write-through queuing (try remote → queue on failure or offline). 9 exported functions: loadMetrics, saveWeeklyMetrics, loadContentCalendar, saveContentEntry, loadPhaseChecklist, saveChecklistEntry, loadConfig, saveConfig, flushWriteQueue. Config merge logic combines remote Sheet config (key/value rows) with local connection settings.
- Build verified: `npm run build` passes (43 modules, 547ms — new utils not yet imported by views, so tree-shaken; files are valid JS)

**Files created:**
- `gtm-app/src/utils/sheetsApi.js` (4.1 KB)
- `gtm-app/src/utils/localStore.js` (2.4 KB)
- `gtm-app/src/utils/dataLayer.js` (4.6 KB)

### Task 5 — Settings View: Sheet connection, phase config, status (2026-04-10)

**What was done:**
- Replaced SettingsView placeholder with a full three-section view using React hooks (useState, useEffect, useCallback)
- Connection section: Apps Script URL and Sheet ID inputs, "Test Connection" button that saves config to localStorage then calls `loadConfig()` to verify the remote round-trip, "Save" button that persists all settings via `setConfig()`
- Phase section: Dropdown to select current phase (0–3) showing week ranges from phaseChecklists data, date picker for phase start date, dynamic display of phase objective and collapsible exit criteria list
- Status section: Connection status badge (green/red/muted for connected/disconnected/not configured), write queue length from `getWriteQueue()`, conditional "Flush Queue" button that calls `flushWriteQueue()` and reports flushed/failed counts
- Created SettingsView.css with card layout, field styles, button components (.btn, .btn--primary, .btn--outline), inline toast messages, phase description panel, and status grid — all using CSS custom properties from index.css
- Imports: `loadConfig` and `flushWriteQueue` from dataLayer (remote-aware); `setConfig`, `getConfig`, `getWriteQueue` from localStore (local-only operations); `phaseChecklists` from data
- Build verified: `npm run build` passes (48 modules, 563ms — first view now pulls in data layer + static data via real imports)

**Files created/modified:**
- `gtm-app/src/views/SettingsView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/SettingsView.css` (new)

### Task 6 — Today View: Daily cadence, alerts, content due (2026-04-10)

**What was done:**
- Replaced TodayView placeholder with a four-section view (Phase Banner, Alerts, Daily Checklist, Content Due) using useState + useEffect with async data loading
- Phase banner: Time-of-day greeting, phase label (Phase 0 — Foundation, etc.), computed week number from `phaseStartDate`, day name, and phase objective from phaseChecklists
- Alerts section: Loads latest metrics via `loadMetrics({ latest: true })`, compares each value against stageGates thresholds for the current phase. Displays traffic-light dots (green/amber/red/none) with value and target. Summary badge counts for red and amber. Click-to-expand reveals prescribed action text. Handles both single-object and array-of-rows metric responses.
- Daily checklist: Resolves today's tasks from cadence.js using phase-aware lookup — Phase 0 uses `cadence.phase_0[weekNum][dayKey]` (week-specific), Phase 1+ uses `cadence.phase_1[dayKey]` (recurring rhythm). Checkboxes toggle local state only (daily reset, not persisted). Shows time and owner metadata.
- Content due: Loads content calendar via `loadContentCalendar()`, filters to items where dueDate <= today and status !== 'published'. Overdue items get a red left border and "overdue" badge alongside the status badge.
- Handles empty/loading/no-data states gracefully for all sections. Phases 2–3 have no cadence data — shows "No daily cadence defined for this phase."
- Created TodayView.css: banner styling, card layout, alert dots and expand animation, checklist with accent-colored checkboxes, content items with status badges (drafted/scheduled/published/pending/overdue) — all using CSS custom properties
- Build verified: `npm run build` passes (51 modules, 567ms — CSS nearly doubled to 9.27 KB with new view styles)

**Files created/modified:**
- `gtm-app/src/views/TodayView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/TodayView.css` (new)

### Task 7 — Weekly Review View Part 1: Metric Input, Status Badges, Save (2026-04-10)

**What was done:**
- Replaced WeeklyReviewView placeholder with a full seven-section view implementing spec Section 6.2 (minus sparkline trends, which are Task 8)
- Header section: Phase indicator (reads currentPhase from config), prev/next week navigation defaulting to current Monday, "current" badge when viewing this week. Week range displayed in mono font.
- Stage Gate Metrics section: Renders all metrics from `stageGates.js` for the current phase (5 for Phase 0, 8 for Phase 1, 6 for Phase 2, 10 for Phase 3). Each metric row has label, target, number input (or Yes/No select for boolean metrics), unit suffix for %, and a live traffic-light badge computed via `alertLevel()` — same threshold logic as TodayView.
- Cadence Check section: 4 operational discipline inputs (content buffer dropdown 0/1/2+, posts on schedule, rituals completed, pod check-in done) with green/amber/red badge logic.
- Stage Gate Alerts section: Auto-computed from metric inputs — only appears when at least one metric is amber or red. Shows metric name, current value, alert level, and the prescribed action text from stageGates.js. Card border color is red if any red alerts, amber otherwise.
- Text sections: Blockers, This Week's Priorities, and Founder Summary textareas with placeholder guidance text.
- Save button: Calls `saveWeeklyMetrics()` from dataLayer.js, serializes all form fields (metrics + cadence + text) with weekOf key. Shows "saved" or "queued (offline)" toast feedback.
- Data loading: On mount and week change, calls `loadMetrics()`, finds the row matching `weekOf`, and pre-fills all inputs. Clears form when no data exists for the selected week.
- Created WeeklyReviewView.css: Header, week nav, card, metric row, input group, select, badge, gate alert, textarea, save row styles — all using CSS custom properties from index.css. Reuses `.btn` and `.settings-toast` classes from SettingsView.css (globally available since all views are eagerly imported in App.jsx).
- Build verified: `npm run build` passes (52 modules, 846ms — CSS grew to 12.67 KB with new view styles)

**Files created/modified:**
- `gtm-app/src/views/WeeklyReviewView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/WeeklyReviewView.css` (new)

### Task 8 — Weekly Review View Part 2: Trend Sparklines, Copy-to-Clipboard (2026-04-10)

**What was done:**
- Added `Sparkline` component — a pure SVG mini-chart that renders dots connected by a polyline, with a dashed horizontal target line. Takes `points` (array of `{value}`), `target`, optional `width`/`height`. Uses linear scaling with padding, inverts Y-axis for SVG coordinate space. Filters out boolean and currency metrics (only numeric metrics get sparklines).
- Trend section: Renders below the save button inside a `weekly-card`. Loads last 8 weeks of data from the same `loadMetrics()` call used for form pre-fill — rows are sorted by `weekOf` and sliced to the last 8. Each numeric metric gets its own sparkline in a 2-column CSS grid. Shows "Need at least 2 weeks of data" placeholder when insufficient history.
- Copy Summary button: Sits next to the Save button in the action row. Builds a plain-text summary with phase, week range, all metric values with targets and alert flags (`[AMBER]`/`[RED]`), cadence check status, blockers, priorities, and founder summary. Uses `navigator.clipboard.writeText()` with a 2-second "Copied!" confirmation state. Degrades silently if clipboard API is unavailable.
- Added CSS: `.weekly-copy-btn` with hover/copied states, `.trend-grid` (2-column grid), `.trend-item` (label + sparkline card), `.sparkline` SVG classes (`.sparkline__target` dashed line, `.sparkline__line` blue polyline, `.sparkline__dot` blue circles). All using existing CSS custom properties.
- Build verified: `npm run build` passes (52 modules, 698ms — CSS grew to 13.65 KB)

**Files modified:**
- `gtm-app/src/views/WeeklyReviewView.jsx` (added Sparkline component, trendRows/copied state, buildSummaryText, handleCopy, trend section JSX, copy button)
- `gtm-app/src/views/WeeklyReviewView.css` (added copy-button and sparkline/trend styles)

### Task 9 — Playbook View: Phase tabs, checklists, exit criteria, progress (2026-04-10)

**What was done:**
- Replaced PlaybookView placeholder with a full four-section view implementing spec Section 6.4
- Phase tab bar: Horizontal 4-tab bar (Phase 0–3), each showing phase number and week range. Defaults to `currentPhase` from config. Active tab highlighted with blue accent background and dot.
- Phase header card: Phase name, week range in mono font, and full objective text from `phaseChecklists.js`.
- Progress bar: Green fill bar showing exit criteria completion (done/total count, percentage). Animates on change via CSS transition.
- Infrastructure checklist: Rendered for phases that have infrastructure items (Phase 0 has 12). Checkboxes toggle local state and persist via `saveChecklistEntry()` which writes to the `phase_checklist` sheet tab (or queues offline). Items show strikethrough when completed. Notes displayed in muted italic.
- Week-by-week breakdown: Collapsible week cards for phases with `weekByWeek` data (Phase 0 has 4 weeks). Each card shows day, task description, and owner. Chevron toggle to expand/collapse. All expanded by default.
- Exit criteria: Items with green/grey status dots (green = completed, grey = pending). Checkboxes persist via `saveChecklistEntry()`. Phase 0 has 8 criteria, Phase 1 has 9, Phase 2 has 7, Phase 3 has 4.
- Advance button: Sits below exit criteria. Disabled (greyed, 50% opacity) until all exit criteria are checked. When enabled, updates `currentPhase` in config (both localStorage and remote), switches active tab, and shows a 3-second toast confirmation. Hidden on Phase 3 (no phase to advance to).
- Data loading: On mount, reads `currentPhase` from `getConfig()` for default tab, loads saved checklist state from `loadPhaseChecklist()` (remote or cache) to pre-fill checkboxes. Shows "Loading…" during init.
- Created PlaybookView.css: Tab bar (segmented control style), card layout, checklist with accent checkboxes, progress bar with green fill, week cards with collapsible headers, exit dots, advance button with disabled state — all using CSS custom properties.
- Build verified: `npm run build` passes (53 modules, 848ms — CSS grew to 18.44 KB with new view styles)

**Files created/modified:**
- `gtm-app/src/views/PlaybookView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/PlaybookView.css` (new)

### Task 10 — Content View Part 1: Calendar grid, status dropdowns, week nav (2026-04-10)

**What was done:**
- Replaced ContentView placeholder with a full Content Calendar view implementing spec Section 6.3 (Part 1 — calendar grid, status dropdowns, week navigation; briefs/add form deferred to Task 11)
- Week navigation: Prev/next arrows with Monday date display (`formatShort` for Monday, `formatDate` for Sunday range). "current" badge when viewing this week. Same `getMonday` pattern as WeeklyReviewView.
- Calendar grid: 7-column CSS grid (Mon–Sun). Each cell shows day abbreviation and date number in a header row, with content items stacked below. Today's column gets a highlighted background (`--bg-surface-hover`) and a blue circle on the date number. Empty days show at reduced opacity.
- Content items: Each item card shows a color-coded channel pill (LinkedIn #0A66C2, Instagram #E4405F, Email #14B8A6, Community #8B5CF6), post type, title (2-line clamp), and a status dropdown. Title and type gracefully handle missing data.
- Status dropdown: 6-state workflow (planned → drafted → in_review → approved → published → skipped). Each status has distinct color coding via CSS modifier classes (muted → blue → amber → green → green-bg → muted/dimmed). Changes trigger `saveContentEntry()` from dataLayer with optimistic UI update (state updates immediately, save fires async).
- Data loading: Loads all content via `loadContentCalendar()` on mount, filters client-side by week range (weekStart ≤ date ≤ weekEnd). Items grouped into `itemsByDate` map for O(1) per-day lookup.
- Empty state: When no content exists for the selected week, shows a centered card with placeholder message and hint text.
- Created ContentView.css: Header card, week nav (consistent with WeeklyReviewView pattern), 7-column grid with 2px gap borders, day cells with today highlighting, content item cards, channel pills, status dropdown with 6 color variants, empty state — all using CSS custom properties from index.css.
- Build verified: `npm run build` passes (54 modules, 1.25s — CSS grew to 22.23 KB with new view styles)

**Files created/modified:**
- `gtm-app/src/views/ContentView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/ContentView.css` (new)

---

## Decisions

1. **Repo structure:** ~~App code will live at `hoa/gtm/` (lowercase).~~ See Decision 3.
2. **Build sequence:** Following the 16-task checklist above, which groups static data files (Tasks 2-3) before the data layer (Task 4), allowing views to have real content from the start.
3. **App directory renamed to `gtm-app/`:** macOS APFS is case-insensitive, so `gtm/` and `GTM/` collide. Changed app directory from `gtm/` to `gtm-app/` to avoid the conflict. Spec docs remain at `GTM/`.
4. **create-vite v5 used:** Node 18.20.7 is incompatible with create-vite v9+ (requires Node >= 20.19.0). Used create-vite@5 which produces an identical React template.

---

## Issues

_(None so far)_
