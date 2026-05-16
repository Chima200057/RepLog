import { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Plus, Trash2, ChevronRight, ChevronDown,
  FileText, Search, X, Menu, GripVertical, ArrowRight, ArrowLeft, LayoutDashboard
} from 'lucide-react';
import NotesDashboard from '../components/NotesDashboard';
import './Notebook.css';

export default function Notebook({ notebooks, setNotebooks, activePageId, setActivePageId, isGuest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [collapsedPages, setCollapsedPages] = useState({});
  const [dragState, setDragState] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [isPracticeMapOpen, setIsPracticeMapOpen] = useState(false);
  const renameRef = useRef(null);
  const dragNodeRef = useRef(null);

  const activePage = notebooks
    .flatMap(nb => nb.pages)
    .find(p => p.id === activePageId);

  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  const addNotebook = () => {
    if (isGuest) return;
    const id = Date.now();
    setNotebooks(prev => [...prev, { id, name: 'New Notebook', expanded: true, pages: [] }]);
    setRenamingId(id);
    setRenameValue('New Notebook');
  };

  const toggleNotebook = (id) => {
    setNotebooks(prev =>
      prev.map(nb => nb.id === id ? { ...nb, expanded: !nb.expanded } : nb)
    );
  };

  const deleteNotebook = (id) => {
    if (isGuest) return;
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
  };

  const addPage = (notebookId) => {
    if (isGuest) return;
    const pageId = Date.now();
    const newPage = { id: pageId, title: 'Untitled', content: '', parentId: null, children: [] };
    setNotebooks(prev =>
      prev.map(nb =>
        nb.id === notebookId
          ? { ...nb, expanded: true, pages: [...nb.pages, newPage] }
          : nb
      )
    );
    setActivePageId(pageId);
    setRenamingId(pageId);
    setRenameValue('Untitled');
  };

  const deletePage = (notebookId, pageId) => {
    setNotebooks(prev =>
      prev.map(nb => {
        if (nb.id !== notebookId) return nb;
        const updatedPages = nb.pages
          .filter(p => p.id !== pageId)
          .map(p => {
            if (p.children?.includes(pageId))
              return { ...p, children: p.children.filter(cid => cid !== pageId) };
            if (p.parentId === pageId)
              return { ...p, parentId: null };
            return p;
          });
        return { ...nb, pages: updatedPages };
      })
    );
    if (activePageId === pageId) setActivePageId(null);
  };

  const updatePageContent = (content) => {
    if (isGuest) return;
    setNotebooks(prev =>
      prev.map(nb => ({
        ...nb,
        pages: nb.pages.map(p =>
          p.id === activePageId ? { ...p, content } : p
        ),
      }))
    );
  };

  const updatePageTitle = (pageId, title) => {
    setNotebooks(prev =>
      prev.map(nb => ({
        ...nb,
        pages: nb.pages.map(p => p.id === pageId ? { ...p, title } : p),
      }))
    );
  };

  const updateNotebookName = (id, name) => {
    setNotebooks(prev =>
      prev.map(nb => nb.id === id ? { ...nb, name } : nb)
    );
  };

  const commitRename = () => {
    if (!renamingId) return;
    const isNotebook = notebooks.some(nb => nb.id === renamingId);
    if (isNotebook) updateNotebookName(renamingId, renameValue || 'Untitled');
    else updatePageTitle(renamingId, renameValue || 'Untitled');
    setRenamingId(null);
  };

  const indentPage = (notebookId, pageId) => {
    setNotebooks(prev =>
      prev.map(nb => {
        if (nb.id !== notebookId) return nb;
        const pages = nb.pages;
        const idx = pages.findIndex(p => p.id === pageId);
        const parentPage = [...pages.slice(0, idx)].reverse().find(p => p.parentId === null);
        if (!parentPage) return nb;
        const updatedPages = pages.map(p => {
          if (p.id === pageId) return { ...p, parentId: parentPage.id };
          if (p.id === parentPage.id) return { ...p, children: [...(p.children || []), pageId] };
          return p;
        });
        return { ...nb, pages: updatedPages };
      })
    );
  };

  const unindentPage = (notebookId, pageId) => {
    setNotebooks(prev =>
      prev.map(nb => {
        if (nb.id !== notebookId) return nb;
        const page = nb.pages.find(p => p.id === pageId);
        if (!page?.parentId) return nb;
        const updatedPages = nb.pages.map(p => {
          if (p.id === pageId) return { ...p, parentId: null };
          if (p.id === page.parentId) return { ...p, children: (p.children || []).filter(cid => cid !== pageId) };
          return p;
        });
        return { ...nb, pages: updatedPages };
      })
    );
  };

  const togglePageCollapse = (pageId) => {
    setCollapsedPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const movePage = (notebookId, draggedId, targetId, position) => {
    if (draggedId === targetId) return;
    setNotebooks(prev =>
      prev.map(nb => {
        if (nb.id !== notebookId) return nb;

        let pages = nb.pages.map(p => ({ ...p, children: [...(p.children || [])] }));

        const dragged = pages.find(p => p.id === draggedId);
        const target  = pages.find(p => p.id === targetId);
        if (!dragged || !target) return nb;

        // Prevent dropping into own descendant
        const isDescendant = (parentId, childId) => {
          const parent = pages.find(p => p.id === parentId);
          if (!parent) return false;
          if (parent.children.includes(childId)) return true;
          return parent.children.some(cid => isDescendant(cid, childId));
        };
        if (position === 'child' && isDescendant(draggedId, targetId)) return nb;

        // Detach from old parent
        if (dragged.parentId) {
          const oldParent = pages.find(p => p.id === dragged.parentId);
          if (oldParent) oldParent.children = oldParent.children.filter(c => c !== draggedId);
        }

        if (position === 'child') {
          dragged.parentId = targetId;
          target.children = [...target.children.filter(c => c !== draggedId), draggedId];
        } else {
          dragged.parentId = target.parentId ?? null;
          if (dragged.parentId) {
            const newParent = pages.find(p => p.id === dragged.parentId);
            if (newParent) {
              const kids = newParent.children.filter(c => c !== draggedId);
              const tIdx = kids.indexOf(targetId);
              kids.splice(position === 'before' ? tIdx : tIdx + 1, 0, draggedId);
              newParent.children = kids;
            }
          }
        }

        const result = [];
        const seen = new Set();

        const visit = (pageId) => {
          if (seen.has(pageId)) return;
          seen.add(pageId);
          const p = pages.find(x => x.id === pageId);
          if (p) {
            result.push(p);
            p.children.forEach(visit);
          }
        };

        const topLevel = pages.filter(p => (p.parentId ?? null) === null && p.id !== draggedId);

        if ((dragged.parentId ?? null) === null && position !== 'child') {
          const tIdx = topLevel.findIndex(p => p.id === targetId);
          if (tIdx === -1) topLevel.push(dragged);
          else topLevel.splice(position === 'before' ? tIdx : tIdx + 1, 0, dragged);
        }

        topLevel.forEach(p => visit(p.id));
        pages.forEach(p => { if (!seen.has(p.id)) result.push(p); });

        return { ...nb, pages: result };
      })
    );
  };

  // ── Pointer-based drag (works on touch + mouse, no ghost image issues) ──
  const INDENT_THRESHOLD = 40;

  const handlePointerDown = (e, page, notebookId) => {
    if (isGuest) return;
    // Only trigger on grip handle or left mouse button
    if (e.button !== undefined && e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    dragNodeRef.current = {
      pageId: page.id,
      notebookId,
      startX: e.clientX,
      startY: e.clientY,
      depth: page.parentId ? 1 : 0,
      moved: false,
    };

    setDragState({ pageId: page.id, notebookId });
  };

  const handlePointerMove = (e) => {
    if (!dragNodeRef.current) return;
    const { startX, startY } = dragNodeRef.current;
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);

    if (dx > 4 || dy > 4) {
      dragNodeRef.current.moved = true;
    }

    if (!dragNodeRef.current.moved) return;

    // Find element under pointer (excluding the dragged item)
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const pageItem = el.closest('[data-page-id]');
    if (!pageItem) {
      setDropTarget(null);
      return;
    }

    const targetPageId = parseInt(pageItem.dataset.pageId, 10);
    if (targetPageId === dragNodeRef.current.pageId) {
      setDropTarget(null);
      return;
    }

    const rect = pageItem.getBoundingClientRect();
    const pct = (e.clientY - rect.top) / rect.height;
    let position;
    if (pct < 0.25) position = 'before';
    else if (pct > 0.75) position = 'after';
    else position = 'child';

    const targetNotebookId = parseInt(pageItem.dataset.notebookId, 10);
    setDropTarget({ pageId: targetPageId, position, notebookId: targetNotebookId });
  };

  const handlePointerUp = (e) => {
    if (!dragNodeRef.current) return;

    const { pageId, notebookId, startX, depth, moved } = dragNodeRef.current;

    if (!moved) {
      // Treat as click — activate page
      dragNodeRef.current = null;
      setDragState(null);
      setDropTarget(null);
      return;
    }

    if (dropTarget) {
      movePage(dropTarget.notebookId || notebookId, pageId, dropTarget.pageId, dropTarget.position);
    } else {
      // Horizontal swipe for indent/unindent
      const dx = e.clientX - startX;
      if (dx > INDENT_THRESHOLD && depth === 0) {
        indentPage(notebookId, pageId);
      } else if (dx < -INDENT_THRESHOLD && depth > 0) {
        unindentPage(notebookId, pageId);
      }
    }

    dragNodeRef.current = null;
    setDragState(null);
    setDropTarget(null);
  };

  const handlePointerCancel = () => {
    dragNodeRef.current = null;
    setDragState(null);
    setDropTarget(null);
  };

  // ── Render pages recursively ──
  const renderPages = (pages, notebookId, parentId = null, depth = 0) => {
    return pages
      .filter(p => (p.parentId ?? null) === parentId)
      .map(page => {
        const hasChildren = pages.some(p => p.parentId === page.id);
        const isCollapsed = collapsedPages[page.id];
        const isDragging = dragState?.pageId === page.id;

        const dt = dropTarget?.pageId === page.id ? dropTarget : null;
        const showBefore = dt?.position === 'before';
        const showAfter = dt?.position === 'after';
        const showChild = dt?.position === 'child';

        const INDENT_PX = 16;
        const paddingLeft = `${0.5 + depth * (INDENT_PX / 16)}rem`;

        return (
          <div key={page.id} className="nb-page-tree-item">
            {depth > 0 && (
              <div
                className="nb-indent-track"
                style={{ left: `${(depth - 1) * INDENT_PX + 12}px` }}
              />
            )}

            {showBefore && (
              <div className="nb-drop-indicator nb-drop-indicator-before" style={{ marginLeft: paddingLeft }} />
            )}

            <div
              className={[
                'nb-page-item',
                activePageId === page.id ? 'active' : '',
                depth > 0 ? 'nb-page-child' : '',
                isDragging ? 'nb-dragging' : '',
                showChild ? 'nb-drop-into' : '',
              ].join(' ')}
              style={{ paddingLeft }}
              data-page-id={page.id}
              data-notebook-id={notebookId}
              onClick={() => {
                if (!dragNodeRef.current?.moved) setActivePageId(page.id);
              }}
            >
              <GripVertical
                size={12}
                className="nb-drag-handle"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handlePointerDown(e, page, notebookId);
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                style={{ touchAction: 'none', cursor: 'grab' }}
              />

              {hasChildren ? (
                <button
                  className="nb-icon-btn nb-collapse-btn"
                  onClick={e => { e.stopPropagation(); togglePageCollapse(page.id); }}
                  title={isCollapsed ? 'Expand children' : 'Collapse children'}
                >
                  {isCollapsed
                    ? <ChevronRight size={13} />
                    : <ChevronDown size={13} />
                  }
                </button>
              ) : (
                <span className="nb-page-icon-placeholder">
                  <FileText size={13} className="nb-page-icon" />
                </span>
              )}

              {renamingId === page.id ? (
                <input
                  ref={renameRef}
                  className="nb-rename-input"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={e => e.key === 'Enter' && commitRename()}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  className="nb-page-label"
                  onDoubleClick={(e) => {
                    if (isGuest) return;
                    e.stopPropagation();
                    setRenamingId(page.id);
                    setRenameValue(page.title);
                  }}
                >
                  {page.title}
                </span>
              )}

              <div className="nb-page-actions">
                {!isGuest && depth === 0 && (
                  <button
                    className="nb-icon-btn"
                    title="Indent (make child of note above)"
                    onClick={e => { e.stopPropagation(); indentPage(notebookId, page.id); }}
                  >
                    <ArrowRight size={11} />
                  </button>
                )}
                {!isGuest && depth > 0 && (
                  <button
                    className="nb-icon-btn"
                    title="Unindent (promote to top level)"
                    onClick={e => { e.stopPropagation(); unindentPage(notebookId, page.id); }}
                  >
                    <ArrowLeft size={11} />
                  </button>
                )}
                {!isGuest && (
                  <button
                    className="nb-icon-btn danger page-delete"
                    title="Delete page"
                    onClick={e => { e.stopPropagation(); deletePage(notebookId, page.id); }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>

            {showAfter && (
              <div className="nb-drop-indicator nb-drop-indicator-after" style={{ marginLeft: paddingLeft }} />
            )}

            {hasChildren && !isCollapsed && (
              <div className="nb-children">
                {renderPages(pages, notebookId, page.id, depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const filteredNotebooks = notebooks.map(nb => ({
    ...nb,
    pages: nb.pages.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(nb => !searchQuery || nb.pages.length > 0);

  return (
    <div
      className="notebook-layout"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <aside className={`nb-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="nb-sidebar-header">
          <div className="nb-brand">
            <BookOpen size={18} />
            <span>Notebooks</span>
          </div>
          <div className="nb-header-actions">
            <button
              className="nb-icon-btn practice-map-btn"
              onClick={() => setIsPracticeMapOpen(true)}
              title="Open Notes Dashboard"
            >
              <LayoutDashboard size={16} />
            </button>
            <button className="nb-icon-btn" onClick={() => setSidebarOpen(false)} title="Close sidebar">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="nb-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="nb-list">
          {filteredNotebooks.map(nb => (
            <div key={nb.id} className="nb-group">
              <div className="nb-group-header">
                <button className="nb-group-toggle" onClick={() => toggleNotebook(nb.id)}>
                  {nb.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {renamingId === nb.id ? (
                  <input
                    ref={renameRef}
                    className="nb-rename-input"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => e.key === 'Enter' && commitRename()}
                  />
                ) : (
                  <span
                    className="nb-group-name"
                    onDoubleClick={() => {
                      if (isGuest) return;
                      setRenamingId(nb.id);
                      setRenameValue(nb.name);
                    }}
                  >
                    {nb.name}
                  </span>
                )}

                <div className="nb-group-actions">
                  {!isGuest && (
                    <>
                      <button className="nb-icon-btn" title="Add page" onClick={() => addPage(nb.id)}>
                        <Plus size={13} />
                      </button>
                      <button className="nb-icon-btn danger" title="Delete notebook" onClick={() => deleteNotebook(nb.id)}>
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {nb.expanded && (
                <div className="nb-pages">
                  {renderPages(nb.pages, nb.id)}
                  {nb.pages.length === 0 && (
                    <div className="nb-empty-pages">No pages yet</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isGuest && (
          <button className="nb-add-notebook" onClick={addNotebook}>
            <Plus size={14} />
            New Notebook
          </button>
        )}
      </aside>

      <main className="nb-editor">
        {!sidebarOpen && (
          <button className="nb-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>
        )}

        {activePage ? (
          <>
            {isGuest && (
              <div className="nb-guest-banner">
                <BookOpen size={14} />
                <span>Guest Preview Mode: Sign in to create and edit notes.</span>
              </div>
            )}
            <div className="nb-editor-header">
              <input
                className="nb-page-title-input"
                value={activePage.title}
                onChange={e => updatePageTitle(activePageId, e.target.value)}
                placeholder="Untitled"
                disabled={isGuest}
              />
            </div>
            <textarea
              className={`nb-editor-body ${isGuest ? 'disabled' : ''}`}
              value={activePage.content}
              onChange={e => updatePageContent(e.target.value)}
              placeholder="Start writing... (Markdown supported)"
              spellCheck={false}
              readOnly={isGuest}
            />
          </>
        ) : (
          <div className="nb-empty-state">
            <BookOpen size={48} strokeWidth={1} />
            <h2>No page selected</h2>
            <p>Select a page from the sidebar or create a new one.</p>
          </div>
        )}
      </main>

      <NotesDashboard
        isOpen={isPracticeMapOpen}
        onClose={() => setIsPracticeMapOpen(false)}
        notebooks={notebooks}
        setNotebooks={setNotebooks}
        setActivePageId={setActivePageId}
        isGuest={isGuest}
      />
    </div>
  );
}
