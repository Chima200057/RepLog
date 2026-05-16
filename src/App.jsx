import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, LogIn, LogOut, User, RefreshCw, MessageSquare, History, Save, Trash2, ChevronRight } from 'lucide-react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Notebook from './pages/Notebook'
import AuthModal from './components/AuthModal'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import './Chat.css'

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

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // -- USER & AUTH STATE --
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('replog_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [guestChatCount, setGuestChatCount] = useState(() => {
    return parseInt(localStorage.getItem('replog_guest_count') || '0');
  });

  // -- SESSION MANAGEMENT --
  const [sessions, setSessions] = useState(() => {
    const savedUser = localStorage.getItem('replog_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    if (!userObj) return []; // Don't persist sessions for guests
    const saved = localStorage.getItem('replog_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingCards, setPendingCards] = useState([]); 
  
  const [notebooks, setNotebooks] = useState(() => {
    const savedUser = localStorage.getItem('replog_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    if (!userObj) return DEFAULT_NOTEBOOKS; // Always use defaults for guests
    const saved = localStorage.getItem('replog_notebooks');
    return saved ? JSON.parse(saved) : DEFAULT_NOTEBOOKS;
  });
  
  const [activePageId, setActivePageId] = useState(() => {
    const saved = localStorage.getItem('replog_active_page');
    return saved ? JSON.parse(saved) : 101;
  });

  const messagesEndRef = useRef(null);

  // Sync states to local storage
  useEffect(() => {
    localStorage.setItem('replog_user', JSON.stringify(user));
    if (!user) {
      localStorage.setItem('replog_guest_count', guestChatCount.toString());
    }
  }, [user, guestChatCount]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('replog_sessions', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('replog_sessions');
    }
  }, [sessions, user]);

  useEffect(() => {
    if (currentSessionId) {
      const activeSession = sessions.find(s => s.id === currentSessionId);
      if (activeSession) setMessages(activeSession.messages);
    } else {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('replog_notebooks', JSON.stringify(notebooks));
    } else {
      localStorage.removeItem('replog_notebooks');
    }
  }, [notebooks, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('replog_active_page', JSON.stringify(activePageId));
    }
  }, [activePageId, user]);

  const startNewChat = () => {
    const newId = Date.now();
    const welcomeMsg = { 
      id: 1, 
      role: 'bot', 
      text: 'Hey there! I am Bob, your AI coach. How was your practice session today?', 
      canSave: false 
    };
    const newSession = {
      id: newId,
      title: 'New Coaching Session',
      timestamp: new Date().toISOString(),
      messages: [welcomeMsg]
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
  };

  const resumeChat = (id) => {
    setCurrentSessionId(id);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) setCurrentSessionId(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSessionId(null);
    setSessions([]);
    setNotebooks(DEFAULT_NOTEBOOKS);
    setActivePageId(101);
    setGuestChatCount(0);
    localStorage.removeItem('replog_sessions');
    localStorage.removeItem('replog_chat');
    localStorage.removeItem('replog_notebooks');
    localStorage.removeItem('replog_active_page');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() && pendingCards.length === 0) return;

    if (!user && guestChatCount >= 3) {
      alert("You've reached your 3-chat limit as a guest! Please sign up to continue your coaching with Bob.");
      setIsAuthOpen(true);
      return;
    }

    const userText = inputVal;
    setInputVal('');

    let combinedText = '';
    if (pendingCards.length > 0) {
      combinedText += pendingCards
        .map(c => `Note: "${c.title}"\n${c.content}`)
        .join('\n\n---\n\n');
    }
    if (userText.trim()) {
      combinedText += (combinedText ? '\n\n' : '') + userText.trim();
    }

    const newUserMsg = { 
      id: Date.now(), 
      role: 'user', 
      text: userText,
      type: pendingCards.length > 0 ? 'note-card-message' : 'text',
      cards: [...pendingCards]
    };
    
    const updatedMessages = [...messages, newUserMsg];
    
    setSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: updatedMessages } : s
    ));
    
    if (!user) setGuestChatCount(prev => prev + 1);
    setPendingCards([]);
    setIsTyping(true);

    try {
      const history = updatedMessages.slice(-5).map(m => ({ role: m.role, text: m.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: combinedText, history })
      });
      const data = await response.json();
      
      const newBotMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.text || 'Error connecting to Bob.',
        title: data.title || "Bob's Advice"
      };

      const finalMessages = [...updatedMessages, newBotMsg];
      
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { 
              ...s, 
              messages: finalMessages, 
              title: s.messages.length <= 2 ? (data.title || s.title) : s.title 
            } 
          : s
      ));
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Failed to reach the server. Make sure you are running `node server/index.js` in a second terminal!'
      };
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/replog-note');
    if (!raw) return;
    const { title, content } = JSON.parse(raw);
    setIsChatOpen(true);
    setPendingCards(prev => [...prev, {
      id: Date.now(),
      title,
      content,
      preview: content.slice(0, 120) + (content.length > 120 ? '...' : ''),
    }]);
  };

  const saveToNotebook = (text, customTitle) => {
    const pageId = Date.now();
    const displayTitle = customTitle 
      ? `${customTitle} (${new Date().toLocaleDateString()})`
      : `Bob's Advice (${new Date().toLocaleDateString()})`;

    const newPage = { id: pageId, title: displayTitle, content: text };
    
    setNotebooks(prev =>
      prev.map(nb => nb.id === 1 ? { ...nb, expanded: true, pages: [...nb.pages, newPage] } : nb)
    );
    setActivePageId(pageId);
    alert('Advice saved to your Personal notebook!');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>RepLog.</Link>
          <div className="nav-links">
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How it Works</Link>
            <Link to="/about">About IBM Bob</Link>
          </div>
          
          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                <span className="user-name"><User size={16} /> {user.name}</span>
                <button className="btn-secondary" onClick={handleLogout}><LogOut size={16} /> Logout</button>
              </div>
            ) : (
              <>
                <button className="btn-primary" onClick={() => setIsAuthOpen(true)}><LogIn size={16} /> Sign In</button>
                <button className="btn-primary" onClick={() => setIsChatOpen(true)}>Get Started</button>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home onOpenChat={() => setIsChatOpen(true)} />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Notebook 
            notebooks={notebooks} 
            setNotebooks={setNotebooks} 
            activePageId={activePageId} 
            setActivePageId={setActivePageId} 
            isGuest={!user}
          />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <button
          className="chat-fab"
          onClick={() => setIsChatOpen(true)}
          style={{ display: isChatOpen ? 'none' : 'flex' }}
        >
          <MessageCircle size={30} />
        </button>

        <div
          className={`chat-drawer ${isChatOpen ? 'open' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="chat-header">
            <div className="chat-header-left">
              {currentSessionId && (
                <button className="back-btn" onClick={() => setCurrentSessionId(null)} title="Back to Sessions">
                  <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}
              <h2><Bot size={24} /> IBM Bob</h2>
            </div>
            <button className="close-btn" onClick={() => setIsChatOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="chat-body">
            {!user && (
              <div className="guest-warning">
                <div className="guest-warning-content">
                  <strong>Guest Mode:</strong> {3 - guestChatCount} chats remaining. 
                  <span>Register to save notes permanently!</span>
                </div>
              </div>
            )}

            {!currentSessionId ? (
              <div className="session-selector">
                <div className="session-selector-header">
                  <MessageSquare size={32} />
                  <h3>Coaching Sessions</h3>
                  <p>Pick up where you left off or start fresh.</p>
                </div>

                <div className="session-options">
                  <button className="new-session-btn" onClick={startNewChat}>
                    <RefreshCw size={18} />
                    <span>Start New Session</span>
                  </button>

                  {sessions.length > 0 && (
                    <div className="previous-sessions">
                      <h4><History size={14} /> Previous Conversations</h4>
                      {sessions.map(s => (
                        <div key={s.id} className="session-item" onClick={() => resumeChat(s.id)}>
                          <div className="session-info">
                            <span className="session-title">{s.title}</span>
                            <span className="session-time">{new Date(s.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="session-actions">
                            <button className="session-resume">Resume</button>
                            <button className="session-delete" onClick={(e) => deleteSession(e, s.id)} title="Delete session">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role} ${msg.type === 'note-card-message' ? 'note-card-message' : ''}`}>
                    {msg.type === 'note-card-message' ? (
                      <>
                        {msg.cards.map((card, i) => (
                          <div key={i} className="note-card-bubble">
                            <span className="note-card-icon">📄</span>
                            <div className="note-card-info">
                              <span className="note-card-title">{card.title}</span>
                              <span className="note-card-preview">{card.preview}</span>
                            </div>
                          </div>
                        ))}
                        {msg.text && <p className="note-card-user-text">{msg.text}</p>}
                      </>
                    ) : (
                      <>
                        {msg.role === 'bot' ? (
                          <>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            {msg.canSave !== false && user && (
                              <button 
                                className="save-advice-btn"
                                onClick={() => saveToNotebook(msg.text, msg.title)}
                                title="Save to Notebook"
                              >
                                <Save size={14} /> Save to Notebook
                              </button>
                            )}
                            {!user && msg.canSave !== false && (
                              <div className="guest-save-blocked">
                                <span>Sign up to save this to your notebook!</span>
                              </div>
                            )}
                          </>
                        ) : (
                          msg.text
                        )}
                      </>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot typing-indicator">
                    Bob is thinking
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {currentSessionId && (
            <form className="chat-footer" onSubmit={handleSend}>
              {pendingCards.length > 0 && (
                <div className="pending-cards">
                  {pendingCards.map(card => (
                    <div key={card.id} className="pending-card">
                      <span className="pending-card-icon">📄</span>
                      <div className="pending-card-info">
                        <span className="pending-card-title">{card.title}</span>
                      </div>
                      <button type="button" className="pending-card-remove" onClick={() => setPendingCards(prev => prev.filter(c => c.id !== card.id))}>
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="chat-input-wrapper">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Record your practice log..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <button type="submit" className="chat-send-btn" disabled={isTyping}>
                  <Send size={18} />
                </button>
              </div>
            </form>
          )}
        </div>

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)}
          onLogin={(userData) => {
            setUser(userData);
            // Atomically load user data to prevent overwriting with guest defaults
            const savedSessions = localStorage.getItem('replog_sessions');
            if (savedSessions) setSessions(JSON.parse(savedSessions));
            const savedNotebooks = localStorage.getItem('replog_notebooks');
            if (savedNotebooks) setNotebooks(JSON.parse(savedNotebooks));
          }}
          onSignup={(userData) => {
            setUser(userData);
            setSessions([]);
            setNotebooks(DEFAULT_NOTEBOOKS);
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App