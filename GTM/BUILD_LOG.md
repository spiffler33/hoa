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
- [ ] Task 7: Weekly Review view — Metric input, status badges, save
- [ ] Task 8: Weekly Review view — Trend sparklines, copy-to-clipboard
- [ ] Task 9: Playbook view — Phase tabs, checklists, exit criteria, progress
- [ ] Task 10: Content view — Calendar grid, status dropdowns, week nav
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

---

## Decisions

1. **Repo structure:** ~~App code will live at `hoa/gtm/` (lowercase).~~ See Decision 3.
2. **Build sequence:** Following the 16-task checklist above, which groups static data files (Tasks 2-3) before the data layer (Task 4), allowing views to have real content from the start.
3. **App directory renamed to `gtm-app/`:** macOS APFS is case-insensitive, so `gtm/` and `GTM/` collide. Changed app directory from `gtm/` to `gtm-app/` to avoid the conflict. Spec docs remain at `GTM/`.
4. **create-vite v5 used:** Node 18.20.7 is incompatible with create-vite v9+ (requires Node >= 20.19.0). Used create-vite@5 which produces an identical React template.

---

## Issues

_(None so far)_
