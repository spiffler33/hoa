/**
 * Phase checklists — extracted from gtm_content.md
 * Sections 4.3, 4.5 (Phase 0), 4.14 (Phase 1), 4.21 (Phase 2),
 * Phase overview table + Section 4.27 (Phase 3)
 *
 * Each phase has: objective, weeks, infrastructure, exitCriteria,
 * and weekByWeek (Phase 0 only).
 */

const phaseChecklists = {
  phase_0: {
    objective:
      "Establish brand presence, validate messaging with the wedge ICP, build infrastructure for community growth. No public community yet \u2014 this is preparation.",
    weeks: "1\u20134",
    infrastructure: [
      {
        id: "p0_i1",
        item: "Brand kit (logo, colours, fonts, templates) finalised",
      },
      {
        id: "p0_i2",
        item: "Landing page live with quiz + waitlist",
      },
      {
        id: "p0_i3",
        item: "Beehiiv account set up, welcome drip sequence active",
      },
      {
        id: "p0_i4",
        item: "Circle workspace configured (channels, roles, moderation rules)",
        notes: "Not launched yet",
      },
      {
        id: "p0_i5",
        item: "Metricool connected to LinkedIn + Instagram",
      },
      {
        id: "p0_i6",
        item: "Canva Pro team workspace with brand kit loaded",
      },
      {
        id: "p0_i7",
        item: "Typeform quiz live and capturing emails \u2192 Beehiiv",
      },
      {
        id: "p0_i8",
        item: "Founder LinkedIn profile optimised",
      },
      {
        id: "p0_i9",
        item: "Content bank: 20 LinkedIn posts, 15 Instagram carousels ready",
      },
      {
        id: "p0_i10",
        item: "Compliance: SEBI disclosure added to all social profiles",
      },
      {
        id: "p0_i11",
        item: "Compliance: Approved claims checklist reviewed with founder",
      },
      {
        id: "p0_i12",
        item: "Zapier/Make: quiz completion \u2192 Beehiiv tag \u2192 welcome drip",
      },
    ],
    exitCriteria: [
      { id: "p0_e1", item: "Waitlist has 500+ signups" },
      {
        id: "p0_e2",
        item: "Email drip sequence is active and has >50% open rate",
      },
      {
        id: "p0_e3",
        item: "At least 1 clear message winner per channel (LinkedIn, Instagram)",
      },
      {
        id: "p0_e4",
        item: "Founder has published the origin post and completed 2+ guest appearances",
      },
      {
        id: "p0_e5",
        item: "Circle workspace is configured and ready to open",
      },
      {
        id: "p0_e6",
        item: "Content bank has 2+ weeks of scheduled content",
      },
      {
        id: "p0_e7",
        item: "Compliance checklist reviewed with founder",
      },
      {
        id: "p0_e8",
        item: "Quiz is live and converting at >20% completion rate",
      },
    ],
    weekByWeek: [
      {
        week: 1,
        title: "Brand & Infrastructure",
        tasks: [
          {
            day: "Mon",
            task: "Visual identity finalisation \u2014 logo, colour palette, typography, post templates",
            owner: "Designer + GTM",
          },
          {
            day: "Tue",
            task: "Landing page v1 \u2014 manifesto, Yes Lifer Code, quiz embed, waitlist CTA",
            owner: "GTM + Designer",
          },
          {
            day: "Wed",
            task: "Email infrastructure \u2014 Beehiiv setup, welcome drip sequence drafted",
            owner: "GTM",
          },
          {
            day: "Thu",
            task: "Community platform setup \u2014 Circle workspace, channels created, moderation rules written",
            owner: "GTM",
          },
          {
            day: "Fri",
            task: "Founder LinkedIn profile optimisation \u2014 headline, banner, featured section",
            owner: "GTM + Founder",
          },
        ],
      },
      {
        week: 2,
        title: "Content Bank & Founder Launch",
        tasks: [
          {
            day: "Mon\u2013Tue",
            task: "Batch-create 20 LinkedIn posts and 15 Instagram carousels from content briefs",
            owner: "Content Producer + GTM",
          },
          {
            day: "Wed",
            task: "Founder\u2019s origin post \u2014 'Why I\u2019m building Yes Lifers' \u2014 drafted",
            owner: "GTM (ghostwrite)",
          },
          {
            day: "Thu",
            task: "Founder reviews and publishes origin post",
            owner: "Founder",
          },
          {
            day: "Fri",
            task: "Quiz \u2014 'What\u2019s your money personality?' \u2014 built in Typeform, embedded on landing page",
            owner: "GTM",
          },
        ],
      },
      {
        week: 3,
        title: "Message Testing",
        tasks: [
          {
            day: "Mon",
            task: "Launch message test A \u2014 LinkedIn carousel (tension framing)",
            owner: "GTM",
          },
          {
            day: "Tue",
            task: "Launch message test B \u2014 Instagram reel + carousel (guilt-free spending)",
            owner: "Content Producer",
          },
          {
            day: "Wed",
            task: "Launch message test C \u2014 Landing page A/B headline test",
            owner: "GTM",
          },
          {
            day: "Thu",
            task: "Launch message test D \u2014 LinkedIn text post (Reddit/crowdsourcing angle)",
            owner: "GTM",
          },
          {
            day: "Fri",
            task: "First founder guest appearance \u2014 podcast/Twitter Space/LinkedIn Live",
            owner: "Founder",
          },
        ],
      },
      {
        week: 4,
        title: "Validation & Phase 1 Prep",
        tasks: [
          {
            day: "Mon\u2013Tue",
            task: "Analyse message test results. Identify winning angles per channel.",
            owner: "GTM",
          },
          {
            day: "Wed",
            task: "Refine content bank based on winners. Update content briefs.",
            owner: "GTM + Content Producer",
          },
          {
            day: "Thu",
            task: "Second and third founder guest appearances booked/completed",
            owner: "Founder + GTM",
          },
          {
            day: "Fri",
            task: "Phase 0 exit review \u2014 do we meet exit criteria? Decision: proceed to Phase 1 or extend.",
            owner: "GTM",
          },
        ],
      },
    ],
  },

  phase_1: {
    objective:
      "Grow Yes Lifers to 2,000+ engaged members. Establish the 7-step journey as the organising framework. Create enough social proof and trust to launch the app into a warm audience. Validate the wedge.",
    weeks: "5\u201316",
    infrastructure: [],
    exitCriteria: [
      { id: "p1_e1", item: "Community has 2,000+ members" },
      {
        id: "p1_e2",
        item: "WAU is 40%+ for 4 consecutive weeks",
      },
      { id: "p1_e3", item: "20+ active pods" },
      {
        id: "p1_e4",
        item: "5+ organic referrals from within tech company networks",
      },
      {
        id: "p1_e5",
        item: "Wedge ICP represents 70%+ of community",
      },
      {
        id: "p1_e6",
        item: "At least 3 Hell Yes! Decision threads completed with strong engagement",
      },
      {
        id: "p1_e7",
        item: "Content engine running without founder bottleneck (2+ weeks of content always ahead)",
      },
      {
        id: "p1_e8",
        item: "Compliance framework reviewed with external advisor",
      },
      {
        id: "p1_e9",
        item: "Community manager is in place and operating independently",
      },
    ],
  },

  phase_2: {
    objective:
      "Launch the Yalpho app into the warmed community. Convert Yes Lifers members into active app users. Establish the community-to-app-to-advisory flywheel. Begin revenue generation.",
    weeks: "17\u201324",
    infrastructure: [],
    exitCriteria: [
      {
        id: "p2_e1",
        item: "1,000+ total app users (600 community + 400 public)",
      },
      {
        id: "p2_e2",
        item: "70%+ snapshot completion rate for community users",
      },
      {
        id: "p2_e3",
        item: "Paid conversion pipeline is active (>5% free \u2192 paid)",
      },
      {
        id: "p2_e4",
        item: "Advisory pipeline seeded (at least 10 qualified leads)",
      },
      {
        id: "p2_e5",
        item: "Community activity has not declined post-app-launch (WAU still 40%+)",
      },
      {
        id: "p2_e6",
        item: "At least 50 community share moments posted",
      },
      {
        id: "p2_e7",
        item: "Flywheel is visible: app milestone \u2192 community share \u2192 new member attracted",
      },
    ],
  },

  phase_3: {
    objective:
      "Sustain engagement, reduce churn, activate the advisory upsell flywheel, scale the community organically through member-generated social proof. Begin building toward investor-ready metrics.",
    weeks: "25+",
    infrastructure: [],
    exitCriteria: [
      { id: "p3_e1", item: "10,000 community members" },
      { id: "p3_e2", item: "3,000 MAU" },
      { id: "p3_e3", item: "100 advisory clients" },
      { id: "p3_e4", item: "Flywheel self-sustaining" },
    ],
  },
};

export default phaseChecklists;
