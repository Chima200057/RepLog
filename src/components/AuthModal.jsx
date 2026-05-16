import { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ name: email.split('@')[0], email });
    } else {
      onSignup({ name, email });
    }
    onClose();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}><X size={20} /></button>
        
        <div className="auth-header">
          <div className="auth-icon-badge">
            <User size={24} />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Join RepLog'}</h2>
          <p>{isLogin ? 'Sign in to continue your coaching' : 'Create an account for unlimited coaching'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-input-group">
              <User size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>
          )}
          
          <div className="auth-input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="auth-input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-submit">
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );
}
