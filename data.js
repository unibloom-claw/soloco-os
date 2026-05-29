/* ============================================================
   Soloco · scenario data — 薪酬分析组织
   对比北京 / 上海 / 深圳 三城市「产品经理」岗位薪酬
   + 本机资料授权 → 分领域知识蒸馏 → 结构化知识图谱
   ============================================================ */
window.SOLOCO_DATA = (function () {
  const company = {
    id: "co",
    name: "薪酬研究室",
    emoji: "🏢",
    mission: "用 AI 团队把薪酬问题一次说清",
  };

  const conductor = {
    id: "conductor",
    kind: "conductor",
    name: "指挥官",
    role: "Conductor",
    model: "anthropic · Opus 4.8",
    mbti: { code: "ENFJ-A", label: "协调者" },
    soul: "整个组织的协调中枢。拆解你的目标、招聘合适的 Agent、编排串并行与条件分支，并在出问题时回退来找你。",
    skills: ["plan.decompose", "agent.hire", "graph.wire", "fs.grant", "ask_question", "human.in.loop"],
    x: 360, y: 118, w: 200,
  };

  // 每个 Agent 背后都是一次模型调用（Claude / GPT 皆可）
  const agents = [
    {
      id: "collector",
      kind: "agent",
      name: "数据采集员",
      emoji: "🛰️",
      role: "数据采集",
      model: "openai · GPT 5.5",
      hiredBy: "conductor",
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "严谨细致的数据搬运工，宁可慢也不肯出错，对数据来源的可信度近乎偏执。每抓一条都要回查出处。",
      skills: ["web.fetch", "browser.login", "sheet.parse", "mcp · 猎聘开放数据"],
      domain: "公开薪酬数据采集",
      deliverable: {
        htmlName: "原始薪酬数据.html",
        mdName: "原始薪酬数据.csv",
        kicker: "数据采集员 · 公开数据源",
        title: "原始薪酬数据 · 412 条",
        lede: "近 90 天三城市「产品经理」公开岗位，逐条回查出处后入库。列表页需登录处已自动切换为可复核的公开详情页。",
        kpis: [{ v: "412", l: "有效条数" }, { v: "3", l: "城市" }, { v: "92%", l: "出处可复核" }],
        table: {
          cols: ["城市", "样本", "数据源", "字段完整度"],
          rows: [
            ["北京", "152", "职友集公开页", "缺股权"],
            ["上海", "138", "职友集公开页", "缺股权"],
            ["深圳", "122", "职友集公开页", "缺股权"],
          ],
        },
      },
      oneOnOne: {
        intro: "我是数据采集员。这一轮我抓了 412 条公开岗位数据。你可以问我数据从哪来、为什么换源、哪些字段缺失——但派新活儿得找指挥官。",
        faqs: [
          { q: "数据是从哪抓的？", a: "全部来自「职友集」公开岗位详情页。猎聘列表页需要登录、会触发风控，所以我没用它。每条都留了原始链接，可逐条复核。" },
          { q: "为什么缺股权字段？", a: "公开详情页只披露 base + bonus，股权通常不公开。这一轮按你的偏好先跳过股权，标注为「缺股权」，不做估算以免污染分位。" },
          { q: "样本够不够代表性？", a: "三城市都 > 100 条（北京 152 / 上海 138 / 深圳 122），按市场分析师的口径足够跑分位。低于 50 会触发预警分支。" },
        ],
      },
      inputs: "Conductor 派发：北京 / 上海 / 深圳「产品经理」岗位关键词 + 采集范围（近 90 天）",
      outputs: [{ name: "原始薪酬数据.csv", to: "市场分析师", kind: "data" }],
      memory: {
        session: "本轮：尝试登录猎聘列表页失败 → 已切换公开数据源。",
        agent: "薪酬数据可在「职友集」「猎聘」公开详情页抓取；列表页需登录、易触发风控。",
        user: "你倾向用公开、可复核的数据源，不要爬需要授权的页面。",
      },
      x: 40, y: 300, w: 196,
    },
    {
      id: "market",
      kind: "agent",
      name: "市场分析师",
      emoji: "📊",
      role: "市场分析",
      model: "anthropic · Sonnet 4.5",
      hiredBy: "conductor",
      mbti: { code: "ENTP-A", label: "辩论家" },
      soul: "喜欢从数字里找故事，习惯先问「这个市场到底有多大」再下结论。样本不够会直接喊停。",
      skills: ["pandas", "stats.regression", "chart.render"],
      domain: "市场规模与样本充足性",
      deliverable: {
        htmlName: "市场规模评估.html",
        mdName: "市场规模评估.md",
        kicker: "市场分析师 · 自动生成",
        title: "三城市市场规模评估",
        lede: "样本 412 条，三城市均 > 100，判定市场规模充足，满足「≥50」的完整分析门槛。可放心走薪酬分析师的完整模型。",
        kpis: [{ v: "412", l: "总样本" }, { v: "充足", l: "规模判定" }, { v: "≥50", l: "完整模型门槛" }],
        sections: [
          { h: "判定逻辑", body: "样本量 < 50 视为市场过小，触发预警分支而非跑完整模型；本轮三城市最低 122，远超门槛。" },
          { h: "代表性", body: "已标注样本量与置信度，分布无明显单一公司主导，可比性良好。" },
        ],
      },
      oneOnOne: {
        intro: "市场分析师在此。我负责判断「这个市场到底有多大、样本够不够」。想了解判定逻辑、置信度都可以问我。",
        faqs: [
          { q: "为什么判定市场充足？", a: "三城市样本分别为 152 / 138 / 122，均远超我设定的 50 条门槛，且无单一公司主导，分布健康。" },
          { q: "样本不够会怎样？", a: "低于 50 我会直接喊停，触发条件分支让预警撰写出一页风险提示，跳过昂贵的完整模型。" },
        ],
      },
      inputs: "上游：原始薪酬数据.csv",
      outputs: [{ name: "市场规模评估.md", to: "薪酬分析师", kind: "data" }],
      memory: {
        session: "本轮：样本 412 条，三城市均 > 100，判定市场规模充足。",
        agent: "样本量 < 50 视为市场过小，应触发预警分支而非跑完整模型。",
        user: "你关心样本代表性，要求标注样本量与置信度。",
      },
      x: 272, y: 300, w: 196,
    },
    {
      id: "comp",
      kind: "agent",
      name: "薪酬分析师",
      emoji: "💰",
      role: "薪酬分析",
      model: "anthropic · Opus 4.8",
      hiredBy: "conductor",
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "冷静的结构化思考者，擅长把杂乱的薪酬拆成可比的分位数与总包构成，拒绝拍脑袋结论。",
      skills: ["pandas", "percentile", "compa-ratio", "mcp · 薪酬基准库"],
      domain: "薪酬分位与总包结构",
      deliverable: {
        htmlName: "薪酬分析结果.html",
        mdName: "薪酬分析结果.md",
        type: "report",
        kicker: "薪酬分析师 · 自动生成",
        title: "产品经理薪酬 · 三城市分位",
        lede: "固定用 P25 / P50 / P75 + 总包拆解。结论先行：北京月总包中位数最高（¥52k），深圳样本最少但分位差最小。",
      },
      oneOnOne: {
        intro: "薪酬分析师。我把杂乱薪酬拆成可比的分位数与总包构成。想知道某个分位怎么算的、总包怎么拆的，问我。",
        faqs: [
          { q: "P50 是怎么算的？", a: "对每个城市的月总包（base + bonus，本轮无股权）取中位数。北京 ¥52k、上海 ¥49k、深圳 ¥47k。" },
          { q: "为什么不给我原始大表？", a: "按你的偏好，我只交付可对比的分位结论。原始 412 条在数据采集员那里，需要可向我要出处。" },
        ],
      },
      inputs: "上游：原始薪酬数据.csv + 市场规模评估.md",
      outputs: [{ name: "薪酬分析结果.md", to: "报告撰写", kind: "data" }],
      memory: {
        session: "待运行。",
        agent: "三城市对比固定用 P25 / P50 / P75 + 总包拆解（base / bonus / 股权）。",
        user: "你只要可对比的结论，不要原始大表。",
      },
      x: 504, y: 300, w: 196,
    },
    {
      id: "report",
      kind: "agent",
      name: "报告撰写",
      emoji: "📝",
      role: "报告生成",
      model: "anthropic · Sonnet 4.5",
      hiredBy: "conductor",
      mbti: { code: "ENFJ-T", label: "主人公" },
      soul: "把硬核数据讲成人话，喜欢用对比和小结照顾读者。结论先行，图表在前。",
      skills: ["md.compose", "html.render", "chart.embed"],
      domain: "面向人的报告呈现",
      deliverable: {
        htmlName: "薪酬分析展示.html",
        mdName: "薪酬分析结果.md",
        type: "report",
        kicker: "薪酬研究室 · 自动生成",
        title: "产品经理薪酬 · 三城市对比",
        lede: "结论先行：北京月总包中位数最高（¥52k），深圳样本最少但分位差最小。数据来自近 90 天公开岗位，样本 412 条。",
      },
      oneOnOne: {
        intro: "报告撰写。我把分析结论讲成人话。想让我换个角度解读、或解释报告里某句话，都可以聊。",
        faqs: [
          { q: "这份报告的核心结论？", a: "北京中位数最高（¥52k），京沪 P50 差约 11%，深圳样本最少但三分位最紧凑、确定性最高。" },
          { q: "交付了哪些文件？", a: "给你看的 薪酬分析展示.html，和给机器存档/下游消费的 薪酬分析结果.md。两份内容同源。" },
        ],
      },
      inputs: "上游：薪酬分析结果.md（或市场预警.md）",
      outputs: [
        { name: "薪酬分析展示.html", to: "你", kind: "view" },
        { name: "薪酬分析结果.md", to: "存档", kind: "data" },
      ],
      memory: {
        session: "待运行。",
        agent: "交付物双份：给人看的 .html + 给机器存的 .md。",
        user: "你偏好结论先行、图表在前、正文在后。",
      },
      x: 736, y: 300, w: 196,
    },
    // 条件分支：仅在「重连流程」后出现
    {
      id: "alert",
      kind: "agent",
      name: "预警撰写",
      emoji: "⚠️",
      role: "预警报告",
      model: "anthropic · Haiku 4",
      hiredBy: "conductor",
      conditional: true,
      hidden: true,
      mbti: { code: "ISTP-A", label: "鉴赏家" },
      soul: "短平快，只在市场过小、不值得跑完整模型时才出现，一句话说清风险与建议。",
      skills: ["md.compose"],
      domain: "市场过小时的风险预警",
      deliverable: {
        htmlName: "市场预警.html",
        mdName: "市场预警.md",
        kicker: "预警撰写 · 条件分支",
        title: "市场规模预警",
        lede: "本轮未触发：市场规模充足。若样本 < 50，此处会输出一页风险与建议。",
        sections: [
          { h: "风险（示例）", body: "样本过小，分位估计不稳，结论不可外推。" },
          { h: "建议（示例）", body: "扩大采集范围或拉长时间窗，再决定是否跑完整模型。" },
        ],
      },
      oneOnOne: {
        intro: "预警撰写。我只在市场太小时出场，一句话说清风险和建议。本轮市场充足，我没被触发。",
        faqs: [{ q: "你这轮为什么没跑？", a: "市场分析师判定样本 412 充足，满足「≥50」，所以走了完整模型，我被跳过了。" }],
      },
      inputs: "上游：市场规模评估.md（当样本不足 / 市场过小时触发）",
      outputs: [{ name: "市场预警.md", to: "报告撰写", kind: "data" }],
      memory: {
        session: "待命：市场规模充足，本轮未触发。",
        agent: "预警只给一页：风险一句话 + 建议一句话。",
        user: "—",
      },
      x: 504, y: 452, w: 196,
    },
  ];

  /* ---- 本机资料授权后，按领域蒸馏的 Agent（默认隐藏，授权后揭示） ---- */
  const distillers = [
    {
      id: "d-fin",
      kind: "agent",
      name: "财务蒸馏师",
      emoji: "🧾",
      role: "财务领域",
      model: "anthropic · Opus 4.8",
      hiredBy: "conductor",
      conditional: true,
      hidden: true,
      mbti: { code: "ISTJ-A", label: "检查员" },
      soul: "只认数字和凭据。把发票、报表、合同金额里的事实抠出来，建立可追溯的财务实体与时间线，绝不臆测金额。",
      skills: ["fs.read", "pdf.parse", "table.extract", "entity.link"],
      domain: "财务凭据 / 报表 / 预算",
      deliverable: {
        htmlName: "财务领域知识.html",
        mdName: "财务领域知识.md",
        kicker: "财务蒸馏师 · 领域蒸馏",
        title: "财务领域 · 结构化知识",
        lede: "从授权目录里识别出 48 份财务文档，抽取为可追溯的实体与关系：主体、金额、时间、凭据出处。",
        kpis: [{ v: "48", l: "财务文档" }, { v: "126", l: "实体" }, { v: "always", l: "带出处" }],
        sections: [
          { h: "抽取的实体类型", body: "供应商 / 合同 / 发票 / 预算科目 / 报销人 / 账期。" },
          { h: "典型关系", body: "供应商 —签署→ 合同 —开具→ 发票 —计入→ 预算科目。" },
        ],
      },
      oneOnOne: {
        intro: "财务蒸馏师。我把你授权目录里的财务资料蒸馏成了结构化知识。想查某笔金额、某个供应商的关联，问我即可——我只回答，不动账。",
        faqs: [
          { q: "你蒸馏了哪些财务文档？", a: "48 份：合同、发票、季度报表、报销单。每个抽取的金额都链回原始文件页码。" },
          { q: "能查某个供应商吗？", a: "可以。我建立了供应商→合同→发票→预算科目的关系链，告诉我名字，我给你它的完整账务画像。" },
        ],
      },
      inputs: "授权目录中的财务类文件",
      outputs: [{ name: "财务领域知识.md", to: "结构化知识图谱", kind: "data" }],
      memory: { session: "—", agent: "—", user: "—" },
      x: 148, y: 300, w: 196,
    },
    {
      id: "d-prod",
      kind: "agent",
      name: "产品蒸馏师",
      emoji: "📐",
      role: "产品领域",
      model: "anthropic · Sonnet 4.5",
      hiredBy: "conductor",
      conditional: true,
      hidden: true,
      mbti: { code: "INFJ-A", label: "提倡者" },
      soul: "擅长在 PRD、会议纪要和路线图里找出「决策」与「未决」。把散落的产品意图收敛成可检索的决策日志。",
      skills: ["fs.read", "doc.parse", "decision.mine", "timeline.build"],
      domain: "PRD / 纪要 / 路线图",
      deliverable: {
        htmlName: "产品领域知识.html",
        mdName: "产品领域知识.md",
        kicker: "产品蒸馏师 · 领域蒸馏",
        title: "产品领域 · 结构化知识",
        lede: "从 31 份产品文档里挖出 64 条决策与 12 个未决项，按时间线归位，并标注每条决策的依据与负责人。",
        kpis: [{ v: "31", l: "产品文档" }, { v: "64", l: "已记录决策" }, { v: "12", l: "未决项" }],
        sections: [
          { h: "决策日志", body: "每条决策含：上下文 → 选项 → 结论 → 依据 → 负责人 → 时间。" },
          { h: "未决项", body: "标记缺乏结论或互相冲突的意图，供你回到指挥官那里继续推进。" },
        ],
      },
      oneOnOne: {
        intro: "产品蒸馏师。我把你授权目录里的 PRD、纪要、路线图收敛成了决策日志。想知道某个功能为什么这么定，问我。",
        faqs: [
          { q: "都蒸馏了哪些资料？", a: "31 份：PRD、周会纪要、季度路线图。我从中提炼出 64 条决策和 12 个尚未拍板的未决项。" },
          { q: "能查某个功能的来龙去脉吗？", a: "能。我按时间线串起每个功能的上下文、选项、结论和负责人，告诉我功能名即可。" },
        ],
      },
      inputs: "授权目录中的产品类文件",
      outputs: [{ name: "产品领域知识.md", to: "结构化知识图谱", kind: "data" }],
      memory: { session: "—", agent: "—", user: "—" },
      x: 382, y: 300, w: 196,
    },
    {
      id: "d-legal",
      kind: "agent",
      name: "法务蒸馏师",
      emoji: "⚖️",
      role: "法务领域",
      model: "openai · GPT 5.5",
      hiredBy: "conductor",
      conditional: true,
      hidden: true,
      mbti: { code: "INTJ-A", label: "建筑师" },
      soul: "对条款和期限零容忍模糊。把合同里的义务、权利、生效与到期日抽成结构化条款表，主动标记风险点。",
      skills: ["fs.read", "contract.parse", "clause.extract", "risk.flag"],
      domain: "合同 / 条款 / 合规",
      deliverable: {
        htmlName: "法务领域知识.html",
        mdName: "法务领域知识.md",
        kicker: "法务蒸馏师 · 领域蒸馏",
        title: "法务领域 · 结构化知识",
        lede: "解析 27 份合同，抽出 213 条条款与 18 个关键期限，主动标记 5 处需关注的风险点（自动续约 / 单边解约 / 罚则）。",
        kpis: [{ v: "27", l: "合同" }, { v: "213", l: "条款" }, { v: "5", l: "风险点" }],
        sections: [
          { h: "条款表", body: "每条含：义务方 / 权利方 / 生效日 / 到期日 / 触发条件。" },
          { h: "风险标记", body: "自动续约、单边解约、高额罚则、管辖地异常——已高亮，供你定夺。" },
        ],
      },
      oneOnOne: {
        intro: "法务蒸馏师。我把授权目录里的合同抽成了结构化条款表，并标了风险点。想查某份合同的义务或到期日，问我——我只解读，不出具法律意见。",
        faqs: [
          { q: "标了哪些风险？", a: "5 处：3 份含自动续约、1 份单边解约权不对等、1 份罚则偏高。每处都链回原始条款。" },
          { q: "最近要到期的合同？", a: "我把 18 个关键期限按日期排了序。告诉我时间窗（比如 90 天内），我列给你。" },
        ],
      },
      inputs: "授权目录中的合同 / 法务类文件",
      outputs: [{ name: "法务领域知识.md", to: "结构化知识图谱", kind: "data" }],
      memory: { session: "—", agent: "—", user: "—" },
      x: 616, y: 300, w: 196,
    },
  ];

  /* ---- 三位蒸馏师汇聚成的结构化知识图谱（artifact 节点） ---- */
  const kgraph = {
    id: "kgraph",
    kind: "artifact",
    name: "结构化知识图谱",
    emoji: "🕸️",
    role: "Knowledge Graph",
    hidden: true,
    conditional: true,
    deliverable: {
      htmlName: "结构化知识图谱.html",
      mdName: "knowledge-graph.md",
      type: "graph",
      kicker: "组织共享记忆 · 自动合并",
      title: "结构化知识图谱",
      lede: "三个领域的蒸馏结果被合并、对齐、去重，形成一张跨领域的知识图谱，成为所有 Agent 的共享背景知识——不在前端显式展开，但每次任务都会被自动调用。",
      kpis: [{ v: "3", l: "领域" }, { v: "403", l: "实体" }, { v: "1.2k", l: "关系边" }],
      graph: {
        domains: [
          { id: "fin", label: "财务", emoji: "🧾", n: 126 },
          { id: "prod", label: "产品", emoji: "📐", n: 154 },
          { id: "legal", label: "法务", emoji: "⚖️", n: 123 },
        ],
        links: [
          { from: "fin", to: "legal", label: "合同 ↔ 付款" },
          { from: "prod", to: "fin", label: "功能 ↔ 预算" },
          { from: "prod", to: "legal", label: "需求 ↔ 合规" },
        ],
      },
      sections: [
        { h: "跨领域对齐", body: "「同一供应商」「同一合同」在三个领域里的不同称呼被识别为同一实体并合并。" },
        { h: "如何被使用", body: "Agent 工作时自动检索相关子图作为背景知识；三重记忆同样在后台读写，均不在前端展开。" },
      ],
    },
    x: 360, y: 470, w: 220,
  };

  return { company, conductor, agents, distillers, kgraph };
})();

/* ---- extra sample organizations (for the org switcher / roster / costs) ---- */
window.SOLOCO_ORGS = (function () {
  // lay out a static idle org: company → conductor → row of agents
  function build(co, cond, ags) {
    const W = 196, GAP = 38, y = 300;
    const total = ags.length * W + (ags.length - 1) * GAP;
    const startX = 488 - total / 2;
    const company = { ...co, kind: "company", x: 388, y: 20, w: 224, status: "idle" };
    const conductor = { ...cond, id: co.id + "-cond", kind: "conductor", name: "指挥官", role: "Conductor", model: "anthropic · Opus 4.8", x: 368, y: 118, w: 196, status: "idle" };
    const agents = ags.map((a, i) => ({ ...a, kind: "agent", hiredBy: "conductor", x: startX + i * (W + GAP), y, w: W, status: a.status || "idle" }));
    const nodes = [company, conductor, ...agents];
    const edges = [{ from: company.id, to: conductor.id, kind: "down" }];
    for (const a of agents) edges.push({ from: conductor.id, to: a.id, kind: "dispatch", type: "dispatch" });
    for (let i = 0; i < agents.length - 1; i++) edges.push({ from: agents[i].id, to: agents[i + 1].id, kind: "flow-h" });
    return { ...co, nodes, edges: edges.map((e) => ({ ...e, id: `${e.from}>${e.to}` })) };
  }

  const growth = build(
    { id: "org-growth", name: "增长实验室", emoji: "🚀", mission: "找到下一个可复制的增长杠杆" },
    {},
    [
      { id: "g-channel", name: "渠道分析师", emoji: "📈", role: "渠道分析", model: "anthropic · Sonnet 4.5", mbti: { code: "ENTP-A", label: "辩论家" }, status: "running",
        soul: "盯着每个渠道的 ROI，习惯先砍掉不赚钱的，再加码能跑出来的。", skills: ["ads.api", "ga4", "chart.render"],
        inputs: "各渠道近 30 天投放与转化数据", outputs: [{ name: "渠道 ROI.md", to: "落地页优化师", kind: "data" }],
        memory: { session: "本轮：抖音 ROI 最高，正在复算。", agent: "搜索词转化滞后 3 天，要按归因窗口算。", user: "你只看可规模化的渠道。" } },
      { id: "g-lp", name: "落地页优化师", emoji: "🎯", role: "落地页", model: "anthropic · Opus 4.8", mbti: { code: "INTJ-A", label: "建筑师" }, status: "idle",
        soul: "把转化漏斗当系统拆，单点假设、单点验证，不一次改一堆。", skills: ["figma.read", "copy.rewrite", "heatmap"],
        inputs: "渠道 ROI.md + 当前落地页", outputs: [{ name: "改版方案.md", to: "A/B 实验员", kind: "data" }],
        memory: { session: "待运行。", agent: "首屏 CTA 改文案的提升幅度最大。", user: "你要每次只改一个变量。" } },
      { id: "g-ab", name: "A/B 实验员", emoji: "🧪", role: "实验", model: "openai · GPT 5.5", mbti: { code: "ISTP-A", label: "鉴赏家" }, status: "idle",
        soul: "只认显著性，样本没到不下结论，宁可多等两天。", skills: ["stats.ttest", "exp.runner"],
        inputs: "改版方案.md", outputs: [{ name: "实验结论.md", to: "你", kind: "view" }],
        memory: { session: "待运行。", agent: "p<0.05 且样本>1000 才算赢。", user: "—" } },
    ]
  );

  const content = build(
    { id: "org-content", name: "内容工厂", emoji: "🎬", mission: "把一个想法变成一周的内容" },
    {},
    [
      { id: "c-topic", name: "选题策划", emoji: "💡", role: "选题", model: "anthropic · Sonnet 4.5", mbti: { code: "ENFP-A", label: "竞选者" }, status: "idle",
        soul: "对热点敏感，总能把平淡的题材找到一个让人想点开的角度。", skills: ["trend.fetch", "title.gen"],
        inputs: "本周方向 + 平台热榜", outputs: [{ name: "选题清单.md", to: "脚本撰写", kind: "data" }],
        memory: { session: "待运行。", agent: "疑问句标题打开率更高。", user: "你不要标题党。" } },
      { id: "c-script", name: "脚本撰写", emoji: "✍️", role: "脚本", model: "anthropic · Opus 4.8", mbti: { code: "INFJ-A", label: "提倡者" }, status: "idle",
        soul: "讲究节奏，前三秒必须留住人，结尾必须有钩子。", skills: ["script.compose", "hook.lib"],
        inputs: "选题清单.md", outputs: [{ name: "分镜脚本.md", to: "剪辑合成", kind: "data" }],
        memory: { session: "待运行。", agent: "口播脚本控制在 45 秒内。", user: "你喜欢口语化表达。" } },
      { id: "c-edit", name: "剪辑合成", emoji: "🎞️", role: "剪辑", model: "openai · GPT 5.5", mbti: { code: "ISFP-A", label: "探险家" }, status: "idle",
        soul: "审美在线，能在一堆素材里挑出最有质感的几帧。", skills: ["ffmpeg", "caption.auto", "bgm.match"],
        inputs: "分镜脚本.md + 素材", outputs: [{ name: "成片.mp4", to: "你", kind: "view" }],
        memory: { session: "待运行。", agent: "字幕用无衬线、底部留安全区。", user: "—" } },
    ]
  );

  return { growth, content };
})();
