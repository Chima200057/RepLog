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
              <h3>1. Frontend Logging & Session Context</h3>
              <p>The interface is built using <strong>React</strong> and <strong>Vanilla CSS</strong> featuring a high-fidelity glassmorphic design. RepLog uses an advanced <strong>Multi-Session Engine</strong> to track parallel coaching threads. Each session maintains independent message history, allowing you to toggle between different athletic goals without losing context.</p>
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
              <p>The backend wraps your practice log in a structured prompt-engineering template. Commands are securely transmitted to the <code>ibm/granite-3-8b-instruct</code> Granite model within the <strong>watsonx.ai Runtime</strong>. The model analyzes your metrics to generate both a semantic session title and targeted markdown coaching advice.</p>
            </div>
          </div>

          <div className="hiw-connector" style={{ width: '4px', height: '40px', background: 'linear-gradient(180deg, var(--glass-border), rgba(191, 64, 255, 0.5))' }}></div>

          <div className="hiw-step" style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem' }}>
            <div className="step-number" style={{ flexShrink: 0 }}><Activity size={24} /></div>
            <div className="step-content">
              <h3>4. Authentication & Persistent Journaling</h3>
              <p>For registered users, every piece of advice can be saved into a persistent <strong>Markdown Notebook</strong>. RepLog implements a secure <strong>Guest Trial System</strong> with message quotas and ephemeral storage, ensuring that high-value coaching data remains exclusive and protected while offering a seamless entry point for new users.</p>
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
