/**
 * Stage gate metrics by phase — extracted from gtm_content.md
 * Sections 4.4 (Phase 0), 4.13 (Phase 1), 4.20 (Phase 2), 4.27 (Phase 3)
 *
 * Each metric defines target, amber/red thresholds, and prescribed actions.
 * Phase 3 KPIs have no amber/red thresholds in the source doc (set to null).
 */

const stageGates = {
  phase_0: [
    {
      id: "p0_waitlist_signups",
      label: "Waitlist signups",
      target: 500,
      unit: "count",
      amberThreshold: 300,
      redThreshold: 200,
      amberAction:
        "Increase founder posting, boost top post",
      redAction:
        "Revisit messaging, consider paid boost",
      applicableFrom: "phase_0",
    },
    {
      id: "p0_email_list",
      label: "Email list with >50% open rate",
      target: 300,
      unit: "count",
      amberThreshold: 200,
      redThreshold: 100,
      amberAction: "Revise subject lines, test send times",
      redAction:
        "Email capture mechanism broken, fix before Phase 1",
      applicableFrom: "phase_0",
    },
    {
      id: "p0_linkedin_followers",
      label: "LinkedIn founder followers gained",
      target: 1000,
      unit: "count",
      amberThreshold: 500,
      redThreshold: 300,
      amberAction:
        "Increase posting frequency, more engagement in comments",
      redAction:
        "Founder positioning not landing, revise angle",
      applicableFrom: "phase_0",
    },
    {
      id: "p0_quiz_completions",
      label: "Quiz completions",
      target: 200,
      unit: "count",
      amberThreshold: 100,
      redThreshold: 50,
      amberAction:
        "Quiz not being found or completed, check funnel",
      redAction:
        "Quiz concept not working, redesign before Phase 1",
      applicableFrom: "phase_0",
    },
    {
      id: "p0_message_test_winner",
      label: "Message test: 1 clear winner per channel",
      target: "Yes",
      unit: "boolean",
      amberThreshold: null,
      redThreshold: null,
      amberAction:
        "No winner — extend testing by 1 week",
      redAction:
        "Still no winner — wedge messaging hypothesis may be wrong",
      applicableFrom: "phase_0",
    },
  ],

  phase_1: [
    {
      id: "p1_community_members",
      label: "Community members",
      target: 2000,
      unit: "count",
      amberThreshold: 1000,
      redThreshold: 500,
      amberAction:
        "Increase founder posting cadence, activate partnerships, boost top content",
      redAction:
        "Pause Phase 2 prep. Revisit wedge hypothesis. Consider paid acquisition test.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_wau",
      label: "WAU (weekly active as % of total)",
      target: 40,
      unit: "%",
      amberThreshold: 30,
      redThreshold: 20,
      amberAction:
        "Launch new ritual, run special event, activate pod recruitment",
      redAction:
        "Community value prop not landing. Survey members. Redesign engagement mechanics.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_pod_enrolments",
      label: "Accountability pod enrolments",
      target: 100,
      unit: "count",
      amberThreshold: 50,
      redThreshold: 30,
      amberAction:
        "Push pod recruitment in Clarity Circles, DM active members",
      redAction:
        "Pod format may not work. Test alternative formats (buddy system, challenges).",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_referral_invites",
      label: "Referral invites sent",
      target: 500,
      unit: "count",
      amberThreshold: 200,
      redThreshold: 100,
      amberAction:
        "Remind members of referral program, add incentive (exclusive content)",
      redAction:
        "Referral mechanism not compelling. Redesign reward.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_content_impressions",
      label: "Content impressions (LinkedIn, cumulative)",
      target: 500000,
      unit: "count",
      amberThreshold: 250000,
      redThreshold: 150000,
      amberAction:
        "Boost top posts, increase posting frequency, test new content angles",
      redAction:
        "Content strategy not working for the wedge. Major revision needed.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_quiz_completions",
      label: "Quiz completions (cumulative)",
      target: 1500,
      unit: "count",
      amberThreshold: 800,
      redThreshold: 400,
      amberAction:
        "Promote quiz more aggressively, test new quiz variants",
      redAction:
        "Quiz not driving value. Consider replacing with different lead capture.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_wedge_fit",
      label: "Wedge fit: % of members matching primary ICP",
      target: 70,
      unit: "%",
      amberThreshold: 50,
      redThreshold: 40,
      amberAction:
        "Sharpen content and partnerships toward wedge",
      redAction:
        "Wedge is wrong. Redefine before Phase 2.",
      applicableFrom: "phase_1",
    },
    {
      id: "p1_organic_referrals",
      label: "Organic parent/professional-network referrals",
      target: 5,
      unit: "count",
      amberThreshold: 2,
      redThreshold: 0,
      amberAction:
        "Activate corporate workshops, ask members for intros within school/parent networks",
      redAction:
        "Wedge distribution hypothesis failed. Expand or pivot ICP.",
      applicableFrom: "phase_1",
    },
  ],

  phase_2: [
    {
      id: "p2_app_signups_community",
      label: "App signups from community",
      target: 600,
      unit: "count",
      amberThreshold: 300,
      redThreshold: 150,
      amberAction:
        "Increase DM outreach, run another challenge, surface app in every community touchpoint",
      redAction:
        "Community-to-app bridge is broken. Survey non-converters. Redesign onboarding path.",
      applicableFrom: "phase_2",
    },
    {
      id: "p2_app_signups_public",
      label: "App signups from public",
      target: 400,
      unit: "count",
      amberThreshold: 200,
      redThreshold: 100,
      amberAction:
        "Boost launch content, increase press outreach, consider paid acquisition test",
      redAction:
        "Public launch didn't land. Revise messaging. Consider second launch event.",
      applicableFrom: "phase_2",
    },
    {
      id: "p2_snapshot_community",
      label: "Snapshot completion (community users)",
      target: 70,
      unit: "%",
      amberThreshold: 50,
      redThreshold: 35,
      amberAction:
        "Onboarding friction — check where users drop off (Hotjar/MixPanel). Simplify.",
      redAction:
        "Major UX problem. Pause acquisition, fix onboarding.",
      applicableFrom: "phase_2",
    },
    {
      id: "p2_snapshot_cold",
      label: "Snapshot completion (cold users)",
      target: 40,
      unit: "%",
      amberThreshold: 25,
      redThreshold: 15,
      amberAction:
        "Education screens not converting. Revise Stage 1 copy.",
      redAction:
        "Cold user flow fundamentally broken. Redesign.",
      applicableFrom: "phase_2",
    },
    {
      id: "p2_share_moments",
      label: "Community share moments posted",
      target: 100,
      unit: "count",
      amberThreshold: 50,
      redThreshold: 25,
      amberAction:
        "Share prompt not surfacing at right moment. Test new placement.",
      redAction:
        "Feature not compelling. Redesign the share moment.",
      applicableFrom: "phase_2",
    },
    {
      id: "p2_plan_upgrade",
      label: "Plan upgrade (free \u2192 paid)",
      target: 15,
      unit: "%",
      amberThreshold: 8,
      redThreshold: 5,
      amberAction:
        "Upgrade prompt not landing. Test new copy. Add urgency without pressure.",
      redAction:
        "Value prop of paid plan not clear. Revise Stage 4 'What Could Be' card.",
      applicableFrom: "phase_2",
    },
  ],

  phase_3: [
    {
      id: "p3_total_community",
      label: "Total community members",
      target: 10000,
      unit: "count",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_mau",
      label: "Monthly active app users",
      target: 3000,
      unit: "count",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_retention_90d",
      label: "App retention (90-day)",
      target: 50,
      unit: "%",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_community_app_conversion",
      label: "Community-to-app conversion (lifetime)",
      target: 35,
      unit: "%",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_advisory_conversions",
      label: "Advisory conversions",
      target: 100,
      unit: "count",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_organic_referral_rate",
      label: "Organic referral rate",
      target: 30,
      unit: "%",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_member_content_share",
      label: "Member-generated content share",
      target: 30,
      unit: "%",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_nps",
      label: "NPS (community)",
      target: 70,
      unit: "score",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_revenue_plans",
      label: "Revenue from plans (\u20B92,999 + \u20B94,999)",
      target: "Track monthly",
      unit: "currency",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
    {
      id: "p3_revenue_advisory",
      label: "Revenue from advisory",
      target: "Track monthly",
      unit: "currency",
      amberThreshold: null,
      redThreshold: null,
      amberAction: null,
      redAction: null,
      applicableFrom: "phase_3",
    },
  ],
};

export default stageGates;
