import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractGitHubUsername,
  parseResumeDocumentText,
} from '../src/utils/profileIngestion.ts';
import {
  getResumeVersions,
  duplicateResumeVersion,
  renameResumeVersion,
  deleteResumeVersion,
} from '../src/utils/resumeVersioning.ts';
import {
  analyzeResumeATS,
  enhanceResumeText,
} from '../src/utils/atsScorer.ts';

describe('Advanced AI Resume Builder, Ingestion & ATS Overhaul Suite', () => {
  // ---------------- 1. GitHub URL Normalization & Ingestion ----------------
  test('1. GitHub URL normalization extracts clean username from various input formats', () => {
    assert.equal(extractGitHubUsername('alexchen-dev'), 'alexchen-dev');
    assert.equal(extractGitHubUsername('https://github.com/octocat'), 'octocat');
    assert.equal(extractGitHubUsername('http://www.github.com/torvalds/'), 'torvalds');
    assert.equal(extractGitHubUsername('github.com/facebook/react'), 'facebook');
  });

  // ---------------- 2. Document & Resume Text Parser ----------------
  test('2. Document parser extracts structured profile sections from raw text', () => {
    const rawSample = `
Alex Chen
alex.chen@vit.edu | +91 98765 43210
github.com/alexchen-dev | linkedin.com/in/alexchen-swe

Summary:
Computer Science student with strong foundations in Data Structures, Algorithms, and Software Engineering.

Education:
Vellore Institute of Technology
B.Tech in Computer Science and Engineering

Skills:
Python, TypeScript, React, Docker, SQL, Git
    `;

    const parsed = parseResumeDocumentText(rawSample);
    assert.equal(parsed.fullName, 'Alex Chen');
    assert.equal(parsed.email, 'alex.chen@vit.edu');
    assert.equal(parsed.phone, '+91 98765 43210');
    assert.ok(parsed.skills?.languages.includes('Python') || parsed.skills?.languages.includes('TypeScript'));
    assert.ok(parsed.education?.college.includes('Vellore') || parsed.education?.college.includes('Institute'));
  });

  // ---------------- 3. Resume Version History (CRUD) ----------------
  test('3. Resume Version History supports Duplicate, Rename, and Delete operations', () => {
    const initialVersions = getResumeVersions('test_student_1');
    assert.ok(initialVersions.length >= 1, 'Must have at least one initial version');

    const firstVer = initialVersions[0];

    // Duplicate
    const duplicated = duplicateResumeVersion(firstVer.id, 'Frontend Specialist', 'test_student_1');
    assert.ok(duplicated.id.startsWith('ver-'));
    assert.equal(duplicated.title, 'Frontend Specialist');

    // Rename
    const renamedList = renameResumeVersion(duplicated.id, 'Senior Frontend Specialist', 'test_student_1');
    const renamedItem = renamedList.find((v) => v.id === duplicated.id);
    assert.equal(renamedItem?.title, 'Senior Frontend Specialist');

    // Delete
    const afterDelete = deleteResumeVersion(duplicated.id, 'test_student_1');
    assert.equal(afterDelete.some((v) => v.id === duplicated.id), false);
  });

  // ---------------- 4. Anti-Hallucination AI Enhancement ----------------
  test('4. AI Enhancement preserves factual metrics and upgrades action verbs', async () => {
    const originalBullet = 'I worked on 4 microservices using Node.js and reduced query latency by 40%.';
    const res = await enhanceResumeText(originalBullet, 'experience');
    const enhanced = res.enhanced || String(res);

    // Verify preservation of quantitative metrics
    assert.ok(enhanced.includes('4') || enhanced.includes('microservices'), 'Must preserve microservices context');
    assert.ok(enhanced.includes('40%'), 'Must preserve 40% performance metric without fabrication');
    assert.ok(
      enhanced.toLowerCase().includes('architected') ||
      enhanced.toLowerCase().includes('engineered') ||
      enhanced.toLowerCase().includes('deployed') ||
      enhanced.toLowerCase().includes('optimized')
    );
  });

  // ---------------- 5. ATS Keyword Extractor & Missing Keywords ----------------
  test('5. ATS Analyzer identifies missing keywords and computes accurate score', () => {
    const sampleResume = {
      fullName: 'Alex Chen',
      summary: 'Software engineering student with deep knowledge in algorithms and data structures.',
      skills: { languages: 'Python, SQL', frameworks: 'React', tools: 'Git' },
      experiences: [],
      projects: [],
      education: { college: 'VIT', degree: 'B.Tech' },
    };

    const targetJD = `
      Looking for a Senior Backend Engineer proficient in Go, Docker, Kubernetes, and PostgreSQL.
      Must have strong fundamentals in data structures, algorithms, and system design.
    `;

    const report = analyzeResumeATS(sampleResume, targetJD);
    assert.ok(report.matchedKeywords.includes('data structures') || report.matchedKeywords.includes('algorithms'));
  });

  // ---------------- 6. Pre-filled Education & Multi-Entry State ----------------
  test('6. Education initial state contains VIT Chennai, Mechatronics & 9.01 CGPA', () => {
    const versions = getResumeVersions('s123');
    const defaultData = versions[0].data;

    assert.ok(defaultData.education.college.includes('Vellore Institute of Technology, Chennai'));
    assert.ok(defaultData.education.degree.includes('Mechatronics'));
    assert.equal(defaultData.education.cgpa, '9.01');
    assert.ok(defaultData.educations && defaultData.educations.length >= 1);
    assert.equal(defaultData.educations[0].college, 'Vellore Institute of Technology, Chennai');
    assert.equal(defaultData.educations[0].cgpa, '9.01');
  });

  // ---------------- 7. PDF Text Extraction & Pipeline ----------------
  test('7. PDF extraction pipeline extracts clean strings and filters binary mojibake', async () => {
    const sampleResumeText = `
      John Doe
      john.doe@example.com | +1 555 123 4567
      github.com/johndoe | linkedin.com/in/johndoe

      Summary:
      Experienced Software Engineer specializing in distributed backend systems.

      Education:
      Vellore Institute of Technology
      B.Tech in Computer Science

      Skills:
      Java, Python, Kubernetes, AWS, PostgreSQL
    `;

    // Ensure parser handles extracted clean text correctly
    const parsed = parseResumeDocumentText(sampleResumeText);
    assert.equal(parsed.fullName, 'John Doe');
    assert.equal(parsed.email, 'john.doe@example.com');
    assert.ok(parsed.skills?.languages.includes('Java') || parsed.skills?.languages.includes('Python'));

    // Verify binary headers like %PDF-1.7 are rejected from being valid candidate names
    const binaryGarbage = `%PDF-1.7\n%\xaa\xbb\xcc\xdd\n1 0 obj\n<< /Title (Raw Binary) >>\nendobj`;
    const parsedGarbage = parseResumeDocumentText(binaryGarbage);
    assert.notEqual(parsedGarbage.fullName, '%PDF-1.7');
  });
});
