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
  Layout,
  Search,
} from 'lucide-react';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  bullets: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  link: string;
  bullets: string[];
}

export const ResumeBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>('modern');

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
    ] as ExperienceItem[],
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
    ] as ProjectItem[],
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

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Full Stack Developer Intern',
      company: 'TechCorp Solutions',
      location: 'Bangalore / Remote',
      duration: 'Jan 2025 - Apr 2025',
      bullets: ['Developed responsive web interfaces in React and optimized backend API response time.'],
    };
    setResumeData((prev) => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const deleteExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Real-Time Collaborative Code Editor',
      tech: 'React, WebSockets, Node.js, Monaco Editor',
      link: 'github.com/alexchen-dev/collab-code',
      bullets: ['Enabled multi-user concurrent editing with operational transformation algorithms.'],
    };
    setResumeData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const deleteProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
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
            <span>91% ATS Optimized • Tier 1 Ready</span>
          </div>
        </div>

        <div className="resume-topbar-actions">
          {/* Template Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 10, padding: 4 }}>
            <Layout size={14} color="#64748B" style={{ marginLeft: 6 }} />
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              style={{ background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 700, color: '#1E293B', outline: 'none', cursor: 'pointer' }}
            >
              <option value="modern">Modern Tech Standard</option>
              <option value="classic">Classic Ivy League</option>
              <option value="minimal">Minimal Single-Column</option>
            </select>
          </div>

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
                  <label className="resume-field-label">LinkedIn & GitHub Handles</label>
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
                <div className="resume-field-group">
                  <label className="resume-field-label">Relevant Coursework</label>
                  <input
                    type="text"
                    className="resume-input"
                    value={resumeData.education.coursework}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        education: { ...resumeData.education, coursework: e.target.value },
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
                  <label className="resume-field-label">Programming Languages</label>
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
                  <label className="resume-field-label">Developer Tools, Cloud & Databases</label>
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

          {/* Section 5: Experience */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('experience')}>
              <span>5. Work Experience & Internships</span>
              {openSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.experience && (
              <div className="resume-accordion-body">
                {resumeData.experiences.map((exp, idx) => (
                  <div key={exp.id} style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 13, color: '#0F172A' }}>Position #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => deleteExperience(exp.id)}
                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                        title="Delete Experience"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="Role (e.g. Software Engineering Intern)"
                      value={exp.role}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          experiences: prev.experiences.map((item) => (item.id === exp.id ? { ...item, role: val } : item)),
                        }));
                      }}
                    />
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="Company (e.g. CloudScale Technologies)"
                      value={exp.company}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          experiences: prev.experiences.map((item) => (item.id === exp.id ? { ...item, company: val } : item)),
                        }));
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: 8,
                    borderRadius: 8,
                    background: '#EEF2FF',
                    border: '1px dashed #4F46E5',
                    color: '#4F46E5',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>Add Work Experience</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Projects */}
          <div className="resume-section-accordion">
            <button className="resume-accordion-header" onClick={() => toggleSection('projects')}>
              <span>6. Technical Projects</span>
              {openSections.projects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSections.projects && (
              <div className="resume-accordion-body">
                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 13, color: '#0F172A' }}>Project #{idx + 1}</strong>
                      <button
                        type="button"
                        onClick={() => deleteProject(proj.id)}
                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, title: val } : item)),
                        }));
                      }}
                    />
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="Tech Stack (e.g. React, Node.js, Docker)"
                      value={proj.tech}
                      onChange={(e) => {
                        const val = e.target.value;
                        setResumeData((prev) => ({
                          ...prev,
                          projects: prev.projects.map((item) => (item.id === proj.id ? { ...item, tech: val } : item)),
                        }));
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: 8,
                    borderRadius: 8,
                    background: '#EEF2FF',
                    border: '1px dashed #4F46E5',
                    color: '#4F46E5',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
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
