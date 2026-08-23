/**
 * CAREEROS - True Zero-State Dashboard, Dynamic ATS Scorer & Resume Extraction Test Suite
 * Tests brand-new user zero state across ALL widgets (Readiness, Skills, Adaptive Plan, Streak, ATS 0/100),
 * 100% data-driven ATS scoring, user-isolated resume versions, and Mojibake-free Unicode normalization.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeResumeATS,
  hasResumeContent,
} from '../src/utils/atsScorer.ts';
import {
  getResumeVersions,
  saveResumeVersions,
  getStudentAtsScore,
  hasUserResume,
} from '../src/utils/resumeVersioning.ts';
import {
  normalizeImportedText,
  detectMojibake,
  sanitizeTechnicalSkillList,
} from '../src/utils/textNormalization.ts';
import { parseResumeDocumentText } from '../src/utils/profileIngestion.ts';
import { createFreshStudentProfile, getStudentProfile } from '../src/utils/userProfile.ts';
import { getUserActivitySummary } from '../src/utils/userActivity.ts';
import { generateAutomatedTodaysPlan } from '../src/utils/appEvents.ts';

// In-memory mock localStorage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

describe('True Zero-State Dashboard, Dynamic ATS Scorer & Unicode Normalization Suite', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // ---------------- TEST 1: True Zero-State Dashboard (All Widgets & ATS 0/100) ----------------
  test('TEST 1: New user dashboard initializes with 0 streak, unassessed skills, empty plan, and strictly 0 ATS score', () => {
    const newUser = createFreshStudentProfile({
      name: 'Zero State Student',
      email: 'zero.student@university.edu',
    });

    const summary = getUserActivitySummary(newUser);
    assert.equal(summary.hasAssessment, false);
    assert.equal(summary.assessmentScore, null, 'Career Readiness must be null (Not assessed)');
    assert.equal(summary.codingScore, null, 'Coding mastery must be null');
    assert.equal(summary.aptitudeScore, null, 'Aptitude mastery must be null');
    assert.equal(summary.communicationScore, null, 'Communication mastery must be null');
    assert.equal(summary.streakDays, 0, 'Streak must be 0');

    // ATS Score for new user must be strictly 0 / 100
    const atsScore = getStudentAtsScore(newUser.email);
    assert.equal(atsScore, 0, 'New user ATS score must be 0/100');
    assert.equal(hasUserResume(newUser.email), false, 'New user has no resume');

    // Today's plan must be empty
    const plan = generateAutomatedTodaysPlan(newUser);
    assert.equal(plan.length, 0, 'Adaptive plan must be empty');
  });

  // ---------------- TEST 2: 100% Data-Driven ATS Scoring Service (Zero Mock Scores) ----------------
  test('TEST 2: ATS Scorer evaluates real content without artificial 20-point minimums and recomputes dynamically', () => {
    // 1. Completely empty or null resume data -> strictly 0 ATS score
    const emptyReport = analyzeResumeATS({});
    assert.equal(emptyReport.atsScore, 0, 'Empty resume data must produce 0 ATS score');
    assert.equal(emptyReport.breakdown.keywords.score, 0);
    assert.equal(emptyReport.breakdown.skills.score, 0);
    assert.equal(emptyReport.breakdown.structure.score, 0);
    assert.equal(emptyReport.breakdown.actionVerbs.score, 0);

    // 2. Substantive technical resume evaluation
    const realResume = {
      fullName: 'Jane Doe',
      email: 'jane.doe@univ.edu',
      phone: '+91 91234 56789',
      linkedin: 'linkedin.com/in/janedoe',
      github: 'github.com/janedoe',
      summary:
        'Software engineer with strong experience building distributed backend microservices and full-stack web applications using TypeScript, Python, and React.',
      skills: {
        languages: 'Python, TypeScript, SQL, C++',
        frameworks: 'React, Node.js, Express, Next.js',
        tools: 'Docker, Git, PostgreSQL, Redis, Linux',
      },
      education: {
        college: 'State University',
        degree: 'B.Tech in Computer Science',
        duration: '2023 - 2027',
        cgpa: '9.2',
      },
      experiences: [
        {
          role: 'Backend Engineering Intern',
          company: 'CloudTech Systems',
          duration: 'May 2025 - Aug 2025',
          bullets: [
            'Architected 3 asynchronous REST APIs in Node.js and PostgreSQL, reducing latency by 35%.',
            'Engineered Redis caching layers handling 150k daily requests with 99.9% uptime.',
          ],
        },
      ],
      projects: [
        {
          title: 'Distributed Task Queue',
          tech: 'TypeScript, Redis, Docker',
          bullets: [
            'Engineered a scalable asynchronous worker pipeline processing 500 tasks per second.',
            'Integrated automated unit tests achieving 95% code coverage.',
          ],
        },
      ],
    };

    assert.equal(hasResumeContent(realResume), true);

    const baseReport = analyzeResumeATS(realResume);
    assert.ok(baseReport.atsScore > 60, `Real resume should achieve solid score (>60), got ${baseReport.atsScore}`);
    assert.ok(baseReport.breakdown.actionVerbs.score > 0, 'Action verbs should be credited');
    assert.ok(baseReport.breakdown.quantification.score > 0, 'Quantification should be credited');

    // 3. Target Job Description Keyword Boost
    const targetJD = 'Seeking a Software Engineer proficient in TypeScript, Python, Docker, Redis, and PostgreSQL.';
    const jdReport = analyzeResumeATS(realResume, targetJD);
    assert.ok(jdReport.atsScore >= baseReport.atsScore, 'Matching JD should yield high keyword alignment');
    assert.ok(jdReport.breakdown.keywords.matched.includes('typescript'));
    assert.ok(jdReport.breakdown.keywords.matched.includes('python'));
    assert.ok(jdReport.breakdown.keywords.matched.includes('redis'));
  });

  // ---------------- TEST 3: Multi-User Isolation for Resumes & ATS Scores ----------------
  test('TEST 3: User A resume data and ATS score are isolated and cannot bleed into User B', () => {
    const userA = createFreshStudentProfile({ name: 'User A', email: 'userA@tech.edu' });
    const userB = createFreshStudentProfile({ name: 'User B', email: 'userB@tech.edu' });

    // User A builds a full resume
    const userAVersions = [
      {
        id: 'ver-userA-1',
        title: 'Backend SDE',
        targetRole: 'Backend Engineer',
        lastModified: new Date().toISOString(),
        atsScore: 82,
        data: {
          fullName: 'User A',
          email: 'userA@tech.edu',
          summary: 'Experienced Backend Engineer specializing in Python, SQL, Docker, and Microservices.',
          skills: { languages: 'Python, SQL', frameworks: 'Django, FastAPI', tools: 'Docker, Git' },
          education: { college: 'Engineering College', degree: 'B.Tech CS' },
          experiences: [{ role: 'Intern', company: 'Tech Inc', bullets: ['Engineered microservice APIs reducing latency by 40%.'] }],
          projects: [{ title: 'SQL Query Optimizer', tech: 'Python, SQL', bullets: ['Optimized query plans by 50%.'] }],
        },
      },
    ];
    saveResumeVersions(userAVersions, userA.email);

    // Verify User A score
    const scoreA = getStudentAtsScore(userA.email);
    assert.ok(scoreA > 60, `User A should have evaluated ATS score, got ${scoreA}`);
    assert.equal(hasUserResume(userA.email), true);

    // Verify User B remains completely pristine and unassessed
    const scoreB = getStudentAtsScore(userB.email);
    assert.equal(scoreB, 0, 'User B must have strictly 0 ATS score');
    assert.equal(hasUserResume(userB.email), false, 'User B must have no resume');

    const versionsB = getResumeVersions(userB.email);
    assert.equal(versionsB.length, 1);
    assert.equal(versionsB[0].atsScore, 0);
    assert.equal(versionsB[0].data.summary, '', 'User B resume data must be empty');
  });

  // ---------------- TEST 4: Unicode Normalization & Mojibake Repair ----------------
  test('TEST 4: Unicode normalization repairs Mojibake sequences while preserving technical symbols', () => {
    // 1. Test Mojibake detection & repair
    const corruptedInput =
      'Software Engineer â€“ Full Stack\n' +
      'â€¢ Architected microservices with 99.9% uptime â€” reduced latency by 40%\n' +
      'â€˜Cloudâ€™ solutions & â€œDistributed Systemsâ€\n' +
      'Experience in MontrÃ©al & ZÃ¼rich offices Â® \n' +
      'Proficient in C++, C#, .NET 8.0, Node.js, and TypeScript/CI-CD';

    assert.equal(detectMojibake(corruptedInput), true, 'Corrupted text must be detected');

    const cleaned = normalizeImportedText(corruptedInput);
    assert.equal(detectMojibake(cleaned), false, 'Cleaned text must have no remaining Mojibake');

    // Verify symbol repair
    assert.ok(cleaned.includes('–'), 'En dash must be repaired');
    assert.ok(cleaned.includes('—'), 'Em dash must be repaired');
    assert.ok(cleaned.includes('•'), 'Bullet must be repaired');
    assert.ok(cleaned.includes('‘Cloud’'), 'Single quotes must be repaired');
    assert.ok(cleaned.includes('“Distributed Systems”'), 'Double quotes must be repaired');
    assert.ok(cleaned.includes('Montréal'), 'Accented e must be repaired');
    assert.ok(cleaned.includes('Zürich'), 'Accented u must be repaired');

    // Verify technical symbols preserved
    assert.ok(cleaned.includes('C++'), 'C++ must be preserved');
    assert.ok(cleaned.includes('C#'), 'C# must be preserved');
    assert.ok(cleaned.includes('.NET 8.0'), '.NET must be preserved');
    assert.ok(cleaned.includes('Node.js'), 'Node.js must be preserved');
    assert.ok(cleaned.includes('TypeScript'), 'TypeScript must be preserved');
  });

  // ---------------- TEST 5: Schema Mapping without Mock Fallbacks ----------------
  test('TEST 5: parseResumeDocumentText extracts genuine fields without fabricating fake college or CGPA', () => {
    const rawDocument = `
      Johnathan Smith
      john.smith@stanford.edu | (555) 123-4567
      github.com/johnsmith | linkedin.com/in/johnsmith

      Summary: Dedicated systems engineer focused on high-throughput distributed architectures, memory safety, and kernel optimization.

      Education:
      Stanford University
      B.S. in Computer Science

      Technical Skills:
      Languages: Python, Go, Rust, C++, SQL
      Frameworks: React, FastAPI, Next.js
      Tools: Docker, Kubernetes, Linux, Git
    `;

    const parsed = parseResumeDocumentText(rawDocument);
    assert.equal(parsed.fullName, 'Johnathan Smith');
    assert.equal(parsed.email, 'john.smith@stanford.edu');
    assert.equal(parsed.phone, '(555) 123-4567');
    assert.ok(parsed.skills?.languages?.includes('Python'));
    assert.ok(parsed.skills?.languages?.includes('C++'));
    assert.ok(parsed.skills?.languages?.includes('Rust'));
    assert.ok(parsed.education?.college?.includes('Stanford'));
    assert.ok(parsed.education?.degree?.includes('Computer Science'));

    // Missing fields should not have fake fallbacks
    assert.equal(parsed.education?.cgpa, '', 'CGPA must be empty if not in document');
  });
});
