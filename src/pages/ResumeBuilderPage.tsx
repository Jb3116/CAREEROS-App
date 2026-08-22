import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Sparkles,
  Download,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  // Resume State Data
  const [resumeData, setResumeData] = useState({
    docTitle: 'Alex_Chen_SWE_Resume_2026.pdf',
    fullName: 'Alex Chen',
    email: 'alex.chen@vit.edu',
    phone: '+91 98765 43210',
    location: 'Vellore, Tamil Nadu / Bangalore',
    linkedin: 'linkedin.com/in/alexchen-swe',
    github: 'github.com/alexchen-dev',
    portfolio: 'alexchen.dev',
    summary:
      'Proactive 3rd-year Computer Science student with strong foundations in Data Structures, Algorithms, Distributed Systems, and Modern Full-Stack Development. Experienced in architecting scalable microservices in TypeScript, Go, and React with a proven track record of optimizing database query performance by 40%.',
    education: {
      college: 'Vellore Institute of Technology, Vellore',
      degree: 'B.Tech in Computer Science and Engineering',
      duration: '2023 - 2027',
      cgpa: '8.9 / 10.0',
      coursework: 'Data Structures & Algorithms, Operating Systems, Database Management, Computer Networks, System Design',
    },
    skills: {
      languages: 'C++, Python, TypeScript, JavaScript, Java, Go, SQL',
      frameworks: 'React, Node.js, Express, Next.js, FastAPI, TailwindCSS',
      tools: 'Docker, Git, Kubernetes, Redis, PostgreSQL, MongoDB, Linux, AWS',
    },
    experiences: [
      {
        id: 'e1',
        role: 'Software Engineering Intern',
        company: 'CloudScale Technologies',
        location: 'Bangalore, India (Remote)',
        duration: 'May 2025 - Jul 2025',
        bullets: [
          'Engineered resilient REST & gRPC endpoints in Node.js/TypeScript handling 120k+ daily telemetry requests.',
          'Reduced PostgreSQL query latency by 42% through strategic index optimization and Redis caching layers.',
          'Integrated GitHub Actions CI/CD pipeline, reducing deployment release cycles from 45 minutes to 6 minutes.',
        ],
      },
    ],
    projects: [
      {
        id: 'p1',
        title: 'CareerOS - AI Student Career Operating System',
        tech: 'React, TypeScript, Node.js, SQLite, Vite',
        link: 'github.com/alexchen-dev/careeros',
        bullets: [
          'Built an intelligent career readiness engine tracking student skill masteries and automated gap detection.',
          'Implemented real-time code execution guidance and ATS resume scoring with sub-50ms latency.',
        ],
      },
      {
        id: 'p2',
        title: 'Distributed In-Memory Key-Value Store',
        tech: 'Go, Raft Consensus, gRPC',
        link: 'github.com/alexchen-dev/go-kv-raft',
        bullets: [
          'Designed a fault-tolerant distributed storage node using the Raft consensus algorithm with leader election and log replication.',
          'Benchmarked write throughput surpassing 18,000 ops/sec with sub-millisecond p99 consistency latency.',
        ],
      },
    ],
    achievements: [
      'Solved 350+ Data Structures & Algorithm problems on LeetCode (Rating: 1880+ Top 6%).',
      'Winner, Smart India Hackathon 2025 (Campus Round - AI Track).',
      'Academic Merit Scholarship Recipient for top 5% batch ranking at VIT.',
    ],
  });

  // UI state for accordion
  const [openSections, setOpenSections] = useState({
    contact: true,
    summary: true,
    education: true,
    skills: true,
    experience: true,
    projects: true,
    achievements: true,
  });

  const toggleSection = (sec: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleAiEnhance = () => {
    setResumeData((prev) => ({
      ...prev,
      summary:
        'Results-driven Software Engineer with extensive experience in Algorithms, Distributed Systems, and High-Throughput Web Applications. Demonstrated expertise in reducing system latency by 42%, architecting resilient backend services, and scaling cloud-native infrastructure.',
    }));
    alert('✨ AI Resume Summary enhanced with high-impact action verbs and quantified engineering metrics!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-builder-page">
      {/* ---------------- Top Navigation Bar ---------------- */}
      <header className="resume-topbar" role="banner">
        <div className="resume-topbar-left">
          <button
            className="resume-btn-secondary"
            onClick={() => navigate('/dashboard')}
            title="Return to Student Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <input
            type="text"
            className="resume-doc-title-input"
            value={resumeData.docTitle}
            onChange={(e) => setResumeData({ ...resumeData, docTitle: e.target.value })}
            title="Rename Resume"
          />

          <div className="resume-ats-badge">
            <CheckCircle2 size={16} />
            <span>91% ATS Optimized • Tier 1 Standard</span>
          </div>
        </div>

        <div className="resume-topbar-actions">
          <button className="resume-btn-ai" onClick={handleAiEnhance} title="AI Auto-Enhance Resume">
            <Sparkles size={16} />
            <span>AI Enhance</span>
          </button>

          <button className="resume-btn-primary" onClick={handlePrint} title="Download ATS Resume PDF">
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* ---------------- Split Screen Workspace ---------------- */}
      <div className="resume-workspace">
        {/* Left Side: Editor Form */}
        <aside className="resume-editor-panel" aria-label="Resume Form Editor">
          {/* Section 1: Contact Information */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('contact')}>
              <span>1. Contact & Header Info</span>
              {openSections.contact ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.contact && (
              <div className="resume-accordion-body">
                <div className="resume-field-group">
                  <label className="resume-field-label">Full Name</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.fullName}
                    onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">Email Address</label>
                  <input
                    type="email"
                    className="resume-input"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">Phone & Location</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">LinkedIn & GitHub URLs</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Summary */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('summary')}>
              <span>2. Professional Summary</span>
              {openSections.summary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.summary && (
              <div className="resume-accordion-body">
                <div className="resume-field-group">
                  <label className="resume-field-label">Executive Bio</label>
                  <textarea
                    className="resume-textarea"
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Education */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('education')}>
              <span>3. Education & Academics</span>
              {openSections.education ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.education && (
              <div className="resume-accordion-body">
                <div className="resume-field-group">
                  <label className="resume-field-label">Institution Name</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.education.college}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        education: { ...resumeData.education, college: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">Degree & CGPA</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.education.degree}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        education: { ...resumeData.education, degree: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Skills */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('skills')}>
              <span>4. Technical Skills</span>
              {openSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.skills && (
              <div className="resume-accordion-body">
                <div className="resume-field-group">
                  <label className="resume-field-label">Languages</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.skills.languages}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        skills: { ...resumeData.skills, languages: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">Frameworks & Libraries</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.skills.frameworks}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        skills: { ...resumeData.skills, frameworks: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="resume-field-group">
                  <label className="resume-field-label">Tools, Cloud & Databases</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.skills.tools}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        skills: { ...resumeData.skills, tools: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Live A4 ATS Real-Time Preview */}
        <main className="resume-preview-panel" role="main" aria-label="Resume Live Preview">
          <div className="resume-paper" id="resume-print-area">
            {/* Header */}
            <div className="paper-header">
              <h1 className="paper-name">{resumeData.fullName}</h1>
              <div className="paper-contact-row">
                <span>{resumeData.phone}</span>
                <span>•</span>
                <span>{resumeData.email}</span>
                <span>•</span>
                <span>{resumeData.location}</span>
              </div>
              <div className="paper-contact-row" style={{ marginTop: 4 }}>
                <a href={`https://${resumeData.linkedin}`} target="_blank" rel="noreferrer">
                  {resumeData.linkedin}
                </a>
                <span>•</span>
                <a href={`https://${resumeData.github}`} target="_blank" rel="noreferrer">
                  {resumeData.github}
                </a>
                <span>•</span>
                <a href={`https://${resumeData.portfolio}`} target="_blank" rel="noreferrer">
                  {resumeData.portfolio}
                </a>
              </div>
            </div>

            {/* Summary */}
            <div className="paper-section">
              <h2 className="paper-section-title">Professional Summary</h2>
              <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                {resumeData.summary}
              </p>
            </div>

            {/* Education */}
            <div className="paper-section">
              <h2 className="paper-section-title">Education</h2>
              <div className="paper-entry">
                <div className="paper-entry-header">
                  <span>{resumeData.education.college}</span>
                  <span>{resumeData.education.duration}</span>
                </div>
                <div className="paper-entry-sub">
                  <span>{resumeData.education.degree}</span>
                  <span>CGPA: {resumeData.education.cgpa}</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                  <strong>Coursework:</strong> {resumeData.education.coursework}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="paper-section">
              <h2 className="paper-section-title">Technical Skills</h2>
              <div className="paper-skill-line">
                <strong>Languages:</strong> {resumeData.skills.languages}
              </div>
              <div className="paper-skill-line">
                <strong>Frameworks:</strong> {resumeData.skills.frameworks}
              </div>
              <div className="paper-skill-line">
                <strong>Tools & Infrastructure:</strong> {resumeData.skills.tools}
              </div>
            </div>

            {/* Experience */}
            <div className="paper-section">
              <h2 className="paper-section-title">Work Experience</h2>
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="paper-entry">
                  <div className="paper-entry-header">
                    <span>{exp.role} — {exp.company}</span>
                    <span>{exp.duration}</span>
                  </div>
                  <div className="paper-entry-sub">
                    <span>{exp.location}</span>
                  </div>
                  <ul className="paper-bullet-list">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="paper-section">
              <h2 className="paper-section-title">Projects</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="paper-entry">
                  <div className="paper-entry-header">
                    <span>{proj.title}</span>
                    <span style={{ fontSize: 12, color: '#2563EB', fontWeight: 500 }}>{proj.link}</span>
                  </div>
                  <div className="paper-entry-sub">
                    <span>Tech Stack: {proj.tech}</span>
                  </div>
                  <ul className="paper-bullet-list">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="paper-section">
              <h2 className="paper-section-title">Honors & Certifications</h2>
              <ul className="paper-bullet-list">
                {resumeData.achievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
