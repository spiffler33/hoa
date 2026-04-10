import { useState } from “react”;

const tools = [
{
category: “Community Platform”,
phase: “Phase 0-1”,
icon: “🏠”,
items: [
{
name: “Circle”,
url: “circle.so”,
pricing: “$89/mo (Professional) \u2013 $199/mo (Business)”,
why: “Best-in-class community platform. Channels, events, courses, member directory, branded app. Owns your audience (unlike Facebook Groups). Built-in email hub.”,
role: “Core community home for Yes Lifers. Channels map to the 7 steps, accountability pods, events.”,
alt: “Skool ($99/mo, simpler), Geneva (free, less features), Mighty Networks ($41/mo)”,
priority: “critical”,
},
],
},
{
category: “Email & Newsletter”,
phase: “Phase 0”,
icon: “📧”,
items: [
{
name: “Beehiiv”,
url: “beehiiv.com”,
pricing: “Free up to 2,500 subs. Scale: $42/mo (annual)”,
why: “Built by ex-Morning Brew team. Superior email designer, built-in referral program (Boosts), ad network for monetisation. Better value than ConvertKit at scale. 0% cut on paid subs.”,
role: “Waitlist capture, drip sequences, newsletter, quiz result delivery. Referral program powers organic growth.”,
alt: “Kit/ConvertKit (better automations for product sales, $39/mo), Substack (simpler, 10% rev cut)”,
priority: “critical”,
},
],
},
{
category: “Landing Page & Quiz”,
phase: “Phase 0”,
icon: “🎯”,
items: [
{
name: “Typeform”,
url: “typeform.com”,
pricing: “Free (10 responses/mo). Basic: $25/mo”,
why: “Beautiful conversational forms. Perfect for the \u201CWhat\u2019s your money personality?\u201D quiz. Logic jumps, scoring, shareable result pages.”,
role: “Quiz funnel, lead capture, NPS surveys, churn interviews.”,
alt: “Tally (free, open-source feel), Google Forms (free, ugly)”,
priority: “high”,
},
{
name: “Carrd”,
url: “carrd.co”,
pricing: “Free (1 site). Pro: $19/year”,
why: “Dead simple single-page sites. Perfect for a quick waitlist landing page before building the real site.”,
role: “Waitlist landing page v1 in Phase 0. Replace with proper site later.”,
alt: “Webflow ($14/mo, more powerful), Framer ($5/mo), Linktree (link-in-bio only)”,
priority: “medium”,
},
],
},
{
category: “Social Media Management”,
phase: “Phase 0-1”,
icon: “📱”,
items: [
{
name: “Metricool”,
url: “metricool.com”,
pricing: “Free (1 brand). Starter: $20/mo”,
why: “Schedule + analytics + competitor tracking in one tool. Covers LinkedIn, Instagram, Twitter, YouTube. Cheaper than Hootsuite/Buffer with better analytics.”,
role: “Content scheduling, engagement tracking, competitor analysis, optimal posting times. Tracks all GTM KPIs.”,
alt: “Buffer ($6/mo, simpler), Hootsuite ($99/mo, enterprise), Later ($25/mo, Instagram-first)”,
priority: “high”,
},
{
name: “Canva Pro”,
url: “canva.com”,
pricing: “Free tier. Pro: $13/mo (annual)”,
why: “Design tool for non-designers. Brand kit, templates, carousel maker, video editor. Team sharing.”,
role: “All social content creation: LinkedIn carousels, Instagram posts, story templates, Yes Budget PDF template, community graphics.”,
alt: “Figma (free, steeper learning curve), Adobe Express ($10/mo)”,
priority: “critical”,
},
],
},
{
category: “Analytics & Tracking”,
phase: “Phase 1-2”,
icon: “📊”,
items: [
{
name: “MixPanel”,
url: “mixpanel.com”,
pricing: “Free up to 20M events. Growth: $28/mo”,
why: “Event-based product analytics. Funnel analysis, cohort retention, A/B testing. The standard for app analytics.”,
role: “App onboarding funnels, snapshot completion rates, D7/D30/D90 retention, community-vs-cold user cohort comparison.”,
alt: “Amplitude (similar, free tier), PostHog (open-source, self-hosted option), GA4 (free, less product-focused)”,
priority: “critical”,
},
{
name: “Hotjar”,
url: “hotjar.com”,
pricing: “Free (35 sessions/day). Plus: $32/mo”,
why: “Heatmaps, session recordings, user surveys. See exactly where users drop off in the app flow.”,
role: “Identify friction in app onboarding, quiz funnel, landing page. Qualitative data to complement MixPanel\u2019s quantitative.”,
alt: “Microsoft Clarity (free, good enough), FullStory (enterprise)”,
priority: “medium”,
},
],
},
{
category: “CRM & Pipeline”,
phase: “Phase 2-3”,
icon: “🤝”,
items: [
{
name: “HubSpot CRM”,
url: “hubspot.com”,
pricing: “Free CRM. Starter: $20/mo”,
why: “Free CRM is genuinely powerful. Contact management, deal pipeline, email tracking. Scales to marketing automation when needed.”,
role: “Advisory client pipeline. Track community \u2192 app \u2192 advisory journey per member. Manage House of Alpha client relationships.”,
alt: “Notion (manual but flexible), Pipedrive ($14/mo, sales-focused), Zoho CRM (free tier)”,
priority: “high”,
},
],
},
{
category: “Payments & Monetisation”,
phase: “Phase 2”,
icon: “💳”,
items: [
{
name: “Stripe”,
url: “stripe.com”,
pricing: “2.9% + \u20B92 per transaction (India rates vary)”,
why: “Industry standard. Subscription billing, one-time payments, invoicing. Integrates with everything.”,
role: “App plan upgrades (free \u2192 paid), advisory fee collection. Connects to Circle for community paid tiers if needed.”,
alt: “Razorpay (India-native, better UPI support, 2% fee), Cashfree”,
priority: “critical”,
},
{
name: “Razorpay”,
url: “razorpay.com”,
pricing: “2% per transaction. No setup fee”,
why: “India\u2019s leading payment gateway. UPI, net banking, cards, wallets. Better for Indian users than Stripe.”,
role: “Primary payment gateway for Indian users. UPI autopay for SIP-style subscriptions. Invoice generation for advisory.”,
alt: “Stripe (better international), Cashfree, PayU”,
priority: “critical”,
},
],
},
{
category: “Content & SEO”,
phase: “Phase 1-3”,
icon: “✍️”,
items: [
{
name: “Webflow / Ghost”,
url: “webflow.com / ghost.org”,
pricing: “Webflow: $14/mo. Ghost: $9/mo (self-hosted free)”,
why: “Webflow for the main site + landing pages (visual builder, CMS). Ghost for the blog (clean, SEO-optimised, newsletter built-in).”,
role: “yeslifers.com main site (Webflow). Blog for SEO play targeting long-tail Indian personal finance keywords.”,
alt: “WordPress (free, more work), Framer ($5/mo), your Vercel pipeline for static sites”,
priority: “high”,
},
{
name: “Ahrefs / Ubersuggest”,
url: “ahrefs.com / ubersuggest.com”,
pricing: “Ahrefs: $29/mo (Starter). Ubersuggest: $29/mo”,
why: “Keyword research, competitor analysis, backlink tracking. Essential for the SEO blog play in Phase 3.”,
role: “Find long-tail keywords (\u201Chow to spend without guilt India\u201D, \u201Cfinancial planning for 30s India\u201D). Track blog ranking progress.”,
alt: “Google Search Console (free, limited), Semrush ($130/mo, overkill initially)”,
priority: “medium”,
},
],
},
{
category: “Video & Podcasting”,
phase: “Phase 3”,
icon: “🎬”,
items: [
{
name: “Riverside.fm”,
url: “riverside.fm”,
pricing: “Free (2hrs). Standard: $15/mo”,
why: “Studio-quality remote recording. Separate audio/video tracks. AI transcription and clips. Perfect for the \u201CYes Life Conversations\u201D series.”,
role: “Record bi-weekly podcast/video interviews with members. AI auto-generates clips for social media.”,
alt: “Descript ($24/mo, editing-first), Zencastr (free tier), StreamYard ($20/mo, live-first)”,
priority: “low”,
},
],
},
{
category: “Automation & Ops”,
phase: “All Phases”,
icon: “⚙️”,
items: [
{
name: “Zapier / Make”,
url: “zapier.com / make.com”,
pricing: “Zapier: Free (100 tasks/mo). Starter: $20/mo. Make: Free (1K ops), Core: $9/mo”,
why: “Glue between all your tools. Automate: new Circle member \u2192 tag in Beehiiv \u2192 add to HubSpot. Quiz completion \u2192 email drip. App milestone \u2192 community notification.”,
role: “All cross-tool automations. Community \u2192 email \u2192 CRM \u2192 app data flows. Make is cheaper for complex workflows.”,
alt: “n8n (self-hosted, free, you already use this), Pipedream (developer-focused)”,
priority: “critical”,
},
{
name: “Notion”,
url: “notion.so”,
pricing: “Free (personal). Plus: $10/mo”,
why: “Internal wiki, content calendar, project tracking, meeting notes. Single source of truth for the team.”,
role: “Content calendar, community playbook, GTM tracker, pod management sheets, partnership tracking.”,
alt: “Coda (similar), Google Docs (simpler), Obsidian (personal only)”,
priority: “high”,
},
{
name: “Slack”,
url: “slack.com”,
pricing: “Free. Pro: $7.25/user/mo”,
why: “Internal team communication. Keep team chat separate from the community platform.”,
role: “House of Alpha internal team comms, dev coordination, community manager escalations.”,
alt: “Discord (free, less professional), Microsoft Teams”,
priority: “medium”,
},
],
},
{
category: “Product Hunt & Launch”,
phase: “Phase 2”,
icon: “🚀”,
items: [
{
name: “Product Hunt”,
url: “producthunt.com”,
pricing: “Free to launch”,
why: “Still the best platform for app launches in the tech-aware Indian audience. Coordinate Day 1 upvotes from community.”,
role: “App launch day. Pre-draft listing copy. Rally community for upvotes. Capture external traffic.”,
alt: “Hacker News (dev audience), BetaList ($129 to list)”,
priority: “medium”,
},
],
},
{
category: “Referral & Viral”,
phase: “Phase 1-2”,
icon: “🔗”,
items: [
{
name: “SparkLoop / Viral Loops”,
url: “sparkloop.app / viral-loops.com”,
pricing: “SparkLoop: from $99/mo. Viral Loops: $35/mo”,
why: “Automated referral programs. Reward tiers (3 invites = Founding Yes Lifer badge). Integrates with Beehiiv natively.”,
role: “Waitlist referral program, community referral tracking, \u201CFounding Yes Lifer\u201D badge automation.”,
alt: “Beehiiv has built-in referral (may suffice), ReferralCandy ($47/mo, e-commerce focused)”,
priority: “medium”,
},
],
},
];

const priorityColors = {
critical: { bg: “#FEE2E2”, text: “#991B1B”, label: “Must-Have” },
high: { bg: “#FEF3C7”, text: “#92400E”, label: “High Priority” },
medium: { bg: “#DBEAFE”, text: “#1E40AF”, label: “Nice to Have” },
low: { bg: “#F3F4F6”, text: “#4B5563”, label: “Later” },
};

export default function ToolStack() {
const [filter, setFilter] = useState(“all”);
const [expandedTool, setExpandedTool] = useState(null);

const filtered = filter === “all”
? tools
: tools.map(cat => ({
…cat,
items: cat.items.filter(i => i.priority === filter),
})).filter(cat => cat.items.length > 0);

const totalTools = tools.reduce((s, c) => s + c.items.length, 0);
const criticalCount = tools.reduce((s, c) => s + c.items.filter(i => i.priority === “critical”).length, 0);

return (
<div style={{ fontFamily: “‘DM Sans’, ‘Helvetica Neue’, sans-serif”, background: “#0F172A”, minHeight: “100vh”, color: “#E2E8F0”, padding: “32px 20px” }}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

```
<div style={{ maxWidth: 800, margin: "0 auto" }}>
<div style={{ marginBottom: 40 }}>
<h1 style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", margin: 0, letterSpacing: "-0.5px" }}>
Yes Lifers \u2014 GTM Tool Stack
</h1>
<p style={{ color: "#94A3B8", margin: "8px 0 20px", fontSize: 14 }}>
{totalTools} tools across {tools.length} categories \u00B7 {criticalCount} must-haves
</p>

<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{[
{ key: "all", label: "All Tools" },
{ key: "critical", label: "Must-Have" },
{ key: "high", label: "High Priority" },
{ key: "medium", label: "Nice to Have" },
{ key: "low", label: "Later" },
].map(f => (
<button
key={f.key}
onClick={() => setFilter(f.key)}
style={{
padding: "6px 14px", borderRadius: 6, border: "1px solid",
borderColor: filter === f.key ? "#3B82F6" : "#334155",
background: filter === f.key ? "#1E3A5F" : "transparent",
color: filter === f.key ? "#93C5FD" : "#94A3B8",
fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
}}
>
{f.label}
</button>
))}
</div>
</div>

{filtered.map((cat, ci) => (
<div key={ci} style={{ marginBottom: 28 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
<span style={{ fontSize: 20 }}>{cat.icon}</span>
<h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>{cat.category}</h2>
<span style={{ fontSize: 11, color: "#64748B", fontFamily: "'JetBrains Mono', monospace", background: "#1E293B", padding: "2px 8px", borderRadius: 4 }}>{cat.phase}</span>
</div>

{cat.items.map((tool, ti) => {
const id = `${ci}-${ti}`;
const isOpen = expandedTool === id;
const p = priorityColors[tool.priority];
return (
<div
key={ti}
onClick={() => setExpandedTool(isOpen ? null : id)}
style={{
background: "#1E293B", borderRadius: 10, padding: "14px 18px",
marginBottom: 8, cursor: "pointer", border: "1px solid",
borderColor: isOpen ? "#334155" : "#1E293B",
transition: "border-color 0.2s",
}}
>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<span style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{tool.name}</span>
<span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#64748B" }}>{tool.url}</span>
</div>
<span style={{
fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 4,
background: p.bg, color: p.text,
}}>{p.label}</span>
</div>
<div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6 }}>{tool.pricing}</div>

{isOpen && (
<div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #334155" }}>
<div style={{ marginBottom: 12 }}>
<div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Why this tool</div>
<div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{tool.why}</div>
</div>
<div style={{ marginBottom: 12 }}>
<div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Your role in the GTM</div>
<div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{tool.role}</div>
</div>
<div>
<div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Alternatives</div>
<div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{tool.alt}</div>
</div>
</div>
)}
</div>
);
})}
</div>
))}

<div style={{ background: "#1E293B", borderRadius: 10, padding: 20, marginTop: 32, borderLeft: "3px solid #3B82F6" }}>
<div style={{ fontSize: 14, fontWeight: 700, color: "#93C5FD", marginBottom: 8 }}>Monthly cost estimate (Must-Haves only)</div>
<div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.8 }}>
Circle Professional: $89 \u00B7 Beehiiv (free to start) \u00B7 Canva Pro: $13 \u00B7 MixPanel (free tier) \u00B7 Razorpay (transaction-based) \u00B7 Zapier/n8n: $0\u201320
</div>
<div style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", marginTop: 10 }}>
~$100\u2013125/mo to start \u00B7 Scales to ~$250\u2013400/mo at Phase 2
</div>
</div>

<div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 24 }}>
Tap any tool to expand \u00B7 Prices as of April 2026
</div>
</div>
</div>
```

);
}
