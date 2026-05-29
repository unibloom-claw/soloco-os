/* ============================================================
   Soloco · Conductor Chat (right pane)
   ============================================================ */

/* ---- typewriter (types once per message id via stable key) ---- */
function Typewriter({ text, speed = 16, onTick, onDone }) {
  const [n, setN] = React.useState(0);
  const doneRef = React.useRef(false);
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      onTick && onTick();
      if (i >= text.length) {
        clearInterval(id);
        if (!doneRef.current) { doneRef.current = true; onDone && onDone(); }
      }
    }, speed);
    return () => clearInterval(id);
  }, []);
  const shown = text.slice(0, n);
  const typing = n < text.length;
  return <span className={typing ? "caret" : ""} dangerouslySetInnerHTML={{ __html: shown.replace(/\n/g, "<br/>") }} />;
}

/* ---- conductor "thinking" trace ---- */
function ThinkingTrace({ steps, onTick }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => { setN((v) => { onTick && onTick(); return Math.min(v + 1, steps.length); }); }, 620);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="think">
      <div className="think-head"><span className="spin" /> 指挥官正在思考</div>
      <div className="think-steps">
        {steps.slice(0, n).map((s, i) => (
          <div className="think-step" key={i}><span className="ts-tick">✓</span> {s}</div>
        ))}
        {n < steps.length && <div className="think-step cur"><span className="ts-dot" /> {steps[n]}</div>}
      </div>
    </div>
  );
}

/* ---- team / org preview card ---- */
function TeamCard({ data }) {
  return (
    <div className="team-card">
      <div className="tc-head mono">招聘清单 · {data.agents.length} 名 AGENT</div>
      {data.agents.map((a) => (
        <div className="tc-row" key={a.name}>
          <span className="tc-emoji">{a.emoji}</span>
          <div className="tc-main">
            <div className="tc-name">{a.name} <span className="tc-mbti mono">{a.mbti}</span></div>
            <div className="tc-role mono">{a.role} · {a.model}</div>
          </div>
          <span className="tc-tag">新招</span>
        </div>
      ))}
      <div className="tc-foot mono">
        <span>编排：串行 + 1 个条件分支</span>
        <span>每个 Agent = Claude CLI</span>
      </div>
    </div>
  );
}

/* ---- intervention question card ---- */
function QuestionCard({ msg, onQuick }) {
  return (
    <div className="q-card">
      <div className="q-from"><span className="q-ball ask">?</span> {msg.from} 回退提问</div>
      <div className="q-body" dangerouslySetInnerHTML={{ __html: msg.text }} />
      {msg.ctx && <div className="q-ctx mono">{msg.ctx}</div>}
      {msg.quick && (
        <div className="q-quick">
          {msg.quick.map((q, i) => (
            <button key={i} className="q-chip press" onClick={() => onQuick(q)}>{q.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- deliverable card ---- */
function DeliverableCard({ msg, onOpen }) {
  return (
    <div className="deliv-card">
      <div className="dc-head mono">交付物 · {msg.items.length}</div>
      {msg.items.map((it, i) => (
        <div className={`dc-item ${it.kind}`} key={i}>
          <span className="dc-icon">{it.kind === "view" ? "🖼️" : "📄"}</span>
          <div className="dc-main">
            <div className="dc-name mono">{it.name}</div>
            <div className="dc-sub">{it.kind === "view" ? "可在界面直接渲染 · 给你看" : "结构化交付物 · 存档/下游消费"}</div>
          </div>
          {it.kind === "view"
            ? <button className="dc-open press" onClick={() => onOpen(it)}>打开预览</button>
            : <span className="dc-tag mono">.md</span>}
        </div>
      ))}
    </div>
  );
}

/* ---- a single chat message ---- */
function ChatMessage({ msg, onTick, onDone, onQuick, onOpen }) {
  if (msg.role === "user") {
    return (
      <div className={`msg user ${msg.queued ? "queued" : ""}`}>
        <div className="user-col">
          {msg.files && msg.files.length > 0 && (
            <div className="msg-files">
              {msg.files.map((f, i) => (
                <span className="file-chip mono" key={i}><span className="fc-icon">{f.icon || "📎"}</span>{f.name}</span>
              ))}
            </div>
          )}
          {msg.text && <div className="bubble">{msg.text}{msg.queued && <span className="queued-tag mono">排队中</span>}</div>}
        </div>
      </div>
    );
  }
  // conductor / system
  return (
    <div className="msg bot">
      <div className="bot-avatar"><span>🧠</span></div>
      <div className="bot-col">
        {msg.kind !== "team" && msg.kind !== "question" && msg.kind !== "deliverable" && msg.kind !== "thinking" && (
          <div className="bubble bot-bubble">
            {msg.typed
              ? <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }} />
              : <Typewriter text={msg.text} onTick={onTick} onDone={() => onDone(msg.id)} />}
          </div>
        )}
        {msg.kind === "thinking" && <ThinkingTrace steps={msg.steps} onTick={onTick} />}
        {msg.kind === "team" && <TeamCard data={msg.data} />}
        {msg.kind === "question" && <QuestionCard msg={msg} onQuick={onQuick} />}
        {msg.kind === "deliverable" && <DeliverableCard msg={msg} onOpen={onOpen} />}
      </div>
    </div>
  );
}

/* ---- main chat panel ---- */
function ConductorChat({
  messages, busy, status, suggestions, queueCount,
  onSend, onQuick, onOpen, onTick, onDone, width,
  model, onModel, onAuthorize, grantedPath,
}) {
  const [draft, setDraft] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [modelOpen, setModelOpen] = React.useState(false);
  const bodyRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const MODELS = [
    { name: "Opus 4.8", vendor: "Anthropic", note: "最强推理 · 适合指挥/编排" },
    { name: "GPT 5.5", vendor: "OpenAI", note: "通用强 · 工具调用稳" },
    { name: "Sonnet 4.5", vendor: "Anthropic", note: "性价比 · 日常分析" },
    { name: "Haiku 4", vendor: "Anthropic", note: "最快最省 · 轻任务" },
  ];

  const scrollDown = React.useCallback(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  React.useEffect(() => { scrollDown(); }, [messages.length, scrollDown]);

  const iconFor = (name) => {
    const e = (name.split(".").pop() || "").toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e)) return "🖼️";
    if (["csv", "xlsx", "xls"].includes(e)) return "📊";
    if (["pdf"].includes(e)) return "📕";
    if (["md", "txt", "doc", "docx"].includes(e)) return "📄";
    if (["zip", "rar"].includes(e)) return "🗜️";
    return "📎";
  };
  const addFiles = (list) => {
    const arr = Array.from(list || []).slice(0, 6).map((f) => ({ name: f.name, icon: iconFor(f.name) }));
    if (arr.length) setAttachments((a) => [...a, ...arr].slice(0, 6));
  };
  const onPaste = (e) => {
    const items = e.clipboardData?.items || [];
    let added = false;
    for (const it of items) {
      if (it.kind === "file") { const f = it.getAsFile(); if (f) { addFiles([f]); added = true; } }
    }
    // also detect pasted long text as an "imported" snippet
    const txt = e.clipboardData?.getData("text") || "";
    if (!added && txt.length > 600) {
      e.preventDefault();
      setAttachments((a) => [...a, { name: `粘贴文本 · ${txt.length} 字`, icon: "📋" }].slice(0, 6));
    }
  };

  const send = () => {
    const t = draft.trim();
    if (!t && !attachments.length) return;
    const files = attachments;
    setDraft(""); setAttachments([]);
    onSend(t || "（见附件）", null, files);
  };
  const onKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) { e.preventDefault(); send(); }
  };

  return (
    <aside className="chat" style={{ width }}>
      <header className="chat-head">
        <div className="chat-id">
          <span className="chat-avatar">🧠</span>
          <div>
            <div className="chat-name">指挥官 <span className="chat-conductor mono">CONDUCTOR</span></div>
            <div className="chat-sub mono">
              {busy
                ? <><span className="spin sm" /> 忙碌中{queueCount > 0 ? ` · 排队 ${queueCount}` : ""}</>
                : <><span className="ready-dot" /> {status || "空闲 · 随时可聊"}</>}
            </div>
          </div>
        </div>
        <img src="assets/claude.png" alt="模型" className="chat-claude" title="每个 Agent 背后都是一次模型调用（Opus 4.8 / GPT 5.5 等）" />
      </header>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m) => (
          <ChatMessage key={m.id} msg={m} onTick={scrollDown} onDone={onDone} onQuick={onQuick} onOpen={onOpen} />
        ))}
      </div>

      <div className="chat-foot">
        {suggestions && suggestions.length > 0 && (
          <div className="suggest-row">
            {suggestions.map((s, i) => (
              <button key={i} className={`suggest-chip press ${s.primary ? "primary" : ""}`} onClick={() => onSend(s.text, s)}>
                {s.icon && <span className="sc-icon">{s.icon}</span>}{s.label}
              </button>
            ))}
          </div>
        )}
        <div className="composer">
          {attachments.length > 0 && (
            <div className="attach-row">
              {attachments.map((f, i) => (
                <span className="attach-chip mono" key={i}>
                  <span className="ac-icon">{f.icon}</span>{f.name}
                  <button className="ac-x" onClick={() => setAttachments((a) => a.filter((_, j) => j !== i))}>✕</button>
                </span>
              ))}
            </div>
          )}
          <textarea
            rows="1"
            value={draft}
            placeholder={busy ? "指挥官忙碌中…发送会进入排队队列" : "给指挥官一个目标，或追问、改流程…（可拖入或粘贴文件）"}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            onPaste={onPaste}
          />
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          <div className="composer-bar">
            <span className="cb-left">
              <button className="attach-btn press" onClick={() => fileRef.current && fileRef.current.click()} title="上传文件">＋</button>
              <button className={`grant-btn press ${grantedPath ? "on" : ""}`} onClick={onAuthorize} title="授权本机文件夹（只读）">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                {grantedPath ? "已授权" : "授权资料"}
              </button>
              <div className="model-wrap">
                <button className="model-pick press" onClick={() => setModelOpen((v) => !v)} title="选择模型">
                  <span className="mp-dot" /> {model || "Opus 4.8"} <span className="mp-caret">⌄</span>
                </button>
                {modelOpen && (
                  <div className="model-menu" onMouseLeave={() => setModelOpen(false)}>
                    <div className="mm-label mono">指挥官模型</div>
                    {MODELS.map((m) => (
                      <button key={m.name} className={`mm-item ${model === m.name ? "on" : ""}`} onClick={() => { onModel && onModel(m.name); setModelOpen(false); }}>
                        <span className="mm-main"><span className="mm-name">{m.name}</span><span className="mm-vendor mono">{m.vendor}</span></span>
                        <span className="mm-note mono">{m.note}</span>
                        {model === m.name && <span className="mm-check">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </span>
            <button className="send-btn press" onClick={send} disabled={!draft.trim() && !attachments.length}>
              发送 <span className="mono">⌘↵</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

window.ConductorChat = ConductorChat;

/* ============================================================
   One-on-one Agent chat (info only) — slides over the chat pane
   ============================================================ */
function AgentChat({ node, messages, onSend, onClose, onBackToConductor }) {
  const [draft, setDraft] = React.useState("");
  const bodyRef = React.useRef(null);
  React.useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages.length]);

  const faqs = (node.oneOnOne && node.oneOnOne.faqs) || [];
  const send = (t) => { const v = (t || draft).trim(); if (!v) return; setDraft(""); onSend(v); };
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="agentchat-overlay" onClick={onClose}>
      <aside className="agentchat" onClick={(e) => e.stopPropagation()}>
        <header className="ac-head">
          <button className="ac-back press" onClick={onClose} title="返回画布">✕</button>
          <span className="ac-avatar">{node.emoji}</span>
          <div className="ac-id">
            <div className="ac-name">{node.name} <span className="ac-tag mono">一对一</span></div>
            <div className="ac-sub mono">{node.role} · 仅获取信息</div>
          </div>
        </header>

        <div className="ac-banner">
          <span className="ac-banner-ic">ℹ︎</span>
          <span>单聊只用于<b>向 TA 取信息</b>。要派活、改流程，请回到 <button className="ac-link" onClick={onBackToConductor}>指挥官</button> 的对话框。</span>
        </div>

        <div className="ac-body" ref={bodyRef}>
          {messages.map((m) => (
            <div key={m.id} className={`ac-msg ${m.role}`}>
              {m.role === "bot" && <span className="ac-msg-av">{node.emoji}</span>}
              <div className="ac-bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
            </div>
          ))}
        </div>

        <div className="ac-foot">
          {faqs.length > 0 && (
            <div className="ac-faqs">
              {faqs.map((f, i) => (
                <button key={i} className="ac-faq press" onClick={() => send(f.q)}>{f.q}</button>
              ))}
            </div>
          )}
          <div className="ac-composer">
            <input
              value={draft}
              placeholder={`向${node.name}提问（仅获取信息）…`}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
            />
            <button className="ac-send press" onClick={() => send()} disabled={!draft.trim()}>问</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
window.AgentChat = AgentChat;

/* ============================================================
   Authorize local folder dialog
   ============================================================ */
function AuthorizeDialog({ onClose, onGrant }) {
  const recents = [
    { path: "~/Documents/公司资料", note: "106 个文件 · 财务 / 产品 / 法务", n: 106 },
    { path: "~/Desktop/尽调材料", note: "58 个文件 · 合同 / 报表", n: 58 },
    { path: "~/Work/产品文档", note: "31 个文件 · PRD / 纪要", n: 31 },
  ];
  const [picked, setPicked] = React.useState(recents[0].path);
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="auth-head">
          <span className="auth-ic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          </span>
          <div>
            <div className="auth-title">授权本机文件夹</div>
            <div className="auth-sub">指挥官将获得<b>只读</b>权限，派蒸馏 Agent 把资料结构化成知识图谱。文件不出本机。</div>
          </div>
          <button className="auth-x press" onClick={onClose}>✕</button>
        </div>
        <div className="auth-label mono">最近的位置</div>
        <div className="auth-list">
          {recents.map((r) => (
            <button key={r.path} className={`auth-item ${picked === r.path ? "on" : ""}`} onClick={() => setPicked(r.path)}>
              <span className="auth-folder">📁</span>
              <span className="auth-meta">
                <span className="auth-path mono">{r.path}</span>
                <span className="auth-note">{r.note}</span>
              </span>
              <span className="auth-radio">{picked === r.path ? "●" : "○"}</span>
            </button>
          ))}
        </div>
        <div className="auth-foot">
          <span className="auth-perm mono">权限：只读 · 可随时撤销</span>
          <div className="auth-btns">
            <button className="auth-cancel press" onClick={onClose}>取消</button>
            <button className="auth-grant press" onClick={() => onGrant(picked)}>授权并开始蒸馏</button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.AuthorizeDialog = AuthorizeDialog;
