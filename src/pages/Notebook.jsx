import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Plus, Trash2, ChevronRight, ChevronDown,
  FileText, Search, X, Menu, GripVertical
} from 'lucide-react';
import './Notebook.css';

const DEFAULT_NOTEBOOKS = [
  {
    id: 1,
    name: 'Personal',
    expanded: true,
    pages: [
      { id: 101, title: 'Welcome to RepLog', content: '# Welcome to RepLog\n\nStart writing your thoughts here...' },
      { id: 102, title: 'Goals', content: '# Goals\n\n- [ ] Learn something new\n- [ ] Build something great' },
    ],
  },
  {
    id: 2,
    name: 'Work',
    expanded: false,
    pages: [
      { id: 201, title: 'Meeting Notes', content: '# Meeting Notes\n\nDate: ...' },
    ],
  },
];

export default function Notebook() {
  const [notebooks, setNotebooks] = useState(DEFAULT_NOTEBOOKS);
  const [activePageId, setActivePageId] = useState(101);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameRef = useRef(null);

  const activePage = notebooks
    .flatMap(nb => nb.pages)
    .find(p => p.id === activePageId);

  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus();
  }, [renamingId]);

  const addNotebook = () => {
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
    setNotebooks(prev => prev.filter(nb => nb.id !== id));
  };

  const addPage = (notebookId) => {
    const pageId = Date.now();
    const newPage = { id: pageId, title: 'Untitled', content: '' };
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
      prev.map(nb =>
        nb.id === notebookId
          ? { ...nb, pages: nb.pages.filter(p => p.id !== pageId) }
          : nb
      )
    );
    if (activePageId === pageId) setActivePageId(null);
  };

  const updatePageContent = (content) => {
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

  const filteredNotebooks = notebooks.map(nb => ({
    ...nb,
    pages: nb.pages.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(nb => !searchQuery || nb.pages.length > 0);

  return (
    <div className="notebook-layout">
      <aside className={`nb-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="nb-sidebar-header">
          <div className="nb-brand">
            <BookOpen size={18} />
            <span>Notebooks</span>
          </div>
          <button className="nb-icon-btn" onClick={() => setSidebarOpen(false)} title="Close sidebar">
            <X size={16} />
          </button>
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
                  <span className="nb-group-name" onDoubleClick={() => { setRenamingId(nb.id); setRenameValue(nb.name); }}>
                    {nb.name}
                  </span>
                )}

                <div className="nb-group-actions">
                  <button className="nb-icon-btn" title="Add page" onClick={() => addPage(nb.id)}>
                    <Plus size={13} />
                  </button>
                  <button className="nb-icon-btn danger" title="Delete notebook" onClick={() => deleteNotebook(nb.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {nb.expanded && (
                <div className="nb-pages">
                  {nb.pages.map(page => (
                    <div
                      key={page.id}
                      className={`nb-page-item ${activePageId === page.id ? 'active' : ''}`}
                      onClick={() => setActivePageId(page.id)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/replog-note', JSON.stringify({
                          title: page.title,
                          content: page.content
                        }));
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      <GripVertical size={12} className="nb-drag-handle" />
                      <FileText size={13} />
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
                        <span onDoubleClick={(e) => { e.stopPropagation(); setRenamingId(page.id); setRenameValue(page.title); }}>
                          {page.title}
                        </span>
                      )}
                      <button
                        className="nb-icon-btn danger page-delete"
                        title="Delete page"
                        onClick={e => { e.stopPropagation(); deletePage(nb.id, page.id); }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {nb.pages.length === 0 && (
                    <div className="nb-empty-pages">No pages yet</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="nb-add-notebook" onClick={addNotebook}>
          <Plus size={14} />
          New Notebook
        </button>
      </aside>

      <main className="nb-editor">
        {!sidebarOpen && (
          <button className="nb-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>
        )}

        {activePage ? (
          <>
            <div className="nb-editor-header">
              <input
                className="nb-page-title-input"
                value={activePage.title}
                onChange={e => updatePageTitle(activePageId, e.target.value)}
                placeholder="Untitled"
              />
            </div>
            <textarea
              className="nb-editor-body"
              value={activePage.content}
              onChange={e => updatePageContent(e.target.value)}
              placeholder="Start writing... (Markdown supported)"
              spellCheck={false}
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
    </div>
  );
}