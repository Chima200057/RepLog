import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Server, BrainCircuit, Activity } from 'lucide-react';

function HowItWorks() {
  return (
    <main>
      <section className="how-it-works page-layout" id="how-it-works" style={{ paddingTop: '8rem', minHeight: '80vh', paddingBottom: '5rem' }}>
        <div className="section-header" style={{ marginBottom: '6rem' }}>
          <h2>How it Works</h2>
          <p>The technical architecture behind your personal IBM WatsonX coach</p>
        </div>
        
        <div className="hiw-pipeline" style={{ flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="hiw-step" style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem' }}>
            <div className="step-number" style={{ flexShrink: 0 }}><Layers size={24} /></div>
            <div className="step-content">
              <h3>1. Frontend Logging & UI State</h3>
              <p>The entire interface is built using <strong>React</strong> and <strong>Vanilla CSS</strong> featuring dynamic glassmorphism and real-time state management. As you record your practice nuances, struggles, or successes into the global Chat Drawer, the frontend actively buffers your history via <code>useState</code> hooks, maintaining complete conversation context persistently across all navigation pages.</p>
            </div>
          </div>
          
          <div className="hiw-connector" style={{ width: '4px', height: '40px', background: 'linear-gradient(180deg, var(--glass-border), rgba(191, 64, 255, 0.5))' }}></div>
          
          <div className="hiw-step" style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem' }}>
            <div className="step-number" style={{ flexShrink: 0 }}><Server size={24} /></div>
            <div className="step-content">
              <h3>2. Secure Backend Orchestration</h3>
              <p>For security compliance, API keys are heavily restricted from the client. User transcripts are proxied to a robust <strong>Node.js / Express.js</strong> backend bridging port 3001. Here, the server initializes the official <code>@ibm-cloud/watsonx-ai</code> SDK using <code>IamAuthenticator</code> to establish a verified token exchange sequence directly with IBM Cloud IAM.</p>
            </div>
          </div>
          
          <div className="hiw-connector" style={{ width: '4px', height: '40px', background: 'linear-gradient(180deg, var(--glass-border), rgba(191, 64, 255, 0.5))' }}></div>
          
          <div className="hiw-step" style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem' }}>
            <div className="step-number" style={{ flexShrink: 0 }}><BrainCircuit size={24} /></div>
            <div className="step-content">
              <h3>3. Foundation Model Execution (IBM Granite)</h3>
              <p>The backend wraps the user's raw log in highly tuned prompt engineering instructions commanding the AI to act as a supportive, analytical coach. This prompt payload is securely transmitted over HTTPS directly to the <code>ibm/granite-13b-chat-v2</code> Enterprise Foundation Model residing within the <strong>watsonx.ai Runtime</strong> cluster, specifically configured for low-latency text-generation inference natively on IBM's cloud.</p>
            </div>
          </div>

          <div className="hiw-connector" style={{ width: '4px', height: '40px', background: 'linear-gradient(180deg, var(--glass-border), rgba(191, 64, 255, 0.5))' }}></div>

          <div className="hiw-step" style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem' }}>
            <div className="step-number" style={{ flexShrink: 0 }}><Activity size={24} /></div>
            <div className="step-content">
              <h3>4. Targeted Actionable Feedback</h3>
              <p>The Granite model rapidly synthesizes the practice log context. Rather than providing generic chat completion, the structured prompt guarantees a high-yield coaching payload containing micro-goal suggestions, physiological corrections, and psychological reinforcement. The callback resolves back to the Express Node, which passes the JSON safely to the glassmorphic React render cycle.</p>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '6rem', textAlign: 'center' }}>
          <Link to="/" className="btn-secondary" style={{textDecoration: 'none', display: 'inline-block'}}>← Return back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
