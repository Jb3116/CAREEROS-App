import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Map,
  Code2,
  BrainCircuit,
  Briefcase,
  FileCheck2,
  MessageSquareCode,
  Flame,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Zap,
  TrendingUp,
  Target,
  ChevronRight,
  Star,
  Users,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-container">
      {/* ---------------- Navigation Bar ---------------- */}
      <header className="home-nav" role="banner">
        <Link to="/" className="home-nav-brand" title="CAREEROS">
          <div className="home-nav-logo-icon">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <span className="home-nav-brand-title">CAREEROS</span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="home-nav-links">
            <li><a href="#features" className="home-nav-link">Features</a></li>
            <li><a href="#roadmap" className="home-nav-link">AI Roadmap</a></li>
            <li><a href="#practice" className="home-nav-link">Practice Arena</a></li>
            <li><a href="#opportunities" className="home-nav-link">Opportunities</a></li>
            <li><a href="#how-it-works" className="home-nav-link">How It Works</a></li>
          </ul>
        </nav>

        <div className="home-nav-actions">
          <Link to="/login" className="home-btn-ghost">
            Sign In
          </Link>
          <Link to="/dashboard" className="home-btn-primary">
            <span>Student Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* ---------------- Hero Section ---------------- */}
      <section className="home-hero">
        {/* Glow Pill */}
        <div className="home-hero-badge">
          <Sparkles size={14} />
          <span>Next-Gen AI Career Operating System • 2026 Edition</span>
        </div>

        {/* Headline */}
        <h1 className="home-hero-title">
          Your Career. One <span className="gradient-text">Intelligent Path.</span>
        </h1>

        {/* Subtitle */}
        <p className="home-hero-subtitle">
          Personalized AI roadmaps, verified skill gap analysis, real-time coding & aptitude practice, and smart opportunity matching—engineered to get you hired at top tech companies.
        </p>

        {/* Action Buttons */}
        <div className="home-hero-actions">
          <Link to="/dashboard" className="home-btn-lg-primary">
            <span>Launch Student Dashboard</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="home-btn-lg-secondary">
            <span>Sign In / Create Account</span>
          </Link>
        </div>

        {/* ---------------- Interactive Hero Showcase Card ---------------- */}
        <div className="home-showcase-container">
          <div className="home-showcase-wrapper">
            {/* Window header */}
            <div className="home-showcase-header">
              <div className="home-showcase-dots">
                <span className="home-showcase-dot red" />
                <span className="home-showcase-dot yellow" />
                <span className="home-showcase-dot green" />
              </div>
              <div className="home-showcase-tab-bar">
                <Activity size={14} color="#6366F1" />
                <span>CAREEROS Student Intelligence Engine • Alex Chen (VIT CS)</span>
              </div>
              <div style={{ color: '#10B981', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                Live Sync
              </div>
            </div>

            {/* Showcase Body */}
            <div className="home-showcase-body">
              {/* Card 1: Readiness Gauge */}
              <div className="home-showcase-card">
                <div className="home-showcase-card-title">
                  <span>Target Role Readiness</span>
                  <span style={{ fontSize: 11, background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                    SDE 1
                  </span>
                </div>
                <div className="home-showcase-stat-big">
                  <span style={{ color: '#4F46E5' }}>78%</span>
                  <span className="unit">Placement Ready</span>
                </div>
                <div style={{ background: '#F1F5F9', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #4F46E5, #8B5CF6)', borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  +14% gain after completing Graphs & Dynamic Programming module.
                </p>
              </div>

              {/* Card 2: Next Best Action */}
              <div className="home-showcase-card" style={{ borderColor: '#C7D2FE', background: '#F5F7FF' }}>
                <div className="home-showcase-card-title">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4338CA' }}>
                    <Sparkles size={16} />
                    <span>Next Best Action</span>
                  </span>
                  <span style={{ fontSize: 11, background: '#4F46E5', color: '#FFFFFF', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                    High Yield
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                  Complete 2 Tree Problems
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.4 }}>
                  Closes the Binary Search Tree mastery gap detected in your Google mock assessment.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: '#4F46E5',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: 12,
                    padding: '8px 14px',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 'auto',
                  }}
                >
                  <span>Execute in Practice Arena</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Card 3: Top Matched Opportunity */}
              <div className="home-showcase-card">
                <div className="home-showcase-card-title">
                  <span>Top Opportunity Match</span>
                  <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 800 }}>
                    94% MATCH
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>
                  Goldman Sachs SWE Intern
                </div>
                <div style={{ fontSize: 13, color: '#64748B' }}>
                  ₹1,20,000 / mo • Bangalore / Hybrid
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>DSA</span>
                  <span style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>C++ / Java</span>
                  <span style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>SQL</span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    border: '1px solid #CBD5E1',
                    color: '#1E293B',
                    fontWeight: 700,
                    fontSize: 12,
                    padding: '7px 12px',
                    borderRadius: 8,
                    marginTop: 'auto',
                    textAlign: 'center',
                  }}
                >
                  View in Opportunities Radar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Trust Bar ---------------- */}
      <section className="home-trust-bar" aria-label="Partner Universities">
        <h2 className="home-trust-title">Empowering ambitious students across top engineering campuses</h2>
        <div className="home-trust-logos">
          <div className="home-trust-badge">🎓 Vellore Institute of Technology</div>
          <div className="home-trust-badge">🏛️ IIT Bombay</div>
          <div className="home-trust-badge">⚡ BITS Pilani</div>
          <div className="home-trust-badge">🏢 NIT Trichy</div>
          <div className="home-trust-badge">🚀 IIIT Hyderabad</div>
          <div className="home-trust-badge">💡 Delhi Technological University</div>
        </div>
      </section>

      {/* ---------------- Core Features Grid ---------------- */}
      <section className="home-features-section" id="features">
        <div style={{ textAlign: 'center' }}>
          <span className="home-section-tag">All-in-One Intelligence</span>
          <h2 className="home-section-heading">Engineered for your campus-to-offer journey</h2>
          <p className="home-section-desc" style={{ margin: '0 auto 56px' }}>
            Traditional prep is fragmented. CAREEROS combines intelligent roadmapping, verified skill mastery, coding assessments, and direct opportunity matching in one cohesive system.
          </p>
        </div>

        <div className="home-features-grid">
          {/* Feature 1 */}
          <div className="home-feature-card" id="roadmap">
            <div className="home-feature-icon-wrap purple">
              <Map size={24} />
            </div>
            <h3 className="home-feature-title">AI-Powered Adaptive Roadmap</h3>
            <p className="home-feature-text">
              Say goodbye to generic study plans. Your roadmap dynamically updates with high-yield topics based on assessment outcomes and remaining days before target campus drives.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="home-feature-card" id="practice">
            <div className="home-feature-icon-wrap blue">
              <Code2 size={24} />
            </div>
            <h3 className="home-feature-title">Coding & Aptitude Practice Arena</h3>
            <p className="home-feature-text">
              Multi-language code editor with test cases, timed environments, aptitude question banks, and instant execution feedback calibrated for college assessments.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap green">
              <BrainCircuit size={24} />
            </div>
            <h3 className="home-feature-title">Evidence-Based Skill Mastery</h3>
            <p className="home-feature-text">
              Differentiates between self-reported and verified skills. Uses statistical estimators with confidence bounds to pinpoint exact conceptual gaps.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="home-feature-card" id="opportunities">
            <div className="home-feature-icon-wrap amber">
              <Briefcase size={24} />
            </div>
            <h3 className="home-feature-title">Smart Opportunity Radar</h3>
            <p className="home-feature-text">
              Calculates granular skill-match percentages for top internship and placement listings so you know exactly which roles to target and what to review.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap indigo">
              <FileCheck2 size={24} />
            </div>
            <h3 className="home-feature-title">ATS Resume Intelligence</h3>
            <p className="home-feature-text">
              Instant ATS score audit (91%+ benchmark), semantic keyword extraction, formatting inspection, and tailored suggestions to bypass recruiter filters.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-wrap rose">
              <MessageSquareCode size={24} />
            </div>
            <h3 className="home-feature-title">AI Mock Interview Studio</h3>
            <p className="home-feature-text">
              Practice behavioral STAR method scenarios and system design rounds with interactive prompts and structured scoring to build unshakable confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- How It Works Section ---------------- */}
      <section className="home-workflow-section" id="how-it-works">
        <div className="home-workflow-wrapper">
          <div style={{ textAlign: 'center' }}>
            <span className="home-section-tag">Methodology</span>
            <h2 className="home-section-heading">How CAREEROS accelerates your preparation</h2>
            <p className="home-section-desc" style={{ margin: '0 auto' }}>
              Four structured steps from initial onboarding to placement celebration.
            </p>
          </div>

          <div className="home-workflow-steps">
            <div className="home-workflow-step-card">
              <div className="home-step-number">1</div>
              <h3 className="home-step-title">5-Step Career Profile</h3>
              <p className="home-step-desc">
                Define your graduation year, college, target role (SWE, Frontend, Data), and weekly prep availability.
              </p>
            </div>

            <div className="home-workflow-step-card">
              <div className="home-step-number">2</div>
              <h3 className="home-step-title">Initial Diagnostic Test</h3>
              <p className="home-step-desc">
                Take a year-aware assessment in Coding, Aptitude, and optional Interview rounds to establish your baseline.
              </p>
            </div>

            <div className="home-workflow-step-card">
              <div className="home-step-number">3</div>
              <h3 className="home-step-title">Daily Adaptive Action</h3>
              <p className="home-step-desc">
                Execute your personalized daily plan, maintain your streak, and watch your Readiness Score rise.
              </p>
            </div>

            <div className="home-workflow-step-card">
              <div className="home-step-number">4</div>
              <h3 className="home-step-title">Matched Job Offers</h3>
              <p className="home-step-desc">
                Apply directly to verified internships and campus drives where your match score exceeds 90%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats & Impact ---------------- */}
      <section className="home-stats-section">
        <div className="home-stats-grid">
          <div className="home-stat-item">
            <div className="home-stat-number">94%</div>
            <div className="home-stat-label">Placement Success Rate</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">25,000+</div>
            <div className="home-stat-label">Active Student Learners</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">500+</div>
            <div className="home-stat-label">Verified Tech Opportunities</div>
          </div>
          <div className="home-stat-item">
            <div className="home-stat-number">3.2x</div>
            <div className="home-stat-label">Faster Skill Gap Closure</div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA Banner ---------------- */}
      <section className="home-cta-section">
        <div className="home-cta-banner">
          <h2 className="home-cta-title">Ready to launch your high-growth tech career?</h2>
          <p className="home-cta-sub">
            Join thousands of engineering students mastering skills, crushing coding interviews, and landing dream roles.
          </p>
          <div className="home-cta-actions">
            <Link to="/dashboard" className="home-btn-lg-primary" style={{ background: '#FFFFFF', color: '#4338CA', fontWeight: 800 }}>
              <span>Open Student Dashboard</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="home-btn-lg-secondary" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              <span>Sign In / Create Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="home-footer" role="contentinfo">
        <div className="home-footer-grid">
          <div className="home-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="home-nav-logo-icon" style={{ width: 34, height: 34 }}>
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <span className="home-footer-logo-title">CAREEROS</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#94A3B8', maxWidth: 300 }}>
              The comprehensive AI Career Operating System designed to guide students from campus to career success.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#10B981', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              All Systems Operational • SQLite & AI Engine Online
            </div>
          </div>

          <div>
            <h3 className="home-footer-col-title">Platform</h3>
            <ul className="home-footer-links">
              <li><Link to="/dashboard" className="home-footer-link">Student Dashboard</Link></li>
              <li><Link to="/resume-builder" className="home-footer-link">ATS Resume Builder</Link></li>
              <li><Link to="/learning" className="home-footer-link">Learning Hub & Handbooks</Link></li>
              <li><Link to="/onboarding" className="home-footer-link">Student Onboarding Wizard</Link></li>
              <li><Link to="/login" className="home-footer-link">Sign In / Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="home-footer-col-title">Institutions</h3>
            <ul className="home-footer-links">
              <li><Link to="/login" className="home-footer-link">Admin Portal</Link></li>
              <li><a href="#features" className="home-footer-link">Placement Analytics</a></li>
              <li><a href="#features" className="home-footer-link">Batch Skill Reports</a></li>
              <li><a href="#features" className="home-footer-link">Drive Scheduling</a></li>
            </ul>
          </div>

          <div>
            <h3 className="home-footer-col-title">Legal & Security</h3>
            <ul className="home-footer-links">
              <li><a href="#privacy" className="home-footer-link" onClick={(e) => { e.preventDefault(); alert('CAREEROS Data Privacy & Encryption Policy'); }}>Privacy Policy</a></li>
              <li><a href="#terms" className="home-footer-link" onClick={(e) => { e.preventDefault(); alert('CAREEROS Terms of Service'); }}>Terms of Service</a></li>
              <li><a href="#security" className="home-footer-link" onClick={(e) => { e.preventDefault(); alert('Security Architecture: PBKDF2 Hashed, HTTPS Ready'); }}>Security Overview</a></li>
            </ul>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>© 2026 CAREEROS. All rights reserved.</span>
          <span>Designed with modern tokens & Plus Jakarta Sans typography.</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
