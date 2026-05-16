import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import './App.css'
import './Chat.css'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hey there! I am Bob, your AI coach. How was your practice session today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: inputVal.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
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

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-brand" style={{textDecoration: 'none'}}>RepLog.</Link>
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
          <Route path="/features" element={<div style={{padding: '10rem', textAlign: 'center', minHeight: '80vh'}}><h1>Features (Coming Soon)</h1></div>} />
          <Route path="/about" element={<div style={{padding: '10rem', textAlign: 'center', minHeight: '80vh'}}><h1>About IBM Bob (Coming Soon)</h1></div>} />
        </Routes>

        {/* Global Floating Action Button */}
        <button 
          className="chat-fab" 
          onClick={() => setIsChatOpen(true)}
          style={{ display: isChatOpen ? 'none' : 'flex' }}
        >
          <MessageCircle size={30} />
        </button>

        {/* Global Chat Drawer Side Panel */}
        <div className={`chat-drawer ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <h2><Bot size={24} /> IBM Bob</h2>
            <button className="close-btn" onClick={() => setIsChatOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                {msg.text}
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
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <div className="chat-input-wrapper">
              <input 
                type="text" 
                className="chat-input"
                placeholder="Record your practice log..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button 
                type="submit" 
                className="chat-send-btn"
                disabled={isTyping || !inputVal.trim()}
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
