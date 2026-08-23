/**
 * CAREEROS - ATS Scorer & Resume Enhancement Module (TypeScript)
 */

export const ACTION_VERBS: string[] = [
  'architected', 'engineered', 'developed', 'designed', 'implemented',
  'optimized', 'spearheaded', 'deployed', 'orchestrated', 'built',
  'refactored', 'streamlined', 'automated', 'integrated', 'benchmarked',
  'accelerated', 'scaled', 'mentored', 'authored', 'managed', 'configured',
  'formulated', 'delivered', 'reduced', 'increased', 'led', 'analyzed',
];

export const TECH_KEYWORD_TAXONOMY: string[] = [
  'python', 'javascript', 'typescript', 'java', 'c++', 'go', 'golang', 'rust',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'dynamodb', 'sqlite',
  'react', 'next.js', 'vue', 'angular', 'node.js', 'express', 'fastapi', 'django', 'spring boot',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'github actions', 'jenkins',
  'graphql', 'grpc', 'rest', 'microservices', 'distributed systems', 'kafka', 'rabbitmq',
  'data structures', 'algorithms', 'system design', 'machine learning', 'pytorch', 'tensorflow',
  'git', 'linux', 'unix', 'agile', 'scrum', 'unit testing', 'jest', 'pytest',
];

export interface ATSDimensionBreakdown {
  keywords: { score: number; max: number; matched: string[]; missing: string[] };
  skills: { score: number; max: number };
  relevance: { score: number; max: number };
  structure: { score: number; max: number };
  completeness: { score: number; max: number };
  formatting: { score: number; max: number };
  actionVerbs: { score: number; max: number; ratio: number };
  quantification: { score: number; max: number; ratio: number };
}

export interface ATSRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
}

export interface ATSScoreReport {
  atsScore: number;
  breakdown: ATSDimensionBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: ATSRecommendation[];
}

export function hasResumeContent(resumeData: any): boolean {
  if (!resumeData || typeof resumeData !== 'object') return false;

  const hasSummary = Boolean(resumeData.summary && typeof resumeData.summary === 'string' && resumeData.summary.trim().length > 10);
  const hasSkills = Boolean(
    (resumeData.skills?.languages && resumeData.skills.languages.trim()) ||
    (resumeData.skills?.frameworks && resumeData.skills.frameworks.trim()) ||
    (resumeData.skills?.tools && resumeData.skills.tools.trim())
  );
  const hasEducation = Boolean(
    (resumeData.education?.college && resumeData.education.college.trim()) ||
    (resumeData.education?.degree && resumeData.education.degree.trim()) ||
    (Array.isArray(resumeData.educations) && resumeData.educations.some((e: any) => e?.college?.trim() || e?.degree?.trim()))
  );
  const hasExperience = Boolean(
    Array.isArray(resumeData.experiences) &&
    resumeData.experiences.some((e: any) => (e?.role?.trim() || e?.company?.trim()) && Array.isArray(e?.bullets) && e.bullets.length > 0)
  );
  const hasProjects = Boolean(
    Array.isArray(resumeData.projects) &&
    resumeData.projects.some((p: any) => (p?.title?.trim() || p?.tech?.trim()) && Array.isArray(p?.bullets) && p.bullets.length > 0)
  );

  return hasSummary || hasSkills || hasEducation || hasExperience || hasProjects;
}

export function analyzeResumeATS(resumeData: any, jobDescription: string = ''): ATSScoreReport {
  // ---------------- ZERO STATE: No Resume Data ----------------
  if (!hasResumeContent(resumeData)) {
    return {
      atsScore: 0,
      breakdown: {
        keywords: { score: 0, max: 30, matched: [], missing: [] },
        skills: { score: 0, max: 20 },
        relevance: { score: 0, max: 15 },
        structure: { score: 0, max: 10 },
        completeness: { score: 0, max: 10 },
        formatting: { score: 0, max: 5 },
        actionVerbs: { score: 0, max: 5, ratio: 0 },
        quantification: { score: 0, max: 5, ratio: 0 },
      },
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: [
        {
          priority: 'high',
          category: 'Resume Creation',
          title: 'Create or upload your resume',
          description: 'No resume available yet. Create or upload your resume to get your ATS score and placement recommendations.',
        },
      ],
    };
  }

  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase().trim();

  // 1. Keyword Extraction from Job Description or Core Technical Taxonomy (Weight: 30%)
  const jdKeywords = TECH_KEYWORD_TAXONOMY.filter((kw) => jdLower.includes(kw));
  const isJdProvided = jdKeywords.length >= 2;
  const targetKeywords = isJdProvided
    ? jdKeywords
    : TECH_KEYWORD_TAXONOMY.slice(0, 10);

  const matchedKeywords = targetKeywords.filter((kw) => resumeText.includes(kw));
  const missingKeywords = targetKeywords.filter((kw) => !resumeText.includes(kw));
  const keywordScore = isJdProvided
    ? Math.min(30, Math.round((matchedKeywords.length / targetKeywords.length) * 30))
    : Math.min(30, Math.round((matchedKeywords.length / 6) * 30));

  // 2. Skills Section Match (Weight: 20%)
  const skillsCombined = `${resumeData.skills?.languages || ''} ${resumeData.skills?.frameworks || ''} ${resumeData.skills?.tools || ''}`.toLowerCase();
  const matchedSkills = TECH_KEYWORD_TAXONOMY.filter((kw) => skillsCombined.includes(kw));
  const skillsScore = Math.min(20, Math.round((matchedSkills.length / 5) * 20));

  // 3. Relevance & Domain Alignment (Weight: 15%)
  let relevanceScore = 0;
  if (resumeData.summary && resumeData.summary.trim().length > 30) relevanceScore += 7;
  if (resumeData.projects && Array.isArray(resumeData.projects) && resumeData.projects.length >= 1) {
    relevanceScore += resumeData.projects.length >= 2 ? 8 : 4;
  }
  relevanceScore = Math.min(15, relevanceScore);

  // 4. Structure & Section Presence (Weight: 10%)
  const requiredSections = [
    Boolean(resumeData.summary && resumeData.summary.trim()),
    Boolean(resumeData.education?.degree || (Array.isArray(resumeData.educations) && resumeData.educations.length > 0)),
    Boolean(resumeData.skills && (resumeData.skills.languages || resumeData.skills.frameworks || resumeData.skills.tools)),
    Boolean(Array.isArray(resumeData.experiences) && resumeData.experiences.length > 0),
    Boolean(Array.isArray(resumeData.projects) && resumeData.projects.length > 0),
  ];
  const presentSectionsCount = requiredSections.filter(Boolean).length;
  const structureScore = Math.round((presentSectionsCount / 5) * 10);

  // 5. Contact Completeness (Weight: 10%)
  const contactPoints = [
    Boolean(resumeData.fullName && resumeData.fullName.trim()),
    Boolean(resumeData.email && resumeData.email.includes('@')),
    Boolean(resumeData.phone && resumeData.phone.trim()),
    Boolean(resumeData.linkedin || resumeData.github || resumeData.portfolio),
    Boolean(resumeData.education?.college || (Array.isArray(resumeData.educations) && resumeData.educations[0]?.college)),
  ];
  const completenessScore = Math.round((contactPoints.filter(Boolean).length / 5) * 10);

  // 6. Formatting & Bullet Quality (Weight: 5%)
  const allBullets: string[] = [
    ...(resumeData.experiences || []).flatMap((e: any) => e.bullets || []),
    ...(resumeData.projects || []).flatMap((p: any) => p.bullets || []),
  ].filter((b) => typeof b === 'string' && b.trim().length > 0);

  let formattingScore = 0;
  if (allBullets.length > 0) {
    formattingScore = 5;
    if (allBullets.length < 3) formattingScore = Math.max(1, formattingScore - 2);
    allBullets.forEach((b) => {
      if (b.length > 250 || b.length < 20) formattingScore = Math.max(1, formattingScore - 0.5);
    });
  }

  // 7. Action Verbs Usage (Weight: 5%)
  let actionVerbCount = 0;
  allBullets.forEach((bullet) => {
    const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (ACTION_VERBS.includes(firstWord)) actionVerbCount++;
  });
  const actionVerbRatio = allBullets.length > 0 ? actionVerbCount / allBullets.length : 0;
  const actionVerbScore = allBullets.length > 0 ? Math.min(5, Math.round(actionVerbRatio * 5)) : 0;

  // 8. Metric Quantification (Weight: 5%)
  const metricRegex = /(\d+[%kKmM]?|\$\d+|\b\d+\b|\bms\b|\bseconds?\b|\bx\b)/g;
  let quantifiedCount = 0;
  allBullets.forEach((bullet) => {
    if (metricRegex.test(bullet)) quantifiedCount++;
  });
  const quantifiedRatio = allBullets.length > 0 ? quantifiedCount / allBullets.length : 0;
  const quantificationScore = allBullets.length > 0 ? Math.min(5, Math.round(quantifiedRatio * 5)) : 0;

  const totalScore = Math.min(
    100,
    Math.max(
      0,
      keywordScore +
        skillsScore +
        relevanceScore +
        structureScore +
        completenessScore +
        formattingScore +
        actionVerbScore +
        quantificationScore
    )
  );

  const recommendations: ATSRecommendation[] = [];
  if (isJdProvided && missingKeywords.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'Keywords',
      title: `Incorporate ${missingKeywords.slice(0, 3).join(', ')}`,
      description: `Your resume is missing target keywords found in the job requirements (${missingKeywords.slice(0, 4).join(', ')}). Add them to your skills or experience bullets.`,
    });
  }
  if (allBullets.length > 0 && actionVerbRatio < 0.7) {
    recommendations.push({
      priority: 'high',
      category: 'Impact Verbs',
      title: 'Strengthen bullet opening action verbs',
      description: 'Start every experience and project bullet with powerful action verbs like "Architected", "Engineered", or "Orchestrated".',
    });
  }
  if (allBullets.length > 0 && quantifiedRatio < 0.6) {
    recommendations.push({
      priority: 'medium',
      category: 'Quantification',
      title: 'Add measurable metrics (%, numbers, latency)',
      description: 'Include concrete metrics like percentage improvements, daily active request counts, or query speedups to prove business impact.',
    });
  }
  if (presentSectionsCount < 5) {
    recommendations.push({
      priority: 'medium',
      category: 'Structure',
      title: 'Ensure all 5 standard resume sections are present',
      description: 'Include Summary, Experience, Projects, Education, and Skills to pass ATS structure parsing.',
    });
  }

  return {
    atsScore: totalScore,
    breakdown: {
      keywords: { score: keywordScore, max: 30, matched: matchedKeywords, missing: missingKeywords },
      skills: { score: skillsScore, max: 20 },
      relevance: { score: relevanceScore, max: 15 },
      structure: { score: structureScore, max: 10 },
      completeness: { score: completenessScore, max: 10 },
      formatting: { score: formattingScore, max: 5 },
      actionVerbs: { score: actionVerbScore, max: 5, ratio: Math.round(actionVerbRatio * 100) },
      quantification: { score: quantificationScore, max: 5, ratio: Math.round(quantifiedRatio * 100) },
    },
    matchedKeywords,
    missingKeywords,
    recommendations,
  };
}

export function enhanceResumeText(
  arg: string | { text: string; section?: string; role?: string },
  maybeSection?: string
) {
  const text = typeof arg === 'string' ? arg : arg.text;
  const section = typeof arg === 'string' ? (maybeSection || 'experience') : (arg.section || 'experience');

  if (!text || text.trim() === '') {
    return {
      original: '',
      enhanced: '',
      changes: [] as string[],
      metrics: { impactBoost: '+0%', verbStrength: 'Low' },
      toString() { return ''; },
    };
  }

  const trimmed = text.trim();
  let enhanced = trimmed;
  const changes: string[] = [];

  const weakVerbsMap = [
    { regex: /^(i worked on|worked on|helped with|responsible for|assisted in|involved in)\s+/i, replacement: 'Engineered and scaled ' },
    { regex: /^(created|made|did)\s+/i, replacement: 'Architected and deployed ' },
    { regex: /^(fixed|debugged)\s+/i, replacement: 'Identified root cause and resolved ' },
    { regex: /^(used|utilizing)\s+/i, replacement: 'Leveraged ' },
    { regex: /^(managed|handled)\s+/i, replacement: 'Orchestrated ' },
  ];

  for (const { regex, replacement } of weakVerbsMap) {
    if (regex.test(enhanced)) {
      enhanced = enhanced.replace(regex, replacement);
      changes.push('Replaced passive phrasing with strong action verb');
      break;
    }
  }

  if (!/^[A-Z]/.test(enhanced)) {
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    changes.push('Formatted sentence case');
  }
  if (!enhanced.endsWith('.')) {
    enhanced += '.';
  }

  if (enhanced.length < 50 && section === 'experience') {
    enhanced = enhanced.replace(/\.$/, ', optimizing performance and improving maintainability across production microservices.');
    changes.push('Enriched technical context and operational impact');
  }

  return {
    original: trimmed,
    enhanced,
    changes: changes.length > 0 ? changes : ['Polished sentence structure and ATS clarity'],
    metrics: {
      impactBoost: '+35%',
      verbStrength: 'High (Tier-1 ATS Aligned)',
    },
    toString() {
      return enhanced;
    },
  };
}

export function generateProfessionalSummary({
  fullName,
  college,
  degree,
  cgpa,
  topSkills,
  targetRole = 'Software Engineer',
}: {
  fullName?: string;
  college?: string;
  degree?: string;
  cgpa?: string;
  topSkills?: string;
  targetRole?: string;
}): string {
  const name = fullName || 'Proactive Candidate';
  const school = college || 'Tier-1 Engineering Institute';
  const roleName = targetRole || 'Software Development Engineer (SDE)';
  const skillsList = topSkills || 'Data Structures, Algorithms, Distributed Systems, and Modern Full-Stack Web Development';

  return `Results-driven ${degree || 'Computer Science and Engineering'} student at ${school}${cgpa ? ` (CGPA: ${cgpa})` : ''} targeting ${roleName} roles. Proficient in ${skillsList}, with a track record of architecting scalable microservices, optimizing database performance, and building production-grade distributed applications.`;
}
