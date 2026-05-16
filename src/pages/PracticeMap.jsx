import { useState, useRef, useEffect, useCallback } from 'react';
import { BookOpen, List, Map, Send, X, FileText, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Notebook from './Notebook';
import './PracticeMap.css';

// ─── Physics tuning ───────────────────────────────────────────────
const LINK_REST     = 160;
const LINK_K        = 0.04;
const DRAG_K        = 0.12;
const DAMPING       = 0.82;
const COLLISION_R   = 90;
const COLLISION_K   = 0.35;
const SETTLE_THRESH = 0.15;
const DT            = 1;

// ─── NodeBubble ───────────────────────────────────────────────────
function NodeBubble({ label, isParent, isSelected, color, style, nodeId, onPointerDown }) {
  return (
    <div
      className={`pm-node ${isParent ? 'pm-node-parent' : 'pm-node-child'} ${isSelected ? 'pm-node-selected' : ''}`}
      style={{ ...style, '--node-color': color, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
      data-node-id={nodeId}
      onPointerDown={onPointerDown}
      title={label}
    >
      <span className="pm-node-label">{label}</span>
    </div>
  );
}

// ─── SVG lines ────────────────────────────────────────────────────
function ConnectionLines({ edges, nodePositions, canvasSize }) {
  return (
    <svg
      width={canvasSize.w} height={canvasSize.h}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,113,227,0.55)" />
          <stop offset="100%" stopColor="rgba(191,64,255,0.55)" />
        </linearGradient>
      </defs>
      {edges.map(({ id, a, b }) => {
        const pa = nodePositions[a];
        const pb = nodePositions[b];
        if (!pa || !pb) return null;
        return (
          <line key={id}
            x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke="url(#lg)" strokeWidth="1.8" strokeDasharray="5 4"
          />
        );
      })}
    </svg>
  );
}

// ─── Draggable Preview Panel ──────────────────────────────────────
function PreviewPanel({ node, onClose, onSendToBob }) {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const panelRef  = useRef(null);
  const dragState = useRef(null);

  useEffect(() => { setPos({ x: 24, y: 24 }); }, [node?.id]);

  const onHeaderPointerDown = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    panelRef.current.setPointerCapture(e.pointerId);
    dragState.current = {
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };
  };

  const onPanelPointerMove = (e) => {
    if (!dragState.current) return;
    e.stopPropagation();
    setPos({
      x: dragState.current.startPosX + (e.clientX - dragState.current.startPointerX),
      y: dragState.current.startPosY + (e.clientY - dragState.current.startPointerY),
    });
  };

  const onPanelPointerUp = (e) => {
    e.stopPropagation();
    dragState.current = null;
  };

  if (!node) return null;

  return (
    <div
      ref={panelRef}
      className="pm-preview"
      style={{ position: 'absolute', left: pos.x, top: pos.y, zIndex: 100, touchAction: 'none', userSelect: 'none' }}
      onPointerMove={onPanelPointerMove}
      onPointerUp={onPanelPointerUp}
      onPointerCancel={() => { dragState.current = null; }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="pm-preview-header" style={{ cursor: 'grab' }} onPointerDown={onHeaderPointerDown}>
        <div className="pm-preview-title"><FileText size={16} /><span>{node.title}</span></div>
        <button className="pm-preview-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="pm-preview-body">
        {node.content
          ? <pre className="pm-preview-content">{node.content}</pre>
          : <p className="pm-preview-empty">No content yet.</p>}
      </div>
      <button className="pm-send-btn" onClick={() => onSendToBob(node)}>
        <Send size={15} /> Send to Bob
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function PracticeMap({ notebooks, setNotebooks, activePageId, setActivePageId, isGuest, onSendToBob }) {
  const [view, setView]                 = useState('map');
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom]                 = useState(1);
  const [pan, setPan]                   = useState({ x: 0, y: 0 });
  const [, setRenderTick]               = useState(0);

  const containerRef = useRef(null);
  const CW = 1400, CH = 900;

  // ── Build graph: parent pages (with children) are center nodes;
  //    their child pages are leaf nodes.
  //    Pages with no children are shown as isolated nodes.
  // ─────────────────────────────────────────────────────────────────
  const buildGraph = useCallback(() => {
    const nodes = [];
    const edges = [];
    const cx = CW / 2, cy = CH / 2;

    // Collect ALL pages across all notebooks
    const allPages = notebooks.flatMap(nb =>
      nb.pages.map(p => ({ ...p, notebookName: nb.name, notebookColor: nb.id }))
    );

    // Only top-level pages (parentId === null) that have children become "parent" nodes
    const topLevelParents = allPages.filter(
      p => (p.parentId ?? null) === null && allPages.some(c => c.parentId === p.id)
    );

    // Top-level pages with NO children — shown as standalone leaf nodes
    const topLevelLeaves = allPages.filter(
      p => (p.parentId ?? null) === null && !allPages.some(c => c.parentId === p.id)
    );

    const totalCenters = topLevelParents.length + topLevelLeaves.length || 1;
    let centerIndex = 0;

    // Color palette per notebook id
    const nbColorMap = {};
    notebooks.forEach((nb, i) => {
      nbColorMap[nb.id] = `hsl(${(i * 67 + 200) % 360}, 70%, 65%)`;
    });
    const leafColorMap = {};
    notebooks.forEach((nb, i) => {
      leafColorMap[nb.id] = `hsl(${(i * 67 + 200) % 360}, 55%, 75%)`;
    });

    // Helper: get notebook id for a page
    const getNotebookId = (pageId) => {
      for (const nb of notebooks) {
        if (nb.pages.some(p => p.id === pageId)) return nb.id;
      }
      return null;
    };

    // Place parent nodes in a ring around the canvas center
    const parentR = Math.min(CW, CH) * 0.28;

    topLevelParents.forEach((parentPage) => {
      const angle   = (centerIndex / totalCenters) * 2 * Math.PI - Math.PI / 2;
      const pid     = `pg-${parentPage.id}`;
      const nbId    = getNotebookId(parentPage.id);
      const color   = nbColorMap[nbId] ?? 'hsl(220,70%,65%)';
      const leafClr = leafColorMap[nbId] ?? 'hsl(220,55%,75%)';

      const px = cx + parentR * Math.cos(angle);
      const py = cy + parentR * Math.sin(angle);

      nodes.push({
        id: pid,
        title: parentPage.title,
        content: parentPage.content,
        isParent: true,
        color,
        defaultX: px,
        defaultY: py,
        parentId: null,
      });

      // Direct children of this page
      const children = allPages.filter(p => p.parentId === parentPage.id);
      children.forEach((child, ci) => {
        const cid        = `pg-${child.id}`;
        const childCount = children.length || 1;
        const spread     = Math.min(60, 360 / childCount);
        const cAngle     = angle + ((ci - (childCount - 1) / 2) * spread * Math.PI) / 180;

        nodes.push({
          id: cid,
          title: child.title,
          content: child.content,
          isParent: false,
          color: leafClr,
          defaultX: px + LINK_REST * Math.cos(cAngle),
          defaultY: py + LINK_REST * Math.sin(cAngle),
          parentId: pid,
        });

        edges.push({ id: `${pid}-${cid}`, a: pid, b: cid });
      });

      centerIndex++;
    });

    // Standalone top-level pages (no children) — placed in the same ring
    topLevelLeaves.forEach((page) => {
      const angle = (centerIndex / totalCenters) * 2 * Math.PI - Math.PI / 2;
      const nbId  = getNotebookId(page.id);
      const color = leafColorMap[nbId] ?? 'hsl(220,55%,75%)';

      nodes.push({
        id: `pg-${page.id}`,
        title: page.title,
        content: page.content,
        isParent: false,
        color,
        defaultX: cx + parentR * Math.cos(angle),
        defaultY: cy + parentR * Math.sin(angle),
        parentId: null,
      });

      centerIndex++;
    });

    return { nodes, edges };
  }, [notebooks]);

  // ── Physics refs ──────────────────────────────────────────────────
  const posRef   = useRef({});
  const velRef   = useRef({});
  const graphRef = useRef({ nodes: [], edges: [] });
  const dragRef  = useRef(null);
  const panRef   = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    const { nodes, edges } = buildGraph();
    graphRef.current = { nodes, edges };
    nodes.forEach(n => {
      if (!posRef.current[n.id]) {
        posRef.current[n.id] = { x: n.defaultX, y: n.defaultY };
        velRef.current[n.id] = { x: 0, y: 0 };
      }
    });
    const ids = new Set(nodes.map(n => n.id));
    Object.keys(posRef.current).forEach(id => {
      if (!ids.has(id)) { delete posRef.current[id]; delete velRef.current[id]; }
    });
  }, [notebooks]);

  // ── Physics loop ──────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const { edges } = graphRef.current;
      const pos  = posRef.current;
      const vel  = velRef.current;
      const drag = dragRef.current;
      let anyMoving = false;

      edges.forEach(({ a, b }) => {
        if (!pos[a] || !pos[b]) return;
        const dx   = pos[b].x - pos[a].x;
        const dy   = pos[b].y - pos[a].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const diff = dist - LINK_REST;
        const fx   = (dx / dist) * diff * LINK_K;
        const fy   = (dy / dist) * diff * LINK_K;
        if (!drag || drag.nodeId !== a) { vel[a].x += fx * DT; vel[a].y += fy * DT; }
        if (!drag || drag.nodeId !== b) { vel[b].x -= fx * DT; vel[b].y -= fy * DT; }
      });

      const ids = Object.keys(pos);
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const ia = ids[i], ib = ids[j];
          const dx   = pos[ib].x - pos[ia].x;
          const dy   = pos[ib].y - pos[ia].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < COLLISION_R) {
            const overlap = COLLISION_R - dist;
            const fx = (dx / dist) * overlap * COLLISION_K;
            const fy = (dy / dist) * overlap * COLLISION_K;
            if (!drag || drag.nodeId !== ia) { vel[ia].x -= fx; vel[ia].y -= fy; }
            if (!drag || drag.nodeId !== ib) { vel[ib].x += fx; vel[ib].y += fy; }
            anyMoving = true;
          }
        }
      }

      ids.forEach(id => {
        if (drag && drag.nodeId === id) return;
        vel[id].x *= DAMPING;
        vel[id].y *= DAMPING;
        pos[id].x += vel[id].x * DT;
        pos[id].y += vel[id].y * DT;
        if (Math.abs(vel[id].x) > SETTLE_THRESH || Math.abs(vel[id].y) > SETTLE_THRESH) anyMoving = true;
      });

      setRenderTick(t => t + 1);

      if (anyMoving || drag) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // ── Node drag ─────────────────────────────────────────────────────
  const handleNodePointerDown = useCallback((e, node) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    const { nodes } = graphRef.current;
    const groupIds = new Set([node.id]);

    if (node.isParent) {
      nodes.forEach(n => { if (n.parentId === node.id) groupIds.add(n.id); });
    } else if (node.parentId) {
      const parent = nodes.find(n => n.id === node.parentId);
      if (parent) {
        groupIds.add(parent.id);
        nodes.forEach(n => { if (n.parentId === parent.id) groupIds.add(n.id); });
      }
    }

    dragRef.current = {
      nodeId: node.id, groupIds,
      prevX: e.clientX, prevY: e.clientY,
      startX: e.clientX, startY: e.clientY,
      vx: 0, vy: 0, moved: false,
    };

    groupIds.forEach(id => { if (velRef.current[id]) velRef.current[id] = { x: 0, y: 0 }; });
    startLoop();
  }, [startLoop]);

  const handleCanvasPointerMove = useCallback((e) => {
    if (dragRef.current) {
      const { nodeId, prevX, prevY, startX, startY } = dragRef.current;
      const rawDx = e.clientX - prevX;
      const rawDy = e.clientY - prevY;

      if (!dragRef.current.moved &&
          (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4)) {
        dragRef.current.moved = true;
      }
      if (!dragRef.current.moved) return;

      const dx = rawDx / zoom;
      const dy = rawDy / zoom;

      if (posRef.current[nodeId]) {
        posRef.current[nodeId].x += dx;
        posRef.current[nodeId].y += dy;
      }

      dragRef.current.vx = dx;
      dragRef.current.vy = dy;

      dragRef.current.groupIds.forEach(id => {
        if (id === nodeId) return;
        if (velRef.current[id]) {
          velRef.current[id].x += dx * DRAG_K;
          velRef.current[id].y += dy * DRAG_K;
        }
      });

      dragRef.current.prevX = e.clientX;
      dragRef.current.prevY = e.clientY;
      return;
    }

    if (panRef.current) {
      const dx = e.clientX - panRef.current.startPointerX;
      const dy = e.clientY - panRef.current.startPointerY;
      setPan({ x: panRef.current.startPanX + dx, y: panRef.current.startPanY + dy });
    }
  }, [zoom]);

  const handleCanvasPointerUp = useCallback((e) => {
    if (dragRef.current) {
      const { nodeId, moved, vx, vy } = dragRef.current;
      if (!moved) {
        const { nodes } = graphRef.current;
        const node = nodes.find(n => n.id === nodeId);
        if (node) setSelectedNode(prev => prev?.id === node.id ? null : node);
      } else {
        if (velRef.current[nodeId]) {
          velRef.current[nodeId].x = vx;
          velRef.current[nodeId].y = vy;
        }
      }
      dragRef.current = null;
      startLoop();
      return;
    }
    panRef.current = null;
  }, [startLoop]);

  const handleCanvasPointerDown = useCallback((e) => {
    if (dragRef.current) return;
    panRef.current = {
      startPointerX: e.clientX, startPointerY: e.clientY,
      startPanX: pan.x, startPanY: pan.y,
    };
  }, [pan]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setZoom(z => Math.min(Math.max(z + (e.deltaY > 0 ? -0.08 : 0.08), 0.3), 2.5));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleSendToBob = (node) => {
    onSendToBob?.({ title: node.title, content: node.content });
    setSelectedNode(null);
  };

  const { nodes, edges } = graphRef.current;

  return (
    <div className="pm-wrapper">
      <div className="pm-tab-bar">
        <button className={`pm-tab ${view === 'map'  ? 'active' : ''}`} onClick={() => setView('map')}>
          <Map size={15} /> Practice Map
        </button>
        <button className={`pm-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
          <List size={15} /> Notebook
        </button>
      </div>

      {view === 'list' ? (
        <Notebook
          notebooks={notebooks} setNotebooks={setNotebooks}
          activePageId={activePageId} setActivePageId={setActivePageId}
          isGuest={isGuest}
        />
      ) : (
        <div
          className="pm-map-container"
          ref={containerRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={() => { dragRef.current = null; panRef.current = null; }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div className="pm-zoom-controls">
            <button onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))} title="Zoom in"><ZoomIn size={16} /></button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.3))} title="Zoom out"><ZoomOut size={16} /></button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Reset"><Maximize2 size={16} /></button>
          </div>

          <div
            className="pm-canvas"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: CW, height: CH,
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <ConnectionLines edges={edges} nodePositions={posRef.current} canvasSize={{ w: CW, h: CH }} />

            {nodes.map(node => {
              const pos = posRef.current[node.id] || { x: node.defaultX, y: node.defaultY };
              return (
                <NodeBubble
                  key={node.id}
                  label={node.title}
                  isParent={node.isParent}
                  isSelected={selectedNode?.id === node.id}
                  color={node.color}
                  nodeId={node.id}
                  style={{ left: pos.x, top: pos.y, position: 'absolute', transform: 'translate(-50%,-50%)' }}
                  onPointerDown={(e) => handleNodePointerDown(e, node)}
                />
              );
            })}

            {nodes.length === 0 && (
              <div className="pm-empty">
                <BookOpen size={48} strokeWidth={1} />
                <p>No notes with sub-notes yet. Add child notes under a page in the Notebook view!</p>
              </div>
            )}
          </div>

          <PreviewPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSendToBob={handleSendToBob}
          />
        </div>
      )}
    </div>
  );
}
