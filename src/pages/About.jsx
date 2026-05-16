import React from 'react';
import { Cpu, Heart, Sparkles, Shield, User } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="avatar-large">
          <Cpu size={80} color="#0062ff" />
        </div>
        <h1>Meet IBM Bob</h1>
        <p className="subtitle">Your Supportive AI Practice Coach</p>
      </section>

      <section className="about-content">
        <div className="about-grid">
          <div className="about-card glass">
            <User className="card-icon" size={32} />
            <h3>Who is Bob?</h3>
            <p>
              Bob isn't just an AI; he's your dedicated practice partner. Designed for creators, 
              musicians, and athletes, Bob's sole mission is to turn your daily logs into 
              actionable growth.
            </p>
          </div>

          <div className="about-card glass">
            <Sparkles className="card-icon" size={32} />
            <h3>Intelligent Insight</h3>
            <p>
              Powered by IBM Granite, Bob understands the nuance of your progress. He looks 
              beyond the numbers to see your effort, determination, and potential.
            </p>
          </div>

          <div className="about-card glass">
            <Heart className="card-icon" size={32} />
            <h3>Unwavering Support</h3>
            <p>
              Bob believes in the power of consistency. Whether it's a 10km run or a 5-minute 
              session, Bob celebrates your wins and helps you navigate your plateaus.
            </p>
          </div>

          <div className="about-card glass">
            <Shield className="card-icon" size={32} />
            <h3>Secure & Private</h3>
            <p>
              Your logs are your private journey. Bob operates within a secure IBM WatsonX 
              environment, ensuring your data is handled with the highest standards of safety.
            </p>
          </div>
        </div>
      </section>

      <section className="bob-philosophy glass">
        <h2>The "Bob" Philosophy</h2>
        <div className="philosophy-item">
          <span>01</span>
          <p><strong>Consistency over Intensity:</strong> Small daily habits build empires.</p>
        </div>
        <div className="philosophy-item">
          <span>02</span>
          <p><strong>Supportive Honesty:</strong> Constructive feedback delivered with a coach's heart.</p>
        </div>
        <div className="philosophy-item">
          <span>03</span>
          <p><strong>Data with Soul:</strong> Metrics are just the start; the story is in your effort.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
