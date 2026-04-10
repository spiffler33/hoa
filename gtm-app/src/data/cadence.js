/**
 * Operating cadence by phase — extracted from gtm_content.md
 * Section 4.2 (Phase 0 week-by-week) and Section 4.7 (Phase 1 weekly rhythm)
 *
 * Phase 0: keyed by week number (1–4), then by day, containing task arrays.
 * Phase 1+: keyed by day-of-week (mon–sun), containing task arrays.
 * Each task: { time, activity, owner, phase }
 */

const cadence = {
  phase_0: {
    1: {
      mon: [
        {
          time: "",
          activity:
            "Visual identity finalisation — logo, colour palette, typography, post templates",
          owner: "Designer + GTM Lead",
          phase: "phase_0",
        },
      ],
      tue: [
        {
          time: "",
          activity:
            "Landing page v1 — manifesto, Yes Lifer Code, quiz embed, waitlist CTA",
          owner: "GTM Lead + Designer",
          phase: "phase_0",
        },
      ],
      wed: [
        {
          time: "",
          activity:
            "Email infrastructure — Beehiiv setup, welcome drip sequence drafted",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      thu: [
        {
          time: "",
          activity:
            "Community platform setup — Circle workspace, channels created, moderation rules written",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      fri: [
        {
          time: "",
          activity:
            "Founder LinkedIn profile optimisation — headline, banner, featured section",
          owner: "GTM Lead + Founder",
          phase: "phase_0",
        },
      ],
    },
    2: {
      mon: [
        {
          time: "",
          activity:
            "Batch-create 20 LinkedIn posts and 15 Instagram carousels from content briefs",
          owner: "Content Producer + GTM Lead",
          phase: "phase_0",
        },
      ],
      tue: [
        {
          time: "",
          activity:
            "Batch-create 20 LinkedIn posts and 15 Instagram carousels (continued)",
          owner: "Content Producer + GTM Lead",
          phase: "phase_0",
        },
      ],
      wed: [
        {
          time: "",
          activity:
            "Founder's origin post — 'Why I'm building Yes Lifers' — drafted",
          owner: "GTM Lead (ghostwrite)",
          phase: "phase_0",
        },
      ],
      thu: [
        {
          time: "",
          activity: "Founder reviews and publishes origin post",
          owner: "Founder",
          phase: "phase_0",
        },
      ],
      fri: [
        {
          time: "",
          activity:
            "Quiz — 'What's your money personality?' — built in Typeform, embedded on landing page",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
    },
    3: {
      mon: [
        {
          time: "",
          activity:
            "Launch message test A — LinkedIn carousel (tension framing)",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      tue: [
        {
          time: "",
          activity:
            "Launch message test B — Instagram reel + carousel (guilt-free spending)",
          owner: "Content Producer",
          phase: "phase_0",
        },
      ],
      wed: [
        {
          time: "",
          activity:
            "Launch message test C — Landing page A/B headline test",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      thu: [
        {
          time: "",
          activity:
            "Launch message test D — LinkedIn text post (Reddit/crowdsourcing angle)",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      fri: [
        {
          time: "",
          activity:
            "First founder guest appearance — podcast/Twitter Space/LinkedIn Live",
          owner: "Founder",
          phase: "phase_0",
        },
      ],
    },
    4: {
      mon: [
        {
          time: "",
          activity:
            "Analyse message test results. Identify winning angles per channel.",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      tue: [
        {
          time: "",
          activity:
            "Analyse message test results. Identify winning angles per channel. (continued)",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
      wed: [
        {
          time: "",
          activity:
            "Refine content bank based on winners. Update content briefs.",
          owner: "GTM Lead + Content Producer",
          phase: "phase_0",
        },
      ],
      thu: [
        {
          time: "",
          activity:
            "Second and third founder guest appearances booked/completed",
          owner: "Founder + GTM Lead",
          phase: "phase_0",
        },
      ],
      fri: [
        {
          time: "",
          activity:
            "Phase 0 exit review — do we meet exit criteria? Decision: proceed to Phase 1 or extend.",
          owner: "GTM Lead",
          phase: "phase_0",
        },
      ],
    },
  },

  phase_1: {
    mon: [
      {
        time: "Morning",
        activity:
          "Publish LinkedIn philosophy post (scheduled from content bank)",
        owner: "Auto-publish via Metricool",
        phase: "phase_1",
      },
      {
        time: "Morning",
        activity: "Post 'Say Yes Moment' daily prompt in community",
        owner: "Community Manager",
        phase: "phase_1",
      },
      {
        time: "30 min",
        activity:
          "Weekly GTM review — update metrics, check stage gates, identify blockers",
        owner: "GTM Lead",
        phase: "phase_1",
      },
      {
        time: "15 min",
        activity:
          "Share weekly summary with founder (async — Slack/email)",
        owner: "GTM Lead",
        phase: "phase_1",
      },
    ],
    tue: [
      {
        time: "Morning",
        activity: "Instagram carousel published (scheduled)",
        owner: "Auto-publish via Metricool",
        phase: "phase_1",
      },
      {
        time: "30 min",
        activity:
          "Community engagement — respond to posts, welcome new members",
        owner: "Community Manager",
        phase: "phase_1",
      },
      {
        time: "As needed",
        activity:
          "Partnership outreach — 2 new outreach emails/DMs per week",
        owner: "GTM Lead",
        phase: "phase_1",
      },
    ],
    wed: [
      {
        time: "Morning",
        activity: "Publish LinkedIn story post (scheduled)",
        owner: "Auto-publish via Metricool",
        phase: "phase_1",
      },
      {
        time: "Morning",
        activity: "Post 'Say Yes Moment' prompt",
        owner: "Community Manager",
        phase: "phase_1",
      },
      {
        time: "30 min",
        activity:
          "Content production review — is next week's content ready?",
        owner: "GTM Lead + Content Producer",
        phase: "phase_1",
      },
      {
        time: "Bi-weekly",
        activity:
          "Hell Yes! Decision Thread — structured community discussion",
        owner: "Community Manager",
        phase: "phase_1",
      },
    ],
    thu: [
      {
        time: "Morning",
        activity:
          "Instagram content published (reel or carousel, scheduled)",
        owner: "Auto-publish",
        phase: "phase_1",
      },
      {
        time: "9 PM IST",
        activity: "Clarity Circle — live audio session",
        owner: "Founder (monthly) or Community Manager (weekly)",
        phase: "phase_1",
      },
      {
        time: "30 min",
        activity: "Pod check-in — are pods active? Any stuck?",
        owner: "Community Manager",
        phase: "phase_1",
      },
    ],
    fri: [
      {
        time: "Morning",
        activity:
          "LinkedIn framework post (scheduled) — one step from the 7-step method",
        owner: "Auto-publish",
        phase: "phase_1",
      },
      {
        time: "30 min",
        activity:
          "Community moderation review — any compliance flags this week?",
        owner: "GTM Lead",
        phase: "phase_1",
      },
      {
        time: "15 min",
        activity:
          "Content bank refill check — do we have 2 weeks of content ahead?",
        owner: "GTM Lead",
        phase: "phase_1",
      },
    ],
    sat: [
      {
        time: "",
        activity:
          "Instagram stories — behind the scenes, polls, quiz promotion",
        owner: "Scheduled or Community Manager",
        phase: "phase_1",
      },
      {
        time: "",
        activity:
          "Bonus LinkedIn engagement post if capacity allows",
        owner: "GTM Lead",
        phase: "phase_1",
      },
    ],
    sun: [
      {
        time: "",
        activity:
          "Instagram stories — behind the scenes, polls, quiz promotion",
        owner: "Scheduled or Community Manager",
        phase: "phase_1",
      },
    ],
  },
};

export default cadence;
