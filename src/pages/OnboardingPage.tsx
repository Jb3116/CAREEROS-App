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
  Building,
  Target,
  BookOpen,
  ChevronRight,
  Award,
  Calendar,
  Cpu,
  Layers,
} from 'lucide-react';
import { getStudentProfile, saveStudentProfile } from '../utils/userProfile';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized from existing user profile if present
  const existingProfile = getStudentProfile();
  const [formData, setFormData] = useState({
    fullName: existingProfile.name || '',
    college: existingProfile.college || 'Vellore Institute of Technology, Chennai',
    degree: existingProfile.degree || 'B.Tech in Computer Science & Engineering',
    currentYear: existingProfile.currentYear || '3rd Year',
    gradYear: existingProfile.gradYear || '2027',
    cgpa: existingProfile.cgpa || '8.9',
    rollNumber: existingProfile.rollNumber || '23BCE1042',
    targetRoles: existingProfile.targetRoles && existingProfile.targetRoles.length > 0
      ? existingProfile.targetRoles
      : ['Software Development Engineer', 'Full Stack Developer'],
    targetCompanyTypes: existingProfile.targetCompanyTypes && existingProfile.targetCompanyTypes.length > 0
      ? existingProfile.targetCompanyTypes
      : ['Tier-1 Product Companies (FAANG & High Tier)', 'High-Growth Tech Startups'],
    primaryLanguages: existingProfile.primaryLanguages && existingProfile.primaryLanguages.length > 0
      ? existingProfile.primaryLanguages
      : ['C++', 'Python', 'TypeScript', 'SQL'],
    frameworks: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    dsaLevel: 'Intermediate (150+ LeetCode solved - Trees, Graphs, DP)',
    weeklyHours: '10 - 15 Hours / Week (Recommended)',
    routinePreference: 'Evening (6:00 PM - 10:00 PM)',
    targetAssessment: 'Google & Goldman Sachs Campus Drive (Aug 2026)',
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
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Save all inputted details to the global user profile and state
      saveStudentProfile({
        name: formData.fullName || 'Student',
        college: formData.college,
        degree: formData.degree,
        year: formData.currentYear,
        currentYear: formData.currentYear,
        gradYear: formData.gradYear,
        cgpa: formData.cgpa,
        rollNumber: formData.rollNumber,
        targetRoles: formData.targetRoles,
        targetCompanyTypes: formData.targetCompanyTypes,
        primaryLanguages: formData.primaryLanguages,
      });

      navigate('/assessment');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { num: 1, label: 'Profile', icon: GraduationCap },
    { num: 2, label: 'Career Goals', icon: Target },
    { num: 3, label: 'Tech Stack', icon: Code2 },
    { num: 4, label: 'Study Routine', icon: Clock },
    { num: 5, label: 'AI Calibration', icon: Rocket },
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
              Step {currentStep} of {steps.length}
            </span>
            <button className="onboard-skip-btn" onClick={() => navigate('/assessment')}>
              Skip to Assessment →
            </button>
          </div>
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
                role="button"
                tabIndex={0}
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

      {/* ---------------- Main Wizard Card ---------------- */}
      <main className="onboard-card">
        {/* Step 1: Education & Academic Identity */}
        {currentStep === 1 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 1: Academic & University Identity 🎓</h1>
              <p className="onboard-card-desc">
                Help CAREEROS calibrate your initial syllabus and benchmark against peer cohort averages.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Full Legal Name</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    required
                  />
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Student ID / Roll Number</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 23BCE1042"
                  />
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">College / University</label>
                <input
                  type="text"
                  className="onboard-input"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Vellore Institute of Technology, Chennai"
                  required
                />
              </div>

              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Degree & Department</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. B.Tech in Computer Science & Engineering"
                  />
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Current Academic Year</label>
                  <select
                    className="onboard-select"
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="onboard-grid-2">
                <div className="onboard-field">
                  <label className="onboard-label">Graduation Year</label>
                  <input
                    type="text"
                    className="onboard-input"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    placeholder="e.g. 2027"
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

        {/* Step 2: Target Career Goals & Roles */}
        {currentStep === 2 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 2: Target Career Goals & Roles 🎯</h1>
              <p className="onboard-card-desc">
                Select the technical engineering tracks and company environments you are targeting.
              </p>
            </div>

            <div className="onboard-form">
              <div className="onboard-field">
                <label className="onboard-label">Primary Target Roles (Select all that apply)</label>
                <div className="onboard-pill-group">
                  {[
                    'Software Development Engineer',
                    'Full Stack Developer',
                    'Frontend Engineer',
                    'Backend / Cloud Engineer',
                    'Data Scientist / AI Engineer',
                    'DevOps & Site Reliability',
                    'EEE Core Jobs',
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
                    'Tier-1 Product Companies (FAANG & High Tier)',
                    'High-Growth Tech Startups',
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

        {/* Step 3: Tech Stack & Coding Languages */}
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
                <label className="onboard-label">Primary Programming Languages</label>
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
                  <option>Beginner (0 - 50 problems: Arrays, Strings, Basic Math)</option>
                  <option>Intermediate (150+ LeetCode solved - Trees, Graphs, DP)</option>
                  <option>Advanced (300+ Solved - Dynamic Programming, Tries, Segment Trees)</option>
                  <option>Competitive Programmer (Codeforces 1600+ / LeetCode Knight)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Schedule & Study Routine */}
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
                  <label className="onboard-label">Weekly Prep Hours Commitment</label>
                  <select
                    className="onboard-select"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                  >
                    <option>5 - 10 Hours / Week (Light / Balance with Classes)</option>
                    <option>10 - 15 Hours / Week (Recommended)</option>
                    <option>15 - 25 Hours / Week (Intensive Sprint)</option>
                  </select>
                </div>
                <div className="onboard-field">
                  <label className="onboard-label">Daily Study Slot</label>
                  <select
                    className="onboard-select"
                    value={formData.routinePreference}
                    onChange={(e) => setFormData({ ...formData, routinePreference: e.target.value })}
                  >
                    <option>Early Bird (6:00 AM - 9:00 AM)</option>
                    <option>Afternoon (1:00 PM - 4:00 PM)</option>
                    <option>Evening (6:00 PM - 10:00 PM)</option>
                    <option>Night Owl (10:00 PM - 1:00 AM)</option>
                  </select>
                </div>
              </div>

              <div className="onboard-field">
                <label className="onboard-label">Target Placement Drive / Milestone</label>
                <input
                  type="text"
                  className="onboard-input"
                  value={formData.targetAssessment}
                  onChange={(e) => setFormData({ ...formData, targetAssessment: e.target.value })}
                  placeholder="e.g. Google & Goldman Sachs Campus Drive (Aug 2026)"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 5: AI Engine Roadmap Generation */}
        {currentStep === 5 && (
          <>
            <div className="onboard-card-header">
              <h1 className="onboard-card-title">Step 5: Dynamic AI Calibration & Synthesis 🚀</h1>
              <p className="onboard-card-desc">
                Synthesizing personalized diagnostic curriculum and benchmarks for <strong>{formData.fullName || 'Student'}</strong>.
              </p>
            </div>

            {/* Dynamic AI Calibration Live Feed */}
            <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: 18, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4F46E5', fontWeight: 800, fontSize: 13 }}>
                <Sparkles size={16} className="animate-spin" />
                <span>AI Calibration Feed (Live Synthesis):</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>Analyzing <strong>{formData.currentYear}</strong> curriculum for <strong>{formData.college || 'your institution'}</strong>...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>
                    Calibrating <strong>{formData.targetRoles.length > 0 ? formData.targetRoles.join(' & ') : 'Engineering'}</strong> roadmap for <strong>{formData.fullName || 'Student'}</strong>...
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>Configuring <strong>{formData.degree || 'Engineering'}</strong> core modules &amp; interview benchmarks...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#10B981" />
                  <span>
                    Synthesized targets for <strong>{formData.primaryLanguages.join(', ')}</strong> ({formData.weeklyHours.split('(')[0]}).
                  </span>
                </div>
              </div>
            </div>

            <div className="onboard-summary-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#4F46E5', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>
                    {(formData.fullName ? formData.fullName.slice(0, 2) : 'ST').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{formData.fullName || 'Student Profile'}</div>
                    <div style={{ fontSize: 12, color: '#C7D2FE' }}>
                      {formData.college} &bull; {formData.currentYear}
                    </div>
                  </div>
                </div>
                <span style={{ background: '#10B981', color: '#FFF', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                  Online &amp; Calibrated
                </span>
              </div>

              {/* Dynamic Target Tracks */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11.5, color: '#C7D2FE', fontWeight: 700, marginBottom: 6 }}>
                  Calibrated Target Roles &amp; Career Tracks:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {formData.targetRoles.map((role) => (
                    <span
                      key={role}
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      ✓ {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="onboard-summary-stats" style={{ marginTop: 14 }}>
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF' }}>78%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>{formData.currentYear} Readiness</div>
                </div>
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#34D399' }}>91%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>ATS Resume Score</div>
                </div>
                <div className="onboard-summary-stat-card">
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#FBBF24' }}>94%</div>
                  <div style={{ fontSize: 11, color: '#C7D2FE', marginTop: 2 }}>Target Match</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: 10, fontSize: 12.5, lineHeight: 1.5, color: '#E0E7FF', marginTop: 14 }}>
                💡 <strong>Next Step:</strong> Start your <em>Diagnostic Placement Assessment</em> to baseline your coding speed and CS / Core knowledge under real interview test conditions.
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
            <span>{currentStep === 5 ? 'Start Diagnostic Assessment 🚀' : 'Continue Next →'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
