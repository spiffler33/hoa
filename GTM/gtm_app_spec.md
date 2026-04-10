# Yes Lifers — GTM Operating System: Application Specification

## For Claude Code

Version 1.0 · April 2026

---

## 1. WHAT THIS IS

A single-page React application that serves as the daily operating cockpit for one person (the GTM Lead) running the Yes Lifers go-to-market. It is not a dashboard. It is not an analytics tool. It is a **discipline engine** — it tells you what to do, checks if you did it, and only raises alarms when something is off-track.

**The user opens this app every morning and answers one question: "What do I need to do today, and is anything broken?"**

### Primary user
One person — the GTM Lead. They update it, they read it, they act from it. No multi-user collaboration needed initially.

### Hosting
GitHub Pages. Static React SPA. No server.

### Data persistence
Google Sheets as the backend via Google Sheets API (v4). One spreadsheet, multiple tabs. The app reads and writes to the sheet. This gives persistence, version history, portability, and the option to share a read-only link to investors later.

### Content source
The companion document `gtm_content.md` contains all strategy content, playbooks, briefs, compliance checklists, and stage gate definitions. The app renders this content in the appropriate views. Some content is static (rendered from markdown or hardcoded). Some content is dynamic (metrics, status, dates).

---

## 2. DESIGN DIRECTION

### Aesthetic
**Operational, not decorative.** Think mission control, not marketing site. The feel is: calm, structured, information-dense but not cluttered. Dark mode by default (the user works in this daily, often early morning). Inspired by linear.app's clarity and Vercel's dashboard density.

### Design tokens

```
Colors:
  --bg-primary: #0F172A          (deep navy — main background)
  --bg-surface: #1E293B          (card/panel background)
  --bg-surface-hover: #334155    (hover/active state)
  --bg-elevated: #0F172A         (modals, overlays)

  --text-primary: #F1F5F9        (main text)
  --text-secondary: #94A3B8      (supporting text, labels)
  --text-muted: #64748B          (timestamps, metadata)

  --accent-blue: #3B82F6         (primary actions, links)
  --accent-blue-soft: #1E3A5F    (selected states)

  --status-green: #22C55E        (on track)
  --status-green-bg: #052E16     (green badge background)
  --status-amber: #F59E0B        (needs attention)
  --status-amber-bg: #451A03     (amber badge background)
  --status-red: #EF4444          (off track)
  --status-red-bg: #450A0A       (red badge background)

  --border: #334155              (subtle borders)
  --border-active: #3B82F6       (focus/active borders)

Typography:
  --font-display: 'DM Sans', sans-serif    (headings, labels)
  --font-body: 'DM Sans', sans-serif       (body text)
  --font-mono: 'JetBrains Mono', monospace (metrics, numbers, code)

  Sizes: 11px (metadata), 13px (body), 14px (labels), 16px (section heads), 20px (page titles), 28px (main title)

Spacing:
  Base unit: 4px
  Card padding: 16px–20px
  Section gap: 24px–32px
  Page padding: 24px horizontal, 32px vertical

Radius:
  Cards: 10px
  Badges: 4px
  Buttons: 6px
```

### Typography
Use DM Sans for everything except numbers/metrics (JetBrains Mono). Load from Google Fonts CDN.

### Layout
Max-width: 960px, centered. Single column with cards. No sidebar (screen real estate matters on laptop). Navigation via a sticky top bar with tab-style buttons.

---

## 3. GOOGLE SHEETS DATA MODEL

One Google Spreadsheet with the following tabs (worksheets):

### Tab: `weekly_metrics`

Stores the "5 numbers that matter" plus cadence checks, entered weekly.

| Column | Type | Description |
|---|---|---|
| week_of | date | Monday of the week (ISO format) |
| phase | string | "phase_0", "phase_1", "phase_2", "phase_3" |
| new_leads | number | Email signups + quiz completions this week |
| community_wau | number | Weekly active users (%) |
| community_to_app | number | Members who started the app this week |
| snapshots_completed | number | Snapshot completions this week |
| plans_purchased | number | Paid plans this week |
| content_buffer_weeks | number | Weeks of content ahead (0, 1, 2+) |
| posts_on_schedule | boolean | All scheduled posts published? |
| rituals_completed | boolean | All community rituals happened? |
| pod_checkin_done | boolean | Pod activity checked? |
| blockers | text | Free text — what's stuck |
| priorities | text | Free text — top 3 this week |
| founder_summary | text | Free text — 3 sentences for founder |
| notes | text | Free text — anything else |

### Tab: `content_calendar`

Stores the content calendar with status tracking.

| Column | Type | Description |
|---|---|---|
| id | string | Auto-generated (e.g., "2026-W22-linkedin-mon") |
| week_of | date | Monday of the week |
| day | string | "mon", "tue", "wed", "thu", "fri", "sat", "sun" |
| channel | string | "linkedin", "instagram", "community", "email" |
| post_type | string | "philosophy", "story", "framework", "engagement", "carousel", "reel", "stories", "say_yes_moment", "hell_yes_thread", "clarity_circle", "newsletter" |
| title | text | Working title or brief reference |
| brief | text | Content brief (from Section 5 templates) |
| status | string | "planned", "drafted", "in_review", "approved", "published", "skipped" |
| compliance_checked | boolean | Passed compliance checklist? |
| performance_notes | text | Engagement rate, impressions, notable results |
| published_url | text | Link to published post (optional) |

### Tab: `phase_checklist`

Stores the infrastructure checklist and exit criteria per phase.

| Column | Type | Description |
|---|---|---|
| phase | string | "phase_0", "phase_1", "phase_2", "phase_3" |
| type | string | "infrastructure", "exit_criteria", "stage_gate" |
| item | text | Description of the checklist item |
| completed | boolean | Done? |
| completed_date | date | When completed |
| notes | text | Any notes |

### Tab: `raci`

Stores the RACI matrix. Mostly static, but allows updates as roles change.

| Column | Type | Description |
|---|---|---|
| workstream | string | e.g., "content_calendar", "community_ops", "compliance" |
| gtm_lead | string | "R", "A", "C", "I", or combinations like "R,A" |
| founder | string | Same |
| community_mgr | string | Same |
| content_producer | string | Same |
| compliance | string | Same |

### Tab: `compliance_log`

Tracks compliance reviews and flags.

| Column | Type | Description |
|---|---|---|
| date | date | Date of review or flag |
| type | string | "pre_publication", "community_audit", "testimonial_review", "quarterly_review" |
| item | text | What was reviewed |
| status | string | "approved", "flagged", "revised", "escalated" |
| notes | text | Details |
| reviewer | string | Who reviewed |

### Tab: `partnerships`

Tracks partnership outreach and status.

| Column | Type | Description |
|---|---|---|
| name | string | Partner name |
| type | string | "creator", "cross_pollination", "corporate", "podcast" |
| status | string | "identified", "outreach_sent", "in_conversation", "confirmed", "completed", "declined" |
| contact | text | Contact details |
| outreach_date | date | When first contacted |
| next_action | text | What's next |
| notes | text | Details |
| result | text | Outcome — impressions, signups attributed, etc. |

### Tab: `config`

Stores app configuration and targets.

| Column | Type | Description |
|---|---|---|
| key | string | Config key |
| value | string | Config value |

Initial values:
- `current_phase`: "phase_0"
- `phase_0_start_date`: (set when GTM starts)
- `target_new_leads_weekly`: (varies by phase — store per-phase targets)
- `target_wau_pct`: "40"
- `target_community_to_app_weekly`: (Phase 2+)
- `target_snapshots_weekly`: (Phase 2+)
- `target_plans_weekly`: (Phase 2+)
- `amber_threshold_*` and `red_threshold_*` for each metric (from Section 4 stage gates)

---

## 4. AUTHENTICATION & SHEETS CONNECTION

### Google Sheets API setup

The app uses a **Google API key** (for read) and **OAuth 2.0** (for write) to connect to the user's spreadsheet.

Simpler alternative for v1: Use a **service account** with editor access to the spreadsheet, and proxy writes through a tiny Google Apps Script web app (deployed as a web app from the Sheet itself). This avoids OAuth complexity and works on GitHub Pages.

**Recommended approach for GitHub Pages:**

1. Create the Google Sheet with the tabs above
2. Deploy a Google Apps Script as a web app (doPost/doGet) that reads/writes to the sheet
3. The React app calls the Apps Script URL for all data operations
4. No API key exposed in client code — the Apps Script handles auth
5. The Apps Script URL is stored in a `.env` or config file (not committed to repo)

This is the simplest path that works on GitHub Pages with zero backend.

### Apps Script endpoints needed:

```
GET  /exec?action=read&tab=weekly_metrics          → returns all rows
GET  /exec?action=read&tab=weekly_metrics&latest=1  → returns latest row
GET  /exec?action=read&tab=content_calendar&week=2026-W22 → returns rows for week
GET  /exec?action=read&tab=config                   → returns all config
POST /exec  { action: "write", tab: "weekly_metrics", data: {...} }
POST /exec  { action: "write", tab: "content_calendar", data: {...} }
POST /exec  { action: "update", tab: "content_calendar", id: "...", data: {...} }
POST /exec  { action: "update", tab: "phase_checklist", phase: "phase_0", item: "...", completed: true }
```

---

## 5. APP STRUCTURE & NAVIGATION

### Top-level navigation (sticky top bar)

```
[Yes Lifers GTM]    [Today] [Weekly Review] [Content] [Playbook] [Control] [Reference]
                                                                              [⚙ Settings]
```

Seven views. The user spends 80% of their time in **Today** and **Weekly Review**. The rest are reference and input views.

---

## 6. VIEW SPECIFICATIONS

### 6.1 TODAY VIEW (default landing)

**Purpose:** "What do I need to do today?" Cadence enforcement. Opens every morning.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ Good morning. Phase 0 — Week 2, Day 3 (Wednesday)│
│ 18 days to Phase 1 target                        │
├──────────────────────────────────────────────────┤
│ ⚠ 1 AMBER ALERT                                 │
│ ┌────────────────────────────────────────────┐   │
│ │ Quiz completions at 45 (target: 100 by     │   │
│ │ Week 3). Action: Check funnel — is the     │   │
│ │ quiz being found? Is completion rate ok?    │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ TODAY'S CADENCE                                  │
│ ┌────────────────────────────────────────────┐   │
│ │ ☐ LinkedIn story post — publish by noon    │   │
│ │ ☐ Say Yes Moment prompt — post in community│   │
│ │ ☐ Content production review — next week    │   │
│ │   ready?                                   │   │
│ │ ☐ Hell Yes! Decision Thread (bi-weekly)    │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ CONTENT DUE TODAY                                │
│ ┌────────────────────────────────────────────┐   │
│ │ LinkedIn — Story post                      │   │
│ │ Status: drafted → [Mark as published ▼]    │   │
│ │ Title: "She earned ₹1.85L/month..."        │   │
│ │ Compliance: ✓ checked                      │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ THIS WEEK'S PRIORITIES (from weekly review)      │
│ 1. Finalise quiz scoring logic                   │
│ 2. Send partnership outreach to Finshots          │
│ 3. Review Week 3 content bank                    │
├──────────────────────────────────────────────────┤
│ POKE LIST                                        │
│ • Founder — origin post draft review (2 days     │
│   overdue)                                       │
│ • Designer — Instagram templates (due Friday)    │
└──────────────────────────────────────────────────┘
```

**Data sources:**
- Phase & week: computed from `config.current_phase` and `config.phase_X_start_date`
- Alerts: computed from latest `weekly_metrics` row vs targets/thresholds in `config`
- Today's cadence: hardcoded per phase per day-of-week (from Section 4.7 of gtm_content.md)
- Content due today: filtered from `content_calendar` for today's date
- Priorities: from latest `weekly_metrics.priorities`
- Poke list: items from `content_calendar` where status is overdue, or from manual entry

**Interactions:**
- Cadence items: checkbox toggle (saves to local state or a `daily_log` sheet tab)
- Content status: dropdown to update status (writes to `content_calendar` sheet)
- Alerts: expandable — click to see the full stage gate action text

### 6.2 WEEKLY REVIEW VIEW

**Purpose:** The Monday morning ritual. Input the 5 numbers, check cadence, write the founder summary. This IS Section 8.2 of gtm_content.md, made interactive.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ WEEKLY REVIEW — Week of [date picker]            │
│ Phase: [phase indicator]                         │
├──────────────────────────────────────────────────┤
│ THE FIVE NUMBERS                                 │
│ ┌────────────────────────────────────────────┐   │
│ │ 1. New leads      [____] target: 50  [🟢]  │   │
│ │ 2. Community WAU   [____]% target: 40% [🟡] │   │
│ │ 3. Comm→App       [____] target: — (P2) [—]│   │
│ │ 4. Snapshots      [____] target: — (P2) [—]│   │
│ │ 5. Plans purchased [____] target: — (P2) [—]│   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ CADENCE CHECK                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ Content buffer:    [dropdown: 0/1/2+] [🔴]  │   │
│ │ Posts on schedule:  [yes/no]           [🟢]  │   │
│ │ Rituals completed:  [yes/no]           [🟢]  │   │
│ │ Pod check-in done:  [yes/no]           [🟢]  │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ STAGE GATE CHECK                                 │
│ ┌────────────────────────────────────────────┐   │
│ │ ⚠ Community WAU at 32% — AMBER            │   │
│ │ Action: Launch new ritual, run special     │   │
│ │ event, activate pod recruitment            │   │
│ │                                            │   │
│ │ 🔴 Content buffer at 0 weeks — RED         │   │
│ │ Action: Content engine breaking down.      │   │
│ │ Pause new initiatives. Batch-produce       │   │
│ │ next 2 weeks immediately.                  │   │
│ └────────────────────────────────────────────┘   │
│                                                  │
│ BLOCKERS                                         │
│ [textarea — what's stuck, who to poke]           │
│                                                  │
│ THIS WEEK'S PRIORITIES                           │
│ [textarea — top 3]                               │
│                                                  │
│ FOUNDER SUMMARY                                  │
│ [textarea — 3 sentences: working, not working,   │
│  what I need from you]                           │
│                                                  │
│ [Save Weekly Review]                             │
├──────────────────────────────────────────────────┤
│ TREND (last 8 weeks)                             │
│ ┌────────────────────────────────────────────┐   │
│ │ Simple sparkline charts for each of the    │   │
│ │ 5 numbers — just dots connected by lines.  │   │
│ │ Target line shown as a dashed horizontal.  │   │
│ │ No fancy charting library needed — SVG.     │   │
│ └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Data sources:**
- Input fields write to `weekly_metrics` tab
- Status badges (green/amber/red) computed by comparing input values to thresholds in `config`
- Stage gate actions: hardcoded text from gtm_content.md Section 4 stage gates, surfaced when a threshold is breached
- Trend: reads last 8 rows from `weekly_metrics`

**Interactions:**
- All input fields are editable
- Status badges auto-compute as user types
- Stage gate alerts auto-appear when a metric crosses a threshold
- "Save Weekly Review" writes the full row to `weekly_metrics` sheet
- If a review already exists for this week, it updates instead of creating a new row

### 6.3 CONTENT VIEW

**Purpose:** The content calendar. What's planned, what's drafted, what's published. The content producer and GTM lead live here during content production.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ CONTENT CALENDAR                                 │
│ [◀ Week 21] [Week 22 — May 25–31] [Week 23 ▶]   │
├──────────────────────────────────────────────────┤
│ MONDAY May 25                                    │
│ ┌──────────────────────────────────────────┐     │
│ │ 🔵 LinkedIn — Philosophy post            │     │
│ │ "You optimise your sprint velocity..."   │     │
│ │ Status: [published ▼] Compliance: [✓]    │     │
│ │ Performance: 4.2% engagement, 12K imp    │     │
│ ├──────────────────────────────────────────┤     │
│ │ 🟣 Community — Say Yes Moment prompt     │     │
│ │ Status: [published ▼]                    │     │
│ └──────────────────────────────────────────┘     │
│                                                  │
│ WEDNESDAY May 27                                 │
│ ┌──────────────────────────────────────────┐     │
│ │ 🔵 LinkedIn — Story post                 │     │
│ │ "She earned ₹1.85L/month..."             │     │
│ │ Status: [drafted ▼] Compliance: [☐]      │     │
│ │ [View Brief]                             │     │
│ ├──────────────────────────────────────────┤     │
│ │ 🟠 Instagram — Reel                      │     │
│ │ "What if your budget started with..."    │     │
│ │ Status: [planned ▼]                      │     │
│ │ [View Brief]                             │     │
│ └──────────────────────────────────────────┘     │
│ ...                                              │
├──────────────────────────────────────────────────┤
│ BUFFER STATUS: 2 weeks ahead [🟢]                │
│ This week: 4/5 posts drafted | 2/5 published     │
├──────────────────────────────────────────────────┤
│ [+ Add Content Item]                             │
└──────────────────────────────────────────────────┘
```

**Sub-views:**

**"View Brief" modal/drawer:** Opens the full content brief from gtm_content.md Section 5. Shows the template, the example copy, the compliance checklist, and the CTA guidance. Read-only — this is reference content from the markdown.

**"Add Content Item" form:** Channel, post type, day, week, title, brief text, status.

**Data sources:**
- Content items from `content_calendar` sheet, filtered by week
- Brief templates: hardcoded from gtm_content.md Section 5 (keyed by post_type)
- Buffer status: computed by counting items with status "drafted" or "approved" in future weeks

**Interactions:**
- Status dropdown on each item (writes to sheet)
- Compliance checkbox (writes to sheet)
- Performance notes: inline text field (writes to sheet)
- Add new content item (writes to sheet)
- Week navigation (prev/next)
- Click channel pill to filter by channel

### 6.4 PLAYBOOK VIEW

**Purpose:** The phase playbook. What phase are we in, what are the week-by-week tasks, what are the exit criteria. This is Sections 4.1–4.27 of gtm_content.md rendered as an interactive checklist.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ PLAYBOOK                                         │
│ [Phase 0 ●] [Phase 1 ○] [Phase 2 ○] [Phase 3 ○] │
├──────────────────────────────────────────────────┤
│ PHASE 0 — FOUNDATION (Weeks 1–4)                 │
│ Objective: Establish brand presence, validate     │
│ messaging, build infrastructure.                 │
│                                                  │
│ PROGRESS: 14/22 items complete [█████████░░░] 64%│
├──────────────────────────────────────────────────┤
│ INFRASTRUCTURE CHECKLIST                         │
│ ☑ Brand kit finalised                            │
│ ☑ Landing page live                              │
│ ☑ Beehiiv set up                                 │
│ ☐ Circle workspace configured                    │
│ ☐ Metricool connected                            │
│ ☐ Typeform quiz live                             │
│ ☑ Founder LinkedIn optimised                     │
│ ☐ Content bank: 20 LinkedIn posts ready          │
│ ☑ SEBI disclosure on all social profiles         │
│ ...                                              │
├──────────────────────────────────────────────────┤
│ WEEK-BY-WEEK TASKS                               │
│ ┌─ Week 1 — Brand & Infrastructure ──────────┐  │
│ │ ☑ Mon: Visual identity finalisation         │  │
│ │ ☑ Tue: Landing page v1                      │  │
│ │ ☐ Wed: Email infrastructure                 │  │
│ │ ☐ Thu: Community platform setup             │  │
│ │ ☐ Fri: Founder LinkedIn profile             │  │
│ └─────────────────────────────────────────────┘  │
│ ┌─ Week 2 — Content Bank & Founder Launch ───┐  │
│ │ ...                                         │  │
│ └─────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ EXIT CRITERIA                                    │
│ ☑ Waitlist has 500+ signups                      │
│ ☐ Email drip active with >50% open rate          │
│ ☐ 1 clear message winner per channel             │
│ ...                                              │
│                                                  │
│ [All exit criteria met → Advance to Phase 1]     │
└──────────────────────────────────────────────────┘
```

**Data sources:**
- Checklist items from `phase_checklist` sheet
- Phase descriptions: hardcoded from gtm_content.md
- Progress bar: computed from completed/total checklist items

**Interactions:**
- Checkbox toggle on each item (writes to `phase_checklist` sheet)
- Phase tabs to switch between phases
- "Advance to Phase" button: only enabled when all exit criteria are checked. Writes to `config.current_phase`.
- Collapsible week sections (default: current week expanded, past weeks collapsed)

### 6.5 CONTROL VIEW

**Purpose:** The stage gates, kill criteria, and funnel model. The alarm system. Mostly read-only except for the funnel numbers input.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ CONTROL — STAGE GATES & FUNNEL                   │
├──────────────────────────────────────────────────┤
│ CURRENT PHASE: Phase 1 — Community Build         │
│ Week 8 of 12 | 4 weeks to exit target            │
├──────────────────────────────────────────────────┤
│ STAGE GATES (Phase 1)                            │
│ ┌────────────────────────────────────────────┐   │
│ │ Community members    1,247 / 2,000    [🟡]  │   │
│ │ Amber: <1,000 by Wk10 → currently on track │   │
│ │ but trending slow. Watch next 2 weeks.      │   │
│ ├────────────────────────────────────────────┤   │
│ │ WAU                  43% / 40%         [🟢]  │   │
│ ├────────────────────────────────────────────┤   │
│ │ Pod enrolments       38 / 100          [🟡]  │   │
│ │ Amber: <50 by Wk12. Push pod recruitment   │   │
│ │ in Clarity Circles, DM active members.      │   │
│ ├────────────────────────────────────────────┤   │
│ │ Wedge fit            72% / 70%         [🟢]  │   │
│ ├────────────────────────────────────────────┤   │
│ │ Organic tech referrals  3 / 5          [🟢]  │   │
│ │ On track if trend continues.                │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ KILL CRITERIA                                    │
│ ┌────────────────────────────────────────────┐   │
│ │ ✓ Wedge validated (72% match)               │   │
│ │ ✓ Community model working (WAU 43%)         │   │
│ │ — App bridge: not yet testable (Phase 2)    │   │
│ │ — Revenue model: not yet testable (Phase 2) │   │
│ │ ✓ Founder not burned out (commitments met)  │   │
│ └────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│ FUNNEL MODEL                                     │
│ ┌────────────────────────────────────────────┐   │
│ │ Waitlist → Community: 68% (target: 60%+)   │   │
│ │ Community → App: — (Phase 2)               │   │
│ │ App → Snapshot: — (Phase 2)                │   │
│ │ Snapshot → Paid: — (Phase 2)               │   │
│ │ Paid → Advisory: — (Phase 3)               │   │
│ └────────────────────────────────────────────┘   │
│ [Update funnel numbers]                          │
└──────────────────────────────────────────────────┘
```

**Data sources:**
- Stage gate actuals: from latest `weekly_metrics` rows (some metrics are cumulative, computed by summing)
- Stage gate thresholds and actions: hardcoded from gtm_content.md Section 4 stage gates
- Kill criteria: computed from metrics data
- Funnel model: computed from cumulative metrics

**Interactions:**
- Mostly read-only — auto-computed from weekly metrics data
- "Update funnel numbers" opens a form for metrics not captured in the weekly review (pod enrolments, wedge fit %, organic referrals)
- These supplementary metrics are stored in an additional `supplementary_metrics` sheet tab or appended to `weekly_metrics`

### 6.6 REFERENCE VIEW

**Purpose:** All the static reference content from gtm_content.md that the user needs to look up occasionally. Compliance checklist, RACI, content briefs, community vocabulary, tool stack, partnership tracker.

**Layout:** Accordion/collapsible sections:

```
┌──────────────────────────────────────────────────┐
│ REFERENCE                                        │
├──────────────────────────────────────────────────┤
│ ▸ Compliance Framework                           │
│   └ Approved claims library                      │
│   └ Testimonial rules                            │
│   └ Education vs advice boundary                 │
│   └ Pre-publication checklist (interactive)       │
│   └ Questions for compliance advisor              │
│                                                  │
│ ▸ RACI Matrix                                    │
│   └ Full workstream × role table                 │
│   └ Founder time budget                          │
│   └ Hiring triggers                              │
│                                                  │
│ ▸ Content Briefs                                 │
│   └ LinkedIn — Philosophy post template          │
│   └ LinkedIn — Story post template               │
│   └ LinkedIn — Framework post template           │
│   └ Instagram — Carousel template                │
│   └ Instagram — Reel template                    │
│   └ Email — Welcome drip sequence                │
│   └ Community — Say Yes Moment prompts           │
│   └ Community — Hell Yes! Decision template      │
│   └ Community — Pod facilitator guide            │
│                                                  │
│ ▸ Community Operations                           │
│   └ Channel structure & moderation levels         │
│   └ Entry flow                                   │
│   └ Ritual schedule                              │
│   └ Pod matching criteria                        │
│   └ Vocabulary reference                         │
│                                                  │
│ ▸ Monetisation & Service Design                  │
│   └ Revenue streams                              │
│   └ Unit economics                               │
│   └ Advisory capacity model                      │
│   └ Pricing validation criteria                  │
│                                                  │
│ ▸ Tool Stack                                     │
│   └ Critical tools                               │
│   └ Automation flows                             │
│   └ Monthly cost estimates                       │
│                                                  │
│ ▸ Partnerships                                   │
│   └ Partnership tracker (interactive — reads      │
│     from partnerships sheet)                     │
│   └ [+ Add Partnership]                          │
│                                                  │
│ ▸ Risks & Mitigations                            │
│   └ Full risk table                              │
│                                                  │
│ ▸ Budget                                         │
│   └ Phase-by-phase estimates                     │
│   └ Year 1 total                                 │
│                                                  │
│ ▸ Launch ICP & Wedge                             │
│   └ Primary ICP definition                       │
│   └ Wedge messaging                              │
│   └ Validation criteria                          │
└──────────────────────────────────────────────────┘
```

**Data sources:**
- Most content: hardcoded from gtm_content.md (rendered as styled markdown)
- Partnerships: from `partnerships` sheet (interactive — add/edit/update status)
- Compliance checklist: interactive checkboxes (from `compliance_log` sheet)

**Interactions:**
- Accordion expand/collapse
- Partnership tracker: add new, update status (writes to sheet)
- Compliance pre-publication checklist: interactive checkbox version of Section 3.7 (writes to `compliance_log` on each check)

### 6.7 SETTINGS VIEW

**Purpose:** Configure the app — spreadsheet connection, phase targets, current phase override.

**Layout:**

```
┌──────────────────────────────────────────────────┐
│ SETTINGS                                         │
├──────────────────────────────────────────────────┤
│ GOOGLE SHEET CONNECTION                          │
│ Apps Script URL: [________________________________]│
│ [Test Connection]  Status: ✓ Connected           │
│                                                  │
│ CURRENT PHASE                                    │
│ [Phase 0 ▼]  Started: [date picker]             │
│                                                  │
│ TARGETS (Phase 0)                                │
│ Weekly new leads target:    [50___]              │
│ Amber threshold:            [30___]              │
│ Red threshold:              [15___]              │
│ ...                                              │
│                                                  │
│ [Save Settings]                                  │
│                                                  │
│ DATA                                             │
│ [Export all data as CSV]                          │
│ [View Google Sheet directly]                     │
└──────────────────────────────────────────────────┘
```

---

## 7. COMPONENT ARCHITECTURE

```
src/
├── App.jsx                    # Router, layout, nav
├── index.css                  # CSS variables, global styles
├── config.js                  # Apps Script URL, constants
│
├── components/
│   ├── Layout.jsx             # Top nav bar + main content area
│   ├── NavBar.jsx             # Sticky top navigation tabs
│   ├── StatusBadge.jsx        # Green/amber/red pill component
│   ├── MetricInput.jsx        # Number input with target + status
│   ├── ChecklistItem.jsx      # Checkbox + label + date
│   ├── ContentCard.jsx        # Content calendar item card
│   ├── AlertCard.jsx          # Stage gate alert (amber/red)
│   ├── SparkLine.jsx          # Simple SVG sparkline
│   ├── Accordion.jsx          # Collapsible section
│   ├── Modal.jsx              # Content brief viewer
│   └── WeekPicker.jsx         # Week navigation
│
├── views/
│   ├── TodayView.jsx          # Default landing — daily cadence
│   ├── WeeklyReviewView.jsx   # Monday ritual — metrics input
│   ├── ContentView.jsx        # Content calendar
│   ├── PlaybookView.jsx       # Phase playbooks + checklists
│   ├── ControlView.jsx        # Stage gates + funnel
│   ├── ReferenceView.jsx      # All reference content
│   └── SettingsView.jsx       # Configuration
│
├── data/
│   ├── sheetsApi.js           # Google Sheets read/write via Apps Script
│   ├── stageGates.js          # Threshold definitions per phase per metric
│   ├── cadence.js             # Daily cadence items per phase per day
│   ├── contentBriefs.js       # Content brief templates
│   ├── referenceContent.js    # All static reference content from gtm_content.md
│   ├── phaseChecklists.js     # Infrastructure + exit criteria items
│   └── complianceChecklist.js # Pre-publication checklist items
│
└── utils/
    ├── weekUtils.js           # Week number, date range calculations
    ├── statusCalc.js          # Green/amber/red computation
    └── formatters.js          # Number formatting, date formatting
```

### Key technical decisions:

- **React with React Router** for SPA routing (hash router for GitHub Pages compatibility)
- **No state management library** — React context + useState is sufficient for this scale
- **No charting library** — sparklines are simple SVG paths, hand-drawn
- **No CSS framework** — vanilla CSS with CSS custom properties. Tailwind adds build complexity for GitHub Pages.
- **No build tool beyond Vite** — `npm create vite@latest` with React template, deploy `dist/` to GitHub Pages
- **Google Fonts loaded via CDN link** in index.html

### Offline / disconnected behaviour:

If the Sheets connection fails, the app should:
- Show cached data from localStorage (last successful read)
- Allow input (queued in localStorage)
- Show a "disconnected" banner
- Sync queued writes when connection restores

---

## 8. DEPLOYMENT

### GitHub Pages deployment:

1. `npm create vite@latest yeslifers-gtm -- --template react`
2. Develop locally with `npm run dev`
3. Build with `npm run build`
4. Deploy `dist/` to GitHub Pages via GitHub Actions or `gh-pages` npm package
5. In `vite.config.js`, set `base: '/yeslifers-gtm/'` (or whatever the repo name is)

### Google Sheet setup:

1. Create a new Google Sheet
2. Create tabs: `weekly_metrics`, `content_calendar`, `phase_checklist`, `raci`, `compliance_log`, `partnerships`, `config`
3. Add headers matching the data model (Section 3)
4. Pre-populate `config` tab with initial values
5. Pre-populate `phase_checklist` with items from gtm_content.md Section 4
6. Pre-populate `raci` with the RACI matrix from gtm_content.md Section 2.3
7. Extensions → Apps Script → create web app with doGet/doPost handlers
8. Deploy Apps Script as web app (anyone with link can access)
9. Copy the Apps Script URL into the app's Settings view

### Apps Script template:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;
  const tab = e.parameter.tab;

  if (action === 'read') {
    const ws = sheet.getSheetByName(tab);
    const data = ws.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });

    // Optional filters
    if (e.parameter.latest === '1') {
      return ContentService.createTextOutput(JSON.stringify(rows[rows.length - 1]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.week) {
      const filtered = rows.filter(r => r.week_of === e.parameter.week);
      return ContentService.createTextOutput(JSON.stringify(filtered))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const payload = JSON.parse(e.postData.contents);
  const ws = sheet.getSheetByName(payload.tab);
  const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];

  if (payload.action === 'write') {
    const row = headers.map(h => payload.data[h] || '');
    ws.appendRow(row);
  }

  if (payload.action === 'update') {
    // Find row by id/key and update
    const data = ws.getDataRange().getValues();
    const idCol = headers.indexOf('id') !== -1 ? 'id' : headers.indexOf('week_of') !== -1 ? 'week_of' : headers[0];
    const idColIndex = headers.indexOf(idCol);
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColIndex] === payload.id) {
        Object.keys(payload.data).forEach(key => {
          const colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            ws.getRange(i + 1, colIndex + 1).setValue(payload.data[key]);
          }
        });
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 9. BUILD SEQUENCE FOR CLAUDE CODE

Recommended order of implementation:

1. **Scaffold** — Vite + React + Router + CSS variables + layout + nav bar
2. **Data layer** — sheetsApi.js + localStorage fallback + all static data files (stageGates, cadence, contentBriefs, referenceContent, phaseChecklists)
3. **Settings view** — Sheet connection config + test connection
4. **Today view** — Daily cadence + alerts (hardcoded data initially, then wire to sheets)
5. **Weekly Review view** — Metric input form + status badges + save to sheet
6. **Playbook view** — Phase tabs + checklists + exit criteria + progress bar
7. **Content view** — Calendar grid + status dropdowns + brief modals
8. **Control view** — Stage gates + funnel model (computed from weekly data)
9. **Reference view** — Accordion sections + static content rendering
10. **Polish** — Animations (subtle fade-ins), responsive tweaks, error handling, offline mode

### Critical implementation notes:

- **Hash router:** Use `createHashRouter` not `createBrowserRouter` — GitHub Pages doesn't support client-side routing without hacks.
- **CORS:** Google Apps Script web apps handle CORS automatically when deployed as "anyone can access."
- **Rate limiting:** Google Apps Script has a 6-minute execution limit and quotas. Batch reads where possible. Cache aggressively in localStorage.
- **Pre-populate data files:** The hardcoded data files (stageGates.js, cadence.js, etc.) should be extracted directly from gtm_content.md. This is a one-time content extraction task.
- **No image assets needed:** The entire UI is text, icons (use simple unicode or a tiny icon set), and color.
- **Mobile responsive:** The GTM lead may check this on their phone. Single-column layout works. Just ensure touch targets are large enough and text is readable.

---

## 10. WHAT THIS APP IS NOT

- Not a replacement for MixPanel, Circle analytics, or LinkedIn insights. Those are source-of-truth tools. This app is where the GTM lead inputs a few numbers FROM those tools and gets decision support.
- Not a CRM. Advisory pipeline tracking stays in HubSpot. This app just shows whether the pipeline number is on track.
- Not a content management system. Content is drafted in Google Docs / Canva / whatever. This app tracks the status and schedule.
- Not a team communication tool. Founder summaries written here are copy-pasted to Slack / email.
- Not an analytics dashboard. No auto-refreshing charts. No API integrations to data sources. The user enters numbers manually, weekly. That's the design.

**It IS:** A discipline engine. A checklist. An alarm system. A reference library. A weekly ritual made interactive.

---

*End of Application Specification*

*Companion document: gtm_content.md (content & strategy)*
*Both files should be provided to Claude Code for the build.*
