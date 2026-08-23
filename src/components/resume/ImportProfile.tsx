import React, { useState } from 'react';
import {
  FolderGit2,
  Globe,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  FileText,
  X,
} from 'lucide-react';
import { fetchGitHubRepositories, parseResumeDocumentText, GitHubRepoItem, ParsedProfileData } from '../../utils/profileIngestion';
import { extractTextFromFile } from '../../utils/pdfExtractor';
import { ResumeExportData } from '../../utils/documentExporter';

interface ImportProfileProps {
  resumeData: ResumeExportData;
  onUpdateResume: (updater: (prev: ResumeExportData) => ResumeExportData) => void;
  onShowToast: (message: string) => void;
}

export const ImportProfile: React.FC<ImportProfileProps> = ({
  resumeData,
  onUpdateResume,
  onShowToast,
}) => {
  // GitHub state
  const [githubUsername, setGithubUsername] = useState<string>('alexchen-dev');
  const [isFetchingGithub, setIsFetchingGithub] = useState<boolean>(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepoItem[]>([]);
  const [githubError, setGithubError] = useState<string | null>(null);

  // File upload & confirmation state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pendingParsedData, setPendingParsedData] = useState<ParsedProfileData | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string>('');

  // ---------------- GitHub API Handler ----------------
  const handleFetchGitHub = async () => {
    if (!githubUsername.trim()) return;
    setIsFetchingGithub(true);
    setGithubError(null);
    try {
      const repos = await fetchGitHubRepositories(githubUsername);
      setGithubRepos(repos);
      onShowToast(`✓ Successfully fetched ${repos.length} public GitHub repositories!`);
    } catch (err: any) {
      setGithubError(err.message || 'Failed to fetch GitHub repositories.');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleAddRepoAsProject = (repo: GitHubRepoItem) => {
    const newProj = {
      id: `proj-gh-${repo.id}`,
      title: repo.name,
      tech: repo.language || 'TypeScript',
      link: repo.html_url,
      bullets: [
        repo.description || 'Production-grade software engineering project.',
        `Engineered modular architecture with automated CI/CD pipelines & ${repo.stargazers_count} GitHub stars.`,
      ],
    };

    onUpdateResume((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));

    onShowToast(`✓ Added "${repo.name}" to Resume Projects!`);
  };

  const handleExtractAllRepoSkills = () => {
    const languages = Array.from(new Set(githubRepos.map((r) => r.language).filter(Boolean))) as string[];
    if (languages.length === 0) return;

    onUpdateResume((prev) => {
      const existing = prev.skills.languages || '';
      const newSkills = languages.filter((l) => !existing.toLowerCase().includes(l.toLowerCase()));
      return {
        ...prev,
        skills: {
          ...prev.skills,
          languages: existing ? `${existing}, ${newSkills.join(', ')}` : newSkills.join(', '),
        },
      };
    });

    onShowToast(`✓ Extracted ${languages.length} programming languages from GitHub into Skills!`);
  };

  // ---------------- File Parsing & Confirmation Flow ----------------
  const processUploadedFile = async (file: File) => {
    setPendingFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      if (text && text.trim().length > 0) {
        const parsed = parseResumeDocumentText(text);
        setPendingParsedData(parsed);
      } else {
        onShowToast('⚠️ Could not extract text from the uploaded file.');
      }
    } catch (err: any) {
      console.error('Error processing resume file:', err);
      onShowToast(`⚠️ Failed to parse document: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!pendingParsedData) return;

    onUpdateResume((prev) => ({
      ...prev,
      fullName: pendingParsedData.fullName || prev.fullName,
      email: pendingParsedData.email || prev.email,
      phone: pendingParsedData.phone || prev.phone,
      github: pendingParsedData.github || prev.github,
      linkedin: pendingParsedData.linkedin || prev.linkedin,
      summary: pendingParsedData.summary || prev.summary,
      education: {
        ...prev.education,
        college: pendingParsedData.education?.college || prev.education.college,
        degree: pendingParsedData.education?.degree || prev.education.degree,
        duration: pendingParsedData.education?.duration || prev.education.duration,
        cgpa: pendingParsedData.education?.cgpa || prev.education.cgpa,
      },
      skills: {
        languages: pendingParsedData.skills?.languages
          ? `${prev.skills.languages}, ${pendingParsedData.skills.languages}`
          : prev.skills.languages,
        frameworks: pendingParsedData.skills?.frameworks
          ? `${prev.skills.frameworks}, ${pendingParsedData.skills.frameworks}`
          : prev.skills.frameworks,
        tools: prev.skills.tools,
      },
    }));

    onShowToast(`✓ Successfully imported details from "${pendingFileName}" into Resume!`);
    setPendingParsedData(null);
    setPendingFileName('');
  };

  const [showRawTextPreview, setShowRawTextPreview] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', boxSizing: 'border-box' }}>
      {/* ---------------- 1. Social Profiles & Portfolios ---------------- */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Globe size={18} color="#4F46E5" />
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Social Profiles &amp; Web Portfolios
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={resumeData.linkedin}
              onChange={(e) => onUpdateResume((p) => ({ ...p, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
              Personal Portfolio / Website
            </label>
            <input
              type="text"
              value={resumeData.portfolio}
              onChange={(e) => onUpdateResume((p) => ({ ...p, portfolio: e.target.value }))}
              placeholder="https://alexchen.dev"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
            />
          </div>
        </div>
      </div>

      {/* ---------------- 2. GitHub Public Repositories Ingest ---------------- */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderGit2 size={18} color="#0F172A" />
            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              GitHub Profile Ingestion (Real REST API)
            </h3>
          </div>
          {githubRepos.length > 0 && (
            <button
              onClick={handleExtractAllRepoSkills}
              style={{
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
              + Extract Languages to Skills
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="GitHub username (e.g., alexchen-dev or octocat)..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12.5 }}
          />
          <button
            onClick={handleFetchGitHub}
            disabled={isFetchingGithub}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {isFetchingGithub ? 'Fetching...' : 'Fetch Repos'}
          </button>
        </div>

        {githubError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '8px 12px', borderRadius: 6, color: '#DC2626', fontSize: 12, marginBottom: 10 }}>
            {githubError}
          </div>
        )}

        {githubRepos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
            {githubRepos.map((repo) => (
              <div
                key={repo.id}
                style={{
                  background: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{repo.name}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    {repo.language || 'Code'} &bull; ⭐ {repo.stargazers_count} stars &bull; {repo.description?.slice(0, 50)}...
                  </div>
                </div>
                <button
                  onClick={() => handleAddRepoAsProject(repo)}
                  style={{
                    background: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    color: '#4F46E5',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  + Add Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- 3. File Upload Dropzone (PDF / DOCX / TXT) ---------------- */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Upload size={18} color="#4F46E5" />
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Upload Existing Resume (PDF, DOCX, TXT)
          </h3>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #4F46E5' : '1.5px dashed #CBD5E1',
            borderRadius: 10,
            background: isDragging ? '#EEF2FF' : '#F8FAFC',
            padding: '24px 16px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <FileText size={32} color="#64748B" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
            Drag &amp; drop your existing resume here, or click to browse
          </div>
          <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 12 }}>
            Supports .pdf, .docx, and .txt files with automatic section parsing
          </div>

          <label
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            Select File
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* ---------------- 4. File Confirmation Modal ---------------- */}
      {pendingParsedData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
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
              borderRadius: 14,
              maxWidth: 560,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="#10B981" />
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Confirm Resume Import: {pendingFileName}
                </h3>
              </div>
              <button
                onClick={() => setPendingParsedData(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: '#475569', marginBottom: 14 }}>
              Review the extracted details below before merging them into your active resume:
            </p>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <div><strong>Name:</strong> {pendingParsedData.fullName || 'Not detected'}</div>
              <div><strong>Email:</strong> {pendingParsedData.email || 'Not detected'}</div>
              <div><strong>Phone:</strong> {pendingParsedData.phone || 'Not detected'}</div>
              <div><strong>Extracted Skills:</strong> {pendingParsedData.skills?.languages || 'None'}</div>
              <div><strong>Summary:</strong> {pendingParsedData.summary?.slice(0, 100)}...</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setPendingParsedData(null)}
                style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 12.5, fontWeight: 800, cursor: 'pointer' }}
              >
                Confirm &amp; Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportProfile;
