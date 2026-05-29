/* ============================================================
   Soloco · Node Detail (slides over chat) + Deliverable modal
   ============================================================ */

function StatusChip({ status }) {
  const map = {
    running: ["运行中", "running"], succeeded: ["已完成", "succeeded"],
    failed: ["失败", "failed"], awaits: ["等你回答", "awaits"], idle: ["空闲", "idle"],
  };
  const [label, cls] = map[status] || map.idle;
  return <span className={`st-chip ${cls}`}><i className={`lg ${cls}`} />{label}</span>;
}

/* vendor-aware model mark */
function ModelMark({ model, className }) {
  const isGpt = /gpt|openai/i.test(model || "");
  const name = (model || "").split("·")[1]?.trim() || model;
  return (
    <span className={`model-chip mono ${className || ""}`}>
      {isGpt ? <span className="vendor-badge gpt">G</span> : <img src="assets/claude.png" className="mc-logo" alt="" />}
      {name}
    </span>
  );
}

function NodeDetail({ node, onClose, onPreview, onChat }) {
  if (!node) return null;
  const isAgent = node.kind === "agent";
  const isConductor = node.kind === "conductor";
  const isArtifact = node.kind === "artifact";
  const done = node.status === "succeeded";
  const hasDeliverable = !!node.deliverable;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <aside className="detail" onClick={(e) => e.stopPropagation()}>
        <div className="detail-head">
          <button className="detail-close press" onClick={onClose}>✕</button>
          <div className="dh-id">
            <span className="dh-emoji">{isConductor ? "🧠" : node.emoji}</span>
            <div>
              <div className="dh-name">{node.name}</div>
              <div className="dh-role mono">{isConductor ? "CONDUCTOR" : isArtifact ? "KNOWLEDGE GRAPH" : `AGENT · ${node.role}`}</div>
            </div>
          </div>
          <div className="dh-tags">
            {node.status && <StatusChip status={node.status} />}
            {node.model && <ModelMark model={node.model} />}
          </div>
        </div>

        <div className="detail-body">
          {/* Soul */}
          {node.soul && (
            <section className="d-sec">
              <h4>Soul · 角色设定</h4>
              <p className="d-soul">{node.soul}</p>
              {node.mbti && (
                <div className="mbti">
                  <span className="mbti-code mono">{node.mbti.code}</span>
                  <span className="mbti-label">{node.mbti.label}</span>
                  <span className="mbti-note mono">性格影响措辞与决策风格 · 可选</span>
                </div>
              )}
            </section>
          )}

          {/* Skills / MCP */}
          {node.skills && node.skills.length > 0 && (
            <section className="d-sec">
              <h4>Skills / MCP</h4>
              <div className="chips">
                {node.skills.map((s, i) => (
                  <span key={i} className={`skill-chip mono ${/mcp/i.test(s) ? "mcp" : ""}`}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {(isAgent || isArtifact) && (
            <section className="d-sec">
              <h4>交付产物</h4>
              {hasDeliverable && (done || isArtifact) ? (
                <div className="deliv-preview">
                  <div className="dp-card">
                    <span className="dp-ic">🖼️</span>
                    <div className="dp-main">
                      <div className="dp-name">{node.deliverable.htmlName}</div>
                      <div className="dp-sub">{node.deliverable.title}</div>
                    </div>
                    <button className="dp-open press" onClick={() => onPreview({ nodeId: node.id })}>打开友好视图</button>
                  </div>
                  <div className="dp-note mono">
                    <span className="dp-md">📄 {node.deliverable.mdName}</span>
                    Agent 之间传递的是这份 .md/.csv，上面的 .html 只是给你看的友好视图。
                  </div>
                </div>
              ) : (
                <div className="deliv-empty mono">尚未产出交付物 · 该 Agent 完成后这里会出现可打开的展示</div>
              )}
            </section>
          )}

          {isConductor && (
            <section className="d-sec">
              <h4>职责边界</h4>
              <ul className="duty">
                <li><b>设计组织</b> — 招聘 Agent、配置属性、渲染画布</li>
                <li><b>分发任务</b> — 唯一的「派活」入口，监控、处理回调与重试</li>
                <li><b>会话排队</b> — 忙碌时新消息进队列，依次处理</li>
              </ul>
              <div className="dp-note mono" style={{ marginTop: 10 }}>
                单个 Agent 的对话框只用于<b>取信息</b>；派活只能经由指挥官。
              </div>
            </section>
          )}

          {(isAgent || isArtifact) && (
            <section className="d-sec">
              <div className="mem-hidden mono">
                <span className="mh-dot" /> 三重记忆（Session / Agent / User）与领域知识在后台读写，<b>不在前端展开</b>，但每次任务都会被自动调用。
              </div>
            </section>
          )}
        </div>

        <div className="detail-foot">
          {isAgent && (
            <button
              className={`df-btn press ${done ? "primary" : ""}`}
              disabled={!done}
              title={done ? "与该 Agent 一对一单聊（仅获取信息）" : "该 Agent 完成后可单聊"}
              onClick={() => done && onChat(node.id)}
            >💬 与 TA 单聊</button>
          )}
          <button className="df-btn press" onClick={onClose}>回到画布</button>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   Deliverable preview modal — descriptor-driven, human-friendly
   ============================================================ */
function SalaryReport() {
  const rows = [
    ["北京", "¥38k", "¥52k", "¥71k", "样本 152"],
    ["上海", "¥36k", "¥49k", "¥66k", "样本 138"],
    ["深圳", "¥34k", "¥47k", "¥63k", "样本 122"],
  ];
  return (
    <>
      <div className="rep-cards">
        <div className="rep-card"><div className="rc-num mono">¥52k</div><div className="rc-lab">北京 P50</div></div>
        <div className="rep-card"><div className="rc-num mono">+11%</div><div className="rc-lab">京沪 P50 差</div></div>
        <div className="rep-card"><div className="rc-num mono">412</div><div className="rc-lab">总样本</div></div>
      </div>
      <table className="rep-table">
        <thead><tr><th>城市</th><th>P25</th><th>P50</th><th>P75</th><th>样本</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 && j < 4 ? "mono" : ""}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="rep-bars">
        {rows.map((r, i) => (
          <div className="rb-row" key={i}>
            <span className="rb-city">{r[0]}</span>
            <span className="rb-track"><span className="rb-fill" style={{ width: `${[100, 94, 90][i]}%` }} /></span>
            <span className="rb-val mono">{r[2]}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function GraphView({ graph }) {
  // three domain hubs + center, simple geometric layout (circles + lines)
  const cx = 240, cy = 130, R = 96;
  const pts = graph.domains.map((d, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / graph.domains.length;
    return { ...d, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  });
  const byId = Object.fromEntries(pts.map((p) => [p.id, p]));
  return (
    <div className="kg-wrap">
      <svg className="kg-svg" viewBox="0 0 480 260">
        {graph.links.map((l, i) => {
          const a = byId[l.from], b = byId[l.to];
          return <line key={i} className="kg-edge" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        <circle className="kg-core" cx={cx} cy={cy} r="26" />
        <text className="kg-core-t" x={cx} y={cy + 4} textAnchor="middle">图谱</text>
        {pts.map((p) => (
          <g key={p.id}>
            <line className="kg-spoke" x1={cx} y1={cy} x2={p.x} y2={p.y} />
            <circle className="kg-node" cx={p.x} cy={p.y} r="30" />
            <text className="kg-emoji" x={p.x} y={p.y - 2} textAnchor="middle">{p.emoji}</text>
            <text className="kg-label" x={p.x} y={p.y + 16} textAnchor="middle">{p.label}</text>
          </g>
        ))}
      </svg>
      <div className="kg-rels">
        {graph.links.map((l, i) => <span key={i} className="kg-rel mono">{l.label}</span>)}
      </div>
    </div>
  );
}

function DeliverableModal({ deliverable, onClose }) {
  if (!deliverable) return null;
  const d = deliverable;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <span className="mb-dots"><i /><i /><i /></span>
          <span className="mb-addr mono">{d.htmlName}</span>
          <button className="mb-close press" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body report">
          <div className="rep-kicker mono">{d.kicker}</div>
          <h1>{d.title}</h1>
          {d.lede && <p className="rep-lede">{d.lede}</p>}

          {d.kpis && (
            <div className="rep-cards">
              {d.kpis.map((k, i) => (
                <div className="rep-card" key={i}><div className="rc-num mono">{k.v}</div><div className="rc-lab">{k.l}</div></div>
              ))}
            </div>
          )}

          {d.type === "report" && <SalaryReport />}
          {d.type === "graph" && d.graph && <GraphView graph={d.graph} />}

          {d.table && (
            <table className="rep-table">
              <thead><tr>{d.table.cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
              <tbody>
                {d.table.rows.map((r, i) => (
                  <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 ? "mono" : ""}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}

          {d.sections && (
            <div className="rep-sections">
              {d.sections.map((s, i) => (
                <div className="rep-sec" key={i}>
                  <div className="rs-h">{s.h}</div>
                  <div className="rs-b">{s.body}</div>
                </div>
              ))}
            </div>
          )}

          <p className="rep-foot mono">Agent 间传递为 {d.mdName} · 此处为人类友好视图 · Transcript 已存档</p>
        </div>
      </div>
    </div>
  );
}

window.NodeDetail = NodeDetail;
window.DeliverableModal = DeliverableModal;
window.ModelMark = ModelMark;
