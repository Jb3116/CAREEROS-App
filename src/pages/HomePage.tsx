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
            <li><Link to="/roadmap" className="home-nav-link">AI Roadmap</Link></li>
            <li><Link to="/practice" className="home-nav-link">Practice Arena</Link></li>
            <li><Link to="/resume-builder" className="home-nav-link">ATS Resume</Link></li>
            <li><Link to="/learning" className="home-nav-link">Learning Hub</Link></li>
          </ul>
        </nav>

        <div className="home-nav-actions">
          <Link to="/login" className="home-btn-ghost">
            Sign In
          </Link>
          <Link to="/onboarding" className="home-btn-primary">
            <span>Get Started</span>
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
          <Link to="/onboarding" className="home-btn-lg-primary">
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="home-btn-lg-secondary">
            <span>Explore Student Dashboard</span>
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
                  onClick={() => navigate('/onboarding')}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 'auto',
                  }}
                >
                  <span>Start Onboarding Calibration</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Card 3: Top Opportunity */}
              <div className="home-showcase-card">
                <div className="home-showcase-card-title">
                  <span>Top Placement Match</span>
                  <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                    94% Match
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1E3A8A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
                    GS
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A' }}>Goldman Sachs</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>SWE Intern • Summer 2026</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {['C++', 'Algorithms', 'SQL', 'System Design'].map((s, i) => (
                    <span key={i} style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Trust Bar ---------------- */}
      <section className="home-trust-bar" aria-label="Trusted by Students and Universities">
        <p className="home-trust-title">
          TRUSTED BY STUDENTS AND PLACEMENT CELLS ACROSS TOP INSTITUTIONS
        </p>
        <div className="home-trust-logos">
          <span>IIT BOMBAY</span>
          <span>BITS PILANI</span>
          <span>VIT VELLORE</span>
          <span>NIT TRICHY</span>
          <span>IIIT HYDERABAD</span>
          <span>DTU DELHI</span>
        </div>
      </section>

      {/* ---------------- Features Grid ---------------- */}
      <section id="features" className="home-features-section">
        <div className="home-section-header">
          <span className="home-badge-pill">COMPREHENSIVE CAPABILITIES</span>
          <h2 className="home-section-title">Everything You Need to Get Hired</h2>
          <p className="home-section-sub">
            From cold-start diagnostic benchmarks to campus drive offers, CAREEROS orchestrates your entire preparation cycle.
          </p>
        </div>

        <div className="home-features-grid">
          {/* Feature 1 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box purple">
              <Map size={24} />
            </div>
            <h3 className="home-feature-title">Adaptive Learning Roadmaps</h3>
            <p className="home-feature-desc">
              AI recalculates your study syllabus every time you submit code or complete a practice sprint, prioritizing high-yield gaps.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box blue">
              <Code2 size={24} />
            </div>
            <h3 className="home-feature-title">Coding & Aptitude Practice Arena</h3>
            <p className="home-feature-desc">
              Curated problem sets matching actual interview patterns from Tier 1 tech companies with real-time test case grading.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box green">
              <FileCheck2 size={24} />
            </div>
            <h3 className="home-feature-title">ATS Resume Optimizer</h3>
            <p className="home-feature-desc">
              Built-in live A4 ATS resume editor that scores keyword density and formatting against automated job parsers.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box orange">
              <Briefcase size={24} />
            </div>
            <h3 className="home-feature-title">Opportunity Matching Radar</h3>
            <p className="home-feature-desc">
              Matches your demonstrated skills against verified campus drives, internships, and off-campus openings with percentage compatibility.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box indigo">
              <MessageSquareCode size={24} />
            </div>
            <h3 className="home-feature-title">AI Mock Interview Studio</h3>
            <p className="home-feature-desc">
              Camera- and mic-assisted behavioral and technical interview simulation with STAR method evaluation feedback.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="home-feature-card">
            <div className="home-feature-icon-box pink">
              <BrainCircuit size={24} />
            </div>
            <h3 className="home-feature-title">Skill Intelligence Profile</h3>
            <p className="home-feature-desc">
              Separates verified, demonstrated competencies from self-reported skills, giving placement officers cryptographic confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 4-Step Workflow Section ---------------- */}
      <section id="how-it-works" className="home-workflow-section">
        <div className="home-section-header">
          <span className="home-badge-pill">SIMPLE 4-STEP PROCESS</span>
          <h2 className="home-section-title">How CAREEROS Accelerates Your Career</h2>
          <p className="home-section-sub">
            A guided pipeline engineered to replace scattered resources with structured, measurable progress.
          </p>
        </div>

        <div className="home-workflow-steps">
          {/* Step 1 */}
          <div className="home-step-card">
            <div className="home-step-number">1</div>
            <h3 className="home-step-title">Initial Onboarding & Benchmark</h3>
            <p className="home-step-desc">
              Take our year-aware diagnostic assessment to baseline your current DSA, problem-solving, and CS core depth.
            </p>
          </div>

          {/* Step 2 */}
          <div className="home-step-card">
            <div className="home-step-number">2</div>
            <h3 className="home-step-title">AI Calibrated Roadmap</h3>
            <p className="home-step-desc">
              Receive a step-by-step milestone schedule calibrated for your specific target companies (e.g. SDE 1 at Google).
            </p>
          </div>

          {/* Step 3 */}
          <div className="home-step-card">
            <div className="home-step-number">3</div>
            <h3 className="home-step-title">Daily Adaptive Sprints</h3>
            <p className="home-step-desc">
              Execute high-yield daily tasks with immediate guidance and watch your readiness score climb past 85%.
            </p>
          </div>

          {/* Step 4 */}
          <div className="home-step-card">
            <div className="home-step-number">4</div>
            <h3 className="home-step-title">Interview & Job Placement</h3>
            <p className="home-step-desc">
              Apply directly to matched campus drives with an ATS-certified resume and verified skill portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Pre-Footer CTA ---------------- */}
      <section className="home-cta-section">
        <div className="home-cta-box">
          <h2 className="home-cta-title">Ready to Take Control of Your Career Path?</h2>
          <p className="home-cta-sub">
            Join thousands of engineering students preparing systematically for tier 1 campus placements.
          </p>
          <div className="home-cta-actions">
            <Link to="/onboarding" className="home-btn-lg-primary" style={{ background: '#FFFFFF', color: '#4F46E5' }}>
              <span>Get Started with Onboarding</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="home-btn-lg-secondary" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              <span>Sign In to Account</span>
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
              <li><Link to="/onboarding" className="home-footer-link">Student Onboarding Wizard</Link></li>
              <li><Link to="/dashboard" className="home-footer-link">Student Dashboard</Link></li>
              <li><Link to="/roadmap" className="home-footer-link">Career Roadmap</Link></li>
              <li><Link to="/practice" className="home-footer-link">Practice Arena</Link></li>
              <li><Link to="/resume-builder" className="home-footer-link">ATS Resume Builder</Link></li>
              <li><Link to="/learning" className="home-footer-link">Learning Hub & Handbooks</Link></li>
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
