/**
 * Reference content for the Reference view — extracted from gtm_content.md
 * Sections 1.2–1.4 (ICP & wedge), 2.2–2.5 (roles & RACI), 3.2–3.8 (compliance),
 * 4.8–4.11 (community structure & rituals), 6.1–6.4 (monetisation), Appendix A (vocabulary)
 *
 * Each section: { title, subsections: [{ id, heading, content }] }
 * Content is a string (prose) or array of strings (list items / table rows).
 */

const referenceContent = {
  /* ─────────────────── ICP & WEDGE (Sections 1.2–1.4) ──────────────── */
  icp: {
    title: "Launch ICP & Wedge",
    subsections: [
      {
        id: "icp_primary",
        heading: "Primary ICP — Phase 0 & 1",
        content:
          "Urban Indian couples aged roughly 38–48, especially parents with teenage or near-teen children. Typically dual-income or financially established. Based in Tier 1 cities — Bangalore, Mumbai, Pune, Delhi NCR, Hyderabad. Combined household income ₹3L–10L/month. Already investing — SIPs running, some direct equity, insurance in place, possibly real estate. Have done many 'right things' financially but do not feel clear. Juggling children's education, aging parents, career transitions, health, retirement, and the desire to live more intentionally. Making life decisions reactively — not because they lack money, but because they lack a framework for weighing competing priorities without guilt.",
      },
      {
        id: "icp_why",
        heading: "Why This Segment First",
        content: [
          "Pain intensity — Very high: accumulated responsibility, not early-career uncertainty. These households are asking 'how do we make meaningful life decisions without guilt, confusion, or feeling like we are failing somewhere else?'",
          "Identity readiness — They have been responsible for years and want permission to reclaim life. The Yes Lifer identity speaks to who they want to become, not who they already are.",
          "Founder credibility — House of Alpha's advisory client base skews toward this demographic. The SEBI registration and advisory track record feel most authentic and credible with this audience — because they are this audience.",
          "Distribution density — Concentrated in LinkedIn professional networks, school parent communities, corporate wellness circles, and Tier 1 city social networks. Corporate 'financial wellness for working parents' workshops provide a high-trust introduction channel.",
          "Willingness to pay — ₹2,999–₹4,999 is trivial at this income level. The barrier is trust, not price. This cohort is also more likely to convert to advisory (₹4,999+) because the complexity of their situation genuinely warrants it.",
          "Decision urgency — Actively facing simultaneous Hell Yes! Decisions: children's higher education funding (₹15L–₹50L+ in 3–7 years), second-innings career planning, retirement clarity, aging parent care, deferred travel and lifestyle goals.",
        ],
      },
      {
        id: "icp_secondary",
        heading: "Secondary ICP — Phase 2 Expansion",
        content:
          "Younger professionals and couples in Tier 1 cities. Age 28–38. ₹2L–6L/month income. Dual-income or single high earner. Early career to growing family. The 'Arjun & Meera' and 'Nisha' profiles from the app. The community proof, content library, and brand credibility from Phase 1 make this segment reachable — and the aspiration flows naturally: younger earners look at the Yes Lifer parents and see who they want to become.",
      },
      {
        id: "icp_messaging",
        heading: "Wedge-Specific Messaging",
        content: [
          "Responsibility ≠ clarity — 'You've been responsible for 15 years. When did you last ask what it's all for?'",
          "Competing timelines — 'Your child's 11th-grade board exams and your retirement land in the same decade. Have you planned for both?'",
          "Deferred living — 'You delayed that trip again. Not because you can't afford it — because it felt irresponsible.'",
          "Accumulated overload — 'You've made every right financial move. Why doesn't it feel calm yet?'",
          "Education funding anxiety — 'Your child is 13. You have 5 years to fund their dream. Do you know the number?'",
          "Duty vs desire — 'You don't have to choose between being a responsible parent and living a meaningful life.'",
        ],
      },
      {
        id: "icp_validation",
        heading: "Wedge Validation Criteria",
        content: [
          "70%+ of Phase 1 community members match the primary ICP profile (38–48, parents, urban)",
          "Message testing shows >3% engagement on wedge-specific content (parental tension, duty vs desire, competing timelines — not just broad philosophical content)",
          "At least 5 organic community referrals from within parent/professional networks (member-to-member)",
          "Quiz completion data shows wedge segment has meaningfully higher completion rates than other segments",
          "At least 3 community members have brought a Hell Yes! Decision that maps to the app's decision categories (education funding, retirement clarity, second-innings planning, aging parent support)",
        ],
      },
    ],
  },

  /* ─────────────── ROLES & OWNERSHIP (Sections 2.2–2.5) ─────────── */
  roles: {
    title: "Operating Model & Ownership",
    subsections: [
      {
        id: "roles_map",
        heading: "Role Map — Phase 0 & 1",
        content: [
          "GTM — 35–40 hrs/week — Overall GTM execution, weekly review, funnel monitoring, stage gates, content calendar, partnerships, metrics, course corrections",
          "Founder (content face) — 8–10 hrs/week — 2 LinkedIn posts/week (ghostwritten), 1 live session/month, guest appearances, community tone approval, advisory calls",
          "Community Manager — 15–20 hrs/week (hire by Week 5) — Daily moderation, onboarding DMs, pod coordination, ritual facilitation, advice-boundary escalation",
          "Content Producer — 10–15 hrs/week (freelancer) — Carousel design, Instagram content, reel editing, PDF templates, community graphics",
          "Compliance Reviewer — 2–3 hrs/week — Pre-publication review against checklist, testimonial approval, boundary-issue flagging",
          "Designer — 5–8 hrs/week (freelancer) — Brand assets, landing page, app-community screens, event graphics (batch work)",
        ],
      },
      {
        id: "roles_raci",
        heading: "RACI Matrix — Key Workstreams",
        content: [
          "Content calendar & publishing — GTM: A,R | Founder: C | CM: I | Content Producer: R | Compliance: C",
          "Community daily operations — GTM: A | Founder: I | CM: R | Compliance: C",
          "Accountability pods — GTM: A | Founder: I | CM: R",
          "Partnership outreach — GTM: R,A | Founder: C | Content Producer: R | Compliance: C",
          "Waitlist & email nurture — GTM: R,A | Founder: C | Content Producer: R | Compliance: C",
          "Message testing & optimisation — GTM: R,A | Founder: C | CM: I | Content Producer: R | Compliance: C",
          "Funnel monitoring & stage gates — GTM: R,A | Founder: I | CM: I",
          "App onboarding community path — GTM: R,A | Founder: C | CM: C",
          "Advisory pipeline & handoff — Founder: R,A | GTM: C | CM: I | Compliance: C",
          "Compliance review — Compliance: R | Founder: A | GTM: C | CM: C",
          "Landing page & quiz — GTM: R,A | Founder: C | Content Producer: R | Compliance: C",
          "Weekly GTM review — GTM: R,A | Founder: I | CM: C",
        ],
      },
      {
        id: "roles_founder_time",
        heading: "Founder Time Budget",
        content: [
          "Review & publish LinkedIn posts (ghostwritten) — 30 min × 2/week — Never delegated",
          "Record short-form video (reels, talking head) — 1 hr × 1/week (batched monthly) — Delegate Month 6",
          "Host Clarity Circle or live session — 1 hr × 1/month — Veteran members co-host Month 4",
          "Guest podcast/LinkedIn Live appearances — 1.5 hrs × 2/month — Never delegated",
          "Review content for compliance — 30 min × 1/week — Delegate when external advisor onboarded",
          "Advisory calls (Option 3 clients) — 1 hr as needed — Never delegated (revenue engine)",
          "GTM weekly review (read summary, flag issues) — 15 min × 1/week — Never delegated",
        ],
      },
      {
        id: "roles_hiring",
        heading: "Hiring Triggers",
        content: [
          "Community Manager (PT → FT) — Community exceeds 500 members OR daily moderation >2 hrs/day — Phase 1, Week 8–10",
          "Second content creator — Missing >2 calendar slots/week for 2 consecutive weeks — Phase 1, Week 12+",
          "GTM analyst — Metric input and dashboard maintenance exceeds 5 hrs/week — Phase 2",
          "Sales/advisory coordinator — Advisory pipeline exceeds 20 qualified leads/month — Phase 3",
        ],
      },
    ],
  },

  /* ──────────────── COMPLIANCE (Sections 3.2–3.8) ──────────────── */
  compliance: {
    title: "Compliance Framework",
    subsections: [
      {
        id: "compliance_sebi",
        heading: "SEBI Regulatory Context",
        content: [
          "SEBI (Investment Advisers) Regulations, 2013 (as amended) — governs IA conduct, advice delivery, fee structures",
          "SEBI Master Circular for Investment Advisers (February 6, 2026) — consolidated guidance on conduct, advertising, onboarding",
          "SEBI Circular on Social Media Disclosure (February 26, 2026) — registered entities must disclose name and registration number",
          "SEBI Advertisement Code for IAs — governs claims, testimonials, promotional content",
        ],
      },
      {
        id: "compliance_disclosure",
        heading: "Social Media Disclosure Requirements",
        content: [
          "Mandatory on every platform: Registered name + SEBI Registration Number (INA number) in bio/about",
          "Per-post: Any post referencing financial planning, investment strategy, or advice must include the registration disclosure",
        ],
      },
      {
        id: "compliance_claims",
        heading: "Approved Claims Library",
        content: [
          "ALWAYS ALLOWED — General financial literacy, Yes Lifers philosophy, 7-step journey as framework, statistics with source citation, Yes Budget as budgeting philosophy",
          "ALLOWED WITH DISCLOSURE — 'SEBI Registered Investment Adviser' (with reg number), 'Personalised financial plan' (no guaranteed outcomes), pricing, 'Complimentary advisor call'",
          "NEVER ALLOWED — Specific return promises, performance guarantees, fund/stock recommendations in public, unsubstantiated comparisons, personalised advice outside regulated relationship, market-timing urgency",
          "CAUTION ZONE — Member testimonials, 'What Could Be' scenarios with numbers, Hell Yes! Decision discussions, profile card stories with figures, before/after comparisons",
        ],
      },
      {
        id: "compliance_testimonials",
        heading: "Testimonial Rules",
        content: [
          "Members may share experience of the process (feelings, clarity, emotional impact) — experiential, not advice",
          "Members may NOT share specific returns, portfolio performance, or fund recommendations",
          "Members may NOT imply results are typical or guaranteed",
          "Every testimonial in marketing must include: 'Individual experiences may vary. Past results are not indicative of future performance.'",
          "Video testimonials: disclaimer in description and ideally spoken/displayed",
          "Community share template must never prompt members to share numbers, returns, or fund names",
        ],
      },
      {
        id: "compliance_boundary",
        heading: "Education-to-Advice Boundary",
        content: [
          "EDUCATION (community, content, free app) — General principles, frameworks (7 steps, Yes Budget, Hell Yes!), free financial snapshot (shows picture, not recommendation), community discussions at framework level",
          "ADVICE (paid plan, investment advisory, implementation) — Personalised recommendations (specific funds, allocation, SIP amounts), portfolio buy/sell/hold, tax optimisation, any 'you should do X' for a specific user",
          "Moderation protocol: Redirect warmly ('Great question — and one that deserves personalised analysis'), DM repeated offenders privately, escalate to compliance reviewer if clearly advice",
        ],
      },
      {
        id: "compliance_checklist",
        heading: "Pre-Publication Checklist",
        content: [
          "Does the post include SEBI disclosure (registration name + number) where required?",
          "Does the post avoid specific return promises or performance guarantees?",
          "Does the post avoid specific fund/stock/product recommendations?",
          "If testimonial content is included, does it include the required disclaimer?",
          "If before/after scenarios are shown, are they marked as illustrative?",
          "Does the post avoid urgency/fear language about markets?",
          "If the post references app or advisory services, is pricing disclosed accurately?",
          "Has the post been reviewed by the compliance reviewer?",
        ],
      },
      {
        id: "compliance_cadence",
        heading: "Compliance Review Cadence",
        content: [
          "Content pre-publication review — Every externally published post — GTM drafts, Compliance Reviewer approves",
          "Community audit — Weekly: scan for advice-boundary violations — CM flags, GTM reviews",
          "Testimonial review — Before each use in marketing — Compliance Reviewer approves",
          "Approved claims library update — Monthly — GTM updates, Compliance Reviewer approves",
          "Full compliance review with external advisor — Quarterly — Founder + GTM + External Advisor",
        ],
      },
    ],
  },

  /* ──────── COMMUNITY STRUCTURE & RITUALS (Sections 4.8–4.11) ──────── */
  community: {
    title: "Community Structure & Rituals",
    subsections: [
      {
        id: "community_platform",
        heading: "Platform & Channel Structure",
        content: [
          "#introductions — New member onboarding. Template: 'I'm [name], I'm saying yes to [aspiration], and my first step is [action].' (Light moderation)",
          "#clarity-moments (Step 1) — Members share how it felt to see their financial picture. Not numbers — feelings. (Moderate moderation)",
          "#yes-list (Step 2) — Members share their Yes Lists. Experiences, freedoms, milestones they refuse to defer. (Light)",
          "#yes-budget-wins (Step 3) — Wins from living the Yes Budget. The dinner said yes to. The SIP not skipped. (Light)",
          "#hell-yes-decisions (Step 4) — Big decisions brought for structured discussion. Anonymised if needed. (Heavy — compliance actively managed)",
          "#accountability-pods — Pod-specific threads. Private sub-channels for each pod. (Moderate — CM checks weekly)",
          "#general — Open discussion. Community building. (Light)",
          "#resources — Curated resources, articles, tools. GTM lead and CM post only. (Curated — no member posting)",
        ],
      },
      {
        id: "community_entry",
        heading: "Entry Flow",
        content: [
          "1. Waitlist signup → email drip completes → community invite email with personalised link",
          "2. New member lands on Circle → onboarding DM from Community Manager with welcome + template prompt",
          "3. Member posts in #introductions using template",
          "4. Community Manager replies with warm welcome and suggests first channel based on their intro",
          "5. After 7 days, prompt to join an accountability pod",
        ],
      },
      {
        id: "community_pods",
        heading: "Accountability Pods",
        content: [
          "Small groups: 4–6 members matched by life stage and financial goals",
          "6-week sprint commitment with shared goal (e.g., 'build a 3-month emergency fund')",
          "Weekly async check-in in private pod channel: What did I commit to? Did I do it? What's next?",
          "Pod completion celebrated publicly in the community",
          "At sprint end: option to continue with same pod, join new pod, or take a break",
          "Matching criteria: life stage, primary goal (from intro post), location (same city preferred), availability",
          "Facilitation: Weeks 5–12 by Community Manager; Weeks 12+ veteran members trained as facilitators",
        ],
      },
      {
        id: "community_rituals",
        heading: "Community Rituals",
        content: [
          "Clarity Circle — Weekly, Thu 9 PM IST — Live audio — Founder 1x/month, CM other weeks — Share wins, ask questions, get support",
          "Say Yes Moment — Daily — Community post prompt — CM — Normalises intentional spending",
          "Hell Yes! Decision Thread — Bi-weekly — Structured thread — CM facilitates — One member presents a big decision",
          "Monthly Retrospective — Monthly — Written post + live discussion — GTM + Founder — Community growth, wins, upcoming plans",
          "Pod Completion Celebration — At sprint end — Public post + badges — CM — Celebrate pod graduates, social proof for next cohort",
        ],
      },
      {
        id: "community_partnerships",
        heading: "Strategic Partnerships — Phase 1",
        content: [
          "Co-branded content — 2–3 Indian finance/lifestyle creators (10K–100K followers) — Joint carousels or live sessions, co-creation not sponsorship",
          "Cross-pollination — Adjacent communities (Finshots, ET Money, Kuvera forums) — Guest posts offering Yes Budget template as value-add",
          "Corporate tie-ins — 2–3 mid-size tech companies (HR/wellness) — 'Yes Lifers for Teams' 60-min workshop, free, captures leads",
          "Podcast/media — 3–5 appearances across Phase 1 — Founder appears on Indian PF/lifestyle podcasts",
        ],
      },
    ],
  },

  /* ─────────────── MONETISATION (Sections 6.1–6.4) ──────────────── */
  monetisation: {
    title: "Monetisation & Service Design",
    subsections: [
      {
        id: "monetisation_revenue",
        heading: "Revenue Architecture",
        content: [
          "Option 1 — Financial Plan — ₹2,999 one-time — Trigger: app snapshot completed → upgrade prompt — Target: 150 plans/month by Month 12",
          "Option 2 — Plan + Advisory — ₹4,999 one-time — Trigger: plan delivered → 'which fund exactly?' moment (Day 5–7) — Target: 60 upgrades/month",
          "Option 3 — Implementation — Fee or commission (user chooses) — Trigger: advisory delivered → actions not completed (Day 14+) — Target: 20 clients/month",
          "Advisory (ongoing) — AUM-based or fixed fee — Trigger: implementation clients → ongoing relationship — Target: 100 total clients by Month 12",
        ],
      },
      {
        id: "monetisation_unit_economics",
        heading: "Unit Economics (Working Estimates)",
        content: [
          "Community → app conversion: 30% (pre-sold members convert better)",
          "Cold → app conversion: 10–15% (standard for fintech)",
          "Snapshot completion → paid plan: 15% (strong if 'What Could Be' card lands)",
          "Plan → advisory upgrade: 25–30% ('which fund exactly?' is a natural moment)",
          "Advisory → implementation: 30–40% (highest intent, highest value)",
          "Average revenue per community member (Year 1): ₹450–₹600 blended",
          "CAC (community path): Near-zero (organic, time cost not included)",
          "CAC (paid acquisition, if used): ₹200–₹500 (validate in Phase 2)",
        ],
      },
      {
        id: "monetisation_advisory_capacity",
        heading: "Advisory Capacity Planning",
        content: [
          "Advisor capacity: 25–30 active clients per advisor",
          "Number of advisors needed: 3–4 (including founder) for 100 clients",
          "Average onboarding time: 3 hours (call + plan review + setup)",
          "Ongoing service per client: 1 hour/month (quarterly review + ad hoc)",
          "Revenue per client (annual): ₹4,999 (plan) + advisory fees (₹10,000–₹30,000/year estimated)",
          "Total advisory revenue potential (100 clients): ₹15L–₹35L/year",
          "Hiring trigger: Pipeline exceeds 30 qualified leads/month with founder handling all calls → hire first dedicated advisor",
        ],
      },
      {
        id: "monetisation_pricing_validation",
        heading: "Pricing Validation",
        content: [
          "Monitor conversion rates at each price point weekly",
          "If Option 1 conversion <10%, test lower entry point (₹1,999) or time-limited offer",
          "If Option 1 → Option 2 upgrade <15%, the 'which fund exactly?' moment isn't landing — revise upgrade prompt copy",
          "Consider annual pricing for ongoing advisory (₹9,999/year or similar) vs one-time",
        ],
      },
    ],
  },

  /* ─────────────── VOCABULARY (Appendix A) ──────────────────────── */
  vocabulary: {
    title: "Community Vocabulary",
    subsections: [
      {
        id: "vocabulary_terms",
        heading: "Standard Terms — Use Consistently Across All Communications",
        content: [
          "Yes Lifer — The member identity",
          "Say Yes to Life! — The rallying cry",
          "The Yes Life — The life members are designing",
          "Say Yes moment — A win worth celebrating",
          "The calibration — The ongoing act of balancing life and wealth",
          "Hell Yes! Decision — A big call made with full clarity",
          "The method — The 7-step journey",
          "Wealth engine — The automated investment system",
          "Life-rich — Rich in experience and in wealth",
          "Yes Budget — A budget built around desire, not restriction",
        ],
      },
    ],
  },
};

export default referenceContent;
