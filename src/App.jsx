import { useState } from 'react'
import './App.css'

function App() {
  const [hoveredCard, setHoveredCard] = useState(null);

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
            <button className="btn-primary">Start Practicing</button>
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
    </div>
  )
}

export default App
