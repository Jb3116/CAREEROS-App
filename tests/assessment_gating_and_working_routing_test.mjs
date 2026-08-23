/**
 * CAREEROS - Strict Assessment Gating & Working Routing Test Suite
 * Tests assessment gating, blocking unattempted submissions from roadmap generation,
 * test-driven roadmap creation, and multi-user isolation.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  saveAssessmentRecord,
  getAssessmentRecord,
  hasAssessmentRecord,
  getUserRoadmap,
  saveUserRoadmap,
  clearAssessmentRecord,
  calculateAssessmentAttemptCounts,
} from '../src/utils/assessmentValidation.ts';
import {
  createFreshStudentProfile,
  getStudentProfile,
  saveStudentProfile,
} from '../src/utils/userProfile.ts';
import {
  getStudentAtsScore,
  hasUserResume,
  saveResumeVersions,
} from '../src/utils/resumeVersioning.ts';
import { analyzeResumeATS } from '../src/utils/atsScorer.ts';

// In-memory mock localStorage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

describe('Strict Assessment Gating & Working Routing Suite', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // ---------------- TEST 1: New User Initial State ----------------
  test('TEST 1: Brand new student initializes with not_started status, unassessed readiness, and zero ATS', () => {
    const newUser = createFreshStudentProfile({
      name: 'Gated Test Student',
      email: 'gated.student@university.edu',
    });

    assert.equal(newUser.assessmentStatus, 'not_started');
    assert.equal(newUser.assessmentCompleted, false);
    assert.equal(newUser.careerReadiness, null);
    assert.equal(newUser.readinessScore, 0);
    assert.equal(newUser.atsScore, 0);
    assert.equal(newUser.streakDays, 0);
    assert.equal(newUser.roadmap, null);

    assert.equal(hasAssessmentRecord(newUser.email), false);
    assert.equal(getUserRoadmap(newUser.email), null);
    assert.equal(getStudentAtsScore(newUser.email), 0);
  });

  // ---------------- TEST 2: Strict Roadmap Assessment Gating ----------------
  test('TEST 2: Unassessed user has gated roadmap access with null phases and zero mock baselines', () => {
    const studentEmail = 'unassessed.student@univ.edu';

    // Verify assessment gating check
    const isAssessed = hasAssessmentRecord(studentEmail);
    assert.equal(isAssessed, false, 'Unassessed student must fail hasAssessmentRecord');

    // Verify roadmap retrieval yields null (no synthetic 78% baseline)
    const roadmap = getUserRoadmap(studentEmail);
    assert.equal(roadmap, null, 'Unassessed student must receive null roadmap');
  });

  // ---------------- TEST 3: Empty Submission Validation ----------------
  test('TEST 3: Submitting an empty or unattempted assessment blocks roadmap generation', () => {
    const studentEmail = 'empty.attempt@univ.edu';

    const emptyStats = calculateAssessmentAttemptCounts({}, {});
    assert.equal(emptyStats.totalAttempted, 0);

    const emptyRecord = {
      status: 'COMPLETED_EMPTY',
      studentId: studentEmail,
      totalQuestions: emptyStats.totalQuestions,
      attemptedCount: 0,
      codingAttemptedCount: 0,
      codingPassedCount: 0,
      codingScore: null,
      aptitudeAttemptedCount: 0,
      aptitudeCorrectCount: 0,
      aptitudeScore: null,
      overallScore: null,
      submittedAt: new Date().toISOString(),
      answers: { coding: {}, aptitude: {} },
    };

    saveAssessmentRecord(emptyRecord);

    // Verify assessment record is saved as COMPLETED_EMPTY
    const saved = getAssessmentRecord(studentEmail);
    assert.ok(saved);
    assert.equal(saved.status, 'COMPLETED_EMPTY');
    assert.equal(saved.overallScore, null);

    // Gating must STILL be active
    assert.equal(hasAssessmentRecord(studentEmail), false, 'COMPLETED_EMPTY must not pass assessment gating');
    assert.equal(getUserRoadmap(studentEmail), null, 'COMPLETED_EMPTY must not unlock a roadmap');
  });

  // ---------------- TEST 4: Genuine Assessment Completion & Personalized Roadmap ----------------
  test('TEST 4: Submitting verified answers unlocks assessment gate and saves user-scoped roadmap', () => {
    const studentEmail = 'verified.student@univ.edu';

    const completedRecord = {
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: studentEmail,
      totalQuestions: 17,
      attemptedCount: 10,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 100,
      aptitudeAttemptedCount: 8,
      aptitudeCorrectCount: 6,
      aptitudeScore: 75,
      overallScore: 88,
      submittedAt: new Date().toISOString(),
      answers: {
        coding: { 'code-1': { code: 'def solution(): return True', lang: 'python' } },
        aptitude: { 'apt-1': 1, 'apt-2': 2 },
      },
    };

    saveAssessmentRecord(completedRecord);

    // Verify assessment record status
    assert.equal(hasAssessmentRecord(studentEmail), true, 'Verified test must pass assessment gate');

    // Save test-driven personalized roadmap
    const personalizedPhases = [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Diagnostic Baseline & Core Foundations',
        subtitle: 'Calibrated Baseline (88% Readiness)',
        status: 'completed',
        milestones: [
          {
            id: 'm1-1',
            title: 'Diagnostic Placement Assessment Benchmark',
            description: 'Completed diagnosis with 75% Aptitude and 2 Coding submissions.',
            status: 'completed',
            difficulty: 'Intermediate',
            topics: ['Diagnostic Coding Test', 'Quantitative Aptitude Test', 'Diagnostic Score: 88%'],
          },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Targeted Skill Gap Remediation',
        subtitle: 'Focus on Hierarchical Structures & Binary Trees',
        status: 'active',
        milestones: [
          {
            id: 'm2-1',
            title: 'Hierarchical Structures & Binary Trees',
            description: 'Traversals and recursion patterns.',
            status: 'in-progress',
            difficulty: 'Advanced',
            topics: ['Binary Tree Path Sums'],
          },
        ],
      },
    ];

    saveUserRoadmap(personalizedPhases, studentEmail);

    // Retrieve user roadmap
    const loadedRoadmap = getUserRoadmap(studentEmail);
    assert.ok(loadedRoadmap);
    assert.equal(loadedRoadmap.length, 2);
    assert.equal(loadedRoadmap[0].id, 'phase-1');
    assert.equal(loadedRoadmap[0].milestones[0].topics[2], 'Diagnostic Score: 88%');
  });

  // ---------------- TEST 5: Multi-User Isolation for Roadmaps & ATS ----------------
  test('TEST 5: User A assessment results, roadmap, and ATS score do not leak to User B', () => {
    const userA = 'student.alpha@univ.edu';
    const userB = 'student.beta@univ.edu';

    // User A completes test & saves roadmap
    saveAssessmentRecord({
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: userA,
      totalQuestions: 17,
      attemptedCount: 12,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 90,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 9,
      aptitudeScore: 90,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
    });

    saveUserRoadmap([{ id: 'phase-userA', title: 'User A Custom Roadmap', milestones: [] }], userA);

    saveResumeVersions(
      [
        {
          id: 'ver-1',
          title: 'User A Resume',
          targetRole: 'SDE',
          lastModified: new Date().toISOString(),
          atsScore: 85,
          data: {
            fullName: 'User Alpha',
            email: userA,
            summary: 'Experienced developer in Python, TypeScript, and SQL.',
            skills: { languages: 'Python, TypeScript, SQL', frameworks: 'React', tools: 'Docker' },
            education: { college: 'Tech Institute', degree: 'B.Tech' },
            experiences: [{ role: 'Intern', company: 'Corp', bullets: ['Built scalable microservices handling 100k requests.'] }],
            projects: [{ title: 'Queue Engine', tech: 'Redis, TypeScript', bullets: ['Optimized latency by 35%.'] }],
          },
        },
      ],
      userA
    );

    // Verify User A state
    assert.equal(hasAssessmentRecord(userA), true);
    assert.ok(getUserRoadmap(userA));
    assert.ok(getStudentAtsScore(userA) > 60);

    // Verify User B remains completely pristine, unassessed, and gated
    assert.equal(hasAssessmentRecord(userB), false, 'User B must not inherit User A assessment');
    assert.equal(getUserRoadmap(userB), null, 'User B must not see User A roadmap');
    assert.equal(getStudentAtsScore(userB), 0, 'User B must have 0 ATS score');
    assert.equal(hasUserResume(userB), false, 'User B must have no resume');
  });

  // ---------------- TEST 6: Working Routing Target Resolution ----------------
  test('TEST 6: Working action targets resolve to /assessment for unassessed and /career-roadmap for assessed', () => {
    const unassessedUser = 'user.new@univ.edu';
    const assessedUser = 'user.assessed@univ.edu';

    saveAssessmentRecord({
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: assessedUser,
      totalQuestions: 17,
      attemptedCount: 10,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 80,
      aptitudeAttemptedCount: 8,
      aptitudeCorrectCount: 8,
      aptitudeScore: 100,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
    });

    const isUnassessed = !hasAssessmentRecord(unassessedUser);
    const isAssessed = hasAssessmentRecord(assessedUser);

    assert.equal(isUnassessed, true);
    assert.equal(isAssessed, true);

    // Route for unassessed roadmap actions
    const unassessedTarget = isUnassessed ? '/assessment' : '/career-roadmap';
    assert.equal(unassessedTarget, '/assessment');

    // Route for assessed roadmap actions
    const assessedTarget = isAssessed ? '/career-roadmap' : '/assessment';
    assert.equal(assessedTarget, '/career-roadmap');
  });
});
