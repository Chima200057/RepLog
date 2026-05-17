import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import './Demo.css';

function Demo() {
  return (
    <main className="demo-page">
      <div className="demo-header">
        <div className="hero-badge">Video Tour</div>
        <h2>See RepLog in Action</h2>
        <p>A quick walkthrough of how Bob helps you transform your practice logs into actionable coaching intelligence.</p>
      </div>

      <div className="demo-container">
        <video 
          className="demo-video" 
          controls 
          autoPlay 
          muted={false}
          poster="/demo-poster.png" // We don't have one, but good practice
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="demo-footer">
        <Link to="/" className="demo-back-btn">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default Demo;
