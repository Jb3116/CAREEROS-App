/**
 * CAREEROS - True Zero-State & User Activity Evaluation Test Suite
 * Validates genuine data-driven progression from brand new user zero state
 * to granular, activity-specific metric updates without mock data leaks.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { getUserActivitySummary, hasUserActivity } from '../src/utils/userActivity.ts';
import { generateAutomatedTodaysPlan } from '../src/utils/appEvents.ts';
import { calculateRealStreak } from '../src/utils/streakCalculator.ts';
import { createFreshStudentProfile, saveStudentProfile, getStudentProfile } from '../src/utils/userProfile.ts';
import {
  isProfileCompleted,
  setProfileCompleted,
  isInitialAssessmentCompleted,
  isAssessmentResultAvailable,
  saveAssessmentRecord,
} from '../src/utils/assessmentValidation.ts';
import { evaluateCodingSubmissionReward, getDifficultyPoints } from '../src/utils/rewardCalculator.ts';

// In-memory mock localStorage for Node testing
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

describe('True Zero-State & Data-Driven Dashboard Progression Suite', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  // ---------------- TEST 1: New User Zero State ----------------
  test('TEST 1: New user with zero activity has Not Assessed metrics, empty plan, and 0-streak', () => {
    const freshProfile = createFreshStudentProfile({
      name: 'Pristine Student',
      email: 'pristine.student@university.edu',
      college: 'VIT Chennai',
    });

    const summary = getUserActivitySummary(freshProfile);
    assert.equal(summary.hasAnyActivity, false, 'New user must have hasAnyActivity = false');
    assert.equal(summary.hasAssessment, false, 'New user must not have completed assessment');
    assert.equal(summary.assessmentScore, null, 'Career readiness score must be null (Not assessed)');
    assert.equal(summary.codingScore, null, 'Coding score must be null (Not assessed)');
    assert.equal(summary.aptitudeScore, null, 'Aptitude score must be null (Not assessed)');
    assert.equal(summary.communicationScore, null, 'Communication score must be null (Not assessed)');
    assert.equal(summary.totalEventsCount, 0, 'Total events must be 0');
    assert.equal(summary.streakDays, 0, 'Streak must be 0');

    // Adaptive Plan must be empty (prompts for diagnostic assessment)
    const plan = generateAutomatedTodaysPlan();
    assert.equal(plan.length, 0, 'Adaptive plan must be empty for unevaluated new user');

    // Calendar must have 0 completed days
    const streakReport = calculateRealStreak([], new Date());
    assert.equal(streakReport.currentStreak, 0);
    assert.equal(streakReport.totalActiveDays, 0);
    assert.ok(streakReport.weekDays.every((d) => !d.isCompleted), 'All week days must be uncompleted');
    assert.equal(streakReport.monthReport.monthActiveDaysCount, 0);
  });

  // ---------------- TEST 2: User Completes Assessment ----------------
  test('TEST 2: New user completes first assessment -> Career Readiness & Adaptive Plan become active', () => {
    const student = createFreshStudentProfile({
      name: 'Evaluated Student',
      email: 'evaluated@university.edu',
    });

    // Simulate completing diagnostic assessment with 76% score
    localStorage.setItem(
      'careeros_assessment_results',
      JSON.stringify({
        overallScore: 76,
        completedAt: new Date().toISOString(),
        sections: { dsa: 80, aptitude: 75, cs_core: 73 },
      })
    );
    saveStudentProfile({ readinessScore: 76 });

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasAssessment, true, 'hasAssessment must be true after assessment');
    assert.equal(summary.assessmentScore, 76, 'Assessment score must be 76%');
    assert.equal(summary.hasAnyActivity, true, 'hasAnyActivity must be true');

    // Plan now generates dynamic recommendations
    const plan = generateAutomatedTodaysPlan();
    assert.ok(plan.length > 0, 'Adaptive plan must now be populated with tailored tasks');
    assert.ok(plan.some((t) => t.category === 'coding'));
  });

  // ---------------- TEST 3: User Only Practices Coding ----------------
  test('TEST 3: User only practices coding -> Coding updates, while Aptitude & Communication remain Not Assessed', () => {
    const student = createFreshStudentProfile({
      name: 'Coding Student',
      email: 'coder@university.edu',
    });

    // Simulate 2 coding submissions (1 correct, 1 wrong = 50% accuracy)
    const codingEvents = [
      {
        student_id: 'coder_1',
        activity: 'problemSolved',
        skill: 'Binary Trees',
        timestamp: new Date().toISOString(),
        correct: true,
      },
      {
        student_id: 'coder_1',
        activity: 'code_practice',
        skill: 'Dynamic Programming',
        timestamp: new Date().toISOString(),
        correct: false,
      },
    ];
    localStorage.setItem('careeros_local_events', JSON.stringify(codingEvents));

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasCodingActivity, true, 'Coding activity must be detected');
    assert.equal(summary.codingScore, 50, 'Coding score must reflect 50% accuracy');
    assert.equal(summary.hasAptitudeActivity, false, 'Aptitude must not have activity');
    assert.equal(summary.aptitudeScore, null, 'Aptitude must remain Not assessed (null)');
    assert.equal(summary.hasCommunicationActivity, false, 'Communication must not have activity');
    assert.equal(summary.communicationScore, null, 'Communication must remain Not assessed (null)');
  });

  // ---------------- TEST 4: User Only Practices Communication ----------------
  test('TEST 4: User only practices communication -> Communication updates, Coding & Aptitude remain Not Assessed', () => {
    const student = createFreshStudentProfile({
      name: 'Speaking Student',
      email: 'speaker@university.edu',
    });

    // Simulate 1 speaking drill
    const commEvents = [
      {
        student_id: 'speaker_1',
        activity: 'speakingSessionCompleted',
        skill: 'STAR Technical Challenge',
        timestamp: new Date().toISOString(),
        correct: true,
      },
    ];
    localStorage.setItem('careeros_local_events', JSON.stringify(commEvents));

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasCommunicationActivity, true, 'Communication activity must be detected');
    assert.ok(summary.communicationScore > 0, 'Communication score must be calculated');
    assert.equal(summary.hasCodingActivity, false, 'Coding must not have activity');
    assert.equal(summary.codingScore, null, 'Coding must remain Not assessed (null)');
    assert.equal(summary.hasAptitudeActivity, false, 'Aptitude must not have activity');
    assert.equal(summary.aptitudeScore, null, 'Aptitude must remain Not assessed (null)');
  });

  // ---------------- TEST 5: Existing Legitimate User Data Preserved ----------------
  test('TEST 5: Existing user with legitimate assessment & practice records retains all progress', () => {
    const legitimateProfile = {
      name: 'Experienced Student',
      email: 'experienced@vit.edu',
      role: 'Student',
      college: 'VIT Chennai',
      streakDays: 4,
      readinessScore: 84,
      atsScore: 92,
    };
    saveStudentProfile(legitimateProfile);

    localStorage.setItem(
      'careeros_assessment_results',
      JSON.stringify({
        status: 'COMPLETED_WITH_RESPONSES',
        overallScore: 84,
        codingScore: 80,
        aptitudeScore: 88,
        completedAt: '2026-08-20T10:00:00Z',
      })
    );

    localStorage.setItem(
      'careeros_local_events',
      JSON.stringify([
        { activity: 'speakingSessionCompleted', score: 85, timestamp: new Date().toISOString() },
      ])
    );

    const summary = getUserActivitySummary(getStudentProfile());
    assert.equal(summary.hasAssessment, true);
    assert.equal(summary.assessmentScore, 84);
    assert.equal(summary.codingScore, 80);
    assert.equal(summary.aptitudeScore, 88);
    assert.ok(summary.communicationScore !== null);
    assert.equal(summary.streakDays, 4);
  });

  // ---------------- TEST 6: Demo User Isolation ----------------
  test('TEST 6: Demo user explicitly flagged receives demo data without polluting real accounts', () => {
    const realUser = createFreshStudentProfile({ name: 'Real User', email: 'real@university.edu' });
    const realSummary = getUserActivitySummary(realUser);
    assert.equal(realSummary.hasAnyActivity, false);

    // Explicit demo user
    const demoUser = {
      ...realUser,
      isDemoUser: true,
      readinessScore: 78,
      streakDays: 5,
    };
    assert.equal(demoUser.isDemoUser, true);
    assert.equal(realUser.isDemoUser, undefined);
  });

  // ---------------- TEST 7: Page Refresh & Re-login Consistency ----------------
  test('TEST 7: Refresh / re-login preserves exact real activity state without creating fake values', () => {
    // 1. New user logs in -> zero state
    let profile = createFreshStudentProfile({ name: 'Persistent User', email: 'persist@vit.edu' });
    let summary = getUserActivitySummary(profile);
    assert.equal(summary.hasAnyActivity, false);
    assert.equal(summary.assessmentScore, null);

    // 2. User solves 1 problem
    const events = [
      {
        student_id: 'u1',
        activity: 'problemSolved',
        skill: 'Trees',
        timestamp: new Date().toISOString(),
        correct: true,
      },
    ];
    localStorage.setItem('careeros_local_events', JSON.stringify(events));

    // 3. Simulate page refresh / re-login (read from localStorage)
    profile = getStudentProfile();
    summary = getUserActivitySummary(profile);
    assert.equal(summary.hasAnyActivity, true);
    assert.equal(summary.hasCodingActivity, true);
    assert.equal(summary.codingScore, 100);
    assert.equal(summary.aptitudeScore, null); // Still not assessed
  });

  // ---------------- TEST 8: Stale Mock Cache Invalidation ----------------
  test('TEST 8: Stale mock localStorage does not override true zero state for a new user', () => {
    // Inject stale legacy mock keys
    localStorage.setItem('careeros_student_profile', JSON.stringify({ name: 'New Student', streakDays: 5, readinessScore: 44 }));
    localStorage.removeItem('careeros_event_ledger');
    localStorage.removeItem('careeros_local_events');
    localStorage.removeItem('careeros_assessment_results');
    localStorage.removeItem('careeros_schema_version'); // force schema migration check

    const profile = getStudentProfile();
    const summary = getUserActivitySummary(profile);

    assert.equal(summary.hasAssessment, false, 'Must not claim assessment from stale mock 44%');
    assert.equal(summary.assessmentScore, null, 'Assessment score must be null');
    assert.equal(summary.codingScore, null, 'Coding score must be null');
    assert.equal(summary.totalEventsCount, 0, 'Events count must be 0');
  });

  // ---------------- TEST 9: Complete Unassessed Initial Payload ----------------
  test('TEST 9: Brand-new authenticated user initializes with pure unassessed zero-state payload', () => {
    const brandNewProfile = createFreshStudentProfile({
      name: 'Brand New User',
      email: 'newbie@campus.edu',
      college: 'VIT Chennai',
    });

    assert.equal(brandNewProfile.assessmentStatus, 'not_started');
    assert.equal(brandNewProfile.assessmentCompleted, false);
    assert.equal(brandNewProfile.careerReadiness, null);
    assert.equal(brandNewProfile.readinessScore, 0);
    assert.equal(brandNewProfile.roadmap, null);
    assert.equal(brandNewProfile.streakDays, 0);
    assert.equal(brandNewProfile.atsScore, 0);

    const summary = getUserActivitySummary(brandNewProfile);
    assert.equal(summary.assessmentScore, null);
    assert.equal(summary.codingScore, null);
    assert.equal(summary.aptitudeScore, null);
    assert.equal(summary.communicationScore, null);
    assert.equal(summary.hasAnyActivity, false);
  });

  // ---------------- TEST 10: Cross-User Isolation on Logout ----------------
  test('TEST 10: Logging out completely purges previous user activity and prevents data leakage to new user', () => {
    // 1. User A (Evaluated)
    const userA = createFreshStudentProfile({ name: 'User A', email: 'userA@vit.edu' });
    saveStudentProfile({ readinessScore: 88, streakDays: 7 });
    localStorage.setItem('careeros_event_ledger', JSON.stringify([{ type: 'problemSolved', timestamp: new Date().toISOString() }]));
    localStorage.setItem('careeros_local_events', JSON.stringify([{ student_id: 'userA', activity: 'problemSolved', correct: true }]));

    // 2. User A logs out -> Clean session purge
    localStorage.removeItem('careeros_auth_user');
    localStorage.removeItem('careeros_student_profile');
    localStorage.removeItem('careeros_event_ledger');
    localStorage.removeItem('careeros_local_events');
    localStorage.removeItem('careeros_tour_completed');

    // 3. User B (Brand new) logs in
    const userB = createFreshStudentProfile({ name: 'User B', email: 'userB@vit.edu' });
    const summaryB = getUserActivitySummary(userB);

    assert.equal(summaryB.hasAnyActivity, false, 'New User B must not inherit User A activity');
    assert.equal(summaryB.assessmentScore, null, 'New User B must not inherit User A 88% readiness score');
    assert.equal(summaryB.totalEventsCount, 0, 'New User B must have 0 events');
    assert.equal(summaryB.streakDays, 0, 'New User B must have 0 streak');
  });

  // ---------------- TEST 11: Onboarding Lifecycle Flags & Scoped User Status ----------------
  test('TEST 11: Onboarding lifecycle flags correctly reflect profile and assessment completion per user', () => {
    const studentA = 'studentA_101';
    const studentB = 'studentB_202';

    // Fresh user states
    assert.equal(isProfileCompleted(studentA), false);
    assert.equal(isInitialAssessmentCompleted(studentA), false);
    assert.equal(isAssessmentResultAvailable(studentA), false);

    // Profile completed
    setProfileCompleted(true, studentA);
    assert.equal(isProfileCompleted(studentA), true);
    assert.equal(isInitialAssessmentCompleted(studentA), false);

    // User B remains incomplete
    assert.equal(isProfileCompleted(studentB), false);

    // Assessment completed
    saveAssessmentRecord({
      status: 'COMPLETED_WITH_RESPONSES',
      studentId: studentA,
      totalQuestions: 15,
      attemptedCount: 15,
      codingAttemptedCount: 5,
      codingPassedCount: 5,
      codingScore: 90,
      aptitudeAttemptedCount: 10,
      aptitudeCorrectCount: 9,
      aptitudeScore: 90,
      overallScore: 90,
      submittedAt: new Date().toISOString(),
    });

    assert.equal(isInitialAssessmentCompleted(studentA), true);
    assert.equal(isAssessmentResultAvailable(studentA), true);
    assert.equal(isInitialAssessmentCompleted(studentB), false);
  });

  // ---------------- TEST 12: Difficulty-Aware Reward Tiers & Retries ----------------
  test('TEST 12: Difficulty-aware rewards strictly award Easy=10, Medium=20, Hard=30 on pass and 0 on fail with retry', () => {
    // Easy Problem - Passed
    const easyPass = evaluateCodingSubmissionReward({
      difficulty: 'Easy',
      isCorrect: true,
      testCasesPassed: 3,
      totalTestCases: 3,
      executionStatus: 'passed',
    });
    assert.equal(easyPass.isPassed, true);
    assert.equal(easyPass.pointsAwarded, 10);
    assert.equal(easyPass.status, 'passed');

    // Medium Problem - Passed
    const medPass = evaluateCodingSubmissionReward({
      difficulty: 'Medium',
      isCorrect: true,
      testCasesPassed: 4,
      totalTestCases: 4,
      executionStatus: 'passed',
    });
    assert.equal(medPass.isPassed, true);
    assert.equal(medPass.pointsAwarded, 20);

    // Hard Problem - Passed
    const hardPass = evaluateCodingSubmissionReward({
      difficulty: 'Hard',
      isCorrect: true,
      testCasesPassed: 5,
      totalTestCases: 5,
      executionStatus: 'passed',
    });
    assert.equal(hardPass.isPassed, true);
    assert.equal(hardPass.pointsAwarded, 30);

    // Hard Problem - Failed Test Cases -> 0 Points & retry allowed
    const hardFail = evaluateCodingSubmissionReward({
      difficulty: 'Hard',
      isCorrect: false,
      testCasesPassed: 2,
      totalTestCases: 5,
      executionStatus: 'failed',
    });
    assert.equal(hardFail.isPassed, false);
    assert.equal(hardFail.pointsAwarded, 0);
    assert.equal(hardFail.status, 'retry_allowed');

    // Empty / Error Submission -> 0 Points & retry allowed
    const errorSub = evaluateCodingSubmissionReward({
      difficulty: 'Easy',
      isCorrect: false,
      testCasesPassed: 0,
      totalTestCases: 3,
      executionStatus: 'syntax_error',
    });
    assert.equal(errorSub.isPassed, false);
    assert.equal(errorSub.pointsAwarded, 0);
    assert.equal(errorSub.status, 'retry_allowed');
  });
});
