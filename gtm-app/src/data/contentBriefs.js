/**
 * Content brief definitions by channel — extracted from gtm_content.md
 * Sections 5.2 (LinkedIn), 5.3 (Instagram), 5.4 (Email), 5.5 (Community)
 *
 * Each channel contains format definitions with type, frequency, purpose,
 * tone, structure, and briefTemplate.  LinkedIn also carries examplePosts
 * and weekRotation for the Phase 1 Friday framework series.
 */

const contentBriefs = {
  /* ───────────────────────────── LINKEDIN ───────────────────────────── */
  linkedin: {
    frequency: "3–4 posts/week",
    voice:
      "Founder's personal voice (ghostwritten by GTM, founder reviews and publishes)",
    formats: [
      /* Monday — Philosophy Post */
      {
        type: "philosophy",
        day: "Monday",
        frequency: "Weekly",
        purpose:
          "Core tension framing. Thought leadership. The 'why' behind Yes Lifers.",
        tone: "Reflective, slightly contrarian, warm",
        structure: [
          "Hook — one provocative line that stops the scroll",
          "Tension — the problem stated honestly",
          "Reframe — the Yes Lifers perspective",
          "Close — one sentence that invites reflection, not action",
        ],
        briefTemplate: {
          HOOK: "One sentence — provocative, personal, or counterintuitive",
          TENSION:
            "2–3 sentences — the problem as the audience experiences it",
          REFRAME:
            "3–5 sentences — the Yes Lifers perspective. Not advice. A way of seeing.",
          CLOSE: "One question or statement that sits with the reader",
          CTA: "Soft — 'If this resonates, I'm building a community around this idea. Link in bio.'",
          COMPLIANCE:
            "No specific financial recommendations. No return promises. Educational/philosophical only.",
        },
      },
      /* Wednesday — Story Post */
      {
        type: "story",
        day: "Wednesday",
        frequency: "Weekly",
        purpose:
          "Real (anonymised) member stories or profile card narratives. The 'proof' that the method works.",
        tone: "Warm, specific, relatable",
        structure: [
          "Character intro — one sentence",
          "Before state — 2–3 sentences",
          "The moment of clarity — one specific realisation",
          "After state — 2–3 sentences",
          "The lesson — one line that universalises the story",
        ],
        briefTemplate: {
          CHARACTER: "1 sentence — anonymised, relatable, specific",
          BEFORE:
            "2–3 sentences — what their financial life looked like before",
          MOMENT:
            "The specific realisation or stress test that changed things",
          AFTER: "2–3 sentences — what changed, how it felt",
          LESSON: "1 line — what this means for the reader",
          CTA: "Medium — 'This is the kind of clarity the Yes Lifers community creates. Join us.' Or link to the quiz.",
          COMPLIANCE:
            "Anonymised. No specific fund names. No return claims. Experiential framing.",
          SOURCE:
            "Which profile card or real member story this is based on",
        },
      },
      /* Friday — Framework Post */
      {
        type: "framework",
        day: "Friday",
        frequency: "Weekly",
        purpose:
          "One step from the 7-step method explained. Educational. Shareable.",
        tone: "Clear, structured, practical",
        structure: [
          "Title slide — step name + one-line description",
          "What this step is — 2 slides",
          "Why it matters — 1 slide",
          "What it looks like in practice — 2–3 slides (examples)",
          "The declaration — 'I know exactly what I'm building toward.'",
          "CTA — 'This is Step [N] of the Yes Lifers method. Join the community where we walk this journey together.'",
        ],
        briefTemplate: {
          STEP_NUMBER: "Which step (1–7) this post covers",
          TITLE: "Step name + one-line description",
          WHAT_IT_IS: "2 slides of explanation",
          WHY_IT_MATTERS: "1 slide — the insight",
          IN_PRACTICE: "2–3 slides — concrete examples",
          DECLARATION: "The statement this step enables",
          CTA: "Link to community",
          COMPLIANCE:
            "Educational only. No personalised advice. No return claims.",
        },
      },
      /* Bonus — Engagement Post */
      {
        type: "engagement",
        day: "Varies",
        frequency: "1x/week when capacity allows",
        purpose: "Drive comments and conversation. Algorithm fuel.",
        tone: "Playful, slightly provocative",
        structure: [
          "Short text — polls, hot takes, contrarian angles",
        ],
        briefTemplate: {
          HOOK: "One provocative question, poll, or contrarian statement",
          TONE: "Playful — invites debate, not lecture",
          CTA: "Implicit — the engagement IS the CTA",
          COMPLIANCE: "No specific financial advice or return claims.",
        },
      },
    ],

    examplePosts: [
      "You've been responsible for 15 years. SIPs running. Insurance in place. Kids in good schools. Career on track. When did you last ask what it's all for? Not 'am I saving enough.' But — what am I building toward? Most parents I speak to can tell you their child's board exam date. Ask them when they plan to retire and you'll get a shrug. The plan isn't missing because you're careless. It's missing because no one taught responsible people how to want things without guilt.",
      "Guilt-free spending is a financial outcome, not a personality trait. You can engineer it. It starts with knowing — with certainty — that your child's education is funded, your retirement SIP is running, your protection is in place, and your parents are covered. After that? The family trip, the anniversary dinner, the home upgrade — it's not irresponsible. It's the entire point. You didn't work this hard to feel guilty about a holiday.",
      "Your daughter turns 18 in 5 years. You want to retire in 12. Your parents need support now. Three timelines. One income. Zero framework. Most families I work with have done everything right — SIPs, term cover, PPF, even some direct equity. But they've never sat down and asked: can all three of these things happen? And if not, what do we trade? That's not a spreadsheet question. That's a life design question.",
    ],

    engagementExamples: [
      "Unpopular opinion: your emergency fund is too big.",
      "Poll: Have you ever felt guilty after a purchase you could easily afford?",
      "The best financial decision I ever made had nothing to do with investing.",
      "Your financial advisor has never asked you what makes you happy. Why not?",
    ],

    weekRotation: [
      { week: 5, step: 1, angle: "The financial picture you've been avoiding" },
      { week: 6, step: 2, angle: "What are you actually saying yes to?" },
      { week: 7, step: 3, angle: "What if your budget started with desire?" },
      {
        week: 8,
        step: 4,
        angle: "The ₹1 Cr decision you're making on vibes",
      },
      {
        week: 9,
        step: 5,
        angle:
          "Why knowing what to do and doing it are different problems",
      },
      {
        week: 10,
        step: 6,
        angle: "Why solo financial planning has a 90% failure rate",
      },
      { week: 11, step: 7, angle: "The plan that grows with you" },
      {
        week: 12,
        step: 1,
        angle: "Clarity: what most people get wrong",
      },
      {
        week: 13,
        step: 3,
        angle: "A real Yes Budget — line by line",
      },
      {
        week: 14,
        step: 4,
        angle: "How to think through a home purchase decision",
      },
      {
        week: 15,
        step: 2,
        angle: "The Yes List: why writing it down changes everything",
      },
      {
        week: 16,
        step: null,
        angle:
          "The 7 steps, the community, and what's coming next (pre-launch tease)",
      },
    ],
  },

  /* ──────────────────────────── INSTAGRAM ───────────────────────────── */
  instagram: {
    frequency: "4–5 posts/week",
    voice: "Yes Lifers brand voice (not founder-personal — brand-warm)",
    formats: [
      /* Carousel */
      {
        type: "carousel",
        frequency: "2–3/week",
        purpose:
          "Visual breakdowns of 7 steps, Yes Budget concept, community wins. High-save, high-share.",
        tone: "Brand-warm, aspirational but grounded",
        structure: [
          "Title slide — bold statement or question, max 8 words",
          "Slides 2–7 — one idea per slide, max 30 words per slide, visual hierarchy: headline + supporting line",
          "Final slide — CTA: 'Take the quiz. Link in bio.' or 'Join the Yes Lifers community.'",
        ],
        briefTemplate: {
          TITLE_SLIDE: "Bold statement or question — max 8 words",
          SLIDES:
            "One idea per slide. Max 30 words per slide. Visual hierarchy: headline + supporting line.",
          FINAL_SLIDE:
            "CTA — 'Take the quiz. Link in bio.' or 'Join the Yes Lifers community.'",
          DESIGN:
            "Yes Lifers brand kit. Aspirational but grounded. Not 'finance bro' or 'self-help pastel.'",
          COMPLIANCE:
            "No specific return claims. No fund names. Educational/philosophical only.",
        },
      },
      /* Reel */
      {
        type: "reel",
        frequency: "1–2/week",
        purpose:
          "15–30 second hooks. Founder talking head + text overlay. Or animated text over lifestyle footage.",
        tone: "Punchy, warm, visual",
        structure: [
          "Hook (first 2 seconds) — text on screen + founder speaking, one provocative question or statement",
          "Body (10–20 seconds) — the reframe, the Yes Lifers perspective, short, punchy, warm",
          "Close (3–5 seconds) — CTA text on screen: 'Link in bio for the quiz.' or 'Join Yes Lifers.'",
        ],
        briefTemplate: {
          HOOK: "Text on screen + founder speaking — one provocative question or statement",
          BODY: "The reframe. The Yes Lifers perspective. Short, punchy, warm.",
          CLOSE:
            "CTA text on screen. 'Link in bio for the quiz.' or 'Join Yes Lifers.'",
          AUDIO:
            "Trending audio if appropriate, or founder voiceover",
          COMPLIANCE:
            "Same as carousel — no specific advice, no return claims",
        },
      },
      /* Stories */
      {
        type: "stories",
        frequency: "Daily",
        purpose:
          "Behind-the-scenes, community screenshots (with permission), polls, quiz promotions",
        tone: "Casual, behind-the-scenes",
        structure: [
          "Mix of polls, BTS content, community screenshots, and quiz promotions",
        ],
        briefTemplate: {
          CONTENT: "Behind-the-scenes, poll, quiz promo, or community screenshot",
          PERMISSION:
            "Community screenshots require member permission",
          COMPLIANCE: "Same channel-wide compliance rules apply",
        },
      },
    ],
  },

  /* ──────────────────────────── EMAIL ───────────────────────────────── */
  email: {
    frequency: "Welcome drip (4 emails over 10 days) + ongoing newsletter (weekly or bi-weekly in Phase 1+)",
    voice: "Yes Lifers brand voice — warm, clear, purposeful",
    formats: [
      /* Welcome drip sequence */
      {
        type: "welcomeDrip",
        frequency: "One-time per subscriber, 4 emails over 10 days",
        purpose:
          "Onboard new subscribers from waitlist → community invite",
        tone: "Warm, purposeful, progressive",
        structure: [
          "Email 1 (Day 0) — Welcome: manifesto in short form, who we are, what we believe",
          "Email 2 (Day 3) — The Method: 7-step journey overview, one line per step",
          "Email 3 (Day 7) — The Story: one profile card story (Deepika & Sanjay — most relatable for the wedge)",
          "Email 4 (Day 10) — The Invite: direct community invite, what to expect, what to post first",
        ],
        briefTemplate: {
          EMAIL_NUMBER: "1–4",
          SEND_DAY: "Day relative to signup (0, 3, 7, or 10)",
          SUBJECT_LINE: "Short, personal, curiosity-driven",
          CONTENT:
            "Match the email's purpose — manifesto / method / story / invite",
          CTA: "Progress through: read manifesto → take quiz → join community",
          COMPLIANCE:
            "No specific financial advice. Educational and community-building only.",
        },
        emails: [
          {
            number: 1,
            day: 0,
            subject: "Welcome, Yes Lifer",
            content:
              "The manifesto in short form. Who we are, what we believe, what you just joined.",
            cta: "Read the full manifesto",
          },
          {
            number: 2,
            day: 3,
            subject: "The 7 steps (and why order matters)",
            content:
              "Brief overview of the 7-step journey. One line per step.",
            cta: "Take the quiz to find your starting point",
          },
          {
            number: 3,
            day: 7,
            subject:
              "They earned well for 15 years and had no plan",
            content:
              "One profile card story (Deepika & Sanjay — most relatable for the wedge)",
            cta: "Join the community",
          },
          {
            number: 4,
            day: 10,
            subject: "Your tribe is waiting",
            content:
              "Direct community invite. What to expect inside. What to post first.",
            cta: "Join the Yes Lifers community",
          },
        ],
      },
      /* Ongoing newsletter */
      {
        type: "newsletter",
        frequency: "Weekly or bi-weekly (Phase 1+)",
        purpose:
          "Keep subscribers engaged, surface community value, drive activation",
        tone: "Warm, concise, value-forward",
        structure: [
          "Community highlight — one anonymised member win (social proof)",
          "One insight from a Hell Yes! Decision thread (demonstrate community value)",
          "One framework tip from the 7-step method (education)",
          "Upcoming events — Clarity Circle, pod recruitment (activation)",
        ],
        briefTemplate: {
          COMMUNITY_HIGHLIGHT:
            "One anonymised member win — experiential, not numerical",
          DECISION_INSIGHT:
            "One insight from a Hell Yes! Decision thread — framework-level, not advice",
          FRAMEWORK_TIP:
            "One step or concept from the 7-step method — practical and actionable",
          EVENTS:
            "Upcoming Clarity Circle, pod recruitment, or community events",
          COMPLIANCE:
            "Anonymised. No specific fund or return claims. Experiential framing.",
        },
      },
    ],
  },

  /* ──────────────────────────── COMMUNITY ──────────────────────────── */
  community: {
    frequency: "Daily prompts + bi-weekly threads + weekly pod check-ins",
    voice: "Community Manager — warm, encouraging, facilitative",
    formats: [
      /* Say Yes Moment daily prompt */
      {
        type: "sayYesMoment",
        frequency: "Daily",
        purpose:
          "Normalise intentional spending and celebrate small wins",
        tone: "Warm, encouraging, low-pressure",
        structure: [
          "One rotating prompt per day — open-ended, invites sharing",
        ],
        briefTemplate: {
          PROMPT:
            "One open-ended question that invites sharing of a win, intention, or aspiration",
          TONE: "Warm, non-judgmental, celebratory",
          COMPLIANCE:
            "Prompts must never ask for specific numbers, returns, or fund names",
        },
        rotatingPrompts: [
          "What did you say yes to today — big or small?",
          "What's one thing you spent money on this week that you don't regret?",
          "What's on your Yes List that you haven't said yes to yet? What's holding you back?",
          "What's one financial win from this week — even a tiny one?",
          "What would you say yes to if money wasn't the question?",
          "What's one thing you want your kids to see you say yes to?",
          "What's something you deferred for your family that you're ready to reclaim?",
          "What decision are you putting off because it affects your whole family?",
        ],
      },
      /* Hell Yes! Decision Thread */
      {
        type: "hellYesDecision",
        frequency: "Bi-weekly",
        purpose:
          "Structured community discussion of big financial decisions using frameworks, not advice",
        tone: "Structured, supportive, framework-focused",
        structure: [
          "DECISION — anonymised description of the decision",
          "CONTEXT — 2–3 sentences of relevant financial context (income range, life stage, goals)",
          "THE TWO PATHS — Path A (with the decision) vs Path B (without/alternative)",
          "WHAT I'M STRUGGLING WITH — the specific tension or trade-off",
          "WHAT WOULD HELP — what kind of thinking would be useful (frameworks, not 'should I')",
          "MODERATION NOTE — redirect to app/advisor for personalised analysis",
        ],
        briefTemplate: {
          DECISION:
            "Anonymised description — 'I'm considering buying a home in [city] at approximately ₹X'",
          CONTEXT:
            "2–3 sentences of relevant financial context — income range, life stage, goals",
          TWO_PATHS:
            "Path A — with the decision. Path B — without / alternative.",
          STRUGGLE:
            "The specific tension or trade-off",
          WHAT_WOULD_HELP:
            "What kind of thinking would be useful — not 'should I do it' but 'how should I think about this'",
          MODERATION_NOTE:
            "Please share frameworks and thinking approaches, not specific financial recommendations. If this decision needs personalised analysis, the Hell Yes! Decision tool in the app or a free advisor call can help.",
        },
      },
      /* Pod facilitator weekly check-in */
      {
        type: "podCheckIn",
        frequency: "Weekly per pod",
        purpose:
          "Structured accountability within small groups (4–6 members)",
        tone: "Honest, non-judgmental, supportive",
        structure: [
          "1. What did you commit to last week?",
          "2. Did you do it? (No judgment either way — just honesty.)",
          "3. If not, what got in the way?",
          "4. What are you committing to this week?",
          "5. One thing you're saying yes to this week — financial or otherwise.",
        ],
        briefTemplate: {
          WEEK_NUMBER: "Which week of the pod's 6-week sprint",
          POD_NAME: "Pod identifier",
          FACILITATOR: "Community Manager (Weeks 5–12) or veteran member (Week 12+)",
          COMPLIANCE:
            "No specific financial advice. Keep discussion at framework level.",
        },
      },
    ],
  },
};

export default contentBriefs;
