import { analyzeResumeATS, hasResumeContent } from './atsScorer.ts';
import { getStudentProfile } from './userProfile.ts';

export interface ResumeVersionItem {
  id: string;
  title: string;
  targetRole: string;
  lastModified: string;
  atsScore: number;
  data: any;
}

const STORAGE_KEY = 'careeros_resume_versions';
const ACTIVE_VERSION_KEY = 'careeros_active_resume_version_id';

const memoryVersionStore: Record<string, ResumeVersionItem[]> = {};

export function getResolvedStudentId(studentId?: string): string {
  if (studentId && studentId !== 's123') return studentId.replace(/[^a-zA-Z0-9_-]/g, '_');
  try {
    const profile = getStudentProfile();
    if (profile && profile.email) {
      return profile.email.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
  } catch {}
  return studentId ? studentId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'default_student';
}

/**
 * Check if the user has an existing valid resume with substantive content
 */
export function hasUserResume(studentId?: string): boolean {
  const resolvedId = getResolvedStudentId(studentId);
  const versions = getResumeVersions(resolvedId);
  return versions.some((v) => hasResumeContent(v.data));
}

/**
 * Get active ATS score for student
 */
export function getStudentAtsScore(studentId?: string): number {
  const resolvedId = getResolvedStudentId(studentId);
  const versions = getResumeVersions(resolvedId);
  const activeId = getActiveResumeVersionId(resolvedId);
  const activeVer = versions.find((v) => v.id === activeId) || versions[0];
  if (!activeVer || !hasResumeContent(activeVer.data)) return 0;
  return analyzeResumeATS(activeVer.data).atsScore;
}

/**
 * Get all resume versions from storage
 */
export function getResumeVersions(studentId?: string): ResumeVersionItem[] {
  const resolvedId = getResolvedStudentId(studentId);

  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${resolvedId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep ATS scores strictly synchronized and data-driven
          return parsed.map((v) => ({
            ...v,
            atsScore: hasResumeContent(v.data) ? analyzeResumeATS(v.data).atsScore : 0,
          }));
        }
      }
    }
  } catch {}

  if (memoryVersionStore[resolvedId] && memoryVersionStore[resolvedId].length > 0) {
    return memoryVersionStore[resolvedId];
  }

  // Check if current user is the specific pre-seeded demo user
  const isDemoUser = resolvedId.includes('alex_chen') || resolvedId === 's123';

  if (isDemoUser) {
    const demoVersions: ResumeVersionItem[] = [
      {
        id: 'ver-general',
        title: 'General SDE (Full-Stack)',
        targetRole: 'Software Development Engineer',
        lastModified: new Date().toISOString(),
        atsScore: 92,
        data: {
          fullName: 'Alex Chen',
          email: 'alex.chen@vit.edu',
          phone: '+91 98765 43210',
          location: 'Vellore / Bangalore, India',
          linkedin: 'linkedin.com/in/alexchen-swe',
          github: 'github.com/alexchen-dev',
          portfolio: 'alexchen.dev',
          summary:
            'Results-driven Computer Science student with strong foundations in Data Structures, Algorithms, Distributed Systems, and Modern Full-Stack Development. Experienced in architecting scalable microservices in TypeScript, Go, and React with a proven track record of optimizing database query performance by 40%.',
          education: {
            college: 'Vellore Institute of Technology, Chennai',
            degree: 'B.Tech in Mechatronics & Automation',
            location: 'Chennai, India',
            startDate: '2023',
            endDate: '2027',
            duration: '2023 - 2027',
            cgpa: '9.01',
            coursework: 'Embedded Systems, Robotics & Automation, Control Systems, Microcontrollers & IoT, Computer Vision',
          },
          educations: [
            {
              id: 'edu-1',
              college: 'Vellore Institute of Technology, Chennai',
              degree: 'B.Tech in Mechatronics & Automation',
              location: 'Chennai, India',
              startDate: '2023',
              endDate: '2027',
              duration: '2023 - 2027',
              cgpa: '9.01',
              coursework: 'Embedded Systems, Robotics & Automation, Control Systems, Microcontrollers & IoT, Computer Vision',
            },
          ],
          skills: {
            languages: 'C++, Python, TypeScript, JavaScript, Java, Go, SQL',
            frameworks: 'React, Node.js, Express, Next.js, FastAPI, TailwindCSS',
            tools: 'Docker, Kubernetes, AWS (EC2/S3), Git, Linux, PostgreSQL, Redis, Jest',
          },
          experiences: [
            {
              id: 'exp-1',
              role: 'Software Engineering Intern',
              company: 'TechFlow Innovations',
              location: 'Bangalore, India (Remote)',
              duration: 'Jun 2025 - Aug 2025',
              bullets: [
                'Architected and deployed 4 asynchronous REST microservices using Node.js, Express, and PostgreSQL, handling over 250k daily API requests with 99.9% uptime.',
                'Refactored legacy SQL query execution pipelines and implemented Redis caching, reducing p95 database response latency by 42%.',
                'Collaborated with a cross-functional agile team of 8 engineers to integrate automated CI/CD pipelines via GitHub Actions, decreasing build failures by 35%.',
              ],
            },
          ],
          projects: [
            {
              id: 'proj-1',
              title: 'CAREEROS: AI-Driven Placement Readiness Platform',
              tech: 'React, TypeScript, Node.js, ONNX, WebAssembly, TailwindCSS',
              link: 'https://github.com/alexchen-dev/careeros-platform',
              bullets: [
                'Engineered a real-time Deep Knowledge Tracing neural engine delivering sub-15ms skill gap inference directly inside the browser using ONNX WebAssembly.',
                'Integrated an in-browser Python/Java code sandbox executing testcases with sandboxed stdout/stderr verification and asymptotic complexity profiling.',
                'Built an automated ATS resume analyzer evaluating keyword density, formatting compliance, and section impact scores with 92% industry alignment.',
              ],
            },
          ],
        },
      },
    ];
    memoryVersionStore[resolvedId] = demoVersions;
    return demoVersions;
  }

  // Brand-New User Initial Version (Zero ATS score, empty resume fields)
  let studentName = '';
  let studentEmail = '';
  try {
    const profile = getStudentProfile();
    if (profile) {
      studentName = profile.name || '';
      studentEmail = profile.email || '';
    }
  } catch {}

  const freshVersions: ResumeVersionItem[] = [
    {
      id: 'ver-initial',
      title: 'Master Technical Resume',
      targetRole: 'Software Development Engineer',
      lastModified: new Date().toISOString(),
      atsScore: 0,
      data: {
        fullName: studentName,
        email: studentEmail,
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: '',
        education: {
          college: '',
          degree: '',
          location: '',
          startDate: '',
          endDate: '',
          duration: '',
          cgpa: '',
          coursework: '',
        },
        educations: [],
        skills: {
          languages: '',
          frameworks: '',
          tools: '',
        },
        experiences: [],
        projects: [],
      },
    },
  ];

  memoryVersionStore[resolvedId] = freshVersions;
  return freshVersions;
}

/**
 * Save resume versions array to storage
 */
export function saveResumeVersions(versions: ResumeVersionItem[], studentId?: string): void {
  const resolvedId = getResolvedStudentId(studentId);
  memoryVersionStore[resolvedId] = versions;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${resolvedId}`, JSON.stringify(versions));
    }
  } catch {}
}

/**
 * Duplicate an existing version
 */
export function duplicateResumeVersion(
  versionId: string,
  newTitle?: string,
  studentId: string = 's123'
): ResumeVersionItem {
  const versions = getResumeVersions(studentId);
  const target = versions.find((v) => v.id === versionId) || versions[0];

  const newVersion: ResumeVersionItem = {
    id: `ver-${Date.now()}`,
    title: newTitle || `${target.title} (Copy)`,
    targetRole: target.targetRole,
    lastModified: new Date().toISOString(),
    atsScore: target.atsScore,
    data: JSON.parse(JSON.stringify(target.data)),
  };

  const updated = [newVersion, ...versions];
  saveResumeVersions(updated, studentId);
  return newVersion;
}

/**
 * Rename a version
 */
export function renameResumeVersion(
  versionId: string,
  newTitle: string,
  studentId: string = 's123'
): ResumeVersionItem[] {
  const versions = getResumeVersions(studentId);
  const updated = versions.map((v) => (v.id === versionId ? { ...v, title: newTitle, lastModified: new Date().toISOString() } : v));
  saveResumeVersions(updated, studentId);
  return updated;
}

/**
 * Delete a version
 */
export function deleteResumeVersion(versionId: string, studentId: string = 's123'): ResumeVersionItem[] {
  const versions = getResumeVersions(studentId);
  if (versions.length <= 1) {
    throw new Error('You must keep at least one active resume version.');
  }
  const updated = versions.filter((v) => v.id !== versionId);
  saveResumeVersions(updated, studentId);
  return updated;
}

/**
 * Get active version ID
 */
export function getActiveResumeVersionId(studentId: string = 's123'): string {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(`${ACTIVE_VERSION_KEY}_${studentId}`);
      if (saved) return saved;
    }
  } catch {}
  return 'ver-general';
}

/**
 * Set active version ID
 */
export function setActiveResumeVersionId(versionId: string, studentId: string = 's123'): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${ACTIVE_VERSION_KEY}_${studentId}`, versionId);
    }
  } catch {}
}
