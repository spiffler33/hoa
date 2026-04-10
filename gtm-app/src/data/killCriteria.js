/**
 * Kill criteria — extracted from gtm_content.md Section 8.4
 *
 * These are conditions under which the strategy itself — not just a tactic —
 * needs fundamental revision.  Displayed in the Control view.
 *
 * Each entry: { id, condition, signal, action }
 */

const killCriteria = [
  {
    id: "kill_wedge_wrong",
    condition: "Wedge is wrong",
    signal:
      "<40% of community matches ICP by Week 12 AND organic referrals from tech networks = 0",
    action:
      "Stop. Redefine ICP. Restart Phase 1 content with new wedge.",
  },
  {
    id: "kill_community_model",
    condition: "Community model doesn't work",
    signal:
      "WAU <20% for 4 consecutive weeks despite interventions",
    action:
      "Community is not providing enough value. Survey members. Consider a different community format or value prop.",
  },
  {
    id: "kill_app_bridge",
    condition: "App bridge is broken",
    signal:
      "Community → app conversion <10% after 4 weeks of Phase 2",
    action:
      "The trust isn't transferring to the product. Major app or onboarding revision needed.",
  },
  {
    id: "kill_revenue_model",
    condition: "Revenue model doesn't work",
    signal:
      "Paid conversion <3% after 8 weeks of Phase 2",
    action:
      "Value of paid plan not clear. Consider freemium pivot, pricing change, or product revision.",
  },
  {
    id: "kill_founder_burnout",
    condition: "Founder burnout",
    signal:
      "Founder misses >50% of commitments for 2 consecutive weeks",
    action:
      "Immediate delegation review. Reduce founder scope. Hire or reassign.",
  },
];

export default killCriteria;
