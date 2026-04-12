# Supabase + Vercel Migration (2026-04-12)

## What changed

Migrated the GTM cockpit app from **localStorage + GitHub JSON sync + GitHub Pages** to **Supabase Postgres + OTP auth + Vercel hosting**. The app now supports multiple authenticated users sharing a single data workspace.

---

## Architecture (before → after)

| Layer | Before | After |
|---|---|---|
| **Data store** | `localStorage` per browser | Supabase Postgres (5 tables) |
| **Sync** | Manual push/pull via GitHub Contents API (`githubSync.js`) | Real-time via Supabase client |
| **Auth** | None (paste a GitHub PAT in Settings) | OTP email codes, invite-only |
| **Hosting** | GitHub Pages at `spiffler33.github.io/hoa/` | Vercel at `hoa-rust.vercel.app` |
| **Base path** | `/hoa/` | `/` |
| **Dev port** | `localhost:5174` | Same (pinned, `strictPort: true`) |

---

## Supabase schema (5 tables)

```sql
weekly_metrics   (week_of DATE PK, data JSONB, created_at)
content_items    (id TEXT PK, channel, post_type, due_date, title, status, created_at)
checklist_entries (id TEXT PK, kind CHECK('phase_checklist','compliance_log'), phase, type, item, completed, completed_date, created_at)
partnerships     (id TEXT PK, name, type, status, notes, created_at)
app_config       (id INT PK CHECK(id=1), current_phase, phase_start_date)
```

**RLS:** All 5 tables have `FOR ALL TO authenticated USING (true) WITH CHECK (true)` — shared workspace, any signed-in user has full access.

**`app_config`** is pre-seeded with one row (`id=1`) so `loadConfig` never hits an empty table.

---

## Key design decisions

- **OTP codes, not magic links.** Mobile browser isolation breaks magic link redirects (iOS Safari → Gmail in-app browser → wrong session). OTP codes are typed into the original browser. Supabase email template customized to show `{{ .Token }}` instead of a link.
- **Client-side TEXT IDs.** Views generate `local_${timestamp}_${random}` IDs. TEXT primary keys accept them as-is. Zero view changes.
- **JSONB for weekly_metrics.** Phase-dependent metric keys (5–10 different fields per phase). Scalar `week_of` column for filtering/upsert.
- **Scalar columns for content_items.** Fields are stable and small: channel, post_type, due_date, title, status.
- **Module-level config cache in dataLayer.** `let _configCache = null;` avoids N round-trips when navigating 7 views. Invalidated on `saveConfig`.
- **`saveConfig` uses column-level UPDATE with COALESCE.** Partial updates don't null other fields.
- **`saveWeeklyMetrics` uses read-merge-write.** Fetches existing JSONB `data`, merges with new fields, upserts. Prevents partial saves from overwriting prior entries.
- **Errors thrown from dataLayer, views wrap in try/catch.** 5 views already had this from Task 15. Added to `ReferenceView` and `SettingsView` during migration.

---

## Files changed

### Created (3)
- `gtm-app/src/lib/supabase.js` — singleton client
- `gtm-app/src/lib/authContext.jsx` — AuthProvider + useAuth hook (session, sendCode, verifyCode, signOut)
- `gtm-app/src/components/SignInScreen.jsx` — OTP flow: email → 8-digit code → verified

### Modified (7)
- `gtm-app/vite.config.js` — `base: '/hoa/'` → `base: '/'`
- `gtm-app/package.json` — added `@supabase/supabase-js`, removed `gh-pages` + deploy scripts
- `gtm-app/src/App.jsx` — wrapped router with `AuthProvider` + `AuthGate`
- `gtm-app/src/utils/dataLayer.js` — full rewrite, same 10 function signatures, Supabase-backed
- `gtm-app/src/views/SettingsView.jsx` — deleted GitHub sync section, added sign-out, fixed config leak
- `gtm-app/src/views/PlaybookView.jsx` — fixed direct `localStore` import, now uses `dataLayer.loadConfig`
- `gtm-app/src/views/ReferenceView.jsx` — added try/catch around dataLayer calls

### Deleted (2)
- `gtm-app/src/utils/githubSync.js`
- `gtm-app/src/utils/localStore.js`

---

## Infrastructure

| Resource | Value |
|---|---|
| Supabase project ID | `ujbeyeadtxomwyxtvvol` |
| Supabase URL | `https://ujbeyeadtxomwyxtvvol.supabase.co` |
| Vercel project | `hoa` (Hobby tier, `spiff's projects` team) |
| Vercel prod URL | `hoa-rust.vercel.app` |
| Env vars (Vercel) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Auth mode | OTP email, invite-only, signups disabled |
| User email | `vatsalparikh@gmail.com` |
| Founder email | TBD — invite via Supabase dashboard, no code change |

---

## Auth flow

1. User visits `hoa-rust.vercel.app` → SignInScreen renders
2. Enters email → clicks "Send code"
3. Supabase sends email with 8-digit OTP code (custom Magic Link template)
4. User types code → clicks "Verify" → session active, app renders
5. Session persists across refreshes (Supabase stores `sb-*` keys in localStorage)
6. Sign out via Settings → Account → "Sign out"

**Adding new users:** Supabase dashboard → Authentication → Users → Invite user → enter email. No code change.

---

## dataLayer.js API surface (unchanged signatures)

| Function | Table | Read/Write | Notes |
|---|---|---|---|
| `loadMetrics(opts)` | `weekly_metrics` | Read | `opts.latest` returns last row only |
| `loadContentCalendar()` | `content_items` | Read | Maps `due_date` → `dueDate` for view compat |
| `loadPhaseChecklist(opts)` | `checklist_entries` | Read | `opts.tab` maps to `kind` column filter |
| `loadPartnerships()` | `partnerships` | Read | Ordered by `created_at` desc |
| `loadConfig()` | `app_config` | Read | Module-level cache, camelCase mapping |
| `saveWeeklyMetrics(weekData)` | `weekly_metrics` | Write | Read-merge-write into JSONB `data` |
| `saveContentEntry(item)` | `content_items` | Write | Upsert by `id` |
| `saveChecklistEntry(item)` | `checklist_entries` | Write | `item.tab` maps to `kind` |
| `savePartnership(item)` | `partnerships` | Write | Upsert by `id` |
| `saveConfig(config)` | `app_config` | Write | Column-level UPDATE with COALESCE |

---

## What was NOT changed

- All 7 view JSX/CSS files (except leak-fixes noted above)
- All 6 static data files (`stageGates.js`, `cadence.js`, `phaseChecklists.js`, `contentBriefs.js`, `referenceContent.js`, `killCriteria.js`)
- All 4 shared components (`Layout`, `NavBar`, `LoadingSpinner`, `EmptyState`)
- Terminal-Meets-Journal aesthetic (OKLCH tokens, JetBrains Mono, warm paper palette)
- Mobile responsive breakpoints (768px + 480px from Task 15)
- Hash router structure (7 routes)

---

## Old GitHub Pages deploy

Still live at `https://spiffler33.github.io/hoa/` — frozen on pre-migration code. Serves as emergency fallback. Will break if someone runs the now-deleted `npm run deploy` script (which they can't, since `gh-pages` is uninstalled). Safe to ignore indefinitely.

---

## Rollback

- Code: `git revert` migration commits → Vercel auto-deploys previous state
- Database: `DROP TABLE` the 5 tables in Supabase SQL Editor (app was empty at migration time)
- Deploy: Vercel dashboard → Deployments → promote any prior deployment
