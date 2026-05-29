/* ============================================================
   Soloco · Roster (花名册) + Costs (费用/监控) views
   ============================================================ */

function estSpend(node) {
  if (node.cost && parseFloat(node.cost) > 0) return parseFloat(node.cost);
  const m = (node.model || "").toLowerCase();
  const base = m.includes("opus") ? 0.21 : m.includes("gpt") ? 0.16 : m.includes("sonnet") ? 0.12 : 0.05;
  const factor = node.status === "running" ? 0.5 : node.status === "idle" ? 0.0 : 1;
  // idle agents still have a little historical spend so the view isn't empty
  return +(base * (factor || 0.6)).toFixed(2);
}

function modelKey(model) {
  const m = (model || "").toLowerCase();
  if (m.includes("gpt")) return "GPT 5.5";
  if (m.includes("opus")) return "Opus 4.8";
  if (m.includes("sonnet")) return "Sonnet 4.5";
  return "Haiku 4";
}
function isGptModel(model) { return /gpt|openai/i.test(model || ""); }

function ViewHeader({ title, sub, count }) {
  return (
    <div className="view-head">
      <div>
        <h2 className="view-title">{title}</h2>
        <p className="view-sub">{sub}</p>
      </div>
      {count != null && <span className="view-count mono">{count}</span>}
    </div>
  );
}

/* ---------- Roster ---------- */
function RosterView({ agents, onSelect }) {
  return (
    <div className="view-pane">
      <div className="view-inner">
        <ViewHeader title="人力" sub="这家公司的全部 AI 员工（Agent 资源），逐一可查" count={`${agents.length} 名`} />
        <div className="roster-grid">
          {agents.map((a) => (
            <button key={a.id} className="roster-card lift press" onClick={() => onSelect(a.id)}>
              <div className="rc-top">
                <span className="rc-avatar">{a.emoji}</span>
                <span className={`rc-status st-chip ${a.status || "idle"}`}>
                  <i className={`lg ${a.status || "idle"}`} />
                  {{ running: "运行中", succeeded: "已完成", failed: "失败", awaits: "等待", idle: "空闲" }[a.status || "idle"]}
                </span>
              </div>
              <div className="rc-name">{a.name}</div>
              <div className="rc-role mono">{a.role}</div>
              <div className="rc-meta">
                <span className="rc-model mono">{isGptModel(a.model) ? <span className="vendor-badge gpt">G</span> : <img src="assets/claude.png" className="rc-claude" alt="" />}{(a.model || "").split("·")[1]?.trim()}</span>
                <span className="rc-mbti mono">{a.mbti?.code}</span>
              </div>
              <div className="rc-skills">
                {(a.skills || []).slice(0, 3).map((s, i) => <span key={i} className="rc-skill mono">{s.replace(/^mcp · /i, "")}</span>)}
                {(a.skills || []).length > 3 && <span className="rc-skill more mono">+{a.skills.length - 3}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Costs / Monitoring ---------- */
function CostsView({ agents, companyName, capitalPlan }) {
  const rows = agents.map((a) => ({ ...a, spend: estSpend(a) }));
  const total = rows.reduce((s, r) => s + r.spend, 0);
  const max = Math.max(0.01, ...rows.map((r) => r.spend));
  const budget = 5;
  const remain = Math.max(0, budget - total);
  const byModel = {};
  for (const r of rows) {
    const k = modelKey(r.model);
    byModel[k] = (byModel[k] || 0) + r.spend;
  }
  const running = rows.filter((r) => r.status === "running").length;
  const cp = capitalPlan;
  const cpMaxY = cp ? Math.max(...cp.years.map((y) => y.v)) : 0;
  const cpMaxF = cp ? Math.max(...cp.funcs.map((f) => f.v)) : 0;

  return (
    <div className="view-pane">
      <div className="view-inner">
        <ViewHeader title="预算 · 监控" sub={`${companyName} 的实时支出与运行情况`} />

        <div className="cost-hero">
          <div className="ch-main">
            <div className="ch-label mono">本轮累计花费（AI 算力）</div>
            <div className="ch-value mono">${total.toFixed(2)}</div>
            <div className="ch-budget">
              <div className="ch-track"><div className="ch-fill" style={{ width: `${Math.min(100, (total / budget) * 100)}%` }} /></div>
              <div className="ch-budget-row mono"><span>算力预算 ${budget.toFixed(2)}</span><span>剩余 ${remain.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="ch-stats">
            <div className="ch-stat"><div className="cs-num mono">{rows.length}</div><div className="cs-lab">在编 Agent</div></div>
            <div className="ch-stat"><div className="cs-num mono" style={{ color: running ? "var(--primary)" : "inherit" }}>{running}</div><div className="cs-lab">正在运行</div></div>
            <div className="ch-stat"><div className="cs-num mono">{Object.keys(byModel).length}</div><div className="cs-lab">使用模型</div></div>
          </div>
        </div>

        {cp && (
          <div className="compare-strip">
            <div className="cmp-col">
              <div className="cmp-tag mono">AI 作战室</div>
              <div className="cmp-big mono">{cp.compare.warroomCost}</div>
              <div className="cmp-sub">算力成本 · {cp.compare.warroomTime}</div>
            </div>
            <div className="cmp-vs mono">vs</div>
            <div className="cmp-col muted">
              <div className="cmp-tag mono">传统战略咨询</div>
              <div className="cmp-big mono">{cp.compare.consultCost}</div>
              <div className="cmp-sub">{cp.compare.consultTime}</div>
            </div>
          </div>
        )}

        {cp && (
          <div className="cost-section">
            <div className="cost-section-h mono">战略资本部署 · ${cp.total}M / 3 年（建议 · 示意）</div>
            <div className="capital-years">
              {cp.years.map((y) => (
                <div className="cap-year" key={y.k}>
                  <div className="cy-top"><span className="cy-k">{y.k}</span><span className="cy-v mono">${y.v}M</span></div>
                  <div className="cy-track"><div className="cy-fill" style={{ width: `${(y.v / cpMaxY) * 100}%` }} /></div>
                  <div className="cy-note mono">{y.note}</div>
                </div>
              ))}
            </div>
            <div className="capital-funcs">
              {cp.funcs.map((f) => (
                <div className="cap-func" key={f.k}>
                  <span className="cf-k">{f.k}</span>
                  <span className="cf-track"><span className="cf-fill" style={{ width: `${(f.v / cpMaxF) * 100}%` }} /></span>
                  <span className="cf-v mono">${f.v.toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="cost-section">
          <div className="cost-section-h mono">按 AGENT 分布（算力）</div>
          {rows.map((r) => (
            <div className="cost-row" key={r.id}>
              <span className="cr-emoji">{r.emoji}</span>
              <div className="cr-body">
                <div className="cr-top"><span className="cr-name">{r.name}</span><span className="cr-amt mono">${r.spend.toFixed(2)}</span></div>
                <div className="cr-track"><div className={`cr-fill ${r.status}`} style={{ width: `${(r.spend / max) * 100}%` }} /></div>
              </div>
              <span className="cr-model mono">{(r.model || "").split("·")[1]?.trim()}</span>
            </div>
          ))}
        </div>

        <div className="cost-section">
          <div className="cost-section-h mono">按模型分布</div>
          <div className="model-dist">
            {Object.entries(byModel).map(([k, v]) => (
              <div className="md-chip" key={k}>
                {/gpt/i.test(k) ? <span className="vendor-badge gpt">G</span> : <img src="assets/claude.png" className="md-logo" alt="" />}
                <span className="md-name mono">{k}</span>
                <span className="md-amt mono">${v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.RosterView = RosterView;
window.CostsView = CostsView;
