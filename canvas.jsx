/* ============================================================
   Soloco · Organization Canvas (left pane)
   ============================================================ */
const { useState, useRef, useLayoutEffect, useEffect, useCallback } = React;

const STAGE_W = 980;
const STAGE_H = 560;

/* ---- a single node card ---- */
function CanvasNode({ node, selected, onSelect, registerRef, index, entered }) {
  const st = node.status || "idle";
  const isRunning = st === "running";
  const isDone = st === "succeeded";
  const isFail = st === "failed";
  const isAwait = st === "awaits";
  const isCompany = node.kind === "company";
  const isConductor = node.kind === "conductor";
  const isArtifact = node.kind === "artifact";

  const cls = [
    "node",
    `s-${st}`,
    selected ? "sel" : "",
    isCompany ? "is-company" : "",
    isConductor ? "is-conductor" : "",
    isArtifact ? "is-artifact" : "",
    st === "idle" && node.kind === "agent" ? "dim" : "",
  ].join(" ");

  const style = {
    left: node.x, top: node.y, width: node.w,
  };

  return (
    <div
      ref={(el) => registerRef(node.id, el)}
      className={cls}
      style={style}
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    >
      {!isCompany && <span className="stripe" />}
      {isRunning && <span className="run-ring" />}

      {node.badge && (
        <span className={`iv-badge ${node.badge === "?" ? "ask" : "fail"}`}>{node.badge}</span>
      )}

      {isCompany ? (
        <div className="company-inner">
          <span className="company-emoji">{node.emoji}</span>
          <div>
            <div className="company-name">{node.name}</div>
            <div className="company-sub mono">COMPANY · {node.mission}</div>
          </div>
        </div>
      ) : isArtifact ? (
        <div className="artifact-inner">
          <div className="node-head">
            <span className="node-role mono">KNOWLEDGE GRAPH</span>
            {isDone
              ? <span className="node-statetag mono" style={{ color: "var(--succeed)" }}>● 共享记忆</span>
              : isRunning
              ? <span className="node-statetag mono" style={{ color: "var(--primary)" }}>● 合并中</span>
              : <span className="node-statetag mono">待汇聚</span>}
          </div>
          <div className="node-title"><span className="node-emoji">{node.emoji}</span><span>{node.name}</span></div>
          <div className="node-status">
            {isRunning && <><span className="spin" /> <span className="run-task">正在：{node.task || "合并…"}</span></>}
            {isDone && <><span className="tick">✓</span> <span className="done-txt">{node.result || "已生成"}</span></>}
            {!isRunning && !isDone && <span className="idle-txt mono">三领域汇聚 · 点开看图谱</span>}
          </div>
        </div>
      ) : (
        <>
          <div className="node-head">
            <span className="node-role mono">{isConductor ? "CONDUCTOR" : node.role}</span>
            {isConductor
              ? <span className="node-statetag mono" style={{ color: "var(--primary)" }}>● 协调中</span>
              : <span className="node-model mono">{(node.model || "").split("·")[1] || "claude"}</span>}
          </div>
          <div className="node-title">
            <span className="node-emoji">{isConductor ? "🧠" : node.emoji}</span>
            <span>{node.name}</span>
          </div>

          {/* dynamic status line */}
          <div className="node-status">
            {isRunning && (
              <><span className="spin" /> <span className="run-task">正在：{node.task || "执行中…"}</span></>
            )}
            {isDone && (
              <><span className="tick">✓</span> <span className="done-txt">{node.result || "完成"}</span></>
            )}
            {isFail && (
              <><span className="bang">!</span> <span className="fail-txt">{node.task || "执行失败"}</span></>
            )}
            {isAwait && (
              <><span className="ask-dot" /> <span className="await-txt">已回退 · 等你回答</span></>
            )}
            {st === "idle" && node.kind === "agent" && (
              <span className="idle-txt mono">空闲 · 待派发</span>
            )}
            {isConductor && (
              <span className="idle-txt mono">{node.task || "管 1 个目标 · 4 名员工"}</span>
            )}
          </div>

          {/* cost / duration meter for agents */}
          {node.kind === "agent" && (isRunning || isDone) && (
            <div className="node-meter mono">
              <span>{node.dur || "0.0s"}</span>
              <span className="meter-dot">·</span>
              <span>${node.cost || "0.00"}</span>
              {isRunning && (
                <span className="prog">
                  <span className="prog-bar" style={{ width: `${node.progress || 0}%` }} />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---- edge geometry from measured boxes ---- */
function edgePath(a, b, kind) {
  if (!a || !b) return "";
  if (kind === "flow-h") {
    // horizontal dataflow: right of a -> left of b
    const x1 = a.x + a.w, y1 = a.y + a.h / 2;
    const x2 = b.x, y2 = b.y + b.h / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }
  if (kind === "down") {
    // vertical: bottom of a -> top of b
    const x1 = a.x + a.w / 2, y1 = a.y + a.h;
    const x2 = b.x + b.w / 2, y2 = b.y;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  }
  // dispatch: bottom of a -> top of b (fan)
  const x1 = a.x + a.w / 2, y1 = a.y + a.h;
  const x2 = b.x + b.w / 2, y2 = b.y;
  const my = y1 + (y2 - y1) * 0.55;
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
}

function OrgCanvas({ nodes, edges, selectedId, onSelectNode, entered, sceneEmpty, fitKey }) {
  const refs = useRef({});
  const [boxes, setBoxes] = useState({});
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const vpRef = useRef(null);
  const pan = useRef(null);
  const lastFit = useRef("");

  const registerRef = useCallback((id, el) => { refs.current[id] = el; }, []);

  // only re-measure when something that affects geometry changes
  const sig = nodes.map((n) => `${n.id}:${n.hidden ? 0 : 1}:${n.w}:${n.status}`).join("|");
  const lastBoxes = useRef("");

  // measure node boxes (unscaled stage coords) — guarded to avoid render loop
  useLayoutEffect(() => {
    const next = {};
    for (const n of nodes) {
      const el = refs.current[n.id];
      if (el && !n.hidden) {
        next[n.id] = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      }
    }
    const ser = JSON.stringify(next);
    if (ser !== lastBoxes.current) {
      lastBoxes.current = ser;
      setBoxes(next);
    }
  }, [sig]);

  // fit once per org/scene change, but only after THIS org's boxes are measured
  const visIds = nodes.filter((n) => !n.hidden).map((n) => n.id);
  const boxesReady = visIds.length > 0 && visIds.every((id) => boxes[id]);
  useEffect(() => {
    if (sceneEmpty || !boxesReady) return;
    if (lastFit.current === fitKey) return;
    lastFit.current = fitKey;
    fitTo();
  }, [sceneEmpty, fitKey, boxesReady, boxes]);

  // bounding box of actual rendered content
  const contentBox = () => {
    const bs = Object.values(boxes);
    if (!bs.length) return { x: 0, y: 0, w: STAGE_W, h: STAGE_H };
    const minX = Math.min(...bs.map((b) => b.x));
    const minY = Math.min(...bs.map((b) => b.y));
    const maxX = Math.max(...bs.map((b) => b.x + b.w));
    const maxY = Math.max(...bs.map((b) => b.y + b.h));
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  };

  const fitTo = () => {
    const vp = vpRef.current; if (!vp) return;
    const c = contentBox();
    const padX = 60, padY = 72;
    const k = Math.max(0.4, Math.min(1.25, Math.min((vp.clientWidth - padX * 2) / c.w, (vp.clientHeight - padY * 2) / c.h)));
    const x = (vp.clientWidth - c.w * k) / 2 - c.x * k;
    const y = (vp.clientHeight - c.h * k) / 2 - c.y * k;
    setView({ x, y, k });
  };

  const doFit = () => fitTo();
  const zoomBy = (f) => setView((v) => ({ ...v, k: Math.max(0.4, Math.min(1.8, v.k * f)) }));

  // pan
  const onDown = (e) => {
    if (e.target.closest(".node") || e.target.closest(".canvas-controls")) return;
    pan.current = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
  };
  const onMove = (e) => {
    if (!pan.current) return;
    setView((v) => ({ ...v, x: pan.current.vx + (e.clientX - pan.current.sx), y: pan.current.vy + (e.clientY - pan.current.sy) }));
  };
  const onUp = () => { pan.current = null; };
  const onWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? 1.08 : 0.93);
  };

  const visNodes = nodes.filter((n) => !n.hidden);

  return (
    <div
      className={`canvas-viewport ${sceneEmpty ? "is-empty" : ""}`}
      ref={vpRef}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onWheel={onWheel}
      onClick={() => onSelectNode(null)}
    >
      {/* skeleton + hint when empty */}
      {sceneEmpty && (
        <div className="empty-wrap">
          <svg className="empty-skeleton" viewBox="0 0 480 300" fill="none">
            <rect x="200" y="14" width="80" height="34" rx="8" />
            <rect x="200" y="92" width="80" height="34" rx="8" />
            <rect x="60" y="190" width="80" height="40" rx="8" strokeDasharray="4 5" />
            <rect x="200" y="190" width="80" height="40" rx="8" strokeDasharray="4 5" />
            <rect x="340" y="190" width="80" height="40" rx="8" strokeDasharray="4 5" />
            <path d="M240 48 V92 M240 126 V160 M240 160 H100 V190 M240 160 V190 M240 160 H380 V190" />
          </svg>
          <div className="empty-hint">
            <div className="empty-emoji">🪄</div>
            <h3>这里还是一张空画布</h3>
            <p>在右侧告诉 <b>指挥官</b> 你想达成的目标，它会现场招聘 Agent、画出协作流程，然后开始干活。</p>
          </div>
        </div>
      )}

      <div
        className="canvas-stage"
        style={{
          width: STAGE_W, height: STAGE_H,
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
          opacity: sceneEmpty ? 0 : 1,
        }}
      >
        <svg className="edges" width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
          {edges.map((e, i) => {
            const a = boxes[e.from], b = boxes[e.to];
            if (!a || !b) return null;
            const d = edgePath(a, b, e.kind);
            const cl = ["edge", e.type || "", e.active ? "active" : "", e.dashed ? "dashed" : ""].join(" ");
            return (
              <g key={i}>
                <path className={cl} d={d} />
                {e.label && (() => {
                  const mid = midpoint(a, b, e.kind);
                  return <text className="edge-label mono" x={mid.x} y={mid.y - 5} textAnchor="middle">{e.label}</text>;
                })()}
                {e.active && (
                  <circle r="3.2" fill="var(--primary)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {visNodes.map((n, i) => (
          <CanvasNode
            key={n.id}
            node={n}
            index={i}
            entered={entered}
            selected={selectedId === n.id}
            onSelect={onSelectNode}
            registerRef={registerRef}
          />
        ))}
      </div>

      {/* zoom controls */}
      {!sceneEmpty && (
        <div className="canvas-controls">
          <button onClick={() => zoomBy(1.12)} title="放大">+</button>
          <button onClick={() => zoomBy(0.89)} title="缩小">−</button>
          <button onClick={doFit} title="适配" className="fit">⤢</button>
          <span className="zoom-pct mono">{Math.round(view.k * 100)}%</span>
        </div>
      )}

      {/* legend */}
      {!sceneEmpty && (
        <div className="canvas-legend">
          <span><i className="lg running" />运行</span>
          <span><i className="lg succeeded" />完成</span>
          <span><i className="lg awaits" />等待</span>
          <span><i className="lg failed" />失败</span>
          <span><i className="lg idle" />空闲</span>
        </div>
      )}
    </div>
  );
}

function midpoint(a, b, kind) {
  if (kind === "flow-h") return { x: (a.x + a.w + b.x) / 2, y: (a.y + a.h / 2 + b.y + b.h / 2) / 2 };
  return { x: (a.x + a.w / 2 + b.x + b.w / 2) / 2, y: a.y + a.h + (b.y - (a.y + a.h)) * 0.5 };
}

window.OrgCanvas = OrgCanvas;
