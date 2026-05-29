/* ============================================================
   Soloco · App — orchestration state machine
   ============================================================ */
const { company: CO, conductor: COND, agents: AGENTS, distillers: DISTILLERS, kgraph: KGRAPH } = window.SOLOCO_DATA;
const ORGS = window.SOLOCO_ORGS;
const EXTRA = [...DISTILLERS, KGRAPH];
const STATIC = [CO && { ...CO, kind: "company", x: 388, y: 20, w: 224 }, COND, ...AGENTS, ...EXTRA].filter(Boolean);
const SALARY_IDS = AGENTS.map((a) => a.id);
const DISTILL_IDS = [...DISTILLERS.map((d) => d.id), KGRAPH.id];

/* ---- flagship scenario: 途虎 · 全球化战略（默认头牌） ---- */
const TUHU = window.TUHU_DATA;
const TCO = { ...TUHU.company, kind: "company", x: 300, y: 0, w: 210 };
const TUHU_STATIC = [TCO, TUHU.conductor, ...TUHU.agents];
const isLive = (o) => o === "tuhu" || o === "primary";

const byId = Object.fromEntries([...STATIC, ...TUHU_STATIC].map((n) => [n.id, n]));

const initNs = () => {
  const o = {};
  for (const a of [...AGENTS, ...EXTRA, ...TUHU.agents]) o[a.id] = { status: "idle", hidden: !!a.hidden };
  o[COND.id] = { status: "idle" };
  o[CO.id] = { status: "idle" };
  o[TUHU.conductor.id] = { status: "idle" };
  o[TCO.id] = { status: "idle" };
  return o;
};

const GREET_PRIMARY = "嗨，我是指挥官。告诉我你想达成什么目标，我会现场招聘 Agent、把协作流程画在左边的画布上，然后开始干活。哪怕只是一句模糊的想法也行。";
const SALARY_INIT_SUGG = [
  { label: "授权本机资料 · 先蒸馏成知识图谱", text: "我先授权一个本机文件夹，让你把里面的资料蒸馏成知识图谱", icon: "\uD83D\uDCC2", primary: true, action: "authorize" },
  { label: "创建薪酬分析组织 · 对比三城市产品经理薪酬", text: "帮我创建一个薪酬分析组织，对比北京、上海、深圳三个城市的产品经理薪酬", icon: "🎯", action: "create" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let MID = 0;
const mid = () => `m${++MID}`;

function App() {
  const [theme, setTheme] = React.useState("light");
  const [showIdle, setShowIdle] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [orgMenuOpen, setOrgMenuOpen] = React.useState(false);

  const [activeOrg, setActiveOrg] = React.useState("tuhu");
  const [view, setView] = React.useState("canvas"); // canvas | roster | costs

  const [sceneEmpty, setSceneEmpty] = React.useState(true);
  const [primaryMode, setPrimaryMode] = React.useState("none"); // none | salary | distill
  const [entered, setEntered] = React.useState(false);
  const [flowMode, setFlowMode] = React.useState("serial"); // serial | conditional
  const [activeKey, setActiveKey] = React.useState(null);

  // 途虎 flagship scenario state
  const [tEmpty, setTEmpty] = React.useState(true);
  const [tEntered, setTEntered] = React.useState(false);
  const [tMode, setTMode] = React.useState("serial"); // serial | reroute（收购+合资）
  const [tDone, setTDone] = React.useState(false);
  const tuhuResume = React.useRef(null);

  // model picker (conductor) — multi-vendor
  const [convModel, setConvModel] = React.useState("Opus 4.8");
  // local-folder authorization
  const [authOpen, setAuthOpen] = React.useState(false);
  const [grantedPath, setGrantedPath] = React.useState(null);
  // one-on-one agent chat
  const [agentChatId, setAgentChatId] = React.useState(null);
  const [agentThreads, setAgentThreads] = React.useState({});
  // deliverable preview (descriptor-driven)
  const [deliverable, setDeliverable] = React.useState(null);

  const [ns, setNs] = React.useState(initNs);
  const setNS = (id, patch) => setNs((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const [threads, setThreads] = React.useState({
    tuhu: [{ id: mid(), role: "bot", text: TUHU.greeting, typed: false }],
    primary: [{ id: mid(), role: "bot", text: GREET_PRIMARY, typed: false }],
    "org-growth": [{ id: mid(), role: "bot", text: "这里是「增长实验室」。3 名 Agent 常驻，渠道分析师正在跑本周的渠道 ROI。想调整增长策略，直接跟我说。", typed: true }],
    "org-content": [{ id: mid(), role: "bot", text: "这里是「内容工厂」。选题、脚本、剪辑三条岗位已就位，给我一个方向，我就排一周的内容。", typed: true }],
  });
  const messages = threads[activeOrg];
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("空闲 · 随时可聊");
  const [queue, setQueue] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [now, setNow] = React.useState(Date.now());

  const [suggestions, setSuggestions] = React.useState(TUHU.flow.suggestionsInit);

  const busyRef = React.useRef(busy);
  busyRef.current = busy;

  // theme
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // live timer for running nodes
  React.useEffect(() => {
    const anyRunning = Object.values(ns).some((v) => v.status === "running");
    if (!anyRunning) return;
    const id = setInterval(() => setNow(Date.now()), 110);
    return () => clearInterval(id);
  }, [ns]);

  /* ---------- message helpers (thread-aware) ---------- */
  const pushTo = (org, m) => setThreads((t) => ({ ...t, [org]: [...t[org], { id: mid(), ...m }] }));
  const push = (m) => pushTo("primary", m);
  const removeMsg = (org, id) => setThreads((t) => ({ ...t, [org]: t[org].filter((x) => x.id !== id) }));
  const markTyped = (id) => setThreads((t) => ({ ...t, [activeOrg]: t[activeOrg].map((m) => (m.id === id ? { ...m, typed: true } : m)) }));

  /* ---------- merged nodes ---------- */
  const mergeLive = (arr) => arr.map((n) => {
    const s = ns[n.id] || {};
    let dur = s.dur, cost = s.cost;
    if (s.status === "running" && s.startTs) {
      const sec = (now - s.startTs) / 1000;
      dur = sec.toFixed(1) + "s";
      cost = (sec * 0.045).toFixed(2);
    }
    return { ...n, ...s, dur, cost };
  });
  const nodes = mergeLive(STATIC);
  const tuhuNodes = mergeLive(TUHU_STATIC);

  /* ---------- edges ---------- */
  const edges = React.useMemo(() => {
    let E = [];
    if (activeOrg === "tuhu") {
      E = [
        { from: "tuhu-co", to: "tuhu-cond", kind: "down" },
        { from: "tuhu-cond", to: "t-market", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-entry", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-legal", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-ops", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-risk", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-brand", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-finance", kind: "dispatch", type: "dispatch" },
        { from: "tuhu-cond", to: "t-synth", kind: "dispatch", type: "dispatch" },
        { from: "t-market", to: "t-entry", kind: "flow-h" },
        { from: "t-entry", to: "t-legal", kind: "flow-h" },
        { from: "t-entry", to: "t-ops", kind: "flow-h" },
        { from: "t-entry", to: "t-risk", kind: "flow-h" },
        { from: "t-entry", to: "t-brand", kind: "flow-h" },
        { from: "t-legal", to: "t-finance", kind: "flow-h" },
        { from: "t-ops", to: "t-finance", kind: "flow-h" },
        { from: "t-risk", to: "t-finance", kind: "flow-h" },
        { from: "t-brand", to: "t-finance", kind: "flow-h" },
        { from: "t-finance", to: "t-synth", kind: "down" },
      ];
      if (tMode === "reroute") {
        E.push({ from: "tuhu-cond", to: "t-mna", kind: "dispatch", type: "dispatch" });
        E.push({ from: "t-entry", to: "t-mna", kind: "flow-h", label: "收购 / 合资" });
        E.push({ from: "t-mna", to: "t-finance", kind: "flow-h" });
      }
      return E.map((e) => ({ ...e, id: `${e.from}>${e.to}`, active: activeKey === `${e.from}>${e.to}` }));
    }
    if (primaryMode === "distill") {
      E = [
        { from: "co", to: "conductor", kind: "down" },
        { from: "conductor", to: "d-fin", kind: "dispatch", type: "dispatch" },
        { from: "conductor", to: "d-prod", kind: "dispatch", type: "dispatch" },
        { from: "conductor", to: "d-legal", kind: "dispatch", type: "dispatch" },
        { from: "d-fin", to: "kgraph", kind: "down" },
        { from: "d-prod", to: "kgraph", kind: "down" },
        { from: "d-legal", to: "kgraph", kind: "down" },
      ];
      return E.map((e) => ({ ...e, id: `${e.from}>${e.to}`, active: activeKey === `${e.from}>${e.to}` }));
    }
    E = [
      { from: "co", to: "conductor", kind: "down" },
      { from: "conductor", to: "collector", kind: "dispatch", type: "dispatch" },
      { from: "conductor", to: "market", kind: "dispatch", type: "dispatch" },
      { from: "conductor", to: "comp", kind: "dispatch", type: "dispatch" },
      { from: "conductor", to: "report", kind: "dispatch", type: "dispatch" },
      { from: "collector", to: "market", kind: "flow-h" },
    ];
    if (flowMode === "conditional") {
      E.push({ from: "conductor", to: "alert", kind: "dispatch", type: "dispatch" });
      E.push({ from: "market", to: "comp", kind: "flow-h", label: "样本 ≥ 50" });
      E.push({ from: "market", to: "alert", kind: "flow-h", label: "样本 < 50", dashed: true });
      E.push({ from: "alert", to: "report", kind: "flow-h" });
      E.push({ from: "comp", to: "report", kind: "flow-h" });
    } else {
      E.push({ from: "market", to: "comp", kind: "flow-h" });
      E.push({ from: "comp", to: "report", kind: "flow-h" });
    }
    return E.map((e) => ({ ...e, id: `${e.from}>${e.to}`, active: activeKey === `${e.from}>${e.to}` }));
  }, [flowMode, activeKey, primaryMode, activeOrg, tMode]);

  /* ============================================================
     途虎 flagship orchestration (默认头牌场景)
     ============================================================ */
  const pushT = (m) => pushTo("tuhu", m);
  async function tuhuRunNode(id, edge, task, result, cost, ms) {
    setActiveKey(edge);
    setNS(id, { status: "running", badge: null, task, startTs: Date.now(), progress: 84 });
    await sleep(ms || 1600);
    setNS(id, { status: "succeeded", task: null, result, dur: ((ms || 1600) / 1000).toFixed(1) + "s", cost, progress: 100 });
    setActiveKey(null);
  }

  async function tuhuCreate() {
    setBusy(true); setStatus("正在组建尽调军团…"); setSuggestions([]);
    const tid = mid();
    setThreads((t) => ({ ...t, tuhu: [...t.tuhu, { id: tid, role: "bot", kind: "thinking", steps: TUHU.flow.thinking }] }));
    await sleep(3400);
    removeMsg("tuhu", tid);
    setTEmpty(false); setTEntered(true);
    await sleep(60);
    pushT({ role: "bot", text: TUHU.flow.builtMsg });
    await sleep(520);
    pushT({ role: "bot", kind: "team", data: { agents: TUHU.agents.filter((a) => !a.conditional).map((a) => ({ name: a.name, emoji: a.emoji, role: a.role, model: a.model.split("·")[1].trim(), mbti: a.mbti.code })) } });
    await sleep(460);
    pushT({ role: "bot", text: TUHU.flow.afterTeamMsg });
    setSuggestions(TUHU.flow.suggestionsReady);
    setStatus("组织已就绪");
    finishBusy();
  }

  async function tuhuRun() {
    setBusy(true); setStatus("尽调进行中…"); setSuggestions([]);
    pushT({ role: "bot", text: TUHU.flow.runIntro });
    await sleep(700);
    await tuhuRunNode("t-market", "tuhu-cond>t-market", "Sizing US DIFM market · scanning Valvoline / Take 5 / AutoZone…", "US market mapped → us-market-landscape.md", "0.12", 1800);
    await sleep(320);
    // entry → awaits the chairman's call (drama)
    setActiveKey("t-market>t-entry");
    setNS("t-entry", { status: "running", task: "Scoring Build / Buy / JV / Franchise…", startTs: Date.now(), progress: 82 });
    await sleep(1900);
    setNS("t-entry", { status: "awaits", badge: "?", task: null, result: "Greenfield viable but capital- & time-heavy", dur: "1.9s", cost: "0.18", progress: 100 });
    setActiveKey(null);
    await sleep(480);
    const aq = TUHU.flow.askQuestion;
    pushT({ role: "bot", kind: "question", from: aq.from, id: mid(), text: aq.text, ctx: aq.ctx, quick: aq.quick });
    setStatus("等待董事长决策"); setBusy(false);
  }

  async function tuhuAnswer(q) {
    pushT({ role: "user", text: q.label });
    setBusy(true); setStatus("尽调进行中…");
    await sleep(500);
    pushT({ role: "bot", text: TUHU.flow.acks[q.value] || TUHU.flow.acks.acquire });
    const acquire = q.value === "acquire";
    setNS("t-entry", { status: "succeeded", badge: null, task: null,
      result: q.value === "greenfield" ? "Greenfield · single-metro pilot" : q.value === "franchise" ? "Franchise-light path" : "Acquire + JV path" });
    if (acquire) { setTMode("reroute"); setNS("t-mna", { hidden: false, status: "idle" }); }
    await sleep(520);
    if (acquire) {
      await tuhuRunNode("t-mna", "t-entry>t-mna", "Screening regional chains · structuring stake + JV…", "2 targets shortlisted → mna-jv-structuring.md", "0.16", 1700);
      await sleep(340);
    }
    // parallel multi-stream diligence
    const dil = [
      { id: "t-legal", task: "Mapping 50-state licensing · labor · data law…", result: "Compliance matrix → compliance-matrix.md", cost: "0.15" },
      { id: "t-ops", task: "Store conversion · supply chain · talent…", result: "Ops plan → localized-ops-plan.md", cost: "0.12" },
      { id: "t-risk", task: "War-gaming tariffs · macro · response…", result: "Scenario matrix → risk-scenarios.md", cost: "0.14" },
      { id: "t-brand", task: "Positioning · pricing · CAC…", result: "GTM plan → brand-gtm.md", cost: "0.11" },
    ];
    for (const d of dil) { setActiveKey("t-entry>" + d.id); setNS(d.id, { status: "running", task: d.task, startTs: Date.now(), progress: 83 }); }
    await sleep(2300);
    for (const d of dil) { setNS(d.id, { status: "succeeded", task: null, result: d.result, dur: "2.3s", cost: d.cost, progress: 100 }); }
    setActiveKey(null);
    await sleep(460);
    await tuhuRunNode("t-finance", "t-legal>t-finance", "Allocating $10M across 3 years · building return model…", "$10M plan + returns → capital-plan-returns.md", "0.17", 1900);
    await sleep(340);
    await tuhuRunNode("t-synth", "t-finance>t-synth", "Synthesizing 8 streams into a board memo…", "Board memo delivered → Board-Strategy-Memo.html", "0.13", 1800);
    await sleep(480);
    pushT({ role: "bot", text: TUHU.flow.finalMsg });
    await sleep(320);
    pushT({ role: "bot", kind: "deliverable", items: TUHU.flow.deliverableItems });
    await sleep(360);
    pushT({ role: "bot", text: TUHU.flow.closingMsg });
    setTDone(true);
    setStatus("目标完成 · 组织空闲");
    setSuggestions(TUHU.flow.closingSuggestions);
    finishBusy();
  }

  function handleTuhu(text, action, files) {
    if (action === "create" && tEmpty) { pushT({ role: "user", text, files }); tuhuCreate(); return; }
    pushT({ role: "user", text, files });
    if (action === "run") { tuhuRun(); return; }
    if (action === "openBudget") { setView("costs"); setTimeout(() => pushT({ role: "bot", text: "已切到「预算」页 👈 上面是 $10M 三年的资本部署，下面是这套 AI 打法 vs 传统战略咨询的成本/时间对比。" }), 320); return; }
    if (action === "chatFinance") { openAgentChat("t-finance"); return; }
    tuhuGenericAck();
  }

  async function tuhuGenericAck() {
    setBusy(true);
    await sleep(520);
    pushT({ role: "bot", text: tEmpty
      ? "把目标交给我就行——点下面的「组建尽调组织」，或直接说「研究怎么打开美国市场」。"
      : "收到，记进共享记忆了。您可以让我追问某个节点的产出、改路线，或直接说「启动」让组织开跑。" });
    finishBusy();
  }

  /* ---------- flows ---------- */
  async function runCreate(fileNote) {
    setBusy(true); setStatus("正在组建组织…"); setSuggestions([]);
    if (fileNote) push({ role: "bot", text: `先读了你上传的「${fileNote}」，作为目标背景。`, typed: true });
    const tid = mid();
    setThreads((t) => ({ ...t, primary: [...t.primary, { id: tid, role: "bot", kind: "thinking", steps: [
      "拆解目标：三城市 × 产品经理 × 薪酬分位",
      "检索现有花名册 … 无可复用 Agent，需新招",
      "设计流程：采集 → 市场分析 → 薪酬分析 → 报告",
      "招聘 4 名 Agent，每个绑定一次模型调用（Opus 4.8 / GPT 5.5 等）",
    ] }] }));
    await sleep(3100);
    removeMsg("primary", tid);
    setSceneEmpty(false); setPrimaryMode("salary"); setEntered(true);
    await sleep(60);
    push({ role: "bot", text: "组织画好了 👈 我把目标拆成一条流水线：<b>数据采集 → 市场分析 → 薪酬分析 → 报告生成</b>。我自动推断了它们之间的数据流，画在左边画布上了。" });
    await sleep(500);
    push({ role: "bot", kind: "team", data: { agents: AGENTS.filter((a) => !a.conditional).map((a) => ({ name: a.name, emoji: a.emoji, role: a.role, model: a.model.split("·")[1].trim(), mbti: a.mbti.code })) } });
    await sleep(400);
    push({ role: "bot", text: "每个节点点开能看到它的 Soul（角色性格）、技能，以及它<b>对外的交付产物</b>。三重记忆和领域知识在后台读写、不在前端展开。要现在就启动吗？或者先给我加条件，比如「市场太小就别跑完整模型」。" });
    setSuggestions([
      { label: "市场太小就只出预警，别跑完整模型", text: "如果市场规模太小，就直接生成预警报告，不要跑完整模型", icon: "🔀", action: "reroute" },
      { label: "启动组织 ▶", text: "启动组织，开始干活", icon: "▶", primary: true, action: "run" },
    ]);
    setStatus("组织已就绪");
    finishBusy();
  }

  /* ---------- local-folder authorization → 分领域知识蒸馏 ---------- */
  async function runAuthorize(path) {
    setGrantedPath(path);
    setBusy(true); setStatus("正在蒸馏本机资料…"); setSuggestions([]);
    push({ role: "user", text: `授权本机路径：${path}`, files: [{ name: path, icon: "📁" }] });
    await sleep(500);
    push({ role: "bot", text: `已拿到 <b>${path}</b> 的只读权限。我先扫一遍，按领域把资料分派给不同的蒸馏 Agent——它们会把你的非结构化资料蒸馏成<b>结构化知识图谱</b>，作为整个组织的共享背景知识。` });
    const tid = mid();
    setThreads((t) => ({ ...t, primary: [...t.primary, { id: tid, role: "bot", kind: "thinking", steps: [
      "扫描目录 … 识别 106 份文件",
      "按领域聚类：财务 / 产品 / 法务 三类",
      "为每个领域招聘一名蒸馏 Agent（不同领域分给不同 Agent）",
      "规划汇聚：三份领域知识 → 合并去重 → 结构化知识图谱",
    ] }] }));
    await sleep(3000);
    removeMsg("primary", tid);
    setSceneEmpty(false); setPrimaryMode("distill"); setEntered(true);
    setNs((s) => { const o = { ...s }; for (const id of DISTILL_IDS) o[id] = { ...o[id], hidden: false, status: "idle" }; return o; });
    await sleep(80);
    push({ role: "bot", text: "组织画好了 👈 三名蒸馏师各管一个领域，并行开工，最后汇聚成一张图谱。" });
    await sleep(400);
    push({ role: "bot", kind: "team", data: { agents: DISTILLERS.map((a) => ({ name: a.name, emoji: a.emoji, role: a.role, model: a.model.split("·")[1].trim(), mbti: a.mbti.code })) } });
    await sleep(450);

    // run three distillers in parallel-ish
    const meta = {
      "d-fin": { task: "解析发票 / 报表 / 合同金额…", result: "48 份财务文档 → 财务领域知识.md", cost: "0.22" },
      "d-prod": { task: "挖掘 PRD / 纪要里的决策…", result: "31 份产品文档 → 产品领域知识.md", cost: "0.16" },
      "d-legal": { task: "抽取条款 / 期限 / 风险点…", result: "27 份合同 → 法务领域知识.md", cost: "0.19" },
    };
    for (const id of ["d-fin", "d-prod", "d-legal"]) {
      setActiveKey(`conductor>${id}`);
      setNS(id, { status: "running", task: meta[id].task, startTs: Date.now(), progress: 84 });
    }
    await sleep(2100);
    for (const id of ["d-fin", "d-prod", "d-legal"]) {
      setNS(id, { status: "succeeded", task: null, result: meta[id].result, dur: "2.1s", cost: meta[id].cost, progress: 100 });
    }
    setActiveKey(null);
    await sleep(400);

    // converge into knowledge graph
    for (const id of ["d-fin", "d-prod", "d-legal"]) setActiveKey(`${id}>kgraph`);
    setActiveKey("d-prod>kgraph");
    setNS("kgraph", { status: "running", task: "合并 · 对齐 · 去重…", startTs: Date.now() });
    await sleep(1500);
    setNS("kgraph", { status: "succeeded", task: null, result: "403 实体 · 1.2k 关系边", dur: "1.5s", cost: "0.07" });
    setActiveKey(null);
    await sleep(450);
    push({ role: "bot", text: "蒸馏完成 ✅ 三个领域汇聚成一张<b>结构化知识图谱</b>，点画布上的 🕸️ 节点能看友好视图。这张图谱不会显式展示在每次对话里，但每个 Agent 干活时都会自动调用它。" });
    await sleep(300);
    push({ role: "bot", kind: "deliverable", items: [
      { name: "结构化知识图谱.html", kind: "view", nodeId: "kgraph" },
      { name: "knowledge-graph.md", kind: "data" },
    ] });
    await sleep(350);
    push({ role: "bot", text: "想验证某位蒸馏师学到了什么？点开它，用<b>一对一单聊</b>向它取信息——单聊只用于问，派活还是回来找我。接下来要在这套知识上建个分析组织吗？" });
    setSuggestions([{ label: "创建薪酬分析组织 ▶", text: "帮我创建一个薪酬分析组织，对比北京、上海、深圳三个城市的产品经理薪酬", icon: "🎯", primary: true, action: "create" }]);
    setStatus("知识图谱已就绪");
    finishBusy();
  }

  async function runReroute() {
    setBusy(true); setStatus("调整流程…"); setSuggestions([]);
    await sleep(700);
    push({ role: "bot", text: "明白。我加了一个<b>条件分支</b>：市场分析跑完后，如果样本量充足（≥50）就走<b>薪酬分析师</b>跑完整模型；如果市场太小（<50）就直接让<b>预警撰写</b>出一页风险预警，跳过重活。我把<b>预警撰写</b>招进来并重连了画布。" });
    setFlowMode("conditional");
    setNS("alert", { hidden: false, status: "idle" });
    setEntered(true);
    await sleep(500);
    push({ role: "bot", text: "流程更稳了。准备好就启动吧。" });
    setSuggestions([{ label: "启动组织 ▶", text: "启动组织，开始干活", icon: "▶", primary: true, action: "run" }]);
    setStatus("组织已就绪");
    finishBusy();
  }

  async function runStart() {
    setBusy(true); setStatus("组织运行中…"); setSuggestions([]);
    push({ role: "bot", text: "开跑。我会盯着每个节点，出问题就回退来找你。" });
    await sleep(700);

    // collector running -> fail
    setActiveKey("conductor>collector");
    setNS("collector", { status: "running", task: "登录猎聘列表页抓取…", startTs: Date.now(), progress: 70 });
    await sleep(1900);
    setNS("collector", { status: "failed", badge: "!", task: "猎聘列表页需登录，被风控拦截", dur: "1.9s", cost: "0.08", progress: 100 });
    setActiveKey(null);
    await sleep(500);
    push({
      role: "bot", kind: "question", from: "数据采集员", id: mid(),
      text: "猎聘的岗位<b>列表页需要登录</b>，直接抓会触发风控。我可以换成「职友集」的公开详情页（无需登录、可复核），但字段会少一个『股权』。<b>你希望我怎么办？</b>",
      ctx: "目标：薪酬采集 · 已失败 1 次 · 已等待你的决定",
      quick: [
        { label: "换公开数据源（职友集）", value: "public" },
        { label: "我来授权登录猎聘", value: "auth" },
        { label: "先跳过股权字段", value: "skip" },
      ],
    });
    setStatus("等待你的决定"); setBusy(false);
  }

  async function answerQuestion(q) {
    push({ role: "user", text: q.label });
    setBusy(true); setStatus("组织运行中…");
    await sleep(500);
    const ack = q.value === "auth"
      ? "好，那等你授权。这次我先用公开源把流程跑通，授权后下轮自动切回。"
      : q.value === "skip"
      ? "收到，本轮先不要股权字段，其余照常。"
      : "好，换职友集公开源，可复核更稳。我让数据采集员重试。";
    push({ role: "bot", text: ack });
    await sleep(500);

    // collector retry -> success
    setActiveKey("conductor>collector");
    setNS("collector", { status: "running", badge: null, task: "切换职友集公开页重新采集…", startTs: Date.now(), progress: 80, dur: undefined, cost: undefined });
    await sleep(1500);
    setNS("collector", { status: "succeeded", task: null, result: "采集 412 条 → 原始薪酬数据.csv", dur: "1.5s", cost: "0.06", progress: 100 });
    await sleep(350);

    // market
    setActiveKey("collector>market");
    setNS("market", { status: "running", task: "估算样本量与市场规模…", startTs: Date.now(), progress: 85 });
    await sleep(1500);
    setNS("market", { status: "succeeded", task: null, result: "样本 412，三城市均充足 → 市场规模评估.md", dur: "1.5s", cost: "0.05", progress: 100 });
    if (flowMode === "conditional") {
      push({ role: "bot", text: "市场分析跑完：<b>样本 412，市场规模充足</b>，满足条件分支的「≥50」。走<b>薪酬分析师</b>完整模型，跳过预警。" });
      setNS("alert", { result: "未触发 · 市场充足" });
    }
    await sleep(450);

    // comp
    setActiveKey("market>comp");
    setNS("comp", { status: "running", task: "计算 P25 / P50 / P75 + 总包拆解…", startTs: Date.now(), progress: 88 });
    await sleep(1700);
    setNS("comp", { status: "succeeded", task: null, result: "三城市分位已算 → 薪酬分析结果.md", dur: "1.7s", cost: "0.14", progress: 100 });
    await sleep(400);

    // report
    setActiveKey("comp>report");
    setNS("report", { status: "running", task: "渲染 .html 展示 + 存档 .md…", startTs: Date.now(), progress: 90 });
    await sleep(1700);
    setNS("report", { status: "succeeded", task: null, result: "已交付 展示.html + 结果.md", dur: "1.7s", cost: "0.09", progress: 100 });
    setActiveKey(null);
    await sleep(450);

    push({ role: "bot", text: "全部跑完 ✅ 三城市产品经理薪酬对比已生成。给你看可交互的展示，结构化结果我也存档了。" });
    await sleep(300);
    push({ role: "bot", kind: "deliverable", items: [
      { name: "薪酬分析展示.html", kind: "view", nodeId: "report" },
      { name: "薪酬分析结果.md", kind: "data" },
    ] });
    await sleep(350);
    push({ role: "bot", text: "顺手记了一条知识：<b>数据采集员</b> 学到「猎聘列表页需登录、职友集公开页可复核」，已写进后台记忆（不在前端展开），下次同类任务会直接避开这个坑。" });
    setStatus("目标完成 · 组织空闲");
    setSuggestions([
      { label: "与数据采集员单聊，问问数据怎么来的", text: "与数据采集员单聊", icon: "💬", action: "chatCollector" },
      { label: "再开一个目标", text: "我想再开一个新目标", icon: "➕", action: "noop" },
    ]);
    finishBusy();
  }

  function finishBusy() {
    setBusy(false);
    setQueue((qs) => {
      if (qs.length) {
        setTimeout(() => {
          pushTo(activeOrg, { role: "bot", text: `对了，刚才你忙碌时发的「${qs[0]}」我也收到了，记在共享记忆里了，需要的话随时说。` });
        }, 600);
      }
      return [];
    });
  }

  /* ---------- input routing ---------- */
  function attachNote(files) {
    if (!files || !files.length) return "";
    return files.map((f) => f.name).join("、");
  }

  function handleSend(text, suggestion, files) {
    // sample orgs: lightweight conversational ack only
    if (!isLive(activeOrg)) {
      pushTo(activeOrg, { role: "user", text, files });
      const org = activeOrg;
      setTimeout(() => pushTo(org, { role: "bot", text: files && files.length
        ? `读到了你上传的「${attachNote(files)}」。这家公司是只读示例，切回你正在创建的组织即可让我开工。`
        : "这家是示例组织（只读）。要真正干活，用左上角切换器回到你自己的组织吧。" }), 500);
      return;
    }
    if (busyRef.current) {
      pushTo(activeOrg, { role: "user", text, queued: true, files });
      setQueue((q) => [...q, text]);
      return;
    }
    const action = suggestion?.action || detect(text);
    if (activeOrg === "tuhu") { handleTuhu(text, action, files); return; }
    const fileNote = attachNote(files);
    if (action === "authorize") { setAuthOpen(true); return; }
    if (action === "chatCollector") { openAgentChat("collector"); return; }
    if (action === "create" && sceneEmpty) {
      push({ role: "user", text, files });
      runCreate(fileNote);
      return;
    }
    push({ role: "user", text, files });
    if (action === "reroute" && flowMode !== "conditional") { runReroute(); return; }
    if (action === "run") { runStart(); return; }
    if (action === "noop") { genericAck(); return; }
    if (action === "create") { runCreate(fileNote); return; }
    if (action === "reroute") { runReroute(); return; }
    genericAck(fileNote);
  }

  function detect(t) {
    const s = (t || "").toLowerCase();
    if (sceneEmpty && /授权|本机|文件夹|目录|资料|知识图谱|蒸馏/.test(s)) return "authorize";
    if (sceneEmpty && /薪酬|组织|创建|分析|对比|城市/.test(s)) return "create";
    if (/预警|市场太小|条件|分支|样本/.test(s)) return "reroute";
    if (/启动|开始|跑|run|执行/.test(s)) return "run";
    return "chat";
  }

  async function genericAck(fileNote) {
    setBusy(true);
    await sleep(550);
    push({ role: "bot", text: fileNote
      ? `读到了你上传的「${fileNote}」，我把它存进了共享记忆。需要我据此调整流程，还是直接启动？`
      : "收到，我记在共享记忆里了。你可以让我调整流程、追问某个节点的产出，或者直接说「启动」让组织开跑。" });
    finishBusy();
  }

  /* ---------- one-on-one agent chat (info only) ---------- */
  function openAgentChat(id) {
    const node = byId[id];
    if (!node) return;
    setSelectedId(null);
    setAgentChatId(id);
    setAgentThreads((t) => {
      if (t[id]) return t;
      const intro = (node.oneOnOne && node.oneOnOne.intro) || `我是${node.name}，可以向我了解我这块领域的信息。派活请找指挥官。`;
      return { ...t, [id]: [{ id: mid(), role: "bot", text: intro, typed: true }] };
    });
  }

  function sendAgentMsg(id, text) {
    const node = byId[id];
    const pushA = (m) => setAgentThreads((t) => ({ ...t, [id]: [...(t[id] || []), { id: mid(), ...m }] }));
    pushA({ role: "user", text });
    const isTask = /帮我|去做|执行|启动|跑一下|派|安排|生成|重做|改一下|下一步/.test(text);
    setTimeout(() => {
      if (isTask) {
        pushA({ role: "bot", text: `这是<b>一对一单聊</b>，只用于向我获取信息——派活、改流程请回到<b>指挥官</b>的对话框。不过关于「${text}」，我可以先告诉你我已知的部分。` });
        return;
      }
      const faqs = (node.oneOnOne && node.oneOnOne.faqs) || [];
      const hit = faqs.find((f) => {
        const key = f.q.replace(/[？?。，、]/g, "").slice(0, 4);
        return text.includes(key) || f.q.includes(text.slice(0, 4));
      });
      pushA({ role: "bot", text: hit ? hit.a : `就「${text}」，我在「${node.domain || node.role}」这块的结论是确定的，但更细的口径要看上下文。你也可以点下面的常见问题快速取信息。` });
    }, 480);
  }
  const agentChatNode = agentChatId ? byId[agentChatId] : null;

  function openDeliverable(item) {
    // item may carry nodeId, or be a node directly
    const node = item && item.nodeId ? byId[item.nodeId] : (item && item.kind && item.deliverable ? item : null);
    const d = node ? node.deliverable : (item && item.deliverable) || null;
    if (d) setDeliverable({ ...d, agentName: node ? node.name : d.kicker });
  }

  function newOrg() {
    // reset primary to a fresh empty org
    setActiveOrg("primary"); setView("canvas"); setSelectedId(null); setOrgMenuOpen(false);
    setSceneEmpty(true); setPrimaryMode("none"); setEntered(false); setFlowMode("serial"); setActiveKey(null);
    setAgentChatId(null); setDeliverable(null); setGrantedPath(null);
    setNs(initNs());
    setThreads((t) => ({ ...t, primary: [{ id: mid(), role: "bot", text: GREET_PRIMARY, typed: false }] }));
    setSuggestions([
      { label: "授权本机资料 · 先蒸馏成知识图谱", text: "我先授权一个本机文件夹，让你把里面的资料蒸馏成知识图谱", icon: "📂", primary: true, action: "authorize" },
      { label: "创建薪酬分析组织 · 对比三城市产品经理薪酬", text: "帮我创建一个薪酬分析组织，对比北京、上海、深圳三个城市的产品经理薪酬", icon: "🎯", action: "create" },
    ]);
    setStatus("空闲 · 随时可聊"); setBusy(false);
  }

  function switchOrg(id) {
    setActiveOrg(id); setView("canvas"); setSelectedId(null); setOrgMenuOpen(false); setAgentChatId(null);
    if (busyRef.current) return;
    if (id === "tuhu") { setSuggestions(tEmpty ? TUHU.flow.suggestionsInit : tDone ? TUHU.flow.closingSuggestions : []); setStatus(tDone ? "目标完成 · 组织空闲" : "空闲 · 随时可聊"); }
    else if (id === "primary") { setSuggestions(sceneEmpty ? SALARY_INIT_SUGG : []); setStatus("空闲 · 随时可聊"); }
    else { setSuggestions([]); setStatus("只读示例组织"); }
  }

  /* ---------- active-org data ---------- */
  const primaryCreated = !sceneEmpty;
  const orgListItems = [
    { id: "tuhu", name: TUHU.company.name, emoji: TUHU.company.emoji, created: !tEmpty },
    { id: "primary", name: primaryCreated ? CO.name : "薪酬研究室", emoji: CO.emoji, created: primaryCreated },
    { id: "org-growth", name: ORGS.growth.name, emoji: ORGS.growth.emoji, created: true },
    { id: "org-content", name: ORGS.content.name, emoji: ORGS.content.emoji, created: true },
  ];

  let canvasNodes, canvasEdges, canvasEmpty, agentNodes, activeCompany;
  if (activeOrg === "tuhu") {
    const tn = tuhuNodes;
    canvasNodes = showIdle ? tn : tn.map((n) => (n.kind === "agent" && n.status === "idle" ? { ...n, hidden: true } : n));
    canvasEdges = edges;
    canvasEmpty = tEmpty;
    agentNodes = tn.filter((n) => n.kind === "agent" && !n.hidden);
    activeCompany = { ...TUHU.company, created: !tEmpty };
  } else if (activeOrg === "primary") {
    const offMode = (n) => (primaryMode === "distill" ? SALARY_IDS.includes(n.id) : DISTILL_IDS.includes(n.id));
    const masked = nodes.map((n) => (offMode(n) ? { ...n, hidden: true } : n));
    canvasNodes = showIdle ? masked : masked.map((n) => (n.kind === "agent" && n.status === "idle" ? { ...n, hidden: true } : n));
    canvasEdges = edges;
    canvasEmpty = sceneEmpty;
    agentNodes = masked.filter((n) => (n.kind === "agent" || n.kind === "artifact") && !n.hidden);
    activeCompany = { ...CO, created: primaryCreated };
  } else {
    const o = activeOrg === "org-growth" ? ORGS.growth : ORGS.content;
    canvasNodes = o.nodes;
    canvasEdges = o.edges.map((e) => ({ ...e, active: e.from === o.id + "-cond" ? false : false }));
    canvasEmpty = false;
    agentNodes = o.nodes.filter((n) => n.kind === "agent");
    activeCompany = { ...o, created: true };
  }

  /* ---------- visible nodes (showIdle tweak) ---------- */
  const selectedNode = selectedId ? canvasNodes.find((n) => n.id === selectedId) : null;
  const inboxCount = canvasNodes.filter((n) => n.status === "failed" || n.status === "awaits").length;
  const showCompanyChip = activeOrg !== "primary" || primaryCreated;
  const viewTitle = { canvas: "组织画布", roster: "人力", costs: "预算 · 监控" }[view];

  return (
    <div className="app">
      {/* far-left tool rail */}
      <nav className="rail">
        <div className="rail-logo">◆</div>
        <button className={`rail-btn ${view === "canvas" ? "active" : ""}`} onClick={() => setView("canvas")} title="组织画布">
          <span className="ri"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M12 7.4v4M12 11.4l-6 4.2M12 11.4l6 4.2"/></svg></span>
          <span className="rl">组织</span>
        </button>
        <button className={`rail-btn ${view === "roster" ? "active" : ""}`} onClick={() => setView("roster")} title="人力 · Agent 资源">
          <span className="ri"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="7" r="1.3"/><circle cx="6" cy="12.5" r="1.3"/><circle cx="6" cy="18" r="1.3"/><path d="M10.5 7h8M10.5 12.5h8M10.5 18h8"/></svg></span>
          <span className="rl">人力</span>
        </button>
        <button className={`rail-btn ${view === "costs" ? "active" : ""}`} onClick={() => setView("costs")} title="预算与监控">
          <span className="ri"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16"/><rect x="6" y="11" width="3" height="6" rx="1"/><rect x="11" y="7" width="3" height="10" rx="1"/><rect x="16" y="13" width="3" height="4" rx="1"/></svg></span>
          <span className="rl">预算</span>
        </button>
        <div className="rail-spacer" />
        <button className="rail-btn" onClick={() => setSettingsOpen((v) => !v)} title="显示选项">
          <span className="ri"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
          <span className="rl">设置</span>
        </button>
      </nav>

      {/* main column */}
      <div className="main">
        <header className="topbar">
          <div className="tb-left">
            <img src="assets/logo.png" className="tb-logo" alt="SoloCo" />
            {showCompanyChip && <span className="tb-div" />}
            {showCompanyChip ? (
              <div className="org-wrap">
                <button className={`company-switch ${orgMenuOpen ? "open" : ""}`} onClick={() => setOrgMenuOpen((v) => !v)}>
                  <span className="cs-emoji">{activeCompany.emoji}</span>
                  <span className="cs-name">{activeCompany.name}</span>
                  <span className="cs-caret">⌄</span>
                </button>
                {orgMenuOpen && (
                  <div className="org-menu" onMouseLeave={() => setOrgMenuOpen(false)}>
                    <div className="om-label mono">切换组织</div>
                    {orgListItems.map((o) => (
                      <button key={o.id} className={`om-item ${activeOrg === o.id ? "on" : ""}`} onClick={() => switchOrg(o.id)}>
                        <span className="om-emoji">{o.emoji}</span>
                        <span className="om-name">{o.name}{!o.created && <span className="om-tag mono">未创建</span>}</span>
                        {activeOrg === o.id && <span className="om-check">✓</span>}
                      </button>
                    ))}
                    <div className="om-sep" />
                    <button className="om-new" onClick={newOrg}><span className="om-plus">＋</span> 新建组织</button>
                  </div>
                )}
              </div>
            ) : (
              <span className="tb-newhint mono">新组织 · 待创建</span>
            )}
            <span className="tb-crumb mono">{viewTitle}</span>
          </div>
          <div className="tb-right">
            <button className="tb-icon" title="收件箱">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
              {inboxCount > 0 && <span className="tb-badge mono">{inboxCount}</span>}
            </button>
            <div className="settings-wrap">
              <button className="tb-icon" onClick={() => setSettingsOpen((v) => !v)} title="显示选项">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              </button>
              {settingsOpen && (
                <div className="settings-pop" onMouseLeave={() => setSettingsOpen(false)}>
                  <div className="sp-title mono">显示选项</div>
                  <div className="sp-row">
                    <span>主题</span>
                    <div className="seg">
                      <button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>亮</button>
                      <button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>暗</button>
                    </div>
                  </div>
                  <div className="sp-row">
                    <span>显示 idle 员工</span>
                    <button className={`toggle ${showIdle ? "on" : ""}`} onClick={() => setShowIdle((v) => !v)}><i /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="workspace">
          {view === "canvas" && (
            <OrgCanvas
              nodes={canvasNodes}
              edges={canvasEdges}
              selectedId={selectedId}
              onSelectNode={setSelectedId}
              entered={activeOrg === "tuhu" ? tEntered : entered}
              sceneEmpty={canvasEmpty}
              fitKey={`${activeOrg}:${primaryMode}:${tMode}`}
            />
          )}
          {view === "roster" && <RosterView agents={agentNodes} onSelect={setSelectedId} />}
          {view === "costs" && <CostsView agents={agentNodes} companyName={activeCompany.name} capitalPlan={activeOrg === "tuhu" ? TUHU.capitalPlan : null} />}
          <ConductorChat
            messages={messages}
            busy={busy && isLive(activeOrg)}
            status={status}
            suggestions={isLive(activeOrg) ? suggestions : []}
            queueCount={queue.length}
            width={460}
            model={convModel}
            onModel={setConvModel}
            onSend={handleSend}
            onQuick={(q) => (activeOrg === "tuhu" ? tuhuAnswer(q) : answerQuestion(q))}
            onOpen={openDeliverable}
            onAuthorize={() => setAuthOpen(true)}
            grantedPath={grantedPath}
            onDone={markTyped}
          />
          {selectedNode && (
            <NodeDetail
              node={selectedNode}
              onClose={() => setSelectedId(null)}
              onPreview={openDeliverable}
              onChat={openAgentChat}
            />
          )}
          {agentChatNode && (
            <AgentChat
              node={agentChatNode}
              messages={agentThreads[agentChatId] || []}
              onSend={(t) => sendAgentMsg(agentChatId, t)}
              onClose={() => setAgentChatId(null)}
              onBackToConductor={() => setAgentChatId(null)}
            />
          )}
        </div>
      </div>

      {authOpen && <AuthorizeDialog onClose={() => setAuthOpen(false)} onGrant={(p) => { setAuthOpen(false); runAuthorize(p); }} />}
      <DeliverableModal deliverable={deliverable} onClose={() => setDeliverable(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
