import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  Map,
  Cpu,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('alex.chen@vit.edu');
  const [password, setPassword] = useState('CareerOS2026!');
  const [fullName, setFullName] = useState('Alex Chen');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setAlertMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setAlertMsg({ type: 'success', text: isSignUp ? 'Account created! Starting onboarding wizard...' : 'Welcome back! Launching dashboard...' });
      setTimeout(() => {
        navigate(isSignUp ? '/onboarding' : '/dashboard');
      }, 600);
    }, 500);
  };

  const handleQuickDemo = () => {
    setIdentifier('alex.chen@vit.edu');
    setPassword('CareerOS2026!');
    setAlertMsg({ type: 'success', text: 'Signing in with Alex Chen demo account...' });
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="auth-page-container">
      {/* ---------------- Left Branded Showcase ---------------- */}
      <section className="auth-hero-pane" aria-label="Brand Overview">
        {/* Background visual graphics */}
        <div className="auth-hero-decorations" aria-hidden="true">
          <div className="auth-hero-circle-1" />
          <div className="auth-hero-circle-2" />
          <div className="auth-hero-glow" />
        </div>

        {/* Top Logo */}
        <Link to="/" className="auth-brand-link" title="CAREEROS Home">
          <div className="auth-brand-icon">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <span className="auth-brand-text">CAREEROS</span>
        </Link>

        {/* Main Pitch */}
        <div className="auth-hero-main">
          <h1 className="auth-hero-heading">
            Your career.<br />
            One <span className="gradient-text">intelligent path.</span>
          </h1>
          <p className="auth-hero-sub">
            AI-powered guidance, practice, and opportunities to make you placement-ready.
          </p>

          {/* Connected Timeline Features */}
          <div className="auth-feature-timeline">
            <div className="auth-timeline-line" />

            <div className="auth-feature-item">
              <div className="auth-feature-badge purple">
                <Map size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">AI-Powered Roadmap</h2>
                <p className="auth-feature-desc">
                  Personalized preparation based on your skills, goals & deadlines.
                </p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-badge blue">
                <Cpu size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">Practice. Improve. Track.</h2>
                <p className="auth-feature-desc">
                  Coding, aptitude, communication and more.
                </p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-badge indigo">
                <Briefcase size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">Find Opportunities</h2>
                <p className="auth-feature-desc">
                  Internships, hiring challenges and placement drives.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle note */}
        <div className="auth-hero-footer">
          <span>Explore institutional partner portal?</span>
          <Link to="/">Learn more</Link>
        </div>
      </section>

      {/* ---------------- Right Auth Form ---------------- */}
      <main className="auth-form-pane" role="main">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-card-header">
            <h2 className="auth-card-title">
              {isSignUp ? 'Create your account 🚀' : 'Welcome back 👋'}
            </h2>
            <p className="auth-card-subtitle">
              {isSignUp
                ? 'Join thousands of students building their tech careers with CAREEROS.'
                : 'Log in to continue your journey with CAREEROS.'}
            </p>
          </div>

          {/* Social Logins */}
          <div className="auth-social-group">
            <button
              type="button"
              className="auth-social-btn"
              onClick={handleQuickDemo}
              title="Continue with Google"
            >
              <svg className="auth-social-icon" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.1 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="auth-social-btn"
              onClick={handleQuickDemo}
              title="Continue with Microsoft"
            >
              <svg className="auth-social-icon" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Status Message */}
          {alertMsg && (
            <div className={`auth-alert ${alertMsg.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'}`}>
              {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <span>⚠️</span>}
              <span>{alertMsg.text}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleLogin}>
            {isSignUp && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className="auth-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="identifier">Email or Mobile Number</label>
              <input
                id="identifier"
                type="text"
                className="auth-input"
                placeholder="Enter your email or mobile number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot password */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              {!isSignUp && (
                <a
                  href="#forgot"
                  className="auth-forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setAlertMsg({ type: 'success', text: 'Password reset link sent to registered email.' });
                  }}
                >
                  Forgot password?
                </a>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Box */}
          <div className="auth-demo-box">
            <div className="auth-demo-text">
              <strong>Quick Student Access:</strong> Alex Chen (VIT CS 3rd Yr)
            </div>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={handleQuickDemo}
            >
              Auto Sign In
            </button>
          </div>

          {/* Mode Switcher */}
          <p className="auth-switch-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAlertMsg(null);
              }}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* Privacy Note */}
        <div className="auth-trust-notice">
          <ShieldCheck size={16} color="#4F46E5" />
          <span>
            Your data is safe with us. Read our{' '}
            <Link to="/" onClick={(e) => { e.preventDefault(); alert('CAREEROS adheres to strict data privacy guidelines.'); }}>
              Privacy Policy
            </Link>
          </span>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
