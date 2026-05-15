import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import './App.css'
import './Chat.css'

function App() {
  const [hoveredCard, setHoveredCard] = useState(null);
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

    // Mock Backend / WatsonX API request delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: 'That sounds like solid progress for a practice log! In the mean time, I am waiting for the Express backend to be wired up to IBM watsonx.ai so I can give you real analysis.'
      }]);
    }, 1500);
  };

  const features = [
    {
      id: 1,
      icon: "🎯",
      title: "Precision Tracking",
      desc: "Log every nuance of your practice sessions. Identify patterns and track tangible progression."
    },
    {
      id: 2,
      icon: "🧠",
      title: "Powered by IBM Bob",
      desc: "Advanced AI-driven analysis provides contextual feedback tailored to your exact learning curve."
    },
    {
      id: 3,
      icon: "📈",
      title: "Dynamic Micro-Goals",
      desc: "Break through plateaus. RepLog assigns you adaptive micro-goals to ensure you just get better."
    }
  ];

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">RepLog.</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#about">About IBM Bob</a>
        </div>
        <button className="btn-primary">Get Started</button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-badge">AI-Powered Practice Journal</div>
          <h1>The practice journal that coaches everything.</h1>
          <p>
            You just get better. Powered by IBM Bob, RepLog transforms the traditional practice log into a proactive, interactive, and intelligent coaching experience.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setIsChatOpen(true)}>Consult Bob</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </section>

        <section className="features" id="features">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="feature-card"
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === feature.id ? 'translateY(-10px) scale(1.02)' : 'none',
              }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Floating Action Button */}
      <button 
        className="chat-fab" 
        onClick={() => setIsChatOpen(true)}
        style={{ display: isChatOpen ? 'none' : 'flex' }}
      >
        <MessageCircle size={30} />
      </button>

      {/* Chat Drawer Side Panel */}
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
  )
}

export default App
