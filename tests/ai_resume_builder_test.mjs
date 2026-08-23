import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeResumeATS,
  enhanceResumeText,
  generateProfessionalSummary,
  ACTION_VERBS,
} from '../ai/resume-enhancement-service.mjs';

describe('AI Resume Builder, Deterministic ATS & Font Engine Suite', () => {
  const sampleResume = {
    fullName: 'Alex Chen',
    email: 'alex.chen@vit.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
    portfolio: 'alexchen.dev',
    summary:
      'Results-driven Computer Science student with strong foundations in Data Structures, Algorithms, Distributed Systems, and Modern Full-Stack Development.',
    education: {
      college: 'Vellore Institute of Technology',
      degree: 'B.Tech in Computer Science',
      duration: '2023 - 2027',
      cgpa: '8.9 / 10.0',
      coursework: 'Data Structures, Operating Systems, Database Management',
    },
    skills: {
      languages: 'Python, TypeScript, JavaScript, SQL, C++',
      frameworks: 'React, Node.js, Express, FastAPI',
      tools: 'Docker, Git, Redis, PostgreSQL, AWS',
    },
    experiences: [
      {
        id: 'e1',
        role: 'SWE Intern',
        company: 'CloudScale',
        location: 'Bangalore',
        duration: 'May 2025 - Jul 2025',
        bullets: [
          'Engineered resilient REST & gRPC endpoints in Node.js handling 120k+ daily telemetry requests.',
          'Optimized PostgreSQL query latency by 42% through strategic index optimization and Redis caching.',
        ],
      },
    ],
    projects: [
      {
        id: 'p1',
        title: 'CareerOS AI Platform',
        tech: 'React, TypeScript, Node.js',
        link: 'github.com/alexchen/careeros',
        bullets: [
          'Architected an intelligent career readiness engine tracking student masteries.',
          'Implemented real-time code execution with sub-50ms latency.',
        ],
      },
    ],
  };

  const sampleJD = 'Looking for a Software Development Engineer (SDE) with Python, TypeScript, React, SQL, and Docker experience.';

  // ---------------- 1. Deterministic ATS Scoring Model Tests ----------------
  test('1. ATS scoring model computes deterministic 8-dimension weighted scores', () => {
    const result = analyzeResumeATS(sampleResume, sampleJD);

    assert.ok(result.atsScore >= 70 && result.atsScore <= 100, `Score must be in high ATS bracket: ${result.atsScore}`);
    assert.equal(typeof result.atsScore, 'number');

    // Verify 8 breakdown weights
    const { breakdown } = result;
    assert.equal(breakdown.keywords.max, 30);
    assert.equal(breakdown.skills.max, 20);
    assert.equal(breakdown.relevance.max, 15);
    assert.equal(breakdown.structure.max, 10);
    assert.equal(breakdown.completeness.max, 10);
    assert.equal(breakdown.formatting.max, 5);
    assert.equal(breakdown.actionVerbs.max, 5);
    assert.equal(breakdown.quantification.max, 5);

    // Sum of max weights must equal exactly 100
    const totalMax =
      breakdown.keywords.max +
      breakdown.skills.max +
      breakdown.relevance.max +
      breakdown.structure.max +
      breakdown.completeness.max +
      breakdown.formatting.max +
      breakdown.actionVerbs.max +
      breakdown.quantification.max;

    assert.equal(totalMax, 100, 'Sum of all ATS weights must be exactly 100%');
  });

  test('2. ATS correctly matches target keywords from job description', () => {
    const result = analyzeResumeATS(sampleResume, sampleJD);

    assert.ok(result.matchedKeywords.includes('python'));
    assert.ok(result.matchedKeywords.includes('typescript'));
    assert.ok(result.matchedKeywords.includes('react'));
    assert.ok(result.matchedKeywords.includes('sql'));
    assert.ok(result.matchedKeywords.includes('docker'));
    assert.ok(Array.isArray(result.recommendations));
  });

  // ---------------- 2. Action Verbs & Metrics Verification ----------------
  test('3. Universal action verbs catalog recognizes high-impact verbs', () => {
    assert.ok(ACTION_VERBS.includes('architected'));
    assert.ok(ACTION_VERBS.includes('engineered'));
    assert.ok(ACTION_VERBS.includes('optimized'));
    assert.ok(ACTION_VERBS.includes('deployed'));
    assert.ok(ACTION_VERBS.includes('spearheaded'));
  });

  // ---------------- 3. AI Phrasing Enhancement Tests ----------------
  test('4. AI Enhancement transforms weak passive bullets into active impact statements', () => {
    const passiveInput = 'worked on python api for backend';
    const enhancedResult = enhanceResumeText({ text: passiveInput, section: 'experience' });

    assert.ok(enhancedResult.enhanced.length > passiveInput.length);
    assert.ok(enhancedResult.enhanced.startsWith('Engineered and scaled'));
    assert.ok(enhancedResult.enhanced.endsWith('.'));
    assert.ok(enhancedResult.changes.length > 0);
    assert.equal(enhancedResult.original, passiveInput);
  });

  // ---------------- 4. Professional Summary Synthesis Tests ----------------
  test('5. Professional summary generator uses actual student profile details', () => {
    const summary = generateProfessionalSummary({
      fullName: 'Alex Chen',
      college: 'VIT Vellore',
      degree: 'B.Tech in Computer Science',
      cgpa: '8.9 / 10.0',
      topSkills: 'Data Structures, Python, React, Go',
      targetRole: 'Software Development Engineer',
    });

    assert.ok(summary.includes('VIT Vellore'));
    assert.ok(summary.includes('B.Tech in Computer Science'));
    assert.ok(summary.includes('CGPA: 8.9 / 10.0'));
    assert.ok(summary.includes('Python'));
    assert.ok(summary.includes('Software Development Engineer'));
  });
});
