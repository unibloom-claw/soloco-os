/* ============================================================
   Soloco · FLAGSHIP scenario — 途虎养车 · 全球化战略
   董事长指挥一支 AI 尽调军团，研究如何打开美国市场，
   3 年预算 1000 万美金。
   Interface is English-forward (cross-border DD); the Conductor
   speaks Chinese to the chairman. Numbers are illustrative (示意).
   ============================================================ */
window.TUHU_DATA = (function () {
  const company = {
    id: "tuhu-co",
    name: "途虎养车 · Tuhu",
    emoji: "🐯",
    mission: "China's #1 auto-service network goes global",
  };

  const conductor = {
    id: "tuhu-cond",
    kind: "conductor",
    name: "指挥官",
    role: "Conductor",
    model: "anthropic · Opus 4.8",
    mbti: { code: "ENTJ-A", label: "指挥官" },
    soul: "董事长的 AI 参谋长。把跨国战略目标拆成可执行的尽调流水线、按职能招聘专家 Agent、编排串并行与条件分支，遇到要您拍板的战略岔路就回退来问您。",
    skills: ["plan.decompose", "agent.hire", "graph.wire", "human.in.loop", "budget.guard", "ask_question"],
    task: "管 1 个目标 · 8 名专家",
    x: 322, y: 96, w: 188,
  };

  const agents = [
    {
      id: "t-market",
      kind: "agent", name: "Market Intelligence", emoji: "🛰️", role: "Market & Competitors",
      model: "openai · GPT 5.5", hiredBy: "tuhu-cond",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "Sizes markets bottom-up and refuses to quote a number without a source. Profiles every incumbent before drawing a conclusion.",
      skills: ["web.fetch", "market.sizing", "comp.scan", "mcp · IBISWorld", "mcp · PitchBook"],
      domain: "US auto-service market sizing & competitors",
      deliverable: {
        htmlName: "US-Market-Landscape.html", mdName: "us-market-landscape.md",
        kicker: "Market Intelligence · auto-generated",
        title: "US Auto-Service Market — Landscape & Competitors",
        lede: "示意数据 · The US do-it-for-me (DIFM) auto-service market is large and fragmented — ideal for a capital-efficient entry. The top-4 chains hold under a quarter of the quick-service segment.",
        kpis: [{ v: "$82B", l: "US DIFM market" }, { v: "$9.5B", l: "Quick-service segment" }, { v: "<25%", l: "Top-4 share" }],
        table: {
          cols: ["Player", "Footprint", "Model", "Note"],
          rows: [
            ["Valvoline IOC", "~1,900", "Company + franchise", "Quick-lube leader"],
            ["Take 5", "~1,000", "Drive-thru lube", "Fastest grower"],
            ["Jiffy Lube", "~2,000", "Franchise", "Brand-heavy, aging"],
            ["Mavis", "~1,500", "Tire + service", "Acquisitive"],
            ["AutoZone", "~7,000", "Parts retail (DIY/DIFM)", "Adjacent"],
          ],
        },
        sections: [
          { h: "Why it's attractive", body: "Fragmentation + an aging vehicle fleet (avg 12.6 yrs) + labor-constrained incumbents = room for a tech-enabled operator." },
          { h: "Where Tuhu wins", body: "Digital booking, transparent flat-rate pricing, and supply-chain depth — Tuhu's China playbook maps directly onto US consumer pain points." },
        ],
      },
      oneOnOne: {
        intro: "Market Intelligence here. I sized the US market bottom-up and profiled the incumbents. Ask me about market size, a specific competitor, or my sources — but new tasking goes through the Conductor.",
        faqs: [
          { q: "How big is the target segment?", a: "The full US DIFM auto-service market is ~$82B; the quick-service maintenance segment we'd enter is ~$9.5B and growing low-double-digits. Every figure links back to its source." },
          { q: "Who's the toughest incumbent?", a: "Valvoline IOC (~1,900 stores) on scale and Take 5 on growth velocity. But none exceeds ~10% share of quick-service — the long tail is independents ripe for roll-up." },
        ],
      },
      inputs: "Conductor 派发：US market scope · target segment · competitor set",
      outputs: [{ name: "us-market-landscape.md", to: "Entry Strategy", kind: "data" }],
      memory: {
        session: "本轮：sized $82B DIFM market, top-4 < 25% share.",
        agent: "Always size bottom-up; cite a source per figure.",
        user: "董事长偏好可复核数据，结论先行。",
      },
      x: 8, y: 300, w: 184,
    },
    {
      id: "t-entry",
      kind: "agent", name: "Entry Strategy", emoji: "🧭", role: "Build / Buy / JV / Franchise",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "Scores entry modes coldly on speed, capital intensity, control and regulatory load. Will escalate to the chairman when the capital math forces a strategic fork.",
      skills: ["option.score", "capital.model", "reg.map", "scenario.tree"],
      domain: "Market-entry mode selection",
      deliverable: {
        htmlName: "Entry-Mode-Decision.html", mdName: "entry-mode-decision.md",
        kicker: "Entry Strategy · auto-generated",
        title: "US Entry — Build vs Buy vs JV vs Franchise",
        lede: "示意 · Scored on speed, capital intensity, control and regulatory load. A $10M / 3-year budget rules out organic national build-out and points to acquisition + JV.",
        kpis: [{ v: "Acquire + JV", l: "Recommended" }, { v: "50", l: "State licenses if greenfield" }, { v: "3.5×", l: "Speed vs greenfield" }],
        table: {
          cols: ["Mode", "Speed", "Capital", "Control", "Reg. load", "Fit"],
          rows: [
            ["Greenfield build", "Slow", "Very high", "High", "Very high", "✗ too thin on $10M"],
            ["Acquire regional chain", "Fast", "High", "High", "Medium", "✓ recommended"],
            ["JV with incumbent", "Medium", "Medium", "Shared", "Low", "✓ pairs w/ acquire"],
            ["Franchise-light", "Fast", "Low", "Low", "Low", "△ brand dilution"],
          ],
        },
        sections: [
          { h: "The $10M reality", body: "A single US store build runs $0.5–1.5M. Organic national presence would burn the whole budget on <10 stores — sub-scale. Capital has to buy an existing footprint." },
          { h: "Recommendation", body: "Acquire a 15–25 store regional chain for control + speed, and JV locally for the parts supply chain. Franchise-light later to scale asset-light." },
        ],
      },
      oneOnOne: {
        intro: "Entry Strategy. I scored the four entry modes against your $10M / 3-year constraint. Ask me why greenfield lost or how acquisition compares — strategic decisions still route to the Conductor.",
        faqs: [
          { q: "Why not just build our own stores?", a: "At $0.5–1.5M per US store, $10M buys fewer than 10 greenfield locations — sub-scale, and you'd still face 50-state licensing from zero. The capital is better spent buying an operating footprint." },
          { q: "Why acquire AND JV?", a: "Acquisition buys speed, licenses and a trained workforce; the JV de-risks the parts supply chain and localizes margin. Together they're faster and cheaper than either alone." },
        ],
      },
      inputs: "上游：us-market-landscape.md",
      outputs: [{ name: "entry-mode-decision.md", to: "尽调多线", kind: "data" }],
      memory: {
        session: "待运行。",
        agent: "$10M can't fund national greenfield; escalate the fork to the chairman.",
        user: "董事长要资本效率优先。",
      },
      x: 214, y: 300, w: 184,
    },
    {
      id: "t-mna",
      kind: "agent", name: "M&A & JV Structuring", emoji: "🤝", role: "Deal Structuring",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      conditional: true, hidden: true,
      mbti: { code: "ENTJ-A", label: "指挥官" },
      soul: "Only shows up once you commit to the inorganic path. Screens targets, structures the stake and the supply-chain JV, and guards the $10M envelope.",
      skills: ["target.screen", "deal.structure", "valuation", "jv.terms"],
      domain: "Acquisition target screen & deal structuring",
      deliverable: {
        htmlName: "MnA-JV-Structuring.html", mdName: "mna-jv-structuring.md",
        kicker: "M&A & JV Structuring · 条件分支",
        title: "Acquisition Target Screen & JV Structure",
        lede: "示意 · Triggered after you chose the inorganic path. Screened the regional-chain universe and structured a control stake plus a parts-supply JV within the $10M envelope.",
        kpis: [{ v: "15–25", l: "Target store count" }, { v: "$4.0M", l: "Stake / earn-in" }, { v: "2", l: "Shortlisted targets" }],
        table: {
          cols: ["Track", "Structure", "Rationale"],
          rows: [
            ["Acquire", "Majority of a regional micro-chain", "Speed + licenses + workforce"],
            ["JV", "Parts supply-chain joint venture", "Margin + localization"],
          ],
        },
        sections: [
          { h: "Target screen", body: "Filter: 10–30 stores, single metro/region, owner-operator near exit, clean licensing. Two candidates shortlisted (示意)." },
          { h: "Capital fit", body: "$4.0M secures a control stake with an earn-out; the JV is contributed-asset, minimizing cash out of the $10M." },
        ],
      },
      oneOnOne: {
        intro: "M&A & JV Structuring. The Conductor hired me the moment you committed to acquisition. Ask me about the shortlist or the deal structure.",
        faqs: [
          { q: "What are the targets?", a: "Two regional micro-chains (10–30 stores each, single-metro, owner near exit, clean licensing). Names are illustrative in this demo." },
          { q: "How does $4M get a chain?", a: "A control stake plus a structured earn-out — not a full buyout — keeps cash within the $10M envelope while securing operating control." },
        ],
      },
      inputs: "上游：entry-mode-decision.md（仅在选择收购/合资后触发）",
      outputs: [{ name: "mna-jv-structuring.md", to: "Finance", kind: "data" }],
      memory: { session: "待命：选择收购路线后触发。", agent: "Keep total deal cash inside the $10M envelope.", user: "—" },
      x: 214, y: 454, w: 184,
    },
    {
      id: "t-legal",
      kind: "agent", name: "Legal & Compliance", emoji: "⚖️", role: "Licensing · Labor · Data",
      model: "openai · GPT 5.5", hiredBy: "tuhu-cond",
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "Zero tolerance for regulatory ambiguity. Maps every state regime and flags the risks that can sink an entry before it starts.",
      skills: ["reg.map", "contract.parse", "clause.extract", "risk.flag"],
      domain: "50-state licensing, labor & data compliance",
      deliverable: {
        htmlName: "Compliance-Matrix.html", mdName: "compliance-matrix.md",
        kicker: "Legal & Compliance · auto-generated",
        title: "US Compliance Matrix & Risk Flags",
        lede: "示意 · 50-state shop licensing, labor certification and consumer-data law. Acquisition collapses 18–24 months of regulatory setup by inheriting licenses and a certified workforce.",
        kpis: [{ v: "50", l: "State regimes" }, { v: "5", l: "High-risk flags" }, { v: "CCPA+", l: "Data laws" }],
        table: {
          cols: ["Area", "Exposure", "Action"],
          rows: [
            ["State licensing", "Per-state shop & emissions certs", "Acquire entity with licenses intact"],
            ["Labor", "Mechanic certification, wage & hour", "Retain acquired workforce"],
            ["Consumer data", "CCPA / state privacy laws", "Localize data, US-region hosting"],
            ["Environmental", "Used-oil & waste handling permits", "Inherit permits via acquisition"],
          ],
        },
        sections: [
          { h: "Why acquisition de-risks", body: "Buying an operating chain inherits licenses, permits and a certified workforce — collapsing 18–24 months of greenfield regulatory setup to near zero." },
        ],
      },
      oneOnOne: {
        intro: "Legal & Compliance. I mapped the 50-state regulatory load and the data-law exposure. Ask me about a specific state or risk — I interpret, I don't issue legal opinions.",
        faqs: [
          { q: "What's the biggest legal risk?", a: "Greenfield 50-state licensing from zero — 18–24 months and high cost. Acquiring an operating entity inherits those licenses, which is the single strongest argument for the inorganic path." },
          { q: "How do we handle US consumer data?", a: "CCPA and a growing patchwork of state privacy laws require US-region data hosting and clear consent. We localize the data layer rather than route it back to China." },
        ],
      },
      inputs: "上游：entry-mode-decision.md",
      outputs: [{ name: "compliance-matrix.md", to: "Finance", kind: "data" }],
      memory: { session: "待运行。", agent: "Acquisition inherits licenses — always model that benefit.", user: "—" },
      x: 430, y: 212, w: 184,
    },
    {
      id: "t-ops",
      kind: "agent", name: "Localized Ops", emoji: "🔧", role: "Stores · Supply · Talent",
      model: "anthropic · Sonnet 4.5", hiredBy: "tuhu-cond",
      mbti: { code: "ISFP-A", label: "探险家" },
      soul: "Turns strategy into a store-level operating plan: conversion playbook, supply chain, and a retained-talent model.",
      skills: ["ops.model", "supply.map", "workforce.plan", "unit.econ"],
      domain: "Store ops, supply chain & talent localization",
      deliverable: {
        htmlName: "Localized-Ops-Plan.html", mdName: "localized-ops-plan.md",
        kicker: "Localized Ops · auto-generated",
        title: "Localized Operations Plan",
        lede: "示意 · Convert acquired bays to Tuhu's digital-first workflow, stand up a regional supply chain via JV, and retain the certified workforce.",
        kpis: [{ v: "15–25", l: "Stores (acquired)" }, { v: "2", l: "Regional DCs" }, { v: "60d", l: "Conversion / store" }],
        sections: [
          { h: "Store model", body: "Convert acquired service bays to Tuhu's digital-first workflow: app booking, dynamic scheduling, and a transparent up-front quote." },
          { h: "Supply chain", body: "JV with a regional parts distributor, then layer Tuhu's sourcing engine for margin and availability." },
          { h: "Talent", body: "Retain certified mechanics from the acquisition; add a US ops lead plus a small localization team." },
        ],
      },
      oneOnOne: {
        intro: "Localized Ops. I built the store-conversion, supply-chain and talent plan. Ask me about unit economics or the conversion timeline.",
        faqs: [
          { q: "How long to convert a store?", a: "~60 days per location to retrofit the digital workflow and rebrand, run in waves so revenue keeps flowing during conversion." },
          { q: "Do we keep the existing mechanics?", a: "Yes — retaining the certified workforce is core to the thesis. It preserves licenses, local knowledge and continuity of service." },
        ],
      },
      inputs: "上游：entry-mode-decision.md",
      outputs: [{ name: "localized-ops-plan.md", to: "Finance", kind: "data" }],
      memory: { session: "待运行。", agent: "Convert in waves to protect revenue; retain talent.", user: "—" },
      x: 624, y: 212, w: 184,
    },
    {
      id: "t-risk",
      kind: "agent", name: "Risk & Scenarios", emoji: "🌪️", role: "Tariffs · Macro · Response",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "INTP-A", label: "逻辑学家" },
      soul: "Thinks in scenario trees. Pressure-tests the plan against tariffs, macro shocks and competitive retaliation — and attaches a mitigation to every risk.",
      skills: ["scenario.tree", "sensitivity", "tariff.model", "war-game"],
      domain: "Tariffs, macro & competitive response",
      deliverable: {
        htmlName: "Risk-Scenarios.html", mdName: "risk-scenarios.md",
        kicker: "Risk & Scenarios · auto-generated",
        title: "Scenario & Risk Matrix",
        lede: "示意 · Three scenarios pressure-tested, each with a mitigation. The maintenance segment is defensive — demand holds even in a downturn.",
        kpis: [{ v: "3", l: "Scenarios" }, { v: "High", l: "Tariff exposure" }, { v: "Medium", l: "Incumbent response" }],
        table: {
          cols: ["Scenario", "Trigger", "Mitigation"],
          rows: [
            ["Tariff shock", "Parts import duties rise", "Localize sourcing via the JV"],
            ["Incumbent price war", "Valvoline / Take 5 react", "Differentiate on digital + transparency"],
            ["Integration drag", "Post-acquisition culture clash", "Retain management, phased rebrand"],
          ],
        },
        sections: [
          { h: "Macro", body: "An aging fleet plus high new-car prices sustain maintenance demand even in a downturn — a defensive segment that de-risks the entry." },
        ],
      },
      oneOnOne: {
        intro: "Risk & Scenarios. I war-gamed the plan against tariffs, macro and competitor retaliation. Ask me about any scenario or the sensitivities.",
        faqs: [
          { q: "What's our worst case?", a: "A simultaneous tariff shock and an incumbent price war. The JV localizes sourcing to blunt tariffs, and our digital/transparency wedge defends share without matching on price alone." },
          { q: "Is this recession-proof?", a: "Closer to recession-resistant: when people delay new-car purchases, they maintain older vehicles longer — which lifts our segment." },
        ],
      },
      inputs: "上游：entry-mode-decision.md",
      outputs: [{ name: "risk-scenarios.md", to: "Finance", kind: "data" }],
      memory: { session: "待运行。", agent: "Attach a mitigation to every risk; segment is defensive.", user: "—" },
      x: 430, y: 362, w: 184,
    },
    {
      id: "t-brand",
      kind: "agent", name: "Brand & GTM", emoji: "🎯", role: "Acquisition · Pricing · Channels",
      model: "anthropic · Sonnet 4.5", hiredBy: "tuhu-cond",
      mbti: { code: "ENFP-A", label: "竞选者" },
      soul: "Finds the consumer wedge and builds the go-to-market around it. Obsessed with transparent pricing as the attack vector against opaque incumbents.",
      skills: ["positioning", "pricing.model", "cac.model", "channel.plan"],
      domain: "Brand positioning, pricing & customer acquisition",
      deliverable: {
        htmlName: "Brand-GTM.html", mdName: "brand-gtm.md",
        kicker: "Brand & GTM · auto-generated",
        title: "Brand Positioning & Go-To-Market",
        lede: "示意 · \"Honest, fast, app-first car care\" — attacking opaque pricing, the #1 US consumer complaint about auto service. Launch in three metros.",
        kpis: [{ v: "−10–15%", l: "Price vs incumbents" }, { v: "<$30", l: "Target CAC" }, { v: "3", l: "Launch metros" }],
        sections: [
          { h: "Positioning", body: "\"Honest, fast, app-first car care\" — directly attack opaque, surprise pricing, the top US consumer complaint in auto service." },
          { h: "Acquisition", body: "App + local SEO + fleet/B2B partnerships; target sub-$30 CAC via digital-first channels rather than expensive broadcast." },
          { h: "Pricing", body: "Transparent flat-rate, ~10–15% under incumbents on core services; recover the margin through the supply-chain JV." },
        ],
      },
      oneOnOne: {
        intro: "Brand & GTM. I built the positioning, pricing and customer-acquisition plan. Ask me about the wedge or the CAC math.",
        faqs: [
          { q: "What's our wedge?", a: "Transparent, app-first pricing. Opaque quotes are the #1 US complaint about auto service — we win trust by removing the surprise, the same wedge that built Tuhu in China." },
          { q: "Can CAC really be <$30?", a: "In launch metros, via local SEO, app, and fleet/B2B deals — yes, illustratively. Broadcast would blow that; we stay digital-first and geo-dense." },
        ],
      },
      inputs: "上游：entry-mode-decision.md",
      outputs: [{ name: "brand-gtm.md", to: "Finance", kind: "data" }],
      memory: { session: "待运行。", agent: "Transparent pricing is the wedge; stay digital-first.", user: "—" },
      x: 624, y: 362, w: 184,
    },
    {
      id: "t-finance",
      kind: "agent", name: "Finance", emoji: "💵", role: "$10M Capital Plan & Returns",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "Allocates the $10M across three years and five functions, builds the return model, and refuses to let the plan exceed the envelope.",
      skills: ["capital.allocate", "dcf", "unit.econ", "sensitivity"],
      domain: "$10M / 3-year capital plan & return model",
      deliverable: {
        htmlName: "Capital-Plan-Returns.html", mdName: "capital-plan-returns.md",
        kicker: "Finance · auto-generated",
        title: "$10M Capital Plan & Return Model",
        lede: "示意 · The full $10M deployed across three years and five functions. Operating breakeven in H2 of Year 2; ~$21M projected Year-3 revenue.",
        kpis: [{ v: "$10.0M", l: "3-yr capital" }, { v: "~$21M", l: "Yr-3 revenue (proj.)" }, { v: "H2 Yr2", l: "Op. breakeven" }],
        table: {
          cols: ["Use of funds", "Amount", "Share"],
          rows: [
            ["M&A / JV stake", "$4.0M", "40%"],
            ["Store conversion & supply chain", "$2.6M", "26%"],
            ["Brand & customer acquisition", "$1.7M", "17%"],
            ["Compliance & licensing", "$0.9M", "9%"],
            ["Talent & localization", "$0.8M", "8%"],
          ],
        },
        sections: [
          { h: "By year", body: "Year 1 — $3.2M (acquire + diligence + compliance) · Year 2 — $3.8M (convert + supply chain + brand) · Year 3 — $3.0M (scale + GTM)." },
          { h: "Returns (illustrative)", body: "15–25 stores → ~$21M Year-3 revenue at ~22% blended gross margin; operating breakeven in H2 Year 2; positions a Series-scale raise or a strategic exit." },
        ],
      },
      oneOnOne: {
        intro: "Finance. I allocated the $10M and built the return model. Ask me about any line of the plan or the breakeven assumptions.",
        faqs: [
          { q: "Where does the $10M go?", a: "40% to the M&A / JV stake, 26% to store conversion & supply chain, 17% to brand & acquisition, 9% to compliance, 8% to talent. The full envelope is deployed across three years." },
          { q: "When do we break even?", a: "Operating breakeven in H2 of Year 2, illustratively, as converted stores ramp and the supply-chain JV lifts gross margin toward ~22%." },
        ],
      },
      inputs: "上游：compliance / ops / risk / brand（+ M&A 结构）",
      outputs: [{ name: "capital-plan-returns.md", to: "Strategy Synthesis", kind: "data" }],
      memory: { session: "待运行。", agent: "Never exceed the $10M envelope; deploy across 3 years.", user: "董事长预算硬约束 $10M。" },
      x: 830, y: 212, w: 184,
    },
    {
      id: "t-synth",
      kind: "agent", name: "Strategy Synthesis", emoji: "📋", role: "Board-Ready Memo",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "ENFJ-A", label: "主人公" },
      soul: "Pulls eight streams into one board-ready memo. Recommendation first, decision asks explicit, every claim traceable to a specialist's deliverable.",
      skills: ["synthesize", "memo.compose", "html.render", "exec.summary"],
      domain: "Board-ready strategy synthesis",
      deliverable: {
        htmlName: "Board-Strategy-Memo.html", mdName: "board-strategy-memo.md",
        kicker: "Strategy Synthesis · board-ready",
        title: "US Market Entry — Board Strategy Memo",
        lede: "示意 · Recommendation: enter the US via acquisition of a regional chain plus a local supply-chain JV, deploying $10M over three years. Capital-efficient, fast, and regulation-light versus greenfield.",
        kpis: [{ v: "Acquire + JV", l: "Entry mode" }, { v: "$10M / 3yr", l: "Capital" }, { v: "~$21M", l: "Yr-3 revenue" }, { v: "H2 Yr2", l: "Breakeven" }],
        table: {
          cols: ["Phase", "Timeline", "Milestone"],
          rows: [
            ["Phase 1 · Acquire", "Year 1", "Close regional chain; inherit licenses & team"],
            ["Phase 2 · Convert", "Year 1–2", "Digital workflow, JV supply chain, rebrand"],
            ["Phase 3 · Scale", "Year 2–3", "Three launch metros, franchise-light expansion"],
          ],
        },
        sections: [
          { h: "Why this wins", body: "Acquisition buys footprint, licenses and talent at once; the $10M lands as control rather than sunk build cost; and transparent, app-first pricing is the wedge against opaque incumbents." },
          { h: "Decision for the board", body: "Approve the $10M, authorize target outreach on the two shortlisted chains, and stand up a US entity plus an operations lead." },
          { h: "How this memo was produced", body: "Eight AI specialists, ~2 days, ~$3.40 of compute — versus a traditional strategy engagement at $1.5–1.8M over 12–14 weeks." },
        ],
      },
      oneOnOne: {
        intro: "Strategy Synthesis. I wrote the board memo from all eight streams. Ask me to defend the recommendation or walk a section.",
        faqs: [
          { q: "One-line recommendation?", a: "Enter the US by acquiring a 15–25 store regional chain plus a parts supply-chain JV, deploying $10M over three years — the capital-efficient, fast, regulation-light path." },
          { q: "What's the ask to the board?", a: "Approve $10M, authorize outreach on the two shortlisted targets, and stand up a US entity with an operations lead. Everything else is sequenced from there." },
        ],
      },
      inputs: "上游：capital-plan-returns.md + 全部尽调",
      outputs: [
        { name: "Board-Strategy-Memo.html", to: "董事长", kind: "view" },
        { name: "board-strategy-memo.md", to: "存档", kind: "data" },
      ],
      memory: { session: "待运行。", agent: "Recommendation first; make every claim traceable.", user: "董事长偏好结论先行。" },
      x: 830, y: 362, w: 184,
    },
  ];

  /* ---- $10M / 3-year capital plan (for the Budget view) ---- */
  const capitalPlan = {
    label: "Recommended 3-year US-entry capital",
    total: 10, unit: "M",
    years: [
      { k: "Year 1", v: 3.2, note: "Acquire + diligence + compliance" },
      { k: "Year 2", v: 3.8, note: "Convert + supply chain + brand" },
      { k: "Year 3", v: 3.0, note: "Scale + GTM" },
    ],
    funcs: [
      { k: "M&A / JV stake", v: 4.0 },
      { k: "Store conversion & supply chain", v: 2.6 },
      { k: "Brand & customer acquisition", v: 1.7 },
      { k: "Compliance & licensing", v: 0.9 },
      { k: "Talent & localization", v: 0.8 },
    ],
    compare: { warroomCost: "$3.40", warroomTime: "~2 days", consultCost: "$1.5–1.8M", consultTime: "12–14 weeks" },
  };

  /* ---- conversational flow copy (read by the App interpreter) ---- */
  const greeting = "董事长，我是您的指挥官。把跨国战略目标交给我——我会现场组建一支 AI 尽调军团：市场情报、进入模式、法务合规、本地化运营、风险情景、品牌 GTM、财务建模，画成一张作战图，逐节点跑完。遇到要您拍板的战略岔路，我再回退来问您。";

  const flow = {
    suggestionsInit: [
      { label: "组建「美国市场进入」尽调组织 ▶", text: "你是途虎养车的董事长，研究如全球化战略以及如何打开美国市场，3年预算投入是1000万美金", icon: "🐯", primary: true, action: "create" },
    ],
    thinking: [
      "拆解目标：途虎 × 美国市场进入 × $10M / 3 年",
      "检索花名册 … 无可复用 Agent，按职能新招",
      "设计作战流程：市场情报 → 进入模式 → 多线尽调（法务 / 运营 / 风险 / 品牌）→ 财务建模 → 战略综合",
      "招聘 8 名专家 Agent，每个绑定一次模型调用（Opus 4.8 / GPT 5.5 等）",
    ],
    builtMsg: "作战图画好了 👈 我把目标拆成一条尽调流水线：<b>市场情报 → 进入模式 → 多线尽调 → 财务建模 → 战略综合</b>。8 名专家各管一个职能，数据流我自动推断好画在左边了。",
    afterTeamMsg: "每个节点点开能看到它的 Soul、技能和<b>对外交付物</b>。注意一点：<b>进入模式</b>这一步很可能要您来拍板——$10M 三年预算下，自建门店和收购/合资是两条完全不同的路。要现在就启动尽调吗？",
    suggestionsReady: [
      { label: "启动尽调组织 ▶", text: "启动尽调，开始干活", icon: "▶", primary: true, action: "run" },
    ],
    runIntro: "开跑。我会盯着每个节点，遇到要您拍板的战略岔路就回退来找您。",
    askQuestion: {
      from: "Entry Strategy",
      text: "市场情报已经摸清：美国售后服务市场大而分散，是个好机会。但<b>进入模式</b>卡在一个战略岔路上——按 $10M / 3 年的预算，<b>自建门店</b>要从零拿 50 个州的牌照、单店 $0.5–1.5M，整个预算撑不起全国规模；更稳的是<b>收购一家区域连锁 + 本地供应链合资</b>。<b>这条路得您拍板。</b>",
      ctx: "目标：美国市场进入 · 进入模式待决 · 已等待董事长决策",
      quick: [
        { label: "走收购 + 合资（推荐）", value: "acquire" },
        { label: "坚持自建门店", value: "greenfield" },
        { label: "只做加盟 · 轻资产", value: "franchise" },
      ],
    },
    acks: {
      acquire: "明白，走<b>收购区域连锁 + 供应链合资</b>。这条最稳。我临时增聘了一名 <b>M&A & JV 架构师</b>，把作战图重连——收购与合资这条线接进财务建模。继续往下跑。",
      greenfield: "收到，坚持<b>自建门店</b>。我提醒一句：$10M 撑不起全国规模，我会按「单一都会区试点」收口预算继续跑——但财务回报会比收购路线弱。继续。",
      franchise: "好，走<b>加盟轻资产</b>。资本最省、最快，但品牌与服务一致性风险高。我按这个口径继续跑尽调。",
    },
    finalMsg: "全部跑完 ✅ 八条尽调线汇聚成一份<b>董事会战略备忘录</b>。结论先行：<b>收购区域连锁 + 供应链合资</b>，$10M 三年部署，比自建更快、更省、监管更轻。给您看可交互的备忘录，结构化版本也已存档。",
    deliverableItems: [
      { name: "Board-Strategy-Memo.html", kind: "view", nodeId: "t-synth" },
      { name: "board-strategy-memo.md", kind: "data" },
    ],
    closingMsg: "顺手提示：左边「<b>预算</b>」页能看到这套打法的 $10M 三年分配，以及一个对比——这支 AI 军团跑完整套跨国尽调只花了约 <b>$3.40</b> 算力、约 2 天；传统战略咨询通常是 <b>$1.5–1.8M、12–14 周</b>。",
    closingSuggestions: [
      { label: "打开预算页 · 看 $10M 分配与成本对比", text: "打开预算页", icon: "📊", action: "openBudget" },
      { label: "和 Finance 单聊，问问回报模型", text: "与 Finance 单聊", icon: "💬", action: "chatFinance" },
    ],
  };

  return { company, conductor, agents, capitalPlan, greeting, flow };
})();
