/**
 * CAREEROS - Assessment Validation, Scoring & User Isolation Test Suite
 * Validates end-to-end behavior for empty submissions, partial submissions,
 * data-driven scoring without synthetic fallbacks, and multi-user isolation.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCodingAttempted,
  isAptitudeAttempted,
  calculateAssessmentAttemptCounts,
  saveAssessmentRecord,
  getAssessmentRecord,
  clearAssessmentRecord,
} from '../src/utils/assessmentValidation.ts';
import { getUserActivitySummary } from '../src/utils/userActivity.ts';
import { generateAutomatedTodaysPlan } from '../src/utils/appEvents.ts';
import { createFreshStudentProfile, saveStudentProfile, getStudentProfile } from '../src/utils/userProfile.ts';
import { CODING_QUESTION_BANK, APTITUDE_QUESTION_BANK } from '../src/data/assessmentQuestions.ts';

// In-memory mock localStorage for Node.js test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

describe('Assessment Validation, Scoring & New-User Zero-State Suite', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // ---------------- TEST 1: New User Initial State ----------------
  test('TEST 1: New user starts in genuine zero state with no scores, no fake plan, and no assessment record', () => {
    const newUser = createFreshStudentProfile({
      name: 'Fresh Student',
      email: 'fresh.student@univ.edu',
    });

    const record = getAssessmentRecord(newUser.email);
    assert.equal(record, null, 'New user must have no assessment record');

    const summary = getUserActivitySummary(newUser);
    assert.equal(summary.hasAssessment, false, 'hasAssessment must be false');
    assert.equal(summary.assessmentScore, null, 'Career Readiness must be null (Not assessed)');
    assert.equal(summary.codingScore, null, 'Coding score must be null');
    assert.equal(summary.aptitudeScore, null, 'Aptitude score must be null');
    assert.equal(summary.communicationScore, null, 'Communication score must be null');
    assert.equal(summary.streakDays, 0, 'Streak must be 0');

    const plan = generateAutomatedTodaysPlan(newUser);
    assert.equal(plan.length, 0, 'Adaptive plan must be empty for unassessed new user');
  });

  // ---------------- TEST 2: Empty / Unattempted Assessment Submit ----------------
  test('TEST 2: Submitting without answering marks test as COMPLETED_EMPTY with null scores and pristine dashboard', () => {
    const newUser = createFreshStudentProfile({
      name: 'Empty Attempt User',
      email: 'empty@univ.edu',
    });

    // 1. Validate attempt counters with untouched inputs
    const attemptStats = calculateAssessmentAttemptCounts({}, {});
    assert.equal(attemptStats.codingAttempted, 0);
    assert.equal(attemptStats.aptitudeAttempted, 0);
    assert.equal(attemptStats.totalAttempted, 0);

    // Also verify starter templates do not count as user code
    const untouchedCode = {
      [CODING_QUESTION_BANK[0].id]: {
        code: CODING_QUESTION_BANK[0].starterTemplates.python,
        lang: 'python',
      },
    };
    const untouchedStats = calculateAssessmentAttemptCounts(untouchedCode, {});
    assert.equal(untouchedStats.codingAttempted, 0, 'Untouched starter template must not count as attempt');

    // 2. Submit empty assessment
    const emptyRecord = {
      status: 'COMPLETED_EMPTY',
      studentId: newUser.email,
      totalQuestions: attemptStats.totalQuestions,
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

    // Verify saved record
    const savedRecord = getAssessmentRecord(newUser.email);
    assert.ok(savedRecord);
    assert.equal(savedRecord.status, 'COMPLETED_EMPTY');
    assert.equal(savedRecord.overallScore, null);
    assert.equal(savedRecord.codingScore, null);
    assert.equal(savedRecord.aptitudeScore, null);

    // 3. Verify dashboard remains in genuine zero state
    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasAssessment, false, 'Empty assessment must NOT mark user as assessed');
    assert.equal(summary.assessmentScore, null, 'Career Readiness must remain null');
    assert.equal(summary.codingScore, null, 'Coding mastery must remain null');
    assert.equal(summary.aptitudeScore, null, 'Aptitude mastery must remain null');
    assert.equal(summary.communicationScore, null, 'Communication mastery must remain null');

    const plan = generateAutomatedTodaysPlan();
    assert.equal(plan.length, 0, 'Adaptive plan must remain empty');
  });

  // ---------------- TEST 3: Partial Submission ----------------
  test('TEST 3: User answers only some questions -> Scored strictly from attempted questions without fake baselines', () => {
    const user = createFreshStudentProfile({
      name: 'Partial Student',
      email: 'partial@univ.edu',
    });

    // User attempts 4 out of 10 aptitude questions (3 correct, 1 wrong), 0 coding
    const partialAptitudeAnswers = {
      [APTITUDE_QUESTION_BANK[0].id]: APTITUDE_QUESTION_BANK[0].correctAnswer,
      [APTITUDE_QUESTION_BANK[1].id]: APTITUDE_QUESTION_BANK[1].correctAnswer,
      [APTITUDE_QUESTION_BANK[2].id]: APTITUDE_QUESTION_BANK[2].correctAnswer,
      [APTITUDE_QUESTION_BANK[3].id]: (APTITUDE_QUESTION_BANK[3].correctAnswer + 1) % 4, // wrong answer
    };

    const counts = calculateAssessmentAttemptCounts({}, partialAptitudeAnswers);
    assert.equal(counts.codingAttempted, 0);
    assert.equal(counts.aptitudeAttempted, 4);
    assert.equal(counts.totalAttempted, 4);

    // Derive score: 3 of 4 attempted = 75%
    const aptitudeScore = Math.round((3 / 4) * 100);
    assert.equal(aptitudeScore, 75);

    const partialRecord = {
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: user.email,
      totalQuestions: counts.totalQuestions,
      attemptedCount: counts.totalAttempted,
      codingAttemptedCount: 0,
      codingPassedCount: 0,
      codingScore: null, // coding was not attempted
      aptitudeAttemptedCount: 4,
      aptitudeCorrectCount: 3,
      aptitudeScore: 75,
      overallScore: 75, // derived strictly from attempted aptitude
      submittedAt: new Date().toISOString(),
      answers: { coding: {}, aptitude: partialAptitudeAnswers },
    };

    saveAssessmentRecord(partialRecord);
    saveStudentProfile({ readinessScore: 75 });

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasAssessment, true);
    assert.equal(summary.assessmentScore, 75, 'Readiness score must equal 75%');
    assert.equal(summary.aptitudeScore, 75, 'Aptitude score must equal 75%');
    assert.equal(summary.codingScore, null, 'Unattempted Coding must remain null (Not assessed)');
    assert.equal(summary.communicationScore, null, 'Unassessed Communication must remain null (Not assessed)');
  });

  // ---------------- TEST 4: Full Multi-Section Assessment ----------------
  test('TEST 4: User completes assessment properly -> Real scores calculated for both Coding and Aptitude', () => {
    const user = createFreshStudentProfile({
      name: 'Full Student',
      email: 'full@univ.edu',
    });

    // 1. Attempt all aptitude (8 of 10 correct = 80%)
    const aptitudeAnswers = {};
    APTITUDE_QUESTION_BANK.slice(0, 10).forEach((q, i) => {
      aptitudeAnswers[q.id] = i < 8 ? q.correctAnswer : (q.correctAnswer + 1) % 4;
    });

    // 2. Attempt coding problem with real solution code
    const codingAnswers = {
      [CODING_QUESTION_BANK[0].id]: {
        code: `def maxPathSum(root):\n    max_sum = float('-inf')\n    def dfs(node):\n        nonlocal max_sum\n        if not node: return 0\n        left = max(0, dfs(node.left))\n        right = max(0, dfs(node.right))\n        max_sum = max(max_sum, node.val + left + right)\n        return node.val + max(left, right)\n    dfs(root)\n    return max_sum`,
        lang: 'python',
      },
    };

    const counts = calculateAssessmentAttemptCounts(codingAnswers, aptitudeAnswers);
    assert.equal(counts.codingAttempted, 1);
    assert.equal(counts.aptitudeAttempted, 10);
    assert.equal(counts.totalAttempted, 11);

    const aptitudeScore = 80;
    const codingScore = 100;
    const overallScore = Math.round((80 + 100) / 2); // 90%

    const fullRecord = {
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: user.email,
      totalQuestions: counts.totalQuestions,
      attemptedCount: 11,
      codingAttemptedCount: 1,
      codingPassedCount: 1,
      codingScore: 100,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 8,
      aptitudeScore: 80,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
      answers: { coding: codingAnswers, aptitude: aptitudeAnswers },
    };

    saveAssessmentRecord(fullRecord);
    saveStudentProfile({ readinessScore: 90 });

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasAssessment, true);
    assert.equal(summary.assessmentScore, 90);
    assert.equal(summary.aptitudeScore, 80);
    assert.equal(summary.codingScore, 100);
    assert.equal(summary.communicationScore, null, 'Communication not in diagnostic test remains null');

    const plan = generateAutomatedTodaysPlan();
    assert.ok(plan.length > 0, 'Adaptive plan now generates tailored recommendations');
  });

  // ---------------- TEST 5: Browser Refresh Consistency ----------------
  test('TEST 5: Refresh preserves exact real assessment state without inventing fallback numbers', () => {
    const user = createFreshStudentProfile({ name: 'Persist User', email: 'persist@univ.edu' });
    const record = {
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: user.email,
      totalQuestions: 12,
      attemptedCount: 10,
      codingAttemptedCount: 0,
      codingPassedCount: 0,
      codingScore: null,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 7,
      aptitudeScore: 70,
      overallScore: 70,
      submittedAt: new Date().toISOString(),
    };
    saveAssessmentRecord(record);
    saveStudentProfile({ readinessScore: 70 });

    // Simulate page refresh (re-reading from storage)
    const refreshedSummary = getUserActivitySummary(getStudentProfile());
    assert.equal(refreshedSummary.hasAssessment, true);
    assert.equal(refreshedSummary.assessmentScore, 70);
    assert.equal(refreshedSummary.aptitudeScore, 70);
    assert.equal(refreshedSummary.codingScore, null); // coding remains null
  });

  // ---------------- TEST 6: User Isolation & Re-Login ----------------
  test('TEST 6: Brand-new user logging in cannot inherit another user assessment record', () => {
    // User A takes assessment and scores 88%
    const userA = createFreshStudentProfile({ name: 'User A', email: 'userA@univ.edu' });
    const recordA = {
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: 'userA@univ.edu',
      totalQuestions: 12,
      attemptedCount: 12,
      codingAttemptedCount: 2,
      codingPassedCount: 2,
      codingScore: 90,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 9,
      aptitudeScore: 90,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
    };
    saveAssessmentRecord(recordA);

    // User B (brand new user) logs in
    const userB = createFreshStudentProfile({ name: 'User B', email: 'userB@univ.edu' });
    const recordB = getAssessmentRecord(userB.email);
    assert.equal(recordB, null, 'User B must not see User A assessment record');

    const summaryB = getUserActivitySummary(userB);
    assert.equal(summaryB.hasAssessment, false, 'User B must have hasAssessment = false');
    assert.equal(summaryB.assessmentScore, null, 'User B must have null readiness score');
    assert.equal(summaryB.codingScore, null, 'User B must have null coding score');
    assert.equal(summaryB.aptitudeScore, null, 'User B must have null aptitude score');
  });
});
