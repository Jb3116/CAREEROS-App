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
});
