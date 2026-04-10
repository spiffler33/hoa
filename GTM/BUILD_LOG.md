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
- [x] Task 11: Content view — Brief modals, add content form, buffer status
- [x] Task 12: Control view — Stage gates, kill criteria, funnel model
- [x] Task 13: Reference view — Accordion sections, static content rendering
- [x] Task 14: Reference view — Interactive partnerships + compliance checklist
- [x] Task 15: Polish — Responsive, transitions, loading/error/empty states
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

### Task 11 — Content View Part 2: Brief modals, add content form, buffer status (2026-04-10)

**What was done:**
- Added `BriefModal` component — opens when clicking "Brief" button on any content item card. Looks up the content brief from `contentBriefs.js` via two-level find: channel (lowercased) → formats[].type (case-insensitive match against post_type). Displays purpose, tone, structure (ordered list), brief template (key/value definition list with field names highlighted in blue), and type-specific extras: LinkedIn example posts + engagement examples, community rotating prompts, email welcome drip sequence. Read-only. Closes on overlay click or Escape key.
- Added `AddContentModal` component — modal form with channel dropdown (LinkedIn, Instagram, Email, Community), post type dropdown (dynamically filtered by selected channel from contentBriefs format definitions), date picker (constrained to viewed week's Mon–Sun range, defaults to next empty day), title text input, and status dropdown (6 states). Channel change auto-resets post type to first available format. Saves new item via `saveContentEntry()` from dataLayer (optimistic UI — item appears immediately in calendar, remote save async). New items get `local_` prefixed IDs so dataLayer uses `action: 'write'`.
- Added buffer status bar — card below calendar grid with two rows: "This week: X/Y drafted" (counts items with status drafted/in_review/approved/published vs total) and "Buffer: N items across M weeks ahead" with a traffic-light dot (green for 2+ weeks, amber for 1 week, red for 0). Future buffer filters all items after viewed week with status "drafted" or "approved", counts distinct week groups.
- Added helper functions: `findBrief()` (channel+type lookup), `getPostTypes()` (channel→format types), `formatPostType()` (camelCase→Title Case), `getNextEmptyDay()` (smart day picker default), `norm()` (status normalisation).
- Updated CSS with modal overlay (fixed full-screen, 60% black backdrop), modal container (560px max, 80vh scrollable), brief sections (purpose/tone/structure/template with definition list layout), example blockquotes (blue left border), form fields (mono font inputs, vertical label layout), buffer status bar (label/stat rows with traffic-light dots), and "Brief" button on content items (mono font, hover-to-blue).
- Build verified: `npm run build` passes (55 modules, 1.35s — CSS grew from 22.23 KB to 27.37 KB with modal/form/buffer styles)

**Files modified:**
- `gtm-app/src/views/ContentView.jsx` (added contentBriefs import, BriefModal + AddContentModal subcomponents, buffer computation, brief/add state, View Brief button in calendar items, buffer status bar, add content button + modals)
- `gtm-app/src/views/ContentView.css` (added ~220 lines: modal overlay/container, brief meta/section/template/example/email styles, content item row + brief button, buffer status bar, add content form)

### Task 12 — Control View: Stage gates, kill criteria, funnel model (2026-04-10)

**What was done:**
- Replaced ControlView placeholder with a three-panel read-only alarm view implementing spec Section 6.5
- Phase header card: Current phase label (from config), computed week number and weeks remaining (from `phaseStartDate` + `phaseChecklists` week ranges), summary badges counting red/amber/green metrics
- Stage Gates panel: Renders all metrics from `stageGates.js` for the current phase (5 for Phase 0, 8 for Phase 1, 6 for Phase 2, 10 for Phase 3). Metrics grouped by semantic category (Growth, Engagement, Distribution, Validation, Activation, Revenue, Retention, Satisfaction) using an ID→category mapping. Each metric shows label, target, latest value (from most recent `loadMetrics` row), unit, and a traffic-light badge using the same `alertLevel()` threshold logic as WeeklyReviewView. Amber/red metrics show prescribed action text inline with a subtle colored background.
- Kill Criteria panel: Renders all 5 kill criteria from `killCriteria.js`. Each card shows condition, signal description, and prescribed action. Three-state status system: `triggered` (red 2px border + red background when a related metric is at red alert), `clear` (green checkmark when related metrics have data and none are red), `pending` (muted + "Not yet testable" when no metric data exists). Cross-phase matching via `KILL_METRIC_MAP` maps each kill criterion to its related stage gate metric IDs.
- Funnel Model panel: Five-stage horizontal flow (Awareness → Waitlist → Community → Active Users → Paying) with bordered stage cards and arrow separators. Each stage shows a label and a value slot — populated from the best matching metric when data is available, otherwise displays an em-dash placeholder. Wraps on smaller viewports.
- Data loading: `Promise.all` for `loadConfig` + `loadMetrics` on mount. Latest values extracted by sorting all metric rows by `weekOf` descending and taking the first row.
- Created ControlView.css: Header card, summary badges (red/amber/green with status-colored backgrounds), panel sections, category groups with labeled separators, metric rows with hover states and amber/red backgrounds, traffic-light badge dots with box-shadow glow, kill criteria cards with three-state borders and status dot indicators, funnel stage cards with arrows — all using CSS custom properties from index.css.
- Build verified: `npm run build` passes (57 modules, 1.00s — CSS grew from 27.37 KB to 32.80 KB with new view styles)

**Files modified:**
- `gtm-app/src/views/ControlView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/ControlView.css` (new)

### Task 13 — Reference View Part 1: Accordion sections, static content rendering (2026-04-10)

**What was done:**
- Replaced ReferenceView placeholder with a full accordion-based reference library implementing spec Section 6.6 (Part 1 — static content rendering; interactive partnerships + compliance checklist deferred to Task 14)
- Pill navigation bar: Horizontal scrollable bar with 6 pills (Launch ICP & Wedge, Operating Model & Ownership, Compliance Framework, Community Structure & Rituals, Monetisation & Service Design, Community Vocabulary). Active pill highlighted with blue accent background and blue border. Clicking a pill opens that section and scrolls to it smoothly.
- Accordion sections: 6 collapsible sections rendered from all keys in `referenceContent.js` (icp, roles, compliance, community, monetisation, vocabulary). Single-expand behavior — only one section open at a time. Open section gets a blue outline glow. Each header shows a chevron indicator (▸/▾), section title, and subsection count badge in mono font.
- Subsection rendering: Within each expanded section, subsections render with a blue-accented heading and body content. String content renders as a paragraph. Array content renders as a styled bullet list with custom dot markers. Subsections separated by subtle dividers.
- Vocabulary section: 10 terms from Appendix A rendered as a definition list. Each entry is a card with a blue left border, term in mono font (fixed width) and definition alongside. Terms split from definitions on the " — " separator.
- Created ReferenceView.css: Pill bar (horizontal scroll, rounded pills with active state), accordion sections (card style with hover headers), chevron + count badge, subsection layout (heading + body + list), definition list entries (card with blue left border), all using CSS custom properties from index.css.
- Build verified: `npm run build` passes (59 modules, 1.15s — CSS grew from 32.80 KB to 35.52 KB with new view styles)

**Files modified:**
- `gtm-app/src/views/ReferenceView.jsx` (modified — placeholder → full view)
- `gtm-app/src/views/ReferenceView.css` (new)

### Task 14 — Reference View Part 2: Interactive partnerships + compliance checklist (2026-04-10)

**What was done:**
- Added interactive pre-publication compliance checklist within the Compliance Framework section. The 8-item checklist from `compliance_checklist` subsection now renders as clickable checkboxes instead of static bullets. Each toggle saves to the `compliance_log` sheet tab via `saveChecklistEntry()` with `tab: 'compliance_log'`. Saved state loaded on mount via `loadPhaseChecklist({ tab: 'compliance_log' })`. Shows a completion badge ("5/8 checked") in mono font with blue background, and a "Clear All" reset button (disabled when nothing checked). Checked items show strikethrough and reduced opacity.
- Added interactive partnership tracker within the Community section. Loads partnership data from the `partnerships` sheet tab via new `loadPartnerships()` dataLayer function. Each partnership renders as a card with name (bold), type (mono font label), status badge (inline dropdown with color coding: prospect=muted, active=green, completed=blue), and notes. Left border color reflects status. Inline status updates — changing the dropdown immediately saves via `savePartnership()`.
- Added "+ Add Partnership" button that opens a modal form with name text input, type dropdown (Co-branded content, Cross-pollination, Corporate tie-in, Podcast/media, Other), status dropdown (prospect/active/completed), and notes textarea. Modal closes on overlay click or Escape key. New partnerships get `local_` prefixed IDs for offline-first write-through. Save button disabled until name is filled.
- Extended sheetsApi.js with `fetchPartnerships()` and `savePartnershipItem()` — same pattern as existing fetch/save functions, targeting the `partnerships` sheet tab.
- Extended dataLayer.js with `loadPartnerships()` (read-through cache) and `savePartnership()` (write-through with offline queue). Modified `loadPhaseChecklist()` and `saveChecklistEntry()` to accept an optional `tab` parameter (defaults to `phase_checklist`), enabling reuse for `compliance_log` without duplicating the read/write pipeline.
- Updated ReferenceView.css with ~180 lines: compliance checklist (header with count badge + clear button, checkbox items with hover/checked states), partnership cards (status-colored left borders, inline status dropdown with three color variants), partnership modal form (field labels, inputs, focus states, actions row).
- Build verified: `npm run build` passes (59 modules, 1.15s — CSS grew from 35.52 KB to 39.36 KB with interactive component styles)

**Files modified:**
- `gtm-app/src/utils/sheetsApi.js` (added fetchPartnerships, savePartnershipItem; modified fetchPhaseChecklist + saveChecklistItem to support tab parameter)
- `gtm-app/src/utils/dataLayer.js` (added loadPartnerships, savePartnership; modified loadPhaseChecklist + saveChecklistEntry to support tab parameter)
- `gtm-app/src/views/ReferenceView.jsx` (added useEffect, dataLayer imports, compliance checklist state/handlers/renderer, partnership state/handlers/tracker/modal)
- `gtm-app/src/views/ReferenceView.css` (added compliance checklist, partnership tracker, partnership card, and modal form styles)

### Task 15 — Polish: Responsive, Transitions, Loading/Error/Empty States (2026-04-10)

**What was done:**
- Created shared `LoadingSpinner` component — CSS-animated ring spinner (border-top trick with `@keyframes spin`) with optional label text. Uses `--accent-blue` for the spinning arc and `--border` for the track. Centered flex layout with 28px ring and mono-font label.
- Created shared `EmptyState` component — icon + message + optional hint + optional action button. Supports a `variant="error"` mode that adds a red border and red-bg background for retry-able error cards. Used across all views to replace inline text.
- Added responsive breakpoints to `index.css` (global) and all 7 view CSS files:
  - **Tablet (≤768px):** CSS custom properties overridden on `:root` (reduced `--card-padding` to 12px, `--section-gap` to 16px, `--page-padding-x` to 16px). Navbar wordmark hidden, tab font reduced. Content calendar grid → single column. Trend sparklines → single column. Playbook tabs → 2×2 wrap. Funnel model → vertical stack with rotated arrows. Reference definition list → stacked. Settings fields stack vertically.
  - **Mobile (≤480px):** Further reduced padding/gaps. Root font-size to 12px. Navbar tabs shrunk to 11px/5px padding. All modals go full-screen (border-radius: 0, max-height: 100%). Playbook tabs → single column. Metric rows stack vertically. Form action buttons go full-width. Kill criteria padding-left removed.
- Added transition and animation polish across all views:
  - **Global keyframes:** `fadeIn` (opacity), `scaleIn` (opacity + scale + translateY), `slideDown` (opacity + translateY), `spin` (rotate).
  - **Accordion expand/collapse:** `animation: slideDown 0.2s ease` on `.ref-section__body` (ReferenceView) and `.playbook-week__tasks` (PlaybookView) for smooth open animation.
  - **Card hover lift:** Subtle `box-shadow: 0 2px 8px` on `.today-card`, `.weekly-card`, `.playbook-card`, `.settings-card`, `.control-panel` hover. Interactive cards (`.content-item`, `.control-kill`, `.partnership-card`) get `translateY(-1px)` + shadow on hover.
  - **Badge/status transitions:** `transition: background-color 0.3s ease` on all traffic-light dots (`.dot--green/amber/red/none`), control badges, buffer dots, status dropdowns (color + border-color + background-color).
  - **Modal open/close:** `animation: fadeIn 0.15s` on overlay, `animation: scaleIn 0.2s` on modal container. Applied to both ContentView modals and shared `.modal-overlay`/`.modal-container`.
  - **Nav tab active state:** Added `background: rgba(59, 130, 246, 0.06)` to `.navbar-tab--active` and `background-color 0.15s` to the tab transition list for a subtle fade effect.
  - **Funnel stage hover:** Border-color + box-shadow on `.control-funnel__stage:hover`.
- Replaced all "Loading…" text across 5 views (Today, Weekly Review, Playbook, Content, Control) with `<LoadingSpinner />` component.
- Replaced all inline empty-state messages across 6 views with `<EmptyState />` component, providing contextual icons and messages.
- Added error state handling (`error` useState + try/catch) to all 5 data-loading views. On load failure, shows a retry-able `<EmptyState variant="error" />` with warning icon, error message, and "Retry" button that re-triggers the load function.
- Added shared modal base styles (`.modal-overlay`, `.modal-container`) to `index.css` — fixes the unstyled partnership modal in ReferenceView that was using these classes without CSS.
- Build verified: `npm run build` passes (63 modules, 869ms — CSS grew from 39.36 KB to 46.72 KB with responsive, transition, and component styles)

**Files created:**
- `gtm-app/src/components/LoadingSpinner.jsx` (new)
- `gtm-app/src/components/LoadingSpinner.css` (new)
- `gtm-app/src/components/EmptyState.jsx` (new)
- `gtm-app/src/components/EmptyState.css` (new)

**Files modified:**
- `gtm-app/src/index.css` (added nav tab active bg, transition list, keyframes, shared dot transitions, modal base, tablet + mobile breakpoints)
- `gtm-app/src/views/TodayView.jsx` (added LoadingSpinner/EmptyState imports, error state + useCallback init, replaced loading/empty/error displays)
- `gtm-app/src/views/TodayView.css` (added card hover, alert detail animation, status badge transition, tablet + mobile breakpoints)
- `gtm-app/src/views/WeeklyReviewView.jsx` (added LoadingSpinner/EmptyState imports, error state, replaced loading/empty displays)
- `gtm-app/src/views/WeeklyReviewView.css` (added card hover, badge transition, tablet + mobile breakpoints)
- `gtm-app/src/views/PlaybookView.jsx` (added LoadingSpinner/EmptyState imports, error state + useCallback init, replaced loading display)
- `gtm-app/src/views/PlaybookView.css` (added card hover, progress fill transition, week tasks animation, tablet + mobile breakpoints)
- `gtm-app/src/views/ContentView.jsx` (added LoadingSpinner/EmptyState imports, error state, replaced loading/empty displays)
- `gtm-app/src/views/ContentView.css` (added modal animation, content item hover lift, status/buffer dot transitions, tablet + mobile breakpoints)
- `gtm-app/src/views/ControlView.jsx` (added LoadingSpinner/EmptyState imports, error state + useCallback init, replaced loading/empty displays)
- `gtm-app/src/views/ControlView.css` (added panel hover, badge/kill/funnel transitions, tablet + mobile breakpoints)
- `gtm-app/src/views/ReferenceView.jsx` (added EmptyState import, replaced partnership empty state)
- `gtm-app/src/views/ReferenceView.css` (added accordion animation, partnership card hover lift, status transition, tablet + mobile breakpoints)
- `gtm-app/src/views/SettingsView.css` (added card hover, tablet + mobile breakpoints)

---

## Decisions

1. **Repo structure:** ~~App code will live at `hoa/gtm/` (lowercase).~~ See Decision 3.
2. **Build sequence:** Following the 16-task checklist above, which groups static data files (Tasks 2-3) before the data layer (Task 4), allowing views to have real content from the start.
3. **App directory renamed to `gtm-app/`:** macOS APFS is case-insensitive, so `gtm/` and `GTM/` collide. Changed app directory from `gtm/` to `gtm-app/` to avoid the conflict. Spec docs remain at `GTM/`.
4. **create-vite v5 used:** Node 18.20.7 is incompatible with create-vite v9+ (requires Node >= 20.19.0). Used create-vite@5 which produces an identical React template.

---

## Issues

_(None so far)_
