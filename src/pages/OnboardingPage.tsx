import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code2,
  Clock,
  Rocket,
  Check,
  Zap,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Alex Chen',
    college: 'Vellore Institute of Technology',
    degree: 'B.Tech in Computer Science & Engineering',
    gradYear: '2027 (3rd Year)',
    cgpa: '8.9',
    targetRoles: ['Software Development Engineer', 'Full Stack Developer'],
    targetCompanyTypes: ['Tier-1 Product Companies', 'High-Growth Tech Startups'],
    primaryLanguages: ['C++', 'Python', 'TypeScript'],
    frameworks: ['React', 'Node.js', 'PostgreSQL'],
    dsaLevel: 'Intermediate (150+ LeetCode solved)',
    weeklyHours: '10 - 15 Hours / Week',
    routinePreference: 'Evening (6 PM - 10 PM)',
    targetAssessment: 'Google Campus Drive (Aug 2026)',
  });

  const toggleRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryLanguages: prev.primaryLanguages.includes(lang)
        ? prev.primaryLanguages.filter((l) => l !== lang)
        : [...prev.primaryLanguages, lang],
    }));
  };

  const toggleCompanyType = (comp: string) => {
    setFormData((prev) => ({
      ...prev,
      targetCompanyTypes: prev.targetCompanyTypes.includes(comp)
        ? prev.targetCompanyTypes.filter((c) => c !== comp)
        : [...prev.targetCompanyTypes, comp],
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else navigate('/dashboard');
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { num: 1, label: 'Profile', icon: GraduationCap },
    { num: 2, label: 'Goals', icon: Briefcase },
    { num: 3, label: 'Tech Stack', icon: Code2 },
    { num: 4, label: 'Routine', icon: Clock },
    { num: 5, label: 'AI Roadmap', icon: Rocket },
  ];

  return (
    <div className="onboard-container">
      {/* ---------------- Top Header ---------------- */}
      <header className="onboard-header">
        <div className="onboard-top-nav">
          <Link to="/" className="onboard-brand" title="CAREEROS Home">
            <div className="onboard-logo-icon">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <span>CAREEROS</span>
          </Link>

          <button className="onboard-skip-btn" onClick={() => navigate('/dashboard')}>
            Skip to Dashboard →
          </button>
        </div>

        {/* 5-Step Progress Tracker */}
        <div className="onboard-progress-tracker">
          <div className="onboard-progress-bar-bg">
            <div
              className="onboard-progress-bar-fill"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`onboard-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setCurrentStep(s.num)}
              >
                <div className="onboard-node-circle">
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                </div>
                <span className="onboard-node-label">{s.label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ---------------- Wizard Card ---------------- */}
      <main className="onboard-card">
        {/* Step 1: Education & Personal */}
        {currentStep === 1 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 1: Academic & Student Profile 🎓</h1>
              <p className="onboard-card-desc">
                Help CAREEROS calibrate your initial syllabus and benchmark against peer averages.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Full Name</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Chen"
                  />
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Graduation Year / Cohort</label>
                  <select
                    className="onboard-select"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                  >
                    <option>2027 (3rd Year)</option>
                    <option>2028 (2nd Year)</option>
                    <option>2026 (Final Year)</option>
                    <option>2029 (1st Year)</option>
                  </select>
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">College / University</label>
                <input
                  type="text"
                  className="onboard-input"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Vellore Institute of Technology"
                />
              </div>

              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Degree & Specialization</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  />
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Cumulative GPA / Percentage</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="e.g. 8.9 / 10.0"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Target Roles & Companies */}
        {currentStep === 2 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 2: Target Career Goals 🎯</h1>
              <p className="onboard-card-desc">
                Select the technical roles and hiring tier environments you are preparing for.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-field">
                <label className="onboard-label">Target Roles (Select all that apply)</label>
                <div className="onboard-pill-group">
                  {[
                    'Software Development Engineer',
                    'Full Stack Developer',
                    'Frontend Engineer',
                    'Backend / Cloud Engineer',
                    'Data Scientist / AI Engineer',
                    'DevOps & Site Reliability',
                  ].map((role) => {
                    const isSelected = formData.targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        className={`onboard-pill-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleRole(role)}
                      >
                        {isSelected && <Check size={14} />}
                        <span>{role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">Target Company Tiers</label>
                <div className="onboard-pill-group">
                  {[
                    'Tier-1 Product Companies (Google, Microsoft, Amazon)',
                    'High-Growth Tech Startups (Zepto, Razorpay, Uber)',
                    'FinTech & Quant Firms (Goldman Sachs, D.E. Shaw)',
                    'IT Services & Enterprise Consulting',
                  ].map((comp) => {
                    const isSelected = formData.targetCompanyTypes.includes(comp);
                    return (
                      <button
                        key={comp}
                        type="button"
                        className={`onboard-pill-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleCompanyType(comp)}
                      >
                        {isSelected && <Check size={14} />}
                        <span>{comp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Programming Languages & Stack */}
        {currentStep === 3 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 3: Tech Stack & Coding Languages 💻</h1>
              <p className="onboard-card-desc">
                Tell us your preferred problem-solving languages for technical assessments.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-field">
                <label className="onboard-label">Primary Coding Languages</label>
                <div className="onboard-pill-group">
                  {['C++', 'Java', 'Python', 'TypeScript', 'JavaScript', 'Go', 'SQL', 'C#'].map((lang) => {
                    const isSelected = formData.primaryLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        className={`onboard-pill-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleLanguage(lang)}
                      >
                        {isSelected && <Check size={14} />}
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">Current DSA & Coding Practice Level</label>
                <select
                  className="onboard-select"
                  value={formData.dsaLevel}
                  onChange={(e) => setFormData({ ...formData, dsaLevel: e.target.value })}
                >
                  <option>Beginner (Starting with Arrays, Strings & Math)</option>
                  <option>Intermediate (150+ LeetCode solved - Trees, Recursion, Stack)</option>
                  <option>Advanced (300+ Solved - Dynamic Programming, Graphs, Tries)</option>
                  <option>Competitive Programmer (Codeforces / CodeChef active)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Availability & Schedule */}
        {currentStep === 4 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 4: Prep Schedule & Routine ⏱️</h1>
              <p className="onboard-card-desc">
                We design your daily adaptive task lists around your real-world availability.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Weekly Prep Hours</label>
                  <select
                    className="onboard-select"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                  >
                    <option>5 - 10 Hours / Week (Light)</option>
                    <option>10 - 15 Hours / Week (Recommended)</option>
                    <option>15 - 25 Hours / Week (Intensive)</option>
                  </select>
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Daily Study Slot</label>
                  <select
                    className="onboard-select"
                    value={formData.routinePreference}
                    onChange={(e) => setFormData({ ...formData, routinePreference: e.target.value })}
                  >
                    <option>Morning (6 AM - 9 AM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (6 PM - 10 PM)</option>
                    <option>Night Owl (10 PM - 1 AM)</option>
                  </select>
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">First Upcoming Assessment / Drive</label>
                <input
                  type="text"
                  className="onboard-input"
                  value={formData.targetAssessment}
                  onChange={(e) => setFormData({ ...formData, targetAssessment: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        {/* Step 5: AI Engine Roadmap Generation */}
        {currentStep === 5 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 5: Your Personalized AI CareerOS is Ready! 🚀</h1>
              <p className="onboard-card-desc">
                We have synthesized your profile, target role requirements, and learning velocity into an actionable roadmap.
              </p>
            </div>

            <div className="onboard-summary-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={22} color="#F59E0B" />
                  <span style={{ fontSize: 16, fontWeight: 800 }}>Student Intelligence Profile Activated</span>
                </div>
                <span style={{ background: '#10B981', color: '#FFF', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                  Online & Calibrated
                </span>
              </div>

              <div className="onboard-summary-stats">
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>78%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>Baseline Readiness</div>
                </div>
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#34D399' }}>91%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>ATS Resume Score</div>
                </div>
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#FBBF24' }}>94%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>Goldman Sachs Match</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: 14, borderRadius: 12, fontSize: 13, lineHeight: 1.5, color: '#E0E7FF' }}>
                💡 <strong>Next Best Action:</strong> Complete the <em>2 Tree Problems</em> module in your Practice Arena to bridge the detected Binary Search Tree mastery gap before the upcoming Google Campus Assessment.
              </div>
            </div>
          </>
        )}

        {/* ---------------- Footer Actions ---------------- */}
        <div className="onboard-footer-actions">
          {currentStep > 1 ? (
            <button type="button" className="onboard-btn-back" onClick={prevStep}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button type="button" className="onboard-btn-next" onClick={nextStep}>
            <span>{currentStep === 5 ? 'Launch Student Dashboard 🚀' : 'Continue Next →'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
