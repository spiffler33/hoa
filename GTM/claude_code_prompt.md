# Claude Code — Build System

## Project: Yes Lifers GTM Operating System

## CRITICAL: How We Work

This project is built in small, discrete tasks. After EVERY task you must:

1. **Update `hoa/GTM/BUILD_LOG.md`** — Append what was built, what files were created/modified, any decisions made, any issues encountered
2. **Update your memory** with: current build phase, what's done, what's next, any architectural decisions or gotchas discovered
3. **Git commit and push** with a descriptive commit message
4. **Tell me** what was accomplished in 3–5 bullet points
5. **Confirm** it's safe to clear context
6. **Give me the exact prompt** to paste for the next task (self-contained, referencing the spec files)

**NEVER proceed to the next task without completing all 6 steps above.**

**NEVER try to build more than one task in a single context window.**

**Before starting any task, read `hoa/GTM/BUILD_LOG.md` first** to understand what's already been built and any prior decisions.

## Source of truth files (read these, don't modify)

- `hoa/GTM/gtm_content.md` — Complete GTM strategy & content (~12,700 words). All static content comes from here.
- `hoa/GTM/gtm_app_spec.md` — Full app specification (~4,100 words). Data model, views, components, design tokens, architecture.

## Repository structure

- Repo: `hoa` (private, GitHub)
- App lives at: `hoa/gtm/` (the React app)
- Spec files at: `hoa/GTM/` (uppercase — these are docs, not code)
- GitHub Pages will serve the app

---

## TASK 0 — Setup & Plan (START HERE)

Paste this as your first Claude Code message:

---

Read these files carefully:
- hoa/GTM/gtm_app_spec.md (full app specification)
- hoa/GTM/gtm_content.md (content & strategy document)

Then do the following:

1. Create `hoa/GTM/BUILD_LOG.md` with:
   - Project name and description (1 paragraph)
   - The task list below (copy it in as a checklist)
   - A "Decisions" section (empty for now)
   - An "Issues" section (empty for now)

2. Do NOT write any app code yet. Just create the BUILD_LOG.

3. Git commit and push.

4. Tell me what you understood about the project and confirm the task sequence.

5. Give me the exact prompt for Task 1.

Task checklist to put in BUILD_LOG:

- [ ] Task 0: Setup & plan
- [ ] Task 1: Scaffold — Vite + React + Router + CSS + Layout + Nav
- [ ] Task 2: Static data files — stageGates, cadence, phaseChecklists
- [ ] Task 3: Static data files — contentBriefs, referenceContent, killCriteria
- [ ] Task 4: Data layer — sheetsApi, localStore, offline fallback
- [ ] Task 5: Settings view — Sheet connection, phase config
- [ ] Task 6: Today view — Daily cadence, alerts, content due
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

## TASK 1 — Scaffold

---

Read hoa/GTM/BUILD_LOG.md first to see current state.
Read the design tokens from Section 2 of hoa/GTM/gtm_app_spec.md.
Read the component architecture from Section 7 of hoa/GTM/gtm_app_spec.md.

Task: Scaffold the React application.

1. Run `npm create vite@latest gtm -- --template react` inside the `hoa/` directory
2. Clean out default Vite boilerplate (remove App.css content, default markup)
3. Set up `index.css` with ALL CSS custom properties from the spec:
   - Colors: --bg-primary (#0F172A), --bg-surface (#1E293B), --bg-surface-hover (#334155), --text-primary (#F1F5F9), --text-secondary (#94A3B8), --text-muted (#64748B), --accent-blue (#3B82F6), --accent-blue-soft (#1E3A5F), --status-green (#22C55E), --status-amber (#F59E0B), --status-red (#EF4444), --border (#334155), --border-active (#3B82F6), plus dark background variants for status badges
   - Typography: DM Sans for --font-display and --font-body, JetBrains Mono for --font-mono
   - Base styles: dark background, light text, box-sizing border-box
4. Add Google Fonts link to index.html: DM Sans (400,500,700) and JetBrains Mono (400,500)
5. Install react-router-dom
6. Set up createHashRouter in App.jsx with 7 routes: /, /weekly-review, /content, /playbook, /control, /reference, /settings — each rendering a placeholder component that just shows the view name
7. Create Layout.jsx — sticky top nav bar + main content area (max-width 960px, centered)
8. Create NavBar.jsx — tab-style buttons for all 7 views. Active tab has --accent-blue bottom border. "Yes Lifers GTM" wordmark on the left.
9. Set base in vite.config.js — ask me what the exact base path should be for GitHub Pages
10. Verify: `npm run dev` works, all routes render, nav highlights correctly

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 2 prompt.

---

## TASK 2 — Static data: Stage gates, Cadence, Checklists

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Create 3 static data files. Read the specific sections referenced below from hoa/GTM/gtm_content.md.

1. Create `src/data/stageGates.js`
   Source: Sections 4.4, 4.13, 4.20, 4.27 of gtm_content.md
   Export an object keyed by phase ("phase_0", "phase_1", "phase_2", "phase_3")
   Each phase contains an array of metrics, each with:
   - id (string), label (string), target (number or string), unit (string — "%", "count", etc.)
   - amberThreshold (number), redThreshold (number)
   - amberAction (string — the prescribed action text from the doc)
   - redAction (string — the prescribed action text from the doc)
   - applicableFrom (which phase this metric starts being tracked)

2. Create `src/data/cadence.js`
   Source: Section 4.2 (Phase 0 week-by-week) and Section 4.7 (Phase 1 weekly rhythm)
   Export an object keyed by phase.
   - Phase 0: keyed by week number (1–4), then by day, containing task arrays
   - Phase 1+: keyed by day-of-week (mon–sun), containing task arrays
   Each task: { time, activity, owner, phase }

3. Create `src/data/phaseChecklists.js`
   Source: Sections 4.3, 4.5 (Phase 0), 4.14 (Phase 1), 4.21 (Phase 2), Appendix for Phase 3
   Export an object keyed by phase, each containing:
   - infrastructure: array of { id, item, notes? }
   - exitCriteria: array of { id, item }
   - objective: string (phase objective)
   - weeks: string (e.g., "1–4")
   - weekByWeek: (Phase 0 only) array of { week, title, tasks: [{day, task, owner}] }

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 3 prompt.

---

## TASK 3 — Static data: Content briefs, Reference content, Kill criteria

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Create 3 more static data files. Read the specific sections referenced below from hoa/GTM/gtm_content.md.

1. Create `src/data/contentBriefs.js`
   Source: Section 5 of gtm_content.md (entire Content Engine section)
   Export an object keyed by post type:
   - linkedin_philosophy: { channel, frequency, purpose, tone, structure (array of steps), template (the brief template text), examples (array of example posts), compliance notes }
   - linkedin_story: same structure
   - linkedin_framework: same structure, plus the 12-week rotation table
   - linkedin_engagement: same structure with example posts
   - instagram_carousel: { template, design notes, compliance }
   - instagram_reel: { template, compliance }
   - email_welcome_1 through email_welcome_4: { day, subject, content, cta }
   - community_say_yes: { prompts (array of 5 rotating prompts) }
   - community_hell_yes: { template text }
   - community_pod_checkin: { template text }

2. Create `src/data/referenceContent.js`
   Source: Sections 1, 2, 3, 6, 7, 9, 10, Appendices of gtm_content.md
   Export an array of sections, each with:
   - id, title, icon (unicode)
   - subsections: array of { id, title, content }
   Content can be: markdown strings for prose, or structured objects for tables
   Structure the tables as arrays of objects so the app can render them as HTML tables
   Sections: Compliance Framework, RACI Matrix, Content Briefs (cross-reference), Community Operations, Monetisation & Service Design, Tool Stack, Risks & Mitigations, Budget, Launch ICP & Wedge

3. Create `src/data/killCriteria.js`
   Source: Section 8.4 of gtm_content.md
   Export an array: { id, condition, signal, action, applicablePhase }

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 3 prompt.

---

## TASK 4 — Data layer

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 4 (Authentication & Sheets Connection) of hoa/GTM/gtm_app_spec.md.

Task: Build the data persistence layer.

1. Create `src/data/localStore.js`
   - getConfig(key), setConfig(key, value) — localStorage wrapper for app config
   - getCached(tab), setCached(tab, data) — cache sheet data
   - getWriteQueue(), addToWriteQueue(item), clearWriteQueue() — offline write queue
   - getDailyChecks(date), setDailyCheck(date, itemId, checked) — for Today view cadence checkboxes

2. Create `src/data/sheetsApi.js`
   - Reads the Apps Script URL from localStore config
   - readSheet(tab, params) — GET request, caches result on success, returns cache on failure
   - writeSheet(tab, data) — POST request, queues on failure
   - updateSheet(tab, id, data) — POST request with update action
   - syncQueue() — retries queued writes
   - isConnected() — returns connection status
   - All functions handle errors gracefully and return { data, fromCache, error }

3. Create the Google Apps Script file `hoa/GTM/appsscript.js` (for reference — user will paste this into their Sheet)
   - Copy the doGet/doPost template from Section 8 of gtm_app_spec.md
   - Add CORS headers
   - Add input validation

4. Create a React Context `src/data/AppContext.jsx`
   - Provides: currentPhase, phaseStartDate, connectionStatus, sheetUrl
   - Wraps the app in Layout.jsx
   - Loads config from localStorage on mount

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 5 prompt.

---

## TASK 5 — Settings view

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.7 (Settings View) of hoa/GTM/gtm_app_spec.md.

Task: Build the Settings view — the first functional view.

1. Build SettingsView.jsx with:
   - Apps Script URL input field + "Test Connection" button
   - Test reads the config tab and shows success (green) or failure (red) with error message
   - Current phase dropdown (Phase 0, 1, 2, 3)
   - Phase start date picker
   - "Save Settings" button (writes to localStorage + config sheet)
   - "View Google Sheet" link (opens in new tab)
   - Connection status indicator

2. Add a small connection status dot to the NavBar (green if connected, red if not, grey if never configured)

3. Verify: settings save to localStorage, test connection works with a real Google Sheet (or gracefully fails and shows error)

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 6 prompt.

---

## TASK 6 — Today view

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.1 (Today View) of hoa/GTM/gtm_app_spec.md.
You'll need the data files created in Tasks 2–4: stageGates.js, cadence.js, sheetsApi.js, localStore.js.

Task: Build the Today view — the default landing page.

1. Create shared components first:
   - StatusBadge.jsx — small pill showing GREEN/AMBER/RED with appropriate colors
   - AlertCard.jsx — expandable card showing metric name, value vs target, status, action text
   - ChecklistItem.jsx — checkbox + label + optional owner text in muted color

2. Build TodayView.jsx with these sections:
   - Header: greeting (time-based), current phase + week + day, days to next milestone
   - Alerts: read latest weekly_metrics from sheet (or cache), compare to stageGates, show AlertCards for amber/red. If all green: "All systems nominal"
   - Today's cadence: look up current phase + day in cadence.js, render ChecklistItems. State stored in localStorage via localStore.getDailyChecks()
   - Content due today: read content_calendar for today, show channel pill + title + status. (Will be fully wired in Task 10, for now show placeholder if no sheet data)
   - Priorities: from latest weekly_metrics.priorities (or "No weekly review yet — start one")
   - Poke list: items from content_calendar that are overdue (status=planned/drafted and date < today)

3. Make this the default route (/)

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 7 prompt.

---

## TASK 7 — Weekly Review (core)

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.2 (Weekly Review View) of hoa/GTM/gtm_app_spec.md.

Task: Build the Weekly Review view — the Monday morning ritual. Core form only (sparklines in Task 8).

1. Create MetricInput.jsx — number input with: label, input field, target display, auto-computed StatusBadge. Status computes on every keystroke by comparing value to thresholds from stageGates.js for the current phase.

2. Build WeeklyReviewView.jsx:
   - Week selector: defaults to current Monday. If a review exists for this week (from sheet), load values into form.
   - The Five Numbers: 5 MetricInput components. Metrics 3–5 disabled with "Phase 2+" label if current phase is 0 or 1.
   - Cadence Check: content buffer dropdown (0/1/2+), posts on schedule (yes/no), rituals completed (yes/no), pod check-in (yes/no). Each with StatusBadge.
   - Stage Gate Check: auto-generated AlertCards for any amber/red metrics. "All clear" if everything green.
   - Blockers, Priorities, Founder Summary: textareas
   - Save button: writes row to weekly_metrics sheet (append if new week, update if existing)
   - Success confirmation on save

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 8 prompt.

---

## TASK 8 — Weekly Review (sparklines + export)

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Add sparklines and copy-to-clipboard to the Weekly Review view.

1. Create SparkLine.jsx:
   - SVG component, 200px wide × 40px tall
   - Takes: data (array of numbers), target (number), color
   - Renders: polyline connecting data points, dashed horizontal line for target
   - Current (latest) value displayed in JetBrains Mono to the right of the sparkline
   - Handle empty data gracefully (show "No data yet")

2. Add Trend section to WeeklyReviewView:
   - Read last 8 rows from weekly_metrics sheet
   - Render SparkLine for each of the 5 metrics
   - Label each with metric name

3. Add "Copy to clipboard" button:
   - Formats the current review as plain text using the template from Section 8.2 of gtm_content.md
   - Uses navigator.clipboard.writeText()
   - Show "Copied!" confirmation for 2 seconds

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 9 prompt.

---

## TASK 9 — Playbook view

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.4 (Playbook View) of hoa/GTM/gtm_app_spec.md.
You'll need: phaseChecklists.js from Task 2.

Task: Build the Playbook view.

1. Build PlaybookView.jsx:
   - Phase tabs: 4 tabs. Current phase has solid style, others are outlined/dimmed.
   - Phase header: name, weeks, objective, progress bar (completed/total items, percentage in JetBrains Mono)
   - Infrastructure checklist: ChecklistItem components from phaseChecklists.js. Checkbox writes to phase_checklist sheet. Completed items get strikethrough + muted color.
   - Week-by-week tasks (Phase 0): collapsible sections per week. Current week expanded. Past weeks collapsed showing "3/5 complete" count.
   - Exit criteria: ChecklistItem components. Below the list: "Advance to Phase [N+1]" button, disabled unless ALL exit criteria checked. Click updates config.current_phase, refreshes app.

2. Progress bar component: simple horizontal bar, filled portion in --accent-blue, unfilled in --bg-surface-hover. Percentage label right-aligned.

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 10 prompt.

---

## TASK 10 — Content view (calendar)

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.3 (Content View) of hoa/GTM/gtm_app_spec.md.

Task: Build the Content view — calendar grid with status tracking.

1. Create WeekPicker.jsx — "◀ Week 21 | Week 22 — May 25–31 | Week 23 ▶"

2. Create ContentCard.jsx:
   - Channel pill (colored: LinkedIn=#3B82F6, Instagram=#F97316, Community=#8B5CF6, Email=#22C55E)
   - Post type label
   - Title/description text
   - Status dropdown: planned → drafted → in_review → approved → published → skipped
   - Compliance checkbox (only shown for linkedin and instagram channels)
   - Performance notes: small text input
   - Status changes write to content_calendar sheet

3. Build ContentView.jsx:
   - WeekPicker at top
   - Content items grouped by day (Mon–Sun), each day as a section header
   - ContentCard components under each day
   - Buffer status bar at bottom: count drafted/approved items in next 2 weeks, show status badge
   - Read from content_calendar sheet filtered by selected week

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 11 prompt.

---

## TASK 11 — Content view (briefs + forms)

---

Read hoa/GTM/BUILD_LOG.md first.
You'll need: contentBriefs.js from Task 3.

Task: Add content brief modals, add-content form, and pre-populate capability.

1. Create Modal.jsx — overlay component. Dark backdrop, centered card, close button. Used for brief viewing.

2. Add "View Brief" button to ContentCard. Opens Modal showing the full brief template from contentBriefs.js matched by post_type. Render template structure, example copy, compliance notes, CTA guidance.

3. Add "Add Content" button to ContentView. Opens a form (inline or modal):
   - Channel dropdown, Post type dropdown (filtered by channel), Day, Week, Title, Brief text
   - Save writes to content_calendar sheet

4. Add "Populate Next 8 Weeks" button (show in Settings or Content view):
   - Generates content_calendar rows for the next 8 weeks using the repeating weekly pattern from Appendix C of gtm_content.md
   - Each row gets: auto-generated id, week_of, day, channel, post_type, default title, status="planned"
   - Writes all rows to sheet in one batch
   - Only generates rows for weeks that don't already have entries

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 12 prompt.

---

## TASK 12 — Control view

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.5 (Control View) of hoa/GTM/gtm_app_spec.md.
You'll need: stageGates.js, killCriteria.js.

Task: Build the Control view — stage gates, kill criteria, funnel.

1. Build ControlView.jsx:
   - Phase header: current phase, week X of Y, days to exit
   - Stage Gates section: one row per metric for current phase. Shows: label, current value (from latest weekly_metrics), target, StatusBadge. Amber/red rows are expandable showing action text.
   - Supplementary metrics input: some stage gate metrics (pod enrolments, wedge fit %, organic referrals) aren't in the weekly review. Add small input fields here. Store in localStorage or supplementary sheet columns.
   - Kill Criteria section: list from killCriteria.js. Each shows condition, status (✓ passing / ✗ failing / — not testable yet), signal. Auto-computed where possible, otherwise manual toggle.
   - Funnel Model section: simple text cascade. Waitlist→Community, Community→App, App→Snapshot, Snapshot→Paid, Paid→Advisory. Computed from cumulative metrics. "—" for inactive stages.

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 13 prompt.

---

## TASK 13 — Reference view (static content)

---

Read hoa/GTM/BUILD_LOG.md first.
Read Section 6.6 (Reference View) of hoa/GTM/gtm_app_spec.md.
You'll need: referenceContent.js from Task 3.

Task: Build the Reference view — accordion sections with static content.

1. Create Accordion.jsx — collapsible section. Click header to expand/collapse. Chevron rotates. Smooth height transition.

2. Build ReferenceView.jsx:
   - All sections from referenceContent.js as Accordion components
   - All collapsed by default
   - Tables: styled HTML tables (dark theme, borders, JetBrains Mono for numbers)
   - Prose: paragraphs with proper spacing
   - Lists: styled lists

3. Sections: Compliance Framework, RACI Matrix, Content Briefs, Community Operations, Monetisation & Service Design, Tool Stack, Risks & Mitigations, Budget, Launch ICP & Wedge

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 14 prompt.

---

## TASK 14 — Reference view (interactive sections)

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Add interactive elements to the Reference view.

1. Partnership tracker (inside Reference, under "Partnerships" accordion):
   - Read from partnerships sheet tab
   - Cards: name, type pill, status dropdown, contact, next action
   - Status dropdown writes to sheet
   - "Add Partnership" form

2. Compliance pre-publication checklist (inside Compliance Framework accordion):
   - Interactive checkboxes for Section 3.7 items
   - "Ready to publish" indicator when all checked
   - "Log check" button → writes to compliance_log sheet
   - Reset after logging

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 15 prompt.

---

## TASK 15 — Polish

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Polish the entire app.

1. Responsive at 375px: nav collapses, tables scroll, cards full width, modals full screen
2. Transitions: subtle fade-in on card mount (opacity + translateY, 150ms, CSS only)
3. Loading: skeleton pulse on sheet data loading
4. Error: amber banner "Offline — showing cached data" when disconnected
5. Empty states: helpful messages when no data exists
6. Nav alert dot: colored dot on "Today" tab if any metric is amber/red
7. Verify: all status colors match tokens, fonts load, no console errors

Then: update BUILD_LOG.md, commit, push, tell me what was done, confirm context clear is safe, give me Task 16 prompt.

---

## TASK 16 — Deployment

---

Read hoa/GTM/BUILD_LOG.md first.

Task: Deploy to GitHub Pages.

1. Confirm vite.config.js base path (ask me if unsure)
2. npm run build
3. Set up gh-pages deployment (npm package or GitHub Actions — ask me which I prefer)
4. Deploy and verify: all routes, fonts, sheet connection, all views
5. Run full QA checklist:
   - [ ] All 7 views render
   - [ ] Hash routing works
   - [ ] Sheet read/write works
   - [ ] Offline fallback works
   - [ ] Stage gate badges compute correctly
   - [ ] Content calendar loads
   - [ ] Phase advancement works
   - [ ] Weekly review save/load works
   - [ ] Today view shows correct cadence
   - [ ] Brief modals work
   - [ ] Reference accordions work
   - [ ] Partnership tracker works
   - [ ] Responsive at 375px
   - [ ] No console errors
   - [ ] Fonts correct
6. Update BUILD_LOG.md with deployment URL and QA results
7. Final commit and push

---

## QUICK REFERENCE — Design Tokens

If Claude Code loses context, paste this with any task prompt:

```
BG: #0F172A (primary), #1E293B (surface), #334155 (hover)
Text: #F1F5F9 (primary), #94A3B8 (secondary), #64748B (muted)
Accent: #3B82F6 (blue), #1E3A5F (blue-soft)
Status: #22C55E (green), #F59E0B (amber), #EF4444 (red)
Status BG: #052E16 (green), #451A03 (amber), #450A0A (red)
Border: #334155 (default), #3B82F6 (active)
Fonts: DM Sans (display+body), JetBrains Mono (numbers)
Max-width: 960px. Card radius: 10px. Card padding: 16-20px.
Router: createHashRouter (NOT BrowserRouter)
```
