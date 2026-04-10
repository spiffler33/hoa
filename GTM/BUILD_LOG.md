# Yes Lifers — GTM Operating System: Build Log

A single-page React application that serves as the daily operating cockpit for the GTM Lead running the Yes Lifers go-to-market. Built with Vite + React + React Router (hash), styled with vanilla CSS (dark theme, mission-control aesthetic), and backed by Google Sheets via Apps Script. Hosted on GitHub Pages. The app enforces daily/weekly discipline through cadence checklists, metric tracking with traffic-light alerts, phase playbooks, content calendar management, stage gate monitoring, and a reference library — all drawn from the companion strategy document (`gtm_content.md`).

---

## Task Checklist

- [x] Task 0: Setup & plan
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

---

## Decisions

1. **Repo structure:** App code will live at `hoa/gtm/` (lowercase). Spec/docs remain at `hoa/GTM/` (uppercase).
2. **Build sequence:** Following the 16-task checklist above, which groups static data files (Tasks 2-3) before the data layer (Task 4), allowing views to have real content from the start.

---

## Issues

_(None so far)_
