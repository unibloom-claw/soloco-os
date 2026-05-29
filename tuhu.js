/* ============================================================
   Soloco · FLAGSHIP scenario — 途虎养车 · 全球化战略
   董事长指挥一支 AI 尽调军团，研究如何打开美国市场，
   3 年预算 1000 万美金。
   Distilled from a real 5-workstream US-entry due-diligence pack.
   Sourced facts are real (公开来源); dollar allocations & unit
   economics are modeled planning ranges (示意). Interface is
   English-forward; the Conductor speaks Chinese to the chairman.
   ============================================================ */
window.TUHU_DATA = (function () {
  const company = {
    id: "tuhu-co",
    name: "途虎养车 · Tuhu",
    emoji: "🐯",
    mission: "Take the supply-chain + digital playbook to the US",
  };

  const conductor = {
    id: "tuhu-cond",
    kind: "conductor",
    name: "指挥官",
    role: "Conductor",
    model: "anthropic · Opus 4.8",
    mbti: { code: "ENTJ-A", label: "指挥官" },
    soul: "董事长的 AI 参谋长。把跨国战略拆成可执行的尽调工作流、按职能招聘专家、编排串并行与条件分支。不顺着草案盖章——每一步都拿公开来源压力测试，遇到要您拍板的战略岔路就回退来问您。",
    skills: ["plan.decompose", "agent.hire", "graph.wire", "human.in.loop", "evidence.grade", "budget.guard"],
    task: "管 1 个目标 · 8 名专家",
    x: 322, y: 96, w: 188,
  };

  const agents = [
    {
      id: "t-market",
      kind: "agent", name: "Market & Geography", emoji: "🛰️", role: "Market · City Pick",
      model: "openai · GPT 5.5", hiredBy: "tuhu-cond",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "Sizes the market bottom-up from official sources and refuses to confuse national TAM with a winnable local pilot. Picks the city that buys the most learning per dollar.",
      skills: ["market.sizing", "geo.rank", "web.fetch", "mcp · Census/FRED", "mcp · AutoCare"],
      domain: "US aftermarket sizing & first-city选择",
      deliverable: {
        htmlName: "US-Market-Geo.html", mdName: "us-market-geo.md",
        kicker: "Market & Geography · 公开来源",
        title: "US Market & First-City — DFW over LA",
        lede: "公开来源 · The US aftermarket is huge and the aging fleet is a tailwind — but a $10M pilot should prove the model in lower-cost Dallas-Fort Worth, not Los Angeles. National TAM is not a winnable local SAM.",
        kpis: [{ v: "$414–435B", l: "US aftermarket (2024–25)" }, { v: "258–262M", l: "Replacement tires / yr" }, { v: "12.8 yr", l: "Avg fleet age (2025)" }],
        table: {
          cols: ["Metro", "Pop.", "Cost / complexity", "Verdict"],
          rows: [
            ["Dallas-Fort Worth", "8.3M", "Lower rent/labor, central logistics", "✓ first city"],
            ["Phoenix", "~5M", "Lowest burn, simple regs", "△ low-burn fallback"],
            ["Houston", "~7.3M", "Sprawl, flood/congestion", "later metro"],
            ["Los Angeles", "12.9M", "Highest cost + CA compliance", "✗ defer / narrow test"],
          ],
        },
        sections: [
          { h: "Why DFW, not LA", body: "LA maximizes TAM but also rent, labor, congestion, California compliance and marketing noise. A $10M/3-yr light-asset pilot buys far more experimental cycles in DFW or Phoenix." },
          { h: "DIFM is 78% — sell the outcome", body: "DIY is ~22%, DIFM ~78% of light-vehicle aftermarket volume. The right first product is a trusted installed tire outcome, not cheap parts shipped to consumers." },
        ],
      },
      oneOnOne: {
        intro: "Market & Geography. I sized the market from Auto Care / S&P / Census data and ranked the metros. Ask me why DFW beats LA, or about the demand tailwind — new tasking goes through the Conductor.",
        faqs: [
          { q: "Why DFW and not LA?", a: "LA is the biggest market but the most expensive and complex to learn in — rent, labor, congestion, California compliance. A $10M pilot buys more experiments in DFW (8.3M metro, central logistics, lower cost). LA is a later stress test." },
          { q: "Is the market actually big enough?", a: "Yes: ~$414–435B US aftermarket, 258–262M replacement tires a year, and a 12.8-year average fleet age that keeps maintenance demand growing. The risk was never TAM — it's whether we can win a local SAM profitably." },
        ],
      },
      inputs: "Conductor 派发：US market scope · target segment · metro set",
      outputs: [{ name: "us-market-geo.md", to: "Entry Model", kind: "data" }],
      memory: {
        session: "本轮：ranked DFW #1 over LA/Phoenix/Houston.",
        agent: "National TAM ≠ winnable local SAM; measure installed orders per shop.",
        user: "董事长草案默认洛杉矶——需用证据复核。",
      },
      x: 8, y: 300, w: 184,
    },
    {
      id: "t-entry",
      kind: "agent", name: "Entry Model", emoji: "🧭", role: "DTC · B2B · Hybrid",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "Scores entry models against the budget and the evidence, not the founder's hope. Escalates to the chairman when the data contradicts the original plan.",
      skills: ["option.score", "wedge.test", "capital.fit", "scenario.tree"],
      domain: "进入模式与切入楔子",
      deliverable: {
        htmlName: "Entry-Model-Decision.html", mdName: "entry-model-decision.md",
        kicker: "Entry Model · 公开来源 + 示意",
        title: "Entry Model — LA-DTC vs DFW Staged Hybrid vs B2B-first",
        lede: "示意 · Three scopes scored against the $10M envelope. The original broad LA-first DTC plan is a poor fit; a DFW staged hybrid (B2B-enabled DTC) is the only coherent CONDITIONAL-GO path.",
        kpis: [{ v: "Staged hybrid", l: "Recommended" }, { v: "DFW", l: "First city" }, { v: "Tires-first", l: "Wedge" }],
        table: {
          cols: ["Scenario", "Budget fit @ $10M", "Main risk", "Verdict"],
          rows: [
            ["LA-first broad DTC (original)", "Poor", "CA cost + CAC + tariff", "✗ NO-GO"],
            ["DFW staged hybrid (B2B-enabled DTC)", "Best, if stage-gated", "Landed cost, CAC, density", "✓ CONDITIONAL GO"],
            ["B2B supply-first", "Strongest cash control", "Low margin, no data loop", "△ fallback"],
          ],
        },
        sections: [
          { h: "The $10M reality", body: "Broad LA-first DTC with 100 shops, 10k customers and multi-state Year-2 expansion does not fit $10M once compliance, insurance, landed-cost and CAC are reserved honestly." },
          { h: "Recommendation", body: "Start B2B-enabled DTC in 2–3 DFW submarkets: installers are the consumer trust layer; acquire consumers around installed tire orders only after service quality and claims handling are real." },
        ],
      },
      oneOnOne: {
        intro: "Entry Model. I scored the three scopes against your $10M budget. Ask me why the original LA-DTC plan fails the budget test — the strategic call itself routes back to the Conductor.",
        faqs: [
          { q: "What's wrong with the original plan?", a: "LA-first broad DTC over-scopes $10M: California cost + high CAC versus Tire Rack/SimpleTire + the tariff threat to the price wedge. It's a NO-GO at this budget unless heavily narrowed." },
          { q: "Why a 'staged hybrid'?", a: "Pure DTC is too CAC/trust-intensive for an unknown brand; pure B2B loses the consumer data loop. B2B-enabled DTC uses installers as the trust layer while keeping the consumer transaction — the best $10M fit." },
        ],
      },
      inputs: "上游：us-market-geo.md",
      outputs: [{ name: "entry-model-decision.md", to: "尽调多线", kind: "data" }],
      memory: {
        session: "待运行。",
        agent: "$10M can't fund broad LA-DTC; escalate the scope fork to the chairman.",
        user: "董事长草案：洛杉矶直营 + TUHU Direct + 便宜三成。",
      },
      x: 214, y: 300, w: 184,
    },
    {
      id: "t-mna",
      kind: "agent", name: "Trade & Landed-Cost", emoji: "🛃", role: "Tariff Gate",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      conditional: true, hidden: true,
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "Appears only once you commit to the supply-led wedge — because the whole thesis lives or dies on whether China tire tariffs erase the price advantage. Treats landed cost as a go/no-go gate, not a footnote.",
      skills: ["hts.classify", "adcvd.scan", "landed.cost", "mcp · USITC/CBP"],
      domain: "到岸成本与贸易救济（放行闸门）",
      deliverable: {
        htmlName: "Trade-Landed-Cost.html", mdName: "trade-landed-cost.md",
        kicker: "Trade & Landed-Cost · 公开来源 · 条件分支",
        title: "China-Tire Landed Cost — the Gate on the Whole Thesis",
        lede: "公开来源 · The original '30% cheaper' wedge is at RED risk. China passenger/light-truck tires face antidumping up to 87.99% and countervailing duties (all-others 31.56%), plus active Section 301 — capable of erasing the price advantage entirely.",
        kpis: [{ v: "87.99%", l: "AD ceiling (PVLT)" }, { v: "31.56%", l: "CVD all-others" }, { v: "RED", l: "Wedge survival" }],
        table: {
          cols: ["Flow", "Exposure", "Action before capital"],
          rows: [
            ["PVLT tires (China)", "AD/CVD + Section 301 — very high", "Broker landed-cost memo per SKU/exporter"],
            ["Brake pads", "301 + product-liability — med-high", "Avoid safety-critical private label early"],
            ["Oil / air filters", "301 — medium", "Better early category if fitment controlled"],
          ],
        },
        sections: [
          { h: "Why this gates everything", body: "Do not model China-origin tires with a blended low tariff. Exporter-specific AD/CVD cash deposits can overwhelm the planned wedge — this is a launch kill-criterion, not a setup task." },
          { h: "Pivot if it fails", body: "Validate the first 50–100 SKUs with a customs broker; if tires don't survive, start with non-China or non-tire categories where landed-cost economics hold." },
        ],
      },
      oneOnOne: {
        intro: "Trade & Landed-Cost. The Conductor hired me the moment you committed to the supply-led wedge — because this is the gate the whole thesis depends on. Ask me about the tariff exposure.",
        faqs: [
          { q: "Can the price wedge survive?", a: "At RED risk. China PVLT tires face AD up to 87.99% and CVD ~31.56% plus Section 301. Until a customs broker validates exporter-specific landed cost on the first 50–100 SKUs, assume the '30% cheaper' claim does not hold." },
          { q: "What if tires don't clear?", a: "Pivot the first wedge to non-China or non-tire categories (e.g. filters) where landed cost survives, or restructure sourcing. We do not commit marketing capital until the gate passes." },
        ],
      },
      inputs: "上游：entry-model-decision.md（仅在选择供应链楔子后触发）",
      outputs: [{ name: "trade-landed-cost.md", to: "Budget & Unit Econ", kind: "data" }],
      memory: { session: "待命：选择 DFW 混合路线后触发。", agent: "Landed cost is a go/no-go gate; never blend tariffs.", user: "—" },
      x: 214, y: 454, w: 184,
    },
    {
      id: "t-legal",
      kind: "agent", name: "Compliance & Supply", emoji: "⚖️", role: "FMVSS · Recall · CA",
      model: "openai · GPT 5.5", hiredBy: "tuhu-cond",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "Treats compliance as an operating constraint, not a setup task. Tires are safety-critical equipment — recall readiness must exist before the first sale.",
      skills: ["reg.map", "fmvss.check", "recall.playbook", "insurance.scan"],
      domain: "合规 · 召回 · 保险 · 加州",
      deliverable: {
        htmlName: "Compliance-Supply.html", mdName: "compliance-supply.md",
        kicker: "Compliance & Supply · 公开来源",
        title: "Compliance Matrix — Manageable, but Budget It Honestly",
        lede: "公开来源 · Compliance is manageable with a narrow SKU set and qualified counsel — but it's a real budget stressor. As a distributor of safety-critical tires, Tuhu inherits manufacturer-like recall duties from day one.",
        kpis: [{ v: "FMVSS 139", l: "Tire standard" }, { v: "5 days", l: "Defect report to NHTSA" }, { v: "CCPA+", l: "CA privacy" }],
        table: {
          cols: ["Area", "Obligation", "Action"],
          rows: [
            ["Tire safety", "FMVSS 139 conformance + certification", "Supplier test files + indemnity"],
            ["Traceability", "TIN / plant code (49 CFR 574)", "Capture TIN→buyer→installer at order"],
            ["Recall", "Report ≤5 days; notify ≤60 days", "Recall playbook live before first sale"],
            ["California", "BAR estimates, Prop 65, workers' comp", "Contract shops to stay BAR-compliant"],
          ],
        },
        sections: [
          { h: "The real blocker isn't compliance", body: "Generic legal setup is doable. The dangerous assumption is that China-sourced tire economics carry a consumer price wedge after trade remedies — that lives with Trade & Landed-Cost." },
          { h: "Recall readiness before first sale", body: "Capture TIN, lot, supplier plant, installer, fitment and a customer notification channel from order one — retrofitting this after a defect is not an option." },
        ],
      },
      oneOnOne: {
        intro: "Compliance & Supply. I mapped FMVSS, TIN/recall, California BAR/Prop 65 and the insurance stack. Ask me about any regime — I interpret, I don't issue legal opinions.",
        faqs: [
          { q: "Is compliance a blocker?", a: "Not by itself — it's a budget stressor. With a narrow SKU set, counsel, a broker-led import program, product-liability + recall insurance and TIN traceability, it's manageable. The blocker is tariffs, not paperwork." },
          { q: "What must exist before the first sale?", a: "A live recall playbook: TIN/lot/supplier-plant capture, buyer and installer identity, fitment, and a customer notification channel — plus product-liability and recall-expense insurance quoted and bound." },
        ],
      },
      inputs: "上游：entry-model-decision.md",
      outputs: [{ name: "compliance-supply.md", to: "Budget & Unit Econ", kind: "data" }],
      memory: { session: "待运行。", agent: "Recall readiness before first sale; tariffs are the real risk.", user: "—" },
      x: 430, y: 212, w: 184,
    },
    {
      id: "t-ops",
      kind: "agent", name: "Competition & Installers", emoji: "🏪", role: "Channel · Shops",
      model: "anthropic · Sonnet 4.5", hiredBy: "tuhu-cond",
      mbti: { code: "ENTP-A", label: "辩论家" },
      soul: "Benchmarks the incumbents honestly and counts active shops, not signed ones. Knows the connector UX is already solved — the wedge has to be elsewhere.",
      skills: ["comp.benchmark", "installer.econ", "density.model", "channel.map"],
      domain: "竞品格局与门店经济",
      deliverable: {
        htmlName: "Competition-Installer.html", mdName: "competition-installer.md",
        kicker: "Competition & Installers · 公开来源",
        title: "Connector UX Is Not Differentiated — Earn the Wedge Elsewhere",
        lede: "公开来源 · 'Online tire + ship-to-installer' is already solved by Tire Rack (10,000+ installers) and SimpleTire (~25,000 partners). Tuhu's only real wedge is supply economics, installer order-density and clean claims — and the metric is active shops, not signed shops.",
        kpis: [{ v: "10,000+", l: "Tire Rack installers" }, { v: "~25,000", l: "SimpleTire partners" }, { v: "8–12", l: "Sets/active shop/mo" }],
        table: {
          cols: ["Player", "Footprint", "Why it's hard to beat"],
          rows: [
            ["Tire Rack", "10,000+ installers · 9 DCs", "Reviews, Price Pledge, $0 CAC to shops"],
            ["SimpleTire", "~25,000 partners", "All-inclusive checkout + roadside"],
            ["Discount Tire / Firestone", "~2,200 service centers", "Physical trust + warranties"],
            ["Amazon / Walmart", "Embedded install ($18/tire)", "Traffic + trust at zero CAC"],
            ["RepairPal / Openbay", "4,300+ certified shops", "Certification + fair-price trust"],
          ],
        },
        sections: [
          { h: "Active shops, not signed shops", body: "100 signed shops at ~8 orders/mo is a vanity metric. Engagement starts at 8–12 installed sets/active shop/month; 20+ earns tighter SLA. Dormant shops don't count." },
          { h: "'Free SaaS' is not a moat", body: "Shops already pay Shopmonkey/Tekmetric ($179–199/mo). Lead with demand + supply + fast settlement, not free software." },
        ],
      },
      oneOnOne: {
        intro: "Competition & Installers. I benchmarked the incumbents and modeled shop economics. Ask me why the connector model alone isn't differentiated, or about the order-density threshold.",
        faqs: [
          { q: "Isn't a digital connector novel?", a: "No — Tire Rack (10,000+ installers) and SimpleTire (~25,000) already do online-purchase + ship-to-installer with reviews and price pledges. Our wedge has to be supply economics and installer order-density, not the UX." },
          { q: "How many shops do we really need?", a: "Active, not signed. Target 15–25 active shops in one DFW cluster doing 8–12 installed sets/month each. A 100-signed-shop network with thin orders just creates support burden." },
        ],
      },
      inputs: "上游：entry-model-decision.md",
      outputs: [{ name: "competition-installer.md", to: "Budget & Unit Econ", kind: "data" }],
      memory: { session: "待运行。", agent: "Count active shops; connector UX is table stakes.", user: "—" },
      x: 624, y: 212, w: 184,
    },
    {
      id: "t-risk",
      kind: "agent", name: "Risk & Scenarios", emoji: "🌪️", role: "Kill-Criteria",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "INTP-A", label: "逻辑学家" },
      soul: "Turns the plan into explicit kill-gates so capital stops at the first failed assumption instead of bleeding for three years. Every gate has a number.",
      skills: ["kill.criteria", "sensitivity", "cac.model", "stage.gate"],
      domain: "杀手级风险与放行闸门",
      deliverable: {
        htmlName: "Risk-Scenarios.html", mdName: "risk-scenarios.md",
        kicker: "Risk & Scenarios · 示意",
        title: "Kill-Criteria & Stage Gates",
        lede: "示意 · Nine explicit kill-gates so the board funds learning, not hope. Capital releases only as each gate clears; the largest live unknowns are landed cost and CAC.",
        kpis: [{ v: "9", l: "Kill-gates" }, { v: "CAC", l: "Top unknown" }, { v: "Tariff", l: "Red gate" }],
        table: {
          cols: ["Gate", "Stop if…", "Owner"],
          rows: [
            ["Landed cost", "Broker can't preserve margin on first 50–100 SKUs", "Trade"],
            ["Tariff", "AD/CVD + 301 erase the price wedge", "Trade"],
            ["CAC", "CAC > gross contribution and not improving", "Budget"],
            ["Installer density", "<15 active shops or <8 sets/shop/mo at 180d", "Installers"],
            ["Claims", "Warranty/road-hazard/returns exceed reserve", "Compliance"],
          ],
        },
        sections: [
          { h: "Defensive segment", body: "An aging fleet and high new-car prices sustain maintenance demand even in a downturn — the macro is recession-resistant, which de-risks the entry once the wedge is proven." },
          { h: "Sensitivity", body: "Test warranty reserve at 2% / 5% / 10% of GMV and non-tire landed cost at +10% / +25% / +40% over FOB before scaling spend." },
        ],
      },
      oneOnOne: {
        intro: "Risk & Scenarios. I wrote the kill-criteria so capital stops at the first failed assumption. Ask me which gate is most likely to trip.",
        faqs: [
          { q: "Which gate trips first?", a: "Most likely landed cost / tariff, then CAC. If a broker can't preserve margin on the first 50–100 SKUs, or CAC stays above gross contribution with no improvement, we stop scaling — by design." },
          { q: "Is the macro a risk?", a: "Less than you'd think. Maintenance is recession-resistant — when people delay new-car purchases they maintain older cars longer, which lifts our segment." },
        ],
      },
      inputs: "上游：entry-model-decision.md",
      outputs: [{ name: "risk-scenarios.md", to: "Budget & Unit Econ", kind: "data" }],
      memory: { session: "待运行。", agent: "Every risk gets a numeric kill-gate; segment is defensive.", user: "—" },
      x: 430, y: 362, w: 184,
    },
    {
      id: "t-brand",
      kind: "agent", name: "Brand & Trust", emoji: "🎯", role: "Naming · Trust Levers",
      model: "anthropic · Sonnet 4.5", hiredBy: "tuhu-cond",
      mbti: { code: "ENFP-A", label: "竞选者" },
      soul: "Protects the consumer brand from origin and service-risk drag. Knows trust — not price — is the real barrier, and that an unfamiliar China-linked name starts with a tax.",
      skills: ["brand.arch", "trust.levers", "conversion.ab", "naming"],
      domain: "品牌信任与命名架构",
      deliverable: {
        htmlName: "Brand-Wedge.html", mdName: "brand-wedge.md",
        kicker: "Brand & Trust · 公开来源",
        title: "Don't Lead US Consumers with 'TUHU Direct'",
        lede: "公开来源 · US auto-repair trust is fragile and tire buyers research brands before purchase. Lead with a neutral US-facing brand, with Tuhu as an endorsed supply-chain credential — keep 'TUHU Direct' for B2B and investor contexts until A/B testing proves no penalty.",
        kpis: [{ v: "81%", l: "US unfavorable view of China" }, { v: "56%", l: "Buyers know brand pre-shop" }, { v: "Neutral", l: "Recommended brand" }],
        table: {
          cols: ["Trust lever", "Why it matters", "Pilot move"],
          rows: [
            ["Certified installer", "Local shop is the trust anchor", "ASE creds + insurance + audit rights"],
            ["Warranty + road-hazard", "Parity signal, must be legible", "Plain terms, fast claims"],
            ["Reviews", "Buyers check ratings before buying", "Few SKUs, deep verified reviews"],
            ["Brand架构", "China-link is a conversion tax", "Neutral US brand, Tuhu endorses"],
          ],
        },
        sections: [
          { h: "The wedge isn't cheap tires", body: "It's a trusted installed tire outcome through certified local shops, powered by a supply-chain advantage — with the consumer brand insulated from origin and early service-risk drag." },
          { h: "Decision rule", body: "Keep 'TUHU Direct' only if 90–180-day tests show no conversion penalty versus a neutral US brand at the same price, warranty, installer coverage and reviews." },
        ],
      },
      oneOnOne: {
        intro: "Brand & Trust. I built the brand architecture and trust levers. Ask me why we shouldn't lead with 'TUHU Direct', or how to win trust without leading on price.",
        faqs: [
          { q: "Why not use the Tuhu brand?", a: "US tire buyers research brands before buying, and 81% of US adults hold an unfavorable view of China — a real headwind for an unfamiliar China-linked consumer name. Lead with a neutral US brand; let Tuhu endorse the supply chain." },
          { q: "If not price, what wins?", a: "A complete, trustworthy installed outcome: certified installer, clear warranty, road-hazard coverage, transparent reviews and fast dispute resolution. Trust is the barrier, not price." },
        ],
      },
      inputs: "上游：entry-model-decision.md",
      outputs: [{ name: "brand-wedge.md", to: "Budget & Unit Econ", kind: "data" }],
      memory: { session: "待运行。", agent: "Insulate the consumer brand; trust beats price.", user: "—" },
      x: 624, y: 362, w: 184,
    },
    {
      id: "t-finance",
      kind: "agent", name: "Budget & Unit Economics", emoji: "💵", role: "$10M · Contribution",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "Holds the $10M ceiling by cutting scope, not by pretending risk lines are small. Measures one completed installed 4-tire order, not app installs.",
      skills: ["capital.allocate", "unit.econ", "contribution.model", "stage.gate"],
      domain: "$10M 预算与单位经济",
      deliverable: {
        htmlName: "Budget-Model.html", mdName: "budget-model.md",
        kicker: "Budget & Unit Economics · 示意",
        title: "$10M Fits Only a Narrowed, Stage-Gated Pilot",
        lede: "示意 · $10M is enough for a DFW staged-hybrid pilot with honest reserves — not the original LA-first broad DTC rollout. Re-budgeted as $3.2M / $3.8M / $3.0M, gated by compliance, landed-cost and density.",
        kpis: [{ v: "$10.0M", l: "3-yr envelope" }, { v: "$80–180", l: "Install fee / set" }, { v: "Break-even*", l: "Contribution (best ZIPs)" }],
        table: {
          cols: ["Use of funds", "3-yr", "Note"],
          rows: [
            ["Inventory · landed-cost · supplier QA", "$2.0M", "Narrow SKU + duty reserve"],
            ["Local team · G&A · support", "$1.8M", "Lean launch team"],
            ["Marketing · CAC tests", "$1.1M", "Small until economics work"],
            ["Installer BD · onboarding · settlement", "$1.0M", "Vetting + payouts + QA"],
            ["Insurance · warranty · recall reserve", "$1.0M", "Not a rounding error"],
          ],
        },
        sections: [
          { h: "By year", body: "Year 1 $3.2M (compliance gates + landed-cost validation + DFW pilot) · Year 2 $3.8M (scale active shops, only if gates clear) · Year 3 $3.0M (selective 2nd-metro)." },
          { h: "The unit is an installed order", body: "Model one completed 4-tire installed order. Contribution = tire + add-ons − landed cost − duty/tariff − fulfillment − installer payout − fees − warranty reserve − support − CAC. Pass-through install fees aren't margin." },
        ],
      },
      oneOnOne: {
        intro: "Budget & Unit Economics. I re-budgeted the $10M as a stage-gated pilot and built the contribution model. Ask me any line, or about break-even.",
        faqs: [
          { q: "Is $10M enough?", a: "Only for a narrowed, stage-gated DFW staged-hybrid pilot — not the original LA-first broad DTC plan with 100 shops and multi-state Year-2 expansion. We preserve the ceiling by cutting scope, not by under-reserving risk." },
          { q: "What's the success signal?", a: "Not corporate profit in 180 days. It's near-break-even contribution before fixed overhead in the best ZIP clusters, CAC improving with density/reviews, and no hidden loss in warranty or returns." },
        ],
      },
      inputs: "上游：trade / compliance / competition / risk / brand",
      outputs: [{ name: "budget-model.md", to: "Board Memo", kind: "data" }],
      memory: { session: "待运行。", agent: "Hold $10M by cutting scope; unit = one installed order.", user: "董事长预算硬约束 $10M。" },
      x: 830, y: 212, w: 184,
    },
    {
      id: "t-synth",
      kind: "agent", name: "Board Memo", emoji: "📋", role: "GO / CONDITIONAL GO",
      model: "anthropic · Opus 4.8", hiredBy: "tuhu-cond",
      mbti: { code: "ENFJ-A", label: "主人公" },
      soul: "Pulls five workstreams into one board-ready memo. Recommendation first, the decision ask explicit, every claim traceable to a specialist's deliverable.",
      skills: ["synthesize", "memo.compose", "exec.summary", "html.render"],
      domain: "董事会战略备忘录",
      deliverable: {
        htmlName: "Board-Strategy-Memo.html", mdName: "board-strategy-memo.md",
        kicker: "Board Memo · board-ready",
        title: "US Market Entry — Board Strategy Memo",
        lede: "示意 · Recommendation: CONDITIONAL GO. Enter the US as an asset-light, supply-led platform — DFW first, tires-first, B2B-enabled DTC, neutral consumer brand — funding only Year-1 $3.2M now and releasing the rest gate-by-gate.",
        kpis: [{ v: "CONDITIONAL GO", l: "Verdict" }, { v: "DFW · staged hybrid", l: "Model" }, { v: "$10M / 3yr", l: "Capital (gated)" }, { v: "1,500–3,000", l: "Installed orders (180d)" }],
        table: {
          cols: ["Phase", "Window", "Gate / milestone"],
          rows: [
            ["Phase 0 · Validate", "0–90d", "Broker landed-cost + insurance + 10–15 active shops"],
            ["Phase 1 · Prove", "90–180d", "1,500–3,000 installed orders, 4.6★, near-break-even"],
            ["Phase 2 · Expand", "Year 2–3", "Release capital only if gates clear; 2nd metro"],
          ],
        },
        sections: [
          { h: "Recommendation", body: "Asset-light, supply-led platform connecting China's supply chain to US independent shops. DFW not LA; tires-first; B2B-enabled DTC; neutral US brand with Tuhu as endorsed credential." },
          { h: "Decision for the board", body: "Approve only the Year-1 $3.2M envelope. Require a broker-validated landed-cost + insurance + recall package before inventory and marketing spend. Release Year-2 expansion only after 90–180-day gates clear." },
          { h: "How this memo was produced", body: "8 AI specialists across 5 sourced workstreams, ~2 days, ~$3.40 of compute — versus a traditional strategy engagement at $1.5–1.8M over 12–14 weeks." },
        ],
      },
      oneOnOne: {
        intro: "Board Memo. I wrote the board-ready synthesis from all five workstreams. Ask me to defend the verdict or walk a section.",
        faqs: [
          { q: "One-line recommendation?", a: "CONDITIONAL GO: enter the US as an asset-light supply-led platform — DFW first, tires-first, B2B-enabled DTC, neutral brand — funding Year-1 $3.2M now and gating the rest." },
          { q: "What's the ask to the board?", a: "Approve only the $3.2M Year-1 envelope, require a broker-validated landed-cost + insurance + recall package before spend, and release Year-2 capital only after the 90–180-day gates clear." },
        ],
      },
      inputs: "上游：budget-model.md + 全部尽调",
      outputs: [
        { name: "Board-Strategy-Memo.html", to: "董事长", kind: "view" },
        { name: "board-strategy-memo.md", to: "存档", kind: "data" },
      ],
      memory: { session: "待运行。", agent: "Recommendation first; every claim traceable.", user: "董事长偏好结论先行。" },
      x: 830, y: 362, w: 184,
    },
  ];

  /* ---- $10M / 3-year budget (re-budgeted as a stage-gated pilot) ---- */
  const capitalPlan = {
    label: "Re-budgeted $10M · 3-year stage-gated pilot",
    total: 10, unit: "M",
    years: [
      { k: "Year 1", v: 3.2, note: "Compliance gates + landed-cost validation + DFW pilot" },
      { k: "Year 2", v: 3.8, note: "Scale active shops — release only if gates clear" },
      { k: "Year 3", v: 3.0, note: "Selective 2nd-metro expansion" },
    ],
    funcs: [
      { k: "Inventory · landed-cost · supplier QA", v: 2.0 },
      { k: "Local team · G&A · support", v: 1.8 },
      { k: "Marketing · CAC tests", v: 1.1 },
      { k: "Installer BD · onboarding · settlement", v: 1.0 },
      { k: "Insurance · warranty · recall reserve", v: 1.0 },
      { k: "Product · order & claims platform", v: 0.9 },
      { k: "Regulatory · legal · trade · trademark", v: 0.85 },
      { k: "Warehouse · fulfillment · returns", v: 0.85 },
      { k: "Contingency · gate reserve", v: 0.5 },
    ],
    compare: { warroomCost: "$3.40", warroomTime: "~2 days", consultCost: "$1.5–1.8M", consultTime: "12–14 weeks" },
  };

  /* ---- conversational flow copy (read by the App interpreter) ---- */
  const greeting = "董事长，我是您的指挥官。这次美国市场进入，我会组建一支 AI 尽调军团——市场地理、进入模式、竞品门店、法务合规、关税到岸成本、品牌信任、财务单位经济，逐节点跑完。我不会顺着草案盖章：每一步都拿公开来源压力测试，遇到要您拍板的战略岔路，我再回退来问您。";

  const flow = {
    suggestionsInit: [
      { label: "组建「美国市场进入」尽调组织 ▶", text: "你是途虎养车的董事长，研究如全球化战略以及如何打开美国市场，3年预算投入是1000万美金", icon: "🐯", primary: true, action: "create" },
    ],
    thinking: [
      "拆解目标：途虎 × 美国市场进入 × $10M / 3 年（对照您的草案假设）",
      "检索花名册 … 无可复用 Agent，按 5 大工作流新招",
      "设计作战流程：市场地理 → 进入模式 → 多线尽调（竞品 / 合规 / 风险 / 品牌）→ 财务单位经济 → 董事会备忘录",
      "招聘 8 名专家 Agent，接入公开数据源逐条核查",
    ],
    builtMsg: "作战图画好了 👈 我把目标拆成一条尽调流水线，专门用来<b>验证您草案里的假设</b>：市场地理 → 进入模式 → 多线尽调 → 财务单位经济 → 董事会备忘录。8 名专家各管一个工作流，数据流我画在左边了。",
    afterTeamMsg: "提醒一句：草案里「<b>洛杉矶直营 + TUHU Direct 品牌 + 比传统渠道便宜三成</b>」这几条，我已经预先标了红旗——很可能要在<b>进入模式</b>那一步请您重新拍板。要现在就启动尽调吗？",
    suggestionsReady: [
      { label: "启动尽调组织 ▶", text: "启动尽调，开始干活", icon: "▶", primary: true, action: "run" },
    ],
    runIntro: "开跑。我会盯着每个节点，遇到要您拍板的战略岔路就回退来找您。",
    askQuestion: {
      from: "Entry Model",
      text: "市场地理跑完了，但我得先给您泼盆冷水——三条都有公开来源：①「<b>便宜三成</b>」的价格优势很可能站不住，中国乘用/轻卡轮胎在美面临反倾销税最高 <b>87.99%</b>、反补贴税普遍 <b>31.56%</b>，叠加 301 关税，优势可能被吃光；② 纯消费端 DTC 获客太贵——Tire Rack 已有 <b>1 万家</b>安装店、SimpleTire <b>2.5 万家</b>，连接体验本身不构成差异化；③ <b>洛杉矶</b>成本与加州合规最高，$10M 在这里买到的实验最少，<b>达拉斯（DFW）</b>更划算。<b>进入模式得您拍板：</b>",
      ctx: "目标：美国市场进入 · 进入模式待决 · 原草案 3 处假设亮红旗",
      quick: [
        { label: "走 DFW 分阶段混合 · B2B 赋能 DTC（推荐）", value: "staged" },
        { label: "坚持洛杉矶直营 DTC 原方案", value: "la_dtc" },
        { label: "只做 B2B 供货 · 先不碰消费端", value: "b2b" },
      ],
    },
    acks: {
      staged: "明白，走 <b>DFW 分阶段混合（B2B 赋能 DTC）</b>——这是 $10M 下唯一跑得通的路：达拉斯 2–3 个相邻片区，30–50 家签约、15–25 家跑起来，轮胎先行。这条路最大的<b>生死线</b>是关税会不会吃掉价格优势，所以我临时增聘了一名 <b>Trade & Landed-Cost</b> 专家，把到岸成本和 AD/CVD 做成<b>放行闸门</b>，重连了作战图。继续往下跑。",
      la_dtc: "收到，但我必须留痕：$10M 预算下，洛杉矶直营 DTC 我判定为 <b>NO-GO</b>——加州合规 + 高获客 + 关税风险会挤掉全部学习预算。我按这个口径继续，但财务和备忘录会明确标注风险。",
      b2b: "好，<b>纯 B2B 供货先行</b>——获客与品牌风险最低，但容易沦为低毛利分销商、丢掉消费数据闭环。我继续跑，备忘录里会把它定位成「运营楔子」而非终局。",
    },
    finalMsg: "全部跑完 ✅ 五条工作流汇聚成一份<b>董事会战略备忘录</b>。结论先行：<b>CONDITIONAL GO</b>——以轻资产、供应链驱动的平台进入，<b>达拉斯先行、轮胎先行、B2B 赋能 DTC、用中性美国品牌</b>，先只批 Year-1 的 $3.2M，其余按闸门逐段释放。给您看可交互的备忘录，结构化版本也已存档。",
    deliverableItems: [
      { name: "Board-Strategy-Memo.html", kind: "view", nodeId: "t-synth" },
      { name: "board-strategy-memo.md", kind: "data" },
    ],
    closingMsg: "顺手提示：左边「<b>预算</b>」页能看到重排后的 $10M 三年分配（按年/按职能），以及一个对比——这支 AI 军团跑完整套跨国尽调只花了约 <b>$3.40</b> 算力、约 2 天；传统战略咨询通常是 <b>$1.5–1.8M、12–14 周</b>。",
    closingSuggestions: [
      { label: "打开预算页 · 看 $10M 分配与成本对比", text: "打开预算页", icon: "📊", action: "openBudget" },
      { label: "和 Trade & Landed-Cost 单聊，问问关税生死线", text: "与 Trade 单聊", icon: "💬", action: "chatTrade" },
    ],
  };

  return { company, conductor, agents, capitalPlan, greeting, flow };
})();
