import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import './App.css'
import './Chat.css'
import Notebook from './pages/Notebook';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hey there! I am Bob, your AI coach. How was your practice session today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingCards, setPendingCards] = useState([]); // ✅ staged note cards
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() && pendingCards.length === 0) return;

    // Build combined message for Bob
    let combinedText = '';
    if (pendingCards.length > 0) {
      combinedText += pendingCards
        .map(c => `Note: "${c.title}"\n${c.content}`)
        .join('\n\n---\n\n');
    }
    if (inputVal.trim()) {
      combinedText += (combinedText ? '\n\n' : '') + inputVal.trim();
    }

    // What the user sees in chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      type: pendingCards.length > 0 ? 'note-card-message' : 'text',
      text: inputVal.trim(),
      cards: [...pendingCards],
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setPendingCards([]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: combinedText })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: data.text || 'Error connecting to Bob.'
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Failed to reach the server. Make sure you are running `node server/index.js` in a second terminal!'
      }]);
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

  const removePendingCard = (id) => {
    setPendingCards(prev => prev.filter(c => c.id !== id));
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
          <button className="btn-primary" onClick={() => setIsChatOpen(true)}>Get Started</button>
        </nav>

        <Routes>
          <Route path="/" element={<Home onOpenChat={() => setIsChatOpen(true)} />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Notebook />} />
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
            <h2><Bot size={24} /> IBM Bob</h2>
            <button className="close-btn" onClick={() => setIsChatOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              msg.type === 'note-card-message' ? (
                <div key={msg.id} className="message user note-card-message">
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
                </div>
              ) : (
                <div key={msg.id} className={`message ${msg.role}`}>
                  {msg.text}
                </div>
              )
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
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            {/* ✅ Pending cards staging area */}
            {pendingCards.length > 0 && (
              <div className="pending-cards">
                {pendingCards.map(card => (
                  <div key={card.id} className="pending-card">
                    <span className="pending-card-icon">📄</span>
                    <div className="pending-card-info">
                      <span className="pending-card-title">{card.title}</span>
                      <span className="pending-card-preview">{card.preview}</span>
                    </div>
                    <button
                      type="button"
                      className="pending-card-remove"
                      onClick={() => removePendingCard(card.id)}
                      title="Remove"
                    >
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
                placeholder={pendingCards.length > 0 ? "Add a message or just send..." : "Record your practice log..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isTyping || (!inputVal.trim() && pendingCards.length === 0)}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App