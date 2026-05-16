import { useState } from 'react';
import { X, Send, Lock, BookOpen, FileText, CheckCircle, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './NotesDashboard.css';

export default function PracticeMap({ isOpen, onClose, notebooks, setNotebooks, setActivePageId, isGuest }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionType, setSelectionType] = useState(null); // 'parent' | 'child'
  const [previewContent, setPreviewContent] = useState(null);
  const [bobResponse, setBobResponse] = useState(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  if (!isOpen) return null;

  const handleParentClick = (notebook) => {
    // Select all pages from this notebook
    const pageIds = notebook.pages.map(p => p.id);
    setSelectedItems([notebook.id, ...pageIds]);
    setSelectionType('parent');
    
    // Combine all page content for preview
    const combinedContent = notebook.pages
      .map(page => `## ${page.title}\n\n${page.content}`)
      .join('\n\n---\n\n');
    
    setPreviewContent({
      title: `${notebook.name} (${notebook.pages.length} notes)`,
      content: combinedContent,
      metadata: {
        notebookName: notebook.name,
        pageCount: notebook.pages.length,
        wordCount: combinedContent.split(/\s+/).length
      }
    });
    setBobResponse(null);
  };

  const handleChildClick = (page, notebookName) => {
    // Select only this page
    setSelectedItems([page.id]);
    setSelectionType('child');
    
    setPreviewContent({
      title: page.title,
      content: page.content,
      metadata: {
        notebookName,
        pageCount: 1,
        wordCount: page.content.split(/\s+/).length
      }
    });
    setBobResponse(null);
  };

  const sendToBob = async () => {
    if (!previewContent || isGuest) return;
    
    setIsLoadingResponse(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: previewContent.content,
          practiceMapMode: true,
          history: []
        })
      });
      
      const data = await response.json();
      
      // Parse structured response
      const parsed = parseStructuredResponse(data.text);
      setBobResponse(parsed);
    } catch (err) {
      console.error('Failed to get Bob response:', err);
      setBobResponse({
        error: 'Failed to connect to Bob. Make sure the server is running.'
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const parseStructuredResponse = (text) => {
    const sections = {
      smallWin: '',
      pattern: '',
      nextFocus: ''
    };

    // Extract sections using emoji markers
    const smallWinMatch = text.match(/🎉\s*Small Win[:\s]*([\s\S]*?)(?=🔍|$)/i);
    const patternMatch = text.match(/🔍\s*Pattern\/Observation[:\s]*([\s\S]*?)(?=🎯|$)/i);
    const nextFocusMatch = text.match(/🎯\s*Next Practice Focus[:\s]*([\s\S]*?)$/i);

    if (smallWinMatch) sections.smallWin = smallWinMatch[1].trim();
    if (patternMatch) sections.pattern = patternMatch[1].trim();
    if (nextFocusMatch) sections.nextFocus = nextFocusMatch[1].trim();

    // Fallback: if structured format not found, use the whole text
    if (!sections.smallWin && !sections.pattern && !sections.nextFocus) {
      sections.pattern = text;
    }

    return sections;
  };

  const saveToNotebook = () => {
    if (!bobResponse || isGuest) return;

    // Format the response into a nice markdown document
    const formattedContent = `# Bob's Notes Review
**Date**: ${new Date().toLocaleDateString()}

## 🎉 Small Win
${bobResponse.smallWin || 'N/A'}

## 🔍 Pattern/Observation
${bobResponse.pattern || 'N/A'}

## 🎯 Next Practice Focus
${bobResponse.nextFocus || 'N/A'}

---
*Generated from Notes Dashboard review of: ${previewContent?.title || 'Selected notes'}*`;

    // Create new page in Personal notebook (id: 1)
    const pageId = Date.now();
    const newPage = {
      id: pageId,
      title: `Notes Review - ${new Date().toLocaleDateString()}`,
      content: formattedContent
    };

    setNotebooks(prev =>
      prev.map(nb =>
        nb.id === 1
          ? { ...nb, expanded: true, pages: [...nb.pages, newPage] }
          : nb
      )
    );

    setActivePageId(pageId);
    alert('✅ Bob\'s feedback saved to your Personal notebook!');
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setSelectionType(null);
    setPreviewContent(null);
    setBobResponse(null);
  };

  const isSelected = (id) => selectedItems.includes(id);

  return (
    <div className="practice-map-overlay" onClick={onClose}>
      <div className="practice-map-modal" onClick={(e) => e.stopPropagation()}>
        <div className="practice-map-header">
          <div className="practice-map-title">
            <BookOpen size={24} />
            <h2>Notes Dashboard</h2>
          </div>
          <button className="practice-map-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="practice-map-body">
          <div className="practice-map-canvas">
            <div className="practice-map-instructions">
              <p>Select a notebook to review all notes together, or click individual notes for focused feedback.</p>
            </div>

            {notebooks.map(notebook => (
              <div key={notebook.id} className="practice-map-group">
                <div
                  className={`practice-map-parent-card ${isSelected(notebook.id) ? 'selected' : ''}`}
                  onClick={() => handleParentClick(notebook)}
                >
                  <div className="parent-card-header">
                    <BookOpen size={20} />
                    <span className="parent-card-badge">{notebook.pages.length}</span>
                  </div>
                  <h3>{notebook.name}</h3>
                  <p className="parent-card-subtitle">{notebook.pages.length} notes</p>
                  {isSelected(notebook.id) && (
                    <div className="card-selected-indicator">
                      <CheckCircle size={24} />
                    </div>
                  )}
                </div>

                <div className="practice-map-children">
                  {notebook.pages.map(page => (
                    <div
                      key={page.id}
                      className={`practice-map-child-card ${isSelected(page.id) ? 'selected' : ''}`}
                      onClick={() => handleChildClick(page, notebook.name)}
                    >
                      <FileText size={16} />
                      <h4>{page.title}</h4>
                      <p className="child-card-preview">
                        {page.content.slice(0, 80)}
                        {page.content.length > 80 ? '...' : ''}
                      </p>
                      {isSelected(page.id) && (
                        <div className="card-selected-indicator">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="practice-map-preview">
            {previewContent ? (
              <>
                <div className="preview-header">
                  <h3>{previewContent.title}</h3>
                  <div className="preview-metadata">
                    <span>{previewContent.metadata.notebookName}</span>
                    <span>•</span>
                    <span>{previewContent.metadata.pageCount} note{previewContent.metadata.pageCount > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{previewContent.metadata.wordCount} words</span>
                  </div>
                  <button className="preview-clear" onClick={clearSelection}>
                    <X size={16} /> Clear
                  </button>
                </div>

                <div className="preview-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {previewContent.content}
                  </ReactMarkdown>

                  {bobResponse && !bobResponse.error && (
                    <div className="bob-response-panel">
                      <div className="bob-response-header">
                        <h3>Bob's Coaching Feedback</h3>
                        {!isGuest && (
                          <button
                            className="save-response-btn"
                            onClick={saveToNotebook}
                            title="Save to Notebook"
                          >
                            <Save size={14} />
                            Save
                          </button>
                        )}
                      </div>

                      {bobResponse.smallWin && (
                        <div className="bob-response-section small-win">
                          <h4>🎉 Small Win</h4>
                          <p>{bobResponse.smallWin}</p>
                        </div>
                      )}

                      {bobResponse.pattern && (
                        <div className="bob-response-section pattern">
                          <h4>🔍 Pattern/Observation</h4>
                          <p>{bobResponse.pattern}</p>
                        </div>
                      )}

                      {bobResponse.nextFocus && (
                        <div className="bob-response-section next-focus">
                          <h4>🎯 Next Practice Focus</h4>
                          <p>{bobResponse.nextFocus}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {bobResponse?.error && (
                    <div className="bob-response-error">
                      <p>{bobResponse.error}</p>
                    </div>
                  )}
                </div>

                <div className="preview-actions">
                  {isGuest ? (
                    <button className="send-to-bob-btn disabled" disabled>
                      <Lock size={18} />
                      Sign up to send to Bob
                    </button>
                  ) : (
                    <button
                      className="send-to-bob-btn"
                      onClick={sendToBob}
                      disabled={isLoadingResponse}
                    >
                      <Send size={18} />
                      {isLoadingResponse ? 'Sending to Bob...' : 'Send to Bob'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="preview-empty">
                <BookOpen size={48} strokeWidth={1} />
                <h3>No selection</h3>
                <p>Click a notebook or note card to preview content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
