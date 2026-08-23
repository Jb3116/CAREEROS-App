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
  UserPlus,
  Building2,
  GraduationCap,
  Mail,
  Lock,
  KeyRound,
  Globe,
  User,
} from 'lucide-react';

import { getStudentProfile, saveStudentProfile, createFreshStudentProfile } from '../utils/userProfile';
import {
  validatePasswordComplexity,
  registerNewAccount,
  verifyStudentCredentials,
} from '../utils/authAccounts';

interface LoginPageProps {
  defaultSignUp?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultSignUp = true }) => {
  const navigate = useNavigate();

  // Role Toggle: 'student' | 'admin'
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');

  // Student State - Default to Sign Up for new visitors, manual clean inputs
  const [isSignUp, setIsSignUp] = useState<boolean>(defaultSignUp);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Social OAuth Modal State (Google & Microsoft)
  const [socialProvider, setSocialProvider] = useState<'Google' | 'Microsoft' | null>(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');
  const [socialError, setSocialError] = useState<string | null>(null);

  // Live password complexity check
  const passwordValidation = validatePasswordComplexity(password);

  // Admin State
  const [selectedCollege, setSelectedCollege] = useState('Vellore Institute of Technology, Vellore');
  const [adminEmail, setAdminEmail] = useState('tpo.placement@vit.ac.in');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('849201');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSocialAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialEmail.trim()) {
      setSocialError('Please enter your email address.');
      return;
    }
    if (!socialEmail.includes('@') || !socialEmail.includes('.')) {
      setSocialError('Please enter a valid email address (personal or university).');
      return;
    }

    setIsLoading(true);
    setSocialError(null);

    const cleanEmail = socialEmail.trim().toLowerCase();
    const displayName = socialName.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');

    const authId = `s_oauth_${Date.now()}`;
    const authUser = {
      id: authId,
      name: displayName,
      email: cleanEmail,
      role: 'student' as const,
    };
    localStorage.setItem('careeros_auth_user', JSON.stringify(authUser));

    // Dynamic Zero-Streak profile initialization
    createFreshStudentProfile({
      name: displayName,
      email: cleanEmail,
      college: cleanEmail.includes('.edu') || cleanEmail.includes('.ac.in') ? 'University Campus' : 'Engineering Institution',
    });

    // Reset tour state so AI Website Tour triggers on dashboard
    localStorage.removeItem('careeros_ai_tour_completed');
    localStorage.removeItem('careeros_tour_completed');
    localStorage.removeItem(`careeros_tour_completed_${authId}`);

    setSocialProvider(null);
    setAlertMsg({
      type: 'success',
      text: `Signed in with ${socialProvider} (${cleanEmail})! Launching CareerOS Tour...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard'); // Step 2: Dashboard auto-triggers clean AI Website Tour
    }, 450);
  };

  const handleStudentAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setAlertMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setAlertMsg({ type: 'error', text: 'Please enter your Full Legal Name.' });
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setAlertMsg({ type: 'error', text: 'Passwords do not match. Please verify and try again.' });
        return;
      }
      if (!passwordValidation.isValid) {
        setAlertMsg({
          type: 'error',
          text: passwordValidation.errors[0] || 'Password does not meet the security complexity requirements.',
        });
        return;
      }

      setIsLoading(true);
      setAlertMsg(null);

      // Register new account in registry
      const regRes = registerNewAccount({
        name: fullName.trim(),
        email: identifier.trim(),
        password: password,
        college: college.trim() || 'Vellore Institute of Technology, Chennai',
      });

      if (!regRes.success) {
        setIsLoading(false);
        setAlertMsg({
          type: 'error',
          text: regRes.error || 'Failed to create account. Please try again.',
        });
        return;
      }

      // Initialize brand new profile with zero streak
      createFreshStudentProfile({
        name: fullName.trim(),
        email: identifier.trim(),
        college: college.trim() || 'Vellore Institute of Technology, Chennai',
      });

      // Save auth session so student is logged in
      const authUser = {
        id: regRes.account?.id || `s_${Date.now()}`,
        name: fullName.trim(),
        email: identifier.trim(),
        role: 'student' as const,
      };
      localStorage.setItem('careeros_auth_user', JSON.stringify(authUser));

      // Reset tour state so AI Website Tour triggers on dashboard
      localStorage.removeItem('careeros_ai_tour_completed');
      localStorage.removeItem('careeros_tour_completed');
      localStorage.removeItem(`careeros_tour_completed_${authUser.id}`);

      setAlertMsg({
        type: 'success',
        text: 'Account created! Launching CareerOS Experience & AI Tour...',
      });

      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard'); // Step 2: Dashboard auto-triggers clean AI Website Tour
      }, 450);
      return;
    }

    // Strict Sign In logic
    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const verifyRes = verifyStudentCredentials(identifier, password);

      if (!verifyRes.success || !verifyRes.account) {
        setAlertMsg({
          type: 'error',
          text: verifyRes.error || 'Account not found. Please sign up first to create your CareerOS profile.',
        });
        return;
      }

      const account = verifyRes.account;
      localStorage.setItem(
        'careeros_auth_user',
        JSON.stringify({
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        })
      );

      // Also ensure profile name matches
      saveStudentProfile({
        name: account.name,
        college: account.college || 'Vellore Institute of Technology, Chennai',
        email: account.email,
      });

      setAlertMsg({
        type: 'success',
        text: 'Credentials verified! Launching your CareerOS dashboard...',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    }, 400);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem(
        'careeros_auth_user',
        JSON.stringify({
          id: 'admin1',
          name: 'TPO Placement Cell',
          email: adminEmail,
          role: 'admin',
        })
      );
      setAlertMsg({
        type: 'success',
        text: 'Institutional 2FA verified. Launching University Administration Dashboard...',
      });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    }, 500);
  };

  const handleQuickDemo = () => {
    setIdentifier('alex.chen@vit.edu');
    setPassword('CareerOS2026!');
    setConfirmPassword('CareerOS2026!');
    localStorage.setItem(
      'careeros_auth_user',
      JSON.stringify({
        id: 's123',
        name: 'Alex Chen',
        email: 'alex.chen@vit.edu',
        role: 'student',
      })
    );
    setAlertMsg({ type: 'success', text: 'Signing in with Alex Chen demo account...' });
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
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
            {activeRole === 'student' ? (
              <>
                Your career.<br />
                One <span className="gradient-text">intelligent path.</span>
              </>
            ) : (
              <>
                Campus Placement.<br />
                One <span className="gradient-text">unified intelligence.</span>
              </>
            )}
          </h1>
          <p className="auth-hero-sub">
            {activeRole === 'student'
              ? 'AI-powered guidance, practice, and opportunities to make you placement-ready.'
              : 'Institutional telemetry, automated batch hiring scheduling, and university cohort management.'}
          </p>

          {/* Connected Timeline Features */}
          <div className="auth-feature-timeline">
            <div className="auth-timeline-line" />

            <div className="auth-feature-item">
              <div className="auth-feature-badge purple">
                <Map size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">
                  {activeRole === 'student' ? 'AI-Powered Roadmap' : 'Cohort Skill Mapping'}
                </h2>
                <p className="auth-feature-desc">
                  {activeRole === 'student'
                    ? 'Personalized preparation based on your skills, goals & deadlines.'
                    : 'Analyze batch strengths across DSA, CS Core, and Quantitative benchmarks.'}
                </p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-badge blue">
                <Cpu size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">
                  {activeRole === 'student' ? 'Practice. Improve. Track.' : 'Automated Drive Scheduling'}
                </h2>
                <p className="auth-feature-desc">
                  {activeRole === 'student'
                    ? 'Coding arena, aptitude drills, AI speech coaching.'
                    : 'Coordinate Google, Goldman Sachs, and Tier-1 hiring workflows with 1 click.'}
                </p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-badge indigo">
                <Briefcase size={18} strokeWidth={2.2} />
              </div>
              <div className="auth-feature-text">
                <h2 className="auth-feature-title">
                  {activeRole === 'student' ? 'Find Opportunities' : 'Institutional Placement CRM'}
                </h2>
                <p className="auth-feature-desc">
                  {activeRole === 'student'
                    ? 'Internships, hiring challenges and placement drives.'
                    : 'Complete student roster tracking, offer letter verification, and salary analytics.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="auth-hero-footer">
          <span>{activeRole === 'student' ? 'New student joining CAREEROS?' : 'Looking to partner your university?'}</span>
          {activeRole === 'student' ? (
            <Link to="/onboarding" style={{ fontWeight: 700, color: '#C7D2FE', textDecoration: 'underline' }}>
              Start Onboarding Wizard &rarr;
            </Link>
          ) : (
            <a href="mailto:partner@careeros.ai" style={{ fontWeight: 700, color: '#C7D2FE', textDecoration: 'underline' }}>
              Request Campus License &rarr;
            </a>
          )}
        </div>
      </section>

      {/* ---------------- Right Auth Form with Role Switcher ---------------- */}
      <main className="auth-form-pane" role="main">
        <div className="auth-card">
          {/* Role Switcher Segmented Control */}
          <div
            style={{
              background: '#F1F5F9',
              padding: 4,
              borderRadius: 14,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 4,
              marginBottom: 20,
              border: '1px solid #E2E8F0',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                setAlertMsg(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: activeRole === 'student' ? '#FFFFFF' : 'transparent',
                color: activeRole === 'student' ? '#4F46E5' : '#64748B',
                fontWeight: activeRole === 'student' ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: activeRole === 'student' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <User size={16} />
              <span>Student Account</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setAlertMsg(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: 'none',
                background: activeRole === 'admin' ? '#FFFFFF' : 'transparent',
                color: activeRole === 'admin' ? '#4F46E5' : '#64748B',
                fontWeight: activeRole === 'admin' ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: activeRole === 'admin' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 150ms ease',
              }}
            >
              <Building2 size={16} />
              <span>College Admin & TPO</span>
            </button>
          </div>

          {/* Alert Box */}
          {alertMsg && (
            <div
              className={`auth-alert ${alertMsg.type}`}
              role="alert"
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                background: alertMsg.type === 'error' ? '#FEF2F2' : '#ECFDF5',
                color: alertMsg.type === 'error' ? '#DC2626' : '#059669',
                border: `1px solid ${alertMsg.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
              }}
            >
              {alertMsg.text}
            </div>
          )}

          {/* ---------------- STUDENT LOGIN FORM ---------------- */}
          {activeRole === 'student' && (
            <>
              {/* Header */}
              <div className="auth-card-header">
                <h2 className="auth-card-title">
                  {isSignUp ? 'Create your account 🚀' : 'Student Login 👋'}
                </h2>
                <p className="auth-card-subtitle">
                  {isSignUp
                    ? 'Join thousands of students building their tech careers with CAREEROS.'
                    : 'Log in to access your dashboard, roadmap, practice arena, and drives.'}
                </p>
              </div>

              {/* Social Logins */}
              <div className="auth-social-group">
                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={() => {
                    setSocialProvider('Google');
                    setSocialError(null);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  className="auth-social-btn"
                  onClick={() => {
                    setSocialProvider('Microsoft');
                    setSocialError(null);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z" />
                    <path fill="#7FBA00" d="M13 1h10v10H13z" />
                    <path fill="#00A4EF" d="M1 13h10v10H1z" />
                    <path fill="#FFB900" d="M13 13h10v10H1z" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>

              <div className="auth-divider">
                <span>OR CONTINUE WITH EMAIL</span>
              </div>

              {/* Form */}
              <form className="auth-form" onSubmit={handleStudentAuth}>
                {isSignUp && (
                  <>
                    <div className="auth-field-group">
                      <label className="auth-field-label" htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        className="auth-input"
                        placeholder="e.g. Alex Chen"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="auth-field-group">
                      <label className="auth-field-label" htmlFor="college">College / University</label>
                      <input
                        id="college"
                        type="text"
                        className="auth-input"
                        placeholder="e.g. Vellore Institute of Technology, Chennai"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="auth-field-group">
                  <label className="auth-field-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="auth-input"
                    placeholder="e.g. alex.chen@vit.edu"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-field-group">
                  <label className="auth-field-label" htmlFor="password">
                    Password
                  </label>
                  <div className="auth-password-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input password-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: 40, width: '100%' }}
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Real-Time Password Complexity Checklist */}
                  {isSignUp && (
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        marginTop: 6,
                        fontSize: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#475569', marginBottom: 2 }}>
                        Password Security Requirements:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: passwordValidation.criteria.length ? '#059669' : '#94A3B8', fontWeight: passwordValidation.criteria.length ? 700 : 500 }}>
                          {passwordValidation.criteria.length ? <CheckCircle2 size={13} color="#059669" /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                          <span>8+ Characters</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: passwordValidation.criteria.uppercase ? '#059669' : '#94A3B8', fontWeight: passwordValidation.criteria.uppercase ? 700 : 500 }}>
                          {passwordValidation.criteria.uppercase ? <CheckCircle2 size={13} color="#059669" /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                          <span>1 Uppercase (A-Z)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: passwordValidation.criteria.lowercase ? '#059669' : '#94A3B8', fontWeight: passwordValidation.criteria.lowercase ? 700 : 500 }}>
                          {passwordValidation.criteria.lowercase ? <CheckCircle2 size={13} color="#059669" /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                          <span>1 Lowercase (a-z)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: passwordValidation.criteria.number ? '#059669' : '#94A3B8', fontWeight: passwordValidation.criteria.number ? 700 : 500 }}>
                          {passwordValidation.criteria.number ? <CheckCircle2 size={13} color="#059669" /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                          <span>1 Number (0-9)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: passwordValidation.criteria.special ? '#059669' : '#94A3B8', fontWeight: passwordValidation.criteria.special ? 700 : 500, gridColumn: 'span 2' }}>
                          {passwordValidation.criteria.special ? <CheckCircle2 size={13} color="#059669" /> : <div style={{ width: 13, height: 13, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                          <span>1 Special Symbol (@, $, !, %, *, ?, &, #)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="auth-field-group">
                    <label className="auth-field-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="auth-password-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="auth-input password-input"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ paddingRight: 40, width: '100%' }}
                      />
                      <button
                        type="button"
                        className="auth-input-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

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
                    <span>Authenticating Student Account...</span>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account & Proceed to Sign In' : 'Sign In as Student'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Autofill Box */}
              <div className="auth-demo-box">
                <div className="auth-demo-text">
                  <strong>Quick Student Demo:</strong> Alex Chen (VIT CS 3rd Yr)
                </div>
                <button
                  type="button"
                  className="auth-demo-btn"
                  onClick={handleQuickDemo}
                >
                  Auto Sign In
                </button>
              </div>

              {/* Direct Start Onboarding Button */}
              <div style={{ margin: '6px 0', textAlign: 'center' }}>
                <Link
                  to="/onboarding"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#4F46E5',
                    background: '#EEF2FF',
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #C7D2FE',
                    textDecoration: 'none',
                  }}
                >
                  <UserPlus size={15} />
                  <span>New Student? Go directly to Onboarding Wizard</span>
                </Link>
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
            </>
          )}

          {/* ---------------- COLLEGE ADMIN & TPO LOGIN FORM ---------------- */}
          {activeRole === 'admin' && (
            <>
              {/* Header */}
              <div className="auth-card-header">
                <h2 className="auth-card-title">
                  College Admin & TPO Portal 🏛️
                </h2>
                <p className="auth-card-subtitle">
                  Institutional access for university administrators, placement directors, and academic department heads.
                </p>
              </div>

              {/* Form */}
              <form className="auth-form" onSubmit={handleAdminLogin}>
                {/* University Selection */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Affiliated University / College</label>
                  <div className="admin-input-wrapper">
                    <GraduationCap size={18} className="admin-input-icon" />
                    <select
                      className="admin-select"
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                      style={{ background: '#F8FAFC', color: '#1E293B', border: '1px solid #CBD5E1' }}
                    >
                      <option>Vellore Institute of Technology, Vellore</option>
                      <option>IIT Bombay (Placement Cell)</option>
                      <option>BITS Pilani (Practice School & Placements)</option>
                      <option>NIT Trichy (Career Guidance Cell)</option>
                      <option>Delhi Technological University (DTU)</option>
                      <option>IIIT Hyderabad</option>
                    </select>
                  </div>
                </div>

                {/* Official Email */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Official Institutional Email</label>
                  <div className="admin-input-wrapper">
                    <Mail size={18} className="admin-input-icon" />
                    <input
                      type="email"
                      className="auth-input"
                      style={{ paddingLeft: 42 }}
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. tpo.placement@vit.ac.in"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Administrator Password</label>
                  <div className="auth-password-wrapper">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      className="auth-input password-input"
                      placeholder="••••••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    >
                      {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* 2FA Token */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Campus 2FA Authenticator Token</label>
                  <div className="admin-input-wrapper">
                    <KeyRound size={18} className="admin-input-icon" />
                    <input
                      type="text"
                      className="auth-input"
                      style={{ paddingLeft: 42 }}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="6-digit OTP Token"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                  style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
                >
                  {isLoading ? (
                    <span>Authenticating University Terminal...</span>
                  ) : (
                    <>
                      <span>Sign In as College Administrator</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Compliance Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 11.5, color: '#64748B', marginTop: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={14} color="#10B981" /> ISO 27001 Certified
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={14} color="#3B82F6" /> FERPA Compliant
                </span>
              </div>
            </>
          )}
        </div>

        {/* Privacy Note */}
        <div className="auth-trust-notice">
          <ShieldCheck size={16} color="#4F46E5" />
          <span>
            Your data is protected under Enterprise University Security Standards.{' '}
            <Link to="/" onClick={(e) => { e.preventDefault(); alert('CAREEROS adheres to strict data privacy guidelines.'); }}>
              Privacy Policy
            </Link>
          </span>
        </div>
      </main>

      {/* Social OAuth Modal */}
      {socialProvider && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 440,
              width: '100%',
              padding: 26,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {socialProvider === 'Google' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z" />
                    <path fill="#7FBA00" d="M13 1h10v10H13z" />
                    <path fill="#00A4EF" d="M1 13h10v10H1z" />
                    <path fill="#FFB900" d="M13 13h10v10H13z" />
                  </svg>
                )}
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Continue with {socialProvider}
                </h3>
              </div>
              <button
                onClick={() => setSocialProvider(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: '#475569', marginBottom: 16 }}>
              Enter your personal or university email address to proceed via {socialProvider} single sign-on (no password required).
            </p>

            {socialError && (
              <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12, border: '1px solid #FECACA' }}>
                {socialError}
              </div>
            )}

            <form onSubmit={handleSocialAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  {socialProvider} Email Address
                </label>
                <input
                  type="email"
                  placeholder={socialProvider === 'Google' ? 'name@gmail.com or name@university.edu' : 'name@outlook.com or name@university.edu'}
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setSocialProvider(null)}
                  style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #4338CA)', color: '#FFFFFF', border: 'none', padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                >
                  {isLoading ? 'Verifying...' : `Continue with ${socialProvider}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
