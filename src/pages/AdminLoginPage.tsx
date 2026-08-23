import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Activity,
  KeyRound,
  CheckCircle2,
  GraduationCap,
  Globe,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState('Vellore Institute of Technology, Vellore');
  const [email, setEmail] = useState('tpo.placement@vit.ac.in');
  const [password, setPassword] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('849201');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard'); // Route into platform
    }, 600);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Top Brand Header */}
        <div className="admin-brand-header">
          <div className="admin-logo-badge">
            <Building2 size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="admin-title">College Admin & TPO Portal</h1>
            <p className="admin-subtitle">
              Institutional placement management, batch telemetry, and automated campus drive scheduling.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="admin-form" onSubmit={handleAdminLogin}>
          {/* University Selector */}
          <div className="admin-field-group">
            <label className="admin-label">Partner University / Institution</label>
            <div className="admin-input-wrapper">
              <GraduationCap size={18} className="admin-input-icon" />
              <select
                className="admin-select"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
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

          {/* Institutional Email */}
          <div className="admin-field-group">
            <label className="admin-label">Official TPO / Administrator Email</label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tpo.placement@vit.ac.in"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="admin-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="admin-label">Admin Security Password</label>
              <a href="#reset" style={{ fontSize: 11.5, color: '#818CF8', textDecoration: 'none', fontWeight: 600 }}>
                Reset via Key?
              </a>
            </div>
            <div className="admin-input-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 2FA Security Token */}
          <div className="admin-field-group">
            <label className="admin-label">Campus 2FA Authenticator Code</label>
            <div className="admin-input-wrapper">
              <KeyRound size={18} className="admin-input-icon" />
              <input
                type="text"
                className="admin-input"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="6-digit OTP Token"
                required
              />
            </div>
          </div>

          {/* Remember Token Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#94A3B8' }}>
            <input type="checkbox" id="remember" defaultChecked style={{ accentColor: '#4F46E5' }} />
            <label htmlFor="remember">Keep session authenticated for 8 hours on this campus IP</label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="admin-submit-btn" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Verifying Institutional Credentials...' : 'Sign In to Campus Administration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
          <Link to="/login" style={{ color: '#818CF8', textDecoration: 'none', fontWeight: 700 }}>
            ← Student Login Portal
          </Link>
          <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>
            Back to CAREEROS Home
          </Link>
        </div>

        {/* Enterprise Security Badges */}
        <div className="admin-security-footer">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={14} color="#10B981" /> ISO 27001 Certified
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Globe size={14} color="#3B82F6" /> FERPA Compliant
          </span>
          <span>•</span>
          <span>SSO Ready</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
