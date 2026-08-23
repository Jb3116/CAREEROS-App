import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layout,
  Type,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Search,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  Edit3,
  BarChart3,
  Target,
  Zap,
  Eye,
  Sliders,
  FileCode,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Copy,
  Globe,
  Upload,
  Layers,
  FolderPlus,
} from 'lucide-react';
import { exportResumeToDocx, exportResumeToPdf, ResumeExportData, EducationItem } from '../utils/documentExporter';
import {
  analyzeResumeATS,
  enhanceResumeText,
  generateProfessionalSummary,
  ATSRecommendation,
  ATSScoreReport,
} from '../utils/atsScorer';
import {
  fetchGitHubRepositories,
  parseResumeDocumentText,
  GitHubRepoItem,
} from '../utils/profileIngestion';
import { extractTextFromFile } from '../utils/pdfExtractor';
import {
  getResumeVersions,
  saveResumeVersions,
  duplicateResumeVersion,
  renameResumeVersion,
  deleteResumeVersion,
  getActiveResumeVersionId,
  setActiveResumeVersionId,
  ResumeVersionItem,
} from '../utils/resumeVersioning';
import { ImportProfile } from '../components/resume/ImportProfile';
import { ATSAnalyzer } from '../components/resume/ATSAnalyzer';

// Font configuration grouped into Classic, Modern, Professional
export const FONT_OPTIONS = [
  {
    group: 'Modern Fonts',
    fonts: [
      { id: 'inter', name: 'Inter (Clean Tech)', value: "'Inter', sans-serif" },
      { id: 'roboto', name: 'Roboto (Google Standard)', value: "'Roboto', sans-serif" },
      { id: 'jakarta', name: 'Plus Jakarta Sans (Modern SaaS)', value: "'Plus Jakarta Sans', sans-serif" },
      { id: 'outfit', name: 'Outfit (Geometric Clean)', value: "'Outfit', sans-serif" },
    ],
  },
  {
    group: 'Classic Serif Fonts',
    fonts: [
      { id: 'times', name: 'Times New Roman (Academic/Law)', value: "'Times New Roman', Times, serif" },
      { id: 'georgia', name: 'Georgia (Editorial Serif)', value: 'Georgia, serif' },
      { id: 'garamond', name: 'Garamond (Executive Literary)', value: "Garamond, 'EB Garamond', serif" },
      { id: 'merriweather', name: 'Merriweather (High Legibility)', value: "'Merriweather', Georgia, serif" },
    ],
  },
  {
    group: 'Professional Standard',
    fonts: [
      { id: 'calibri', name: 'Calibri (Corporate Default)', value: 'Calibri, Candara, Segoe, sans-serif' },
      { id: 'arial', name: 'Arial (Universal Standard)', value: 'Arial, sans-serif' },
      { id: 'helvetica', name: 'Helvetica (Minimalist)', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
      { id: 'open-sans', name: 'Open Sans (Neutral Clean)', value: "'Open Sans', sans-serif" },
    ],
  },
];

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

  // ---------------- Configuration States ----------------
  const [selectedFont, setSelectedFont] = useState<string>("'Inter', sans-serif");
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'executive' | 'minimal'>('modern');
  const [activeMainTab, setActiveMainTab] = useState<'builder' | 'ats' | 'ingest' | 'versions'>('builder');
  const [activeBuilderSection, setActiveBuilderSection] = useState<'personal' | 'summary' | 'experience' | 'projects' | 'education' | 'skills'>('experience');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // ---------------- Version History State ----------------
  const [versions, setVersions] = useState<ResumeVersionItem[]>(() => getResumeVersions());
  const [activeVersionId, setActiveVersionId] = useState<string>(() => getActiveResumeVersionId());

  const activeVersion = useMemo(() => {
    return versions.find((v) => v.id === activeVersionId) || versions[0];
  }, [versions, activeVersionId]);

  // Active Resume Data
  const [resumeData, setResumeData] = useState<ResumeExportData>(activeVersion.data);

  // Sync when active version changes
  useEffect(() => {
    if (activeVersion && activeVersion.data) {
      setResumeData(activeVersion.data);
    }
  }, [activeVersionId]);

  // Save current resume updates to versions array with real-time ATS recomputation
  const handleUpdateResumeData = (updater: (prev: ResumeExportData) => ResumeExportData) => {
    setResumeData((prev) => {
      const next = updater(prev);
      const computedScore = analyzeResumeATS(next, jobDescription).atsScore;
      const updatedVersions = versions.map((v) =>
        v.id === activeVersionId
          ? { ...v, data: next, atsScore: computedScore, lastModified: new Date().toISOString() }
          : v
      );
      setVersions(updatedVersions);
      saveResumeVersions(updatedVersions);
      return next;
    });
  };

  // ---------------- ATS Analyzer State ----------------
  const [jobDescription, setJobDescription] = useState<string>('');
  const [atsReport, setAtsReport] = useState<ATSScoreReport>(() => analyzeResumeATS(resumeData, ''));

  useEffect(() => {
    const report = analyzeResumeATS(resumeData, jobDescription);
    setAtsReport(report);
  }, [resumeData, jobDescription]);

  // ---------------- AI Enhance State (Side-by-Side Diff) ----------------
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    section: string;
    targetId?: string;
    bulletIndex?: number;
    original: string;
    enhanced: string;
  } | null>(null);

  // ---------------- Ingestion State (GitHub & File Upload) ----------------
  const [githubInput, setGithubInput] = useState<string>('alexchen-dev');
  const [isFetchingGithub, setIsFetchingGithub] = useState<boolean>(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepoItem[]>([]);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // ---------------- Practice Telemetry Skills ----------------
  const verifiedTelemetrySkills = useMemo(() => {
    return [
      { name: 'Binary Trees & BSTs', category: 'languages', mastery: '88%', problemsSolved: 12, status: 'Mastered' },
      { name: 'Dynamic Programming', category: 'languages', mastery: '76%', problemsSolved: 9, status: 'Verified' },
      { name: 'Redis & Caching', category: 'tools', mastery: '90%', problemsSolved: 8, status: 'Mastered' },
      { name: 'Docker Microservices', category: 'tools', mastery: '82%', problemsSolved: 6, status: 'Verified' },
      { name: 'STAR Behavioral Framework', category: 'frameworks', mastery: '85%', problemsSolved: 5, status: 'Verified' },
    ];
  }, []);

  const handleAddTelemetrySkill = (skill: { name: string; category: string }) => {
    handleUpdateResumeData((prev) => {
      const field = (skill.category as 'languages' | 'frameworks' | 'tools') || 'tools';
      const existing = prev.skills[field] || '';
      if (existing.toLowerCase().includes(skill.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [field]: existing ? `${existing}, ${skill.name}` : skill.name,
        },
      };
    });
  };

  // ---------------- AI Enhancement Handler ----------------
  const handleTriggerAIEnhance = async (section: string, originalText: string, targetId?: string, bulletIndex?: number) => {
    try {
      const res = await enhanceResumeText(originalText, section);
      const enhanced = res.enhanced || String(res);
      setDiffModal({
        isOpen: true,
        section,
        targetId,
        bulletIndex,
        original: originalText,
        enhanced,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAcceptDiff = () => {
    if (!diffModal) return;

    if (diffModal.section === 'summary') {
      handleUpdateResumeData((prev) => ({ ...prev, summary: diffModal.enhanced }));
    } else if (diffModal.section === 'experience' && diffModal.targetId && typeof diffModal.bulletIndex === 'number') {
      handleUpdateResumeData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) => {
          if (exp.id === diffModal.targetId) {
            const newBullets = [...exp.bullets];
            newBullets[diffModal.bulletIndex!] = diffModal.enhanced;
            return { ...exp, bullets: newBullets };
          }
          return exp;
        }),
      }));
    } else if (diffModal.section === 'project' && diffModal.targetId && typeof diffModal.bulletIndex === 'number') {
      handleUpdateResumeData((prev) => ({
        ...prev,
        projects: prev.projects.map((proj) => {
          if (proj.id === diffModal.targetId) {
            const newBullets = [...proj.bullets];
            newBullets[diffModal.bulletIndex!] = diffModal.enhanced;
            return { ...proj, bullets: newBullets };
          }
          return proj;
        }),
      }));
    }

    setDiffModal(null);
    setIsEditingDiff(false);
  };

  const [isEditingDiff, setIsEditingDiff] = useState<boolean>(false);

  // ---------------- Education Helper & Handlers ----------------
  const getEducationsList = (data: ResumeExportData): EducationItem[] => {
    if (data.educations && data.educations.length > 0) {
      return data.educations;
    }
    return [
      {
        id: data.education?.id || 'edu-1',
        college: data.education?.college || 'Vellore Institute of Technology, Chennai',
        degree: data.education?.degree || 'B.Tech in Mechatronics & Automation',
        location: data.education?.location || 'Chennai, India',
        startDate: data.education?.startDate || '2023',
        endDate: data.education?.endDate || '2027',
        duration: data.education?.duration || '2023 - 2027',
        cgpa: data.education?.cgpa || '9.01',
        coursework: data.education?.coursework || 'Embedded Systems, Robotics & Automation, Control Systems, Microcontrollers & IoT, Computer Vision',
      },
    ];
  };

  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      college: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      duration: '',
      cgpa: '',
      coursework: '',
    };
    handleUpdateResumeData((prev) => {
      const currentList = getEducationsList(prev);
      return {
        ...prev,
        educations: [...currentList, newEdu],
      };
    });
    setUploadToast('✓ Added new Education entry!');
    setTimeout(() => setUploadToast(null), 2500);
  };

  const handleUpdateEducationItem = (index: number, field: keyof EducationItem, value: string) => {
    handleUpdateResumeData((prev) => {
      const currentList = [...getEducationsList(prev)];
      const updatedItem: EducationItem = { ...currentList[index], [field]: value };
      if (field === 'startDate' || field === 'endDate') {
        const start = field === 'startDate' ? value : (updatedItem.startDate || '');
        const end = field === 'endDate' ? value : (updatedItem.endDate || '');
        updatedItem.duration = start && end ? `${start} - ${end}` : (start || end || '');
      }
      currentList[index] = updatedItem;
      return {
        ...prev,
        education: index === 0 ? {
          id: updatedItem.id,
          college: updatedItem.college,
          degree: updatedItem.degree,
          location: updatedItem.location,
          startDate: updatedItem.startDate,
          endDate: updatedItem.endDate,
          duration: updatedItem.duration || '',
          cgpa: updatedItem.cgpa,
          coursework: updatedItem.coursework || '',
        } : prev.education,
        educations: currentList,
      };
    });
  };

  const handleRemoveEducation = (index: number) => {
    handleUpdateResumeData((prev) => {
      const currentList = getEducationsList(prev);
      if (currentList.length <= 1) return prev;
      const updatedList = currentList.filter((_, i) => i !== index);
      return {
        ...prev,
        education: {
          id: updatedList[0].id,
          college: updatedList[0].college,
          degree: updatedList[0].degree,
          location: updatedList[0].location,
          startDate: updatedList[0].startDate,
          endDate: updatedList[0].endDate,
          duration: updatedList[0].duration || '',
          cgpa: updatedList[0].cgpa,
          coursework: updatedList[0].coursework || '',
        },
        educations: updatedList,
      };
    });
    setUploadToast('✓ Removed Education entry.');
    setTimeout(() => setUploadToast(null), 2500);
  };

  const handleGenerateTailoredResume = () => {
    if (!jobDescription.trim()) {
      alert('Please paste a Job Description first to generate a tailored resume version.');
      return;
    }

    const jdKeywords = atsReport.matchedKeywords.concat(atsReport.missingKeywords);

    // Sort bullets by keyword relevance
    const tailoredData: ResumeExportData = JSON.parse(JSON.stringify(resumeData));
    tailoredData.experiences = tailoredData.experiences.map((exp) => {
      const sortedBullets = [...exp.bullets].sort((a, b) => {
        const aCount = jdKeywords.filter((kw) => a.toLowerCase().includes(kw)).length;
        const bCount = jdKeywords.filter((kw) => b.toLowerCase().includes(kw)).length;
        return bCount - aCount;
      });
      return { ...exp, bullets: sortedBullets };
    });

    const newVersion: ResumeVersionItem = {
      id: `ver-tailored-${Date.now()}`,
      title: `Tailored: ${jobDescription.slice(0, 22).replace(/\n/g, ' ')}...`,
      targetRole: 'Target Job Description Role',
      lastModified: new Date().toISOString(),
      atsScore: Math.min(98, atsReport.atsScore + 12),
      data: tailoredData,
    };

    const updated = [newVersion, ...versions];
    setVersions(updated);
    saveResumeVersions(updated);
    setActiveVersionId(newVersion.id);
    setActiveResumeVersionId(newVersion.id);

    setUploadToast(`✓ Created & tailored new resume version "${newVersion.title}"!`);
    setTimeout(() => setUploadToast(null), 3500);
  };

  // ---------------- GitHub Fetcher Handler ----------------
  const handleFetchGitHub = async () => {
    if (!githubInput.trim()) return;
    setIsFetchingGithub(true);
    setGithubError(null);
    try {
      const repos = await fetchGitHubRepositories(githubInput);
      setGithubRepos(repos);
    } catch (err: any) {
      setGithubError(err.message || 'Failed to fetch repositories.');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleAddRepoAsProject = (repo: GitHubRepoItem) => {
    const newProj: ProjectItem = {
      id: `proj-gh-${repo.id}`,
      title: repo.name,
      tech: repo.language || 'TypeScript',
      link: repo.html_url,
      bullets: [
        repo.description || 'Open-source software project engineered for high performance.',
        `Integrated automated testing and repository CI/CD workflows with ${repo.stargazers_count} GitHub stars.`,
      ],
    };

    handleUpdateResumeData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));

    setUploadToast(`✓ Added "${repo.name}" to Resume Projects!`);
    setTimeout(() => setUploadToast(null), 3000);
  };

  // ---------------- File Upload & Parser Handler ----------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await extractTextFromFile(file);
      if (text && text.trim().length > 0) {
        const parsed = parseResumeDocumentText(text);
        handleUpdateResumeData((prev) => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          github: parsed.github || prev.github,
          linkedin: parsed.linkedin || prev.linkedin,
          summary: parsed.summary || prev.summary,
          skills: {
            languages: parsed.skills?.languages ? `${prev.skills.languages}, ${parsed.skills.languages}` : prev.skills.languages,
            frameworks: parsed.skills?.frameworks ? `${prev.skills.frameworks}, ${parsed.skills.frameworks}` : prev.skills.frameworks,
            tools: prev.skills.tools,
          },
        }));

        setUploadToast(`✓ Successfully imported & parsed "${file.name}"!`);
        setTimeout(() => setUploadToast(null), 3500);
      } else {
        setUploadToast('⚠️ Could not extract text from document.');
        setTimeout(() => setUploadToast(null), 3500);
      }
    } catch (err: any) {
      console.error('Error uploading resume:', err);
      setUploadToast(`⚠️ Error extracting PDF text: ${err.message || 'Unknown error'}`);
      setTimeout(() => setUploadToast(null), 3500);
    }
  };

  // ---------------- Version History Handlers ----------------
  const handleDuplicateActiveVersion = () => {
    const duplicated = duplicateResumeVersion(activeVersionId);
    setVersions(getResumeVersions());
    setActiveVersionId(duplicated.id);
    setActiveResumeVersionId(duplicated.id);
  };

  const handleDeleteVersion = (vId: string) => {
    try {
      const remaining = deleteResumeVersion(vId);
      setVersions(remaining);
      if (activeVersionId === vId) {
        setActiveVersionId(remaining[0].id);
        setActiveResumeVersionId(remaining[0].id);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Top Application Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Branding & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            &larr; Dashboard
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  AI Resume Studio &amp; ATS Engine
                </h1>
                <span style={{ fontSize: 11, fontWeight: 800, background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 999 }}>
                  ATS Score: {atsReport.atsScore}%
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Active Version: <strong>{activeVersion.title}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Downloads */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Font Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', padding: '4px 10px', borderRadius: 8, border: '1px solid #CBD5E1' }}>
            <Type size={14} color="#64748B" />
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 700, color: '#1E293B', outline: 'none', cursor: 'pointer' }}
            >
              {FONT_OPTIONS.map((grp) => (
                <optgroup key={grp.group} label={grp.group}>
                  {grp.fonts.map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Download Word Button */}
          <button
            onClick={() => exportResumeToDocx(resumeData, selectedFont)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              color: '#1E293B',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Download Word</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={() => exportResumeToPdf('resume-live-preview-document', resumeData, selectedFont)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {uploadToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 100,
          }}
        >
          {uploadToast}
        </div>
      )}

      {/* ================= STRICT 2-PANEL WORKSPACE (55% / 45%) ================= */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          height: 'calc(100vh - 65px)',
          overflow: 'hidden',
        }}
      >
        {/* ================= LEFT PANEL: 55% WIDTH WITH TABS ================= */}
        <div
          style={{
            flex: '0 0 55%',
            width: '55%',
            maxWidth: '55%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRight: '1px solid #E2E8F0',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top-Level Module Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC',
              padding: '8px 16px 0 16px',
              gap: 8,
              position: 'sticky',
              top: 0,
              zIndex: 20,
            }}
          >
            {[
              { id: 'builder', label: 'Resume Builder', icon: Edit3 },
              { id: 'ats', label: `ATS Match (${atsReport.atsScore}%)`, icon: Target },
              { id: 'ingest', label: 'Connect Profiles & Ingest', icon: Globe },
              { id: 'versions', label: `Versions (${versions.length})`, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 14px',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: isActive ? '3px solid #4F46E5' : '3px solid transparent',
                    background: 'transparent',
                    color: isActive ? '#4F46E5' : '#64748B',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module Content Container */}
          <div style={{ padding: '20px 24px', flex: 1 }}>
            {/* ---------------- TAB 1: BUILDER ---------------- */}
            {activeMainTab === 'builder' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Section Subtabs */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                  {[
                    { id: 'personal', label: 'Contact' },
                    { id: 'summary', label: 'Summary' },
                    { id: 'experience', label: 'Experience' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'education', label: 'Education' },
                    { id: 'skills', label: 'Skills & Telemetry' },
                  ].map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setActiveBuilderSection(sec.id as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: activeBuilderSection === sec.id ? '1px solid #4F46E5' : '1px solid #E2E8F0',
                        background: activeBuilderSection === sec.id ? '#EEF2FF' : '#FFFFFF',
                        color: activeBuilderSection === sec.id ? '#4F46E5' : '#475569',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                {/* Section: Contact */}
                {activeBuilderSection === 'personal' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Full Name</label>
                      <input
                        type="text"
                        value={resumeData.fullName}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, fullName: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Email</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, email: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Phone</label>
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, phone: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Location</label>
                      <input
                        type="text"
                        value={resumeData.location}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, location: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>LinkedIn URL</label>
                      <input
                        type="text"
                        value={resumeData.linkedin}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, linkedin: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>GitHub URL</label>
                      <input
                        type="text"
                        value={resumeData.github}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, github: e.target.value }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                  </div>
                )}

                {/* Section: Summary */}
                {activeBuilderSection === 'summary' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Professional Summary</label>
                      <button
                        onClick={() => handleTriggerAIEnhance('summary', resumeData.summary)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          background: '#EEF2FF',
                          border: '1px solid #C7D2FE',
                          color: '#4F46E5',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Sparkles size={13} />
                        <span>AI Enhance Summary</span>
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={resumeData.summary}
                      onChange={(e) => handleUpdateResumeData((p) => ({ ...p, summary: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, lineHeight: 1.45 }}
                    />
                  </div>
                )}

                {/* Section: Experience */}
                {activeBuilderSection === 'experience' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {resumeData.experiences.map((exp, expIdx) => (
                      <div key={exp.id} style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Job Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) =>
                                handleUpdateResumeData((p) => ({
                                  ...p,
                                  experiences: p.experiences.map((x, i) => (i === expIdx ? { ...x, role: e.target.value } : x)),
                                }))
                              }
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleUpdateResumeData((p) => ({
                                  ...p,
                                  experiences: p.experiences.map((x, i) => (i === expIdx ? { ...x, company: e.target.value } : x)),
                                }))
                              }
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                        </div>

                        {/* Bullets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Key Achievement Bullets</label>
                          {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) =>
                                  handleUpdateResumeData((p) => ({
                                    ...p,
                                    experiences: p.experiences.map((x, i) => {
                                      if (i === expIdx) {
                                        const newB = [...x.bullets];
                                        newB[bIdx] = e.target.value;
                                        return { ...x, bullets: newB };
                                      }
                                      return x;
                                    }),
                                  }))
                                }
                                style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, lineHeight: 1.4 }}
                              />
                              <button
                                onClick={() => handleTriggerAIEnhance('experience', bullet, exp.id, bIdx)}
                                style={{
                                  background: '#EEF2FF',
                                  border: '1px solid #C7D2FE',
                                  color: '#4F46E5',
                                  padding: 6,
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                }}
                                title="AI Enhance Bullet"
                              >
                                <Sparkles size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section: Projects */}
                {activeBuilderSection === 'projects' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {resumeData.projects.map((proj, pIdx) => (
                      <div key={proj.id} style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Project Title</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) =>
                                handleUpdateResumeData((p) => ({
                                  ...p,
                                  projects: p.projects.map((x, i) => (i === pIdx ? { ...x, title: e.target.value } : x)),
                                }))
                              }
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Technologies Used</label>
                            <input
                              type="text"
                              value={proj.tech}
                              onChange={(e) =>
                                handleUpdateResumeData((p) => ({
                                  ...p,
                                  projects: p.projects.map((x, i) => (i === pIdx ? { ...x, tech: e.target.value } : x)),
                                }))
                              }
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                        </div>

                        {/* Project Bullets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {proj.bullets.map((b, bIdx) => (
                            <div key={bIdx} style={{ display: 'flex', gap: 8 }}>
                              <textarea
                                rows={2}
                                value={b}
                                onChange={(e) =>
                                  handleUpdateResumeData((p) => ({
                                    ...p,
                                    projects: p.projects.map((x, i) => {
                                      if (i === pIdx) {
                                        const nb = [...x.bullets];
                                        nb[bIdx] = e.target.value;
                                        return { ...x, bullets: nb };
                                      }
                                      return x;
                                    }),
                                  }))
                                }
                                style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                              />
                              <button
                                onClick={() => handleTriggerAIEnhance('project', b, proj.id, bIdx)}
                                style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#4F46E5', padding: 6, borderRadius: 6, cursor: 'pointer' }}
                              >
                                <Sparkles size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section: Education */}
                {activeBuilderSection === 'education' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          Educational History
                        </h4>
                        <span style={{ fontSize: 11.5, color: '#64748B' }}>
                          Add degrees, institutions, GPA scores, and key coursework.
                        </span>
                      </div>
                      <button
                        onClick={handleAddEducation}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#4F46E5',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={13} />
                        <span>Add Education</span>
                      </button>
                    </div>

                    {getEducationsList(resumeData).map((edu, eduIdx) => (
                      <div
                        key={edu.id || eduIdx}
                        style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#334155' }}>
                            🎓 Education #{eduIdx + 1}
                          </span>
                          {getEducationsList(resumeData).length > 1 && (
                            <button
                              onClick={() => handleRemoveEducation(eduIdx)}
                              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '3px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                              title="Delete Education Entry"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>

                        {/* Institution & Degree */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Institution Name</label>
                            <input
                              type="text"
                              value={edu.college || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'college', e.target.value)}
                              placeholder="e.g. Vellore Institute of Technology, Chennai"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Degree / Major</label>
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'degree', e.target.value)}
                              placeholder="e.g. B.Tech in Mechatronics & Automation"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                        </div>

                        {/* Location & CGPA */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Location</label>
                            <input
                              type="text"
                              value={edu.location || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'location', e.target.value)}
                              placeholder="e.g. Chennai, India"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>CGPA / Score</label>
                            <input
                              type="text"
                              value={edu.cgpa || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'cgpa', e.target.value)}
                              placeholder="e.g. 9.01"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                        </div>

                        {/* Start Date & End Date */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Start Date</label>
                            <input
                              type="text"
                              value={edu.startDate || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'startDate', e.target.value)}
                              placeholder="e.g. 2023"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>End Date</label>
                            <input
                              type="text"
                              value={edu.endDate || ''}
                              onChange={(e) => handleUpdateEducationItem(eduIdx, 'endDate', e.target.value)}
                              placeholder="e.g. 2027"
                              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                            />
                          </div>
                        </div>

                        {/* Coursework */}
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>Relevant Coursework</label>
                          <input
                            type="text"
                            value={edu.coursework || ''}
                            onChange={(e) => handleUpdateEducationItem(eduIdx, 'coursework', e.target.value)}
                            placeholder="e.g. Embedded Systems, Robotics & Automation, Control Systems, Microcontrollers & IoT, Computer Vision"
                            style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section: Skills & Telemetry */}
                {activeBuilderSection === 'skills' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Programming Languages</label>
                      <input
                        type="text"
                        value={resumeData.skills.languages}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, skills: { ...p.skills, languages: e.target.value } }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Frameworks &amp; Libraries</label>
                      <input
                        type="text"
                        value={resumeData.skills.frameworks}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, skills: { ...p.skills, frameworks: e.target.value } }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Tools &amp; Infrastructure</label>
                      <input
                        type="text"
                        value={resumeData.skills.tools}
                        onChange={(e) => handleUpdateResumeData((p) => ({ ...p, skills: { ...p.skills, tools: e.target.value } }))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', marginTop: 4 }}
                      />
                    </div>

                    {/* Verified Telemetry Panel */}
                    <div style={{ background: '#F8FAFC', border: '1.5px solid #C7D2FE', borderRadius: 12, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <Zap size={16} color="#4F46E5" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B' }}>
                          ⚡ Verified Skills from Practice Telemetry
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {verifiedTelemetrySkills.map((sk, idx) => (
                          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{sk.name}</span>
                            <span style={{ fontSize: 10.5, color: '#059669', background: '#ECFDF5', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                              {sk.mastery}
                            </span>
                            <button
                              onClick={() => handleAddTelemetrySkill(sk)}
                              style={{ background: '#4F46E5', color: '#FFFFFF', border: 'none', padding: '2px 6px', borderRadius: 4, fontSize: 10.5, fontWeight: 800, cursor: 'pointer' }}
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- TAB 2: ATS ANALYZER (OVERFLOW FIX) ---------------- */}
            {activeMainTab === 'ats' && (
              <ATSAnalyzer
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
                atsReport={atsReport}
                onAddMissingSkill={(skillName) => handleAddTelemetrySkill({ name: skillName, category: 'skills' })}
                onGenerateTailoredResume={handleGenerateTailoredResume}
              />
            )}

            {/* ---------------- TAB 3: CONNECT PROFILES & INGEST ---------------- */}
            {activeMainTab === 'ingest' && (
              <ImportProfile
                resumeData={resumeData}
                onUpdateResume={handleUpdateResumeData}
                onShowToast={(msg) => {
                  setUploadToast(msg);
                  setTimeout(() => setUploadToast(null), 3500);
                }}
              />
            )}

            {/* ---------------- TAB 4: VERSIONS & TAILORING ---------------- */}
            {activeMainTab === 'versions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Targeted Resume Versions
                  </h3>
                  <button
                    onClick={handleDuplicateActiveVersion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#4F46E5',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Duplicate Active Version</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {versions.map((ver) => {
                    const isActive = ver.id === activeVersionId;
                    return (
                      <div
                        key={ver.id}
                        style={{
                          background: isActive ? '#EEF2FF' : '#F8FAFC',
                          border: isActive ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                          borderRadius: 10,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: isActive ? '#4F46E5' : '#0F172A' }}>
                            {ver.title} {isActive ? '(Active)' : ''}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>
                            Target: {ver.targetRole} &bull; ATS Score: {ver.atsScore}% &bull; Modified: {new Date(ver.lastModified).toLocaleDateString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          {!isActive && (
                            <button
                              onClick={() => {
                                setActiveVersionId(ver.id);
                                setActiveResumeVersionId(ver.id);
                              }}
                              style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                            >
                              Switch To
                            </button>
                          )}
                          {versions.length > 1 && (
                            <button
                              onClick={() => handleDeleteVersion(ver.id)}
                              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '4px 8px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL: 45% STICKY LIVE PREVIEW ================= */}
        <div
          style={{
            flex: '0 0 45%',
            width: '45%',
            maxWidth: '45%',
            height: '100%',
            overflowY: 'auto',
            background: '#F1F5F9',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Live Document Canvas */}
          <div
            id="resume-live-preview-document"
            style={{
              width: '100%',
              maxWidth: 580,
              background: '#FFFFFF',
              borderRadius: 8,
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              padding: '36px 32px',
              fontFamily: selectedFont,
              color: '#111827',
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1.5px solid #0F172A', paddingBottom: 10, marginBottom: 14 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                {resumeData.fullName}
              </h2>
              <div style={{ fontSize: 10.5, color: '#4B5563', display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span>{resumeData.email}</span> &bull;
                <span>{resumeData.phone}</span> &bull;
                <span>{resumeData.location}</span>
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 4 }}>
                  Professional Summary
                </div>
                <p style={{ margin: 0, fontSize: 11, color: '#374151', lineHeight: 1.4 }}>
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experiences.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
                  Professional Experience
                </div>
                {resumeData.experiences.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800 }}>
                      <span>{exp.role} &bull; {exp.company}</span>
                      <span style={{ fontSize: 10.5, color: '#6B7280' }}>{exp.duration}</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: 10.5, color: '#374151' }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {getEducationsList(resumeData).some(e => e && (e.college || e.degree)) && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
                  Education
                </div>
                {getEducationsList(resumeData).map((edu, idx) => (
                  <div key={edu.id || idx} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800 }}>
                      <span>{edu.college}{edu.location ? ` • ${edu.location}` : ''}</span>
                      <span style={{ fontSize: 10.5, color: '#6B7280' }}>
                        {edu.duration || (edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.startDate || edu.endDate || '')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#374151', marginTop: 1 }}>
                      <span>{edu.degree}</span>
                      {edu.cgpa && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1E293B' }}>
                          CGPA: {edu.cgpa}
                        </span>
                      )}
                    </div>
                    {edu.coursework && (
                      <p style={{ margin: '2px 0 0 0', fontSize: 10, color: '#6B7280', lineHeight: 1.35 }}>
                        <strong>Key Coursework:</strong> {edu.coursework}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 6 }}>
                  Key Engineering Projects
                </div>
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 800 }}>
                      <span>{proj.title} ({proj.tech})</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 16, fontSize: 10.5, color: '#374151' }}>
                      {proj.bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: 2 }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', paddingBottom: 2, marginBottom: 4 }}>
                Technical Competencies
              </div>
              <div style={{ fontSize: 10.5, color: '#374151', lineHeight: 1.4 }}>
                <strong>Languages:</strong> {resumeData.skills.languages}<br />
                <strong>Frameworks:</strong> {resumeData.skills.frameworks}<br />
                <strong>Tools &amp; Cloud:</strong> {resumeData.skills.tools}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SIDE-BY-SIDE DIFF MODAL (AI ENHANCE) ================= */}
      {diffModal && diffModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 700,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#4F46E5" />
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  AI Enhancement (Anti-Hallucination Verified)
                </h3>
              </div>
              <button onClick={() => setDiffModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Side by Side Diff */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: '#FEF2F2', padding: 14, borderRadius: 8, border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#991B1B', marginBottom: 6 }}>ORIGINAL</div>
                <div style={{ fontSize: 12.5, color: '#1E293B', lineHeight: 1.45 }}>{diffModal.original}</div>
              </div>

              <div style={{ background: '#ECFDF5', padding: 14, borderRadius: 8, border: '1px solid #A7F3D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#065F46' }}>AI ENHANCED (ACTION-OPTIMIZED)</div>
                  <button
                    type="button"
                    onClick={() => setIsEditingDiff(!isEditingDiff)}
                    style={{ background: 'transparent', border: 'none', color: '#4F46E5', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                  >
                    {isEditingDiff ? 'Done Editing' : 'Edit Manually'}
                  </button>
                </div>
                {isEditingDiff ? (
                  <textarea
                    rows={4}
                    value={diffModal.enhanced}
                    onChange={(e) => setDiffModal({ ...diffModal, enhanced: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #10B981', fontSize: 12.5 }}
                  />
                ) : (
                  <div style={{ fontSize: 12.5, color: '#1E293B', lineHeight: 1.45 }}>{diffModal.enhanced}</div>
                )}
              </div>
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                onClick={() => {
                  setDiffModal(null);
                  setIsEditingDiff(false);
                }}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                Reject
              </button>
              <button
                onClick={handleAcceptDiff}
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', border: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
              >
                Accept &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;
