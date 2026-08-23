/**
 * CAREEROS - Profile Header & Demonstrated vs Self-Reported Skills Zero-State Test Suite
 * Tests true zero-state initialization, data-driven skill badge calculation,
 * assessment verification tracking, and auth user isolation for profile widgets.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFreshStudentProfile,
  getStudentProfile,
  saveStudentProfile,
} from '../src/utils/userProfile.ts';
import {
  getUserActivitySummary,
  hasUserActivity,
} from '../src/utils/userActivity.ts';
import {
  saveAssessmentRecord,
  getAssessmentRecord,
  clearAssessmentRecord,
} from '../src/utils/assessmentValidation.ts';
import {
  getStudentStreak,
  calculateRealStreak,
} from '../src/utils/streakCalculator.ts';
import {
  getStudentAtsScore,
  saveResumeVersions,
} from '../src/utils/resumeVersioning.ts';

// In-memory mock localStorage for Node test runner
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

describe('Profile Header & Skills Zero-State Suite', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // ---------------- TEST 1: New User Initial Zero-State ----------------
  test('TEST 1: Brand-new student initializes with 0 streak, unassessed readiness, and unassessed demonstrated skills', () => {
    const student = createFreshStudentProfile({
      name: 'Maya Lin',
      email: 'maya.lin@univ.edu',
      college: 'MIT College of Engineering',
      degree: 'B.Tech in Artificial Intelligence',
    });

    assert.equal(student.streakDays, 0);
    assert.equal(student.readinessScore, 0);
    assert.equal(student.atsScore, 0);
    assert.equal(student.assessmentStatus, 'not_started');
    assert.equal(student.assessmentCompleted, false);

    const summary = getUserActivitySummary(student);
    assert.equal(summary.hasAnyActivity, false);
    assert.equal(summary.hasAssessment, false);
    assert.equal(summary.assessmentScore, null);
    assert.equal(summary.hasCodingActivity, false);
    assert.equal(summary.codingScore, null);
    assert.equal(summary.hasAptitudeActivity, false);
    assert.equal(summary.aptitudeScore, null);
    assert.equal(summary.hasCommunicationActivity, false);
    assert.equal(summary.communicationScore, null);

    assert.equal(getStudentStreak(student.email), 0);
    assert.equal(getStudentAtsScore(student.email), 0);
  });

  // ---------------- TEST 2: Dynamic Skill Updates upon Assessment ----------------
  test('TEST 2: Completing diagnostic assessment dynamically populates Readiness, Coding, and Aptitude metrics', () => {
    const student = createFreshStudentProfile({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@univ.edu',
    });

    // Save authentic completed assessment record
    saveAssessmentRecord({
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: student.email,
      totalQuestions: 17,
      attemptedCount: 12,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 100,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 8,
      aptitudeScore: 80,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
      answers: { coding: { 'q-1': { code: 'def solve(): pass', lang: 'python' } }, aptitude: { 'a-1': 0 } },
    });

    const summary = getUserActivitySummary(student);
    assert.equal(summary.hasAssessment, true);
    assert.equal(summary.assessmentScore, 90);
    assert.equal(summary.hasCodingActivity, true);
    assert.equal(summary.codingScore, 100);
    assert.equal(summary.hasAptitudeActivity, true);
    assert.equal(summary.aptitudeScore, 80);

    const record = getAssessmentRecord(student.email);
    assert.equal(record.codingAttemptedCount, 2);
    assert.equal(record.aptitudeAttemptedCount, 10);
  });

  // ---------------- TEST 3: Communication & Speaking Activity Progression ----------------
  test('TEST 3: Communication drills dynamically update communication score and practice ledger', () => {
    const student = createFreshStudentProfile({
      name: 'Sara Khan',
      email: 'sara.khan@univ.edu',
    });

    // Simulate 2 completed speaking drill events in ledger
    const events = [
      {
        activity: 'speakingSessionCompleted',
        timestamp: new Date().toISOString(),
        student_id: student.email,
      },
      {
        activity: 'interviewCompleted',
        timestamp: new Date().toISOString(),
        student_id: student.email,
      },
    ];
    localStorage.setItem('careeros_local_events', JSON.stringify(events));

    const summary = getUserActivitySummary(student);
    assert.equal(summary.hasCommunicationActivity, true);
    assert.equal(summary.communicationScore, 40); // 2 drills * 20%
    assert.equal(summary.hasCodingActivity, false); // Coding remains unassessed
    assert.equal(summary.hasAptitudeActivity, false); // Aptitude remains unassessed
  });

  // ---------------- TEST 4: Multi-User Profile Isolation ----------------
  test('TEST 4: User A assessment results, CGPA, and streak do not leak to User B', () => {
    const userA = createFreshStudentProfile({
      name: 'User Alpha',
      email: 'alpha@univ.edu',
      college: 'Alpha Tech',
    });
    saveStudentProfile({ email: userA.email, cgpa: '9.4', streakDays: 7, readinessScore: 88 });
    saveAssessmentRecord({
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: userA.email,
      totalQuestions: 17,
      attemptedCount: 12,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 95,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 9,
      aptitudeScore: 90,
      overallScore: 92,
      submittedAt: new Date().toISOString(),
    });

    const userB = createFreshStudentProfile({
      name: 'User Beta',
      email: 'beta@univ.edu',
      college: 'Beta State',
    });

    // Verify User A summary has data
    const summaryA = getUserActivitySummary(userA);
    assert.equal(summaryA.hasAssessment, true);
    assert.equal(summaryA.assessmentScore, 92);
    assert.equal(summaryA.codingScore, 95);

    // Verify User B is completely zero-state and unpolluted
    const summaryB = getUserActivitySummary(userB);
    assert.equal(summaryB.hasAssessment, false);
    assert.equal(summaryB.assessmentScore, null);
    assert.equal(summaryB.hasCodingActivity, false);
    assert.equal(summaryB.codingScore, null);
    assert.equal(summaryB.hasAptitudeActivity, false);
    assert.equal(summaryB.aptitudeScore, null);
    assert.equal(getStudentStreak(userB.email), 0);
    assert.equal(getStudentAtsScore(userB.email), 0);
  });

  // ---------------- TEST 5: Profile Custom Preferences Persistence ----------------
  test('TEST 5: Custom profile edits persist correctly while maintaining zero-state readiness for new users', () => {
    const student = createFreshStudentProfile({
      name: 'Alexandre Dumas',
      email: 'alexandre@univ.edu',
    });

    const updated = saveStudentProfile({
      name: 'Alexandre Dumas',
      email: 'alexandre@univ.edu',
      cgpa: '9.1',
      targetRoles: ['Systems Engineer', 'Cloud Architect'],
      primaryLanguages: ['Go', 'Rust', 'Python'],
    });

    assert.equal(updated.cgpa, '9.1');
    assert.deepEqual(updated.targetRoles, ['Systems Engineer', 'Cloud Architect']);
    assert.deepEqual(updated.primaryLanguages, ['Go', 'Rust', 'Python']);
    assert.equal(updated.readinessScore, 0);
    assert.equal(updated.streakDays, 0);

    const summary = getUserActivitySummary(updated);
    assert.equal(summary.hasAssessment, false);
  });
});
